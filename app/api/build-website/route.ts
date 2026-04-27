// app/api/build-website/route.ts
// NEW APPROACH: We write the HTML structure with guaranteed colors.
// Claude ONLY generates the text content (JSON).
// This guarantees colors always work — no more black/white screens.

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Anthropic from '@anthropic-ai/sdk';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

// ── In-memory store for guest rate limiting ───────────
// Resets when server restarts — good enough for guests
const guestBuilds = new Map<string, { count: number; time: number }>();

// ── Color palettes ─────────────────────────────────────
const PALETTES: Record<string, {
  bg: string; bg2: string; bg3: string; nav: string;
  text: string; text2: string; text3: string;
  accent: string; accent2: string; btn: string; btnText: string;
  border: string; card: string;
}> = {
  dark: {
    bg: '#0f1117', bg2: '#1a1a2e', bg3: '#0d0d1f', nav: '#080812',
    text: '#f1f5f9', text2: '#94a3b8', text3: '#64748b',
    accent: '#6366f1', accent2: '#22d3ee', btn: '#6366f1', btnText: '#ffffff',
    border: 'rgba(99,102,241,0.2)', card: '#1a1a2e',
  },
  light: {
    bg: '#f8fafc', bg2: '#ffffff', bg3: '#f1f5f9', nav: '#ffffff',
    text: '#0f172a', text2: '#475569', text3: '#94a3b8',
    accent: '#3b82f6', accent2: '#06b6d4', btn: '#3b82f6', btnText: '#ffffff',
    border: 'rgba(59,130,246,0.2)', card: '#ffffff',
  },
  luxury: {
    bg: '#0a0a0a', bg2: '#111111', bg3: '#0d0d0d', nav: '#080808',
    text: '#fef3c7', text2: '#d4a853', text3: '#92622a',
    accent: '#d97706', accent2: '#f59e0b', btn: '#d97706', btnText: '#0a0a0a',
    border: 'rgba(217,119,6,0.3)', card: '#111111',
  },
  bold: {
    bg: '#1a1a2e', bg2: '#16213e', bg3: '#0f3460', nav: '#12122e',
    text: '#f1f5f9', text2: '#94a3b8', text3: '#64748b',
    accent: '#e91e63', accent2: '#ff6b6b', btn: '#e91e63', btnText: '#ffffff',
    border: 'rgba(233,30,99,0.3)', card: '#16213e',
  },
  nature: {
    bg: '#f0fdf4', bg2: '#dcfce7', bg3: '#ffffff', nav: '#ffffff',
    text: '#14532d', text2: '#166534', text3: '#15803d',
    accent: '#16a34a', accent2: '#22c55e', btn: '#16a34a', btnText: '#ffffff',
    border: 'rgba(22,163,74,0.2)', card: '#ffffff',
  },
  arabic: {
    bg: '#0d0d0d', bg2: '#1a1000', bg3: '#111111', nav: '#0a0900',
    text: '#fef3c7', text2: '#d4a853', text3: '#92622a',
    accent: '#d97706', accent2: '#f59e0b', btn: '#d97706', btnText: '#0a0a0a',
    border: 'rgba(217,119,6,0.3)', card: '#1a1000',
  },
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id ?? null;
    const dbUser = userId ? await prisma.user.findUnique({
      where: { id: userId }, select: { plan: true },
    }) : null;
    const plan = dbUser?.plan ?? 'FREE';

    // ── Rate limiting ─────────────────────────────────────
    const ip = (req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();

    if (userId) {
      // Logged in user - check DB
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const buildsToday = await prisma.promptRun.count({
        where: { userId, category: 'website_build', createdAt: { gte: today } },
      });
      const limit = plan === 'FREE' ? 2 : 999;
      if (buildsToday >= limit) {
        return NextResponse.json({
          error: 'daily_limit',
          message: plan === 'FREE'
            ? 'You have used your 2 free builds today. Upgrade to Pro for unlimited builds!'
            : 'Daily limit reached. Please try again tomorrow.',
          showUpgrade: plan === 'FREE',
        }, { status: 429 });
      }
    } else {
      // Guest user - check in-memory store
      const now = Date.now();
      const key = 'ip_' + ip;
      const entry = guestBuilds.get(key);
      if (entry && now - entry.time < 86400000 && entry.count >= 1) {
        return NextResponse.json({
          error: 'daily_limit',
          message: 'Create a free account to get 2 builds per day. Takes 10 seconds!',
          showLogin: true,
        }, { status: 429 });
      }
      // Update guest count
      if (entry && now - entry.time < 86400000) {
        guestBuilds.set(key, { count: entry.count + 1, time: entry.time });
      } else {
        guestBuilds.set(key, { count: 1, time: now });
      }
    }

    const { websiteType, description, pages, style, features, language, brandName } = await req.json();
    if (!description || !websiteType) {
      return NextResponse.json({ error: 'Description and website type are required' }, { status: 400 });
    }

    const isArabic = language?.toLowerCase().includes('arabic');
    const isRTL = isArabic || language?.toLowerCase().includes('bilingual');
    const c = PALETTES[style] || PALETTES.dark;

    // ── STEP 1: Ask Claude for CONTENT ONLY (JSON) ───────
    const contentPrompt = `You are a copywriter. Generate website content for this business.

Business: ${brandName || 'My Business'}
Type: ${websiteType}
About: ${description}
Language: ${language || 'English'}
${isArabic ? 'Write ALL content in Arabic language only.' : ''}

Return ONLY a JSON object (no markdown, no explanation):
{
  "brand": "business name",
  "tagline": "short powerful tagline",
  "heroTitle": "main headline (powerful, 5-8 words)",
  "heroSubtitle": "subtitle (1-2 sentences about the business)",
  "heroCTA": "button text",
  "about": "2-3 sentences about the business",
  "services": [
    {"icon": "emoji", "title": "service name", "desc": "one sentence description"},
    {"icon": "emoji", "title": "service name", "desc": "one sentence description"},
    {"icon": "emoji", "title": "service name", "desc": "one sentence description"}
  ],
  "whyUs": [
    {"icon": "emoji", "title": "reason", "desc": "one sentence"},
    {"icon": "emoji", "title": "reason", "desc": "one sentence"},
    {"icon": "emoji", "title": "reason", "desc": "one sentence"}
  ],
  "testimonials": [
    {"name": "customer name", "role": "job title", "text": "testimonial text"},
    {"name": "customer name", "role": "job title", "text": "testimonial text"}
  ],
  "stats": [
    {"number": "500+", "label": "stat label"},
    {"number": "5", "label": "stat label"},
    {"number": "98%", "label": "stat label"}
  ],
  "phone": "+966 50 000 0000",
  "email": "info@business.com",
  "address": "City, Saudi Arabia",
  "hours": "Daily 8AM - 10PM",
  "whatsapp": "966500000000",
  "navLinks": ["Home", "About", "Services", "Contact"],
  "footerText": "footer description one sentence",
  "faq": [
    {"q": "question", "a": "answer"},
    {"q": "question", "a": "answer"},
    {"q": "question", "a": "answer"}
  ]
}`;

    const contentRes = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1500,
      messages: [{ role: 'user', content: contentPrompt }],
    });

    const contentRaw = contentRes.content[0].type === 'text' ? contentRes.content[0].text : '{}';

    // Parse JSON
    let content: any = {};
    try {
      const cleaned = contentRaw
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();
      content = JSON.parse(cleaned);
    } catch {
      // Use defaults if parsing fails
      content = {
        brand: brandName || 'My Business',
        tagline: 'Excellence in Every Detail',
        heroTitle: `Welcome to ${brandName || 'Our Business'}`,
        heroSubtitle: description,
        heroCTA: 'Get Started',
        about: description,
        services: [
          { icon: '⭐', title: 'Premium Quality', desc: 'We deliver the highest quality service to our clients.' },
          { icon: '⚡', title: 'Fast Delivery', desc: 'Quick turnaround without compromising on quality.' },
          { icon: '🤝', title: 'Expert Team', desc: 'Our experienced team is here to help you succeed.' },
        ],
        whyUs: [
          { icon: '✅', title: 'Trusted', desc: 'Trusted by hundreds of satisfied customers.' },
          { icon: '💎', title: 'Quality', desc: 'Premium quality guaranteed every time.' },
          { icon: '📞', title: '24/7 Support', desc: 'Always here when you need us.' },
        ],
        testimonials: [
          { name: 'Ahmed Al-Rashid', role: 'Business Owner', text: 'Excellent service and professional team. Highly recommended!' },
          { name: 'Fatima Abdullah', role: 'Manager', text: 'Outstanding quality and fast delivery. Very impressed!' },
        ],
        stats: [{ number: '500+', label: 'Happy Clients' }, { number: '5+', label: 'Years Experience' }, { number: '98%', label: 'Satisfaction Rate' }],
        phone: '+966 50 000 0000', email: 'info@business.com',
        address: 'Riyadh, Saudi Arabia', hours: 'Daily 8AM - 10PM',
        whatsapp: '966500000000',
        navLinks: ['Home', 'About', 'Services', 'Contact'],
        footerText: 'Providing exceptional service to our valued customers.',
        faq: [
          { q: 'How can I get started?', a: 'Contact us via WhatsApp or fill the form below.' },
          { q: 'What are your working hours?', a: 'We are available daily from 8AM to 10PM.' },
          { q: 'Do you offer delivery?', a: 'Yes, we offer fast and reliable delivery service.' },
        ],
      };
    }

    // ── STEP 2: Build luxury HTML with guaranteed colors ────
    const dir = isRTL ? 'rtl' : 'ltr';
    const textAlign = isRTL ? 'right' : 'left';
    const waNum = content.whatsapp || '966500000000';
    const emoji = websiteType === 'restaurant' ? '🍽️' : websiteType === 'gym' ? '💪' : websiteType === 'medical' ? '🏥' : websiteType === 'saas' ? '🚀' : websiteType === 'agency' ? '🎨' : websiteType === 'portfolio' ? '👤' : '✦';

    const html = `<!DOCTYPE html>
<html lang="${isArabic ? 'ar' : 'en'}" dir="${dir}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${content.brand || brandName}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
:root{
  --bg:${c.bg};--bg2:${c.bg2};--bg3:${c.bg3};--nav:${c.nav};
  --text:${c.text};--text2:${c.text2};--text3:${c.text3};
  --accent:${c.accent};--accent2:${c.accent2};--btn:${c.btn};--btnText:${c.btnText};
  --border:${c.border};--card:${c.card};
}
html,body{background:var(--bg);color:var(--text);font-family:Arial,Helvetica,sans-serif;scroll-behavior:smooth;overflow-x:hidden;}
/* SCROLLBAR */
::-webkit-scrollbar{width:6px;}
::-webkit-scrollbar-track{background:var(--bg);}
::-webkit-scrollbar-thumb{background:var(--accent);border-radius:3px;}
/* SCROLL PROGRESS */
#progress-bar{position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,var(--accent),var(--accent2));z-index:9999;transition:width 0.1s;width:0%;}
/* NAVBAR */
nav{position:fixed;top:0;left:0;right:0;z-index:1000;padding:0 5%;display:flex;align-items:center;justify-content:space-between;height:68px;background:${c.nav}dd;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid var(--border);transition:all 0.4s;}
nav.scrolled{height:58px;background:${c.nav}f5;box-shadow:0 4px 30px rgba(0,0,0,0.3);}
.logo{font-size:20px;font-weight:900;color:var(--accent);letter-spacing:-0.5px;display:flex;align-items:center;gap:8px;}
.logo span{background:var(--accent);color:var(--btnText);width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;}
.nav-links{display:flex;gap:32px;list-style:none;align-items:center;}
.nav-links a{color:var(--text2);font-size:14px;font-weight:500;transition:color 0.2s;position:relative;}
.nav-links a::after{content:'';position:absolute;bottom:-4px;left:0;width:0;height:2px;background:var(--accent);transition:width 0.3s;}
.nav-links a:hover{color:var(--accent);}
.nav-links a:hover::after{width:100%;}
.nav-cta{background:linear-gradient(135deg,var(--btn),var(--accent2)20);color:var(--btnText);padding:9px 22px;border-radius:25px;font-weight:700;font-size:13px;border:1px solid var(--accent);transition:all 0.3s;white-space:nowrap;}
.nav-cta:hover{transform:translateY(-2px);box-shadow:0 6px 20px var(--accent)40;}
.hamburger{display:none;flex-direction:column;gap:5px;cursor:pointer;background:none;border:none;padding:4px;}
.hamburger span{width:22px;height:2px;background:var(--text);display:block;transition:all 0.3s;border-radius:2px;}
.hamburger.open span:nth-child(1){transform:rotate(45deg) translate(5px,5px);}
.hamburger.open span:nth-child(2){opacity:0;}
.hamburger.open span:nth-child(3){transform:rotate(-45deg) translate(5px,-5px);}
.mobile-menu{display:none;position:fixed;top:68px;left:0;right:0;background:var(--nav)f8;backdrop-filter:blur(20px);z-index:999;padding:20px 5%;border-bottom:1px solid var(--border);transform:translateY(-10px);opacity:0;transition:all 0.3s;}
.mobile-menu.open{display:block;transform:translateY(0);opacity:1;}
.mobile-menu a{display:block;padding:12px 0;color:var(--text2);font-size:15px;border-bottom:1px solid var(--border);}
.mobile-menu a:last-child{border:none;color:var(--accent);font-weight:700;}
/* HERO */
.hero{min-height:100vh;display:flex;align-items:center;padding:100px 5% 60px;position:relative;overflow:hidden;background:var(--bg);}
.hero-bg{position:absolute;inset:0;background:radial-gradient(ellipse 80% 70% at 50% -20%,${c.accent}25 0%,transparent 60%);pointer-events:none;}
.hero-orb1{position:absolute;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,${c.accent}15,transparent 70%);top:-100px;right:-100px;animation:float1 8s ease-in-out infinite;}
.hero-orb2{position:absolute;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,${c.accent2}10,transparent 70%);bottom:-50px;left:-50px;animation:float2 10s ease-in-out infinite;}
.hero-content{max-width:720px;position:relative;z-index:1;}
.hero-badge{display:inline-flex;align-items:center;gap:8px;background:${c.accent}15;border:1px solid ${c.accent}40;color:var(--accent);font-size:12px;font-weight:700;padding:6px 16px;border-radius:25px;margin-bottom:24px;letter-spacing:1px;text-transform:uppercase;}
.hero-badge::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--accent);animation:pulse-dot 2s infinite;}
.hero h1{font-size:clamp(32px,5.5vw,64px);font-weight:900;line-height:1.08;letter-spacing:-2px;margin-bottom:20px;color:var(--text);}
.hero h1 .accent{background:linear-gradient(135deg,var(--accent),var(--accent2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.hero-sub{font-size:clamp(15px,2vw,18px);color:var(--text2);line-height:1.75;margin-bottom:36px;max-width:560px;}
.hero-btns{display:flex;gap:14px;flex-wrap:wrap;align-items:center;}
.btn-primary{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,var(--btn),var(--btn)dd);color:var(--btnText);padding:14px 32px;border-radius:50px;font-weight:700;font-size:15px;border:none;cursor:pointer;box-shadow:0 8px 30px ${c.accent}40;transition:all 0.3s;position:relative;overflow:hidden;}
.btn-primary::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,white10,transparent);opacity:0;transition:opacity 0.3s;}
.btn-primary:hover{transform:translateY(-3px);box-shadow:0 14px 40px ${c.accent}50;}
.btn-primary:hover::after{opacity:1;}
.btn-ghost{display:inline-flex;align-items:center;gap:8px;background:transparent;color:var(--text);padding:14px 28px;border-radius:50px;font-weight:600;font-size:15px;border:1px solid var(--border);cursor:pointer;transition:all 0.3s;}
.btn-ghost:hover{border-color:var(--accent);color:var(--accent);background:${c.accent}10;}
.hero-trust{display:flex;align-items:center;gap:16px;margin-top:36px;flex-wrap:wrap;}
.trust-avatars{display:flex;}
.trust-avatar{width:36px;height:36px;border-radius:50%;border:2px solid var(--bg);display:flex;align-items:center;justify-content:center;font-size:16px;margin-left:-10px;background:var(--card);}
.trust-avatar:first-child{margin-left:0;}
.trust-text{font-size:13px;color:var(--text3);}
.trust-text strong{color:var(--accent);}
/* STATS */
.stats{padding:60px 5%;background:var(--bg2);border-top:1px solid var(--border);border-bottom:1px solid var(--border);}
.stats-inner{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:24px;}
.stat-item{text-align:center;padding:24px 16px;background:var(--card);border-radius:16px;border:1px solid var(--border);transition:all 0.3s;}
.stat-item:hover{border-color:var(--accent);transform:translateY(-4px);}
.stat-num{font-size:40px;font-weight:900;background:linear-gradient(135deg,var(--accent),var(--accent2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:4px;}
.stat-lbl{font-size:13px;color:var(--text3);font-weight:500;}
/* SECTIONS GENERAL */
section{padding:100px 5%;}
.container{max-width:1100px;margin:0 auto;}
.section-tag{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:2px;margin-bottom:12px;}
.section-tag::before{content:'';width:20px;height:2px;background:var(--accent);}
.section-h{font-size:clamp(26px,4vw,44px);font-weight:900;color:var(--text);letter-spacing:-1px;line-height:1.15;margin-bottom:14px;}
.section-sub{font-size:16px;color:var(--text2);line-height:1.8;max-width:580px;margin-bottom:56px;}
/* SERVICES */
.services-bg{background:var(--bg);}
.services-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px;}
.service-card{background:var(--card);border:1px solid var(--border);border-radius:20px;padding:32px 28px;transition:all 0.4s;position:relative;overflow:hidden;cursor:pointer;}
.service-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,${c.accent}08,transparent);opacity:0;transition:opacity 0.4s;}
.service-card:hover{border-color:var(--accent);transform:translateY(-6px);box-shadow:0 20px 50px ${c.accent}20;}
.service-card:hover::before{opacity:1;}
.service-icon-wrap{width:56px;height:56px;border-radius:16px;background:${c.accent}15;display:flex;align-items:center;justify-content:center;font-size:26px;margin-bottom:18px;transition:all 0.3s;}
.service-card:hover .service-icon-wrap{background:var(--accent);transform:scale(1.1);}
.service-t{font-size:18px;font-weight:700;color:var(--text);margin-bottom:8px;}
.service-d{font-size:14px;color:var(--text2);line-height:1.75;}
.service-arrow{position:absolute;bottom:24px;right:24px;font-size:18px;color:var(--accent);opacity:0;transform:translateX(-8px);transition:all 0.3s;}
.service-card:hover .service-arrow{opacity:1;transform:translateX(0);}
/* ABOUT */
.about-bg{background:var(--bg2);}
.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:center;}
.about-visual-wrap{position:relative;}
.about-visual{background:linear-gradient(135deg,${c.accent}20,${c.accent2}15);border:1px solid var(--border);border-radius:28px;height:380px;display:flex;align-items:center;justify-content:center;font-size:90px;position:relative;overflow:hidden;}
.about-visual::after{content:'';position:absolute;bottom:-30px;right:-30px;width:120px;height:120px;border-radius:50%;background:${c.accent}20;border:1px solid ${c.accent}30;}
.about-badge{position:absolute;bottom:24px;left:24px;background:var(--nav)ee;backdrop-filter:blur(10px);border:1px solid var(--border);border-radius:14px;padding:12px 16px;display:flex;align-items:center;gap:10px;}
.about-badge-icon{font-size:22px;}
.about-badge-text{font-size:12px;color:var(--text2);}
.about-badge-num{font-size:16px;font-weight:900;color:var(--accent);}
.about-text .section-sub{margin-bottom:28px;}
.about-features{display:flex;flex-direction:column;gap:12px;margin-bottom:32px;}
.about-feature{display:flex;align-items:center;gap:10px;font-size:14px;color:var(--text2);}
.about-feature::before{content:'✓';width:22px;height:22px;border-radius:50%;background:${c.accent}20;color:var(--accent);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;}
/* WHY US */
.whyus-bg{background:var(--bg);}
.whyus-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;}
.whyus-card{padding:28px 24px;background:var(--card);border-radius:18px;border:1px solid var(--border);display:flex;gap:16px;align-items:flex-start;transition:all 0.3s;}
.whyus-card:hover{border-color:var(--accent);box-shadow:0 10px 30px ${c.accent}15;transform:translateY(-3px);}
.whyus-icon{font-size:30px;flex-shrink:0;width:52px;height:52px;background:${c.accent}12;border-radius:14px;display:flex;align-items:center;justify-content:center;}
.whyus-t{font-size:15px;font-weight:700;color:var(--text);margin-bottom:5px;}
.whyus-d{font-size:13px;color:var(--text2);line-height:1.7;}
/* TESTIMONIALS */
.testi-bg{background:var(--bg2);}
.testi-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px;}
.testi-card{background:var(--card);border:1px solid var(--border);border-radius:20px;padding:28px;position:relative;transition:all 0.3s;}
.testi-card::before{content:'"';position:absolute;top:16px;right:20px;font-size:60px;color:${c.accent}20;font-family:Georgia,serif;line-height:1;}
.testi-card:hover{border-color:var(--accent);transform:translateY(-4px);}
.testi-stars{color:#f59e0b;font-size:14px;margin-bottom:12px;letter-spacing:2px;}
.testi-text{font-size:14px;color:var(--text2);line-height:1.85;margin-bottom:20px;font-style:italic;}
.testi-author{display:flex;align-items:center;gap:12px;}
.testi-avatar{width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-size:16px;color:white;font-weight:700;flex-shrink:0;}
.testi-name{font-size:14px;font-weight:700;color:var(--text);}
.testi-role{font-size:12px;color:var(--text3);}
/* FAQ */
.faq-bg{background:var(--bg);}
.faq-wrap{max-width:720px;margin:0 auto;}
.faq-item{margin-bottom:10px;border-radius:14px;overflow:hidden;border:1px solid var(--border);transition:border-color 0.3s;}
.faq-item.active{border-color:var(--accent);}
.faq-q{padding:18px 22px;cursor:pointer;font-weight:600;font-size:14px;color:var(--text);display:flex;justify-content:space-between;align-items:center;background:var(--card);transition:all 0.3s;gap:16px;}
.faq-q:hover{color:var(--accent);}
.faq-icon{width:28px;height:28px;border-radius:50%;background:${c.accent}15;color:var(--accent);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:300;flex-shrink:0;transition:all 0.3s;}
.faq-item.active .faq-icon{background:var(--accent);color:white;transform:rotate(45deg);}
.faq-a{max-height:0;overflow:hidden;transition:max-height 0.4s ease,padding 0.3s;background:var(--bg2);font-size:14px;color:var(--text2);line-height:1.8;padding:0 22px;}
.faq-a.open{max-height:200px;padding:16px 22px;}
/* CONTACT */
.contact-bg{background:var(--bg2);}
.contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:56px;}
.contact-info{display:flex;flex-direction:column;gap:16px;}
.contact-card{display:flex;align-items:center;gap:14px;padding:16px 18px;background:var(--card);border-radius:14px;border:1px solid var(--border);transition:all 0.3s;}
.contact-card:hover{border-color:var(--accent);}
.contact-icon{width:44px;height:44px;border-radius:12px;background:${c.accent}15;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;}
.contact-label{font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin-bottom:2px;}
.contact-val{font-size:14px;font-weight:600;color:var(--text);}
.wa-btn{display:flex;align-items:center;justify-content:center;gap:10px;padding:15px;border-radius:14px;background:linear-gradient(135deg,#25d366,#128c7e);color:white;font-weight:700;font-size:15px;text-decoration:none;transition:all 0.3s;margin-top:4px;}
.wa-btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(37,211,102,0.4);}
/* FORM */
.form{display:flex;flex-direction:column;gap:14px;}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.form-input,.form-textarea{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:13px 16px;color:var(--text);font-size:14px;font-family:Arial,sans-serif;width:100%;outline:none;transition:all 0.3s;}
.form-input::placeholder,.form-textarea::placeholder{color:var(--text3);}
.form-input:focus,.form-textarea:focus{border-color:var(--accent);background:${c.accent}08;box-shadow:0 0 0 3px ${c.accent}15;}
.form-textarea{resize:vertical;min-height:110px;line-height:1.6;}
.form-err{font-size:11px;color:#f87171;margin-top:-8px;display:none;}
.form-err.show{display:block;}
.form-success{background:rgba(74,222,128,0.1);border:1px solid rgba(74,222,128,0.3);border-radius:12px;padding:16px;color:#4ade80;font-weight:600;display:none;text-align:center;margin-bottom:10px;}
.form-success.show{display:block;}
.submit-btn{background:linear-gradient(135deg,var(--btn),var(--btn)cc);color:var(--btnText);padding:14px;border-radius:12px;font-weight:700;font-size:15px;border:none;cursor:pointer;transition:all 0.3s;display:flex;align-items:center;justify-content:center;gap:8px;}
.submit-btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px ${c.accent}40;}
/* WHATSAPP FLOAT */
.wa-float{position:fixed;bottom:28px;${isRTL ? 'left' : 'right'}:28px;width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,#25d366,#128c7e);color:white;font-size:28px;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 24px rgba(37,211,102,0.5);z-index:9999;text-decoration:none;transition:all 0.3s;animation:wa-pulse 3s infinite;}
.wa-float:hover{transform:scale(1.12);box-shadow:0 10px 32px rgba(37,211,102,0.7);}
.wa-tooltip{position:absolute;${isRTL ? 'left' : 'right'}:70px;background:var(--nav);color:var(--text);font-size:12px;font-weight:600;white-space:nowrap;padding:6px 12px;border-radius:8px;border:1px solid var(--border);opacity:0;pointer-events:none;transition:opacity 0.3s;}
.wa-float:hover .wa-tooltip{opacity:1;}
/* BACK TO TOP */
.back-top{position:fixed;bottom:100px;${isRTL ? 'left' : 'right'}:28px;width:42px;height:42px;border-radius:50%;background:var(--card);border:1px solid var(--border);color:var(--text);font-size:16px;cursor:pointer;display:none;align-items:center;justify-content:center;transition:all 0.3s;z-index:998;}
.back-top.show{display:flex;}
.back-top:hover{background:var(--accent);color:white;border-color:var(--accent);}
/* FOOTER */
footer{background:var(--nav);padding:56px 5% 28px;border-top:1px solid var(--border);}
.footer-inner{max-width:1100px;margin:0 auto;}
.footer-top{display:flex;justify-content:space-between;align-items:flex-start;gap:40px;flex-wrap:wrap;margin-bottom:40px;padding-bottom:40px;border-bottom:1px solid var(--border);}
.footer-brand .logo{margin-bottom:12px;}
.footer-brand p{font-size:13px;color:var(--text3);max-width:260px;line-height:1.7;}
.footer-links h4{font-size:13px;font-weight:700;color:var(--text);margin-bottom:14px;text-transform:uppercase;letter-spacing:1px;}
.footer-links ul{list-style:none;}
.footer-links ul li{margin-bottom:8px;}
.footer-links ul li a{font-size:13px;color:var(--text3);transition:color 0.2s;}
.footer-links ul li a:hover{color:var(--accent);}
.footer-copy{text-align:center;font-size:12px;color:var(--text3);}
/* FADE IN */
.reveal{opacity:0;transform:translateY(32px);transition:opacity 0.7s ease,transform 0.7s ease;}
.reveal.visible{opacity:1;transform:none;}
.reveal-left{opacity:0;transform:translateX(-32px);transition:opacity 0.7s ease,transform 0.7s ease;}
.reveal-left.visible{opacity:1;transform:none;}
.reveal-right{opacity:0;transform:translateX(32px);transition:opacity 0.7s ease,transform 0.7s ease;}
.reveal-right.visible{opacity:1;transform:none;}
/* ANIMATIONS */
@keyframes float1{0%,100%{transform:translate(0,0) rotate(0deg)}50%{transform:translate(20px,-20px) rotate(5deg)}}
@keyframes float2{0%,100%{transform:translate(0,0)}50%{transform:translate(-15px,15px)}}
@keyframes pulse-dot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(0.8)}}
@keyframes wa-pulse{0%,100%{box-shadow:0 6px 24px rgba(37,211,102,0.5)}50%{box-shadow:0 6px 40px rgba(37,211,102,0.8)}}
@keyframes count-up{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
/* RESPONSIVE */
@media(max-width:900px){
  .about-grid,.contact-grid{grid-template-columns:1fr;}
  .form-row{grid-template-columns:1fr;}
  .hero h1{letter-spacing:-1px;}
  .footer-top{flex-direction:column;}
}
@media(max-width:768px){
  .nav-links,.nav-cta{display:none;}
  .hamburger{display:flex;}
  section{padding:70px 5%;}
  .hero{padding:90px 5% 50px;}
}
</style>
</head>
<body>

<div id="progress-bar"></div>

<!-- WhatsApp Float -->
<a href="https://wa.me/${waNum}" class="wa-float" target="_blank">
  💬
  <span class="wa-tooltip">Chat on WhatsApp</span>
</a>
<button class="back-top" id="backTop">↑</button>

<!-- NAVBAR -->
<nav id="navbar">
  <div class="logo">
    <span>${emoji}</span>
    ${content.brand || brandName}
  </div>
  <ul class="nav-links">
    ${(content.navLinks || ['Home','About','Services','Contact']).map((l: string) =>
      `<li><a href="#${l.toLowerCase().replace(/\s+/g,'-')}">${l}</a></li>`
    ).join('')}
  </ul>
  <a href="https://wa.me/${waNum}" class="nav-cta" target="_blank">💬 WhatsApp</a>
  <button class="hamburger" id="hamburger" onclick="toggleMenu()" aria-label="Menu">
    <span></span><span></span><span></span>
  </button>
</nav>
<div class="mobile-menu" id="mobileMenu">
  ${(content.navLinks || ['Home','About','Services','Contact']).map((l: string) =>
    `<a href="#${l.toLowerCase().replace(/\s+/g,'-')}" onclick="closeMenu()">${l}</a>`
  ).join('')}
  <a href="https://wa.me/${waNum}" target="_blank" onclick="closeMenu()">💬 WhatsApp</a>
</div>

<!-- HERO -->
<section class="hero" id="home">
  <div class="hero-bg"></div>
  <div class="hero-orb1"></div>
  <div class="hero-orb2"></div>
  <div class="hero-content">
    <div class="hero-badge">
      <span></span>
      ${content.tagline || 'Premium ' + websiteType}
    </div>
    <h1>
      ${(content.heroTitle || 'Welcome to ' + brandName).replace(
        /^(\S+)/,
        '<span class="accent">$1</span>'
      )}
    </h1>
    <p class="hero-sub">${content.heroSubtitle || description}</p>
    <div class="hero-btns">
      <button class="btn-primary" onclick="scrollTo('#contact')">
        ${content.heroCTA || 'Get Started'} →
      </button>
      <a href="https://wa.me/${waNum}" class="btn-ghost" target="_blank">
        💬 WhatsApp Us
      </a>
    </div>
    <div class="hero-trust">
      <div class="trust-avatars">
        <div class="trust-avatar">😊</div>
        <div class="trust-avatar">👤</div>
        <div class="trust-avatar">🙂</div>
      </div>
      <div class="trust-text">Trusted by <strong>${content.stats?.[0]?.number || '500+'}</strong> happy clients</div>
    </div>
  </div>
</section>

<!-- STATS -->
<div class="stats">
  <div class="stats-inner">
    ${(content.stats || []).map((s: any) => `
      <div class="stat-item reveal">
        <div class="stat-num">${s.number}</div>
        <div class="stat-lbl">${s.label}</div>
      </div>
    `).join('')}
  </div>
</div>

<!-- SERVICES -->
<section class="services-bg" id="services">
  <div class="container">
    <div class="section-tag">Our Services</div>
    <h2 class="section-h">What We Do Best</h2>
    <p class="section-sub">${content.heroSubtitle || description}</p>
    <div class="services-grid">
      ${(content.services || []).map((s: any) => `
        <div class="service-card reveal">
          <div class="service-icon-wrap">${s.icon}</div>
          <div class="service-t">${s.title}</div>
          <div class="service-d">${s.desc}</div>
          <div class="service-arrow">→</div>
        </div>
      `).join('')}
    </div>
  </div>
</section>

<!-- ABOUT -->
<section class="about-bg" id="about">
  <div class="container">
    <div class="about-grid">
      <div class="about-visual-wrap reveal-left">
        <div class="about-visual">${emoji}</div>
        <div class="about-badge">
          <div class="about-badge-icon">⭐</div>
          <div>
            <div class="about-badge-num">${content.stats?.[2]?.number || '98%'}</div>
            <div class="about-badge-text">${content.stats?.[2]?.label || 'Satisfaction Rate'}</div>
          </div>
        </div>
      </div>
      <div class="reveal-right">
        <div class="section-tag">About Us</div>
        <h2 class="section-h">Who We Are</h2>
        <p class="section-sub">${content.about || description}</p>
        <div class="about-features">
          ${(content.whyUs || []).slice(0,3).map((w: any) => `
            <div class="about-feature">${w.title}</div>
          `).join('')}
        </div>
        <button class="btn-primary" onclick="scrollTo('#contact')">${content.heroCTA || 'Contact Us'} →</button>
      </div>
    </div>
  </div>
</section>

<!-- WHY US -->
<section class="whyus-bg">
  <div class="container">
    <div class="section-tag">Why Choose Us</div>
    <h2 class="section-h">Our Advantages</h2>
    <div class="whyus-grid">
      ${(content.whyUs || []).map((w: any) => `
        <div class="whyus-card reveal">
          <div class="whyus-icon">${w.icon}</div>
          <div>
            <div class="whyus-t">${w.title}</div>
            <div class="whyus-d">${w.desc}</div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
</section>

<!-- TESTIMONIALS -->
<section class="testi-bg">
  <div class="container">
    <div class="section-tag">Testimonials</div>
    <h2 class="section-h">What Clients Say</h2>
    <div class="testi-grid">
      ${(content.testimonials || []).map((t: any) => `
        <div class="testi-card reveal">
          <div class="testi-stars">★★★★★</div>
          <div class="testi-text">"${t.text}"</div>
          <div class="testi-author">
            <div class="testi-avatar">${t.name?.[0] || 'A'}</div>
            <div>
              <div class="testi-name">${t.name}</div>
              <div class="testi-role">${t.role}</div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="faq-bg">
  <div class="container">
    <div class="section-tag">FAQ</div>
    <h2 class="section-h">Common Questions</h2>
    <div class="faq-wrap">
      ${(content.faq || []).map((f: any, i: number) => `
        <div class="faq-item" id="faq-${i}">
          <div class="faq-q" onclick="toggleFaq(${i})">
            <span>${f.q}</span>
            <span class="faq-icon">+</span>
          </div>
          <div class="faq-a" id="faq-a-${i}">${f.a}</div>
        </div>
      `).join('')}
    </div>
  </div>
</section>

<!-- CONTACT -->
<section class="contact-bg" id="contact">
  <div class="container">
    <div class="section-tag">Contact Us</div>
    <h2 class="section-h">Get In Touch</h2>
    <div class="contact-grid">
      <div class="contact-info reveal-left">
        <div class="contact-card">
          <div class="contact-icon">📞</div>
          <div><div class="contact-label">Phone</div><div class="contact-val">${content.phone || '+966 50 000 0000'}</div></div>
        </div>
        <div class="contact-card">
          <div class="contact-icon">📧</div>
          <div><div class="contact-label">Email</div><div class="contact-val">${content.email || 'info@business.com'}</div></div>
        </div>
        <div class="contact-card">
          <div class="contact-icon">📍</div>
          <div><div class="contact-label">Address</div><div class="contact-val">${content.address || 'Saudi Arabia'}</div></div>
        </div>
        <div class="contact-card">
          <div class="contact-icon">🕐</div>
          <div><div class="contact-label">Working Hours</div><div class="contact-val">${content.hours || 'Daily 8AM - 10PM'}</div></div>
        </div>
        <a href="https://wa.me/${waNum}" class="wa-btn" target="_blank">
          💬 Message on WhatsApp
        </a>
      </div>
      <div class="reveal-right">
        <div class="form-success" id="formSuccess">✅ Message sent successfully! We'll contact you soon.</div>
        <form class="form" onsubmit="handleForm(event)">
          <div class="form-row">
            <div>
              <input class="form-input" id="fname" placeholder="Your Name" />
              <div class="form-err" id="fname-err">Please enter your name</div>
            </div>
            <div>
              <input class="form-input" id="fphone" placeholder="Phone Number" type="tel" />
            </div>
          </div>
          <input class="form-input" id="femail" placeholder="Email Address" type="email" />
          <div class="form-err" id="femail-err">Please enter a valid email</div>
          <textarea class="form-textarea" id="fmsg" placeholder="How can we help you?"></textarea>
          <div class="form-err" id="fmsg-err">Please enter your message</div>
          <button type="submit" class="submit-btn">Send Message →</button>
        </form>
      </div>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer>
  <div class="footer-inner">
    <div class="footer-top">
      <div class="footer-brand">
        <div class="logo"><span>${emoji}</span>${content.brand || brandName}</div>
        <p>${content.footerText || description}</p>
      </div>
      <div class="footer-links">
        <h4>Quick Links</h4>
        <ul>
          ${(content.navLinks || ['Home','About','Services','Contact']).map((l: string) =>
            `<li><a href="#${l.toLowerCase().replace(/\s+/g,'-')}">${l}</a></li>`
          ).join('')}
        </ul>
      </div>
      <div class="footer-links">
        <h4>Contact</h4>
        <ul>
          <li><a href="tel:${content.phone || ''}">${content.phone || '+966 50 000 0000'}</a></li>
          <li><a href="mailto:${content.email || ''}">${content.email || 'info@business.com'}</a></li>
          <li><a href="#">${content.address || 'Saudi Arabia'}</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-copy">© ${new Date().getFullYear()} ${content.brand || brandName}. All rights reserved. Built with PromptiFill AI ✦</div>
  </div>
</footer>

<script>
// Scroll progress
window.addEventListener('scroll',()=>{
  const h=document.documentElement;
  const pct=(window.scrollY/(h.scrollHeight-h.clientHeight))*100;
  document.getElementById('progress-bar').style.width=pct+'%';
  // Navbar
  document.getElementById('navbar').classList.toggle('scrolled',window.scrollY>60);
  // Back to top
  document.getElementById('backTop').classList.toggle('show',window.scrollY>400);
});
// Back to top
document.getElementById('backTop').addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
// Mobile menu
function toggleMenu(){
  const m=document.getElementById('mobileMenu');
  const h=document.getElementById('hamburger');
  m.classList.toggle('open');
  h.classList.toggle('open');
}
function closeMenu(){
  document.getElementById('mobileMenu').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}
// Smooth scroll
function scrollTo(target){
  const el=document.querySelector(target);
  if(el)el.scrollIntoView({behavior:'smooth'});
}
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    e.preventDefault();
    const t=document.querySelector(a.getAttribute('href'));
    if(t)t.scrollIntoView({behavior:'smooth'});
  });
});
// Reveal animations
const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}
  });
},{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el=>observer.observe(el));
// FAQ
function toggleFaq(i){
  const item=document.getElementById('faq-'+i);
  const ans=document.getElementById('faq-a-'+i);
  const icon=item.querySelector('.faq-icon');
  const isOpen=ans.classList.contains('open');
  document.querySelectorAll('.faq-a').forEach(a=>{a.classList.remove('open');});
  document.querySelectorAll('.faq-item').forEach(it=>{it.classList.remove('active');});
  document.querySelectorAll('.faq-icon').forEach(ic=>{ic.textContent='+';});
  if(!isOpen){
    ans.classList.add('open');
    item.classList.add('active');
    icon.textContent='+';
  }
}
// Form
function handleForm(e){
  e.preventDefault();
  let valid=true;
  const name=document.getElementById('fname').value.trim();
  const email=document.getElementById('femail').value.trim();
  const msg=document.getElementById('fmsg').value.trim();
  const showErr=(id,show)=>{document.getElementById(id).classList.toggle('show',show);};
  showErr('fname-err',!name);
  showErr('femail-err',!email||!email.includes('@'));
  showErr('fmsg-err',!msg);
  if(!name||!email||!email.includes('@')||!msg)return;
  const btn=e.target.querySelector('.submit-btn');
  btn.textContent='Sending...';btn.disabled=true;
  setTimeout(()=>{
    document.getElementById('formSuccess').classList.add('show');
    e.target.reset();
    btn.textContent='Send Message →';btn.disabled=false;
    setTimeout(()=>document.getElementById('formSuccess').classList.remove('show'),5000);
  },1000);
}
// Stagger animations
document.querySelectorAll('.services-grid .service-card,.testi-grid .testi-card').forEach((el,i)=>{
  el.style.transitionDelay=(i*0.08)+'s';
});
</script>
</body>
</html>`;

    // ── Save to DB (only for logged in users) ───────────
    if (userId) {
      await prisma.promptRun.create({
        data: {
          userId,
          prompt: `Website: ${brandName} - ${websiteType}`,
          result: html.substring(0, 500),
          category: 'website_build',
          tokensUsed: contentRes.usage.input_tokens + contentRes.usage.output_tokens,
          executionTime: 0,
          plan,
        },
      });
    }

    return NextResponse.json({
      success: true,
      html,
      tokensUsed: contentRes.usage.input_tokens + contentRes.usage.output_tokens,
      lineCount: html.split('\n').length,
      websiteType,
      brandName,
    });

  } catch (error: any) {
    console.error('Build error:', error?.message || error);

    // Prisma foreign key error
    if (error?.code === 'P2003' || error?.code === 'P2002') {
      return NextResponse.json({ error: 'Database error. Please sign in and try again.' }, { status: 500 });
    }
    // AI overloaded
    if (error?.status === 529) {
      return NextResponse.json({ error: 'AI is busy right now. Please wait 30 seconds and try again.' }, { status: 503 });
    }
    // Timeout
    if (error?.code === 'ECONNRESET' || error?.message?.includes('timeout')) {
      return NextResponse.json({ error: 'Request timed out. Try a shorter description.' }, { status: 504 });
    }
    return NextResponse.json({ error: 'Build failed. Please try again in a moment.' }, { status: 500 });
  }
}

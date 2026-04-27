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

    // Rate limiting
    if (userId && plan === 'FREE') {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const buildsToday = await prisma.promptRun.count({
        where: { userId, category: 'website_build', createdAt: { gte: today } },
      });
      if (buildsToday >= 2) {
        return NextResponse.json({
          error: 'daily_limit',
          message: 'Free plan includes 2 website builds per day. Upgrade to Pro for unlimited.',
        }, { status: 429 });
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

    // ── STEP 2: Build the HTML ourselves with guaranteed colors ──
    const dir = isRTL ? 'rtl' : 'ltr';
    const textAlign = isRTL ? 'right' : 'left';

    const html = `<!DOCTYPE html>
<html lang="${isArabic ? 'ar' : 'en'}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.brand || brandName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    :root {
      --bg: ${c.bg};
      --bg2: ${c.bg2};
      --bg3: ${c.bg3};
      --nav: ${c.nav};
      --text: ${c.text};
      --text2: ${c.text2};
      --text3: ${c.text3};
      --accent: ${c.accent};
      --accent2: ${c.accent2};
      --btn: ${c.btn};
      --btnText: ${c.btnText};
      --border: ${c.border};
      --card: ${c.card};
    }
    html, body {
      background-color: var(--bg);
      color: var(--text);
      font-family: Arial, Helvetica, sans-serif;
      min-height: 100vh;
      text-align: ${textAlign};
    }
    a { color: var(--accent); text-decoration: none; }
    /* NAVBAR */
    nav {
      background-color: var(--nav);
      padding: 16px 24px;
      position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
      display: flex; align-items: center; justify-content: space-between;
      border-bottom: 1px solid var(--border);
      box-shadow: 0 2px 20px rgba(0,0,0,0.3);
      transition: all 0.3s;
    }
    .nav-logo { font-size: 20px; font-weight: 900; color: var(--accent); }
    .nav-links { display: flex; gap: 28px; list-style: none; }
    .nav-links a { color: var(--text2); font-size: 14px; font-weight: 500; transition: color 0.2s; }
    .nav-links a:hover { color: var(--accent); }
    .nav-btn { background: var(--btn); color: var(--btnText); padding: 8px 20px; border-radius: 8px; font-weight: 700; font-size: 14px; }
    .hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; background: none; border: none; }
    .hamburger span { width: 24px; height: 2px; background: var(--text); display: block; transition: all 0.3s; }
    .mobile-menu { display: none; background: var(--nav); padding: 16px 24px; position: fixed; top: 62px; left: 0; right: 0; z-index: 999; border-bottom: 1px solid var(--border); }
    .mobile-menu a { display: block; padding: 10px 0; color: var(--text2); font-size: 15px; border-bottom: 1px solid var(--border); }
    .mobile-menu.open { display: block; }
    /* HERO */
    .hero {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      text-align: center; padding: 120px 24px 60px;
      background: linear-gradient(135deg, var(--bg) 0%, var(--bg2) 50%, var(--bg) 100%);
      position: relative; overflow: hidden;
    }
    .hero::before {
      content: ''; position: absolute; inset: 0;
      background: radial-gradient(ellipse 80% 60% at 50% 50%, ${c.accent}20 0%, transparent 70%);
    }
    .hero-content { position: relative; max-width: 700px; }
    .hero-badge {
      display: inline-block; background: ${c.accent}20; border: 1px solid ${c.accent}40;
      color: var(--accent); font-size: 12px; font-weight: 700; padding: 5px 16px;
      border-radius: 20px; margin-bottom: 20px; letter-spacing: 1px; text-transform: uppercase;
    }
    .hero h1 { font-size: clamp(28px, 5vw, 56px); font-weight: 900; color: var(--text); line-height: 1.1; margin-bottom: 18px; letter-spacing: -1px; }
    .hero h1 span { color: var(--accent); }
    .hero p { font-size: 18px; color: var(--text2); margin-bottom: 32px; line-height: 1.7; }
    .hero-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
    .btn-primary { background: var(--btn); color: var(--btnText); padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 16px; border: none; cursor: pointer; box-shadow: 0 4px 20px ${c.accent}40; transition: all 0.3s; }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px ${c.accent}50; }
    .btn-secondary { background: transparent; color: var(--text); padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 16px; border: 1px solid var(--border); cursor: pointer; transition: all 0.3s; }
    /* SECTIONS */
    section { padding: 80px 24px; }
    .container { max-width: 1100px; margin: 0 auto; }
    .section-label { font-size: 12px; font-weight: 700; color: var(--accent); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px; }
    .section-title { font-size: clamp(24px, 4vw, 40px); font-weight: 800; color: var(--text); margin-bottom: 14px; letter-spacing: -0.5px; }
    .section-sub { font-size: 16px; color: var(--text2); max-width: 600px; line-height: 1.7; margin-bottom: 48px; }
    /* STATS */
    .stats-section { background-color: var(--bg2); }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 24px; }
    .stat-card { text-align: center; padding: 32px 16px; background: var(--card); border-radius: 16px; border: 1px solid var(--border); }
    .stat-number { font-size: 42px; font-weight: 900; color: var(--accent); margin-bottom: 6px; }
    .stat-label { font-size: 14px; color: var(--text2); }
    /* SERVICES */
    .services-section { background-color: var(--bg); }
    .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
    .service-card {
      background: var(--card); border: 1px solid var(--border); border-radius: 16px;
      padding: 28px 24px; transition: all 0.3s;
    }
    .service-card:hover { border-color: var(--accent); transform: translateY(-4px); box-shadow: 0 12px 40px ${c.accent}20; }
    .service-icon { font-size: 36px; margin-bottom: 14px; }
    .service-title { font-size: 18px; font-weight: 700; color: var(--text); margin-bottom: 8px; }
    .service-desc { font-size: 14px; color: var(--text2); line-height: 1.7; }
    /* ABOUT */
    .about-section { background-color: var(--bg2); }
    .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
    .about-visual {
      background: linear-gradient(135deg, var(--accent)20, var(--accent2)20);
      border: 1px solid var(--border); border-radius: 20px;
      height: 320px; display: flex; align-items: center; justify-content: center;
      font-size: 80px;
    }
    .about-text p { font-size: 15px; color: var(--text2); line-height: 1.85; margin-bottom: 20px; }
    /* WHY US */
    .whyus-section { background-color: var(--bg); }
    .whyus-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; }
    .whyus-card { padding: 24px; background: var(--card); border-radius: 14px; border: 1px solid var(--border); display: flex; gap: 14px; align-items: flex-start; }
    .whyus-icon { font-size: 28px; flex-shrink: 0; }
    .whyus-title { font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
    .whyus-desc { font-size: 13px; color: var(--text2); line-height: 1.6; }
    /* TESTIMONIALS */
    .testimonials-section { background-color: var(--bg2); }
    .testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
    .testimonial-card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 24px; }
    .testimonial-text { font-size: 14px; color: var(--text2); line-height: 1.8; margin-bottom: 16px; font-style: italic; }
    .testimonial-name { font-size: 14px; font-weight: 700; color: var(--text); }
    .testimonial-role { font-size: 12px; color: var(--text3); }
    .stars { color: #f59e0b; font-size: 14px; margin-bottom: 10px; }
    /* FAQ */
    .faq-section { background-color: var(--bg); }
    .faq-item { border: 1px solid var(--border); border-radius: 12px; margin-bottom: 10px; overflow: hidden; }
    .faq-q { padding: 16px 20px; cursor: pointer; font-weight: 600; color: var(--text); display: flex; justify-content: space-between; align-items: center; background: var(--card); }
    .faq-a { padding: 0 20px; max-height: 0; overflow: hidden; transition: all 0.3s; font-size: 14px; color: var(--text2); line-height: 1.7; background: var(--bg2); }
    .faq-a.open { padding: 16px 20px; max-height: 200px; }
    /* CONTACT */
    .contact-section { background-color: var(--bg2); }
    .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; }
    .contact-info { display: flex; flex-direction: column; gap: 16px; }
    .contact-item { display: flex; align-items: center; gap: 12px; padding: 14px 16px; background: var(--card); border-radius: 10px; border: 1px solid var(--border); }
    .contact-item-icon { font-size: 20px; }
    .contact-item-label { font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: 1px; }
    .contact-item-value { font-size: 14px; font-weight: 600; color: var(--text); }
    .contact-form { display: flex; flex-direction: column; gap: 14px; }
    .form-input, .form-textarea {
      background: var(--card); border: 1px solid var(--border); border-radius: 10px;
      padding: 12px 16px; color: var(--text); font-size: 14px; font-family: Arial, sans-serif;
      width: 100%; outline: none; transition: border 0.2s;
    }
    .form-input:focus, .form-textarea:focus { border-color: var(--accent); }
    .form-textarea { resize: vertical; min-height: 100px; }
    .form-error { font-size: 12px; color: #f87171; margin-top: -8px; display: none; }
    .form-success { background: rgba(74,222,128,0.1); border: 1px solid rgba(74,222,128,0.3); border-radius: 10px; padding: 16px; color: #4ade80; font-weight: 600; display: none; text-align: center; }
    .form-btn { background: var(--btn); color: var(--btnText); padding: 13px; border-radius: 10px; font-weight: 700; font-size: 15px; border: none; cursor: pointer; transition: all 0.3s; }
    .form-btn:hover { opacity: 0.9; transform: translateY(-1px); }
    /* WHATSAPP */
    .whatsapp-float {
      position: fixed; bottom: 24px; ${isRTL ? 'left' : 'right'}: 24px;
      width: 56px; height: 56px; border-radius: 50%;
      background: #25d366; color: white; font-size: 28px;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 20px rgba(37,211,102,0.5); z-index: 9999;
      text-decoration: none; transition: all 0.3s; animation: pulse-wa 2s infinite;
    }
    .whatsapp-float:hover { transform: scale(1.1); }
    /* FOOTER */
    footer { background-color: var(--nav); padding: 40px 24px 24px; border-top: 1px solid var(--border); }
    .footer-inner { max-width: 1100px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
    .footer-logo { font-size: 18px; font-weight: 900; color: var(--accent); }
    .footer-text { font-size: 13px; color: var(--text3); }
    .footer-copy { font-size: 12px; color: var(--text3); text-align: center; margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border); max-width: 1100px; margin: 24px auto 0; }
    /* BACK TO TOP */
    .back-top {
      position: fixed; bottom: 90px; ${isRTL ? 'left' : 'right'}: 24px;
      width: 40px; height: 40px; border-radius: 50%;
      background: var(--accent); color: white; font-size: 18px;
      display: none; align-items: center; justify-content: center;
      cursor: pointer; z-index: 999; border: none; box-shadow: 0 4px 14px ${c.accent}40;
    }
    .back-top.show { display: flex; }
    /* FADE IN */
    .fade-in { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
    .fade-in.visible { opacity: 1; transform: translateY(0); }
    /* ANIMATIONS */
    @keyframes pulse-wa { 0%,100%{box-shadow:0 4px 20px rgba(37,211,102,0.5)} 50%{box-shadow:0 4px 40px rgba(37,211,102,0.8)} }
    /* SCROLL PROGRESS */
    .scroll-bar { position: fixed; top: 0; left: 0; height: 3px; background: linear-gradient(90deg, var(--accent), var(--accent2)); z-index: 9999; transition: width 0.1s; }
    /* RESPONSIVE */
    @media (max-width: 768px) {
      .nav-links, .nav-btn { display: none; }
      .hamburger { display: flex; }
      .about-grid, .contact-grid { grid-template-columns: 1fr; }
      .hero h1 { font-size: 28px; }
      .hero p { font-size: 15px; }
    }
  </style>
</head>
<body>

<!-- Scroll progress bar -->
<div class="scroll-bar" id="scrollBar"></div>

<!-- WhatsApp floating button -->
<a href="https://wa.me/${content.whatsapp || '966500000000'}" class="whatsapp-float" target="_blank">💬</a>

<!-- Back to top -->
<button class="back-top" id="backTop">↑</button>

<!-- NAVBAR -->
<nav id="navbar">
  <div class="nav-logo">✦ ${content.brand || brandName}</div>
  <ul class="nav-links">
    ${(content.navLinks || ['Home', 'About', 'Services', 'Contact']).map((link: string) =>
      `<li><a href="#${link.toLowerCase()}">${link}</a></li>`
    ).join('')}
  </ul>
  <a href="https://wa.me/${content.whatsapp || '966500000000'}" class="nav-btn" target="_blank">WhatsApp</a>
  <button class="hamburger" id="hamburger">
    <span></span><span></span><span></span>
  </button>
</nav>

<!-- Mobile menu -->
<div class="mobile-menu" id="mobileMenu">
  ${(content.navLinks || ['Home', 'About', 'Services', 'Contact']).map((link: string) =>
    `<a href="#${link.toLowerCase()}" onclick="closeMobile()">${link}</a>`
  ).join('')}
  <a href="https://wa.me/${content.whatsapp || '966500000000'}" target="_blank" style="color:var(--accent);font-weight:700;">💬 WhatsApp</a>
</div>

<!-- HERO -->
<section class="hero" id="home">
  <div class="hero-content">
    <div class="hero-badge">✦ ${content.tagline || 'Welcome'}</div>
    <h1>${content.heroTitle || `Welcome to ${brandName}`}</h1>
    <p>${content.heroSubtitle || description}</p>
    <div class="hero-btns">
      <button class="btn-primary" onclick="document.getElementById('contact').scrollIntoView({behavior:'smooth'})">
        ${content.heroCTA || 'Get Started'}
      </button>
      <a href="https://wa.me/${content.whatsapp || '966500000000'}" class="btn-secondary" target="_blank">
        💬 WhatsApp
      </a>
    </div>
  </div>
</section>

<!-- STATS -->
<section class="stats-section" id="stats">
  <div class="container">
    <div class="stats-grid">
      ${(content.stats || []).map((s: any) => `
        <div class="stat-card fade-in">
          <div class="stat-number">${s.number}</div>
          <div class="stat-label">${s.label}</div>
        </div>
      `).join('')}
    </div>
  </div>
</section>

<!-- SERVICES -->
<section class="services-section" id="services">
  <div class="container">
    <div class="section-label">Our Services</div>
    <h2 class="section-title">What We Offer</h2>
    <p class="section-sub">${content.heroSubtitle || description}</p>
    <div class="services-grid">
      ${(content.services || []).map((s: any) => `
        <div class="service-card fade-in">
          <div class="service-icon">${s.icon}</div>
          <div class="service-title">${s.title}</div>
          <div class="service-desc">${s.desc}</div>
        </div>
      `).join('')}
    </div>
  </div>
</section>

<!-- ABOUT -->
<section class="about-section" id="about">
  <div class="container">
    <div class="about-grid">
      <div class="about-visual fade-in">
        ${websiteType === 'restaurant' ? '🍽️' : websiteType === 'gym' ? '💪' : websiteType === 'medical' ? '🏥' : '✦'}
      </div>
      <div class="about-text fade-in">
        <div class="section-label">About Us</div>
        <h2 class="section-title">Who We Are</h2>
        <p>${content.about || description}</p>
        <button class="btn-primary" onclick="document.getElementById('contact').scrollIntoView({behavior:'smooth'})" style="margin-top:16px;">
          ${content.heroCTA || 'Contact Us'}
        </button>
      </div>
    </div>
  </div>
</section>

<!-- WHY US -->
<section class="whyus-section">
  <div class="container">
    <div class="section-label">Why Choose Us</div>
    <h2 class="section-title">Our Advantages</h2>
    <div class="whyus-grid">
      ${(content.whyUs || []).map((w: any) => `
        <div class="whyus-card fade-in">
          <div class="whyus-icon">${w.icon}</div>
          <div>
            <div class="whyus-title">${w.title}</div>
            <div class="whyus-desc">${w.desc}</div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
</section>

<!-- TESTIMONIALS -->
<section class="testimonials-section">
  <div class="container">
    <div class="section-label">Testimonials</div>
    <h2 class="section-title">What Our Clients Say</h2>
    <div class="testimonials-grid">
      ${(content.testimonials || []).map((t: any) => `
        <div class="testimonial-card fade-in">
          <div class="stars">⭐⭐⭐⭐⭐</div>
          <div class="testimonial-text">"${t.text}"</div>
          <div class="testimonial-name">${t.name}</div>
          <div class="testimonial-role">${t.role}</div>
        </div>
      `).join('')}
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="faq-section">
  <div class="container">
    <div class="section-label">FAQ</div>
    <h2 class="section-title">Common Questions</h2>
    <div style="max-width:700px;margin:0 auto;">
      ${(content.faq || []).map((f: any, i: number) => `
        <div class="faq-item">
          <div class="faq-q" onclick="toggleFaq(${i})">
            <span>${f.q}</span>
            <span id="faq-icon-${i}">+</span>
          </div>
          <div class="faq-a" id="faq-a-${i}">${f.a}</div>
        </div>
      `).join('')}
    </div>
  </div>
</section>

<!-- CONTACT -->
<section class="contact-section" id="contact">
  <div class="container">
    <div class="section-label">Contact Us</div>
    <h2 class="section-title">Get In Touch</h2>
    <div class="contact-grid">
      <div class="contact-info">
        <div class="contact-item">
          <span class="contact-item-icon">📞</span>
          <div><div class="contact-item-label">Phone</div><div class="contact-item-value">${content.phone}</div></div>
        </div>
        <div class="contact-item">
          <span class="contact-item-icon">📧</span>
          <div><div class="contact-item-label">Email</div><div class="contact-item-value">${content.email}</div></div>
        </div>
        <div class="contact-item">
          <span class="contact-item-icon">📍</span>
          <div><div class="contact-item-label">Address</div><div class="contact-item-value">${content.address}</div></div>
        </div>
        <div class="contact-item">
          <span class="contact-item-icon">🕐</span>
          <div><div class="contact-item-label">Hours</div><div class="contact-item-value">${content.hours}</div></div>
        </div>
        <a href="https://wa.me/${content.whatsapp || '966500000000'}" target="_blank" class="btn-primary" style="text-align:center;padding:14px;border-radius:10px;display:block;">
          💬 Message on WhatsApp
        </a>
      </div>
      <div>
        <div class="form-success" id="formSuccess">✅ Message sent! We'll contact you soon.</div>
        <form class="contact-form" onsubmit="handleSubmit(event)">
          <input class="form-input" id="fname" type="text" placeholder="Your Name" />
          <div class="form-error" id="fnameErr">Please enter your name</div>
          <input class="form-input" id="femail" type="email" placeholder="Your Email" />
          <div class="form-error" id="femailErr">Please enter a valid email</div>
          <input class="form-input" id="fphone" type="tel" placeholder="Phone Number" />
          <textarea class="form-textarea" id="fmsg" placeholder="Your Message"></textarea>
          <div class="form-error" id="fmsgErr">Please enter your message</div>
          <button type="submit" class="form-btn">Send Message →</button>
        </form>
      </div>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer>
  <div class="footer-inner">
    <div class="footer-logo">✦ ${content.brand || brandName}</div>
    <div class="footer-text">${content.footerText || description}</div>
    <a href="https://wa.me/${content.whatsapp || '966500000000'}" target="_blank" style="color:var(--accent);font-weight:700;">💬 WhatsApp</a>
  </div>
  <div class="footer-copy">© ${new Date().getFullYear()} ${content.brand || brandName}. All rights reserved.</div>
</footer>

<script>
  // Hamburger menu
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  function closeMobile() { mobileMenu.classList.remove('open'); }

  // Navbar on scroll
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    const scrollBar = document.getElementById('scrollBar');
    const backTop = document.getElementById('backTop');
    const scrollPct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    scrollBar.style.width = scrollPct + '%';
    nav.style.boxShadow = window.scrollY > 50 ? '0 4px 30px rgba(0,0,0,0.4)' : '0 2px 20px rgba(0,0,0,0.3)';
    backTop.classList.toggle('show', window.scrollY > 400);
  });

  // Back to top
  document.getElementById('backTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Fade in animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // FAQ
  function toggleFaq(i) {
    const ans = document.getElementById('faq-a-' + i);
    const icon = document.getElementById('faq-icon-' + i);
    ans.classList.toggle('open');
    icon.textContent = ans.classList.contains('open') ? '−' : '+';
  }

  // Form validation
  function handleSubmit(e) {
    e.preventDefault();
    let valid = true;
    const name = document.getElementById('fname').value.trim();
    const email = document.getElementById('femail').value.trim();
    const msg = document.getElementById('fmsg').value.trim();
    document.getElementById('fnameErr').style.display = name ? 'none' : 'block';
    document.getElementById('femailErr').style.display = (email && email.includes('@')) ? 'none' : 'block';
    document.getElementById('fmsgErr').style.display = msg ? 'none' : 'block';
    if (!name || !email || !email.includes('@') || !msg) return;
    document.getElementById('formSuccess').style.display = 'block';
    e.target.reset();
    setTimeout(() => document.getElementById('formSuccess').style.display = 'none', 5000);
  }

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
</script>
</body>
</html>`;

    // Save to DB
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
    console.error('Build error:', error);
    if (error?.status === 529)
      return NextResponse.json({ error: 'AI is busy. Try again.' }, { status: 503 });
    return NextResponse.json({ error: 'Failed to build. Please try again.' }, { status: 500 });
  }
}

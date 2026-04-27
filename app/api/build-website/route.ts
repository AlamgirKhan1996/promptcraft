// app/api/build-website/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Anthropic from '@anthropic-ai/sdk';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id ?? null;
    const dbUser = userId ? await prisma.user.findUnique({
      where: { id: userId }, select: { plan: true },
    }) : null;
    const plan = dbUser?.plan ?? 'FREE';

    // ── Rate limiting ─────────────────────────────────
    if (userId && plan === 'FREE') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
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

    const isArabic    = language?.toLowerCase().includes('arabic');
    const isBilingual = language?.toLowerCase().includes('bilingual');

    // ── HARDCODED COLOR PALETTES ──────────────────────
    // These are injected directly — Claude cannot override them
    const palettes: Record<string, { bg: string; bg2: string; bg3: string; text: string; text2: string; accent: string; accent2: string }> = {
      dark:   { bg:'#0f1117', bg2:'#1a1a2e', bg3:'#0d0d1f', text:'#f1f5f9', text2:'#94a3b8', accent:'#6366f1', accent2:'#22d3ee' },
      light:  { bg:'#f8fafc', bg2:'#ffffff', bg3:'#f1f5f9', text:'#0f172a', text2:'#475569', accent:'#3b82f6', accent2:'#06b6d4' },
      luxury: { bg:'#0a0a0a', bg2:'#111111', bg3:'#0d0d0d', text:'#fef3c7', text2:'#d4a853', accent:'#d97706', accent2:'#f59e0b' },
      bold:   { bg:'#1a1a2e', bg2:'#16213e', bg3:'#0f3460', text:'#f1f5f9', text2:'#94a3b8', accent:'#e91e63', accent2:'#ff6b6b' },
      nature: { bg:'#f0fdf4', bg2:'#dcfce7', bg3:'#ffffff', text:'#14532d', text2:'#166534', accent:'#16a34a', accent2:'#22c55e' },
      arabic: { bg:'#0d0d0d', bg2:'#1a1000', bg3:'#111111', text:'#fef3c7', text2:'#d4a853', accent:'#b45309', accent2:'#d97706' },
    };
    const p = palettes[style] || palettes.dark;

    // ── PROMPT ────────────────────────────────────────
    const prompt = `Build a COMPLETE single-file HTML website. Return ONLY the HTML code, nothing else.

Website details:
- Name: ${brandName || 'My Business'}
- Type: ${websiteType}
- About: ${description}
- Sections: ${pages || 'Home, About, Services, Contact'}
- Features: ${features || 'Mobile menu, contact form, WhatsApp button'}
- Language: ${language || 'English'}
${isArabic ? '- Direction: RTL. Add dir="rtl" to html tag. All content in Arabic.' : ''}
${isBilingual ? '- Add EN/AR language toggle button. JavaScript switches all text.' : ''}

DESIGN COLORS TO USE:
- Page background: ${p.bg}
- Section background: ${p.bg2}
- Card background: ${p.bg3}
- Primary text: ${p.text}
- Secondary text: ${p.text2}
- Accent/buttons: ${p.accent}
- Accent secondary: ${p.accent2}

STRICT RULES:
1. Return ONLY the HTML — start with <!DOCTYPE html>
2. NO external fonts or CDN — use: font-family: Arial, Helvetica, sans-serif
3. NO Tailwind, NO Bootstrap — write all CSS yourself in <style> tag
4. NO @import statements
5. ALL CSS inside one <style> tag in <head>
6. ALL JavaScript inside one <script> tag before </body>

REQUIRED HTML STRUCTURE:
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${brandName || 'My Business'}</title>
  <style>
    /* YOUR CSS HERE */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    :root {
      --bg: ${p.bg};
      --bg2: ${p.bg2};
      --bg3: ${p.bg3};
      --text: ${p.text};
      --text2: ${p.text2};
      --accent: ${p.accent};
      --accent2: ${p.accent2};
    }
    html, body {
      background-color: ${p.bg};
      color: ${p.text};
      font-family: Arial, Helvetica, sans-serif;
      min-height: 100vh;
    }
    /* ... rest of CSS */
  </style>
</head>
<body style="background-color: ${p.bg}; color: ${p.text}; margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif;">

  <!-- navbar, hero, sections, footer here -->

  <script>
    /* YOUR JAVASCRIPT HERE */
  </script>
</body>
</html>

INCLUDE THESE FEATURES:
1. Sticky navbar with mobile hamburger menu (JavaScript toggle)
2. Hero section with gradient background using ${p.accent} color
3. About/Services section with cards
4. Contact form with JavaScript validation + success message
5. WhatsApp floating button: href="https://wa.me/966500000000"
6. Footer with copyright
7. Smooth scroll behavior
8. Fade-in animation on scroll using IntersectionObserver
9. All section backgrounds use ${p.bg2} or ${p.bg3}

Make it beautiful, modern, and professional.
Use gradients, shadows, and hover effects.
Return ONLY the complete HTML.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    });

    let html = response.content[0].type === 'text' ? response.content[0].text : '';

    // ── STRIP MARKDOWN ────────────────────────────────
    html = html
      .replace(/^```html\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    // ── REMOVE ALL EXTERNAL RESOURCES ─────────────────
    html = html
      .replace(/<link[^>]*(?:googleapis|gstatic|cdn|bootstrap|tailwind)[^>]*\/?>/gi, '')
      .replace(/<script[^>]*(?:cdn|cloudflare|jsdelivr|unpkg|tailwind|bootstrap)[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/@import\s+url\s*\([^)]*\)[^;]*;/gi, '')
      .replace(/@import\s+["'][^"']*["'][^;]*;/gi, '');

    // ── REPLACE WEB FONTS WITH ARIAL ──────────────────
    html = html.replace(
      /font-family\s*:\s*['"]?\s*(?:Inter|Poppins|Roboto|Montserrat|Lato|Raleway|Nunito|Open Sans|Playfair|Cairo|Tajawal|Almarai)[^;{]*/gi,
      `font-family: Arial, Helvetica, sans-serif`
    );

    // ── FORCE INJECT BACKGROUND — THE KEY FIX ─────────
    // This runs AFTER Claude's HTML — overrides everything
    const injectedCSS = `
<style id="pf-force-bg">
  html { background-color: ${p.bg} !important; }
  body {
    background-color: ${p.bg} !important;
    color: ${p.text} !important;
    font-family: Arial, Helvetica, sans-serif !important;
    margin: 0 !important;
    padding: 0 !important;
    min-height: 100vh !important;
  }
</style>`;

    // ── INJECT INTO <head> ────────────────────────────
    if (html.includes('</head>')) {
      html = html.replace('</head>', injectedCSS + '\n</head>');
    } else if (html.includes('<body')) {
      html = html.replace('<body', injectedCSS + '\n<body');
    } else {
      html = injectedCSS + '\n' + html;
    }

    // ── FORCE BODY TAG ────────────────────────────────
    html = html.replace(
      /<body([^>]*)>/i,
      `<body style="background-color:${p.bg};color:${p.text};margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;min-height:100vh;">`
    );

    // ── VALIDATE ──────────────────────────────────────
    if (!html.includes('<!DOCTYPE') && !html.includes('<html')) {
      return NextResponse.json({ error: 'Generation failed. Please try again.' }, { status: 500 });
    }

    // ── SAVE TO DB FOR RATE LIMITING ──────────────────
    if (userId) {
      await prisma.promptRun.create({
        data: {
          userId,
          prompt: `Website: ${brandName} - ${websiteType}`,
          result: html.substring(0, 500),
          category: 'website_build',
          tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
          executionTime: 0,
          plan,
        },
      });
    }

    return NextResponse.json({
      success: true,
      html,
      tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
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

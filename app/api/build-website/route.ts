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
    const userId = (session?.user as any)?.id;
    const dbUser = userId ? await prisma.user.findUnique({
      where: { id: userId }, select: { plan: true }
    }) : null;
    const plan = dbUser?.plan ?? 'FREE';

    const {
      websiteType, description, pages,
      style, features, language, brandName,
    } = await req.json();

    if (!description || !websiteType) {
      return NextResponse.json(
        { error: 'Description and website type are required' },
        { status: 400 }
      );
    }

    const isArabic    = language?.toLowerCase().includes('arabic');
    const isBilingual = language?.toLowerCase().includes('bilingual');

    // ── Pick colors from style ──────────────────────────
    const styleMap: Record<string, { bg: string; bg2: string; text: string; accent: string }> = {
      dark:   { bg: '#0f1117', bg2: '#1a1a2e', text: '#f1f5f9', accent: '#6366f1' },
      light:  { bg: '#ffffff', bg2: '#f8fafc', text: '#1e293b', accent: '#3b82f6' },
      luxury: { bg: '#0a0a0a', bg2: '#111111', text: '#fef3c7', accent: '#d97706' },
      bold:   { bg: '#1a1a2e', bg2: '#12122e', text: '#f1f5f9', accent: '#e91e63' },
      nature: { bg: '#f0fdf4', bg2: '#dcfce7', text: '#14532d', accent: '#16a34a' },
      arabic: { bg: '#0d0d0d', bg2: '#111111', text: '#fef3c7', accent: '#b45309' },
    };
    const c = styleMap[style] || styleMap.dark;

    // ── System prompt ───────────────────────────────────
    const systemPrompt = `You are a world-class senior web developer.
Build beautiful, complete, single-file HTML websites.

══════════════════════════════════════
NON-NEGOTIABLE RULES — FOLLOW EXACTLY
══════════════════════════════════════

RULE 1 — OUTPUT:
Return ONLY the raw HTML code.
Nothing before <!DOCTYPE html>.
Nothing after </html>.
No markdown. No explanation. No code fences.

RULE 2 — ZERO EXTERNAL URLS:
- NO Google Fonts links
- NO Tailwind CDN script
- NO Bootstrap CDN
- NO any external link or script at all
- System fonts ONLY: Arial, Helvetica, sans-serif

RULE 3 — ALL CSS INLINE:
Write every CSS rule inside a <style> tag in <head>.
Use CSS custom properties:
:root {
  --bg: ${c.bg};
  --bg2: ${c.bg2};
  --text: ${c.text};
  --accent: ${c.accent};
}

RULE 4 — BODY BACKGROUND:
The <body> tag MUST have this exact inline style:
style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:${c.bg};color:${c.text};"

RULE 5 — EVERY SECTION:
Every <section>, <div>, <header>, <footer>
must have background-color in its style attribute.
Never rely on CSS class alone for backgrounds.

RULE 6 — CSP META:
Add exactly this in <head>:
<meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:;">

══════════════════════════════════════
FEATURES TO INCLUDE
══════════════════════════════════════

1. Sticky navbar — transparent → solid on scroll
2. Mobile hamburger menu — JS open/close animation
3. Hero section — gradient background, headline, CTA button
4. Smooth scroll to sections
5. IntersectionObserver fade-in animations
6. Contact form — JS validation, success message
7. WhatsApp button — href="https://wa.me/966500000000"
8. Counter animation for stats
9. FAQ accordion — click to expand/collapse
10. Testimonials section
11. Back to top button
12. Footer with links and copyright
13. All JavaScript in one <script> tag before </body>

${isArabic ? `
ARABIC RULES:
- <html dir="rtl" lang="ar">
- All content in Arabic
- text-align: right on body
- Margins and paddings flipped for RTL
` : ''}

${isBilingual ? `
BILINGUAL RULES:
- Language toggle button: EN | عربي
- All text elements: data-en="English text" data-ar="Arabic text"
- JS function toggleLanguage() switches all text and dir attribute
` : ''}`;

    // ── User prompt ─────────────────────────────────────
    const userPrompt = `Build a stunning website with these details:

Business Type: ${websiteType}
Brand Name: ${brandName || 'My Business'}
Description: ${description}
Pages/Sections: ${pages || 'Home, About, Services, Contact'}
Design Colors: bg=${c.bg} text=${c.text} accent=${c.accent}
Features: ${features || 'Mobile responsive, animations, WhatsApp button, contact form'}
Language: ${language || 'English'}

REMEMBER:
- body style MUST start with: background-color:${c.bg};color:${c.text};
- NO external links or scripts of any kind
- ALL CSS in <style> tag only
- Make it genuinely beautiful and impressive
- Real content relevant to the business
- SAR pricing if restaurant in Saudi Arabia
- Phone format: +966 5X XXX XXXX

Return ONLY the HTML. Start with <!DOCTYPE html>.`;

    // ── Call Claude ─────────────────────────────────────
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 6000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    let html = response.content[0].type === 'text'
      ? response.content[0].text : '';

    // ── Strip markdown fences if Claude added them ──────
    html = html
      .replace(/^```html\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    // ── Remove any external URLs Claude snuck in ────────
    html = html
      .replace(/<link[^>]*googleapis\.com[^>]*>/gi, '')
      .replace(/<link[^>]*gstatic\.com[^>]*>/gi, '')
      .replace(/<link[^>]*tailwindcss[^>]*>/gi, '')
      .replace(/<script[^>]*tailwindcss[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<script[^>]*cloudflare[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<script[^>]*jsdelivr[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<script[^>]*unpkg[^>]*>[\s\S]*?<\/script>/gi, '');

    // ── Replace web fonts with system fonts ─────────────
    html = html
      .replace(/font-family:\s*['"]?(Inter|Poppins|Roboto|Montserrat|Lato|Raleway|Nunito|Open Sans)['"]?/gi,
        "font-family: Arial, Helvetica, sans-serif");

    // ── Force body background if missing ────────────────
    if (!html.includes(`background-color:${c.bg}`) && !html.includes(`background: ${c.bg}`)) {
      html = html.replace(
        /<body([^>]*)>/i,
        `<body$1 style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:${c.bg};color:${c.text};">`
      );
    }

    // ── Force CSP meta ───────────────────────────────────
    if (!html.includes('Content-Security-Policy')) {
      html = html.replace(
        '<head>',
        `<head>\n  <meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:;">`
      );
    }

    // ── Validate ─────────────────────────────────────────
    if (!html.includes('<!DOCTYPE') || !html.includes('<html')) {
      return NextResponse.json(
        { error: 'Generation failed. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      html,
      tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
      executionTime: Date.now(),
      lineCount: html.split('\n').length,
      websiteType,
      brandName,
    });

  } catch (error: any) {
    console.error('Build error:', error);
    if (error?.status === 529)
      return NextResponse.json({ error: 'AI is busy. Try again in a moment.' }, { status: 503 });
    return NextResponse.json({ error: 'Failed to build. Please try again.' }, { status: 500 });
  }
}

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

    // Rate limiting
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

    const isArabic = language?.toLowerCase().includes('arabic');
    const isBilingual = language?.toLowerCase().includes('bilingual');

    // Color palettes
    const palettes: Record<string, { bg: string; bg2: string; text: string; text2: string; accent: string }> = {
      dark:   { bg: '#0f1117', bg2: '#1a1a2e', text: '#f1f5f9', text2: '#94a3b8', accent: '#6366f1' },
      light:  { bg: '#f8fafc', bg2: '#ffffff', text: '#0f172a', text2: '#475569', accent: '#3b82f6' },
      luxury: { bg: '#0a0a0a', bg2: '#111111', text: '#fef3c7', text2: '#d4a853', accent: '#d97706' },
      bold:   { bg: '#1a1a2e', bg2: '#16213e', text: '#f1f5f9', text2: '#94a3b8', accent: '#e91e63' },
      nature: { bg: '#f0fdf4', bg2: '#dcfce7', text: '#14532d', text2: '#166534', accent: '#16a34a' },
      arabic: { bg: '#0d0d0d', bg2: '#1a1000', text: '#fef3c7', text2: '#d4a853', accent: '#d97706' },
    };
    const c = palettes[style] || palettes.dark;

    // Simple clear prompt - NO template structure
    const prompt = `You are a web developer. Build a complete, beautiful, working website.

Business: ${brandName || 'My Business'}
Type: ${websiteType}
Description: ${description}
Sections needed: ${pages || 'Home, About, Services, Contact'}
Features: ${features || 'Mobile menu, contact form, WhatsApp button, animations'}
Language: ${language || 'English'}
${isArabic ? 'IMPORTANT: This is Arabic RTL. Set dir="rtl" on html. Write ALL content in Arabic language.' : ''}
${isBilingual ? 'IMPORTANT: Add language toggle EN/AR. JavaScript switches all content.' : ''}

COLORS - use EXACTLY these:
Page background: ${c.bg}
Section background: ${c.bg2}
Main text: ${c.text}
Secondary text: ${c.text2}
Accent color for buttons/links: ${c.accent}

REQUIREMENTS:
- Return ONLY complete HTML. Nothing before <!DOCTYPE html>. Nothing after </html>
- No external CSS/JS libraries. No Google Fonts. No CDN. No Tailwind.
- Use Arial, Helvetica, sans-serif for all fonts
- Write ALL CSS in one <style> tag
- Write ALL JavaScript in one <script> tag before </body>
- Make it beautiful with gradients, shadows, hover effects
- Include sticky navbar with working mobile hamburger menu
- Include hero section with big headline and CTA button
- Include all requested sections with REAL content about the business
- Include working contact form with JavaScript validation
- Include WhatsApp button: https://wa.me/966500000000
- Include smooth scroll and fade-in animations
- Make fully mobile responsive

The website must look professional and impressive when opened in a browser.
Write real content - not placeholder text - based on the business description.

Return ONLY the HTML code starting with <!DOCTYPE html>`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 3500,
      messages: [{ role: 'user', content: prompt }],
    });

    let html = response.content[0].type === 'text' ? response.content[0].text : '';

    // Clean markdown
    html = html
      .replace(/^```html\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    // Remove external resources
    html = html
      .replace(/<link[^>]*(?:googleapis|gstatic|cdn|bootstrap|tailwind)[^>]*\/?>/gi, '')
      .replace(/<script[^>]*(?:cdn|cloudflare|jsdelivr|unpkg|tailwind|bootstrap)[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/@import[^;]+;/gi, '');

    // Replace web fonts
    html = html.replace(
      /font-family\s*:\s*['"]?\s*(?:Inter|Poppins|Roboto|Montserrat|Lato|Cairo|Tajawal|Almarai|Nunito|Raleway)[^;{]*/gi,
      'font-family: Arial, Helvetica, sans-serif'
    );

    // ── THE KEY FIX: Force inject background CSS ──────
    const forcedStyle = `
<style id="pf-bg-override">
  *, html, body, div, section, header, footer, nav, main {
    box-sizing: border-box;
  }
  html {
    background-color: ${c.bg} !important;
    min-height: 100% !important;
  }
  body {
    background-color: ${c.bg} !important;
    color: ${c.text} !important;
    font-family: Arial, Helvetica, sans-serif !important;
    margin: 0 !important;
    padding: 0 !important;
    min-height: 100vh !important;
  }
</style>`;

    // Inject before </head>
    if (html.includes('</head>')) {
      html = html.replace('</head>', forcedStyle + '</head>');
    } else {
      html = html.replace('<html', forcedStyle + '<html');
    }

    // Force body inline style
    if (html.includes('<body')) {
      html = html.replace(
        /<body[^>]*>/i,
        `<body style="background-color:${c.bg};color:${c.text};margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;min-height:100vh;">`
      );
    }

    // Validate
    if (html.length < 500 ) {
      return NextResponse.json({ error: 'Generation incomplete. Please try again.' }, { status: 500 });
    }

    // Save to DB for rate limiting
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
      return NextResponse.json({ error: 'AI is busy. Try again in a moment.' }, { status: 503 });
    return NextResponse.json({ error: 'Failed to build. Please try again.' }, { status: 500 });
  }
}

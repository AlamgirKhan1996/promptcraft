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

    const { websiteType, description, pages, style, language, brandName, features } = await req.json();

    if (!description || !websiteType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const isArabic = language?.toLowerCase().includes('arabic');

    const bgColors: Record<string, string> = {
      dark: '#0f1117', light: '#ffffff',
      luxury: '#0a0a0a', bold: '#1a1a2e',
      nature: '#f0fdf4', arabic: '#0d0d0d',
    };
    const textColors: Record<string, string> = {
      dark: '#f1f5f9', light: '#1e293b',
      luxury: '#fef3c7', bold: '#f1f5f9',
      nature: '#14532d', arabic: '#fef3c7',
    };
    const accentColors: Record<string, string> = {
      dark: '#6366f1', light: '#3b82f6',
      luxury: '#d97706', bold: '#e91e63',
      nature: '#16a34a', arabic: '#b45309',
    };

    const bg     = bgColors[style]     || '#0f1117';
    const text   = textColors[style]   || '#f1f5f9';
    const accent = accentColors[style] || '#6366f1';

    const prompt = `Build a complete professional website. Return ONLY raw HTML code.
    MOST IMPORTANT - NO EXTERNAL RESOURCES:
- NO Google Fonts link tags
- NO Tailwind CDN script tags  
- NO Bootstrap or any CDN
- Use ONLY: font-family: Arial, Helvetica, sans-serif
- ALL colors as inline styles on every element
- background-color MUST be on body as inline style

Business: ${brandName || 'My Business'}
Type: ${websiteType}
Description: ${description}
Sections: ${pages || 'Home, About, Services, Contact'}
Features: ${features || 'Mobile responsive, contact form, WhatsApp button'}
Language: ${language || 'English'}
${isArabic ? 'Arabic RTL: Set dir="rtl" on html tag. All text in Arabic.' : ''}

STRICT RULES:
1. Return ONLY HTML starting with <!DOCTYPE html>
2. NO external links, NO CDN, NO Google Fonts
3. Use only: font-family: Arial, Helvetica, sans-serif
4. Body tag must be: <body style="margin:0;padding:0;background-color:${bg};color:${text};font-family:Arial,Helvetica,sans-serif;">
5. Every section needs: style="background-color:..."
6. All CSS in <style> tag, all JS in <script> tag
7. Include: sticky navbar, hamburger menu, contact form, WhatsApp button (wa.me/966500000000), footer
8. Use this CSS variable in style tag: :root{--bg:${bg};--text:${text};--accent:${accent};}
9. Make it beautiful with gradients and shadows

Return ONLY the HTML. Nothing else.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }],
    });

   const rawCode = response.content[0].type === 'text' ? response.content[0].text : '';
    let html = rawCode
  .replace(/^```html\s*/i, '')
  .replace(/^```\s*/i, '')
  .replace(/\s*```$/i, '')
  .trim();

// ✅ Strip ALL external resources
html = html
  .replace(/<link[^>]*href=["'][^"']*googleapis[^"']*["'][^>]*\/?>/gi, '')
  .replace(/<link[^>]*href=["'][^"']*gstatic[^"']*["'][^>]*\/?>/gi, '')
  .replace(/<link[^>]*href=["'][^"']*cdn[^"']*["'][^>]*\/?>/gi, '')
  .replace(/<script[^>]*src=["'][^"']*cdn[^"']*["'][^>]*><\/script>/gi, '')
  .replace(/<script[^>]*src=["'][^"']*googleapis[^"']*["'][^>]*><\/script>/gi, '')
  .replace(/@import\s+url\(['"]?https?:\/\/[^'")\s]+['"]?\)[^;]*;/gi, '')
  .replace(/font-family:[^;]*['"]?(Inter|Poppins|Roboto|Montserrat|Lato|Raleway|Nunito|Open Sans|Playfair|Josefin)['"]?[^;]*/gi,
    'font-family: Arial, Helvetica, sans-serif');

// ✅ Force body background if missing  
if (!html.match(/<body[^>]*background/i)) {
  html = html.replace(/<body/i, '<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:#0f1117;color:#f1f5f9;"');
}

    // Clean markdown
    html = html.replace(/^```html\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

    // Remove any external links
    html = html
      .replace(/<link[^>]*googleapis[^>]*>/gi, '')
      .replace(/<link[^>]*gstatic[^>]*>/gi, '')
      .replace(/<script[^>]*tailwind[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<script[^>]*cdn[^>]*>[\s\S]*?<\/script>/gi, '');

    // Force body background
    if (!html.match(/<body[^>]*background-color/i)) {
      html = html.replace(/<body([^>]*)>/i,
        `<body style="margin:0;padding:0;background-color:${bg};color:${text};font-family:Arial,Helvetica,sans-serif;">`);
    }

    if (!html.includes('<!DOCTYPE')) {
      return NextResponse.json({ error: 'Generation failed. Try again.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true, html,
      tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
      executionTime: Date.now(),
      lineCount: html.split('\n').length,
      websiteType, brandName,
    });

  } catch (error: any) {
    console.error('Build error:', error);
    return NextResponse.json({ error: 'Failed to build. Please try again.' }, { status: 500 });
  }
}
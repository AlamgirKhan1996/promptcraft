// app/api/build-website/route.ts
// The Lovable-style website builder
// Generates a COMPLETE single-file HTML website from user inputs

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

// Build limits
const BUILD_LIMITS: Record<string, number> = {
  FREE: 2,   // 2 builds/day free
  PRO: 999,
  TEAM: 999,
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    const dbUser = userId ? await prisma.user.findUnique({
      where: { id: userId }, select: { plan: true }
    }) : null;
    const plan = dbUser?.plan ?? 'FREE';

    const {
      websiteType, description, pages, style,
      colors, features, language, brandName
    } = await req.json();

    if (!description || !websiteType) {
      return NextResponse.json({ error: 'Description and website type are required' }, { status: 400 });
    }

    // Rate limiting
    if (userId && plan === 'FREE') {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const buildsToday = await (prisma as any).websiteBuild?.count?.({
        where: { userId, createdAt: { gte: today } }
      }).catch(() => 0) ?? 0;
      if (buildsToday >= BUILD_LIMITS.FREE) {
        return NextResponse.json({
          error: 'daily_limit',
          message: `Free plan includes ${BUILD_LIMITS.FREE} website builds per day. Upgrade to Pro for unlimited.`,
        }, { status: 429 });
      }
    }

    // ── MASTER SYSTEM PROMPT ──────────────────────────
    const systemPrompt = `You are a world-class senior full-stack web developer and UI/UX designer specializing in building stunning, production-ready websites.

You create COMPLETE, SINGLE-FILE HTML websites that:
- Look absolutely professional and modern
- Are fully responsive (mobile-first)
- Include smooth animations and micro-interactions
- Have a dark premium aesthetic by default
- Use Tailwind CSS (via CDN) for styling
- Include all JavaScript inline
- Work perfectly when rendered in an iframe

CRITICAL RULES:
1. Return ONLY the complete HTML code — nothing else, no explanations
2. Start with <!DOCTYPE html> and end with </html>
3. Include ALL CSS in a <style> tag inside <head>
4. Include ALL JavaScript in a <script> tag before </body>
5. Use Tailwind CSS CDN: <script src="https://cdn.tailwindcss.com"></script>
6. Make it visually STUNNING — not generic
7. Add smooth scroll, fade-in animations, hover effects
8. If Arabic is requested, include dir="rtl" and proper Arabic font (Noto Sans Arabic from Google Fonts)
9. Include proper meta tags for SEO
10. Every section must have real placeholder content that matches the business
11. Include a proper navigation bar that works
12. Add a footer with copyright

Design principles:
- Dark backgrounds: #08081a, #0f1120
- Accent colors: Use the requested colors or default to #6366f1 (indigo) + #22d3ee (cyan)
- Typography: Clean, modern, readable
- Spacing: Generous padding, breathing room
- Cards: Glass morphism or solid with subtle borders
- Buttons: Gradient, rounded, with hover effects`;

    // ── USER PROMPT ───────────────────────────────────
    const userPrompt = `Build a complete, stunning, production-ready website with these specifications:

WEBSITE TYPE: ${websiteType}
BRAND/BUSINESS NAME: ${brandName || 'My Business'}
DESCRIPTION: ${description}
PAGES/SECTIONS: ${pages || 'Home, About, Services, Contact'}
DESIGN STYLE: ${style || 'Dark & Premium'}
COLOR SCHEME: ${colors || 'Dark navy + indigo + cyan'}
SPECIAL FEATURES: ${features || 'Mobile responsive, smooth animations'}
LANGUAGE: ${language || 'English'}

Create a COMPLETE single-file HTML website that is:
1. Visually stunning and professional
2. Fully responsive on all devices
3. Has all requested sections with real, relevant content
4. Includes smooth animations and modern UI
5. Ready to deploy immediately

${language?.toLowerCase().includes('arabic') ? 'IMPORTANT: This is an Arabic website. Use dir="rtl", include Noto Sans Arabic font from Google Fonts, and write all content in Arabic.' : ''}

Return ONLY the complete HTML code, nothing else.`;

    const startTime = Date.now();

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 8000, // websites need more tokens
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const rawCode = response.content[0].type === 'text' ? response.content[0].text : '';

    // Clean the code — remove any markdown if Claude added it
    const htmlCode = rawCode
      .replace(/^```html\n?/i, '')
      .replace(/^```\n?/i, '')
      .replace(/\n?```$/i, '')
      .trim();

    const executionTime = Date.now() - startTime;
    const tokensUsed = response.usage.input_tokens + response.usage.output_tokens;

    // Verify it's actually HTML
    if (!htmlCode.includes('<!DOCTYPE') && !htmlCode.includes('<html')) {
      return NextResponse.json({
        error: 'Failed to generate valid website. Please try again with more details.',
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      html: htmlCode,
      tokensUsed,
      executionTime,
      websiteType,
      brandName,
    });

  } catch (error: any) {
    console.error('Build website error:', error);
    if (error?.status === 529) {
      return NextResponse.json({ error: 'AI is busy. Please try again in a moment.' }, { status: 503 });
    }
    return NextResponse.json({ error: 'Failed to build website. Please try again.' }, { status: 500 });
  }
}

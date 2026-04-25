// app/api/run-prompt/route.ts
// Runs the generated prompt through Claude and returns the result
// This is the "Run with Claude" feature — Pro only for unlimited, Free gets 3/day

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// Free users: 3 runs/day | Pro: unlimited | Team: unlimited
const RUN_LIMITS: Record<string, number> = {
  FREE: 3,
  PRO: 999,
  TEAM: 999,
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const plan = (session?.user as any)?.plan ?? 'FREE';
    const userId = (session?.user as any)?.id;

    // Parse request
    const { prompt, category, promptId } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (prompt.length > 8000) {
      return NextResponse.json(
        { error: 'Prompt too long' },
        { status: 400 }
      );
    }

    // ── Rate limiting for free users ──────────────────────
    if (userId && plan === 'FREE') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const runsToday = await prisma.promptRun.count({
        where: {
          userId,
          createdAt: { gte: today },
        },
      });

      const limit = RUN_LIMITS[plan] ?? 3;
      if (runsToday >= limit) {
        return NextResponse.json(
          {
            error: 'daily_limit',
            message: `Free plan allows ${limit} runs per day. Upgrade to Pro for unlimited runs.`,
            runsToday,
            limit,
          },
          { status: 429 }
        );
      }
    }

    // ── System prompt for the runner ─────────────────────
    // Different system prompts based on category for best results
    const categorySystemPrompts: Record<string, string> = {
      social: `You are an expert social media content creator specializing in GCC and global markets. 
Create engaging, platform-optimized content based on the prompt. 
Be specific, culturally aware, and action-oriented.`,
      
      business: `You are a senior business strategist with expertise in GCC and MENA markets.
Provide detailed, actionable business insights based on the prompt.
Be specific with numbers, timelines, and concrete recommendations.`,
      
      coding: `You are a senior software engineer specializing in Next.js, React, and modern web development.
Write clean, production-ready code based on the prompt.
Always include comments, handle errors, and follow best practices.`,
      
      email: `You are an expert email copywriter with high open and conversion rates.
Write compelling email copy based on the prompt.
Focus on clear subject lines, engaging hooks, and strong CTAs.`,
      
      ecommerce: `You are an eCommerce conversion specialist with expertise in GCC markets.
Create high-converting product copy and marketing content.
Focus on benefits, social proof, and clear calls to action.`,
      
      arabic: `أنت خبير تسويق رقمي متخصص في السوق الخليجي والعربي.
أنشئ محتوى احترافياً بالعربية الفصحى المعاصرة بناءً على الطلب.
ركز على الثقافة الخليجية والسياق المحلي.`,
      
      default: `You are an expert AI assistant that produces high-quality, professional outputs.
Execute the given prompt with precision, detail, and expertise.
Provide comprehensive, ready-to-use results.`,
    };

    const systemPrompt = categorySystemPrompts[category] || categorySystemPrompts.default;

    // ── Call Claude API ───────────────────────────────────
    const startTime = Date.now();

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1500,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const result = response.content[0].type === 'text'
      ? response.content[0].text
      : '';

    const executionTime = Date.now() - startTime;
    const tokensUsed = response.usage.input_tokens + response.usage.output_tokens;

    // ── Save run to database ──────────────────────────────
    if (userId) {
      await prisma.promptRun.create({
        data: {
          userId,
          promptId: promptId || null,
          prompt: prompt.substring(0, 1000), // store first 1000 chars
          result: result.substring(0, 3000), // store first 3000 chars
          category: category || 'general',
          tokensUsed,
          executionTime,
          plan,
        },
      });
    }

    return NextResponse.json({
      success: true,
      result,
      tokensUsed,
      executionTime,
      model: 'claude-3-5-sonnet',
      category,
    });

  } catch (error: any) {
    console.error('Run prompt error:', error);

    if (error?.status === 529) {
      return NextResponse.json(
        { error: 'AI is overloaded. Please try again in a moment.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to run prompt. Please try again.' },
      { status: 500 }
    );
  }
}

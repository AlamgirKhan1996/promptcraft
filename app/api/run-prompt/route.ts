// app/api/run-prompt/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const RUN_LIMITS: Record<string, number> = { FREE: 3, PRO: 999, TEAM: 999 };

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    const dbUser = userId ? await prisma.user.findUnique({
      where: { id: userId }, select: { plan: true }
    }) : null;
    const plan = dbUser?.plan ?? 'FREE';

    const { prompt, category, promptId } = await req.json();
    if (!prompt || typeof prompt !== 'string')
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    if (prompt.length > 8000)
      return NextResponse.json({ error: 'Prompt too long' }, { status: 400 });

    if (userId && plan === 'FREE') {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const runsToday = await prisma.promptRun.count({ where: { userId, createdAt: { gte: today } } });
      const limit = RUN_LIMITS.FREE;
      if (runsToday >= limit) return NextResponse.json({
        error: 'daily_limit',
        message: `Free plan includes ${limit} runs per day. Upgrade to Pro for unlimited.`,
        runsToday, limit,
      }, { status: 429 });
    }

    const systemPrompts: Record<string, string> = {
      social: `You are an expert social media content creator for GCC and global markets. Create engaging, platform-optimized, ready-to-publish content.`,
      business: `You are a senior business strategist for GCC and MENA markets. Provide detailed, actionable insights with specific numbers and timelines.`,
      coding: `You are a senior software engineer specializing in Next.js, React, and modern web. Write clean, production-ready, commented code.`,
      email: `You are an expert email copywriter. Write compelling, ready-to-send email copy with strong hooks and CTAs.`,
      ecommerce: `You are an eCommerce conversion specialist for GCC markets. Create high-converting product copy focused on benefits and social proof.`,
      arabic: `أنت خبير تسويق رقمي متخصص في السوق الخليجي. أنشئ محتوى احترافياً بالعربية الفصحى المعاصرة مع مراعاة الثقافة الخليجية.`,
      design: `You are a senior UI/UX designer for modern SaaS products. Provide detailed, actionable design recommendations focused on UX and conversion.`,
      education: `You are an expert educator. Create clear, engaging educational content with real-world examples.`,
      data: `You are a senior data analyst. Provide clear insights and actionable recommendations with specific metrics.`,
      ai: `You are an AI systems architect and prompt engineering expert. Design robust, production-ready AI solutions.`,
      default: `You are an expert AI assistant. Execute the given prompt with precision and provide comprehensive, ready-to-use results.`,
    };

    const startTime = Date.now();
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1500,
      system: systemPrompts[category] || systemPrompts.default,
      messages: [{ role: 'user', content: prompt }],
    });

    const result = response.content[0].type === 'text' ? response.content[0].text : '';
    const executionTime = Date.now() - startTime;
    const tokensUsed = response.usage.input_tokens + response.usage.output_tokens;

    if (userId) {
      await prisma.promptRun.create({
        data: { userId, promptId: promptId || null, prompt: prompt.substring(0, 1000), result: result.substring(0, 3000), category: category || 'general', tokensUsed, executionTime, plan },
      });
    }

    return NextResponse.json({ success: true, result, tokensUsed, executionTime, model: 'claude-sonnet-4-5', category });
  } catch (error: any) {
    console.error('Run prompt error:', error);
    if (error?.status === 529) return NextResponse.json({ error: 'AI is busy. Please try again.' }, { status: 503 });
    return NextResponse.json({ error: 'Failed to run. Please try again.' }, { status: 500 });
  }
}

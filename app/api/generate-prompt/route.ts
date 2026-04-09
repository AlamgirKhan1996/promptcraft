// app/api/generate-prompt/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generatePrompt } from '@/lib/claude';
import { checkRateLimit, incrementUsage } from '@/lib/rate-limit';
import { prisma } from '@/lib/prisma';
import { getCategoryById, FREE_CATEGORIES } from '@/lib/prompt-templates';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { categoryId, inputs, improve, existingPrompt } = body;

    if (!categoryId || !inputs) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const category = getCategoryById(categoryId);
    if (!category) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const user = session?.user as any;
    const userId = user?.id ?? null;
    const plan = user?.plan ?? 'FREE';

    // Check if category is available for this plan
    if (category.proOnly && plan === 'FREE') {
      return NextResponse.json(
        { error: 'This category requires a Pro plan. Upgrade to unlock all 10 categories.' },
        { status: 403 }
      );
    }

    if (plan === 'FREE' && !FREE_CATEGORIES.includes(categoryId)) {
      return NextResponse.json(
        { error: 'Free plan only includes Business, Coding & Social Media. Upgrade to Pro for all categories.' },
        { status: 403 }
      );
    }

    // Rate limit check
    const rateLimit = await checkRateLimit(userId, plan);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Daily limit reached (${rateLimit.limit}/day on Free plan). Upgrade to Pro for unlimited generations!`, rateLimitExceeded: true },
        { status: 429 }
      );
    }

    // Determine language from inputs
    const language = inputs.language || inputs.lang || 'English';

    // Call Claude
    const result = await generatePrompt({
      category: categoryId,
      categoryName: category.name,
      inputs,
      improve: improve ?? false,
      existingPrompt,
      language,
    });

    // Save to database if user is logged in
    let savedPromptId: string | null = null;
    if (userId) {
      const saved = await prisma.prompt.create({
        data: {
          userId,
          category: categoryId,
          categoryEmoji: category.emoji,
          inputs,
          generatedPrompt: result.prompt,
          qualityScore: result.score,
          qualityReason: result.reason,
          language,
        },
      });
      savedPromptId = saved.id;
      await incrementUsage(userId);
    }

    return NextResponse.json({
      ...result,
      promptId: savedPromptId,
      remaining: rateLimit.remaining,
    });
  } catch (error: any) {
    console.error('Generate prompt error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

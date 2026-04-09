// lib/rate-limit.ts
import { prisma } from '@/lib/prisma';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: Date;
}

const LIMITS = { FREE: 5, PRO: 999999, TEAM: 999999 };

export async function checkRateLimit(userId: string | null, plan: string = 'FREE'): Promise<RateLimitResult> {
  const limit = LIMITS[plan as keyof typeof LIMITS] ?? LIMITS.FREE;

  if (!userId) {
    // Anonymous users — track in memory (simplified; use Redis in prod)
    return { allowed: true, remaining: 3, limit: 3, resetAt: new Date(Date.now() + 86400000) };
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { allowed: false, remaining: 0, limit, resetAt: new Date() };

  const now = new Date();
  const resetNeeded = user.dailyReset < new Date(now.getTime() - 24 * 60 * 60 * 1000);

  if (resetNeeded) {
    await prisma.user.update({ where: { id: userId }, data: { dailyCount: 0, dailyReset: now } });
    return { allowed: true, remaining: limit - 1, limit, resetAt: new Date(now.getTime() + 86400000) };
  }

  const remaining = limit - user.dailyCount;
  if (remaining <= 0) {
    return { allowed: false, remaining: 0, limit, resetAt: user.dailyReset };
  }

  return { allowed: true, remaining: remaining - 1, limit, resetAt: user.dailyReset };
}

export async function incrementUsage(userId: string): Promise<void> {
  await prisma.user.update({ where: { id: userId }, data: { dailyCount: { increment: 1 } } });
}

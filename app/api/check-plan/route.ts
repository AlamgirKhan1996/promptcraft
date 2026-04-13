// app/api/check-plan/route.ts
// Used by test-payment page to verify DB upgrade happened
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ plan: 'FREE', error: 'Not signed in' });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: { plan: true, email: true, dailyCount: true },
  });

  return NextResponse.json({
    plan: user?.plan ?? 'FREE',
    email: user?.email,
    dailyCount: user?.dailyCount ?? 0,
  });
}

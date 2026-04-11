// app/api/webhooks/paypal/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const PLAN_MAP: Record<string, 'PRO' | 'TEAM'> = {
  [process.env.PAYPAL_PRO_MONTHLY_PLAN_ID!]:  'PRO',
  [process.env.PAYPAL_PRO_ANNUAL_PLAN_ID!]:   'PRO',
  [process.env.PAYPAL_TEAM_PLAN_ID!]:         'TEAM',
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subscriptionID, planId } = body;

    if (!subscriptionID || !planId) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    // Get the plan tier from planId
    const newPlan = PLAN_MAP[planId] ?? 'PRO';

    // Get current session to find user
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          plan: newPlan,
          // Store subscription ID for cancellation later
          // Add paypalSubscriptionId field to schema if needed
        },
      });
    }

    return NextResponse.json({ success: true, plan: newPlan });
  } catch (error) {
    console.error('PayPal webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}

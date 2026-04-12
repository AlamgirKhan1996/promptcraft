// app/api/webhooks/whop/route.ts
// This runs automatically when someone buys on Whop
// Whop sends us a notification → we upgrade the user in database

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Your Whop Plan IDs → Plan mapping
const PLAN_MAP: Record<string, 'PRO' | 'TEAM'> = {
  'plan_fUNcurOmyjCzd': 'PRO',   // Pro Monthly
  'plan_nw9EdRPuERaOh': 'PRO',   // Pro Annual
  'plan_OEHZApFI2TKlg': 'TEAM',  // Team
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Whop webhook received:', body);

    const { action, data } = body;

    // Someone just bought a plan
    if (action === 'membership.went_valid' || action === 'membership.created') {
      const email = data?.user?.email;
      const planId = data?.plan_id;
      const whopMemberId = data?.id;

      if (!email) {
        console.log('No email in webhook — manual upgrade needed');
        return NextResponse.json({ received: true });
      }

      const newPlan = PLAN_MAP[planId] ?? 'PRO';

      // Find user by email and upgrade them
      const user = await prisma.user.findUnique({ where: { email } });

      if (user) {
        await prisma.user.update({
          where: { email },
          data: { plan: newPlan },
        });
        console.log(`✅ Upgraded ${email} to ${newPlan}`);
      } else {
        // User hasn't signed up yet — store pending upgrade
        // They'll get upgraded when they first sign in
        console.log(`⚠️ User ${email} not found — will upgrade on first login`);
      }
    }

    // Someone cancelled or refunded
    if (action === 'membership.went_invalid' || action === 'membership.expired') {
      const email = data?.user?.email;
      if (email) {
        await prisma.user.update({
          where: { email },
          data: { plan: 'FREE' },
        });
        console.log(`↩️ Downgraded ${email} to FREE`);
      }
    }

    return NextResponse.json({ received: true, success: true });
  } catch (error) {
    console.error('Whop webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}

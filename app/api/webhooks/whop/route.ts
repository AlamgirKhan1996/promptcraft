// app/api/webhooks/whop/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const PLAN_MAP: Record<string, 'PRO' | 'TEAM'> = {
  'plan_fUNcurOmyjCzd': 'PRO',
  'plan_nw9EdRPuERaOh': 'PRO',
  'plan_OEHZApFI2TKlg': 'TEAM',
};

// Events that mean someone PAID
const ACTIVE_EVENTS = [
  'membership.activated',    // ← THIS is what Whop actually sends!
  'membership.went_valid',
  'membership.created',
  'membership.updated',
];

// Events that mean cancelled/expired
const INACTIVE_EVENTS = [
  'membership.went_invalid',
  'membership.expired',
  'membership.cancelled',
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Whop webhook received:', JSON.stringify(body, null, 2));

    const eventType = body.type;
    const data = body.data;
    const email = data?.user?.email;
    const planId = data?.plan?.id;
    const status = data?.status;

    console.log(`Event: ${eventType} | Email: ${email} | Plan: ${planId} | Status: ${status}`);

    // Handle active/paid events
    if (ACTIVE_EVENTS.includes(eventType) || status === 'completed' || status === 'active') {
      if (!email) {
        console.log('No email found in webhook');
        return NextResponse.json({ received: true, note: 'no email' });
      }

      const newPlan = PLAN_MAP[planId] ?? 'PRO';

      // Try to find user by email
      const user = await prisma.user.findUnique({ where: { email } });

      if (user) {
        await prisma.user.update({
          where: { email },
          data: { plan: newPlan },
        });
        console.log(`✅ Upgraded ${email} to ${newPlan}`);
      } else {
        console.log(`⚠️ User ${email} not in DB yet — they need to sign in first`);
      }

      return NextResponse.json({ 
        received: true, 
        action: 'upgrade',
        email, 
        plan: newPlan,
        userFound: !!user,
      });
    }

    // Handle cancellation
    if (INACTIVE_EVENTS.includes(eventType)) {
      if (email) {
        await prisma.user.updateMany({
          where: { email },
          data: { plan: 'FREE' },
        });
        console.log(`↩️ Downgraded ${email} to FREE`);
      }
      return NextResponse.json({ received: true, action: 'downgrade', email });
    }

    return NextResponse.json({ received: true, action: 'ignored', eventType });
  } catch (error) {
    console.error('Whop webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}

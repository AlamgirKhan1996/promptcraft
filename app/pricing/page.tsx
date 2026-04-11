'use client';
// app/pricing/page.tsx
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

// ============================================
// PASTE YOUR PAYPAL PLAN IDs HERE
// ============================================
const PAYPAL_PLANS = {
  pro_monthly: 'P-1U036717XP624005NNHM6KOQ',
  pro_annual:  'P-7PM213498W2163100NHM6QBQ',
  team:        'P-1HS41106YT741741DNHM6SVY',
};
// ============================================

function PayPalButton({ planId }: { planId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendered = useRef(false);

  useEffect(() => {
    if (rendered.current) return;
    if (!planId.startsWith('P-')) return;

    const tryRender = () => {
      if (!(window as any).paypal || !containerRef.current) {
        setTimeout(tryRender, 500);
        return;
      }
      rendered.current = true;
      containerRef.current.innerHTML = '';
      (window as any).paypal.Buttons({
        style: {
          shape: 'rect',
          color: 'blue',
          layout: 'horizontal',
          label: 'subscribe',
          tagline: false,
          height: 44,
        },
        createSubscription: (_data: any, actions: any) =>
          actions.subscription.create({ plan_id: planId }),
        onApprove: (data: any) => {
          fetch('/api/webhooks/paypal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              subscriptionID: data.subscriptionID,
              planId,
            }),
          });
          window.location.href = '/dashboard?upgraded=true';
        },
        onError: () => {
          alert('Payment failed. Please try again or contact support@promptifill.com');
        },
      }).render(containerRef.current);
    };

    tryRender();
  }, [planId]);

  return (<div><div ref={containerRef} style={{ marginTop: 12, minHeight: 44 }} />
  {/* Card logos */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 6, marginTop: 8,
      }}>
        <span style={{ fontSize: 11, color: 'var(--text3)' }}>Also accepts:</span>
        {['VISA', 'MC', 'AMEX'].map((card) => (
          <span key={card} style={{
            fontSize: 10, fontWeight: 700, padding: '2px 6px',
            borderRadius: 4, border: '1px solid var(--border2)',
            color: 'var(--text3)', background: 'var(--bg3)',
          }}>{card}</span>
        ))}
      </div>
    </div>
  );
  
}

function PayPalScript() {
  useEffect(() => {
    if (document.querySelector('#paypal-sdk')) return;
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'sb';
    const script = document.createElement('script');
    script.id = 'paypal-sdk';
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&vault=true&intent=subscription`;
    script.async = true;
    document.body.appendChild(script);
  }, []);
  return null;
}

const plans = [
  {
    id: 'free',
    name: 'Free',
    badge: 'No credit card',
    amount: '0',
    period: '/month',
    desc: 'Try PromptiFill and see the magic. No commitment.',
    features: [
      '5 prompt generations per day',
      '3 categories (Business, Coding, Social)',
      'Copy & use prompts anywhere',
      'Basic quality scoring',
      'Community templates',
    ],
    primary: false,
    planId: null,
    annual: null,
  },
  {
    id: 'pro',
    name: 'Pro',
    badge: '🔥 Most Popular',
    amount: '9',
    period: '/month',
    desc: 'Unlimited prompts for founders, creators, and professionals.',
    features: [
      'Unlimited generations',
      'All 10 categories',
      'Arabic GCC prompts',
      'Full prompt history & library',
      'Quality scoring on every prompt',
      'No watermark on shares',
      'Priority AI speed',
    ],
    primary: true,
    planId: PAYPAL_PLANS.pro_monthly,
    annual: {
      planId: PAYPAL_PLANS.pro_annual,
      price: '$79/year',
      saving: 'Save $29',
    },
  },
  {
    id: 'team',
    name: 'Team',
    badge: 'Up to 5 members',
    amount: '29',
    period: '/month',
    desc: 'For agencies and teams with shared prompt libraries.',
    features: [
      'Everything in Pro',
      'Up to 5 team members',
      'Shared prompt library',
      'Admin dashboard',
      'Priority WhatsApp support',
    ],
    primary: false,
    planId: PAYPAL_PLANS.team,
    annual: null,
  },
];

export default function PricingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <PayPalScript />
      <Navbar />

      <section style={{ padding: '70px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, color: '#6366f1', textTransform: 'uppercase', marginBottom: 12 }}>
          Pricing
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: 'var(--text1)', marginBottom: 14 }}>
          Simple, transparent pricing
        </h1>
        <p style={{ fontSize: 17, color: 'var(--text2)', maxWidth: 480, margin: '0 auto 48px', lineHeight: 1.6 }}>
          Start free. Upgrade when you are ready for unlimited AI prompts.
        </p>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 16, maxWidth: 960, margin: '0 auto 32px' }}>
          {plans.map((plan) => (
            <div key={plan.name} style={{
              background: plan.primary ? 'rgba(99,102,241,0.06)' : 'var(--bg2)',
              border: `1px solid ${plan.primary ? 'rgba(99,102,241,0.45)' : 'var(--border)'}`,
              borderRadius: 16, padding: '28px 24px', textAlign: 'left',
            }}>
              {/* Badge */}
              <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: 'rgba(99,102,241,0.15)', color: '#6366f1', marginBottom: 16 }}>
                {plan.badge}
              </div>

              {/* Name + Price */}
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text1)', marginBottom: 6 }}>{plan.name}</div>
              <div style={{ marginBottom: 6 }}>
                <span style={{ fontSize: 38, fontWeight: 700, color: 'var(--text1)' }}>${plan.amount}</span>
                <span style={{ fontSize: 15, color: 'var(--text3)' }}>{plan.period}</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 20, lineHeight: 1.5 }}>{plan.desc}</div>

              {/* Features */}
              <ul style={{ listStyle: 'none', marginBottom: 24, padding: 0 }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ fontSize: 13, color: 'var(--text2)', padding: '6px 0', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#4ade80' }}>✓</span> {f}
                  </li>
                ))}
              </ul>

              {/* Free button */}
              {plan.id === 'free' && (
                <Link href="/generate" style={{ display: 'block', textAlign: 'center', padding: 13, borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none', background: 'transparent', color: 'var(--text2)', border: '1px solid var(--border2)' }}>
                  Start Free
                </Link>
              )}

              {/* PayPal monthly button */}
              {plan.planId && (
                <div>
                  <PayPalButton planId={plan.planId} />

                  {/* Annual upsell */}
                  {plan.annual && (
                    <div style={{ marginTop: 14, padding: '14px', borderRadius: 10, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
                      <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text3)', marginBottom: 4 }}>
                        💡 Save more with annual billing
                      </div>
                      <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 700, color: '#6366f1', marginBottom: 2 }}>
                        {plan.annual.price}
                      </div>
                      <div style={{ textAlign: 'center', fontSize: 12, color: '#4ade80', marginBottom: 8 }}>
                        {plan.annual.saving} vs monthly
                      </div>
                      <PayPalButton planId={plan.annual.planId} />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
          {[
            '🔒 Secure PayPal Payment',
            '↩ 7-Day Money-Back',
            '✕ Cancel Anytime',
            '🌍 200+ Countries',
          ].map((b) => (
            <span key={b} style={{ fontSize: 13, color: 'var(--text3)' }}>{b}</span>
          ))}
        </div>

        <p style={{ fontSize: 13, color: 'var(--text3)' }}>
          By subscribing you agree to our{' '}
          <Link href="/terms" style={{ color: '#6366f1', textDecoration: 'none' }}>Terms of Service</Link>
          {' · '}
          <Link href="/privacy" style={{ color: '#6366f1', textDecoration: 'none' }}>Privacy Policy</Link>
          {' · '}
          <Link href="/refund" style={{ color: '#6366f1', textDecoration: 'none' }}>Refund Policy</Link>
        </p>
      </section>

      <Footer />
    </div>
  );
}

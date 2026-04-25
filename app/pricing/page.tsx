'use client';
// app/pricing/page.tsx — Whop Checkout Integrated
import { useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

// ─── WHOP PLAN IDs ───────────────────────────────
const PLANS = {
  pro:    'plan_fUNcurOmyjCzd',
  annual: 'plan_nw9EdRPuERaOh',
  team:   'plan_OEHZApFI2TKlg',
};
// ─────────────────────────────────────────────────

function WhopScript() {
  useEffect(() => {
    if (document.querySelector('#whop-script')) return;
    const script = document.createElement('script');
    script.id = 'whop-script';
    script.src = 'https://js.whop.com/static/checkout/loader.js';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, []);
  return null;
}

function WhopButton({ planId, label, primary }: { planId: string; label: string; primary?: boolean }) {
  return (
    <div style={{ marginTop: 12 }}>
      {/* Whop native embed button */}

      {/* Fallback direct link */}
      <a
        href={`https://whop.com/checkout/${planId}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 8, padding: '13px', borderRadius: 10, marginTop: 8,
          fontSize: 14, fontWeight: 600, textDecoration: 'none',
          background: primary ? 'var(--accent)' : 'transparent',
          color: primary ? 'white' : 'var(--text2)',
          border: primary ? 'none' : '1px solid var(--border2)',
          transition: 'all 0.2s',
        }}
      >
        {label}
      </a>
    </div>
  );
}

const features = {
  free: [
    '5 prompt generations per day',
    '3 categories (Business, Coding, Social)',
    'Copy & use prompts anywhere',
    'Basic quality scoring',
    'Community templates',
  ],
  pro: [
    'Unlimited generations',
    'All 10 categories',
    'Arabic GCC prompts',
    'Full prompt history & library',
    'Quality scoring on every prompt',
    'No watermark on shares',
    'Priority AI speed',
    'Access to community',
  ],
  team: [
    'Everything in Pro',
    'Up to 5 team members',
    'Shared prompt library',
    'Admin dashboard',
    'Priority WhatsApp support',
    'Team analytics',
  ],
};

export default function PricingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />

      <section style={{ padding: '70px 24px', textAlign: 'center' }}>

        {/* Header */}
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 12 }}>
          Pricing
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: 'var(--text1)', marginBottom: 14 }}>
          Simple, transparent pricing
        </h1>
        <p style={{ fontSize: 17, color: 'var(--text2)', maxWidth: 500, margin: '0 auto 16px', lineHeight: 1.6 }}>
          Start free. Upgrade when you're ready for unlimited AI prompts.
        </p>

        {/* Promo banner */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '10px 20px', borderRadius: 30, marginBottom: 48,
          background: 'rgba(74,222,128,0.1)',
          border: '1px solid rgba(74,222,128,0.3)',
          fontSize: 14, fontWeight: 600, color: '#4ade80',
        }}>
          🎉 Launch offer: Use code <span style={{
            background: 'rgba(74,222,128,0.2)', padding: '2px 10px',
            borderRadius: 6, fontFamily: 'monospace', letterSpacing: 1,
          }}>LAUNCH</span> for 20% off your first payment!
        </div>

        {/* Pricing cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
          gap: 16, maxWidth: 980, margin: '0 auto 40px',
        }}>

          {/* FREE */}
          <div style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 16, padding: '28px 24px', textAlign: 'left',
          }}>
            <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: 'rgba(255,255,255,0.06)', color: 'var(--text3)', marginBottom: 16 }}>
              No credit card
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text1)', marginBottom: 6 }}>Free</div>
            <div style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 38, fontWeight: 700, color: 'var(--text1)' }}>$0</span>
              <span style={{ fontSize: 15, color: 'var(--text3)' }}>/month</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 20, lineHeight: 1.5 }}>
              Try PromptiFill and see the magic. No commitment.
            </div>
            <ul style={{ listStyle: 'none', marginBottom: 24, padding: 0 }}>
              {features.free.map((f) => (
                <li key={f} style={{ fontSize: 13, color: 'var(--text2)', padding: '7px 0', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#4ade80', fontWeight: 700 }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <Link href="/generate" style={{
              display: 'block', textAlign: 'center', padding: 13, borderRadius: 10,
              fontSize: 14, fontWeight: 600, textDecoration: 'none',
              background: 'transparent', color: 'var(--text2)',
              border: '1px solid var(--border2)',
            }}>
              Start Free
            </Link>
          </div>

          {/* PRO — Featured */}
          <div style={{
            background: 'rgba(99,102,241,0.06)',
            border: '1px solid rgba(99,102,241,0.45)',
            borderRadius: 16, padding: '28px 24px', textAlign: 'left',
            position: 'relative',
          }}>
            {/* Most popular badge */}
            <div style={{
              position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
              background: 'var(--accent)', color: 'white',
              fontSize: 11, fontWeight: 700, padding: '4px 14px',
              borderRadius: 20, whiteSpace: 'nowrap',
            }}>🔥 MOST POPULAR</div>

            <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: 'rgba(99,102,241,0.15)', color: 'var(--accent)', marginBottom: 16 }}>
              Unlimited everything
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text1)', marginBottom: 6 }}>Pro</div>
            <div style={{ marginBottom: 4 }}>
              <span style={{ fontSize: 38, fontWeight: 700, color: 'var(--text1)' }}>$9.99</span>
              <span style={{ fontSize: 15, color: 'var(--text3)' }}>/month</span>
            </div>
            <div style={{ fontSize: 12, color: '#4ade80', fontWeight: 600, marginBottom: 12 }}>
              First month $7.99 with code LAUNCH
            </div>
            <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 20, lineHeight: 1.5 }}>
              Unlimited prompts for founders, creators, and professionals.
            </div>
            <ul style={{ listStyle: 'none', marginBottom: 20, padding: 0 }}>
              {features.pro.map((f) => (
                <li key={f} style={{ fontSize: 13, color: 'var(--text2)', padding: '7px 0', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#4ade80', fontWeight: 700 }}>✓</span> {f}
                </li>
              ))}
            </ul>

            {/* Whop Pro button */}
            <WhopButton planId={PLANS.pro} label="Upgrade to Pro — $9.99/mo" primary />

            {/* Annual upsell */}
            <div style={{
              marginTop: 14, padding: '14px 16px', borderRadius: 10,
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.2)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text1)' }}>Annual Plan</div>
                  <div style={{ fontSize: 12, color: '#4ade80' }}>Save 34% — $79/year</div>
                </div>
                <div style={{ fontSize: 11, background: 'rgba(74,222,128,0.15)', color: '#4ade80', padding: '3px 8px', borderRadius: 20, fontWeight: 600 }}>
                  BEST VALUE
                </div>
              </div>
              <WhopButton planId={PLANS.annual} label="Get Annual — $79/year" />
            </div>
          </div>

          {/* TEAM */}
          <div style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 16, padding: '28px 24px', textAlign: 'left',
          }}>
            <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: 'rgba(255,255,255,0.06)', color: 'var(--text3)', marginBottom: 16 }}>
              Up to 5 members
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text1)', marginBottom: 6 }}>Team</div>
            <div style={{ marginBottom: 4 }}>
              <span style={{ fontSize: 38, fontWeight: 700, color: 'var(--text1)' }}>$29</span>
              <span style={{ fontSize: 15, color: 'var(--text3)' }}>/month</span>
            </div>
            <div style={{ fontSize: 12, color: '#4ade80', fontWeight: 600, marginBottom: 12 }}>
              First month $23.20 with code LAUNCH
            </div>
            <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 20, lineHeight: 1.5 }}>
              For agencies and teams with shared prompt libraries.
            </div>
            <ul style={{ listStyle: 'none', marginBottom: 24, padding: 0 }}>
              {features.team.map((f) => (
                <li key={f} style={{ fontSize: 13, color: 'var(--text2)', padding: '7px 0', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#4ade80', fontWeight: 700 }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <WhopButton planId={PLANS.team} label="Start Team Plan — $29/mo" />
          </div>
        </div>

        {/* Whop community link */}
        <div style={{
          maxWidth: 500, margin: '0 auto 32px',
          padding: '18px 24px', borderRadius: 14,
          background: 'var(--bg2)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left',
        }}>
          <span style={{ fontSize: 32 }}>💬</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text1)', marginBottom: 3 }}>
              Join the PromptiFill Community
            </div>
            <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 8 }}>
              Get prompts, templates, tips and connect with other members.
            </div>
            <a
              href="https://whop.com/promptifill"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}
            >
              Visit community → whop.com/promptifill
            </a>
          </div>
        </div>

        {/* Trust badges */}
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
          {[
            '🔒 Secure Checkout via Whop',
            '↩ 7-Day Money-Back',
            '✕ Cancel Anytime',
            '🌍 200+ Countries',
            '💳 Visa / Mastercard / PayPal',
          ].map((b) => (
            <span key={b} style={{ fontSize: 13, color: 'var(--text3)' }}>{b}</span>
          ))}
        </div>

        <p style={{ fontSize: 13, color: 'var(--text3)' }}>
          By subscribing you agree to our{' '}
          <Link href="/terms" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Terms of Service</Link>
          {' · '}
          <Link href="/privacy" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Privacy Policy</Link>
          {' · '}
          <Link href="/refund" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Refund Policy</Link>
        </p>

      </section>
      <Footer />
    </div>
  );
}

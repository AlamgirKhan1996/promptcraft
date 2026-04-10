// app/pricing/page.tsx
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const plans = [
  {
    name: 'Free', badge: 'No credit card', amount: '0', period: '/month',
    desc: 'Try PromptCraft and see the magic. No commitment.',
    features: ['5 prompt generations per day', '3 categories (Business, Coding, Social)', 'Copy & use prompts anywhere', 'Basic quality scoring', 'Community templates'],
    cta: 'Start Free', href: '/generate', primary: false,
  },
  {
    name: 'Pro', badge: '🔥 Most Popular', amount: '9', period: '/month',
    desc: 'Unlimited prompts for founders, creators, and professionals.',
    features: ['Unlimited generations', 'All 10 categories', 'Arabic GCC prompts', 'Full prompt history & library', 'Favorites & folders', 'No watermark on shares', 'Priority AI (faster responses)', 'Export to PDF'],
    cta: 'Upgrade to Pro', href: '/api/checkout/pro', primary: true,
  },
  {
    name: 'Team', badge: 'Up to 5 members', amount: '29', period: '/month',
    desc: 'For agencies and teams with shared prompt libraries.',
    features: ['Everything in Pro', 'Up to 5 team members', 'Shared prompt library', 'Team admin dashboard', 'Usage analytics', 'Custom branding', 'Priority support (WhatsApp)'],
    cta: 'Start Team Plan', href: '/api/checkout/team', primary: false,
  },
];

export default function PricingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <section style={{ padding: '70px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 12 }}>Pricing</div>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: 'var(--text1)', marginBottom: 14 }}>Simple, transparent pricing</h1>
        <p style={{ fontSize: 17, color: 'var(--text2)', maxWidth: 480, margin: '0 auto 48px', lineHeight: 1.6 }}>
          Start free. Upgrade when you are ready for unlimited AI prompts.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 16, maxWidth: 960, margin: '0 auto' }}>
          {plans.map((plan) => (
            <div key={plan.name} style={{
              background: plan.primary ? 'rgba(99,102,241,0.06)' : 'var(--bg2)',
              border: `1px solid ${plan.primary ? 'rgba(99,102,241,0.45)' : 'var(--border)'}`,
              borderRadius: 16, padding: '28px 24px', textAlign: 'left',
            }}>
              <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: 'rgba(99,102,241,0.15)', color: 'var(--accent)', marginBottom: 16 }}>{plan.badge}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text1)', marginBottom: 6 }}>{plan.name}</div>
              <div style={{ marginBottom: 6 }}>
                <span style={{ fontSize: 38, fontWeight: 700, color: 'var(--text1)' }}>${plan.amount}</span>
                <span style={{ fontSize: 15, color: 'var(--text3)' }}>{plan.period}</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 20, lineHeight: 1.5 }}>{plan.desc}</div>
              <ul style={{ listStyle: 'none', marginBottom: 24 }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ fontSize: 13, color: 'var(--text2)', padding: '6px 0', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: 'var(--success)' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href={plan.href} style={{
                display: 'block', textAlign: 'center', padding: 13, borderRadius: 10,
                fontSize: 14, fontWeight: 600, textDecoration: 'none',
                background: plan.primary ? 'var(--accent)' : 'transparent',
                color: plan.primary ? 'white' : 'var(--text2)',
                border: plan.primary ? 'none' : '1px solid var(--border2)',
              }}>{plan.cta}</Link>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 32 }}>
          All plans include a 7-day money-back guarantee · Cancel anytime · Secure payment via Paddle
        </p>
        <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 10 }}>
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

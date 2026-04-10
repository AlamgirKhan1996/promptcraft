// app/contact/page.tsx
import Link from 'next/link';

export const metadata = {
  title: 'Contact Us — PromptiFill',
  description: 'Get in touch with the PromptiFill team',
};

export default function ContactPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text1)' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontSize: 18, fontWeight: 700, color: 'var(--text1)', textDecoration: 'none' }}>
          Prompti<span style={{ color: '#6366f1' }}>Fill</span>
        </Link>
        <Link href="/" style={{ fontSize: 14, color: 'var(--text3)', textDecoration: 'none' }}>← Back to Home</Link>
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '70px 24px' }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>👋</div>
          <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 12 }}>Get in Touch</h1>
          <p style={{ fontSize: 16, color: 'var(--text2)', lineHeight: 1.7 }}>
            Have a question, issue, or just want to say hello?<br />
            We reply to every message within 24 hours.
          </p>
        </div>

        {/* Contact cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 40 }}>
          {[
            {
              icon: '💬',
              title: 'General Inquiries',
              desc: 'Questions about PromptiFill, features, or partnerships',
              email: 'hi@promptifill.com',
              label: 'Email us',
            },
            {
              icon: '🛠',
              title: 'Technical Support',
              desc: 'Bug reports, account issues, or something not working',
              email: 'support@promptifill.com',
              label: 'Get support',
            },
            {
              icon: '💳',
              title: 'Billing & Payments',
              desc: 'Subscription changes, refund requests, or invoice needs',
              email: 'support@promptifill.com',
              label: 'Billing help',
            },
            {
              icon: '🤝',
              title: 'Partnerships',
              desc: 'Affiliate program, business partnerships, or press inquiries',
              email: 'hi@promptifill.com',
              label: 'Partner with us',
            },
          ].map((card) => (
            <a
              key={card.title}
              href={`mailto:${card.email}?subject=${encodeURIComponent(card.title)}`}
              style={{
                display: 'block', padding: '22px', borderRadius: 14, textDecoration: 'none',
                background: 'var(--bg2)', border: '1px solid var(--border)',
                transition: 'all 0.2s', cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 10 }}>{card.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text1)', marginBottom: 6 }}>{card.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text3)', lineHeight: 1.6, marginBottom: 14 }}>{card.desc}</div>
              <div style={{ fontSize: 13, color: '#6366f1', fontWeight: 500 }}>{card.label} →</div>
            </a>
          ))}
        </div>

        {/* Direct email box */}
        <div style={{
          padding: '28px', borderRadius: 16,
          background: 'rgba(99,102,241,0.07)',
          border: '1px solid rgba(99,102,241,0.25)',
          textAlign: 'center',
          marginBottom: 32,
        }}>
          <div style={{ fontSize: 14, color: 'var(--text3)', marginBottom: 8 }}>Or email us directly at</div>
          <a
            href="mailto:hi@promptifill.com"
            style={{ fontSize: 22, fontWeight: 700, color: '#6366f1', textDecoration: 'none' }}
          >
            hi@promptifill.com
          </a>
          <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 10 }}>
            ⚡ Average response time: under 24 hours
          </div>
        </div>

        {/* Social links */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: 'var(--text3)', marginBottom: 16 }}>Also find us on</div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: '𝕏 Twitter', href: 'https://twitter.com/promptifill_ai' },
              { label: '📸 Instagram', href: 'https://instagram.com/promptifill' },
              { label: '💼 LinkedIn', href: 'https://linkedin.com/company/promptifill' },
              { label: '🐙 GitHub', href: 'https://github.com/promptifill' },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '8px 18px', borderRadius: 20, fontSize: 13, fontWeight: 500,
                  background: 'var(--bg2)', border: '1px solid var(--border)',
                  color: 'var(--text2)', textDecoration: 'none', transition: 'all 0.2s',
                }}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* Footer links */}
        <div style={{ marginTop: 52, paddingTop: 24, borderTop: '1px solid var(--border)', display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { label: 'Pricing', href: '/pricing' },
            { label: 'Terms of Service', href: '/terms' },
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Refund Policy', href: '/refund' },
          ].map(({ label, href }) => (
            <Link key={label} href={href} style={{ fontSize: 13, color: 'var(--text3)', textDecoration: 'none' }}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

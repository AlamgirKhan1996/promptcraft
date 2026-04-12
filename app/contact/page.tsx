// app/contact/page.tsx
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
  title: 'Contact Us — PromptiFill',
  description: 'Get in touch with the PromptiFill team',
};

export default function ContactPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '60px 24px' }}>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>👋</div>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: 'var(--text1)', marginBottom: 12 }}>
            Get in Touch
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text2)', lineHeight: 1.7 }}>
            We reply to every message within 24 hours.
          </p>
        </div>

        {/* Contact cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 14, marginBottom: 32,
        }}>
          {[
            {
              icon: '💬',
              title: 'General Inquiries',
              desc: 'Questions about PromptiFill, features, or partnerships',
              action: 'mailto:hi@promptifill.com?subject=General Inquiry',
              label: 'hi@promptifill.com',
            },
            {
              icon: '🛠',
              title: 'Technical Support',
              desc: 'Bug reports, account issues, or something not working',
              action: 'mailto:support@promptifill.com?subject=Technical Support',
              label: 'support@promptifill.com',
            },
            {
              icon: '💳',
              title: 'Billing & Payments',
              desc: 'Subscription changes, refunds, or invoice needs',
              action: 'mailto:support@promptifill.com?subject=Billing Help',
              label: 'support@promptifill.com',
            },
            {
              icon: '🤝',
              title: 'Partnerships',
              desc: 'Affiliates, business partnerships, or press',
              action: 'mailto:hi@promptifill.com?subject=Partnership Inquiry',
              label: 'hi@promptifill.com',
            },
          ].map((card) => (
            <a
              key={card.title}
              href={card.action}
              style={{
                display: 'block', padding: '22px', borderRadius: 14,
                textDecoration: 'none', background: 'var(--bg2)',
                border: '1px solid var(--border)', transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 10 }}>{card.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text1)', marginBottom: 6 }}>
                {card.title}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text3)', lineHeight: 1.6, marginBottom: 12 }}>
                {card.desc}
              </div>
              <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 500 }}>
                {card.label} →
              </div>
            </a>
          ))}
        </div>

        {/* Direct email */}
        <div style={{
          padding: '28px', borderRadius: 16, textAlign: 'center', marginBottom: 28,
          background: 'rgba(99,102,241,0.07)',
          border: '1px solid rgba(99,102,241,0.25)',
        }}>
          <div style={{ fontSize: 14, color: 'var(--text3)', marginBottom: 8 }}>
            Or email us directly
          </div>
          <a
            href="mailto:hi@promptifill.com"
            style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent)', textDecoration: 'none' }}
          >
            hi@promptifill.com
          </a>
          <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 10 }}>
            ⚡ Average response: under 24 hours
          </div>
        </div>

        {/* WhatsApp button */}
        <a
          href="https://wa.me/YOUR_NUMBER?text=Hi%20PromptiFill%20team!"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 10, padding: '14px', borderRadius: 12, marginBottom: 28,
            background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)',
            color: '#25D366', fontWeight: 600, fontSize: 15, textDecoration: 'none',
          }}
        >
          💬 Chat on WhatsApp
        </a>

        {/* Social links */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 14, color: 'var(--text3)', marginBottom: 14 }}>
            Also find us on
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: '𝕏 Twitter', href: 'https://twitter.com/promptifill_ai' },
              { label: '📸 Instagram', href: 'https://instagram.com/promptifill' },
              { label: '💼 LinkedIn', href: 'https://linkedin.com/company/promptifill' },
              { label: '🎵 TikTok', href: 'https://tiktok.com/@promptifill' },
              { label: '🐙 GitHub', href: 'https://github.com/promptifill' },
              { label: '💬 Community', href: 'https://whop.com/promptifill' },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '8px 16px', borderRadius: 20, fontSize: 13,
                  fontWeight: 500, background: 'var(--bg2)',
                  border: '1px solid var(--border)', color: 'var(--text2)',
                  textDecoration: 'none', transition: 'all 0.2s',
                }}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* Legal links */}
        <div style={{
          paddingTop: 24, borderTop: '1px solid var(--border)',
          display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap',
        }}>
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
      <Footer />
    </div>
  );
}

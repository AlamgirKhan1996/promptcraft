// app/idm/page.tsx
// Special page for IDMPakistan students
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
  title: 'IDMPakistan Special Offer — PromptiFill',
  description: 'Exclusive discount for IDMPakistan students and alumni',
};

export default function IDMPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '60px 24px' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          {/* Special badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 20px', borderRadius: 30, marginBottom: 24,
            background: 'rgba(74,222,128,0.1)',
            border: '1px solid rgba(74,222,128,0.3)',
            fontSize: 14, fontWeight: 600, color: '#4ade80',
          }}>
            🎓 Exclusive IDMPakistan Student Offer
          </div>

          <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: 'var(--text1)', marginBottom: 16, lineHeight: 1.2 }}>
            AI Tools for Digital
            <br />
            <span style={{ background: 'linear-gradient(90deg, #6366f1, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Marketing Students
            </span>
          </h1>

          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.7, maxWidth: 520, margin: '0 auto 24px' }}>
            I learned digital marketing from IDMPakistan in 2022.
            It changed my career. This tool is my way of giving back
            to the community that shaped me.
          </p>

          {/* Founder note */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '10px 20px', borderRadius: 12,
            background: 'var(--bg2)', border: '1px solid var(--border)',
            fontSize: 14, color: 'var(--text2)',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #22d3ee)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700, color: 'white', flexShrink: 0,
            }}>A</div>
            <span>— Alamgir Khan, IDMPakistan Alumni 2022 · Founder, PromptiFill</span>
          </div>
        </div>

        {/* Discount offer box */}
        <div style={{
          background: 'rgba(99,102,241,0.08)',
          border: '2px solid rgba(99,102,241,0.4)',
          borderRadius: 20, padding: '32px 28px',
          textAlign: 'center', marginBottom: 32,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, right: 0,
            background: 'var(--accent)', color: 'white',
            fontSize: 12, fontWeight: 700, padding: '6px 16px',
            borderBottomLeftRadius: 12,
          }}>IDM EXCLUSIVE</div>

          <div style={{ fontSize: 15, color: 'var(--text2)', marginBottom: 8 }}>
            Your exclusive discount code
          </div>
          <div style={{
            fontSize: 42, fontWeight: 800, letterSpacing: 6,
            background: 'linear-gradient(90deg, #6366f1, #22d3ee)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: 8,
          }}>
            IDM40
          </div>
          <div style={{ fontSize: 16, color: '#4ade80', fontWeight: 600, marginBottom: 20 }}>
            40% off your first 3 months 🎉
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 12, marginBottom: 28,
          }}>
            {[
              { plan: 'Pro Monthly', original: '$9.99', discounted: '$5.99', period: '/mo for 3 months' },
              { plan: 'Pro Annual', original: '$79', discounted: '$47.40', period: 'first year' },
              { plan: 'Team', original: '$29', discounted: '$17.40', period: '/mo for 3 months' },
            ].map((p) => (
              <div key={p.plan} style={{
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: 12, padding: '16px',
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text1)', marginBottom: 6 }}>{p.plan}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', textDecoration: 'line-through', marginBottom: 2 }}>{p.original}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#4ade80' }}>{p.discounted}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>{p.period}</div>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <a
              href={`https://whop.com/checkout/plan_fUNcurOmyjCzd?discount_code=IDM40`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block', padding: '15px', borderRadius: 12,
                fontSize: 16, fontWeight: 700, textDecoration: 'none',
                background: 'var(--accent)', color: 'white',
              }}
            >
              Get Pro — $5.99/mo with IDM40 →
            </a>
            <a
              href={`https://whop.com/checkout/plan_nw9EdRPuERaOh?discount_code=IDM40`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block', padding: '13px', borderRadius: 12,
                fontSize: 14, fontWeight: 600, textDecoration: 'none',
                background: 'transparent', color: 'var(--text2)',
                border: '1px solid var(--border2)',
              }}
            >
              Get Annual — $47.40/year (best value)
            </a>
          </div>

          <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 14 }}>
            Code applies at checkout automatically via the links above.
            Or enter IDM40 manually at checkout.
          </div>
        </div>

        {/* Why this tool for DM students */}
        <div style={{
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 16, padding: '28px', marginBottom: 28,
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text1)', marginBottom: 20 }}>
            Why Every Digital Marketer Needs This
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              {
                icon: '📱',
                title: 'Social Media Content',
                desc: 'Generate perfect Instagram captions, LinkedIn posts, TikTok scripts for ANY brand in seconds. No more staring at blank screens.',
              },
              {
                icon: '📧',
                title: 'Email Marketing',
                desc: 'Cold outreach, newsletters, follow-up sequences — structured prompts that get AI to write emails that actually convert.',
              },
              {
                icon: '🛒',
                title: 'eCommerce Copy',
                desc: 'Product descriptions, ad copy, WhatsApp broadcasts — built specifically for Noon, Amazon KSA, and Salla stores.',
              },
              {
                icon: '🌍',
                title: 'Arabic Content',
                desc: 'The only AI tool with a dedicated Arabic GCC category. Write professional Arabic marketing content — not just translated English.',
              },
              {
                icon: '📊',
                title: 'Client Work',
                desc: 'Deliver better work to your clients faster. Bill the same rate. Finish in half the time. Keep the difference.',
              },
            ].map((item) => (
              <div key={item.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text1)', marginBottom: 4 }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--text3)', lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Personal message */}
        <div style={{
          background: 'rgba(99,102,241,0.06)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: 16, padding: '24px 28px', marginBottom: 28,
        }}>
          <div style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.85, fontStyle: 'italic' }}>
            "IDMPakistan taught me the fundamentals of digital marketing that I still use every day.
            When I decided to build PromptiFill, I wanted to make sure my IDM community had
            access to it first — and at a price that makes sense for students and early-career
            professionals. Use this tool. Learn with it. Build your career with it.
            And when you succeed — pay it forward."
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text1)', marginTop: 16 }}>
            — Alamgir Khan
          </div>
          <div style={{ fontSize: 13, color: 'var(--text3)' }}>
            IDMPakistan Batch 2022 · Founder, PromptiFill · Riyadh, Saudi Arabia
          </div>
        </div>

        {/* Share with group */}
        <div style={{
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 14, padding: '20px 24px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text1)', marginBottom: 8 }}>
            📲 Share with your IDM batch!
          </div>
          <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 16 }}>
            Copy this link and share in your IDMPakistan WhatsApp group:
          </div>
          <div style={{
            background: 'var(--bg3)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '10px 16px', fontSize: 14,
            fontFamily: 'monospace', color: 'var(--accent)',
            marginBottom: 12,
          }}>
            promptifill.com/idm
          </div>
          <div style={{ fontSize: 12, color: 'var(--text3)' }}>
            Code IDM40 — 40% off for 3 months. Valid for all IDMPakistan students and alumni.
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}

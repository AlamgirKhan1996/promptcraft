'use client';
// components/onboarding/BuildShowcase.tsx
// Shows the /build feature on the landing page
// Highlights the $9/year website story

import { useState, useEffect } from 'react';

const STEPS_ANIMATION = [
  { n: '1', icon: '✦', title: 'Generate Prompt', desc: 'Fill 7 fields → perfect Claude prompt', color: '#6366f1', time: 0 },
  { n: '2', icon: '🤖', title: 'Claude Builds It', desc: 'Paste prompt → complete website code', color: '#22d3ee', time: 800 },
  { n: '3', icon: '⚡', title: 'Deploy on Vercel', desc: 'Push to GitHub → live in 2 minutes', color: '#4ade80', time: 1600 },
  { n: '4', icon: '🌐', title: 'Add $9 Domain', desc: 'Professional URL from Namecheap', color: '#f59e0b', time: 2400 },
];

export function BuildShowcase() {
  const [activeStep, setActiveStep] = useState(0);
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    if (!animating) return;
    const t = setInterval(() => {
      setActiveStep(s => (s + 1) % STEPS_ANIMATION.length);
    }, 1800);
    return () => clearInterval(t);
  }, [animating]);

  return (
    <section style={{ padding: '80px 24px', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>

          {/* LEFT — Content */}
          <div>
            {/* Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 20, background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)', fontSize: 12, color: '#4ade80', fontWeight: 600, marginBottom: 20, textTransform: 'uppercase', letterSpacing: 1 }}>
              🆕 New Feature
            </div>

            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 800, color: 'var(--text1)', lineHeight: 1.2, marginBottom: 16 }}>
              Build a real website<br />
              <span style={{ background: 'linear-gradient(90deg, #6366f1, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                for $9/year.
              </span>
            </h2>

            <p style={{ fontSize: 16, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 24 }}>
              Stop paying $200/year for website builders. Use our AI prompts → Claude writes your code → deploy free on Vercel → add a $9 domain. Done.
            </p>

            {/* Comparison */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 32, flexWrap: 'wrap' }}>
              {[
                { label: 'Wix', price: '$204/yr', bad: true },
                { label: 'Webflow', price: '$276/yr', bad: true },
                { label: 'This way', price: '$9/yr', bad: false },
              ].map(item => (
                <div key={item.label} style={{
                  padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                  background: item.bad ? 'rgba(239,68,68,0.06)' : 'rgba(74,222,128,0.08)',
                  border: `1px solid ${item.bad ? 'rgba(239,68,68,0.2)' : 'rgba(74,222,128,0.25)'}`,
                  color: item.bad ? '#ef4444' : '#4ade80',
                }}>
                  {item.bad ? '✗' : '✓'} {item.label}: {item.price}
                </div>
              ))}
            </div>

            {/* CTA */}
            <a href="/build" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 700,
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: 'white', textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
            }}>
              🚀 Build My Website Free
            </a>
            <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 10 }}>
              Works for all skill levels · Arabic RTL support included
            </div>
          </div>

          {/* RIGHT — Animated steps */}
          <div>
            {/* Cost callout */}
            <div style={{ padding: '16px 20px', borderRadius: 14, background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.2)', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 2 }}>Total cost for a professional website</div>
                <div style={{ fontSize: 12, color: 'var(--text3)' }}>PromptiFill + Claude + Vercel = Free · Domain only</div>
              </div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#4ade80' }}>$9<span style={{ fontSize: 14, fontWeight: 400 }}>/yr</span></div>
            </div>

            {/* Animated steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {STEPS_ANIMATION.map((step, i) => (
                <div
                  key={step.n}
                  onClick={() => { setActiveStep(i); setAnimating(false); }}
                  style={{
                    display: 'flex', gap: 14, padding: '16px 18px', borderRadius: 14,
                    cursor: 'pointer', transition: 'all 0.3s ease',
                    background: activeStep === i ? `${step.color}0d` : 'var(--bg2)',
                    border: `1px solid ${activeStep === i ? `${step.color}40` : 'var(--border)'}`,
                    transform: activeStep === i ? 'translateX(4px)' : 'none',
                    boxShadow: activeStep === i ? `0 4px 20px ${step.color}15` : 'none',
                  }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                    background: activeStep === i ? `${step.color}20` : 'var(--bg3)',
                    border: `2px solid ${activeStep === i ? `${step.color}50` : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, transition: 'all 0.3s',
                  }}>{step.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: activeStep === i ? 'var(--text1)' : 'var(--text2)', marginBottom: 3, transition: 'color 0.3s' }}>
                      {step.n}. {step.title}
                    </div>
                    <div style={{ fontSize: 12, color: activeStep === i ? 'var(--text3)' : 'var(--text3)', lineHeight: 1.4 }}>
                      {step.desc}
                    </div>
                  </div>
                  {activeStep === i && (
                    <div style={{ width: 6, borderRadius: 3, background: step.color, alignSelf: 'stretch', flexShrink: 0 }} />
                  )}
                </div>
              ))}
            </div>

            {/* Website types */}
            <div style={{ marginTop: 16, padding: '14px 16px', borderRadius: 12, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 10, fontWeight: 600, letterSpacing: 0.5 }}>SUPPORTS ANY WEBSITE TYPE</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['👤 Portfolio', '💼 Business', '🍽 Restaurant', '🛒 eCommerce', '🚀 SaaS', '🌍 Arabic RTL'].map(type => (
                  <span key={type} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 20, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text3)' }}>{type}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .build-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}

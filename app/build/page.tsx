'use client';
// app/build/page.tsx
// "Build a Website with Claude AI" — special workflow page
// URL: promptifill.com/build
// This page is also an SEO goldmine for "build website with AI"

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';

// ─── YOUR AFFILIATE LINKS ──────────────────────────────
const NAMECHEAP_AFFILIATE = 'https://namecheap.com/?aff=YOUR_ID'; // Replace!
const HOSTINGER_AFFILIATE  = 'https://hostinger.com/?AFFILIATE=YOUR_ID'; // Replace!
// ──────────────────────────────────────────────────────

interface FormData {
  siteType: string;
  stack: string;
  pages: string;
  style: string;
  colors: string;
  features: string[];
  description: string;
  language: string;
}

const SITE_TYPES = [
  { id: 'portfolio', label: '👤 Portfolio / Personal Brand' },
  { id: 'business', label: '💼 Business Landing Page' },
  { id: 'restaurant', label: '🍽 Restaurant / Cafe' },
  { id: 'ecommerce', label: '🛒 eCommerce Store' },
  { id: 'saas', label: '🚀 SaaS Product Page' },
  { id: 'blog', label: '📝 Blog / Content Site' },
  { id: 'agency', label: '🎨 Agency Website' },
  { id: 'arabic', label: '🌍 Arabic / RTL Website' },
];

const STACKS = [
  { id: 'html', label: '🟡 HTML + CSS (Simplest)' },
  { id: 'nextjs', label: '⚡ Next.js + Tailwind (Recommended)' },
  { id: 'react', label: '⚛️ React + CSS' },
  { id: 'vanilla', label: '🌐 Pure HTML/CSS/JS' },
];

const STYLES = ['Minimal & Clean', 'Dark & Premium', 'Bold & Colorful', 'Corporate', 'Arabic RTL', 'Luxury'];

const FEATURES = [
  'Contact form', 'WhatsApp button', 'Mobile-first',
  'Arabic/RTL support', 'Dark mode', 'Smooth animations',
  'SEO optimized', 'Fast loading', 'Google Maps embed',
];

const LANGUAGES = ['English', 'Arabic', 'Bilingual'];

export default function BuildPage() {
  const [form, setForm] = useState<FormData>({
    siteType: '', stack: 'nextjs', pages: 'Home, About, Services, Contact',
    style: 'Minimal & Clean', colors: '', features: ['Mobile-first', 'SEO optimized'],
    description: '', language: 'English',
  });
  const [result, setResult] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState(1);

  const toggleFeature = (f: string) => {
    setForm(prev => ({
      ...prev,
      features: prev.features.includes(f)
        ? prev.features.filter(x => x !== f)
        : [...prev.features, f],
    }));
  };

  const generate = async () => {
    if (!form.siteType || !form.description) return;
    setGenerating(true);
    setResult('');

    try {
      const res = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId: 'coding',
          inputs: {
            task: `Build a complete ${form.siteType} website`,
            language: form.stack,
            context: `
Business description: ${form.description}
Pages needed: ${form.pages}
Design style: ${form.style}
Color preferences: ${form.colors || 'modern and professional'}
Special features: ${form.features.join(', ')}
Language: ${form.language}
${form.language !== 'English' ? 'Include full RTL Arabic support' : ''}
            `.trim(),
            requirements: `Production-ready, mobile-first, ${form.features.join(', ')}`,
            level: 'Senior/Production-grade',
            output: 'Full working code',
          },
        }),
      });
      const data = await res.json();
      if (data.prompt) {
        setResult(data.prompt);
        setStep(2);
        setTimeout(() => {
          document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (e) {
      console.error(e);
    }
    setGenerating(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const inputStyle = {
    width: '100%', background: 'var(--bg)', border: '1px solid var(--border2)',
    borderRadius: 10, padding: '11px 14px', color: 'var(--text1)',
    fontSize: 14, outline: 'none', fontFamily: 'inherit',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />

      {/* Hero */}
      <div style={{
        textAlign: 'center', padding: '60px 24px 50px',
        background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 70%)',
      }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '6px 16px', borderRadius: 30, marginBottom: 20,
          background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
          fontSize: 13, color: 'var(--accent)', fontWeight: 600,
        }}>
          🚀 Build With Claude AI — Free
        </div>

        <h1 style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 700, color: 'var(--text1)', lineHeight: 1.15, marginBottom: 18 }}>
          Build a real website for{' '}
          <span style={{ background: 'linear-gradient(90deg, #6366f1, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            $9/year
          </span>
        </h1>

        <p style={{ fontSize: 17, color: 'var(--text2)', maxWidth: 580, margin: '0 auto 16px', lineHeight: 1.7 }}>
          Stop paying $50/month for website builders.
          Generate a perfect AI prompt → Claude writes your code →
          Deploy free on Vercel → Add a $9 domain. Done.
        </p>

        {/* Cost comparison */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
          {[
            { label: 'Wix', cost: '$204/year', bad: true },
            { label: 'Webflow', cost: '$276/year', bad: true },
            { label: 'This method', cost: '$9/year', bad: false },
          ].map(item => (
            <div key={item.label} style={{
              padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600,
              background: item.bad ? 'rgba(239,68,68,0.08)' : 'rgba(74,222,128,0.1)',
              border: `1px solid ${item.bad ? 'rgba(239,68,68,0.2)' : 'rgba(74,222,128,0.3)'}`,
              color: item.bad ? '#ef4444' : '#4ade80',
            }}>
              {item.bad ? '❌' : '✅'} {item.label}: {item.cost}
            </div>
          ))}
        </div>

        {/* How it works — 4 steps */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, maxWidth: 780, margin: '0 auto' }}>
          {[
            { n: '1', icon: '✦', title: 'Generate Prompt', desc: 'Fill 7 blanks → PromptiFill creates your perfect Claude prompt' },
            { n: '2', icon: '🤖', title: 'Build with Claude', desc: 'Paste prompt into Claude.ai → it writes your complete website' },
            { n: '3', icon: '⚡', title: 'Deploy Free', desc: 'Push to GitHub → connect Vercel → live in 2 minutes' },
            { n: '4', icon: '🌐', title: 'Add Domain', desc: 'Buy .com for $9/year from Namecheap → professional URL' },
          ].map(s => (
            <div key={s.n} style={{ padding: '18px 16px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14 }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text1)', marginBottom: 6 }}>{s.n}. {s.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.5 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px 60px' }}>

        {/* FORM */}
        <div style={{
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 20, padding: '32px', marginBottom: 24,
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text1)', marginBottom: 24 }}>
            ✦ Generate Your Website Prompt
          </h2>

          {/* Site type */}
          <div style={{ marginBottom: 22 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginBottom: 10 }}>
              What type of website? <span style={{ color: 'var(--accent)' }}>*</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
              {SITE_TYPES.map(t => (
                <button key={t.id} type="button" onClick={() => setForm(f => ({ ...f, siteType: t.id }))}
                  style={{
                    padding: '10px 14px', borderRadius: 10, fontSize: 13,
                    fontWeight: 500, cursor: 'pointer', textAlign: 'left',
                    border: '1px solid',
                    borderColor: form.siteType === t.id ? 'rgba(99,102,241,0.5)' : 'var(--border)',
                    background: form.siteType === t.id ? 'rgba(99,102,241,0.12)' : 'var(--bg3)',
                    color: form.siteType === t.id ? 'var(--accent)' : 'var(--text2)',
                    transition: 'all 0.2s',
                  }}
                >{t.label}</button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: 22 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginBottom: 8 }}>
              Describe your business or project <span style={{ color: 'var(--accent)' }}>*</span>
            </label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="e.g. A Saudi coffee shop in Riyadh called 'Qahwa House' — specialty coffee and light meals, modern Arabic aesthetic, targeting young professionals..."
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }}
            />
          </div>

          {/* Two column row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 22 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginBottom: 8 }}>
                Tech stack
              </label>
              <select value={form.stack} onChange={e => setForm(f => ({ ...f, stack: e.target.value }))}
                style={{ ...inputStyle, appearance: 'none' }}>
                {STACKS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginBottom: 8 }}>
                Pages needed
              </label>
              <input type="text" value={form.pages}
                onChange={e => setForm(f => ({ ...f, pages: e.target.value }))}
                placeholder="Home, About, Services, Contact"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Style + Colors */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 22 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginBottom: 8 }}>
                Design style
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {STYLES.map(s => (
                  <button key={s} type="button" onClick={() => setForm(f => ({ ...f, style: s }))}
                    style={{
                      padding: '6px 12px', borderRadius: 8, fontSize: 12,
                      fontWeight: 500, cursor: 'pointer',
                      border: '1px solid',
                      borderColor: form.style === s ? 'rgba(99,102,241,0.4)' : 'var(--border)',
                      background: form.style === s ? 'rgba(99,102,241,0.15)' : 'transparent',
                      color: form.style === s ? 'var(--accent)' : 'var(--text3)',
                    }}
                  >{s}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginBottom: 8 }}>
                Color preferences (optional)
              </label>
              <input type="text" value={form.colors}
                onChange={e => setForm(f => ({ ...f, colors: e.target.value }))}
                placeholder="e.g. Dark green + gold, or open"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Features */}
          <div style={{ marginBottom: 22 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginBottom: 10 }}>
              Features to include
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {FEATURES.map(f => (
                <button key={f} type="button" onClick={() => toggleFeature(f)}
                  style={{
                    padding: '7px 14px', borderRadius: 20, fontSize: 12,
                    fontWeight: 500, cursor: 'pointer',
                    border: '1px solid',
                    borderColor: form.features.includes(f) ? 'rgba(74,222,128,0.4)' : 'var(--border)',
                    background: form.features.includes(f) ? 'rgba(74,222,128,0.1)' : 'transparent',
                    color: form.features.includes(f) ? '#4ade80' : 'var(--text3)',
                  }}
                >
                  {form.features.includes(f) ? '✓ ' : ''}{f}
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginBottom: 8 }}>
              Website language
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {LANGUAGES.map(l => (
                <button key={l} type="button" onClick={() => setForm(f => ({ ...f, language: l }))}
                  style={{
                    padding: '8px 18px', borderRadius: 8, fontSize: 13,
                    fontWeight: 500, cursor: 'pointer',
                    border: '1px solid',
                    borderColor: form.language === l ? 'rgba(99,102,241,0.4)' : 'var(--border2)',
                    background: form.language === l ? 'rgba(99,102,241,0.15)' : 'transparent',
                    color: form.language === l ? 'var(--accent)' : 'var(--text2)',
                  }}
                >{l}</button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={generate}
            disabled={generating || !form.siteType || !form.description}
            style={{
              width: '100%', padding: '16px', borderRadius: 12,
              fontSize: 16, fontWeight: 700,
              background: (!form.siteType || !form.description) ? 'var(--bg3)' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: (!form.siteType || !form.description) ? 'var(--text3)' : 'white',
              border: 'none', cursor: (!form.siteType || !form.description || generating) ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            {generating ? (
              <>
                <span style={{ display: 'inline-block', width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                Generating your website prompt...
              </>
            ) : '✦ Generate My Website Prompt →'}
          </button>

          {(!form.siteType || !form.description) && (
            <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text3)', marginTop: 8 }}>
              Select a website type and describe your project to continue
            </p>
          )}
        </div>

        {/* RESULT */}
        {result && (
          <div id="result-section">
            {/* Step 1 — The Prompt */}
            <div style={{
              background: 'var(--bg2)', border: '1px solid rgba(99,102,241,0.35)',
              borderRadius: 20, padding: '28px', marginBottom: 16,
              boxShadow: '0 0 30px rgba(99,102,241,0.08)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80' }} />
                  <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text1)' }}>
                    ✅ Your Claude Prompt Is Ready!
                  </span>
                </div>
                <button onClick={copy} style={{
                  padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', border: '1px solid',
                  borderColor: copied ? 'rgba(74,222,128,0.4)' : 'var(--border2)',
                  background: copied ? 'rgba(74,222,128,0.1)' : 'var(--bg3)',
                  color: copied ? '#4ade80' : 'var(--text2)',
                }}>
                  {copied ? '✓ Copied!' : '⎘ Copy Prompt'}
                </button>
              </div>

              <div style={{
                background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: 10, padding: 18, fontSize: 13,
                color: 'var(--text1)', lineHeight: 1.8,
                whiteSpace: 'pre-wrap', fontFamily: 'monospace',
                maxHeight: 320, overflowY: 'auto',
              }}>{result}</div>
            </div>

            {/* Step 2 — What to do next */}
            <div style={{
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: 20, padding: '28px', marginBottom: 16,
            }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text1)', marginBottom: 20 }}>
                🎯 What To Do Next — 4 Steps
              </h3>

              {[
                {
                  n: '1', color: '#6366f1',
                  title: 'Paste in Claude.ai',
                  desc: 'Copy your prompt above → open Claude.ai → paste it → Claude writes your complete website code.',
                  btn: 'Open Claude.ai →',
                  href: 'https://claude.ai',
                },
                {
                  n: '2', color: '#22d3ee',
                  title: 'Deploy FREE on Vercel',
                  desc: 'Save the code Claude gives you → create GitHub repo → connect to Vercel → your site is live in 2 minutes.',
                  btn: 'Open Vercel →',
                  href: 'https://vercel.com',
                },
                {
                  n: '3', color: '#4ade80',
                  title: 'Get a professional domain',
                  desc: 'Add a .com domain for ~$9/year. Connect to Vercel for free. Professional URL in 30 minutes.',
                  btn: 'Get Domain on Namecheap →',
                  href: NAMECHEAP_AFFILIATE,
                },
                {
                  n: '4', color: '#f59e0b',
                  title: 'Need more prompts?',
                  desc: 'Generate unlimited website prompts, get Arabic RTL support, and access all 10 categories with Pro.',
                  btn: 'Upgrade to Pro →',
                  href: '/pricing',
                },
              ].map(step => (
                <div key={step.n} style={{
                  display: 'flex', gap: 16, marginBottom: 18, alignItems: 'flex-start',
                  padding: '16px', borderRadius: 12, background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    background: `${step.color}20`, border: `2px solid ${step.color}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 700, color: step.color,
                  }}>{step.n}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text1)', marginBottom: 4 }}>{step.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--text3)', lineHeight: 1.55, marginBottom: 10 }}>{step.desc}</div>
                    <a href={step.href} target={step.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '8px 16px', borderRadius: 8, fontSize: 13,
                        fontWeight: 600, textDecoration: 'none',
                        background: `${step.color}15`, color: step.color,
                        border: `1px solid ${step.color}30`,
                      }}
                    >{step.btn}</a>
                  </div>
                </div>
              ))}
            </div>

            {/* Cost summary */}
            <div style={{
              padding: '20px 24px', borderRadius: 14,
              background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: 12,
            }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#4ade80', marginBottom: 4 }}>
                  💰 Total cost for your website
                </div>
                <div style={{ fontSize: 13, color: 'var(--text3)' }}>
                  PromptiFill: Free · Claude: Free · Vercel: Free · Domain: $9/year
                </div>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#4ade80' }}>$9/year</div>
            </div>
          </div>
        )}

        {/* SEO content section */}
        {!result && (
          <div style={{ marginTop: 40, padding: '28px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text1)', marginBottom: 16 }}>
              Why this works better than website builders
            </h2>
            {[
              { icon: '💰', title: 'Save $200-270/year', desc: 'Website builders charge $15-50/month. This method costs $9/year total — just the domain.' },
              { icon: '🎯', title: 'You own the code', desc: 'With website builders, you\'re locked in forever. With this method, you own your code and can move it anywhere.' },
              { icon: '⚡', title: 'Better performance', desc: 'Custom-built sites on Vercel are faster than drag-and-drop builders. Better SEO. Better user experience.' },
              { icon: '🌍', title: 'Arabic/RTL support', desc: 'Building an Arabic website? Our prompts include full RTL support — something most builders don\'t handle well.' },
            ].map(item => (
              <div key={item.title} style={{ display: 'flex', gap: 14, marginBottom: 16, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text1)', marginBottom: 3 }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--text3)', lineHeight: 1.55 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

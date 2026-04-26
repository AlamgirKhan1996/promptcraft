'use client';
// app/build/page.tsx
// PromptiFill Website Builder — Lovable-style
// Fill form → AI builds website → Live preview → Download → Deploy

import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { BuildPageModal } from '@/components/onboarding/BuildOnboarding';

// ─── Types ────────────────────────────────────────────
type BuildStep = 'form' | 'building' | 'preview';

const WEBSITE_TYPES = [
  { id: 'restaurant', label: 'Restaurant / Cafe', emoji: '🍽️' },
  { id: 'portfolio',  label: 'Portfolio / Personal', emoji: '👤' },
  { id: 'business',   label: 'Business Landing Page', emoji: '💼' },
  { id: 'ecommerce',  label: 'eCommerce Store', emoji: '🛒' },
  { id: 'saas',       label: 'SaaS Product Page', emoji: '🚀' },
  { id: 'agency',     label: 'Agency / Studio', emoji: '🎨' },
  { id: 'gym',        label: 'Gym / Fitness', emoji: '💪' },
  { id: 'medical',    label: 'Clinic / Medical', emoji: '🏥' },
  { id: 'arabic',     label: 'Arabic RTL Site', emoji: '🌍' },
  { id: 'other',      label: 'Custom / Other', emoji: '✦' },
];

const STYLES = [
  { id: 'dark',    label: 'Dark & Premium',    colors: '#080812 + #6366f1' },
  { id: 'light',   label: 'Clean & Minimal',   colors: '#ffffff + #3b82f6' },
  { id: 'luxury',  label: 'Luxury Gold',       colors: '#0a0a0a + #d97706' },
  { id: 'bold',    label: 'Bold & Colorful',   colors: '#1a1a2e + #e91e63' },
  { id: 'nature',  label: 'Natural & Fresh',   colors: '#f0fdf4 + #16a34a' },
  { id: 'arabic',  label: 'Arabic Elegant',    colors: '#0d0d0d + #b45309' },
];

const FEATURES = [
  'Mobile Responsive', 'WhatsApp Button', 'Contact Form',
  'Google Maps', 'Social Media Links', 'Image Gallery',
  'Booking/Reservation', 'Arabic RTL Support', 'Animations',
  'Newsletter Signup', 'Testimonials', 'FAQ Section',
];

// ─── Loading screen ───────────────────────────────────
function BuildingScreen() {
  const steps = [
    { icon: '🎨', text: 'Designing your layout...', delay: 0 },
    { icon: '⚡', text: 'Writing HTML & CSS...', delay: 1.5 },
    { icon: '✨', text: 'Adding animations...', delay: 3 },
    { icon: '📱', text: 'Making it responsive...', delay: 4.5 },
    { icon: '🚀', text: 'Finalizing your website...', delay: 6 },
  ];

  return (
    
    <div style={{
      minHeight: '70vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px', textAlign: 'center',
    }}>
      {/* Animated logo */}
      <div style={{
        width: 80, height: 80, borderRadius: 20, marginBottom: 32,
        background: 'linear-gradient(135deg, #6366f1, #22d3ee)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 36, animation: 'pulse-build 2s ease-in-out infinite',
        boxShadow: '0 0 40px rgba(99,102,241,0.4)',
      }}>✦</div>

      <h2 style={{
        fontSize: 28, fontWeight: 800, color: '#f1f5f9',
        marginBottom: 12, letterSpacing: -0.5,
      }}>
        Building Your Website...
      </h2>
      <p style={{ fontSize: 15, color: '#64748b', marginBottom: 48 }}>
        PromptiFill AI is crafting your complete website. 
        Please wait. This takes 20-40 seconds - AI is building your website...
      </p>

      {/* Build steps */}
      <div style={{ width: '100%', maxWidth: 400 }}>
        {steps.map((step, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 16px', borderRadius: 10, marginBottom: 8,
            background: 'rgba(99,102,241,0.06)',
            border: '1px solid rgba(99,102,241,0.12)',
            animation: `fadeInStep 0.5s ease forwards`,
            animationDelay: `${step.delay}s`,
            opacity: 0,
          }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{step.icon}</span>
            <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>{step.text}</span>
            <div style={{
              marginLeft: 'auto', width: 16, height: 16, borderRadius: '50%',
              border: '2px solid rgba(99,102,241,0.3)',
              borderTopColor: '#6366f1',
              animation: 'spin 0.8s linear infinite',
              animationDelay: `${step.delay}s`,
              flexShrink: 0,
            }} />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes pulse-build { 0%,100%{transform:scale(1);box-shadow:0 0 40px rgba(99,102,241,0.4)} 50%{transform:scale(1.05);box-shadow:0 0 60px rgba(99,102,241,0.6)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes fadeInStep { to{opacity:1} }
      `}</style>
    </div>
  );
}

// ─── Preview panel ────────────────────────────────────
function PreviewPanel({
  html, websiteType, brandName, onRebuild, onEdit
}: {
  html: string; websiteType: string; brandName: string;
  onRebuild: () => void; onEdit: () => void;
}) {
  const [view, setView] = useState<'preview' | 'code'>('preview');
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const copyCode = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCode = () => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${brandName.toLowerCase().replace(/\s+/g, '-') || 'my-website'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Preview toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 20px', background: '#0d0d1f',
        border: '1px solid rgba(99,102,241,0.2)',
        borderRadius: '16px 16px 0 0', flexWrap: 'wrap', gap: 10,
      }}>
        {/* Left: success + brand name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }} />
          </div>
          <div style={{
            padding: '4px 12px', borderRadius: 6, fontSize: 12,
            background: 'rgba(255,255,255,0.06)', color: '#64748b',
            fontFamily: 'monospace',
          }}>
            {brandName.toLowerCase().replace(/\s+/g, '-')}.vercel.app
          </div>
          <div style={{
            padding: '3px 8px', borderRadius: 10, fontSize: 10,
            fontWeight: 700, background: 'rgba(74,222,128,0.15)',
            color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)',
          }}>✓ LIVE</div>
        </div>

        {/* Center: view tabs */}
        <div style={{ display: 'flex', gap: 4 }}>
          {[
            { id: 'preview', label: '👁 Preview' },
            { id: 'code',    label: '💻 Code' },
          ].map(t => (
            <button key={t.id} onClick={() => setView(t.id as any)} style={{
              padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
              border: 'none', cursor: 'pointer', transition: 'all 0.2s',
              background: view === t.id ? 'rgba(99,102,241,0.2)' : 'transparent',
              color: view === t.id ? '#818cf8' : '#475569',
            }}>{t.label}</button>
          ))}
        </div>

        {/* Right: device + actions */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {/* Device switcher */}
          {view === 'preview' && (
            <div style={{ display: 'flex', gap: 3 }}>
              <button onClick={() => setDevice('desktop')} style={{
                padding: '5px 10px', borderRadius: 7, fontSize: 14, border: 'none',
                cursor: 'pointer', background: device === 'desktop' ? 'rgba(99,102,241,0.2)' : 'transparent',
              }}>🖥</button>
              <button onClick={() => setDevice('mobile')} style={{
                padding: '5px 10px', borderRadius: 7, fontSize: 14, border: 'none',
                cursor: 'pointer', background: device === 'mobile' ? 'rgba(99,102,241,0.2)' : 'transparent',
              }}>📱</button>
            </div>
          )}

          <button onClick={copyCode} style={{
            padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
            border: '1px solid rgba(99,102,241,0.2)',
            background: copied ? 'rgba(74,222,128,0.12)' : 'rgba(99,102,241,0.08)',
            color: copied ? '#4ade80' : '#818cf8', cursor: 'pointer',
          }}>{copied ? '✓ Copied!' : '⎘ Copy'}</button>

          <button onClick={downloadCode} style={{
            padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700,
            border: 'none', background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            color: 'white', cursor: 'pointer',
          }}>⬇ Download</button>

          <button onClick={onRebuild} style={{
            padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'transparent', color: '#475569', cursor: 'pointer',
          }}>🔄 Rebuild</button>
        </div>
      </div>

      {/* Preview area */}
      {view === 'preview' && (
        <div style={{
          background: '#1a1a2e',
          border: '1px solid rgba(99,102,241,0.2)',
          borderTop: 'none',
          borderRadius: '0 0 16px 16px',
          padding: device === 'mobile' ? '20px' : '0',
          minHeight: 600,
          display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
        }}>
          <iframe
            ref={iframeRef}
            srcDoc={html}
            onLoad = {(e) => {
              const iframe = e.currentTarget;
              try {
                const doc = iframe.contentDocument;
                if (doc && doc.body) {
                  if (!doc.body.style.background) {
                    doc.body.style.background = '#111827';
                    doc.body.style.color = 'white';
                  }
                }
              } catch (error) {}
            }}
            
            style={{
              width: device === 'mobile' ? '390px' : '100%',
              height: device === 'mobile' ? '780px' : '780px',
              border: device === 'mobile' ? '8px solid #0f1120' : 'none',
              borderRadius: device === 'mobile' ? 24 : '0 0 16px 16px',
              background: 'white',
              boxShadow: device === 'mobile' ? '0 20px 60px rgba(0,0,0,0.5)' : 'none',
            }}
            title="Website Preview"
          />
        </div>
      )}

      {/* Code area */}
      {view === 'code' && (
        <div style={{
          background: '#060614',
          border: '1px solid rgba(99,102,241,0.2)',
          borderTop: 'none', borderRadius: '0 0 16px 16px',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '10px 16px', background: '#0a0a1e',
            borderBottom: '1px solid rgba(99,102,241,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{
                fontSize: 11, padding: '2px 8px', borderRadius: 6,
                background: 'rgba(255,165,0,0.15)', color: '#fb923c',
                fontWeight: 700, fontFamily: 'monospace',
              }}>HTML</span>
              <span style={{ fontSize: 12, color: '#334155', fontFamily: 'monospace' }}>
                {brandName.toLowerCase().replace(/\s+/g, '-')}.html
              </span>
            </div>
            <span style={{ fontSize: 11, color: '#334155' }}>
              {html.split('\n').length} lines · {(html.length / 1024).toFixed(1)} KB
            </span>
          </div>
          <pre style={{
            margin: 0, padding: '20px', overflowX: 'auto', overflowY: 'auto',
            maxHeight: 620, fontSize: 12, lineHeight: 1.7,
            color: '#94a3b8', fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            whiteSpace: 'pre-wrap', wordBreak: 'break-all',
          }}>
            {html}
          </pre>
        </div>
      )}

      {/* Deploy instructions */}
      <div style={{
        marginTop: 16, padding: '20px 24px', borderRadius: 14,
        background: 'rgba(99,102,241,0.05)',
        border: '1px solid rgba(99,102,241,0.15)',
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', marginBottom: 14 }}>
          🚀 Deploy Your Website — 3 Steps
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {[
            { step: '1', icon: '⬇', title: 'Download Code', desc: 'Click the Download button above', color: '#6366f1' },
            { step: '2', icon: '🐙', title: 'Push to GitHub', desc: 'Create repo → upload the HTML file', color: '#22d3ee' },
            { step: '3', icon: '⚡', title: 'Deploy on Vercel', desc: 'Connect GitHub → live in 2 minutes', color: '#4ade80' },
          ].map(s => (
            <div key={s.step} style={{
              padding: '14px 16px', borderRadius: 10,
              background: `${s.color}08`, border: `1px solid ${s.color}25`,
              display: 'flex', gap: 10, alignItems: 'flex-start',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8, background: `${s.color}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, flexShrink: 0, fontWeight: 700, color: s.color,
              }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', marginBottom: 3 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, fontSize: 12, color: '#334155', textAlign: 'center' }}>
          Then add a domain from Namecheap for $9/year → Professional website complete! 🎉
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────
export default function BuildPage() {
  const { data: session } = useSession();
  const plan = (session?.user as any)?.plan ?? 'FREE';

  const [step, setStep] = useState<BuildStep>('form');
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [error, setError] = useState('');
  const [buildTime, setBuildTime] = useState(0);
  const [lineCount, setLineCount] = useState(0);

  // Form state
  const [websiteType, setWebsiteType] = useState('');
  const [brandName, setBrandName] = useState('');
  const [description, setDescription] = useState('');
  const [pages, setPages] = useState('Home, About, Services, Contact');
  const [style, setStyle] = useState('dark');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['Mobile Responsive', 'Animations']);
  const [language, setLanguage] = useState('English');

  const toggleFeature = (f: string) => {
    setSelectedFeatures(prev =>
      prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
    );
  };

  const handleBuild = async () => {
    if (!websiteType || !description || !brandName) {
      setError('Please fill in: Website type, Brand name, and Description');
      return;
    }
    setError('');
    setStep('building');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 58000); 

    const startTime = Date.now();
    try {
      const selectedStyle = STYLES.find(s => s.id === style);
      const res = await fetch('/api/build-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteType,
          brandName,
          description,
          pages,
          style: selectedStyle?.label || style,
          colors: selectedStyle?.colors || '',
          features: selectedFeatures.join(', '),
          language,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const data = await res.json();

      if (res.status === 429) {
        setError(data.message || 'Daily limit reached. Upgrade to Pro.');
        setStep('form');
        return;
      }

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to build. Please try again.');
        setStep('form');
        return;
      }

      setBuildTime(Date.now() - startTime);
      setGeneratedHtml(data.html);
      setLineCount(data.lineCount || 0);
      setStep('preview');

    } catch (e: any) {
      clearTimeout(timeout);
      if (e?.name === 'AbortError') {
        setError('Build took too long and was aborted. Please try with a simpler description.');
      } else {
        setError('Network error. Please check your connection and try again.');
      }
      setStep('form');
    }
  };

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 10,
    background: '#060614', border: '1px solid rgba(99,102,241,0.2)',
    color: '#f1f5f9', fontSize: 14, outline: 'none',
    fontFamily: 'inherit', transition: 'border 0.2s',
    boxSizing: 'border-box' as const,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#080812' }}>
      <BuildPageModal />
      <Navbar />

      {/* ── HERO ── */}
      <div style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99,102,241,0.15) 0%, transparent 70%)',
        borderBottom: '1px solid rgba(99,102,241,0.12)',
        padding: '48px 24px 36px', textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '5px 14px', borderRadius: 20, marginBottom: 16,
          background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
          fontSize: 12, color: '#6366f1', fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: 1,
        }}>
          🚀 AI Website Builder — Powered by PromptiFill
        </div>

        <h1 style={{
          fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 900,
          color: '#f1f5f9', lineHeight: 1.1, marginBottom: 14, letterSpacing: -1,
        }}>
          Build a Real Website with AI
          <span style={{
            display: 'block', marginTop: 4,
            background: 'linear-gradient(90deg, #6366f1, #22d3ee)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>In 30 Seconds. For $9/year.</span>
        </h1>

        <p style={{
          fontSize: 16, color: '#64748b', maxWidth: 520, margin: '0 auto 24px', lineHeight: 1.7,
        }}>
          Describe your business → PromptiFill AI builds your complete website →
          Live preview instantly → Download → Deploy free on Vercel
        </p>

        {/* Compare pills */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { label: '❌ Wix: $204/year', bg: 'rgba(248,113,113,0.1)', color: '#f87171', border: 'rgba(248,113,113,0.2)' },
            { label: '❌ Webflow: $276/year', bg: 'rgba(248,113,113,0.1)', color: '#f87171', border: 'rgba(248,113,113,0.2)' },
            { label: '✅ PromptiFill: $9/year', bg: 'rgba(74,222,128,0.1)', color: '#4ade80', border: 'rgba(74,222,128,0.25)' },
          ].map(p => (
            <div key={p.label} style={{
              padding: '7px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600,
              background: p.bg, color: p.color, border: `1px solid ${p.border}`,
            }}>{p.label}</div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 60px' }}>

        {/* ── BUILDING SCREEN ── */}
        {step === 'building' && <BuildingScreen />}

        {/* ── PREVIEW SCREEN ── */}
        {step === 'preview' && generatedHtml && (
          <div>
            {/* Success banner */}
            <div style={{
              padding: '14px 20px', borderRadius: 12, marginBottom: 20,
              background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: 10,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20 }}>🎉</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>
                    Your website is ready! Built in {(buildTime / 1000).toFixed(1)} seconds.
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>
                    Fully functional · Every button works · Download → Deploy on Vercel
                  </div>
                </div>
              </div>
              <button onClick={() => setStep('form')} style={{
                padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'transparent', color: '#475569', cursor: 'pointer',
              }}>
                ← Build Another
              </button>
            </div>

            <PreviewPanel
              html={generatedHtml}
              websiteType={websiteType}
              brandName={brandName}
              onRebuild={handleBuild}
              onEdit={() => setStep('form')}
            />
          </div>
        )}

        {/* ── FORM ── */}
        {step === 'form' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>

            {/* Left — Main form */}
            <div>
              {/* Error */}
              {error && (
                <div style={{
                  padding: '12px 16px', borderRadius: 10, marginBottom: 16,
                  background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)',
                  fontSize: 13, color: '#f87171',
                }}>⚠️ {error}</div>
              )}

              {/* Website type */}
              <div style={{ background: '#0f1120', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 16, padding: 24, marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
                  1. What type of website?
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8 }}>
                  {WEBSITE_TYPES.map(t => (
                    <button key={t.id} onClick={() => setWebsiteType(t.id)} style={{
                      padding: '12px 10px', borderRadius: 10, cursor: 'pointer',
                      border: '1px solid',
                      borderColor: websiteType === t.id ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.06)',
                      background: websiteType === t.id ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.02)',
                      color: websiteType === t.id ? '#818cf8' : '#64748b',
                      fontSize: 13, fontWeight: websiteType === t.id ? 700 : 500,
                      textAlign: 'center', transition: 'all 0.2s',
                    }}>
                      <div style={{ fontSize: 20, marginBottom: 4 }}>{t.emoji}</div>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand + description */}
              <div style={{ background: '#0f1120', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 16, padding: 24, marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
                  2. Tell us about your business
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 13, color: '#94a3b8', display: 'block', marginBottom: 7, fontWeight: 500 }}>
                    Brand / Business Name <span style={{ color: '#6366f1' }}>*</span>
                  </label>
                  <input
                    value={brandName} onChange={e => setBrandName(e.target.value)}
                    placeholder="e.g. Qahwa House, TechFlow, Dr. Ahmed Clinic"
                    style={inputStyle}
                  />
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 13, color: '#94a3b8', display: 'block', marginBottom: 7, fontWeight: 500 }}>
                    Describe your business <span style={{ color: '#6366f1' }}>*</span>
                  </label>
                  <textarea
                    value={description} onChange={e => setDescription(e.target.value)}
                    placeholder="e.g. Premium specialty coffee shop in Riyadh targeting young professionals. We serve hand-crafted drinks in a modern luxury setting. Known for our Arabic coffee culture and bilingual service."
                    rows={4}
                    style={{ ...inputStyle, resize: 'vertical', minHeight: 100, lineHeight: 1.6 }}
                  />
                  <div style={{ fontSize: 11, color: '#334155', marginTop: 5 }}>
                    The more detail you give → the better the website. Describe your target audience, unique value, and vibe.
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 13, color: '#94a3b8', display: 'block', marginBottom: 7, fontWeight: 500 }}>
                    Pages / Sections
                  </label>
                  <input
                    value={pages} onChange={e => setPages(e.target.value)}
                    placeholder="e.g. Home, About, Menu, Gallery, Contact"
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Style */}
              <div style={{ background: '#0f1120', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 16, padding: 24, marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
                  3. Design style
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
                  {STYLES.map(s => (
                    <button key={s.id} onClick={() => setStyle(s.id)} style={{
                      padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                      border: '1px solid',
                      borderColor: style === s.id ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.06)',
                      background: style === s.id ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.02)',
                      textAlign: 'left', transition: 'all 0.2s',
                    }}>
                      <div style={{ fontSize: 12, fontWeight: style === s.id ? 700 : 500, color: style === s.id ? '#818cf8' : '#64748b', marginBottom: 3 }}>
                        {s.label}
                      </div>
                      <div style={{ fontSize: 10, color: '#334155', fontFamily: 'monospace' }}>{s.colors}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div style={{ background: '#0f1120', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 16, padding: 24, marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
                  4. Features to include
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {FEATURES.map(f => {
                    const selected = selectedFeatures.includes(f);
                    return (
                      <button key={f} onClick={() => toggleFeature(f)} style={{
                        padding: '7px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                        cursor: 'pointer', border: '1px solid', transition: 'all 0.2s',
                        borderColor: selected ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.06)',
                        background: selected ? 'rgba(99,102,241,0.12)' : 'transparent',
                        color: selected ? '#818cf8' : '#475569',
                      }}>
                        {selected ? '✓ ' : ''}{f}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Language */}
              <div style={{ background: '#0f1120', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
                  5. Language
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['English', 'Arabic (RTL)', 'Bilingual (English + Arabic)'].map(l => (
                    <button key={l} onClick={() => setLanguage(l)} style={{
                      padding: '9px 18px', borderRadius: 10, cursor: 'pointer',
                      border: '1px solid', fontSize: 13, fontWeight: 500, transition: 'all 0.2s',
                      borderColor: language === l ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.06)',
                      background: language === l ? 'rgba(99,102,241,0.12)' : 'transparent',
                      color: language === l ? '#818cf8' : '#64748b',
                    }}>{l}</button>
                  ))}
                </div>
              </div>

              {/* BUILD BUTTON */}
              <button
                onClick={handleBuild}
                disabled={!websiteType || !description || !brandName}
                style={{
                  width: '100%', padding: '16px 24px', borderRadius: 14,
                  border: 'none', cursor: (!websiteType || !description || !brandName) ? 'not-allowed' : 'pointer',
                  background: (!websiteType || !description || !brandName)
                    ? 'rgba(99,102,241,0.3)'
                    : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  color: 'white', fontSize: 16, fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                  boxShadow: (!websiteType || !description || !brandName)
                    ? 'none' : '0 8px 30px rgba(99,102,241,0.35)',
                  transition: 'all 0.2s',
                  opacity: (!websiteType || !description || !brandName) ? 0.6 : 1,
                }}
              >
                <span style={{ fontSize: 20 }}>✦</span>
                Build My Website with PromptiFill AI
                <span style={{
                  fontSize: 12, padding: '3px 10px',
                  background: 'rgba(255,255,255,0.15)', borderRadius: 20,
                }}>
                  {plan === 'FREE' ? '2 free builds/day' : 'Unlimited'}
                </span>
              </button>

              {plan === 'FREE' && (
                <p style={{ fontSize: 12, color: '#334155', textAlign: 'center', marginTop: 10 }}>
                  Free plan: 2 website builds/day · <a href="/pricing" style={{ color: '#6366f1', textDecoration: 'none' }}>Upgrade to Pro for unlimited →</a>
                </p>
              )}
            </div>

            {/* Right — Info sidebar */}
            <div>
              {/* What you get */}
              <div style={{
                background: '#0f1120', border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: 16, padding: 20, marginBottom: 16,
                position: 'sticky', top: 80,
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', marginBottom: 14 }}>
                  ✦ What PromptiFill AI Builds For You
                </div>

                {[
                  { icon: '🎨', text: 'Complete HTML + CSS + JavaScript' },
                  { icon: '📱', text: 'Fully responsive — mobile perfect' },
                  { icon: '✨', text: 'Smooth animations & hover effects' },
                  { icon: '🌍', text: 'Arabic RTL support built in' },
                  { icon: '🚀', text: 'Ready to deploy on Vercel' },
                  { icon: '💰', text: '$9 domain = professional URL' },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 0',
                    borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ fontSize: 13, color: '#94a3b8' }}>{item.text}</span>
                  </div>
                ))}

                <div style={{
                  marginTop: 16, padding: '12px 14px', borderRadius: 10,
                  background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)',
                }}>
                  <div style={{ fontSize: 12, color: '#4ade80', fontWeight: 700, marginBottom: 4 }}>
                    Total cost: $9/year
                  </div>
                  <div style={{ fontSize: 11, color: '#334155' }}>
                    vs Wix $204/year · Webflow $276/year
                  </div>
                </div>
              </div>

              {/* Live demos */}
              <div style={{
                background: '#0f1120', border: '1px solid rgba(99,102,241,0.15)',
                borderRadius: 16, padding: 20,
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', marginBottom: 12 }}>
                  🌐 Real Websites Built With This
                </div>
                <a href="https://qahwa-house-six.vercel.app" target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                  borderRadius: 10, background: 'rgba(99,102,241,0.06)',
                  border: '1px solid rgba(99,102,241,0.15)', textDecoration: 'none',
                  transition: 'all 0.2s', marginBottom: 8,
                }}>
                  <span style={{ fontSize: 18 }}>🍵</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>Qahwa House</div>
                    <div style={{ fontSize: 11, color: '#475569' }}>Saudi coffee brand · Arabic RTL</div>
                  </div>
                  <span style={{ marginLeft: 'auto', fontSize: 12, color: '#6366f1' }}>View →</span>
                </a>
                <div style={{ fontSize: 11, color: '#334155', textAlign: 'center', marginTop: 8 }}>
                  Built with PromptiFill · 2 hours · $9 total
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

'use client';
// app/page.tsx — PromptiFill Homepage — FULLY UPDATED
// Reflects: Run inside app, Lovable-style builder, no copy-paste, Al-Madinah

import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WelcomeModal } from '@/components/onboarding/WelcomeModal';

// ── Stats ─────────────────────────────────────────────
const STATS = [
  { value: '50K+',   label: 'Prompts Generated',   color: '#6366f1' },
  { value: '10',     label: 'Specialized Categories', color: '#22d3ee' },
  { value: '100%',   label: 'Runs Inside App',      color: '#4ade80' },
  { value: '8.6/10', label: 'Avg Quality Score',    color: '#f59e0b' },
];

// ── Categories ────────────────────────────────────────
const CATEGORIES = [
  { emoji: '💼', name: 'Business & Marketing',  desc: 'Strategy, positioning, brand voice' },
  { emoji: '💻', name: 'Coding & Development',  desc: 'Code generation, debugging, architecture' },
  { emoji: '🎨', name: 'Design & Creative',     desc: 'UI/UX, visual concepts, art direction' },
  { emoji: '📱', name: 'Social Media Content',  desc: 'Viral posts, captions, campaigns' },
  { emoji: '🛒', name: 'eCommerce & Sales',     desc: 'Product descriptions, ads, conversions' },
  { emoji: '📧', name: 'Email & Copywriting',   desc: 'Cold outreach, newsletters, sequences' },
  { emoji: '🎓', name: 'Education & Learning',  desc: 'Explanations, curricula, quizzes' },
  { emoji: '🤖', name: 'AI & Automation',       desc: 'Workflows, agents, system design' },
  { emoji: '📊', name: 'Data & Analysis',       desc: 'Insights, reports, visualizations' },
  { emoji: '🌍', name: 'Arabic GCC — Exclusive', desc: 'Arabic prompts, Gulf market context' },
];

// ── How it works steps ────────────────────────────────
const HOW_STEPS = [
  {
    num: '1',
    title: 'Pick Your Category',
    desc: 'Choose from 10 specialized categories — from social media to exclusive Arabic GCC content.',
    icon: '📂',
    color: '#6366f1',
  },
  {
    num: '2',
    title: 'Fill In The Blanks',
    desc: 'Answer 5–8 smart questions about your goal, audience, and tone. Takes 60 seconds.',
    icon: '✏️',
    color: '#22d3ee',
  },
  {
    num: '3',
    title: 'AI Result Appears Instantly',
    desc: 'PromptiFill generates your expert prompt AND runs it through AI — result appears inside the app. No copy-paste ever.',
    icon: '⚡',
    color: '#4ade80',
    highlight: true,
  },
];

// ── Comparisons ───────────────────────────────────────
const COMPARE_TOOLS = [
  { name: 'Jasper',      price: '$49/mo', arabic: false, run: false, build: false, bad: true },
  { name: 'Copy.ai',     price: '$36/mo', arabic: false, run: false, build: false, bad: true },
  { name: 'Lovable',     price: '$20/mo', arabic: false, run: false, build: true,  bad: true },
  { name: 'PromptiFill', price: '$9.99/mo', arabic: true, run: true,  build: true,  bad: false },
];

const WEBSITE_TYPES = [
  '👤 Portfolio', '💼 Business', '🍽️ Restaurant',
  '🛒 eCommerce', '🚀 SaaS', '🌍 Arabic RTL',
];

const FAQ = [
  {
    q: 'What is PromptiFill?',
    a: 'PromptiFill is an AI platform that generates expert prompts AND runs them instantly inside the app — no copy-paste, no switching tabs. It also includes a Lovable-style website builder that creates fully functional websites in 30 seconds.',
  },
  {
    q: 'Do I need to know prompt engineering?',
    a: "No — that's the whole point. PromptiFill handles ROLE, CONTEXT, TASK, FORMAT, and CONSTRAINTS automatically. You fill in simple blanks and get professional AI output instantly.",
  },
  {
    q: 'Does it copy-paste to Claude.ai?',
    a: "No! That's the old way. PromptiFill generates your expert prompt AND runs it through Claude AI directly inside the app. Your result appears with a typewriter effect — never leave PromptiFill.",
  },
  {
    q: 'Can I build a real website with it?',
    a: 'Yes! The Build tab generates fully functional websites — working navigation, contact forms, animations, gallery with lightbox, mobile responsive. Download the HTML, deploy on Vercel (free), add a $9 domain. Done.',
  },
  {
    q: 'Can I generate Arabic prompts?',
    a: 'Yes! PromptiFill has an exclusive Arabic GCC category that generates content in Modern Standard Arabic (فصحى) with Gulf market context. The website builder also creates full Arabic RTL websites with bilingual toggle.',
  },
  {
    q: 'Which AI tools work with PromptiFill?',
    a: 'Results run directly inside PromptiFill powered by Claude Sonnet. The prompts also work with ChatGPT, Gemini, and any AI tool — they are universal and work everywhere.',
  },
];

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#080812', color: '#f1f5f9' }}>
      <WelcomeModal />
      <Navbar />

      {/* ════════════════════════════════
          HERO SECTION
      ════════════════════════════════ */}
      <section style={{
        padding: 'clamp(60px,10vw,100px) 24px clamp(50px,8vw,80px)',
        textAlign: 'center',
        background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99,102,241,0.18) 0%, transparent 70%)',
        borderBottom: '1px solid rgba(99,102,241,0.12)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle grid */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03,
          backgroundImage: 'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 16px', borderRadius: 20, marginBottom: 24,
          background: 'rgba(99,102,241,0.1)',
          border: '1px solid rgba(99,102,241,0.3)',
          fontSize: 12, color: '#818cf8', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '1px',
          position: 'relative', zIndex: 1,
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%', background: '#4ade80',
            boxShadow: '0 0 8px rgba(74,222,128,0.8)',
            animation: 'pulse 2s infinite',
          }} />
          ✦ AI Prompt Generator + Website Builder + Runs Inside App
        </div>

        {/* Main headline */}
        <h1 style={{
          fontSize: 'clamp(30px, 6vw, 64px)',
          fontWeight: 900, lineHeight: 1.1,
          letterSpacing: '-1.5px', marginBottom: 20,
          position: 'relative', zIndex: 1,
        }}>
          <span style={{ color: '#f1f5f9' }}>Generate. Run. Build.</span>
          <br />
          <span style={{
            background: 'linear-gradient(90deg, #6366f1, #22d3ee)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            All Inside PromptiFill.
          </span>
        </h1>

        {/* Subheadline */}
        <p style={{
          fontSize: 'clamp(15px, 2.5vw, 20px)',
          color: '#64748b', maxWidth: 600, margin: '0 auto 16px',
          lineHeight: 1.7, position: 'relative', zIndex: 1,
        }}>
          No more copy-paste. No more switching to Claude.ai.<br />
          Generate expert AI prompts → result appears instantly → build complete websites.
          Everything in one app.
        </p>

        {/* Key proof line */}
        <p style={{
          fontSize: 13, color: '#4ade80', fontWeight: 600,
          marginBottom: 36, position: 'relative', zIndex: 1,
        }}>
          ⚡ The only AI tool that generates AND runs your prompt — no copy-paste ever
        </p>

        {/* CTA buttons */}
        <div style={{
          display: 'flex', gap: 12, justifyContent: 'center',
          flexWrap: 'wrap', marginBottom: 56,
          position: 'relative', zIndex: 1,
        }}>
          <Link href="/generate" style={{
            padding: '14px 28px', borderRadius: 12, fontSize: 16, fontWeight: 700,
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            color: 'white', textDecoration: 'none',
            boxShadow: '0 6px 24px rgba(99,102,241,0.4)',
            display: 'inline-flex', alignItems: 'center', gap: 8,
            transition: 'all 0.2s',
          }}>
            ✦ Try Free — No Signup Needed →
          </Link>
          <Link href="/build" style={{
            padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 600,
            background: 'transparent', color: '#94a3b8', textDecoration: 'none',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}>
            🚀 Build Website Free
          </Link>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: 12, maxWidth: 700, margin: '0 auto',
          position: 'relative', zIndex: 1,
        }}>
          {STATS.map((s, i) => (
            <div key={i} style={{
              padding: '16px 12px', borderRadius: 14,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: 'clamp(20px, 3vw, 28px)',
                fontWeight: 900, color: s.color, marginBottom: 4,
              }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#475569' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <style>{`
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        `}</style>
      </section>

      {/* ════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════ */}
      <section style={{ padding: '72px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: '#6366f1',
            textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12,
          }}>How It Works</div>
          <h2 style={{
            fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 800,
            color: '#f1f5f9', marginBottom: 14, letterSpacing: '-0.5px',
          }}>From blank to result in 60 seconds</h2>
          <p style={{ fontSize: 15, color: '#64748b', marginBottom: 52, maxWidth: 500, margin: '0 auto 52px' }}>
            No prompt engineering knowledge needed. No switching apps. No copy-paste. Ever.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 16,
          }}>
            {HOW_STEPS.map((s, i) => (
              <div key={i} style={{
                padding: '28px 24px', borderRadius: 18, textAlign: 'left',
                background: s.highlight ? 'rgba(74,222,128,0.06)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${s.highlight ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.06)'}`,
                position: 'relative',
              }}>
                {s.highlight && (
                  <div style={{
                    position: 'absolute', top: -10, right: 16,
                    background: '#4ade80', color: '#052e16',
                    fontSize: 10, fontWeight: 800, padding: '3px 10px',
                    borderRadius: 20, letterSpacing: 0.5,
                  }}>NEW ✦</div>
                )}
                <div style={{
                  width: 44, height: 44, borderRadius: 12, marginBottom: 16,
                  background: `${s.color}18`, border: `1px solid ${s.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22,
                }}>{s.icon}</div>
                <div style={{
                  fontSize: 11, fontWeight: 700, color: s.color,
                  textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8,
                }}>Step {s.num}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>
                  {s.title}
                </div>
                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7 }}>{s.desc}</div>
              </div>
            ))}
          </div>

          {/* Mini flow diagram */}
          <div style={{
            marginTop: 32, padding: '16px 24px', borderRadius: 14,
            background: 'rgba(99,102,241,0.05)',
            border: '1px solid rgba(99,102,241,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 12, flexWrap: 'wrap',
          }}>
            {[
              { label: 'Fill form', icon: '📝', color: '#6366f1' },
              { arrow: true },
              { label: 'Generate prompt', icon: '✦', color: '#6366f1' },
              { arrow: true },
              { label: 'AI runs it', icon: '⚡', color: '#4ade80' },
              { arrow: true },
              { label: 'Result appears', icon: '✅', color: '#4ade80' },
            ].map((item, i) => (
              (item as any).arrow ? (
                <span key={i} style={{ color: '#334155', fontSize: 18 }}>→</span>
              ) : (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 14px', borderRadius: 20,
                  background: `${(item as any).color}10`,
                  border: `1px solid ${(item as any).color}25`,
                }}>
                  <span style={{ fontSize: 14 }}>{(item as any).icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: (item as any).color }}>
                    {(item as any).label}
                  </span>
                </div>
              )
            ))}
            <div style={{
              width: '100%', marginTop: 8, fontSize: 12, color: '#334155', textAlign: 'center',
            }}>
              Zero copy-paste · Zero tab switching · Zero friction ✦
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          CATEGORIES GRID
      ════════════════════════════════ */}
      <section style={{
        padding: '0 24px 72px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, color: '#6366f1',
              textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 10,
            }}>Categories</div>
            <h2 style={{
              fontSize: 'clamp(22px, 4vw, 38px)', fontWeight: 800,
              color: '#f1f5f9', letterSpacing: '-0.5px',
            }}>Built for every use case</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
            gap: 10,
          }}>
            {CATEGORIES.map((cat, i) => (
              <Link href="/generate" key={i} style={{
                padding: '20px 16px', borderRadius: 14, textDecoration: 'none',
                background: i === 9 ? 'rgba(245,158,11,0.07)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${i === 9 ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.06)'}`,
                transition: 'all 0.2s', display: 'block',
                position: 'relative',
              }}>
                {i === 9 && (
                  <div style={{
                    position: 'absolute', top: 8, right: 8,
                    background: '#f59e0b', color: 'white',
                    fontSize: 8, fontWeight: 800, padding: '2px 7px',
                    borderRadius: 10, letterSpacing: 0.5,
                  }}>EXCLUSIVE</div>
                )}
                <div style={{ fontSize: 26, marginBottom: 8 }}>{cat.emoji}</div>
                <div style={{
                  fontSize: 13, fontWeight: 600, color: '#f1f5f9', marginBottom: 4,
                }}>{cat.name}</div>
                <div style={{ fontSize: 11, color: '#475569', lineHeight: 1.5 }}>{cat.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          WEBSITE BUILDER SECTION
      ════════════════════════════════ */}
      <section style={{
        padding: '80px 24px',
        background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(5,150,105,0.12) 0%, transparent 70%)',
        borderBottom: '1px solid rgba(5,150,105,0.15)',
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>

          {/* NEW badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '5px 16px', borderRadius: 20, marginBottom: 20,
            background: 'rgba(5,150,105,0.12)', border: '1px solid rgba(5,150,105,0.35)',
            fontSize: 11, color: '#4ade80', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '1px',
          }}>
            🚀 New — AI Website Builder
          </div>

          <h2 style={{
            fontSize: 'clamp(24px, 4vw, 46px)', fontWeight: 900,
            color: '#f1f5f9', marginBottom: 14, letterSpacing: '-0.5px', lineHeight: 1.1,
          }}>
            Build a real website for{' '}
            <span style={{ color: '#4ade80' }}>$9/year.</span>
          </h2>

          <p style={{
            fontSize: 16, color: '#64748b', maxWidth: 560, margin: '0 auto 28px', lineHeight: 1.7,
          }}>
            Describe your business → PromptiFill AI builds a <strong style={{ color: '#f1f5f9' }}>fully functional website</strong> — working
            navigation, forms, animations — live preview inside app. Download → deploy free → $9 domain. Done.
          </p>

          {/* Comparison pills */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 44 }}>
            {[
              { label: '✗ Wix: $204/year',     bg: 'rgba(248,113,113,0.1)', color: '#f87171', border: 'rgba(248,113,113,0.2)' },
              { label: '✗ Webflow: $276/year',  bg: 'rgba(248,113,113,0.1)', color: '#f87171', border: 'rgba(248,113,113,0.2)' },
              { label: '✗ Lovable: $240/year',  bg: 'rgba(248,113,113,0.1)', color: '#f87171', border: 'rgba(248,113,113,0.2)' },
              { label: '✅ PromptiFill: $9/year',bg: 'rgba(74,222,128,0.1)', color: '#4ade80', border: 'rgba(74,222,128,0.3)' },
            ].map((p, i) => (
              <div key={i} style={{
                padding: '7px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                background: p.bg, color: p.color, border: `1px solid ${p.border}`,
              }}>{p.label}</div>
            ))}
          </div>

          {/* Feature grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 12, marginBottom: 36, textAlign: 'left',
          }}>
            {[
              { icon: '⚡', title: 'Fully Functional', desc: 'Working nav, forms, animations, gallery lightbox — not just a static page' },
              { icon: '🌍', title: 'Arabic RTL Support', desc: 'Full bilingual EN/AR with language toggle — exclusive to GCC market' },
              { icon: '📱', title: 'Live Preview', desc: 'See desktop and mobile preview instantly inside PromptiFill' },
              { icon: '⬇', title: 'Download & Deploy', desc: 'One click download → GitHub → Vercel (free) → $9 domain = live forever' },
            ].map((f, i) => (
              <div key={i} style={{
                padding: '18px 16px', borderRadius: 12,
                background: 'rgba(5,150,105,0.06)', border: '1px solid rgba(5,150,105,0.15)',
              }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{f.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', marginBottom: 5 }}>{f.title}</div>
                <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>

          {/* Website types */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 28 }}>
            {WEBSITE_TYPES.map((t, i) => (
              <div key={i} style={{
                padding: '6px 14px', borderRadius: 20,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                fontSize: 12, color: '#94a3b8', fontWeight: 500,
              }}>{t}</div>
            ))}
          </div>

          <Link href="/build" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '14px 32px', borderRadius: 12, fontSize: 15, fontWeight: 700,
            background: 'linear-gradient(135deg, #059669, #047857)',
            color: 'white', textDecoration: 'none',
            boxShadow: '0 6px 24px rgba(5,150,105,0.35)',
          }}>
            🚀 Build My Website Free →
          </Link>
          <p style={{ fontSize: 12, color: '#334155', marginTop: 10 }}>
            Works for all skill levels · Arabic RTL support included · 2 free builds/day
          </p>

          {/* Live demo link */}
          <div style={{ marginTop: 20, fontSize: 13, color: '#475569' }}>
            See a real example →{' '}
            <a
              href="https://qahwa-house-six.vercel.app"
              target="_blank" rel="noopener noreferrer"
              style={{ color: '#4ade80', textDecoration: 'none', fontWeight: 600 }}
            >
              qahwa-house-six.vercel.app
            </a>
            {' '}(built with PromptiFill AI in 2 hours)
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          COMPARISON TABLE
      ════════════════════════════════ */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(22px, 4vw, 38px)', fontWeight: 800,
            color: '#f1f5f9', marginBottom: 12, letterSpacing: '-0.5px',
          }}>
            Why PromptiFill wins
          </h2>
          <p style={{ fontSize: 15, color: '#64748b', marginBottom: 40 }}>
            More features. Lower price. Built for the Arab world.
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
              <thead>
                <tr>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: '#475569', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Tool</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 12, color: '#475569', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Price</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 12, color: '#475569', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Runs Inside</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 12, color: '#475569', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Website Builder</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 12, color: '#475569', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Arabic GCC</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_TOOLS.map((tool, i) => (
                  <tr key={i} style={{
                    background: !tool.bad ? 'rgba(99,102,241,0.07)' : 'transparent',
                    border: !tool.bad ? '1px solid rgba(99,102,241,0.25)' : 'none',
                  }}>
                    <td style={{ padding: '13px 16px', textAlign: 'left', fontSize: 14, fontWeight: tool.bad ? 400 : 800, color: tool.bad ? '#64748b' : '#f1f5f9', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      {!tool.bad && '✦ '}{tool.name}
                    </td>
                    <td style={{ padding: '13px 16px', textAlign: 'center', fontSize: 13, color: tool.bad ? '#64748b' : '#4ade80', fontWeight: tool.bad ? 400 : 700, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      {tool.price}
                    </td>
                    <td style={{ padding: '13px 16px', textAlign: 'center', fontSize: 16, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      {tool.run ? '✅' : '❌'}
                    </td>
                    <td style={{ padding: '13px 16px', textAlign: 'center', fontSize: 16, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      {tool.build ? '✅' : '❌'}
                    </td>
                    <td style={{ padding: '13px 16px', textAlign: 'center', fontSize: 16, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      {tool.arabic ? '✅' : '❌'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 12, color: '#334155', marginTop: 16 }}>
            ✦ PromptiFill is the only tool that does all three — at the lowest price in the market
          </p>
        </div>
      </section>

      {/* ════════════════════════════════
          TESTIMONIAL / SOCIAL PROOF
      ════════════════════════════════ */}
      <section style={{
        padding: '0 24px 80px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>

          <div style={{
            padding: '28px 32px', borderRadius: 18,
            background: 'rgba(99,102,241,0.06)',
            border: '1px solid rgba(99,102,241,0.2)',
            marginBottom: 20,
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🌍</div>
            <h3 style={{
              fontSize: 20, fontWeight: 800, color: '#f1f5f9', marginBottom: 10,
            }}>
              Built for the Arab world. First of its kind.
            </h3>
            <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.8, maxWidth: 560, margin: '0 auto 16px' }}>
              450M+ Arabic speakers. Zero AI prompt tools built specifically for them — until now.
              PromptiFill is the first AI platform with exclusive Arabic GCC content, RTL website builder,
              and GCC market cultural context built in.
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              {['Arabic RTL', 'GCC Market', 'فصحى معاصرة', 'Saudi Arabia', 'UAE', 'Kuwait'].map((t, i) => (
                <span key={i} style={{
                  padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                  background: 'rgba(245,158,11,0.1)', color: '#f59e0b',
                  border: '1px solid rgba(245,158,11,0.25)',
                }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Quick stats */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12,
          }}>
            {[
              { val: '1,500+', label: 'LinkedIn impressions in 10 days', color: '#6366f1' },
              { val: '$9/yr', label: 'Total cost for professional website', color: '#4ade80' },
              { val: '#1', label: 'Arabic GCC AI prompt platform', color: '#f59e0b' },
            ].map((s, i) => (
              <div key={i} style={{
                padding: '20px 16px', borderRadius: 12, textAlign: 'center',
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: s.color, marginBottom: 6 }}>{s.val}</div>
                <div style={{ fontSize: 11, color: '#475569', lineHeight: 1.5 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          PRICING CTA
      ════════════════════════════════ */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: '#6366f1',
            textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12,
          }}>Pricing</div>
          <h2 style={{
            fontSize: 'clamp(22px, 4vw, 38px)', fontWeight: 800,
            color: '#f1f5f9', marginBottom: 14, letterSpacing: '-0.5px',
          }}>Simple, transparent pricing</h2>
          <p style={{ fontSize: 16, color: '#64748b', marginBottom: 12, lineHeight: 1.7 }}>
            Start free. 5 generations + 2 website builds per day.
            Upgrade to Pro for unlimited everything.
          </p>

          {/* Promo banner */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: 30, marginBottom: 36,
            background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)',
            fontSize: 14, fontWeight: 600, color: '#4ade80',
          }}>
            🎉 Launch offer: Use code{' '}
            <span style={{
              background: 'rgba(74,222,128,0.2)', padding: '2px 10px',
              borderRadius: 6, fontFamily: 'monospace', letterSpacing: 1,
            }}>LAUNCH</span>
            {' '}for 20% off your first payment!
          </div>

          {/* Quick pricing */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 28 }}>
            {[
              { name: 'Free', price: '$0', sub: '/month', features: '5 generations/day · 3 categories · 2 website builds', cta: 'Start Free', href: '/generate', primary: false },
              { name: 'Pro', price: '$9.99', sub: '/month', features: 'Unlimited everything · All 10 categories · Arabic GCC · Website builder', cta: 'Get Pro →', href: '/pricing', primary: true },
              { name: 'Team', price: '$29', sub: '/month', features: '5 team members · Shared library · Priority support', cta: 'Start Team', href: '/pricing', primary: false },
            ].map((p, i) => (
              <div key={i} style={{
                padding: '20px 16px', borderRadius: 14, textAlign: 'left',
                background: p.primary ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${p.primary ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.06)'}`,
                position: 'relative',
              }}>
                {p.primary && (
                  <div style={{
                    position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                    background: '#6366f1', color: 'white', fontSize: 9,
                    fontWeight: 700, padding: '3px 12px', borderRadius: 20, whiteSpace: 'nowrap',
                  }}>🔥 MOST POPULAR</div>
                )}
                <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', marginBottom: 8 }}>{p.name}</div>
                <div style={{ marginBottom: 10 }}>
                  <span style={{ fontSize: 26, fontWeight: 900, color: '#f1f5f9' }}>{p.price}</span>
                  <span style={{ fontSize: 12, color: '#475569' }}>{p.sub}</span>
                </div>
                <div style={{ fontSize: 11, color: '#475569', lineHeight: 1.7, marginBottom: 14 }}>{p.features}</div>
                <Link href={p.href} style={{
                  display: 'block', textAlign: 'center', padding: '9px',
                  borderRadius: 9, fontSize: 12, fontWeight: 700, textDecoration: 'none',
                  background: p.primary ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : 'transparent',
                  color: p.primary ? 'white' : '#64748b',
                  border: p.primary ? 'none' : '1px solid rgba(255,255,255,0.1)',
                }}>{p.cta}</Link>
              </div>
            ))}
          </div>

          <Link href="/pricing" style={{
            fontSize: 13, color: '#6366f1', textDecoration: 'none', fontWeight: 600,
          }}>View full pricing details →</Link>
        </div>
      </section>

      {/* ════════════════════════════════
          FAQ
      ════════════════════════════════ */}
      <section style={{
        padding: '0 24px 80px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40, paddingTop: 60 }}>
            <h2 style={{
              fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 800,
              color: '#f1f5f9', letterSpacing: '-0.5px',
            }}>Common Questions</h2>
          </div>
          {FAQ.map((item, i) => (
            <div key={i} style={{
              padding: '20px 0',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>
                {item.q}
              </div>
              <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.8 }}>
                {item.a}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════
          FINAL CTA
      ════════════════════════════════ */}
      <section style={{
        padding: '80px 24px',
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(99,102,241,0.15) 0%, transparent 70%)',
        textAlign: 'center',
        borderTop: '1px solid rgba(99,102,241,0.15)',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>✦</div>
          <h2 style={{
            fontSize: 'clamp(24px, 4vw, 42px)', fontWeight: 900,
            color: '#f1f5f9', marginBottom: 14, letterSpacing: '-0.5px', lineHeight: 1.15,
          }}>
            Start generating perfect prompts{' '}
            <span style={{
              background: 'linear-gradient(90deg, #6366f1, #22d3ee)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>right now.</span>
          </h2>
          <p style={{ fontSize: 15, color: '#64748b', marginBottom: 32, lineHeight: 1.7 }}>
            Free to start. No credit card. Results appear inside PromptiFill instantly.
            Join the first AI platform built for the Arab world.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/generate" style={{
              padding: '15px 32px', borderRadius: 12, fontSize: 16, fontWeight: 800,
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: 'white', textDecoration: 'none',
              boxShadow: '0 6px 28px rgba(99,102,241,0.4)',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              ✦ Try PromptiFill Free →
            </Link>
            <Link href="/build" style={{
              padding: '15px 28px', borderRadius: 12, fontSize: 15, fontWeight: 600,
              background: 'transparent', color: '#4ade80',
              border: '1px solid rgba(74,222,128,0.3)',
              textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              🚀 Build Website Free
            </Link>
          </div>
          <p style={{ fontSize: 12, color: '#334155', marginTop: 16 }}>
            5 free generations/day · 2 free website builds/day · No credit card · Works in 30 seconds
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// app/page.tsx
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CATEGORIES } from '@/lib/prompt-templates';
import { WelcomeModal } from '@/components/onboarding/WelcomeModal';
import { LiveDemo } from '@/components/onboarding/LiveDemo';
import { BuildShowcase } from '@/components/onboarding/BuildShowcase';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <WelcomeModal />
      <Navbar />

      {/* HERO */}
      <section className="hero-gradient" style={{ textAlign: 'center', padding: '90px 24px 70px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 20, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', fontSize: 13, color: 'var(--accent)', marginBottom: 24, fontWeight: 500 }}>
          ✦ AI-Powered Prompt Engineering for the GCC
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 60px)', fontWeight: 700, lineHeight: 1.12, marginBottom: 20, color: 'var(--text1)' }}>
          Stop writing bad prompts.<br />
          <span className="grad-text">Get perfect results, every time.</span>
        </h1>
        <p style={{ fontSize: 18, color: 'var(--text2)', maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.7 }}>
          PromptCraft turns simple answers into expert-level AI prompts. Pick a category, fill in the blanks — get a structured prompt that works on any AI tool.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/generate" style={{ padding: '14px 28px', borderRadius: 12, fontSize: 16, fontWeight: 600, background: 'var(--accent)', color: 'white', textDecoration: 'none' }}>
            Try Free — No Signup Needed →
          </Link>
          <Link href="/pricing" style={{ padding: '14px 28px', borderRadius: 12, fontSize: 16, fontWeight: 600, background: 'transparent', color: 'var(--text2)', border: '1px solid var(--border2)', textDecoration: 'none' }}>
            See Pricing
          </Link>
        </div>
      </section>

      {/* STATS */}
      <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap', padding: '24px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        {[['50K+', 'Prompts Generated'], ['10', 'Specialized Categories'], ['Arabic', 'GCC-First Support'], ['8.6/10', 'Avg Quality Score']].map(([n, l]) => (
          <div key={l} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text1)' }}>{n}</div>
            <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* HOW IT WORKS */}
      <section style={{ padding: '70px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 12 }}>How It Works</div>
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 700, color: 'var(--text1)', marginBottom: 12 }}>Three steps to perfect prompts</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, maxWidth: 800, margin: '0 auto' }}>
          {[
            ['1', 'Pick Your Category', 'Choose from 10 specialized categories — from social media to Arabic GCC content.'],
            ['2', 'Fill In the Blanks', 'Answer 5–8 smart, tailored questions about your goal, audience, and tone.'],
            ['3', 'Get a Perfect Prompt', 'Claude generates a structured, expert-level prompt with quality score — ready to copy.'],
          ].map(([num, title, desc]) => (
            <div key={num} style={{ textAlign: 'center', padding: 24 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(99,102,241,0.12)', border: '2px solid rgba(99,102,241,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: 'var(--accent)', margin: '0 auto 16px' }}>{num}</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text1)', marginBottom: 8 }}>{title}</div>
              <div style={{ fontSize: 14, color: 'var(--text3)', lineHeight: 1.65 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding: '50px 24px 70px', background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 12 }}>Categories</div>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 700, color: 'var(--text1)' }}>Built for every use case</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, maxWidth: 1100, margin: '0 auto' }}>
          {CATEGORIES.map((cat) => (
            <Link key={cat.id} href="/generate" style={{ padding: '18px 16px', borderRadius: 14, background: 'var(--bg)', border: '1px solid var(--border)', textDecoration: 'none', display: 'block', transition: 'all 0.2s' }}>
              <span style={{ fontSize: 26, display: 'block', marginBottom: 8 }}>{cat.emoji}</span>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text1)', marginBottom: 4 }}>{cat.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.5 }}>{cat.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* LIVE DEMO */}
      <LiveDemo />

      {/* BUILD SHOWCASE */}
      <BuildShowcase />

      {/* PRICING PREVIEW */}
      <section style={{ padding: '70px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 12 }}>Pricing</div>
        <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 700, color: 'var(--text1)', marginBottom: 12 }}>Simple, transparent pricing</h2>
        <p style={{ fontSize: 16, color: 'var(--text2)', marginBottom: 32 }}>Start free. Upgrade when you are ready.</p>
        <Link href="/pricing" style={{ padding: '12px 28px', borderRadius: 10, fontSize: 15, fontWeight: 600, background: 'var(--accent)', color: 'white', textDecoration: 'none' }}>
          View Pricing →
        </Link>
      </section>

      {/* FAQ */}
      <section style={{ padding: '30px 24px 70px', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text1)', marginBottom: 28, textAlign: 'center' }}>Common Questions</h2>
          {[
            ['What is PromptCraft?', 'A structured AI prompt generator. Fill in smart blanks, get expert-level prompts optimized for Claude, ChatGPT, Gemini, and any AI tool.'],
            ['Do I need to know prompt engineering?', 'No — that is the whole point. PromptCraft handles role definition, context, format, and constraints automatically.'],
            ['Can I generate Arabic prompts?', 'Yes! A dedicated Arabic/GCC category generates prompts in Modern Standard Arabic (فصحى) with Gulf market context. All categories support bilingual output.'],
            ['Which AI tools work with these prompts?', 'All of them — Claude, ChatGPT, Gemini, LLaMA, Grok, or any model. Our prompts are universal and optimized for all major AI systems.'],
          ].map(([q, a]) => (
            <div key={q as string} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px', marginBottom: 12 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text1)', marginBottom: 8 }}>{q}</div>
              <div style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.65 }}>{a}</div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

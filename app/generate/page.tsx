'use client';
// app/generate/page.tsx
// PromptiFill — Upgraded Generate + Run Experience
// Fill form → Generate → AI runs instantly → See result — ALL inside PromptiFill

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CategorySelector } from '@/components/generator/CategorySelector';
import { PromptForm } from '@/components/generator/PromptForm';
import { getCategoryById, CATEGORIES } from '@/lib/prompt-templates';

// ─── Types ─────────────────────────────────────────────
type AppStep = 'category' | 'form' | 'generating' | 'result';

interface GenerateResult {
  prompt: string;
  score: number;
  reason: string;
  improvements: string[];
  promptId?: string;
  remaining?: number;
}

interface RunResult {
  text: string;
  tokens: number;
  time: number;
}

// ─── Step indicator ─────────────────────────────────────
function StepBar({ step }: { step: AppStep }) {
  const steps = [
    { id: 'category', label: 'Category', icon: '📂' },
    { id: 'form',     label: 'Fill Details', icon: '✏️' },
    { id: 'generating', label: 'Generating', icon: '⚡' },
    { id: 'result',   label: 'Your Result', icon: '✅' },
  ];
  const idx = steps.findIndex(s => s.id === step);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 0, marginBottom: 32, overflowX: 'auto', padding: '0 16px',
    }}>
      {steps.map((s, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 20,
              background: active ? 'rgba(99,102,241,0.15)' : done ? 'rgba(74,222,128,0.1)' : 'transparent',
              border: `1px solid ${active ? 'rgba(99,102,241,0.4)' : done ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.06)'}`,
              transition: 'all 0.3s',
            }}>
              <span style={{ fontSize: 14 }}>{done ? '✓' : s.icon}</span>
              <span style={{
                fontSize: 12, fontWeight: active || done ? 700 : 400, whiteSpace: 'nowrap',
                color: active ? '#818cf8' : done ? '#4ade80' : '#475569',
              }}>{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                width: 32, height: 1,
                background: done ? 'rgba(74,222,128,0.4)' : 'rgba(255,255,255,0.06)',
                transition: 'all 0.3s',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Generating animation ───────────────────────────────
function GeneratingScreen({ category }: { category: string }) {
  const cat = getCategoryById(category);
  return (
    <div style={{
      minHeight: '50vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 40,
      textAlign: 'center',
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: 18, marginBottom: 24,
        background: 'linear-gradient(135deg, #6366f1, #22d3ee)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 32, animation: 'spin-slow 3s linear infinite',
        boxShadow: '0 0 40px rgba(99,102,241,0.4)',
      }}>✦</div>
      <h3 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>
        Crafting your perfect prompt...
      </h3>
      <p style={{ fontSize: 14, color: '#475569', marginBottom: 32 }}>
        PromptiFill AI is building an expert {cat?.name || category} prompt
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 400 }}>
        {[
          { text: 'Analyzing your inputs...', delay: '0s' },
          { text: 'Structuring ROLE + CONTEXT + TASK...', delay: '0.8s' },
          { text: 'Optimizing for best AI results...', delay: '1.6s' },
          { text: 'Scoring quality...', delay: '2.4s' },
        ].map((item, i) => (
          <div key={i} style={{
            padding: '10px 16px', borderRadius: 10, fontSize: 13,
            background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.12)',
            color: '#64748b', display: 'flex', alignItems: 'center', gap: 10,
            animation: `fadeIn 0.4s ease forwards`, animationDelay: item.delay, opacity: 0,
          }}>
            <div style={{
              width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
              border: '2px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1',
              animation: 'spin 0.7s linear infinite',
            }} />
            {item.text}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes spin-slow { to{transform:rotate(360deg)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes fadeIn { to{opacity:1} }
      `}</style>
    </div>
  );
}

// ─── Running animation ──────────────────────────────────
function RunningScreen({ category }: { category: string }) {
  return (
    <div style={{
      padding: '32px 24px', borderRadius: 16,
      background: 'rgba(5,150,105,0.05)', border: '1px solid rgba(5,150,105,0.2)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{
          width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
          border: '2px solid rgba(5,150,105,0.3)', borderTopColor: '#059669',
          animation: 'spin 0.7s linear infinite',
        }} />
        <span style={{ fontSize: 14, color: '#94a3b8', fontWeight: 600 }}>
          PromptiFill AI is writing your result...
        </span>
      </div>
      {[100,85,92,70,88,60,78,90,65,80].map((w, i) => (
        <div key={i} style={{
          height: 13, borderRadius: 6, marginBottom: 8, width: `${w}%`,
          background: 'linear-gradient(90deg,rgba(5,150,105,0.06) 25%,rgba(5,150,105,0.15) 50%,rgba(5,150,105,0.06) 75%)',
          backgroundSize: '200% 100%', animation: 'shimmer 1.5s ease-in-out infinite',
          animationDelay: `${i * 0.08}s`,
        }} />
      ))}
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
      `}</style>
    </div>
  );
}

// ─── Typewriter ─────────────────────────────────────────
function TypewriterText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!text) return;
    setDisplayed(''); setDone(false); let i = 0;
    const t = setInterval(() => {
      if (i >= text.length) { setDisplayed(text); setDone(true); clearInterval(t); return; }
      i = Math.min(i + 12, text.length); setDisplayed(text.slice(0, i));
    }, 16);
    return () => clearInterval(t);
  }, [text]);
  return (
    <>
      {displayed}
      {!done && <span style={{ display:'inline-block',width:2,height:16,background:'#4ade80',marginLeft:1,verticalAlign:'text-bottom',animation:'blink 0.7s ease-in-out infinite' }} />}
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </>
  );
}

// ─── Result view ────────────────────────────────────────
function ResultView({
  result, runResult, runLoading, category, plan,
  onRunAgain, onNewPrompt, onImprove, onCopyPrompt, onCopyResult,
  copiedPrompt, copiedResult,
}: {
  result: GenerateResult; runResult: RunResult | null; runLoading: boolean;
  category: string; plan: string;
  onRunAgain: () => void; onNewPrompt: () => void; onImprove: () => void;
  onCopyPrompt: () => void; onCopyResult: () => void;
  copiedPrompt: boolean; copiedResult: boolean;
}) {
  const [showPrompt, setShowPrompt] = useState(false);
  const scoreColor = result.score >= 8 ? '#4ade80' : result.score >= 6 ? '#f59e0b' : '#f87171';

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>

      {/* ── Score + actions bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 18px', borderRadius: 12, marginBottom: 16,
        background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)',
        flexWrap: 'wrap', gap: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Score */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '5px 12px', borderRadius: 20,
            background: `${scoreColor}15`, border: `1px solid ${scoreColor}30`,
          }}>
            <span style={{ fontSize: 14, fontWeight: 900, color: scoreColor }}>{result.score}/10</span>
            <span style={{ fontSize: 11, color: scoreColor }}>Quality</span>
          </div>

          {/* Tags */}
          {result.improvements.slice(0, 2).map((imp, i) => (
            <span key={i} style={{
              fontSize: 10, padding: '3px 9px', borderRadius: 20,
              background: 'rgba(99,102,241,0.1)', color: '#818cf8',
              border: '1px solid rgba(99,102,241,0.2)', fontWeight: 500,
              display: 'none', // hide on very small
            }}>{imp}</span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button onClick={onImprove} style={{
            padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
            border: '1px solid rgba(99,102,241,0.2)', background: 'rgba(99,102,241,0.08)',
            color: '#818cf8', cursor: 'pointer',
          }}>✦ Improve</button>
          <button onClick={onNewPrompt} style={{
            padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
            border: '1px solid rgba(255,255,255,0.06)', background: 'transparent',
            color: '#475569', cursor: 'pointer',
          }}>↺ New Prompt</button>
        </div>
      </div>

      {/* ── AI Result (main) ── */}
      {runLoading && <RunningScreen category={category} />}

      {runResult && !runLoading && (
        <div style={{ marginBottom: 20 }}>
          {/* Result header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 10, flexWrap: 'wrap', gap: 8,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px rgba(74,222,128,0.6)' }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>✦ PromptiFill AI Result</span>
              <span style={{
                fontSize: 11, color: '#334155', padding: '2px 8px',
                background: 'rgba(255,255,255,0.04)', borderRadius: 20,
              }}>{runResult.tokens} tokens · {(runResult.time/1000).toFixed(1)}s</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={onCopyResult} style={{
                padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                background: copiedResult ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${copiedResult ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.1)'}`,
                color: copiedResult ? '#4ade80' : '#94a3b8', cursor: 'pointer', transition: 'all 0.2s',
              }}>{copiedResult ? '✓ Copied!' : '⎘ Copy Result'}</button>
              <button onClick={onRunAgain} style={{
                padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.25)',
                color: '#34d399', cursor: 'pointer',
              }}>🔄 Regenerate</button>
            </div>
          </div>

          {/* Result box */}
          <div style={{
            padding: '20px', borderRadius: 14,
            background: 'linear-gradient(135deg, rgba(4,4,20,0.95), rgba(4,20,20,0.95))',
            border: '1px solid rgba(74,222,128,0.25)',
            fontSize: 14, color: '#e2e8f0', lineHeight: 1.9,
            whiteSpace: 'pre-wrap', wordBreak: 'break-word',
            maxHeight: 520, overflowY: 'auto',
            boxShadow: '0 0 30px rgba(74,222,128,0.05) inset',
          }}>
            <TypewriterText text={runResult.text} />
          </div>
        </div>
      )}

      {/* ── Prompt (collapsible) ── */}
      <div style={{
        background: '#0f1120', border: '1px solid rgba(99,102,241,0.15)',
        borderRadius: 14, overflow: 'hidden', marginBottom: 16,
      }}>
        <button
          onClick={() => setShowPrompt(!showPrompt)}
          style={{
            width: '100%', padding: '13px 18px', background: 'transparent',
            border: 'none', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>
              📋 View Generated Prompt
            </span>
            <span style={{
              fontSize: 10, padding: '2px 7px', borderRadius: 10,
              background: 'rgba(99,102,241,0.1)', color: '#6366f1', fontWeight: 600,
            }}>Expert Structured</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={e => { e.stopPropagation(); onCopyPrompt(); }}
              style={{
                padding: '4px 10px', borderRadius: 7, fontSize: 11, fontWeight: 600,
                background: copiedPrompt ? 'rgba(74,222,128,0.12)' : 'rgba(99,102,241,0.1)',
                border: `1px solid ${copiedPrompt ? 'rgba(74,222,128,0.3)' : 'rgba(99,102,241,0.2)'}`,
                color: copiedPrompt ? '#4ade80' : '#818cf8', cursor: 'pointer',
              }}
            >{copiedPrompt ? '✓ Copied!' : '⎘ Copy'}</button>
            <span style={{ color: '#475569', fontSize: 12 }}>{showPrompt ? '▲' : '▼'}</span>
          </div>
        </button>

        {showPrompt && (
          <div style={{
            padding: '0 18px 16px',
            background: 'rgba(4,4,20,0.6)', borderTop: '1px solid rgba(99,102,241,0.1)',
          }}>
            <div style={{
              padding: '14px', marginTop: 12, borderRadius: 10,
              background: '#060614', border: '1px solid rgba(99,102,241,0.1)',
              fontSize: 12, color: '#94a3b8', lineHeight: 1.8,
              whiteSpace: 'pre-wrap', fontFamily: 'monospace',
              maxHeight: 280, overflowY: 'auto',
            }}>{result.prompt}</div>
            {result.reason && (
              <p style={{ fontSize: 12, color: '#334155', marginTop: 10, lineHeight: 1.5 }}>
                💡 {result.reason}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Upgrade nudge ── */}
      {plan === 'FREE' && (
        <div style={{
          padding: '14px 18px', borderRadius: 12,
          background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 8,
        }}>
          <span style={{ fontSize: 12, color: '#475569' }}>
            ✦ {result.remaining ?? 0} free generations remaining today · Pro = unlimited
          </span>
          <a href="/pricing" style={{
            fontSize: 12, fontWeight: 700, color: 'white', textDecoration: 'none',
            padding: '6px 14px', borderRadius: 8,
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
          }}>Upgrade to Pro →</a>
        </div>
      )}
    </div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────
function GeneratePageInner() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const plan = (session?.user as any)?.plan ?? 'FREE';

  const [step, setStep] = useState<AppStep>('category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [generateResult, setGenerateResult] = useState<GenerateResult | null>(null);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [runLoading, setRunLoading] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedResult, setCopiedResult] = useState(false);
  const [prefilledValues, setPrefilledValues] = useState<Record<string, string>>({});
  const resultRef = useRef<HTMLDivElement>(null);

  // Load template from sessionStorage
  useEffect(() => {
    const template = sessionStorage.getItem('promptifill_template');
    if (template) {
      try {
        const parsed = JSON.parse(template);
        if (parsed.categoryId) { setSelectedCategory(parsed.categoryId); setStep('form'); }
        if (parsed.inputs) setPrefilledValues(parsed.inputs);
        sessionStorage.removeItem('promptifill_template');
      } catch {}
    }
    const catParam = searchParams.get('category');
    if (catParam) { setSelectedCategory(catParam); setStep('form'); }
  }, [searchParams]);

  // ── Generate prompt ───────────────────────────────────
  const handleGenerate = async (inputs: Record<string, string>, improve = false, existingPrompt = '') => {
    if (!selectedCategory) return;
    setStep('generating');
    setGenerateResult(null);
    setRunResult(null);

    try {
      const res = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId: selectedCategory, inputs,
          improve, existingPrompt,
          language: inputs.language || inputs.lang || 'English',
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Failed to generate. Please try again.');
        setStep('form');
        return;
      }

      setGenerateResult({
        prompt: data.prompt,
        score: data.score || 8,
        reason: data.reason || '',
        improvements: data.improvements || [],
        promptId: data.promptId,
        remaining: data.remaining,
      });
      setStep('result');

      // ✅ AUTO-RUN immediately after generating!
      await runPrompt(data.prompt, selectedCategory);

    } catch (e) {
      alert('Network error. Please try again.');
      setStep('form');
    }
  };

  // ── Run prompt through Claude ─────────────────────────
  const runPrompt = async (prompt: string, category: string, promptId?: string) => {
    setRunLoading(true);
    setRunResult(null);
    try {
      const res = await fetch('/api/run-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, category, promptId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRunResult({ text: data.result, tokens: data.tokensUsed, time: data.executionTime });
      } else if (res.status === 429) {
        setRunResult({ text: `⚡ ${data.message || 'Daily run limit reached. Upgrade to Pro for unlimited.'}`, tokens: 0, time: 0 });
      }
    } catch (e) {
      setRunResult({ text: '⚠️ Could not run automatically. Copy the prompt above and use it manually.', tokens: 0, time: 0 });
    } finally {
      setRunLoading(false);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  };

  const handleRunAgain = () => {
    if (generateResult) runPrompt(generateResult.prompt, selectedCategory!, generateResult.promptId);
  };

  const handleImprove = async () => {
    if (!generateResult || !selectedCategory) return;
    setStep('generating');
    // Re-generate with improve flag
    // User goes back to form to re-submit with improve=true
    setStep('form');
  };

  const copyPrompt = () => {
    if (generateResult) {
      navigator.clipboard.writeText(generateResult.prompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    }
  };

  const copyResult = () => {
    if (runResult) {
      navigator.clipboard.writeText(runResult.text);
      setCopiedResult(true);
      setTimeout(() => setCopiedResult(false), 2000);
    }
  };

  const category = selectedCategory ? getCategoryById(selectedCategory) : null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />

      {/* ── Hero header ── */}
      <div style={{
        background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 70%)',
        borderBottom: '1px solid rgba(99,102,241,0.1)',
        padding: '36px 24px 28px', textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 14px', borderRadius: 20, marginBottom: 12,
          background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
          fontSize: 11, color: '#6366f1', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: 1,
        }}>
          ✦ AI Prompt Generator — Results appear inside PromptiFill
        </div>
        <h1 style={{
          fontSize: 'clamp(22px, 4vw, 38px)', fontWeight: 900,
          color: '#f1f5f9', lineHeight: 1.15, marginBottom: 8, letterSpacing: -0.5,
        }}>
          Generate → Run → Done.
          <span style={{
            display: 'block', fontSize: '0.7em', marginTop: 4,
            background: 'linear-gradient(90deg, #6366f1, #22d3ee)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>No copy-paste. No leaving. Everything inside.</span>
        </h1>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '28px 16px 60px' }}>

        {/* Step bar */}
        <StepBar step={step} />

        {/* ── STEP: Category ── */}
        {step === 'category' && (
          <div>
            <CategorySelector
              selected={selectedCategory}
              onSelect={(id) => { setSelectedCategory(id); setStep('form'); }}
              userPlan={plan}
            />
          </div>
        )}

        {/* ── STEP: Form ── */}
        {step === 'form' && selectedCategory && category && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <button
                onClick={() => setStep('category')}
                style={{
                  padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                  border: '1px solid rgba(255,255,255,0.06)', background: 'transparent',
                  color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                }}
              >← Change category</button>
              <span style={{ fontSize: 14, color: '#475569' }}>
                {category.emoji} {category.name}
              </span>
            </div>

            <PromptForm
              category={category}
              onGenerate={handleGenerate}
              generating={false}
              prefilledValues={prefilledValues}
              userPlan={plan}
            />

            <div style={{
              marginTop: 12, padding: '10px 14px', borderRadius: 10,
              background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.12)',
              fontSize: 12, color: '#475569', display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span>⚡</span>
              <span>PromptiFill will generate your prompt AND run it automatically — results appear instantly below</span>
            </div>
          </div>
        )}

        {/* ── STEP: Generating ── */}
        {step === 'generating' && selectedCategory && (
          <GeneratingScreen category={selectedCategory} />
        )}

        {/* ── STEP: Result ── */}
        {step === 'result' && generateResult && (
          <div ref={resultRef}>
            <ResultView
              result={generateResult}
              runResult={runResult}
              runLoading={runLoading}
              category={selectedCategory || 'general'}
              plan={plan}
              onRunAgain={handleRunAgain}
              onNewPrompt={() => { setStep('category'); setGenerateResult(null); setRunResult(null); }}
              onImprove={handleImprove}
              onCopyPrompt={copyPrompt}
              onCopyResult={copyResult}
              copiedPrompt={copiedPrompt}
              copiedResult={copiedResult}
            />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

// ─── Export with Suspense ───────────────────────────────
export default function GeneratePage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#475569' }}>Loading...</div>
      </div>
    }>
      <GeneratePageInner />
    </Suspense>
  );
}

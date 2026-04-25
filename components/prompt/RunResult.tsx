'use client';
// components/prompt/RunResult.tsx
// The beautiful output panel that appears when user clicks "Run with Claude"
// Shows: loading state → result → copy/save actions

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface RunResultProps {
  prompt: string;
  category: string;
  promptId?: string;
  onUpgradeNeeded?: () => void;
}

type RunState = 'idle' | 'loading' | 'success' | 'error' | 'limit';

export function RunResult({ prompt, category, promptId, onUpgradeNeeded }: RunResultProps) {
  const { data: session } = useSession();
  const [state, setState] = useState<RunState>('idle');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<{ tokens: number; time: number } | null>(null);
  const [runCount, setRunCount] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);
  const plan = (session?.user as any)?.plan ?? 'FREE';

  // Scroll to result when it appears
  useEffect(() => {
    if (state === 'success' && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [state]);

  const runPrompt = async () => {
    if (!prompt) return;
    setState('loading');
    setResult('');
    setError('');

    try {
      const res = await fetch('/api/run-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, category, promptId }),
      });

      const data = await res.json();

      if (res.status === 429) {
        setState('limit');
        setError(data.message || 'Daily limit reached');
        return;
      }

      if (!res.ok || !data.success) {
        setState('error');
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setResult(data.result);
      setStats({ tokens: data.tokensUsed, time: data.executionTime });
      setRunCount(c => c + 1);
      setState('success');

    } catch (e) {
      setState('error');
      setError('Network error. Please check your connection.');
    }
  };

  const copyResult = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setState('idle');
    setResult('');
    setError('');
  };

  // ── Idle state — show the Run button ──────────────
  if (state === 'idle' || (state === 'error' && !result)) {
    return (
      <div>
        <RunButton onClick={runPrompt} plan={plan} />
        {state === 'error' && (
          <div style={{
            marginTop: 10, padding: '10px 14px', borderRadius: 10,
            background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)',
            fontSize: 13, color: '#f87171',
          }}>⚠️ {error}</div>
        )}
      </div>
    );
  }

  // ── Loading state ─────────────────────────────────
  if (state === 'loading') {
    return (
      <div style={{
        padding: '24px', borderRadius: 16,
        background: 'rgba(99,102,241,0.05)',
        border: '1px solid rgba(99,102,241,0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 20, height: 20, borderRadius: '50%',
            border: '2px solid rgba(99,102,241,0.3)',
            borderTopColor: '#6366f1',
            animation: 'spin 0.7s linear infinite',
            flexShrink: 0,
          }} />
          <span style={{ fontSize: 14, color: '#94a3b8', fontWeight: 500 }}>
            Claude is working on your request...
          </span>
        </div>

        {/* Skeleton lines */}
        {[100, 85, 92, 60, 78, 90, 45].map((w, i) => (
          <div key={i} style={{
            height: 14, borderRadius: 6,
            background: 'linear-gradient(90deg, rgba(99,102,241,0.08) 25%, rgba(99,102,241,0.15) 50%, rgba(99,102,241,0.08) 75%)',
            backgroundSize: '200% 100%',
            animation: `shimmer 1.5s ease-in-out infinite`,
            animationDelay: `${i * 0.1}s`,
            width: `${w}%`,
            marginBottom: 10,
          }} />
        ))}

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </div>
    );
  }

  // ── Daily limit reached ───────────────────────────
  if (state === 'limit') {
    return (
      <div style={{
        padding: '24px', borderRadius: 16,
        background: 'rgba(99,102,241,0.07)',
        border: '1px solid rgba(99,102,241,0.25)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>⚡</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>
          Daily Run Limit Reached
        </div>
        <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20, lineHeight: 1.6 }}>
          Free plan includes 3 runs per day.<br />
          Upgrade to Pro for unlimited Claude runs.
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/pricing" style={{
            padding: '10px 22px', borderRadius: 10, fontSize: 14, fontWeight: 700,
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            color: 'white', textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
          }}>
            Upgrade to Pro →
          </a>
          <button onClick={reset} style={{
            padding: '10px 18px', borderRadius: 10, fontSize: 13,
            background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
            color: '#64748b', cursor: 'pointer',
          }}>
            Copy prompt instead
          </button>
        </div>
      </div>
    );
  }

  // ── Success — show the result ─────────────────────
  return (
    <div ref={resultRef}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 12, flexWrap: 'wrap', gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%', background: '#4ade80',
            boxShadow: '0 0 8px rgba(74,222,128,0.6)',
          }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>
            Claude's Result
          </span>
          {stats && (
            <span style={{
              fontSize: 11, color: '#334155', padding: '2px 8px',
              background: 'rgba(255,255,255,0.04)', borderRadius: 20,
            }}>
              {stats.tokens} tokens · {(stats.time / 1000).toFixed(1)}s
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {/* Copy result */}
          <button onClick={copyResult} style={{
            padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
            background: copied ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${copied ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.1)'}`,
            color: copied ? '#4ade80' : '#94a3b8',
            cursor: 'pointer', transition: 'all 0.2s',
          }}>
            {copied ? '✓ Copied!' : '⎘ Copy'}
          </button>

          {/* Run again */}
          <button onClick={runPrompt} style={{
            padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.25)',
            color: '#818cf8', cursor: 'pointer',
          }}>
            🔄 Regenerate
          </button>
        </div>
      </div>

      {/* Result box */}
      <div style={{
        padding: '20px', borderRadius: 14,
        background: 'rgba(4,4,20,0.8)',
        border: '1px solid rgba(74,222,128,0.2)',
        fontSize: 14, color: '#e2e8f0',
        lineHeight: 1.85, whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        maxHeight: 500, overflowY: 'auto',
        boxShadow: '0 0 30px rgba(74,222,128,0.05) inset',
      }}>
        <TypewriterText text={result} />
      </div>

      {/* Footer actions */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12, flexWrap: 'wrap', gap: 8,
      }}>
        <div style={{ fontSize: 11, color: '#334155' }}>
          Generated by Claude 3.5 Sonnet · PromptiFill
          {plan === 'FREE' && (
            <span style={{ marginLeft: 8, color: '#6366f1' }}>
              {3 - runCount - 1} free runs remaining today
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => {
              const text = `Generated with PromptiFill + Claude:\n\n${result}\n\npromptifill.com`;
              navigator.clipboard.writeText(text);
            }}
            style={{
              padding: '5px 10px', borderRadius: 7, fontSize: 11,
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.06)',
              color: '#475569', cursor: 'pointer',
            }}
          >
            Share
          </button>
        </div>
      </div>

      {/* Upgrade nudge for free users */}
      {plan === 'FREE' && (
        <div style={{
          marginTop: 14, padding: '12px 16px', borderRadius: 10,
          background: 'rgba(99,102,241,0.06)',
          border: '1px solid rgba(99,102,241,0.15)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: 8,
        }}>
          <span style={{ fontSize: 12, color: '#64748b' }}>
            ✦ Pro users get unlimited runs + all 10 categories
          </span>
          <a href="/pricing" style={{
            fontSize: 12, fontWeight: 700, color: '#6366f1',
            textDecoration: 'none', padding: '4px 10px',
            background: 'rgba(99,102,241,0.12)', borderRadius: 6,
          }}>
            Upgrade →
          </a>
        </div>
      )}
    </div>
  );
}

// ── Typewriter effect for result text ────────────────
function TypewriterText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!text) return;
    setDisplayed('');
    setDone(false);

    // Show text character by character — fast typewriter
    let i = 0;
    const CHUNK = 8; // chars per tick for fast feel
    const INTERVAL = 16; // ms

    const timer = setInterval(() => {
      if (i >= text.length) {
        setDisplayed(text);
        setDone(true);
        clearInterval(timer);
        return;
      }
      i = Math.min(i + CHUNK, text.length);
      setDisplayed(text.slice(0, i));
    }, INTERVAL);

    return () => clearInterval(timer);
  }, [text]);

  return (
    <>
      {displayed}
      {!done && (
        <span style={{
          display: 'inline-block', width: 2, height: 16,
          background: '#6366f1', marginLeft: 1, verticalAlign: 'text-bottom',
          animation: 'blink 0.7s ease-in-out infinite',
        }} />
      )}
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </>
  );
}

// ── The Run Button ────────────────────────────────────
function RunButton({ onClick, plan }: { onClick: () => void; plan: string }) {
  return (
    <div>
      <button
        onClick={onClick}
        style={{
          width: '100%', padding: '14px 20px',
          borderRadius: 12, cursor: 'pointer', border: 'none',
          background: 'linear-gradient(135deg, #059669, #047857)',
          color: 'white', fontSize: 15, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          boxShadow: '0 4px 20px rgba(5,150,105,0.3)',
          transition: 'all 0.2s',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Shimmer effect */}
        <div style={{
          position: 'absolute', top: 0, left: '-100%',
          width: '100%', height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
          animation: 'shimmer-btn 3s ease-in-out infinite',
        }} />
        <span style={{ fontSize: 18 }}>▶</span>
        <span>Run with Claude</span>
        <span style={{
          fontSize: 11, padding: '2px 8px', borderRadius: 8,
          background: 'rgba(255,255,255,0.15)',
        }}>
          {plan === 'FREE' ? '3 free/day' : 'Unlimited'}
        </span>
      </button>

      <p style={{
        fontSize: 11, color: '#334155', textAlign: 'center',
        marginTop: 8,
      }}>
        Powered by Claude 3.5 Sonnet · Result appears below instantly
      </p>

      <style>{`
        @keyframes shimmer-btn {
          0% { left: -100%; }
          50% { left: 100%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
}

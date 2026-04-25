'use client';
import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

interface RunResultProps { prompt: string; category: string; promptId?: string; }
type RunState = 'loading' | 'success' | 'error' | 'limit';

export function RunResult({ prompt, category, promptId }: RunResultProps) {
  const { data: session } = useSession();
  const [state, setState] = useState<RunState>('loading');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<{ tokens: number; time: number } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const plan = (session?.user as any)?.plan ?? 'FREE';

  useEffect(() => { runPrompt(); }, []);
  useEffect(() => { if (state === 'success' && resultRef.current) resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, [state]);

  const runPrompt = async () => {
    setState('loading'); setResult(''); setError('');
    try {
      const res = await fetch('/api/run-prompt', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt, category, promptId }) });
      const data = await res.json();
      if (res.status === 429) { setState('limit'); setError(data.message || 'Daily limit reached'); return; }
      if (!res.ok || !data.success) { setState('error'); setError(data.error || 'Something went wrong. Please try again.'); return; }
      setResult(data.result); setStats({ tokens: data.tokensUsed, time: data.executionTime }); setState('success');
    } catch (e) { setState('error'); setError('Network error. Please check your connection.'); }
  };

  const copyResult = async () => { await navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  if (state === 'loading') return (
    <div style={{ padding: 24, borderRadius: 14, background: 'rgba(5,150,105,0.05)', border: '1px solid rgba(5,150,105,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(5,150,105,0.3)', borderTopColor: '#059669', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />
        <span style={{ fontSize: 14, color: '#94a3b8', fontWeight: 500 }}>PromptiFill AI is generating your result...</span>
      </div>
      {[100,85,92,70,88,60,78].map((w,i) => <div key={i} style={{ height: 14, borderRadius: 6, marginBottom: 10, width: `${w}%`, background: 'linear-gradient(90deg,rgba(5,150,105,0.08) 25%,rgba(5,150,105,0.18) 50%,rgba(5,150,105,0.08) 75%)', backgroundSize: '200% 100%', animation: `shimmer 1.5s ease-in-out infinite`, animationDelay: `${i*0.1}s` }} />)}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );

  if (state === 'limit') return (
    <div style={{ padding: 28, borderRadius: 14, background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.25)', textAlign: 'center' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>⚡</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text1)', marginBottom: 8 }}>Daily Run Limit Reached</div>
      <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20, lineHeight: 1.7 }}>Free plan includes 3 AI runs per day.<br/>Upgrade to Pro for unlimited runs inside PromptiFill.</div>
      <a href="/pricing" style={{ padding: '10px 24px', borderRadius: 10, fontSize: 14, fontWeight: 700, background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: 'white', textDecoration: 'none', display: 'inline-block' }}>Upgrade to Pro — Unlimited Runs →</a>
    </div>
  );

  if (state === 'error') return (
    <div>
      <div style={{ padding: '14px 16px', borderRadius: 10, marginBottom: 12, background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', fontSize: 13, color: '#f87171' }}>⚠️ {error}</div>
      <button onClick={runPrompt} style={{ width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#059669,#047857)', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>↺ Try Again</button>
    </div>
  );

  return (
    <div ref={resultRef}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px rgba(74,222,128,0.6)' }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text1)' }}>PromptiFill AI Result</span>
          {stats && <span style={{ fontSize: 11, color: '#334155', padding: '2px 8px', background: 'rgba(255,255,255,0.04)', borderRadius: 20 }}>{stats.tokens} tokens · {(stats.time/1000).toFixed(1)}s</span>}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={copyResult} style={{ padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: copied ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.06)', border: `1px solid ${copied ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.1)'}`, color: copied ? '#4ade80' : '#94a3b8', cursor: 'pointer', transition: 'all 0.2s' }}>{copied ? '✓ Copied!' : '⎘ Copy Result'}</button>
          <button onClick={runPrompt} style={{ padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', color: '#818cf8', cursor: 'pointer' }}>🔄 Regenerate</button>
        </div>
      </div>
      <div style={{ padding: '20px', borderRadius: 14, background: 'rgba(4,4,20,0.8)', border: '1px solid rgba(74,222,128,0.2)', fontSize: 14, color: '#e2e8f0', lineHeight: 1.85, whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: 480, overflowY: 'auto' }}>
        <TypewriterText text={result} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontSize: 11, color: '#334155' }}>✦ Generated by PromptiFill AI · Claude Sonnet{plan === 'FREE' && <span style={{ marginLeft: 6, color: '#6366f1' }}>· Free: 3 runs/day</span>}</div>
      </div>
      {plan === 'FREE' && (
        <div style={{ marginTop: 14, padding: '12px 16px', borderRadius: 10, background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: 12, color: '#64748b' }}>✦ Pro users get unlimited AI runs + all 10 categories</span>
          <a href="/pricing" style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', textDecoration: 'none', padding: '4px 10px', background: 'rgba(99,102,241,0.12)', borderRadius: 6 }}>Upgrade to Pro →</a>
        </div>
      )}
    </div>
  );
}

function TypewriterText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!text) return; setDisplayed(''); setDone(false); let i = 0;
    const timer = setInterval(() => { if (i >= text.length) { setDisplayed(text); setDone(true); clearInterval(timer); return; } i = Math.min(i+10, text.length); setDisplayed(text.slice(0,i)); }, 16);
    return () => clearInterval(timer);
  }, [text]);
  return (<>{displayed}{!done && <span style={{ display:'inline-block',width:2,height:16,background:'#4ade80',marginLeft:1,verticalAlign:'text-bottom',animation:'blink 0.7s ease-in-out infinite' }} />}<style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style></>);
}

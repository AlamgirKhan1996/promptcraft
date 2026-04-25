'use client';
// components/generator/PromptOutput.tsx
import { useState } from 'react';
import { RunResult } from '../prompt/RunResult';

interface Props {
  prompt: string;
  score: number | null;
  reason: string;
  improvements: string[];
  promptId?: string | null;
  generating: boolean;
  category?: string;
  onRegenerate: () => void;
  onImprove: () => void;
}

export function PromptOutput({ prompt, score, reason, improvements, generating, category = "general", onRegenerate, onImprove }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!prompt && !generating) {
    return (
      <div style={{
        minHeight: 320, border: '2px dashed var(--border)', borderRadius: 16,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: 12, color: 'var(--text3)', textAlign: 'center', padding: 32,
      }}>
        <div style={{ fontSize: 40 }}>✦</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text2)' }}>Your prompt will appear here</div>
        <div style={{ fontSize: 14, lineHeight: 1.7 }}>Fill in the form on the left<br />and click Generate Perfect Prompt</div>
      </div>
    );
  }

  if (generating) {
    return (
      <div style={{ background: 'var(--bg2)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 16, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', animation: 'dot-pulse 1.5s ease-in-out infinite' }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text2)' }}>Generating prompt...</span>
        </div>
        {[100, 90, 95, 80, 88].map((w, i) => (
          <div key={i} className="skeleton" style={{ height: 18, width: `${w}%`, marginBottom: 12 }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 16, padding: 24, boxShadow: '0 0 30px rgba(99,102,241,0.08)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: 'var(--text2)' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }} />
          Generated Prompt
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={copy} style={{
            padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer',
            border: '1px solid',
            borderColor: copied ? 'rgba(74,222,128,0.3)' : 'var(--border2)',
            background: copied ? 'rgba(74,222,128,0.1)' : 'var(--bg3)',
            color: copied ? 'var(--success)' : 'var(--text2)',
            transition: 'all 0.2s',
          }}>{copied ? '✓ Copied!' : '⎘ Copy'}</button>
          <button onClick={onRegenerate} style={{ padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: '1px solid var(--border2)', background: 'var(--bg3)', color: 'var(--text2)' }}>↺ Regenerate</button>
          <button onClick={onImprove} style={{ padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: '1px solid var(--border2)', background: 'var(--bg3)', color: 'var(--text2)' }}>✦ Improve</button>
        </div>
      </div>

      {/* Prompt text */}
      <div style={{
        background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10,
        padding: '18px', fontSize: 13, color: 'var(--text1)', lineHeight: 1.85,
        whiteSpace: 'pre-wrap', fontFamily: "'Menlo', 'Monaco', monospace",
        maxHeight: 380, overflowY: 'auto',
      }}>{prompt}</div>

      <div style={{ marginTop: 16 }}>
        <RunResult
          prompt={prompt}
          category={category}
          promptId={promptId || undefined}
        />
      </div>

      {/* Quality score */}
      {score !== null && (
        <div style={{ marginTop: 16, padding: 16, background: 'var(--bg3)', borderRadius: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)' }}>Quality Score</span>
            <span style={{ fontSize: 22, fontWeight: 700, background: 'linear-gradient(90deg, #6366f1, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {score}/10
            </span>
          </div>
          <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, marginBottom: 10 }}>
            <div style={{ height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, #6366f1, #22d3ee)', width: `${(score / 10) * 100}%`, transition: 'width 0.8s ease' }} />
          </div>
          {reason && <p style={{ fontSize: 13, color: 'var(--text3)', lineHeight: 1.5, marginBottom: 10 }}>{reason}</p>}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {improvements.slice(0, 3).map((imp, i) => (
              <span key={i} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: 'rgba(99,102,241,0.15)', color: 'var(--accent)', border: '1px solid rgba(99,102,241,0.2)', fontWeight: 500 }}>{imp}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

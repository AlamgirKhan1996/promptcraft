'use client';
// app/generate/page.tsx
import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { CategorySelector } from '@/components/generator/CategorySelector';
import { PromptForm } from '@/components/generator/PromptForm';
import { PromptOutput } from '@/components/generator/PromptOutput';
import { getCategoryById } from '@/lib/prompt-templates';

interface Result {
  prompt: string;
  score: number | null;
  reason: string;
  improvements: string[];
  promptId?: string;
  remaining?: number;
}

// ─── Inner component uses useSearchParams ───────────────
function GenerateInner() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [prefilledValues, setPrefilledValues] = useState<Record<string, string>>({});
  const [templateTitle, setTemplateTitle] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [remaining, setRemaining] = useState<number | undefined>(undefined);

  const user = session?.user as any;
  const plan = user?.plan ?? 'FREE';
  const category = selectedCat ? getCategoryById(selectedCat) : null;

  // Read template from sessionStorage
  useEffect(() => {
    const templateParam = searchParams.get('template');
    const categoryParam = searchParams.get('category');

    if (templateParam && categoryParam) {
      try {
        const stored = sessionStorage.getItem('promptifill_template');
        if (stored) {
          const data = JSON.parse(stored);
          if (data.templateId === templateParam) {
            setSelectedCat(data.categoryId);
            setPrefilledValues(data.inputs || {});
            setTemplateTitle(data.templateTitle || null);
            sessionStorage.removeItem('promptifill_template');
            setTimeout(() => setTemplateTitle(null), 4000);
          }
        }
      } catch {
        setSelectedCat(categoryParam);
      }
    }
  }, [searchParams]);

  const handleGenerate = async (
    inputs: Record<string, string>,
    improve = false,
    existingPrompt?: string
  ) => {
    setGenerating(true);
    setError('');
    try {
      const res = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId: selectedCat, inputs, improve, existingPrompt }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Generation failed. Please try again.');
        return;
      }
      setResult(data);
      if (data.remaining !== undefined) setRemaining(data.remaining);
      setTimeout(() => {
        const el = document.getElementById('prompt-output');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text1)', marginBottom: 4 }}>
          ✦ Prompt Generator
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text3)' }}>
          Pick a category → Fill blanks → Get a perfect AI prompt instantly
        </p>
      </div>

      {/* Template loaded banner */}
      {templateTitle && (
        <div style={{
          padding: '12px 18px', borderRadius: 10, marginBottom: 20,
          background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)',
          display: 'flex', alignItems: 'center', gap: 10,
          fontSize: 14, color: '#4ade80', fontWeight: 500,
        }}>
          <span style={{ fontSize: 18 }}>✅</span>
          Template loaded: <strong>{templateTitle}</strong> — form pre-filled! Edit any field and click Generate.
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          padding: '12px 16px', borderRadius: 10, marginBottom: 20,
          background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.25)',
          fontSize: 14, color: '#eab308',
        }}>⚠ {error}</div>
      )}

      {/* Category selector */}
      <CategorySelector
        selected={selectedCat}
        onSelect={(id) => {
          setSelectedCat(id);
          setResult(null);
          setError('');
          setPrefilledValues({});
          setTemplateTitle(null);
        }}
        userPlan={plan}
      />

      {/* Generator layout */}
      {category && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
          marginTop: 28,
        }}>
          <div>
            <PromptForm
              category={category}
              onGenerate={handleGenerate}
              generating={generating}
              existingPrompt={result?.prompt}
              prefilledValues={prefilledValues}
              remaining={remaining ?? (plan === 'FREE' ? 5 : undefined)}
              userPlan={plan}
            />
          </div>
          <div id="prompt-output">
            <PromptOutput
              prompt={result?.prompt ?? ''}
              score={result?.score ?? null}
              reason={result?.reason ?? ''}
              improvements={result?.improvements ?? []}
              promptId={result?.promptId}
              generating={generating}
              onRegenerate={() => handleGenerate(prefilledValues)}
              onImprove={() => result && handleGenerate(prefilledValues, true, result.prompt)}
            />
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .gen-layout { grid-template-columns: 1fr !important; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ─── Outer page wraps with Suspense ─────────────────────
export default function GeneratePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <Suspense fallback={
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px' }}>
          <div className="skeleton" style={{ height: 32, width: 200, marginBottom: 20, borderRadius: 8 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 10 }}>
            {[1,2,3,4,5].map(i => (
              <div key={i} className="skeleton" style={{ height: 100, borderRadius: 14 }} />
            ))}
          </div>
        </div>
      }>
        <GenerateInner />
      </Suspense>
    </div>
  );
}

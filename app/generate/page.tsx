'use client';
// app/generate/page.tsx
import { useState } from 'react';
import { useSession } from 'next-auth/react';
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

export default function GeneratePage() {
  const { data: session } = useSession();
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [remaining, setRemaining] = useState<number | undefined>(undefined);
  const [showOutput, setShowOutput] = useState(false);

  const user = session?.user as any;
  const plan = user?.plan ?? 'FREE';
  const category = selectedCat ? getCategoryById(selectedCat) : null;

  const handleGenerate = async (inputs: Record<string, string>, improve = false, existingPrompt?: string) => {
    setGenerating(true);
    setError('');
    // On mobile scroll to output after generating
    setShowOutput(true);
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

      // Scroll to output on mobile
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
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div className="page-pad" style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 className="page-title" style={{ fontSize: 26, fontWeight: 700, color: 'var(--text1)', marginBottom: 4 }}>
            ✦ Prompt Generator
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text3)' }}>
            Pick a category → Fill blanks → Get a perfect AI prompt
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            padding: '12px 16px', borderRadius: 10, marginBottom: 20, fontSize: 14,
            background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.25)', color: '#eab308',
          }}>
            ⚠ {error}
          </div>
        )}

        {/* Category selector */}
        <CategorySelector
          selected={selectedCat}
          onSelect={(id) => { setSelectedCat(id); setResult(null); setShowOutput(false); setError(''); }}
          userPlan={plan}
        />

        {/* Generator layout — stacked on mobile, side by side on desktop */}
        {category && (
          <div
            className="gen-layout"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 24,
              marginTop: 28,
            }}
          >
            {/* Form */}
            <div>
              <PromptForm
                category={category}
                onGenerate={handleGenerate}
                generating={generating}
                existingPrompt={result?.prompt}
                remaining={remaining ?? (plan === 'FREE' ? 5 : undefined)}
                userPlan={plan}
              />
            </div>

            {/* Output */}
            <div id="prompt-output">
              <PromptOutput
                prompt={result?.prompt ?? ''}
                score={result?.score ?? null}
                reason={result?.reason ?? ''}
                improvements={result?.improvements ?? []}
                promptId={result?.promptId}
                generating={generating}
                onRegenerate={() => handleGenerate({}, false)}
                onImprove={() => result && handleGenerate({}, true, result.prompt)}
              />
            </div>
          </div>
        )}

        {/* Mobile tip */}
        {category && (
          <div style={{
            display: 'none',
            marginTop: 16, padding: '10px 14px', borderRadius: 10,
            background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
            fontSize: 13, color: 'var(--text3)',
          }} className="mobile-only-tip">
            💡 Tip: After generating, scroll down to see your prompt!
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .gen-layout {
            grid-template-columns: 1fr !important;
          }
          .mobile-only-tip {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}

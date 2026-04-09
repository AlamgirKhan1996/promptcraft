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

  const user = session?.user as any;
  const plan = user?.plan ?? 'FREE';
  const category = selectedCat ? getCategoryById(selectedCat) : null;

  const handleGenerate = async (inputs: Record<string, string>, improve = false, existingPrompt?: string) => {
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
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text1)', marginBottom: 6 }}>✦ Prompt Generator</h1>
        <p style={{ fontSize: 15, color: 'var(--text3)', marginBottom: 32 }}>
          Pick a category → Fill in the blanks → Get a perfect AI prompt instantly.
        </p>

        {error && (
          <div style={{ padding: '12px 16px', borderRadius: 10, marginBottom: 20, fontSize: 14, background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.25)', color: '#eab308' }}>
            ⚠ {error}
          </div>
        )}

        <CategorySelector selected={selectedCat} onSelect={(id) => { setSelectedCat(id); setResult(null); }} userPlan={plan} />

        {category && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 32 }}>
            <PromptForm
              category={category}
              onGenerate={handleGenerate}
              generating={generating}
              existingPrompt={result?.prompt}
              remaining={remaining ?? (plan === 'FREE' ? 5 : undefined)}
              userPlan={plan}
            />
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
        )}
      </div>
    </div>
  );
}

'use client';
// app/templates/page.tsx
// Templates load inline — click Use Template → form pre-fills instantly
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CATEGORIES } from '@/lib/prompt-templates';

interface Template {
  id: string;
  category: string;
  title: string;
  description: string;
  inputs: Record<string, string>;
  rating: number;
  usageCount: number;
}

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [using, setUsing] = useState<string | null>(null);
  const [preview, setPreview] = useState<Template | null>(null);

  useEffect(() => {
    fetch('/api/templates')
      .then(r => r.json())
      .then(data => { setTemplates(data.templates || []); setLoading(false); });
  }, []);

  const filtered = templates.filter(t => {
    const matchCat = !category || t.category === category;
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleUseTemplate = (template: Template) => {
    setUsing(template.id);
    // Store template in sessionStorage → generator page reads it
    sessionStorage.setItem('promptifill_template', JSON.stringify({
      categoryId: template.category,
      inputs: template.inputs,
      templateId: template.id,
      templateTitle: template.title,
    }));
    // Small delay for visual feedback then navigate
    setTimeout(() => {
      router.push(`/generate?template=${template.id}&category=${template.category}`);
    }, 400);
  };

  const cat = CATEGORIES.find(c => c.id === preview?.category);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text1)', marginBottom: 6 }}>
            🗂 Prompt Templates
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text3)' }}>
            Click any template → form pre-fills automatically → edit if needed → generate!
          </p>
        </div>

        {/* Search + Filter row */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="🔍 Search templates..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1, minWidth: 200,
              background: 'var(--bg2)', border: '1px solid var(--border2)',
              borderRadius: 10, padding: '10px 14px',
              color: 'var(--text1)', fontSize: 14, outline: 'none',
            }}
          />
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{
              background: 'var(--bg2)', border: '1px solid var(--border2)',
              borderRadius: 10, padding: '10px 14px',
              color: 'var(--text1)', fontSize: 14, outline: 'none', cursor: 'pointer',
            }}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
          </select>
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
          <button
            onClick={() => setCategory('')}
            style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
              cursor: 'pointer', border: '1px solid',
              background: !category ? 'rgba(99,102,241,0.2)' : 'transparent',
              color: !category ? 'var(--accent)' : 'var(--text3)',
              borderColor: !category ? 'rgba(99,102,241,0.4)' : 'var(--border)',
            }}
          >All</button>
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              onClick={() => setCategory(category === c.id ? '' : c.id)}
              style={{
                padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                cursor: 'pointer', border: '1px solid',
                background: category === c.id ? 'rgba(99,102,241,0.2)' : 'transparent',
                color: category === c.id ? 'var(--accent)' : 'var(--text3)',
                borderColor: category === c.id ? 'rgba(99,102,241,0.4)' : 'var(--border)',
              }}
            >{c.emoji} {c.name}</button>
          ))}
        </div>

        {/* Results count */}
        {!loading && (
          <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 16 }}>
            {filtered.length} template{filtered.length !== 1 ? 's' : ''} found
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="skeleton" style={{ height: 160, borderRadius: 14 }} />
            ))}
          </div>
        )}

        {/* Template grid */}
        {!loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
            {filtered.map(t => {
              const c = CATEGORIES.find(x => x.id === t.category);
              const isUsing = using === t.id;
              return (
                <div
                  key={t.id}
                  style={{
                    background: 'var(--bg2)', border: `1px solid ${preview?.id === t.id ? 'rgba(99,102,241,0.5)' : 'var(--border)'}`,
                    borderRadius: 14, padding: '20px', transition: 'all 0.2s',
                    cursor: 'pointer',
                  }}
                  onClick={() => setPreview(preview?.id === t.id ? null : t)}
                >
                  {/* Top row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <span style={{ fontSize: 18 }}>{c?.emoji}</span>
                    <span style={{
                      fontSize: 11, color: 'var(--accent)', fontWeight: 600,
                      background: 'rgba(99,102,241,0.15)', padding: '2px 8px', borderRadius: 20,
                    }}>{c?.name}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text3)', fontWeight: 600 }}>
                      ⭐ {t.rating.toFixed(1)}
                    </span>
                  </div>

                  {/* Title */}
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text1)', marginBottom: 6 }}>
                    {t.title}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text3)', lineHeight: 1.5, marginBottom: 14 }}>
                    {t.description}
                  </div>

                  {/* Preview — inputs */}
                  {preview?.id === t.id && (
                    <div style={{
                      background: 'var(--bg3)', borderRadius: 8, padding: '12px',
                      marginBottom: 14, border: '1px solid var(--border)',
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                        Pre-filled values
                      </div>
                      {Object.entries(t.inputs).slice(0, 4).map(([key, val]) => (
                        <div key={key} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'flex-start' }}>
                          <span style={{ fontSize: 11, color: 'var(--text3)', minWidth: 80, paddingTop: 2, textTransform: 'capitalize' }}>
                            {key.replace(/_/g, ' ')}:
                          </span>
                          <span style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.4 }}>
                            {val || '—'}
                          </span>
                        </div>
                      ))}
                      {Object.keys(t.inputs).length > 4 && (
                        <div style={{ fontSize: 11, color: 'var(--text3)' }}>
                          +{Object.keys(t.inputs).length - 4} more fields...
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: 8 }} onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => handleUseTemplate(t)}
                      disabled={isUsing}
                      style={{
                        flex: 1, padding: '10px', borderRadius: 8,
                        fontSize: 13, fontWeight: 700, cursor: isUsing ? 'not-allowed' : 'pointer',
                        background: isUsing ? 'rgba(99,102,241,0.4)' : 'var(--accent)',
                        color: 'white', border: 'none', transition: 'all 0.2s',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      }}
                    >
                      {isUsing ? (
                        <><span style={{ display: 'inline-block', width: 12, height: 12, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Loading...</>
                      ) : (
                        '✦ Use This Template'
                      )}
                    </button>
                    <button
                      onClick={() => setPreview(preview?.id === t.id ? null : t)}
                      style={{
                        padding: '10px 14px', borderRadius: 8, fontSize: 13,
                        fontWeight: 500, cursor: 'pointer',
                        background: 'transparent', color: 'var(--text2)',
                        border: '1px solid var(--border2)',
                      }}
                    >
                      {preview?.id === t.id ? 'Hide' : 'Preview'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🗂</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text2)', marginBottom: 8 }}>
              No templates found
            </div>
            <div style={{ fontSize: 14, color: 'var(--text3)' }}>
              Try a different category or clear your search
            </div>
          </div>
        )}
      </div>
      <Footer />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

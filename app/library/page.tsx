'use client';
// app/library/page.tsx
import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { CATEGORIES } from '@/lib/prompt-templates';

interface Prompt { id: string; category: string; categoryEmoji: string; generatedPrompt: string; qualityScore: number | null; language: string; isPublic: boolean; createdAt: string; }

export default function LibraryPage() {
  const { data: session, status } = useSession();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (status !== 'authenticated') { setLoading(false); return; }
    const params = new URLSearchParams();
    if (catFilter) params.set('category', catFilter);
    if (search) params.set('search', search);
    fetch(`/api/prompts?${params}`)
      .then((r) => r.json())
      .then((d) => { setPrompts(d.prompts || []); setLoading(false); });
  }, [status, catFilter, search]);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => { setCopied(id); setTimeout(() => setCopied(null), 2000); });
  };

  const deletePrompt = async (id: string) => {
    await fetch(`/api/prompts?id=${id}`, { method: 'DELETE' });
    setPrompts((p) => p.filter((x) => x.id !== id));
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text1)', marginBottom: 6 }}>📚 Prompt Library</h1>
        <p style={{ fontSize: 15, color: 'var(--text3)', marginBottom: 28 }}>All your saved prompts, searchable and organized.</p>

        {status !== 'authenticated' ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', background: 'var(--bg2)', borderRadius: 16, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>🔒</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)', marginBottom: 10 }}>Sign in to save your prompts</div>
            <div style={{ fontSize: 14, color: 'var(--text3)', marginBottom: 24 }}>Your generated prompts are automatically saved when you are signed in.</div>
            <button onClick={() => signIn('google')} style={{ padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 600, background: 'var(--accent)', color: 'white', border: 'none', cursor: 'pointer' }}>Sign in with Google</button>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
              <input
                type="text" placeholder="Search prompts..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ flex: 1, minWidth: 200, background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 10, padding: '10px 14px', color: 'var(--text1)', fontSize: 14, outline: 'none' }}
              />
              <select
                value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
                style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 10, padding: '10px 14px', color: 'var(--text1)', fontSize: 14, outline: 'none', cursor: 'pointer' }}
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
              </select>
            </div>

            {loading ? (
              [1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: 90, marginBottom: 10, borderRadius: 12 }} />)
            ) : prompts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text3)' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>✦</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text2)', marginBottom: 8 }}>No prompts found</div>
                <Link href="/generate" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>Generate your first prompt →</Link>
              </div>
            ) : (
              prompts.map((p) => (
                <div key={p.id} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, marginBottom: 10, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                      <span>{p.categoryEmoji}</span>
                      <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, background: 'rgba(99,102,241,0.15)', padding: '2px 8px', borderRadius: 20 }}>{p.category}</span>
                      <span style={{ fontSize: 11, color: 'var(--text3)', background: 'var(--bg3)', padding: '2px 8px', borderRadius: 20 }}>{p.language}</span>
                      {p.qualityScore && <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, marginLeft: 'auto' }}>⭐ {p.qualityScore}/10</span>}
                      <span style={{ fontSize: 11, color: 'var(--text3)' }}>{new Date(p.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div
                      style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, cursor: 'pointer', display: '-webkit-box', WebkitLineClamp: expanded === p.id ? 999 : 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                      onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                    >{p.generatedPrompt}</div>
                  </div>
                  <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
                    <button onClick={() => copy(p.generatedPrompt, p.id)} style={{ padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: '1px solid var(--border2)', background: copied === p.id ? 'rgba(74,222,128,0.1)' : 'var(--bg3)', color: copied === p.id ? 'var(--success)' : 'var(--text2)' }}>{copied === p.id ? '✓ Copied' : '⎘ Copy'}</button>
                    <button onClick={() => setExpanded(expanded === p.id ? null : p.id)} style={{ padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: '1px solid var(--border2)', background: 'var(--bg3)', color: 'var(--text2)' }}>{expanded === p.id ? 'Collapse' : 'Expand'}</button>
                    <button onClick={() => deletePrompt(p.id)} style={{ padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: '1px solid rgba(239,68,68,0.2)', background: 'transparent', color: '#ef4444', marginLeft: 'auto' }}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}

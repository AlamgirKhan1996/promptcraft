'use client';
// app/dashboard/page.tsx
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';

interface Prompt { id: string; category: string; categoryEmoji: string; generatedPrompt: string; qualityScore: number | null; createdAt: string; }
interface Stats { total: number; today: number; avgScore: number; topCategory: string; }

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, today: 0, avgScore: 0, topCategory: '—' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/generate');
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    fetch('/api/prompts?page=1')
      .then((r) => r.json())
      .then((data) => {
        const p: Prompt[] = data.prompts || [];
        setPrompts(p);
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const todayCount = p.filter((x) => new Date(x.createdAt) >= today).length;
        const scores = p.filter((x) => x.qualityScore).map((x) => x.qualityScore!);
        const avgScore = scores.length ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 : 0;
        const catMap: Record<string, number> = {};
        p.forEach((x) => { catMap[x.category] = (catMap[x.category] || 0) + 1; });
        const topCat = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
        setStats({ total: data.total || p.length, today: todayCount, avgScore, topCategory: topCat });
        setLoading(false);
      });
  }, [status]);

  const plan = (session?.user as any)?.plan ?? 'FREE';
  const statCards = [
    { label: 'Total Prompts', value: stats.total },
    { label: 'Generated Today', value: stats.today },
    { label: 'Avg Quality Score', value: `${stats.avgScore}/10` },
    { label: 'Top Category', value: stats.topCategory },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text1)', marginBottom: 4 }}>Dashboard</h1>
            <p style={{ fontSize: 14, color: 'var(--text3)' }}>Welcome back, {session?.user?.name?.split(' ')[0]} 👋</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {plan === 'FREE' && (
              <Link href="/pricing" style={{ padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, background: 'var(--accent)', color: 'white', textDecoration: 'none' }}>
                ✦ Upgrade to Pro
              </Link>
            )}
            <Link href="/generate" style={{ padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, background: 'var(--bg2)', color: 'var(--text1)', textDecoration: 'none', border: '1px solid var(--border)' }}>
              + New Prompt
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 36 }}>
          {statCards.map((s) => (
            <div key={s.label} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text1)' }}>{loading ? '—' : s.value}</div>
            </div>
          ))}
        </div>

        {/* Plan banner */}
        {plan === 'FREE' && (
          <div style={{ padding: '16px 20px', borderRadius: 12, marginBottom: 28, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text1)', marginBottom: 4 }}>You are on the Free plan</div>
              <div style={{ fontSize: 13, color: 'var(--text3)' }}>Upgrade to Pro for unlimited generations, all 10 categories, and Arabic GCC prompts.</div>
            </div>
            <Link href="/pricing" style={{ padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, background: 'var(--accent)', color: 'white', textDecoration: 'none', whiteSpace: 'nowrap' }}>
              Upgrade — $9/mo →
            </Link>
          </div>
        )}

        {/* Recent prompts */}
        <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text2)', marginBottom: 16 }}>Recent Prompts</h2>
        {loading ? (
          [1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: 80, marginBottom: 10, borderRadius: 12 }} />)
        ) : prompts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text3)' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>✦</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text2)', marginBottom: 8 }}>No prompts yet</div>
            <Link href="/generate" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>Generate your first prompt →</Link>
          </div>
        ) : (
          prompts.slice(0, 10).map((p) => (
            <div key={p.id} style={{ padding: '16px', borderRadius: 12, background: 'var(--bg2)', border: '1px solid var(--border)', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span>{p.categoryEmoji}</span>
                <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, background: 'rgba(99,102,241,0.15)', padding: '2px 8px', borderRadius: 20 }}>{p.category}</span>
                <span style={{ fontSize: 11, color: 'var(--text3)', marginLeft: 'auto' }}>{new Date(p.createdAt).toLocaleDateString()}</span>
                {p.qualityScore && <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>{p.qualityScore}/10</span>}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {p.generatedPrompt}
              </div>
            </div>
          ))
        )}

        {prompts.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Link href="/library" style={{ fontSize: 14, color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>View full prompt library →</Link>
          </div>
        )}
      </div>
    </div>
  );
}

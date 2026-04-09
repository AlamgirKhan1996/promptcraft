// app/templates/page.tsx
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CATEGORIES } from '@/lib/prompt-templates';

export const dynamic = 'force-dynamic';

export default async function TemplatesPage({ searchParams }: { searchParams: { category?: string } }) {
  const category = searchParams.category;
  const templates = await prisma.promptTemplate.findMany({
    where: { isActive: true, ...(category ? { category } : {}) },
    orderBy: { rating: 'desc' },
    take: 50,
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text1)', marginBottom: 6 }}>🗂 Prompt Templates</h1>
        <p style={{ fontSize: 15, color: 'var(--text3)', marginBottom: 28 }}>
          {templates.length} ready-to-use templates. Click any to open it in the generator.
        </p>

        {/* Category filter */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
          <Link href="/templates" style={{ padding: '7px 16px', borderRadius: 20, fontSize: 13, fontWeight: 500, textDecoration: 'none', background: !category ? 'rgba(99,102,241,0.2)' : 'var(--bg2)', color: !category ? 'var(--accent)' : 'var(--text2)', border: '1px solid', borderColor: !category ? 'rgba(99,102,241,0.4)' : 'var(--border)' }}>All</Link>
          {CATEGORIES.map((c) => (
            <Link key={c.id} href={`/templates?category=${c.id}`} style={{ padding: '7px 16px', borderRadius: 20, fontSize: 13, fontWeight: 500, textDecoration: 'none', background: category === c.id ? 'rgba(99,102,241,0.2)' : 'var(--bg2)', color: category === c.id ? 'var(--accent)' : 'var(--text2)', border: '1px solid', borderColor: category === c.id ? 'rgba(99,102,241,0.4)' : 'var(--border)' }}>
              {c.emoji} {c.name}
            </Link>
          ))}
        </div>

        {/* Template grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
          {templates.map((t) => {
            const cat = CATEGORIES.find((c) => c.id === t.category);
            return (
              <div key={t.id} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 20 }}>{cat?.emoji}</span>
                  <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, background: 'rgba(99,102,241,0.15)', padding: '2px 8px', borderRadius: 20 }}>{cat?.name}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text3)', fontWeight: 600 }}>⭐ {t.rating.toFixed(1)}</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text1)', marginBottom: 6 }}>{t.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text3)', lineHeight: 1.5, marginBottom: 16 }}>{t.description}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Link href={`/generate?category=${t.category}&template=${t.id}`} style={{ flex: 1, textAlign: 'center', padding: '9px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'var(--accent)', color: 'white', textDecoration: 'none' }}>
                    Use Template
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {templates.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text3)' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🗂</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text2)' }}>No templates in this category yet</div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

'use client';
// components/generator/CategorySelector.tsx
import { CATEGORIES, FREE_CATEGORIES } from '@/lib/prompt-templates';

interface Props {
  selected: string | null;
  onSelect: (id: string) => void;
  userPlan?: string;
}

export function CategorySelector({ selected, onSelect, userPlan = 'FREE' }: Props) {
  return (
    <div>
      <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text2)', marginBottom: 14 }}>
        Choose Category
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
        gap: 10,
      }}>
        {CATEGORIES.map((cat) => {
          const locked = userPlan === 'FREE' && !FREE_CATEGORIES.includes(cat.id);
          const isSelected = selected === cat.id;
          return (
            <div
              key={cat.id}
              onClick={() => !locked && onSelect(cat.id)}
              style={{
                padding: '18px 16px', borderRadius: 14, cursor: locked ? 'not-allowed' : 'pointer',
                background: isSelected ? 'rgba(99,102,241,0.1)' : 'var(--bg2)',
                border: `1px solid ${isSelected ? 'rgba(99,102,241,0.5)' : 'var(--border)'}`,
                boxShadow: isSelected ? '0 0 20px rgba(99,102,241,0.15)' : 'none',
                transition: 'all 0.2s',
                opacity: locked ? 0.55 : 1,
                position: 'relative',
              }}
            >
              {locked && (
                <span style={{
                  position: 'absolute', top: 8, right: 8,
                  fontSize: 11, padding: '2px 7px', borderRadius: 20,
                  background: 'rgba(99,102,241,0.15)', color: 'var(--accent)',
                  fontWeight: 600,
                }}>PRO</span>
              )}
              <span style={{ fontSize: 26, display: 'block', marginBottom: 8 }}>{cat.emoji}</span>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text1)', marginBottom: 4 }}>{cat.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.5 }}>{cat.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

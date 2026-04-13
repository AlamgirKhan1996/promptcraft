'use client';
// components/generator/PromptForm.tsx
import { useState, useEffect } from 'react';
import { CategoryConfig, FieldConfig } from '@/lib/prompt-templates';

interface Props {
  category: CategoryConfig;
  onGenerate: (inputs: Record<string, string>, improve?: boolean, existingPrompt?: string) => void;
  generating: boolean;
  existingPrompt?: string;
  prefilledValues?: Record<string, string>;
  remaining?: number;
  userPlan?: string;
}

function ToggleField({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {options.map((opt) => (
        <button
          key={opt} type="button"
          onClick={() => onChange(opt)}
          style={{
            padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
            cursor: 'pointer', border: '1px solid',
            borderColor: value === opt ? 'rgba(99,102,241,0.4)' : 'var(--border2)',
            background: value === opt ? 'rgba(99,102,241,0.15)' : 'transparent',
            color: value === opt ? 'var(--accent)' : 'var(--text2)',
            transition: 'all 0.2s',
          }}
        >{opt}</button>
      ))}
    </div>
  );
}

function Field({ field, value, onChange }: { field: FieldConfig; value: string; onChange: (v: string) => void }) {
  const base: React.CSSProperties = {
    width: '100%', background: 'var(--bg)', border: '1px solid var(--border2)',
    borderRadius: 10, padding: '11px 14px', color: 'var(--text1)',
    fontSize: 14, outline: 'none', fontFamily: 'inherit',
    transition: 'border 0.2s',
  };

  if (field.type === 'toggle') return <ToggleField options={field.options!} value={value || field.options![0]} onChange={onChange} />;
  if (field.type === 'select') return (
    <select value={value || ''} onChange={(e) => onChange(e.target.value)} style={{ ...base, appearance: 'none', cursor: 'pointer' }}>
      <option value="">Select...</option>
      {field.options!.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
  if (field.type === 'textarea') return (
    <textarea value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} rows={3}
      style={{ ...base, resize: 'vertical', minHeight: 80 }} />
  );
  return <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} style={base} />;
}

export function PromptForm({ category, onGenerate, generating, existingPrompt, prefilledValues = {}, remaining, userPlan = 'FREE' }: Props) {
  const [values, setValues] = useState<Record<string, string>>(prefilledValues);
  const set = (key: string, val: string) => setValues((v) => ({ ...v, [key]: val }));

  // Update values when prefilledValues change (template loaded)
  useEffect(() => {
    if (Object.keys(prefilledValues).length > 0) {
      setValues(prefilledValues);
    }
  }, [prefilledValues]);

  const hasRequired = category.fields.filter((f) => f.required).every((f) => values[f.key]?.trim());
  const limitReached = remaining === 0;

  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <span style={{ fontSize: 24 }}>{category.emoji}</span>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text1)' }}>{category.name}</div>
          <div style={{ fontSize: 13, color: 'var(--text3)' }}>Fill in the fields below</div>
        </div>
        {remaining !== undefined && (
          <div style={{ marginLeft: 'auto', fontSize: 12, color: remaining <= 2 ? '#eab308' : 'var(--text3)' }}>
            {remaining} uses left today
          </div>
        )}
      </div>

      {category.fields.map((field) => (
        <div key={field.key} style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text2)', marginBottom: 7 }}>
            {field.label} {field.required && <span style={{ color: 'var(--accent)' }}>*</span>}
          </label>
          <Field field={field} value={values[field.key] || ''} onChange={(v) => set(field.key, v)} />
        </div>
      ))}

      {limitReached && (
        <div style={{ padding: '12px 16px', borderRadius: 10, marginBottom: 14, fontSize: 13,
          background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.25)', color: '#eab308' }}>
          🔒 Daily limit reached. <a href="/pricing" style={{ color: 'inherit', fontWeight: 600 }}>Upgrade to Pro →</a>
        </div>
      )}

      <button
        onClick={() => onGenerate(values)}
        disabled={generating || !hasRequired || limitReached}
        style={{
          width: '100%', padding: 14, borderRadius: 12,
          background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
          color: 'white', fontSize: 15, fontWeight: 600,
          cursor: (generating || !hasRequired || limitReached) ? 'not-allowed' : 'pointer',
          border: 'none', marginTop: 4, transition: 'all 0.2s',
          opacity: (generating || !hasRequired || limitReached) ? 0.65 : 1,
        }}
      >
        {generating ? '⏳ Generating...' : '✦ Generate Perfect Prompt'}
      </button>

      {existingPrompt && (
        <button
          onClick={() => onGenerate(values, true, existingPrompt)}
          disabled={generating}
          style={{
            width: '100%', padding: 12, borderRadius: 12, marginTop: 8,
            background: 'transparent', color: 'var(--text2)', fontSize: 14, fontWeight: 500,
            cursor: generating ? 'not-allowed' : 'pointer',
            border: '1px solid var(--border2)', transition: 'all 0.2s',
          }}
        >✨ Improve Existing Prompt</button>
      )}
    </div>
  );
}

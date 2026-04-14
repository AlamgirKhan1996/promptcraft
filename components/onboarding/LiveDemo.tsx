'use client';
// components/onboarding/LiveDemo.tsx
// Animated interactive demo showing how PromptiFill works
// Embedded on landing page — no login required

import { useState, useEffect, useRef } from 'react';

const DEMO_SCENARIOS = [
  {
    id: 'social',
    category: '📱 Social Media',
    color: '#22d3ee',
    fields: [
      { label: 'Product/Service', value: 'Saudi specialty coffee brand' },
      { label: 'Platform', value: 'Instagram' },
      { label: 'Target Audience', value: 'Saudi professionals, 25–35' },
      { label: 'Tone', value: 'Warm & Inspirational' },
      { label: 'Goal', value: 'Drive store visits' },
    ],
    output: `ROLE: Act as a GCC social media expert with 10 years of experience in Saudi consumer brands.

CONTEXT: You are creating content for a premium Saudi specialty coffee brand targeting young professionals in Riyadh.

TASK: Write an Instagram caption that evokes the morning ritual of specialty coffee, connects to Saudi culture, and drives foot traffic to the physical store.

FORMAT: 
- 120-150 words maximum
- Start with a hook that stops the scroll
- Include 1 Arabic phrase naturally
- End with a soft CTA
- Include 5 hashtags (3 Arabic, 2 English)

TONE: Warm, aspirational, culturally resonant — not salesy.

CONSTRAINTS: No generic coffee clichés. Must feel authentically Saudi.`,
    score: 9,
  },
  {
    id: 'business',
    category: '💼 Business Strategy',
    color: '#6366f1',
    fields: [
      { label: 'Product', value: 'AI ordering system for restaurants' },
      { label: 'Market', value: 'Saudi Arabia & GCC' },
      { label: 'Goal', value: 'Increase market share by 30%' },
      { label: 'Format', value: 'Go-to-market strategy' },
      { label: 'Tone', value: 'Strategic & authoritative' },
    ],
    output: `ROLE: Act as a McKinsey-level business strategist with deep expertise in GCC tech markets and F&B industry.

CONTEXT: You are advising a SaaS startup that has built an AI-powered ordering system specifically for restaurants in Saudi Arabia. The product is live with early customers but needs to scale.

TASK: Develop a comprehensive go-to-market strategy for expanding across the GCC, focusing on Q2 2025. Include customer acquisition channels, pricing strategy, and partnership opportunities.

FORMAT:
- Executive summary (100 words)
- 3 priority acquisition channels with tactics
- Pricing strategy for KSA vs UAE markets
- 90-day action plan with milestones
- Key KPIs to track

CONSTRAINTS: Strategy must account for Arabic language requirements, local payment methods (Mada, STC Pay), and cultural business norms.`,
    score: 9,
  },
  {
    id: 'arabic',
    category: '🌍 Arabic GCC',
    color: '#f59e0b',
    fields: [
      { label: 'الموضوع', value: 'تسويق تطبيق ذكاء اصطناعي' },
      { label: 'الجمهور', value: 'رواد الأعمال السعوديون' },
      { label: 'السوق', value: 'المملكة العربية السعودية' },
      { label: 'نوع المحتوى', value: 'منشور LinkedIn' },
      { label: 'الأسلوب', value: 'فصحى معاصرة' },
    ],
    output: `الدور: تصرف كخبير تسويق رقمي متخصص في السوق السعودي والخليجي، مع خبرة عميقة في قطاع التقنية وريادة الأعمال.

السياق: تقوم بإنشاء محتوى LinkedIn لمؤسس شاب يطلق تطبيقاً للذكاء الاصطناعي يستهدف رواد الأعمال السعوديين في إطار رؤية 2030.

المهمة: اكتب منشور LinkedIn احترافياً يبني المصداقية، يعرض قيمة المنتج، ويحفز التفاعل من الجمهور المستهدف.

التنسيق:
- افتتاحية قوية تجذب الانتباه (سطر واحد)
- القصة والمشكلة (50 كلمة)
- الحل والقيمة المضافة (50 كلمة)  
- دعوة للتفاعل (سؤال مفتوح)
- 4 هاشتاقات مناسبة

القيود: فصحى معاصرة سهلة القراءة، تجنب المصطلحات التقنية المعقدة، مراعاة الثقافة الخليجية.`,
    score: 9,
  },
];

function TypewriterText({ text, speed = 8 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    indexRef.current = 0;

    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span>
      {displayed}
      {!done && <span style={{ color: '#6366f1', animation: 'blink 0.8s step-end infinite' }}>|</span>}
    </span>
  );
}

export function LiveDemo() {
  const [activeScenario, setActiveScenario] = useState(0);
  const [phase, setPhase] = useState<'form' | 'generating' | 'result'>('form');
  const [filledFields, setFilledFields] = useState(0);
  const [copied, setCopied] = useState(false);
  const scenario = DEMO_SCENARIOS[activeScenario];

  // Auto-fill form fields one by one
  useEffect(() => {
    setPhase('form');
    setFilledFields(0);
    setCopied(false);

    const fieldTimer = setInterval(() => {
      setFilledFields(prev => {
        if (prev < scenario.fields.length) return prev + 1;
        clearInterval(fieldTimer);
        // Auto-generate after all fields filled
        setTimeout(() => {
          setPhase('generating');
          setTimeout(() => setPhase('result'), 2200);
        }, 600);
        return prev;
      });
    }, 700);

    return () => clearInterval(fieldTimer);
  }, [activeScenario]);

  const handleCopy = () => {
    navigator.clipboard.writeText(scenario.output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section style={{ padding: '80px 24px', background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 20, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', fontSize: 12, color: 'var(--accent)', fontWeight: 600, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>
            ▶ Live Demo — No Signup Needed
          </div>
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 800, color: 'var(--text1)', marginBottom: 12, lineHeight: 1.2 }}>
            Watch it work in real time
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text2)', maxWidth: 500, margin: '0 auto' }}>
            Pick a scenario below. Watch the form fill → prompt generate → quality score appear.
          </p>
        </div>

        {/* Scenario tabs */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 36 }}>
          {DEMO_SCENARIOS.map((s, i) => (
            <button key={s.id} onClick={() => setActiveScenario(i)}
              style={{
                padding: '10px 20px', borderRadius: 30, fontSize: 14, fontWeight: 600,
                cursor: 'pointer', border: '1px solid',
                background: activeScenario === i ? `${s.color}15` : 'transparent',
                borderColor: activeScenario === i ? `${s.color}50` : 'var(--border)',
                color: activeScenario === i ? s.color : 'var(--text3)',
                transition: 'all 0.2s',
              }}
            >{s.category}</button>
          ))}
        </div>

        {/* Demo window */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

          {/* LEFT — Form */}
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 20, padding: '24px', position: 'relative', overflow: 'hidden' }}>
            {/* Category badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: scenario.color }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text1)' }}>{scenario.category}</span>
              <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text3)' }}>
                {filledFields}/{scenario.fields.length} fields
              </span>
            </div>

            {/* Fields */}
            {scenario.fields.map((field, i) => (
              <div key={field.label} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 5, fontWeight: 500 }}>{field.label}</div>
                <div style={{
                  padding: '10px 14px', borderRadius: 10, fontSize: 13,
                  background: i < filledFields ? `${scenario.color}08` : 'var(--bg2)',
                  border: `1px solid ${i < filledFields ? `${scenario.color}35` : 'var(--border)'}`,
                  color: i < filledFields ? 'var(--text1)' : 'var(--text3)',
                  transition: 'all 0.4s ease',
                  minHeight: 40,
                }}>
                  {i < filledFields ? field.value : (
                    <span style={{ color: 'var(--text3)', fontStyle: 'italic' }}>Waiting...</span>
                  )}
                </div>
              </div>
            ))}

            {/* Generate button */}
            <button style={{
              width: '100%', padding: '13px', borderRadius: 12, marginTop: 8,
              background: filledFields === scenario.fields.length
                ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                : 'var(--bg2)',
              color: filledFields === scenario.fields.length ? 'white' : 'var(--text3)',
              border: `1px solid ${filledFields === scenario.fields.length ? 'transparent' : 'var(--border)'}`,
              fontSize: 14, fontWeight: 700, cursor: 'default',
              transition: 'all 0.4s ease',
              boxShadow: filledFields === scenario.fields.length ? '0 4px 20px rgba(99,102,241,0.3)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              {phase === 'generating' ? (
                <>
                  <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  Generating...
                </>
              ) : '✦ Generate Perfect Prompt'}
            </button>
          </div>

          {/* RIGHT — Output */}
          <div style={{ background: 'var(--bg)', border: `1px solid ${phase === 'result' ? 'rgba(99,102,241,0.35)' : 'var(--border)'}`, borderRadius: 20, padding: '24px', transition: 'border 0.4s', position: 'relative', overflow: 'hidden' }}>

            {phase === 'form' && (
              <div style={{ height: '100%', minHeight: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: 'var(--text3)', textAlign: 'center' }}>
                <div style={{ fontSize: 40, opacity: 0.3 }}>✦</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text2)' }}>Prompt will appear here</div>
                <div style={{ fontSize: 13, lineHeight: 1.6 }}>Filling in the form...<br/>then click Generate</div>
              </div>
            )}

            {phase === 'generating' && (
              <div style={{ minHeight: 300 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', animation: 'pulse 1s infinite' }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text2)' }}>Generating prompt...</span>
                </div>
                {[100, 90, 95, 75, 88, 92, 80].map((w, i) => (
                  <div key={i} className="skeleton" style={{ height: 14, width: `${w}%`, marginBottom: 10, borderRadius: 4, animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
            )}

            {phase === 'result' && (
              <div>
                {/* Output header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80' }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text2)' }}>Generated Prompt</span>
                  </div>
                  <button onClick={handleCopy} style={{
                    padding: '6px 14px', borderRadius: 7, fontSize: 12, fontWeight: 600,
                    cursor: 'pointer', border: '1px solid',
                    borderColor: copied ? 'rgba(74,222,128,0.4)' : 'var(--border2)',
                    background: copied ? 'rgba(74,222,128,0.1)' : 'var(--bg2)',
                    color: copied ? '#4ade80' : 'var(--text2)',
                    transition: 'all 0.2s',
                  }}>{copied ? '✓ Copied!' : '⎘ Copy'}</button>
                </div>

                {/* Prompt output with typewriter */}
                <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px', fontSize: 12, fontFamily: 'monospace', color: 'var(--text2)', lineHeight: 1.8, maxHeight: 220, overflowY: 'auto', marginBottom: 14 }}>
                  <TypewriterText text={scenario.output} speed={6} />
                </div>

                {/* Quality score */}
                <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text3)' }}>Quality Score</span>
                    <span style={{ fontSize: 20, fontWeight: 800, background: 'linear-gradient(90deg, #6366f1, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      {scenario.score}/10
                    </span>
                  </div>
                  <div style={{ height: 5, background: 'var(--border)', borderRadius: 3 }}>
                    <div style={{ height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, #6366f1, #22d3ee)', width: `${scenario.score * 10}%`, transition: 'width 1s ease' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTA below demo */}
        <div style={{ textAlign: 'center', marginTop: 36 }}>
          <p style={{ fontSize: 15, color: 'var(--text2)', marginBottom: 16 }}>
            Ready to generate your own prompts?
          </p>
          <a href="/generate" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', borderRadius: 30, fontSize: 15, fontWeight: 700, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', textDecoration: 'none', boxShadow: '0 8px 24px rgba(99,102,241,0.3)' }}>
            ✦ Try PromptiFill Free — No Signup Needed →
          </a>
          <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 10 }}>
            5 free prompts per day · No credit card · Works in 30 seconds
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.8); } }
        @media (max-width: 768px) {
          .demo-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

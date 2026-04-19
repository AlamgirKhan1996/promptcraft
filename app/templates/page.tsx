'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';

interface Template {
  id: string; category: string; title: string;
  description: string; inputs: Record<string, string>;
  rating: number; usageCount: number; ratingCount: number;
}

const FEATURED_IDS = ['arabic-ramadan-campaign','go-to-market-strategy','viral-instagram-product-post','customer-support-ai-agent'];

const CAT: Record<string, { emoji: string; label: string; color: string; bg: string }> = {
  social:    { emoji: '📱', label: 'Social Media',     color: '#22d3ee', bg: 'rgba(34,211,238,0.1)'  },
  business:  { emoji: '💼', label: 'Business',         color: '#6366f1', bg: 'rgba(99,102,241,0.1)'  },
  coding:    { emoji: '💻', label: 'Coding & Dev',     color: '#4ade80', bg: 'rgba(74,222,128,0.1)'  },
  email:     { emoji: '📧', label: 'Email',            color: '#f472b6', bg: 'rgba(244,114,182,0.1)' },
  ecommerce: { emoji: '🛒', label: 'eCommerce',        color: '#fb923c', bg: 'rgba(251,146,60,0.1)'  },
  design:    { emoji: '🎨', label: 'Design & UI',      color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
  education: { emoji: '📚', label: 'Education',        color: '#34d399', bg: 'rgba(52,211,153,0.1)'  },
  ai:        { emoji: '🤖', label: 'AI & Automation',  color: '#60a5fa', bg: 'rgba(96,165,250,0.1)'  },
  data:      { emoji: '📊', label: 'Data Analytics',   color: '#fbbf24', bg: 'rgba(251,191,36,0.1)'  },
  arabic:    { emoji: '🌍', label: 'Arabic GCC',       color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'  },
};

function Stars({ r }: { r: number }) {
  return (
    <span style={{ display:'inline-flex', gap:1, alignItems:'center' }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ fontSize:11, color: i<=Math.floor(r) ? '#fbbf24' : '#334155' }}>★</span>
      ))}
      <span style={{ fontSize:11, color:'#64748b', marginLeft:2 }}>{r.toFixed(1)}</span>
    </span>
  );
}

function Skeleton() {
  return (
    <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:16, padding:20 }}>
      {[60,80,100,70].map((w,i) => (
        <div key={i} className="skeleton" style={{ height:14, width:`${w}%`, borderRadius:6, marginBottom:10 }} />
      ))}
      <div style={{ display:'flex', gap:8, marginTop:8 }}>
        <div className="skeleton" style={{ height:38, flex:2, borderRadius:9 }} />
        <div className="skeleton" style={{ height:38, flex:1, borderRadius:9 }} />
      </div>
    </div>
  );
}

function Card({ t, feat, using, expanded, copied, setExpanded, onUse, onCopy }:
  { t:Template; feat:boolean; using:string|null; expanded:string|null; copied:string|null;
    setExpanded:(id:string|null)=>void; onUse:(t:Template)=>void; onCopy:(t:Template)=>void }) {

  const c = CAT[t.category] || { emoji:'✦', label:t.category, color:'#6366f1', bg:'rgba(99,102,241,0.1)' };
  const isUsing = using===t.id;
  const isExp   = expanded===t.id;
  const isCopied= copied===t.id;

  return (
    <div style={{
      background:'var(--bg2)',
      border:`1px solid ${isExp ? c.color+'50' : feat ? 'rgba(99,102,241,0.25)' : 'var(--border)'}`,
      borderRadius:16, padding:20, transition:'all 0.25s', cursor:'pointer', position:'relative',
      boxShadow: isExp ? `0 8px 32px ${c.color}18` : 'none',
    }} onClick={() => setExpanded(isExp ? null : t.id)}>

      {feat && (
        <div style={{ position:'absolute', top:-9, right:14, background:'linear-gradient(90deg,#6366f1,#22d3ee)',
          color:'white', fontSize:9, fontWeight:800, padding:'3px 8px', borderRadius:6, letterSpacing:0.5 }}>
          FEATURED
        </div>
      )}

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
        <div style={{ width:34, height:34, borderRadius:10, background:c.bg,
          display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, flexShrink:0 }}>
          {c.emoji}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:10, fontWeight:700, color:c.color, textTransform:'uppercase', letterSpacing:0.5, marginBottom:2 }}>
            {c.label}
          </div>
          <Stars r={t.rating} />
        </div>
        <span style={{ fontSize:11, color:'var(--text3)', transform:isExp?'rotate(180deg)':'none', transition:'transform 0.2s' }}>▼</span>
      </div>

      <div style={{ fontSize:15, fontWeight:700, color:'var(--text1)', marginBottom:6, lineHeight:1.3 }}>{t.title}</div>
      <div style={{ fontSize:13, color:'var(--text3)', lineHeight:1.6, marginBottom:14 }}>{t.description}</div>

      {/* Expanded preview */}
      {isExp && (
        <div style={{ background:'var(--bg3)', borderRadius:10, padding:'12px 14px',
          marginBottom:14, border:'1px solid var(--border)' }}
          onClick={e=>e.stopPropagation()}>
          <div style={{ fontSize:10, fontWeight:700, color:'var(--text3)', marginBottom:8,
            textTransform:'uppercase', letterSpacing:0.8 }}>📋 Pre-filled values</div>
          {Object.entries(t.inputs||{}).slice(0,5).map(([k,v]) => (
            <div key={k} style={{ display:'flex', gap:8, marginBottom:5 }}>
              <span style={{ fontSize:10, color:c.color, minWidth:72, fontWeight:600,
                textTransform:'capitalize', flexShrink:0, paddingTop:2 }}>
                {k.replace(/_/g,' ')}:
              </span>
              <span style={{ fontSize:11, color:'var(--text2)', lineHeight:1.5 }}>{String(v||'—')}</span>
            </div>
          ))}
          {Object.keys(t.inputs||{}).length > 5 && (
            <div style={{ fontSize:10, color:'var(--text3)', marginTop:4 }}>
              +{Object.keys(t.inputs).length-5} more fields...
            </div>
          )}
          <button onClick={e=>{e.stopPropagation();onCopy(t);}} style={{
            marginTop:10, padding:'6px 12px', borderRadius:7, fontSize:11, fontWeight:600,
            cursor:'pointer', border:'1px solid', transition:'all 0.2s',
            background: isCopied?'rgba(74,222,128,0.1)':'var(--bg2)',
            borderColor: isCopied?'rgba(74,222,128,0.3)':'var(--border2)',
            color: isCopied?'#4ade80':'var(--text3)',
          }}>{isCopied?'✓ Copied!':'⎘ Copy values'}</button>
        </div>
      )}

      {/* Buttons */}
      <div style={{ display:'flex', gap:8 }} onClick={e=>e.stopPropagation()}>
        <button onClick={()=>onUse(t)} disabled={isUsing} style={{
          flex:1, padding:'10px 8px', borderRadius:9, fontSize:13, fontWeight:700,
          cursor:isUsing?'not-allowed':'pointer',
          background:isUsing?'rgba(99,102,241,0.3)':'linear-gradient(135deg,#6366f1,#4f46e5)',
          color:'white', border:'none', transition:'all 0.2s',
          display:'flex', alignItems:'center', justifyContent:'center', gap:6,
          boxShadow:isUsing?'none':'0 4px 14px rgba(99,102,241,0.3)',
        }}>
          {isUsing ? (
            <><span style={{ display:'inline-block', width:12, height:12, border:'2px solid rgba(255,255,255,0.3)',
              borderTopColor:'white', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />Loading...</>
          ) : '✦ Use Template'}
        </button>
        <button onClick={()=>setExpanded(isExp?null:t.id)} style={{
          padding:'10px 12px', borderRadius:9, fontSize:12, fontWeight:500, cursor:'pointer',
          background:isExp?c.bg:'transparent', color:isExp?c.color:'var(--text3)',
          border:`1px solid ${isExp?c.color+'35':'var(--border2)'}`, transition:'all 0.2s',
        }}>{isExp?'Hide':'Preview'}</button>
      </div>
    </div>
  );
}

export default function TemplatesPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('rating');
  const [using, setUsing] = useState<string|null>(null);
  const [expanded, setExpanded] = useState<string|null>(null);
  const [copied, setCopied] = useState<string|null>(null);

  const plan = (session?.user as any)?.plan ?? 'FREE';

  useEffect(() => {
    fetch('/api/templates').then(r=>r.json()).then(d=>{
      setTemplates(d.templates||[]); setLoading(false);
    });
  }, []);

  const filtered = templates
    .filter(t => {
      const mc = category==='all' || t.category===category;
      const q = search.toLowerCase();
      const ms = !q || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
        || Object.values(t.inputs||{}).some(v=>String(v).toLowerCase().includes(q));
      return mc && ms;
    })
    .sort((a,b)=>{
      if(sort==='rating')  return b.rating-a.rating;
      if(sort==='popular') return (b.usageCount||0)-(a.usageCount||0);
      if(sort==='az')      return a.title.localeCompare(b.title);
      return 0;
    });

  const showFeatured = !search && category==='all';
  const featured = filtered.filter(t=>FEATURED_IDS.includes(t.id));
  const rest = filtered.filter(t=>!FEATURED_IDS.includes(t.id));

  const counts: Record<string,number> = { all: templates.length };
  templates.forEach(t=>{ counts[t.category]=(counts[t.category]||0)+1; });

  const onUse = (t: Template) => {
    setUsing(t.id);
    sessionStorage.setItem('promptifill_template', JSON.stringify({
      categoryId:t.category, inputs:t.inputs, templateId:t.id, templateTitle:t.title,
    }));
    setTimeout(()=>router.push(`/generate?template=${t.id}&category=${t.category}`), 400);
  };

  const onCopy = (t: Template) => {
    const text = Object.entries(t.inputs||{}).map(([k,v])=>`${k}: ${v}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(t.id);
    setTimeout(()=>setCopied(null), 2000);
  };

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <Navbar />

      {/* HERO */}
      <div style={{ background:'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.15) 0%, transparent 70%)',
        borderBottom:'1px solid var(--border)', padding:'52px 24px 40px', textAlign:'center' }}>

        <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'5px 14px',
          borderRadius:20, marginBottom:18, background:'rgba(99,102,241,0.1)',
          border:'1px solid rgba(99,102,241,0.25)', fontSize:12, color:'var(--accent)',
          fontWeight:700, textTransform:'uppercase', letterSpacing:1 }}>
          ✦ {templates.length} Free Templates
        </div>

        <h1 style={{ fontSize:'clamp(26px,4vw,48px)', fontWeight:800, color:'var(--text1)', lineHeight:1.15, marginBottom:12 }}>
          Prompt Templates
          <span style={{ display:'block', background:'linear-gradient(90deg,#6366f1,#22d3ee)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            Built for the GCC & Beyond
          </span>
        </h1>

        <p style={{ fontSize:16, color:'var(--text2)', maxWidth:520, margin:'0 auto 28px', lineHeight:1.7 }}>
          Click any template → form pre-fills automatically → edit if needed → generate your perfect AI prompt.
          Works with ChatGPT, Claude, Gemini — any AI tool.
        </p>

        {/* Search */}
        <div style={{ position:'relative', maxWidth:520, margin:'0 auto' }}>
          <span style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)',
            fontSize:18, color:'var(--text3)', pointerEvents:'none' }}>🔍</span>
          <input type="text" placeholder="Search... (Instagram, Arabic, email, coding...)"
            value={search} onChange={e=>setSearch(e.target.value)}
            style={{ width:'100%', padding:'14px 44px 14px 48px', background:'var(--bg2)',
              border:'1px solid var(--border2)', borderRadius:14, color:'var(--text1)',
              fontSize:14, outline:'none', boxSizing:'border-box',
              boxShadow:'0 4px 20px rgba(0,0,0,0.2)' }} />
          {search && (
            <button onClick={()=>setSearch('')} style={{ position:'absolute', right:14, top:'50%',
              transform:'translateY(-50%)', background:'transparent', border:'none',
              cursor:'pointer', color:'var(--text3)', fontSize:18 }}>✕</button>
          )}
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'32px 24px 60px' }}>

        {/* Category pills */}
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:20 }}>
          <button onClick={()=>setCategory('all')} style={{
            padding:'8px 16px', borderRadius:20, fontSize:13, fontWeight:600,
            cursor:'pointer', border:'1px solid', transition:'all 0.2s',
            background:category==='all'?'rgba(99,102,241,0.15)':'transparent',
            borderColor:category==='all'?'rgba(99,102,241,0.5)':'var(--border)',
            color:category==='all'?'var(--accent)':'var(--text3)',
          }}>All <span style={{ fontSize:11, opacity:0.7 }}>({counts.all||0})</span></button>

          {Object.entries(CAT).map(([id,c])=>(
            <button key={id} onClick={()=>setCategory(category===id?'all':id)} style={{
              padding:'8px 14px', borderRadius:20, fontSize:12, fontWeight:500,
              cursor:'pointer', border:'1px solid', transition:'all 0.2s',
              background:category===id?c.bg:'transparent',
              borderColor:category===id?`${c.color}50`:'var(--border)',
              color:category===id?c.color:'var(--text3)',
              display:'flex', alignItems:'center', gap:4,
            }}>
              <span>{c.emoji}</span>
              <span>{c.label}</span>
              <span style={{ fontSize:10, opacity:0.65 }}>({counts[id]||0})</span>
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
          marginBottom:24, flexWrap:'wrap', gap:12 }}>
          <div style={{ fontSize:14, color:'var(--text3)' }}>
            {!loading && (
              <><span style={{ fontWeight:700, color:'var(--text1)' }}>{filtered.length}</span> template{filtered.length!==1?'s':''}</>
            )}
          </div>
          <div style={{ display:'flex', gap:6, alignItems:'center' }}>
            <span style={{ fontSize:12, color:'var(--text3)' }}>Sort:</span>
            {[{v:'rating',l:'⭐ Top Rated'},{v:'popular',l:'🔥 Most Used'},{v:'az',l:'🔤 A→Z'}].map(o=>(
              <button key={o.v} onClick={()=>setSort(o.v)} style={{
                padding:'6px 10px', borderRadius:7, fontSize:11, fontWeight:500,
                cursor:'pointer', border:'1px solid', whiteSpace:'nowrap',
                background:sort===o.v?'rgba(99,102,241,0.12)':'transparent',
                borderColor:sort===o.v?'rgba(99,102,241,0.35)':'var(--border)',
                color:sort===o.v?'var(--accent)':'var(--text3)',
              }}>{o.l}</button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14 }}>
            {[1,2,3,4,5,6].map(i=><Skeleton key={i}/>)}
          </div>
        )}

        {/* Featured */}
        {!loading && showFeatured && featured.length>0 && (
          <div style={{ marginBottom:36 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
              <div style={{ width:4, height:20, background:'linear-gradient(180deg,#6366f1,#22d3ee)', borderRadius:2 }}/>
              <span style={{ fontSize:13, fontWeight:700, color:'var(--text2)', textTransform:'uppercase', letterSpacing:1 }}>
                ⭐ Featured Templates
              </span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14 }}>
              {featured.map(t=>(
                <Card key={t.id} t={t} feat using={using} expanded={expanded} copied={copied}
                  setExpanded={setExpanded} onUse={onUse} onCopy={onCopy}/>
              ))}
            </div>
            <div style={{ height:1, background:'var(--border)', margin:'28px 0' }}/>
          </div>
        )}

        {/* All templates */}
        {!loading && (
          <>
            {showFeatured && rest.length>0 && (
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
                <div style={{ width:4, height:20, background:'var(--border2)', borderRadius:2 }}/>
                <span style={{ fontSize:13, fontWeight:700, color:'var(--text2)', textTransform:'uppercase', letterSpacing:1 }}>
                  All Templates
                </span>
              </div>
            )}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14 }}>
              {(showFeatured?rest:filtered).map(t=>(
                <Card key={t.id} t={t} feat={false} using={using} expanded={expanded} copied={copied}
                  setExpanded={setExpanded} onUse={onUse} onCopy={onCopy}/>
              ))}
            </div>

            {/* Empty state */}
            {filtered.length===0 && (
              <div style={{ textAlign:'center', padding:'60px 24px' }}>
                <div style={{ fontSize:48, marginBottom:16 }}>🔍</div>
                <div style={{ fontSize:18, fontWeight:700, color:'var(--text1)', marginBottom:8 }}>No templates found</div>
                <div style={{ fontSize:14, color:'var(--text3)', marginBottom:20 }}>Try a different search or category</div>
                <button onClick={()=>{setSearch('');setCategory('all');}} style={{
                  padding:'10px 24px', borderRadius:10, cursor:'pointer',
                  background:'var(--accent)', color:'white', border:'none', fontSize:14, fontWeight:600,
                }}>Clear filters</button>
              </div>
            )}
          </>
        )}

        {/* Bottom CTAs */}
        {!loading && (
          <div style={{ marginTop:52 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:20 }}>
              <div style={{ padding:28, borderRadius:18, background:'var(--bg2)',
                border:'1px solid var(--border)', textAlign:'center' }}>
                <div style={{ fontSize:32, marginBottom:12 }}>💡</div>
                <div style={{ fontSize:16, fontWeight:700, color:'var(--text1)', marginBottom:8 }}>
                  Need a specific template?
                </div>
                <p style={{ fontSize:13, color:'var(--text3)', lineHeight:1.6, marginBottom:16 }}>
                  Request a template and we'll add it within 24 hours.
                </p>
                <a href="mailto:hi@promptifill.com?subject=Template Request" style={{
                  display:'inline-block', padding:'10px 22px', borderRadius:10,
                  fontSize:13, fontWeight:600, background:'var(--bg3)',
                  color:'var(--text2)', border:'1px solid var(--border2)', textDecoration:'none',
                }}>Request Template →</a>
              </div>

              <div style={{ padding:28, borderRadius:18,
                background:'linear-gradient(135deg,rgba(99,102,241,0.12),rgba(34,211,238,0.08))',
                border:'1px solid rgba(99,102,241,0.3)', textAlign:'center' }}>
                <div style={{ fontSize:32, marginBottom:12 }}>🚀</div>
                <div style={{ fontSize:16, fontWeight:700, color:'var(--text1)', marginBottom:8 }}>
                  Build a website with AI
                </div>
                <p style={{ fontSize:13, color:'var(--text3)', lineHeight:1.6, marginBottom:16 }}>
                  Complete website prompt in 30 seconds. Deploy free. $9 domain.
                </p>
                <Link href="/build" style={{
                  display:'inline-block', padding:'10px 22px', borderRadius:10,
                  fontSize:13, fontWeight:700,
                  background:'linear-gradient(135deg,#6366f1,#4f46e5)',
                  color:'white', textDecoration:'none',
                }}>Try Build Feature →</Link>
              </div>
            </div>

            {plan==='FREE' && (
              <div style={{ padding:'22px 28px', borderRadius:16,
                background:'rgba(99,102,241,0.07)', border:'1px solid rgba(99,102,241,0.25)',
                display:'flex', alignItems:'center', justifyContent:'space-between',
                flexWrap:'wrap', gap:14 }}>
                <div>
                  <div style={{ fontSize:15, fontWeight:700, color:'var(--text1)', marginBottom:4 }}>
                    ✦ Unlock all templates + unlimited prompts
                  </div>
                  <div style={{ fontSize:13, color:'var(--text3)' }}>
                    Upgrade to Pro → all 10 categories · Arabic GCC · unlimited daily prompts
                  </div>
                </div>
                <Link href="/pricing" style={{
                  padding:'11px 22px', borderRadius:10, fontSize:14, fontWeight:700,
                  background:'linear-gradient(135deg,#6366f1,#4f46e5)',
                  color:'white', textDecoration:'none', whiteSpace:'nowrap',
                }}>Upgrade to Pro →</Link>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer/>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

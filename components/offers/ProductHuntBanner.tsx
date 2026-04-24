'use client';
// components/offers/ProductHuntBanner.tsx
// Shows a special PH banner ONLY on launch day
// Hidden automatically after expiry

import { useState, useEffect } from 'react';

export function ProductHuntBanner() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  // Set your PH launch day here
  // Tuesday — change to your actual launch date
  const LAUNCH_DAY = 'Tuesday';
  const EXPIRY_HOURS = 24; // offer lasts 24 hours

  useEffect(() => {
    // Check if dismissed
    const d = localStorage.getItem('ph_banner_dismissed');
    if (d) { setDismissed(true); return; }

    // Show banner — you can add date logic here
    // For now shows always (remove when offer expires)
    setVisible(true);

    // Countdown timer
    const updateTimer = () => {
      const now = new Date();
      // Set end time to midnight PST of launch day
      const end = new Date();
      end.setHours(23, 59, 59, 0);
      const diff = end.getTime() - now.getTime();
      if (diff <= 0) { setVisible(false); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    };

    updateTimer();
    const t = setInterval(updateTimer, 1000);
    return () => clearInterval(t);
  }, []);

  const dismiss = () => {
    localStorage.setItem('ph_banner_dismissed', 'true');
    setDismissed(true);
    setVisible(false);
  };

  if (!visible || dismissed) return null;

  return (
    <>
      {/* Full-width top banner */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 99999, padding: '10px 20px',
        background: 'linear-gradient(90deg, #DA552F 0%, #FF6B47 50%, #DA552F 100%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 3s ease infinite',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: 12,
        flexWrap: 'wrap',
        boxShadow: '0 2px 20px rgba(218,85,47,0.4)',
      }}>
        {/* PH cat icon */}
        <span style={{ fontSize: 20 }}>🐱</span>

        {/* Main message */}
        <span style={{
          fontSize: 14, fontWeight: 700,
          color: 'white', letterSpacing: 0.3,
        }}>
          We're live on Product Hunt today!
        </span>

        {/* Divider */}
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>·</span>

        {/* Offer */}
        <span style={{ fontSize: 14, color: 'white' }}>
          Special offer: <strong>50% off Pro for 3 months</strong>
        </span>

        {/* Code badge */}
        <div style={{
          padding: '4px 12px', borderRadius: 20,
          background: 'white', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
        }}
          onClick={() => {
            navigator.clipboard.writeText('HUNT');
            const el = document.getElementById('hunt-code-badge');
            if (el) { el.textContent = '✓ Copied!'; setTimeout(() => { if (el) el.textContent = 'Code: HUNT'; }, 2000); }
          }}
        >
          <span id="hunt-code-badge" style={{ fontSize: 13, fontWeight: 800, color: '#DA552F' }}>
            Code: HUNT
          </span>
        </div>

        {/* Timer */}
        {timeLeft && (
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
            ⏰ Ends in {timeLeft}
          </span>
        )}

        {/* PH link */}
        <a
          href="https://www.producthunt.com/posts/promptifill"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '4px 14px', borderRadius: 20, fontSize: 12,
            fontWeight: 700, textDecoration: 'none',
            background: 'rgba(255,255,255,0.2)',
            color: 'white', border: '1px solid rgba(255,255,255,0.4)',
          }}
        >
          ⬆ Upvote us →
        </a>

        {/* Dismiss */}
        <button
          onClick={dismiss}
          style={{
            position: 'absolute', right: 12, top: '50%',
            transform: 'translateY(-50%)',
            background: 'transparent', border: 'none',
            color: 'rgba(255,255,255,0.7)', cursor: 'pointer',
            fontSize: 18, lineHeight: 1, padding: '4px 8px',
          }}
        >✕</button>
      </div>

      {/* Spacer so navbar doesn't overlap */}
      <div style={{ height: 44 }} />

      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 0%; }
          100% { background-position: 0% 0%; }
        }
      `}</style>
    </>
  );
}


// ─────────────────────────────────────────────────────────
// PRODUCT HUNT SPECIAL CARD — For the Pricing Page
// Add this inside your pricing page between the plans
// ─────────────────────────────────────────────────────────

export function ProductHuntPricingCard() {
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(true);

  const copy = () => {
    navigator.clipboard.writeText('HUNT');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'relative',
      background: 'linear-gradient(135deg, rgba(218,85,47,0.12) 0%, rgba(255,107,71,0.08) 100%)',
      border: '2px solid rgba(218,85,47,0.4)',
      borderRadius: 20, padding: '28px',
      marginBottom: 24,
      overflow: 'hidden',
      boxShadow: '0 0 40px rgba(218,85,47,0.12)',
    }}>
      {/* Dismiss */}
      <button
        onClick={() => setVisible(false)}
        style={{
          position: 'absolute', top: 12, right: 12,
          background: 'transparent', border: 'none',
          cursor: 'pointer', color: 'var(--text3)', fontSize: 16,
        }}
      >✕</button>

      {/* Animated badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '6px 14px', borderRadius: 20, marginBottom: 16,
        background: '#DA552F', color: 'white',
        fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
      }}>
        🐱 PRODUCT HUNT SPECIAL
        <span style={{
          background: 'rgba(255,255,255,0.2)',
          padding: '2px 8px', borderRadius: 10, fontSize: 11,
        }}>TODAY ONLY</span>
      </div>

      {/* Main offer */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ marginBottom: 6 }}>
            <span style={{
              fontSize: 42, fontWeight: 900, color: '#DA552F',
              lineHeight: 1,
            }}>50% OFF</span>
          </div>
          <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--text1)', marginBottom: 4 }}>
            Pro Plan — First 3 months
          </div>
          <div style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 2 }}>
            Normal: <span style={{ textDecoration: 'line-through', color: 'var(--text3)' }}>$9.99/month</span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#4ade80' }}>
            Your price: $4.99/month 🎉
          </div>
        </div>

        {/* Code box */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 8, fontWeight: 600 }}>
            USE THIS CODE AT CHECKOUT
          </div>
          <button
            onClick={copy}
            style={{
              padding: '14px 28px', borderRadius: 12, cursor: 'pointer',
              background: copied ? 'rgba(74,222,128,0.15)' : 'white',
              border: `2px solid ${copied ? 'rgba(74,222,128,0.5)' : '#DA552F'}`,
              transition: 'all 0.2s',
            }}
          >
            <div style={{
              fontSize: 28, fontWeight: 900,
              color: copied ? '#4ade80' : '#DA552F',
              letterSpacing: 4, fontFamily: 'monospace',
            }}>
              {copied ? '✓ COPIED!' : 'HUNT'}
            </div>
          </button>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 6 }}>
            Click to copy
          </div>
        </div>
      </div>

      {/* What's included */}
      <div style={{
        marginTop: 20, padding: '14px 16px', borderRadius: 12,
        background: 'rgba(218,85,47,0.08)', border: '1px solid rgba(218,85,47,0.2)',
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#DA552F', marginBottom: 10, letterSpacing: 0.5 }}>
          WHAT YOU GET WITH PRO:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 6 }}>
          {[
            '✦ Unlimited prompts',
            '🌍 Arabic GCC category',
            '📚 All 10 categories',
            '💾 Prompt history forever',
            '⚡ Priority generation',
            '🚀 New features first',
          ].map(f => (
            <div key={f} style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>{f}</div>
          ))}
        </div>
      </div>

      {/* Upvote CTA */}
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <a
          href="https://www.producthunt.com/posts/promptifill"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: 10,
            background: '#DA552F', color: 'white',
            fontSize: 14, fontWeight: 700, textDecoration: 'none',
          }}
        >
          🐱 Upvote us on Product Hunt →
        </a>
        <span style={{ fontSize: 12, color: 'var(--text3)' }}>
          Support a solo founder from Riyadh 🇸🇦
        </span>
      </div>

      {/* Expires note */}
      <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text3)' }}>
        ⏰ This offer expires at midnight today · Max 100 uses only
      </div>
    </div>
  );
}

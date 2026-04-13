'use client';
// app/test-payment/page.tsx
// INTERNAL TEST PAGE — For founder use only
// Tests the full payment → webhook → DB upgrade flow
// URL: promptifill.com/test-payment

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';

// ─── REPLACE WITH YOUR $1 WHOP TEST PLAN ID ───
// Create a $1 plan in Whop dashboard for testing
// Then paste the plan ID here
const TEST_PLAN_ID = 'plan_zhx2DvvNKo6t7';
const WHOP_TEST_URL = `https://whop.com/checkout/${TEST_PLAN_ID}`;
// ──────────────────────────────────────────────

function CheckItem({ done, text }: { done: boolean; text: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 14px', borderRadius: 8, marginBottom: 6,
      background: done ? 'rgba(74,222,128,0.08)' : 'rgba(255,255,255,0.03)',
      border: `1px solid ${done ? 'rgba(74,222,128,0.25)' : 'var(--border)'}`,
      transition: 'all 0.3s',
    }}>
      <span style={{ fontSize: 16 }}>{done ? '✅' : '⏳'}</span>
      <span style={{ fontSize: 14, color: done ? '#4ade80' : 'var(--text2)', fontWeight: done ? 600 : 400 }}>
        {text}
      </span>
    </div>
  );
}

export default function TestPaymentPage() {
  const { data: session, status, update } = useSession();
  const [plan, setPlan] = useState('FREE');
  const [checking, setChecking] = useState(false);
  const [checkCount, setCheckCount] = useState(0);
  const [webhookReceived, setWebhookReceived] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [message, setMessage] = useState('');

  const userEmail = session?.user?.email ?? '';
  const userName = session?.user?.name ?? '';

  useEffect(() => {
    if (session?.user) {
      setPlan((session.user as any).plan ?? 'FREE');
    }
  }, [session]);

  // Check URL params — Whop redirects back with ?payment=success
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      setPaymentDone(true);
      setMessage('Payment detected! Checking database upgrade...');
      startPolling();
    }
  }, []);

  const startPolling = () => {
    setChecking(true);
    let count = 0;
    const interval = setInterval(async () => {
      count++;
      setCheckCount(count);
      try {
        const res = await fetch('/api/check-plan');
        const data = await res.json();
        if (data.plan !== 'FREE') {
          setPlan(data.plan);
          setWebhookReceived(true);
          setChecking(false);
          setMessage(`🎉 PERFECT! Auto-upgrade working! Plan: ${data.plan}`);
          clearInterval(interval);
          await update(); // refresh session
        }
        if (count >= 10) {
          clearInterval(interval);
          setChecking(false);
          setMessage('Webhook taking longer than expected. Check Whop dashboard for webhook logs.');
        }
      } catch {
        // keep trying
      }
    }, 3000);
  };

  const manualCheck = async () => {
    setChecking(true);
    const res = await fetch('/api/check-plan');
    const data = await res.json();
    setPlan(data.plan);
    if (data.plan !== 'FREE') {
      setWebhookReceived(true);
      setMessage(`✅ Plan upgraded to ${data.plan}!`);
    } else {
      setMessage('Still FREE — webhook not received yet. Check Whop webhook settings.');
    }
    setChecking(false);
  };

  const isSignedIn = status === 'authenticated';
  const isPaid = plan !== 'FREE';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text1)' }}>

      {/* Header */}
      <div style={{
        borderBottom: '1px solid var(--border)', padding: '14px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(8,8,18,0.97)',
      }}>
        <Link href="/" style={{ fontSize: 17, fontWeight: 700, color: 'var(--text1)', textDecoration: 'none' }}>
          Prompti<span style={{ color: '#6366f1' }}>Fill</span>
        </Link>
        <div style={{
          fontSize: 11, padding: '4px 12px', borderRadius: 20,
          background: 'rgba(234,179,8,0.15)', color: '#eab308',
          border: '1px solid rgba(234,179,8,0.3)', fontWeight: 600,
        }}>
          🔒 INTERNAL TEST PAGE
        </div>
      </div>

      <div style={{ maxWidth: 620, margin: '0 auto', padding: '40px 24px' }}>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🧪</div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text1)', marginBottom: 8 }}>
            Payment Flow Test
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text3)', lineHeight: 1.6 }}>
            Test the complete payment → webhook → auto-upgrade flow<br />
            before your public launch. $1 test charge.
          </p>
        </div>

        {/* Progress checklist */}
        <div style={{
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 16, padding: '24px', marginBottom: 24,
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text2)', marginBottom: 14 }}>
            Test Checklist
          </div>
          <CheckItem done={isSignedIn} text={isSignedIn ? `Signed in as ${userEmail}` : 'Step 1: Sign in with Google first'} />
          <CheckItem done={!!TEST_PLAN_ID && !TEST_PLAN_ID.includes('REPLACE')} text="Step 2: $1 test plan created in Whop" />
          <CheckItem done={paymentDone} text="Step 3: Payment completed on Whop" />
          <CheckItem done={webhookReceived} text="Step 4: Webhook received by your app" />
          <CheckItem done={isPaid} text={isPaid ? `Step 5: Database upgraded to ${plan} ✦` : 'Step 5: Database auto-upgraded'} />
        </div>

        {/* Current status */}
        <div style={{
          padding: '16px 20px', borderRadius: 12, marginBottom: 24,
          background: isPaid ? 'rgba(74,222,128,0.08)' : 'rgba(99,102,241,0.08)',
          border: `1px solid ${isPaid ? 'rgba(74,222,128,0.3)' : 'rgba(99,102,241,0.25)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 10,
        }}>
          <div>
            <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 4 }}>Current Plan in Database</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: isPaid ? '#4ade80' : '#6366f1' }}>
              {plan}
              {isPaid && ' ✅'}
            </div>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text3)' }}>
            {isSignedIn ? `👤 ${userEmail}` : '⚠ Not signed in'}
          </div>
        </div>

        {/* Message */}
        {message && (
          <div style={{
            padding: '14px 18px', borderRadius: 10, marginBottom: 20,
            background: webhookReceived ? 'rgba(74,222,128,0.1)' : 'rgba(99,102,241,0.1)',
            border: `1px solid ${webhookReceived ? 'rgba(74,222,128,0.3)' : 'rgba(99,102,241,0.3)'}`,
            fontSize: 14, color: webhookReceived ? '#4ade80' : 'var(--accent)',
            fontWeight: 500,
          }}>
            {message}
            {checking && <span> (Check #{checkCount}...)</span>}
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Step 1: Sign in */}
          {!isSignedIn && (
            <button
              onClick={() => signIn('google')}
              style={{
                padding: '15px', borderRadius: 12, fontSize: 15,
                fontWeight: 600, background: '#6366f1', color: 'white',
                border: 'none', cursor: 'pointer',
              }}
            >
              Step 1: Sign in with Google →
            </button>
          )}

          {/* Step 2: Pay $1 */}
          {isSignedIn && !paymentDone && (
            <a
              href={`${WHOP_TEST_URL}?redirect_url=${encodeURIComponent('https://promptifill.com/test-payment?payment=success')}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                setTimeout(() => setPaymentDone(true), 3000);
              }}
              style={{
                display: 'block', textAlign: 'center',
                padding: '15px', borderRadius: 12, fontSize: 15,
                fontWeight: 700, textDecoration: 'none',
                background: 'linear-gradient(135deg, #6366f1, #22d3ee)',
                color: 'white',
              }}
            >
              Step 2: Pay $1 Test Charge on Whop →
            </a>
          )}

          {/* Step 3: Check upgrade */}
          {isSignedIn && (
            <button
              onClick={manualCheck}
              disabled={checking}
              style={{
                padding: '13px', borderRadius: 12, fontSize: 14,
                fontWeight: 600, cursor: checking ? 'not-allowed' : 'pointer',
                background: 'transparent', color: 'var(--text2)',
                border: '1px solid var(--border2)',
                opacity: checking ? 0.6 : 1,
              }}
            >
              {checking ? '⏳ Checking database...' : '🔄 Check Plan in Database'}
            </button>
          )}

          {/* Reset for re-testing */}
          {isPaid && (
            <div style={{
              padding: '16px', borderRadius: 12, textAlign: 'center',
              background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.25)',
            }}>
              <div style={{ fontSize: 20, marginBottom: 8 }}>🎉</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#4ade80', marginBottom: 6 }}>
                Full payment flow is working!
              </div>
              <div style={{ fontSize: 13, color: 'var(--text3)', lineHeight: 1.6 }}>
                Payment → Webhook → Database upgrade → all confirmed.<br />
                Your real customers will be upgraded automatically!
              </div>
            </div>
          )}
        </div>

        {/* Setup instructions */}
        <div style={{
          marginTop: 28, background: 'var(--bg2)',
          border: '1px solid var(--border)', borderRadius: 14, padding: '22px',
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text2)', marginBottom: 16 }}>
            📋 Setup Instructions (do these first)
          </div>
          {[
            {
              step: '1',
              title: 'Create $1 test plan in Whop',
              detail: 'Whop Dashboard → Plans → Create Plan → Price: $1 → One-time charge → Copy Plan ID',
            },
            {
              step: '2',
              title: 'Paste Plan ID in this file',
              detail: 'Open app/test-payment/page.tsx → Replace plan_REPLACE_WITH_TEST_PLAN_ID with your real plan ID',
            },
            {
              step: '3',
              title: 'Add webhook in Whop',
              detail: 'Whop Dashboard → Developer → Webhooks → Add: https://promptifill.com/api/webhooks/whop',
            },
            {
              step: '4',
              title: 'Deploy and test',
              detail: 'git push → visit promptifill.com/test-payment → sign in → pay $1 → watch auto-upgrade!',
            },
          ].map((item) => (
            <div key={item.step} style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'flex-start' }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                background: 'rgba(99,102,241,0.2)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, color: '#6366f1',
              }}>{item.step}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text1)', marginBottom: 2 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.5 }}>{item.detail}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Warning */}
        <div style={{
          marginTop: 16, padding: '12px 16px', borderRadius: 10,
          background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)',
          fontSize: 13, color: '#eab308',
        }}>
          ⚠️ This page is for internal testing only. Do not share this URL publicly.
          After testing, you can delete this page or add password protection.
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
          <Link href="/pricing" style={{ fontSize: 13, color: 'var(--text3)', textDecoration: 'none' }}>
            ← Pricing Page
          </Link>
          <span style={{ color: 'var(--border2)' }}>·</span>
          <Link href="/dashboard" style={{ fontSize: 13, color: 'var(--text3)', textDecoration: 'none' }}>
            Dashboard →
          </Link>
        </div>
      </div>
    </div>
  );
}

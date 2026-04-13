'use client';
// app/settings/page.tsx
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({ total: 0, today: 0 });
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const user = session?.user as any;
  const plan = user?.plan ?? 'FREE';
  const isPro = plan === 'PRO' || plan === 'TEAM';

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/generate');
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    fetch('/api/prompts?page=1')
      .then(r => r.json())
      .then(data => {
        const prompts = data.prompts || [];
        const today = new Date(); today.setHours(0,0,0,0);
        const todayCount = prompts.filter((p: any) => new Date(p.createdAt) >= today).length;
        setStats({ total: data.total || prompts.length, today: todayCount });
      });
  }, [status]);

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        <Navbar />
        <div style={{ maxWidth: 700, margin: '60px auto', padding: '0 24px' }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 100, marginBottom: 16, borderRadius: 12 }} />)}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '32px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text1)', marginBottom: 4 }}>
            ⚙️ Account Settings
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text3)' }}>
            Manage your account, plan, and preferences.
          </p>
        </div>

        {/* Profile card */}
        <div style={{
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 16, padding: '24px', marginBottom: 16,
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
            Profile
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt="avatar"
                style={{ width: 56, height: 56, borderRadius: '50%', border: '2px solid var(--border2)' }}
              />
            ) : (
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #22d3ee)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, fontWeight: 700, color: 'white',
              }}>
                {session?.user?.name?.[0] ?? 'U'}
              </div>
            )}
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text1)', marginBottom: 3 }}>
                {session?.user?.name ?? 'User'}
              </div>
              <div style={{ fontSize: 14, color: 'var(--text3)' }}>
                {session?.user?.email}
              </div>
            </div>
          </div>

          {/* Info rows */}
          {[
            { label: 'Name', value: session?.user?.name ?? '—' },
            { label: 'Email', value: session?.user?.email ?? '—' },
            { label: 'Sign in method', value: 'Google OAuth' },
            { label: 'Member since', value: 'April 2025' },
          ].map(row => (
            <div key={row.label} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 0', borderBottom: '1px solid var(--border)',
            }}>
              <span style={{ fontSize: 14, color: 'var(--text3)' }}>{row.label}</span>
              <span style={{ fontSize: 14, color: 'var(--text1)', fontWeight: 500 }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* Plan card */}
        <div style={{
          background: isPro ? 'rgba(99,102,241,0.07)' : 'var(--bg2)',
          border: `1px solid ${isPro ? 'rgba(99,102,241,0.35)' : 'var(--border)'}`,
          borderRadius: 16, padding: '24px', marginBottom: 16,
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
            Current Plan
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: isPro ? 'var(--accent)' : 'var(--text1)' }}>
                  {plan}
                </span>
                {isPro && (
                  <span style={{
                    fontSize: 11, padding: '3px 10px', borderRadius: 20,
                    background: 'rgba(99,102,241,0.2)', color: 'var(--accent)',
                    fontWeight: 700, border: '1px solid rgba(99,102,241,0.3)',
                  }}>ACTIVE</span>
                )}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text3)' }}>
                {plan === 'FREE' && '5 generations/day · 3 categories'}
                {plan === 'PRO' && 'Unlimited generations · All 10 categories'}
                {plan === 'TEAM' && 'Unlimited · 5 team members · Shared library'}
              </div>
            </div>
            {!isPro ? (
              <Link href="/pricing" style={{
                padding: '10px 20px', borderRadius: 10, fontSize: 14,
                fontWeight: 600, background: 'var(--accent)', color: 'white',
                textDecoration: 'none', whiteSpace: 'nowrap',
              }}>
                Upgrade to Pro →
              </Link>
            ) : (
              <a
                href="https://whop.com/promptifill"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '10px 20px', borderRadius: 10, fontSize: 14,
                  fontWeight: 600, background: 'transparent', color: 'var(--text2)',
                  border: '1px solid var(--border2)', textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                Manage Subscription
              </a>
            )}
          </div>

          {/* Plan features */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {(plan === 'FREE' ? [
              { label: 'Daily limit', value: '5 generations', ok: true },
              { label: 'Categories', value: '3 of 10', ok: false },
              { label: 'Prompt history', value: 'Not saved', ok: false },
              { label: 'Arabic GCC prompts', value: 'Not included', ok: false },
            ] : [
              { label: 'Daily limit', value: 'Unlimited', ok: true },
              { label: 'Categories', value: 'All 10', ok: true },
              { label: 'Prompt history', value: 'Saved forever', ok: true },
              { label: 'Arabic GCC prompts', value: 'Included', ok: true },
            ]).map(item => (
              <div key={item.label} style={{
                padding: '10px 12px', borderRadius: 8,
                background: 'var(--bg3)', border: '1px solid var(--border)',
              }}>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 3 }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: item.ok ? '#4ade80' : 'var(--text3)' }}>
                  {item.ok ? '✓ ' : '✗ '}{item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage stats */}
        <div style={{
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 16, padding: '24px', marginBottom: 16,
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
            Usage Stats
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { label: 'Total Prompts', value: stats.total },
              { label: 'Generated Today', value: stats.today },
              { label: 'Daily Limit', value: isPro ? '∞' : '5' },
            ].map(s => (
              <div key={s.label} style={{
                padding: '14px', borderRadius: 10,
                background: 'var(--bg3)', border: '1px solid var(--border)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text1)', marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'var(--text3)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div style={{
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 16, padding: '24px', marginBottom: 16,
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
            Quick Links
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              { label: '✦ Generate Prompts', href: '/generate', desc: 'Create new AI prompts' },
              { label: '📚 Prompt Library', href: '/library', desc: 'Your saved prompts' },
              { label: '🗂 Templates', href: '/templates', desc: 'Browse 20+ templates' },
              { label: '📊 Dashboard', href: '/dashboard', desc: 'View your stats' },
              { label: '💎 Pricing', href: '/pricing', desc: 'View plans and upgrade' },
              { label: '📧 Contact Support', href: '/contact', desc: 'Get help from us' },
            ].map(link => (
              <Link key={link.href} href={link.href} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 14px', borderRadius: 10, textDecoration: 'none',
                color: 'var(--text1)', transition: 'all 0.2s',
                background: 'transparent',
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text1)', marginBottom: 2 }}>{link.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)' }}>{link.desc}</div>
                </div>
                <span style={{ color: 'var(--text3)', fontSize: 16 }}>→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Danger zone */}
        <div style={{
          background: 'var(--bg2)', border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: 16, padding: '24px', marginBottom: 24,
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#ef4444', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
            Account Actions
          </div>

          {/* Sign out */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 0', borderBottom: '1px solid var(--border)',
            flexWrap: 'wrap', gap: 10,
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text1)', marginBottom: 2 }}>Sign Out</div>
              <div style={{ fontSize: 12, color: 'var(--text3)' }}>Sign out of your account on this device</div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              style={{
                padding: '9px 20px', borderRadius: 9, fontSize: 13, fontWeight: 600,
                background: 'transparent', color: 'var(--text2)',
                border: '1px solid var(--border2)', cursor: 'pointer',
              }}
            >Sign Out</button>
          </div>

          {/* Delete account */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            paddingTop: 14, flexWrap: 'wrap', gap: 10,
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#ef4444', marginBottom: 2 }}>Delete Account</div>
              <div style={{ fontSize: 12, color: 'var(--text3)' }}>Permanently delete your account and all data</div>
            </div>
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                style={{
                  padding: '9px 20px', borderRadius: 9, fontSize: 13, fontWeight: 600,
                  background: 'transparent', color: '#ef4444',
                  border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer',
                }}
              >Delete Account</button>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  style={{
                    padding: '9px 16px', borderRadius: 9, fontSize: 13,
                    background: 'transparent', color: 'var(--text2)',
                    border: '1px solid var(--border2)', cursor: 'pointer',
                  }}
                >Cancel</button>
                <button
                  style={{
                    padding: '9px 16px', borderRadius: 9, fontSize: 13, fontWeight: 600,
                    background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer',
                  }}
                  onClick={() => {
                    // Contact support to delete
                    window.location.href = 'mailto:support@promptifill.com?subject=Delete Account Request&body=Please delete my account: ' + session?.user?.email;
                  }}
                >Yes, Delete →</button>
              </div>
            )}
          </div>
        </div>

        {/* Legal */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms of Service', href: '/terms' },
            { label: 'Refund Policy', href: '/refund' },
          ].map(({ label, href }) => (
            <Link key={label} href={href} style={{ fontSize: 13, color: 'var(--text3)', textDecoration: 'none' }}>
              {label}
            </Link>
          ))}
        </div>

      </div>
      <Footer />
    </div>
  );
}

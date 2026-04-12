'use client';
// app/team/page.tsx
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';

export default function TeamPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const plan = (session?.user as any)?.plan ?? 'FREE';

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/generate');
  }, [status, router]);

  if (plan !== 'TEAM') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        <Navbar />
        <div style={{ maxWidth: 600, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>👥</div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text1)', marginBottom: 12 }}>
            Team Plan Required
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text2)', marginBottom: 28, lineHeight: 1.7 }}>
            The Team plan allows up to 5 members to share prompts, 
            templates, and a collaborative library. Upgrade to unlock.
          </p>
          <div style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 14, padding: 24, marginBottom: 24, textAlign: 'left',
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text1)', marginBottom: 12 }}>
              Team Plan includes:
            </div>
            {[
              '✓ Up to 5 team members',
              '✓ Shared prompt library',
              '✓ Collaborative templates',
              '✓ Admin dashboard',
              '✓ Team usage analytics',
              '✓ Everything in Pro',
            ].map((f) => (
              <div key={f} style={{ fontSize: 13, color: 'var(--text2)', padding: '5px 0' }}>{f}</div>
            ))}
          </div>
          <Link href="/pricing" style={{
            display: 'inline-block', padding: '13px 28px', borderRadius: 10,
            fontSize: 15, fontWeight: 600, background: 'var(--accent)',
            color: 'white', textDecoration: 'none',
          }}>
            Upgrade to Team — $29/mo →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text1)', marginBottom: 4 }}>
            👥 Team Dashboard
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text3)' }}>
            Manage your team members and shared library.
          </p>
        </div>

        {/* Team info */}
        <div style={{
          padding: '20px 24px', borderRadius: 14, marginBottom: 24,
          background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12,
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text1)', marginBottom: 4 }}>
              Team Plan — Active ✅
            </div>
            <div style={{ fontSize: 13, color: 'var(--text3)' }}>
              Up to 5 members · Shared library · Admin access
            </div>
          </div>
          <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>
            Manage on whop.com/promptifill →
          </div>
        </div>

        {/* How to invite members */}
        <div style={{
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 14, padding: 24, marginBottom: 20,
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text1)', marginBottom: 16 }}>
            How to Add Team Members
          </h2>
          {[
            { step: '1', title: 'Go to Whop dashboard', desc: 'Visit whop.com/hub → your PromptiFill purchase → Manage Members' },
            { step: '2', title: 'Invite via email', desc: 'Send your team members an invitation link from Whop' },
            { step: '3', title: 'They sign in here', desc: 'Team members sign into promptifill.com with Google — their plan auto-upgrades' },
            { step: '4', title: 'Shared library', desc: 'All team prompts appear in the shared Library tab automatically' },
          ].map((item) => (
            <div key={item.step} style={{ display: 'flex', gap: 16, marginBottom: 16, alignItems: 'flex-start' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: 'var(--accent)',
              }}>{item.step}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text1)', marginBottom: 3 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text3)', lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {[
            { label: '📚 Shared Library', href: '/library', desc: 'View all team prompts' },
            { label: '✦ Generator', href: '/generate', desc: 'Create new prompts' },
            { label: '🗂 Templates', href: '/templates', desc: 'Browse all templates' },
            { label: '💎 Manage Plan', href: 'https://whop.com/promptifill', desc: 'Whop dashboard', external: true },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              style={{
                display: 'block', padding: '18px 20px', borderRadius: 12,
                background: 'var(--bg2)', border: '1px solid var(--border)',
                textDecoration: 'none', transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text1)', marginBottom: 4 }}>{link.label}</div>
              <div style={{ fontSize: 13, color: 'var(--text3)' }}>{link.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

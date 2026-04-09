'use client';
// components/layout/Navbar.tsx
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const plan = (session?.user as any)?.plan ?? 'FREE';

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 24px', borderBottom: '1px solid var(--border)',
      background: 'rgba(8,8,18,0.96)', backdropFilter: 'blur(12px)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'linear-gradient(135deg, #6366f1, #22d3ee)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 700, color: 'white',
        }}>P</div>
        <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text1)' }}>
          Prompt<span style={{ color: 'var(--accent)' }}>Craft</span>
        </span>
        <span style={{
          fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 600,
          background: plan === 'PRO' ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.06)',
          color: plan === 'PRO' ? 'var(--accent)' : 'var(--text3)',
          border: '1px solid',
          borderColor: plan === 'PRO' ? 'rgba(99,102,241,0.3)' : 'var(--border)',
        }}>{plan}</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {[
          { href: '/generate', label: 'Generator' },
          { href: '/library', label: 'Library' },
          { href: '/templates', label: 'Templates' },
          { href: '/dashboard', label: 'Dashboard' },
          { href: '/pricing', label: 'Pricing' },
        ].map(({ href, label }) => (
          <Link key={href} href={href} style={{
            padding: '8px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500,
            textDecoration: 'none', transition: 'all 0.2s',
            color: pathname === href ? 'var(--text1)' : 'var(--text2)',
            background: pathname === href ? 'var(--bg3)' : 'transparent',
          }}>{label}</Link>
        ))}

        {session ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 8 }}>
            {session.user?.image && (
              <img src={session.user.image} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid var(--border2)' }} />
            )}
            <button onClick={() => signOut()} style={{
              padding: '8px 16px', borderRadius: 8, fontSize: 14, fontWeight: 500,
              background: 'transparent', color: 'var(--text3)', border: '1px solid var(--border)',
              cursor: 'pointer',
            }}>Sign out</button>
          </div>
        ) : (
          <button onClick={() => signIn('google')} style={{
            padding: '9px 18px', borderRadius: 8, fontSize: 14, fontWeight: 600,
            background: 'var(--accent)', color: 'white', border: 'none', cursor: 'pointer',
            marginLeft: 8,
          }}>Sign in with Google</button>
        )}
      </div>
    </nav>
  );
}

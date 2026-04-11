'use client';
// components/layout/Navbar.tsx
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const plan = (session?.user as any)?.plan ?? 'FREE';

  const navLinks = [
    { href: '/generate', label: '✦ Generator' },
    { href: '/library', label: '📚 Library' },
    { href: '/templates', label: '🗂 Templates' },
    { href: '/dashboard', label: '📊 Dashboard' },
    { href: '/pricing', label: '💎 Pricing' },
  ];

  return (
    <nav style={{
      borderBottom: '1px solid var(--border)',
      background: 'rgba(8,8,18,0.97)',
      backdropFilter: 'blur(12px)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      {/* Main row */}
      <div className="navbar-safe" style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 24px',
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: 'linear-gradient(135deg, #6366f1, #22d3ee)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 700, color: 'white', flexShrink: 0,
          }}>P</div>
          <span style={{ fontSize: 17, fontWeight: 700, color: 'var(--text1)' }}>
            Prompti<span style={{ color: 'var(--accent)' }}>Fill</span>
          </span>
          <span style={{
            fontSize: 10, padding: '2px 7px', borderRadius: 20, fontWeight: 600,
            background: plan === 'PRO' ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.06)',
            color: plan === 'PRO' ? 'var(--accent)' : 'var(--text3)',
            border: '1px solid',
            borderColor: plan === 'PRO' ? 'rgba(99,102,241,0.3)' : 'var(--border)',
          }}>{plan}</span>
        </Link>

        {/* Desktop links */}
        <div className="nav-links-desktop" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} style={{
              padding: '7px 12px', borderRadius: 8, fontSize: 13, fontWeight: 500,
              textDecoration: 'none', transition: 'all 0.2s',
              color: pathname === href ? 'var(--text1)' : 'var(--text2)',
              background: pathname === href ? 'var(--bg3)' : 'transparent',
            }}>{label}</Link>
          ))}

          {session ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 8 }}>
              {session.user?.image && (
                <img src={session.user.image} alt="avatar" style={{ width: 30, height: 30, borderRadius: '50%', border: '2px solid var(--border2)' }} />
              )}
              <button onClick={() => signOut()} style={{
                padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                background: 'transparent', color: 'var(--text3)',
                border: '1px solid var(--border)', cursor: 'pointer',
              }}>Sign out</button>
            </div>
          ) : (
            <button onClick={() => signIn('google')} style={{
              padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: 'var(--accent)', color: 'white',
              border: 'none', cursor: 'pointer', marginLeft: 8,
            }}>Sign in →</button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{
            display: 'none',
            background: 'transparent',
            border: '1px solid var(--border2)',
            borderRadius: 8, padding: '8px 10px',
            cursor: 'pointer', color: 'var(--text1)',
            fontSize: 18, lineHeight: 1,
          }}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 2,
          padding: '8px 12px 16px',
          borderTop: '1px solid var(--border)',
          background: 'rgba(8,8,18,0.99)',
        }}>
          {navLinks.map(({ href, label }) => (
            <Link
              key={href} href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                padding: '12px 14px', borderRadius: 10,
                fontSize: 15, fontWeight: 500, textDecoration: 'none',
                color: pathname === href ? 'var(--text1)' : 'var(--text2)',
                background: pathname === href ? 'var(--bg3)' : 'transparent',
                display: 'block',
              }}
            >{label}</Link>
          ))}

          <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />

          {session ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', marginBottom: 6 }}>
                {session.user?.image && (
                  <img src={session.user.image} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                )}
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text1)' }}>{session.user?.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)' }}>{plan} Plan</div>
                </div>
              </div>
              <button
                onClick={() => { signOut(); setMenuOpen(false); }}
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 10,
                  fontSize: 14, fontWeight: 500, background: 'transparent',
                  color: 'var(--text3)', border: '1px solid var(--border)',
                  cursor: 'pointer', textAlign: 'left',
                }}
              >Sign out</button>
            </div>
          ) : (
            <button
              onClick={() => { signIn('google'); setMenuOpen(false); }}
              style={{
                width: '100%', padding: '13px 14px', borderRadius: 10,
                fontSize: 15, fontWeight: 600, background: 'var(--accent)',
                color: 'white', border: 'none', cursor: 'pointer',
              }}
            >Sign in with Google →</button>
          )}
        </div>
      )}
    </nav>
  );
}

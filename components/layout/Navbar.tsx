'use client';
// components/layout/Navbar.tsx
// Fully mobile responsive — hamburger menu on mobile

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { BuildBadge } from '@/components/onboarding/BuildOnboarding';

const navLinks = [
  { href: '/generate', label: '✦ Generator', isBuild: false },
  { href: '/build',    label: '🚀 Build',    isBuild: true  },
  { href: '/library',  label: '📚 Library',  isBuild: false },
  { href: '/templates',label: '🗂 Templates',isBuild: false },
  { href: '/dashboard',label: '📊 Dashboard',isBuild: false },
  { href: '/pricing',  label: '💎 Pricing',  isBuild: false },
];

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const plan = (session?.user as any)?.plan ?? 'FREE';

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const planColors: Record<string, string> = {
    FREE: '#475569', PRO: '#6366f1', TEAM: '#22d3ee',
  };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(15,17,32,0.95)',
      borderBottom: '1px solid rgba(99,102,241,0.15)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    }}>
      {/* Main row */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px', height: 56,
        maxWidth: 1200, margin: '0 auto',
      }}>

        {/* ── LOGO ── */}
        <Link href="/" style={{
          display: 'flex', alignItems: 'center', gap: 8,
          textDecoration: 'none', flexShrink: 0,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #6366f1, #22d3ee)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 900, color: 'white', flexShrink: 0,
          }}>P</div>
          <span style={{
            fontSize: 15, fontWeight: 800, color: '#f1f5f9',
            letterSpacing: '-0.3px',
          }}>PromptiFill</span>
          {/* Plan badge */}
          <span style={{
            fontSize: 9, fontWeight: 800, padding: '2px 6px',
            borderRadius: 6, border: `1px solid ${planColors[plan]}40`,
            color: planColors[plan], letterSpacing: 0.5,
            background: `${planColors[plan]}15`,
          }}>{plan}</span>
        </Link>

        {/* ── DESKTOP NAV LINKS ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 2,
          // Hide on mobile via JS-driven classname
        }} className="nav-links-desktop">
          {navLinks.map(({ href, label, isBuild }) => (
            <div key={href} style={{ position: 'relative' }}>
              <Link href={href} style={{
                padding: '6px 10px', borderRadius: 8, fontSize: 13,
                fontWeight: pathname === href ? 600 : 500,
                textDecoration: 'none', transition: 'all 0.2s',
                color: pathname === href ? '#f1f5f9' : '#64748b',
                background: pathname === href ? 'rgba(99,102,241,0.12)' : 'transparent',
                display: 'block', whiteSpace: 'nowrap',
              }}>{label}</Link>
              {isBuild && <BuildBadge />}
            </div>
          ))}
        </div>

        {/* ── RIGHT SIDE ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>

          {session ? (
            /* Logged-in avatar dropdown */
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'rgba(99,102,241,0.08)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  borderRadius: 20, padding: '5px 10px 5px 5px',
                  cursor: 'pointer', color: '#f1f5f9',
                }}
              >
                {session.user?.image ? (
                  <img src={session.user.image} alt="" style={{
                    width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                  }} />
                ) : (
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1, #22d3ee)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, color: 'white',
                  }}>{session.user?.name?.[0] || 'U'}</div>
                )}
                {/* Hide name on mobile */}
                <span style={{ fontSize: 13, fontWeight: 600 }} className="hide-mobile">
                  {session.user?.name?.split(' ')[0]}
                </span>
                <span style={{ fontSize: 10, color: '#64748b' }}>▼</span>
              </button>

              {dropdownOpen && (
                <div style={{
                  position: 'absolute', top: '110%', right: 0,
                  background: '#0f1120', border: '1px solid rgba(99,102,241,0.2)',
                  borderRadius: 14, padding: 8, minWidth: 180, zIndex: 999,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                }}>
                  {[
                    { href: '/dashboard', label: '📊 Dashboard' },
                    { href: '/library', label: '📚 Library' },
                    { href: '/settings', label: '⚙️ Settings' },
                    { href: '/pricing', label: '💎 Upgrade' },
                  ].map(item => (
                    <Link key={item.href} href={item.href} style={{
                      display: 'block', padding: '9px 14px', borderRadius: 9,
                      fontSize: 13, color: '#94a3b8', textDecoration: 'none',
                      transition: 'all 0.15s',
                    }} onClick={() => setDropdownOpen(false)}>
                      {item.label}
                    </Link>
                  ))}
                  <div style={{ height: 1, background: 'rgba(99,102,241,0.15)', margin: '6px 0' }} />
                  <button onClick={() => signOut()} style={{
                    display: 'block', width: '100%', padding: '9px 14px',
                    borderRadius: 9, fontSize: 13, color: '#ef4444',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    textAlign: 'left',
                  }}>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Sign in button */
            <button
              onClick={() => signIn('google')}
              style={{
                padding: '7px 14px', borderRadius: 8, fontSize: 13,
                fontWeight: 600, background: '#6366f1', color: 'white',
                border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              Sign in →
            </button>
          )}

          {/* ── HAMBURGER — mobile only ── */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{
              display: 'none', // shown via CSS media query
              background: 'transparent', border: 'none',
              cursor: 'pointer', color: '#94a3b8',
              fontSize: 22, padding: '4px',
              lineHeight: 1,
            }}
            className="nav-hamburger"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* ── MOBILE MENU DRAWER ── */}
      {menuOpen && (
        <div style={{
          borderTop: '1px solid rgba(99,102,241,0.1)',
          background: '#0d0d1f',
          padding: '12px 16px 16px',
        }}>
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} style={{
              display: 'block', padding: '12px 16px', borderRadius: 10,
              fontSize: 15, fontWeight: pathname === href ? 700 : 500,
              color: pathname === href ? '#6366f1' : '#94a3b8',
              background: pathname === href ? 'rgba(99,102,241,0.1)' : 'transparent',
              textDecoration: 'none', marginBottom: 4,
              transition: 'all 0.2s',
            }}>
              {label}
            </Link>
          ))}
          <div style={{ height: 1, background: 'rgba(99,102,241,0.1)', margin: '8px 0' }} />
          {!session && (
            <button
              onClick={() => { signIn('google'); setMenuOpen(false); }}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 10,
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color: 'white', fontSize: 15, fontWeight: 700,
                border: 'none', cursor: 'pointer', textAlign: 'center',
              }}
            >
              Sign in with Google
            </button>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .hide-mobile { display: none !important; }
        }
        @media (min-width: 769px) {
          .nav-hamburger { display: none !important; }
        }
      `}</style>
    </nav>
  );
}

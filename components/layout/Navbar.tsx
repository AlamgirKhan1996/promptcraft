'use client';
// components/layout/Navbar.tsx
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { BuildNavTooltip } from '@/components/onboarding/BuildOnboarding';

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const plan = (session?.user as any)?.plan ?? 'FREE';

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const navLinks = [
    { href: '/generate', label: '✦ Generator', isBuild: false },
    { href: '/build', label: '🚀 Build', isBuild: true },
    { href: '/library', label: '📚 Library', isBuild: false },
    { href: '/templates', label: '🗂 Templates', isBuild: false },
    { href: '/dashboard', label: '📊 Dashboard', isBuild: false },
    { href: '/pricing', label: '💎 Pricing', isBuild: false },
  ];

  return (
    <nav style={{
      borderBottom: '1px solid var(--border)',
      background: 'rgba(8,8,18,0.97)',
      backdropFilter: 'blur(12px)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      {/* Main row */}
      <div style={{
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
            background: plan === 'PRO' ? 'rgba(99,102,241,0.2)' : plan === 'TEAM' ? 'rgba(34,211,238,0.2)' : 'rgba(255,255,255,0.06)',
            color: plan === 'PRO' ? 'var(--accent)' : plan === 'TEAM' ? 'var(--accent2)' : 'var(--text3)',
            border: '1px solid',
            borderColor: plan === 'PRO' ? 'rgba(99,102,241,0.3)' : plan === 'TEAM' ? 'rgba(34,211,238,0.3)' : 'var(--border)',
          }}>{plan}</span>
        </Link>

        {/* Desktop links */}
        <div className="nav-links-desktop" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {navLinks.map(({ href, label, isBuild }) => (
            <div key={href} style={{ position: 'relative' }}>
              {isBuild && <BuildNavTooltip />}
              <Link href={href} style={{
                padding: '7px 12px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                textDecoration: 'none', transition: 'all 0.2s',
                color: pathname === href ? 'var(--text1)' : 'var(--text2)',
                background: pathname === href ? 'var(--bg3)' : 'transparent',
                display: 'block',
              }}>{label}</Link>
            </div>
          ))}

          {/* Avatar dropdown — Settings lives here */}
          {session ? (
            <div ref={dropdownRef} style={{ position: 'relative', marginLeft: 8 }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: dropdownOpen ? 'var(--bg3)' : 'transparent',
                  border: '1px solid',
                  borderColor: dropdownOpen ? 'rgba(99,102,241,0.4)' : 'var(--border)',
                  borderRadius: 10, padding: '6px 10px 6px 6px',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                {session.user?.image ? (
                  <img src={session.user.image} alt="avatar"
                    style={{ width: 26, height: 26, borderRadius: '50%' }} />
                ) : (
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1, #22d3ee)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, color: 'white',
                  }}>{session.user?.name?.[0] ?? 'U'}</div>
                )}
                <span style={{ fontSize: 12, color: 'var(--text2)', fontWeight: 500 }}>
                  {session.user?.name?.split(' ')[0]}
                </span>
                <span style={{ fontSize: 10, color: 'var(--text3)' }}>
                  {dropdownOpen ? '▲' : '▼'}
                </span>
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div style={{
                  position: 'absolute', top: '110%', right: 0,
                  background: 'var(--bg2)', border: '1px solid var(--border2)',
                  borderRadius: 12, padding: '8px',
                  minWidth: 200, zIndex: 200,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                }}>
                  {/* User info header */}
                  <div style={{
                    padding: '10px 12px 12px',
                    borderBottom: '1px solid var(--border)', marginBottom: 6,
                  }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text1)', marginBottom: 2 }}>
                      {session.user?.name}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text3)' }}>
                      {session.user?.email}
                    </div>
                    <div style={{
                      display: 'inline-block', marginTop: 6,
                      fontSize: 10, padding: '2px 8px', borderRadius: 20,
                      background: plan === 'PRO' ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.06)',
                      color: plan === 'PRO' ? 'var(--accent)' : 'var(--text3)',
                      fontWeight: 600,
                    }}>{plan} Plan</div>
                  </div>

                  {/* Menu items */}
                  {[
                    { href: '/dashboard', label: '📊 Dashboard' },
                    { href: '/library', label: '📚 My Prompts' },
                    { href: '/settings', label: '⚙️ Settings' },
                    ...(plan === 'FREE' ? [{ href: '/pricing', label: '💎 Upgrade to Pro', highlight: true }] : []),
                  ].map((item: any) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: 'block', padding: '9px 12px', borderRadius: 8,
                        fontSize: 13, fontWeight: item.highlight ? 600 : 500,
                        textDecoration: 'none', transition: 'all 0.2s',
                        color: item.highlight ? 'var(--accent)' : 'var(--text2)',
                        background: 'transparent',
                        marginBottom: 2,
                      }}
                    >{item.label}</Link>
                  ))}

                  {/* Divider */}
                  <div style={{ height: 1, background: 'var(--border)', margin: '6px 0' }} />

                  {/* Sign out */}
                  <button
                    onClick={() => { signOut(); setDropdownOpen(false); }}
                    style={{
                      width: '100%', padding: '9px 12px', borderRadius: 8,
                      fontSize: 13, fontWeight: 500, cursor: 'pointer',
                      background: 'transparent', color: 'var(--text3)',
                      border: 'none', textAlign: 'left', transition: 'all 0.2s',
                    }}
                  >🚪 Sign Out</button>
                </div>
              )}
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
        >{menuOpen ? '✕' : '☰'}</button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 2,
          padding: '8px 12px 16px',
          borderTop: '1px solid var(--border)',
          background: 'rgba(8,8,18,0.99)',
        }}>
          {/* Nav links */}
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href}
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

          <div style={{ height: 1, background: 'var(--border)', margin: '6px 0' }} />

          {session ? (
            <div>
              {/* User info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', marginBottom: 4 }}>
                {session.user?.image && (
                  <img src={session.user.image} alt="avatar"
                    style={{ width: 32, height: 32, borderRadius: '50%' }} />
                )}
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text1)' }}>
                    {session.user?.name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text3)' }}>{plan} Plan</div>
                </div>
              </div>

              {/* Settings link — clearly visible on mobile */}
              <Link href="/settings" onClick={() => setMenuOpen(false)} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 14px', borderRadius: 10,
                fontSize: 15, fontWeight: 500, textDecoration: 'none',
                color: 'var(--text2)', background: 'transparent',
              }}>⚙️ Settings & Account</Link>

              {plan === 'FREE' && (
                <Link href="/pricing" onClick={() => setMenuOpen(false)} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 14px', borderRadius: 10, marginBottom: 4,
                  fontSize: 15, fontWeight: 600, textDecoration: 'none',
                  color: 'var(--accent)', background: 'rgba(99,102,241,0.08)',
                  border: '1px solid rgba(99,102,241,0.2)',
                }}>💎 Upgrade to Pro</Link>
              )}

              <button
                onClick={() => { signOut(); setMenuOpen(false); }}
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 10,
                  fontSize: 14, fontWeight: 500, background: 'transparent',
                  color: 'var(--text3)', border: '1px solid var(--border)',
                  cursor: 'pointer', textAlign: 'left',
                }}
              >🚪 Sign Out</button>
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

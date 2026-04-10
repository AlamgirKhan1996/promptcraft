// components/layout/Footer.tsx
import Link from 'next/link';

export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '40px 24px', textAlign: 'center' }}>
      <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text1)', marginBottom: 8 }}>
        Prompt<span style={{ color: 'var(--accent)' }}>Craft</span>
      </div>
      <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 24 }}>
        Expert AI prompts for everyone. Built for GCC founders.
      </div>
      <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
        {[
          { label: 'Pricing', href: '/pricing' },
          { label: 'Terms of Service', href: '/terms' },
          { label: 'Privacy Policy', href: '/privacy' },
          { label: 'Refund Policy', href: '/refund' },
          { label: 'Contact', href: '/contact' },
        ].map(({ label, href }) => (
          <Link key={label} href={href} style={{ fontSize: 13, color: 'var(--text3)', textDecoration: 'none' }}>
            {label}
          </Link>
        ))}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text3)' }}>
        © 2025 PromptCraft · Made with ❤ for the MENA tech market · Riyadh, KSA
      </div>
    </footer>
  );
}

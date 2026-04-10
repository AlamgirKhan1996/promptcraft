// app/privacy/page.tsx
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy — PromptiFill',
  description: 'Privacy Policy for PromptiFill AI Prompt Generator',
};

export default function PrivacyPage() {
  const lastUpdated = 'April 10, 2025';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text1)' }}>
      <div style={{ borderBottom: '1px solid var(--border)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontSize: 18, fontWeight: 700, color: 'var(--text1)', textDecoration: 'none' }}>
          Prompti<span style={{ color: '#6366f1' }}>Fill</span>
        </Link>
        <Link href="/" style={{ fontSize: 14, color: 'var(--text3)', textDecoration: 'none' }}>← Back to Home</Link>
      </div>

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '60px 24px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ color: 'var(--text3)', fontSize: 14, marginBottom: 48 }}>Last updated: {lastUpdated}</p>

        <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.85, marginBottom: 36 }}>
          At PromptiFill, we take your privacy seriously. This policy explains what data we collect, how we use it, and your rights regarding your personal information. We keep this simple and honest — no hidden practices.
        </p>

        <Section title="1. Who We Are">
          PromptiFill ("we", "us", "our") operates the website promptifill.com, an AI-powered prompt generation tool. For privacy inquiries, contact us at: <a href="mailto:hi@promptifill.com" style={{ color: '#6366f1' }}>hi@promptifill.com</a>
        </Section>

        <Section title="2. Information We Collect">
          <strong style={{ color: 'var(--text1)' }}>Information you provide directly:</strong>
          <ul>
            <li>Name and email address (when signing in with Google)</li>
            <li>Profile picture (from your Google account)</li>
            <li>Form inputs you fill when generating prompts</li>
          </ul>
          <br />
          <strong style={{ color: 'var(--text1)' }}>Information collected automatically:</strong>
          <ul>
            <li>Usage data — which categories you use, how many prompts you generate</li>
            <li>Browser type, device type, and operating system</li>
            <li>IP address and approximate geographic location</li>
            <li>Pages visited and time spent on the Service</li>
          </ul>
          <br />
          <strong style={{ color: 'var(--text1)' }}>Payment information:</strong>
          <ul>
            <li>We do NOT store your credit card or payment details</li>
            <li>All payments are processed by Paddle, who has their own privacy policy</li>
            <li>We only receive confirmation of successful payments and your subscription status</li>
          </ul>
        </Section>

        <Section title="3. How We Use Your Information">
          We use your information to:
          <ul>
            <li>Provide, operate, and improve the PromptiFill service</li>
            <li>Save your generated prompts and prompt history (signed-in users)</li>
            <li>Manage your subscription and billing</li>
            <li>Send essential service emails (account confirmation, billing receipts)</li>
            <li>Enforce our rate limits and plan restrictions</li>
            <li>Detect and prevent abuse or fraud</li>
            <li>Analyze usage patterns to improve the product (anonymized)</li>
          </ul>
          We do NOT sell your personal data to third parties. Ever.
        </Section>

        <Section title="4. Data Storage and Security">
          Your data is stored in secure PostgreSQL databases hosted on Railway (railway.app), located in data centers with enterprise-grade security. We use:
          <ul>
            <li>HTTPS encryption for all data in transit</li>
            <li>Encrypted database connections</li>
            <li>Secure session management via NextAuth.js</li>
            <li>Regular security updates and monitoring</li>
          </ul>
          While we implement industry-standard security measures, no method of transmission over the internet is 100% secure.
        </Section>

        <Section title="5. Third-Party Services">
          We use the following third-party services that may process your data:
          <ul>
            <li><strong style={{ color: 'var(--text1)' }}>Anthropic (Claude API):</strong> Your prompt inputs are sent to Anthropic to generate outputs. See: anthropic.com/privacy</li>
            <li><strong style={{ color: 'var(--text1)' }}>Google OAuth:</strong> Used for sign-in. See: policies.google.com/privacy</li>
            <li><strong style={{ color: 'var(--text1)' }}>Paddle:</strong> Payment processing. See: paddle.com/legal/privacy</li>
            <li><strong style={{ color: 'var(--text1)' }}>Vercel:</strong> Website hosting. See: vercel.com/legal/privacy-policy</li>
            <li><strong style={{ color: 'var(--text1)' }}>Railway:</strong> Database hosting. See: railway.app/legal/privacy</li>
          </ul>
        </Section>

        <Section title="6. Cookies">
          We use minimal, essential cookies only:
          <ul>
            <li>Session cookies — to keep you logged in</li>
            <li>CSRF protection cookies — for security</li>
          </ul>
          We do not use advertising cookies or third-party tracking cookies. You can disable cookies in your browser settings but this may affect your ability to stay signed in.
        </Section>

        <Section title="7. Data Retention">
          <ul>
            <li>Account data: retained while your account is active</li>
            <li>Generated prompts: retained until you delete them or your account</li>
            <li>Usage logs: retained for 90 days then automatically deleted</li>
            <li>Payment records: retained for 7 years as required by financial regulations</li>
          </ul>
          When you delete your account, we delete your personal data within 30 days, except where retention is required by law.
        </Section>

        <Section title="8. Your Rights">
          You have the right to:
          <ul>
            <li><strong style={{ color: 'var(--text1)' }}>Access:</strong> Request a copy of all data we hold about you</li>
            <li><strong style={{ color: 'var(--text1)' }}>Correction:</strong> Request correction of inaccurate personal data</li>
            <li><strong style={{ color: 'var(--text1)' }}>Deletion:</strong> Request deletion of your account and all associated data</li>
            <li><strong style={{ color: 'var(--text1)' }}>Portability:</strong> Request your data in a machine-readable format</li>
            <li><strong style={{ color: 'var(--text1)' }}>Objection:</strong> Object to processing of your personal data</li>
          </ul>
          To exercise any of these rights, email: <a href="mailto:hi@promptifill.com" style={{ color: '#6366f1' }}>hi@promptifill.com</a>
          <br />We respond to all requests within 30 days.
        </Section>

        <Section title="9. Children's Privacy">
          PromptiFill is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected data from a child under 13, we will delete it immediately.
        </Section>

        <Section title="10. International Data Transfers">
          PromptiFill operates globally. Your data may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for international transfers in compliance with applicable data protection laws.
        </Section>

        <Section title="11. Changes to This Policy">
          We may update this Privacy Policy periodically. We will notify you of significant changes via email or a prominent notice on our website. Continued use of the Service after changes constitutes acceptance of the updated policy.
        </Section>

        <Section title="12. Contact Us">
          For any privacy-related questions or requests:
          <br /><br />
          Email: <a href="mailto:hi@promptifill.com" style={{ color: '#6366f1' }}>hi@promptifill.com</a><br />
          Website: <a href="https://promptifill.com/privacy" style={{ color: '#6366f1' }}>promptifill.com/privacy</a>
        </Section>

        <div style={{ marginTop: 48, padding: '20px', background: 'var(--bg2)', borderRadius: 12, border: '1px solid var(--border)' }}>
          <p style={{ fontSize: 13, color: 'var(--text3)', margin: 0 }}>
            See also: <Link href="/terms" style={{ color: '#6366f1' }}>Terms of Service</Link> · <Link href="/refund" style={{ color: '#6366f1' }}>Refund Policy</Link> · <Link href="/pricing" style={{ color: '#6366f1' }}>Pricing</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text1)', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
        {title}
      </h2>
      <div style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.85 }}>
        {children}
      </div>
    </div>
  );
}

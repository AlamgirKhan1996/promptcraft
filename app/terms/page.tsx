// app/terms/page.tsx
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service — PromptiFill',
  description: 'Terms of Service for PromptiFill AI Prompt Generator',
};

export default function TermsPage() {
  const lastUpdated = 'April 10, 2025';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text1)' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontSize: 18, fontWeight: 700, color: 'var(--text1)', textDecoration: 'none' }}>
          Prompti<span style={{ color: '#6366f1' }}>Fill</span>
        </Link>
        <Link href="/" style={{ fontSize: 14, color: 'var(--text3)', textDecoration: 'none' }}>← Back to Home</Link>
      </div>

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '60px 24px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 8 }}>Terms of Service</h1>
        <p style={{ color: 'var(--text3)', fontSize: 14, marginBottom: 48 }}>Last updated: {lastUpdated}</p>

        <Section title="1. Agreement to Terms">
          By accessing or using PromptiFill ("the Service") at promptifill.com, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service. These terms apply to all visitors, users, and others who access or use the Service.
        </Section>

        <Section title="2. Description of Service">
          PromptiFill is an AI-powered prompt generation platform that helps users create structured, professional prompts for use with AI tools such as Claude, ChatGPT, Gemini, and others. The Service is provided by PromptiFill ("we", "us", or "our") and is accessible via promptifill.com.
        </Section>

        <Section title="3. User Accounts">
          To access certain features of the Service, you must create an account. You are responsible for:
          <ul>
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Providing accurate and complete information when creating your account</li>
            <li>Notifying us immediately of any unauthorized use of your account</li>
          </ul>
          We reserve the right to terminate accounts that violate these Terms or are inactive for extended periods.
        </Section>

        <Section title="4. Subscription Plans and Billing">
          PromptiFill offers the following subscription tiers:
          <ul>
            <li><strong style={{ color: 'var(--text1)' }}>Free Plan:</strong> 5 prompt generations per day, limited to 3 categories, no history saving.</li>
            <li><strong style={{ color: 'var(--text1)' }}>Pro Plan:</strong> $9 USD per month — unlimited generations, all 10 categories, full history and library.</li>
            <li><strong style={{ color: 'var(--text1)' }}>Team Plan:</strong> $29 USD per month — everything in Pro plus up to 5 team members and shared library.</li>
          </ul>
          Subscriptions are billed monthly in advance. Your subscription renews automatically unless cancelled before the renewal date. All payments are processed securely through Paddle. We reserve the right to change pricing with 30 days notice to existing subscribers.
        </Section>

        <Section title="5. Acceptable Use Policy">
          You agree NOT to use PromptiFill to:
          <ul>
            <li>Generate content that is illegal, harmful, threatening, abusive, or defamatory</li>
            <li>Violate any applicable local, national, or international laws or regulations</li>
            <li>Infringe on intellectual property rights of others</li>
            <li>Attempt to reverse engineer, hack, or disrupt the Service</li>
            <li>Use the Service to generate spam or unsolicited commercial content at scale</li>
            <li>Share account credentials with unauthorized users</li>
            <li>Resell or redistribute access to the Service without written permission</li>
          </ul>
          Violation of this policy may result in immediate termination of your account without refund.
        </Section>

        <Section title="6. Intellectual Property">
          The prompts you generate using PromptiFill are yours. You retain full ownership of the output content you create. PromptiFill retains ownership of the platform, its design, code, technology, and brand. You grant PromptiFill a limited license to process your inputs solely for the purpose of providing the Service.
        </Section>

        <Section title="7. AI-Generated Content Disclaimer">
          PromptiFill uses third-party AI models (including Anthropic Claude) to generate prompt suggestions. We do not guarantee the accuracy, completeness, or suitability of AI-generated outputs for any specific purpose. You are solely responsible for reviewing, editing, and using any generated prompts. PromptiFill is not liable for outcomes resulting from the use of AI-generated content.
        </Section>

        <Section title="8. Privacy">
          Your use of the Service is also governed by our Privacy Policy, available at promptifill.com/privacy. By using PromptiFill, you consent to the data practices described in that policy.
        </Section>

        <Section title="9. Limitation of Liability">
          To the maximum extent permitted by applicable law, PromptiFill and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising from your use of or inability to use the Service. Our total liability for any claim arising from these Terms shall not exceed the amount you paid us in the three months preceding the claim.
        </Section>

        <Section title="10. Service Availability">
          We strive to maintain high availability of PromptiFill but do not guarantee uninterrupted access. We may perform maintenance, updates, or experience technical issues that temporarily affect service availability. We will not be liable for any disruption or loss caused by such downtime.
        </Section>

        <Section title="11. Termination">
          You may cancel your subscription or delete your account at any time through your account settings or by contacting us at support@promptifill.com. We may terminate or suspend your access immediately, without prior notice, if you breach these Terms. Upon termination, your right to use the Service ceases immediately.
        </Section>

        <Section title="12. Changes to Terms">
          We reserve the right to modify these Terms at any time. We will notify users of significant changes via email or a notice on the platform. Continued use of the Service after changes constitutes acceptance of the new Terms.
        </Section>

        <Section title="13. Governing Law">
          These Terms are governed by and construed in accordance with generally accepted international commercial law principles. Any disputes will be resolved through good-faith negotiation first, followed by binding arbitration if necessary.
        </Section>

        <Section title="14. Contact Us">
          If you have questions about these Terms, please contact us:
          <br /><br />
          Email: <a href="mailto:hi@promptifill.com" style={{ color: '#6366f1' }}>hi@promptifill.com</a><br />
          Website: <a href="https://promptifill.com" style={{ color: '#6366f1' }}>promptifill.com</a>
        </Section>

        <div style={{ marginTop: 48, padding: '20px', background: 'var(--bg2)', borderRadius: 12, border: '1px solid var(--border)' }}>
          <p style={{ fontSize: 13, color: 'var(--text3)', margin: 0 }}>
            See also: <Link href="/privacy" style={{ color: '#6366f1' }}>Privacy Policy</Link> · <Link href="/refund" style={{ color: '#6366f1' }}>Refund Policy</Link> · <Link href="/pricing" style={{ color: '#6366f1' }}>Pricing</Link>
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

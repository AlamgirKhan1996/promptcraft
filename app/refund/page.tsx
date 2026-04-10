// app/refund/page.tsx
import Link from 'next/link';

export const metadata = {
  title: 'Refund Policy — PromptiFill',
  description: 'Refund and Cancellation Policy for PromptiFill',
};

export default function RefundPage() {
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
        <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 8 }}>Refund Policy</h1>
        <p style={{ color: 'var(--text3)', fontSize: 14, marginBottom: 48 }}>Last updated: {lastUpdated}</p>

        {/* Key summary box */}
        <div style={{ padding: '24px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 14, marginBottom: 48 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#6366f1', marginBottom: 12 }}>Summary — The Short Version</h2>
          <ul style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 2, margin: 0, paddingLeft: 20 }}>
            <li>✅ 7-day money-back guarantee on all paid plans — no questions asked</li>
            <li>✅ Cancel anytime — no lock-in, no cancellation fees</li>
            <li>✅ Refunds processed within 5-10 business days</li>
            <li>❌ No refunds after 7 days on the current billing period</li>
          </ul>
        </div>

        <Section title="1. Our Commitment">
          We want you to be completely satisfied with PromptiFill. If for any reason you are not happy with your subscription in the first 7 days, we will give you a full refund — no questions asked, no hassle. We believe in the quality of our product and stand behind it.
        </Section>

        <Section title="2. 7-Day Money-Back Guarantee">
          All paid subscriptions (Pro and Team plans) are covered by our 7-day money-back guarantee:
          <ul>
            <li>You must request the refund within 7 days of your initial purchase date</li>
            <li>This applies to both monthly and annual subscriptions</li>
            <li>You will receive a 100% refund of the amount charged</li>
            <li>No questions asked — you do not need to explain your reason</li>
            <li>Your account will be downgraded to the Free plan after the refund</li>
          </ul>
        </Section>

        <Section title="3. Cancellation Policy">
          You can cancel your subscription at any time:
          <ul>
            <li>Go to your Account Settings → Subscription → Cancel Plan</li>
            <li>Or email us at <a href="mailto:support@promptifill.com" style={{ color: '#6366f1' }}>support@promptifill.com</a></li>
            <li>Cancellation takes effect at the end of your current billing period</li>
            <li>You retain full Pro/Team access until your billing period ends</li>
            <li>No partial refunds are given for unused days after the 7-day window</li>
          </ul>
        </Section>

        <Section title="4. Refunds After 7 Days">
          After the 7-day money-back period, we generally do not offer refunds for the current billing cycle. However, we handle exceptional cases with care:

          <br /><br />
          <strong style={{ color: 'var(--text1)' }}>Exceptions we consider case by case:</strong>
          <ul>
            <li>Significant technical issues that prevented you from using the Service</li>
            <li>Duplicate charges due to billing errors</li>
            <li>Unauthorized charges (contact your bank first)</li>
            <li>Exceptional personal circumstances</li>
          </ul>

          If you believe you qualify for an exception, email us at <a href="mailto:support@promptifill.com" style={{ color: '#6366f1' }}>support@promptifill.com</a> with your account email and reason. We review all requests within 48 hours.
        </Section>

        <Section title="5. Annual Plan Refunds">
          For annual subscriptions:
          <ul>
            <li>Full refund available within 7 days of purchase</li>
            <li>After 7 days: we may offer a pro-rated refund for remaining unused months at our discretion</li>
            <li>Contact us to discuss — we are fair and reasonable</li>
          </ul>
        </Section>

        <Section title="6. How to Request a Refund">
          <strong style={{ color: 'var(--text1)' }}>Step 1:</strong> Email <a href="mailto:support@promptifill.com" style={{ color: '#6366f1' }}>support@promptifill.com</a> with subject line: "Refund Request"
          <br /><br />
          <strong style={{ color: 'var(--text1)' }}>Include:</strong>
          <ul>
            <li>Your account email address</li>
            <li>Date of purchase</li>
            <li>Reason for refund (optional but helpful)</li>
          </ul>
          <strong style={{ color: 'var(--text1)' }}>Step 2:</strong> We will confirm receipt within 24 hours
          <br /><br />
          <strong style={{ color: 'var(--text1)' }}>Step 3:</strong> Refund processed within 5–10 business days to your original payment method
        </Section>

        <Section title="7. Free Plan">
          The Free plan is completely free — no payment, no refund needed. You can use it indefinitely with the standard limits (5 generations per day, 3 categories).
        </Section>

        <Section title="8. Payment Processor">
          All payments are processed by Paddle (paddle.com). Refunds are returned to the original payment method used at checkout. Processing times depend on your bank or card issuer and may take 5–10 business days to appear on your statement.
        </Section>

        <Section title="9. Contact Us">
          For refund requests or billing questions:
          <br /><br />
          Email: <a href="mailto:support@promptifill.com" style={{ color: '#6366f1' }}>support@promptifill.com</a><br />
          Response time: Within 24 hours on business days<br />
          Website: <a href="https://promptifill.com" style={{ color: '#6366f1' }}>promptifill.com</a>
        </Section>

        <div style={{ marginTop: 48, padding: '20px', background: 'var(--bg2)', borderRadius: 12, border: '1px solid var(--border)' }}>
          <p style={{ fontSize: 13, color: 'var(--text3)', margin: 0 }}>
            See also: <Link href="/terms" style={{ color: '#6366f1' }}>Terms of Service</Link> · <Link href="/privacy" style={{ color: '#6366f1' }}>Privacy Policy</Link> · <Link href="/pricing" style={{ color: '#6366f1' }}>Pricing</Link>
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

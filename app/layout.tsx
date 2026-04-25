// app/layout.tsx
// Add metadataBase + canonical to fix Google Search Console error
// "Duplicate without user-selected canonical"

import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/layout/Providers';
import { GoogleAnalytics } from './analytics';
import './mobile-fix.css';

// ─────────────────────────────────────────────────
// THIS IS THE KEY FIX — metadataBase tells Next.js
// the official domain for ALL canonical URLs
// ─────────────────────────────────────────────────
const siteUrl = 'https://promptifill.com';

export const metadata: Metadata = {
  // ✅ FIX 1: metadataBase — the most important fix
  metadataBase: new URL(siteUrl),

  title: {
    default: 'PromptiFill — AI Prompt Generator | Perfect Prompts in 30 Seconds',
    template: '%s | PromptiFill',
  },
  description:
    'Fill in the blanks → get professional AI prompts instantly. Works with ChatGPT, Claude & Gemini. Includes Arabic GCC prompts. Free to try — no credit card needed.',

  keywords: [
    'AI prompt generator',
    'ChatGPT prompt generator',
    'Claude AI prompts',
    'prompt engineering tool',
    'Arabic AI prompts',
    'GCC AI tools',
    'AI prompts for business',
    'free AI prompt generator',
    'PromptiFill',
    'Saudi Arabia AI tool',
  ],

  authors: [{ name: 'Alamgir Khan', url: 'https://promptifill.com' }],
  creator: 'Alamgir Khan',
  publisher: 'PromptiFill',

  // ✅ FIX 2: canonical tells Google the official URL
  alternates: {
    canonical: siteUrl,
  },

  // ✅ FIX 3: robots - tell Google to index everything
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Open Graph — for LinkedIn, WhatsApp, Facebook previews
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'PromptiFill',
    title: 'PromptiFill — AI Prompt Generator | Perfect Prompts in 30 Seconds',
    description:
      'Fill in the blanks → get professional AI prompts in 30 seconds. Works with ChatGPT, Claude & Gemini. Arabic GCC prompts included.',
    images: [
      {
        url: '/og-image.png', // add 1200x630px image to /public folder
        width: 1200,
        height: 630,
        alt: 'PromptiFill — AI Prompt Generator',
      },
    ],
  },

  // Twitter card
  twitter: {
    card: 'summary_large_image',
    title: 'PromptiFill — Perfect AI Prompts in 30 Seconds',
    description: 'Fill blanks → get expert AI prompts. Works with ChatGPT, Claude & Gemini. Free to try.',
    creator: '@promptifill_ai',
    images: ['/og-image.png'],
  },

  // Verification — paste your actual codes here
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE', // from Search Console
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ✅ FIX 4: Self-referencing canonical in <head> */}
        <link rel="canonical" href={siteUrl} />

        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://api.anthropic.com" />
      </head>
      <body>
        <Providers>
          <GoogleAnalytics />
          {children}
        </Providers>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/layout/Providers';
import { GoogleAnalytics } from './analytics';
import { Analytics } from "@vercel/analytics/next"
export const metadata: Metadata = {
  verification: {
   google: '<meta name="google-site-verification" content="RqLgSnRAqbNsNDo1gBGtNWho69Bgl_d_FDcn5b1ju5U" />',
  },
  title: 'PromptiFill — AI Prompt Generator for GCC',
  description: 'Fill in the blanks. Get perfect AI prompts instantly. Built for GCC founders and creators with Arabic support.',
  keywords: ['AI prompts', 'prompt engineering', 'ChatGPT prompts', 'Claude prompts', 'Arabic AI', 'GCC tech', 'Saudi Arabia AI'],
  openGraph: {
    title: 'PromptiFill — Perfect AI Prompts Instantly',
    description: 'Fill in the blanks. Get perfect AI prompts instantly. Works with ChatGPT, Claude, Gemini and any AI tool.',
    images: ['/og-image.png'],
  },
};



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          async
          defer
          src="https://js.whop.com/static/checkout/loader.js"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
        <GoogleAnalytics />
        <Analytics />
      </body>
    </html>
  );
}

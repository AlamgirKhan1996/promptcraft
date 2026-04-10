import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/layout/Providers';

export const metadata: Metadata = {
  title: 'PromptiFill — AI Prompt Generator for GCC',
  description: 'Stop writing bad AI prompts. PromptiFill turns simple answers into expert-level, structured AI prompts instantly. Built for the GCC market with Arabic support.',
  keywords: ['AI prompts', 'prompt engineering', 'ChatGPT prompts', 'Claude prompts', 'Arabic AI', 'GCC tech'],
  openGraph: {
    title: 'PromptiFill — Perfect AI Prompts Instantly',
    description: 'Mad Libs meets Prompt Engineering. Pick a category, fill in the blanks, get expert prompts.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

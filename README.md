# PromptCraft ✦

> AI-powered prompt generator for GCC founders and creators.  
> Built with Next.js 14 · Claude API · PostgreSQL · Tailwind CSS

## Quick Start

```bash
npm install
cp .env.example .env.local
# Fill in your API keys (see DEPLOY_AND_REVENUE_GUIDE.md)
npm run db:push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Stack

- **Framework**: Next.js 14 (App Router)
- **AI**: Anthropic Claude API (`claude-sonnet-4-20250514`)
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js (Google OAuth)
- **Styling**: Tailwind CSS + custom CSS variables
- **Deployment**: Vercel (frontend) + Railway (database)
- **Payments**: Lemon Squeezy (Phase 2)

## Features

- 10 specialized prompt categories
- Arabic/bilingual prompt generation (GCC-specific)
- AI quality scoring (1–10) via Claude Haiku
- Prompt history, library, and templates
- Free/Pro/Team plan gating
- Rate limiting (5/day free, unlimited Pro)

## Full Guide

See `DEPLOY_AND_REVENUE_GUIDE.md` for complete deployment and revenue strategy.

---

Built by Alamgir | Riyadh, KSA 🇸🇦

# PromptCraft — Complete Deployment & Revenue Guide
# Built for: Alamgir | Riyadh, KSA | 2025
# Goal: Launch in 48 hours. Generate first SAR by Day 7.

═══════════════════════════════════════════════════════
PART 1 — LOCAL SETUP (30 minutes)
═══════════════════════════════════════════════════════

STEP 1: Unzip and install
─────────────────────────
  unzip promptcraft.zip
  cd promptcraft
  npm install

STEP 2: Create your environment file
─────────────────────────────────────
  cp .env.example .env.local

Then open .env.local and fill in these values (details below):
  DATABASE_URL=...
  NEXTAUTH_SECRET=...
  GOOGLE_CLIENT_ID=...
  GOOGLE_CLIENT_SECRET=...
  ANTHROPIC_API_KEY=...

STEP 3: Get your Anthropic API key (5 minutes)
───────────────────────────────────────────────
  1. Go to: https://console.anthropic.com
  2. Click "API Keys" → "Create Key"
  3. Copy it into ANTHROPIC_API_KEY in .env.local
  Cost: ~$0.003 per prompt generation (very cheap)

STEP 4: Set up Google OAuth (10 minutes)
─────────────────────────────────────────
  1. Go to: https://console.cloud.google.com
  2. Create new project: "PromptCraft"
  3. APIs & Services → Credentials → Create OAuth 2.0 Client ID
  4. Application type: Web application
  5. Authorized redirect URIs:
     - http://localhost:3000/api/auth/callback/google
     - https://yourdomain.com/api/auth/callback/google  (add after deploy)
  6. Copy Client ID and Secret into .env.local

STEP 5: Generate NextAuth secret
──────────────────────────────────
  Run this in terminal:
    openssl rand -base64 32
  Paste the output as NEXTAUTH_SECRET in .env.local

═══════════════════════════════════════════════════════
PART 2 — DATABASE SETUP WITH RAILWAY (20 minutes)
═══════════════════════════════════════════════════════

Railway gives you free PostgreSQL to start. No credit card for hobby plan.

STEP 1: Create Railway account
──────────────────────────────
  1. Go to: https://railway.app
  2. Sign up with GitHub
  3. Click "New Project" → "Provision PostgreSQL"

STEP 2: Get your connection string
────────────────────────────────────
  1. Click your PostgreSQL service
  2. Go to "Connect" tab
  3. Copy "Postgres Connection URL"
  4. Paste into DATABASE_URL in .env.local

STEP 3: Run Prisma migrations
──────────────────────────────
  npm run db:generate
  npm run db:push

  This creates all tables in Railway PostgreSQL.

STEP 4: Seed the templates
────────────────────────────
  npm run db:seed

  This loads 20 ready-to-use prompt templates.

STEP 5: Verify with Prisma Studio
───────────────────────────────────
  npm run db:studio
  Opens at localhost:5555 — you should see all tables and templates.

═══════════════════════════════════════════════════════
PART 3 — RUN LOCALLY (1 minute)
═══════════════════════════════════════════════════════

  npm run dev

  Open: http://localhost:3000

  Test checklist:
  ✓ Landing page loads
  ✓ Click "Generator" → categories appear
  ✓ Select "Business" → fill in form → click Generate
  ✓ Prompt appears with quality score
  ✓ Copy button works
  ✓ Sign in with Google works
  ✓ Prompt saved to Library after sign-in

═══════════════════════════════════════════════════════
PART 4 — DEPLOY TO VERCEL (15 minutes)
═══════════════════════════════════════════════════════

Vercel is free for hobby. Your app goes live here.

STEP 1: Push to GitHub
────────────────────────
  git init
  git add .
  git commit -m "PromptCraft v1.0 — launch"
  git remote add origin https://github.com/YOUR_USERNAME/promptcraft
  git push -u origin main

STEP 2: Connect to Vercel
───────────────────────────
  1. Go to: https://vercel.com
  2. "Add New Project" → Import from GitHub
  3. Select your promptcraft repo
  4. Framework: Next.js (auto-detected)
  5. Click "Deploy"

STEP 3: Add environment variables in Vercel
─────────────────────────────────────────────
  In Vercel dashboard → Settings → Environment Variables, add ALL your .env.local values:
  - DATABASE_URL
  - NEXTAUTH_URL (set this to your Vercel URL: https://promptcraft-xxx.vercel.app)
  - NEXTAUTH_SECRET
  - GOOGLE_CLIENT_ID
  - GOOGLE_CLIENT_SECRET
  - ANTHROPIC_API_KEY

STEP 4: Update Google OAuth redirect URI
──────────────────────────────────────────
  Back in Google Cloud Console → Credentials → Your OAuth App
  Add: https://your-vercel-url.vercel.app/api/auth/callback/google

STEP 5: Redeploy
──────────────────
  In Vercel → Deployments → Click "Redeploy"

  🎉 Your app is now LIVE on the internet!

STEP 6: Custom domain (optional but professional)
──────────────────────────────────────────────────
  Recommended domains:
  - promptcraft.io (~$35/year)
  - getpromptcraft.com (~$12/year)
  - promptcraft.sa (for Saudi market)

  Buy on Namecheap → point DNS to Vercel → done.

═══════════════════════════════════════════════════════
PART 5 — ADD PAYMENTS WITH LEMON SQUEEZY (30 minutes)
═══════════════════════════════════════════════════════

Lemon Squeezy supports Saudi Arabia and accepts Mada cards.
They handle VAT, billing, and payouts to your Saudi bank.

STEP 1: Create account
────────────────────────
  Go to: https://lemonsqueezy.com
  Sign up → Create a store called "PromptCraft"

STEP 2: Create products
────────────────────────
  Product 1: "PromptCraft Pro"
  - Price: $9/month (SAR ~34) 
  - Annual option: $79/year (save 27%)
  - Type: Subscription

  Product 2: "PromptCraft Team"
  - Price: $29/month (SAR ~109)
  - Type: Subscription

STEP 3: Get your API keys
──────────────────────────
  Settings → API → Generate key
  Add to .env.local:
    LEMONSQUEEZY_API_KEY=...
    LEMONSQUEEZY_STORE_ID=...
    LEMONSQUEEZY_PRO_VARIANT_ID=...
    LEMONSQUEEZY_TEAM_VARIANT_ID=...

STEP 4: Payment flow
──────────────────────
  The pricing page links go to /api/checkout/pro and /api/checkout/team.
  Create these routes to redirect to Lemon Squeezy checkout URLs.

  Example route (app/api/checkout/pro/route.ts):

    export async function GET() {
      const url = `https://promptcraft.lemonsqueezy.com/checkout/buy/${process.env.LEMONSQUEEZY_PRO_VARIANT_ID}`;
      return Response.redirect(url);
    }

STEP 5: Webhook to upgrade user plan
──────────────────────────────────────
  In Lemon Squeezy → Webhooks → Add endpoint:
    URL: https://yourdomain.com/api/webhooks/lemonsqueezy

  Create app/api/webhooks/lemonsqueezy/route.ts:
  On "subscription_created" event → update User.plan to "PRO" in database.

═══════════════════════════════════════════════════════
PART 6 — REVENUE STRATEGY (How to get your first SAR)
═══════════════════════════════════════════════════════

WEEK 1 — LAUNCH & FREE USERS
──────────────────────────────
Goal: Get 100 free users. Validate the product.

Day 1-2: Post launch content on:
  - LinkedIn: "I built a tool that writes perfect AI prompts in 30 seconds"
  - Instagram: Screen recording of you generating a prompt
  - Twitter/X: "Built PromptCraft in 48 hours using Next.js + Claude API"
  - Product Hunt: Submit for a Tuesday launch (highest traffic day)

Day 3-5: Reach out directly:
  - Post in Saudi Twitter tech communities
  - Share in WhatsApp groups for GCC founders and marketers
  - Share in GCC-specific Facebook groups (Saudi Business Owners, etc.)
  - DM 20 people who complain about AI giving bad outputs

Day 6-7: Convert free users:
  - Email users who generated 5+ prompts: "You're a power user — upgrade for unlimited"
  - Offer launch discount: "First 50 Pro users get 3 months for price of 1"

TARGET WEEK 1: 100 free signups, 5-10 Pro upgrades = $45-90 MRR

WEEK 2-4 — GROWTH CHANNELS
────────────────────────────

Channel 1: Arabic Twitter/X (BIGGEST opportunity)
  - Post in Arabic about AI prompt tips
  - Hashtags: #الذكاء_الاصطناعي #ريادة_الأعمال #السعودية
  - 1 viral Arabic tweet can get you 500+ signups

Channel 2: Content marketing
  - Blog posts: "10 ChatGPT prompts for Saudi business owners"
  - YouTube Shorts: 60-second prompt demos in Arabic
  - TikTok: "Watch me turn a bad AI prompt into a perfect one"

Channel 3: Freelance marketplaces
  - List a Fiverr gig: "I will write expert AI prompts for your business"
  - Use PromptCraft to deliver the service → show clients the tool → upsell them Pro
  - Mostaql: Same strategy for Arabic market

Channel 4: B2B outreach
  - Target marketing agencies in KSA, UAE
  - Offer: "Your team generates unlimited prompts for $29/month instead of hiring a prompt engineer at SAR 10k/month"
  - One agency sale = Team plan = $29/month recurring

Channel 5: Partnerships
  - Partner with No-code communities (Webflow, Bubble users)
  - Partner with Arabic content creator communities
  - Affiliate program: 30% commission for referrals (set up in Lemon Squeezy)

MONTH 1 TARGET MILESTONES:
  Week 1: Launch → 100 free users → $90 MRR (10 Pro)
  Week 2: 300 users → $270 MRR (30 Pro)
  Week 3: 600 users → $540 MRR (60 Pro) + first Team sale
  Week 4: 1000 users → $900 MRR (100 Pro) + 3 Team sales = $987 MRR

MONTH 3 TARGET: $3,000 MRR (300 Pro + 15 Team)
MONTH 6 TARGET: $8,000 MRR
MONTH 12 TARGET: $20,000 MRR (qualified for Misk/Badir accelerator)

═══════════════════════════════════════════════════════
PART 7 — PRICING PSYCHOLOGY FOR GCC MARKET
═══════════════════════════════════════════════════════

Why $9/month works in KSA:
  - SAR 34/month = less than 2 cups of Starbucks
  - Compare to: hiring a copywriter (SAR 150+/hour)
  - Positioning: "Pay SAR 34. Save 10 hours of work per month."

Arabic pricing page copy:
  "وفّر ساعات من كتابة البرومبت يومياً بـ 34 ريال فقط في الشهر"
  (Save hours of prompt writing daily for just SAR 34/month)

Offer annual plan aggressively:
  - Annual = $79 (saves $29 vs monthly)
  - This gives you $79 cash upfront per user
  - 50 annual signups = $3,950 cash in one day
  - Offer annual-only discount at launch: "Launch Week: Annual plan 50% off → $39"

═══════════════════════════════════════════════════════
PART 8 — QUICK WINS TO IMPLEMENT IN WEEK 2
═══════════════════════════════════════════════════════

1. Add email capture on landing page
   - "Get 10 free AI prompt templates" → collect emails
   - Use Resend (free tier) to send welcome sequence
   - 3-email sequence: Welcome → Use cases → Upgrade offer

2. Add referral program
   - "Refer a friend → both get 1 extra week Pro free"
   - Simple: add a referral code to user accounts
   - Word of mouth is your cheapest marketing

3. Add a free Chrome extension (later)
   - "PromptCraft for ChatGPT" — appears in ChatGPT sidebar
   - Drives massive organic installs
   - Upsell to Pro from inside the extension

4. Build in public on LinkedIn/Twitter
   - "Day 1: Launched PromptCraft. 12 signups."
   - "Day 7: 100 users. $90 MRR. Here's what worked..."
   - Building in public = free marketing + accountability

5. Misk/Badir accelerator (Riyadh)
   - Apply once you hit $1,000 MRR
   - They give: SAR 50,000-200,000 + office space + mentorship
   - Website: misk.org.sa | badir.com.sa | monshaat.gov.sa

═══════════════════════════════════════════════════════
PART 9 — TECHNICAL IMPROVEMENTS (MONTH 2)
═══════════════════════════════════════════════════════

Priority order:
  1. Redis rate limiting (Upstash) — more reliable than DB counters
  2. Public prompt sharing (isPublic flag already in DB)
  3. Folder organization for saved prompts
  4. Export to PDF (html2pdf.js)
  5. API access for Team plan users
  6. Chrome extension MVP
  7. Mobile app (React Native or PWA)

Cost at scale:
  Claude API: ~$0.003/generation × 10,000 generations/month = $30/month
  Railway DB: $5/month
  Vercel Pro: $20/month
  Total infra at 1,000 users: ~$55/month
  Revenue at 1,000 users (10% convert): $900/month
  Profit margin: 94%

═══════════════════════════════════════════════════════
EMERGENCY CONTACTS & RESOURCES
═══════════════════════════════════════════════════════

If something breaks:
  - Vercel logs: vercel.com/dashboard → your project → Functions tab
  - DB issues: railway.app → your project → PostgreSQL → Query
  - Claude API: console.anthropic.com → Logs

Key URLs:
  - Anthropic Console: console.anthropic.com
  - Railway Dashboard: railway.app
  - Vercel Dashboard: vercel.com/dashboard
  - Lemon Squeezy: app.lemonsqueezy.com
  - Google Cloud: console.cloud.google.com
  - Prisma Studio: npm run db:studio

Support:
  - Claude API docs: docs.anthropic.com
  - Prisma docs: prisma.io/docs
  - NextAuth docs: next-auth.js.org

═══════════════════════════════════════════════════════
SUMMARY LAUNCH CHECKLIST
═══════════════════════════════════════════════════════

PRE-LAUNCH (Today):
  □ npm install && cp .env.example .env.local
  □ Fill in all 5 environment variables
  □ npm run db:push (create tables)
  □ npm run db:seed (add templates)
  □ npm run dev → test locally
  □ Push to GitHub
  □ Deploy to Vercel
  □ Test live URL

LAUNCH DAY:
  □ Post on LinkedIn (English)
  □ Post on Twitter/X (Arabic + English)
  □ Post on Instagram Stories
  □ Submit to Product Hunt
  □ DM 20 targeted people
  □ Share in 5 WhatsApp groups

WEEK 1 GOAL: 100 free users, $90 MRR
MONTH 1 GOAL: $1,000 MRR
MONTH 6 GOAL: $8,000 MRR → Apply to Misk Accelerator

يلا أخوي، الفرصة موجودة والأداة جاهزة. المهم التنفيذ! 🚀

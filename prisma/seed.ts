// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding prompt templates...');

  const templates = [
    { category: 'social', title: 'Viral Instagram Product Post', description: 'High-engagement Instagram caption for product launches', inputs: { product: 'Premium product', audience: 'GCC professionals', platform: 'Instagram', tone: 'Inspirational', goal: 'Drive sales', lang: 'English' }, rating: 4.8 },
    { category: 'social', title: 'LinkedIn Thought Leadership', description: 'Authority-building LinkedIn post for founders', inputs: { product: 'SaaS product', audience: 'Business decision makers', platform: 'LinkedIn', tone: 'Professional', goal: 'Build authority', lang: 'English' }, rating: 4.7 },
    { category: 'social', title: 'Arabic Ramadan Campaign', description: 'Culturally resonant Ramadan social content in Arabic', inputs: { product: 'Consumer product', audience: 'Saudi families', platform: 'Instagram', tone: 'Warm & personal', goal: 'Brand awareness', lang: 'Arabic', keywords: 'رمضان كريم' }, rating: 4.9 },
    { category: 'business', title: 'Go-to-Market Strategy', description: 'Complete GTM strategy for GCC product launch', inputs: { product: 'SaaS startup', audience: 'SME owners in KSA', goal: 'Market penetration', tone: 'Strategic', format: 'Strategy document', language: 'English' }, rating: 4.8 },
    { category: 'business', title: 'Investor Pitch Narrative', description: 'Compelling investor pitch for MENA startups', inputs: { product: 'Tech startup', audience: 'Angel investors and VCs', goal: 'Raise seed funding', tone: 'Bold', format: 'Presentation outline', language: 'English' }, rating: 4.9 },
    { category: 'business', title: 'Competitive Analysis', description: 'Deep-dive competitor analysis framework', inputs: { product: 'Digital product', audience: 'Executive team', goal: 'Identify market gaps', competitor: 'Market leaders', tone: 'Authoritative', format: 'Executive summary', language: 'English' }, rating: 4.6 },
    { category: 'coding', title: 'Next.js API Route', description: 'Production-ready Next.js API with error handling', inputs: { task: 'REST API endpoint', language: 'TypeScript + Next.js 14', requirements: 'Authentication, validation, error handling', level: 'Senior/Production-grade', output: 'Full working code' }, rating: 4.8 },
    { category: 'coding', title: 'Prisma Database Schema', description: 'Complete Prisma schema for SaaS applications', inputs: { task: 'SaaS database schema with multi-tenancy', language: 'Prisma ORM + PostgreSQL', requirements: 'Soft deletes, timestamps, relations', level: 'Senior/Production-grade', output: 'Full working code' }, rating: 4.7 },
    { category: 'coding', title: 'React Component Builder', description: 'Reusable React component with TypeScript', inputs: { task: 'Custom UI component', language: 'TypeScript + React + Tailwind', requirements: 'Props typed, responsive, accessible', level: 'Intermediate', output: 'Code + inline comments' }, rating: 4.6 },
    { category: 'email', title: 'Cold Outreach — SaaS Founder', description: 'High-converting cold email for B2B SaaS', inputs: { goal: 'Cold outreach', sender: 'SaaS founder', recipient: 'CEO of target company', offer: 'Free trial of AI tool', tone: 'Direct & brief', length: 'Short (under 150 words)', language: 'English' }, rating: 4.8 },
    { category: 'email', title: 'Follow-up Email Sequence', description: 'Non-pushy follow-up that converts', inputs: { goal: 'Follow-up', sender: 'Sales professional', recipient: 'Warm prospect', offer: 'Previous meeting follow-up', tone: 'Warm & personal', length: 'Ultra-short (5 lines)', language: 'English' }, rating: 4.7 },
    { category: 'ecommerce', title: 'Noon/Amazon Product Description', description: 'SEO-optimized product listing for GCC marketplaces', inputs: { product: 'Consumer electronics', audience: 'GCC online shoppers', platform: 'Amazon KSA', usp: 'Free shipping, warranty', type: 'Product description', language: 'English' }, rating: 4.6 },
    { category: 'ecommerce', title: 'WhatsApp Broadcast Message', description: 'High-response WhatsApp business broadcast', inputs: { product: 'Restaurant or retail business', audience: 'Existing customers', platform: 'WhatsApp Catalog', usp: 'Exclusive offer', type: 'WhatsApp broadcast', language: 'Arabic' }, rating: 4.8 },
    { category: 'design', title: 'SaaS Dashboard Design Brief', description: 'Complete UI/UX brief for a SaaS dashboard', inputs: { project: 'Analytics dashboard', audience: 'Business users', style: 'Dark & premium', colors: 'Dark navy + electric blue', inspiration: 'Linear, Vercel', format: 'UI design brief', language: 'English' }, rating: 4.7 },
    { category: 'education', title: 'Concept Explainer — Beginners', description: 'Crystal-clear explanation for complete beginners', inputs: { topic: 'Complex technical concept', audience: 'Complete beginner', format: 'Simple explanation', context: 'Real-world analogies', length: 'Medium', language: 'English' }, rating: 4.7 },
    { category: 'ai', title: 'Customer Support AI Agent', description: 'System prompt for multilingual support agent', inputs: { task: 'Customer support automation', model: 'Claude (Anthropic)', usecase: 'E-commerce support in Arabic and English', constraints: 'Polite, escalate complex issues to human', output: 'System prompt', language: 'Bilingual' }, rating: 4.9 },
    { category: 'data', title: 'Sales Analytics Report', description: 'Executive-ready sales analysis prompt', inputs: { dataset: 'Monthly sales by region', goal: 'Identify growth opportunities', tool: 'Python + pandas', format: 'Data insights report', audience: 'Business executives', language: 'English' }, rating: 4.6 },
    { category: 'arabic', title: 'محتوى تسويقي خليجي', description: 'Arabic marketing content for GCC market', inputs: { topic: 'منتج أو خدمة رقمية', audience: 'رواد الأعمال في الخليج', market: 'عموم دول الخليج', type: 'محتوى تسويقي', arabic_style: 'فصحى معاصرة', keywords: 'رؤية 2030، التحول الرقمي' }, rating: 4.9 },
    { category: 'arabic', title: 'بريد إلكتروني تجاري بالعربي', description: 'Professional Arabic business email', inputs: { topic: 'تقديم منتج أو خدمة', audience: 'مدراء الشركات في السعودية', market: 'المملكة العربية السعودية', type: 'بريد إلكتروني تجاري', arabic_style: 'فصحى رسمية', keywords: '' }, rating: 4.7 },
    { category: 'social', title: 'TikTok Script for GCC', description: 'Viral TikTok video script for Arabic audience', inputs: { product: 'Trendy consumer product', audience: 'Saudi youth 18-28', platform: 'TikTok', tone: 'Funny & witty', goal: 'Go viral and drive followers', lang: 'Arabic', keywords: 'ترند، فايرال' }, rating: 4.8 },
  ];

  for (const t of templates) {
    await prisma.promptTemplate.upsert({
      where: { id: t.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') },
      update: {},
      create: {
        id: t.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        category: t.category,
        title: t.title,
        description: t.description,
        inputs: t.inputs,
        rating: t.rating,
        ratingCount: Math.floor(Math.random() * 50) + 10,
      },
    });
  }

  console.log(`✅ Seeded ${templates.length} prompt templates`);
}

main().catch(console.error).finally(() => prisma.$disconnect());

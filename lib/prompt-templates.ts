// lib/prompt-templates.ts
// All 10 prompt categories with their tailored form fields

export interface FieldConfig {
  key: string;
  label: string;
  type: 'input' | 'textarea' | 'select' | 'toggle';
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

export interface CategoryConfig {
  id: string;
  emoji: string;
  name: string;
  nameAr: string;
  desc: string;
  fields: FieldConfig[];
  proOnly?: boolean;
}

export const CATEGORIES: CategoryConfig[] = [
  {
    id: 'business',
    emoji: '💼',
    name: 'Business & Marketing',
    nameAr: 'الأعمال والتسويق',
    desc: 'Strategy, positioning, brand voice',
    fields: [
      { key: 'product', label: 'What is your product or service?', type: 'input', placeholder: 'e.g. AI-powered CRM for SMEs in KSA', required: true },
      { key: 'audience', label: 'Who is your target audience?', type: 'input', placeholder: 'e.g. Saudi business owners, 30–50 years old', required: true },
      { key: 'goal', label: 'What is the main business goal?', type: 'input', placeholder: 'e.g. Increase MRR by 30% in Q2' },
      { key: 'competitor', label: 'Main competitor or comparison', type: 'input', placeholder: 'e.g. Salesforce, HubSpot' },
      { key: 'tone', label: 'Tone of voice', type: 'select', options: ['Professional', 'Authoritative', 'Friendly', 'Bold', 'Consultative', 'Visionary'] },
      { key: 'format', label: 'Output format', type: 'select', options: ['Strategy document', 'Executive summary', 'Action plan', 'Email pitch', 'Presentation outline', 'One-pager'] },
      { key: 'language', label: 'Language', type: 'toggle', options: ['English', 'Arabic', 'Bilingual'] },
    ],
  },
  {
    id: 'coding',
    emoji: '💻',
    name: 'Coding & Development',
    nameAr: 'البرمجة والتطوير',
    desc: 'Code generation, debugging, architecture',
    fields: [
      { key: 'task', label: 'What do you want to build or fix?', type: 'input', placeholder: 'e.g. REST API for user authentication with JWT', required: true },
      { key: 'language', label: 'Programming language / framework', type: 'input', placeholder: 'e.g. TypeScript + Next.js 14', required: true },
      { key: 'context', label: 'Existing code or context', type: 'textarea', placeholder: 'Describe your existing setup or paste relevant code...' },
      { key: 'requirements', label: 'Specific requirements', type: 'input', placeholder: 'e.g. must use Prisma, handle edge cases, production-ready' },
      { key: 'level', label: 'Code level', type: 'select', options: ['Beginner-friendly', 'Intermediate', 'Senior/Production-grade', 'Ultra-optimized', 'With full comments'] },
      { key: 'output', label: 'What do you want back?', type: 'select', options: ['Full working code', 'Step-by-step explanation', 'Code + inline comments', 'Architecture plan', 'Debug analysis', 'Code review'] },
    ],
  },
  {
    id: 'design',
    emoji: '🎨',
    name: 'Design & Creative',
    nameAr: 'التصميم والإبداع',
    desc: 'UI/UX, visual concepts, art direction',
    fields: [
      { key: 'project', label: 'What are you designing?', type: 'input', placeholder: 'e.g. SaaS dashboard for Arabic-speaking users', required: true },
      { key: 'audience', label: 'Target users', type: 'input', placeholder: 'e.g. Saudi professionals, bilingual' },
      { key: 'style', label: 'Visual style', type: 'select', options: ['Minimal & clean', 'Dark & premium', 'Bold & vibrant', 'Corporate', 'Playful', 'Luxury', 'Arabic calligraphy-inspired'] },
      { key: 'colors', label: 'Brand colors or preferences', type: 'input', placeholder: 'e.g. dark navy + gold, or open to suggestions' },
      { key: 'inspiration', label: 'Inspiration references', type: 'input', placeholder: 'e.g. Linear, Stripe, Apple' },
      { key: 'format', label: 'Design output format', type: 'select', options: ['Figma component spec', 'UI design brief', 'Color palette', 'Typography system', 'Full design system', 'Wireframe description'] },
      { key: 'language', label: 'Language', type: 'toggle', options: ['English', 'Arabic', 'Bilingual'] },
    ],
  },
  {
    id: 'social',
    emoji: '📱',
    name: 'Social Media Content',
    nameAr: 'محتوى السوشيال ميديا',
    desc: 'Viral posts, captions, campaigns',
    fields: [
      { key: 'product', label: 'What is your product/service?', type: 'input', placeholder: 'e.g. Handmade abayas from Riyadh', required: true },
      { key: 'audience', label: 'Target audience', type: 'input', placeholder: 'e.g. Saudi women, 20–35 years old' },
      { key: 'platform', label: 'Platform', type: 'select', options: ['Instagram', 'LinkedIn', 'X (Twitter)', 'TikTok', 'Facebook', 'Snapchat', 'YouTube Shorts'] },
      { key: 'tone', label: 'Post tone', type: 'select', options: ['Professional', 'Friendly & relatable', 'Funny & witty', 'Urgent & FOMO', 'Inspirational', 'Storytelling', 'Educational'] },
      { key: 'goal', label: 'Goal of this post', type: 'input', placeholder: 'e.g. Drive sales, boost engagement, announce product' },
      { key: 'keywords', label: 'Keywords or hashtags to include', type: 'input', placeholder: 'e.g. رمضان, GCC, luxury, ريادة الأعمال' },
      { key: 'language', label: 'Language', type: 'toggle', options: ['English', 'Arabic', 'Bilingual'] },
    ],
  },
  {
    id: 'ecommerce',
    emoji: '🛒',
    name: 'eCommerce & Sales',
    nameAr: 'التجارة الإلكترونية والمبيعات',
    desc: 'Product descriptions, ads, conversions',
    fields: [
      { key: 'product', label: 'Product name & description', type: 'input', placeholder: 'e.g. Premium Saudi Oud Perfume — 100ml', required: true },
      { key: 'audience', label: 'Target buyer persona', type: 'input', placeholder: 'e.g. GCC men, 30–55, luxury buyers' },
      { key: 'platform', label: 'Sales platform', type: 'select', options: ['Shopify', 'WooCommerce', 'Amazon KSA', 'Noon', 'Instagram Shop', 'WhatsApp Catalog', 'Salla', 'Zid'] },
      { key: 'usp', label: 'Unique selling points', type: 'input', placeholder: 'e.g. Free shipping KSA, handcrafted, limited edition' },
      { key: 'type', label: 'Content type', type: 'select', options: ['Product description', 'Ad copy (Meta/Google)', 'Email campaign', 'WhatsApp broadcast', 'Bundle offer', 'Flash sale announcement'] },
      { key: 'language', label: 'Language', type: 'toggle', options: ['English', 'Arabic', 'Bilingual'] },
    ],
  },
  {
    id: 'email',
    emoji: '📧',
    name: 'Email & Copywriting',
    nameAr: 'البريد الإلكتروني والكوبي رايتنج',
    desc: 'Cold outreach, newsletters, sequences',
    fields: [
      { key: 'goal', label: 'Email goal', type: 'select', options: ['Cold outreach', 'Follow-up', 'Newsletter', 'Sales pitch', 'Welcome email', 'Re-engagement', 'Event invitation', 'Partnership request'] },
      { key: 'sender', label: 'Who is sending this?', type: 'input', placeholder: 'e.g. Founder of a SaaS startup, freelancer' },
      { key: 'recipient', label: 'Who are you emailing?', type: 'input', placeholder: 'e.g. HR Manager at logistics company in KSA', required: true },
      { key: 'offer', label: 'What are you offering or saying?', type: 'input', placeholder: 'e.g. Introducing our AI HR tool, free 14-day trial', required: true },
      { key: 'tone', label: 'Tone', type: 'select', options: ['Professional', 'Direct & brief', 'Warm & personal', 'Urgent', 'Formal', 'Conversational'] },
      { key: 'length', label: 'Email length', type: 'select', options: ['Ultra-short (5 lines)', 'Short (under 150 words)', 'Medium (150-300 words)', 'Long-form (newsletter)'] },
      { key: 'language', label: 'Language', type: 'toggle', options: ['English', 'Arabic', 'Bilingual'] },
    ],
  },
  {
    id: 'education',
    emoji: '🎓',
    name: 'Education & Learning',
    nameAr: 'التعليم والتعلم',
    desc: 'Explanations, curricula, quizzes',
    fields: [
      { key: 'topic', label: 'What topic or concept?', type: 'input', placeholder: 'e.g. How compound interest works in Islamic finance', required: true },
      { key: 'audience', label: 'Student/learner level', type: 'select', options: ['Complete beginner', 'Intermediate', 'Advanced', 'Professional', 'Child (8–12)', 'Teen (13–17)', 'University student'] },
      { key: 'format', label: 'Teaching format', type: 'select', options: ['Simple explanation', 'Step-by-step lesson', 'Quiz questions', 'Study guide', 'Real-world examples', 'Analogy-based', 'Socratic method'] },
      { key: 'context', label: 'Specific context or examples to use', type: 'input', placeholder: 'e.g. Use Saudi Riyal examples, Gulf business context' },
      { key: 'length', label: 'Content length', type: 'select', options: ['Short (under 300 words)', 'Medium', 'Comprehensive guide', 'Full curriculum module'] },
      { key: 'language', label: 'Language', type: 'toggle', options: ['English', 'Arabic', 'Bilingual'] },
    ],
  },
  {
    id: 'ai',
    emoji: '🤖',
    name: 'AI & Automation',
    nameAr: 'الذكاء الاصطناعي والأتمتة',
    desc: 'Workflows, agents, system design',
    fields: [
      { key: 'task', label: 'What AI task or workflow?', type: 'input', placeholder: 'e.g. Build an AI customer support agent for Arabic', required: true },
      { key: 'model', label: 'AI model/tool you are using', type: 'select', options: ['Claude (Anthropic)', 'ChatGPT / GPT-4', 'Gemini', 'LLaMA / Ollama', 'Midjourney / DALL-E', 'Any / General purpose'] },
      { key: 'usecase', label: 'Use case context', type: 'input', placeholder: 'e.g. Restaurant order management in Arabic, GCC market' },
      { key: 'constraints', label: 'Constraints or requirements', type: 'input', placeholder: 'e.g. Must be concise, handle typos, fallback to human agent' },
      { key: 'output', label: 'Expected output type', type: 'select', options: ['System prompt', 'Workflow design', 'Automation script', 'API integration plan', 'Agent instructions', 'Make.com/Zapier flow'] },
      { key: 'language', label: 'Language', type: 'toggle', options: ['English', 'Arabic', 'Bilingual'] },
    ],
    proOnly: true,
  },
  {
    id: 'data',
    emoji: '📊',
    name: 'Data & Analysis',
    nameAr: 'البيانات والتحليل',
    desc: 'Insights, reports, visualizations',
    fields: [
      { key: 'dataset', label: 'What data or dataset?', type: 'input', placeholder: 'e.g. Monthly sales data for 3 GCC regions', required: true },
      { key: 'goal', label: 'Analysis goal', type: 'input', placeholder: 'e.g. Find top-performing product per region in Ramadan', required: true },
      { key: 'tool', label: 'Tool or language', type: 'select', options: ['Python + pandas', 'SQL', 'Excel', 'Power BI', 'Tableau', 'Google Sheets', 'No-code / AI-assisted'] },
      { key: 'format', label: 'Output format', type: 'select', options: ['Data insights report', 'Charts & visualizations', 'SQL query', 'Python code', 'Dashboard spec', 'Executive summary'] },
      { key: 'audience', label: 'Who will see this?', type: 'select', options: ['Technical team', 'Business executives', 'Investors', 'Marketing team', 'Mixed audience'] },
      { key: 'language', label: 'Language', type: 'toggle', options: ['English', 'Arabic', 'Bilingual'] },
    ],
    proOnly: true,
  },
  {
    id: 'arabic',
    emoji: '🌍',
    name: 'Arabic Content (GCC)',
    nameAr: 'محتوى عربي (الخليج)',
    desc: 'Arabic prompts, GCC market context',
    fields: [
      { key: 'topic', label: 'ما موضوع المحتوى؟ (Content topic)', type: 'input', placeholder: 'مثال: كيفية تسويق منتج رقمي في السوق السعودي', required: true },
      { key: 'audience', label: 'الجمهور المستهدف (Target audience)', type: 'input', placeholder: 'مثال: رواد الأعمال السعوديون بين 25–40 سنة' },
      { key: 'market', label: 'السوق المستهدف (GCC Market)', type: 'select', options: ['المملكة العربية السعودية', 'الإمارات العربية المتحدة', 'الكويت', 'قطر', 'البحرين', 'سلطنة عُمان', 'عموم دول الخليج'] },
      { key: 'type', label: 'نوع المحتوى (Content type)', type: 'select', options: ['محتوى تسويقي', 'محتوى تعليمي', 'منشور سوشيال ميديا', 'بريد إلكتروني تجاري', 'نص إعلاني', 'تقرير أعمال', 'خطة استراتيجية'] },
      { key: 'arabic_style', label: 'أسلوب اللغة العربية (Arabic style)', type: 'select', options: ['فصحى رسمية (Formal MSA)', 'فصحى معاصرة (Modern MSA)', 'عامية خليجية (Gulf dialect)', 'مزيج فصحى وعامية'] },
      { key: 'keywords', label: 'كلمات مفتاحية (Keywords, optional)', type: 'input', placeholder: 'مثال: رمضان، رؤية 2030، ريادة الأعمال، التحول الرقمي' },
    ],
    proOnly: true,
  },
];

export function getCategoryById(id: string): CategoryConfig | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export const FREE_CATEGORIES = ['business', 'coding', 'social'];
export const DAILY_LIMIT_FREE = 5;
export const DAILY_LIMIT_PRO = 999999;

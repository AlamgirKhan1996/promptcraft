// lib/claude.ts
// Anthropic SDK wrapper — server-side only, never call from client

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface GeneratePromptInput {
  category: string;
  categoryName: string;
  inputs: Record<string, string>;
  improve?: boolean;
  existingPrompt?: string;
  language?: string;
}

export interface GeneratePromptResult {
  prompt: string;
  score: number | null;
  reason: string;
  improvements: string[];
}

const PROMPT_ENGINEER_SYSTEM = `You are a world-class prompt engineer with deep expertise in AI systems. Your job is to take simple user inputs and craft a professional, structured, high-performance AI prompt.

Always include ALL of these sections:
1. ROLE: A specific expert role ("Act as a...")
2. CONTEXT: Relevant background the AI needs
3. TASK: Clear, specific instructions
4. FORMAT: How to structure the output
5. TONE: Communication style
6. CONSTRAINTS: What to avoid or include
7. EXAMPLE (if helpful): A brief output example

Make prompts specific enough to get excellent results but flexible enough to be useful. Use numbered lists and clear headings inside the prompt. Output ONLY the prompt itself — no explanation, no preamble, no markdown backticks.`;

const ARABIC_ADDON = `\n\nIMPORTANT: Generate the output prompt in Modern Standard Arabic (فصحى). Ensure natural, professional Arabic phrasing appropriate for the GCC business context. Use proper formal Arabic expressions.`;

export async function generatePrompt(input: GeneratePromptInput): Promise<GeneratePromptResult> {
  const { category, categoryName, inputs, improve, existingPrompt, language } = input;
  const isArabic = language === 'Arabic' || inputs.arabic_style || inputs.lang === 'Arabic';
  const isBilingual = language === 'Bilingual' || inputs.lang === 'Bilingual';

  const systemPrompt = PROMPT_ENGINEER_SYSTEM + (isArabic ? ARABIC_ADDON : '') + (isBilingual ? '\n\nGenerate a bilingual prompt in both English and Arabic (فصحى), with English first then Arabic translation.' : '');

  const inputSummary = Object.entries(inputs)
    .map(([k, v]) => `${k}: ${v || '(not specified)'}`)
    .join('\n');

  const userMessage = improve && existingPrompt
    ? `Improve and enhance this existing prompt for the category "${categoryName}":\n\n${existingPrompt}\n\nUser context:\n${inputSummary}\n\nMake it more specific, sharpen the role definition, add better output format instructions, and tighten constraints.`
    : `Generate a professional, expert-level AI prompt for this category: "${categoryName}"\n\nUser inputs:\n${inputSummary}\n\nCreate a structured, high-performance prompt that will get excellent results from any AI model.`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1200,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });

  const prompt = message.content.map((b) => (b.type === 'text' ? b.text : '')).join('');

  // Quality scoring — second fast call
  let score: number | null = null;
  let reason = '';
  let improvements: string[] = [];

  try {
    const scoreMsg = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      system: 'You are a prompt quality evaluator. Return ONLY valid JSON, no markdown, no explanation.',
      messages: [
        {
          role: 'user',
          content: `Rate this AI prompt 1-10 for clarity, specificity, and expected output quality. JSON only: {"score": number, "reason": "one sentence max 20 words", "improvements": ["short tag 1", "short tag 2", "short tag 3"]}\n\nPrompt:\n${prompt}`,
        },
      ],
    });
    const raw = scoreMsg.content.map((b) => (b.type === 'text' ? b.text : '')).join('');
    const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
    score = parsed.score;
    reason = parsed.reason;
    improvements = parsed.improvements || [];
  } catch {
    // Score is optional, don't fail the whole request
  }

  return { prompt, score, reason, improvements };
}

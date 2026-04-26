// app/api/build-website/route.ts
// PromptiFill Website Builder — FULLY FUNCTIONAL
// Generates complete SPA websites with working navigation, forms, animations

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const BUILD_LIMITS: Record<string, number> = { FREE: 3, PRO: 999, TEAM: 999 };

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    const dbUser = userId ? await prisma.user.findUnique({
      where: { id: userId }, select: { plan: true }
    }) : null;
    const plan = dbUser?.plan ?? 'FREE';

    const { websiteType, description, pages, style, colors, features, language, brandName } = await req.json();

    if (!description || !websiteType) {
      return NextResponse.json({ error: 'Description and website type are required' }, { status: 400 });
    }

    // ── MASTER SYSTEM PROMPT — FULLY FUNCTIONAL ────────────────────────────
    const systemPrompt = `You are a world-class senior full-stack developer who builds FULLY FUNCTIONAL, production-ready single-page web applications.

You build websites that are COMPLETELY INTERACTIVE — every button works, every page loads, every form validates, every animation runs.

═══════════════════════════════════════════════════
TECHNICAL REQUIREMENTS — ALL MANDATORY
═══════════════════════════════════════════════════

1. SINGLE-FILE SPA ARCHITECTURE:
   - One HTML file that works like a multi-page app
   - JavaScript-powered routing: show/hide sections on nav click
   - Browser history API for real URL-like navigation
   - Active nav state updates automatically
   - Smooth page transitions (fade in/out between pages)

2. FULLY WORKING NAVIGATION:
   - Desktop nav with all links working
   - Mobile hamburger menu (opens/closes with animation)
   - Active page highlighted in nav
   - Smooth scroll to sections when clicking nav
   - Back to top button (appears after scroll)
   - Logo click goes to home

3. FULLY WORKING FORMS:
   - Contact form with real validation
   - Show error messages for empty/invalid fields
   - Show success message with animation after submit
   - Email format validation
   - Phone number validation if present
   - WhatsApp form opens whatsapp.me link
   - Booking forms show confirmation

4. FULLY WORKING BUTTONS:
   - CTA buttons scroll to contact section
   - WhatsApp buttons open wa.me link
   - Social media buttons open links
   - Gallery/portfolio item expand on click
   - "Read more" toggles expand/collapse
   - Pricing buttons scroll to contact/checkout
   - Menu items in restaurants show details on click
   - Service cards expand on click

5. ANIMATIONS & INTERACTIONS:
   - Intersection Observer: elements fade in as user scrolls
   - Counter animation for stats (0 to final number)
   - Typing effect for main headline
   - Parallax on hero background
   - Smooth hover effects on all cards
   - Image zoom on hover for gallery
   - Accordion for FAQ section
   - Tab switching for services/features
   - Testimonial carousel/slider (auto-play + manual)
   - Image lightbox for gallery

6. MOBILE FULLY RESPONSIVE:
   - Hamburger menu with slide-down animation
   - Touch-friendly buttons (min 44px tap targets)
   - Swipe support for carousels on mobile
   - Mobile-specific layouts
   - No horizontal scroll

7. HEADER/NAVBAR:
   - Transparent header that becomes solid on scroll
   - Box shadow appears on scroll
   - Shrinks slightly on scroll (professional feel)
   - Sticky positioning
   - Works on both mobile and desktop

8. LOADING & PERFORMANCE:
   - Page loader animation when site first loads (2 seconds then fades)
   - Lazy-load images with blur-up effect
   - Smooth 60fps animations using CSS transforms

9. PROFESSIONAL FEATURES:
   - Toast notifications for actions
   - Cookie consent banner (if needed)
   - Scroll progress bar at top of page
   - Dark/light mode toggle (if appropriate)
   - Search functionality for menus/services
   - Filter buttons for portfolio/gallery
   - Live character counter on forms

═══════════════════════════════════════════════════
CSS & STYLING REQUIREMENTS
═══════════════════════════════════════════════════

- Use Tailwind CSS via CDN as base
- ALSO write all critical CSS in <style> tag as backup
- Every element has explicit background-color (not just Tailwind class)
- CSS custom properties for colors:
  :root { --primary: #color; --bg: #color; etc. }
- CSS animations: @keyframes for all moving elements
- Smooth transitions: transition: all 0.3s ease
- Glass morphism effects where appropriate
- Gradient text effects for headings
- Box shadows for depth
- Border radius consistency

═══════════════════════════════════════════════════
JAVASCRIPT ARCHITECTURE
═══════════════════════════════════════════════════

Organize JavaScript like this:

// 1. State management
const state = { currentPage: 'home', menuOpen: false, ... };

// 2. Router
function navigate(page) { ... hide/show sections, update nav ... }

// 3. Component functions
function initNavbar() { ... }
function initForms() { ... }
function initAnimations() { ... }
function initCarousel() { ... }
function initCounter() { ... }
function initGallery() { ... }
function initAccordion() { ... }
function initTabs() { ... }

// 4. Event listeners
function bindEvents() { ... }

// 5. Init
document.addEventListener('DOMContentLoaded', function() {
  initNavbar();
  initForms();
  initAnimations();
  initCarousel();
  initCounter();
  bindEvents();
});

═══════════════════════════════════════════════════
CONTENT REQUIREMENTS
═══════════════════════════════════════════════════

- Use REAL, SPECIFIC content that matches the business
- Real phone numbers format: +966 XX XXX XXXX (Saudi)
- Real address format for the city mentioned
- Real business hours
- Real social media links (use # as href)
- Real menu items with SAR prices (for restaurants)
- Real service descriptions with specific details
- Real testimonials that sound authentic
- Real team member names appropriate to the region

═══════════════════════════════════════════════════
IFRAME COMPATIBILITY — CRITICAL
═══════════════════════════════════════════════════

Add these EXACTLY in <head>:
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="Content-Security-Policy" content="default-src * 'unsafe-inline' 'unsafe-eval' data: blob:">
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

For Arabic sites also add:
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

And on <body> ALWAYS add:
style="background-color: #YOUR_BG_COLOR; color: #YOUR_TEXT_COLOR; margin:0; font-family:'Inter',sans-serif;"

═══════════════════════════════════════════════════
OUTPUT RULES
═══════════════════════════════════════════════════

1. Return ONLY the complete HTML — no explanations, no markdown
2. Start with <!DOCTYPE html> — nothing before it
3. End with </html> — nothing after it
4. Minimum 500 lines of code
5. Make it BEAUTIFUL and IMPRESSIVE
6. Every feature must actually WORK when clicked`;

    // ── USER PROMPT ────────────────────────────────────────────────────────
    const isArabic = language?.toLowerCase().includes('arabic');
    const isBilingual = language?.toLowerCase().includes('bilingual');

    const userPrompt = `Build a FULLY FUNCTIONAL, production-ready website with these specifications:

WEBSITE TYPE: ${websiteType}
BRAND NAME: ${brandName || 'My Business'}
DESCRIPTION: ${description}
PAGES/SECTIONS: ${pages || 'Home, About, Services, Contact'}
DESIGN STYLE: ${style || 'Dark & Premium'}
COLOR SCHEME: ${colors || 'Dark navy #080812 with indigo #6366f1 accent'}
SPECIAL FEATURES NEEDED: ${features || 'Mobile responsive, animations, working contact form, WhatsApp button'}
LANGUAGE: ${language || 'English'}

${isArabic ? `
ARABIC REQUIREMENTS:
- Set dir="rtl" on <html> tag
- All content in Arabic only
- Font: Noto Sans Arabic
- RTL layout for everything
- Arabic-appropriate content and style
` : ''}

${isBilingual ? `
BILINGUAL REQUIREMENTS:
- Language toggle button in header (EN | عربي)
- JavaScript toggles between English and Arabic content
- dir="rtl" applied to body when Arabic is active
- All text elements have data-en and data-ar attributes
- Smooth transition when switching languages
` : ''}

SPECIFIC JAVASCRIPT FEATURES TO INCLUDE:
1. Working multi-page navigation (SPA routing)
2. Mobile hamburger menu with animation
3. Contact form with full validation + success message
4. WhatsApp button (wa.me link) 
5. Scroll animations (fade in elements as they appear)
6. Counter animation for stats
7. Testimonials carousel/slider
8. FAQ accordion
9. Sticky navbar that changes on scroll
10. Back to top button
11. Page loader animation
12. Gallery with lightbox if ${websiteType === 'restaurant' || websiteType === 'agency' || websiteType === 'gym' ? 'YES - include it' : 'applicable'}
${features?.includes('Booking') ? '13. Booking form with date picker and time slots' : ''}
${features?.includes('Arabic RTL Support') || isArabic ? '13. RTL layout support' : ''}
${isBilingual ? '13. Full language switcher EN/AR' : ''}

Make this website so impressive that when someone sees it they say "WOW — this looks like a $5000 website!"

The website should feel ALIVE — animated, interactive, professional.

Return ONLY the complete HTML code. Nothing else.`;

    const startTime = Date.now();

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 8000, // Maximum for complex fully functional sites
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const rawCode = response.content[0].type === 'text' ? response.content[0].text : '';

    // Clean markdown if added
    let htmlCode = rawCode
      .replace(/^```html\n?/i, '')
      .replace(/^```\n?/i, '')
      .replace(/\n?```$/i, '')
      .trim();

    // Force CSP meta tag if missing
    if (!htmlCode.includes('Content-Security-Policy')) {
      htmlCode = htmlCode.replace(
        '<head>',
        `<head>\n<meta http-equiv="Content-Security-Policy" content="default-src * 'unsafe-inline' 'unsafe-eval' data: blob:">`
      );
    }

    if (!htmlCode.includes('<!DOCTYPE') && !htmlCode.includes('<html')) {
      return NextResponse.json({ error: 'Failed to generate valid website. Please add more details and try again.' }, { status: 500 });
    }

    const executionTime = Date.now() - startTime;
    const tokensUsed = response.usage.input_tokens + response.usage.output_tokens;
    const lineCount = htmlCode.split('\n').length;

    return NextResponse.json({
      success: true,
      html: htmlCode,
      tokensUsed,
      executionTime,
      lineCount,
      websiteType,
      brandName,
    });

  } catch (error: any) {
    console.error('Build website error:', error);
    if (error?.status === 529) return NextResponse.json({ error: 'AI is busy. Please try again in a moment.' }, { status: 503 });
    if (error?.status === 400) return NextResponse.json({ error: 'Request too large. Please simplify your description.' }, { status: 400 });
    return NextResponse.json({ error: 'Failed to build. Please try again.' }, { status: 500 });
  }
}

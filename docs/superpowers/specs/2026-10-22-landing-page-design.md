# Workspace.ai Landing Page — Design Spec

## Overview

Add a marketing-style landing page to Workspace.ai, inspired by the GrowthLab Framer template. The landing page is a separate full-width layout (no app header/tab nav) that introduces the product and funnels visitors into the app. Existing app pages move under an `/app` prefix.

## Routing & Layout Changes

### Current routing

```
/                → InfoPage        (inside AppLayout)
/commitments     → CommitmentsPage (inside AppLayout)
/opportunities   → OpportunitiesPage (inside AppLayout)
/timeline        → TimelinePage    (inside AppLayout)
/items/:id       → ItemDetailPage  (inside AppLayout)
*                → NotFoundPage    (inside AppLayout)
```

### New routing

```
/                → LandingPage     (standalone, full-width, own nav + footer)
/app             → InfoPage        (inside AppLayout)
/app/commitments → CommitmentsPage (inside AppLayout)
/app/opportunities → OpportunitiesPage (inside AppLayout)
/app/timeline    → TimelinePage    (inside AppLayout)
/app/items/:id   → ItemDetailPage  (inside AppLayout)
*                → NotFoundPage    (inside AppLayout)
```

The landing page has its own navigation bar and footer — it does not render inside `AppLayout`.

## Landing Page Sections

### 1. Navigation Bar (`LandingNav`)

- Sticky top bar with glassmorphism backdrop blur
- Left: "Workspace.ai" bold logo text
- Right: anchor links — "Features", "How It Works", "Results" — that smooth-scroll to section IDs
- Right-most: "Get Started" button (primary indigo) linking to `/app`
- Dark mode support using existing Tailwind dark variant

### 2. Hero Section (`HeroSection`)

- Full-width section with generous vertical padding
- Main heading: **"Your Workspace, Intelligently Organized"**
  - Large display text (text-4xl sm:text-5xl lg:text-6xl), font-bold
- Subheading: "Capture information, track commitments, and never miss a deadline — powered by AI that understands what matters."
  - Muted text color, max-w-2xl, centered
- Two CTA buttons side by side:
  - **"Get Started"** — primary (indigo), links to `/app`
  - **"See How It Works"** — secondary/outline, smooth-scrolls to #how-it-works
- Stats bar below CTAs — three inline items separated by dividers:
  - "4 Item Types" | "AI-Powered Insights" | "Smart Timelines"
  - Small text, muted, subtle visual treatment

### 3. Marquee Ticker (`MarqueeTicker`)

- Horizontal auto-scrolling strip of service keywords
- Dark background (gray-900 / black), light text
- Content duplicated for seamless loop: `/INFORMATION /OPPORTUNITIES /EVENTS /COMMITMENTS /TIMELINE /AI-POWERED`
- CSS animation: `marquee` keyframes, translateX(0) → translateX(-50%), infinite linear
- Pauses on hover via `hover:animation-play-state: paused`

### 4. How It Works (`HowItWorksSection`)

- Section ID: `how-it-works`
- Heading: **"How Workspace.ai Works"**
- Subheading: "A simple four-step workflow that turns scattered information into clear action."
- 4 cards in a responsive grid (1-col mobile, 2-col md, 4-col lg):

| # | Title | Description | Icon |
|---|-------|-------------|------|
| 01 | Capture | Add workspace items — information, opportunities, events, or announcements — from any source. | Inbox |
| 02 | Assess | AI evaluates each item's actionability, determining what needs attention and what's informational. | Brain / Sparkles |
| 03 | Commit | Turn actionable items into tracked commitments with priorities, deadlines, and status tracking. | CheckSquare |
| 04 | Review | See everything on a unified timeline — overdue, upcoming, completed — sorted by what matters most. | Clock |

- Card style: rounded border, large step number (text-5xl, faded indigo), title bold, description muted
- Dark mode: dark card bg, light text

### 5. Features Grid (`FeaturesSection`)

- Section ID: `features`
- Heading: **"Everything You Need to Stay on Track"**
- 3 cards in responsive grid (1-col mobile, 3-col md):

| Title | Description | Icon |
|-------|-------------|------|
| Smart Prioritization | AI-driven priority scoring that adapts to deadlines and item importance. | TrendingUp |
| Commitment Generation | One click turns opportunities into trackable commitments with auto-generated details. | Zap |
| Unified Timeline | See commitments and workspace items together, categorized by urgency and status. | Calendar |

- Card style: icon in indigo circle, title bold, description muted, subtle hover shadow transition

### 6. Results Section (`ResultsSection`)

- Section ID: `results`
- Heading: **"Built for Results"**
- Subheading: "A closer look at what Workspace.ai helps you achieve."
- 4 stat cards in a row (2-col mobile, 4-col md):

| Stat | Label |
|------|-------|
| 4 | Item types tracked |
| 4 | Commitment statuses |
| AI | Actionability built in |
| 1 | Unified timeline view |

- Stat number: large (text-4xl), bold, indigo color
- Label: small muted text below
- Card: centered text, subtle border, rounded

### 7. CTA Section (`CtaSection`)

- Full-width section, indigo gradient background (indigo-600 → indigo-800)
- Heading: **"Ready to Take Control of Your Workspace?"** — white text, large
- Subheading: "Stop losing track of what matters. Start organizing with AI." — white/80 opacity
- Button: **"Launch Workspace"** — white bg, indigo text, links to `/app`

### 8. Footer (`Footer`)

- Dark background (gray-900)
- Three-column layout on desktop, stacked on mobile:
  - Left: "Workspace.ai" logo text + "Intelligently organize your work." tagline
  - Middle: Quick links — Features, How It Works, Get Started (anchor/route links)
  - Right: "Built with React, Express & MongoDB"
- Bottom bar: "© 2026 Workspace.ai" centered, border-top separator

## Files to Create

All new files under `client/src/`:

```
components/landing/LandingNav.tsx
components/landing/HeroSection.tsx
components/landing/MarqueeTicker.tsx
components/landing/HowItWorksSection.tsx
components/landing/FeaturesSection.tsx
components/landing/ResultsSection.tsx
components/landing/CtaSection.tsx
components/landing/Footer.tsx
pages/LandingPage.tsx
```

## Files to Modify

| File | Change |
|------|--------|
| `App.tsx` | Add `/` route for `LandingPage` outside `AppLayout`. Nest existing routes under `/app` path prefix. |
| `lib/constants.ts` | Update `routes` object: `info: '/app'`, `commitments: '/app/commitments'`, `opportunities: '/app/opportunities'`, `timeline: '/app/timeline'`, `itemDetail: (id) => '/app/items/${id}'` |
| `index.css` | Add `@keyframes marquee` for the ticker animation |
| `components/layout/TabNav.tsx` | No changes needed — it reads from `routes` constant which will be updated |
| `pages/NotFoundPage.tsx` | Link updates automatically via `routes.info` constant |

## Design System Consistency

- Accent color: indigo-600 (existing)
- Dark mode: class-based via `@custom-variant dark` (existing)
- Border radius: `rounded-md` / `rounded-lg` (existing)
- Backdrop blur on nav: `bg-white/80 backdrop-blur dark:bg-gray-900/80` (matches existing AppLayout header)
- Button: reuse existing `Button` component for CTAs where possible; landing-specific link-styled buttons use anchor tags with matching classes
- Typography: Tailwind defaults (existing)
- Icons: Lucide (existing)

## Out of Scope

- Testimonials section (no real user data)
- Pricing section (not applicable — no paid tiers)
- Blog section (no blog content)
- FAQ section (not needed for MVP landing page)
- Authentication / login flow
- Backend changes — this is purely a frontend addition

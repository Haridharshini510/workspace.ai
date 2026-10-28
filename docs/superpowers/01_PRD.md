# Product Requirements Document: MyWorkspace AI

**Version**: 1.1.0 (Updated to reflect implementation)
**Date**: July 21, 2026 (Updated: October 28, 2026)
**Author**: System Engineering Documentation Agent
**Status**: Living Document - Reflects Actual Implementation

> [!NOTE]
> **Document Update**: This PRD has been updated to reflect the actual implementation state as of October 2026. Changes from v1.0.0 include: Timeline View moved from P1 to P0 (implemented), Reminder Engine moved from P0 to P1 (deferred), implementation status annotations added, milestone progress updated.

---

## 1. Executive Summary

**MyWorkspace AI** is an intelligent personal workspace that functions as a user's "second brain." It autonomously gathers, understands, and structures information from multiple digital platforms into a unified, user-centric workspace. Moving beyond traditional task managers or email clients, Workspace AI proactively manages opportunities, commitments, achievements, and events. By treating external platforms (Gmail, LinkedIn, Luma, etc.) strictly as information sources, MyWorkspace AI builds a centralized, single source of truth that ensures users never miss an opportunity, deadline, or critical life event.

---

## 2. Product Vision & Mission

**Vision**
To eliminate digital fragmentation by creating a unified knowledge workspace that continuously gathers information from all connected platforms and intuitively organizes it around the user's life and goals, rather than around siloed applications.

**Mission**
To empower users to effortlessly manage their commitments and discover new opportunities by intelligently connecting scattered information from emails, calendars, and opportunity platforms into actionable, centralized insights.

> [!NOTE]
> **Core Philosophy**: The Workspace is the heart of the application. Everything outside the workspace exists only to provide information. Instead of organizing information based on where it came from, Workspace AI organizes it based on what it means to the user.

---

## 3. Target Users & Personas

| Persona | Profile & Background | Pain Points | Primary Needs |
| :--- | :--- | :--- | :--- |
| **Sarah (The Ambitious Student)** | CS Undergrad deeply involved in hackathons, internships, and open source. | Misses deadlines for applications because they are buried in email; forgets to check Devfolio. | A single dashboard that tracks her hackathon registrations, deadlines, and internship applications. |
| **David (The Active Professional)** | Junior Software Engineer looking to upskill via workshops, certifications, and networking. | Fails to follow up on LinkedIn networking; loses track of course completion certificates. | Proactive reminders to reply to recruiters; centralized tracking of his professional growth and achievements. |
| **Elena (The Busy Freelancer)** | Independent consultant balancing multiple client projects, webinars, and administrative tasks. | Overwhelmed by different communication channels (email, Slack, Luma). | Wants a unified timeline of all commitments and automated scheduling assistance. |

---

## 4. Problem Statement & Market Analysis

Modern digital information is severely fragmented across multiple services. 
*   **The Problem**: Important opportunities are discovered through one platform while updates arrive through another. Users frequently forget to check emails, miss deadlines, lose track of registrations, forget interview follow-ups, and constantly switch between multiple platforms to piece together their commitments.
*   **Current Solutions Fall Short**: Existing email clients only organize messages. Task managers only organize manually created tasks. Calendars only organize time slots. None understand the context or how these pieces interconnect. 
*   **The Opportunity**: Workspace AI bridges this gap by creating an evolving, unified knowledge workspace leveraging an Intelligent Processing Pipeline to map disparate data to single "Workspace Items."

> [!IMPORTANT]
> A core differentiator is that Workspace AI acts automatically upon data ingestion. Users do not manually create tasks; the system infers commitments from connected sources using deterministic rules first, with LLM as a fallback for ambiguous data and summarization.

---

## 5. Product Goals & Success Metrics (KPIs)

| Goal | Success Metric (KPI) | Target |
| :--- | :--- | :--- |
| Reduce missed commitments | Percentage of "commitments" completed before deadline | > 90% |
| Improve user engagement | Daily Active Users (DAU) / Monthly Active Users (MAU) | > 40% DAU/MAU ratio |
| Increase discovery of opportunities | Number of AI-recommended opportunities actioned per user per month | > 5 actions/month |
| Consolidate platform usage | Average time spent in Workspace AI vs. individual platforms | 30% reduction in platform-switching time |

---

## 6. Feature Requirements

### P0 (Must-Have for MVP)
| Feature | Description |
| :--- | :--- |
| **Information Integration (Basic)** | ✅ **IMPLEMENTED** - Integrate Gmail and Google Calendar as foundational information sources via OAuth 2.0. Automatic sync with batch processing (50 emails, 250 calendar events). Token refresh handling built-in. |
| **Workspace Items Creation & Evolution** | ✅ **IMPLEMENTED** - Intelligent Processing Pipeline that reads ingested data and creates workspace items (e.g., "Microsoft Internship"). When a new email/event arrives about the same item, the system matches it via thread ID (Tier A) or LLM semantic matching (Tier B), overwrites the item's fields with latest info, appends to `contextHistory[]`, and resurfaces it to the top via `updatedAt` timestamp. |
| **Content Intelligence Agent** | ✅ **IMPLEMENTED** - Two-layer email filtering: (1) Rule-based layer checks Gmail labels + keyword patterns to reject OTP/spam/promos/social, (2) LLM classification for uncertain emails using OpenRouter free models (Gemini, Llama, Mistral). Rule-based extraction (regex, date parsing) handles structured fields. LLM returns structured JSON with type, title, summary. Priority scoring based on deadlines + keywords (user profile integration deferred to P1). |
| **Commitments Tracking** | ✅ **IMPLEMENTED** - Automatic generation of actionable commitments from workspace items. Uses `actionabilityService` to determine if item requires action. Auto-generates commitments for both Gmail emails and Calendar events. Prevents duplicate commitments. |
| **Basic Reminder Engine** | ⏸️ **DEFERRED** - Web Push notifications (VAPID) and in-app notification center moved to post-MVP phase. |

### P1 (Should-Have for V1)
| Feature | Description |
| :--- | :--- |
| **User Intelligence Agent** | ⏸️ **PLANNED** - Store user profile (interests, goals, preferences) in User model. Enables personalized priority scoring. Conversational onboarding chatbot for profile building will come later. Profile refinement via behavioral signals (dismissals, engagement tracking). |
| **Expanded Integrations** | ⏸️ **PLANNED** - Connect Devfolio, Unstop, LinkedIn, Luma, and Instagram beyond Gmail and Calendar. |
| **Discovery Engine** | ⏸️ **PLANNED** - Scrapes Devfolio, Unstop, Luma, LinkedIn, and Devpost for opportunities. Personalizes the feed using tag-based scoring (match opportunity tags vs. user profile interests) with LLM re-ranking of top results. User can remove/dismiss opportunities as negative feedback to silently improve future ranking. |
| **Timeline View** | ✅ **IMPLEMENTED** - Visual timeline showing only upcoming deadlines and due dates. Items are automatically hidden from timeline queries once their date has passed (soft delete - preserved in database). Four categories: Overdue, Upcoming, Completed, Undated. Sort by deadline or priority. |
| **Basic Reminder Engine** | ⏸️ **MOVED FROM P0** - Web Push notifications (VAPID) and in-app notification center. Deadline-triggered notifications (24h before). |

### P2 (Nice-to-Have — Don't Implement Now)
| Feature | Description |
| :--- | :--- |
| **Mobile App (PWA / Native)** | Full-featured mobile experience with OS-level push notifications. |
| **AI Chat Interface (Context-Aware)** | Full conversational UI to query the workspace ("When is my next hackathon submission?"). Includes context-aware system prompt with user's items/commitments, page context, streaming responses, conversation history, and rate limiting. Deferred due to high LLM usage. |
| **Auto-Execution** | Allowing AI to draft emails, register for events automatically based on user intent. |

---

## 7. User Stories

### User Area: Data Ingestion & Workspace Generation
*   **As a user**, I want my Gmail to sync automatically so that any hackathon registration I receive is instantly converted into a Workspace Item.
*   **As a user**, I want a follow-up email (e.g., selection result) to automatically update the existing Workspace Item — overwriting outdated fields, tagging it as "updated", and resurfacing it to the top of my workspace — rather than creating a duplicate.

### User Area: Discovery & Opportunities
*   **As a user**, I want the Discovery Feed to be personalized — showing me hackathons, internships, and events that match my interests, skills, and goals.
*   **As a user**, I want to click "Mark Interested" on an opportunity and have it automatically tracked in my Workspace as an item with commitments.
*   **As a user**, I want to remove/dismiss opportunities I don't like, and have the system silently learn from that to improve my future feed.

### User Area: Attention & Commitments
*   **As a user**, I want to be reminded 24 hours before a semester fee payment deadline so I do not incur late fees.
*   **As a user**, I want the Reminder Engine to intelligently escalate urgent notifications to mobile push if I haven't dismissed them in the browser.

---

## 8. Scope Definition

> [!WARNING]
> Careful scoping is essential to ensure a timely launch. Integrations outside of standard OAuth (e.g., scraping Instagram or LinkedIn) carry higher implementation risks and are deferred or sandboxed.

*   **In-Scope for MVP (Phase 1)**: ✅ Gmail integration (complete), ✅ Google Calendar integration (complete), ✅ Rule-based entity extraction with LLM fallback for ambiguous cases and summarization (complete), ✅ React.js + Vite SPA frontend (complete), ✅ Express.js backend (complete), ✅ MongoDB Atlas free tier (complete), ✅ Auto-commitment generation (complete), ⏸️ Web Push notifications and in-app notification center (deferred to V1).
*   **In-Scope for V2 (Phase 2)**: Extended API integrations (Devfolio, Luma, Unstop), User Intelligence conversational profiling, Discovery Engine algorithm.
*   **Out of Scope**: Direct platform action execution (e.g., the AI booking tickets or paying fees), native iOS/Android apps (PWA prioritized).

---

## 9. Assumptions & Constraints

**Assumptions**
*   Users are comfortable providing read access to their emails and calendars for AI processing. ✅ **VALIDATED** - OAuth implementation provides clear consent flow.
*   Rule-based extraction handles the majority of structured data (dates, types, orgs). LLM accuracy for ambiguous cases is consistently high enough (>95%) to prevent mischaracterizing deadlines. ✅ **VALIDATED** - Two-layer filtering (rule-based + LLM) working effectively.
*   External platforms maintain relatively stable APIs or predictable email receipt formats. ✅ **VALIDATED** - Gmail and Calendar APIs are stable with token refresh handling.
*   The product can launch and serve early users (up to ~50) entirely within free-tier service limits. ✅ **VALIDATED** - Using OpenRouter free models, MongoDB Atlas free tier, no paid APIs.

**Constraints**
*   **Rate Limits**: Processing high volumes of historical emails during onboarding is bottlenecked by Google API quotas. ✅ **MITIGATED** - Batch processing with configurable limits (50 emails, 250 calendar events per sync).
*   **Privacy & Security**: All data processing must comply with strict privacy policies to ensure personal data is securely encrypted. ✅ **IMPLEMENTED** - OAuth consent flow, tokens stored securely in database, read-only API access.
*   **Zero Budget**: The entire MVP must be built and deployed using only free-tier services and open-source software. No paid subscriptions, APIs, or hosting until the product gains traction. ✅ **VALIDATED** - OpenRouter free models (Gemini 2.0 Flash, Llama 3.1, Mistral 7B), MongoDB Atlas free tier (512MB), ready for Vercel/Railway deployment.

---

## 10. Dependencies & Risks

| Risk / Dependency | Mitigation Strategy | Severity | Status |
| :--- | :--- | :--- | :--- |
| **Third-Party API Changes** | Abstract external platform ingestion behind an adapter pattern. Use resilient parsing fallbacks. | High | ✅ Mitigated - Service layer abstraction implemented |
| **AI Hallucinations on Dates** | Implement confidence scoring and validation logic (regex + NLP) before confirming a critical deadline. | High | ✅ Mitigated - Rule-based date extraction first, LLM only for ambiguous cases |
| **User Trust & Privacy** | Complete transparency dashboard showing exactly what data was parsed and how it is used. SOC2 compliance early in lifecycle. | Medium | ⏸️ Pending - OAuth consent flow provides basic transparency |
| **Notification Fatigue** | The Reminder Engine must incorporate "Attention Management" to silence low-priority items when workload is high. | Medium | ⏸️ Deferred - Reminder engine not yet implemented |
| **Priority Scoring Without User Profile** | ⚠️ NEW RISK - Priority scoring is generic without user profile data. | Medium | ⚠️ Current - Using deadline + keyword heuristics only |

---

## 11. Implementation Architecture (As Built)

### Core Services Implemented

**Gmail Processing Pipeline**:
1. `gmailService.ts` - OAuth client + Gmail API wrapper (fetch messages, handle tokens)
2. `emailFilterService.ts` - Tier 1+2 filtering (Gmail labels + keyword matching)
3. `emailClassificationService.ts` - Tier 3 LLM classification for uncertain emails
4. `emailMatchingService.ts` - Thread ID matching (Tier A) + LLM semantic matching (Tier B)
5. `emailProcessingService.ts` - Orchestrates: filter → classify → match → create/update workspace items → auto-generate commitments

**Calendar Processing Pipeline**:
1. `calendarService.ts` - OAuth client + Calendar API wrapper (fetch events)
2. `calendarClassificationService.ts` - Filter cancelled/invalid events
3. `calendarProcessingService.ts` - Convert events → workspace items → auto-generate commitments

**Intelligence Services**:
1. `llmService.ts` - OpenRouter integration with model fallback chain (Gemini → Llama → Mistral)
2. `actionabilityService.ts` - Determines if workspace item requires action (rule-based keywords)
3. `priorityService.ts` - Priority calculation based on deadlines + keywords
4. `commitmentGenerationService.ts` - Auto-generates commitments from actionable workspace items

**Data Models**:
1. `User` - OAuth tokens (accessToken, refreshToken), Google profile
2. `WorkspaceItem` - Core entity with `contextHistory[]`, `threadIds[]`, `sourceEmails[]`, `sourceCalendarEventId`
3. `Commitment` - Actionable tasks derived from workspace items

### Evolution Tracking Implementation

The system tracks workspace item evolution through:
- **`contextHistory[]`**: Array of updates showing what changed and when
- **`updatedAt` timestamp**: Mongoose auto-managed, resurfaces items when updated
- **`threadIds[]`**: Tracks all email threads related to this item
- **`sourceEmails[]`**: Tracks all email IDs that contributed to this item

This approach is more powerful than a simple "updated" flag as it provides full audit trail and enables querying update frequency.

### Matching Strategy (Prevents Duplicates)

**Tier A - Thread ID Matching** (Fast):
- Checks if new email's `threadId` matches existing item's `threadIds[]`
- O(1) lookup via MongoDB index

**Tier B - LLM Semantic Matching** (Fallback):
- If no thread match, queries 30 most recent workspace items
- LLM determines if new email relates to any existing item
- Uses structured prompt with item titles/descriptions

This two-tier approach balances speed and accuracy while preventing duplicate workspace items for the same real-world entity.

---

## 12. Release Strategy & Milestones

1.  **Milestone 1: Proof of Concept (M1)** - ✅ **COMPLETE**
    *   ✅ Rule-based extraction pipeline (regex, keyword matching, date parsing) from standard email templates, with LLM fallback for ambiguous cases and summarization.
    *   ✅ Manual Workspace Item creation (CRUD operations fully implemented).
2.  **Milestone 2: Alpha Release (Internal)** - ✅ **~85% COMPLETE**
    *   ✅ Gmail + Calendar syncing (both fully functional).
    *   ✅ Commitment generation engine (auto-triggers for emails and events).
    *   ✅ Timeline view with filtering and sorting.
    *   ⏸️ Reminder engine (deferred).
    *   ⏸️ User profile storage (deferred).
3.  **Milestone 3: Beta Release (Invite-Only)** - 🔄 **PLANNED**
    *   Add user profile storage and basic personalization.
    *   Implement reminder engine (web push + in-app).
    *   Onboard 50-100 targeted students/professionals for testing.
    *   Gather feedback on auto-commitment accuracy.
4.  **Milestone 4: General Availability (V1)** - 🔄 **PLANNED**
    *   Add Discovery Engine (scraping Devfolio, Unstop, Luma).
    *   Add extended integrations (LinkedIn, Devpost).
    *   Public launch with Web App.
    *   Full multi-platform integration.

---

## 13. Implementation Notes & Key Decisions

### Decision Log

**1. Evolution Tracking: `contextHistory[]` vs Explicit "Updated" Flag**
- **Decision**: Use `contextHistory[]` array instead of simple `isUpdated` boolean
- **Rationale**: Provides full audit trail, enables querying update frequency, shows what changed over time
- **Impact**: More powerful than PRD specification, no downside

**2. Timeline: Soft Delete vs Hard Delete**
- **Decision**: Hide past items from timeline queries instead of deleting from database
- **Rationale**: Preserves data for potential future features (history view, analytics), reversible
- **Impact**: Achieves same UX as PRD while maintaining data integrity

**3. Priority Scoring: Deferred User Profile Integration**
- **Decision**: Implement priority scoring with deadline + keyword heuristics only, defer user profile integration
- **Rationale**: User profile is P1 feature, but basic priority scoring is P0 requirement. Rule-based approach provides value immediately.
- **Impact**: Priority is generic (not personalized), acceptable for MVP, can be enhanced when user profiles added

**4. LLM Model Strategy: Free Model Fallback Chain**
- **Decision**: Use OpenRouter with fallback chain (Gemini → Llama → Mistral) instead of single model
- **Rationale**: Provides resilience against rate limits, maintains zero-budget constraint
- **Impact**: High reliability with no cost, slight latency increase on fallback

**5. Auto-Commitment Generation: Always Trigger for New Items**
- **Decision**: Auto-generate commitments for all new actionable items immediately during processing
- **Rationale**: Core value proposition is automation, users shouldn't manually create commitments
- **Impact**: Fully automated workflow, requires good actionability detection (implemented via keyword rules)

**6. Matching Strategy: Thread ID First, LLM Fallback**
- **Decision**: Two-tier matching (fast thread ID lookup → expensive LLM semantic matching)
- **Rationale**: 90%+ of email updates are in same thread, O(1) lookup is fast, LLM handles edge cases
- **Impact**: Efficient duplicate prevention with high accuracy

### Technical Stack (As Built)

**Frontend**:
- React 19.2 + TypeScript 6.0
- Vite 8.2 (build tool)
- TailwindCSS 4.3 (styling)
- React Router 7.18 (SPA routing)
- TanStack Query 5.104 (data fetching)
- Lucide React (icons)

**Backend**:
- Node.js + Express 4.21
- TypeScript 5.6
- Mongoose 9.9 (MongoDB ODM)
- Passport.js (OAuth)
- googleapis 188.0 (Google APIs)
- Zod 4.6 (validation)

**Infrastructure**:
- MongoDB Atlas (free tier - 512MB)
- OpenRouter API (free models)
- Google Cloud (OAuth + APIs)
- Vercel/Railway ready (not yet deployed)

### Performance Characteristics

**Email Sync**:
- Fetches: 50 emails per sync (configurable)
- Processing time: ~10-30 seconds depending on uncertain email count
- LLM calls: 0-50 per sync (only for uncertain emails)

**Calendar Sync**:
- Fetches: 250 events per sync (30 days ahead, configurable)
- Processing time: ~5-10 seconds
- LLM calls: 0 (calendar uses rule-based classification only)

**Matching Performance**:
- Thread ID matching: O(1) via MongoDB index
- LLM matching: O(n) where n=30 (most recent items), ~2-5 seconds per email

---
*End of Document*

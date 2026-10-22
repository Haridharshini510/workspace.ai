# Workspace.ai Frontend Implementation Plan

## Context

The backend (Express/MongoDB) is nearly complete with full CRUD for workspace items, commitments, and a timeline API. The frontend is a fresh Vite + React + TypeScript scaffold with Tailwind CSS v4, React Router v7, TanStack Query v5, and Lucide icons installed but not wired up. No components, pages, hooks, or API utilities exist yet. Goal: build the full UI in 8 testable phases.

---

## Folder Structure

```
client/src/
  api/
    client.ts                 -- fetch wrapper (base URL, JSON, error handling)
    workspace-items.ts        -- all workspace item API calls
    commitments.ts            -- all commitment API calls
    timeline.ts               -- timeline API calls
  types/
    common.ts                 -- Priority, ApiError, PaginationMeta
    workspace-item.ts         -- WorkspaceItem, enums, payloads
    commitment.ts             -- Commitment, enums, payloads
    timeline.ts               -- TimelineEntry, TimelineResponse shapes
  hooks/
    use-workspace-items.ts    -- TanStack Query hooks for workspace items
    use-commitments.ts        -- TanStack Query hooks for commitments
    use-timeline.ts           -- TanStack Query hooks for timeline
    use-theme.ts              -- OS dark mode detection + manual toggle
  components/
    ui/                       -- Button, Badge, Select, Input, Textarea, Dialog,
                                 EmptyState, LoadingSpinner, ErrorMessage,
                                 Toast, ToastProvider, Pagination
    layout/
      AppLayout.tsx           -- Shell: header + tab nav + Outlet
      TabNav.tsx              -- 4-tab navigation
      ThemeToggle.tsx         -- Sun/Moon toggle
    workspace-items/          -- WorkspaceItemList, Card, Filters, Form,
                                 Detail, ActionabilityBadge, DeleteDialog
    commitments/              -- CommitmentList, Card, Filters, Form,
                                 StatusToggle, DeleteDialog
    opportunities/            -- OpportunityList, OpportunitySourceSection
    timeline/                 -- SummaryBar, CategorySection, EntryCard, SortToggle
  pages/
    InfoPage.tsx
    CommitmentsPage.tsx
    TimelinePage.tsx
    OpportunitiesPage.tsx
    ItemDetailPage.tsx
    NotFoundPage.tsx
  lib/
    query-client.ts           -- QueryClient config (staleTime: 30s, retry: 1)
    constants.ts              -- Query key factories, route paths, enum labels
    utils.ts                  -- formatDate, priorityColor, statusLabel helpers
  App.tsx                     -- Providers + router
  main.tsx                    -- Entry point (unchanged)
  index.css                   -- Tailwind import + dark mode custom variant
```

---

## Phase 1: Foundation

**Goal:** Routing between 4 tabs works, dark/light mode responds to OS preference, API proxy configured.

**Create:**
- `types/common.ts`, `types/workspace-item.ts`, `types/commitment.ts`, `types/timeline.ts`
- `api/client.ts` — thin fetch wrapper with `get`, `post`, `patch`, `del` methods
- `lib/query-client.ts`, `lib/constants.ts`, `lib/utils.ts`
- `hooks/use-theme.ts` — reads `prefers-color-scheme`, toggles `.dark` class on `<html>`
- `components/layout/AppLayout.tsx`, `TabNav.tsx`, `ThemeToggle.tsx`
- `components/ui/LoadingSpinner.tsx`, `ErrorMessage.tsx`, `EmptyState.tsx`
- `pages/` — all 6 pages as placeholders
- `pages/NotFoundPage.tsx` — "Page not found" with link home

**Modify:**
- `vite.config.ts` — add `server.proxy: { "/api": "http://localhost:3001" }` and `@` path alias
- `tsconfig.app.json` — add `baseUrl` + `paths` for `@/*`
- `index.css` — add `@custom-variant dark (&:where(.dark, .dark *));` for class-based dark mode
- `App.tsx` — QueryClientProvider + BrowserRouter + Routes with AppLayout as parent
- `index.html` — update `<title>` to "Workspace.ai"

**Verify:** Dev server shows header, 4 tabs navigate between placeholder pages, dark toggle works, `/api/health` proxies to backend.

---

## Phase 2: Info Page (Read)

**Goal:** Display workspace items in a filterable list with loading/empty/error states.

**Create:**
- `api/workspace-items.ts` — `fetchWorkspaceItems(filters?)`, `fetchWorkspaceItem(id)`
- `hooks/use-workspace-items.ts` — `useWorkspaceItems(filters)`, `useWorkspaceItem(id)`
- `components/ui/Badge.tsx`, `components/ui/Select.tsx`
- `components/workspace-items/WorkspaceItemFilters.tsx` — type/status/priority dropdowns
- `components/workspace-items/WorkspaceItemCard.tsx` — card with badges, click navigates to detail
- `components/workspace-items/WorkspaceItemList.tsx` — responsive grid of cards

**Modify:** `pages/InfoPage.tsx` — filters + conditional loading/empty/error/list rendering

**Verify:** With data in MongoDB, cards appear. Filters narrow results. Empty DB shows EmptyState. Backend down shows ErrorMessage with retry.

---

## Phase 3: Info Page (Write)

**Goal:** Create, edit, and delete workspace items.

**Create:**
- `components/ui/Button.tsx`, `Input.tsx`, `Textarea.tsx`, `Dialog.tsx`
- `components/workspace-items/WorkspaceItemForm.tsx` — shared create/edit form
- `components/workspace-items/DeleteItemDialog.tsx` — confirmation with cascade warning

**Add to existing:**
- `api/workspace-items.ts` — `createWorkspaceItem`, `updateWorkspaceItem`, `deleteWorkspaceItem`
- `hooks/use-workspace-items.ts` — `useCreateWorkspaceItem`, `useUpdateWorkspaceItem`, `useDeleteWorkspaceItem` (mutations that invalidate queries)

**Modify:** `pages/InfoPage.tsx` — "New Item" button, edit/delete icons on cards, dialogs

**Verify:** Create item → card appears. Edit → changes persist. Delete → card disappears. Invalid form → client validation blocks submit.

---

## Phase 4: Item Detail Page

**Goal:** Single item view with actionability, linked commitments, and commitment generation.

**Add to existing:**
- `api/workspace-items.ts` — `fetchActionability`, `fetchItemCommitments`, `generateItemCommitment`
- `hooks/use-workspace-items.ts` — `useActionability`, `useItemCommitments`, `useGenerateCommitment`

**Create:**
- `components/workspace-items/ActionabilityBadge.tsx` — green/gray/amber badge with reason
- `components/workspace-items/WorkspaceItemDetail.tsx` — full field display

**Modify:** `pages/ItemDetailPage.tsx` — detail view + actionability + linked commitments list + "Generate Commitment" button with outcome handling

**Verify:** Click card → detail page. Actionability loads. Generate commitment on actionable item → commitment appears. Generate again → "already exists" message.

---

## Phase 5: Commitments Page

**Goal:** Full CRUD for commitments with filtering and quick status toggle.

**Create:**
- `api/commitments.ts` — all CRUD functions
- `hooks/use-commitments.ts` — all query/mutation hooks (invalidate commitments + timeline)
- `components/commitments/CommitmentCard.tsx`, `CommitmentList.tsx`, `CommitmentFilters.tsx`
- `components/commitments/CommitmentStatusToggle.tsx` — dropdown to change status inline
- `components/commitments/CommitmentForm.tsx` — create/edit form
- `components/commitments/DeleteCommitmentDialog.tsx`

**Modify:**
- `pages/CommitmentsPage.tsx` — full page with filters, CRUD, status toggle
- `pages/ItemDetailPage.tsx` — use proper CommitmentCard for linked commitments

**Verify:** List, filter, create, edit, delete commitments. Status toggle updates inline. Timeline cache invalidated on changes.

---

## Phase 6: Opportunities Page

**Goal:** Workspace items with type="opportunity" grouped by source.

**Create:**
- `components/opportunities/OpportunitySourceSection.tsx` — collapsible section per source
- `components/opportunities/OpportunityList.tsx` — groups items by source, known sources (Unstop, Devfolio, Devpost, Luma) shown first

**Modify:** `pages/OpportunitiesPage.tsx` — uses `useWorkspaceItems({ type: "opportunity" })`, renders grouped list

**Verify:** Opportunities appear grouped under source headings. Known sources ordered first. Cards link to detail. Empty state when no opportunities exist.

---

## Phase 7: Timeline Page

**Goal:** Timeline with category sections, summary counts, sorting, and pagination.

**Create:**
- `api/timeline.ts` — `fetchTimeline(params)`, `fetchTimelineCategory(params)`
- `hooks/use-timeline.ts` — `useTimeline`, `useTimelineCategory`
- `components/ui/Pagination.tsx` — prev/next with page indicator
- `components/timeline/TimelineSummaryBar.tsx` — 4 color-coded count cards
- `components/timeline/TimelineEntryCard.tsx` — entry display with source badge
- `components/timeline/TimelineCategorySection.tsx` — section with entries + pagination
- `components/timeline/TimelineSortToggle.tsx` — deadline vs priority toggle

**Modify:** `pages/TimelinePage.tsx` — summary bar + sort toggle + 4 category sections with per-section pagination

**Verify:** Summary counts match data. Sort toggle reorders. Pagination works per category. Empty sections show subtle empty state.

---

## Phase 8: Polish

**Goal:** Toast notifications, responsive layout, transitions, final UX.

**Create:**
- `components/ui/Toast.tsx` — color-coded auto-dismissing notification
- `components/ui/ToastProvider.tsx` — context + `useToast()` hook

**Modify:**
- `App.tsx` — wrap with ToastProvider
- All mutation hooks — add `onSuccess`/`onError` toast calls
- `AppLayout.tsx` + `TabNav.tsx` — responsive: bottom nav on mobile
- Card components — hover shadow transitions
- `Dialog.tsx` — enter/exit transitions
- List components — staggered card appear animations

**Verify:** Mutations show toast. Mobile layout adapts. Smooth hover/dialog transitions. End-to-end flow: create item → generate commitment → see it in timeline.

---

## Key Decisions

- **State management:** TanStack Query for server state, `useState` for local UI state. No Redux/Zustand needed.
- **Dark mode:** Tailwind v4 `@custom-variant dark` for class-based toggle, with OS preference as default.
- **API proxy:** Vite dev server proxies `/api` → `localhost:3001`. No CORS needed.
- **Path alias:** `@/` → `src/` in both Vite and TypeScript config.
- **Cache invalidation:** Mutations invalidate related queries across entities (e.g., deleting a workspace item invalidates both items and commitments caches).

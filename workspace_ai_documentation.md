# Workspace.ai --- Product & Implementation Documentation

> **Document status:** Living project document\
> **Last updated:** 21 October 2026\
> **Purpose:** Preserve the product idea, architecture, current
> implementation, and practical next steps for continuing Workspace.ai.

------------------------------------------------------------------------

## 1. Overview

**Workspace.ai** is a personal workspace that turns scattered
information into clear, actionable commitments and a timeline.

The core idea is to help a user keep track of useful information,
opportunities, events, and announcements without having to manually
remember every action that follows from them. A user adds or receives a
piece of information; the application can turn that information into one
or more commitments; those commitments can then appear in a timeline
with deadlines, priorities, and status.

The project is being rebuilt incrementally, with a focus on
understanding the full stack rather than generating a large application
all at once.

### Product principle

**Information → Commitments → Timeline**

-   **Information:** What the user has collected or needs to know.
-   **Commitments:** What the user may need to do because of that
    information.
-   **Timeline:** When those actions or events matter, organized so the
    user can prioritize them.

Workspace.ai should be useful as a personal productivity/workspace
product first. AI is a supporting capability, not the entire identity of
the product. Avoid making the product unnecessarily agent-heavy before
the core workflows are reliable.

------------------------------------------------------------------------

## 2. Product goals

1.  Give the user one place to organize information, opportunities,
    events, and announcements.
2.  Convert useful information into actionable commitments.
3.  Track deadlines and events in a consolidated timeline.
4.  Make priorities and statuses understandable and predictable.
5.  Keep the relationship between information, commitments, and timeline
    entries explicit.
6.  Build the application in small, testable full-stack slices.
7.  Add integrations and AI capabilities only when the core data model
    and workflows support them.

### Intended experience

A user should be able to:

1.  Create or collect a Workspace Item.
2.  Review the item and its metadata.
3.  Generate or manage commitments associated with it.
4.  Update commitment status and deadlines.
5.  See relevant commitments and events in the Timeline.
6.  Filter and sort the timeline to find what needs attention.

------------------------------------------------------------------------

## 3. Core product areas

The current UI concept includes three primary tabs:

### 3.1 Info

A place for general information and announcements that the user wants to
retain.

A Workspace Item may contain: - Title - Description - Type - Status -
Priority - Source - Optional deadline - Optional event date - Creation
and update timestamps

The item itself represents the information and its lifecycle. Its status
is not the same as whether the user has completed a resulting action.

### 3.2 Commitments

The action-oriented area of the product.

Commitments are associated with Workspace Items and represent tasks,
follow-ups, or actions arising from the information. They have their own
status and may have a deadline and priority.

Important distinction: - **Workspace Item status** describes the
information/item. - **Commitment status** describes the state of the
user's action.

For example, an opportunity can still be open as an item while the
user's commitment to apply has been completed or dismissed.

### 3.3 Opportunities

A discovery/organization area for opportunities and events. The product
concept has included sources such as: - Unstop - Devfolio - Devpost -
Luma

These are intended as useful sources/categories for opportunities, not a
requirement to implement external integrations immediately. Manual entry
and the core data flow should work before integrations are added.

### 3.4 Timeline

The Timeline brings deadlines and relevant events together so the user
can see what is upcoming, overdue, or important.

Known implementation behavior: - Supports category filtering. - Supports
summary counts. - Supports sorting by `deadline` or `priority`. -
Priority order is `urgent > high > medium > low` within each category. -
Overdue status is handled separately from priority. - Timeline entries
are categorized so related kinds of items can be viewed together.

The Timeline should preserve the distinction between a date being
overdue and an item having a high priority. An overdue item is not
automatically the same thing as an urgent item.

------------------------------------------------------------------------

## 4. Data model and domain concepts

The backend currently has separate models for Workspace Items and
Commitments. Timeline functionality is built around relevant dates and
categories from the underlying records.

### 4.1 WorkspaceItem

A Workspace Item represents information stored in the user's workspace.

Known fields and concepts:

  Field           Purpose
  --------------- ---------------------------------------------
  `title`         Short name of the information
  `description`   Details or context
  `type`          Kind of information
  `status`        Lifecycle/status of the information
  `priority`      Importance level
  `source`        Where the information came from
  `deadline`      Optional date by which action may be needed
  `eventDate`     Optional date of a related event
  `createdAt`     Creation timestamp
  `updatedAt`     Last-update timestamp

Known enum values:

-   **Priority:** `urgent`, `high`, `medium`, `low`
-   **Status:** `open`, `closed`, `upcoming`, `active`, `expired`
-   **Type:** `information`, `opportunity`, `event`, `announcement`

The precise validation rules for combinations of fields should live in
the schema/validation layer, not be assumed from the UI alone.

### 4.2 Commitment

A Commitment represents an action associated with a Workspace Item.

Known implementation concepts: - A separate Mongoose model exists. -
Commitments are associated with Workspace Items. - The backend has a
commitment-generation service. - Commitment priority can be
calculated. - Updates can be synchronized where required. - Commitment
deadlines are used by Timeline functionality.

The exact complete Commitment schema should be documented from the
current model file when it changes; do not assume fields that have not
been verified in code.

### 4.3 Timeline entry

The Timeline is a view/API concept that organizes relevant records by
category and date/priority. It does not necessarily need to be a
separate persisted MongoDB model if its entries can be derived reliably
from Workspace Items and Commitments.

Known behavior includes category filters, summary counts, deadline
sorting, and priority sorting. Pagination is a planned improvement, not
confirmed as completed in the current project notes.

### 4.4 Relationships

Conceptually:

``` text
WorkspaceItem
    |
    | one item can lead to one or more actions
    v
Commitment(s)
    |
    | deadlines and priorities inform the user's action timeline
    v
Timeline view / API
```

A commitment should retain enough information to identify the Workspace
Item it belongs to. When generating, updating, or deleting related data,
ensure the relationship remains valid and avoid accidentally creating
duplicates.

------------------------------------------------------------------------

## 5. Technology stack

### Frontend

-   React
-   Vite
-   TypeScript
-   React Router
-   TanStack Query
-   CSS / CSS Modules
-   Lucide icons
-   `react-markdown` where Markdown rendering is needed

### Backend

-   Node.js
-   TypeScript
-   Express
-   Zod for request validation

### Database and data access

-   MongoDB
-   Mongoose

The project has used MongoDB Atlas, with MongoDB Compass used to inspect
and work with the same cloud database. A local MongoDB connection was
also attempted during development, which created uncertainty about
whether the database contained the expected records.

**Database rule:** the MongoDB URI in the backend `.env` determines
which server/cluster and database the application uses. Compass and the
backend must point to the intended database if they are expected to show
the same records. A URI alone does not automatically import previous
Atlas data into a local database.

### Authentication and AI / future capabilities

The broader architecture plan has included: - Google OAuth - Gemini API

These should be treated as planned/broader-stack items unless the
current repository confirms that the relevant flows are implemented and
tested.

### Deferred integrations and infrastructure

The following were considered for later, when they solve a concrete
product need: - Redis / BullMQ - Gmail API - Google Calendar API - Web
Push - Socket.IO - AWS

**AWS is postponed.** Do not introduce cloud infrastructure just to make
the current core workflows work.

------------------------------------------------------------------------

## 6. Backend architecture

The backend follows a conventional Express application structure with
distinct responsibilities:

-   **Routes:** define endpoint paths and connect
    middleware/controllers.
-   **Validation middleware:** validate incoming request data using Zod
    schemas.
-   **Controllers:** handle HTTP request/response behavior.
-   **Models:** define MongoDB document structure through Mongoose.
-   **Services:** contain reusable business logic such as commitment
    generation.
-   **Configuration:** load environment variables and database
    connection settings.

A representative structure (adapt it to the actual repository rather
than moving files solely to match this example):

``` text
server/
  src/
    config/
    controllers/
      workspaceItemController.ts
      commitmentController.ts
      timelineController.ts
    middleware/
      validate.ts
    models/
      WorkspaceItem.ts
      Commitment.ts
    routes/
      workspaceItemRoutes.ts
      commitmentRoutes.ts
      timelineRoutes.ts
    schemas/
    services/
      commitmentGenerationService.ts
    app.ts
    server.ts
  .env
  package.json
```

The current project uses TypeScript/ES module imports in the backend,
including imports with `.js` extensions in source files where required
by its TypeScript configuration.

### Request validation

A reusable validation middleware has been implemented with a shape
equivalent to:

``` ts
validate(schema, location)
```

The location identifies which request section is being validated, such
as body, params, or query.

The update schema for Workspace Items is based on the create schema:

``` ts
updateWorkspaceItemSchema = createWorkspaceItemSchema.partial()
```

This permits partial updates: a client can send only the fields it wants
to change. The route/controller should still validate identifiers and
handle missing records properly.

A prior fix ensured invalid ID parameters such as `/hello` return a
**400 Bad Request** rather than allowing a malformed ID to become an
unhelpful server error.

### Error-handling expectations

-   `400 Bad Request`: invalid request data, invalid identifiers, or
    validation failures.
-   `404 Not Found`: a syntactically valid identifier or requested
    resource does not match an existing resource/route.
-   `500 Internal Server Error`: unexpected server/database failures.

Use consistent JSON error responses. Avoid exposing secrets or raw
internal stack traces to clients; detailed errors can be logged on the
server.

------------------------------------------------------------------------

## 7. Implemented work and current state

The following reflects the latest project notes available on **21
October 2026**. Verify the repository before treating every item as the
exact current code state.

### 7.1 Workspace Items

-   Mongoose schema/model created.
-   `GET /api/health` was implemented and tested.
-   `POST /api/workspace-items` was implemented and tested.
-   Workspace Item retrieval/listing has been worked on.
-   A test Workspace Item was created while setting up the database.
-   Request validation and partial update schema patterns are in place.

### 7.2 Commitments

-   A Commitment model exists.
-   Commitment controller functionality has been built incrementally.
-   A `getCommitments` controller retrieves commitments.
-   A commitment-generation service exists.
-   Priority calculation has been implemented.
-   Update/synchronization logic has been worked on.
-   The user confirmed that the application was successfully returning
    commitments, including the case where all commitments were returned
    without filtering.
-   A previous issue was that there was no commitment associated with a
    particular Workspace Item; this was investigated and the workflow
    later progressed.

Potential controller imports seen in the implementation include:

``` ts
import { Commitment } from "../models/Commitment.js";
import { WorkspaceItem } from "../models/WorkspaceItem.js";
import { generateCommitment } from "../services/commitmentGenerationService.js";
```

This is contextual, not a substitute for reading the current source
file.

### 7.3 Timeline

-   Timeline controller has been created.
-   Timeline API now works with category filtering.
-   Summary counts are supported.
-   Sorting by `deadline` and `priority` is supported.
-   Priority order is `urgent > high > medium > low` within a category.
-   Overdue status is treated separately from priority.
-   A sample Timeline JSON payload was used during testing.
-   A previous `404 Not Found` occurred while testing a sample Timeline
    payload because the corresponding create route/controller had not
    yet been implemented.
-   The user then created the Timeline controller and continued testing.

**Next planned Timeline task:** implement pagination with `page` and
`limit`, return pagination metadata, and preserve existing category
filtering, summary counts, and sorting behavior.

### 7.4 Database configuration

The project has used MongoDB Atlas and MongoDB Compass. A local MongoDB
URI was later tried without a deliberate data migration/import step.
This means data visible in one database may not exist in the other.

Before debugging missing records, confirm: 1. Which URI the backend is
currently loading. 2. Which database name is selected in that URI. 3.
Which connection Compass is using. 4. Whether the expected records exist
in that same database. 5. Whether the server restarted after `.env`
changes.

Do not assume a database is empty or broken until these checks are done.

------------------------------------------------------------------------

## 8. API design and expected workflows

Endpoint names below are representative of the existing implementation
and project direction. Confirm exact route prefixes and methods in the
route files before relying on them.

### Workspace Items

  -----------------------------------------------------------------------
  Operation                           Purpose
  ----------------------------------- -----------------------------------
  Health check                        Verify the server is responding

  Create Workspace Item               Validate and save an item

  List/get Workspace Items            Retrieve stored information

  Update Workspace Item               Apply a partial update

  Delete Workspace Item               Remove an item, with a defined
                                      related-data policy
  -----------------------------------------------------------------------

Known paths include: - `GET /api/health` - `POST /api/workspace-items`

### Commitments

  -----------------------------------------------------------------------
  Operation                           Purpose
  ----------------------------------- -----------------------------------
  Get commitments                     Return stored commitments

  Generate commitments                Derive candidate actions from a
                                      Workspace Item

  Update commitment                   Change action details or status

  Synchronize updates                 Keep relevant derived data
                                      consistent
  -----------------------------------------------------------------------

The exact HTTP methods and route paths must be checked in the current
route definitions.

### Timeline

The Timeline API should support: - Category filtering - Summary counts -
Sorting by deadline - Sorting by priority - Pagination (`page`, `limit`)
as the next planned addition

A useful paginated response should include: - The current page's
entries - Current page number - Page size - Total matching entries -
Total pages (or equivalent metadata)

Filtering and sorting should be applied consistently so pagination is
performed over the filtered/sorted result set, not on arbitrary unsorted
data.

------------------------------------------------------------------------

## 9. Suggested end-to-end implementation flow

Use a vertical-slice approach. Each slice should be understood,
implemented, tested, and explained before moving on.

### Slice A --- Workspace Item CRUD

1.  Define the data model and validation schema.
2.  Create routes and controller handlers.
3.  Add request validation middleware.
4.  Test create/list/get/update/delete behavior.
5.  Test invalid payloads and invalid IDs.
6.  Confirm the record appears in the intended MongoDB database.

**Completion criterion:** the user can create and manage information
without manually editing the database.

### Slice B --- Commitment generation

1.  Define what qualifies as a commitment.
2.  Implement the generation service.
3.  Connect the service to the relevant controller/route.
4.  Associate generated commitments with their source Workspace Item.
5.  Prevent accidental duplicate generation where appropriate.
6.  Test items that should generate actions and items that should not.
7.  Return useful errors for missing source items.

**Completion criterion:** a valid Workspace Item can produce commitments
that are saved and traceable to their source.

### Slice C --- Commitment management

1.  List commitments.
2.  Add filtering by source item or status where needed.
3.  Update commitment fields/status.
4.  Validate IDs and partial-update payloads.
5.  Ensure updates persist.
6.  Define how deleting or closing a source Workspace Item affects its
    commitments.

**Completion criterion:** the user can manage actions independently of
the information item's status.

### Slice D --- Timeline

1.  Decide which records become Timeline entries.
2.  Define how a record's date is chosen when it has a deadline and/or
    event date.
3.  Categorize entries consistently.
4.  Implement category filtering.
5.  Implement summary counts.
6.  Implement deadline and priority sorting.
7.  Add pagination and metadata.
8.  Test empty results, invalid filters, missing dates, overdue dates,
    and equal sort values.

**Completion criterion:** the Timeline is a reliable view of the user's
upcoming and outstanding actions/events.

### Slice E --- Frontend integration

1.  Create the page/tab structure.
2.  Connect API calls to TanStack Query.
3.  Show loading, empty, success, and error states.
4.  Invalidate or refresh relevant queries after mutations.
5.  Add forms and edit controls with client-side feedback.
6.  Keep the interface focused and uncluttered.

**Completion criterion:** the user can complete the core flow through
the UI without using an API client.

### Slice F --- AI and external integrations

Only after the core product is dependable: 1. Improve commitment
generation and make outputs reviewable. 2. Add Gemini integration if it
serves a clearly defined workflow. 3. Consider Google OAuth if accounts
are needed. 4. Consider Gmail/Calendar integrations only with a clear
permission and data model. 5. Add queues, notifications, or real-time
updates only when the product requires them.

**Completion criterion:** integrations improve a working product instead
of compensating for incomplete core functionality.

------------------------------------------------------------------------

## 10. Testing checklist

### Workspace Items

-   Valid item can be created.
-   Required fields are enforced.
-   Enum values are validated.
-   Optional date fields can be omitted.
-   Partial update changes only supplied fields.
-   Invalid ObjectId returns 400.
-   Valid but nonexistent resource returns 404.
-   Database errors are handled without crashing the server.

### Commitments

-   Commitment can be associated with a valid Workspace Item.
-   Missing source item is handled.
-   Generation produces the expected structure.
-   Re-running generation does not silently create unwanted duplicates.
-   Priority calculation follows the defined rules.
-   Updating a commitment persists correctly.
-   Commitment status is not confused with Workspace Item status.

### Timeline

-   Category filter returns only matching entries.
-   Summary counts match the defined population.
-   Deadline sorting behaves consistently.
-   Priority sorting uses `urgent > high > medium > low`.
-   Overdue is independent of priority.
-   Missing dates do not crash sorting.
-   Empty results return a valid response.
-   Pagination metadata matches the filtered result set.
-   Page boundaries and invalid `page`/`limit` values are handled.

### Database and configuration

-   Backend `.env` points to the intended database.
-   Compass connects to the same database when verifying backend writes.
-   No secrets are committed to Git.
-   `.env.example` documents required environment variables without real
    credentials.

------------------------------------------------------------------------

## 11. Important design decisions and guardrails

1.  **Keep information status and action status separate.** They
    describe different things.
2.  **Keep priorities explicit.** The priority order is
    `urgent > high > medium > low`.
3.  **Treat overdue as a time condition, not a priority level.**
4.  **Keep business logic out of route files.** Use services for
    reusable generation and calculation logic.
5.  **Validate at the API boundary.** Do not rely exclusively on
    frontend form validation.
6.  **Make generated actions reviewable.** AI-generated commitments
    should not silently become authoritative user obligations.
7.  **Keep source relationships traceable.** A commitment should be
    linked to the Workspace Item that produced it.
8.  **Do not overbuild infrastructure.** AWS, queues, real-time systems,
    and integrations can wait until the core workflow needs them.
9.  **Use one database intentionally.** Switching a connection URI
    changes the database being used; it does not migrate records.
10. **Build in small slices.** Understand → Build → Test → Explain.

------------------------------------------------------------------------

## 12. Security and reliability considerations

-   Keep database URIs, OAuth secrets, and AI API keys in environment
    variables.
-   Add `.env` to `.gitignore`; use placeholders in `.env.example`.
-   Validate request bodies, query parameters, and route parameters.
-   Avoid returning sensitive implementation details in production
    errors.
-   Apply authentication/authorization before exposing private user data
    in a multi-user deployment.
-   Ensure every query is scoped to the authenticated user once user
    accounts are implemented.
-   If Google OAuth is added, define account identity and session/token
    handling carefully.
-   If Gmail or Calendar integrations are added, request only the
    permissions needed and provide a clear disconnect/revocation path.
-   Make commitment generation resilient to malformed AI output and
    transient API failures.
-   Keep AI-generated results distinguishable from user-confirmed data
    where appropriate.

------------------------------------------------------------------------

## 13. Open questions to resolve during implementation

These are product/engineering questions, not assumptions about already
implemented behavior.

1.  **Commitment generation:** Is generation manual, automatic on item
    creation, or both?
2.  **Duplicate handling:** What should happen if generation is run
    twice for the same item?
3.  **Timeline source:** Which combination of Workspace Items and
    Commitments should appear in the Timeline?
4.  **Date precedence:** If an item has both `deadline` and `eventDate`,
    how should each appear?
5.  **Deletion policy:** Should deleting an item delete its commitments,
    archive them, or block deletion?
6.  **User ownership:** What fields and query scoping are required for
    multi-user accounts?
7.  **Opportunity ingestion:** Will external sources be manually entered
    first, imported, or connected through APIs later?
8.  **AI review:** Should generated commitments require user approval
    before saving?
9.  **Status transitions:** Which transitions are valid for each
    Workspace Item type?
10. **Notifications:** Are reminders needed now, or only after the
    Timeline experience is stable?

Resolve these explicitly rather than allowing behavior to emerge
accidentally from controller code.

------------------------------------------------------------------------

## 14. Recommended immediate next steps

Based on the latest known project state:

1.  **Finish Timeline pagination** using `page` and `limit`, with clear
    metadata.
2.  **Regression-test Timeline behavior** so category filters, summary
    counts, sorting, and overdue handling still work.
3.  **Verify the current database connection** and ensure the backend
    and Compass are looking at the same intended database.
4.  **Review the commitment flow end to end:** create Workspace Item →
    generate commitment → retrieve/update commitment → see it in
    Timeline.
5.  **Test error cases** for invalid IDs, missing records, invalid enum
    values, and malformed request payloads.
6.  **Connect the frontend to the stable APIs** and implement
    loading/empty/error states.
7.  **Document the exact current API routes** from the route files once
    the implementation is stable.

After each step, explain what the code does, test it, and only then
continue. The goal is a working product that you understand and can
extend confidently.

------------------------------------------------------------------------

## 15. Learning and collaboration workflow

The intended learning style for this project is not to paste a large
codebase and hope it works. Work feature by feature.

For each small task:

1.  **Understand:** clarify the purpose, data flow, and files involved.
2.  **Plan:** identify the smallest useful change.
3.  **Build:** implement that change.
4.  **Test:** use an API client or the frontend to check expected and
    failure cases.
5.  **Explain:** summarize what changed, why it works, and what to watch
    for.
6.  **Commit:** make a focused Git commit once the slice is working.

When debugging, inspect the relevant route, controller, service, model,
validation schema, environment configuration, and actual database record
before guessing.

------------------------------------------------------------------------

## 16. Short project summary

Workspace.ai is a React/TypeScript and Express/TypeScript application
backed by MongoDB/Mongoose. It organizes information into Workspace
Items, turns that information into actionable Commitments, and presents
relevant deadlines and events through a categorized Timeline. The
backend already includes core models and controller/service work for
Workspace Items, Commitments, priority calculation, update
synchronization, and Timeline filtering/counts/sorting. The next known
task is Timeline pagination, followed by end-to-end regression testing
and frontend integration. AI and third-party integrations are part of
the broader direction, but reliability of the core workflow comes first.

------------------------------------------------------------------------

## 17. Repository verification note

This document consolidates project context remembered from earlier
conversations. It is intended as a useful project handoff and planning
document, **not a claim that every planned feature is already
implemented**. Before changing architecture or assuming an endpoint
exists, verify the current repository's: - `package.json` files and
TypeScript configuration - Express app and route registrations -
Controllers and services - Mongoose models - Zod schemas and validation
middleware - `.env` database URI and database name - Frontend routes,
query hooks, and API client

Update this document as implementation decisions change.

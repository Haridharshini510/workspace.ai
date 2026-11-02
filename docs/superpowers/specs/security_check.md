# Security Implementation Checklist

**Last Updated**: November 2, 2026  
**Status**: Pre-Production Security Hardening - **~17% Complete**

---

## ✅ Already Implemented (Foundation Exists)

The codebase has a solid security foundation:

1. **Authentication & Authorization**
   - ✅ JWT-based auth middleware (`requireAuth`) applied to all protected routes
   - ✅ JWT tokens have 7-day expiry configured
   - ✅ userId extracted from token and attached to request

2. **Ownership Checks (IDOR Prevention)**
   - ✅ All controllers filter queries by `userId: req.userId`
   - ✅ WorkspaceItem queries: `{ _id: id, userId: req.userId }`
   - ✅ Commitment queries: `{ _id: id, userId: req.userId }`
   - ✅ Prevents users from accessing other users' data

3. **Input Validation (Partial)**
   - ✅ Zod validation middleware exists (`validate.ts`)
   - ✅ Schemas for body validation: `createWorkspaceItemSchema`, `updateWorkspaceItemSchema`, `createCommitmentSchema`, `updateCommitmentSchema`
   - ✅ Params validation: `workspaceItemIdSchema`, `commitmentIdSchema`
   - ✅ Query validation: `timelineQuerySchema`
   - ✅ Applied to most POST/PATCH routes

4. **Database Operations**
   - ✅ `findOneAndUpdate` pattern used in update operations
   - ✅ Unique constraints on User model (googleId, email)

---

## ❌ Critical Gaps (Must Implement Before Production)

1. **Race Condition Prevention**
   - ❌ No unique compound indexes on WorkspaceItem
   - ❌ No SyncLock model or middleware
   - ❌ Concurrent syncs can create duplicates

2. **Input Sanitization**
   - ❌ No sanitization for LLM inputs (prompt injection risk)
   - ❌ Email subjects/bodies sent directly to LLM

3. **Query Parameter Validation**
   - ❌ Missing schemas for GET route filters (type, status, priority)
   - ❌ Unvalidated query params in workspaceItems, commitments

4. **Rate Limiting**
   - ❌ No rate limiting middleware
   - ❌ express-rate-limit not installed
   - ❌ Vulnerable to DoS

5. **Database Performance**
   - ❌ No indexes defined (all queries do COLLSCAN)
   - ❌ Timeline queries will be slow with real data

6. **Security Headers**
   - ❌ helmet not installed
   - ❌ No CSP, HSTS, frame guard, XSS protection

7. **Error Handling & Resilience**
   - ❌ No retry logic for external APIs (Gmail, Calendar, LLM)
   - ❌ No request timeouts
   - ❌ Console.log instead of structured logging

8. **Dependency Security**
   - ❌ No package-lock.json in server/
   - ❌ npm audit cannot run

---

## Quick Reference

**Total Work**: 25-33 hours  
**Critical (Must Do)**: 15-20 hours  
**High Priority (Should Do)**: 10-13 hours  
**Deferred**: Post-MVP

---

## Phase 1: Critical Security (BLOCKS PRODUCTION)

### ✅ Task 1.1: Race Condition Prevention (4-6 hours)
- [ ] Add unique compound indexes to WorkspaceItem model
  - [ ] `{ userId: 1, sourceEmails: 1, unique: true }`
  - [ ] `{ userId: 1, sourceCalendarEventId: 1, unique: true }`
- [x] Replace find-then-create with `findOneAndUpdate` upsert pattern (✅ Already used in controllers)
- [ ] Create SyncLock model with TTL expiration
- [ ] Add sync lock middleware to gmail/calendar controllers
- [ ] Test concurrent sync requests (should return 409)

### ✅ Task 1.2: Enhanced Validation (3-4 hours)
- [ ] Create Zod schemas for query parameters
  - [ ] `workspaceItemQuerySchema` (⚠️ Partial - need validation for type/status/priority filters)
  - [ ] `commitmentQuerySchema` (⚠️ Partial - need validation for filters)
  - [x] `timelineQuerySchema` (✅ Already exists)
  - [ ] `syncQuerySchema`
- [x] Apply validation middleware to all GET routes (✅ Applied to timeline, need for others)
- [ ] Create `sanitization.ts` utility
  - [ ] `sanitizeForLLM()` function
  - [ ] `wrapUserContent()` function
- [ ] Update `emailClassificationService` to sanitize inputs
- [ ] Add Zod output validation for LLM responses
- [ ] Test with malicious email subjects

### ✅ Task 1.3: Authorization Hardening (2-3 hours)
- [ ] Create `ownership.ts` middleware (⚠️ **Currently embedded in controllers**)
  - [ ] `verifyWorkspaceItemOwnership()` function
  - [ ] `verifyCommitmentOwnership()` function
- [x] Apply ownership checks to routes (✅ All controllers check `userId: req.userId` in queries)
  - [x] Commitment creation route (✅ Checks workspaceItem ownership)
  - [x] Commitment update/delete routes (✅ Filters by userId)
  - [x] Workspace item routes (✅ All queries filter by userId)
- [x] Controllers filter by userId (✅ IDOR protection implemented inline)
- [ ] Write IDOR test cases
- [ ] Test cross-user access attempts (should return 404)

### ✅ Task 1.4: Prompt Injection Prevention
- [ ] (Covered in Task 1.2 - validation)

### ✅ Task 1.5: Rate Limiting (2-3 hours)
- [ ] Install `express-rate-limit`
  ```bash
  cd server && npm install express-rate-limit
  ```
- [ ] Create `rateLimiter.ts` middleware
  - [ ] `generalLimiter` (100 req/15min)
  - [ ] `authLimiter` (5 req/15min)
  - [ ] `syncLimiter` (10 req/hour per user)
  - [ ] `writeLimiter` (30 req/min per user)
- [ ] Apply rate limiters in `index.ts`
- [ ] Test rate limits (should return 429)
- [ ] Update frontend to handle 429 responses

### ✅ Task 1.6: Database Indexing (2-3 hours)
- [ ] Add indexes to User model (already done via unique fields)
- [ ] Add indexes to WorkspaceItem model
  - [ ] `{ userId: 1, createdAt: -1 }`
  - [ ] `{ userId: 1, type: 1 }`
  - [ ] `{ userId: 1, deadline: 1 }`
  - [ ] `{ userId: 1, priority: 1 }`
  - [ ] `{ userId: 1, sourceEmails: 1 }`
  - [ ] `{ userId: 1, threadIds: 1 }`
  - [ ] `{ userId: 1, sourceCalendarEventId: 1 }` (sparse)
  - [ ] `{ userId: 1, hiddenFromTimeline: 1, deadline: 1 }`
  - [ ] `{ userId: 1, status: 1, deadline: 1 }`
- [ ] Add indexes to Commitment model
  - [ ] `{ userId: 1, createdAt: -1 }`
  - [ ] `{ userId: 1, status: 1 }`
  - [ ] `{ userId: 1, priority: 1 }`
  - [ ] `{ userId: 1, deadline: 1 }`
  - [ ] `{ userId: 1, hiddenFromTimeline: 1, deadline: 1 }`
  - [ ] `{ workspaceItemId: 1 }`
  - [ ] `{ userId: 1, status: 1, deadline: 1 }`
- [ ] Create `createIndexes.ts` migration script
- [ ] Run index creation: `node dist/scripts/createIndexes.js`
- [ ] Verify indexes with `.explain("executionStats")`

### ✅ Task 1.7: Security Headers (1 hour)
- [ ] Install `helmet`
  ```bash
  cd server && npm install helmet
  ```
- [ ] Create `securityHeaders.ts` middleware
- [ ] Configure CSP, HSTS, frame guard, XSS protection
- [ ] Apply helmet middleware FIRST in `index.ts`
- [ ] Test with `curl -I` to verify headers present

### ✅ Task 1.8: Dependency Audit (1 hour)
- [ ] Create package-lock.json (⚠️ **REQUIRED FIRST** - run `npm i --package-lock-only` in server/)
- [ ] Run `npm audit` in server/
- [ ] Run `npm audit` in client/
- [ ] Fix with `npm audit fix`
- [ ] If high/critical remain, run `npm audit fix --force`
- [ ] Review and test after forced updates
- [ ] Add `npm audit` to CI/CD pipeline
- [ ] Set up Dependabot/Renovate for automated updates

---

## Phase 2: High Priority Hardening

### ✅ Task 2.1: Retry Logic with Exponential Backoff (2-3 hours)
- [ ] Install `p-retry`
  ```bash
  cd server && npm install p-retry
  ```
- [ ] Create `retry.ts` utility with `withRetry()` function
- [ ] Apply retry to `fetchRecentEmails()` in gmailService
- [ ] Apply retry to `fetchUpcomingEvents()` in calendarService
- [ ] Apply retry to LLM API calls in llmService
- [ ] Configure retry options (3 retries, exponential backoff)
- [ ] Test with simulated API failures

### ✅ Task 2.2: Request Timeouts (2 hours)
- [ ] Install `connect-timeout`
  ```bash
  cd server && npm install connect-timeout
  ```
- [ ] Add global timeout middleware (5 minutes)
- [ ] Add per-route timeouts for expensive operations
- [ ] Use `AbortSignal.timeout()` for fetch calls
- [ ] Test timeout behavior

### ✅ Task 2.3: Session Management (1 hour)
- [x] Update JWT signing to include explicit `expiresIn: "7d"` (✅ Already configured in authController)
- [ ] Add `issuer` and `audience` to JWT options
- [ ] Return `expiresAt` timestamp in login response
- [ ] Create `isTokenExpired()` function in frontend
- [ ] Update `getToken()` to check expiration
- [ ] Test token expiration behavior

### ✅ Task 2.4: Structured Logging (2-3 hours)
- [ ] Install `winston`
  ```bash
  cd server && npm install winston
  ```
- [ ] Create `logger.ts` with Winston configuration
- [ ] Replace all `console.log` with `logger.info`
- [ ] Replace all `console.error` with `logger.error`
- [ ] Create `requestLogger` middleware
- [ ] Apply request logger to app
- [ ] Create `logs/` directory
- [ ] Add `logs/` to `.gitignore`
- [ ] Verify structured JSON logs

### ✅ Task 2.5: Enhanced Validation (Duplicate - covered in 1.2)

---

## Phase 3: Post-MVP (DEFERRED)

### ⏸️ Task 3.1: Error Monitoring
- [ ] Sign up for Sentry or similar
- [ ] Install `@sentry/node` and `@sentry/react`
- [ ] Configure Sentry DSN
- [ ] Add error boundary in React
- [ ] Test error reporting

### ⏸️ Task 3.2: Load Testing
- [ ] Install `artillery` or `k6`
- [ ] Create load test scenarios
  - [ ] Gmail sync under load
  - [ ] Calendar sync under load
  - [ ] Timeline query under load
- [ ] Run tests and analyze results
- [ ] Optimize bottlenecks

### ⏸️ Task 3.3: Query Optimization
- [ ] Profile slow queries with MongoDB Atlas
- [ ] Add `.lean()` to read-only queries
- [ ] Use projection to limit fields returned
- [ ] Batch operations where possible

---

## Verification Tests

### Security Tests
- [ ] **IDOR**: User A cannot access User B's items
- [ ] **Race Condition**: Concurrent syncs don't create duplicates
- [ ] **Rate Limiting**: Exceeding limit returns 429
- [ ] **Prompt Injection**: Malicious emails are sanitized
- [ ] **Auth Bypass**: Missing/invalid token returns 401
- [ ] **Validation**: Invalid input returns 400 with details

### Performance Tests
- [ ] **Index Usage**: All queries use indexes (no COLLSCAN)
- [ ] **Response Time**: Timeline query < 100ms
- [ ] **Retry Logic**: Failed API calls are retried
- [ ] **Timeout**: Long-running requests timeout correctly

### Headers Check
```bash
curl -I http://localhost:3001/api/health | grep -E "X-Frame-Options|X-Content-Type|Strict-Transport"
```
Should see:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Strict-Transport-Security: max-age=31536000`

---

## Quick Start Commands

### Setup
```bash
# Server dependencies
cd server
npm install express-rate-limit helmet p-retry winston connect-timeout

# Run index migration
npm run build
node dist/scripts/createIndexes.js

# Audit dependencies
npm audit
npm audit fix
```

### Testing
```bash
# Test race conditions
./scripts/test-race-condition.sh

# Test rate limiting
for i in {1..150}; do curl http://localhost:3001/api/health; done

# Check security headers
curl -I http://localhost:3001/api/health

# Verify indexes
mongo myworkspace-ai --eval "db.workspaceitems.getIndexes()"
```

---

## Production Deployment Checklist

Before deploying to production, ensure:

- [ ] ✅ All Phase 1 tasks complete
- [ ] ✅ All Phase 2 tasks complete
- [ ] ✅ Security tests passing
- [ ] ✅ Dependencies audited (no high/critical vulnerabilities)
- [ ] ✅ Environment variables set in production
  - [ ] `JWT_SECRET` (strong, unique)
  - [ ] `SESSION_SECRET` (strong, unique)
  - [ ] `MONGODB_URI` (production database)
  - [ ] `GOOGLE_CLIENT_ID`
  - [ ] `GOOGLE_CLIENT_SECRET`
  - [ ] `OPENROUTER_API_KEY`
  - [ ] `FRONTEND_URL` (production URL)
  - [ ] `BACKEND_URL` (production API URL)
- [ ] ✅ HTTPS enabled (TLS certificate)
- [ ] ✅ Database backups configured
- [ ] ✅ Monitoring/alerting set up (optional but recommended)

---

## Progress Tracking

**Phase 1**: ~2/8 tasks complete (~25% - partial implementation of validation & authorization)  
**Phase 2**: 0/4 tasks complete (0%)  
**Overall**: ~2/12 tasks complete (~17%)

**Key Accomplishments:**
- ✅ Auth middleware implemented and applied
- ✅ Zod validation middleware exists and partially applied
- ✅ Ownership checks implemented inline in all controllers
- ✅ Body/params validation schemas created
- ⚠️ findOneAndUpdate pattern used but not consistently
- ⚠️ Query parameter validation incomplete

**Critical Gaps:**
- ❌ No race condition prevention (no sync locks, no unique compound indexes)
- ❌ No LLM input sanitization
- ❌ No rate limiting
- ❌ No database indexes
- ❌ No security headers (helmet)
- ❌ No retry logic
- ❌ No structured logging
- ❌ Security packages not installed

**Estimated Completion**: [Add date after starting]

---

## 📝 Assessment Summary (Nov 2, 2026)

**Codebase Review Completed**: Verified existing implementation against security checklist.

**Strong Foundation:**
- Authentication and authorization architecture is solid
- Ownership checks prevent IDOR attacks
- Input validation framework (Zod) is in place and partially applied
- JWT configuration is correct with proper expiry

**Ready to Implement:**
The infrastructure is ready to add the missing security layers. The validation middleware pattern is established, so adding rate limiting, security headers, and sanitization will follow the same pattern. The main effort is in:
1. Adding database indexes (straightforward, just need to define them)
2. Creating the SyncLock model and middleware (prevents race conditions)
3. Installing and configuring security packages (helmet, express-rate-limit, p-retry, winston)
4. Building the sanitization utility for LLM inputs

**Estimated Effort to Production-Ready:**
- Phase 1 (Critical): 15-20 hours (as originally estimated)
- Phase 2 (High Priority): 10-13 hours (as originally estimated)
- **Total**: 25-33 hours of focused implementation work

The codebase quality is high, which will make implementing these security measures straightforward.

# Security Implementation Checklist

**Last Updated**: October 28, 2026  
**Status**: Pre-Production Security Hardening

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
- [ ] Replace find-then-create with `findOneAndUpdate` upsert pattern
- [ ] Create SyncLock model with TTL expiration
- [ ] Add sync lock middleware to gmail/calendar controllers
- [ ] Test concurrent sync requests (should return 409)

### ✅ Task 1.2: Enhanced Validation (3-4 hours)
- [ ] Create Zod schemas for query parameters
  - [ ] `workspaceItemQuerySchema`
  - [ ] `commitmentQuerySchema`
  - [ ] `timelineQuerySchema`
  - [ ] `syncQuerySchema`
- [ ] Apply validation middleware to all GET routes
- [ ] Create `sanitization.ts` utility
  - [ ] `sanitizeForLLM()` function
  - [ ] `wrapUserContent()` function
- [ ] Update `emailClassificationService` to sanitize inputs
- [ ] Add Zod output validation for LLM responses
- [ ] Test with malicious email subjects

### ✅ Task 1.3: Authorization Hardening (2-3 hours)
- [ ] Create `ownership.ts` middleware
  - [ ] `verifyWorkspaceItemOwnership()` function
  - [ ] `verifyCommitmentOwnership()` function
- [ ] Apply ownership middleware to routes
  - [ ] Commitment creation route
  - [ ] Commitment update/delete routes
  - [ ] Workspace item routes
- [ ] Update controllers to use pre-verified resources
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
- [ ] Update JWT signing to include explicit `expiresIn: "7d"`
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

**Phase 1**: 0/8 tasks complete (0%)  
**Phase 2**: 0/4 tasks complete (0%)  
**Overall**: 0/12 tasks complete (0%)

**Estimated Completion**: [Add date after starting]

---

## Notes

- Focus on Phase 1 first - these are **blocking issues**
- Phase 2 improves resilience but isn't strictly required for MVP launch
- Phase 3 can be done post-launch based on real usage patterns

---

## Resources

- [Full Security Audit](./Security-Performance-Audit.md)
- [Detailed Implementation Guide](./Security-Implementation-Guide.md)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)

---

*Last Updated: October 28, 2026*

# Project TODO & Implementation Tracker: GenricMed

## Phase 1: AI Context System
- [x] Create `docs/CONTEXT.md`
- [x] Create `docs/REQUIREMENTS.md`
- [x] Create `docs/ARCHITECTURE.md`
- [x] Create `docs/API_CONTRACT.md`
- [x] Create `docs/DATABASE.md`
- [x] Create `docs/DECISIONS.md`
- [x] Create `docs/BUSINESS_RULES.md`
- [x] Create `docs/SECURITY.md`
- [x] Create `docs/ERROR_HANDLING.md`
- [x] Create `docs/VALIDATION.md`
- [x] Create `docs/TESTING.md`
- [x] Create `docs/DEPLOYMENT.md`
- [x] Create `docs/CHANGELOG.md`
- [x] Create `docs/TODO.md`
- [x] Create `phases.md`

## Phase 2: Project Scaffold & Infrastructure
- [x] Initialize `backend/package.json` with required dependencies
- [x] Create `backend/.env.example` and `.gitignore`
- [x] Implement `backend/src/config/env.js`, `database.js`, `logger.js`
- [x] Implement `backend/src/middlewares/errorHandler.js`, `validate.js`, `rateLimiter.js`
- [x] Implement `backend/src/app.js` and `backend/src/server.js`
- [x] Verify `GET /api/v1/health`

## Phase 3: Data Models & Multi-Tenant RLS
- [x] Implement database connection and schema initialization
- [x] Implement multi-tenant RLS engine (PostgreSQL + SQLite/memory adapter)
- [x] Implement seed data matching the AI Studio frontend (Medicines, Sellers, Orders, Inventory, Audit Logs)

## Phase 4: Authentication & Role Governance
- [x] Implement `auth.service.js` (JWT, bcrypt password hashing, phone OTP, passkey)
- [x] Implement `auth.controller.js` and `auth.routes.js`
- [x] Implement `auth.middleware.js` and `rbac.middleware.js`

## Phase 5: Catalog & Bioequivalent Engine
- [x] Implement `medicine.service.js` (AB-rated lookup, savings calculation, salt parity)
- [x] Implement multi-seller inventory aggregation with dynamic pricing and geofencing
- [x] Implement `medicine.controller.js` and `medicine.routes.js`

## Phase 6: Prescriptions & Clinical Safety
- [ ] Implement `prescription.service.js` (Rx ingestion, OCR simulation, DDI checks)
- [ ] Enforce 4,000mg daily APAP ceiling rule
- [ ] Implement `prescription.controller.js` and `prescription.routes.js`

## Phase 7: Orders & Gatekeeper Custody
- [ ] Implement `order.service.js` (geofenced pharmacy routing, 4-digit PIN generation)
- [ ] Implement `verify-pin` doorstep handover with 3-attempt lockout
- [ ] Implement `order.controller.js` and `order.routes.js`

## Phase 8: Pharmacy Partner Dispensing Desk
- [ ] Implement `pharmacy.service.js` (queue triage, 5-point checklist, near-expiry quarantine)
- [ ] Enforce strict tenant RLS isolation
- [ ] Implement `pharmacy.controller.js` and `pharmacy.routes.js`

## Phase 9: TrustOps Governance & Merkle Ledger
- [ ] Implement `telemetry.service.js` (real-time transit pings, gatekeeper override)
- [ ] Implement `merkle.service.js` (SHA-256 block chaining, digital signatures, root verification)
- [ ] Implement `trustops.controller.js` and `trustops.routes.js`

## Phase 10: Automated Testing Suite
- [ ] Write unit tests for Merkle hashing, APAP ceiling, and PIN attempt lockout
- [ ] Write integration tests for Auth, Catalog, Orders, Pharmacy RLS, and TrustOps Audit
- [ ] Execute tests via `npm.cmd test` and verify 100% passing

## Phase 11: Frontend Integration
- [x] Create `frontend/src/services/api.ts`
- [x] Separate frontend and backend into dedicated subdirectories
- [ ] Verify end-to-end flow between frontend and backend

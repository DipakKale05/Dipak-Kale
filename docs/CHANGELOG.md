# Changelog: GenricMed

## [2026-09-08]

### Added:
- Initialized persistent AI documentation context suite (`docs/CONTEXT.md`, `docs/REQUIREMENTS.md`, `docs/ARCHITECTURE.md`, `docs/API_CONTRACT.md`, `docs/DATABASE.md`, `docs/DECISIONS.md`, `docs/BUSINESS_RULES.md`, `docs/SECURITY.md`, `docs/ERROR_HANDLING.md`, `docs/VALIDATION.md`, `docs/TESTING.md`, `docs/DEPLOYMENT.md`, `docs/CHANGELOG.md`, `docs/TODO.md`, `phases.md`).
- Multi-tenant architecture design with PostgreSQL Row-Level Security (RLS) and zero-friction SQLite/in-memory adapter.
- Complete `/api/v1` REST API specification covering Auth, Catalog, Prescriptions, Orders, Pharmacy Desk, and TrustOps Telemetry/Audit.
- SHA-256 Merkle tree immutable audit chain specification adhering to HIPAA §164.312(b) & SOC2 CC6.1.
- Gatekeeper 4-digit Medical Release PIN security protocol specification with 3-attempt lockout.
- Clinical safety protocol specification (4,000mg daily APAP ceiling and emergency triage escalation).

## [2026-09-09] - Phase 2: Project Scaffold & Core Infrastructure

### Added:
- Production dependencies installed (`express`, `helmet`, `cors`, `zod`, `express-rate-limit`, `bcryptjs`, `jsonwebtoken`, `pg`, `vitest`, `supertest`).
- Environment configuration blueprint (`.env.example` and active `.env`).
- Centralized error handler middleware (`src/middlewares/errorHandler.js`) formatting uniform JSON responses per `docs/ERROR_HANDLING.md`.
- Zod schema validation middleware (`src/middlewares/validate.js`) with structured field-level 422 reports.
- API rate limiting middleware (`src/middlewares/rateLimiter.js`) with 100 req/15min general and 20 req/15min auth windows.
- PHI/HIPAA-safe request logging middleware (`src/middlewares/requestLogger.js`).
- System health and readiness probes (`GET /api/v1/health` and `GET /api/v1/health/ready`).
- Central Express app bootstrap (`src/app.js`) and graceful server startup (`src/server.js`).
- Automated Vitest test suite (`tests/health.test.js`) passing 100% (5/5 tests).

## [2026-09-09] - Phase 3: Data Models & Multi-Tenant RLS

### Added:
- Full PostgreSQL DDL (`src/config/schema.sql`) for all 10 domain entities with native Row-Level Security policies.
- Dual-mode database engine in `src/config/database.js` supporting native Postgres RLS connection pool alongside an in-memory SQLite tenant emulation adapter.
- Multi-tenant context middleware (`src/middlewares/tenant.js`) propagating tenant IDs from HTTP headers (`X-Tenant-ID`) and JWT session data to database sessions.
- Comprehensive seed dataset across all 10 domain tables in `src/models/seedData.js` matching AI Studio frontend entities.
- Robust domain repository layer: `user.repository.js`, `pharmacy.repository.js`, `medicine.repository.js`, `inventory.repository.js`, `order.repository.js`, `audit.repository.js`, `courier.repository.js`, and `prescription.repository.js`.
- Automated test suite (`tests/rls.test.js`) verifying strict RLS tenant isolation (`tenant_east_04` vs `tenant_central_04`), fail-closed access control, and TrustOps governance bypass.

## [2026-09-09] - Phase 4: Authentication & Role Governance

### Added:
- Input validation schemas in `src/validators/auth.validator.js` for registration, login, phone OTP, and passkey assertions.
- `AuthService` (`src/services/auth.service.js`) implementing salted bcrypt password hashing, JWT generation, 4-digit SMS OTP flow, and WebAuthn / FIDO2 hardware passkey verification.
- `requireAuth` middleware (`src/middlewares/auth.middleware.js`) decoding JWT Bearer tokens and binding tenant context to database transactions.
- `requireRole` middleware (`src/middlewares/rbac.middleware.js`) enforcing Role-Based Access Control (`PATIENT`, `PHARMACIST`, `TRUST_OFFICER`).
- Complete `/api/v1/auth` routes (`register`, `login`, `otp/send`, `otp/verify`, `passkey/verify`, `me`) wrapped in `authLimiter`.
- Comprehensive automated test suite (`tests/auth.test.js`) with 100% pass rate across 15 tests.

## [2026-09-09] - Phase 5: Catalog & Bioequivalent Engine

### Added:
- Validation schemas in `src/validators/medicine.validator.js` for query and ID parameter validations.
- `MedicineService` (`src/services/medicine.service.js`) computing accurate savings ($ and %), AB-rated chemical salt parity profiles, and multi-pharmacy seller aggregation.
- Public catalog routes (`GET /api/v1/medicines`, `GET /api/v1/medicines/:id`, `GET /api/v1/medicines/:id/sellers`) in `src/routes/medicine.routes.js`.
- Proximity-based seller sorting, stock availability, dynamic pricing, and cold-chain indicators across partner pharmacies.
- Automated test suite (`tests/medicine.test.js`) covering catalog lookup, search filtering, salt parity verification, 404 handling, and multi-seller pricing.





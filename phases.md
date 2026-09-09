# GenricMed Backend Development Phases & Roadmap

This document outlines the systematic, production-grade phases for developing, validating, and deploying the GenricMed backend platform.

```java
---

## Phase Overview

| Phase | Milestone | Focus Area | Status |
|---|---|---|---|
| **Phase 1** | **Documentation & AI Context** | `/docs` persistent context system (14 spec files) | **Completed** |
| **Phase 2** | **Project Scaffold & Infrastructure** | Core Express app, environment configuration, database connection adapter, centralized error handling | **Completed** |
| **Phase 3** | **Data Models & Multi-Tenant RLS** | PostgreSQL RLS schema, tables, in-memory/SQLite adapter, seeds | **Completed** |
| **Phase 4** | **Authentication & Role Governance** | JWT, bcrypt, phone OTP, WebAuthn/FIDO2 simulation, RBAC | **Completed** |
| **Phase 5** | **Catalog & Bioequivalent Engine** | AB-rated mapping, salt parity, multi-seller price aggregation, search | **Completed** |
| **Phase 6** | **Prescriptions & Clinical Safety** | Rx image ingestion, OCR simulation, DDI checks, 4000mg APAP ceiling | **Next** |
| **Phase 7** | **Orders & Gatekeeper Custody** | Order routing, 4-digit Medical Release PIN, tamper seal lock, courier tracking | **Queued** |
| **Phase 8** | **Pharmacy Partner Dispensing Desk** | 5-point regulatory verification, queue triage, near-expiry quarantine | **Queued** |
| **Phase 9** | **TrustOps Governance & Merkle Ledger** | Live telemetry bus, gatekeeper override, SHA-256 Merkle audit chaining | **Queued** |
| **Phase 10**| **Automated Testing Suite** | Unit tests, service tests, integration tests, RLS security validation | **Queued** |
| **Phase 11**| **Frontend API Integration** | API service client (`src/services/api.ts`), proxy configuration, verification | **Queued** |

---

## Detailed Phase Breakdown

### Phase 1: Documentation & Persistent AI Context
- **Deliverables**:
  - `docs/CONTEXT.md`: System high-level memory.
  - `docs/REQUIREMENTS.md`: Functional requirements (`REQ-001` - `REQ-010`).
  - `docs/ARCHITECTURE.md`: Layered system architecture & data flows.
  - `docs/API_CONTRACT.md`: Full `/api/v1` REST contract.
  - `docs/DATABASE.md`: Schema, tables, relationships, RLS policies.
  - `docs/DECISIONS.md`: Architecture Decision Records (ADRs).
  - `docs/BUSINESS_RULES.md`: Explicit business logic (`BR-001` - `BR-012`).
  - `docs/SECURITY.md`: HIPAA, encryption, rate limiting, hashing, WebAuthn.
  - `docs/ERROR_HANDLING.md`: Uniform error schema & codes.
  - `docs/VALIDATION.md`: Zod schema validation specifications.
  - `docs/TESTING.md`: Test strategy & coverage matrix.
  - `docs/DEPLOYMENT.md`: Environment setup, health check, launch commands.
  - `docs/CHANGELOG.md`: Chronological implementation history.
  - `docs/TODO.md`: Execution checklist and status.
- **Criteria for Completion**: All 14 documentation files created and synchronized with the PRD and AI Studio frontend.

---

### Phase 2: Project Scaffold & Core Infrastructure
- **Deliverables**:
  - `backend/package.json`: Production dependencies (`express`, `cors`, `helmet`, `bcryptjs`, `jsonwebtoken`, `zod`, `express-rate-limit`, `pg`, `vitest`, `supertest`).
  - `backend/.env.example`: Configuration blueprint.
  - `backend/src/config/`: `env.js`, `database.js`, `logger.js`.
  - `backend/src/middlewares/`: `errorHandler.js`, `validate.js`, `rateLimiter.js`.
  - `backend/src/app.js` & `backend/src/server.js`: Server bootstrap.
- **Criteria for Completion**: `GET /api/v1/health` returns healthy JSON response.

---

### Phase 3: Data Layer & Multi-Tenant RLS
- **Deliverables**:
  - Dual database adapter: Native PostgreSQL RLS + SQLite/in-memory adapter for automated tests.
  - Tables: `users`, `pharmacies`, `medicines`, `pharmacy_inventory`, `prescriptions`, `orders`, `order_items`, `couriers`, `chain_of_custody_events`, `audit_events`.
  - Seed dataset matching the frontend (Cetirizine HCl, Paracetamol, WellSpring Meds, Apex Medicos, Marcus Jenkins).
- **Criteria for Completion**: Schema successfully initialized and seeded across multiple tenants (`tenant_central_04`, `tenant_east_04`, `public_core`).

---
```

### Phase 4: Authentication & Identity (`/api/v1/auth`)
- **Deliverables**:
  - `POST /register`: Patient, Pharmacist (with state license #), Trust Officer.
  - `POST /login`: Email/password auth, bcrypt verification, JWT generation.
  - `POST /otp/send` & `POST /otp/verify`: 4-digit SMS OTP flow.
  - `POST /passkey/verify`: WebAuthn / FIDO2 simulation for PIC & Trust Officers.
  - `GET /me`: Authenticated session profile.
- **Criteria for Completion**: Authentication and RBAC middleware correctly protects endpoints and enforces role permissions.

---

### Phase 5: Catalog & Bioequivalent Engine (`/api/v1/medicines`)
- **Deliverables**:
  - `GET /`: Search by salt, brand, category, NDC.
  - `GET /:id`: AB-rated bioequivalent details, chemical formulation, dosage rules.
  - `GET /:id/sellers`: Live inventory aggregation with dynamic pricing, distance, stock status, cold-chain badge.
- **Criteria for Completion**: Returns accurate savings calculation (% and $) and aggregates multi-pharmacy sellers.

---

### Phase 6: Prescriptions & Clinical Safety (`/api/v1/prescriptions`)
- **Deliverables**:
  - `POST /upload`: Ingest Rx image, simulate OCR extraction.
  - Automated safety screening: Polypharmacy safeguards and Drug-Drug Interaction (DDI) checks.
  - APAP dosage rule: Maximum 4,000mg/24h ceiling enforcement.
- **Criteria for Completion**: Ingests prescription and returns validated clinical safety flags.

---

### Phase 7: Orders & Gatekeeper Chain-of-Custody (`/api/v1/orders`)
- **Deliverables**:
  - `POST /`: Order placement, geofenced routing to nearest qualified pharmacy, 4-digit PIN generation.
  - `GET /:id`: Live order tracking (status, courier location, ambient & cold-chain temp, tamper seal).
  - `POST /:id/verify-pin`: Gatekeeper 4-digit PIN verification at handover with 3-attempt lockout.
- **Criteria for Completion**: Orders progress through lifecycle; incorrect PIN records mismatch and locks after 3 fails.

---

### Phase 8: Pharmacy Partner Dispensing Desk (`/api/v1/pharmacy`)
- **Deliverables**:
  - `GET /orders/queue`: Queue segmented by `Need Rx Valid.`, `Ready to Pack`, `Awaiting Courier`.
  - `POST /orders/:id/verify-checklist`: 5-point regulatory verification checklist (PMP, NDC, Expiry, Cold-Chain, Tamper Seal).
  - `POST /orders/:id/handover`: Courier handover authorization.
  - `GET /inventory`: Real-time stock counts, velocity, locations.
  - `POST /inventory/quarantine`: Auto-liquidation (35% off) or quarantine for near-expiry batches (<60 days).
- **Criteria for Completion**: Strict tenant RLS isolation verified (tenant A cannot see tenant B orders/inventory).

---

### Phase 9: TrustOps Governance & Merkle Ledger (`/api/v1/trustops`)
- **Deliverables**:
  - `GET /telemetry/stream` & `POST /telemetry/ping`: Real-time transit telemetry stream (GPS, temp, seal).
  - `POST /gatekeeper/override`: One-time bypass OTP issuance and emergency courier hold.
  - `GET /audit/logs`: Query audit events filtered by classification (`HIPAA / PHI`, `CRITICAL`, etc.) and tenant.
  - `GET /audit/verify`: Cryptographic verification of SHA-256 Merkle root and block hash chaining.
- **Criteria for Completion**: All sensitive ops automatically append Merkle-sealed blocks; audit chain verification passes.

---

### Phase 10: Automated Testing Suite
- **Deliverables**:
  - Unit tests: APAP 4000mg ceiling, Merkle hash generator, Gatekeeper attempt limiter.
  - Integration tests: Auth, Catalog search, Order creation & PIN handover, Pharmacy RLS isolation, Audit ledger verification.
- **Criteria for Completion**: 100% test pass rate via `npm.cmd test`.

---

### Phase 11: Frontend Integration
- **Deliverables**:
  - `frontend/src/services/api.ts`: Typed API client connecting to backend endpoints.
  - End-to-end smoke test across Patient Discovery, Bioequivalent Detail, Order Tracking, Pharmacy Desk, and TrustOps consoles.
- **Criteria for Completion**: Frontend successfully fetches from backend and sends authentic requests.

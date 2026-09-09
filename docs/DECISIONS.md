# Architecture Decision Log (ADR): GenricMed

## DEC-001: Multi-Tenant Isolation via PostgreSQL RLS with Local SQLite/In-Memory Adapter
- **Decision**: Use PostgreSQL Row-Level Security (`current_setting('app.current_tenant')`) in production, combined with a Repository-level tenant filter adapter for local zero-dependency testing.
- **Why**: Ensures healthcare compliance without requiring separate database instances per pharmacy tenant, while allowing instant zero-friction developer setup and automated testing offline.
- **Alternatives Considered**: Database-per-tenant (costly, high overhead), Application-only WHERE clause filtering (risk of developer omission).
- **Date**: 2026-09-08

---

## DEC-002: JWT Authentication with Role & Tenant Embedded Claims
- **Decision**: Use cryptographically signed JWT access tokens containing `userId`, `role`, and `tenantId`.
- **Why**: Stateless verification, fast request triage across micro-services, compatible with client touchpoints.
- **Alternatives Considered**: Server-side sessions (requires sticky sessions or Redis cache).
- **Date**: 2026-09-08

---

## DEC-003: SHA-256 Merkle Chaining for Audit Ledger
- **Decision**: Chain each audit event with the previous event's SHA-256 hash and compute Merkle tree roots for batch verification.
- **Why**: Complies with HIPAA §164.312(b) and SOC2 CC6.1 requirement for tamper-evident immutable logging. Any unauthorized tampering invalidates the cryptographic chain.
- **Alternatives Considered**: Traditional database logs (vulnerable to DBA modification), Blockchain (high latency and gas cost).
- **Date**: 2026-09-08

---

## DEC-004: Gatekeeper 4-Digit Medical Release PIN
- **Decision**: Require courier to verify a 4-digit token generated at order placement and held by patient.
- **Why**: Prevents misplacement or unauthorized delivery of scheduled and regulated therapeutics.
- **Alternatives Considered**: Physical signature only (easily forged), Biometric at doorstep (impractical hardware requirement).
- **Date**: 2026-09-08

---

## DEC-005: Paracetamol / Acetaminophen 4,000mg Daily Dose Ceiling
- **Decision**: Backend clinical safety service strictly validates combined APAP active ingredient doses across order items.
- **Why**: Clinical governance requirement (FR-SAFE-01) to prevent unintentional acetaminophen hepatotoxicity.
- **Alternatives Considered**: Frontend-only warning (unreliable).
- **Date**: 2026-09-08

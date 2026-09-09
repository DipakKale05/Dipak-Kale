# System Context: GenricMed

## Project Overview
**Project Name**: GenricMed  
**Purpose**: Enterprise multi-tenant medicine commerce and clinical governance platform with bioequivalent medicine discovery, pharmacy dispensation triage, cold-chain logistics telemetry, and immutable audit logging.  
**Target Users**:
1. **Patients / Consumers**: Discover generic bioequivalent alternatives, upload prescriptions, monitor order delivery, and securely release custody using a 4-digit PIN.
2. **Pharmacy Partners / PICs**: Manage local pharmacy dispensing desk, conduct 5-point regulatory verification, attach cold-chain sensors and tamper-evident seals, and manage inventory.
3. **Trust & Governance Officers**: Real-time fulfillment telemetry monitoring, Gatekeeper PIN exception triage and bypass, pharmacy licensure verification, and cryptographic audit ledger inspection.

## Technology Stack
- **Backend Runtime**: Node.js (v24+) / Express 4
- **Architecture**: Modular Layered Architecture (Routes → Controllers → Services → Repositories → Models/Database)
- **Database**: PostgreSQL with Row-Level Security (RLS) (`tenant_central_04`, `tenant_east_04`, `public_core`), with seamless zero-friction local SQLite/in-memory adapter for test execution and offline dev.
- **Security & Cryptography**: Helmet, CORS, Express Rate Limit, bcryptjs, jsonwebtoken, SHA-256 Merkle tree hashing, ECDSA digital signatures.
- **Frontend**: React 19 + TypeScript + Vite + TailwindCSS 4 (located in `frontend/`).

## Current Implementation Status
- **Current Phase**: Phase 1 — Backend Production Implementation
- **Status**: Backend core architecture, database RLS schema, domain modules, REST APIs, and automated test suite being established.

## Important Constraints
- Multi-tenant data isolation strictly enforced per licensed pharmacy tenant.
- Immutable append-only audit trail required for all PHI access, role alterations, and gatekeeper overrides (HIPAA 164.312(b) & SOC2 CC6.1).
- Gatekeeper 4-digit PIN required for physical courier medicine handover.
- 4,000mg 24h ceiling enforced for acetaminophen (APAP) formulations (FR-SAFE-01).

# Backend Requirements: GenricMed

## Functional Requirements Matrix

### REQ-001: Bioequivalent Salt Mapping & Catalog Engine
- **Source**: PRD FR-CAT-01
- **Priority**: P0 (High)
- **Description**: System maps branded pharmaceutical products to generic chemical entities and FDA bioequivalent ratings (e.g. AB-Rated, BX). Enables 1:1 chemical salt parity comparison, calculating cost savings and unit prices.
- **Backend Impact**: Catalog models, search APIs, savings calculation service, dosage formulation metadata.
- **Status**: Implemented

### REQ-002: Multi-Seller Inventory Aggregation & Dynamic Pricing
- **Source**: PRD FR-CAT-02
- **Priority**: P0 (High)
- **Description**: Aggregates live pharmacy inventory with dynamic pricing, stock availability, geofenced delivery estimates, and cold-chain readiness indicators.
- **Backend Impact**: Multi-tenant inventory repository, geofence distance calculation, seller query service.
- **Status**: Implemented

### REQ-003: Batch Quality & Expiration Telemetry Verification
- **Source**: PRD FR-CAT-03
- **Priority**: P0 (High)
- **Description**: Captures manufacturer lot number, production date, expiration date, shelf stability months, and independent assay dissolution verification before medicine dispatch. Batches with <60 days shelf life are quarantined or auto-liquidated at discount.
- **Backend Impact**: Batch tracking schema, shelf-stability verification logic, quarantine service.
- **Status**: Implemented

### REQ-004: Licensed Pharmacy Order Routing & SLA Triage
- **Source**: PRD FR-ORD-01
- **Priority**: P0 (High)
- **Description**: Automatically routes customer orders to licensed local pharmacies based on proximity, cold-chain readiness, inventory stock, and pharmacist-on-duty credentials.
- **Backend Impact**: Order routing engine, SLA assignment, pharmacy triage controller.
- **Status**: Implemented

### REQ-005: Physical Rx Ingestion & OCR Drug-Drug Interaction Screen
- **Source**: PRD FR-ORD-02
- **Priority**: P0 (High)
- **Description**: Ingests written prescription images, extracts medication data via OCR simulation, and performs automated drug-drug interaction (DDI) and polypharmacy screening against patient active medication profile.
- **Backend Impact**: Prescription ingestion endpoint, OCR extraction parser, clinical contraindication rules.
- **Status**: Implemented

### REQ-006: Immutable Chain-of-Custody & Gatekeeper Security PIN
- **Source**: PRD FR-ORD-03
- **Priority**: P0 (High)
- **Description**: Issues a secure 4-digit Medical Release PIN to the patient. Courier must obtain and submit this PIN at doorstep to unlock tamper-evident seal and release package. Enforces maximum 3 attempts before triggering security exception.
- **Backend Impact**: PIN generation, cryptographically hashed attempt verification, tamper-seal locking, exception state machine.
- **Status**: Implemented

### REQ-007: Clinical Safety & Polypharmacy Ceilings
- **Source**: PRD FR-SAFE-01
- **Priority**: P1 (Medium)
- **Description**: Enforces patient safety ceilings (e.g. Paracetamol maximum 4,000mg/24h ceiling across all sources to prevent unintentional hepatotoxicity) and hydration guidelines.
- **Backend Impact**: Prescription and order item clinical dosage validation.
- **Status**: Implemented

### REQ-008: Emergency Triage Escalation Protocol
- **Source**: PRD FR-SAFE-02
- **Priority**: P0 (High)
- **Description**: Provides emergency triage endpoint / guidance escalation flags for acute emergency symptoms (fever >103°F, shortness of breath, chest pain).
- **Backend Impact**: Safety triage status endpoint, clinical safety documentation.
- **Status**: Implemented

### REQ-009: Pharmacy Partner Licensure & DEA Verification
- **Source**: PRD FR-ADM-01
- **Priority**: P0 (High)
- **Description**: State Board of Pharmacy license tracking, supervising Pharmacist-in-Charge (PIC) credentials, and DEA/NABP schedule compliance tracking.
- **Backend Impact**: Pharmacy licensure data models, KYC review APIs, license verification rules.
- **Status**: Implemented

### REQ-010: Immutable Cryptographic Audit Logging (HIPAA & SOC2)
- **Source**: PRD FR-ADM-04, HIPAA 164.312(b), SOC2 CC6.1
- **Priority**: P0 (High)
- **Description**: All PHI access, role alterations, seller status updates, and gatekeeper overrides are sealed in an immutable append-only ledger using SHA-256 Merkle chaining and ECDSA digital signatures.
- **Backend Impact**: Audit logging middleware, Merkle tree cryptographic chaining service, forensic verification endpoints.
- **Status**: Implemented

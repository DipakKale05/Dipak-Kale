# Business Rules: GenricMed

## BR-001: Tenant Data Isolation
A user authenticated under a specific pharmacy tenant (e.g. `tenant_central_04`) cannot read, modify, or delete inventory, orders, or patient records belonging to another tenant (e.g. `tenant_east_04`).

## BR-002: TrustOps Audit Governance Override
Only users with verified `TRUST_OFFICER` roles can view cross-tenant logistics telemetry and Merkle audit records.

## BR-003: 5-Point Dispensation Regulatory Check
A pharmacist cannot authorize courier dispatch until all 5 regulatory checkpoints are confirmed:
1. State PMP Registry verification (clean of polypharmacy abuse flags)
2. Batch Barcode NDC scan match
3. Expiration date safeguard (>180-day shelf life safety limit)
4. Cold-chain logger attachment (temperature validated between 2-8°C for cold items)
5. Tamper-evident seal number locked in immutable ledger

## BR-004: Gatekeeper PIN Handover & Attempt Limit
- The 4-digit Medical Release PIN must be presented by recipient to the courier.
- The courier cannot mark an order as `DELIVERED` without a valid PIN match.
- If an incorrect PIN is entered 3 consecutive times, the order automatically transitions to `PIN_EXCEPTION`, halting delivery and notifying TrustOps.

## BR-005: Clinical Acetaminophen / APAP Dosage Ceiling
The total combined dosage of Acetaminophen / Paracetamol in an order cannot exceed 4,000mg/24h per patient prescription. Orders exceeding this limit trigger automated clinical safety warnings (FR-SAFE-01).

## BR-006: Near-Expiry Quarantine & Liquidation Rule
Any pharmaceutical batch with remaining shelf life under 60 days must automatically trigger quarantine status. At 45 days, the platform initiates auto-liquidation routing with an automated 35% discount (FR-CAT-03).

## BR-007: Cold-Chain Thermal Excursion Rule
If active temperature telemetry exceeds 8.0°C (46.4°F) for cold-chain certified items, the order is flagged with a `TEMP_WARN` exception on the fulfillment telemetry stream.

## BR-008: Pharmacist PIC Credentialing
Orders involving regulated prescription drugs can only be dispensed by a pharmacy whose Pharmacist-in-Charge (PIC) possesses an active and verified State Board of Pharmacy license (FR-ADM-01).

## BR-009: Emergency Triage Protocol
Emergency symptoms (shortness of breath, chest pain, fever >103°F) must trigger an immediate UI/API escalation with instructions to contact 911 / emergency services rather than placing an online order (FR-SAFE-02).

## BR-010: Immutable Audit Logging Mandate
All security events, PHI data access, gatekeeper overrides, and seller approvals must be sealed with SHA-256 Merkle hashes. Deletion or modification of audit blocks is prohibited (FR-ADM-04).

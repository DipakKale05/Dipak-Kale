# Database Architecture: GenricMed

## Multi-Tenancy Architecture
GenricMed enforces tenant isolation using PostgreSQL Row-Level Security (RLS). Each tenant (e.g. `tenant_central_04` for Apex Medicos, `tenant_east_04` for WellSpring Meds) cannot access or modify another tenant's records.

TrustOps central governance overrides RLS strictly for compliance auditing (`LEAD_TRUST_OFFICER`, `COMPLIANCE_AUDITOR`).

---

## Entity-Relationship Schema

### 1. `users`
- `id` (VARCHAR(36), PK)
- `email` (VARCHAR(255), UNIQUE, NOT NULL)
- `password_hash` (VARCHAR(255), NOT NULL)
- `name` (VARCHAR(120), NOT NULL)
- `phone` (VARCHAR(30))
- `role` (VARCHAR(30), NOT NULL): `PATIENT`, `PHARMACIST`, `TRUST_OFFICER`
- `tenant_id` (VARCHAR(60)): `tenant_central_04`, `tenant_east_04`, `public_core`
- `pharmacy_name` (VARCHAR(120))
- `license_number` (VARCHAR(60))
- `dob` (DATE)
- `delivery_address` (TEXT)
- `fido2_verified` (BOOLEAN, DEFAULT FALSE)
- `hipaa_consented` (BOOLEAN, DEFAULT TRUE)
- `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())

### 2. `pharmacies`
- `id` (VARCHAR(36), PK)
- `tenant_id` (VARCHAR(60), NOT NULL, INDEX)
- `name` (VARCHAR(120), NOT NULL)
- `license_number` (VARCHAR(60), NOT NULL)
- `dea_number` (VARCHAR(60))
- `npi_number` (VARCHAR(60))
- `pic_name` (VARCHAR(120))
- `trust_score` (INT, DEFAULT 95)
- `distance_miles` (NUMERIC(5,2))
- `delivery_eta` (VARCHAR(60))
- `cold_chain_certified` (BOOLEAN, DEFAULT FALSE)
- `rating` (NUMERIC(3,2), DEFAULT 4.8)
- `address` (TEXT)

### 3. `medicines`
- `id` (VARCHAR(36), PK)
- `generic_name` (VARCHAR(120), NOT NULL, INDEX)
- `brand_name_equivalent` (VARCHAR(120), NOT NULL)
- `dosage_form` (VARCHAR(60), NOT NULL)
- `strength` (VARCHAR(30), NOT NULL)
- `category` (VARCHAR(60), NOT NULL, INDEX)
- `generic_price` (NUMERIC(10,2), NOT NULL)
- `brand_price` (NUMERIC(10,2), NOT NULL)
- `savings_percentage` (INT)
- `unit_price_string` (VARCHAR(60))
- `fda_bioequivalent_rating` (VARCHAR(30), DEFAULT 'AB-Rated')
- `otc_regulated` (BOOLEAN, DEFAULT TRUE)
- `image_url` (TEXT)
- `indications` (TEXT)
- `dosage_adult` (TEXT)
- `dosage_senior` (TEXT)
- `active_ingredient` (TEXT)
- `inactive_ingredients` (TEXT)
- `shelf_stability_months` (INT, DEFAULT 24)

### 4. `pharmacy_inventory` (RLS Enforced)
- `id` (VARCHAR(36), PK)
- `tenant_id` (VARCHAR(60), NOT NULL, INDEX)
- `pharmacy_id` (VARCHAR(36), FK -> pharmacies.id)
- `medicine_id` (VARCHAR(36), FK -> medicines.id)
- `batch_number` (VARCHAR(60), NOT NULL)
- `mfg_date` (VARCHAR(30))
- `exp_date` (VARCHAR(30), NOT NULL)
- `shelf_stability_months` (INT)
- `current_count` (INT, DEFAULT 0)
- `unit_price` (NUMERIC(10,2), NOT NULL)
- `velocity` (VARCHAR(60))
- `location_bin` (VARCHAR(60))
- `status` (VARCHAR(30)): `Adequate`, `Optimal`, `Reorder Soon`, `Quarantine`
- `assay_verified` (BOOLEAN, DEFAULT TRUE)

### 5. `orders` (RLS Enforced)
- `id` (VARCHAR(36), PK)
- `tenant_id` (VARCHAR(60), NOT NULL, INDEX)
- `patient_id` (VARCHAR(36), FK -> users.id)
- `pharmacy_id` (VARCHAR(36), FK -> pharmacies.id)
- `courier_id` (VARCHAR(36))
- `status` (VARCHAR(30)): `PLACED`, `DISPENSED`, `DISPATCHED`, `EN_ROUTE`, `DELIVERED`, `PIN_EXCEPTION`, `CANCELLED`
- `total_amount` (NUMERIC(10,2), NOT NULL)
- `medical_release_pin_hash` (VARCHAR(255), NOT NULL)
- `tamper_seal_number` (VARCHAR(60))
- `destination_address` (TEXT)
- `eta_minutes` (INT)
- `distance_miles` (NUMERIC(5,2))
- `current_temp_f` (NUMERIC(5,2))
- `pin_attempts` (INT, DEFAULT 0)
- `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())
- `updated_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())

### 6. `order_items`
- `id` (VARCHAR(36), PK)
- `order_id` (VARCHAR(36), FK -> orders.id)
- `medicine_id` (VARCHAR(36), FK -> medicines.id)
- `quantity` (INT, NOT NULL)
- `unit_price` (NUMERIC(10,2), NOT NULL)
- `lot_number` (VARCHAR(60))
- `exp_date` (VARCHAR(30))

### 7. `audit_events` (Append-Only Cryptographic Ledger)
- `id` (VARCHAR(36), PK)
- `event_id` (VARCHAR(60), UNIQUE, NOT NULL)
- `timestamp` (TIMESTAMP WITH TIME ZONE, NOT NULL)
- `actor_id` (VARCHAR(60), NOT NULL)
- `actor_name` (VARCHAR(120), NOT NULL)
- `actor_role` (VARCHAR(60), NOT NULL)
- `actor_email` (VARCHAR(255), NOT NULL)
- `action` (VARCHAR(60), NOT NULL)
- `target` (VARCHAR(120), NOT NULL)
- `classification` (VARCHAR(60), NOT NULL)
- `tenant_context` (VARCHAR(60), NOT NULL)
- `payload_json` (JSONB / TEXT, NOT NULL)
- `previous_hash` (VARCHAR(64), NOT NULL)
- `merkle_root` (VARCHAR(64), NOT NULL)
- `signature_hash` (VARCHAR(128), NOT NULL)

---

## Row-Level Security (RLS) SQL Definition

```sql
-- Enable RLS
ALTER TABLE pharmacy_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Tenant Isolation
CREATE POLICY tenant_isolation_policy ON pharmacy_inventory
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant', true))
  WITH CHECK (tenant_id = current_setting('app.current_tenant', true));

-- TrustOps Central Audit Override
CREATE POLICY trustops_governance_policy ON orders
  FOR SELECT
  USING (
    current_setting('app.user_role', true) IN ('LEAD_TRUST_OFFICER', 'COMPLIANCE_AUDITOR')
    OR tenant_id = current_setting('app.current_tenant', true)
  );
```

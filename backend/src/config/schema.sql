-- ==============================================================================
-- GenricMed PostgreSQL Multi-Tenant Schema with Row-Level Security (RLS)
-- Adhering to HIPAA §164.312(a)(1) & SOC2 CC6.1 Access Controls
-- ==============================================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(120) NOT NULL,
    phone VARCHAR(30),
    role VARCHAR(30) NOT NULL, -- 'PATIENT', 'PHARMACIST', 'TRUST_OFFICER'
    tenant_id VARCHAR(60),     -- 'tenant_central_04', 'tenant_east_04', 'public_core'
    pharmacy_name VARCHAR(120),
    license_number VARCHAR(60),
    dob DATE,
    delivery_address TEXT,
    fido2_verified BOOLEAN DEFAULT FALSE,
    hipaa_consented BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_users_tenant ON users(tenant_id);

-- 2. Pharmacies Table
CREATE TABLE IF NOT EXISTS pharmacies (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(60) NOT NULL,
    name VARCHAR(120) NOT NULL,
    license_number VARCHAR(60) NOT NULL,
    dea_number VARCHAR(60),
    npi_number VARCHAR(60),
    pic_name VARCHAR(120),
    trust_score INT DEFAULT 95,
    distance_miles NUMERIC(5,2),
    delivery_eta VARCHAR(60),
    cold_chain_certified BOOLEAN DEFAULT FALSE,
    rating NUMERIC(3,2) DEFAULT 4.8,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pharmacies_tenant ON pharmacies(tenant_id);

-- 3. Medicines Table (Public core catalog)
CREATE TABLE IF NOT EXISTS medicines (
    id VARCHAR(36) PRIMARY KEY,
    generic_name VARCHAR(120) NOT NULL,
    brand_name_equivalent VARCHAR(120) NOT NULL,
    dosage_form VARCHAR(60) NOT NULL,
    strength VARCHAR(30) NOT NULL,
    category VARCHAR(60) NOT NULL,
    generic_price NUMERIC(10,2) NOT NULL,
    brand_price NUMERIC(10,2) NOT NULL,
    savings_percentage INT,
    unit_price_string VARCHAR(60),
    fda_bioequivalent_rating VARCHAR(30) DEFAULT 'AB-Rated',
    otc_regulated BOOLEAN DEFAULT TRUE,
    image_url TEXT,
    indications TEXT,
    dosage_adult TEXT,
    dosage_senior TEXT,
    active_ingredient TEXT,
    inactive_ingredients TEXT,
    shelf_stability_months INT DEFAULT 24,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_medicines_generic_name ON medicines(LOWER(generic_name));
CREATE INDEX IF NOT EXISTS idx_medicines_category ON medicines(LOWER(category));

-- 4. Pharmacy Inventory Table (RLS Protected)
CREATE TABLE IF NOT EXISTS pharmacy_inventory (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(60) NOT NULL,
    pharmacy_id VARCHAR(36) REFERENCES pharmacies(id) ON DELETE CASCADE,
    medicine_id VARCHAR(36) REFERENCES medicines(id) ON DELETE CASCADE,
    batch_number VARCHAR(60) NOT NULL,
    mfg_date VARCHAR(30),
    exp_date VARCHAR(30) NOT NULL,
    shelf_stability_months INT,
    current_count INT DEFAULT 0,
    unit_price NUMERIC(10,2) NOT NULL,
    velocity VARCHAR(60),
    location_bin VARCHAR(60),
    status VARCHAR(30) DEFAULT 'Adequate', -- 'Adequate', 'Optimal', 'Reorder Soon', 'Quarantine'
    assay_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_inventory_tenant ON pharmacy_inventory(tenant_id);
CREATE INDEX IF NOT EXISTS idx_inventory_pharmacy ON pharmacy_inventory(pharmacy_id);
CREATE INDEX IF NOT EXISTS idx_inventory_medicine ON pharmacy_inventory(medicine_id);

-- 5. Couriers Table
CREATE TABLE IF NOT EXISTS couriers (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    badge_number VARCHAR(60) NOT NULL,
    phone VARCHAR(30),
    vehicle_type VARCHAR(60),
    is_verified BOOLEAN DEFAULT TRUE,
    cold_chain_certified BOOLEAN DEFAULT FALSE,
    current_lat NUMERIC(9,6),
    current_lng NUMERIC(9,6),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Orders Table (RLS Protected)
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(60) NOT NULL,
    patient_id VARCHAR(36) REFERENCES users(id) ON DELETE RESTRICT,
    pharmacy_id VARCHAR(36) REFERENCES pharmacies(id) ON DELETE RESTRICT,
    courier_id VARCHAR(36) REFERENCES couriers(id) ON DELETE SET NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PLACED',
    total_amount NUMERIC(10,2) NOT NULL,
    medical_release_pin_hash VARCHAR(255) NOT NULL,
    tamper_seal_number VARCHAR(60),
    destination_address TEXT NOT NULL,
    eta_minutes INT,
    distance_miles NUMERIC(5,2),
    current_temp_f NUMERIC(5,2),
    pin_attempts INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_tenant ON orders(tenant_id);
CREATE INDEX IF NOT EXISTS idx_orders_patient ON orders(patient_id);
CREATE INDEX IF NOT EXISTS idx_orders_pharmacy ON orders(pharmacy_id);

-- 7. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) REFERENCES orders(id) ON DELETE CASCADE,
    medicine_id VARCHAR(36) REFERENCES medicines(id) ON DELETE RESTRICT,
    quantity INT NOT NULL,
    unit_price NUMERIC(10,2) NOT NULL,
    lot_number VARCHAR(60),
    exp_date VARCHAR(30)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- 8. Prescriptions Table
CREATE TABLE IF NOT EXISTS prescriptions (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(60) NOT NULL,
    patient_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
    pharmacy_id VARCHAR(36) REFERENCES pharmacies(id) ON DELETE SET NULL,
    rx_number VARCHAR(60) UNIQUE NOT NULL,
    doctor_name VARCHAR(120) NOT NULL,
    doctor_npi VARCHAR(60),
    medicine_id VARCHAR(36) REFERENCES medicines(id) ON DELETE SET NULL,
    dosage_instructions TEXT NOT NULL,
    refills_remaining INT DEFAULT 0,
    status VARCHAR(30) DEFAULT 'ACTIVE', -- 'ACTIVE', 'FILLED', 'EXPIRED'
    image_url TEXT,
    extracted_text TEXT,
    ddi_warnings JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_tenant ON prescriptions(tenant_id);

-- 9. Chain of Custody Events Table (RLS Protected)
CREATE TABLE IF NOT EXISTS chain_of_custody_events (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(60) NOT NULL,
    order_id VARCHAR(36) REFERENCES orders(id) ON DELETE CASCADE,
    event_type VARCHAR(60) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actor_id VARCHAR(60) NOT NULL,
    actor_name VARCHAR(120) NOT NULL,
    actor_role VARCHAR(60) NOT NULL,
    location_lat NUMERIC(9,6),
    location_lng NUMERIC(9,6),
    ambient_temp_f NUMERIC(5,2),
    tamper_seal_status VARCHAR(30) DEFAULT 'INTACT',
    notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_custody_order ON chain_of_custody_events(order_id);
CREATE INDEX IF NOT EXISTS idx_custody_tenant ON chain_of_custody_events(tenant_id);

-- 10. Audit Events Table (Append-Only Cryptographic Merkle Ledger)
CREATE TABLE IF NOT EXISTS audit_events (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(60) UNIQUE NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    actor_id VARCHAR(60) NOT NULL,
    actor_name VARCHAR(120) NOT NULL,
    actor_role VARCHAR(60) NOT NULL,
    actor_email VARCHAR(255) NOT NULL,
    action VARCHAR(60) NOT NULL,
    target VARCHAR(120) NOT NULL,
    classification VARCHAR(60) NOT NULL,
    tenant_context VARCHAR(60) NOT NULL,
    payload_json JSONB NOT NULL,
    previous_hash VARCHAR(64) NOT NULL,
    merkle_root VARCHAR(64) NOT NULL,
    signature_hash VARCHAR(128) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_classification ON audit_events(classification);
CREATE INDEX IF NOT EXISTS idx_audit_tenant ON audit_events(tenant_context);

-- ==============================================================================
-- PostgreSQL Row-Level Security (RLS) Activation & Policies
-- ==============================================================================

ALTER TABLE pharmacy_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE chain_of_custody_events ENABLE ROW LEVEL SECURITY;

-- 1. pharmacy_inventory RLS Policy
DROP POLICY IF EXISTS tenant_isolation_inventory ON pharmacy_inventory;
CREATE POLICY tenant_isolation_inventory ON pharmacy_inventory
    FOR ALL
    USING (
        current_setting('app.user_role', true) IN ('TRUST_OFFICER', 'LEAD_TRUST_OFFICER', 'COMPLIANCE_AUDITOR')
        OR current_setting('app.current_tenant', true) = 'public_core'
        OR tenant_id = current_setting('app.current_tenant', true)
    )
    WITH CHECK (
        current_setting('app.current_tenant', true) = 'public_core'
        OR tenant_id = current_setting('app.current_tenant', true)
    );

-- 2. orders RLS Policy
DROP POLICY IF EXISTS tenant_isolation_orders ON orders;
CREATE POLICY tenant_isolation_orders ON orders
    FOR ALL
    USING (
        current_setting('app.user_role', true) IN ('TRUST_OFFICER', 'LEAD_TRUST_OFFICER', 'COMPLIANCE_AUDITOR')
        OR current_setting('app.current_tenant', true) = 'public_core'
        OR tenant_id = current_setting('app.current_tenant', true)
    )
    WITH CHECK (
        current_setting('app.current_tenant', true) = 'public_core'
        OR tenant_id = current_setting('app.current_tenant', true)
    );

-- 3. chain_of_custody_events RLS Policy
DROP POLICY IF EXISTS tenant_isolation_custody ON chain_of_custody_events;
CREATE POLICY tenant_isolation_custody ON chain_of_custody_events
    FOR ALL
    USING (
        current_setting('app.user_role', true) IN ('TRUST_OFFICER', 'LEAD_TRUST_OFFICER', 'COMPLIANCE_AUDITOR')
        OR current_setting('app.current_tenant', true) = 'public_core'
        OR tenant_id = current_setting('app.current_tenant', true)
    );

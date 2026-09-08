import React, { useState } from 'react';
import { AppScreen } from '../types';

interface ArchitecturePRDProps {
  onNavigate: (screen: AppScreen) => void;
}

export const ArchitecturePRD: React.FC<ArchitecturePRDProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'prd' | 'db_schema'>('architecture');
  const [searchReq, setSearchReq] = useState('');

  const prdSections = [
    {
      code: 'FR-CAT-01',
      title: 'Active Pharmaceutical Ingredient (API) & Salt Mapping Engine',
      priority: 'P0',
      description: 'System maps every branded drug to its active generic chemical entity and FDA bioequivalent rating (e.g. AB-Rated, BX, etc.). Enables 1:1 chemical salt parity comparison.',
    },
    {
      code: 'FR-CAT-02',
      title: 'Multi-Seller Inventory Aggregation & Real-Time Price Index',
      priority: 'P0',
      description: 'Aggregates stock across licensed pharmacies with geofenced delivery estimates and dynamic price per unit comparisons.',
    },
    {
      code: 'FR-CAT-03',
      title: 'Batch Quality & Expiration Telemetry Verification',
      priority: 'P0',
      description: 'Every dispensed medicine must capture manufacture date, lot number, remaining shelf stability months, and assay verification before dispatch.',
    },
    {
      code: 'FR-ORD-01',
      title: 'Licensed Pharmacy Order Routing & SLA Triage',
      priority: 'P0',
      description: 'Orders routed based on geographic distance, cold-chain readiness, inventory availability, and pharmacist-on-duty license credentials.',
    },
    {
      code: 'FR-ORD-02',
      title: 'Physical Rx Ingestion & OCR Drug-Drug Interaction Screen',
      priority: 'P0',
      description: 'Allows camera capture of written prescriptions with automated OCR and safety triage screening against patient history.',
    },
    {
      code: 'FR-ORD-03',
      title: 'Immutable Chain-of-Custody & Gatekeeper Security PIN',
      priority: 'P0',
      description: 'Patient receives 4-digit Medical Release PIN required for physical courier handover. Tamper-evident seal number locked in immutable ledger.',
    },
    {
      code: 'FR-SAFE-01',
      title: 'First-Line Symptom Guidance & Polypharmacy Safeguards',
      priority: 'P1',
      description: 'Symptom-based care advisors (e.g., Common Cold & Fever) highlighting max daily doses (e.g. Paracetamol 4000mg ceiling).',
    },
    {
      code: 'FR-SAFE-02',
      title: 'Critical Triage Escalation Protocol',
      priority: 'P0',
      description: 'Immediate UI escalation banners and 911 dispatch bridges for emergency symptoms (shortness of breath, chest pain, fever >103°F).',
    },
    {
      code: 'FR-ADM-01',
      title: 'Pharmacy Partner Licensure & DEA Verification',
      priority: 'P0',
      description: 'State Board of Pharmacy license tracking, supervising Pharmacist-in-Charge credentials, and DEA Schedule compliance.',
    },
    {
      code: 'FR-ADM-04',
      title: 'Immutable Cryptographic Audit Logging (HIPAA & SOC2)',
      priority: 'P0',
      description: 'All PHI access, role alterations, and gatekeeper overrides sealed with SHA-256 Merkle hashes and ECDSA digital signatures.',
    },
  ];

  const filteredReqs = prdSections.filter(
    (r) =>
      r.code.toLowerCase().includes(searchReq.toLowerCase()) ||
      r.title.toLowerCase().includes(searchReq.toLowerCase()) ||
      r.description.toLowerCase().includes(searchReq.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-surface font-body-base text-body-base text-on-surface">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-xl border-b border-outline-variant/30 px-space-md py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-md">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[24px]">account_tree</span>
            </div>
            <div>
              <h1 className="font-headline-sm text-headline-sm font-bold text-primary">
                GenricMed Enterprise Architecture & PRD
              </h1>
              <span className="font-code-sm text-xs text-secondary font-semibold">
                PostgreSQL RLS Multi-Tenancy • Event Sourcing • HIPAA Compliance
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className={`px-3 py-1.5 rounded-lg font-code-sm text-xs font-bold transition-colors ${
                activeTab === 'architecture'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
              onClick={() => setActiveTab('architecture')}
            >
              Architecture Diagram
            </button>
            <button
              className={`px-3 py-1.5 rounded-lg font-code-sm text-xs font-bold transition-colors ${
                activeTab === 'prd'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
              onClick={() => setActiveTab('prd')}
            >
              PRD Requirements (P0/P1)
            </button>
            <button
              className={`px-3 py-1.5 rounded-lg font-code-sm text-xs font-bold transition-colors ${
                activeTab === 'db_schema'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
              onClick={() => setActiveTab('db_schema')}
            >
              Postgres RLS Schema
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-space-md py-space-md flex flex-col gap-space-md flex-1">
        {/* Architecture Tab */}
        {activeTab === 'architecture' && (
          <div className="flex flex-col gap-space-md">
            {/* Architectural Diagram Card */}
            <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/30 flex flex-col gap-space-md">
              <div className="flex items-center justify-between border-b border-surface-container pb-space-sm">
                <div>
                  <h2 className="font-headline-sm text-lg font-bold text-primary">
                    Multi-Tenant Platform Architecture (RLS + Event Sourcing)
                  </h2>
                  <p className="font-body-sm text-xs text-on-surface-variant">
                    Enterprise separation across Consumer Edge, Partner Pharmacies, and TrustOps Governance
                  </p>
                </div>
                <span className="bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-full font-micro-badge text-xs font-bold">
                  Zero-Trust Verified
                </span>
              </div>

              {/* Visual Diagram Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                {/* Layer 1: Client Edge */}
                <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/20 flex flex-col gap-space-sm">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <span className="material-symbols-outlined text-[20px]">devices</span>
                    <span>1. Client Touchpoints</span>
                  </div>
                  <div className="flex flex-col gap-2 text-xs">
                    <div
                      className="p-2.5 rounded-lg bg-white shadow-xs border border-outline-variant/30 cursor-pointer hover:border-primary"
                      onClick={() => onNavigate('customer-home')}
                    >
                      <strong className="text-primary block">Patient Mobile App</strong>
                      <span className="text-on-surface-variant">
                        Bioequivalent discovery, Rx scan, Gatekeeper PIN release
                      </span>
                    </div>
                    <div
                      className="p-2.5 rounded-lg bg-white shadow-xs border border-outline-variant/30 cursor-pointer hover:border-primary"
                      onClick={() => onNavigate('partner-portal')}
                    >
                      <strong className="text-primary block">Pharmacy Partner Portal</strong>
                      <span className="text-on-surface-variant">
                        Dispensing desk, cold-chain monitoring, 5-point verification
                      </span>
                    </div>
                    <div
                      className="p-2.5 rounded-lg bg-white shadow-xs border border-outline-variant/30 cursor-pointer hover:border-primary"
                      onClick={() => onNavigate('trustops-fulfillment')}
                    >
                      <strong className="text-primary block">TrustOps Enterprise Console</strong>
                      <span className="text-on-surface-variant">
                        Logistics telemetry, Gatekeeper override, Merkle ledger
                      </span>
                    </div>
                  </div>
                </div>

                {/* Layer 2: Core Platform Services */}
                <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/20 flex flex-col gap-space-sm">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <span className="material-symbols-outlined text-[20px]">dns</span>
                    <span>2. Core Services Engine</span>
                  </div>
                  <div className="flex flex-col gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-white shadow-xs border border-outline-variant/30">
                      <strong className="text-primary block">Catalog & Salt Matcher</strong>
                      <span className="text-on-surface-variant">FDA AB-Rated generic bioequivalence lookup</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white shadow-xs border border-outline-variant/30">
                      <strong className="text-primary block">Order Triage & Routing</strong>
                      <span className="text-on-surface-variant">Geofenced multi-seller matching and SLA dispatch</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white shadow-xs border border-outline-variant/30">
                      <strong className="text-primary block">Kafka Telemetry Bus</strong>
                      <span className="text-on-surface-variant">
                        Real-time GPS pings, BLE temperature loggers, IoT tamper seals
                      </span>
                    </div>
                  </div>
                </div>

                {/* Layer 3: Persistence & Security */}
                <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/20 flex flex-col gap-space-sm">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <span className="material-symbols-outlined text-[20px]">security</span>
                    <span>3. Isolation & Security</span>
                  </div>
                  <div className="flex flex-col gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-white shadow-xs border border-outline-variant/30">
                      <strong className="text-primary block">PostgreSQL Row-Level Security</strong>
                      <span className="text-on-surface-variant">
                        Strict multi-tenant schema isolation per licensed pharmacy
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white shadow-xs border border-outline-variant/30">
                      <strong className="text-primary block">Immutable Merkle Ledger</strong>
                      <span className="text-on-surface-variant">SHA-256 chained blocks for HIPAA compliance</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white shadow-xs border border-outline-variant/30">
                      <strong className="text-primary block">FIDO2 / WebAuthn MFA</strong>
                      <span className="text-on-surface-variant">Hardware-backed authentication for PIC & Trust Officers</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Jump Buttons */}
              <div className="p-space-sm bg-surface-container-low rounded-xl flex flex-wrap items-center justify-between gap-space-sm">
                <span className="font-code-sm text-xs text-primary font-semibold">
                  Test and inspect the live working screens across all 3 portals:
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    className="bg-primary text-on-primary px-3 py-1.5 rounded-lg font-code-sm text-xs font-bold hover:bg-primary-container"
                    onClick={() => onNavigate('customer-home')}
                  >
                    1. Patient Discover
                  </button>
                  <button
                    className="bg-primary text-on-primary px-3 py-1.5 rounded-lg font-code-sm text-xs font-bold hover:bg-primary-container"
                    onClick={() => onNavigate('medication-detail')}
                  >
                    2. Bioequivalent Detail
                  </button>
                  <button
                    className="bg-primary text-on-primary px-3 py-1.5 rounded-lg font-code-sm text-xs font-bold hover:bg-primary-container"
                    onClick={() => onNavigate('order-tracking')}
                  >
                    3. Live Chain-of-Custody
                  </button>
                  <button
                    className="bg-secondary text-on-secondary px-3 py-1.5 rounded-lg font-code-sm text-xs font-bold hover:bg-secondary/90"
                    onClick={() => onNavigate('partner-portal')}
                  >
                    4. Pharmacy Portal
                  </button>
                  <button
                    className="bg-primary-container text-on-primary px-3 py-1.5 rounded-lg font-code-sm text-xs font-bold hover:bg-primary"
                    onClick={() => onNavigate('trustops-fulfillment')}
                  >
                    5. TrustOps Telemetry
                  </button>
                  <button
                    className="bg-primary text-on-primary px-3 py-1.5 rounded-lg font-code-sm text-xs font-bold hover:bg-primary-container"
                    onClick={() => onNavigate('trustops-audit')}
                  >
                    6. Security Audit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PRD Requirements Tab */}
        {activeTab === 'prd' && (
          <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/30 flex flex-col gap-space-md">
            <div className="flex flex-wrap items-center justify-between gap-space-sm border-b border-surface-container pb-space-sm">
              <div>
                <h2 className="font-headline-sm text-lg font-bold text-primary">
                  Product Requirements Document (PRD) Specification
                </h2>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  Clinical governance, bioequivalent matching, and multi-tenant telemetry requirements
                </p>
              </div>
              <input
                className="bg-surface-container-low px-3 py-1.5 rounded-lg text-xs font-code-sm border border-outline-variant/30 focus:outline-none w-64"
                placeholder="Search FR code or title..."
                type="text"
                value={searchReq}
                onChange={(e) => setSearchReq(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-space-sm">
              {filteredReqs.map((req) => (
                <div
                  key={req.code}
                  className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-code-sm text-xs font-bold text-primary">{req.code}</span>
                      <span className="font-headline-sm text-sm font-bold text-primary">{req.title}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded font-micro-badge text-[10px] font-bold ${
                        req.priority === 'P0'
                          ? 'bg-error-container text-on-error-container'
                          : 'bg-surface-container-high text-primary'
                      }`}
                    >
                      {req.priority}
                    </span>
                  </div>
                  <p className="font-body-sm text-xs text-on-surface-variant">{req.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Database Schema Tab */}
        {activeTab === 'db_schema' && (
          <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/30 flex flex-col gap-space-md font-mono text-xs">
            <div className="flex items-center justify-between border-b border-surface-container pb-space-sm">
              <div>
                <h2 className="font-headline-sm text-lg font-bold text-primary font-sans">
                  PostgreSQL Row-Level Security (RLS) Policy Definition
                </h2>
                <p className="font-body-sm text-xs text-on-surface-variant font-sans">
                  Guarantees pharmacy data privacy while allowing centralized TrustOps auditability
                </p>
              </div>
              <span className="font-code-sm text-secondary font-bold">tenant_central_04</span>
            </div>

            <pre className="bg-slate-950 text-slate-100 p-space-md rounded-xl overflow-x-auto text-[11px] leading-relaxed border border-slate-800">
{`-- Enable Row Level Security on all operational tables
ALTER TABLE pharmacy_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE chain_of_custody_events ENABLE ROW LEVEL SECURITY;

-- Tenant Isolation Policy: Tenant can only read and write their own data
CREATE POLICY tenant_isolation_policy ON pharmacy_inventory
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant', true))
  WITH CHECK (tenant_id = current_setting('app.current_tenant', true));

-- TrustOps Central Audit Override Policy
CREATE POLICY trustops_governance_policy ON chain_of_custody_events
  FOR SELECT
  USING (
    current_setting('app.user_role', true) IN ('LEAD_TRUST_OFFICER', 'COMPLIANCE_AUDITOR')
    OR tenant_id = current_setting('app.current_tenant', true)
  );

-- Cryptographic Immutable Audit Append-Only Trigger
CREATE OR REPLACE FUNCTION verify_audit_merkle_seal()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.previous_hash IS NULL OR NEW.merkle_root IS NULL THEN
    RAISE EXCEPTION 'Audit event must contain cryptographic hash seal';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;`}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
};

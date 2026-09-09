import React, { useState } from 'react';
import { INITIAL_AUDIT_EVENTS } from '../data/mockData';
import { AuditEventRecord, AppScreen } from '../types';

interface TrustOpsAuditProps {
  onNavigate: (screen: AppScreen) => void;
}

export const TrustOpsAudit: React.FC<TrustOpsAuditProps> = ({ onNavigate }) => {
  const [events, setEvents] = useState<AuditEventRecord[]>(INITIAL_AUDIT_EVENTS);
  const [selectedEventId, setSelectedEventId] = useState<string>('EVT-889104');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterTenant, setFilterTenant] = useState('ALL');
  const [copiedJson, setCopiedJson] = useState(false);

  const selectedEvent = events.find((e) => e.eventId === selectedEventId) || events[0];

  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      searchQuery === '' ||
      e.eventId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.target.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      filterType === 'ALL' ||
      (filterType === 'PHI' && e.classification === 'HIPAA / PHI') ||
      (filterType === 'CRITICAL' && (e.classification === 'CRITICAL / BLOCKED' || e.classification === 'HIGH PRIORITY')) ||
      (filterType === 'WARNING' && e.classification === 'WARNING');

    const matchesTenant = filterTenant === 'ALL' || e.tenantContext.includes(filterTenant);

    return matchesSearch && matchesType && matchesTenant;
  });

  const handleCopyJson = () => {
    navigator.clipboard?.writeText(JSON.stringify(selectedEvent.payloadJson, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface font-body-base text-body-base text-on-surface">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-xl border-b border-outline-variant/30 px-space-md py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-md">
            <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold shadow-sm">
              <span className="material-symbols-outlined text-[22px]">lock_clock</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-space-xs flex-wrap">
                <h1 className="font-headline-sm text-headline-sm font-bold text-primary">
                  Security, Compliance & Immutable Audit Logs
                </h1>
                <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded font-micro-badge text-[11px] font-bold">
                  SHA-256 MERKLE SEALED
                </span>
              </div>
              <span className="font-code-sm text-xs text-on-surface-variant">
                PostgreSQL Row-Level Security (RLS) & FIDO2 Attestation • FR-ADM-04 / HIPAA-164.312
              </span>
            </div>
          </div>

          <div className="flex items-center gap-space-xs">
            <button
              className="bg-surface-container hover:bg-surface-container-high text-primary px-3 py-1.5 rounded-lg font-code-sm text-xs font-bold flex items-center gap-1 transition-colors"
              onClick={() => onNavigate('trustops-fulfillment')}
            >
              <span className="material-symbols-outlined text-[16px]">local_shipping</span>
              View Fulfillment
            </button>
            <button
              className="bg-primary text-on-primary hover:bg-primary-container px-3.5 py-1.5 rounded-lg font-code-sm text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              onClick={() => alert('Cryptographic Audit Certificate generated with SHA-256 Merkle root verification.')}
            >
              <span className="material-symbols-outlined text-[16px]">verified</span>
              Export Certificate (PDF)
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-space-md py-space-md flex flex-col gap-space-md flex-1">
        {/* Top 4 Telemetry Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30">
            <span className="font-micro-badge text-micro-badge text-on-surface-variant uppercase font-bold">
              Ledger Integrity
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="font-headline-xl text-2xl font-bold text-secondary">SHA-256 Validated</span>
              <span className="font-code-sm text-xs font-bold text-primary">100% Blocks</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30">
            <span className="font-micro-badge text-micro-badge text-on-surface-variant uppercase font-bold">
              Tenant Isolation (RLS)
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="font-headline-xl text-2xl font-bold text-primary">Active</span>
              <span className="font-code-sm text-xs font-bold text-secondary">3 Schemas Verified</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30">
            <span className="font-micro-badge text-micro-badge text-on-surface-variant uppercase font-bold">
              Privileged Actions
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="font-headline-xl text-2xl font-bold text-primary">142 Audited Ops</span>
              <span className="font-code-sm text-xs font-bold text-on-surface-variant">Last 24 Hours</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30">
            <span className="font-micro-badge text-micro-badge text-on-surface-variant uppercase font-bold">
              Edge WAF & Rate-Limits
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="font-headline-xl text-2xl font-bold text-primary">0 Leaks</span>
              <span className="font-code-sm text-xs font-bold text-error">4 Blocked IPs</span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30 flex flex-wrap items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-xs flex-1 min-w-[260px] bg-surface-container-low px-space-sm py-1.5 rounded-lg border border-outline-variant/30">
            <span className="material-symbols-outlined text-primary text-[18px]">search</span>
            <input
              className="w-full bg-transparent text-xs font-body-base text-on-surface placeholder:text-on-surface-variant focus:outline-none"
              placeholder="Search Actor, IP, Order, Event ID, or Hash..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-space-xs flex-wrap">
            <select
              className="bg-surface-container text-xs font-code-sm font-semibold text-primary px-3 py-1.5 rounded-lg border border-outline-variant/20 focus:outline-none"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="ALL">All Event Types</option>
              <option value="CRITICAL">Critical / High Priority</option>
              <option value="PHI">HIPAA / PHI Access</option>
              <option value="WARNING">Warnings & Flags</option>
            </select>

            <select
              className="bg-surface-container text-xs font-code-sm font-semibold text-primary px-3 py-1.5 rounded-lg border border-outline-variant/20 focus:outline-none"
              value={filterTenant}
              onChange={(e) => setFilterTenant(e.target.value)}
            >
              <option value="ALL">All Tenant Schemas</option>
              <option value="central">tenant_central_04</option>
              <option value="east">tenant_east_04</option>
              <option value="public">public_core</option>
            </select>
          </div>
        </div>

        {/* Split View: Table (7 cols) + Forensic Inspector (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md flex-1">
          {/* Audit Trail Table */}
          <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/30 flex flex-col gap-space-sm">
            <div className="flex items-center justify-between border-b border-surface-container pb-space-xs">
              <h3 className="font-headline-sm text-headline-sm font-bold text-primary">
                Immutable Cryptographic Ledger
              </h3>
              <span className="font-code-sm text-xs text-on-surface-variant">
                {filteredEvents.length} Events Recorded
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-surface-container font-micro-badge text-on-surface-variant uppercase">
                    <th className="py-2 px-3">Timestamp / Event</th>
                    <th className="py-2 px-3">Actor & Schema</th>
                    <th className="py-2 px-3">Action</th>
                    <th className="py-2 px-3">Classification</th>
                    <th className="py-2 px-3">Merkle Seal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container font-code-sm">
                  {filteredEvents.map((evt) => {
                    const isSelected = selectedEventId === evt.eventId;
                    return (
                      <tr
                        key={evt.eventId}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-surface-container-high' : 'hover:bg-surface-container-low'
                        }`}
                        onClick={() => setSelectedEventId(evt.eventId)}
                      >
                        <td className="py-2.5 px-3">
                          <strong className="text-primary block font-mono">{evt.eventId}</strong>
                          <span className="text-on-surface-variant text-[11px]">{evt.timestamp}</span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="font-body-medium font-bold text-primary block">{evt.actorName}</span>
                          <span className="text-[10px] text-on-surface-variant">{evt.tenantContext}</span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-primary font-bold block">{evt.action}</span>
                          <span className="text-on-surface-variant text-[11px] truncate max-w-[140px] block">
                            {evt.target}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded font-micro-badge text-[10px] font-bold ${
                              evt.classification === 'HIGH PRIORITY'
                                ? 'bg-primary-container text-on-primary'
                                : evt.classification === 'HIPAA / PHI'
                                ? 'bg-secondary-container text-on-secondary-container'
                                : evt.classification === 'CRITICAL / BLOCKED'
                                ? 'bg-error-container text-on-error-container'
                                : 'bg-surface-container-high text-on-surface'
                            }`}
                          >
                            {evt.classification}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-secondary font-mono text-[11px]">{evt.merkleSeal}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Forensic Inspector Panel */}
          <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/30 flex flex-col gap-space-sm">
            <div className="flex items-center justify-between border-b border-surface-container pb-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[20px]">fingerprint</span>
                <h3 className="font-headline-sm text-headline-sm font-bold text-primary">
                  Forensic Event Inspector
                </h3>
              </div>
              <span className="font-code-sm text-xs font-bold text-secondary">{selectedEvent.eventId}</span>
            </div>

            {/* Compliance Directives Tags */}
            <div className="flex flex-wrap gap-1.5">
              <span className="bg-surface-container px-2 py-0.5 rounded font-code-sm text-[11px] text-primary font-bold">
                FR-ADM-01
              </span>
              <span className="bg-surface-container px-2 py-0.5 rounded font-code-sm text-[11px] text-secondary font-bold">
                HIPAA-164.312(b)
              </span>
              <span className="bg-surface-container px-2 py-0.5 rounded font-code-sm text-[11px] text-primary font-bold">
                SOC2-CC6.1
              </span>
              <span className="bg-surface-container px-2 py-0.5 rounded font-code-sm text-[11px] text-on-surface-variant font-bold">
                NFR-SEC-03
              </span>
            </div>

            {/* PostgreSQL RLS Session Assertion */}
            <div className="bg-slate-900 text-slate-100 p-2.5 rounded-xl font-mono text-xs flex flex-col gap-1 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase">Postgres RLS Session Assert</span>
              <code className="text-emerald-400">
                SET LOCAL app.current_tenant = '{selectedEvent.tenantContext}';
              </code>
            </div>

            {/* Actor & Auth Verification */}
            <div className="bg-surface-container-low p-space-sm rounded-xl flex flex-col gap-1 text-xs">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Actor Name:</span>
                <span className="font-bold text-primary">{selectedEvent.actorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Role / Identity:</span>
                <span className="font-code-sm text-primary">{selectedEvent.actorRole}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Email Context:</span>
                <span className="font-code-sm text-primary">{selectedEvent.actorEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">MFA Attestation:</span>
                <span className="font-code-sm text-secondary font-bold">FIDO2 / WebAuthn Hardware Token</span>
              </div>
            </div>

            {/* Raw JSON Payload */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-micro-badge text-micro-badge text-on-surface-variant uppercase font-bold">
                  Raw Immutable JSON Payload
                </span>
                <button
                  className="text-xs font-code-sm text-primary hover:underline flex items-center gap-1"
                  onClick={handleCopyJson}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {copiedJson ? 'check' : 'content_copy'}
                  </span>
                  {copiedJson ? 'Copied' : 'Copy JSON'}
                </button>
              </div>
              <pre className="bg-slate-950 text-slate-200 p-space-sm rounded-xl font-mono text-[11px] overflow-x-auto max-h-48 border border-slate-800">
                {JSON.stringify(selectedEvent.payloadJson, null, 2)}
              </pre>
            </div>

            {/* ECDSA Digital Signature */}
            <div className="bg-surface-container-low p-space-sm rounded-xl flex flex-col gap-1 border border-secondary/30">
              <div className="flex items-center justify-between text-xs">
                <span className="font-micro-badge text-[10px] text-on-surface-variant uppercase font-bold">
                  ECDSA Digital Signature
                </span>
                <span className="font-code-sm text-secondary font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  Valid Signature
                </span>
              </div>
              <code className="font-mono text-[10px] text-on-surface-variant break-all">
                {selectedEvent.signatureHash}
              </code>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

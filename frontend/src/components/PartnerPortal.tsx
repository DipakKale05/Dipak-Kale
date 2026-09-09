import React, { useState } from 'react';
import { ASSETS, INITIAL_INVENTORY } from '../data/mockData';
import { AppScreen } from '../types';

interface PartnerPortalProps {
  onNavigate: (screen: AppScreen) => void;
}

export const PartnerPortal: React.FC<PartnerPortalProps> = ({ onNavigate }) => {
  const [activeQueueTab, setActiveQueueTab] = useState<'all' | 'need_rx' | 'ready_to_pack' | 'awaiting_courier'>('all');
  const [selectedOrderId, setSelectedOrderId] = useState('ORD-94281');
  const [checklist, setChecklist] = useState({
    pmp: true,
    ndc: true,
    expiry: true,
    coldChain: true,
    tamperSeal: false,
  });
  const [sealConfirmed, setSealConfirmed] = useState(false);
  const [handoverDone, setHandoverDone] = useState(false);

  const orders = [
    {
      id: 'ORD-94281',
      tag: 'URGENT • Cold-Chain',
      patient: 'Marcus Jenkins (Courier assigned)',
      items: 'Insulin Glargine 100u/ml + Paracetamol 500mg',
      eta: 'Awaiting Pack • 25m ETA',
      status: 'Ready to Pack',
      requiresColdChain: true,
      price: '$48.20',
    },
    {
      id: 'ORD-94305',
      tag: 'NEW • OTC Order',
      patient: 'Elena Rossi',
      items: 'Cetirizine HCl 10mg (30 tabs) • Bin A-14',
      eta: 'Placed 4 mins ago',
      status: 'Ready to Pack',
      requiresColdChain: false,
      price: '$8.99',
    },
    {
      id: 'ORD-94311',
      tag: 'PENDING PIC REVIEW',
      patient: 'David Ray',
      items: 'Amoxicillin Trihydrate 500mg (20 caps) • Schedule H',
      eta: 'Need Rx Validation',
      status: 'Need Rx Valid.',
      requiresColdChain: false,
      price: '$14.80',
    },
    {
      id: 'ORD-94255',
      tag: 'COURIER EN ROUTE',
      patient: 'Sarah Connor',
      items: 'Metformin HCl 850mg (60 tabs)',
      eta: 'Courier Arriving in 4 min',
      status: 'Awaiting Courier',
      requiresColdChain: false,
      price: '$11.50',
    },
  ];

  const filteredOrders = orders.filter((o) => {
    if (activeQueueTab === 'all') return true;
    if (activeQueueTab === 'need_rx') return o.status === 'Need Rx Valid.';
    if (activeQueueTab === 'ready_to_pack') return o.status === 'Ready to Pack';
    if (activeQueueTab === 'awaiting_courier') return o.status === 'Awaiting Courier';
    return true;
  });

  const handleSealConfirm = () => {
    setChecklist((prev) => ({ ...prev, tamperSeal: true }));
    setSealConfirmed(true);
  };

  const handleHandover = () => {
    setHandoverDone(true);
    alert('Security Handover Transmitted to Courier Marcus Jenkins! Telemetry bus updated.');
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface font-body-base text-body-base text-on-surface">
      {/* Store Header */}
      <header className="sticky top-0 w-full z-40 bg-surface/95 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-space-md py-3 flex flex-wrap items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-md">
            <div className="w-11 h-11 rounded-xl bg-primary-container text-on-primary flex items-center justify-center font-headline-sm font-bold shadow-sm">
              <span className="material-symbols-outlined text-[24px]">local_pharmacy</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-space-xs flex-wrap">
                <span className="font-headline-sm text-headline-sm font-bold text-primary">
                  Apex Healthcare & Pharmacy Ltd
                </span>
                <span className="bg-surface-container px-2 py-0.5 rounded font-code-sm text-xs text-primary font-semibold">
                  Store ID: DL-88492-MED
                </span>
                <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-micro-badge text-[11px] font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  DISPENSING: ONLINE
                </span>
              </div>
              <div className="flex items-center gap-space-sm text-xs font-data-tabular text-on-surface-variant mt-0.5">
                <span>PIC: Dr. Robert Vance, PharmD</span>
                <span>•</span>
                <span>Queue: 14 orders pending</span>
                <span>•</span>
                <span className="font-code-sm text-secondary font-semibold">RLS Enforced: tenant_central_04</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-space-xs">
            <button
              className="bg-surface-container text-primary hover:bg-surface-container-high px-3 py-2 rounded-lg font-code-sm text-xs font-semibold flex items-center gap-1.5 transition-colors"
              onClick={() => alert('Opening OCR Physical Rx Ingest Scanner...')}
            >
              <span className="material-symbols-outlined text-[16px]">document_scanner</span>
              Ingest Physical Rx
            </button>
            <button
              className="bg-primary text-on-primary hover:bg-primary-container px-3.5 py-2 rounded-lg font-code-sm text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              onClick={() => alert('Pick & Pack Manifest sent to thermal printer B-1.')}
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              Print Pick Manifest
            </button>
          </div>
        </div>
      </header>

      {/* Main Partner Content */}
      <main className="max-w-7xl mx-auto w-full px-space-md py-space-md flex flex-col gap-space-md">
        {/* Top 4 Telemetry Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {/* Card 1: Today's Dispensation */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="font-micro-badge text-micro-badge uppercase font-bold">Today's Dispensation</span>
              <span className="material-symbols-outlined text-[20px] text-secondary">verified</span>
            </div>
            <div className="mt-2">
              <span className="font-headline-xl text-2xl font-bold text-primary">84 Orders</span>
              <div className="flex items-center justify-between text-xs text-on-surface-variant mt-1">
                <span>$1,842.50 GMV</span>
                <span className="text-secondary font-code-sm font-bold">+14.2% vs avg</span>
              </div>
            </div>
          </div>

          {/* Card 2: Incoming to Pack */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="font-micro-badge text-micro-badge uppercase font-bold">Incoming to Pack</span>
              <span className="material-symbols-outlined text-[20px] text-tertiary-container">pending_actions</span>
            </div>
            <div className="mt-2">
              <span className="font-headline-xl text-2xl font-bold text-primary">6 Action Req</span>
              <div className="flex items-center justify-between text-xs text-on-surface-variant mt-1">
                <span>Fast SLA Target</span>
                <span className="font-code-sm font-bold text-primary">8.2 min/order avg</span>
              </div>
            </div>
          </div>

          {/* Card 3: Cold-Chain Units */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="font-micro-badge text-micro-badge uppercase font-bold">Cold-Chain Bio-Storage</span>
              <span className="material-symbols-outlined text-[20px] text-primary">ac_unit</span>
            </div>
            <div className="mt-2">
              <span className="font-headline-xl text-2xl font-bold text-primary">48 Units Stored</span>
              <div className="flex items-center justify-between text-xs text-on-surface-variant mt-1">
                <span>Fridge A: 3.8°C</span>
                <span className="text-secondary font-code-sm font-bold">Fridge B: 4.1°C</span>
              </div>
            </div>
          </div>

          {/* Card 4: Batch Expiry Risk */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="font-micro-badge text-micro-badge uppercase font-bold">Batch Expiry Risk</span>
              <span className="material-symbols-outlined text-[20px] text-error">notification_important</span>
            </div>
            <div className="mt-2">
              <span className="font-headline-xl text-2xl font-bold text-error">2 Batches</span>
              <div className="flex items-center justify-between text-xs text-on-surface-variant mt-1">
                <span>&lt;60 Days Shelf Left</span>
                <span className="text-secondary font-code-sm font-bold">Auto-Triage Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section: Split Queue & Pharmacist Inspection Dossier */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
          {/* Left Column: Dispensation & Packing Queue (7 cols) */}
          <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/30 flex flex-col gap-space-sm">
            <div className="flex items-center justify-between border-b border-surface-container pb-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[20px]">format_list_bulleted</span>
                <h2 className="font-headline-sm text-headline-sm font-bold text-primary">
                  Live Dispensation & Packing Queue
                </h2>
              </div>
              <span className="font-micro-badge text-micro-badge bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">
                18 Active
              </span>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-space-xs overflow-x-auto no-scrollbar py-1">
              <button
                className={`px-3 py-1.5 rounded-lg text-xs font-code-sm font-bold transition-colors whitespace-nowrap ${
                  activeQueueTab === 'all'
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
                onClick={() => setActiveQueueTab('all')}
              >
                All Active (18)
              </button>
              <button
                className={`px-3 py-1.5 rounded-lg text-xs font-code-sm font-bold transition-colors whitespace-nowrap ${
                  activeQueueTab === 'need_rx'
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
                onClick={() => setActiveQueueTab('need_rx')}
              >
                Need Rx Valid. (3)
              </button>
              <button
                className={`px-3 py-1.5 rounded-lg text-xs font-code-sm font-bold transition-colors whitespace-nowrap ${
                  activeQueueTab === 'ready_to_pack'
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
                onClick={() => setActiveQueueTab('ready_to_pack')}
              >
                Ready to Pack (6)
              </button>
              <button
                className={`px-3 py-1.5 rounded-lg text-xs font-code-sm font-bold transition-colors whitespace-nowrap ${
                  activeQueueTab === 'awaiting_courier'
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
                onClick={() => setActiveQueueTab('awaiting_courier')}
              >
                Awaiting Courier (5)
              </button>
            </div>

            {/* Queue Item Cards */}
            <div className="flex flex-col gap-space-xs mt-1">
              {filteredOrders.map((ord) => {
                const isSelected = selectedOrderId === ord.id;
                return (
                  <div
                    key={ord.id}
                    className={`p-space-sm rounded-xl border-2 cursor-pointer transition-all flex flex-col gap-1 ${
                      isSelected
                        ? 'border-primary bg-surface-container-low shadow-sm'
                        : 'border-surface-container hover:border-outline-variant/40 bg-surface-container-lowest'
                    }`}
                    onClick={() => setSelectedOrderId(ord.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-space-xs">
                        <span className="font-code-sm font-bold text-primary">{ord.id}</span>
                        <span
                          className={`font-micro-badge text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                            ord.requiresColdChain
                              ? 'bg-primary-container text-on-primary'
                              : 'bg-surface-container-high text-on-surface'
                          }`}
                        >
                          {ord.tag}
                        </span>
                      </div>
                      <span className="font-code-sm font-bold text-primary">{ord.price}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-body-medium font-semibold text-on-surface">{ord.patient}</span>
                      <span className="font-data-tabular text-on-surface-variant">{ord.eta}</span>
                    </div>
                    <p className="font-body-sm text-xs text-on-surface-variant truncate">{ord.items}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Pharmacist Inspection Dossier & Handover (5 cols) */}
          <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/30 flex flex-col gap-space-sm">
            <div className="flex items-center justify-between border-b border-surface-container pb-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-[20px]">assignment_turned_in</span>
                <h3 className="font-headline-sm text-headline-sm font-bold text-primary">
                  Pharmacist Inspection Dossier
                </h3>
              </div>
              <span className="font-code-sm text-xs font-bold text-primary">{selectedOrderId}</span>
            </div>

            {/* 5-Point Regulatory Dispensation Checklist */}
            <div className="flex flex-col gap-space-xs">
              <span className="font-micro-badge text-micro-badge text-on-surface-variant uppercase font-bold">
                5-Point Regulatory Checklist
              </span>

              <label className="flex items-start gap-space-xs p-2 rounded-lg bg-surface-container-low cursor-pointer">
                <input
                  checked={checklist.pmp}
                  className="mt-0.5 rounded text-secondary"
                  type="checkbox"
                  onChange={(e) => setChecklist({ ...checklist, pmp: e.target.checked })}
                />
                <div className="text-xs">
                  <strong className="text-primary block">1. State PMP Registry Checked</strong>
                  <span className="text-on-surface-variant">Negative for polypharmacy abuse flags</span>
                </div>
              </label>

              <label className="flex items-start gap-space-xs p-2 rounded-lg bg-surface-container-low cursor-pointer">
                <input
                  checked={checklist.ndc}
                  className="mt-0.5 rounded text-secondary"
                  type="checkbox"
                  onChange={(e) => setChecklist({ ...checklist, ndc: e.target.checked })}
                />
                <div className="text-xs">
                  <strong className="text-primary block">2. Batch Barcode NDC Scan Match</strong>
                  <span className="text-on-surface-variant">NDC 0088-2220-33 physical scan matched</span>
                </div>
              </label>

              <label className="flex items-start gap-space-xs p-2 rounded-lg bg-surface-container-low cursor-pointer">
                <input
                  checked={checklist.expiry}
                  className="mt-0.5 rounded text-secondary"
                  type="checkbox"
                  onChange={(e) => setChecklist({ ...checklist, expiry: e.target.checked })}
                />
                <div className="text-xs">
                  <strong className="text-primary block">3. Expiration Date Safeguard</strong>
                  <span className="text-on-surface-variant">Exp 08/2026 &gt; 180-day safety limit</span>
                </div>
              </label>

              <label className="flex items-start gap-space-xs p-2 rounded-lg bg-surface-container-low cursor-pointer">
                <input
                  checked={checklist.coldChain}
                  className="mt-0.5 rounded text-secondary"
                  type="checkbox"
                  onChange={(e) => setChecklist({ ...checklist, coldChain: e.target.checked })}
                />
                <div className="text-xs">
                  <strong className="text-primary block">4. Cold-Chain Logger Attached</strong>
                  <span className="text-on-surface-variant">Calibrated sensor logged @ 4.0°C</span>
                </div>
              </label>

              <div className="p-2.5 rounded-lg bg-surface-container-low flex flex-col gap-2 border border-secondary/30">
                <div className="flex items-center justify-between text-xs">
                  <strong className="text-primary">5. Security Tamper Seal</strong>
                  <span className="font-code-sm font-bold text-secondary">#SEAL-9082-CK</span>
                </div>
                <button
                  className={`w-full py-1.5 rounded font-code-sm text-xs font-bold transition-all ${
                    sealConfirmed
                      ? 'bg-secondary text-on-secondary'
                      : 'bg-primary text-on-primary hover:bg-primary-container'
                  }`}
                  onClick={handleSealConfirm}
                >
                  {sealConfirmed ? '✓ Seal Confirmed & Locked' : 'Confirm Tamper Seal & Log Hash'}
                </button>
              </div>
            </div>

            {/* Courier Handover Protocol */}
            <div className="p-space-sm bg-surface-container-low rounded-xl flex flex-col gap-space-xs border border-outline-variant/20 mt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-micro-badge text-micro-badge text-on-surface-variant uppercase font-bold">
                  Assigned Courier
                </span>
                <span className="font-code-sm text-secondary font-bold">Gatekeeper Active</span>
              </div>
              <div className="flex items-center gap-space-sm">
                <img
                  alt="Courier"
                  className="w-10 h-10 rounded-full object-cover border"
                  src={ASSETS.courierMarcus}
                />
                <div className="flex flex-col text-xs">
                  <span className="font-bold text-primary">Marcus Jenkins (#MC-882)</span>
                  <span className="text-on-surface-variant">Arriving in 4 min • Vehicle Bio-Carrier</span>
                </div>
              </div>

              <div className="flex gap-2 mt-1">
                <button
                  className={`flex-1 py-2 rounded-lg font-code-sm text-xs font-bold transition-colors ${
                    handoverDone
                      ? 'bg-secondary text-on-secondary'
                      : 'bg-primary-container text-on-primary hover:bg-primary'
                  }`}
                  disabled={!sealConfirmed && !handoverDone}
                  onClick={handleHandover}
                >
                  {handoverDone ? 'Handed Over ✓' : 'Authorize Courier Handover'}
                </button>
                <button
                  className="p-2 rounded-lg bg-surface-container text-primary hover:bg-surface-container-high"
                  title="Print FDA Leaflet"
                  onClick={() => alert('FDA MedGuide Leaflet sent to printer.')}
                >
                  <span className="material-symbols-outlined text-[18px]">description</span>
                </button>
              </div>
            </div>

            {/* Pick Route / Shelf Map */}
            <div className="bg-surface-container-low p-space-sm rounded-xl flex flex-col gap-1 text-xs">
              <span className="font-micro-badge text-micro-badge text-on-surface-variant uppercase font-bold">
                Optimized In-Store Pick Route
              </span>
              <div className="flex items-center justify-between text-on-surface font-code-sm mt-1">
                <span className="bg-surface-container px-2 py-0.5 rounded">Stop 1: Biorack (Fridge A • Bin 02)</span>
                <span className="text-primary font-bold">Insulin</span>
              </div>
              <div className="flex items-center justify-between text-on-surface font-code-sm">
                <span className="bg-surface-container px-2 py-0.5 rounded">Stop 2: Dry Shelf (Aisle 3 • Bay C-08)</span>
                <span className="text-primary font-bold">Paracetamol</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Inventory & Batch Expiry Health + Quarantine Spotlight */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
          {/* Inventory Table (8 cols) */}
          <div className="lg:col-span-8 bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/30 flex flex-col gap-space-sm">
            <div className="flex items-center justify-between border-b border-surface-container pb-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[20px]">inventory_2</span>
                <h3 className="font-headline-sm text-headline-sm font-bold text-primary">
                  Inventory & Batch Expiry Health
                </h3>
              </div>
              <button
                className="text-xs font-code-sm text-secondary hover:underline"
                onClick={() => alert('Inventory synced with state drug database.')}
              >
                Sync Now
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-surface-container font-micro-badge text-on-surface-variant uppercase">
                    <th className="py-2 px-3">Medication</th>
                    <th className="py-2 px-3">NDC / Lot</th>
                    <th className="py-2 px-3">Location</th>
                    <th className="py-2 px-3">Count</th>
                    <th className="py-2 px-3">Velocity</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {INITIAL_INVENTORY.map((item, idx) => (
                    <tr key={idx} className="hover:bg-surface-container-low">
                      <td className="py-2.5 px-3">
                        <strong className="text-primary block">{item.genericName}</strong>
                        <span className="text-on-surface-variant text-[11px]">{item.subtitle}</span>
                      </td>
                      <td className="py-2.5 px-3 font-code-sm text-primary">{item.ndcOrLot}</td>
                      <td className="py-2.5 px-3 font-code-sm text-on-surface-variant">{item.location}</td>
                      <td className="py-2.5 px-3 font-bold text-primary">{item.currentCount} units</td>
                      <td className="py-2.5 px-3 text-on-surface-variant">{item.velocity}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded font-micro-badge text-[10px] font-bold ${
                            item.status === 'Optimal'
                              ? 'bg-secondary-container text-on-secondary-container'
                              : item.status === 'Adequate'
                              ? 'bg-surface-container-high text-primary'
                              : 'bg-tertiary-fixed text-on-tertiary-fixed font-bold'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Near Expiry Quarantine Spotlight (4 cols) */}
          <div className="lg:col-span-4 bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-error/30 flex flex-col justify-between gap-space-sm">
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <span className="font-micro-badge text-micro-badge bg-error-container text-on-error-container px-2 py-0.5 rounded font-bold uppercase">
                  Quarantine Alert
                </span>
                <span className="material-symbols-outlined text-error text-[20px]">warning</span>
              </div>
              <h4 className="font-headline-sm text-base font-bold text-primary mt-1">
                Dextromethorphan HBr Syrup
              </h4>
              <p className="font-data-tabular text-xs text-on-surface-variant">
                100ml Oral Solution • Lot #DX-8819 • 32 Days Left
              </p>
              <div className="bg-error-container/30 p-2.5 rounded-lg text-xs text-on-surface flex flex-col gap-1 mt-1">
                <span className="font-bold text-error">Rule: Auto-Liquidate @ 35% Off</span>
                <span className="text-[11px] text-on-surface-variant">
                  System triggers discount liquidation when shelf life drops below 45 days.
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                className="flex-1 bg-tertiary-container text-on-tertiary py-2 rounded-lg font-code-sm text-xs font-bold hover:bg-tertiary"
                onClick={() => alert('Liquidating Lot #DX-8819 to nearest clinic network at 35% discount.')}
              >
                Auto-Liquidate (35% Off)
              </button>
              <button
                className="px-3 py-2 bg-surface-container text-error rounded-lg font-code-sm text-xs font-bold hover:bg-surface-container-high"
                onClick={() => alert('Batch moved to physical Quarantine Vault B.')}
              >
                Quarantine
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

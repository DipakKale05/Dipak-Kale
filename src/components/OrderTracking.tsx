import React, { useState } from 'react';
import { ASSETS, INITIAL_ORDER_TRACKING } from '../data/mockData';
import { AppScreen } from '../types';

interface OrderTrackingProps {
  onNavigate: (screen: AppScreen) => void;
}

export const OrderTracking: React.FC<OrderTrackingProps> = ({ onNavigate }) => {
  const [order, setOrder] = useState(INITIAL_ORDER_TRACKING);
  const [copiedPin, setCopiedPin] = useState(false);
  const [courierPosition, setCourierPosition] = useState(65); // percentage along route
  const [showContactModal, setShowContactModal] = useState(false);
  const [showPharmacistDeskModal, setShowPharmacistDeskModal] = useState(false);

  const handleCopyPin = () => {
    navigator.clipboard?.writeText(order.medicalReleasePin);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2500);
  };

  const handleSimulateStep = () => {
    if (courierPosition < 95) {
      setCourierPosition((prev) => Math.min(95, prev + 10));
      setOrder((prev) => ({
        ...prev,
        etaMinutes: Math.max(3, prev.etaMinutes - 4),
        distanceMiles: Math.max(0.2, Number((prev.distanceMiles - 0.3).toFixed(1))),
      }));
    } else {
      alert('Courier has arrived at 742 Evergreen Terr! Awaiting PIN handover.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface font-body-base text-body-base text-on-surface">
      {/* Top Header */}
      <header className="sticky top-0 w-full z-40 pt-safe bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 px-space-md flex items-center justify-between gap-space-sm max-w-screen-md mx-auto">
          <div className="flex items-center gap-space-sm">
            <button
              aria-label="Navigate back"
              className="w-10 h-10 -ml-space-xs flex items-center justify-center text-primary hover:bg-surface-container rounded-full transition-colors"
              onClick={() => onNavigate('customer-home')}
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-primary font-bold">
                Live Chain-of-Custody
              </span>
              <span className="font-code-sm text-code-sm text-on-surface-variant">
                Order #{order.orderId} • FR-ORD-03
              </span>
            </div>
          </div>
          <div className="flex items-center gap-space-xs">
            <button
              aria-label="Pharmacy support"
              className="w-10 h-10 flex items-center justify-center text-primary-container hover:bg-surface-container rounded-full transition-colors"
              title="Pharmacist Desk"
              onClick={() => setShowPharmacistDeskModal(true)}
            >
              <span className="material-symbols-outlined text-[22px]">contact_support</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-screen-md mx-auto pb-24 px-space-md pt-space-md flex flex-col gap-space-md">
        {/* Status Card & ETA */}
        <div className="w-full bg-primary-container text-on-primary rounded-2xl p-space-md shadow-md flex flex-col gap-space-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary-fixed animate-ping"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-secondary-fixed -ml-4"></span>
              <span className="font-code-sm text-code-sm text-secondary-fixed font-bold uppercase tracking-wide">
                Live Transit Telemetry
              </span>
            </div>
            <span className="bg-white/10 px-space-xs py-0.5 rounded font-micro-badge text-micro-badge text-surface-bright">
              {order.distanceMiles} mi away
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <div>
              <span className="font-headline-xl text-3xl font-bold tracking-tight text-surface-bright">
                ETA {order.etaMinutes} MINS
              </span>
              <p className="font-body-sm text-surface-container-high opacity-90 mt-0.5">
                Out for Delivery • Placed today at {order.placedTime}
              </p>
            </div>
            <span className="font-headline-lg text-headline-lg font-bold text-secondary-container">
              ${order.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Medical Release PIN Gatekeeper Card */}
        <div className="w-full bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border-2 border-secondary/40 flex flex-col sm:flex-row items-center justify-between gap-space-md">
          <div className="flex items-start gap-space-sm">
            <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container flex-shrink-0">
              <span className="material-symbols-outlined text-[26px]">pin</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-space-xs">
                <span className="font-headline-sm text-headline-sm font-bold text-primary">
                  Medical Release PIN
                </span>
                <span className="font-micro-badge text-micro-badge bg-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded font-bold">
                  Gatekeeper
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Share this secure 4-digit token with courier Marcus at your door to unseal medicine.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-space-xs bg-surface-container-low px-space-md py-2 rounded-xl border border-outline-variant/30 flex-shrink-0">
            <span className="font-mono text-2xl font-bold tracking-widest text-primary">
              {order.medicalReleasePin}
            </span>
            <button
              aria-label="Copy PIN"
              className="ml-2 p-1.5 rounded-lg hover:bg-surface-container text-primary transition-colors flex items-center gap-1"
              onClick={handleCopyPin}
            >
              <span className="material-symbols-outlined text-[20px]">
                {copiedPin ? 'check' : 'content_copy'}
              </span>
              <span className="font-micro-badge text-[10px] uppercase font-bold">
                {copiedPin ? 'Copied' : 'Copy'}
              </span>
            </button>
          </div>
        </div>

        {/* Live SVG Geofenced Map Module */}
        <div className="w-full bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/30 flex flex-col gap-space-sm overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-secondary text-[20px]">map</span>
              <h2 className="font-headline-sm text-headline-sm font-bold text-primary">
                Geofenced Route & Transit Audit
              </h2>
            </div>
            <button
              className="text-xs font-code-sm text-secondary hover:underline flex items-center gap-1"
              onClick={handleSimulateStep}
            >
              <span className="material-symbols-outlined text-[14px]">refresh</span>
              Simulate Transit Update
            </button>
          </div>

          <div className="w-full h-64 bg-slate-900 rounded-xl relative overflow-hidden border border-slate-700">
            {/* Background Map Graphic */}
            <img
              alt="Map route visualization"
              className="w-full h-full object-cover opacity-40 filter brightness-75"
              src={ASSETS.mapBackground}
            />

            {/* SVG Interactive Overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 240">
              {/* Route Path */}
              <defs>
                <linearGradient id="routeGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#006c4a" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#bfe9fc" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              <path
                d="M 50 180 C 120 180, 140 100, 240 110 S 320 60, 350 70"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeDasharray="6 6"
                strokeWidth="4"
              />
              <path
                d="M 50 180 C 120 180, 140 100, 240 110 S 320 60, 350 70"
                fill="none"
                stroke="url(#routeGradient)"
                strokeDasharray="200"
                strokeDashoffset={200 - (courierPosition / 100) * 200}
                strokeWidth="4"
              />
            </svg>

            {/* Origin Pharmacy Pin */}
            <div className="absolute left-8 bottom-10 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center shadow-lg border-2 border-white">
                <span className="material-symbols-outlined text-[18px]">local_pharmacy</span>
              </div>
              <span className="font-micro-badge text-[10px] text-white bg-black/70 px-1.5 py-0.5 rounded mt-1 whitespace-nowrap">
                WellSpring Meds
              </span>
            </div>

            {/* Moving Courier Marker */}
            <div
              className="absolute flex flex-col items-center transition-all duration-700 ease-out"
              style={{
                left: `${20 + (courierPosition / 100) * 65}%`,
                top: `${45 - Math.sin((courierPosition / 100) * Math.PI) * 15}%`,
              }}
            >
              <div className="w-9 h-9 rounded-full bg-primary-fixed text-primary flex items-center justify-center shadow-xl border-2 border-secondary animate-bounce">
                <span className="material-symbols-outlined text-[20px]">directions_bike</span>
              </div>
              <div className="bg-primary/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-full font-micro-badge text-[9px] flex items-center gap-1 border border-white/20 whitespace-nowrap shadow">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping"></span>
                Marcus J. ({order.etaMinutes}m)
              </div>
            </div>

            {/* Destination Home Pin */}
            <div className="absolute right-8 top-12 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg border-2 border-white">
                <span className="material-symbols-outlined text-[18px]">home</span>
              </div>
              <span className="font-micro-badge text-[10px] text-white bg-black/70 px-1.5 py-0.5 rounded mt-1 whitespace-nowrap">
                742 Evergreen Terr
              </span>
            </div>

            {/* Live Environmental Sensor Overlay */}
            <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-white font-code-sm text-xs flex items-center gap-3 border border-white/10">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-secondary text-[16px]">thermostat</span>
                <span>{order.temperatureFahrenheit}°F (Optimal)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-secondary-fixed text-[16px]">lock</span>
                <span>{order.sealNumber} Intact</span>
              </div>
            </div>
          </div>
        </div>

        {/* Courier Dossier Card */}
        <div className="w-full bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/30 flex items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm min-w-0">
            <img
              alt="Marcus Jenkins Courier"
              className="w-14 h-14 rounded-full object-cover border-2 border-secondary flex-shrink-0"
              src={order.courierAvatar}
            />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-space-xs">
                <span className="font-headline-sm text-headline-sm font-bold text-primary truncate">
                  {order.courierName}
                </span>
                <span
                  className="material-symbols-outlined text-secondary text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                {order.courierBadge} • Express Medical Courier
              </p>
              <span className="font-micro-badge text-micro-badge text-secondary font-bold">
                HIPAA & Cold-Chain Certified
              </span>
            </div>
          </div>

          <div className="flex items-center gap-space-xs flex-shrink-0">
            <button
              aria-label="Call Courier"
              className="w-10 h-10 rounded-full bg-surface-container text-primary hover:bg-surface-container-high flex items-center justify-center transition-colors"
              onClick={() => setShowContactModal(true)}
            >
              <span className="material-symbols-outlined text-[20px]">call</span>
            </button>
            <button
              aria-label="Message Courier"
              className="w-10 h-10 rounded-full bg-surface-container text-primary hover:bg-surface-container-high flex items-center justify-center transition-colors"
              onClick={() => setShowContactModal(true)}
            >
              <span className="material-symbols-outlined text-[20px]">chat</span>
            </button>
          </div>
        </div>

        {/* Audit Chain-of-Custody Timeline (FR-ORD-03) */}
        <div className="w-full bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/30 flex flex-col gap-space-sm">
          <div className="flex items-center justify-between border-b border-surface-container pb-space-xs">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-secondary text-[20px]">history_edu</span>
              <h2 className="font-headline-sm text-headline-sm font-bold text-primary">
                Audit Chain of Custody (FR-ORD-03)
              </h2>
            </div>
            <span className="font-micro-badge text-micro-badge bg-surface-container text-on-surface-variant px-2 py-0.5 rounded">
              Immutable SHA-256
            </span>
          </div>

          <div className="flex flex-col gap-space-md relative pl-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-surface-container">
            {/* Step 1 */}
            <div className="relative flex flex-col">
              <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-secondary"></span>
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-sm font-bold text-primary">Prescription Validated</span>
                <span className="font-code-sm text-xs text-on-surface-variant">10:15 AM</span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                Automated OCR validation passed with zero drug-drug interaction warnings.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col">
              <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-secondary"></span>
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-sm font-bold text-primary">
                  Dispensed & Batch Audited
                </span>
                <span className="font-code-sm text-xs text-on-surface-variant">10:22 AM</span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                Verified by Dr. Kimberly Young, PharmD. Lot #CT-4421 & #PA-1092 logged.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col">
              <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-secondary"></span>
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-sm font-bold text-primary">Sealed & Dispatched</span>
                <span className="font-code-sm text-xs text-on-surface-variant">10:38 AM</span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                Tamper-evident seal {order.sealNumber} attached. Handed to courier #MC-882.
              </p>
            </div>

            {/* Step 4: Active */}
            <div className="relative flex flex-col">
              <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-primary-container ring-4 ring-secondary/20"></span>
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-sm font-bold text-primary-container">
                  Out for Delivery (Active)
                </span>
                <span className="font-code-sm text-xs text-secondary font-bold">Now</span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                Active thermal telemetry: 68.4°F ambient within normal compliance envelope.
              </p>
            </div>

            {/* Step 5: Pending */}
            <div className="relative flex flex-col opacity-60">
              <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-surface-container-highest"></span>
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-sm font-bold text-on-surface-variant">
                  Recipient PIN Handover
                </span>
                <span className="font-code-sm text-xs text-on-surface-variant">Pending</span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                Requires entering PIN {order.medicalReleasePin} to release custody.
              </p>
            </div>
          </div>
        </div>

        {/* Itemized Order Package Details */}
        <div className="w-full bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/30 flex flex-col gap-space-sm">
          <h2 className="font-headline-sm text-headline-sm font-bold text-primary">
            Verified Package Contents
          </h2>
          <div className="flex flex-col divide-y divide-surface-container">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-space-xs flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-body-medium font-bold text-primary">{item.name}</span>
                  <span className="font-data-tabular text-xs text-on-surface-variant">{item.form}</span>
                  <span className="font-code-sm text-[11px] text-secondary">
                    LOT #{item.lotNumber} • Exp {item.expDate}
                  </span>
                </div>
                <span className="font-headline-sm text-sm font-bold text-primary">${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="pt-space-xs border-t border-surface-container flex items-center justify-between">
            <button
              className="text-xs font-code-sm text-primary hover:underline flex items-center gap-1"
              onClick={() => alert('Downloading Cryptographically Signed FDA MedGuide & Invoice...')}
            >
              <span className="material-symbols-outlined text-[16px]">receipt_long</span>
              Download Authenticated Invoice (PDF)
            </button>
            <span className="font-headline-sm text-headline-sm font-bold text-primary">
              Total: ${order.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Action Triggers to Other Portals */}
        <div className="p-space-md bg-surface-container-low rounded-xl flex items-center justify-between gap-space-sm border border-outline-variant/20">
          <div className="flex flex-col">
            <span className="font-code-sm text-xs text-primary font-bold uppercase">Cross-Portal Synchrony</span>
            <p className="font-body-sm text-xs text-on-surface-variant">
              This order is actively being tracked in the Partner Portal & TrustOps Telemetry.
            </p>
          </div>
          <button
            className="bg-primary-container text-on-primary px-3 py-1.5 rounded-lg font-code-sm text-xs font-bold hover:bg-primary whitespace-nowrap"
            onClick={() => onNavigate('trustops-fulfillment')}
          >
            View in TrustOps →
          </button>
        </div>
      </main>

      {/* Courier Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-sm w-full p-space-lg shadow-2xl flex flex-col gap-space-md">
            <div className="flex items-center gap-space-sm">
              <img
                alt="Courier"
                className="w-12 h-12 rounded-full object-cover"
                src={order.courierAvatar}
              />
              <div>
                <h3 className="font-headline-sm font-bold text-primary">{order.courierName}</h3>
                <p className="font-code-sm text-xs text-secondary">Verified Express Courier #MC-882</p>
              </div>
            </div>
            <p className="font-body-sm text-on-surface-variant">
              Contact courier for gate code or drop-off instructions. Handover will strictly require PIN{' '}
              <strong className="text-primary">{order.medicalReleasePin}</strong>.
            </p>
            <div className="flex flex-col gap-space-xs">
              <button
                className="w-full bg-primary text-on-primary py-2.5 rounded-xl font-body-medium font-bold hover:bg-primary/90 flex items-center justify-center gap-2"
                onClick={() => {
                  alert('Calling courier Marcus Jenkins at +1 (555) 019-2831...');
                  setShowContactModal(false);
                }}
              >
                <span className="material-symbols-outlined text-[18px]">call</span>
                Call Courier (+1 555-019-2831)
              </button>
              <button
                className="w-full bg-surface-container text-primary py-2.5 rounded-xl font-body-medium hover:bg-surface-container-high flex items-center justify-center gap-2"
                onClick={() => {
                  alert('Secure SMS chat initiated with courier Marcus Jenkins.');
                  setShowContactModal(false);
                }}
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                Send Secure SMS
              </button>
            </div>
            <button
              className="text-center font-body-sm text-on-surface-variant hover:text-on-surface"
              onClick={() => setShowContactModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Pharmacist Desk Modal */}
      {showPharmacistDeskModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-space-lg shadow-2xl flex flex-col gap-space-md">
            <div className="flex items-center gap-space-sm">
              <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                <span className="material-symbols-outlined text-[24px]">local_pharmacy</span>
              </div>
              <div>
                <h3 className="font-headline-sm font-bold text-primary">WellSpring Meds Dispensing Desk</h3>
                <p className="font-code-sm text-xs text-on-surface-variant">
                  Supervising Pharmacist: Dr. Kimberly Young, PharmD
                </p>
              </div>
            </div>
            <div className="bg-surface-container-low p-space-sm rounded-xl flex flex-col gap-1 text-xs font-code-sm text-on-surface-variant">
              <div className="flex justify-between">
                <span>Pharmacy License:</span>
                <span className="font-bold text-primary">DL-88492-MED</span>
              </div>
              <div className="flex justify-between">
                <span>Verification Time:</span>
                <span className="font-bold text-primary">Today, 10:22 AM</span>
              </div>
              <div className="flex justify-between">
                <span>Batch Sealed:</span>
                <span className="font-bold text-secondary">#SEAL-9082</span>
              </div>
            </div>
            <p className="font-body-sm text-on-surface">
              Have questions regarding contraindications, missed dosages, or active ingredients? Pharmacists are
              available 24/7.
            </p>
            <div className="flex gap-space-sm">
              <button
                className="flex-1 bg-primary text-on-primary py-2.5 rounded-xl font-body-medium font-bold hover:bg-primary-container"
                onClick={() => {
                  alert('Connecting to Dr. Kimberly Young, PharmD...');
                  setShowPharmacistDeskModal(false);
                }}
              >
                Connect to Pharmacist
              </button>
              <button
                className="px-4 py-2.5 bg-surface-container text-on-surface rounded-xl font-body-medium hover:bg-surface-container-high"
                onClick={() => setShowPharmacistDeskModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

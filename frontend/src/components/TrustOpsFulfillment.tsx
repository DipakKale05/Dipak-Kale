import React, { useState } from 'react';
import { ASSETS } from '../data/mockData';
import { AppScreen } from '../types';

interface TrustOpsFulfillmentProps {
  onNavigate: (screen: AppScreen) => void;
}

export const TrustOpsFulfillment: React.FC<TrustOpsFulfillmentProps> = ({ onNavigate }) => {
  const [selectedShipment, setSelectedShipment] = useState('ORD-94281');
  const [activeFilter, setActiveFilter] = useState<'all' | 'cold' | 'exceptions' | 'delivered'>('exceptions');
  const [pinOverrideIssued, setPinOverrideIssued] = useState(false);
  const [holdTriggered, setHoldTriggered] = useState(false);
  const [telemetryLogs, setTelemetryLogs] = useState([
    { time: '14:04:12.190', topic: 'telemetry.courier.gps', payload: 'ORD-94281 | Lat 39.7817 Long -89.6501 | Speed 0mph' },
    { time: '14:03:55.042', topic: 'security.gatekeeper.pin', payload: 'ORD-94281 | PIN_MISMATCH | Attempt: 2/3 | Hash: 0x4829' },
    { time: '14:02:11.890', topic: 'telemetry.iot.sensor', payload: 'ORD-94190 | TEMP_WARN | 7.6C vs Max 8.0C | Sensor #SN-991' },
    { time: '14:01:04.102', topic: 'logistics.dispatch.seal', payload: 'ORD-94302 | SEAL_CONFIRMED | Seal #SEAL-9082 | Valid' },
  ]);

  const shipments = [
    {
      id: 'ORD-94281',
      shipmentCode: 'SHP-94281',
      status: 'PIN MISMATCH',
      statusType: 'error',
      route: 'WellSpring Meds → 742 Evergreen Terr',
      courier: 'Marcus Jenkins (#MC-882)',
      temp: '20.2°C Ambient',
      seal: '#SEAL-9082 (Intact)',
      eta: 'Stationary (4 mins)',
      urgency: 'Immediate Action',
    },
    {
      id: 'ORD-94190',
      shipmentCode: 'SHP-94190',
      status: 'TEMP WARN (7.6°C)',
      statusType: 'warning',
      route: 'Apex Medicos → Memorial Clinic Vault',
      courier: 'David Alvarez (#MC-412)',
      temp: '7.6°C (Near Ceiling)',
      seal: '#SEAL-7714 (Intact)',
      eta: 'In Transit • 8 mins',
      urgency: 'Monitor',
    },
    {
      id: 'ORD-94302',
      shipmentCode: 'SHP-94302',
      status: 'EN ROUTE',
      statusType: 'success',
      route: 'WellSpring Meds → 12 Elm Street',
      courier: 'Samantha Li (#MC-602)',
      temp: '4.2°C Optimal',
      seal: '#SEAL-9082 (Intact)',
      eta: 'In Transit • 14 mins',
      urgency: 'Normal',
    },
    {
      id: 'ORD-94255',
      shipmentCode: 'SHP-94255',
      status: 'DISPATCHED',
      statusType: 'info',
      route: 'Apex Medicos → 404 Oak Ave',
      courier: 'Marcus Jenkins (#MC-882)',
      temp: '3.8°C Optimal',
      seal: '#SEAL-4411 (Intact)',
      eta: 'Departed Pharmacy',
      urgency: 'Normal',
    },
  ];

  const handleSimulateWebhook = () => {
    const now = new Date();
    const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${Math.floor(Math.random() * 900 + 100)}`;
    setTelemetryLogs((prev) => [
      { time: timeStr, topic: 'logistics.transit.ping', payload: `ORD-94281 | BLE_SYNC | Temp: 20.1°C | Lock: SECURE` },
      ...prev.slice(0, 5),
    ]);
  };

  const handleBypassOtp = () => {
    setPinOverrideIssued(true);
    alert('One-Time Bypass OTP sent via SMS to patient +1 (555) 018-9921. Gatekeeper bypass logged in audit trail.');
  };

  const handleHold = () => {
    setHoldTriggered(true);
    alert('Emergency Courier Hold Transmitted! Marcus Jenkins instructed to abort handover and maintain seal.');
  };

  return (
    <div className="flex min-h-screen bg-surface font-body-base text-body-base text-on-surface">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-surface-container-low border-r border-outline-variant/30 flex flex-col justify-between hidden md:flex">
        <div className="flex flex-col">
          {/* Brand Header */}
          <div className="p-space-md border-b border-surface-container flex items-center gap-space-sm">
            <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">shield</span>
            </div>
            <div>
              <h1 className="font-headline-sm text-sm font-bold text-primary">TrustOps Enterprise</h1>
              <span className="font-code-sm text-[11px] text-secondary font-semibold">Governance Platform</span>
            </div>
          </div>

          {/* Tenant Switcher */}
          <div className="p-space-sm m-space-sm bg-surface-container rounded-xl flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-micro-badge text-[10px] text-on-surface-variant uppercase">Active Schema</span>
              <span className="font-code-sm text-xs font-bold text-primary">PROD-01 (tenant_primary)</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 p-space-sm">
            <button
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-code-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors"
              onClick={() => onNavigate('partner-portal')}
            >
              <span className="material-symbols-outlined text-[18px]">dashboard</span>
              Command & Overview
            </button>
            <button
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-code-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors"
              onClick={() => alert('KYC Verification: 4 Pending State Pharmacy Licenses under review.')}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                <span>Seller KYC</span>
              </div>
              <span className="bg-tertiary-fixed text-on-tertiary-fixed px-1.5 py-0.2 rounded font-micro-badge text-[10px] font-bold">
                4 PENDING
              </span>
            </button>
            <button
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-code-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors"
              onClick={() => onNavigate('medication-detail')}
            >
              <span className="material-symbols-outlined text-[18px]">medication</span>
              Catalog & Moderation
            </button>
            <button className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-code-sm font-bold bg-primary text-on-primary shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                <span>Shipment & Telemetry</span>
              </div>
              <span className="bg-error text-on-error px-1.5 py-0.2 rounded font-micro-badge text-[10px] font-bold">
                2 ALERTS
              </span>
            </button>
            <button
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-code-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors"
              onClick={() => onNavigate('trustops-audit')}
            >
              <span className="material-symbols-outlined text-[18px]">lock_clock</span>
              Security & Audit Logs
            </button>
            <button
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-code-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors"
              onClick={() => onNavigate('architecture-prd')}
            >
              <span className="material-symbols-outlined text-[18px]">architecture</span>
              Architecture & PRD
            </button>
          </nav>
        </div>

        {/* User Card */}
        <div className="p-space-md border-t border-surface-container flex items-center gap-space-sm">
          <img
            alt="Elena Vance"
            className="w-9 h-9 rounded-full object-cover border"
            src={ASSETS.officerElena}
          />
          <div className="flex flex-col min-w-0">
            <span className="font-body-medium text-xs font-bold text-primary truncate">Elena Vance</span>
            <span className="font-code-sm text-[10px] text-on-surface-variant truncate">Lead Trust Officer</span>
          </div>
        </div>
      </aside>

      {/* Main Panel Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur-xl border-b border-outline-variant/30 px-space-md py-3 flex items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-primary text-[24px]">satellite_alt</span>
            <div>
              <h2 className="font-headline-sm text-headline-sm font-bold text-primary">
                Shipment & Fulfillment Telemetry
              </h2>
              <span className="font-code-sm text-xs text-on-surface-variant">
                Live IoT & Handover Gatekeeper • FR-ORD-03 / FR-ADM-02
              </span>
            </div>
          </div>

          <div className="flex items-center gap-space-xs">
            <button
              className="bg-surface-container hover:bg-surface-container-high text-primary px-3 py-1.5 rounded-lg font-code-sm text-xs font-bold flex items-center gap-1 transition-colors"
              onClick={handleSimulateWebhook}
            >
              <span className="material-symbols-outlined text-[16px]">sync</span>
              Simulate Transit Webhook
            </button>
            <button
              className="bg-error-container hover:bg-error/20 text-on-error-container px-3 py-1.5 rounded-lg font-code-sm text-xs font-bold flex items-center gap-1 transition-colors"
              onClick={handleHold}
            >
              <span className="material-symbols-outlined text-[16px]">front_hand</span>
              Emergency Courier Hold
            </button>
          </div>
        </header>

        {/* Content Container */}
        <main className="p-space-md flex flex-col gap-space-md max-w-7xl w-full mx-auto">
          {/* Top 4 Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30">
              <span className="font-micro-badge text-micro-badge text-on-surface-variant uppercase font-bold">
                Active Shipments En Route
              </span>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="font-headline-xl text-2xl font-bold text-primary">1,248</span>
                <span className="font-code-sm text-xs font-bold text-secondary">98.2% On-Time SLA</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30">
              <span className="font-micro-badge text-micro-badge text-on-surface-variant uppercase font-bold">
                Cold-Chain Controlled
              </span>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="font-headline-xl text-2xl font-bold text-primary">342 Units</span>
                <span className="font-code-sm text-xs font-bold text-primary">Active BLE Logger</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-error/40">
              <span className="font-micro-badge text-micro-badge text-error uppercase font-bold">
                Fulfillment Exceptions
              </span>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="font-headline-xl text-2xl font-bold text-error">2 Urgent</span>
                <span className="font-code-sm text-xs font-bold text-error">1 PIN / 1 Temp</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30">
              <span className="font-micro-badge text-micro-badge text-on-surface-variant uppercase font-bold">
                Courier Network Trust
              </span>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="font-headline-xl text-2xl font-bold text-secondary">99.4%</span>
                <span className="font-code-sm text-xs font-bold text-on-surface-variant">0 Breached Bags</span>
              </div>
            </div>
          </div>

          {/* High-Density Telemetry Queue & Live Dossier (Split 7 / 5) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
            {/* Left Column: High-Density Telemetry Queue Table (7 cols) */}
            <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/30 flex flex-col gap-space-sm">
              <div className="flex items-center justify-between border-b border-surface-container pb-space-xs">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[20px]">monitor_heart</span>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-primary">
                    Live Transit & Gatekeeper Queue
                  </h3>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    className={`px-2.5 py-1 rounded text-xs font-code-sm font-bold ${
                      activeFilter === 'exceptions'
                        ? 'bg-error text-on-error'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                    onClick={() => setActiveFilter('exceptions')}
                  >
                    Exceptions (2)
                  </button>
                  <button
                    className={`px-2.5 py-1 rounded text-xs font-code-sm font-bold ${
                      activeFilter === 'all'
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                    onClick={() => setActiveFilter('all')}
                  >
                    All Active (1,248)
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-space-xs mt-1">
                {shipments.map((shp) => {
                  const isSelected = selectedShipment === shp.id;
                  return (
                    <div
                      key={shp.id}
                      className={`p-space-sm rounded-xl border-2 cursor-pointer transition-all flex flex-col gap-1.5 ${
                        isSelected
                          ? 'border-primary bg-surface-container-low shadow-sm'
                          : 'border-surface-container hover:border-outline-variant/40 bg-surface-container-lowest'
                      }`}
                      onClick={() => setSelectedShipment(shp.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-space-xs">
                          <span className="font-code-sm font-bold text-primary">{shp.id}</span>
                          <span
                            className={`px-2 py-0.5 rounded font-micro-badge text-[10px] font-bold uppercase ${
                              shp.statusType === 'error'
                                ? 'bg-error-container text-on-error-container'
                                : shp.statusType === 'warning'
                                ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                                : 'bg-secondary-container text-on-secondary-container'
                            }`}
                          >
                            {shp.status}
                          </span>
                        </div>
                        <span className="font-code-sm text-xs font-bold text-on-surface">{shp.eta}</span>
                      </div>

                      <div className="text-xs font-body-medium text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">route</span>
                        <span>{shp.route}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-on-surface-variant font-code-sm">
                        <span>Courier: {shp.courier}</span>
                        <div className="flex items-center gap-2">
                          <span className={shp.statusType === 'warning' ? 'text-error font-bold' : ''}>
                            {shp.temp}
                          </span>
                          <span>{shp.seal}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Live Shipment Dossier & Handover Gatekeeper (5 cols) */}
            <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/30 flex flex-col gap-space-sm">
              <div className="flex items-center justify-between border-b border-surface-container pb-space-xs">
                <div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-primary">
                    Handover Gatekeeper Dossier
                  </h3>
                  <span className="font-code-sm text-xs text-on-surface-variant">Order #ORD-94281 • Live GPS</span>
                </div>
                <span className="bg-error-container text-on-error-container px-2 py-0.5 rounded font-micro-badge text-micro-badge uppercase font-bold">
                  2/3 Attempts
                </span>
              </div>

              {/* GPS Live Map Thumbnail */}
              <div className="w-full h-36 rounded-xl bg-slate-900 relative overflow-hidden border border-slate-700">
                <img
                  alt="GPS Map"
                  className="w-full h-full object-cover opacity-50"
                  src={ASSETS.mapBackground}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 bg-black/40 backdrop-blur-[1px]">
                  <span className="material-symbols-outlined text-secondary text-2xl animate-bounce">
                    location_on
                  </span>
                  <span className="font-code-sm text-xs text-white font-bold">742 Evergreen Terr, Springfield</span>
                  <span className="font-micro-badge text-[10px] text-secondary-fixed">
                    Courier stationary outside building (4 mins)
                  </span>
                </div>
              </div>

              {/* IoT Sensor Strip */}
              <div className="grid grid-cols-3 gap-space-xs text-center text-xs">
                <div className="bg-surface-container-low p-2 rounded-lg">
                  <span className="font-micro-badge text-[10px] text-on-surface-variant uppercase block">Thermal</span>
                  <span className="font-code-sm font-bold text-primary">20.2°C (OK)</span>
                </div>
                <div className="bg-surface-container-low p-2 rounded-lg">
                  <span className="font-micro-badge text-[10px] text-on-surface-variant uppercase block">Tamper Lock</span>
                  <span className="font-code-sm font-bold text-secondary">UNBROKEN</span>
                </div>
                <div className="bg-surface-container-low p-2 rounded-lg">
                  <span className="font-micro-badge text-[10px] text-on-surface-variant uppercase block">Tracker Batt</span>
                  <span className="font-code-sm font-bold text-primary">88%</span>
                </div>
              </div>

              {/* Handover Gatekeeper Alert Widget */}
              <div className="p-space-sm bg-error-container/30 border border-error/40 rounded-xl flex flex-col gap-space-xs">
                <div className="flex items-center gap-space-xs text-error">
                  <span className="material-symbols-outlined text-[20px]">password</span>
                  <strong className="font-headline-sm text-xs font-bold uppercase tracking-wide">
                    Gatekeeper PIN Mismatch Detected
                  </strong>
                </div>

                <div className="flex items-center justify-between text-xs font-code-sm bg-white/60 p-2 rounded">
                  <div>
                    <span className="text-on-surface-variant block text-[10px]">Expected Token</span>
                    <span className="font-bold text-secondary text-sm">4 8 9 2</span>
                  </div>
                  <div className="text-right">
                    <span className="text-error block text-[10px]">Recipient Input (Attempt 2)</span>
                    <span className="font-bold text-error text-sm">4 8 2 9 (FAIL)</span>
                  </div>
                </div>

                <p className="text-[11px] text-on-surface leading-tight">
                  Courier Marcus Jenkins is halted at doorstep. Medically sealed package cannot be handed over until
                  token matches.
                </p>
              </div>

              {/* Dispatcher Triage Override Actions */}
              <div className="flex flex-col gap-2">
                <button
                  className={`w-full py-2.5 rounded-xl font-code-sm text-xs font-bold transition-all ${
                    pinOverrideIssued
                      ? 'bg-secondary text-on-secondary'
                      : 'bg-primary text-on-primary hover:bg-primary-container'
                  }`}
                  onClick={handleBypassOtp}
                >
                  {pinOverrideIssued ? 'Bypass OTP Issued to Patient ✓' : 'Issue One-Time Bypass OTP to Patient Phone'}
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    className="py-2 rounded-lg bg-surface-container text-error hover:bg-surface-container-high font-code-sm text-xs font-bold"
                    onClick={() => alert('Order #ORD-94281 flagged: Abort delivery and return to pharmacy vault.')}
                  >
                    Return to Safe
                  </button>
                  <button
                    className="py-2 rounded-lg bg-surface-container text-primary hover:bg-surface-container-high font-code-sm text-xs font-bold"
                    onClick={() => alert('Calling Dr. Kimberly Young at WellSpring Meds...')}
                  >
                    Call Pharmacist
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Kafka Telemetry Bus Real-Time Stream */}
          <div className="bg-slate-950 text-slate-100 rounded-2xl p-space-md font-mono text-xs shadow-md border border-slate-800 flex flex-col gap-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-bold text-emerald-400">Kafka Telemetry Bus (topic: telemetry.fulfillment.*)</span>
              </div>
              <span className="text-slate-500 text-[10px]">Partition 0 • Offset 8,829,104</span>
            </div>
            <div className="flex flex-col gap-1 overflow-x-auto text-[11px]">
              {telemetryLogs.map((log, idx) => (
                <div key={idx} className="flex items-center gap-3 py-0.5 hover:bg-slate-900 px-1 rounded">
                  <span className="text-slate-500">{log.time}</span>
                  <span className="text-cyan-400">{log.topic}</span>
                  <span className="text-slate-300">{log.payload}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

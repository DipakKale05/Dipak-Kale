import React, { useState } from 'react';
import { ASSETS } from '../data/mockData';
import { AppScreen, AuthUser } from '../types';

interface CustomerHomeProps {
  onNavigate: (screen: AppScreen) => void;
  cartCount: number;
  onAddToCart: () => void;
  currentUser?: AuthUser | null;
}

export const CustomerHome: React.FC<CustomerHomeProps> = ({ onNavigate, cartCount, onAddToCart, currentUser }) => {
  const [isGuidanceOpen, setIsGuidanceOpen] = useState(false);
  const [showUrgentModal, setShowUrgentModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState<'rx' | 'barcode' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Pain & Fever');

  const categories = [
    { label: 'Pain & Fever', icon: 'thermostat' },
    { label: 'Allergy & Cold', icon: 'air' },
    { label: 'Cardiac Care', icon: 'cardiology' },
    { label: 'Diabetes', icon: 'bloodtype' },
    { label: 'Digestive', icon: 'vital_signs' },
    { label: 'Antibiotics (Rx)', icon: 'prescriptions' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-surface font-body-base text-body-base text-on-surface">
      {/* Mobile Top Header */}
      <header className="sticky top-0 w-full z-40 pt-safe bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 px-space-md flex items-center justify-between gap-space-sm max-w-screen-md mx-auto">
          <div className="flex items-center gap-space-sm min-w-0 flex-1">
            <img
              alt="GenricMed logo"
              className="h-8 w-auto object-contain flex-shrink-0"
              src={ASSETS.brandLogo}
            />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-space-xs">
                <span className="font-headline-sm text-headline-sm text-primary-container truncate font-bold">
                  GenricMed
                </span>
                <span className="px-space-xs py-0.5 rounded-DEFAULT bg-secondary-container text-on-secondary-container font-micro-badge text-micro-badge uppercase font-bold">
                  Verified
                </span>
              </div>
              <div className="flex items-center gap-space-xs text-on-surface-variant min-w-0">
                <span className="material-symbols-outlined text-[14px] text-secondary flex-shrink-0">
                  location_on
                </span>
                <span className="font-body-sm text-body-sm truncate">Deliver to: 742 Evergreen Terr...</span>
                <span className="material-symbols-outlined text-[14px] flex-shrink-0">expand_more</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-space-xs flex-shrink-0">
            <button
              aria-label="Notifications"
              className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-on-surface rounded-full relative transition-colors"
              onClick={() => onNavigate('order-tracking')}
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error ring-2 ring-surface animate-ping"></span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error"></span>
            </button>
            <button
              aria-label={currentUser ? `Account: ${currentUser.name}` : 'Sign In or Register'}
              className="w-8 h-8 rounded-full bg-primary hover:bg-primary-container flex items-center justify-center flex-shrink-0 text-on-primary transition-all ring-1 ring-white/20 shadow-xs"
              title={currentUser ? `Signed in as ${currentUser.name} (${currentUser.role}). Click to view or switch account.` : 'Sign in / Register'}
              onClick={() => onNavigate('login-register')}
            >
              {currentUser?.avatar ? (
                <img alt={currentUser.name} className="w-full h-full rounded-full object-cover" src={currentUser.avatar} />
              ) : currentUser ? (
                <span className="font-code-sm text-xs font-bold">{currentUser.name.charAt(0)}</span>
              ) : (
                <span className="material-symbols-outlined text-[18px]">person</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 w-full max-w-screen-md mx-auto pb-28 px-space-md pt-space-md flex flex-col gap-space-md">
        {/* Search Bar with Document & Barcode Scanners */}
        <div className="relative w-full shadow-sm rounded-xl bg-surface-container-lowest flex items-center px-space-md py-space-xs transition-all border border-outline-variant/30 focus-within:border-secondary focus-within:shadow-md">
          <span className="material-symbols-outlined text-primary-container text-[20px] flex-shrink-0 mr-space-xs">
            search
          </span>
          <input
            className="w-full bg-transparent font-body-base text-body-base text-on-surface placeholder:text-on-surface-variant focus:outline-none truncate py-1.5"
            placeholder="Search generic salt, brand name, NDC..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex items-center gap-space-xs flex-shrink-0 ml-space-xs">
            <button
              aria-label="Upload or Scan Prescription"
              className="w-8 h-8 rounded-full bg-surface-container-low text-primary-container hover:bg-primary-container hover:text-on-primary flex items-center justify-center transition-colors"
              title="Upload / Scan Physical Rx"
              onClick={() => setShowScanModal('rx')}
            >
              <span className="material-symbols-outlined text-[18px]">document_scanner</span>
            </button>
            <button
              aria-label="Scan Barcode"
              className="w-8 h-8 rounded-full bg-surface-container-low text-primary-container hover:bg-primary-container hover:text-on-primary flex items-center justify-center transition-colors"
              title="Scan Barcode / NDC"
              onClick={() => setShowScanModal('barcode')}
            >
              <span className="material-symbols-outlined text-[18px]">barcode_scanner</span>
            </button>
          </div>
        </div>

        {/* Certified Trust Protocol Hero Banner */}
        <div className="w-full bg-primary-container text-on-primary rounded-xl p-space-md shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-surface-tint/20 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-start justify-between gap-space-sm relative z-10">
            <div className="flex flex-col gap-space-xxs min-w-0">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary-fixed text-[18px] flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
                <span className="font-micro-badge text-micro-badge uppercase tracking-wider text-secondary-fixed">
                  Certified Trust Protocol
                </span>
              </div>
              <p className="font-headline-sm text-headline-sm font-semibold tracking-tight text-surface-bright mt-0.5">
                100% Licensed Dispensation
              </p>
              <p className="font-body-sm text-body-sm text-surface-container-high opacity-90 mt-space-xxs leading-snug">
                Verified Batch & Expiry Guarantee • Multi-Tenant Data Isolation
              </p>
            </div>
            <div className="flex-shrink-0 bg-surface-container-lowest/10 backdrop-blur-md px-space-xs py-1 rounded-lg text-center border border-white/10">
              <span className="font-code-sm text-code-sm text-secondary-container block font-bold">HIPAA</span>
              <span className="font-micro-badge text-micro-badge text-surface-bright uppercase">Compliant</span>
            </div>
          </div>
        </div>

        {/* Therapy / Category Scroll Bar */}
        <div className="w-full -mx-space-md px-space-md overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center gap-space-xs min-w-max">
            {categories.map((cat) => {
              const active = selectedCategory === cat.label;
              return (
                <button
                  key={cat.label}
                  className={`flex items-center gap-space-xs px-space-md py-1.5 rounded-full flex-shrink-0 shadow-sm transition-transform active:scale-95 text-body-sm ${
                    active
                      ? 'bg-primary-container text-on-primary font-medium'
                      : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/30 font-normal'
                  }`}
                  onClick={() => {
                    setSelectedCategory(cat.label);
                    if (cat.label === 'Allergy & Cold') {
                      onNavigate('medication-detail');
                    }
                  }}
                >
                  <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
                  <span className="whitespace-nowrap">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Urgent Protocol Banner (Safety Requirement FR-SAFE-02) */}
        <div className="w-full bg-error-container text-on-error-container p-space-md rounded-xl shadow-sm flex items-start gap-space-sm border border-error/20">
          <span
            className="material-symbols-outlined text-error text-[22px] flex-shrink-0 mt-0.5"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            e911_emergency
          </span>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-space-xs">
              <span className="font-code-sm text-code-sm font-bold text-error uppercase">Urgent Protocol</span>
              <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span>
            </div>
            <p className="font-body-sm text-body-sm text-on-error-container mt-space-xxs leading-snug">
              Experiencing shortness of breath, sudden chest pain, or high fever &gt;103°F?{' '}
              <button
                className="font-semibold underline cursor-pointer hover:opacity-80 text-left"
                onClick={() => setShowUrgentModal(true)}
              >
                Escalate to emergency medical care immediately.
              </button>
            </p>
          </div>
        </div>

        {/* Common Cold & Fever Advisor (FR-SAFE-01) */}
        <div className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-sm border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary-container">
                <span className="material-symbols-outlined text-[18px]">medical_services</span>
              </div>
              <div>
                <div className="flex items-center gap-space-xs">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    Common Cold & Fever Advisor
                  </span>
                  <span className="font-micro-badge text-micro-badge bg-surface-container text-on-surface-variant px-1.5 py-0.5 rounded">
                    FR-SAFE-01
                  </span>
                </div>
                <p className="font-data-tabular text-data-tabular text-on-surface-variant">
                  Standard Adult Symptom Care • Verified Guidelines
                </p>
              </div>
            </div>
            <button
              aria-label="Toggle Clinical Details"
              className="text-on-surface-variant hover:text-on-surface p-1 transition-transform"
              onClick={() => setIsGuidanceOpen(!isGuidanceOpen)}
            >
              <span
                className={`material-symbols-outlined text-[20px] transition-transform duration-200 ${
                  isGuidanceOpen ? 'rotate-180' : ''
                }`}
              >
                keyboard_arrow_down
              </span>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-space-sm mt-space-xs">
            <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-space-xxs">
              <span className="font-micro-badge text-micro-badge uppercase text-primary-container font-semibold">
                First-Line Salt
              </span>
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Paracetamol</span>
              <span className="font-data-tabular text-data-tabular text-on-surface-variant">
                500mg - 650mg • Q6H max
              </span>
            </div>
            <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-space-xxs">
              <span className="font-micro-badge text-micro-badge uppercase text-secondary font-semibold">
                Hydration Target
              </span>
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold">2.5L - 3.0L</span>
              <span className="font-data-tabular text-data-tabular text-on-surface-variant">
                Electrolytes & fluids daily
              </span>
            </div>
          </div>
          {isGuidanceOpen && (
            <div className="flex flex-col gap-space-xs pt-space-xs">
              <div className="p-space-sm bg-surface-container-low rounded-lg flex items-start gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-[16px] mt-0.5">check_circle</span>
                <p className="font-body-sm text-body-sm text-on-surface">
                  Avoid combining multiple medications containing acetaminophen (APAP) to prevent unintentional
                  hepatotoxicity. Maximum 4,000mg/24h across all sources.
                </p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-space-xs pt-space-xxs">
            <span className="material-symbols-outlined text-[14px] text-on-surface-variant">info</span>
            <p className="font-code-sm text-code-sm text-on-surface-variant">
              Informational only, not a medical diagnosis (FR-SAFE-02).
            </p>
          </div>
        </div>

        {/* Featured Generic Salt Product: Paracetamol 500mg */}
        <div className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-sm border border-outline-variant/20">
          <div className="flex items-start justify-between gap-space-xs">
            <div className="flex items-center gap-space-sm">
              <div className="w-14 h-14 rounded-lg bg-surface-container overflow-hidden flex-shrink-0">
                <img
                  alt="Paracetamol generic blister pack"
                  className="w-full h-full object-cover"
                  src={ASSETS.paracetamolPill}
                />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-space-xs">
                  <span className="font-headline-sm text-headline-sm font-bold text-on-surface truncate">
                    Paracetamol 500mg
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-container font-micro-badge text-micro-badge uppercase font-bold">
                    Generic Salt
                  </span>
                </div>
                <p className="font-data-tabular text-data-tabular text-on-surface-variant">
                  Equivalent to Calpol • Tylenol 500mg
                </p>
                <div className="flex items-center gap-space-xs mt-0.5">
                  <span className="font-code-sm text-code-sm font-semibold text-secondary">
                    Save up to 42% on generic equivalent
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end flex-shrink-0">
              <span className="font-headline-lg text-headline-lg text-primary-container font-bold">$3.20 - $5.50</span>
              <span className="font-data-tabular text-data-tabular text-on-surface-variant">Across 6 Pharmacies</span>
            </div>
          </div>
          <div className="bg-surface-container-low rounded-lg p-space-sm flex items-center justify-between gap-space-xs">
            <div className="flex items-center gap-space-xs min-w-0">
              <span className="material-symbols-outlined text-secondary text-[18px] flex-shrink-0">
                compare_arrows
              </span>
              <span className="font-body-sm text-body-sm text-on-surface truncate">
                Best pricing from verified stock:
              </span>
            </div>
            <span className="font-code-sm text-code-sm text-secondary font-bold whitespace-nowrap">$0.16 / tablet</span>
          </div>
          <div className="flex items-center gap-space-xs">
            <button
              className="flex-1 bg-primary-container hover:bg-primary text-on-primary py-2 px-space-md rounded-lg font-headline-sm text-headline-sm font-medium flex items-center justify-center gap-space-xs shadow-sm transition-colors"
              onClick={() => onNavigate('medication-detail')}
            >
              <span className="material-symbols-outlined text-[18px]">query_stats</span>
              <span>Compare All 6 Sellers</span>
            </button>
            <button
              aria-label="Add to Quick Order"
              className="w-10 h-10 rounded-lg bg-surface-container text-primary-container hover:bg-surface-container-high flex items-center justify-center flex-shrink-0 transition-colors"
              onClick={onAddToCart}
            >
              <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
            </button>
          </div>
        </div>

        {/* Bioequivalent Spotlight Card: Cetirizine HCl (Direct Click to Screen 1) */}
        <div
          className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-sm border-2 border-secondary/30 hover:border-secondary cursor-pointer transition-all"
          onClick={() => onNavigate('medication-detail')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded font-micro-badge text-micro-badge uppercase font-bold">
                AB-Rated Bioequivalent
              </span>
              <span className="font-code-sm text-code-sm text-secondary font-medium">100% Salt Parity</span>
            </div>
            <span className="text-secondary text-body-sm font-semibold flex items-center gap-0.5">
              View Specs <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </span>
          </div>
          <div className="flex items-center gap-space-sm">
            <img
              alt="Cetirizine tablet"
              className="w-16 h-16 rounded-lg object-cover bg-surface-container flex-shrink-0"
              src={ASSETS.cetirizinePill}
            />
            <div className="flex flex-col min-w-0">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Cetirizine HCl 10mg</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Zyrtec® Active Ingredient Equivalent</p>
              <div className="flex items-baseline gap-space-xs mt-1">
                <span className="font-headline-sm text-headline-sm text-primary font-bold">$8.99</span>
                <span className="text-body-sm text-on-surface-variant line-through">$18.50</span>
                <span className="font-micro-badge text-micro-badge text-secondary font-bold">(Save 51%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Verified Pharmacies Nearby Section */}
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center justify-between px-space-xs">
            <div className="flex items-center gap-space-xs">
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Verified Pharmacies Nearby
              </span>
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
            </div>
            <button
              className="font-data-tabular text-data-tabular text-primary-container font-semibold hover:underline"
              onClick={() => onNavigate('order-tracking')}
            >
              View Map
            </button>
          </div>

          <div className="grid grid-cols-1 gap-space-sm">
            {/* Pharmacy 1: Apex Medicos */}
            <div className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-sm border border-outline-variant/20">
              <div className="flex items-start justify-between gap-space-xs">
                <div className="flex items-start gap-space-sm min-w-0">
                  <div className="w-12 h-12 rounded-lg bg-surface-container-high overflow-hidden flex-shrink-0">
                    <img
                      alt="Apex Medicos Storefront"
                      className="w-full h-full object-cover"
                      src={ASSETS.apexStore}
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-space-xs">
                      <span className="font-headline-sm text-headline-sm font-bold text-on-surface truncate">
                        Apex Medicos
                      </span>
                      <span
                        className="material-symbols-outlined text-secondary text-[16px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        verified
                      </span>
                    </div>
                    <div className="flex items-center gap-space-xs mt-space-xxs flex-wrap">
                      <span className="bg-surface-container px-1 py-0.5 rounded font-code-sm text-code-sm text-on-surface-variant">
                        Verified PIC: Dr. Vance
                      </span>
                      <span className="font-code-sm text-code-sm text-secondary font-bold flex items-center">
                        <span className="material-symbols-outlined text-[13px] mr-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                          star
                        </span>
                        4.9
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end flex-shrink-0">
                  <span className="font-headline-sm text-headline-sm font-bold text-secondary">35 mins</span>
                  <span className="font-micro-badge text-micro-badge text-on-surface-variant uppercase">Express ETA</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-space-xs bg-surface-container-lowest border-t border-surface-container">
                <div className="flex items-center gap-space-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px]">inventory</span>
                  <span className="font-data-tabular text-data-tabular">In Stock: 142 Generics</span>
                </div>
                <button
                  className="bg-surface-container-low text-primary-container px-space-md py-1 rounded-lg font-data-tabular text-data-tabular font-medium hover:bg-surface-container transition-colors"
                  onClick={() => onNavigate('partner-portal')}
                >
                  Browse Dispensing List
                </button>
              </div>
            </div>

            {/* Pharmacy 2: WellSpring Meds */}
            <div className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-sm border border-outline-variant/20">
              <div className="flex items-start justify-between gap-space-xs">
                <div className="flex items-start gap-space-sm min-w-0">
                  <div className="w-12 h-12 rounded-lg bg-surface-container-high overflow-hidden flex-shrink-0">
                    <img
                      alt="WellSpring Meds Cold-chain Vault"
                      className="w-full h-full object-cover"
                      src={ASSETS.wellspringStore}
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-space-xs">
                      <span className="font-headline-sm text-headline-sm font-bold text-on-surface truncate">
                        WellSpring Meds
                      </span>
                      <span
                        className="material-symbols-outlined text-secondary text-[16px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        verified
                      </span>
                    </div>
                    <div className="flex items-center gap-space-xs mt-space-xxs flex-wrap">
                      <span className="bg-surface-container px-1 py-0.5 rounded font-code-sm text-code-sm text-primary-container font-medium">
                        Cold-Chain Certified
                      </span>
                      <span className="font-code-sm text-code-sm text-secondary font-bold flex items-center">
                        <span className="material-symbols-outlined text-[13px] mr-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                          star
                        </span>
                        4.8
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end flex-shrink-0">
                  <span className="font-headline-sm text-headline-sm font-bold text-on-surface">45 mins</span>
                  <span className="font-micro-badge text-micro-badge text-on-surface-variant uppercase">Standard ETA</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-space-xs bg-surface-container-lowest border-t border-surface-container">
                <div className="flex items-center gap-space-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px] text-secondary">ac_unit</span>
                  <span className="font-data-tabular text-data-tabular">Active Thermal Monitored (2-8°C)</span>
                </div>
                <button
                  className="bg-surface-container-low text-primary-container px-space-md py-1 rounded-lg font-data-tabular text-data-tabular font-medium hover:bg-surface-container transition-colors"
                  onClick={() => onNavigate('medication-detail')}
                >
                  Browse Dispensing List
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Safety Audit Banner */}
        <div
          className="w-full bg-surface-container-low rounded-xl p-space-md shadow-sm flex items-center justify-between gap-space-sm cursor-pointer hover:bg-surface-container transition-colors border border-outline-variant/30"
          onClick={() => onNavigate('trustops-audit')}
        >
          <div className="flex items-center gap-space-sm min-w-0">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center flex-shrink-0 text-on-secondary-container">
              <span className="material-symbols-outlined text-[20px]">shield_with_heart</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-space-xs">
                <span className="font-code-sm text-code-sm font-bold text-on-surface uppercase">Live Safety Audit</span>
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                Zero recalled batches in your area • Last verified 09:30 AM
              </p>
            </div>
          </div>
          <span className="material-symbols-outlined text-[20px] text-primary-container flex-shrink-0">
            arrow_forward_ios
          </span>
        </div>
      </main>

      {/* Fixed Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-1px_8px_rgba(0,0,0,0.04)] border-t border-outline-variant/30">
        <div className="flex items-center justify-around h-16 max-w-screen-md mx-auto px-space-xs">
          <button
            className="flex flex-col items-center justify-center min-w-[48px] min-h-[44px] px-space-xs py-space-xxs text-primary-container font-headline-sm font-semibold"
            onClick={() => onNavigate('customer-home')}
          >
            <span className="material-symbols-outlined text-[22px]">local_pharmacy</span>
            <span className="font-body-sm text-[11px]">Home</span>
          </button>
          <button
            className="flex flex-col items-center justify-center min-w-[48px] min-h-[44px] px-space-xs py-space-xxs text-on-surface-variant hover:text-on-surface transition-colors"
            onClick={() => onNavigate('medication-detail')}
          >
            <span className="material-symbols-outlined text-[22px]">manage_search</span>
            <span className="font-body-sm text-[11px]">Compare</span>
          </button>
          <button
            className="flex flex-col items-center justify-center min-w-[48px] min-h-[44px] px-space-xs py-space-xxs text-on-surface-variant hover:text-on-surface transition-colors"
            onClick={() => onNavigate('trustops-audit')}
          >
            <span className="material-symbols-outlined text-[22px]">verified_user</span>
            <span className="font-body-sm text-[11px]">Safety</span>
          </button>
          <button
            className="flex flex-col items-center justify-center min-w-[48px] min-h-[44px] px-space-xs py-space-xxs text-on-surface-variant hover:text-on-surface transition-colors relative"
            onClick={() => onNavigate('order-tracking')}
          >
            <span className="material-symbols-outlined text-[22px]">inventory_2</span>
            <span className="font-body-sm text-[11px]">Orders</span>
            <span className="absolute top-1 right-2 px-1.5 py-0.2 rounded-full bg-secondary text-on-secondary font-micro-badge text-[10px] font-bold">
              2
            </span>
          </button>
          <button
            className="flex flex-col items-center justify-center min-w-[48px] min-h-[44px] px-space-xs py-space-xxs text-on-surface-variant hover:text-on-surface transition-colors"
            onClick={() => onNavigate('architecture-prd')}
          >
            <span className="material-symbols-outlined text-[22px]">shield_with_heart</span>
            <span className="font-body-sm text-[11px]">Trust & PRD</span>
          </button>
        </div>
      </nav>

      {/* Urgent Protocol Modal */}
      {showUrgentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-space-lg shadow-2xl border border-error/30 flex flex-col gap-space-md">
            <div className="flex items-center gap-space-sm text-error">
              <span className="material-symbols-outlined text-3xl">emergency</span>
              <div>
                <h3 className="font-headline-sm text-headline-sm font-bold text-error">Critical Safety Escalation</h3>
                <p className="font-micro-badge text-micro-badge text-on-surface-variant">FR-SAFE-02 Protocol</p>
              </div>
            </div>
            <p className="font-body-base text-body-base text-on-surface">
              If you or the patient are experiencing severe distress, shortness of breath, chest pain, anaphylaxis, or
              fever exceeding 103°F, online medication ordering must not delay emergency intervention.
            </p>
            <div className="bg-error-container p-space-sm rounded-lg flex items-center justify-between text-on-error-container font-semibold">
              <span>National Emergency Line</span>
              <span className="font-mono text-lg font-bold">Call 911 / 112</span>
            </div>
            <div className="flex gap-space-sm">
              <button
                className="flex-1 bg-error text-on-error py-2.5 rounded-lg font-body-medium font-bold hover:bg-error/90"
                onClick={() => {
                  alert('Initiating emergency dispatch bridge...');
                  setShowUrgentModal(false);
                }}
              >
                Call Emergency Line
              </button>
              <button
                className="px-4 py-2.5 bg-surface-container text-on-surface rounded-lg font-body-medium hover:bg-surface-container-high"
                onClick={() => setShowUrgentModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scanner Simulation Modal */}
      {showScanModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-space-lg shadow-2xl flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-2xl text-primary">
                  {showScanModal === 'rx' ? 'document_scanner' : 'barcode_scanner'}
                </span>
                <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                  {showScanModal === 'rx' ? 'Physical Prescription Scanner' : 'Barcode & NDC Scanner'}
                </h3>
              </div>
              <button className="text-on-surface-variant" onClick={() => setShowScanModal(null)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="w-full h-48 bg-surface-container-low rounded-xl border-2 border-dashed border-primary/30 flex flex-col items-center justify-center text-center p-4 relative overflow-hidden">
              <div className="w-full h-0.5 bg-secondary animate-pulse absolute top-1/2"></div>
              <span className="material-symbols-outlined text-4xl text-primary/40 mb-2">
                {showScanModal === 'rx' ? 'upload_file' : 'qr_code_2'}
              </span>
              <p className="font-body-sm text-on-surface font-medium">
                {showScanModal === 'rx'
                  ? 'Align doctor written Rx within camera viewfinder'
                  : 'Hold camera steady over medicine box barcode / NDC'}
              </p>
              <p className="font-code-sm text-xs text-on-surface-variant mt-1">OCR Trust Engine Active</p>
            </div>
            <button
              className="w-full bg-primary text-on-primary py-2.5 rounded-lg font-body-medium font-semibold hover:bg-primary-container"
              onClick={() => {
                setShowScanModal(null);
                onNavigate('medication-detail');
              }}
            >
              Simulate Instant Match → Cetirizine HCl 10mg
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

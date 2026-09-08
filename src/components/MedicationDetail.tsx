import React, { useState } from 'react';
import { ASSETS, INITIAL_MEDICINE, INITIAL_SELLERS } from '../data/mockData';
import { AppScreen } from '../types';

interface MedicationDetailProps {
  onNavigate: (screen: AppScreen) => void;
  onAddToCart: () => void;
}

export const MedicationDetail: React.FC<MedicationDetailProps> = ({ onNavigate, onAddToCart }) => {
  const [selectedPharmacyId, setSelectedPharmacyId] = useState('PHARM-01');
  const [activeTab, setActiveTab] = useState<'indications' | 'dosage' | 'formula'>('indications');
  const [quantity, setQuantity] = useState(1);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [reservationNotice, setReservationNotice] = useState(false);

  const medicine = INITIAL_MEDICINE;
  const currentSeller = INITIAL_SELLERS.find((s) => s.id === selectedPharmacyId) || INITIAL_SELLERS[0];
  const unitPrice = currentSeller.price;
  const subtotal = (unitPrice * quantity).toFixed(2);

  const handleOrderAction = () => {
    onAddToCart();
    setReservationNotice(true);
    setTimeout(() => {
      setReservationNotice(false);
    }, 4000);
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
                Bioequivalent Detail
              </span>
              <span className="font-code-sm text-code-sm text-on-surface-variant">
                NDC 0054-0012 • AB-Rated
              </span>
            </div>
          </div>
          <div className="flex items-center gap-space-xs">
            <button
              aria-label="Bookmark medication"
              className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-on-surface rounded-full transition-colors"
              onClick={() => setIsBookmarked(!isBookmarked)}
            >
              <span
                className={`material-symbols-outlined text-[22px] ${
                  isBookmarked ? 'text-secondary fill-current' : ''
                }`}
                style={{ fontVariationSettings: isBookmarked ? "'FILL' 1" : "'FILL' 0" }}
              >
                bookmark
              </span>
            </button>
            <button
              aria-label="Share medication"
              className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-on-surface rounded-full transition-colors"
              onClick={() => alert('Secure Bioequivalence link copied to clipboard.')}
            >
              <span className="material-symbols-outlined text-[22px]">share</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-screen-md mx-auto pb-36 px-space-md pt-space-md flex flex-col gap-space-md">
        {/* Verification Badges */}
        <div className="flex flex-wrap items-center gap-space-xs">
          <span className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-micro-badge text-micro-badge uppercase font-bold">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            FDA Bioequivalent (AB-Rated)
          </span>
          <span className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-surface-container-high text-primary-container font-micro-badge text-micro-badge uppercase font-bold">
            <span className="material-symbols-outlined text-[14px]">pill</span>
            OTC Regulated
          </span>
          <span className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-surface-container text-on-surface-variant font-code-sm text-code-sm">
            24-Mo Stability
          </span>
        </div>

        {/* Medication Image & Macro Blister Pack */}
        <div className="w-full bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/30 flex flex-col gap-space-md overflow-hidden relative">
          <div className="w-full h-56 rounded-xl bg-surface-container overflow-hidden relative flex items-center justify-center">
            <img
              alt="Cetirizine HCl Generic Tablet"
              className="w-full h-full object-cover"
              src={medicine.image}
            />
            <div className="absolute bottom-3 left-3 bg-primary/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-on-primary font-code-sm text-code-sm flex items-center gap-1.5 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              Authentic Macro Specimen • Batch #CT-4421
            </div>
          </div>

          <div className="flex flex-col gap-space-xs">
            <div className="flex items-start justify-between gap-space-sm">
              <div>
                <h1 className="font-headline-xl text-headline-xl text-primary font-bold">
                  {medicine.genericName} {medicine.strength}
                </h1>
                <p className="font-body-medium text-body-medium text-on-surface-variant">
                  {medicine.dosageForm} • 2nd Gen Antihistamine • Non-Sedating
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="font-headline-xl text-headline-xl text-primary font-bold">
                  ${unitPrice.toFixed(2)}
                </span>
                <span className="block font-data-tabular text-data-tabular text-on-surface-variant">
                  30 Tablets ({medicine.unitPriceString})
                </span>
              </div>
            </div>

            {/* Savings Bar Comparison */}
            <div className="bg-surface-container-low p-space-sm rounded-xl flex flex-col gap-space-xs mt-space-xs border border-outline-variant/20">
              <div className="flex items-center justify-between font-body-sm text-body-sm">
                <span className="text-on-surface-variant">
                  Generic Salt vs. <strong className="text-on-surface">{medicine.brandNameEquivalent}</strong>
                </span>
                <span className="font-code-sm text-code-sm font-bold text-secondary">
                  Save ${(medicine.brandPrice - unitPrice).toFixed(2)} (51%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden flex">
                <div className="h-full bg-secondary rounded-full" style={{ width: '49%' }}></div>
                <div className="h-full bg-surface-container-high" style={{ width: '51%' }}></div>
              </div>
              <div className="flex justify-between text-[11px] font-code-sm text-on-surface-variant">
                <span>Generic: ${unitPrice.toFixed(2)}</span>
                <span className="line-through">Brand: ${medicine.brandPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Batch Quality & Real-Time Inspection Verification (FR-CAT-03) */}
        <div className="w-full bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/30 flex flex-col gap-space-sm">
          <div className="flex items-center justify-between border-b border-surface-container pb-space-xs">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-secondary text-[20px]">fact_check</span>
              <span className="font-headline-sm text-headline-sm font-bold text-primary">
                Batch Quality & Compliance
              </span>
            </div>
            <span className="font-micro-badge text-micro-badge bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded font-bold">
              FR-CAT-03 Verified
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm">
            <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col">
              <span className="font-micro-badge text-micro-badge text-on-surface-variant uppercase">Lot Number</span>
              <span className="font-code-sm text-code-sm font-bold text-primary">{medicine.batchNumber}</span>
            </div>
            <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col">
              <span className="font-micro-badge text-micro-badge text-on-surface-variant uppercase">Mfg Date</span>
              <span className="font-data-tabular text-data-tabular font-medium text-on-surface">{medicine.mfgDate}</span>
            </div>
            <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col">
              <span className="font-micro-badge text-micro-badge text-on-surface-variant uppercase">Expiry Date</span>
              <span className="font-data-tabular text-data-tabular font-bold text-secondary">{medicine.expDate}</span>
            </div>
            <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col">
              <span className="font-micro-badge text-micro-badge text-on-surface-variant uppercase">Stability</span>
              <span className="font-data-tabular text-data-tabular font-medium text-on-surface">
                {medicine.shelfStabilityMonths} Months
              </span>
            </div>
          </div>

          <div className="p-space-xs bg-surface-container-low rounded-lg flex items-center gap-space-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
            <span className="font-body-sm text-body-sm">
              Independent laboratory assay passed. Dissolution rate: 99.4% in 15 mins (USP standard ≥80%).
            </span>
          </div>
        </div>

        {/* Dispensing Pharmacy & Local Routing */}
        <div className="w-full bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/30 flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[20px]">store</span>
              <h2 className="font-headline-sm text-headline-sm font-bold text-primary">
                Dispensing Pharmacy & Routing
              </h2>
            </div>
            <span className="font-code-sm text-code-sm text-secondary font-semibold">
              {INITIAL_SELLERS.length} Licensed Partners
            </span>
          </div>

          <div className="flex flex-col gap-space-xs">
            {INITIAL_SELLERS.map((seller) => {
              const isSelected = selectedPharmacyId === seller.id;
              return (
                <div
                  key={seller.id}
                  className={`p-space-sm rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-secondary bg-surface-container-low shadow-sm'
                      : 'border-surface-container hover:border-outline-variant/50 bg-surface-container-lowest'
                  }`}
                  onClick={() => setSelectedPharmacyId(seller.id)}
                >
                  <div className="flex items-center gap-space-sm min-w-0">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'border-secondary bg-secondary' : 'border-outline-variant'
                      }`}
                    >
                      {isSelected && <span className="w-2 h-2 rounded-full bg-white"></span>}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-space-xs">
                        <span className="font-headline-sm text-headline-sm font-bold text-primary truncate">
                          {seller.name}
                        </span>
                        {seller.coldChainCertified && (
                          <span className="bg-primary-container text-on-primary px-1.5 py-0.5 rounded font-micro-badge text-[10px] uppercase font-semibold">
                            Cold-Chain
                          </span>
                        )}
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                        PIC: {seller.picName} • {seller.distanceMiles} mi away
                      </p>
                      <div className="flex items-center gap-space-xs mt-0.5">
                        <span className="font-code-sm text-code-sm text-secondary font-semibold">
                          Trust: {seller.trustScore}/100
                        </span>
                        <span className="text-on-surface-variant">•</span>
                        <span className="font-code-sm text-code-sm text-on-surface-variant">{seller.deliveryEta}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-headline-sm text-headline-sm font-bold text-primary">
                      ${seller.price.toFixed(2)}
                    </span>
                    <span className="block font-micro-badge text-micro-badge text-secondary font-bold">In Stock</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Clinical Specifications Tabs */}
        <div className="w-full bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/30 flex flex-col gap-space-sm">
          <div className="flex border-b border-surface-container">
            <button
              className={`pb-space-xs font-headline-sm text-headline-sm font-semibold px-space-sm border-b-2 transition-colors ${
                activeTab === 'indications'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
              onClick={() => setActiveTab('indications')}
            >
              Indications
            </button>
            <button
              className={`pb-space-xs font-headline-sm text-headline-sm font-semibold px-space-sm border-b-2 transition-colors ${
                activeTab === 'dosage'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
              onClick={() => setActiveTab('dosage')}
            >
              Dosage & Admin
            </button>
            <button
              className={`pb-space-xs font-headline-sm text-headline-sm font-semibold px-space-sm border-b-2 transition-colors ${
                activeTab === 'formula'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
              onClick={() => setActiveTab('formula')}
            >
              Chemical Formula
            </button>
          </div>

          <div className="pt-space-xs">
            {activeTab === 'indications' && (
              <div className="flex flex-col gap-space-xs">
                <p className="font-body-base text-body-base text-on-surface">{medicine.indications}</p>
                <div className="bg-surface-container-low p-space-sm rounded-lg flex items-start gap-space-xs mt-space-xs">
                  <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Approved by FDA for seasonal allergic rhinitis and chronic idiopathic urticaria.
                  </p>
                </div>
              </div>
            )}
            {activeTab === 'dosage' && (
              <div className="flex flex-col gap-space-xs font-body-base text-body-base">
                <div>
                  <strong className="text-primary font-semibold">Adults and children 6 years and older:</strong>
                  <p className="text-on-surface-variant mt-0.5">{medicine.dosageAdult}</p>
                </div>
                <div className="mt-space-xs">
                  <strong className="text-primary font-semibold">Adults 65 years and over / Renal impairment:</strong>
                  <p className="text-on-surface-variant mt-0.5">{medicine.dosageSenior}</p>
                </div>
              </div>
            )}
            {activeTab === 'formula' && (
              <div className="flex flex-col gap-space-xs">
                <div>
                  <span className="font-micro-badge text-micro-badge text-on-surface-variant uppercase">
                    Active Ingredient
                  </span>
                  <p className="font-code-sm text-code-sm text-primary font-bold mt-0.5">
                    {medicine.activeIngredient}
                  </p>
                </div>
                <div className="mt-space-xs">
                  <span className="font-micro-badge text-micro-badge text-on-surface-variant uppercase">
                    Inactive Excipients
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    {medicine.inactiveIngredients}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Reservation Notification Toast */}
      {reservationNotice && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-primary-container text-on-primary px-space-md py- space-sm py-2.5 rounded-xl shadow-xl flex items-center gap-space-sm border border-white/20 animate-in fade-in slide-in-from-top-4">
          <span className="material-symbols-outlined text-secondary-fixed">check_circle</span>
          <div className="flex flex-col">
            <span className="font-body-medium font-bold text-sm">Prescription Batch Reserved</span>
            <span className="font-code-sm text-xs opacity-90">
              Allocated at {currentSeller.name} • Batch #CT-4421 locked
            </span>
          </div>
          <button
            className="ml-space-sm bg-secondary text-on-secondary px-2.5 py-1 rounded-lg text-xs font-bold hover:bg-secondary/90"
            onClick={() => onNavigate('order-tracking')}
          >
            Track Order
          </button>
        </div>
      )}

      {/* Bottom Floating Action Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-xl border-t border-outline-variant/30 py-space-sm px-space-md shadow-lg pb-safe">
        <div className="max-w-screen-md mx-auto flex items-center justify-between gap-space-md">
          {/* Quantity Counter */}
          <div className="flex items-center gap-space-xs bg-surface-container rounded-xl p-1">
            <button
              aria-label="Decrease quantity"
              className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors disabled:opacity-40"
              disabled={quantity <= 1}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <span className="material-symbols-outlined text-[18px]">remove</span>
            </button>
            <span className="w-8 text-center font-headline-sm text-headline-sm font-bold text-primary">
              {quantity}
            </span>
            <button
              aria-label="Increase quantity"
              className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors"
              onClick={() => setQuantity(quantity + 1)}
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
          </div>

          {/* Subtotal and Action Button */}
          <div className="flex items-center gap-space-md flex-1 justify-end">
            <div className="text-right">
              <span className="block font-micro-badge text-micro-badge text-on-surface-variant uppercase">
                Subtotal
              </span>
              <span className="font-headline-lg text-headline-lg font-bold text-primary">${subtotal}</span>
            </div>
            <button
              className="bg-primary hover:bg-primary-container text-on-primary px-space-lg py-3 rounded-xl font-headline-sm text-headline-sm font-bold flex items-center gap-space-xs shadow-md transition-all active:scale-95"
              onClick={handleOrderAction}
            >
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              <span>Add to Cart & Verify Safe Rx</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

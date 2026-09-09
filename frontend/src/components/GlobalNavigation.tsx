import React from 'react';
import { AppScreen, AuthUser } from '../types';

interface GlobalNavigationProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  cartCount: number;
  currentUser?: AuthUser | null;
}

export const GlobalNavigation: React.FC<GlobalNavigationProps> = ({
  currentScreen,
  onNavigate,
  isMobileFrame,
  onToggleMobileFrame,
  cartCount,
  currentUser,
}) => {
  const isCustomerScreen =
    currentScreen === 'customer-home' ||
    currentScreen === 'medication-detail' ||
    currentScreen === 'order-tracking' ||
    currentScreen === 'login-register';

  return (
    <div className="w-full bg-primary text-on-primary border-b border-white/10 z-50 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Brand Identity & Active Screen indicator */}
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
            onClick={() => onNavigate('customer-home')}
          >
            <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-white font-bold">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </div>
            <span className="font-headline-sm font-bold text-sm tracking-tight text-white">GenricMed</span>
          </button>
          <span className="text-white/30 hidden sm:inline">|</span>
          <span className="font-code-sm text-secondary-fixed hidden sm:inline">
            Clinical Governance & Bioequivalent Medicine Platform
          </span>
        </div>

        {/* Center: Interactive Role & Screen Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {/* Customer Screens Group */}
          <div className="flex items-center bg-white/10 rounded-lg p-0.5">
            <button
              className={`px-2.5 py-1 rounded-md font-code-sm text-xs font-semibold transition-all ${
                currentScreen === 'customer-home'
                  ? 'bg-secondary text-on-secondary shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
              title="Screen 3: Customer Discover / Home"
              onClick={() => onNavigate('customer-home')}
            >
              1. Discover
            </button>
            <button
              className={`px-2.5 py-1 rounded-md font-code-sm text-xs font-semibold transition-all ${
                currentScreen === 'medication-detail'
                  ? 'bg-secondary text-on-secondary shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
              title="Screen 1: Medication Bioequivalent Detail"
              onClick={() => onNavigate('medication-detail')}
            >
              2. Detail
            </button>
            <button
              className={`px-2.5 py-1 rounded-md font-code-sm text-xs font-semibold transition-all ${
                currentScreen === 'order-tracking'
                  ? 'bg-secondary text-on-secondary shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
              title="Screen 2: Live Chain-of-Custody & PIN Tracking"
              onClick={() => onNavigate('order-tracking')}
            >
              3. Tracking
            </button>
          </div>

          {/* Pharmacy Portal Button */}
          <button
            className={`px-2.5 py-1.5 rounded-lg font-code-sm text-xs font-bold transition-all flex items-center gap-1 ${
              currentScreen === 'partner-portal'
                ? 'bg-secondary-container text-on-secondary-container shadow-xs'
                : 'bg-white/10 text-white/90 hover:bg-white/20'
            }`}
            title="Screen 6: Apex Healthcare & Pharmacy Dispensing Desk"
            onClick={() => onNavigate('partner-portal')}
          >
            <span className="material-symbols-outlined text-[15px]">local_pharmacy</span>
            <span>4. Pharmacy Desk</span>
          </button>

          {/* TrustOps Telemetry Button */}
          <button
            className={`px-2.5 py-1.5 rounded-lg font-code-sm text-xs font-bold transition-all flex items-center gap-1 ${
              currentScreen === 'trustops-fulfillment'
                ? 'bg-primary-container text-on-primary ring-1 ring-white/30 shadow-xs'
                : 'bg-white/10 text-white/90 hover:bg-white/20'
            }`}
            title="Screen 4: TrustOps Shipment & Fulfillment Telemetry"
            onClick={() => onNavigate('trustops-fulfillment')}
          >
            <span className="material-symbols-outlined text-[15px]">local_shipping</span>
            <span>5. TrustOps Telemetry</span>
          </button>

          {/* TrustOps Security Logs Button */}
          <button
            className={`px-2.5 py-1.5 rounded-lg font-code-sm text-xs font-bold transition-all flex items-center gap-1 ${
              currentScreen === 'trustops-audit'
                ? 'bg-primary-container text-on-primary ring-1 ring-white/30 shadow-xs'
                : 'bg-white/10 text-white/90 hover:bg-white/20'
            }`}
            title="Screen 5: Security & Immutable Audit Logs"
            onClick={() => onNavigate('trustops-audit')}
          >
            <span className="material-symbols-outlined text-[15px]">lock_clock</span>
            <span>6. Audit Logs</span>
          </button>

          {/* Auth: Login & Register Button */}
          <button
            className={`px-2.5 py-1.5 rounded-lg font-code-sm text-xs font-bold transition-all flex items-center gap-1 ${
              currentScreen === 'login-register'
                ? 'bg-secondary text-on-secondary shadow-xs ring-1 ring-white/30'
                : 'bg-white/10 text-white/90 hover:bg-white/20'
            }`}
            title="Authentication: Login & Registration Frame"
            onClick={() => onNavigate('login-register')}
          >
            <span className="material-symbols-outlined text-[15px]">how_to_reg</span>
            <span>Auth: Login / Register</span>
          </button>

          {/* Architecture & PRD Button */}
          <button
            className={`px-2.5 py-1.5 rounded-lg font-code-sm text-xs font-bold transition-all flex items-center gap-1 ${
              currentScreen === 'architecture-prd'
                ? 'bg-white text-primary shadow-xs'
                : 'bg-white/10 text-white/90 hover:bg-white/20'
            }`}
            title="Multi-Tenant SaaS Architecture & PRD Specifications"
            onClick={() => onNavigate('architecture-prd')}
          >
            <span className="material-symbols-outlined text-[15px]">architecture</span>
            <span>PRD Spec</span>
          </button>
        </div>

        {/* Right: Device Frame Toggle & Cart Quick Action & User Profile Button */}
        <div className="flex items-center gap-2">
          {isCustomerScreen && (
            <button
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white font-code-sm text-[11px] transition-colors"
              title="Toggle smartphone framing"
              onClick={onToggleMobileFrame}
            >
              <span className="material-symbols-outlined text-[15px]">
                {isMobileFrame ? 'phone_iphone' : 'desktop_windows'}
              </span>
              <span>{isMobileFrame ? 'Phone Frame' : 'Fluid View'}</span>
            </button>
          )}

          {/* User Account Quick Switch / Login Indicator */}
          <button
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-code-sm text-[11px] font-bold transition-all ${
              currentUser
                ? 'bg-white/20 hover:bg-white/30 text-white border border-white/20'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title={currentUser ? `Logged in as ${currentUser.name} (${currentUser.role}). Click to switch/logout.` : 'Click to Sign In or Register'}
            onClick={() => onNavigate('login-register')}
          >
            <span className="material-symbols-outlined text-[15px]">
              {currentUser ? 'verified_user' : 'account_circle'}
            </span>
            <span className="truncate max-w-[110px]">
              {currentUser ? currentUser.name.split(' ')[0] : 'Sign In'}
            </span>
          </button>

          <div
            className="flex items-center gap-1.5 bg-secondary px-2.5 py-1 rounded-md text-white font-code-sm text-[11px] font-bold cursor-pointer hover:bg-secondary/90 transition-colors"
            onClick={() => onNavigate('order-tracking')}
          >
            <span className="material-symbols-outlined text-[15px]">shopping_cart</span>
            <span>Cart ({cartCount})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

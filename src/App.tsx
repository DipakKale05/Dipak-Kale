import React, { useState } from 'react';
import { AppScreen, AuthUser } from './types';
import { ASSETS } from './data/mockData';
import { GlobalNavigation } from './components/GlobalNavigation';
import { CustomerHome } from './components/CustomerHome';
import { MedicationDetail } from './components/MedicationDetail';
import { OrderTracking } from './components/OrderTracking';
import { PartnerPortal } from './components/PartnerPortal';
import { TrustOpsFulfillment } from './components/TrustOpsFulfillment';
import { TrustOpsAudit } from './components/TrustOpsAudit';
import { ArchitecturePRD } from './components/ArchitecturePRD';
import { LoginRegisterFrame } from './components/LoginRegisterFrame';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('customer-home');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(true);
  const [cartCount, setCartCount] = useState<number>(2);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>({
    id: 'USR-PAT-7741',
    name: 'Sarah Connor',
    email: 'sarah.connor@example.com',
    phone: '+1 (555) 018-9921',
    role: 'PATIENT',
    avatar: ASSETS.officerElena,
    dob: '1988-04-12',
    deliveryAddress: '742 Evergreen Terr, Springfield',
    hipaaConsented: true,
    token: 'jwt_sha256_pat_9901_enc',
  });

  const isCustomerScreen =
    currentScreen === 'customer-home' ||
    currentScreen === 'medication-detail' ||
    currentScreen === 'order-tracking' ||
    currentScreen === 'login-register';

  const renderScreenContent = () => {
    switch (currentScreen) {
      case 'customer-home':
        return (
          <CustomerHome
            cartCount={cartCount}
            currentUser={currentUser}
            onAddToCart={() => setCartCount((prev) => prev + 1)}
            onNavigate={setCurrentScreen}
          />
        );
      case 'medication-detail':
        return (
          <MedicationDetail
            onAddToCart={() => setCartCount((prev) => prev + 1)}
            onNavigate={setCurrentScreen}
          />
        );
      case 'order-tracking':
        return <OrderTracking onNavigate={setCurrentScreen} />;
      case 'login-register':
        return (
          <LoginRegisterFrame
            currentUser={currentUser}
            onLogin={(user) => setCurrentUser(user)}
            onLogout={() => setCurrentUser(null)}
            onNavigate={setCurrentScreen}
          />
        );
      case 'partner-portal':
        return <PartnerPortal onNavigate={setCurrentScreen} />;
      case 'trustops-fulfillment':
        return <TrustOpsFulfillment onNavigate={setCurrentScreen} />;
      case 'trustops-audit':
        return <TrustOpsAudit onNavigate={setCurrentScreen} />;
      case 'architecture-prd':
        return <ArchitecturePRD onNavigate={setCurrentScreen} />;
      default:
        return (
          <CustomerHome
            cartCount={cartCount}
            currentUser={currentUser}
            onAddToCart={() => setCartCount((prev) => prev + 1)}
            onNavigate={setCurrentScreen}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-low flex flex-col">
      {/* Global Navigation Bar */}
      <GlobalNavigation
        cartCount={cartCount}
        currentScreen={currentScreen}
        currentUser={currentUser}
        isMobileFrame={isMobileFrame}
        onNavigate={setCurrentScreen}
        onToggleMobileFrame={() => setIsMobileFrame((prev) => !prev)}
      />

      {/* Screen Presentation Container */}
      <div className="flex-1 flex justify-center items-start w-full">
        {isCustomerScreen && isMobileFrame ? (
          <div className="my-4 sm:my-8 px-2 w-full flex justify-center">
            {/* Phone Device Frame */}
            <div className="w-full max-w-[420px] bg-black rounded-[48px] p-3.5 shadow-2xl ring-1 ring-white/20 border-4 border-slate-800">
              {/* Device Dynamic Island / Speaker Notch */}
              <div className="relative w-full bg-surface rounded-[38px] overflow-hidden flex flex-col min-h-[844px] shadow-inner">
                <div className="h-6 w-full bg-surface flex items-center justify-between px-6 pt-2 z-50">
                  <span className="font-code-sm text-[11px] font-bold text-primary">9:41</span>
                  <div className="w-20 h-4 bg-black rounded-full mx-auto -mt-1 flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-1 ring-slate-700"></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-primary text-[11px]">
                    <span className="material-symbols-outlined text-[13px]">signal_cellular_alt</span>
                    <span className="material-symbols-outlined text-[13px]">wifi</span>
                    <span className="material-symbols-outlined text-[14px]">battery_full</span>
                  </div>
                </div>

                {/* Rendered Customer Screen */}
                <div className="flex-1 overflow-y-auto">{renderScreenContent()}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full">{renderScreenContent()}</div>
        )}
      </div>
    </div>
  );
}


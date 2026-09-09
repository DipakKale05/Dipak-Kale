import React, { useState, useEffect } from 'react';
import { ASSETS } from '../data/mockData';
import { AppScreen, AuthUser, UserRole } from '../types';

interface LoginRegisterFrameProps {
  onNavigate: (screen: AppScreen) => void;
  currentUser: AuthUser | null;
  onLogin: (user: AuthUser) => void;
  onLogout: () => void;
  initialMode?: 'login' | 'register';
  initialRole?: UserRole;
}

export const LoginRegisterFrame: React.FC<LoginRegisterFrameProps> = ({
  onNavigate,
  currentUser,
  onLogin,
  onLogout,
  initialMode = 'login',
  initialRole = 'PATIENT',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [role, setRole] = useState<UserRole>(initialRole);
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email' | 'passkey'>('phone');
  const [showPassword, setShowPassword] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [pharmacyName, setPharmacyName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [deaNumber, setDeaNumber] = useState('');
  const [npiNumber, setNpiNumber] = useState('');
  const [tenantSchema, setTenantSchema] = useState('tenant_central_04');
  const [hipaaConsent, setHipaaConsent] = useState(true);
  const [fdaNotice, setFdaNotice] = useState(true);

  // OTP Verification State
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [otpCountdown, setOtpCountdown] = useState(28);
  const [isVerifying, setIsVerifying] = useState(false);
  const [authSuccessNotice, setAuthSuccessNotice] = useState<string | null>(null);
  const [showHipaaModal, setShowHipaaModal] = useState(false);

  // OTP Countdown Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOtpStep && otpCountdown > 0) {
      timer = setTimeout(() => setOtpCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [isOtpStep, otpCountdown]);

  // Quick preset logins
  const handleQuickLogin = (presetRole: UserRole) => {
    setIsVerifying(true);
    setTimeout(() => {
      let user: AuthUser;
      if (presetRole === 'PATIENT') {
        user = {
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
        };
      } else if (presetRole === 'PHARMACIST') {
        user = {
          id: 'USR-PHARM-8821',
          name: 'Dr. Kimberly Young, PharmD',
          email: 'kimberly.young@wellspringmeds.com',
          phone: '+1 (555) 244-8800',
          role: 'PHARMACIST',
          pharmacyName: 'WellSpring Meds (#PHARM-01)',
          licenseNumber: 'RPH-99281-IL',
          avatar: ASSETS.pharmacistVance,
          fido2Verified: true,
          token: 'jwt_sha256_rph_8829_enc',
        };
      } else {
        user = {
          id: 'USR-TRUST-9041',
          name: 'Elena Vance',
          email: 'elena.vance@trustops.internal',
          role: 'TRUST_OFFICER',
          avatar: ASSETS.officerElena,
          fido2Verified: true,
          token: 'jwt_sha256_sec_7719_fido2',
        };
      }

      onLogin(user);
      setIsVerifying(false);
      setAuthSuccessNotice(`Authenticated as ${user.name} (${user.role})`);
      setTimeout(() => {
        setAuthSuccessNotice(null);
        if (user.role === 'PATIENT') onNavigate('customer-home');
        else if (user.role === 'PHARMACIST') onNavigate('partner-portal');
        else onNavigate('trustops-fulfillment');
      }, 1000);
    }, 600);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOtpStep(true);
    setOtpCountdown(30);
    // Pre-fill demo digits suggestion
  };

  const handleVerifyOtp = () => {
    setIsVerifying(true);
    setTimeout(() => {
      const user: AuthUser = {
        id: 'USR-PAT-' + Math.floor(1000 + Math.random() * 9000),
        name: fullName || 'Sarah Connor',
        email: email || 'patient@genricmed.health',
        phone: phoneNumber || '+1 (555) 018-9921',
        role: 'PATIENT',
        dob: dob || '1990-01-01',
        deliveryAddress: address || '742 Evergreen Terr, Springfield',
        hipaaConsented: true,
        token: 'jwt_token_' + Math.random().toString(36).substring(2, 10),
      };
      onLogin(user);
      setIsVerifying(false);
      setAuthSuccessNotice('Phone verification successful! Welcome to GenricMed.');
      setTimeout(() => {
        setAuthSuccessNotice(null);
        onNavigate('customer-home');
      }, 900);
    }, 700);
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      const user: AuthUser = {
        id: 'USR-' + (role === 'PHARMACIST' ? 'PHARM-' : role === 'TRUST_OFFICER' ? 'TRUST-' : 'PAT-') + Math.floor(1000 + Math.random() * 9000),
        name: fullName || (role === 'PHARMACIST' ? 'Dr. Kimberly Young' : role === 'TRUST_OFFICER' ? 'Elena Vance' : 'Sarah Connor'),
        email: email || (role === 'PHARMACIST' ? 'kimberly@wellspringmeds.com' : role === 'TRUST_OFFICER' ? 'elena@trustops.internal' : 'sarah@example.com'),
        phone: phoneNumber || '+1 (555) 018-9921',
        role,
        pharmacyName: pharmacyName || (role === 'PHARMACIST' ? 'WellSpring Meds' : undefined),
        licenseNumber: licenseNumber || (role === 'PHARMACIST' ? 'RPH-99281-IL' : undefined),
        fido2Verified: role !== 'PATIENT',
        hipaaConsented: true,
        token: 'jwt_token_' + Math.random().toString(36).substring(2, 10),
      };
      onLogin(user);
      setIsVerifying(false);
      setAuthSuccessNotice(`Signed in successfully as ${user.name}`);
      setTimeout(() => {
        setAuthSuccessNotice(null);
        if (role === 'PATIENT') onNavigate('customer-home');
        else if (role === 'PHARMACIST') onNavigate('partner-portal');
        else onNavigate('trustops-fulfillment');
      }, 800);
    }, 600);
  };

  const handlePasskeySimulation = () => {
    setIsVerifying(true);
    setTimeout(() => {
      handleQuickLogin(role);
    }, 900);
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface font-body-base text-body-base text-on-surface">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur-xl border-b border-outline-variant/30 px-space-md py-3 flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          <button
            className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-primary transition-colors"
            title="Return to previous screen"
            onClick={() => onNavigate('customer-home')}
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          </button>
          <div className="flex items-center gap-2">
            <img alt="GenricMed" className="h-6 w-auto object-contain" src={ASSETS.brandLogo} />
            <span className="font-headline-sm font-bold text-sm text-primary tracking-tight">GenricMed</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded font-micro-badge text-[10px] font-bold uppercase flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">verified_user</span>
            HIPAA 164.312
          </span>
          <button
            className="text-xs font-code-sm text-on-surface-variant hover:text-primary transition-colors"
            onClick={() => onNavigate('architecture-prd')}
          >
            Security Spec
          </button>
        </div>
      </header>

      {/* Main Authentication Card Frame */}
      <main className="flex-1 w-full max-w-lg mx-auto p-space-md flex flex-col justify-center">
        {/* Success Alert Banner */}
        {authSuccessNotice && (
          <div className="mb-space-md p-space-sm bg-secondary-container text-on-secondary-container rounded-xl flex items-center gap-space-xs font-code-sm text-xs font-bold shadow-md animate-bounce">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            <span>{authSuccessNotice}</span>
          </div>
        )}

        {/* Current User Active Session Strip */}
        {currentUser && (
          <div className="mb-space-md p-space-sm bg-surface-container-lowest border border-secondary/40 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[20px]">account_circle</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-xs font-bold text-primary">{currentUser.name}</span>
                <span className="font-code-sm text-[10px] text-secondary font-semibold">
                  Active Session • {currentUser.role}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high text-primary rounded-lg font-code-sm text-xs font-bold transition-colors"
                onClick={() => {
                  if (currentUser.role === 'PATIENT') onNavigate('customer-home');
                  else if (currentUser.role === 'PHARMACIST') onNavigate('partner-portal');
                  else onNavigate('trustops-fulfillment');
                }}
              >
                Go to Portal
              </button>
              <button
                className="px-2 py-1 bg-error-container hover:bg-error/20 text-on-error-container rounded-lg font-code-sm text-xs font-bold transition-colors"
                title="Log out of active session"
                onClick={onLogout}
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Authentication Card Box */}
        <div className="bg-surface-container-lowest rounded-3xl p-space-lg shadow-xl border border-outline-variant/30 flex flex-col gap-space-md">
          {/* Brand Header & Tagline */}
          <div className="text-center flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center font-bold shadow-sm mb-1">
              <span className="material-symbols-outlined text-[28px]">lock</span>
            </div>
            <h1 className="font-headline-sm text-xl font-bold text-primary">
              {mode === 'login' ? 'Sign In to GenricMed' : 'Create Verified Account'}
            </h1>
            <p className="font-body-sm text-xs text-on-surface-variant max-w-xs">
              {role === 'PATIENT'
                ? 'Discover bioequivalent drugs, track tamper seals, and manage medical release PINs.'
                : role === 'PHARMACIST'
                ? 'Licensed pharmacy partner dispensing desk, cold-chain logs, and inventory quarantine.'
                : 'TrustOps governance, immutable SHA-256 audit ledger, and multi-tenant RLS security.'}
            </p>
          </div>

          {/* Role Segmented Controller */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-surface-container-low rounded-xl border border-outline-variant/30">
            <button
              className={`py-1.5 px-2 rounded-lg font-code-sm text-xs font-bold transition-all flex flex-col items-center gap-0.5 ${
                role === 'PATIENT'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              onClick={() => {
                setRole('PATIENT');
                setIsOtpStep(false);
              }}
            >
              <span className="material-symbols-outlined text-[16px]">person</span>
              <span>Patient</span>
            </button>
            <button
              className={`py-1.5 px-2 rounded-lg font-code-sm text-xs font-bold transition-all flex flex-col items-center gap-0.5 ${
                role === 'PHARMACIST'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              onClick={() => {
                setRole('PHARMACIST');
                setLoginMethod('email');
                setIsOtpStep(false);
              }}
            >
              <span className="material-symbols-outlined text-[16px]">local_pharmacy</span>
              <span>Pharmacy</span>
            </button>
            <button
              className={`py-1.5 px-2 rounded-lg font-code-sm text-xs font-bold transition-all flex flex-col items-center gap-0.5 ${
                role === 'TRUST_OFFICER'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              onClick={() => {
                setRole('TRUST_OFFICER');
                setLoginMethod('passkey');
                setIsOtpStep(false);
              }}
            >
              <span className="material-symbols-outlined text-[16px]">shield</span>
              <span>TrustOps</span>
            </button>
          </div>

          {/* Mode Switch: Login vs Register */}
          <div className="flex border-b border-surface-container pb-1 text-xs font-code-sm font-bold">
            <button
              className={`flex-1 py-2 text-center border-b-2 transition-colors ${
                mode === 'login'
                  ? 'border-secondary text-secondary'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
              onClick={() => {
                setMode('login');
                setIsOtpStep(false);
              }}
            >
              Sign In (Login)
            </button>
            <button
              className={`flex-1 py-2 text-center border-b-2 transition-colors ${
                mode === 'register'
                  ? 'border-secondary text-secondary'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
              onClick={() => {
                setMode('register');
                setIsOtpStep(false);
              }}
            >
              Create Account (Register)
            </button>
          </div>

          {/* Demo 1-Click Fast Fill Strip */}
          <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-micro-badge text-[10px] text-on-surface-variant uppercase font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] text-secondary">bolt</span>
                Instant Demo Fast-Pass
              </span>
              <span className="font-code-sm text-[10px] text-secondary">One-Click Testing</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <button
                className="py-1 px-1.5 rounded bg-white text-primary text-[10px] font-code-sm font-bold border border-outline-variant/40 hover:bg-secondary-container hover:text-on-secondary-container transition-colors truncate"
                title="Instant login as Patient Sarah Connor"
                onClick={() => handleQuickLogin('PATIENT')}
              >
                👤 Sarah (Patient)
              </button>
              <button
                className="py-1 px-1.5 rounded bg-white text-primary text-[10px] font-code-sm font-bold border border-outline-variant/40 hover:bg-secondary-container hover:text-on-secondary-container transition-colors truncate"
                title="Instant login as Dr. Kimberly Young, PharmD"
                onClick={() => handleQuickLogin('PHARMACIST')}
              >
                💊 Dr. Kimberly (PIC)
              </button>
              <button
                className="py-1 px-1.5 rounded bg-white text-primary text-[10px] font-code-sm font-bold border border-outline-variant/40 hover:bg-secondary-container hover:text-on-secondary-container transition-colors truncate"
                title="Instant login as Elena Vance, Trust Officer"
                onClick={() => handleQuickLogin('TRUST_OFFICER')}
              >
                🛡️ Elena (TrustOps)
              </button>
            </div>
          </div>

          {/* SIGN IN VIEW */}
          {mode === 'login' && !isOtpStep && (
            <div className="flex flex-col gap-space-sm">
              {/* Method Selector for Patient */}
              {role === 'PATIENT' && (
                <div className="flex items-center justify-center gap-2 text-xs font-code-sm">
                  <button
                    className={`px-3 py-1 rounded-full border transition-all ${
                      loginMethod === 'phone'
                        ? 'bg-secondary-container text-on-secondary-container border-secondary'
                        : 'bg-surface-container-low text-on-surface-variant border-outline-variant/30'
                    }`}
                    onClick={() => setLoginMethod('phone')}
                  >
                    Mobile Phone OTP
                  </button>
                  <button
                    className={`px-3 py-1 rounded-full border transition-all ${
                      loginMethod === 'email'
                        ? 'bg-secondary-container text-on-secondary-container border-secondary'
                        : 'bg-surface-container-low text-on-surface-variant border-outline-variant/30'
                    }`}
                    onClick={() => setLoginMethod('email')}
                  >
                    Email & Password
                  </button>
                  <button
                    className={`px-3 py-1 rounded-full border transition-all ${
                      loginMethod === 'passkey'
                        ? 'bg-secondary-container text-on-secondary-container border-secondary'
                        : 'bg-surface-container-low text-on-surface-variant border-outline-variant/30'
                    }`}
                    onClick={() => setLoginMethod('passkey')}
                  >
                    Passkey
                  </button>
                </div>
              )}

              {/* Phone OTP Login Form */}
              {role === 'PATIENT' && loginMethod === 'phone' && (
                <form className="flex flex-col gap-space-sm" onSubmit={handleSendOtp}>
                  <div className="flex flex-col gap-1">
                    <label className="font-code-sm text-xs font-bold text-primary">
                      Mobile Phone Number
                    </label>
                    <div className="flex items-center bg-surface-container-low rounded-xl px-3 py-2 border border-outline-variant/30 focus-within:border-secondary">
                      <span className="font-code-sm text-xs text-on-surface-variant mr-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">call</span>
                        +1
                      </span>
                      <input
                        className="bg-transparent w-full text-xs font-code-sm text-primary focus:outline-none"
                        placeholder="(555) 018-9921"
                        required
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                    <span className="text-[11px] text-on-surface-variant">
                      We will send a 4-digit cryptographic verification token via SMS.
                    </span>
                  </div>

                  <button
                    className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-code-sm text-xs font-bold hover:bg-primary-container shadow-sm flex items-center justify-center gap-2 transition-all mt-1"
                    type="submit"
                  >
                    <span>Send Verification Code</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </form>
              )}

              {/* Email & Password Login Form */}
              {(loginMethod === 'email' || role === 'PHARMACIST') && (
                <form className="flex flex-col gap-space-sm" onSubmit={handleEmailAuth}>
                  <div className="flex flex-col gap-1">
                    <label className="font-code-sm text-xs font-bold text-primary">
                      {role === 'PHARMACIST' ? 'Pharmacist Work Email' : 'Email Address'}
                    </label>
                    <div className="flex items-center bg-surface-container-low rounded-xl px-3 py-2 border border-outline-variant/30 focus-within:border-secondary">
                      <span className="material-symbols-outlined text-[18px] text-on-surface-variant mr-2">mail</span>
                      <input
                        className="bg-transparent w-full text-xs font-body-base text-primary focus:outline-none"
                        placeholder={role === 'PHARMACIST' ? 'kimberly@wellspringmeds.com' : 'sarah.connor@example.com'}
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <label className="font-code-sm text-xs font-bold text-primary">Password</label>
                      <button
                        className="text-[11px] font-code-sm text-secondary hover:underline"
                        type="button"
                        onClick={() => alert('Password reset link sent to your registered email address.')}
                      >
                        Forgot?
                      </button>
                    </div>
                    <div className="flex items-center bg-surface-container-low rounded-xl px-3 py-2 border border-outline-variant/30 focus-within:border-secondary">
                      <span className="material-symbols-outlined text-[18px] text-on-surface-variant mr-2">key</span>
                      <input
                        className="bg-transparent w-full text-xs font-body-base text-primary focus:outline-none"
                        placeholder="••••••••••••"
                        required
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        className="text-on-surface-variant hover:text-primary transition-colors"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {role === 'PHARMACIST' && (
                    <div className="flex flex-col gap-1">
                      <label className="font-code-sm text-xs font-bold text-primary">State Pharmacy License #</label>
                      <input
                        className="bg-surface-container-low rounded-xl px-3 py-2 text-xs font-code-sm text-primary border border-outline-variant/30 focus:outline-none"
                        placeholder="e.g. RPH-99281-IL"
                        type="text"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                      />
                    </div>
                  )}

                  <button
                    className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-code-sm text-xs font-bold hover:bg-primary-container shadow-sm flex items-center justify-center gap-2 transition-all mt-1"
                    disabled={isVerifying}
                    type="submit"
                  >
                    {isVerifying ? (
                      <span>Verifying Credentials...</span>
                    ) : (
                      <>
                        <span>Sign In as {role === 'PHARMACIST' ? 'Pharmacist' : 'Patient'}</span>
                        <span className="material-symbols-outlined text-[16px]">login</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Passkey / FIDO2 / TrustOps Hardware Key Login */}
              {(loginMethod === 'passkey' || role === 'TRUST_OFFICER') && (
                <div className="p-space-md bg-surface-container-low rounded-2xl border border-outline-variant/30 flex flex-col items-center text-center gap-space-sm">
                  <div className="w-14 h-14 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center animate-pulse">
                    <span className="material-symbols-outlined text-[32px]">fingerprint</span>
                  </div>

                  <div className="flex flex-col">
                    <h3 className="font-headline-sm text-sm font-bold text-primary">
                      {role === 'TRUST_OFFICER' ? 'FIDO2 / Hardware Security Key' : 'Biometric Passkey (WebAuthn)'}
                    </h3>
                    <p className="font-body-sm text-xs text-on-surface-variant max-w-xs">
                      {role === 'TRUST_OFFICER'
                        ? 'Insert and touch your FIDO2 YubiKey or authenticate via corporate hardware token.'
                        : 'Use Face ID, Touch ID, or device screen lock for instant cryptographic sign in.'}
                    </p>
                  </div>

                  {role === 'TRUST_OFFICER' && (
                    <div className="w-full flex flex-col gap-1 text-left">
                      <label className="font-code-sm text-[11px] font-bold text-primary">
                        Postgres RLS Schema Target
                      </label>
                      <select
                        className="w-full bg-white text-xs font-code-sm p-2 rounded-lg border border-outline-variant/30"
                        value={tenantSchema}
                        onChange={(e) => setTenantSchema(e.target.value)}
                      >
                        <option value="tenant_central_04">tenant_central_04 (Apex Medicos)</option>
                        <option value="tenant_east_04">tenant_east_04 (WellSpring Meds)</option>
                        <option value="public_core">public_core (Global Audit Admin)</option>
                      </select>
                    </div>
                  )}

                  <button
                    className="w-full py-2.5 rounded-xl bg-secondary text-on-secondary font-code-sm text-xs font-bold hover:bg-secondary/90 shadow-sm flex items-center justify-center gap-2 transition-all"
                    disabled={isVerifying}
                    onClick={handlePasskeySimulation}
                  >
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span>{isVerifying ? 'Authenticating Token...' : 'Touch Security Key / Face ID'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* OTP STEP VIEW */}
          {mode === 'login' && isOtpStep && (
            <div className="flex flex-col gap-space-sm text-center">
              <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container mx-auto flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">sms</span>
              </div>
              <div className="flex flex-col">
                <h3 className="font-headline-sm text-sm font-bold text-primary">Enter SMS Code</h3>
                <span className="font-code-sm text-xs text-on-surface-variant">
                  Sent to {phoneNumber || '+1 (555) 018-9921'}
                </span>
              </div>

              {/* 4 Digit Boxes */}
              <div className="flex justify-center gap-2 my-2">
                {[0, 1, 2, 3].map((idx) => (
                  <input
                    key={idx}
                    autoFocus={idx === 0}
                    className="w-12 h-12 text-center text-lg font-bold font-code-sm rounded-xl bg-surface-container-low border-2 border-outline-variant/40 focus:border-secondary focus:outline-none"
                    maxLength={1}
                    type="text"
                    value={otpDigits[idx]}
                    onChange={(e) => {
                      const val = e.target.value;
                      const next = [...otpDigits];
                      next[idx] = val;
                      setOtpDigits(next);
                    }}
                  />
                ))}
              </div>

              {/* Quick autofill suggestion for test ease */}
              <button
                className="text-[11px] font-code-sm text-secondary hover:underline flex items-center justify-center gap-1"
                type="button"
                onClick={() => setOtpDigits(['4', '8', '9', '2'])}
              >
                <span className="material-symbols-outlined text-[13px]">key</span>
                Auto-fill demo token: <strong className="font-mono">4 8 9 2</strong>
              </button>

              <button
                className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-code-sm text-xs font-bold hover:bg-primary-container shadow-sm flex items-center justify-center gap-2 transition-all mt-2"
                disabled={isVerifying}
                onClick={handleVerifyOtp}
              >
                {isVerifying ? (
                  <span>Validating SHA-256 Token...</span>
                ) : (
                  <>
                    <span>Verify & Release Session</span>
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs font-code-sm text-on-surface-variant pt-2">
                <button
                  className="hover:underline"
                  onClick={() => setIsOtpStep(false)}
                >
                  Change phone
                </button>
                <span>Resend in {otpCountdown}s</span>
              </div>
            </div>
          )}

          {/* REGISTRATION VIEW */}
          {mode === 'register' && (
            <form className="flex flex-col gap-space-sm" onSubmit={handleEmailAuth}>
              <div className="flex flex-col gap-1">
                <label className="font-code-sm text-xs font-bold text-primary">
                  {role === 'PHARMACIST' ? 'Supervising Pharmacist Legal Name' : 'Full Legal Patient Name'}
                </label>
                <input
                  className="bg-surface-container-low rounded-xl px-3 py-2 text-xs font-body-base text-primary border border-outline-variant/30 focus:outline-none focus:border-secondary"
                  placeholder={role === 'PHARMACIST' ? 'Dr. Kimberly Young, PharmD' : 'Sarah Connor'}
                  required
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                <div className="flex flex-col gap-1">
                  <label className="font-code-sm text-xs font-bold text-primary">Email Address</label>
                  <input
                    className="bg-surface-container-low rounded-xl px-3 py-2 text-xs font-body-base text-primary border border-outline-variant/30 focus:outline-none focus:border-secondary"
                    placeholder="name@domain.com"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-code-sm text-xs font-bold text-primary">Mobile Phone (for PIN Release)</label>
                  <input
                    className="bg-surface-container-low rounded-xl px-3 py-2 text-xs font-code-sm text-primary border border-outline-variant/30 focus:outline-none focus:border-secondary"
                    placeholder="+1 (555) 018-9921"
                    required
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>

              {role === 'PATIENT' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                  <div className="flex flex-col gap-1">
                    <label className="font-code-sm text-xs font-bold text-primary">Date of Birth</label>
                    <input
                      className="bg-surface-container-low rounded-xl px-3 py-2 text-xs font-code-sm text-primary border border-outline-variant/30 focus:outline-none focus:border-secondary"
                      required
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-code-sm text-xs font-bold text-primary">Delivery Address</label>
                    <input
                      className="bg-surface-container-low rounded-xl px-3 py-2 text-xs font-body-base text-primary border border-outline-variant/30 focus:outline-none focus:border-secondary"
                      placeholder="742 Evergreen Terr, Springfield"
                      required
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {role === 'PHARMACIST' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                  <div className="flex flex-col gap-1">
                    <label className="font-code-sm text-xs font-bold text-primary">Pharmacy Entity Name</label>
                    <input
                      className="bg-surface-container-low rounded-xl px-3 py-2 text-xs font-body-base text-primary border border-outline-variant/30 focus:outline-none focus:border-secondary"
                      placeholder="WellSpring Meds Inc."
                      required
                      type="text"
                      value={pharmacyName}
                      onChange={(e) => setPharmacyName(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-code-sm text-xs font-bold text-primary">State License / NABP #</label>
                    <input
                      className="bg-surface-container-low rounded-xl px-3 py-2 text-xs font-code-sm text-primary border border-outline-variant/30 focus:outline-none focus:border-secondary"
                      placeholder="DL-88492-MED"
                      required
                      type="text"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label className="font-code-sm text-xs font-bold text-primary">Create Secure Password</label>
                <div className="flex items-center bg-surface-container-low rounded-xl px-3 py-2 border border-outline-variant/30 focus-within:border-secondary">
                  <input
                    className="bg-transparent w-full text-xs font-body-base text-primary focus:outline-none"
                    placeholder="Minimum 8 characters with symbol"
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    className="text-on-surface-variant hover:text-primary transition-colors"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Compliance Checkboxes */}
              <div className="flex flex-col gap-2 pt-1 text-xs">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    checked={hipaaConsent}
                    className="mt-0.5 rounded text-primary focus:ring-primary"
                    type="checkbox"
                    onChange={(e) => setHipaaConsent(e.target.checked)}
                  />
                  <span className="text-on-surface text-[11px] leading-tight">
                    I acknowledge the{' '}
                    <button
                      className="text-secondary font-bold underline"
                      type="button"
                      onClick={() => setShowHipaaModal(true)}
                    >
                      HIPAA Notice of Privacy Practices
                    </button>{' '}
                    and consent to secure cryptographic EHR synchronization.
                  </span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    checked={fdaNotice}
                    className="mt-0.5 rounded text-primary focus:ring-primary"
                    type="checkbox"
                    onChange={(e) => setFdaNotice(e.target.checked)}
                  />
                  <span className="text-on-surface text-[11px] leading-tight">
                    I understand that all dispensed generic medicines are FDA AB-Rated bioequivalents dispensed by
                    licensed state pharmacies.
                  </span>
                </label>
              </div>

              <button
                className="w-full py-2.5 rounded-xl bg-secondary text-on-secondary font-code-sm text-xs font-bold hover:bg-secondary/90 shadow-sm flex items-center justify-center gap-2 transition-all mt-2"
                disabled={isVerifying || !hipaaConsent}
                type="submit"
              >
                {isVerifying ? (
                  <span>Registering Identity on Ledger...</span>
                ) : (
                  <>
                    <span>Create {role === 'PHARMACIST' ? 'Pharmacy Partner' : 'Patient'} Account</span>
                    <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer Security Badges */}
          <div className="pt-space-xs border-t border-surface-container flex items-center justify-between text-[11px] text-on-surface-variant font-code-sm">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-secondary">lock</span>
              <span>AES-256 TLS 1.3</span>
            </div>
            <span>SOC2 Type II • ISO 27001</span>
          </div>
        </div>
      </main>

      {/* HIPAA Consent Details Modal */}
      {showHipaaModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-md w-full rounded-2xl p-space-lg shadow-2xl border border-outline-variant/30 flex flex-col gap-space-sm">
            <div className="flex items-center justify-between border-b border-surface-container pb-space-xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">health_and_safety</span>
                <h3 className="font-headline-sm text-sm font-bold text-primary">HIPAA Privacy Notice (164.312)</h3>
              </div>
              <button
                className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-on-surface"
                onClick={() => setShowHipaaModal(false)}
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="text-xs text-on-surface-variant space-y-2 max-h-60 overflow-y-auto pr-1">
              <p>
                <strong>Protected Health Information (PHI) Handling:</strong> GenricMed stores and transmits prescription
                records, active ingredient allergies, and delivery release PINs using end-to-end envelope encryption.
              </p>
              <p>
                <strong>Immutable Audit Logging:</strong> In compliance with HIPAA Security Rule 45 CFR § 164.312(b), all
                access events to your medical history are signed with SHA-256 Merkle seals and reviewed by certified
                compliance trust officers.
              </p>
              <p>
                <strong>Emergency Disclosure:</strong> Data is never sold or brokered to commercial ad networks. Records
                are only accessible to your fulfilling licensed pharmacist and verified delivery courier.
              </p>
            </div>
            <button
              className="w-full py-2 bg-primary text-on-primary rounded-xl font-code-sm text-xs font-bold hover:bg-primary-container"
              onClick={() => setShowHipaaModal(false)}
            >
              I Understand & Agree
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

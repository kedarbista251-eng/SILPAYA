import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { signInWithGoogle } from '../firebase/authService';
import { 
  X, 
  ShieldCheck, 
  Sparkles, 
  User as UserIcon, 
  Hammer, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Lock,
  Mail,
  Compass
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'onboarding';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'onboarding' }) => {
  const { login, register, setCurrentUser, showToast, setCurrentView } = useApp();

  const [mode, setMode] = useState<'login' | 'onboarding'>(initialMode);
  
  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');

  // Onboarding Wizard State
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>('collector');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  // Role specific fields
  const [workshopName, setWorkshopName] = useState('Shakya Heritage Foundry');
  const [artisanTitle, setArtisanTitle] = useState('Master Lost-Wax Metal Caster');
  const [location, setLocation] = useState('Sundhara, Patan (Lalitpur)');
  const [organizationName, setOrganizationName] = useState('Himalayan Heritage Trust');
  const [collectorSanctuary, setCollectorSanctuary] = useState('Geneva Sanctuary Vault');
  const [selectedTraditions, setSelectedTraditions] = useState<string[]>([
    'Metal Statues',
    'Wood Carving'
  ]);

  if (!isOpen) return null;

  const toggleTradition = (trad: string) => {
    setSelectedTraditions(prev => 
      prev.includes(trad) ? prev.filter(t => t !== trad) : [...prev, trad]
    );
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) return;

    const ok = await login(loginEmail);
    if (ok) {
      onClose();
    }
  };

  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const ok = await register({
      name,
      email,
      role: selectedRole,
      artisanTitle: selectedRole === 'artisan' ? artisanTitle : undefined,
      workshopName: selectedRole === 'artisan' ? workshopName : undefined,
      location: selectedRole === 'artisan' ? location : undefined,
      organizationName: selectedRole === 'enterprise_buyer' ? organizationName : undefined
    });

    if (ok) {
      onClose();
      if (selectedRole === 'artisan') {
        setCurrentView('artist');
        window.location.hash = 'artist';
      } else if (selectedRole === 'enterprise_buyer') {
        setCurrentView('b2b');
        window.location.hash = 'b2b';
      } else {
        setCurrentView('collector');
        window.location.hash = 'collector';
      }
    }
  };

  const quickSwitchDemo = (emailToUse: string, roleToNavigate: UserRole) => {
    login(emailToUse);
    onClose();
    if (roleToNavigate === 'artisan') {
      setCurrentView('artist');
      window.location.hash = 'artist';
    } else if (roleToNavigate === 'enterprise_buyer') {
      setCurrentView('b2b');
      window.location.hash = 'b2b';
    } else {
      setCurrentView('collector');
      window.location.hash = 'collector';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white rounded-xl border border-[#E7E2D9] shadow-2xl p-6 sm:p-8 my-8 text-[#1C1917]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Tabs */}
        <div className="flex items-center gap-4 border-b border-[#F5F2EB] pb-3 mb-6">
          <button
            onClick={() => setMode('onboarding')}
            className={`font-serif text-lg font-bold pb-2 transition-colors cursor-pointer border-b-2 ${
              mode === 'onboarding'
                ? 'border-[#B45309] text-[#1C1917]'
                : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            Guild Onboarding
          </button>

          <button
            onClick={() => setMode('login')}
            className={`font-serif text-lg font-bold pb-2 transition-colors cursor-pointer border-b-2 ${
              mode === 'login'
                ? 'border-[#B45309] text-[#1C1917]'
                : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            Sign In
          </button>
        </div>

        {/* QUICK DEMO PERSONAS FOR INSTANT TESTING */}
        <div className="p-3.5 mb-6 rounded-lg bg-[#FAF8F5] border border-[#E7E2D9]">
          <div className="flex items-center justify-between text-xs text-[#78716C] mb-2">
            <span className="font-semibold text-[#B45309] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Persona Switcher</span>
            </span>
            <span className="text-[10px]">One-click live profile testing</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => quickSwitchDemo('alexander.vance@finearttrust.org', 'collector')}
              className="p-2 rounded border border-[#E7E2D9] bg-white hover:border-[#B45309] text-left transition-colors cursor-pointer"
            >
              <div className="font-semibold text-[#1C1917] truncate">Alexander Vance</div>
              <div className="text-[10px] text-[#78716C]">Private Collector</div>
            </button>

            <button
              onClick={() => quickSwitchDemo('rajendra.shakya@craftnepal.org', 'artisan')}
              className="p-2 rounded border border-[#E7E2D9] bg-white hover:border-[#B45309] text-left transition-colors cursor-pointer"
            >
              <div className="font-semibold text-[#1C1917] truncate">Rajendra Shakya</div>
              <div className="text-[10px] text-[#78716C]">Master Metal Artisan</div>
            </button>

            <button
              onClick={() => quickSwitchDemo('devendra.rana@annapurnaresorts.com', 'enterprise_buyer')}
              className="p-2 rounded border border-[#E7E2D9] bg-white hover:border-[#B45309] text-left transition-colors cursor-pointer"
            >
              <div className="font-semibold text-[#1C1917] truncate">Devendra Rana</div>
              <div className="text-[10px] text-[#78716C]">Resort B2B Director</div>
            </button>
          </div>
        </div>

        {/* MODE 1: LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#1C1917] mb-1">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                <input
                  type="email"
                  required
                  placeholder="name@organization.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-[#E7E2D9] rounded focus:border-[#B45309] focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#1C1917] hover:bg-[#292524] rounded transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Access Sovereign Account</span>
              </button>

              <div className="flex items-center gap-2 my-2">
                <div className="flex-1 h-px bg-[#E7E2D9]" />
                <span className="text-[10px] text-[#78716C] uppercase">or</span>
                <div className="flex-1 h-px bg-[#E7E2D9]" />
              </div>

              <button
                type="button"
                onClick={async () => {
                  try {
                    const u = await signInWithGoogle(selectedRole);
                    if (u) {
                      setCurrentUser(u);
                      onClose();
                      showToast(`Signed in with Google via Firebase Auth as ${u.name}!`);
                    }
                  } catch (e: any) {
                    showToast(e.message || 'Firebase Google Sign-In error');
                  }
                }}
                className="w-full py-2.5 px-4 text-xs font-semibold text-[#1C1917] bg-white border border-[#E7E2D9] hover:bg-stone-50 rounded transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google (Firebase Auth)</span>
              </button>
            </div>

            <p className="text-center text-[11px] text-[#78716C] pt-2">
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => setMode('onboarding')}
                className="text-[#B45309] font-semibold underline"
              >
                Complete Onboarding
              </button>
            </p>
          </form>
        )}

        {/* MODE 2: ONBOARDING WIZARD */}
        {mode === 'onboarding' && (
          <div>
            {/* Step Indicators */}
            <div className="flex items-center justify-between mb-6 text-xs text-[#78716C]">
              <span className={`font-semibold ${step === 1 ? 'text-[#B45309]' : 'text-[#1C1917]'}`}>
                1. Select Persona
              </span>
              <span className="text-stone-300">→</span>
              <span className={`font-semibold ${step === 2 ? 'text-[#B45309]' : step > 2 ? 'text-[#1C1917]' : 'text-stone-400'}`}>
                2. Cultural Profile
              </span>
              <span className="text-stone-300">→</span>
              <span className={`font-semibold ${step === 3 ? 'text-[#B45309]' : 'text-stone-400'}`}>
                3. Credentials
              </span>
            </div>

            {/* STEP 1: Select Persona */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-3">
                  {/* Collector Card */}
                  <div
                    onClick={() => setSelectedRole('collector')}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      selectedRole === 'collector'
                        ? 'border-[#B45309] bg-[#FAF8F5] ring-2 ring-[#B45309]/20 shadow-xs'
                        : 'border-[#E7E2D9] hover:border-stone-400 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded bg-amber-100 text-[#B45309] mt-0.5">
                        <UserIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-serif text-base font-bold text-[#1C1917]">
                          Art Collector & Cultural Patron
                        </div>
                        <div className="text-[11px] font-nepali text-[#B45309]">
                          सम्पदा संग्रहकर्ता
                        </div>
                        <p className="mt-1 text-xs text-[#57534E] leading-relaxed">
                          Acquire authenticated Himalayan masterworks, inspect cryptographic SHA-256 provenance chains, and print certified museum diplomas.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Master Artisan Card */}
                  <div
                    onClick={() => setSelectedRole('artisan')}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      selectedRole === 'artisan'
                        ? 'border-[#B45309] bg-[#FAF8F5] ring-2 ring-[#B45309]/20 shadow-xs'
                        : 'border-[#E7E2D9] hover:border-stone-400 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded bg-amber-100 text-[#B45309] mt-0.5">
                        <Hammer className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-serif text-base font-bold text-[#1C1917]">
                          Master Artisan & Guild Member
                        </div>
                        <div className="text-[11px] font-nepali text-[#B45309]">
                          शिल्पकार तथा गुठी सदस्य
                        </div>
                        <p className="mt-1 text-xs text-[#57534E] leading-relaxed">
                          Catalog pieces with voice-note oral archives, quote custom commissions with 50% milestone deposits, and receive 88% direct payouts.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* B2B Enterprise Card */}
                  <div
                    onClick={() => setSelectedRole('enterprise_buyer')}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      selectedRole === 'enterprise_buyer'
                        ? 'border-[#B45309] bg-[#FAF8F5] ring-2 ring-[#B45309]/20 shadow-xs'
                        : 'border-[#E7E2D9] hover:border-stone-400 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded bg-amber-100 text-[#B45309] mt-0.5">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-serif text-base font-bold text-[#1C1917]">
                          Hospitality & Architectural Buyer
                        </div>
                        <div className="text-[11px] font-nepali text-[#B45309]">
                          होटल तथा संस्थागत खरिददार
                        </div>
                        <p className="mt-1 text-xs text-[#57534E] leading-relaxed">
                          Procure bulk pagoda carvings, lost-wax statues, and diplomatic collections under the 50/50 Milestone Escrow Protocol.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-[#1C1917] hover:bg-[#292524] rounded flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Continue to Step 2</span>
                    <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Cultural Profile & Guild Credentials */}
            {step === 2 && (
              <div className="space-y-4 text-xs">
                {selectedRole === 'artisan' && (
                  <div className="space-y-3">
                    <div className="font-serif text-sm font-bold text-[#1C1917]">
                      Workshop & Ancestral Guild Registration
                    </div>

                    <div>
                      <label className="block font-semibold text-[#1C1917] mb-1">
                        Sanctuary / Workshop Name
                      </label>
                      <input
                        type="text"
                        value={workshopName}
                        onChange={(e) => setWorkshopName(e.target.value)}
                        className="w-full px-3 py-2 border border-[#E7E2D9] rounded"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[#1C1917] mb-1">
                        Master Artisan Title & Discipline
                      </label>
                      <input
                        type="text"
                        value={artisanTitle}
                        onChange={(e) => setArtisanTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-[#E7E2D9] rounded"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[#1C1917] mb-1">
                        Workshop Quarter Location
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full px-3 py-2 border border-[#E7E2D9] rounded"
                      />
                    </div>
                  </div>
                )}

                {selectedRole === 'collector' && (
                  <div className="space-y-3">
                    <div className="font-serif text-sm font-bold text-[#1C1917]">
                      Collector Preferences & Sanctuary Details
                    </div>

                    <div>
                      <label className="block font-semibold text-[#1C1917] mb-1">
                        Sanctuary / Vault City Location
                      </label>
                      <input
                        type="text"
                        value={collectorSanctuary}
                        onChange={(e) => setCollectorSanctuary(e.target.value)}
                        className="w-full px-3 py-2 border border-[#E7E2D9] rounded"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[#1C1917] mb-1">
                        Curatorial Interests (Select all that apply)
                      </label>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {[
                          'Metal Statues',
                          'Wood Carving',
                          'Thangka/Paubha',
                          'Mithila Art',
                          'Lokta Paper',
                          'Weaving'
                        ].map(trad => {
                          const active = selectedTraditions.includes(trad);
                          return (
                            <button
                              key={trad}
                              type="button"
                              onClick={() => toggleTradition(trad)}
                              className={`p-2 rounded text-left border cursor-pointer ${
                                active ? 'bg-[#FAF8F5] border-[#B45309] font-semibold text-[#B45309]' : 'bg-white border-[#E7E2D9] text-[#57534E]'
                              }`}
                            >
                              {trad}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {selectedRole === 'enterprise_buyer' && (
                  <div className="space-y-3">
                    <div className="font-serif text-sm font-bold text-[#1C1917]">
                      Institutional & Hospitality Scope
                    </div>

                    <div>
                      <label className="block font-semibold text-[#1C1917] mb-1">
                        Organization / Hotel / Diplomatic Entity
                      </label>
                      <input
                        type="text"
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        className="w-full px-3 py-2 border border-[#E7E2D9] rounded"
                      />
                    </div>

                    <div className="p-3 bg-[#FAF8F5] rounded border border-[#E7E2D9] text-[11px] text-[#57534E]">
                      Your account will be pre-configured with access to our 50/50 Milestone Escrow Billing and Kathmandu Hub physical quality assurance logs.
                    </div>
                  </div>
                )}

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 text-xs font-medium text-[#57534E] hover:text-[#1C1917] flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-[#1C1917] hover:bg-[#292524] rounded flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Final Step: Credentials</span>
                    <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Account Credentials */}
            {step === 3 && (
              <form onSubmit={handleOnboardingSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#1C1917] mb-1">
                    Full Name / Representative Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Maya Bajracharya"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E7E2D9] rounded focus:border-[#B45309] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1C1917] mb-1">
                    Official Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="maya@shilpaya-guild.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E7E2D9] rounded focus:border-[#B45309] focus:outline-none"
                  />
                </div>

                <div className="p-3 bg-emerald-50 rounded border border-emerald-200 text-xs text-emerald-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>FHAN Sovereign Cultural Registry</span>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    By completing onboarding, your profile will be registered in the persistent Shilpaya SQLite database and tied to all artwork creation, procurement, and provenance events.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2 text-xs font-medium text-[#57534E] hover:text-[#1C1917] flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-semibold text-[#1C1917] bg-[#F59E0B] hover:bg-[#D97706] rounded transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete Onboarding & Enter Vault</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

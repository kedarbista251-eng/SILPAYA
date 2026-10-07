import React from 'react';
import { useApp, ViewType } from '../context/AppContext';
import { 
  Compass, 
  Hammer, 
  ShieldCheck, 
  Building2, 
  User as UserIcon 
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentView, setCurrentView, currentUser, openAuthModal } = useApp();

  const handleNavClick = (view: ViewType) => {
    setCurrentView(view);
    if (view === 'storefront') window.location.hash = 'gallery';
    else if (view === 'artist') window.location.hash = 'artist';
    else if (view === 'verify') window.location.hash = '/verify/SHP-ART-2026-000845';
    else if (view === 'b2b') window.location.hash = 'b2b';
    else if (view === 'collector') window.location.hash = 'collector';
    else if (view === 'profile') window.location.hash = 'profile';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav 
      aria-label="Mobile Bottom App Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#FAF8F5]/95 backdrop-blur-xl border-t border-[#E7E2D9] px-1 sm:px-2 py-1 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex items-center justify-around select-none"
      style={{ paddingBottom: 'calc(0.4rem + env(safe-area-inset-bottom, 0px))' }}
    >
      {/* 1. Gallery Tab */}
      <button
        onClick={() => handleNavClick('storefront')}
        className={`flex flex-col items-center justify-center flex-1 py-1 rounded-lg transition-all cursor-pointer ${
          currentView === 'storefront' || currentView === 'pdp'
            ? 'text-[#B45309] font-bold scale-105'
            : 'text-[#78716C] hover:text-[#1C1917]'
        }`}
      >
        <Compass className={`w-5 h-5 ${currentView === 'storefront' || currentView === 'pdp' ? 'stroke-[2.5] text-[#B45309]' : 'stroke-2'}`} />
        <span className="text-[10px] tracking-tight mt-0.5">Gallery</span>
        {(currentView === 'storefront' || currentView === 'pdp') && (
          <span className="w-1 h-1 rounded-full bg-[#B45309] mt-0.5" />
        )}
      </button>

      {/* 2. Studio Tab */}
      <button
        onClick={() => handleNavClick('artist')}
        className={`flex flex-col items-center justify-center flex-1 py-1 rounded-lg transition-all cursor-pointer ${
          currentView === 'artist'
            ? 'text-[#B45309] font-bold scale-105'
            : 'text-[#78716C] hover:text-[#1C1917]'
        }`}
      >
        <Hammer className={`w-5 h-5 ${currentView === 'artist' ? 'stroke-[2.5] text-[#B45309]' : 'stroke-2'}`} />
        <span className="text-[10px] tracking-tight mt-0.5">Studio</span>
        {currentView === 'artist' && (
          <span className="w-1 h-1 rounded-full bg-[#B45309] mt-0.5" />
        )}
      </button>

      {/* 3. Verify Tab */}
      <button
        onClick={() => handleNavClick('verify')}
        className={`flex flex-col items-center justify-center flex-1 py-1 rounded-lg transition-all cursor-pointer ${
          currentView === 'verify'
            ? 'text-[#B45309] font-bold scale-105'
            : 'text-[#78716C] hover:text-[#1C1917]'
        }`}
      >
        <ShieldCheck className={`w-5 h-5 ${currentView === 'verify' ? 'stroke-[2.5] text-[#B45309]' : 'stroke-2'}`} />
        <span className="text-[10px] tracking-tight mt-0.5">Verify</span>
        {currentView === 'verify' && (
          <span className="w-1 h-1 rounded-full bg-[#B45309] mt-0.5" />
        )}
      </button>

      {/* 4. B2B Tab */}
      <button
        onClick={() => handleNavClick('b2b')}
        className={`flex flex-col items-center justify-center flex-1 py-1 rounded-lg transition-all cursor-pointer ${
          currentView === 'b2b'
            ? 'text-[#B45309] font-bold scale-105'
            : 'text-[#78716C] hover:text-[#1C1917]'
        }`}
      >
        <Building2 className={`w-5 h-5 ${currentView === 'b2b' ? 'stroke-[2.5] text-[#B45309]' : 'stroke-2'}`} />
        <span className="text-[10px] tracking-tight mt-0.5">B2B</span>
        {currentView === 'b2b' && (
          <span className="w-1 h-1 rounded-full bg-[#B45309] mt-0.5" />
        )}
      </button>

      {/* 5. Profile Tab */}
      <button
        onClick={() => {
          if (currentUser) {
            handleNavClick('profile');
          } else {
            openAuthModal('onboarding');
          }
        }}
        className={`flex flex-col items-center justify-center flex-1 py-1 rounded-lg transition-all cursor-pointer ${
          currentView === 'profile'
            ? 'text-[#B45309] font-bold scale-105'
            : 'text-[#78716C] hover:text-[#1C1917]'
        }`}
      >
        {currentUser ? (
          <img 
            src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt={currentUser.name}
            className={`w-5 h-5 rounded-full object-cover border ${
              currentView === 'profile' ? 'border-[#B45309] ring-2 ring-amber-400/40' : 'border-stone-300'
            }`}
          />
        ) : (
          <UserIcon className="w-5 h-5 stroke-2" />
        )}
        <span className="text-[10px] tracking-tight mt-0.5">
          {currentUser ? 'Profile' : 'Sign In'}
        </span>
        {currentView === 'profile' && (
          <span className="w-1 h-1 rounded-full bg-[#B45309] mt-0.5" />
        )}
      </button>
    </nav>
  );
};

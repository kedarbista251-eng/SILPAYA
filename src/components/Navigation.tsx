import React, { useState, useEffect } from 'react';
import { useApp, ViewType } from '../context/AppContext';
import { GlobalSearchModal } from './GlobalSearchModal';
import { 
  ShoppingBag, 
  Globe, 
  ShieldCheck, 
  User as UserIcon, 
  LogOut, 
  ChevronDown, 
  Sparkles,
  Search
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    cart, 
    setIsCartOpen,
    language,
    toggleLanguage,
    myCollection,
    currentUser,
    openAuthModal,
    openProfileModal,
    logout
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global keyboard shortcut: Cmd+K or Ctrl+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavClick = (view: ViewType) => {
    setCurrentView(view);
    if (view === 'storefront') window.location.hash = 'gallery';
    else if (view === 'artist') window.location.hash = 'artist';
    else if (view === 'verify') window.location.hash = '/verify/SHP-ART-2026-000845';
    else if (view === 'b2b') window.location.hash = 'b2b';
    else if (view === 'collector') window.location.hash = 'collector';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getRoleBadge = (role?: string) => {
    if (role === 'artisan') return { label: 'Artisan Guild', color: 'text-amber-800 bg-amber-50 border-amber-200' };
    if (role === 'enterprise_buyer') return { label: 'B2B Procurement', color: 'text-sky-800 bg-sky-50 border-sky-200' };
    return { label: 'Collector Patron', color: 'text-emerald-800 bg-emerald-50 border-emerald-200' };
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#E7E2D9] bg-[#FAF8F5]/95 backdrop-blur-md transition-colors">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
          
          {/* Zone 1: Single text element Brand Wordmark */}
          <button
            onClick={() => handleNavClick('storefront')}
            className="group text-left transition-opacity hover:opacity-85 shrink-0"
          >
            <span className="font-serif text-2xl font-bold tracking-tight text-[#1C1917] sm:text-3xl">
              SHILPAYA
            </span>
            <span className="block text-[10px] tracking-widest text-[#B45309] font-medium uppercase -mt-1">
              नेपाल शिल्प संग्रहालय · Est. Kathmandu
            </span>
          </button>

          {/* Zone 2: Navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-[13px] font-medium tracking-wide text-[#57534E]">
            <button
              onClick={() => handleNavClick('storefront')}
              className={`transition-colors hover:text-[#1C1917] whitespace-nowrap cursor-pointer ${
                currentView === 'storefront' || currentView === 'pdp'
                  ? 'text-[#1C1917] font-semibold border-b-2 border-[#B45309] pb-0.5'
                  : ''
              }`}
            >
              Storefront & Gallery
            </button>

            <button
              onClick={() => handleNavClick('artist')}
              className={`transition-colors hover:text-[#1C1917] whitespace-nowrap cursor-pointer ${
                currentView === 'artist'
                  ? 'text-[#1C1917] font-semibold border-b-2 border-[#B45309] pb-0.5'
                  : ''
              }`}
            >
              Artist Studio
            </button>

            <button
              onClick={() => handleNavClick('verify')}
              className={`transition-colors hover:text-[#1C1917] whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                currentView === 'verify'
                  ? 'text-[#1C1917] font-semibold border-b-2 border-[#B45309] pb-0.5'
                  : ''
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#B45309]" />
              Verify Certificate
            </button>

            <button
              onClick={() => handleNavClick('b2b')}
              className={`transition-colors hover:text-[#1C1917] whitespace-nowrap cursor-pointer ${
                currentView === 'b2b'
                  ? 'text-[#1C1917] font-semibold border-b-2 border-[#B45309] pb-0.5'
                  : ''
              }`}
            >
              B2B Procurement
            </button>

            <button
              onClick={() => handleNavClick('collector')}
              className={`transition-colors hover:text-[#1C1917] whitespace-nowrap cursor-pointer ${
                currentView === 'collector'
                  ? 'text-[#1C1917] font-semibold border-b-2 border-[#B45309] pb-0.5'
                  : ''
              }`}
            >
              My Collection {myCollection.length > 0 && `(${myCollection.length})`}
            </button>
          </nav>

          {/* Zone 3: Global Search Bar + Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Desktop Global Search Trigger Input */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex items-center gap-2.5 px-3 py-1.5 text-xs text-stone-500 bg-white hover:bg-stone-50 border border-[#E7E2D9] hover:border-amber-400 rounded-lg transition-all shadow-2xs group cursor-pointer w-48 lg:w-64 text-left"
              title="Search masterworks, artists, and categories (⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-[#B45309] shrink-0 group-hover:scale-110 transition-transform" />
              <span className="truncate flex-1 text-stone-500 group-hover:text-stone-800">
                {language === 'en' ? 'Search items, artists...' : 'कला, कलाकार खोज्नुहोस्...'}
              </span>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-stone-400 bg-stone-100 border border-stone-200 rounded">
                ⌘K
              </kbd>
            </button>

            {/* Mobile / Tablet Search Icon Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex md:hidden items-center justify-center p-2 rounded-lg text-stone-600 hover:text-stone-900 border border-[#E7E2D9] bg-white transition-colors cursor-pointer"
              title="Search heritage catalog"
              aria-label="Open search dialog"
            >
              <Search className="w-4 h-4 text-[#B45309]" />
            </button>

            {/* Bilingual quick toggle */}
            <button
              onClick={toggleLanguage}
              title="Switch Language"
              className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-[#57534E] hover:text-[#1C1917] rounded-lg border border-[#E7E2D9] bg-white transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#78716C]" />
              <span className="font-semibold text-[#1C1917]">
                {language === 'en' ? 'EN' : 'नेपाली'}
              </span>
            </button>

            {/* User Account & Onboarding Trigger */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-lg border border-[#E7E2D9] bg-white hover:border-stone-400 transition-colors cursor-pointer text-left"
                >
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full object-cover border border-stone-200"
                  />
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-bold text-[#1C1917] leading-tight truncate max-w-[100px]">
                      {currentUser.name.split(' ')[0]}
                    </div>
                    <div className="text-[10px] text-[#B45309] leading-tight capitalize">
                      {currentUser.role.replace('_', ' ')}
                    </div>
                  </div>
                  <ChevronDown className="w-3 h-3 text-stone-400" />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-lg bg-white border border-[#E7E2D9] shadow-xl p-3 text-xs space-y-2 z-50">
                    <div className="border-b border-[#F5F2EB] pb-2">
                      <div className="font-bold text-[#1C1917] text-sm">{currentUser.name}</div>
                      <div className="text-[11px] text-[#78716C] truncate">{currentUser.email}</div>
                      <div className="mt-1.5">
                        <span className={`inline-block px-2 py-0.5 rounded border text-[10px] font-semibold ${getRoleBadge(currentUser.role).color}`}>
                          {getRoleBadge(currentUser.role).label}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          openProfileModal();
                        }}
                        className="w-full text-left px-2 py-1.5 rounded hover:bg-stone-50 flex items-center gap-2 text-[#1C1917] font-medium"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-[#B45309]" />
                        <span>Profile, Addresses & Alerts</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          openAuthModal('onboarding');
                        }}
                        className="w-full text-left px-2 py-1.5 rounded hover:bg-stone-50 flex items-center gap-2 text-[#57534E]"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#B45309]" />
                        <span>Switch / Onboard New Persona</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-2 py-1.5 rounded hover:bg-red-50 text-red-700 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('onboarding')}
                className="px-3 py-1.5 text-xs font-semibold text-[#1C1917] border border-[#E7E2D9] bg-white hover:bg-stone-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                Sign In / Join
              </button>
            )}

            {/* Acquisition Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="View acquisition bag"
              className="relative flex items-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-[#1C1917] rounded-lg hover:bg-[#292524] transition-colors cursor-pointer whitespace-nowrap"
            >
              <ShoppingBag className="w-4 h-4 text-[#F59E0B]" />
              <span className="hidden sm:inline">Bag</span>
              {cart.length > 0 && (
                <span className="ml-0.5 inline-flex items-center justify-center w-5 h-5 text-[11px] font-bold text-[#1C1917] bg-[#F59E0B] rounded-full">
                  {cart.length}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Mobile nav bar row for easy thumb navigation */}
        <div className="flex md:hidden items-center justify-around border-t border-[#E7E2D9] bg-[#FAF8F5] px-2 py-2 text-xs font-medium text-[#57534E]">
          <button
            onClick={() => handleNavClick('storefront')}
            className={`px-2 py-1 ${currentView === 'storefront' ? 'text-[#B45309] font-bold' : ''}`}
          >
            Gallery
          </button>
          <button
            onClick={() => handleNavClick('artist')}
            className={`px-2 py-1 ${currentView === 'artist' ? 'text-[#B45309] font-bold' : ''}`}
          >
            Studio
          </button>
          <button
            onClick={() => handleNavClick('verify')}
            className={`px-2 py-1 ${currentView === 'verify' ? 'text-[#B45309] font-bold' : ''}`}
          >
            Verify
          </button>
          <button
            onClick={() => handleNavClick('b2b')}
            className={`px-2 py-1 ${currentView === 'b2b' ? 'text-[#B45309] font-bold' : ''}`}
          >
            B2B
          </button>
          <button
            onClick={() => handleNavClick('collector')}
            className={`px-2 py-1 ${currentView === 'collector' ? 'text-[#B45309] font-bold' : ''}`}
          >
            Collection ({myCollection.length})
          </button>
        </div>
      </header>

      {/* Global Search Modal Overlay */}
      <GlobalSearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
};

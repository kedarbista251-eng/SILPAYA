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
  Search,
  BookmarkCheck,
  UserCheck
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

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) {
      window.addEventListener('click', handleOutsideClick);
    }
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [isUserMenuOpen]);

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

  const getRoleBadge = (role?: string) => {
    if (role === 'artisan') return { label: 'Artisan Guild', color: 'text-amber-800 bg-amber-50 border-amber-200' };
    if (role === 'enterprise_buyer') return { label: 'B2B Procurement', color: 'text-sky-800 bg-sky-50 border-sky-200' };
    return { label: 'Collector Patron', color: 'text-emerald-800 bg-emerald-50 border-emerald-200' };
  };

  return (
    <>
      {/* Top App Header */}
      <header className="sticky top-0 z-40 w-full border-b border-[#E7E2D9] bg-[#FAF8F5]/95 backdrop-blur-md transition-colors overflow-x-hidden">
        <div className="mx-auto flex h-15 sm:h-18 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
          
          {/* Zone 1: Brand Wordmark (Compact on mobile to prevent overflow) */}
          <button
            onClick={() => handleNavClick('storefront')}
            className="group flex items-center gap-2.5 text-left transition-opacity hover:opacity-90 shrink-0 cursor-pointer"
          >
            {/* Sacred Lotus Monogram Seal */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#1C1917] text-[#FAF8F5] flex items-center justify-center font-serif text-base sm:text-lg font-bold shadow-xs border border-amber-700/30 group-hover:bg-[#B45309] transition-colors">
              श
            </div>

            <div>
              <span className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-[#1C1917] leading-none block">
                SHILPAYA
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-widest text-[#B45309] font-medium uppercase block leading-tight mt-0.5">
                नेपाल शिल्प संग्रहालय
              </span>
            </div>
          </button>

          {/* Zone 2: Desktop Navigation Links (Hidden on mobile) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[13px] font-medium tracking-wide text-[#57534E]">
            <button
              onClick={() => handleNavClick('storefront')}
              className={`transition-colors hover:text-[#1C1917] whitespace-nowrap cursor-pointer py-1 ${
                currentView === 'storefront' || currentView === 'pdp'
                  ? 'text-[#1C1917] font-semibold border-b-2 border-[#B45309]'
                  : ''
              }`}
            >
              Storefront & Gallery
            </button>

            <button
              onClick={() => handleNavClick('artist')}
              className={`transition-colors hover:text-[#1C1917] whitespace-nowrap cursor-pointer py-1 ${
                currentView === 'artist'
                  ? 'text-[#1C1917] font-semibold border-b-2 border-[#B45309]'
                  : ''
              }`}
            >
              Artist Studio
            </button>

            <button
              onClick={() => handleNavClick('verify')}
              className={`transition-colors hover:text-[#1C1917] whitespace-nowrap cursor-pointer flex items-center gap-1.5 py-1 ${
                currentView === 'verify'
                  ? 'text-[#1C1917] font-semibold border-b-2 border-[#B45309]'
                  : ''
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#B45309]" />
              Verify Certificate
            </button>

            <button
              onClick={() => handleNavClick('b2b')}
              className={`transition-colors hover:text-[#1C1917] whitespace-nowrap cursor-pointer py-1 ${
                currentView === 'b2b'
                  ? 'text-[#1C1917] font-semibold border-b-2 border-[#B45309]'
                  : ''
              }`}
            >
              B2B Procurement
            </button>

            <button
              onClick={() => handleNavClick('collector')}
              className={`transition-colors hover:text-[#1C1917] whitespace-nowrap cursor-pointer py-1 ${
                currentView === 'collector'
                  ? 'text-[#1C1917] font-semibold border-b-2 border-[#B45309]'
                  : ''
              }`}
            >
              My Collection {myCollection.length > 0 && `(${myCollection.length})`}
            </button>
          </nav>

          {/* Zone 3: Actions Cluster */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Desktop Global Search Input Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs text-stone-500 bg-white hover:bg-stone-50 border border-[#E7E2D9] hover:border-amber-400 rounded-lg transition-all shadow-2xs group cursor-pointer w-44 lg:w-56 text-left"
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

            {/* Mobile Search Icon Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex md:hidden items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-stone-600 hover:text-stone-900 border border-[#E7E2D9] bg-white transition-colors cursor-pointer"
              title="Search catalog"
              aria-label="Open search dialog"
            >
              <Search className="w-4 h-4 text-[#B45309]" />
            </button>

            {/* Bilingual toggle (Compact) */}
            <button
              onClick={toggleLanguage}
              title="Switch Language"
              className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-[#57534E] hover:text-[#1C1917] rounded-lg border border-[#E7E2D9] bg-white transition-colors cursor-pointer shrink-0 h-8 sm:h-9"
            >
              <Globe className="w-3.5 h-3.5 text-[#78716C]" />
              <span className="font-semibold text-[#1C1917] text-[11px] sm:text-xs">
                {language === 'en' ? 'EN' : 'ने'}
              </span>
            </button>

            {/* Acquisition Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="View acquisition bag"
              className="relative flex items-center justify-center px-2.5 sm:px-3 h-8 sm:h-9 text-xs font-semibold text-white bg-[#1C1917] rounded-lg hover:bg-[#292524] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F59E0B]" />
              <span className="hidden sm:inline ml-1.5">Bag</span>
              {cart.length > 0 && (
                <span className="ml-1 inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 text-[10px] sm:text-[11px] font-bold text-[#1C1917] bg-[#F59E0B] rounded-full">
                  {cart.length}
                </span>
              )}
            </button>

            {/* User Profile Section: Direct navigation to Profile view, no nested popups */}
            <div id="user-menu-container" className="relative shrink-0">
              {currentUser ? (
                <div>
                  <button
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        handleNavClick('profile');
                      } else {
                        setIsUserMenuOpen(!isUserMenuOpen);
                      }
                    }}
                    className={`flex items-center gap-1.5 p-0.5 sm:p-1 sm:pl-2 sm:pr-2 rounded-lg border transition-colors cursor-pointer text-left h-8 sm:h-9 ${
                      currentView === 'profile'
                        ? 'border-[#B45309] bg-amber-50/40 ring-2 ring-amber-400/20'
                        : 'border-[#E7E2D9] bg-white hover:border-stone-400'
                    }`}
                    aria-label="User profile and settings"
                    title="Profile & Sanctuary Settings"
                  >
                    <img
                      src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                      alt={currentUser.name}
                      className="w-7 h-7 sm:w-7 sm:h-7 rounded-full object-cover border border-stone-200 shrink-0"
                    />
                    <div className="hidden xl:block text-left max-w-[90px]">
                      <div className="text-xs font-bold text-[#1C1917] leading-tight truncate">
                        {currentUser.name.split(' ')[0]}
                      </div>
                      <div className="text-[10px] text-[#B45309] leading-tight capitalize truncate">
                        {currentUser.role.replace('_', ' ')}
                      </div>
                    </div>
                    <ChevronDown className="w-3 h-3 text-stone-400 hidden lg:block" />
                  </button>

                  {/* Desktop Dropdown Menu (Navigates directly to full view, no double popups) */}
                  {isUserMenuOpen && (
                    <div className="hidden lg:block absolute right-0 mt-2 w-64 rounded-xl bg-white border border-[#E7E2D9] shadow-2xl p-3 text-xs space-y-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="border-b border-[#F5F2EB] pb-2.5">
                        <div className="font-bold text-[#1C1917] text-sm truncate">{currentUser.name}</div>
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
                            handleNavClick('profile');
                          }}
                          className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-stone-50 flex items-center gap-2.5 text-[#1C1917] font-medium transition-colors"
                        >
                          <UserIcon className="w-4 h-4 text-[#B45309]" />
                          <span>Profile & Addresses</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            handleNavClick('collector');
                          }}
                          className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-stone-50 flex items-center gap-2.5 text-[#1C1917] font-medium transition-colors"
                        >
                          <BookmarkCheck className="w-4 h-4 text-[#B45309]" />
                          <span>My Collection ({myCollection.length})</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            handleNavClick('profile');
                          }}
                          className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-stone-50 flex items-center gap-2.5 text-[#57534E] transition-colors"
                        >
                          <Sparkles className="w-4 h-4 text-[#B45309]" />
                          <span>Switch Persona</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            logout();
                          }}
                          className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-red-50 text-red-700 flex items-center gap-2.5 transition-colors border-t border-stone-100 mt-1 pt-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal('onboarding')}
                  className="px-2.5 sm:px-3 h-8 sm:h-9 text-xs font-semibold text-[#1C1917] border border-[#E7E2D9] bg-white hover:bg-stone-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span className="hidden sm:inline">Sign In</span>
                  <span className="sm:hidden"><UserCheck className="w-3.5 h-3.5" /></span>
                </button>
              )}
            </div>

          </div>

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

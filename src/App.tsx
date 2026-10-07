/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { Storefront } from './components/Storefront';
import { ProductDetail } from './components/ProductDetail';
import { ArtistDashboard } from './components/ArtistDashboard';
import { CertificateVerification } from './components/CertificateVerification';
import { B2BPortal } from './components/B2BPortal';
import { CollectorPortal } from './components/CollectorPortal';
import { ProfileView } from './components/ProfileView';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CartDrawer } from './components/CartDrawer';
import { CertificateModal } from './components/CertificateModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { 
    currentView, 
    activeCertificateModal, 
    setActiveCertificateModal,
    isAuthOpen,
    setIsAuthOpen,
    authMode,
    isProfileModalOpen,
    setIsProfileModalOpen
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1C1917] w-full">
      <Navigation />

      <main className="flex-1 w-full pb-20 lg:pb-0">
        {currentView === 'storefront' && <Storefront />}
        {currentView === 'pdp' && <ProductDetail />}
        {currentView === 'artist' && <ArtistDashboard />}
        {currentView === 'verify' && <CertificateVerification />}
        {currentView === 'b2b' && <B2BPortal />}
        {currentView === 'collector' && <CollectorPortal />}
        {currentView === 'profile' && <ProfileView />}
      </main>

      <Footer />

      {/* Persistent Native Mobile App Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <CertificateModal
        certificate={activeCertificateModal}
        onClose={() => setActiveCertificateModal(null)}
      />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
      />
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

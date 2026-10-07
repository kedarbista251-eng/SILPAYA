import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <footer className="border-t border-[#E7E2D9] bg-[#FAF8F5] text-[#57534E] text-xs no-print">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <span className="font-serif text-xl font-bold tracking-tight text-[#1C1917]">
              SHILPAYA
            </span>
            <p className="text-xs text-[#78716C] leading-relaxed">
              A digital sanctuary and direct artisan marketplace for sacred Nepalese handicrafts, lost-wax metalwork, and Himalayan cultural preservation.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-[#78716C]">
              <MapPin className="w-3.5 h-3.5 text-[#B45309]" />
              <span>Kathmandu Hub · Patan Heritage Atelier, Nepal</span>
            </div>
          </div>

          {/* Traditions */}
          <div className="space-y-2">
            <div className="font-serif text-sm font-bold text-[#1C1917]">Guild Traditions</div>
            <ul className="space-y-1 text-[#78716C]">
              <li>Patan Lost-Wax Copper Casting</li>
              <li>Bhaktapur Sal-Wood Carving</li>
              <li>Nagbahal Mineral Paubha Painting</li>
              <li>Janakpurdham Mithila Ceremonial Art</li>
              <li>Dolakha High-Altitude Lokta Paper</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <div className="font-serif text-sm font-bold text-[#1C1917]">Provenance & Services</div>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => {
                    setCurrentView('verify');
                    window.location.hash = '/verify/SHP-ART-2026-000845';
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#1C1917] transition-colors"
                >
                  Verify Digital Certificate
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('b2b');
                    window.location.hash = 'b2b';
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#1C1917] transition-colors"
                >
                  B2B Hospitality & Architectural RFP
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('artist');
                    window.location.hash = 'artist';
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#1C1917] transition-colors"
                >
                  Artisan Studio & Foundry Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('collector');
                    window.location.hash = 'collector';
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#1C1917] transition-colors"
                >
                  Collector Vault & Ownership Ledger
                </button>
              </li>
            </ul>
          </div>

          {/* Standards & Commitment */}
          <div className="space-y-2">
            <div className="font-serif text-sm font-bold text-[#1C1917]">Ethical Patronage</div>
            <p className="text-[11px] text-[#78716C] leading-relaxed">
              88% of net proceeds are transferred directly to master craftsmen and women. Certified by the Federation of Handicraft Associations of Nepal (FHAN).
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Sovereign Provenance Protocol</span>
            </div>
          </div>

        </div>

        {/* Quiet Bottom row */}
        <div className="mt-12 pt-6 border-t border-[#E7E2D9] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#78716C]">
          <div>
            © {new Date().getFullYear()} SHILPAYA Heritage Trust. All rights reserved. Registered under the Cultural Heritage Registry of Nepal.
          </div>
          <div className="flex items-center gap-4">
            <span>Kathmandu</span>
            <span aria-hidden="true">·</span>
            <span>Lalitpur</span>
            <span aria-hidden="true">·</span>
            <span>Bhaktapur</span>
            <span aria-hidden="true">·</span>
            <span>Janakpur</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

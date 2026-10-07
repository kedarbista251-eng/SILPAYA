import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Printer, 
  MapPin, 
  ExternalLink, 
  History, 
  ArrowUpRight, 
  Sparkles,
  ShoppingBag
} from 'lucide-react';

export const CollectorPortal: React.FC = () => {
  const { 
    myCollection, 
    setCurrentView, 
    setActiveCertificateModal, 
    navigateToVerify,
    openProductDetail
  } = useApp();

  const [selectedCollectorIndex, setSelectedCollectorIndex] = useState(0);

  const activeItem = myCollection[selectedCollectorIndex] || myCollection[0];

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24 w-full max-w-full overflow-x-hidden">
      {/* Header Banner */}
      <section className="bg-[#1C1917] text-white border-b border-[#38332E] py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-[#F59E0B] font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Sovereign Title & Cryptographic Custody</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold break-words">
              Collector Vault & Provenance Portfolio
            </h1>
            <p className="mt-1 text-xs text-[#A8A29E]">
              Archival custody records, physical assay certificates, and chain-of-title tracking.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded bg-white/10 border border-white/20 text-xs">
              <span className="text-[#A8A29E]">Certified Holdings: </span>
              <strong className="text-white font-mono text-sm">{myCollection.length} Masterpieces</strong>
            </div>

            <button
              onClick={() => {
                setCurrentView('storefront');
                window.location.hash = 'gallery';
              }}
              className="px-4 py-2 text-xs font-semibold text-[#1C1917] bg-[#F59E0B] hover:bg-[#D97706] rounded transition-colors cursor-pointer"
            >
              Acquire More Masterworks
            </button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {myCollection.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-lg border border-[#E7E2D9] max-w-xl mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-[#FAF8F5] text-[#B45309] flex items-center justify-center mx-auto mb-4 border border-[#E7E2D9]">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#1C1917]">Your Collection Vault is Empty</h3>
            <p className="mt-2 text-xs text-[#78716C] leading-relaxed">
              Acquire certified Newari wood carvings, lost-wax statues, or sacred Paubha paintings from the gallery to initiate your immutable provenance ledger.
            </p>
            <button
              onClick={() => {
                setCurrentView('storefront');
                window.location.hash = 'gallery';
              }}
              className="mt-6 px-6 py-2.5 text-xs font-semibold text-white bg-[#1C1917] rounded hover:bg-[#292524] cursor-pointer"
            >
              Explore Living Guild Gallery
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Holdings Sidebar List (4 cols) */}
            <div className="lg:col-span-4 space-y-3">
              <div className="text-xs font-semibold text-[#78716C] uppercase tracking-wider px-1">
                Acquired Masterworks ({myCollection.length})
              </div>

              {myCollection.map((item, idx) => {
                const isSelected = idx === selectedCollectorIndex;
                return (
                  <div
                    key={item.orderId + idx}
                    onClick={() => setSelectedCollectorIndex(idx)}
                    className={`p-4 rounded-lg border transition-all cursor-pointer bg-white ${
                      isSelected 
                        ? 'border-[#B45309] ring-2 ring-[#B45309]/20 shadow-xs' 
                        : 'border-[#E7E2D9] hover:border-[#A8A29E]'
                    }`}
                  >
                    <div className="flex gap-3 items-center">
                      <img
                        src={item.artwork.images[0]}
                        alt={item.artwork.title}
                        className="w-16 h-16 rounded object-cover border border-[#E7E2D9] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] text-[#B45309] font-semibold uppercase">
                          {item.artwork.category}
                        </div>
                        <h4 className="font-serif text-sm font-bold text-[#1C1917] truncate">
                          {item.artwork.title}
                        </h4>
                        <div className="text-xs text-[#78716C] font-mono mt-0.5">
                          Acquired {item.purchaseDate}
                        </div>
                        <div className="text-xs font-bold text-[#1C1917] font-mono mt-0.5">
                          ${item.acquisitionPriceUSD.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active Item Provenance & Certificate Dossier (8 cols) */}
            {activeItem && (
              <div className="lg:col-span-8 space-y-6">
                
                {/* Masterwork Dossier Header */}
                <div className="bg-white rounded-lg border border-[#E7E2D9] p-8 shadow-xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[#F5F2EB]">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-[#78716C] mb-1">
                        <span>Order Reference:</span>
                        <strong className="font-mono text-[#1C1917]">{activeItem.orderId}</strong>
                        <span aria-hidden="true">·</span>
                        <span>Acquired {activeItem.purchaseDate}</span>
                      </div>

                      <h2 className="font-serif text-2xl font-bold text-[#1C1917]">
                        {activeItem.artwork.title}
                      </h2>
                      <p className="text-xs text-[#78716C] font-nepali mt-0.5">
                        {activeItem.artwork.nepaliTitle} · Crafted by {activeItem.artwork.artist.name} ({activeItem.artwork.artist.workshopName})
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        onClick={() => setActiveCertificateModal(activeItem.certificate)}
                        className="px-3.5 py-2 text-xs font-semibold text-white bg-[#1C1917] hover:bg-[#292524] rounded flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#F59E0B]" />
                        <span>Print Certificate</span>
                      </button>

                      <button
                        onClick={() => navigateToVerify(activeItem.certificate.id)}
                        className="px-3.5 py-2 text-xs font-semibold text-[#1C1917] bg-[#FAF8F5] border border-[#E7E2D9] hover:bg-[#F5F2EB] rounded flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#B45309]" />
                        <span>Public Registry</span>
                      </button>
                    </div>
                  </div>

                  {/* Certificate Specs & Cryptographic Stamp */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-3 bg-[#FAF8F5] rounded border border-[#E7E2D9]">
                      <span className="text-[10px] text-[#78716C] uppercase font-semibold">Certificate Serial</span>
                      <div className="font-mono font-bold text-[#1C1917] text-sm mt-0.5">
                        {activeItem.certificate.id}
                      </div>
                    </div>

                    <div className="p-3 bg-[#FAF8F5] rounded border border-[#E7E2D9]">
                      <span className="text-[10px] text-[#78716C] uppercase font-semibold">Workshop Origin</span>
                      <div className="font-medium text-[#1C1917] text-xs mt-0.5 truncate">
                        {activeItem.artwork.artist.location}
                      </div>
                    </div>

                    <div className="p-3 bg-[#FAF8F5] rounded border border-[#E7E2D9]">
                      <span className="text-[10px] text-[#78716C] uppercase font-semibold">Assay Grade</span>
                      <div className="font-medium text-emerald-800 text-xs mt-0.5">
                        FHAN Certified Mastercraft
                      </div>
                    </div>
                  </div>

                  {/* High-res Image preview */}
                  <div className="relative aspect-16/9 rounded-lg overflow-hidden border border-[#E7E2D9] bg-[#F5F2EB]">
                    <img
                      src={activeItem.artwork.images[0]}
                      alt={activeItem.artwork.title}
                      className="w-full h-full object-cover object-center"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-3 left-3 bg-[#1C1917]/85 backdrop-blur-xs text-white text-[11px] px-3 py-1 rounded flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#F59E0B]" />
                      <span>Title Registered to Verified Private Vault</span>
                    </div>
                  </div>
                </div>

                {/* Provenance Ledger */}
                <div className="bg-white rounded-lg border border-[#E7E2D9] p-8 shadow-xs space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-[#F5F2EB]">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#1C1917] flex items-center gap-2">
                        <History className="w-5 h-5 text-[#B45309]" />
                        <span>Ownership Provenance & Custody History</span>
                      </h3>
                      <p className="text-xs text-[#78716C] mt-0.5">
                        Cryptographic ledger entries generated across the physical lifespan of this piece.
                      </p>
                    </div>
                  </div>

                  <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E7E2D9]">
                    {activeItem.certificate.provenanceLedger.map((evt) => (
                      <div key={evt.id} className="relative">
                        <div className="absolute -left-[27px] top-1 w-4 h-4 rounded-full border-2 border-white bg-[#B45309] shadow-xs" />

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap text-xs">
                            <span className="font-bold text-[#1C1917]">{evt.stage}</span>
                            <span aria-hidden="true" className="text-[#78716C]">·</span>
                            <span className="font-mono text-[11px] text-[#78716C]">{evt.timestamp}</span>
                          </div>

                          <div className="text-xs text-[#B45309] font-medium flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{evt.location}</span>
                            <span className="text-[#78716C]">({evt.actor})</span>
                          </div>

                          <p className="text-xs text-[#57534E] leading-relaxed pt-0.5">
                            {evt.description}
                          </p>

                          <div className="pt-1 flex items-center gap-3 text-[11px] text-[#78716C]">
                            <span className="bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E7E2D9] font-medium text-[#1C1917]">
                              Seal: {evt.signatureOrSeal}
                            </span>
                            <span className="font-mono text-[10px] text-stone-400">
                              hash: {evt.hash.slice(0, 16)}...
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

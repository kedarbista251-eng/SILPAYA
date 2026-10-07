import React from 'react';
import { Certificate } from '../types';
import { 
  X, 
  Printer, 
  ShieldCheck, 
  Award, 
  Hash, 
  MapPin, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

interface CertificateModalProps {
  certificate: Certificate | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 no-print">
      
      {/* Container */}
      <div className="relative w-full max-w-3xl bg-[#FAF8F5] rounded-xl border border-[#D6CBB8] shadow-2xl p-6 sm:p-10 my-8">
        
        {/* Top Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E7E2D9] mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#B45309] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Sovereign Cultural Certificate</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold text-[#1C1917] bg-white border border-[#E7E2D9] hover:bg-stone-50 rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#B45309]" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-800 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE DIPLOMA FRAME */}
        <div className="relative p-8 sm:p-12 border-4 border-double border-[#8C6D46] bg-[#FCFAF7] rounded-lg shadow-inner text-[#1C1917]">
          
          {/* Corner traditional filigree accents */}
          <div className="absolute top-2 left-2 text-[#8C6D46] text-xs font-mono select-none">❖</div>
          <div className="absolute top-2 right-2 text-[#8C6D46] text-xs font-mono select-none">❖</div>
          <div className="absolute bottom-2 left-2 text-[#8C6D46] text-xs font-mono select-none">❖</div>
          <div className="absolute bottom-2 right-2 text-[#8C6D46] text-xs font-mono select-none">❖</div>

          {/* Header Title */}
          <div className="text-center space-y-2">
            <div className="text-xs font-nepali font-bold text-[#8C6D46] tracking-widest uppercase">
              श्री नेपाल शिल्प सम्पदा महासंघ · काठमाडौं
            </div>
            
            <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-[#1C1917]">
              Certificate of Cultural Authenticity
            </h1>

            <p className="text-xs text-[#78716C] uppercase tracking-widest">
              Sovereign Nepalese Art & Craft Heritage Registry
            </p>

            <div className="pt-2">
              <span className="font-mono text-xs font-bold text-[#1C1917] bg-[#FAF8F5] px-3 py-1 rounded border border-[#E7E2D9]">
                ID: {certificate.id}
              </span>
            </div>
          </div>

          {/* Attestation Text */}
          <div className="my-8 text-center max-w-xl mx-auto space-y-4">
            <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed italic">
              This document solemnly certifies that the artwork detailed herein has been created strictly according to centuries-old Himalayan canons, utilizing pure native materials and certified by the Master Artisan Guild of the Kathmandu Valley.
            </p>

            <div className="pt-2">
              <span className="text-xs text-[#78716C] uppercase tracking-wider block">Masterwork Title</span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1917] mt-0.5">
                {certificate.artworkTitle}
              </h2>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 p-4 rounded bg-[#FAF8F5] border border-[#E7E2D9] text-xs">
            <div>
              <div className="text-[11px] font-semibold text-[#78716C] uppercase">Master Artisan & Lineage</div>
              <div className="font-serif text-base font-bold text-[#1C1917] mt-0.5">
                {certificate.artistName} <span className="font-nepali font-semibold text-[#B45309]">({certificate.artistNepaliName})</span>
              </div>
              <div className="text-[#57534E] text-[11px] mt-0.5">{certificate.craftLineage}</div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-[#78716C] uppercase">Sanctuary Workshop</div>
              <div className="font-medium text-[#1C1917] mt-0.5">{certificate.workshopLocation}</div>
              <div className="text-[#78716C] text-[11px] mt-0.5">
                Dimensions: {certificate.dimensions} · Weight: {certificate.weight}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-[#78716C] uppercase">Physical Assay Stamp</div>
              <div className="font-mono text-[11px] font-semibold text-emerald-900 mt-0.5">
                {certificate.guildAssayStamp}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-[#78716C] uppercase">Registry Date & Edition</div>
              <div className="font-medium text-[#1C1917] mt-0.5">
                {certificate.issueDate} · {certificate.edition}
              </div>
            </div>
          </div>

          {/* Verified Materials */}
          <div className="my-6">
            <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider block mb-2">
              Materials Chemically & Structurally Verified:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
              {certificate.materialsVerified.map((mat, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[#1C1917]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B45309] shrink-0" />
                  <span>{mat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cryptographic Hash */}
          <div className="my-6 p-2.5 bg-white rounded border border-[#E7E2D9] text-center">
            <span className="text-[10px] font-mono text-[#78716C] uppercase block mb-0.5">
              SHA-256 Ledger Fingerprint
            </span>
            <span className="font-mono text-[10px] text-[#1C1917] break-all select-all font-semibold">
              {certificate.cryptographicHash}
            </span>
          </div>

          {/* Signatures & Golden Guild Seal */}
          <div className="mt-10 pt-6 border-t border-[#E7E2D9] flex flex-col sm:flex-row items-center justify-between gap-6">
            
            {/* Signature 1 */}
            <div className="text-center sm:text-left space-y-1">
              <div className="font-serif text-base italic font-bold text-[#1C1917]">
                {certificate.artistName}
              </div>
              <div className="text-[10px] text-[#78716C] uppercase tracking-wider">
                Master Foundry Craftsman Signature
              </div>
              <div className="font-nepali text-xs text-[#B45309]">
                {certificate.artistNepaliName} हस्तलिखित छाप
              </div>
            </div>

            {/* Golden Wax Seal */}
            <div className="relative w-20 h-20 rounded-full border-4 border-[#8C6D46] bg-gradient-to-br from-[#F59E0B] to-[#B45309] text-white flex flex-col items-center justify-center shadow-md shrink-0">
              <ShieldCheck className="w-7 h-7 text-white" />
              <span className="text-[8px] font-bold uppercase tracking-wider mt-0.5">FHAN SEAL</span>
            </div>

            {/* Signature 2 */}
            <div className="text-center sm:text-right space-y-1">
              <div className="font-serif text-base italic font-bold text-[#1C1917]">
                Anjali Thapa, M.Phil
              </div>
              <div className="text-[10px] text-[#78716C] uppercase tracking-wider">
                Chief Curator, Shilpaya Kathmandu
              </div>
              <div className="text-[10px] text-emerald-800 font-semibold">
                Tamper Hologram Affixed
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

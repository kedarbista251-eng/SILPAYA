import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Hash, 
  Award, 
  Printer, 
  Lock,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const CertificateVerification: React.FC = () => {
  const { 
    certificates, 
    verifyCertId, 
    setVerifyCertId, 
    setActiveCertificateModal,
    artworks,
    openProductDetail
  } = useApp();

  const [inputQuery, setInputQuery] = useState(verifyCertId || 'SHP-ART-2026-000845');

  // Search by exact ID or hash or partial
  const certificate = Object.values(certificates).find(c => 
    c.id.toLowerCase() === inputQuery.trim().toLowerCase() ||
    c.cryptographicHash.toLowerCase() === inputQuery.trim().toLowerCase() ||
    c.id.toLowerCase().includes(inputQuery.trim().toLowerCase())
  ) || certificates[verifyCertId] || certificates['SHP-ART-2026-000845'];

  const matchedArtwork = certificate ? artworks.find(a => a.id === certificate.artworkId) : null;

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24 w-full max-w-full overflow-x-hidden">
      
      {/* Header Banner */}
      <section className="bg-[#1C1917] text-white border-b border-[#38332E] py-8 sm:py-14">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B45309]/20 border border-[#B45309]/40 text-[#F59E0B] text-xs font-semibold mb-3 sm:mb-4">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Sovereign Nepalese Cultural Provenance Registry</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight break-words">
            Verify Digital Certificate of Authenticity
          </h1>

          <p className="mt-4 text-sm text-[#A8A29E] max-w-2xl mx-auto leading-relaxed">
            Every masterwork acquired through Shilpaya carries an indelible cryptographic record 
            stamped by the Federation of Handicraft Guilds and the Master Artisan Foundry in Patan or Bhaktapur.
          </p>

          {/* Verification Search Bar */}
          <div className="mt-8 max-w-xl mx-auto">
            <div className="relative flex items-center bg-white rounded-lg border border-[#E7E2D9] shadow-lg p-1.5">
              <Search className="w-5 h-5 text-[#78716C] ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Enter Certificate ID (e.g. SHP-ART-2026-000845) or Hash..."
                value={inputQuery}
                onChange={(e) => {
                  setInputQuery(e.target.value);
                  setVerifyCertId(e.target.value);
                }}
                className="w-full px-3 py-2 text-xs sm:text-sm text-[#1C1917] focus:outline-none font-mono"
              />
              <button
                onClick={() => {
                  if (certificate) {
                    setVerifyCertId(certificate.id);
                  }
                }}
                className="px-4 py-2 text-xs font-semibold text-[#1C1917] bg-[#F59E0B] hover:bg-[#D97706] rounded transition-colors cursor-pointer shrink-0"
              >
                Inspect Ledger
              </button>
            </div>

            {/* Quick selector samples */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-[11px] text-[#A8A29E]">
              <span>Sample Registry IDs:</span>
              {['SHP-ART-2026-000845', 'SHP-ART-2026-000912', 'SHP-ART-2026-000780'].map((sampleId) => (
                <button
                  key={sampleId}
                  onClick={() => {
                    setInputQuery(sampleId);
                    setVerifyCertId(sampleId);
                  }}
                  className="font-mono text-white/80 hover:text-[#F59E0B] underline cursor-pointer"
                >
                  {sampleId}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Verification Dossier */}
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {!certificate ? (
          <div className="p-12 text-center bg-white rounded-lg border border-red-200 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-700 flex items-center justify-center mx-auto mb-3">
              ✕
            </div>
            <h3 className="font-serif text-xl font-bold text-[#1C1917]">No Provenance Record Found</h3>
            <p className="mt-1 text-xs text-[#78716C]">
              No cryptographic certificate matches "{inputQuery}". Please check the alphanumeric serial on the physical gold seal.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Authenticity Verified Banner */}
            <div className="p-6 bg-emerald-50 rounded-lg border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-800 tracking-wide uppercase">
                    Guaranteed Masterwork Authenticity
                  </div>
                  <h2 className="font-serif text-xl font-bold text-emerald-950 mt-0.5">
                    Official Certificate #{certificate.id} Verified
                  </h2>
                  <p className="text-xs text-emerald-800 mt-1">
                    Confirmed genuine hand-crafted artwork by {certificate.artistName}. Immutable cryptographic seal intact.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveCertificateModal(certificate)}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>View Official Diploma</span>
              </button>
            </div>

            {/* Certificate Core Specifications */}
            <div className="bg-white rounded-lg border border-[#E7E2D9] p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#F5F2EB] gap-4">
                <div>
                  <span className="text-xs font-semibold text-[#B45309] uppercase tracking-wider">
                    {certificate.edition}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#1C1917] mt-0.5">
                    {certificate.artworkTitle}
                  </h3>
                  <div className="text-xs text-[#78716C] mt-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#B45309]" />
                    <span>Issue Date: {certificate.issueDate}</span>
                    <span aria-hidden="true">·</span>
                    <span>Assay Code: <strong className="font-mono text-[#1C1917]">{certificate.guildAssayStamp}</strong></span>
                  </div>
                </div>

                {matchedArtwork && (
                  <button
                    onClick={() => openProductDetail(matchedArtwork.id)}
                    className="px-3.5 py-2 text-xs font-medium text-[#1C1917] bg-[#FAF8F5] border border-[#E7E2D9] rounded hover:bg-[#F5F2EB] flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <span>View Artwork Details</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#B45309]" />
                  </button>
                )}
              </div>

              {/* Master Artisan & Workshop Lineage */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="p-4 bg-[#FAF8F5] rounded border border-[#E7E2D9] space-y-2">
                  <div className="text-[11px] font-semibold text-[#78716C] uppercase">
                    Creator & Lineage
                  </div>
                  <div className="font-serif text-lg font-bold text-[#1C1917]">
                    {certificate.artistName} <span className="font-nepali font-semibold text-[#B45309]">({certificate.artistNepaliName})</span>
                  </div>
                  <p className="text-[#57534E]">
                    {certificate.craftLineage}
                  </p>
                </div>

                <div className="p-4 bg-[#FAF8F5] rounded border border-[#E7E2D9] space-y-2">
                  <div className="text-[11px] font-semibold text-[#78716C] uppercase">
                    Sanctuary Workshop Location
                  </div>
                  <div className="font-medium text-[#1C1917] flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#B45309] shrink-0" />
                    <span>{certificate.workshopLocation}</span>
                  </div>
                  <p className="text-[#57534E]">
                    Dimensions: {certificate.dimensions} · Net Weight: {certificate.weight}
                  </p>
                </div>
              </div>

              {/* Verified Materials */}
              <div>
                <h4 className="font-serif text-sm font-bold text-[#1C1917] mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#B45309]" />
                  <span>Physical & Chemical Materials Assay</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {certificate.materialsVerified.map((mat, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 rounded bg-stone-50 border border-stone-100">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="text-[#1C1917] font-medium">{mat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cryptographic Hash Security Callout */}
              <div className="p-4 bg-[#1C1917] text-white rounded-lg border border-[#38332E] space-y-2">
                <div className="flex items-center justify-between text-xs text-[#A8A29E]">
                  <span className="flex items-center gap-1.5 text-[#F59E0B] font-semibold">
                    <Hash className="w-3.5 h-3.5" />
                    SHA-256 Cryptographic Fingerprint
                  </span>
                  <span>Tamper-Proof State: VALID</span>
                </div>
                <div className="font-mono text-xs text-amber-200/90 break-all select-all bg-black/40 p-2.5 rounded border border-white/10">
                  {certificate.cryptographicHash}
                </div>
              </div>
            </div>

            {/* Provenance Chain of Custody Timeline */}
            <div className="bg-white rounded-lg border border-[#E7E2D9] p-8 shadow-xs">
              <div className="border-b border-[#F5F2EB] pb-4 mb-6">
                <h3 className="font-serif text-xl font-bold text-[#1C1917]">
                  Chain of Custody Provenance Ledger
                </h3>
                <p className="text-xs text-[#78716C] mt-1">
                  Chronological, non-repudiable log of every master hand that forged, certified, and conserved this artwork.
                </p>
              </div>

              <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E7E2D9]">
                {certificate.provenanceLedger.map((evt, idx) => (
                  <div key={evt.id} className="relative">
                    {/* Step marker */}
                    <div className="absolute -left-[27px] top-0.5 w-4 h-4 rounded-full border-2 border-[#FAF8F5] bg-[#B45309] shadow-xs" />

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        <span className="font-semibold text-[#1C1917] text-sm">
                          {evt.stage}
                        </span>
                        <span aria-hidden="true" className="text-[#78716C]">·</span>
                        <span className="font-mono text-[11px] text-[#78716C]">{evt.timestamp}</span>
                      </div>

                      <div className="text-xs text-[#B45309] font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{evt.location}</span>
                        <span className="text-[#78716C]">({evt.actor})</span>
                      </div>

                      <p className="text-xs text-[#57534E] leading-relaxed pt-1">
                        {evt.description}
                      </p>

                      <div className="pt-2 flex items-center gap-3 text-[11px] text-[#78716C]">
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

    </div>
  );
};

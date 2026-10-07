import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  ShieldCheck, 
  MapPin, 
  Sparkles, 
  Play, 
  Clock, 
  Scale, 
  Maximize2, 
  CheckCircle2, 
  ExternalLink,
  ShoppingBag,
  FileText
} from 'lucide-react';

export const ProductDetail: React.FC = () => {
  const { 
    selectedArtworkId, 
    artworks, 
    setCurrentView, 
    addToCart, 
    navigateToVerify,
    certificates,
    setActiveCertificateModal
  } = useApp();

  const artwork = artworks.find(a => a.id === selectedArtworkId) || artworks[0];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [customNotes, setCustomNotes] = useState('');
  const [customDimensions, setCustomDimensions] = useState('');

  if (!artwork) {
    return (
      <div className="min-h-screen p-12 text-center bg-[#FAF8F5]">
        <p className="font-serif text-2xl text-[#1C1917]">Artwork Dossier Not Found</p>
        <button
          onClick={() => setCurrentView('storefront')}
          className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-[#1C1917] rounded"
        >
          Return to Gallery
        </button>
      </div>
    );
  }

  const certificate = certificates[artwork.certificateId];

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24">
      
      {/* Breadcrumb & Back Navigation */}
      <div className="border-b border-[#E7E2D9] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            onClick={() => {
              setCurrentView('storefront');
              window.location.hash = 'gallery';
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#57534E] hover:text-[#1C1917] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#B45309]" />
            <span>Back to Curated Gallery</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-[#78716C]">
            <span>Cultural Archive ID:</span>
            <span className="font-mono font-bold text-[#1C1917]">{artwork.id.toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT COLUMN: Media Viewer (7 cols on desktop) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Primary High-Resolution Display */}
            <div className="relative aspect-4/3 overflow-hidden rounded-lg border border-[#E7E2D9] bg-[#F5F2EB] shadow-xs">
              {isPlayingVideo ? (
                <div className="relative w-full h-full bg-[#1C1917] flex flex-col items-center justify-center text-white p-6">
                  <div className="w-16 h-16 rounded-full bg-[#F59E0B] flex items-center justify-center mb-4 animate-pulse">
                    <Play className="w-8 h-8 text-[#1C1917] fill-current ml-1" />
                  </div>
                  <h4 className="font-serif text-lg font-bold">Artisan Studio Documentation</h4>
                  <p className="mt-1 text-xs text-[#A8A29E] max-w-md text-center">
                    Documentary recording of {artwork.artist.name} chiseling and fire-gilding in {artwork.artist.workshopName}. Consecrated chanting and natural pigment grinding soundscape.
                  </p>
                  <button
                    onClick={() => setIsPlayingVideo(false)}
                    className="mt-6 px-4 py-1.5 text-xs font-semibold text-white border border-white/20 rounded hover:bg-white/10"
                  >
                    Close Video Player
                  </button>
                </div>
              ) : (
                <img
                  src={artwork.images[selectedImageIndex] || artwork.images[0]}
                  alt={artwork.title}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
              )}

              {/* Video preview action overlay if available */}
              {artwork.videoDuration && !isPlayingVideo && (
                <button
                  onClick={() => setIsPlayingVideo(true)}
                  className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-[#1C1917]/85 backdrop-blur-xs text-white rounded text-xs font-medium hover:bg-[#1C1917] cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 text-[#F59E0B] fill-current" />
                  <span>Artisan Video ({artwork.videoDuration})</span>
                </button>
              )}

              <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 bg-[#1C1917]/80 backdrop-blur-xs text-white rounded text-xs">
                <ShieldCheck className="w-4 h-4 text-[#F59E0B]" />
                <span>Museum Inspected</span>
              </div>
            </div>

            {/* Thumbnail Navigation */}
            {artwork.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {artwork.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedImageIndex(idx);
                      setIsPlayingVideo(false);
                    }}
                    className={`relative w-20 h-20 rounded border overflow-hidden shrink-0 transition-all cursor-pointer ${
                      selectedImageIndex === idx && !isPlayingVideo
                        ? 'border-[#B45309] ring-2 ring-[#B45309]/30'
                        : 'border-[#E7E2D9] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`View ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Cultural Storytelling & Spiritual Iconography Narrative */}
            <div className="p-8 bg-white rounded-lg border border-[#E7E2D9] space-y-6">
              <div>
                <div className="text-xs font-semibold tracking-wider text-[#B45309] uppercase mb-1">
                  Living Lineage & Tradition
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#1C1917]">
                  The Cultural Provenance Behind This Work
                </h3>
                <p className="mt-3 text-sm text-[#57534E] leading-relaxed">
                  {artwork.culturalStory}
                </p>
              </div>

              {artwork.spiritualMeaning && (
                <div className="pt-6 border-t border-[#F5F2EB]">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#B45309] uppercase mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Sacred Iconometry & Spiritual Significance</span>
                  </div>
                  <p className="text-sm text-[#57534E] leading-relaxed">
                    {artwork.spiritualMeaning}
                  </p>
                </div>
              )}
            </div>

            {/* Master Artisan Profile Card */}
            <div className="p-8 bg-white rounded-lg border border-[#E7E2D9] flex flex-col sm:flex-row gap-6 items-start">
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-stone-200 shrink-0 border-2 border-[#B45309]">
                <img
                  src={artwork.artist.avatarUrl}
                  alt={artwork.artist.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-serif text-xl font-bold text-[#1C1917]">
                    {artwork.artist.name}
                  </h4>
                  <span className="text-xs font-nepali font-semibold text-[#B45309]">
                    ({artwork.artist.nepaliName})
                  </span>
                  <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Master Guildsman
                  </span>
                </div>

                <div className="mt-1 text-xs text-[#78716C] font-medium">
                  {artwork.artist.title} · {artwork.artist.generation}
                </div>

                <div className="mt-2 flex items-center gap-1.5 text-xs text-[#57534E]">
                  <MapPin className="w-3.5 h-3.5 text-[#B45309]" />
                  <span>{artwork.artist.workshopName} · {artwork.artist.location}</span>
                  <span className="text-[10px] font-mono text-[#78716C] ml-1">
                    ({artwork.artist.coordinates})
                  </span>
                </div>

                <p className="mt-3 text-xs text-[#57534E] leading-relaxed">
                  {artwork.artist.bio}
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Contiguous Purchase Module (5 cols on desktop) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Purchase & Acquisition Panel */}
            <div className="p-8 bg-white rounded-lg border border-[#E7E2D9] shadow-xs space-y-6">
              
              {/* Category & Status */}
              <div className="flex items-center justify-between text-xs text-[#78716C]">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-[#B45309]">{artwork.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{artwork.specifications.period}</span>
                </div>

                <span className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                  artwork.status === 'Available' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                }`}>
                  {artwork.status}
                </span>
              </div>

              {/* Title & Nepali Script */}
              <div>
                <h1 className="font-serif text-3xl font-bold text-[#1C1917] leading-tight">
                  {artwork.title}
                </h1>
                <p className="mt-1 font-nepali text-sm text-[#78716C] font-semibold">
                  {artwork.nepaliTitle}
                </p>
              </div>

              {/* Price Callout */}
              <div className="py-4 border-y border-[#F5F2EB]">
                <div className="text-xs text-[#78716C]">Sovereign Acquisition Price</div>
                <div className="font-mono text-3xl font-bold text-[#1C1917] tabular-nums mt-0.5">
                  ${artwork.priceUSD.toLocaleString()}
                </div>
                <div className="text-xs text-[#78716C] font-sans mt-0.5">
                  Approx. NPR {artwork.priceNPR.toLocaleString()} · Insured White-Glove Export Included
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="space-y-3">
                {artwork.status === 'Available' ? (
                  <button
                    onClick={() => addToCart(artwork)}
                    className="w-full py-3.5 px-4 text-sm font-semibold text-white bg-[#1C1917] rounded hover:bg-[#292524] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#F59E0B]" />
                    <span>Acquire Masterwork & Claim Provenance</span>
                  </button>
                ) : (
                  <div className="p-3 bg-amber-50 rounded border border-amber-200 text-xs text-amber-900 text-center font-medium">
                    This work is currently {artwork.status}. You may commission a parallel bespoke work below.
                  </div>
                )}

                <button
                  onClick={() => setShowCommissionModal(true)}
                  className="w-full py-3 px-4 text-xs font-semibold text-[#1C1917] bg-[#FAF8F5] border border-[#E7E2D9] rounded hover:bg-[#F5F2EB] transition-colors cursor-pointer"
                >
                  Request Bespoke Variation from Master Artisan
                </button>
              </div>

              {/* Certificate Preview Badge Card */}
              <div className="p-4 bg-[#FAF8F5] rounded border border-[#E7E2D9] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#B45309]" />
                    <span className="font-serif text-sm font-bold text-[#1C1917]">
                      Digital Certificate of Authenticity
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#78716C]">
                    SHA-256 Ledger
                  </span>
                </div>

                <p className="text-xs text-[#57534E] leading-relaxed">
                  Permanently assigned to ID <strong className="font-mono text-[#1C1917]">{artwork.certificateId}</strong> with verified workshop coordinates, metallurgical assay, and master signature.
                </p>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={() => {
                      if (certificate) {
                        setActiveCertificateModal(certificate);
                      } else {
                        navigateToVerify(artwork.certificateId);
                      }
                    }}
                    className="text-xs font-semibold text-[#B45309] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Preview Certificate Dossier</span>
                  </button>

                  <span className="text-stone-300">|</span>

                  <button
                    onClick={() => navigateToVerify(artwork.certificateId)}
                    className="text-xs font-medium text-[#57534E] hover:text-[#1C1917] flex items-center gap-1 cursor-pointer"
                  >
                    <span>Public Verification</span>
                    <ExternalLink className="w-3 h-3 text-[#78716C]" />
                  </button>
                </div>
              </div>

              {/* Specifications Table */}
              <div>
                <h4 className="font-serif text-lg font-bold text-[#1C1917] mb-3">
                  Artwork Specifications
                </h4>

                <dl className="divide-y divide-[#F5F2EB] text-xs">
                  <div className="py-2.5 flex justify-between">
                    <dt className="text-[#78716C]">Materials</dt>
                    <dd className="font-medium text-[#1C1917] text-right max-w-[65%]">
                      {artwork.specifications.materials}
                    </dd>
                  </div>

                  <div className="py-2.5 flex justify-between">
                    <dt className="text-[#78716C]">Dimensions</dt>
                    <dd className="font-medium text-[#1C1917] text-right">
                      {artwork.specifications.dimensions}
                    </dd>
                  </div>

                  <div className="py-2.5 flex justify-between">
                    <dt className="text-[#78716C]">Weight</dt>
                    <dd className="font-medium text-[#1C1917] text-right">
                      {artwork.specifications.weight}
                    </dd>
                  </div>

                  <div className="py-2.5 flex justify-between">
                    <dt className="text-[#78716C]">Creation Duration</dt>
                    <dd className="font-medium text-[#1C1917] text-right">
                      {artwork.specifications.creationTime}
                    </dd>
                  </div>

                  <div className="py-2.5 flex justify-between">
                    <dt className="text-[#78716C]">Technique</dt>
                    <dd className="font-medium text-[#1C1917] text-right">
                      {artwork.specifications.technique}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Shipping & Delivery Guarantee */}
              <div className="pt-4 border-t border-[#F5F2EB] text-xs text-[#78716C] space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Dispatched in custom Lokta-lined archival timber crates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Insured transit via DHL/FedEx Express from Kathmandu Hub</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Includes physical gold-embossed Certificate of Authenticity</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Commission Modal */}
      {showCommissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-lg border border-[#E7E2D9] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#F5F2EB] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#1C1917]">
                Commission a Masterwork from {artwork.artist.name}
              </h3>
              <button
                onClick={() => setShowCommissionModal(false)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#57534E]">
              Directly consult with Master {artwork.artist.name} ({artwork.artist.workshopName}, {artwork.artist.location}) to customize iconographic postures, scale, or sacred consecration scrolls.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                  Desired Dimensions or Specifications
                </label>
                <input
                  type="text"
                  placeholder="e.g. 24 inches height, fire-gilded, turquoise crown..."
                  value={customDimensions}
                  onChange={(e) => setCustomDimensions(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E7E2D9] rounded focus:border-[#B45309] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                  Spiritual or Architectural Placement Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your meditation sanctuary, residential altar, or collection focus..."
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E7E2D9] rounded focus:border-[#B45309] focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowCommissionModal(false)}
                className="px-4 py-2 text-xs font-medium text-[#57534E] hover:text-[#1C1917]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Commission consultation request forwarded to ${artwork.artist.name}'s workshop in Patan! Our guild registrar will email you a formal proposal with 50% milestone terms.`);
                  setShowCommissionModal(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#1C1917] rounded hover:bg-[#292524]"
              >
                Send Request to Artist Studio
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

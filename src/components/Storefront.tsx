import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CategoryType, Artwork } from '../types';
import { CATEGORIES_DATA, HERO_IMAGE } from '../data/mockData';
import { Search, Sparkles, MapPin, ShieldCheck, ArrowRight, Compass } from 'lucide-react';

export const Storefront: React.FC = () => {
  const { 
    artworks, 
    openProductDetail, 
    selectedCategory, 
    setSelectedCategory,
    addToCart,
    setCurrentView
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [originFilter, setOriginFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Available' | 'Reserved'>('All');

  const filteredArtworks = useMemo(() => {
    return artworks.filter(art => {
      // Category filter
      if (selectedCategory !== 'All' && art.category !== selectedCategory) {
        return false;
      }
      // Status filter
      if (statusFilter !== 'All' && art.status !== statusFilter) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = art.title.toLowerCase().includes(query) || art.nepaliTitle.toLowerCase().includes(query);
        const matchesArtist = art.artist.name.toLowerCase().includes(query) || art.artist.workshopName.toLowerCase().includes(query);
        const matchesMaterial = art.specifications.materials.toLowerCase().includes(query);
        const matchesCategory = art.category.toLowerCase().includes(query);
        if (!matchesTitle && !matchesArtist && !matchesMaterial && !matchesCategory) {
          return false;
        }
      }
      // Origin filter
      if (originFilter !== 'All') {
        if (!art.artist.location.toLowerCase().includes(originFilter.toLowerCase())) {
          return false;
        }
      }
      return true;
    });
  }, [artworks, selectedCategory, statusFilter, searchQuery, originFilter]);

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* 1. Hero Campaign Banner */}
      <section className="relative overflow-hidden border-b border-[#E7E2D9] bg-[#1C1917] text-white">
        <div className="absolute inset-0 opacity-40 mix-blend-luminosity">
          <img
            src={HERO_IMAGE}
            alt="Nepalese Master Craftsmanship in Patan"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917] via-[#1C1917]/70 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:py-20 lg:py-28 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-[#F59E0B] font-semibold mb-3 sm:mb-4">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Cultural Archive & Direct Master Artisan Guilds</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-tight break-words">
              Sacred Heritage Forged in the Shadow of the Himalayas.
            </h1>

            <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-[#D6D3D1] font-light leading-relaxed max-w-2xl">
              SHILPAYA is the world’s direct sovereign portal for consecrated Nepalese Paubha paintings, 
              lost-wax gilded bronze sculptures, Newari sal-wood architectural carvings, and indigenous Mithila folk art. 
              Every acquisition is cryptographically cataloged with permanent provenance.
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <button
                onClick={() => {
                  const el = document.getElementById('collection-grid');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 text-xs sm:text-sm font-semibold text-[#1C1917] bg-[#F59E0B] rounded-lg hover:bg-[#D97706] transition-colors cursor-pointer text-center"
              >
                Explore Curated Masterworks
              </button>

              <button
                onClick={() => {
                  setCurrentView('b2b');
                  window.location.hash = 'b2b';
                }}
                className="px-6 py-3 text-xs sm:text-sm font-medium text-white border border-[#A8A29E]/50 rounded-lg hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-center gap-2 text-center"
              >
                <span>Enterprise & Museum Inquiries</span>
                <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
              </button>
            </div>

            {/* Unboxed Metadata row - No Pill Sandwiches */}
            <div className="mt-12 flex flex-wrap items-center gap-4 text-xs text-[#A8A29E] pt-6 border-t border-white/10">
              <span className="text-[#F59E0B] font-medium">100% Handcrafted Lineage</span>
              <span aria-hidden="true">·</span>
              <span>Federation of Handicraft Guilds (FHAN) Certified</span>
              <span aria-hidden="true">·</span>
              <span>SHA-256 Provenance Ledger</span>
              <span aria-hidden="true">·</span>
              <span>Direct 88% Net Artisan Payout</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Cultural Storytelling Categories Narrative Carousel/Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-b border-[#E7E2D9]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="text-xs font-semibold tracking-wider text-[#B45309] uppercase mb-1">
              Six Indigenous Traditions
            </div>
            <h2 className="font-serif text-3xl font-semibold text-[#1C1917]">
              Living Guilds of the Kathmandu Valley & Terai
            </h2>
          </div>
          <p className="mt-2 md:mt-0 text-sm text-[#78716C] max-w-md">
            Click on any discipline to filter masterworks and explore regional origin stories.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES_DATA.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <div
                key={cat.name}
                onClick={() => {
                  setSelectedCategory(isSelected ? 'All' : cat.name);
                  const el = document.getElementById('collection-grid');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`group p-6 rounded-lg border transition-all cursor-pointer bg-white ${
                  isSelected 
                    ? 'border-[#B45309] ring-2 ring-[#B45309]/20 shadow-sm' 
                    : 'border-[#E7E2D9] hover:border-[#A8A29E] hover:shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-medium text-[#78716C]">
                      {cat.nepaliName}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-[#1C1917] mt-0.5 group-hover:text-[#B45309] transition-colors">
                      {cat.name}
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-[#B45309] tabular-nums">
                    {cat.count} Works
                  </span>
                </div>

                <p className="mt-3 text-xs text-[#57534E] leading-relaxed line-clamp-2">
                  {cat.description}
                </p>

                <div className="mt-4 pt-4 border-t border-[#F5F2EB] flex items-center justify-between text-[11px] text-[#78716C]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#B45309]" />
                    {cat.originHub}
                  </span>
                  <span className="text-[#B45309] font-medium group-hover:underline">
                    {isSelected ? 'Viewing Category' : 'Browse Works →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Filter & Product Collection Grid */}
      <section id="collection-grid" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        
        {/* Controls: Search, Category Buttons, Origin Selector */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#78716C]" />
              <input
                type="text"
                placeholder="Search deities, wood carving, thangka, master artisan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-[#E7E2D9] rounded focus:outline-none focus:border-[#B45309] text-[#1C1917] placeholder-[#A8A29E]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#78716C] hover:text-[#1C1917]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Origin & Status Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-white border border-[#E7E2D9] rounded px-2.5 py-1.5 text-xs text-[#57534E]">
                <Compass className="w-3.5 h-3.5 text-[#B45309]" />
                <span className="font-medium mr-1">Origin:</span>
                <select
                  value={originFilter}
                  onChange={(e) => setOriginFilter(e.target.value)}
                  className="bg-transparent focus:outline-none font-semibold text-[#1C1917] cursor-pointer"
                >
                  <option value="All">All Regions</option>
                  <option value="Patan">Patan / Lalitpur</option>
                  <option value="Bhaktapur">Bhaktapur</option>
                  <option value="Janakpur">Janakpurdham</option>
                  <option value="Kathmandu">Kathmandu Valley</option>
                  <option value="Dolakha">Dolakha</option>
                </select>
              </div>

              <div className="flex items-center gap-1 bg-white border border-[#E7E2D9] rounded px-2.5 py-1.5 text-xs text-[#57534E]">
                <span className="font-medium mr-1">Availability:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-transparent focus:outline-none font-semibold text-[#1C1917] cursor-pointer"
                >
                  <option value="All">All Works</option>
                  <option value="Available">Available Now</option>
                  <option value="Reserved">Reserved / In Archive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Interactive Category Filter Pills (Functional Buttons) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-[#1C1917] text-white shadow-xs'
                  : 'bg-white text-[#57534E] border border-[#E7E2D9] hover:text-[#1C1917]'
              }`}
            >
              All Traditions ({artworks.length})
            </button>
            {CATEGORIES_DATA.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.name
                    ? 'bg-[#1C1917] text-white font-semibold shadow-xs'
                    : 'bg-white text-[#57534E] border border-[#E7E2D9] hover:text-[#1C1917]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid: 3-column desktop */}
        {filteredArtworks.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-lg border border-[#E7E2D9]">
            <p className="font-serif text-xl text-[#1C1917]">No heritage masterworks match your criteria</p>
            <p className="mt-1 text-xs text-[#78716C]">Try resetting your search query or region filter.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setOriginFilter('All');
                setStatusFilter('All');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-[#1C1917] rounded hover:bg-[#292524]"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArtworks.map((art) => (
              <div
                key={art.id}
                className="group flex flex-col bg-white rounded-lg border border-[#E7E2D9] overflow-hidden hover:border-[#A8A29E] transition-all hover:shadow-sm"
              >
                {/* Media Container: 4:3 ratio with fallback */}
                <div 
                  onClick={() => openProductDetail(art.id)}
                  className="relative aspect-4/3 overflow-hidden bg-[#F5F2EB] cursor-pointer"
                >
                  <img
                    src={art.images[0]}
                    alt={art.title}
                    className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback image handling
                      (e.target as HTMLImageElement).src = '/src/assets/images/product_lost_wax_buddha_bronze_1791009616481.jpg';
                    }}
                  />

                  {/* Status Tag: Clean unboxed indicator */}
                  <div className="absolute top-3 right-3">
                    <span className={`text-[11px] font-semibold px-2 py-1 rounded bg-[#FAF8F5]/90 backdrop-blur-xs shadow-xs ${
                      art.status === 'Available' ? 'text-emerald-800' : 'text-amber-800'
                    }`}>
                      {art.status}
                    </span>
                  </div>

                  {/* Certified badge */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-[#1C1917]/85 backdrop-blur-xs text-[11px] text-white rounded">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>Certified Authenticity</span>
                  </div>
                </div>

                {/* Card Details: Clean typographic hierarchy */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Unboxed Metadata Line with typographic separators */}
                    <div className="flex items-center gap-1.5 text-xs text-[#78716C] mb-1.5">
                      <span className="font-semibold text-[#B45309]">{art.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{art.artist.location.split(',')[0]}</span>
                    </div>

                    <h3 
                      onClick={() => openProductDetail(art.id)}
                      className="font-serif text-lg font-bold text-[#1C1917] leading-snug cursor-pointer group-hover:text-[#B45309] transition-colors"
                    >
                      {art.title}
                    </h3>
                    
                    <p className="text-xs text-[#78716C] font-nepali mt-0.5">
                      {art.nepaliTitle}
                    </p>

                    <p className="mt-3 text-xs text-[#57534E] line-clamp-2 leading-relaxed">
                      {art.description}
                    </p>
                  </div>

                  {/* Price & Action Module */}
                  <div className="mt-6 pt-4 border-t border-[#F5F2EB] flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-[#78716C]">Acquisition Price</div>
                      <div className="font-mono text-base font-bold text-[#1C1917] tabular-nums">
                        ${art.priceUSD.toLocaleString()}
                        <span className="text-[11px] font-normal text-[#78716C] ml-1.5 font-sans">
                          (NPR {art.priceNPR.toLocaleString()})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openProductDetail(art.id)}
                        className="px-3 py-1.5 text-xs font-medium text-[#1C1917] bg-[#F5F2EB] rounded hover:bg-[#E7E2D9] transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>

                      {art.status === 'Available' ? (
                        <button
                          onClick={() => addToCart(art)}
                          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#1C1917] rounded hover:bg-[#292524] transition-colors cursor-pointer whitespace-nowrap"
                        >
                          Acquire
                        </button>
                      ) : (
                        <button
                          onClick={() => openProductDetail(art.id)}
                          className="px-3 py-1.5 text-xs font-medium text-[#78716C] bg-stone-100 rounded cursor-pointer"
                        >
                          Dossier
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Cultural Patronage & Direct Artisan Reinvestment Commitment */}
      <section className="bg-[#1C1917] text-white py-16 border-t border-[#38332E]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border-l-2 border-[#B45309] pl-5">
              <h4 className="font-serif text-lg font-bold text-white">88% Direct Artisan Payout</h4>
              <p className="mt-2 text-xs text-[#A8A29E] leading-relaxed">
                Unlike souvenir bazaar intermediaries, 88% of every sale goes directly to the master sculptors, painters, and weavers. A 12% guild contribution supports youth apprenticeship ateliers in Patan and Bhaktapur.
              </p>
            </div>

            <div className="border-l-2 border-[#B45309] pl-5">
              <h4 className="font-serif text-lg font-bold text-white">Holographic Tamper-Seal & Assay</h4>
              <p className="mt-2 text-xs text-[#A8A29E] leading-relaxed">
                Before leaving Nepal, every bronze alloy is spectrometrically verified by the Federation of Handicraft Associations of Nepal (FHAN), and every sal woodwork is acoustic-moisture verified.
              </p>
            </div>

            <div className="border-l-2 border-[#B45309] pl-5">
              <h4 className="font-serif text-lg font-bold text-white">Bespoke Commissions</h4>
              <p className="mt-2 text-xs text-[#A8A29E] leading-relaxed">
                Need a specific deity cast according to precise canonical Shilpa Shastra proportions or monumental pagoda architecture? Our Commission Desk manages master artisan allocations with 50% milestone escrow.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

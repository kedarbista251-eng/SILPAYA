import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ARTISTS } from '../data/mockData';
import { CategoryType, Artwork } from '../types';
import { 
  Search, 
  X, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  Layers, 
  Palette, 
  Feather, 
  Scroll, 
  Compass, 
  ArrowRight,
  TrendingUp,
  Tag
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CategoryInfo {
  id: CategoryType;
  labelEn: string;
  labelNe: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CATEGORY_DEFINITIONS: CategoryInfo[] = [
  {
    id: 'Metal Statues',
    labelEn: 'Metal Statues',
    labelNe: 'धातु मूर्ति',
    description: 'Lost-wax cire-perdue bronze & copper castings',
    icon: Sparkles
  },
  {
    id: 'Wood Carving',
    labelEn: 'Wood Carving',
    labelNe: 'काष्ठकला',
    description: 'Architectural Newari carved relief & peacock windows',
    icon: Layers
  },
  {
    id: 'Thangka/Paubha',
    labelEn: 'Thangka / Paubha',
    labelNe: 'पौभा / थाङ्का',
    description: 'Mineral pigment & 24K gold sacred iconography',
    icon: Palette
  },
  {
    id: 'Mithila Art',
    labelEn: 'Mithila Art',
    labelNe: 'मिथिला चित्रकला',
    description: 'Janakpur ceremonial folk art on cured Lokta',
    icon: Feather
  },
  {
    id: 'Lokta Paper',
    labelEn: 'Lokta Paper',
    labelNe: 'लोक्ता कागज',
    description: 'Wild Himalayan Daphne shrub handmade archival sheets',
    icon: Scroll
  },
  {
    id: 'Weaving',
    labelEn: 'Weaving & Textiles',
    labelNe: 'बुनाई कला',
    description: 'Heritage Dhaka weaves, pashmina & Himalayan rugs',
    icon: Compass
  }
];

const TRENDING_SEARCHES = [
  'Lost-Wax Bronze',
  'Peacock Window',
  '24K Gold Paubha',
  'Mithila Kohbar',
  'Master Rajendra Shakya',
  'Patan Foundry',
  'Sal Wood',
  'Mineral Pigment'
];

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const { 
    artworks, 
    openProductDetail, 
    setSelectedCategory, 
    setCurrentView,
    language 
  } = useApp();

  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'artworks' | 'artists' | 'categories'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setActiveTab('all');
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Search Results Computation
  const cleanQuery = query.trim().toLowerCase();

  const filteredArtworks = useMemo(() => {
    if (!cleanQuery) return artworks;
    return artworks.filter((item: Artwork) => {
      const titleMatch = item.title.toLowerCase().includes(cleanQuery);
      const nepaliTitleMatch = item.nepaliTitle?.toLowerCase().includes(cleanQuery);
      const catMatch = item.category.toLowerCase().includes(cleanQuery);
      const artistMatch = item.artist.name.toLowerCase().includes(cleanQuery) || 
                          item.artist.nepaliName?.toLowerCase().includes(cleanQuery) ||
                          item.artist.workshopName?.toLowerCase().includes(cleanQuery);
      const materialsMatch = item.specifications.materials.toLowerCase().includes(cleanQuery);
      const descMatch = item.description.toLowerCase().includes(cleanQuery) ||
                        item.culturalStory?.toLowerCase().includes(cleanQuery);
      const techniqueMatch = item.specifications.technique?.toLowerCase().includes(cleanQuery);
      return titleMatch || nepaliTitleMatch || catMatch || artistMatch || materialsMatch || descMatch || techniqueMatch;
    });
  }, [artworks, cleanQuery]);

  const filteredArtists = useMemo(() => {
    if (!cleanQuery) return ARTISTS;
    return ARTISTS.filter((artist) => {
      const nameMatch = artist.name.toLowerCase().includes(cleanQuery);
      const nepaliMatch = artist.nepaliName?.toLowerCase().includes(cleanQuery);
      const titleMatch = artist.title.toLowerCase().includes(cleanQuery);
      const workshopMatch = artist.workshopName.toLowerCase().includes(cleanQuery);
      const locationMatch = artist.location.toLowerCase().includes(cleanQuery);
      const specialtyMatch = artist.specialty.toLowerCase().includes(cleanQuery);
      const genMatch = artist.generation.toLowerCase().includes(cleanQuery);
      return nameMatch || nepaliMatch || titleMatch || workshopMatch || locationMatch || specialtyMatch || genMatch;
    });
  }, [cleanQuery]);

  const filteredCategories = useMemo(() => {
    if (!cleanQuery) return CATEGORY_DEFINITIONS;
    return CATEGORY_DEFINITIONS.filter((cat) => {
      const enMatch = cat.labelEn.toLowerCase().includes(cleanQuery);
      const neMatch = cat.labelNe.toLowerCase().includes(cleanQuery);
      const descMatch = cat.description.toLowerCase().includes(cleanQuery);
      return enMatch || neMatch || descMatch;
    });
  }, [cleanQuery]);

  const totalMatches = (cleanQuery ? filteredArtworks.length : 0) + 
                       (cleanQuery ? filteredArtists.length : 0) + 
                       (cleanQuery ? filteredCategories.length : 0);

  const handleSelectArtwork = (id: string) => {
    openProductDetail(id);
    onClose();
  };

  const handleSelectCategory = (catId: CategoryType) => {
    setSelectedCategory(catId);
    setCurrentView('storefront');
    window.location.hash = 'gallery';
    onClose();
  };

  const handleSelectArtist = () => {
    setCurrentView('artist');
    window.location.hash = 'artist';
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-20 px-3 sm:px-4 bg-stone-900/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-3xl rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Search Input Bar */}
        <div className="relative flex items-center border-b border-[#E7E2D9] bg-white px-4 py-3.5 sm:px-6">
          <Search className="w-5 h-5 text-[#B45309] shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              language === 'en'
                ? "Search masterworks, artists, materials (e.g., 'Buddha', 'Copper', 'Patan')..."
                : "कलाकृति, मूर्तिकार, धातु वा विधा खोज्नुहोस्..."
            }
            className="w-full bg-transparent text-sm sm:text-base text-[#1C1917] placeholder-[#78716C] focus:outline-none"
          />

          <div className="flex items-center gap-2 ml-2">
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold text-stone-500 bg-stone-100 border border-stone-200 rounded shadow-xs">
              ESC
            </kbd>
          </div>
        </div>

        {/* Filter Tabs when typing */}
        {cleanQuery && (
          <div className="flex items-center gap-1.5 px-4 sm:px-6 py-2.5 border-b border-[#E7E2D9] bg-[#F5F2EB]/60 text-xs overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-[#1C1917] text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              All Matches ({totalMatches})
            </button>
            <button
              onClick={() => setActiveTab('artworks')}
              className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'artworks'
                  ? 'bg-[#1C1917] text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              Masterworks ({filteredArtworks.length})
            </button>
            <button
              onClick={() => setActiveTab('artists')}
              className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'artists'
                  ? 'bg-[#1C1917] text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              Artists & Guilds ({filteredArtists.length})
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'categories'
                  ? 'bg-[#1C1917] text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              Craft Categories ({filteredCategories.length})
            </button>
          </div>
        )}

        {/* Scrollable Results Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* State 1: Empty Query / Trending Suggestions */}
          {!cleanQuery && (
            <div className="space-y-6">
              {/* Trending Queries */}
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B45309] mb-3">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Trending Cultural Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-700 bg-white border border-[#E7E2D9] hover:border-[#B45309] hover:text-[#B45309] hover:bg-amber-50/40 transition-all cursor-pointer shadow-2xs"
                    >
                      <Tag className="w-3 h-3 text-[#B45309]" />
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Craft Categories Quick Browse */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                  Explore by Sacred Craft Medium
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {CATEGORY_DEFINITIONS.map((cat) => {
                    const Icon = cat.icon;
                    const count = artworks.filter(a => a.category === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleSelectCategory(cat.id)}
                        className="group flex items-start gap-3 p-3 rounded-lg bg-white border border-[#E7E2D9] hover:border-amber-400 hover:shadow-xs transition-all text-left cursor-pointer"
                      >
                        <div className="p-2 rounded bg-amber-50 text-[#B45309] group-hover:bg-[#B45309] group-hover:text-white transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-stone-900 group-hover:text-[#B45309] transition-colors truncate">
                              {cat.labelEn}
                            </span>
                            <span className="text-[10px] text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded ml-1">
                              {count}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                            {cat.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Featured Living National Treasures / Artisans */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                  Featured Master Guild Ateliers
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ARTISTS.slice(0, 4).map((artist) => (
                    <button
                      key={artist.id}
                      onClick={handleSelectArtist}
                      className="group flex items-center gap-3 p-2.5 rounded-lg bg-white border border-[#E7E2D9] hover:border-stone-400 hover:shadow-xs transition-all text-left cursor-pointer"
                    >
                      <img
                        src={artist.avatarUrl}
                        alt={artist.name}
                        className="w-10 h-10 rounded-full object-cover border border-stone-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-stone-900 truncate">
                            {artist.name}
                          </span>
                          <ShieldCheck className="w-3.5 h-3.5 text-[#B45309] shrink-0" />
                        </div>
                        <div className="text-[11px] text-stone-500 truncate">
                          {artist.workshopName} · {artist.location.split(',')[0]}
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-[#B45309] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* State 2: Active Query with Matches */}
          {cleanQuery && totalMatches > 0 && (
            <div className="space-y-6">
              {/* Category Matches */}
              {(activeTab === 'all' || activeTab === 'categories') && filteredCategories.length > 0 && (
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#B45309] mb-2 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Matching Categories ({filteredCategories.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredCategories.map((cat) => {
                      const Icon = cat.icon;
                      const count = artworks.filter(a => a.category === cat.id).length;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => handleSelectCategory(cat.id)}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-[#E7E2D9] hover:border-[#B45309] hover:bg-amber-50/30 transition-all text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded bg-amber-100/70 text-[#B45309]">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-stone-900">
                                {cat.labelEn} <span className="text-stone-400 font-normal">({cat.labelNe})</span>
                              </div>
                              <div className="text-[11px] text-stone-500">
                                {count} cataloged masterworks
                              </div>
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-[#B45309] flex items-center gap-0.5">
                            Filter <ArrowRight className="w-3 h-3" />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Artist Matches */}
              {(activeTab === 'all' || activeTab === 'artists') && filteredArtists.length > 0 && (
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#B45309] mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Master Artists & Guilds ({filteredArtists.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {filteredArtists.map((artist) => (
                      <button
                        key={artist.id}
                        onClick={handleSelectArtist}
                        className="group flex items-start gap-3 p-3 rounded-lg bg-white border border-[#E7E2D9] hover:border-amber-400 hover:shadow-xs transition-all text-left cursor-pointer"
                      >
                        <img
                          src={artist.avatarUrl}
                          alt={artist.name}
                          className="w-11 h-11 rounded-full object-cover border border-stone-200 shrink-0 mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-stone-900 group-hover:text-[#B45309] transition-colors truncate">
                              {artist.name}
                            </span>
                            {artist.nepaliName && (
                              <span className="text-[11px] text-stone-400 font-serif">
                                {artist.nepaliName}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#B45309] font-medium leading-tight mt-0.5 truncate">
                            {artist.title}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-stone-500 mt-1 truncate">
                            <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                            <span>{artist.workshopName} · {artist.location.split(',')[0]}</span>
                          </div>
                        </div>
                        <div className="text-stone-300 group-hover:text-[#B45309] self-center">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Artwork Matches */}
              {(activeTab === 'all' || activeTab === 'artworks') && filteredArtworks.length > 0 && (
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#B45309] mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Cultural Items & Masterworks ({filteredArtworks.length})</span>
                  </div>
                  <div className="space-y-2">
                    {filteredArtworks.map((art: Artwork) => (
                      <div
                        key={art.id}
                        onClick={() => handleSelectArtwork(art.id)}
                        className="group flex items-center gap-3.5 p-3 rounded-lg bg-white border border-[#E7E2D9] hover:border-[#B45309] hover:shadow-xs transition-all cursor-pointer"
                      >
                        <img
                          src={art.images[0] || '/src/assets/images/product_lost_wax_buddha_bronze_1791009616481.jpg'}
                          alt={art.title}
                          className="w-14 h-14 rounded-md object-cover border border-stone-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-stone-900 group-hover:text-[#B45309] transition-colors truncate">
                              {art.title}
                            </span>
                            {art.nepaliTitle && (
                              <span className="hidden sm:inline text-[11px] text-stone-400 font-serif">
                                {art.nepaliTitle}
                              </span>
                            )}
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ml-auto ${
                              art.status === 'Available'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : art.status === 'Reserved'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-stone-100 text-stone-600 border border-stone-200'
                            }`}>
                              {art.status}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5 truncate">
                            <span className="text-stone-700 font-medium">{art.artist.name}</span>
                            <span>•</span>
                            <span>{art.category}</span>
                            <span>•</span>
                            <span className="truncate">{art.specifications.materials}</span>
                          </div>

                          <div className="flex items-center gap-3 text-xs font-bold text-stone-900 mt-1">
                            <span>${art.priceUSD.toLocaleString()} USD</span>
                            <span className="text-[11px] font-normal text-stone-500">
                              (रू {art.priceNPR.toLocaleString()})
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0 pl-2">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#B45309] group-hover:translate-x-0.5 transition-transform">
                            View <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* State 3: Active Query with Zero Matches */}
          {cleanQuery && totalMatches === 0 && (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-stone-100 border border-stone-200 text-stone-400 mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <div className="font-serif text-base font-bold text-stone-900">
                No cultural artifacts found for "{query}"
              </div>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Try searching for keywords like "Buddha", "Copper", "Peacock", "Thangka", "Sal Wood", or master artisans such as "Rajendra Shakya".
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setQuery('')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-[#B45309] bg-amber-50 hover:bg-amber-100 rounded-md transition-colors"
                >
                  Clear search query
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-6 py-2.5 bg-white border-t border-[#E7E2D9] flex items-center justify-between text-[11px] text-stone-500">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>SHILPAYA Master Provenance Catalog</span>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <span>Press <kbd className="px-1 py-0.5 bg-stone-100 border rounded text-[10px]">ESC</kbd> to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};

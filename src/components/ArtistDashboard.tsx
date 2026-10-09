import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CategoryType, ArtworkStatus } from '../types';
import { ARTISTS } from '../data/mockData';
import { 
  Plus, 
  Mic, 
  Square, 
  Play, 
  Volume2, 
  DollarSign, 
  Package, 
  Clock, 
  CheckCircle, 
  Send, 
  CreditCard,
  Building,
  Globe,
  Upload,
  Layers,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

export const ArtistDashboard: React.FC = () => {
  const { 
    language, 
    toggleLanguage, 
    artworks, 
    updateArtworkStatus, 
    addNewArtwork,
    commissions, 
    submitCommissionQuote, 
    markCommissionDepositPaid,
    financials,
    requestPayout
  } = useApp();

  const [activeTab, setActiveTab] = useState<'inventory' | 'create' | 'commissions' | 'financials'>('inventory');

  // Product Creation State
  const [title, setTitle] = useState('');
  const [nepaliTitle, setNepaliTitle] = useState('');
  const [category, setCategory] = useState<CategoryType>('Metal Statues');
  const [priceUSD, setPriceUSD] = useState<number>(2400);
  const [materials, setMaterials] = useState('Lost-wax copper alloy, 24K mercury fire-gilded, natural mineral lapis lazuli');
  const [dimensions, setDimensions] = useState('16" H × 11" W × 8" D');
  const [weight, setWeight] = useState('7.2 kg');
  const [description, setDescription] = useState('');
  const [culturalStory, setCulturalStory] = useState('');
  const [artistId, setArtistId] = useState(ARTISTS[0].id);

  // Voice Note Simulation State
  const [isRecording, setIsRecording] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [hasVoiceNote, setHasVoiceNote] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');

  // Payout Modal State
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState(Math.min(financials.withdrawableBalanceUSD, 5000));
  const [payoutChannel, setPayoutChannel] = useState<'eSewa' | 'Khalti' | 'SWIFT Bank Wire'>('eSewa');

  // Commission Quote Form State
  const [activeQuoteId, setActiveQuoteId] = useState<string | null>(null);
  const [quoteAmount, setQuoteAmount] = useState<number>(3500);
  const [quoteNotes, setQuoteNotes] = useState('Estimated 8 weeks in Patan workshop. Includes custom cedar crate, 24K fire-gilding, and FHAN guild assay certificate.');

  // Voice recording simulation handler
  const handleStartRecording = () => {
    setIsRecording(true);
    setAudioDuration(0);
    setHasVoiceNote(false);
    setVoiceTranscript('');

    const interval = setInterval(() => {
      setAudioDuration(prev => {
        if (prev >= 14) {
          clearInterval(interval);
          setIsRecording(false);
          setHasVoiceNote(true);
          const sampleTranscriptNe = 'यो मूर्ति पाटनको पुरानो नेवार परम्परा अनुसार हराएको मैन (lost wax) प्रविधिबाट तयार पारिएको हो। २४ क्यारेट सुनको जलप र लापिस लाजुलीको प्रयोग गरिएको छ।';
          const sampleTranscriptEn = 'This sculpture was forged using the Newar cire-perdue (lost wax) method in Patan. Adorned with 24K fire-gilding and crushed lapis lazuli on the crown.';
          setVoiceTranscript(language === 'ne' ? sampleTranscriptNe : `${sampleTranscriptNe} \n\n[EN Translation]: ${sampleTranscriptEn}`);
          if (!description) {
            setDescription(sampleTranscriptEn);
          }
          return 14;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setHasVoiceNote(true);
    const sampleTranscriptNe = 'यो मूर्ति पाटनको पुरानो नेवार परम्परा अनुसार हराएको मैन (lost wax) प्रविधिबाट तयार पारिएको हो। २४ क्यारेट सुनको जलप र लापिस लाजुलीको प्रयोग गरिएको छ।';
    const sampleTranscriptEn = 'This sculpture was forged using the Newar cire-perdue (lost wax) method in Patan. Adorned with 24K fire-gilding and crushed lapis lazuli on the crown.';
    setVoiceTranscript(language === 'ne' ? sampleTranscriptNe : `${sampleTranscriptNe} \n\n[EN Translation]: ${sampleTranscriptEn}`);
    if (!description) {
      setDescription(sampleTranscriptEn);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    addNewArtwork({
      title,
      nepaliTitle: nepaliTitle || title,
      category,
      priceUSD,
      description: description || 'Masterpiece created according to ancient Nepalese guild traditions.',
      culturalStory: culturalStory || 'Crafted by master artisans preserving Himalayan metallurgical and sacred iconometric heritage.',
      materials,
      dimensions,
      weight,
      artistId,
      voiceNoteDuration: hasVoiceNote ? `${audioDuration}s` : undefined,
      voiceTranscript: hasVoiceNote ? voiceTranscript : undefined
    });

    // Reset form
    setTitle('');
    setNepaliTitle('');
    setDescription('');
    setCulturalStory('');
    setHasVoiceNote(false);
    setActiveTab('inventory');
  };

  // Translations
  const t = {
    studioTitle: language === 'ne' ? 'शिल्पकार स्टुडियो र कार्यशाला' : 'Artisan Studio & Foundry Dashboard',
    subtitle: language === 'ne' ? 'नेपाली परम्परागत हस्तकला व्यवस्थापन प्रणाली' : 'Nepalese Heritage Artisan Management System',
    tabs: {
      inventory: language === 'ne' ? 'वस्तु सूची (इन्भेन्टरी)' : 'Masterwork Inventory',
      create: language === 'ne' ? 'नयाँ कला दर्ता गर्नुहोस्' : 'Catalog New Masterpiece',
      commissions: language === 'ne' ? 'विशेष अर्डर (कमिशन)' : 'Commission Desk',
      financials: language === 'ne' ? 'आर्थिक खाता (लेजर)' : 'Financial Ledger'
    },
    statusMap: {
      Available: language === 'ne' ? 'उपलब्ध' : 'Available',
      Reserved: language === 'ne' ? 'आरक्षित' : 'Reserved',
      Sold: language === 'ne' ? 'बिक्री भएको' : 'Sold',
      Packed: language === 'ne' ? 'प्याक गरिएको' : 'Packed',
      Shipped: language === 'ne' ? 'ढुवानी गरिएको' : 'Shipped'
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24 w-full max-w-full overflow-x-hidden">
      
      {/* Studio Header Bar */}
      <section className="bg-[#1C1917] text-white border-b border-[#38332E]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-[#F59E0B] font-semibold mb-1">
              <span>Patan & Bhaktapur Guild Portal</span>
              <span aria-hidden="true">·</span>
              <span className="font-nepali">कलाकार ड्यासबोर्ड</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white break-words">
              {t.studioTitle}
            </h1>
            <p className="mt-1 text-xs text-[#A8A29E]">
              {t.subtitle} · Active Hub: Sundhara Atelier, Patan
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Bilingual Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-white/10 hover:bg-white/20 rounded border border-white/20 transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Language: <strong>{language === 'en' ? 'English' : 'नेपाली'}</strong></span>
            </button>

            <button
              onClick={() => setActiveTab('create')}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#1C1917] bg-[#F59E0B] hover:bg-[#D97706] rounded transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'ne' ? 'नयाँ कला थप्नुहोस्' : 'Catalog Masterpiece'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center gap-6 overflow-x-auto text-xs border-t border-white/10">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-3 font-semibold transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'inventory' ? 'border-[#F59E0B] text-[#F59E0B]' : 'border-transparent text-[#A8A29E] hover:text-white'
            }`}
          >
            {t.tabs.inventory} ({artworks.length})
          </button>

          <button
            onClick={() => setActiveTab('create')}
            className={`py-3 font-semibold transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'create' ? 'border-[#F59E0B] text-[#F59E0B]' : 'border-transparent text-[#A8A29E] hover:text-white'
            }`}
          >
            {t.tabs.create}
          </button>

          <button
            onClick={() => setActiveTab('commissions')}
            className={`py-3 font-semibold transition-colors border-b-2 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'commissions' ? 'border-[#F59E0B] text-[#F59E0B]' : 'border-transparent text-[#A8A29E] hover:text-white'
            }`}
          >
            <span>{t.tabs.commissions}</span>
            {commissions.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#F59E0B] text-[#1C1917] text-[10px] font-bold flex items-center justify-center">
                {commissions.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('financials')}
            className={`py-3 font-semibold transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'financials' ? 'border-[#F59E0B] text-[#F59E0B]' : 'border-transparent text-[#A8A29E] hover:text-white'
            }`}
          >
            {t.tabs.financials}
          </button>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* TAB 1: INVENTORY MANAGEMENT */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-white rounded-lg border border-[#E7E2D9]">
                <div className="text-xs text-[#78716C]">{language === 'ne' ? 'कुल दर्ता गरिएका कला' : 'Total Cataloged'}</div>
                <div className="font-mono text-2xl font-bold text-[#1C1917] tabular-nums mt-1">
                  {artworks.length}
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-[#E7E2D9]">
                <div className="text-xs text-[#78716C]">{language === 'ne' ? 'हाल उपलब्ध' : 'Available for Acquisition'}</div>
                <div className="font-mono text-2xl font-bold text-emerald-700 tabular-nums mt-1">
                  {artworks.filter(a => a.status === 'Available').length}
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-[#E7E2D9]">
                <div className="text-xs text-[#78716C]">{language === 'ne' ? 'आरक्षित वा बिक्री भएको' : 'Reserved / Sold'}</div>
                <div className="font-mono text-2xl font-bold text-amber-700 tabular-nums mt-1">
                  {artworks.filter(a => a.status === 'Reserved' || a.status === 'Sold').length}
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-[#E7E2D9]">
                <div className="text-xs text-[#78716C]">{language === 'ne' ? 'प्याक वा ढुवानी अवस्था' : 'Packed / In Transit'}</div>
                <div className="font-mono text-2xl font-bold text-sky-700 tabular-nums mt-1">
                  {artworks.filter(a => a.status === 'Packed' || a.status === 'Shipped').length}
                </div>
              </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-lg border border-[#E7E2D9] overflow-hidden shadow-xs">
              <div className="p-4 border-b border-[#F5F2EB] flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                  {language === 'ne' ? 'कार्यशाला हस्तकला सूची' : 'Studio Inventory & Fulfillment Tracking'}
                </h3>
                <span className="text-xs text-[#78716C]">
                  {language === 'ne' ? 'स्थिति परिवर्तन गर्न ड्रपडाउन प्रयोग गर्नुहोस्' : 'Select dropdown to update fulfillment lifecycle'}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] text-[#78716C] border-b border-[#E7E2D9]">
                    <tr>
                      <th className="py-3 px-4 font-semibold">{language === 'ne' ? 'कलाकृति' : 'Artwork / Item'}</th>
                      <th className="py-3 px-4 font-semibold">{language === 'ne' ? 'शिल्पकार' : 'Artisan Workshop'}</th>
                      <th className="py-3 px-4 font-semibold">{language === 'ne' ? 'मूल्य' : 'Price'}</th>
                      <th className="py-3 px-4 font-semibold">{language === 'ne' ? 'प्रमाणपत्र ID' : 'Certificate ID'}</th>
                      <th className="py-3 px-4 font-semibold">{language === 'ne' ? 'अवस्था (Status)' : 'Status Action'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5F2EB]">
                    {artworks.map((art) => (
                      <tr key={art.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={art.images[0]}
                              alt={art.title}
                              className="w-12 h-12 rounded object-cover border border-[#E7E2D9] shrink-0"
                            />
                            <div>
                              <div className="font-serif font-bold text-[#1C1917] text-sm">{art.title}</div>
                              <div className="text-[#78716C] font-nepali text-xs">{art.nepaliTitle}</div>
                              <div className="text-[10px] text-[#B45309] font-medium">{art.category}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-[#57534E]">
                          <div className="font-medium text-[#1C1917]">{art.artist.name}</div>
                          <div className="text-[11px] text-[#78716C]">{art.artist.workshopName}</div>
                          <div className="text-[10px] text-[#78716C]">{art.artist.location.split(',')[0]}</div>
                        </td>

                        <td className="py-3 px-4 font-mono tabular-nums font-semibold text-[#1C1917]">
                          ${art.priceUSD.toLocaleString()}
                          <div className="text-[10px] font-sans text-[#78716C]">
                            NPR {art.priceNPR.toLocaleString()}
                          </div>
                        </td>

                        <td className="py-3 px-4 font-mono text-[11px] text-[#57534E]">
                          <span className="font-semibold text-[#1C1917]">{art.certificateId}</span>
                          <div className="text-[10px] text-emerald-700 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>SHA-256 Signed</span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <select
                            value={art.status}
                            onChange={(e) => updateArtworkStatus(art.id, e.target.value as ArtworkStatus)}
                            className={`px-2.5 py-1 rounded text-xs font-semibold border cursor-pointer ${
                              art.status === 'Available' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                              art.status === 'Reserved' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                              art.status === 'Sold' ? 'bg-purple-50 text-purple-800 border-purple-300' :
                              art.status === 'Packed' ? 'bg-sky-50 text-sky-800 border-sky-300' :
                              'bg-stone-100 text-stone-800 border-stone-300'
                            }`}
                          >
                            <option value="Available">{t.statusMap.Available}</option>
                            <option value="Reserved">{t.statusMap.Reserved}</option>
                            <option value="Sold">{t.statusMap.Sold}</option>
                            <option value="Packed">{t.statusMap.Packed}</option>
                            <option value="Shipped">{t.statusMap.Shipped}</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: PRODUCT CREATION FORM WITH VOICE NOTE RECORDING */}
        {activeTab === 'create' && (
          <div className="max-w-4xl mx-auto bg-white rounded-lg border border-[#E7E2D9] p-8 shadow-xs">
            <div className="border-b border-[#F5F2EB] pb-4 mb-6">
              <div className="text-xs font-semibold tracking-wider text-[#B45309] uppercase mb-1">
                {language === 'ne' ? 'नयाँ सम्पदा दर्ता' : 'Heritage Registration Protocol'}
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#1C1917]">
                {language === 'ne' ? 'नयाँ नेपाली हस्तकला विवरण फारम' : 'Catalog New Nepalese Masterpiece & Mint Certificate'}
              </h2>
              <p className="mt-1 text-xs text-[#78716C]">
                {language === 'ne' 
                  ? 'आवाज टिप्पणी (Voice Note) रेकर्ड गरेर विवरण स्वचालित रूपमा भर्न सकिन्छ।' 
                  : 'Record master artisan voice-notes to document the oral transmission, materials, and blessing ceremonies.'}
              </p>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-6">
              
              {/* Voice-Note Recorder Feature */}
              <div className="p-5 rounded-lg border-2 border-dashed border-[#F59E0B]/50 bg-[#FAF8F5] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic className="w-5 h-5 text-[#B45309]" />
                    <span className="font-serif text-base font-bold text-[#1C1917]">
                      {language === 'ne' ? 'कलाकारको आवाज टिप्पणी (Voice Note)' : 'Artisan Oral History Voice Note'}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#78716C]">
                    {language === 'ne' ? 'नेपाली/नेवारी भाषा समर्थन' : 'Nepali / Newari / Maithili Audio Oral Archive'}
                  </span>
                </div>

                <p className="text-xs text-[#57534E]">
                  {language === 'ne'
                    ? 'रेकर्ड बटन थिचेर मूर्तिको धातु अनुपात, मन्त्र consecration वा पौभा रङ्गको विधि वर्णन गर्नुहोस्।'
                    : 'Click record and articulate the metallurgical proportions, lost-wax method, or sacred consecration vows.'}
                </p>

                {/* Voice Control Buttons & Waveform */}
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={handleStartRecording}
                      className="px-4 py-2 bg-[#B45309] hover:bg-[#92400E] text-white rounded text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Mic className="w-4 h-4" />
                      <span>{language === 'ne' ? 'रेकर्डिङ सुरु गर्नुहोस्' : 'Start Voice Recording'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleStopRecording}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold flex items-center gap-2 cursor-pointer animate-pulse"
                    >
                      <Square className="w-4 h-4 fill-current" />
                      <span>{language === 'ne' ? 'रेकर्डिङ रोक्नुहोस्' : 'Stop Recording'} ({audioDuration}s)</span>
                    </button>
                  )}

                  {/* Audio Visualizer Bar Simulation */}
                  <div className="flex-1 w-full bg-white border border-[#E7E2D9] rounded px-3 py-2 flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-[#78716C] shrink-0" />
                    <div className="flex-1 flex items-center gap-0.5 h-6">
                      {[12, 24, 18, 32, 20, 15, 28, 36, 22, 16, 30, 24, 18, 34, 26, 14, 20, 30].map((h, i) => (
                        <div
                          key={i}
                          style={{ height: isRecording ? `${(h * ((i % 3) + 1)) % 24 + 4}px` : hasVoiceNote ? `${h * 0.6}px` : '4px' }}
                          className={`w-1 rounded-full transition-all duration-200 ${
                            isRecording ? 'bg-red-500' : hasVoiceNote ? 'bg-[#B45309]' : 'bg-stone-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] font-mono text-[#78716C] tabular-nums">
                      {isRecording ? `00:${audioDuration.toString().padStart(2, '0')}` : hasVoiceNote ? '00:14' : '00:00'}
                    </span>
                  </div>
                </div>

                {/* Transcription Display */}
                {voiceTranscript && (
                  <div className="p-3 bg-white rounded border border-[#E7E2D9] mt-2">
                    <div className="text-[11px] font-semibold text-[#B45309] mb-1 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{language === 'ne' ? 'स्वचालित बोली रूपान्तरण (Speech-to-Text)' : 'Oral History Transcription Verified'}</span>
                    </div>
                    <p className="text-xs text-[#1C1917] font-nepali whitespace-pre-line">
                      {voiceTranscript}
                    </p>
                  </div>
                )}
              </div>

              {/* Title & Nepali Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                    {language === 'ne' ? 'कलाकृतिको अंग्रेजी नाम' : 'Artwork Title (English)'} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gilded Padmapani Avalokiteshvara"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E7E2D9] rounded focus:border-[#B45309] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                    {language === 'ne' ? 'नेपाली वा नेवारी भाषामा नाम' : 'Title in Nepali / Newari Script'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. पदमपाणि लोकेश्वरको मूर्ति"
                    value={nepaliTitle}
                    onChange={(e) => setNepaliTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E7E2D9] rounded focus:border-[#B45309] focus:outline-none font-nepali"
                  />
                </div>
              </div>

              {/* Category, Artist & Price */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                    {language === 'ne' ? 'विधा / श्रेणी' : 'Craft Category'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryType)}
                    className="w-full px-3 py-2 text-xs border border-[#E7E2D9] rounded focus:border-[#B45309] focus:outline-none bg-white"
                  >
                    <option value="Metal Statues">Metal Statues (धातुका मूर्तिहरू)</option>
                    <option value="Wood Carving">Wood Carving (काष्ठकला)</option>
                    <option value="Thangka/Paubha">Thangka/Paubha (थाङ्का र पौभा)</option>
                    <option value="Mithila Art">Mithila Art (मिथिला चित्रकला)</option>
                    <option value="Lokta Paper">Lokta Paper (लोक्ता कागज)</option>
                    <option value="Weaving">Weaving (बुनाई)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                    {language === 'ne' ? 'सर्जक शिल्पकार' : 'Master Artisan Workshop'}
                  </label>
                  <select
                    value={artistId}
                    onChange={(e) => setArtistId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E7E2D9] rounded focus:border-[#B45309] focus:outline-none bg-white"
                  >
                    {ARTISTS.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.workshopName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                    {language === 'ne' ? 'मूल्य ($ USD)' : 'Acquisition Price ($ USD)'} *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min={50}
                      value={priceUSD}
                      onChange={(e) => setPriceUSD(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-[#E7E2D9] rounded focus:border-[#B45309] focus:outline-none font-mono"
                    />
                    <span className="absolute right-3 top-2 text-[10px] text-[#78716C]">
                      ~NPR {(priceUSD * 135).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Specs: Materials, Dimensions, Weight */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                    {language === 'ne' ? 'प्रयोग गरिएका सामग्रीहरू' : 'Materials Verified'}
                  </label>
                  <input
                    type="text"
                    value={materials}
                    onChange={(e) => setMaterials(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E7E2D9] rounded focus:border-[#B45309] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                    {language === 'ne' ? 'नाप (Dimensions)' : 'Dimensions'}
                  </label>
                  <input
                    type="text"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E7E2D9] rounded focus:border-[#B45309] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                    {language === 'ne' ? 'तौल (Weight)' : 'Net Weight'}
                  </label>
                  <input
                    type="text"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E7E2D9] rounded focus:border-[#B45309] focus:outline-none"
                  />
                </div>
              </div>

              {/* Description & Cultural Story */}
              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                  {language === 'ne' ? 'विस्तृत विवरण (Description)' : 'Artwork Description'}
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Details of the craftsmanship, postures, and aesthetic features..."
                  className="w-full px-3 py-2 text-xs border border-[#E7E2D9] rounded focus:border-[#B45309] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#F5F2EB]">
                <button
                  type="button"
                  onClick={() => setActiveTab('inventory')}
                  className="px-4 py-2 text-xs font-medium text-[#57534E] hover:text-[#1C1917]"
                >
                  {language === 'ne' ? 'रद्द गर्नुहोस्' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-semibold text-[#1C1917] bg-[#F59E0B] hover:bg-[#D97706] rounded transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <ShieldCheck className="w-4 h-4 text-[#1C1917]" />
                  <span>
                    {language === 'ne' ? 'दर्ता गरी प्रमाणपत्र जारी गर्नुहोस्' : 'Publish Masterpiece & Mint Certificate'}
                  </span>
                </button>
              </div>

            </form>
          </div>
        )}

        {/* TAB 3: COMMISSION DESK INBOX */}
        {activeTab === 'commissions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#1C1917]">
                  {language === 'ne' ? 'विशेष अर्डर (कमिशन) इनबक्स' : 'Patron Commission Desk'}
                </h3>
                <p className="text-xs text-[#78716C]">
                  {language === 'ne' 
                    ? 'अन्तर्राष्ट्रिय संग्रहकर्ताहरूको विशेष अनुरोधहरू समीक्षा गर्नुहोस् र ५०% अग्रिम भुक्तानीका लागि कोटेशन पेश गर्नुहोस्।'
                    : 'Review custom requests from global collectors, send milestone proposals, and verify 50% deposit escrows.'}
                </p>
              </div>
            </div>

            {commissions.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-lg border border-[#E7E2D9]">
                <Clock className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h4 className="font-serif text-lg font-bold text-[#1C1917]">No Active Commission Inquiries</h4>
                <p className="text-xs text-[#78716C] mt-1 max-w-md mx-auto">
                  New collector requests for bespoke sacred sculptures, thangka paintings, and architectural joinery will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {commissions.map((com) => (
                <div
                  key={com.id}
                  className="bg-white rounded-lg border border-[#E7E2D9] p-6 shadow-xs flex flex-col md:flex-row md:items-start justify-between gap-6"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-[#1C1917] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E7E2D9]">
                        {com.id.toUpperCase()}
                      </span>
                      <span className="text-xs font-semibold text-[#B45309]">{com.category}</span>
                      <span className="text-xs text-[#78716C]">· Submitted {com.createdAt}</span>

                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ml-auto ${
                        com.status === 'Deposit Paid (50%)' ? 'bg-emerald-100 text-emerald-800' :
                        com.status === 'Quote Sent' ? 'bg-sky-100 text-sky-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {com.status}
                      </span>
                    </div>

                    <h4 className="font-serif text-lg font-bold text-[#1C1917]">
                      {com.clientName} <span className="text-xs font-normal text-[#78716C]">({com.clientLocation})</span>
                    </h4>

                    <p className="text-xs text-[#57534E] leading-relaxed">
                      {com.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-2 border-t border-[#F5F2EB]">
                      <div>
                        <span className="text-[#78716C]">Dimensions: </span>
                        <strong className="text-[#1C1917]">{com.requestedDimensions}</strong>
                      </div>
                      <div>
                        <span className="text-[#78716C]">Budget: </span>
                        <strong className="text-[#1C1917]">{com.budgetRangeUSD}</strong>
                      </div>
                      <div>
                        <span className="text-[#78716C]">Deadline: </span>
                        <strong className="text-[#1C1917]">{com.deadlineDate}</strong>
                      </div>
                    </div>

                    {com.quoteAmountUSD && (
                      <div className="p-3 bg-[#FAF8F5] rounded border border-[#E7E2D9] text-xs">
                        <div className="font-semibold text-[#1C1917] flex items-center justify-between">
                          <span>Active Quote: ${com.quoteAmountUSD.toLocaleString()} USD</span>
                          <span className="text-[#78716C]">50% Deposit: ${(com.quoteAmountUSD * 0.5).toLocaleString()}</span>
                        </div>
                        {com.quoteNotes && (
                          <p className="text-[11px] text-[#57534E] mt-1">{com.quoteNotes}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions column */}
                  <div className="md:w-64 flex flex-col gap-2 shrink-0">
                    {com.status === 'Pending Review' && (
                      <button
                        onClick={() => {
                          setActiveQuoteId(com.id);
                          setQuoteAmount(4500);
                        }}
                        className="w-full py-2 px-3 text-xs font-semibold text-white bg-[#1C1917] rounded hover:bg-[#292524] transition-colors cursor-pointer"
                      >
                        Submit Price Quote
                      </button>
                    )}

                    {com.status === 'Quote Sent' && (
                      <button
                        onClick={() => markCommissionDepositPaid(com.id)}
                        className="w-full py-2 px-3 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Accept 50% Deposit</span>
                      </button>
                    )}

                    {com.status === 'Deposit Paid (50%)' && (
                      <div className="p-3 bg-emerald-50 rounded border border-emerald-200 text-xs text-emerald-900 text-center">
                        <span className="font-bold">Active in Atelier</span>
                        <div className="text-[10px] text-emerald-700 mt-0.5">50% Escrow secured in Patan vault</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            )}

            {/* Modal for Submitting Quote */}
            {activeQuoteId && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                <div className="w-full max-w-md bg-white rounded-lg border border-[#E7E2D9] p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-[#F5F2EB] pb-2">
                    <h4 className="font-serif text-lg font-bold text-[#1C1917]">
                      Submit Commission Quote ({activeQuoteId.toUpperCase()})
                    </h4>
                    <button
                      onClick={() => setActiveQuoteId(null)}
                      className="text-stone-400 hover:text-stone-700"
                    >
                      ✕
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                      Total Quote Amount ($ USD)
                    </label>
                    <input
                      type="number"
                      value={quoteAmount}
                      onChange={(e) => setQuoteAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-[#E7E2D9] rounded font-mono"
                    />
                    <span className="text-[10px] text-[#78716C] block mt-1">
                      50% upfront deposit will be: ${(quoteAmount * 0.5).toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                      Scope Notes & Lead Time
                    </label>
                    <textarea
                      rows={3}
                      value={quoteNotes}
                      onChange={(e) => setQuoteNotes(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#E7E2D9] rounded"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      onClick={() => setActiveQuoteId(null)}
                      className="px-3 py-1.5 text-xs text-[#57534E]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        submitCommissionQuote(activeQuoteId, quoteAmount, quoteNotes);
                        setActiveQuoteId(null);
                      }}
                      className="px-4 py-2 text-xs font-semibold text-white bg-[#1C1917] rounded hover:bg-[#292524]"
                    >
                      Send Official Quote
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: FINANCIAL LEDGER */}
        {activeTab === 'financials' && (
          <div className="space-y-6">
            
            {/* Financial Ledger Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-5 bg-white rounded-lg border border-[#E7E2D9]">
                <div className="text-xs text-[#78716C]">
                  {language === 'ne' ? 'कुल बिक्री (Gross Sales)' : 'Gross Masterwork Sales'}
                </div>
                <div className="font-mono text-2xl font-bold text-[#1C1917] tabular-nums mt-1">
                  ${financials.grossSalesUSD.toLocaleString()}
                </div>
                <div className="text-[11px] text-[#78716C] mt-0.5">
                  Approx. NPR {(financials.grossSalesUSD * financials.currencyRateNPR).toLocaleString()}
                </div>
              </div>

              <div className="p-5 bg-white rounded-lg border border-[#E7E2D9]">
                <div className="text-xs text-[#78716C]">
                  {language === 'ne' ? 'गुठी/प्लेटफर्म शुल्क (१२%)' : 'Platform & Guild Retainage (12%)'}
                </div>
                <div className="font-mono text-2xl font-bold text-[#B45309] tabular-nums mt-1">
                  -${financials.platformFeeDeductionsUSD.toLocaleString()}
                </div>
                <div className="text-[11px] text-[#78716C] mt-0.5">
                  Reinvested in Patan Apprenticeship Centers
                </div>
              </div>

              <div className="p-5 bg-white rounded-lg border border-[#E7E2D9]">
                <div className="text-xs text-[#78716C]">
                  {language === 'ne' ? 'एस्क्रो होल्ड (Pending Escrow)' : 'Milestone Escrow Holds'}
                </div>
                <div className="font-mono text-2xl font-bold text-amber-700 tabular-nums mt-1">
                  ${financials.pendingHoldsUSD.toLocaleString()}
                </div>
                <div className="text-[11px] text-[#78716C] mt-0.5">
                  Released post-Kathmandu Hub QC
                </div>
              </div>

              <div className="p-5 bg-[#1C1917] text-white rounded-lg border border-[#1C1917] flex flex-col justify-between">
                <div>
                  <div className="text-xs text-[#A8A29E]">
                    {language === 'ne' ? 'निकाल्न सकिने मौज्दात' : 'Withdrawable Balance'}
                  </div>
                  <div className="font-mono text-2xl font-bold text-[#F59E0B] tabular-nums mt-1">
                    ${financials.withdrawableBalanceUSD.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-[#D6D3D1] mt-0.5">
                    NPR {(financials.withdrawableBalanceUSD * financials.currencyRateNPR).toLocaleString()}
                  </div>
                </div>

                <button
                  onClick={() => setShowPayoutModal(true)}
                  className="mt-4 w-full py-2 px-3 text-xs font-semibold text-[#1C1917] bg-[#F59E0B] hover:bg-[#D97706] rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>{language === 'ne' ? 'रकम निकाल्नुहोस्' : 'Request Payout Transfer'}</span>
                </button>
              </div>
            </div>

            {/* Payout Channels & Historical Payout Log */}
            <div className="bg-white rounded-lg border border-[#E7E2D9] overflow-hidden">
              <div className="p-4 border-b border-[#F5F2EB] flex items-center justify-between">
                <h4 className="font-serif text-base font-bold text-[#1C1917]">
                  {language === 'ne' ? 'हालका भुक्तानी अभिलेखहरू' : 'Recent Studio Disbursals'}
                </h4>
                <div className="text-xs text-[#78716C] flex items-center gap-2">
                  <span>Supported Channels:</span>
                  <span className="font-semibold text-emerald-700">eSewa</span>
                  <span>·</span>
                  <span className="font-semibold text-purple-700">Khalti</span>
                  <span>·</span>
                  <span className="font-semibold text-sky-700">SWIFT Wire</span>
                </div>
              </div>

              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] text-[#78716C] border-b border-[#E7E2D9]">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Payout ID</th>
                    <th className="py-2.5 px-4 font-semibold">Date</th>
                    <th className="py-2.5 px-4 font-semibold">Amount (USD)</th>
                    <th className="py-2.5 px-4 font-semibold">Amount (NPR)</th>
                    <th className="py-2.5 px-4 font-semibold">Transfer Channel</th>
                    <th className="py-2.5 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F2EB]">
                  {financials.recentPayouts.map(p => (
                    <tr key={p.id}>
                      <td className="py-3 px-4 font-mono font-semibold text-[#1C1917]">{p.id.toUpperCase()}</td>
                      <td className="py-3 px-4 text-[#78716C]">{p.date}</td>
                      <td className="py-3 px-4 font-mono font-bold text-[#1C1917] tabular-nums">${p.amountUSD.toLocaleString()}</td>
                      <td className="py-3 px-4 font-mono text-[#57534E] tabular-nums">NPR {(p.amountUSD * financials.currencyRateNPR).toLocaleString()}</td>
                      <td className="py-3 px-4 font-medium text-[#1C1917]">{p.channel}</td>
                      <td className="py-3 px-4">
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold text-[11px] flex items-center gap-1 w-max">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          <span>{p.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Payout Modal */}
            {showPayoutModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                <div className="w-full max-w-md bg-white rounded-lg border border-[#E7E2D9] p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-[#F5F2EB] pb-2">
                    <h4 className="font-serif text-lg font-bold text-[#1C1917]">
                      {language === 'ne' ? 'रकम निकासी अनुरोध' : 'Disburse Studio Earnings'}
                    </h4>
                    <button
                      onClick={() => setShowPayoutModal(false)}
                      className="text-stone-400 hover:text-stone-700"
                    >
                      ✕
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                      Withdrawal Amount ($ USD)
                    </label>
                    <input
                      type="number"
                      max={financials.withdrawableBalanceUSD}
                      min={100}
                      value={payoutAmount}
                      onChange={(e) => setPayoutAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-[#E7E2D9] rounded font-mono"
                    />
                    <div className="flex justify-between text-[11px] text-[#78716C] mt-1">
                      <span>Available: ${financials.withdrawableBalanceUSD.toLocaleString()}</span>
                      <span>~NPR {(payoutAmount * financials.currencyRateNPR).toLocaleString()}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                      Disbursement Channel
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['eSewa', 'Khalti', 'SWIFT Bank Wire'] as const).map(ch => (
                        <button
                          key={ch}
                          type="button"
                          onClick={() => setPayoutChannel(ch)}
                          className={`py-2 px-2 text-xs font-semibold rounded border cursor-pointer ${
                            payoutChannel === ch 
                              ? 'bg-[#1C1917] text-white border-[#1C1917]' 
                              : 'bg-white text-[#57534E] border-[#E7E2D9] hover:bg-stone-50'
                          }`}
                        >
                          {ch}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF8F5] rounded border border-[#E7E2D9] text-[11px] text-[#57534E]">
                    Transfers via eSewa and Khalti settle within 2 hours. International SWIFT bank wires settle within 2 business days under Nepal Rastra Bank foreign trade regulations.
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      onClick={() => setShowPayoutModal(false)}
                      className="px-3 py-1.5 text-xs text-[#57534E]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        const ok = await requestPayout(payoutAmount, payoutChannel);
                        if (ok) setShowPayoutModal(false);
                      }}
                      className="px-4 py-2 text-xs font-semibold text-[#1C1917] bg-[#F59E0B] rounded hover:bg-[#D97706]"
                    >
                      Confirm Payout
                    </button>
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

import { Artist, Artwork, CategoryType, Certificate, CommissionRequest, B2BProject, StudioFinancials } from '../types';

export const HERO_IMAGE = '/src/assets/images/hero_shilpaya_himalayan_art_1791009653607.jpg';
export const BRONZE_BUDDHA_IMAGE = '/src/assets/images/product_lost_wax_buddha_bronze_1791009616481.jpg';
export const PEACOCK_WINDOW_IMAGE = '/src/assets/images/product_wood_carved_peacock_window_1791009627927.jpg';
export const MITHILA_PAINTING_IMAGE = '/src/assets/images/product_mithila_kohbar_painting_1791009641057.jpg';

export const ARTISTS: Artist[] = [
  {
    id: 'art-01',
    name: 'Rajendra Shakya',
    nepaliName: 'राजेन्द्र शाक्य',
    title: 'Master Lost-Wax Metal Caster',
    generation: '7th Generation Newar Guild Artisan',
    workshopName: 'Shakya Heritage Foundry',
    location: 'Sundhara, Patan (Lalitpur)',
    coordinates: '27.6698° N, 85.3216° E',
    bio: 'Descendant of the sacred metallurgical casters who forged iconography for the Malla kings. Specializes in cire-perdue (lost-wax) sacred copper alloys, hand fire-gilding, and repoussé detailing.',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    verifiedArtisan: true,
    specialty: 'Metal Statues',
  },
  {
    id: 'art-02',
    name: 'Bikash Chitrakar',
    nepaliName: 'बिकश चित्रकार',
    title: 'Master Paubha & Thangka Painter',
    generation: '5th Generation Pun/Chitrakar Lineage',
    workshopName: 'Patan Mandala Hermitage',
    location: 'Nagbahal, Patan',
    coordinates: '27.6744° N, 85.3242° E',
    bio: 'Dedicated practitioner of traditional Paubha painting using hand-ground mineral pigments (malachite, cinnabar, lapis lazuli) suspended in organic hide glue, adorned with 24K burnished gold leaf.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    verifiedArtisan: true,
    specialty: 'Thangka/Paubha',
  },
  {
    id: 'art-03',
    name: 'Khem Raj Shilpakar',
    nepaliName: 'खेमराज शिल्पकार',
    title: 'Master Architectural Sal-Wood Carver',
    generation: '4th Generation Bhaktapur Wood Sculptor',
    workshopName: 'Dattatreya Woodcraft Guild',
    location: 'Tachapal Square, Bhaktapur',
    coordinates: '27.6728° N, 85.4332° E',
    bio: 'Preserves the rare classical Newari architectural joinery and intricate filigree relief techniques used in the restored pagoda temples of Bhaktapur Durbar Square.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    verifiedArtisan: true,
    specialty: 'Wood Carving',
  },
  {
    id: 'art-04',
    name: 'Sunita Devi Karn',
    nepaliName: 'सुनिता देवी कर्ण',
    title: 'Senior Mithila Folk Artist',
    generation: '3rd Generation Matriarchal Lineage',
    workshopName: 'Janakpurdham Women Artisan Atelier',
    location: 'Ramanand Chowk, Janakpur',
    coordinates: '26.7271° N, 85.9407° E',
    bio: 'Inherited the ceremonial Kohbar and Aripan rituals practiced by Maithil women. Prepares all paints from soot, marigold petals, madder root, and wild acacia gum on sun-cured Lokta sheets.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    verifiedArtisan: true,
    specialty: 'Mithila Art',
  },
  {
    id: 'art-05',
    name: 'Pasang Sherpa & Doma Lama',
    nepaliName: 'पासाङ शेर्पा र दोमा लामा',
    title: 'Highland Himalayan Weavers',
    generation: 'Master Tibetan-Nepalese Carpet Weavers',
    workshopName: 'Boudha Himalayan Looms',
    location: 'Tinchuli, Boudha, Kathmandu',
    coordinates: '27.7215° N, 85.3620° E',
    bio: 'Artisans hand-spinning 100% pure Tibetan highland sheep wool and weaving with traditional senneh-loop techniques yielding 120-knot heirloom resilience.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    verifiedArtisan: true,
    specialty: 'Weaving',
  },
  {
    id: 'art-06',
    name: 'Tashi Tamang',
    nepaliName: 'तासी तामाङ',
    title: 'High-Altitude Lokta Papermaker',
    generation: 'Dolakha Mountain Forest Cooperatives',
    workshopName: 'Daphne Bhoula Craft Paper Guild',
    location: 'Jiri, Dolakha / Thamel Studio',
    coordinates: '27.6322° N, 86.2301° E',
    bio: 'Wild-harvests the renewable inner bark of the Daphne bhoula shrub at 2,400m altitude. Cooked in mountain spring ash water and sun-dried on wooden mesh screens, resistant to insects for centuries.',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
    verifiedArtisan: true,
    specialty: 'Lokta Paper',
  }
];

export const CATEGORIES_DATA: {
  name: CategoryType;
  nepaliName: string;
  count: number;
  description: string;
  culturalNote: string;
  originHub: string;
}[] = [
  {
    name: 'Metal Statues',
    nepaliName: 'धातुका मूर्तिहरू',
    count: 14,
    description: 'Sacred lost-wax cast copper, bronze, and fire-gilded deities created by Patan master metalsmiths.',
    culturalNote: 'Each deity is cast following the ancient Sanskrit canons of the Shilpa Shastra, preserving sacred iconometric proportions.',
    originHub: 'Patan (Lalitpur) Heritage Quarter'
  },
  {
    name: 'Wood Carving',
    nepaliName: 'काष्ठकला',
    count: 18,
    description: 'Hand-chiseled sal-wood peacock windows, torana lintels, and Ashtamangala auspicious lattices.',
    culturalNote: 'Carved exclusively from sustainably salvaged aged Shorea robusta (Sal) timber, cured for years to prevent mountain warping.',
    originHub: 'Bhaktapur & Kathmandu Durbar Quarters'
  },
  {
    name: 'Thangka/Paubha',
    nepaliName: 'थाङ्का र पौभा',
    count: 12,
    description: 'Sacred meditation scrolls executed with natural crushed malachite, lapis lazuli, and burnished 24K gold.',
    culturalNote: 'Paubha is the indigenous spiritual painting heritage of the Newar valley, created during rigorous fasting and meditative focus.',
    originHub: 'Nagbahal & Boudha Monasteries'
  },
  {
    name: 'Mithila Art',
    nepaliName: 'मिथिला चित्रकला',
    count: 9,
    description: 'Ancient ceremonial folk paintings from Janakpurdham composed with bamboo twigs and organic plant pigments.',
    culturalNote: 'Historically painted on bridal room mud walls (Kohbar) to bless marriages with fertility, natural harmony, and auspicious cosmic cycles.',
    originHub: 'Janakpurdham, Mithila Region'
  },
  {
    name: 'Lokta Paper',
    nepaliName: 'लोक्ता कागज',
    count: 16,
    description: 'Handmade archival paper harvested from high-Himalayan Daphne shrubs, naturally impervious to silverfish and decay.',
    culturalNote: 'Used by the royal courts and Buddhist monasteries for over a millennium to transcribe sacred sutras and royal decrees.',
    originHub: 'Dolakha & Bagmati High Forests'
  },
  {
    name: 'Weaving',
    nepaliName: 'हातले बुनेका कपडाहरू',
    count: 11,
    description: 'Hand-loomed Palpali Dhaka patterns, Himalayan cashmere pashmina, and vegetable-dyed highland wool carpets.',
    culturalNote: 'Geometric Dhaka motifs are woven using hand shuttles without electrical automation, reflecting Himalayan flora and skyline contours.',
    originHub: 'Palpa, Pokhara & Boudha Looms'
  }
];

export const INITIAL_ARTWORKS: Artwork[] = [
  {
    id: 'shp-001',
    title: 'Gilded Shakyamuni Buddha in Bhumisparsha Mudra',
    nepaliTitle: 'भूमिस্পর্শ मुद्रामा शाक्यमुनि बुद्ध',
    category: 'Metal Statues',
    priceUSD: 3450,
    priceNPR: 465000,
    artistId: 'art-01',
    artist: ARTISTS[0],
    images: [
      BRONZE_BUDDHA_IMAGE,
      'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80'
    ],
    videoThumbnail: BRONZE_BUDDHA_IMAGE,
    videoDuration: '1:45 min',
    description: 'An extraordinary museum-quality sculpture of Shakyamuni Buddha seated in the earth-touching posture (Bhumisparsha Mudra), calling the earth to witness his enlightenment under the Bodhi tree. Cast through the lost-wax technique in heavy copper alloy and meticulously hand-gilded with 24-karat gold paste.',
    culturalStory: 'The Shakya artisans of Patan have preserved the lost-wax casting technique since the Lichhavi period (5th–8th century CE). The face is delicately painted with cold gold and pure mineral lapis lazuli for the hair buns, according to the ancient sacred canonical guidelines.',
    spiritualMeaning: 'Symbolizes unshakable resolve, the dispelling of illusions, and the attainment of absolute supreme wakefulness.',
    specifications: {
      materials: 'Lost-wax hand-cast red copper, pure 24K mercury fire-gilding, cold gold face painting, crushed lapis lazuli paste, turquoise inlays',
      dimensions: '18.5" H × 13.2" W × 9.5" D (47 cm × 33.5 cm × 24 cm)',
      weight: '9.85 kg (21.7 lbs)',
      period: 'Contemporary Masterwork (2026)',
      creationTime: '14 Weeks of Continuous Artisan Labor',
      technique: 'Cire-Perdue (Lost Wax) + Hand Repoussé & Chasing'
    },
    status: 'Available',
    certificateId: 'SHP-ART-2026-000845',
    featured: true
  },
  {
    id: 'shp-002',
    title: 'Heritage Newari Peacock Window (Mayur Jhyal)',
    nepaliTitle: 'परम्परागत नेवारी मयूर झ्याल',
    category: 'Wood Carving',
    priceUSD: 2850,
    priceNPR: 384000,
    artistId: 'art-03',
    artist: ARTISTS[2],
    images: [
      PEACOCK_WINDOW_IMAGE,
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80'
    ],
    videoThumbnail: PEACOCK_WINDOW_IMAGE,
    videoDuration: '2:10 min',
    description: 'A masterpiece of classic Newari architecture, this Mayur Jhyal (Peacock Window) features a fan-tailed peacock surrounded by 35 miniature mythical beings, Garudas, makaras, and floral arabesques, hand-chiseled from cured mountain Sal wood.',
    culturalStory: 'Originating from the 15th-century Malla palaces of Bhaktapur, the peacock is revered as the mount of God Kartikeya and a symbol of immortality, beauty, and the transmutation of worldly poison into vibrant feathers.',
    spiritualMeaning: 'Acts as a celestial guardian at architectural portals, filtering sunlight into geometric mandala reflections.',
    specifications: {
      materials: 'Aged Himalayan Sal wood (Shorea robusta), cold-pressed mustard oil curing, natural beeswax polish',
      dimensions: '34" H × 28" W × 4" D (86 cm × 71 cm × 10 cm)',
      weight: '14.2 kg (31.3 lbs)',
      period: 'Contemporary Architectural Heritage (2026)',
      creationTime: '9 Weeks of Chisel Work',
      technique: 'Tenon & Mortise Joinery, Deep Relief Chisel Carving'
    },
    status: 'Available',
    certificateId: 'SHP-ART-2026-000912',
    featured: true
  },
  {
    id: 'shp-003',
    title: 'Sacred Mithila Kohbar of Cosmic Abundance',
    nepaliTitle: 'पवित्र मिथिला कोहबर चित्र',
    category: 'Mithila Art',
    priceUSD: 1250,
    priceNPR: 168000,
    artistId: 'art-04',
    artist: ARTISTS[3],
    images: [
      MITHILA_PAINTING_IMAGE,
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80'
    ],
    videoThumbnail: MITHILA_PAINTING_IMAGE,
    videoDuration: '1:15 min',
    description: 'An authentic ceremonial Kohbar painting celebrating the union of masculine and feminine cosmic energies, framed with sacred lotus stalks (Purain), bamboo groves of continuity, and celestial peacocks.',
    culturalStory: 'In the ancient kingdom of Mithila, this sacred composition was painted exclusively by women on wedding room alcoves to invoke fertility and harmony. Painted using bamboo sticks and cotton swabs with natural organic pigments.',
    spiritualMeaning: 'Invokes cosmic fertility, family lineage longevity, and alignment between terrestrial life and solar-lunar cycles.',
    specifications: {
      materials: 'Natural soot lampblack, madder root red, indigo dye, turmeric yellow, acacia resin binder on quadruple-ply handmade Lokta paper',
      dimensions: '30" H × 42" W (76 cm × 106 cm)',
      weight: '0.45 kg (frameless archival roll)',
      period: '2026 Ceremonial Series',
      creationTime: '3 Weeks of Natural Pigment Grinding & Painting',
      technique: 'Bamboo-nib freehand Maithili calligraphy & brushwork'
    },
    status: 'Available',
    certificateId: 'SHP-ART-2026-000780',
    featured: true
  },
  {
    id: 'shp-004',
    title: 'White Tara of Longevity (Sitatara) Gold Paubha',
    nepaliTitle: 'दीर्घायुकी सेतो तारा (सितातारा) पौभा',
    category: 'Thangka/Paubha',
    priceUSD: 4100,
    priceNPR: 553500,
    artistId: 'art-02',
    artist: ARTISTS[1],
    images: [
      HERO_IMAGE,
      'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'A museum-grade classical Newar Paubha of White Tara possessing seven eyes of transcendent compassion. Illuminated with pure 24K powdered gold shading and ground lapis, cinnabar, and orpiment.',
    culturalStory: 'Unlike modern quick-print scrolls, this Paubha is rendered onto organic hand-stretched cotton prepared with mountain gypsum and buffalo skin glue. The artist executed the consecration ritual (Drishti-dana) to open the eyes upon completion.',
    spiritualMeaning: 'Bestows health, dispels untimely obstacles, and nurtures maternal wisdom across all beings.',
    specifications: {
      materials: 'Hand-ground malachite, lapis lazuli, cinnabar, orpiment, real 24-karat gold leaf wash, prepared Nepalese cotton canvas',
      dimensions: '26" H × 20" W (66 cm × 51 cm)',
      weight: '0.8 kg (with silk brocade mounting: 1.4 kg)',
      period: '2026 Mandala Cycle',
      creationTime: '16 Weeks of Microscopic Brushwork',
      technique: 'Traditional Newari Paubha burnished dry-gold shading'
    },
    status: 'Reserved',
    reservedUntil: '2026-10-15',
    certificateId: 'SHP-ART-2026-000621',
    featured: true
  },
  {
    id: 'shp-005',
    title: 'Patan Gilded Green Tara (Syamatara) in Royal Ease',
    nepaliTitle: 'ललितपुर शैलीको हरित तारा',
    category: 'Metal Statues',
    priceUSD: 2950,
    priceNPR: 398000,
    artistId: 'art-01',
    artist: ARTISTS[0],
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      BRONZE_BUDDHA_IMAGE
    ],
    description: 'Goddess of Swift Action and Compassion seated with right foot extended, ready to step down and protect all devotees from fear and tribulation.',
    culturalStory: 'Crafted in the historic workshops of Sundhara, where Master Rajendra Shakya hand-chiseled every fold of the celestial celestial scarf and lotus petals.',
    spiritualMeaning: 'Protection from the eight outer and inner perils, including pride, ignorance, anger, and doubt.',
    specifications: {
      materials: 'Cast copper, 24K mercury fire-gilt finish, embedded Himalayan turquoise & Tibetan coral',
      dimensions: '15.5" H × 10.5" W × 7.5" D (39 cm × 27 cm × 19 cm)',
      weight: '6.4 kg',
      period: '2026 Patan Guild Cast',
      creationTime: '10 Weeks',
      technique: 'Lost-wax casting with gemstone bezel setting'
    },
    status: 'Available',
    certificateId: 'SHP-ART-2026-000856'
  },
  {
    id: 'shp-006',
    title: 'Archival Lokta Sacred Prajnaparamita Accordion Manuscript',
    nepaliTitle: 'प्रज्ञापारमिता लोक्ता ग्रन्थ',
    category: 'Lokta Paper',
    priceUSD: 680,
    priceNPR: 91800,
    artistId: 'art-06',
    artist: ARTISTS[5],
    images: [
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
      PEACOCK_WINDOW_IMAGE
    ],
    description: 'Traditional fold-out accordion scripture album handcrafted from heavy 80gsm pure Daphne bark Lokta paper, dyed with natural harro (black myrobalan) and inscribed with gold ink Ranjana script.',
    culturalStory: 'Lokta paper from Dolakha has withstood damp Himalayan monsoons and monastery fires for over 1,200 years. Each sheet is sun-cured and burnished with a wild conch shell.',
    spiritualMeaning: 'The Wisdom Sutra of the Perfection of Transcendent Insight, embodying sunyata (emptiness).',
    specifications: {
      materials: 'Daphne bhoula wild Himalayan bark, natural mineral ink, carved sal-wood cover boards',
      dimensions: '8" H × 24" W (expanded length: 180 cm)',
      weight: '1.2 kg',
      period: '2026 Archival Binding',
      creationTime: '4 Weeks',
      technique: 'Floating deckle-screen paper lifting & conch burnishing'
    },
    status: 'Available',
    certificateId: 'SHP-ART-2026-000499'
  },
  {
    id: 'shp-007',
    title: 'High-Altitude Himalayan Hand-Knotted Yak Wool Rug',
    nepaliTitle: 'हिमाली चौंरीको ऊनको हातले बुनेको गलैंचा',
    category: 'Weaving',
    priceUSD: 1850,
    priceNPR: 249750,
    artistId: 'art-05',
    artist: ARTISTS[4],
    images: [
      'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=1200&q=80'
    ],
    description: '100-knot heirloom carpet hand-woven from hand-spun unbleached Tibetan highland sheep and yak wool. Colored with madder root, walnut rind, and wild Himalayan rhubarb.',
    culturalStory: 'The weavers of Boudha preserve century-old knotting rhythms passed down from nomadic plateau traditions. Naturally water-resistant due to rich lanolin content.',
    spiritualMeaning: 'Geometric clouds and mountain peaks symbolize eternal longevity and protection.',
    specifications: {
      materials: 'Hand-carded Himalayan wool & yak down, organic vegetable dyes, cotton warp',
      dimensions: '6 ft × 9 ft (183 cm × 274 cm)',
      weight: '18.5 kg',
      period: '2026 Looming',
      creationTime: '7 Weeks of Continuous Hand-Knotting',
      technique: 'Traditional Tibetan rod-cut knotting (100 knots/sq inch)'
    },
    status: 'Available',
    certificateId: 'SHP-ART-2026-000733'
  },
  {
    id: 'shp-008',
    title: 'Torana of the Five Cosmic Buddhas (Pancha Buddha)',
    nepaliTitle: 'पञ्च बुद्ध तोरण काष्ठकला',
    category: 'Wood Carving',
    priceUSD: 2350,
    priceNPR: 317250,
    artistId: 'art-03',
    artist: ARTISTS[2],
    images: [
      PEACOCK_WINDOW_IMAGE,
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'An architectural temple lintel archway depicting the Five Dhyani Buddhas crowned by Garuda and flanked by sea-monsters (Makaras). Intended for grand heritage entrances or fine residential sanctuaries.',
    culturalStory: 'Carved in Tachapal Square, Bhaktapur, where Newar woodcarvers have crowned temples like Nyatapola and Dattatreya for six centuries.',
    spiritualMeaning: 'Blesses all who pass underneath with protection against discordant negative energies.',
    specifications: {
      materials: 'Salvaged Himalayan Sal timber, herbal beeswax and linseed sealant',
      dimensions: '22" H × 48" W × 5" D (56 cm × 122 cm × 13 cm)',
      weight: '19.8 kg',
      period: '2026',
      creationTime: '8 Weeks',
      technique: 'Deep undercut high-relief chiseling'
    },
    status: 'Available',
    certificateId: 'SHP-ART-2026-000941'
  }
];

export const INITIAL_CERTIFICATES: Record<string, Certificate> = {
  'SHP-ART-2026-000845': {
    id: 'SHP-ART-2026-000845',
    artworkId: 'shp-001',
    artworkTitle: 'Gilded Shakyamuni Buddha in Bhumisparsha Mudra',
    artistName: 'Rajendra Shakya',
    artistNepaliName: 'राजेन्द्र शाक्य',
    craftLineage: '7th Generation Newar Guild Metallurgical Caste (Patan)',
    workshopLocation: 'Sundhara Heritage Atelier, Lalitpur, Nepal (27.6698° N, 85.3216° E)',
    issueDate: '2026-09-14',
    cryptographicHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    guildAssayStamp: 'PATAN-METALS-GUILD-ASSAY-#845-VERIFIED-24K-GILT',
    authenticitySealUrl: 'https://api.iconify.design/lucide:shield-check.svg',
    materialsVerified: [
      'High-grade virgin red copper alloy (>92% purity)',
      'Traditional mercury fire-gilded 24K gold foil (>5 microns layer)',
      'Authentic cold lapis lazuli stone mineral pigment on hair',
      'Natural Himalayan turquoise bezel insets'
    ],
    dimensions: '18.5" H × 13.2" W × 9.5" D',
    weight: '9.85 kg',
    edition: 'Original Master Cast 1 of 1',
    provenanceLedger: [
      {
        id: 'prov-01',
        timestamp: '2026-06-12 11:20 NPT',
        stage: 'Creation',
        location: 'Shakya Heritage Foundry, Sundhara, Patan',
        actor: 'Master Rajendra Shakya',
        description: 'Wax model completed and poured in lost-wax foundry. Final hand chiseling, chasing, and fire-gilding completed after 14 weeks of dedicated craft.',
        signatureOrSeal: 'राजेन्द्र शाक्य (Master Shakya Seal)',
        hash: 'a9104c8e718b29f9c09d3e87612f345a'
      },
      {
        id: 'prov-02',
        timestamp: '2026-09-10 14:45 NPT',
        stage: 'Guild Certification',
        location: 'Federation of Handicraft Associations of Nepal (FHAN) Lab, Lalitpur',
        actor: 'Chief Inspector G.R. Bajracharya',
        description: 'Spectrometric analysis confirmed copper purity at 93.4% and gold coating purity of 99.9% (24K). Sacred iconometric proportions verified against traditional Shilpa Shastra manuscripts.',
        signatureOrSeal: 'FHAN Guild Assay Stamp #2026-0845',
        hash: 'b7832ef91081a29c3d4e5f6071829304'
      },
      {
        id: 'prov-03',
        timestamp: '2026-09-14 09:30 NPT',
        stage: 'Hub Quality Control',
        location: 'Shilpaya Heritage Central Vault, Kathmandu Hub',
        actor: 'Senior Curator Anjali Thapa',
        description: 'Inspected under high-intensity ultraviolet and macro light. Tamper-evident NFC cryptotag affixed to interior cavity along with blessed mantra scrolls.',
        signatureOrSeal: 'SHILPAYA Master Quality Control Seal #KAT-094',
        hash: 'c89145da78e23401fb981240cde78a21'
      },
      {
        id: 'prov-04',
        timestamp: '2026-09-15 16:00 NPT',
        stage: 'Vault Deposit',
        location: 'Climate-Controlled Secure Vault, Kathmandu',
        actor: 'Vault Custodian S. Pradhan',
        description: 'Placed in archival wooden crate lined with breathable Lokta and organic silk cushioning, awaiting private collector release.',
        signatureOrSeal: 'Vault Cryptographic Timestamp Token',
        hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
      }
    ]
  },
  'SHP-ART-2026-000912': {
    id: 'SHP-ART-2026-000912',
    artworkId: 'shp-002',
    artworkTitle: 'Heritage Newari Peacock Window (Mayur Jhyal)',
    artistName: 'Khem Raj Shilpakar',
    artistNepaliName: 'खेमराज शिल्पकार',
    craftLineage: '4th Generation Bhaktapur Wood Sculptor',
    workshopLocation: 'Tachapal Square, Bhaktapur (27.6728° N, 85.4332° E)',
    issueDate: '2026-08-28',
    cryptographicHash: '8f921da819c4021ef9a128bb49204891ac3710892a0149bb892147ef1a29381c',
    guildAssayStamp: 'BHAKTAPUR-WOODCRAFT-GUILD-CERT-#912',
    authenticitySealUrl: 'https://api.iconify.design/lucide:shield-check.svg',
    materialsVerified: [
      'Certified aged Shorea robusta (Sal timber)',
      'Natural cold-pressed mustard oil moisture repellent',
      'Organic beeswax surface finish',
      'No synthetic glues or metallic nails (pure mortise-tenon joinery)'
    ],
    dimensions: '34" H × 28" W × 4" D',
    weight: '14.2 kg',
    edition: 'Original Master Woodwork',
    provenanceLedger: [
      {
        id: 'prov-11',
        timestamp: '2026-08-20 16:00 NPT',
        stage: 'Creation',
        location: 'Tachapal Workshop, Bhaktapur',
        actor: 'Master Khem Raj Shilpakar',
        description: 'Chiseled with 18 distinct traditional gouges and cured in cold-pressed mustard oil. Verified 35 individual relief carvings.',
        signatureOrSeal: 'खेमराज शिल्पकार (Master Seal)',
        hash: '77a1029c48b812ef9012384a56c78d90'
      },
      {
        id: 'prov-12',
        timestamp: '2026-08-28 10:15 NPT',
        stage: 'Hub Quality Control',
        location: 'Shilpaya Heritage Central Vault, Kathmandu Hub',
        actor: 'Curator P. Dangol',
        description: 'Acoustic moisture test passed (<11.2% moisture content). Ready for international climate transit.',
        signatureOrSeal: 'SHILPAYA Master Quality Control Seal',
        hash: '8f921da819c4021ef9a128bb49204891ac3710892a0149bb892147ef1a29381c'
      }
    ]
  },
  'SHP-ART-2026-000780': {
    id: 'SHP-ART-2026-000780',
    artworkId: 'shp-003',
    artworkTitle: 'Sacred Mithila Kohbar of Cosmic Abundance',
    artistName: 'Sunita Devi Karn',
    artistNepaliName: 'सुनिता देवी कर्ण',
    craftLineage: '3rd Generation Matriarchal Lineage (Janakpur)',
    workshopLocation: 'Ramanand Chowk, Janakpurdham (26.7271° N, 85.9407° E)',
    issueDate: '2026-09-01',
    cryptographicHash: '439a8912ce0948ab12e9821034bcda8912ef093412ab345ef0192847cdae3412',
    guildAssayStamp: 'MITHILA-WOMEN-HERITAGE-ASSAY-#780',
    authenticitySealUrl: 'https://api.iconify.design/lucide:shield-check.svg',
    materialsVerified: [
      '100% handmade multi-ply Daphne bark Lokta paper',
      'Organic lampblack carbon black pigment',
      'Madder root vegetable indigo & marigold extract',
      'Pure acacia gum arabic natural binder'
    ],
    dimensions: '30" H × 42" W',
    weight: '0.45 kg',
    edition: 'Original Ceremonial Artwork',
    provenanceLedger: [
      {
        id: 'prov-21',
        timestamp: '2026-08-25 15:00 NPT',
        stage: 'Creation',
        location: 'Janakpurdham Atelier',
        actor: 'Artist Sunita Devi Karn',
        description: 'Completed freehand Kohbar diagram with bamboo nibs and natural vegetable dyes.',
        signatureOrSeal: 'सुनिता कर्ण (Artisan Thumb & Signature Stamp)',
        hash: '12e9821034bcda8912ef093412ab345e'
      },
      {
        id: 'prov-22',
        timestamp: '2026-09-01 12:30 NPT',
        stage: 'Guild Certification',
        location: 'Janakpur Cultural Preservation Council',
        actor: 'Director M. Jha',
        description: 'Certified 100% natural organic pigments and traditional Maithili iconographic motifs.',
        signatureOrSeal: 'Mithila Heritage Council Stamp',
        hash: '439a8912ce0948ab12e9821034bcda8912ef093412ab345ef0192847cdae3412'
      }
    ]
  }
};

export const INITIAL_COMMISSIONS: CommissionRequest[] = [
  {
    id: 'com-101',
    clientName: 'Julian Sterling (The Mandapam Gallery)',
    clientEmail: 'julian@sterlingfinearts.ch',
    clientLocation: 'Geneva, Switzerland',
    category: 'Metal Statues',
    description: 'Commission for a 24-inch fire-gilded Vajrasattva sculpture holding bell and vajra, with lapis lazuli inlays and intricate lotus throne.',
    requestedDimensions: '24" H × 16" W',
    budgetRangeUSD: '$4,500 – $6,000',
    deadlineDate: '2027-01-30',
    status: 'Quote Sent',
    quoteAmountUSD: 5200,
    quoteNotes: 'Requires 12 weeks of lost-wax casting and hand gilding. Will include custom wooden export crate with sacred consecration scroll cavity.',
    createdAt: '2026-09-28'
  },
  {
    id: 'com-102',
    clientName: 'Aria Henderson (Atelier Zen)',
    clientEmail: 'aria.design@atelierzen.com',
    clientLocation: 'San Francisco, USA',
    category: 'Thangka/Paubha',
    description: 'Custom Paubha of the Cosmic Mandala of Kalachakra using hand-ground mineral pigments on Lokta-backed cotton with 24K gold gilding.',
    requestedDimensions: '36" × 36" square',
    budgetRangeUSD: '$3,800 – $4,500',
    deadlineDate: '2026-12-15',
    status: 'Deposit Paid (50%)',
    quoteAmountUSD: 4200,
    quoteNotes: '50% deposit received ($2,100). Master Bikash Chitrakar is currently stretching cotton canvas and preparing mineral colors.',
    createdAt: '2026-09-15',
    depositPaidAt: '2026-09-18'
  },
  {
    id: 'com-103',
    clientName: 'Dr. Vivek Malhotra',
    clientEmail: 'malhotra.v@cambridgeheritage.org',
    clientLocation: 'London, United Kingdom',
    category: 'Wood Carving',
    description: 'Pair of carved temple guardian lion struts (Sardula) replicated from 17th-century Patan palace courtyard architecture in aged Sal wood.',
    requestedDimensions: '40" H × 12" W each',
    budgetRangeUSD: '$3,000 – $4,000',
    deadlineDate: '2027-03-01',
    status: 'Pending Review',
    createdAt: '2026-10-01'
  }
];

export const INITIAL_B2B_PROJECTS: B2BProject[] = [
  {
    id: 'b2b-01',
    organizationName: 'The Royal Annapurna Sanctuary Resort',
    contactPerson: 'Devendra Rana, Head of Cultural Interior Design',
    email: 'devendra.rana@annapurnaresorts.com',
    projectType: 'Luxury Hotel / Resort',
    scopeDescription: 'Procurement of 28 hand-carved Newari Sal-wood lattice windows, 4 bronze temple bell installations, and 60 framed original Mithila suite artworks for a new mountain eco-retreat.',
    estimatedUnits: 92,
    budgetUSD: 85000,
    currentMilestone: 3,
    milestones: [
      {
        stageNumber: 1,
        title: 'Master Artisan Guild Allocation & Wood Curing Verification',
        description: 'Allocated 6 master carvers in Bhaktapur and secured 40-year cured Sal timber. Passed acoustic moisture assays.',
        status: 'completed',
        paymentRequirement: 'Initial RFP Approval',
        completionDate: '2026-08-10'
      },
      {
        stageNumber: 2,
        title: '50% Production Deposit Escrow & Prototype Sign-off',
        description: 'Received $42,500 advance deposit into Shilpaya Artisan Escrow. Master sample window inspected and approved in Patan.',
        status: 'completed',
        paymentRequirement: '50% Milestone Billing Deposit ($42,500)',
        completionDate: '2026-08-24'
      },
      {
        stageNumber: 3,
        title: 'Workshop Creation & Mid-Stage Guild Review',
        description: 'Currently 75% complete across 3 artisan ateliers. Mid-point inspection scheduled at Tachapal Square workshop.',
        status: 'in_progress',
        paymentRequirement: 'In-progress milestone'
      },
      {
        stageNumber: 4,
        title: 'Kathmandu Hub QC & Physical Hologram Tamper Seals',
        description: 'Consolidation at central Shilpaya Kathmandu hub for spectrometer assay, laser engraving of IDs, and museum packaging.',
        status: 'pending',
        paymentRequirement: 'Post-QC Release Approval'
      },
      {
        stageNumber: 5,
        title: '50% Final Settlement & Insured White-Glove Dispatch',
        description: 'Final 50% invoice settlement ($42,500) upon issuance of air waybill and international transit insurance.',
        status: 'pending',
        paymentRequirement: 'Final 50% Dispatch Settlement ($42,500)'
      }
    ],
    depositPaid: true,
    finalPaid: false,
    submittedAt: '2026-07-28',
    status: 'Active Production'
  },
  {
    id: 'b2b-02',
    organizationName: 'Permanent Mission of Nepal to the United Nations',
    contactPerson: 'Ambassadorial Cultural Attaché',
    email: 'cultural.attache@nepalmission-ny.org',
    projectType: 'Embassy / Diplomatic Mission',
    scopeDescription: 'Monumental 6-foot lost-wax cast Pancha Buddha Torana and hand-illuminated Maha Karuna Paubha for the ceremonial reception hall in New York.',
    estimatedUnits: 2,
    budgetUSD: 46000,
    currentMilestone: 2,
    milestones: [
      {
        stageNumber: 1,
        title: 'Artisan Selection & Blueprint Finalization',
        description: 'Patan Shilpa Shastra committee approved 1:1 scale architectural drafting.',
        status: 'completed',
        paymentRequirement: 'RFP Agreement',
        completionDate: '2026-09-02'
      },
      {
        stageNumber: 2,
        title: '50% Advance Escrow Payment',
        description: 'Pending wire transfer authorization from Ministry finance office.',
        status: 'in_progress',
        paymentRequirement: '50% Upfront Advance ($23,000)'
      },
      {
        stageNumber: 3,
        title: 'Metal Pouring & Gold Gilding in Patan',
        description: 'Continuous 8-week foundry melt and mercury fire-gilding.',
        status: 'pending',
        paymentRequirement: 'In-progress stage'
      },
      {
        stageNumber: 4,
        title: 'Kathmandu Hub QC & Cryptographic Certification',
        description: 'Affixing diplomatic seal, assay analysis, and tamper-resistant digital certificate.',
        status: 'pending',
        paymentRequirement: 'Quality Clearance'
      },
      {
        stageNumber: 5,
        title: 'Diplomatic Air Cargo Dispatch',
        description: 'Insured air shipment with custom crating to JFK Airport, New York.',
        status: 'pending',
        paymentRequirement: 'Final 50% Balance ($23,000)'
      }
    ],
    depositPaid: false,
    finalPaid: false,
    submittedAt: '2026-08-29',
    status: 'In Review'
  }
];

export const INITIAL_STUDIO_FINANCIALS: StudioFinancials = {
  grossSalesUSD: 24650,
  platformFeeDeductionsUSD: 2958, // 12%
  pendingHoldsUSD: 3450,
  withdrawableBalanceUSD: 18242,
  currencyRateNPR: 135.0,
  recentPayouts: [
    {
      id: 'pay-801',
      date: '2026-09-22',
      amountUSD: 4500,
      channel: 'eSewa',
      status: 'Completed'
    },
    {
      id: 'pay-802',
      date: '2026-09-05',
      amountUSD: 6200,
      channel: 'SWIFT Bank Wire',
      status: 'Completed'
    }
  ]
};

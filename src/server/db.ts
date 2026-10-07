import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data directory for sqlite database
const dbDir = path.resolve(__dirname, '../../data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'shilpaya.sqlite');
export const db = new DatabaseSync(dbPath);

// Enable WAL mode for high performance
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

// Initialize database schema
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('collector', 'artisan', 'enterprise_buyer', 'admin')),
      avatar TEXT,
      artisanTitle TEXT,
      workshopName TEXT,
      location TEXT,
      coordinates TEXT,
      organizationName TEXT,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS artworks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      nepaliTitle TEXT NOT NULL,
      category TEXT NOT NULL,
      priceUSD INTEGER NOT NULL,
      priceNPR INTEGER NOT NULL,
      artistId TEXT NOT NULL,
      artistName TEXT NOT NULL,
      artistNepaliName TEXT NOT NULL,
      artistTitle TEXT NOT NULL,
      artistLocation TEXT NOT NULL,
      artistWorkshop TEXT NOT NULL,
      artistAvatar TEXT NOT NULL,
      images JSON NOT NULL,
      videoThumbnail TEXT,
      videoDuration TEXT,
      description TEXT NOT NULL,
      culturalStory TEXT NOT NULL,
      spiritualMeaning TEXT,
      materials TEXT NOT NULL,
      dimensions TEXT NOT NULL,
      weight TEXT NOT NULL,
      period TEXT NOT NULL,
      creationTime TEXT NOT NULL,
      technique TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('Available', 'Reserved', 'Sold', 'Packed', 'Shipped')),
      certificateId TEXT NOT NULL,
      featured INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS certificates (
      id TEXT PRIMARY KEY,
      artworkId TEXT NOT NULL,
      artworkTitle TEXT NOT NULL,
      artistName TEXT NOT NULL,
      artistNepaliName TEXT NOT NULL,
      craftLineage TEXT NOT NULL,
      workshopLocation TEXT NOT NULL,
      issueDate TEXT NOT NULL,
      cryptographicHash TEXT NOT NULL,
      guildAssayStamp TEXT NOT NULL,
      materialsVerified JSON NOT NULL,
      dimensions TEXT NOT NULL,
      weight TEXT NOT NULL,
      edition TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS provenance_events (
      id TEXT PRIMARY KEY,
      certificateId TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      stage TEXT NOT NULL,
      location TEXT NOT NULL,
      actor TEXT NOT NULL,
      description TEXT NOT NULL,
      signatureOrSeal TEXT NOT NULL,
      hash TEXT NOT NULL,
      FOREIGN KEY(certificateId) REFERENCES certificates(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS commissions (
      id TEXT PRIMARY KEY,
      clientName TEXT NOT NULL,
      clientEmail TEXT NOT NULL,
      clientLocation TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      requestedDimensions TEXT NOT NULL,
      budgetRangeUSD TEXT NOT NULL,
      deadlineDate TEXT NOT NULL,
      status TEXT NOT NULL,
      quoteAmountUSD INTEGER,
      quoteNotes TEXT,
      createdAt TEXT NOT NULL,
      depositPaidAt TEXT
    );

    CREATE TABLE IF NOT EXISTS b2b_projects (
      id TEXT PRIMARY KEY,
      organizationName TEXT NOT NULL,
      contactPerson TEXT NOT NULL,
      email TEXT NOT NULL,
      projectType TEXT NOT NULL,
      scopeDescription TEXT NOT NULL,
      estimatedUnits INTEGER NOT NULL,
      budgetUSD INTEGER NOT NULL,
      currentMilestone INTEGER NOT NULL,
      milestones JSON NOT NULL,
      depositPaid INTEGER NOT NULL DEFAULT 0,
      finalPaid INTEGER NOT NULL DEFAULT 0,
      submittedAt TEXT NOT NULL,
      status TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      userId TEXT,
      collectorName TEXT NOT NULL,
      collectorEmail TEXT NOT NULL,
      deliveryAddress TEXT NOT NULL,
      country TEXT NOT NULL,
      totalUSD INTEGER NOT NULL,
      items JSON NOT NULL,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS studio_financials (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      grossSalesUSD INTEGER NOT NULL,
      platformFeeDeductionsUSD INTEGER NOT NULL,
      pendingHoldsUSD INTEGER NOT NULL,
      withdrawableBalanceUSD INTEGER NOT NULL,
      currencyRateNPR REAL NOT NULL,
      recentPayouts JSON NOT NULL
    );
  `);

  // Seed default data if artworks table is empty
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM artworks');
  const result = countStmt.get() as { count: number };

  if (result.count === 0) {
    seedInitialData();
  }
}

function seedInitialData() {
  // Seed initial demo users
  const insertUser = db.prepare(`
    INSERT OR REPLACE INTO users (id, email, name, role, avatar, artisanTitle, workshopName, location, coordinates, organizationName, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertUser.run(
    'usr-collector-1',
    'alexander.vance@finearttrust.org',
    'Alexander Vance',
    'collector',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    null,
    null,
    'Geneva, Switzerland',
    null,
    'Himalayan Heritage Trust',
    '2026-08-01'
  );

  insertUser.run(
    'usr-artisan-1',
    'rajendra.shakya@craftnepal.org',
    'Rajendra Shakya',
    'artisan',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    'Master Lost-Wax Metal Caster',
    'Shakya Heritage Foundry',
    'Sundhara, Patan (Lalitpur)',
    '27.6698° N, 85.3216° E',
    null,
    '2026-07-15'
  );

  insertUser.run(
    'usr-b2b-1',
    'devendra.rana@annapurnaresorts.com',
    'Devendra Rana',
    'enterprise_buyer',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    null,
    null,
    'Pokhara / Kathmandu',
    null,
    'The Royal Annapurna Sanctuary Resort',
    '2026-08-10'
  );

  // Seed Artworks
  const insertArtwork = db.prepare(`
    INSERT INTO artworks (
      id, title, nepaliTitle, category, priceUSD, priceNPR,
      artistId, artistName, artistNepaliName, artistTitle, artistLocation, artistWorkshop, artistAvatar,
      images, videoThumbnail, videoDuration, description, culturalStory, spiritualMeaning,
      materials, dimensions, weight, period, creationTime, technique, status, certificateId, featured, createdAt
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
  `);

  insertArtwork.run(
    'shp-001',
    'Gilded Shakyamuni Buddha in Bhumisparsha Mudra',
    'भूमिस্পর্শ मुद्रामा शाक्यमुनि बुद्ध',
    'Metal Statues',
    3450,
    465000,
    'art-01',
    'Rajendra Shakya',
    'राजेन्द्र शाक्य',
    'Master Lost-Wax Metal Caster',
    'Sundhara, Patan (Lalitpur)',
    'Shakya Heritage Foundry',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    JSON.stringify([
      '/src/assets/images/product_lost_wax_buddha_bronze_1791009616481.jpg',
      'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1200&q=80'
    ]),
    '/src/assets/images/product_lost_wax_buddha_bronze_1791009616481.jpg',
    '1:45 min',
    'An extraordinary museum-quality sculpture of Shakyamuni Buddha seated in the earth-touching posture (Bhumisparsha Mudra), calling the earth to witness his enlightenment under the Bodhi tree. Cast through the lost-wax technique in heavy copper alloy and meticulously hand-gilded with 24-karat gold paste.',
    'The Shakya artisans of Patan have preserved the lost-wax casting technique since the Lichhavi period (5th–8th century CE). The face is delicately painted with cold gold and pure mineral lapis lazuli for the hair buns, according to the ancient sacred canonical guidelines.',
    'Symbolizes unshakable resolve, the dispelling of illusions, and the attainment of absolute supreme wakefulness.',
    'Lost-wax hand-cast red copper, pure 24K mercury fire-gilding, cold gold face painting, crushed lapis lazuli paste, turquoise inlays',
    '18.5" H × 13.2" W × 9.5" D (47 cm × 33.5 cm × 24 cm)',
    '9.85 kg (21.7 lbs)',
    'Contemporary Masterwork (2026)',
    '14 Weeks of Continuous Artisan Labor',
    'Cire-Perdue (Lost Wax) + Hand Repoussé & Chasing',
    'Available',
    'SHP-ART-2026-000845',
    1,
    '2026-09-14'
  );

  insertArtwork.run(
    'shp-002',
    'Heritage Newari Peacock Window (Mayur Jhyal)',
    'परम्परागत नेवारी मयूर झ्याल',
    'Wood Carving',
    2850,
    384000,
    'art-03',
    'Khem Raj Shilpakar',
    'खेमराज शिल्पकार',
    'Master Architectural Sal-Wood Carver',
    'Tachapal Square, Bhaktapur',
    'Dattatreya Woodcraft Guild',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    JSON.stringify([
      '/src/assets/images/product_wood_carved_peacock_window_1791009627927.jpg',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80'
    ]),
    '/src/assets/images/product_wood_carved_peacock_window_1791009627927.jpg',
    '2:10 min',
    'A masterpiece of classic Newari architecture, this Mayur Jhyal (Peacock Window) features a fan-tailed peacock surrounded by 35 miniature mythical beings, Garudas, makaras, and floral arabesques, hand-chiseled from cured mountain Sal wood.',
    'Originating from the 15th-century Malla palaces of Bhaktapur, the peacock is revered as the mount of God Kartikeya and a symbol of immortality, beauty, and the transmutation of worldly poison into vibrant feathers.',
    'Acts as a celestial guardian at architectural portals, filtering sunlight into geometric mandala reflections.',
    'Aged Himalayan Sal wood (Shorea robusta), cold-pressed mustard oil curing, natural beeswax polish',
    '34" H × 28" W × 4" D (86 cm × 71 cm × 10 cm)',
    '14.2 kg (31.3 lbs)',
    'Contemporary Architectural Heritage (2026)',
    '9 Weeks of Chisel Work',
    'Tenon & Mortise Joinery, Deep Relief Chisel Carving',
    'Available',
    'SHP-ART-2026-000912',
    1,
    '2026-08-28'
  );

  insertArtwork.run(
    'shp-003',
    'Sacred Mithila Kohbar of Cosmic Abundance',
    'पवित्र मिथिला कोहबर चित्र',
    'Mithila Art',
    1250,
    168000,
    'art-04',
    'Sunita Devi Karn',
    'सुनिता देवी कर्ण',
    'Senior Mithila Folk Artist',
    'Ramanand Chowk, Janakpur',
    'Janakpurdham Women Artisan Atelier',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    JSON.stringify([
      '/src/assets/images/product_mithila_kohbar_painting_1791009641057.jpg',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80'
    ]),
    '/src/assets/images/product_mithila_kohbar_painting_1791009641057.jpg',
    '1:15 min',
    'An authentic ceremonial Kohbar painting celebrating the union of masculine and feminine cosmic energies, framed with sacred lotus stalks (Purain), bamboo groves of continuity, and celestial peacocks.',
    'In the ancient kingdom of Mithila, this sacred composition was painted exclusively by women on wedding room alcoves to invoke fertility and harmony. Painted using bamboo sticks and cotton swabs with natural organic pigments.',
    'Invokes cosmic fertility, family lineage longevity, and alignment between terrestrial life and solar-lunar cycles.',
    'Natural soot lampblack, madder root red, indigo dye, turmeric yellow, acacia resin binder on quadruple-ply handmade Lokta paper',
    '30" H × 42" W (76 cm × 106 cm)',
    '0.45 kg (frameless archival roll)',
    '2026 Ceremonial Series',
    '3 Weeks of Natural Pigment Grinding & Painting',
    'Bamboo-nib freehand Maithili calligraphy & brushwork',
    'Available',
    'SHP-ART-2026-000780',
    1,
    '2026-09-01'
  );

  insertArtwork.run(
    'shp-004',
    'White Tara of Longevity (Sitatara) Gold Paubha',
    'दीर्घायुकी सेतो तारा (सितातारा) पौभा',
    'Thangka/Paubha',
    4100,
    553500,
    'art-02',
    'Bikash Chitrakar',
    'बिकश चित्रकार',
    'Master Paubha & Thangka Painter',
    'Nagbahal, Patan',
    'Patan Mandala Hermitage',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    JSON.stringify([
      '/src/assets/images/hero_shilpaya_himalayan_art_1791009653607.jpg',
      'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80'
    ]),
    null,
    null,
    'A museum-grade classical Newar Paubha of White Tara possessing seven eyes of transcendent compassion. Illuminated with pure 24K powdered gold shading and ground lapis, cinnabar, and orpiment.',
    'Unlike modern quick-print scrolls, this Paubha is rendered onto organic hand-stretched cotton prepared with mountain gypsum and buffalo skin glue. The artist executed the consecration ritual (Drishti-dana) to open the eyes upon completion.',
    'Bestows health, dispels untimely obstacles, and nurtures maternal wisdom across all beings.',
    'Hand-ground malachite, lapis lazuli, cinnabar, orpiment, real 24-karat gold leaf wash, prepared Nepalese cotton canvas',
    '26" H × 20" W (66 cm × 51 cm)',
    '0.8 kg',
    '2026 Mandala Cycle',
    '16 Weeks of Microscopic Brushwork',
    'Traditional Newari Paubha burnished dry-gold shading',
    'Reserved',
    'SHP-ART-2026-000621',
    1,
    '2026-09-10'
  );

  // Seed Certificates & Provenance
  const insertCert = db.prepare(`
    INSERT INTO certificates (
      id, artworkId, artworkTitle, artistName, artistNepaliName, craftLineage, workshopLocation,
      issueDate, cryptographicHash, guildAssayStamp, materialsVerified, dimensions, weight, edition
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertProv = db.prepare(`
    INSERT INTO provenance_events (
      id, certificateId, timestamp, stage, location, actor, description, signatureOrSeal, hash
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertCert.run(
    'SHP-ART-2026-000845',
    'shp-001',
    'Gilded Shakyamuni Buddha in Bhumisparsha Mudra',
    'Rajendra Shakya',
    'राजेन्द्र शाक्य',
    '7th Generation Newar Guild Metallurgical Caste (Patan)',
    'Sundhara Heritage Atelier, Lalitpur, Nepal',
    '2026-09-14',
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    'PATAN-METALS-GUILD-ASSAY-#845-VERIFIED-24K-GILT',
    JSON.stringify([
      'High-grade virgin red copper alloy (>92% purity)',
      'Traditional mercury fire-gilded 24K gold foil (>5 microns layer)',
      'Authentic cold lapis lazuli stone mineral pigment on hair',
      'Natural Himalayan turquoise bezel insets'
    ]),
    '18.5" H × 13.2" W × 9.5" D',
    '9.85 kg',
    'Original Master Cast 1 of 1'
  );

  insertProv.run(
    'prov-01',
    'SHP-ART-2026-000845',
    '2026-06-12 11:20 NPT',
    'Creation',
    'Shakya Heritage Foundry, Sundhara, Patan',
    'Master Rajendra Shakya',
    'Wax model completed and poured in lost-wax foundry. Final hand chiseling, chasing, and fire-gilding completed after 14 weeks of dedicated craft.',
    'राजेन्द्र शाक्य (Master Shakya Seal)',
    'a9104c8e718b29f9c09d3e87612f345a'
  );

  insertProv.run(
    'prov-02',
    'SHP-ART-2026-000845',
    '2026-09-10 14:45 NPT',
    'Guild Certification',
    'Federation of Handicraft Associations of Nepal (FHAN) Lab, Lalitpur',
    'Chief Inspector G.R. Bajracharya',
    'Spectrometric analysis confirmed copper purity at 93.4% and gold coating purity of 99.9% (24K). Sacred iconometric proportions verified against traditional Shilpa Shastra manuscripts.',
    'FHAN Guild Assay Stamp #2026-0845',
    'b7832ef91081a29c3d4e5f6071829304'
  );

  insertProv.run(
    'prov-03',
    'SHP-ART-2026-000845',
    '2026-09-14 09:30 NPT',
    'Hub Quality Control',
    'Shilpaya Heritage Central Vault, Kathmandu Hub',
    'Senior Curator Anjali Thapa',
    'Inspected under high-intensity ultraviolet and macro light. Tamper-evident NFC cryptotag affixed to interior cavity along with blessed mantra scrolls.',
    'SHILPAYA Master Quality Control Seal #KAT-094',
    'c89145da78e23401fb981240cde78a21'
  );

  // Seed initial order / owned piece for pre-seeded collector
  const insertOrder = db.prepare(`
    INSERT INTO orders (id, userId, collectorName, collectorEmail, deliveryAddress, country, totalUSD, items, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertOrder.run(
    'ORD-SHP-2026-9041',
    'usr-collector-1',
    'Alexander Vance',
    'alexander.vance@finearttrust.org',
    '742 Evergreen Terrace, Suite 400',
    'Switzerland',
    2850,
    JSON.stringify([
      {
        artworkId: 'shp-002',
        title: 'Heritage Newari Peacock Window (Mayur Jhyal)',
        category: 'Wood Carving',
        priceUSD: 2850,
        certificateId: 'SHP-ART-2026-000912'
      }
    ]),
    '2026-09-02'
  );

  // Seed B2B Projects
  const insertB2B = db.prepare(`
    INSERT INTO b2b_projects (
      id, organizationName, contactPerson, email, projectType, scopeDescription, estimatedUnits, budgetUSD, currentMilestone, milestones, depositPaid, finalPaid, submittedAt, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertB2B.run(
    'b2b-01',
    'The Royal Annapurna Sanctuary Resort',
    'Devendra Rana, Head of Cultural Interior Design',
    'devendra.rana@annapurnaresorts.com',
    'Luxury Hotel / Resort',
    'Procurement of 28 hand-carved Newari Sal-wood lattice windows, 4 bronze temple bell installations, and 60 framed original Mithila suite artworks for a new mountain eco-retreat.',
    92,
    85000,
    3,
    JSON.stringify([
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
    ]),
    1,
    0,
    '2026-07-28',
    'Active Production'
  );

  // Seed Financials
  const insertFin = db.prepare(`
    INSERT INTO studio_financials (id, grossSalesUSD, platformFeeDeductionsUSD, pendingHoldsUSD, withdrawableBalanceUSD, currencyRateNPR, recentPayouts)
    VALUES (1, ?, ?, ?, ?, ?, ?)
  `);

  insertFin.run(
    24650,
    2958,
    3450,
    18242,
    135.0,
    JSON.stringify([
      { id: 'pay-801', date: '2026-09-22', amountUSD: 4500, channel: 'eSewa', status: 'Completed' },
      { id: 'pay-802', date: '2026-09-05', amountUSD: 6200, channel: 'SWIFT Bank Wire', status: 'Completed' }
    ])
  );
}

import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { spawn, ChildProcess } from 'child_process';
import { db, initDatabase } from './src/server/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize SQLite database schema and seed data
initDatabase();

const app = express();
app.use(express.json({ limit: '10mb' }));

// -------------------------------------------------------------
// 1. HEALTH CHECK
// -------------------------------------------------------------
app.get('/api/health', (req: Request, res: Response) => {
  try {
    const artCount = (db.prepare('SELECT COUNT(*) as count FROM artworks').get() as any)?.count || 0;
    const userCount = (db.prepare('SELECT COUNT(*) as count FROM users').get() as any)?.count || 0;
    const orderCount = (db.prepare('SELECT COUNT(*) as count FROM orders').get() as any)?.count || 0;

    res.json({
      status: 'healthy',
      framework: 'Express + FastAPI Python Ready',
      database: 'SQLite WAL Mode',
      metrics: {
        catalogedArtworks: artCount,
        registeredUsers: userCount,
        recordedOrders: orderCount
      },
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 2. AUTH & ONBOARDING / USERS API
// -------------------------------------------------------------
app.get('/api/users', (req: Request, res: Response) => {
  try {
    const users = db.prepare('SELECT * FROM users ORDER BY createdAt DESC').all();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users/:id', (req: Request, res: Response) => {
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ? OR email = ?').get(req.params.id, req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { 
      name, 
      email, 
      role, 
      artisanTitle, 
      workshopName, 
      location, 
      coordinates, 
      organizationName,
      avatar 
    } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ error: 'Name, email, and role are required' });
    }

    const userId = `usr-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString().split('T')[0];

    const stmt = db.prepare(`
      INSERT INTO users (id, email, name, role, avatar, artisanTitle, workshopName, location, coordinates, organizationName, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      userId,
      email,
      name,
      role,
      avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      artisanTitle || null,
      workshopName || null,
      location || 'Kathmandu, Nepal',
      coordinates || null,
      organizationName || null,
      now
    );

    const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    res.status(201).json(newUser);
  } catch (err: any) {
    if (err.message.includes('UNIQUE constraint failed')) {
      const existing = db.prepare('SELECT * FROM users WHERE email = ?').get(req.body.email);
      return res.json(existing);
    }
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found. Please complete onboarding.' });
    }

    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/users/:id/profile', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const existing = db.prepare('SELECT * FROM users WHERE id = ? OR email = ?').get(id, id) as any;
    if (!existing) return res.status(404).json({ error: 'User not found' });

    db.prepare(`
      UPDATE users
      SET name = COALESCE(?, name),
          avatar = COALESCE(?, avatar),
          location = COALESCE(?, location),
          organizationName = COALESCE(?, organizationName),
          artisanTitle = COALESCE(?, artisanTitle),
          workshopName = COALESCE(?, workshopName)
      WHERE id = ?
    `).run(
      body.name || null,
      body.avatar || null,
      body.location || null,
      body.organizationName || null,
      body.artisanTitle || null,
      body.workshopName || null,
      existing.id
    );

    const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(existing.id);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 3. ARTWORKS API
// -------------------------------------------------------------
app.get('/api/artworks', (req: Request, res: Response) => {
  try {
    const { category, status, search } = req.query;
    let query = 'SELECT * FROM artworks WHERE 1=1';
    const params: any[] = [];

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (status && status !== 'All') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (title LIKE ? OR nepaliTitle LIKE ? OR artistName LIKE ? OR description LIKE ? OR materials LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s, s);
    }

    query += ' ORDER BY featured DESC, createdAt DESC';

    const rows = db.prepare(query).all(...params) as any[];
    const artworks = rows.map(r => ({
      ...r,
      images: JSON.parse(r.images || '[]'),
      featured: Boolean(r.featured),
      artist: {
        id: r.artistId,
        name: r.artistName,
        nepaliName: r.artistNepaliName,
        title: r.artistTitle,
        location: r.artistLocation,
        workshopName: r.artistWorkshop,
        avatarUrl: r.artistAvatar
      },
      specifications: {
        materials: r.materials,
        dimensions: r.dimensions,
        weight: r.weight,
        period: r.period,
        creationTime: r.creationTime,
        technique: r.technique
      }
    }));

    res.json(artworks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/artworks/:id', (req: Request, res: Response) => {
  try {
    const r = db.prepare('SELECT * FROM artworks WHERE id = ?').get(req.params.id) as any;
    if (!r) return res.status(404).json({ error: 'Artwork not found' });

    res.json({
      ...r,
      images: JSON.parse(r.images || '[]'),
      featured: Boolean(r.featured),
      artist: {
        id: r.artistId,
        name: r.artistName,
        nepaliName: r.artistNepaliName,
        title: r.artistTitle,
        location: r.artistLocation,
        workshopName: r.artistWorkshop,
        avatarUrl: r.artistAvatar
      },
      specifications: {
        materials: r.materials,
        dimensions: r.dimensions,
        weight: r.weight,
        period: r.period,
        creationTime: r.creationTime,
        technique: r.technique
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/artworks', (req: Request, res: Response) => {
  try {
    const art = req.body;
    const newId = `shp-${Date.now().toString().slice(-4)}`;
    const randomCertNum = Math.floor(100000 + Math.random() * 900000);
    const certId = `SHP-ART-2026-${randomCertNum}`;
    const now = new Date().toISOString().split('T')[0];

    const cryptoHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    const materialsArray = (art.materials || 'Copper alloy, gold foil')
      .split(',')
      .map((m: string) => m.trim())
      .filter(Boolean);

    const materialsVerified = materialsArray.map((m: string) => ({
      material: m,
      purityStandard: 'Certified Guild Grade A',
      testedBy: 'Kathmandu Valley Craft Assay Laboratory'
    }));

    // Insert Certificate
    db.prepare(`
      INSERT INTO certificates (
        id, artworkId, artworkTitle, artistName, artistNepaliName, craftLineage,
        workshopLocation, issueDate, cryptographicHash, guildAssayStamp,
        materialsVerified, dimensions, weight, edition
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      certId,
      newId,
      art.title,
      art.artistName || 'Master Rajendra Shakya',
      art.artistNepaliName || 'राजेन्द्र शाक्य',
      'Shakya Lineage 7th Gen (Patan)',
      art.artistLocation || 'Patan, Lalitpur, Nepal',
      now,
      cryptoHash,
      `KTM-GUILD-SEAL-2026-${Math.floor(100 + Math.random() * 900)}`,
      JSON.stringify(materialsVerified),
      art.dimensions || '16" H × 12" W',
      art.weight || '5.5 kg',
      'Original 1 of 1 Masterpiece'
    );

    // Insert Provenance Initial Event
    db.prepare(`
      INSERT INTO provenance_events (
        id, certificateId, timestamp, stage, location, actor, description, signatureOrSeal, hash
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      `prov-init-${newId}`,
      certId,
      `${now} 10:00 NPT`,
      'Masterpiece Inception',
      art.artistLocation || 'Patan Workshop, Lalitpur',
      art.artistName || 'Master Rajendra Shakya',
      `Crafted and hallmarked using heritage techniques. Documented and cataloged on Shilpaya Protocol.`,
      'Guild Assay Hologram & Master Signature',
      Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    );

    // Insert Artwork
    db.prepare(`
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
    `).run(
      newId,
      art.title,
      art.nepaliTitle || art.title,
      art.category || 'Metal Statues',
      art.priceUSD || 2000,
      Math.round((art.priceUSD || 2000) * 135),
      art.artistId || 'art-01',
      art.artistName || 'Master Rajendra Shakya',
      art.artistNepaliName || 'राजेन्द्र शाक्य',
      art.artistTitle || 'Master Artisan',
      art.artistLocation || 'Patan, Nepal',
      art.artistWorkshop || 'Patan Foundry',
      art.artistAvatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
      JSON.stringify(art.images || [art.imageUrl || '/src/assets/images/product_lost_wax_buddha_bronze_1791009616481.jpg']),
      art.videoThumbnail || null,
      art.videoDuration || null,
      art.description || 'Traditional masterwork.',
      art.culturalStory || 'Sacred heritage piece from Kathmandu Valley.',
      art.spiritualMeaning || null,
      art.materials || 'Copper alloy, gold foil',
      art.dimensions || '16" H × 12" W',
      art.weight || '5.5 kg',
      'Contemporary Masterwork (2026)',
      art.creationTime || '8 Weeks',
      art.technique || 'Traditional Craft',
      'Available',
      certId,
      0,
      now
    );

    res.status(201).json({ id: newId, certificateId: certId, status: 'Available' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/artworks/:id/status', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    db.prepare('UPDATE artworks SET status = ? WHERE id = ?').run(status, id);
    res.json({ success: true, id, status });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 4. CERTIFICATES & PROVENANCE API
// -------------------------------------------------------------
app.get('/api/certificates/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cert = db.prepare('SELECT * FROM certificates WHERE id = ? OR cryptographicHash = ?').get(id, id) as any;

    if (!cert) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    const events = db.prepare('SELECT * FROM provenance_events WHERE certificateId = ? ORDER BY timestamp ASC').all(cert.id);

    res.json({
      ...cert,
      materialsVerified: JSON.parse(cert.materialsVerified || '[]'),
      provenanceLedger: events
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/certificates/verify/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cert = db.prepare('SELECT * FROM certificates WHERE id = ? OR cryptographicHash = ?').get(id, id) as any;

    if (!cert) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    const events = db.prepare('SELECT * FROM provenance_events WHERE certificateId = ? ORDER BY timestamp ASC').all(cert.id);

    res.json({
      ...cert,
      materialsVerified: JSON.parse(cert.materialsVerified || '[]'),
      provenanceLedger: events
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 5. ORDERS & CHECKOUT API
// -------------------------------------------------------------
app.get('/api/orders/my-collection', (req: Request, res: Response) => {
  try {
    const orders = db.prepare('SELECT * FROM orders ORDER BY createdAt DESC').all() as any[];
    const collection: any[] = [];

    for (const order of orders) {
      const items = JSON.parse(order.items || '[]');
      for (const item of items) {
        const art = db.prepare('SELECT * FROM artworks WHERE id = ?').get(item.artworkId) as any;
        const cert = db.prepare('SELECT * FROM certificates WHERE id = ?').get(item.certificateId) as any;
        const events = cert ? db.prepare('SELECT * FROM provenance_events WHERE certificateId = ? ORDER BY timestamp ASC').all(cert.id) : [];

        if (art && cert) {
          collection.push({
            orderId: order.id,
            purchaseDate: order.createdAt,
            acquisitionPriceUSD: item.priceUSD || art.priceUSD,
            artwork: {
              ...art,
              images: JSON.parse(art.images || '[]'),
              artist: {
                name: art.artistName,
                nepaliName: art.artistNepaliName,
                location: art.artistLocation,
                workshopName: art.artistWorkshop
              }
            },
            certificate: {
              ...cert,
              materialsVerified: JSON.parse(cert.materialsVerified || '[]'),
              provenanceLedger: events
            }
          });
        }
      }
    }

    res.json(collection);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders', (req: Request, res: Response) => {
  try {
    const { collectorName, collectorEmail, deliveryAddress, country, items } = req.body;
    const orderId = `ORD-SHP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString().split('T')[0];

    const totalUSD = (items || []).reduce((acc: number, it: any) => acc + (it.priceUSD || 0), 0);

    db.prepare(`
      INSERT INTO orders (id, collectorName, collectorEmail, deliveryAddress, country, totalUSD, items, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      orderId,
      collectorName,
      collectorEmail,
      deliveryAddress,
      country,
      totalUSD,
      JSON.stringify(items || []),
      now
    );

    // Update artworks to Sold & append Provenance Event
    for (const it of (items || [])) {
      db.prepare('UPDATE artworks SET status = ? WHERE id = ?').run('Sold', it.artworkId);

      db.prepare(`
        INSERT INTO provenance_events (id, certificateId, timestamp, stage, location, actor, description, signatureOrSeal, hash)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        `prov-acq-${Date.now()}-${it.artworkId}`,
        it.certificateId,
        `${new Date().toISOString().replace('T', ' ').slice(0, 16)} NPT`,
        'Collector Acquisition',
        `${deliveryAddress}, ${country}`,
        `Collector: ${collectorName}`,
        `Official title custody transferred via Shilpaya Protocol under Order #${orderId}.`,
        'SHILPAYA Master Provenance Seal',
        Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
      );
    }

    // Update financials: 12% platform fee, 88% net to artists
    const platformFee = Math.round(totalUSD * 0.12);
    const netToArtists = totalUSD - platformFee;

    db.prepare(`
      UPDATE studio_financials
      SET grossSalesUSD = grossSalesUSD + ?,
          platformFeeDeductionsUSD = platformFeeDeductionsUSD + ?,
          withdrawableBalanceUSD = withdrawableBalanceUSD + ?
      WHERE id = 1
    `).run(totalUSD, platformFee, netToArtists);

    res.status(201).json({ orderId, totalUSD });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 6. COMMISSIONS API
// -------------------------------------------------------------
app.get('/api/commissions', (req: Request, res: Response) => {
  try {
    const list = db.prepare('SELECT * FROM commissions ORDER BY createdAt DESC').all();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/commissions', (req: Request, res: Response) => {
  try {
    const c = req.body;
    const id = `com-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString().split('T')[0];

    db.prepare(`
      INSERT INTO commissions (
        id, clientName, clientEmail, clientLocation, category, description,
        requestedDimensions, budgetRangeUSD, deadlineDate, status, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      c.clientName,
      c.clientEmail,
      c.clientLocation,
      c.category,
      c.description,
      c.requestedDimensions,
      c.budgetRangeUSD,
      c.deadlineDate,
      'Pending Review',
      now
    );

    res.status(201).json({ id, status: 'Pending Review' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/commissions/:id/quote', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { quoteAmountUSD, quoteNotes } = req.body;

    db.prepare(`
      UPDATE commissions
      SET quoteAmountUSD = ?, quoteNotes = ?, status = 'Quote Sent'
      WHERE id = ?
    `).run(quoteAmountUSD, quoteNotes || '', id);

    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/commissions/:id/deposit', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const now = new Date().toISOString().split('T')[0];

    const com = db.prepare('SELECT * FROM commissions WHERE id = ?').get(id) as any;
    const deposit = com?.quoteAmountUSD ? Math.round(com.quoteAmountUSD * 0.5) : 1500;

    db.prepare(`
      UPDATE commissions
      SET status = 'Deposit Paid (50%)', depositPaidAt = ?
      WHERE id = ?
    `).run(now, id);

    db.prepare(`
      UPDATE studio_financials
      SET pendingHoldsUSD = pendingHoldsUSD + ?
      WHERE id = 1
    `).run(deposit);

    res.json({ success: true, id, deposit });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 7. B2B ENTERPRISE API
// -------------------------------------------------------------
app.get('/api/b2b', (req: Request, res: Response) => {
  try {
    const rows = db.prepare('SELECT * FROM b2b_projects ORDER BY submittedAt DESC').all() as any[];
    const projects = rows.map(r => ({
      ...r,
      milestones: JSON.parse(r.milestones || '[]'),
      depositPaid: Boolean(r.depositPaid),
      finalPaid: Boolean(r.finalPaid)
    }));
    res.json(projects);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/b2b', (req: Request, res: Response) => {
  try {
    const b = req.body;
    const count = (db.prepare('SELECT COUNT(*) as count FROM b2b_projects').get() as any).count;
    const id = `b2b-0${count + 1}`;
    const now = new Date().toISOString().split('T')[0];

    const budget = b.budgetUSD || 50000;
    const milestones = [
      {
        stageNumber: 1,
        title: 'Master Artisan Guild Allocation & Architectural Review',
        description: 'Assigning designated master sculptors and woodworkers in Patan and Bhaktapur.',
        status: 'in_progress',
        paymentRequirement: 'Initial RFP Sign-off'
      },
      {
        stageNumber: 2,
        title: '50% Production Deposit Escrow & Prototype Sign-off',
        description: `50% deposit ($${(budget * 0.5).toLocaleString()}) to secure cured Sal wood and virgin copper ingots.`,
        status: 'pending',
        paymentRequirement: `50% Deposit ($${(budget * 0.5).toLocaleString()})`
      },
      {
        stageNumber: 3,
        title: 'Workshop Creation & Mid-Stage Guild Review',
        description: 'Bi-weekly photo/video craft audits in Patan/Bhaktapur ateliers.',
        status: 'pending',
        paymentRequirement: 'Stage Audit'
      },
      {
        stageNumber: 4,
        title: 'Kathmandu Hub QC & Physical Hologram Tamper Seals',
        description: 'Spectrometric purity check, wood moisture assays, laser serialization, and museum crating.',
        status: 'pending',
        paymentRequirement: 'Quality Clearance Sign-off'
      },
      {
        stageNumber: 5,
        title: '50% Final Settlement & Insured White-Glove Dispatch',
        description: `Final 50% balance ($${(budget * 0.5).toLocaleString()}) settled prior to insured air freight.`,
        status: 'pending',
        paymentRequirement: `Final Settlement ($${(budget * 0.5).toLocaleString()})`
      }
    ];

    db.prepare(`
      INSERT INTO b2b_projects (
        id, organizationName, contactPerson, email, projectType, scopeDescription,
        estimatedUnits, budgetUSD, currentMilestone, milestones, depositPaid, finalPaid, submittedAt, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      b.organizationName,
      b.contactPerson,
      b.email,
      b.projectType || 'Luxury Hotel / Resort',
      b.scopeDescription,
      b.estimatedUnits || 20,
      budget,
      1,
      JSON.stringify(milestones),
      0,
      0,
      now,
      'In Review'
    );

    res.status(201).json({ id, status: 'In Review' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/b2b/:id/milestone', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const proj = db.prepare('SELECT * FROM b2b_projects WHERE id = ?').get(id) as any;
    if (!proj) return res.status(404).json({ error: 'Project not found' });

    const currentM = proj.currentMilestone;
    const nextM = Math.min(5, currentM + 1);
    const milestones = JSON.parse(proj.milestones || '[]');

    const updatedMilestones = milestones.map((m: any) => {
      if (m.stageNumber < nextM) {
        return { ...m, status: 'completed', completionDate: new Date().toISOString().split('T')[0] };
      }
      if (m.stageNumber === nextM) {
        return { ...m, status: 'in_progress' };
      }
      return { ...m, status: 'pending' };
    });

    let status = proj.status;
    if (nextM === 2) status = 'In Review';
    if (nextM === 3) status = 'Active Production';
    if (nextM === 4) status = 'Kathmandu QC Hub';
    if (nextM === 5) status = 'Dispatched';

    db.prepare(`
      UPDATE b2b_projects
      SET currentMilestone = ?, milestones = ?, status = ?, depositPaid = ?, finalPaid = ?
      WHERE id = ?
    `).run(
      nextM,
      JSON.stringify(updatedMilestones),
      status,
      nextM >= 3 ? 1 : 0,
      nextM === 5 ? 1 : 0,
      id
    );

    res.json({ success: true, nextMilestone: nextM, status });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 8. FINANCIALS API
// -------------------------------------------------------------
app.get('/api/financials', (req: Request, res: Response) => {
  try {
    const row = db.prepare('SELECT * FROM studio_financials WHERE id = 1').get() as any;
    res.json({
      ...row,
      recentPayouts: JSON.parse(row.recentPayouts || '[]')
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/financials/payout', (req: Request, res: Response) => {
  try {
    const { amountUSD, channel } = req.body;
    const row = db.prepare('SELECT * FROM studio_financials WHERE id = 1').get() as any;

    if (amountUSD > row.withdrawableBalanceUSD) {
      return res.status(400).json({ error: 'Requested amount exceeds withdrawable balance' });
    }

    const currentPayouts = JSON.parse(row.recentPayouts || '[]');
    const newPayout = {
      id: `pay-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0],
      amountUSD,
      channel,
      status: 'Completed'
    };

    const updatedPayouts = [newPayout, ...currentPayouts];

    db.prepare(`
      UPDATE studio_financials
      SET withdrawableBalanceUSD = withdrawableBalanceUSD - ?,
          recentPayouts = ?
      WHERE id = 1
    `).run(amountUSD, JSON.stringify(updatedPayouts));

    res.json({ success: true, payout: newPayout });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Optional proxy to FastAPI if running on port 5050 (e.g. for /docs or python backend)
app.use(['/docs', '/openapi.json', '/redoc'], (req: Request, res: Response) => {
  const options: http.RequestOptions = {
    hostname: '127.0.0.1',
    port: 5050,
    path: req.originalUrl,
    method: req.method,
    headers: { ...req.headers, host: '127.0.0.1:5050' }
  };
  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
    proxyRes.pipe(res);
  });
  proxyReq.on('error', () => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head><title>FastAPI Documentation</title></head>
        <body style="font-family: sans-serif; padding: 2rem; background: #FAF8F5;">
          <h2>SHILPAYA Master Cultural Archive API</h2>
          <p>Python FastAPI backend service with SQLite WAL mode persistence.</p>
          <p>To run standalone FastAPI: <code>python3 -m uvicorn backend.main:app --port 5050</code></p>
        </body>
      </html>
    `);
  });
  proxyReq.end();
});

// Background helper to start FastAPI on safe internal port 5050
let fastApiProcess: ChildProcess | null = null;
function tryStartFastApi() {
  try {
    fastApiProcess = spawn('python3', ['-m', 'uvicorn', 'backend.main:app', '--host', '127.0.0.1', '--port', '5050'], {
      stdio: 'ignore'
    });
    fastApiProcess.on('error', () => {
      // Non-fatal if python uvicorn is not running
    });
  } catch (e) {
    // Non-fatal
  }
}

// -------------------------------------------------------------
// 9. VITE MIDDLEWARE & HTTP SERVER
// -------------------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  
  // Always use port 3000 as required by AI Studio environment constraints
  const portArgIndex = process.argv.indexOf('--port');
  const port = portArgIndex !== -1 ? Number(process.argv[portArgIndex + 1]) : 3000;
  
  const hostArgIndex = process.argv.indexOf('--host');
  const host = hostArgIndex !== -1 ? process.argv[hostArgIndex + 1] : '0.0.0.0';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Open port 3000 immediately without any blocking
  const server = app.listen(port, host, () => {
    console.log(`[SHILPAYA] Server active on http://${host}:${port} (${isProd ? 'production' : 'development'})`);
  });

  server.on('error', (err: any) => {
    console.error('[SHILPAYA Server Error]:', err);
  });

  const cleanup = () => {
    server.close();
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
}

startServer();

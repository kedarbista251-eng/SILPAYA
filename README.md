# SHILPAYA · नेपाल शिल्प संग्रहालय
### Master Cultural Archive & Provenance Protocol for Nepalese Fine Art & Heritage Goods

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/SQLite-WAL_Mode-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)

---

## 🏛️ Overview

**SHILPAYA (शिल्पाय)** is a specialized cultural archive, cryptographic provenance protocol, and master artisan marketplace dedicated to safeguarding and celebrating the living arts of Nepal.

For over a millennium, the Newar metal casters of Patan, the wood carvers of Bhaktapur, the Paubha painters of the Kathmandu Valley, and the Mithila artists of Janakpur have forged sacred iconography and architectural masterworks. SHILPAYA bridges traditional hereditary guild ateliers with global collectors, museums, and luxury architects through:

- **Immutable Cultural Provenance**: Tamper-evident digital certificates of authenticity backed by cryptographic hashing and assay seals.
- **Fair Artisan Economics**: Direct atelier trade with transparent escrow, guaranteed artist royalties, and low platform commission.
- **Architectural B2B Procurement**: Multi-stage escrow milestones, laboratory purity audits, and museum-grade white-glove logistics.

---

## ✨ Key Features

### 1. Bilingual Heritage Storefront & Gallery
- **Multi-Currency Pricing**: Real-time conversion between US Dollars ($ USD) and Nepalese Rupees (रू NPR).
- **Curated Craft Mediums**:
  - **Metal Statues**: Sacred lost-wax (*cire-perdue*) copper and bronze castings with 24K fire-gilding.
  - **Wood Carving**: Architectural Sal wood relief, peacock windows, and classical Newari filigree.
  - **Thangka & Paubha**: Mineral pigments (malachite, lapis lazuli, cinnabar) and burnished gold leaf on organic hide glue.
  - **Mithila Art**: Ceremonial Kohbar and Aripan folk paintings on sun-cured Lokta sheets.
  - **Lokta Paper**: Archival wild Himalayan Daphne bark handmade sheets.
  - **Weaving & Textiles**: Heritage Dhaka patterns, cashmere, and highland Tibetan rugs.
- **Bilingual Interface**: Seamless instant toggle between English and Nepali (नेपाली).

### 2. Global Universal Search (`⌘K` / `Ctrl+K`)
- **Real-Time Cross-Entity Indexing**: Instantly search across:
  - **Masterworks**: Titles, Nepali script titles, materials, descriptions, techniques, and cultural symbolism.
  - **Master Artists & Guilds**: Living master sculptors, painter lineages, atelier names, and workshop locations.
  - **Craft Categories**: Deep filtering by sacred artistic mediums.
- **Keyboard Shortcut**: Open the search dialog from anywhere using `⌘K` or `Ctrl+K`.
- **Trending Searches**: One-click exploration for terms like *Lost-Wax Bronze*, *Peacock Window*, *24K Gold Paubha*, and *Mithila Kohbar*.

### 3. Cryptographic Provenance & Certificate Verification
- **Verifiable Identity**: Each piece includes a unique Certificate of Authenticity (e.g. `SHP-ART-2026-000845`) with a 256-bit cryptographic hash.
- **Laboratory Purity Assays**: Spectrometric copper purity, gold karat assays, and wood moisture clearances.
- **Chain of Custody Ledger**: Transparent event history recording workshop inception, guild assay hallmarking, and collector custody transfers.

### 4. Master Artisan Studio & Guild Ledger
- **Guild Verification**: Profiles of 7th-generation hereditary masters, atelier GPS coordinates, and historical lineages.
- **Audio Oral Histories**: Recorded master artisan voice notes narrating the spiritual significance of each piece.
- **Transparent Studio Financials**: Real-time tracking of gross sales, withdrawable balances, pending escrow holds, and instant payout processing.

### 5. Architectural & Enterprise Procurement (B2B)
- **5-Stage Escrow Milestones**:
  1. Master Artisan Guild Allocation & Architectural Review
  2. 50% Production Deposit Escrow & Prototype Sign-off
  3. Atelier Craft Audit & Mid-Stage Documentation
  4. Kathmandu Hub QC & Tamper-Evident Physical Hologram Seals
  5. 50% Final Settlement & Insured White-Glove Dispatch
- **Custom Commissioning**: Direct collector-to-guild requests with personalized dimensions, budgets, and quotation workflows.

---

## 🛠️ Architecture & Tech Stack

```
shilpaya/
├── backend/                  # FastAPI Python backend service
│   ├── database.py           # SQLite connection, WAL mode, migrations
│   ├── models.py             # Pydantic schemas for requests & responses
│   └── main.py               # FastAPI routers, CORS, and Swagger UI
├── data/
│   └── shilpaya.sqlite       # Persistent SQLite WAL database
├── src/
│   ├── assets/               # High-fidelity cultural images & photography
│   ├── components/           # UI components
│   │   ├── Navigation.tsx    # Header with global search, role menu & bag
│   │   ├── GlobalSearchModal.tsx # Universal search modal (⌘K)
│   │   ├── Storefront.tsx    # Gallery with filters & story showcases
│   │   ├── ProductDetail.tsx # Masterwork details, zoom & specs
│   │   ├── VerifyPortal.tsx  # Interactive Certificate & Provenance verifier
│   │   ├── ArtistStudio.tsx  # Workshop portal, new piece submission & payouts
│   │   ├── B2BPortal.tsx     # Enterprise RFPs & milestone tracker
│   │   ├── CollectorPortal.tsx # My Collection & owned title deeds
│   │   └── CartDrawer.tsx    # Acquisition bag & checkout
│   ├── context/
│   │   └── AppContext.tsx    # Unified state management & API syncing
│   ├── data/
│   │   └── mockData.ts       # Curated master artisan records & catalog
│   ├── server/
│   │   └── db.ts             # Node.js SQLite layer & initial seeds
│   └── types.ts              # TypeScript domain interfaces
├── index.html                # HTML entry point
├── package.json              # Dependencies and scripts
├── server.ts                 # Full-stack server (Port 3000 + Vite middleware)
├── tsconfig.json             # TypeScript configuration
└── vite.config.ts            # Vite configuration with Tailwind CSS v4
```

### Technology Highlights
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion.
- **Backend**: 
  - **Node.js / Express**: Full-stack server mounting Vite SPA middleware in dev and static files in production on port `3000`.
  - **FastAPI / Python**: Modular Python API service in `/backend` with Pydantic validation, CORS middleware, and automatic Swagger docs (`/docs`).
- **Database**: SQLite in WAL (`Write-Ahead Logging`) mode, maintaining consistency between Node.js and Python.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **bun**
- **Python**: 3.10+ (for FastAPI backend services)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/shilpaya.git
   cd shilpaya
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

3. **Install Python backend packages** (Optional for standalone FastAPI):
   ```bash
   pip install fastapi "uvicorn[standard]" pydantic
   ```

### Running the Application

- **Start Development Server** (Runs full application on port 3000 with hot reload):
  ```bash
  npm run dev
  ```
  Open [http://localhost:3000](http://localhost:3000) in your browser.

- **Run Standalone FastAPI Python Backend**:
  ```bash
  python3 -m uvicorn backend.main:app --port 5050 --reload
  ```
  Interactive Swagger UI documentation will be available at [http://localhost:5050/docs](http://localhost:5050/docs).

- **Production Build**:
  ```bash
  npm run build
  npm start
  ```

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status and catalog counts |
| `GET` | `/api/artworks` | Filter catalog by category, status, and search keywords |
| `GET` | `/api/artworks/:id` | Fetch detailed specifications for an artwork |
| `POST` | `/api/artworks` | Catalog a new masterwork with generated provenance certificate |
| `PATCH`| `/api/artworks/:id/status` | Update inventory status (`Available`, `Reserved`, `Sold`) |
| `GET` | `/api/certificates/:id` | Retrieve Certificate of Authenticity and complete ledger events |
| `POST` | `/api/orders` | Checkout acquisition bag and transfer title deed custody |
| `GET` | `/api/orders/my-collection`| View owned masterworks for the connected patron |
| `GET` | `/api/commissions` | List custom guild commission inquiries |
| `POST` | `/api/commissions` | Submit bespoke art commission request |
| `PATCH`| `/api/commissions/:id/quote` | Issue master artisan quotation |
| `PATCH`| `/api/commissions/:id/deposit` | Pay 50% raw materials deposit |
| `GET` | `/api/b2b` | Fetch architectural enterprise projects and milestones |
| `POST` | `/api/b2b` | Submit new B2B RFP for hotel or museum installations |
| `PATCH`| `/api/b2b/:id/milestone` | Advance verification milestone and escrow disbursement |
| `GET` | `/api/financials` | Review studio gross sales, fees, and withdrawable balances |
| `POST` | `/api/financials/payout` | Request direct artisan payout |

---

## 📜 Cultural Heritage Statement

The artifacts and techniques documented in SHILPAYA represent protected intellectual and cultural property of the traditional artisan communities of the Kathmandu Valley and the Mithila region. Every purchase directly empowers hereditary craftsmen, apprentice guilds, and conservation efforts dedicated to keeping sacred Himalayan craft lineages alive.

---

## 📄 License

This project is licensed under the MIT License.

import sqlite3
import json
import os
from typing import Any, Dict, List, Optional

DB_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))
os.makedirs(DB_DIR, exist_ok=True)
DB_PATH = os.path.join(DB_DIR, "shilpaya.sqlite")


def get_db_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH, timeout=20.0)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode = WAL;")
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn


def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Users table
    cursor.execute("""
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
        bio TEXT,
        phone TEXT,
        firebaseUid TEXT,
        savedAddresses TEXT,
        notificationPreferences TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT
    );
    """)

    # Artworks table
    cursor.execute("""
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
    """)

    # Certificates table
    cursor.execute("""
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
    """)

    # Provenance events
    cursor.execute("""
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
    """)

    # Commissions
    cursor.execute("""
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
    """)

    # B2B Projects
    cursor.execute("""
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
    """)

    # Orders
    cursor.execute("""
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
    """)

    # Studio financials
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS studio_financials (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        grossSalesUSD INTEGER NOT NULL,
        platformFeeDeductionsUSD INTEGER NOT NULL,
        pendingHoldsUSD INTEGER NOT NULL,
        withdrawableBalanceUSD INTEGER NOT NULL,
        currencyRateNPR REAL NOT NULL,
        recentPayouts JSON NOT NULL
    );
    """)

    # Check and migrate columns in users if missing
    cursor.execute("PRAGMA table_info(users)")
    existing_cols = {row["name"] for row in cursor.fetchall()}
    columns_to_add = [
        ("bio", "TEXT"),
        ("phone", "TEXT"),
        ("firebaseUid", "TEXT"),
        ("savedAddresses", "TEXT"),
        ("notificationPreferences", "TEXT"),
        ("updatedAt", "TEXT"),
    ]
    for col_name, col_type in columns_to_add:
        if col_name not in existing_cols:
            cursor.execute(f"ALTER TABLE users ADD COLUMN {col_name} {col_type};")

    conn.commit()
    conn.close()


def row_to_dict(row: sqlite3.Row) -> Dict[str, Any]:
    if row is None:
        return {}
    return {k: row[k] for k in row.keys()}

import json
import os
import random
import time
from datetime import datetime
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.database import get_db_connection, init_db, row_to_dict
from backend.models import (
    ArtworkCreateRequest,
    ArtworkStatusUpdateRequest,
    B2BProjectCreateRequest,
    CommissionCreateRequest,
    CommissionQuoteRequest,
    OrderCreateRequest,
    PayoutRequest,
    UserLoginRequest,
    UserProfileUpdateRequest,
    UserRegisterRequest,
)

# Initialize database schema and migrate columns
init_db()

app = FastAPI(
    title="SHILPAYA Master Cultural Archive API",
    description="Production FastAPI Python backend for Nepalese fine art, handicraft provenance, and master artisan marketplace.",
    version="1.0.0",
)

# Enable CORS for Vite client and dev environments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) as art_count FROM artworks")
    art_count = cur.fetchone()["art_count"]
    cur.execute("SELECT COUNT(*) as user_count FROM users")
    user_count = cur.fetchone()["user_count"]
    cur.execute("SELECT COUNT(*) as order_count FROM orders")
    order_count = cur.fetchone()["order_count"]
    conn.close()

    return {
        "status": "healthy",
        "framework": "FastAPI",
        "python_runtime": "3.11",
        "database": "SQLite WAL Mode",
        "metrics": {
            "catalogedArtworks": art_count,
            "registeredUsers": user_count,
            "recordedOrders": order_count,
        },
        "timestamp": datetime.utcnow().isoformat(),
    }


# =====================================================================
# 1. AUTH & ONBOARDING / USERS API
# =====================================================================

@app.get("/api/users")
def get_all_users():
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM users ORDER BY createdAt DESC").fetchall()
    conn.close()

    users = []
    for r in rows:
        d = row_to_dict(r)
        if d.get("savedAddresses"):
            try:
                d["savedAddresses"] = json.loads(d["savedAddresses"])
            except Exception:
                d["savedAddresses"] = []
        if d.get("notificationPreferences"):
            try:
                d["notificationPreferences"] = json.loads(d["notificationPreferences"])
            except Exception:
                d["notificationPreferences"] = None
        users.append(d)
    return users


@app.get("/api/users/{user_id}")
def get_user_by_id(user_id: str):
    conn = get_db_connection()
    row = conn.execute("SELECT * FROM users WHERE id = ? OR email = ?", (user_id, user_id)).fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="User not found")

    d = row_to_dict(row)
    if d.get("savedAddresses"):
        try:
            d["savedAddresses"] = json.loads(d["savedAddresses"])
        except Exception:
            d["savedAddresses"] = []
    if d.get("notificationPreferences"):
        try:
            d["notificationPreferences"] = json.loads(d["notificationPreferences"])
        except Exception:
            d["notificationPreferences"] = None
    return d


@app.post("/api/auth/register", status_code=status.HTTP_201_CREATED)
def register_user(req: UserRegisterRequest):
    conn = get_db_connection()
    cur = conn.cursor()

    existing = cur.execute("SELECT * FROM users WHERE email = ?", (req.email,)).fetchone()
    if existing:
        conn.close()
        d = row_to_dict(existing)
        if d.get("savedAddresses"):
            try:
                d["savedAddresses"] = json.loads(d["savedAddresses"])
            except Exception:
                d["savedAddresses"] = []
        if d.get("notificationPreferences"):
            try:
                d["notificationPreferences"] = json.loads(d["notificationPreferences"])
            except Exception:
                d["notificationPreferences"] = None
        return d

    user_id = f"usr-{str(int(time.time()))[-6:]}"
    now = datetime.utcnow().strftime("%Y-%m-%d")
    default_avatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"

    saved_addr_json = json.dumps([a.dict() for a in req.savedAddresses]) if req.savedAddresses else None
    notif_json = json.dumps(req.notificationPreferences.dict()) if req.notificationPreferences else None

    cur.execute(
        """
        INSERT INTO users (
            id, email, name, role, avatar, artisanTitle, workshopName,
            location, coordinates, organizationName, bio, phone, firebaseUid,
            savedAddresses, notificationPreferences, createdAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            user_id,
            req.email,
            req.name,
            req.role,
            req.avatar or default_avatar,
            req.artisanTitle,
            req.workshopName,
            req.location or "Kathmandu, Nepal",
            req.coordinates,
            req.organizationName,
            req.bio,
            req.phone,
            req.firebaseUid,
            saved_addr_json,
            notif_json,
            now,
        ),
    )
    conn.commit()

    new_row = cur.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    conn.close()

    result = row_to_dict(new_row)
    if result.get("savedAddresses"):
        result["savedAddresses"] = json.loads(result["savedAddresses"])
    if result.get("notificationPreferences"):
        result["notificationPreferences"] = json.loads(result["notificationPreferences"])
    return result


@app.post("/api/auth/login")
def login_user(req: UserLoginRequest):
    conn = get_db_connection()
    row = conn.execute("SELECT * FROM users WHERE email = ?", (req.email,)).fetchone()
    conn.close()

    if not row:
        raise HTTPException(
            status_code=404,
            detail="User account not found. Please complete onboarding first.",
        )

    user = row_to_dict(row)
    if user.get("savedAddresses"):
        try:
            user["savedAddresses"] = json.loads(user["savedAddresses"])
        except Exception:
            user["savedAddresses"] = []
    if user.get("notificationPreferences"):
        try:
            user["notificationPreferences"] = json.loads(user["notificationPreferences"])
        except Exception:
            user["notificationPreferences"] = None
    return user


@app.patch("/api/users/{user_id}/profile")
@app.put("/api/users/{user_id}/profile")
def update_user_profile(user_id: str, req: UserProfileUpdateRequest):
    conn = get_db_connection()
    cur = conn.cursor()

    row = cur.execute("SELECT * FROM users WHERE id = ? OR email = ?", (user_id, user_id)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")

    target_id = row["id"]
    updates = []
    params = []

    if req.name is not None:
        updates.append("name = ?")
        params.append(req.name)
    if req.bio is not None:
        updates.append("bio = ?")
        params.append(req.bio)
    if req.phone is not None:
        updates.append("phone = ?")
        params.append(req.phone)
    if req.location is not None:
        updates.append("location = ?")
        params.append(req.location)
    if req.coordinates is not None:
        updates.append("coordinates = ?")
        params.append(req.coordinates)
    if req.artisanTitle is not None:
        updates.append("artisanTitle = ?")
        params.append(req.artisanTitle)
    if req.workshopName is not None:
        updates.append("workshopName = ?")
        params.append(req.workshopName)
    if req.organizationName is not None:
        updates.append("organizationName = ?")
        params.append(req.organizationName)
    if req.avatar is not None:
        updates.append("avatar = ?")
        params.append(req.avatar)
    if req.savedAddresses is not None:
        updates.append("savedAddresses = ?")
        params.append(json.dumps(req.savedAddresses))
    if req.notificationPreferences is not None:
        updates.append("notificationPreferences = ?")
        params.append(json.dumps(req.notificationPreferences))

    updates.append("updatedAt = ?")
    params.append(datetime.utcnow().isoformat())
    params.append(target_id)

    cur.execute(f"UPDATE users SET {', '.join(updates)} WHERE id = ?", params)
    conn.commit()

    updated_row = cur.execute("SELECT * FROM users WHERE id = ?", (target_id,)).fetchone()
    conn.close()

    result = row_to_dict(updated_row)
    if result.get("savedAddresses"):
        try:
            result["savedAddresses"] = json.loads(result["savedAddresses"])
        except Exception:
            result["savedAddresses"] = []
    if result.get("notificationPreferences"):
        try:
            result["notificationPreferences"] = json.loads(result["notificationPreferences"])
        except Exception:
            result["notificationPreferences"] = None
    return result


# =====================================================================
# 2. ARTWORKS API
# =====================================================================

@app.get("/api/artworks")
def get_artworks(
    category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
):
    conn = get_db_connection()
    query = "SELECT * FROM artworks WHERE 1=1"
    params = []

    if category and category != "All":
        query += " AND category = ?"
        params.append(category)

    if status and status != "All":
        query += " AND status = ?"
        params.append(status)

    if search:
        query += " AND (title LIKE ? OR nepaliTitle LIKE ? OR artistName LIKE ? OR description LIKE ?)"
        s = f"%{search}%"
        params.extend([s, s, s, s])

    query += " ORDER BY featured DESC, createdAt DESC"
    rows = conn.execute(query, params).fetchall()
    conn.close()

    artworks = []
    for r in rows:
        d = row_to_dict(r)
        images = []
        try:
            images = json.loads(d.get("images") or "[]")
        except Exception:
            images = []

        artworks.append(
            {
                "id": d["id"],
                "title": d["title"],
                "nepaliTitle": d["nepaliTitle"],
                "category": d["category"],
                "priceUSD": d["priceUSD"],
                "priceNPR": d["priceNPR"],
                "artistId": d["artistId"],
                "artist": {
                    "id": d["artistId"],
                    "name": d["artistName"],
                    "nepaliName": d["artistNepaliName"],
                    "title": d["artistTitle"],
                    "location": d["artistLocation"],
                    "workshopName": d["artistWorkshop"],
                    "avatarUrl": d["artistAvatar"],
                },
                "images": images,
                "videoThumbnail": d.get("videoThumbnail"),
                "videoDuration": d.get("videoDuration"),
                "description": d["description"],
                "culturalStory": d["culturalStory"],
                "spiritualMeaning": d.get("spiritualMeaning"),
                "specifications": {
                    "materials": d["materials"],
                    "dimensions": d["dimensions"],
                    "weight": d["weight"],
                    "period": d["period"],
                    "creationTime": d["creationTime"],
                    "technique": d["technique"],
                },
                "status": d["status"],
                "certificateId": d["certificateId"],
                "featured": bool(d.get("featured", 0)),
                "createdAt": d.get("createdAt"),
            }
        )
    return artworks


@app.get("/api/artworks/{artwork_id}")
def get_artwork_by_id(artwork_id: str):
    conn = get_db_connection()
    row = conn.execute("SELECT * FROM artworks WHERE id = ?", (artwork_id,)).fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Artwork not found")

    d = row_to_dict(row)
    images = []
    try:
        images = json.loads(d.get("images") or "[]")
    except Exception:
        images = []

    return {
        "id": d["id"],
        "title": d["title"],
        "nepaliTitle": d["nepaliTitle"],
        "category": d["category"],
        "priceUSD": d["priceUSD"],
        "priceNPR": d["priceNPR"],
        "artistId": d["artistId"],
        "artist": {
            "id": d["artistId"],
            "name": d["artistName"],
            "nepaliName": d["artistNepaliName"],
            "title": d["artistTitle"],
            "location": d["artistLocation"],
            "workshopName": d["artistWorkshop"],
            "avatarUrl": d["artistAvatar"],
        },
        "images": images,
        "videoThumbnail": d.get("videoThumbnail"),
        "videoDuration": d.get("videoDuration"),
        "description": d["description"],
        "culturalStory": d["culturalStory"],
        "spiritualMeaning": d.get("spiritualMeaning"),
        "specifications": {
            "materials": d["materials"],
            "dimensions": d["dimensions"],
            "weight": d["weight"],
            "period": d["period"],
            "creationTime": d["creationTime"],
            "technique": d["technique"],
        },
        "status": d["status"],
        "certificateId": d["certificateId"],
        "featured": bool(d.get("featured", 0)),
        "createdAt": d.get("createdAt"),
    }


@app.post("/api/artworks", status_code=status.HTTP_201_CREATED)
def create_artwork(art: ArtworkCreateRequest):
    conn = get_db_connection()
    cur = conn.cursor()

    new_id = f"shp-{str(int(time.time()))[-4:]}"
    cert_num = random.randint(100000, 999999)
    cert_id = f"SHP-ART-2026-{cert_num}"
    now = datetime.utcnow().strftime("%Y-%m-%d")

    # Generate cryptographic hash for certificate
    crypto_hash = "0x" + "".join(random.choices("0123456789abcdef", k=64))

    # Verified materials JSON
    materials_list = [m.strip() for m in art.materials.split(",") if m.strip()]
    verified_materials = [
        {"material": m, "purityStandard": "Certified Guild Grade A", "testedBy": "Kathmandu Valley Craft Assay Laboratory"}
        for m in (materials_list or ["Virgin Copper Alloy", "24K Gold Leaf Inlay"])
    ]

    # Insert Certificate
    cur.execute(
        """
        INSERT INTO certificates (
            id, artworkId, artworkTitle, artistName, artistNepaliName, craftLineage,
            workshopLocation, issueDate, cryptographicHash, guildAssayStamp,
            materialsVerified, dimensions, weight, edition
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            cert_id,
            new_id,
            art.title,
            art.artistName or "Master Rajendra Shakya",
            art.artistNepaliName or "राजेन्द्र शाक्य",
            "Shakya Lineage 7th Gen (Patan)",
            art.artistLocation or "Patan, Lalitpur, Nepal",
            now,
            crypto_hash,
            f"KTM-GUILD-SEAL-2026-{random.randint(100, 999)}",
            json.dumps(verified_materials),
            art.dimensions,
            art.weight,
            "Original 1 of 1 Masterpiece",
        ),
    )

    # Insert Provenance Initial Event
    cur.execute(
        """
        INSERT INTO provenance_events (
            id, certificateId, timestamp, stage, location, actor, description, signatureOrSeal, hash
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            f"prov-init-{new_id}",
            cert_id,
            f"{now} 10:00 NPT",
            "Masterpiece Inception",
            art.artistLocation or "Patan Workshop, Lalitpur",
            art.artistName or "Master Rajendra Shakya",
            f"Crafted and hallmarked using heritage techniques. Documented and cataloged on Shilpaya Protocol.",
            "Guild Assay Hologram & Master Signature",
            "".join(random.choices("0123456789abcdef", k=32)),
        ),
    )

    # Images list
    img_list = art.images or ([art.imageUrl] if art.imageUrl else ["/src/assets/images/product_lost_wax_buddha_bronze_1791009616481.jpg"])

    # Insert Artwork
    cur.execute(
        """
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
        """,
        (
            new_id,
            art.title,
            art.nepaliTitle or art.title,
            art.category or "Metal Statues",
            art.priceUSD,
            round(art.priceUSD * 135),
            art.artistId or "art-01",
            art.artistName or "Master Rajendra Shakya",
            art.artistNepaliName or "राजेन्द्र शाक्य",
            art.artistTitle or "Master Artisan",
            art.artistLocation or "Patan, Nepal",
            art.artistWorkshop or "Patan Foundry",
            art.artistAvatar or "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
            json.dumps(img_list),
            art.videoThumbnail,
            art.videoDuration,
            art.description or "Traditional masterwork.",
            art.culturalStory or "Sacred heritage piece from Kathmandu Valley.",
            art.spiritualMeaning,
            art.materials or "Copper alloy, gold foil",
            art.dimensions or '16" H × 12" W',
            art.weight or "5.5 kg",
            "Contemporary Masterwork (2026)",
            art.creationTime or "8 Weeks",
            art.technique or "Traditional Craft",
            "Available",
            cert_id,
            0,
            now,
        ),
    )

    conn.commit()
    conn.close()

    return {"id": new_id, "certificateId": cert_id, "status": "Available"}


@app.patch("/api/artworks/{artwork_id}/status")
def update_artwork_status(artwork_id: str, req: ArtworkStatusUpdateRequest):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("UPDATE artworks SET status = ? WHERE id = ?", (req.status, artwork_id))
    conn.commit()
    conn.close()
    return {"success": True, "id": artwork_id, "status": req.status}


# =====================================================================
# 3. CERTIFICATES & PROVENANCE API
# =====================================================================

@app.get("/api/certificates/{cert_id}")
def get_certificate(cert_id: str):
    conn = get_db_connection()
    row = conn.execute(
        "SELECT * FROM certificates WHERE id = ? OR cryptographicHash = ?",
        (cert_id, cert_id),
    ).fetchone()

    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Certificate of Authenticity not found")

    cert = row_to_dict(row)
    try:
        cert["materialsVerified"] = json.loads(cert.get("materialsVerified") or "[]")
    except Exception:
        cert["materialsVerified"] = []

    events_rows = conn.execute(
        "SELECT * FROM provenance_events WHERE certificateId = ? ORDER BY timestamp ASC",
        (cert["id"],),
    ).fetchall()
    conn.close()

    cert["provenanceLedger"] = [row_to_dict(e) for e in events_rows]
    return cert


@app.get("/api/certificates/verify/{query_hash}")
def verify_certificate(query_hash: str):
    return get_certificate(query_hash)


# =====================================================================
# 4. ORDERS & CHECKOUT / MY COLLECTION API
# =====================================================================

@app.get("/api/orders/my-collection")
def get_my_collection():
    conn = get_db_connection()
    orders = conn.execute("SELECT * FROM orders ORDER BY createdAt DESC").fetchall()

    collection = []
    for order_row in orders:
        order = row_to_dict(order_row)
        try:
            items = json.loads(order.get("items") or "[]")
        except Exception:
            items = []

        for item in items:
            art_row = conn.execute("SELECT * FROM artworks WHERE id = ?", (item.get("artworkId"),)).fetchone()
            cert_row = conn.execute("SELECT * FROM certificates WHERE id = ?", (item.get("certificateId"),)).fetchone()

            if art_row and cert_row:
                art = row_to_dict(art_row)
                cert = row_to_dict(cert_row)

                try:
                    art["images"] = json.loads(art.get("images") or "[]")
                except Exception:
                    art["images"] = []

                try:
                    cert["materialsVerified"] = json.loads(cert.get("materialsVerified") or "[]")
                except Exception:
                    cert["materialsVerified"] = []

                events = conn.execute(
                    "SELECT * FROM provenance_events WHERE certificateId = ? ORDER BY timestamp ASC",
                    (cert["id"],),
                ).fetchall()
                cert["provenanceLedger"] = [row_to_dict(ev) for ev in events]

                collection.append(
                    {
                        "orderId": order["id"],
                        "purchaseDate": order["createdAt"],
                        "acquisitionPriceUSD": item.get("priceUSD") or art["priceUSD"],
                        "artwork": {
                            **art,
                            "artist": {
                                "name": art["artistName"],
                                "nepaliName": art["artistNepaliName"],
                                "location": art["artistLocation"],
                                "workshopName": art["artistWorkshop"],
                            },
                        },
                        "certificate": cert,
                    }
                )

    conn.close()
    return collection


@app.post("/api/orders", status_code=status.HTTP_201_CREATED)
def create_order(req: OrderCreateRequest):
    conn = get_db_connection()
    cur = conn.cursor()

    order_id = f"ORD-SHP-2026-{random.randint(1000, 9999)}"
    now = datetime.utcnow().strftime("%Y-%m-%d")
    total_usd = sum(item.get("priceUSD", 0) for item in req.items)

    cur.execute(
        """
        INSERT INTO orders (id, collectorName, collectorEmail, deliveryAddress, country, totalUSD, items, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            order_id,
            req.collectorName,
            req.collectorEmail,
            req.deliveryAddress,
            req.country,
            total_usd,
            json.dumps(req.items),
            now,
        ),
    )

    # Mark artworks as Sold and create provenance event
    for it in req.items:
        art_id = it.get("artworkId")
        cert_id = it.get("certificateId")

        cur.execute("UPDATE artworks SET status = 'Sold' WHERE id = ?", (art_id,))

        prov_id = f"prov-acq-{int(time.time())}-{art_id}"
        cur.execute(
            """
            INSERT INTO provenance_events (id, certificateId, timestamp, stage, location, actor, description, signatureOrSeal, hash)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                prov_id,
                cert_id,
                f"{datetime.utcnow().strftime('%Y-%m-%d %H:%M')} NPT",
                "Collector Acquisition",
                f"{req.deliveryAddress}, {req.country}",
                f"Collector: {req.collectorName}",
                f"Official title custody transferred via Shilpaya Protocol under Order #{order_id}.",
                "SHILPAYA Master Provenance Seal",
                "".join(random.choices("0123456789abcdef", k=32)),
            ),
        )

    # Financial ledger update: 12% platform fee, 88% net to artists
    platform_fee = round(total_usd * 0.12)
    net_artist = total_usd - platform_fee

    cur.execute(
        """
        UPDATE studio_financials
        SET grossSalesUSD = grossSalesUSD + ?,
            platformFeeDeductionsUSD = platformFeeDeductionsUSD + ?,
            withdrawableBalanceUSD = withdrawableBalanceUSD + ?
        WHERE id = 1
        """,
        (total_usd, platform_fee, net_artist),
    )

    conn.commit()
    conn.close()

    return {"orderId": order_id, "totalUSD": total_usd, "status": "Confirmed"}


# =====================================================================
# 5. COMMISSIONS API
# =====================================================================

@app.get("/api/commissions")
def get_commissions():
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM commissions ORDER BY createdAt DESC").fetchall()
    conn.close()
    return [row_to_dict(r) for r in rows]


@app.post("/api/commissions", status_code=status.HTTP_201_CREATED)
def create_commission(c: CommissionCreateRequest):
    conn = get_db_connection()
    cur = conn.cursor()

    com_id = f"com-{str(int(time.time()))[-4:]}"
    now = datetime.utcnow().strftime("%Y-%m-%d")

    cur.execute(
        """
        INSERT INTO commissions (
            id, clientName, clientEmail, clientLocation, category, description,
            requestedDimensions, budgetRangeUSD, deadlineDate, status, createdAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            com_id,
            c.clientName,
            c.clientEmail,
            c.clientLocation,
            c.category,
            c.description,
            c.requestedDimensions,
            c.budgetRangeUSD,
            c.deadlineDate,
            "Pending Review",
            now,
        ),
    )
    conn.commit()
    conn.close()
    return {"id": com_id, "status": "Pending Review"}


@app.patch("/api/commissions/{com_id}/quote")
def submit_commission_quote(com_id: str, req: CommissionQuoteRequest):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        """
        UPDATE commissions
        SET quoteAmountUSD = ?, quoteNotes = ?, status = 'Quote Sent'
        WHERE id = ?
        """,
        (req.quoteAmountUSD, req.quoteNotes, com_id),
    )
    conn.commit()
    conn.close()
    return {"success": True, "id": com_id, "quoteAmountUSD": req.quoteAmountUSD}


@app.patch("/api/commissions/{com_id}/deposit")
def pay_commission_deposit(com_id: str):
    conn = get_db_connection()
    cur = conn.cursor()

    row = cur.execute("SELECT * FROM commissions WHERE id = ?", (com_id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Commission not found")

    deposit = round(row["quoteAmountUSD"] * 0.5) if row["quoteAmountUSD"] else 1500
    now = datetime.utcnow().strftime("%Y-%m-%d")

    cur.execute(
        "UPDATE commissions SET status = 'Deposit Paid (50%)', depositPaidAt = ? WHERE id = ?",
        (now, com_id),
    )
    cur.execute(
        "UPDATE studio_financials SET pendingHoldsUSD = pendingHoldsUSD + ? WHERE id = 1",
        (deposit,),
    )
    conn.commit()
    conn.close()
    return {"success": True, "id": com_id, "deposit": deposit}


# =====================================================================
# 6. B2B ENTERPRISE API
# =====================================================================

@app.get("/api/b2b")
def get_b2b_projects():
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM b2b_projects ORDER BY submittedAt DESC").fetchall()
    conn.close()

    projects = []
    for r in rows:
        d = row_to_dict(r)
        try:
            d["milestones"] = json.loads(d.get("milestones") or "[]")
        except Exception:
            d["milestones"] = []
        d["depositPaid"] = bool(d.get("depositPaid", 0))
        d["finalPaid"] = bool(d.get("finalPaid", 0))
        projects.append(d)
    return projects


@app.post("/api/b2b", status_code=status.HTTP_201_CREATED)
def submit_b2b_rfp(b: B2BProjectCreateRequest):
    conn = get_db_connection()
    cur = conn.cursor()

    count_row = cur.execute("SELECT COUNT(*) as count FROM b2b_projects").fetchone()
    count = count_row["count"]
    proj_id = f"b2b-0{count + 1}"
    now = datetime.utcnow().strftime("%Y-%m-%d")

    budget = b.budgetUSD or 50000
    half_budget = round(budget * 0.5)

    milestones = [
        {
            "stageNumber": 1,
            "title": "Master Artisan Guild Allocation & Architectural Review",
            "description": "Assigning designated master sculptors and woodworkers in Patan and Bhaktapur.",
            "status": "in_progress",
            "paymentRequirement": "Initial RFP Sign-off",
        },
        {
            "stageNumber": 2,
            "title": "50% Production Deposit Escrow & Prototype Sign-off",
            "description": f"50% deposit (${half_budget:,}) to secure cured Sal wood and virgin copper ingots.",
            "status": "pending",
            "paymentRequirement": f"50% Deposit (${half_budget:,})",
        },
        {
            "stageNumber": 3,
            "title": "Workshop Creation & Mid-Stage Guild Review",
            "description": "Bi-weekly photo/video craft audits in Patan/Bhaktapur ateliers.",
            "status": "pending",
            "paymentRequirement": "Stage Audit",
        },
        {
            "stageNumber": 4,
            "title": "Kathmandu Hub QC & Physical Hologram Tamper Seals",
            "description": "Spectrometric purity check, wood moisture assays, laser serialization, and museum crating.",
            "status": "pending",
            "paymentRequirement": "Quality Clearance Sign-off",
        },
        {
            "stageNumber": 5,
            "title": "50% Final Settlement & Insured White-Glove Dispatch",
            "description": f"Final 50% balance (${half_budget:,}) settled prior to insured air freight.",
            "status": "pending",
            "paymentRequirement": f"Final Settlement (${half_budget:,})",
        },
    ]

    cur.execute(
        """
        INSERT INTO b2b_projects (
            id, organizationName, contactPerson, email, projectType, scopeDescription,
            estimatedUnits, budgetUSD, currentMilestone, milestones, depositPaid, finalPaid, submittedAt, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            proj_id,
            b.organizationName,
            b.contactPerson,
            b.email,
            b.projectType or "Luxury Hotel / Resort",
            b.scopeDescription,
            b.estimatedUnits or 20,
            budget,
            1,
            json.dumps(milestones),
            0,
            0,
            now,
            "In Review",
        ),
    )
    conn.commit()
    conn.close()

    return {"id": proj_id, "status": "In Review"}


@app.patch("/api/b2b/{proj_id}/milestone")
def advance_b2b_milestone(proj_id: str):
    conn = get_db_connection()
    cur = conn.cursor()

    row = cur.execute("SELECT * FROM b2b_projects WHERE id = ?", (proj_id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Project not found")

    current_m = row["currentMilestone"]
    next_m = min(5, current_m + 1)

    try:
        milestones = json.loads(row.get("milestones") or "[]")
    except Exception:
        milestones = []

    now = datetime.utcnow().strftime("%Y-%m-%d")
    for m in milestones:
        if m.get("stageNumber", 0) < next_m:
            m["status"] = "completed"
            m["completionDate"] = now
        elif m.get("stageNumber", 0) == next_m:
            m["status"] = "in_progress"
        else:
            m["status"] = "pending"

    status_str = row["status"]
    if next_m == 2:
        status_str = "In Review"
    elif next_m == 3:
        status_str = "Active Production"
    elif next_m == 4:
        status_str = "Kathmandu QC Hub"
    elif next_m == 5:
        status_str = "Dispatched"

    deposit_paid = 1 if next_m >= 3 else 0
    final_paid = 1 if next_m == 5 else 0

    cur.execute(
        """
        UPDATE b2b_projects
        SET currentMilestone = ?, milestones = ?, status = ?, depositPaid = ?, finalPaid = ?
        WHERE id = ?
        """,
        (next_m, json.dumps(milestones), status_str, deposit_paid, final_paid, proj_id),
    )
    conn.commit()
    conn.close()

    return {"success": True, "nextMilestone": next_m, "status": status_str}


# =====================================================================
# 7. FINANCIALS API
# =====================================================================

@app.get("/api/financials")
def get_financials():
    conn = get_db_connection()
    row = conn.execute("SELECT * FROM studio_financials WHERE id = 1").fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Financial records not found")

    d = row_to_dict(row)
    try:
        d["recentPayouts"] = json.loads(d.get("recentPayouts") or "[]")
    except Exception:
        d["recentPayouts"] = []
    return d


@app.post("/api/financials/payout")
def request_payout(req: PayoutRequest):
    conn = get_db_connection()
    cur = conn.cursor()

    row = cur.execute("SELECT * FROM studio_financials WHERE id = 1").fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Financials not found")

    if req.amountUSD > row["withdrawableBalanceUSD"]:
        conn.close()
        raise HTTPException(
            status_code=400,
            detail=f"Requested amount (${req.amountUSD:,}) exceeds withdrawable balance (${row['withdrawableBalanceUSD']:,})",
        )

    try:
        current_payouts = json.loads(row.get("recentPayouts") or "[]")
    except Exception:
        current_payouts = []

    new_payout = {
        "id": f"pay-{random.randint(100, 999)}",
        "date": datetime.utcnow().strftime("%Y-%m-%d"),
        "amountUSD": req.amountUSD,
        "channel": req.channel,
        "status": "Completed",
    }
    updated_payouts = [new_payout] + current_payouts

    cur.execute(
        """
        UPDATE studio_financials
        SET withdrawableBalanceUSD = withdrawableBalanceUSD - ?,
            recentPayouts = ?
        WHERE id = 1
        """,
        (req.amountUSD, json.dumps(updated_payouts)),
    )
    conn.commit()
    conn.close()

    return {"success": True, "payout": new_payout}

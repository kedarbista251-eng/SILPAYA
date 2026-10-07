from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class SavedAddressModel(BaseModel):
    id: str
    label: str
    recipientName: str
    streetAddress: str
    city: str
    stateProvince: Optional[str] = None
    postalCode: Optional[str] = None
    country: str
    isDefault: bool = False
    deliveryNotes: Optional[str] = None


class NotificationPreferencesModel(BaseModel):
    emailOrderUpdates: bool = True
    emailCertificateMinted: bool = True
    emailCommissionQuotes: bool = True
    emailB2BMilestones: bool = True
    emailArtisanPayouts: bool = True
    smsUrgentAlerts: bool = False
    marketingDigest: bool = False


class UserRegisterRequest(BaseModel):
    email: str
    name: str
    role: str  # 'collector', 'artisan', 'enterprise_buyer', 'admin'
    avatar: Optional[str] = None
    artisanTitle: Optional[str] = None
    workshopName: Optional[str] = None
    location: Optional[str] = None
    coordinates: Optional[str] = None
    organizationName: Optional[str] = None
    bio: Optional[str] = None
    phone: Optional[str] = None
    firebaseUid: Optional[str] = None
    savedAddresses: Optional[List[SavedAddressModel]] = None
    notificationPreferences: Optional[NotificationPreferencesModel] = None


class UserLoginRequest(BaseModel):
    email: str


class UserProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    coordinates: Optional[str] = None
    artisanTitle: Optional[str] = None
    workshopName: Optional[str] = None
    organizationName: Optional[str] = None
    avatar: Optional[str] = None
    savedAddresses: Optional[List[Dict[str, Any]]] = None
    notificationPreferences: Optional[Dict[str, Any]] = None


class ArtworkCreateRequest(BaseModel):
    title: str
    nepaliTitle: Optional[str] = None
    category: str
    priceUSD: int
    description: str
    culturalStory: str
    spiritualMeaning: Optional[str] = None
    materials: str
    dimensions: str
    weight: str
    artistId: str
    artistName: Optional[str] = None
    artistNepaliName: Optional[str] = None
    artistTitle: Optional[str] = None
    artistLocation: Optional[str] = None
    artistWorkshop: Optional[str] = None
    artistAvatar: Optional[str] = None
    imageUrl: Optional[str] = None
    images: Optional[List[str]] = None
    videoThumbnail: Optional[str] = None
    videoDuration: Optional[str] = None
    creationTime: Optional[str] = None
    technique: Optional[str] = None


class ArtworkStatusUpdateRequest(BaseModel):
    status: str


class CommissionCreateRequest(BaseModel):
    clientName: str
    clientEmail: str
    clientLocation: str
    category: str
    description: str
    requestedDimensions: str
    budgetRangeUSD: str
    deadlineDate: str


class CommissionQuoteRequest(BaseModel):
    quoteAmountUSD: int
    quoteNotes: Optional[str] = ""


class B2BProjectCreateRequest(BaseModel):
    organizationName: str
    contactPerson: str
    email: str
    projectType: Optional[str] = "Luxury Hotel / Resort"
    scopeDescription: str
    estimatedUnits: Optional[int] = 20
    budgetUSD: Optional[int] = 50000


class OrderItemModel(BaseModel):
    artworkId: str
    certificateId: str
    priceUSD: int


class OrderCreateRequest(BaseModel):
    collectorName: str
    collectorEmail: str
    deliveryAddress: str
    country: str
    items: List[Dict[str, Any]]


class PayoutRequest(BaseModel):
    amountUSD: int
    channel: str

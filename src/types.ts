export type CategoryType = 
  | 'Wood Carving' 
  | 'Metal Statues' 
  | 'Thangka/Paubha' 
  | 'Mithila Art' 
  | 'Lokta Paper' 
  | 'Weaving';

export type ArtworkStatus = 'Available' | 'Reserved' | 'Sold' | 'Packed' | 'Shipped';

export type UserRole = 'collector' | 'artisan' | 'enterprise_buyer' | 'admin';

export interface SavedAddress {
  id: string;
  label: string;
  recipientName: string;
  streetAddress: string;
  city: string;
  stateProvince?: string;
  postalCode?: string;
  country: string;
  isDefault: boolean;
  deliveryNotes?: string;
}

export interface NotificationPreferences {
  emailOrderUpdates: boolean;
  emailCertificateMinted: boolean;
  emailCommissionQuotes: boolean;
  emailB2BMilestones: boolean;
  emailArtisanPayouts: boolean;
  smsUrgentAlerts: boolean;
  marketingDigest: boolean;
}

export interface User {
  id: string;
  firebaseUid?: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  bio?: string;
  avatar?: string;
  artisanTitle?: string;
  workshopName?: string;
  location?: string;
  coordinates?: string;
  organizationName?: string;
  savedAddresses?: SavedAddress[];
  notificationPreferences?: NotificationPreferences;
  createdAt: string;
  updatedAt?: string;
}

export interface Artist {
  id: string;
  name: string;
  nepaliName: string;
  title: string;
  generation: string;
  workshopName: string;
  location: string;
  coordinates: string;
  bio: string;
  avatarUrl: string;
  verifiedArtisan: boolean;
  specialty: CategoryType;
}

export interface ProvenanceEvent {
  id: string;
  timestamp: string;
  stage: 'Creation' | 'Guild Certification' | 'Hub Quality Control' | 'Vault Deposit' | 'Collector Acquisition' | 'Private Transfer';
  location: string;
  actor: string;
  description: string;
  signatureOrSeal: string;
  hash: string;
}

export interface Certificate {
  id: string; // e.g. "SHP-ART-2026-000845"
  artworkId: string;
  artworkTitle: string;
  artistName: string;
  artistNepaliName: string;
  craftLineage: string;
  workshopLocation: string;
  issueDate: string;
  cryptographicHash: string; // SHA-256
  guildAssayStamp: string;
  authenticitySealUrl: string;
  provenanceLedger: ProvenanceEvent[];
  materialsVerified: string[];
  dimensions: string;
  weight: string;
  edition: string;
}

export interface Artwork {
  id: string;
  title: string;
  nepaliTitle: string;
  category: CategoryType;
  priceUSD: number;
  priceNPR: number;
  artistId: string;
  artist: Artist;
  images: string[];
  videoThumbnail?: string;
  videoDuration?: string;
  description: string;
  culturalStory: string;
  spiritualMeaning?: string;
  specifications: {
    materials: string;
    dimensions: string;
    weight: string;
    period: string;
    creationTime: string;
    technique: string;
  };
  status: ArtworkStatus;
  certificateId: string;
  featured?: boolean;
  reservedUntil?: string;
}

export interface CommissionRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  clientLocation: string;
  category: CategoryType;
  description: string;
  requestedDimensions: string;
  budgetRangeUSD: string;
  deadlineDate: string;
  status: 'Pending Review' | 'Quote Sent' | 'Deposit Paid (50%)' | 'In Production' | 'Completed' | 'Declined';
  quoteAmountUSD?: number;
  quoteNotes?: string;
  createdAt: string;
  depositPaidAt?: string;
}

export interface B2BProject {
  id: string;
  organizationName: string;
  contactPerson: string;
  email: string;
  projectType: 'Luxury Hotel / Resort' | 'Boutique Residence' | 'Embassy / Diplomatic Mission' | 'Corporate Gallery' | 'Museum Acquisition';
  scopeDescription: string;
  estimatedUnits: number;
  budgetUSD: number;
  currentMilestone: 1 | 2 | 3 | 4 | 5;
  milestones: {
    stageNumber: number;
    title: string;
    description: string;
    status: 'completed' | 'in_progress' | 'pending';
    paymentRequirement: string;
    completionDate?: string;
  }[];
  depositPaid: boolean;
  finalPaid: boolean;
  submittedAt: string;
  status: 'In Review' | 'Active Production' | 'Kathmandu QC Hub' | 'Dispatched' | 'Delivered';
}

export interface CartItem {
  artwork: Artwork;
  addedAt: string;
}

export interface OwnedArtwork {
  artwork: Artwork;
  purchaseDate: string;
  orderId: string;
  certificate: Certificate;
  acquisitionPriceUSD: number;
}

export interface StudioFinancials {
  grossSalesUSD: number;
  platformFeeDeductionsUSD: number; // 12%
  pendingHoldsUSD: number;
  withdrawableBalanceUSD: number;
  currencyRateNPR: number; // 1 USD ~ 135 NPR
  recentPayouts: {
    id: string;
    date: string;
    amountUSD: number;
    channel: 'eSewa' | 'Khalti' | 'SWIFT Bank Wire';
    status: 'Completed' | 'Processing';
  }[];
}

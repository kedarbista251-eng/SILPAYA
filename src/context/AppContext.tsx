import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Artwork, 
  ArtworkStatus, 
  CategoryType, 
  Certificate, 
  CartItem, 
  OwnedArtwork, 
  CommissionRequest, 
  B2BProject, 
  StudioFinancials,
  User,
  UserRole
} from '../types';
import { 
  INITIAL_ARTWORKS, 
  INITIAL_CERTIFICATES, 
  INITIAL_COMMISSIONS, 
  INITIAL_B2B_PROJECTS, 
  INITIAL_STUDIO_FINANCIALS,
  ARTISTS
} from '../data/mockData';

export type ViewType = 'storefront' | 'pdp' | 'collector' | 'artist' | 'verify' | 'b2b';

interface AppContextType {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  selectedArtworkId: string | null;
  openProductDetail: (id: string) => void;
  selectedCategory: CategoryType | 'All';
  setSelectedCategory: (cat: CategoryType | 'All') => void;
  
  // Language
  language: 'en' | 'ne';
  setLanguage: (lang: 'en' | 'ne') => void;
  toggleLanguage: () => void;

  // User & Onboarding
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  authMode: 'login' | 'onboarding';
  openAuthModal: (mode?: 'login' | 'onboarding') => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  openProfileModal: () => void;
  login: (email: string) => Promise<boolean>;
  register: (userData: Partial<User>) => Promise<boolean>;
  logout: () => void;

  // Products & Inventory
  artworks: Artwork[];
  updateArtworkStatus: (id: string, status: ArtworkStatus) => Promise<void>;
  addNewArtwork: (artworkData: {
    title: string;
    nepaliTitle: string;
    category: CategoryType;
    priceUSD: number;
    description: string;
    culturalStory: string;
    materials: string;
    dimensions: string;
    weight: string;
    artistId: string;
    imageUrl?: string;
    voiceNoteDuration?: string;
    voiceTranscript?: string;
  }) => Promise<Artwork>;

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (artwork: Artwork) => void;
  removeFromCart: (artworkId: string) => void;
  clearCart: () => void;
  checkout: (details: { name: string; email: string; address: string; country: string }) => Promise<{ orderId: string; ownedItems: OwnedArtwork[] }>;

  // Collector Portal & Certificates
  myCollection: OwnedArtwork[];
  certificates: Record<string, Certificate>;
  verifyCertId: string;
  setVerifyCertId: (id: string) => void;
  navigateToVerify: (certId: string) => void;
  activeCertificateModal: Certificate | null;
  setActiveCertificateModal: (cert: Certificate | null) => void;

  // Commissions
  commissions: CommissionRequest[];
  submitCommissionQuote: (id: string, quoteAmount: number, notes: string) => Promise<void>;
  markCommissionDepositPaid: (id: string) => Promise<void>;
  createCommissionRequest: (req: Omit<CommissionRequest, 'id' | 'createdAt' | 'status'>) => Promise<void>;

  // B2B Procurement
  b2bProjects: B2BProject[];
  submitB2BRFP: (rfp: {
    organizationName: string;
    contactPerson: string;
    email: string;
    projectType: B2BProject['projectType'];
    scopeDescription: string;
    estimatedUnits: number;
    budgetUSD: number;
  }) => Promise<void>;
  advanceB2BMilestone: (projectId: string) => Promise<void>;

  // Studio Financials
  financials: StudioFinancials;
  requestPayout: (amountUSD: number, channel: 'eSewa' | 'Khalti' | 'SWIFT Bank Wire') => Promise<boolean>;

  // Feedback Notification
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewType>('storefront');
  const [selectedArtworkId, setSelectedArtworkId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'All'>('All');
  const [language, setLanguage] = useState<'en' | 'ne'>('en');

  // User state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('shp_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    // Default pre-seeded demo collector
    return {
      id: 'usr-collector-1',
      name: 'Alexander Vance',
      email: 'alexander.vance@finearttrust.org',
      role: 'collector',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      location: 'Geneva, Switzerland',
      organizationName: 'Himalayan Heritage Trust',
      createdAt: '2026-08-01'
    };
  });

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'onboarding'>('onboarding');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  // Application Data
  const [artworks, setArtworks] = useState<Artwork[]>(INITIAL_ARTWORKS);
  const [certificates, setCertificates] = useState<Record<string, Certificate>>(INITIAL_CERTIFICATES);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('shp_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [myCollection, setMyCollection] = useState<OwnedArtwork[]>([
    {
      artwork: INITIAL_ARTWORKS[1],
      purchaseDate: '2026-09-02',
      orderId: 'ORD-SHP-2026-9041',
      certificate: INITIAL_CERTIFICATES['SHP-ART-2026-000912'],
      acquisitionPriceUSD: 2850
    }
  ]);

  const [verifyCertId, setVerifyCertId] = useState<string>('SHP-ART-2026-000845');
  const [activeCertificateModal, setActiveCertificateModal] = useState<Certificate | null>(null);
  const [commissions, setCommissions] = useState<CommissionRequest[]>(INITIAL_COMMISSIONS);
  const [b2bProjects, setB2BProjects] = useState<B2BProject[]>(INITIAL_B2B_PROJECTS);
  const [financials, setFinancials] = useState<StudioFinancials>(INITIAL_STUDIO_FINANCIALS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3800);
  };

  // Sync current user to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('shp_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('shp_user');
    }
  }, [currentUser]);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('shp_cart', JSON.stringify(cart));
  }, [cart]);

  // Initial Load from Backend Database
  useEffect(() => {
    async function loadBackendData() {
      try {
        // Artworks
        const resArtworks = await fetch('/api/artworks');
        if (resArtworks.ok) {
          const data = await resArtworks.json();
          if (data && data.length > 0) {
            setArtworks(data);
          }
        }

        // B2B Projects
        const resB2B = await fetch('/api/b2b');
        if (resB2B.ok) {
          const data = await resB2B.json();
          if (data && data.length > 0) {
            setB2BProjects(data);
          }
        }

        // Commissions
        const resCom = await fetch('/api/commissions');
        if (resCom.ok) {
          const data = await resCom.json();
          if (data && data.length > 0) {
            setCommissions(data);
          }
        }

        // Financials
        const resFin = await fetch('/api/financials');
        if (resFin.ok) {
          const data = await resFin.json();
          if (data && data.grossSalesUSD) {
            setFinancials(data);
          }
        }

        // My Collection
        const resCol = await fetch('/api/orders/my-collection');
        if (resCol.ok) {
          const data = await resCol.json();
          if (data && data.length > 0) {
            setMyCollection(data);
          }
        }
      } catch (err) {
        console.warn('Backend API loaded with local fallback state:', err);
      }
    }
    loadBackendData();
  }, []);

  // Sync hash routing
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('/verify/')) {
        const certId = hash.replace('/verify/', '');
        if (certId) {
          setVerifyCertId(certId);
          setCurrentView('verify');
        }
      } else if (hash.startsWith('/product/')) {
        const prodId = hash.replace('/product/', '');
        if (prodId) {
          setSelectedArtworkId(prodId);
          setCurrentView('pdp');
        }
      } else if (hash === 'collector') {
        setCurrentView('collector');
      } else if (hash === 'artist') {
        setCurrentView('artist');
      } else if (hash === 'b2b') {
        setCurrentView('b2b');
      } else if (hash === 'gallery' || hash === '') {
        setCurrentView('storefront');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const openAuthModal = (mode: 'login' | 'onboarding' = 'onboarding') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const login = async (email: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        const user = await res.json();
        setCurrentUser(user);
        showToast(`Welcome back, ${user.name}! Connected to Shilpaya Vault.`);
        return true;
      } else {
        const err = await res.json();
        showToast(err.error || 'Login failed. Please register.');
        return false;
      }
    } catch (err) {
      // Local fallback for pre-seeded users
      if (email.includes('alexander')) {
        setCurrentUser({
          id: 'usr-collector-1',
          name: 'Alexander Vance',
          email,
          role: 'collector',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          createdAt: '2026-08-01'
        });
        showToast('Logged in as Alexander Vance (Collector)');
        return true;
      }
      showToast('Login error');
      return false;
    }
  };

  const register = async (userData: Partial<User>): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (res.ok) {
        const user = await res.json();
        setCurrentUser(user);
        showToast(`Onboarding complete! Welcome to the Guild, ${user.name}.`);
        return true;
      } else {
        const err = await res.json();
        showToast(err.error || 'Registration failed');
        return false;
      }
    } catch (err) {
      showToast('Registration error');
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Signed out of Shilpaya.');
  };

  const openProductDetail = (id: string) => {
    setSelectedArtworkId(id);
    setCurrentView('pdp');
    window.location.hash = `/product/${id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToVerify = (certId: string) => {
    setVerifyCertId(certId);
    setCurrentView('verify');
    window.location.hash = `/verify/${certId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ne' : 'en');
  };

  const updateArtworkStatus = async (id: string, status: ArtworkStatus) => {
    setArtworks(prev => prev.map(art => (art.id === id ? { ...art, status } : art)));
    try {
      await fetch(`/api/artworks/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (e) {}
    showToast(`Inventory updated: Status changed to ${status}`);
  };

  const addNewArtwork = async (data: {
    title: string;
    nepaliTitle: string;
    category: CategoryType;
    priceUSD: number;
    description: string;
    culturalStory: string;
    materials: string;
    dimensions: string;
    weight: string;
    artistId: string;
    imageUrl?: string;
    voiceNoteDuration?: string;
    voiceTranscript?: string;
  }): Promise<Artwork> => {
    const artist = ARTISTS.find(a => a.id === data.artistId) || ARTISTS[0];
    const newId = `shp-${Date.now().toString().slice(-4)}`;
    const randomCertNum = Math.floor(100000 + Math.random() * 900000);
    const certId = `SHP-ART-2026-${randomCertNum}`;

    const newArtwork: Artwork = {
      id: newId,
      title: data.title,
      nepaliTitle: data.nepaliTitle || data.title,
      category: data.category,
      priceUSD: data.priceUSD,
      priceNPR: Math.round(data.priceUSD * 135),
      artistId: artist.id,
      artist: artist,
      images: [data.imageUrl || '/src/assets/images/product_lost_wax_buddha_bronze_1791009616481.jpg'],
      description: data.description,
      culturalStory: data.culturalStory,
      specifications: {
        materials: data.materials,
        dimensions: data.dimensions,
        weight: data.weight,
        period: 'Contemporary Heritage Masterwork (2026)',
        creationTime: '8 Weeks in Workshop',
        technique: 'Traditional Handcraft'
      },
      status: 'Available',
      certificateId: certId,
      featured: false
    };

    setArtworks(prev => [newArtwork, ...prev]);

    try {
      await fetch('/api/artworks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          artistName: artist.name,
          artistNepaliName: artist.nepaliName,
          artistTitle: artist.title,
          artistLocation: artist.location,
          artistWorkshop: artist.workshopName,
          artistAvatar: artist.avatarUrl
        })
      });
    } catch (e) {}

    showToast(`Masterpiece "${data.title}" successfully cataloged into database!`);
    return newArtwork;
  };

  const addToCart = (artwork: Artwork) => {
    if (cart.some(item => item.artwork.id === artwork.id)) {
      showToast(`"${artwork.title}" is already in your acquisition bag.`);
      setIsCartOpen(true);
      return;
    }
    setCart(prev => [...prev, { artwork, addedAt: new Date().toISOString() }]);
    showToast(`Added "${artwork.title}" to acquisition bag.`);
    setIsCartOpen(true);
  };

  const removeFromCart = (artworkId: string) => {
    setCart(prev => prev.filter(item => item.artwork.id !== artworkId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const checkout = async (details: { name: string; email: string; address: string; country: string }) => {
    const orderId = `ORD-SHP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString().split('T')[0];

    const newlyOwned: OwnedArtwork[] = cart.map(item => {
      let cert = certificates[item.artwork.certificateId] || {
        id: item.artwork.certificateId,
        artworkId: item.artwork.id,
        artworkTitle: item.artwork.title,
        artistName: item.artwork.artist.name,
        artistNepaliName: item.artwork.artist.nepaliName,
        craftLineage: item.artwork.artist.generation,
        workshopLocation: item.artwork.artist.location,
        issueDate: now,
        cryptographicHash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        guildAssayStamp: `SHILPAYA-CERT-${item.artwork.id.toUpperCase()}`,
        authenticitySealUrl: 'https://api.iconify.design/lucide:shield-check.svg',
        materialsVerified: [item.artwork.specifications.materials],
        dimensions: item.artwork.specifications.dimensions,
        weight: item.artwork.specifications.weight,
        edition: 'Original Masterpiece 1 of 1',
        provenanceLedger: []
      };

      const updatedCert: Certificate = {
        ...cert,
        provenanceLedger: [
          ...cert.provenanceLedger,
          {
            id: `prov-acq-${Date.now()}-${item.artwork.id}`,
            timestamp: `${new Date().toISOString().replace('T', ' ').slice(0, 16)} NPT`,
            stage: 'Collector Acquisition',
            location: `${details.address}, ${details.country}`,
            actor: `Collector: ${details.name}`,
            description: `Transferred ownership via Shilpaya Heritage Protocol under Order #${orderId}. Title custody officially recorded.`,
            signatureOrSeal: `SHILPAYA Provenance Registrar #KTM-2026`,
            hash: Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
          }
        ]
      };

      return {
        artwork: { ...item.artwork, status: 'Sold' },
        purchaseDate: now,
        orderId,
        certificate: updatedCert,
        acquisitionPriceUSD: item.artwork.priceUSD
      };
    });

    setArtworks(prev => prev.map(art => {
      if (cart.some(c => c.artwork.id === art.id)) {
        return { ...art, status: 'Sold' };
      }
      return art;
    }));

    setMyCollection(prev => [...newlyOwned, ...prev]);

    // Send to backend database
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collectorName: details.name,
          collectorEmail: details.email,
          deliveryAddress: details.address,
          country: details.country,
          items: cart.map(c => ({
            artworkId: c.artwork.id,
            certificateId: c.artwork.certificateId,
            priceUSD: c.artwork.priceUSD
          }))
        })
      });
    } catch (e) {}

    setCart([]);
    setIsCartOpen(false);
    showToast(`Acquisition complete! Permanent provenance registered in database for Order #${orderId}.`);
    return { orderId, ownedItems: newlyOwned };
  };

  const submitCommissionQuote = async (id: string, quoteAmount: number, notes: string) => {
    setCommissions(prev => prev.map(c => (c.id === id ? { ...c, status: 'Quote Sent', quoteAmountUSD: quoteAmount, quoteNotes: notes } : c)));
    try {
      await fetch(`/api/commissions/${id}/quote`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quoteAmountUSD: quoteAmount, quoteNotes: notes })
      });
    } catch (e) {}
    showToast(`Quote for $${quoteAmount.toLocaleString()} saved in database.`);
  };

  const markCommissionDepositPaid = async (id: string) => {
    setCommissions(prev => prev.map(c => (c.id === id ? { ...c, status: 'Deposit Paid (50%)', depositPaidAt: new Date().toISOString().split('T')[0] } : c)));
    try {
      await fetch(`/api/commissions/${id}/deposit`, {
        method: 'PATCH'
      });
    } catch (e) {}
    showToast(`50% upfront deposit received into database escrow!`);
  };

  const createCommissionRequest = async (req: Omit<CommissionRequest, 'id' | 'createdAt' | 'status'>) => {
    const newCom: CommissionRequest = {
      ...req,
      id: `com-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Pending Review'
    };
    setCommissions(prev => [newCom, ...prev]);

    try {
      await fetch('/api/commissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req)
      });
    } catch (e) {}

    showToast(`Commission request submitted to the Master Artisans guild!`);
  };

  const submitB2BRFP = async (rfp: {
    organizationName: string;
    contactPerson: string;
    email: string;
    projectType: B2BProject['projectType'];
    scopeDescription: string;
    estimatedUnits: number;
    budgetUSD: number;
  }) => {
    try {
      const res = await fetch('/api/b2b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rfp)
      });
      if (res.ok) {
        const refresh = await fetch('/api/b2b');
        if (refresh.ok) {
          const list = await refresh.json();
          setB2BProjects(list);
        }
      }
    } catch (e) {}
    showToast(`B2B RFP received for "${rfp.organizationName}". Project dossier opened in database.`);
  };

  const advanceB2BMilestone = async (projectId: string) => {
    try {
      const res = await fetch(`/api/b2b/${projectId}/milestone`, {
        method: 'PATCH'
      });
      if (res.ok) {
        const refresh = await fetch('/api/b2b');
        if (refresh.ok) {
          const list = await refresh.json();
          setB2BProjects(list);
        }
      }
    } catch (e) {}
    showToast(`B2B Project Milestone advanced in database.`);
  };

  const requestPayout = async (amountUSD: number, channel: 'eSewa' | 'Khalti' | 'SWIFT Bank Wire'): Promise<boolean> => {
    try {
      const res = await fetch('/api/financials/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountUSD, channel })
      });
      if (res.ok) {
        const refresh = await fetch('/api/financials');
        if (refresh.ok) {
          const data = await refresh.json();
          setFinancials(data);
        }
        showToast(`Payout of $${amountUSD.toLocaleString()} processed via ${channel}!`);
        return true;
      }
    } catch (e) {}
    return false;
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedArtworkId,
        openProductDetail,
        selectedCategory,
        setSelectedCategory,
        language,
        setLanguage,
        toggleLanguage,
        currentUser,
        setCurrentUser,
        isAuthOpen,
        setIsAuthOpen,
        authMode,
        openAuthModal,
        isProfileModalOpen,
        setIsProfileModalOpen,
        openProfileModal,
        login,
        register,
        logout,
        artworks,
        updateArtworkStatus,
        addNewArtwork,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        clearCart,
        checkout,
        myCollection,
        certificates,
        verifyCertId,
        setVerifyCertId,
        navigateToVerify,
        activeCertificateModal,
        setActiveCertificateModal,
        commissions,
        submitCommissionQuote,
        markCommissionDepositPaid,
        createCommissionRequest,
        b2bProjects,
        submitB2BRFP,
        advanceB2BMilestone,
        financials,
        requestPayout,
        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

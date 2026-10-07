import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SavedAddress, NotificationPreferences, UserRole } from '../types';
import { 
  User as UserIcon, 
  MapPin, 
  Bell, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Save, 
  Sparkles,
  Building,
  Phone,
  Mail,
  Lock,
  LogOut,
  BookmarkCheck,
  Check,
  ExternalLink
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { 
    currentUser, 
    setCurrentUser, 
    showToast,
    logout,
    openAuthModal,
    setCurrentView,
    myCollection
  } = useApp();

  const [activeTab, setActiveTab] = useState<'personal' | 'addresses' | 'notifications' | 'security'>('personal');
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  // Form State
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '+977 9841-234567');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [workshopName, setWorkshopName] = useState(currentUser?.workshopName || 'Shakya Heritage Foundry');
  const [artisanTitle, setArtisanTitle] = useState(currentUser?.artisanTitle || 'Master Lost-Wax Metal Caster');
  const [location, setLocation] = useState(currentUser?.location || 'Sundhara, Patan (Lalitpur)');
  const [coordinates, setCoordinates] = useState(currentUser?.coordinates || '27.6698° N, 85.3216° E');
  const [organizationName, setOrganizationName] = useState(currentUser?.organizationName || 'Himalayan Heritage Trust');
  const [avatar, setAvatar] = useState(currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80');

  // Saved Addresses State
  const [addresses, setAddresses] = useState<SavedAddress[]>(() => {
    if (currentUser?.savedAddresses && currentUser.savedAddresses.length > 0) {
      return currentUser.savedAddresses;
    }
    return [
      {
        id: 'addr-01',
        label: 'Primary Sanctuary Vault',
        recipientName: currentUser?.name || 'Alexander Vance',
        streetAddress: '742 Evergreen Terrace, Suite 400',
        city: 'San Francisco',
        stateProvince: 'CA',
        postalCode: '94107',
        country: 'United States',
        isDefault: true,
        deliveryNotes: 'Temperature-controlled vault delivery. Call ahead for gate access.'
      }
    ];
  });

  // Notification Preferences
  const [notifications, setNotifications] = useState<NotificationPreferences>(() => {
    return currentUser?.notificationPreferences || {
      emailOrderUpdates: true,
      emailCertificateMinted: true,
      emailCommissionQuotes: true,
      emailB2BMilestones: true,
      emailArtisanPayouts: false,
      smsUrgentAlerts: true,
      marketingDigest: false
    };
  });

  // Add Address Form State
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newLabel, setNewLabel] = useState('Secondary Residence');
  const [newRecipient, setNewRecipient] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPostal, setNewPostal] = useState('');
  const [newCountry, setNewCountry] = useState('United States');
  const [newNotes, setNewNotes] = useState('');

  if (!currentUser) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-[#FAF8F5]">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-[#B45309] mb-4">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-stone-900">
          Sign In to Access Your Sanctuary Profile
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-stone-600 max-w-sm">
          Connect your patron account to view registered ownership deeds, delivery addresses, and guild certifications.
        </p>
        <button
          onClick={() => openAuthModal('onboarding')}
          className="mt-6 px-6 py-2.5 text-xs font-semibold text-white bg-[#1C1917] rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...currentUser,
      name,
      phone,
      bio,
      avatar,
      workshopName: currentUser.role === 'artisan' ? workshopName : undefined,
      artisanTitle: currentUser.role === 'artisan' ? artisanTitle : undefined,
      location: currentUser.role === 'artisan' ? location : undefined,
      coordinates: currentUser.role === 'artisan' ? coordinates : undefined,
      organizationName: currentUser.role === 'enterprise_buyer' ? organizationName : undefined,
      savedAddresses: addresses,
      notificationPreferences: notifications,
      updatedAt: new Date().toISOString()
    };

    setCurrentUser(updated);
    setIsSavedSuccess(true);
    showToast('Profile credentials and preferences saved successfully.');
    setTimeout(() => setIsSavedSuccess(false), 3000);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet || !newCity) return;

    const newAddr: SavedAddress = {
      id: `addr-${Date.now().toString().slice(-4)}`,
      label: newLabel,
      recipientName: newRecipient || currentUser.name,
      streetAddress: newStreet,
      city: newCity,
      stateProvince: newState,
      postalCode: newPostal,
      country: newCountry,
      isDefault: addresses.length === 0,
      deliveryNotes: newNotes
    };

    const updatedAddresses = [...addresses, newAddr];
    setAddresses(updatedAddresses);
    setCurrentUser({
      ...currentUser,
      savedAddresses: updatedAddresses
    });

    setShowAddAddress(false);
    setNewStreet('');
    setNewCity('');
    setNewNotes('');
    showToast(`Saved delivery vault "${newLabel}".`);
  };

  const handleDeleteAddress = (id: string) => {
    const updated = addresses.filter(a => a.id !== id);
    setAddresses(updated);
    setCurrentUser({
      ...currentUser,
      savedAddresses: updated
    });
    showToast('Address removed.');
  };

  const handleSetDefaultAddress = (id: string) => {
    const updated = addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    }));
    setAddresses(updated);
    setCurrentUser({
      ...currentUser,
      savedAddresses: updated
    });
    showToast('Default delivery vault updated.');
  };

  const handleToggleNotification = (key: keyof NotificationPreferences) => {
    const updated = {
      ...notifications,
      [key]: !notifications[key]
    };
    setNotifications(updated);
    setCurrentUser({
      ...currentUser,
      notificationPreferences: updated
    });
    showToast('Notification preference updated.');
  };

  const getRoleBadge = (role: UserRole) => {
    if (role === 'artisan') return { label: 'Master Artisan Guild', color: 'text-amber-800 bg-amber-50 border-amber-200' };
    if (role === 'enterprise_buyer') return { label: 'B2B Enterprise Procurement', color: 'text-sky-800 bg-sky-50 border-sky-200' };
    return { label: 'Collector & Heritage Patron', color: 'text-emerald-800 bg-emerald-50 border-emerald-200' };
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24 w-full max-w-full overflow-x-hidden">
      
      {/* Top Banner Header */}
      <section className="bg-[#1C1917] text-white border-b border-[#38332E] py-8 sm:py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={avatar}
                alt={currentUser.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-[#B45309] shadow-md shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight truncate">
                    {currentUser.name}
                  </h1>
                  <span className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded border ${getRoleBadge(currentUser.role).color}`}>
                    {getRoleBadge(currentUser.role).label}
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-1 truncate">
                  {currentUser.email} · Registered {currentUser.createdAt}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-[#F59E0B] mt-1.5 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>Sovereign Shilpaya Protocol Verified</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                onClick={() => {
                  setCurrentView('collector');
                  window.location.hash = 'collector';
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-200 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors cursor-pointer"
              >
                <BookmarkCheck className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>My Collection ({myCollection.length})</span>
              </button>

              <button
                onClick={() => logout()}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-300 hover:text-red-200 bg-red-950/40 hover:bg-red-900/50 border border-red-800/40 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Profile Settings Body */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 sm:gap-4 border-b border-[#E7E2D9] text-xs sm:text-sm font-semibold overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('personal')}
            className={`py-2.5 px-3 transition-colors cursor-pointer border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'personal'
                ? 'border-[#B45309] text-[#B45309]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Personal Credentials</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`py-2.5 px-3 transition-colors cursor-pointer border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'addresses'
                ? 'border-[#B45309] text-[#B45309]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Delivery Vaults ({addresses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-2.5 px-3 transition-colors cursor-pointer border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'notifications'
                ? 'border-[#B45309] text-[#B45309]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Provenance Alerts</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`py-2.5 px-3 transition-colors cursor-pointer border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'security'
                ? 'border-[#B45309] text-[#B45309]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Guild Persona</span>
          </button>
        </div>

        {/* Tab 1: Personal Credentials Form */}
        {activeTab === 'personal' && (
          <form onSubmit={handleSavePersonal} className="bg-white rounded-xl border border-[#E7E2D9] p-5 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#F5F2EB]">
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
                  Account Credentials & Artisan Bio
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Update your contact details, guild designation, and bio.
                </p>
              </div>

              {isSavedSuccess && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-xs font-semibold animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>All Changes Saved</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name / Legal Identifier *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-[#E7E2D9] rounded-lg focus:outline-none focus:border-[#B45309]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Contact Phone / WhatsApp *
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-[#E7E2D9] rounded-lg focus:outline-none focus:border-[#B45309]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Avatar Photo URL
                </label>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-[#E7E2D9] rounded-lg focus:outline-none focus:border-[#B45309]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Primary Email (Read-Only)
                </label>
                <input
                  type="email"
                  value={currentUser.email}
                  disabled
                  className="w-full px-3 py-2 text-sm bg-stone-100 text-stone-500 border border-[#E7E2D9] rounded-lg cursor-not-allowed"
                />
              </div>
            </div>

            {/* Role-Specific Fields */}
            {currentUser.role === 'artisan' && (
              <div className="p-4 bg-amber-50/50 rounded-lg border border-amber-200/60 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-[#B45309]">
                  Artisan Guild Dossier
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Artisan Title
                    </label>
                    <input
                      type="text"
                      value={artisanTitle}
                      onChange={(e) => setArtisanTitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#E7E2D9] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Workshop Name
                    </label>
                    <input
                      type="text"
                      value={workshopName}
                      onChange={(e) => setWorkshopName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#E7E2D9] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Workshop Location
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#E7E2D9] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      GPS Coordinates
                    </label>
                    <input
                      type="text"
                      value={coordinates}
                      onChange={(e) => setCoordinates(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#E7E2D9] rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentUser.role === 'enterprise_buyer' && (
              <div className="p-4 bg-sky-50/50 rounded-lg border border-sky-200/60 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-sky-800">
                  Institutional Procurement Organization
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Organization / Resort / Museum Name
                  </label>
                  <input
                    type="text"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E7E2D9] rounded-lg"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Patron / Artisan Narrative Bio
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your background, collecting focus, or artisan lineage..."
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-[#E7E2D9] rounded-lg focus:outline-none focus:border-[#B45309]"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-stone-500">
                Data secured with 256-bit encryption.
              </span>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-[#1C1917] hover:bg-stone-800 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4 text-[#F59E0B]" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Saved Delivery Vaults */}
        {activeTab === 'addresses' && (
          <div className="bg-white rounded-xl border border-[#E7E2D9] p-5 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#F5F2EB]">
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
                  Saved Delivery Destinations & Vaults
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Manage insured white-glove destinations for your physical shipments.
                </p>
              </div>

              {!showAddAddress && (
                <button
                  onClick={() => setShowAddAddress(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1C1917] bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#B45309]" />
                  <span>Add New Destination</span>
                </button>
              )}
            </div>

            {/* Add Address Form */}
            {showAddAddress && (
              <form onSubmit={handleAddAddress} className="p-4 bg-stone-50 rounded-lg border border-[#E7E2D9] space-y-4">
                <div className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                  Add Delivery Vault Address
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Label (e.g. Primary Residence, Swiss Vault)
                    </label>
                    <input
                      type="text"
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#E7E2D9] rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Recipient Name
                    </label>
                    <input
                      type="text"
                      value={newRecipient}
                      onChange={(e) => setNewRecipient(e.target.value)}
                      placeholder={currentUser.name}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#E7E2D9] rounded-lg"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#E7E2D9] rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#E7E2D9] rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      value={newCountry}
                      onChange={(e) => setNewCountry(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#E7E2D9] rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#1C1917] rounded-lg hover:bg-stone-800"
                  >
                    Save Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddAddress(false)}
                    className="px-4 py-2 text-xs font-medium text-stone-600 bg-white border border-stone-200 rounded-lg hover:bg-stone-100"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Address Cards List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`p-4 rounded-lg border transition-all ${
                    addr.isDefault 
                      ? 'border-[#B45309] bg-amber-50/20 shadow-2xs' 
                      : 'border-[#E7E2D9] bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900">
                      {addr.label}
                    </span>
                    {addr.isDefault ? (
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Default Destination
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetDefaultAddress(addr.id)}
                        className="text-[10px] text-stone-500 hover:text-stone-900 font-medium"
                      >
                        Set as Default
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-stone-700 mt-2 font-medium">
                    {addr.recipientName}
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {addr.streetAddress}, {addr.city}, {addr.country}
                  </p>

                  <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-end">
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-[11px] text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Provenance & Notification Alerts */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-xl border border-[#E7E2D9] p-5 sm:p-8 shadow-xs space-y-6">
            <div className="pb-4 border-b border-[#F5F2EB]">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
                Cryptographic Alerts & Custody Updates
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Configure real-time notifications for blockchain certificates, assay laboratory stamps, and white-glove dispatches.
              </p>
            </div>

            <div className="divide-y divide-stone-100 space-y-2">
              <div className="flex items-center justify-between py-3">
                <div>
                  <div className="text-xs font-bold text-stone-900">Digital Certificate Minted</div>
                  <div className="text-[11px] text-stone-500">Alerts when FHAN assay certifies your physical masterwork.</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.emailCertificateMinted}
                  onChange={() => handleToggleNotification('emailCertificateMinted')}
                  className="w-4 h-4 text-[#B45309] rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <div className="text-xs font-bold text-stone-900">Order & White-Glove Dispatch Updates</div>
                  <div className="text-[11px] text-stone-500">Tracking notices and insured customs clearance milestones.</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.emailOrderUpdates}
                  onChange={() => handleToggleNotification('emailOrderUpdates')}
                  className="w-4 h-4 text-[#B45309] rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <div className="text-xs font-bold text-stone-900">Custom Commission Quotes</div>
                  <div className="text-[11px] text-stone-500">When master sculptors respond to bespoke commission proposals.</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.emailCommissionQuotes}
                  onChange={() => handleToggleNotification('emailCommissionQuotes')}
                  className="w-4 h-4 text-[#B45309] rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <div className="text-xs font-bold text-stone-900">SMS Urgent Custody Alerts</div>
                  <div className="text-[11px] text-stone-500">Immediate text message when tamper-evident hologram seal is applied.</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.smsUrgentAlerts}
                  onChange={() => handleToggleNotification('smsUrgentAlerts')}
                  className="w-4 h-4 text-[#B45309] rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Guild Persona Switcher */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-xl border border-[#E7E2D9] p-5 sm:p-8 shadow-xs space-y-6">
            <div className="pb-4 border-b border-[#F5F2EB]">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
                Guild Role & Persona Management
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Switch your active role to test different portals across the Shilpaya ecosystem.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => {
                  setCurrentUser({
                    ...currentUser,
                    role: 'collector',
                    name: 'Alexander Vance',
                    email: 'vance.collector@sanctuary.org'
                  });
                  showToast('Switched persona to Collector & Heritage Patron.');
                }}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  currentUser.role === 'collector'
                    ? 'border-[#B45309] bg-amber-50/30 ring-2 ring-amber-400/20'
                    : 'border-[#E7E2D9] bg-white hover:border-stone-400'
                }`}
              >
                <div className="text-xs font-bold text-stone-900">Collector Patron</div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Acquire verified masterworks, review certificates of authenticity, and hold custody deeds.
                </p>
                {currentUser.role === 'collector' && (
                  <span className="inline-block mt-3 text-[10px] font-bold text-[#B45309]">Active Role</span>
                )}
              </button>

              <button
                onClick={() => {
                  setCurrentUser({
                    ...currentUser,
                    role: 'artisan',
                    name: 'Rajendra Shakya',
                    email: 'rajendra.shakya@guild.np',
                    artisanTitle: 'Master Lost-Wax Metal Caster',
                    workshopName: 'Shakya Heritage Foundry',
                    location: 'Sundhara, Patan (Lalitpur)'
                  });
                  showToast('Switched persona to Master Artisan Guild.');
                }}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  currentUser.role === 'artisan'
                    ? 'border-[#B45309] bg-amber-50/30 ring-2 ring-amber-400/20'
                    : 'border-[#E7E2D9] bg-white hover:border-stone-400'
                }`}
              >
                <div className="text-xs font-bold text-stone-900">Master Artisan Guild</div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Catalog new pieces, record audio oral histories, manage studio financials, and claim payouts.
                </p>
                {currentUser.role === 'artisan' && (
                  <span className="inline-block mt-3 text-[10px] font-bold text-[#B45309]">Active Role</span>
                )}
              </button>

              <button
                onClick={() => {
                  setCurrentUser({
                    ...currentUser,
                    role: 'enterprise_buyer',
                    name: 'Evelyn Sterling',
                    email: 'e.sterling@aman-resorts.com',
                    organizationName: 'Aman Sanctuary Projects'
                  });
                  showToast('Switched persona to B2B Enterprise Buyer.');
                }}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  currentUser.role === 'enterprise_buyer'
                    ? 'border-[#B45309] bg-amber-50/30 ring-2 ring-amber-400/20'
                    : 'border-[#E7E2D9] bg-white hover:border-stone-400'
                }`}
              >
                <div className="text-xs font-bold text-stone-900">B2B Procurement</div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Submit architectural RFPs for hotels and embassies with 50/50 escrow milestone billing.
                </p>
                {currentUser.role === 'enterprise_buyer' && (
                  <span className="inline-block mt-3 text-[10px] font-bold text-[#B45309]">Active Role</span>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

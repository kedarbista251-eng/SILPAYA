import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SavedAddress, NotificationPreferences, UserRole } from '../types';
import { 
  X, 
  User as UserIcon, 
  MapPin, 
  Bell, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Save, 
  Sparkles,
  Home,
  Building,
  Phone,
  Mail,
  Lock,
  ExternalLink
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { 
    currentUser, 
    setCurrentUser, 
    showToast,
    logout,
    openAuthModal
  } = useApp();

  const [activeTab, setActiveTab] = useState<'personal' | 'addresses' | 'notifications' | 'security'>('personal');

  // Personal Settings Form State
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
        city: 'Geneva',
        stateProvince: 'Canton of Geneva',
        postalCode: '1201',
        country: 'Switzerland',
        isDefault: true,
        deliveryNotes: 'Climate-controlled crating required. Contact vault custodian upon arrival.'
      },
      {
        id: 'addr-02',
        label: 'Kathmandu Heritage Residence',
        recipientName: currentUser?.name || 'Alexander Vance',
        streetAddress: 'Patan Durbar Road, Ward 12',
        city: 'Lalitpur',
        stateProvince: 'Bagmati',
        postalCode: '44700',
        country: 'Nepal',
        isDefault: false,
        deliveryNotes: 'Deliver to courtyard security office.'
      }
    ];
  });

  // New Address Form State
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newLabel, setNewLabel] = useState('Secondary Residence');
  const [newRecipient, setNewRecipient] = useState(currentUser?.name || '');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPostal, setNewPostal] = useState('');
  const [newCountry, setNewCountry] = useState('Switzerland');
  const [newNotes, setNewNotes] = useState('');

  // Notification Preferences State
  const [notifications, setNotifications] = useState<NotificationPreferences>(() => {
    return currentUser?.notificationPreferences || {
      emailOrderUpdates: true,
      emailCertificateMinted: true,
      emailCommissionQuotes: true,
      emailB2BMilestones: true,
      emailArtisanPayouts: true,
      smsUrgentAlerts: true,
      marketingDigest: false
    };
  });

  if (!isOpen || !currentUser) return null;

  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: typeof currentUser = {
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
    showToast('Personal settings saved successfully.');
    onClose();
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
    showToast(`Saved delivery address "${newLabel}".`);
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
    showToast('Default delivery destination updated.');
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
    showToast('Notification preference saved.');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-xl border border-[#E7E2D9] shadow-2xl p-6 sm:p-8 my-8 text-[#1C1917]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-[#F5F2EB]">
          <img
            src={avatar}
            alt={currentUser.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-[#B45309]"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-2xl font-bold text-[#1C1917]">
                {currentUser.name}
              </h2>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded border capitalize bg-amber-50 text-amber-800 border-amber-200">
                {currentUser.role.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-[#78716C] mt-0.5">
              {currentUser.email} · Registered {currentUser.createdAt}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-6 border-b border-[#F5F2EB] text-xs font-semibold overflow-x-auto pt-2">
          <button
            onClick={() => setActiveTab('personal')}
            className={`py-3 transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'personal'
                ? 'border-[#B45309] text-[#B45309]'
                : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Personal Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`py-3 transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'addresses'
                ? 'border-[#B45309] text-[#B45309]'
                : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Saved Addresses ({addresses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-3 transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'notifications'
                ? 'border-[#B45309] text-[#B45309]'
                : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Notification Preferences</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`py-3 transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'security'
                ? 'border-[#B45309] text-[#B45309]'
                : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Firebase Auth & Session</span>
          </button>
        </div>

        {/* TAB 1: PERSONAL SETTINGS */}
        {activeTab === 'personal' && (
          <form onSubmit={handleSavePersonal} className="py-6 space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#1C1917] mb-1">
                  Full Name / Title
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E7E2D9] rounded focus:border-[#B45309] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1C1917] mb-1">
                  Contact Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+977 9841..."
                  className="w-full px-3 py-2 border border-[#E7E2D9] rounded focus:border-[#B45309] focus:outline-none"
                />
              </div>
            </div>

            {/* Role specific fields */}
            {currentUser.role === 'artisan' && (
              <div className="p-4 bg-[#FAF8F5] rounded-lg border border-[#E7E2D9] space-y-4">
                <div className="font-serif text-sm font-bold text-[#1C1917] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#B45309]" />
                  <span>Master Workshop Guild Credentials</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[#1C1917] mb-1">
                      Workshop / Foundry Name
                    </label>
                    <input
                      type="text"
                      value={workshopName}
                      onChange={(e) => setWorkshopName(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E7E2D9] rounded bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#1C1917] mb-1">
                      Artisan Lineage Title
                    </label>
                    <input
                      type="text"
                      value={artisanTitle}
                      onChange={(e) => setArtisanTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E7E2D9] rounded bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#1C1917] mb-1">
                      Heritage Quarter Location
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E7E2D9] rounded bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#1C1917] mb-1">
                      Workshop GPS Coordinates
                    </label>
                    <input
                      type="text"
                      value={coordinates}
                      onChange={(e) => setCoordinates(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E7E2D9] rounded bg-white font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentUser.role === 'enterprise_buyer' && (
              <div className="p-4 bg-[#FAF8F5] rounded-lg border border-[#E7E2D9] space-y-3">
                <div className="font-serif text-sm font-bold text-[#1C1917]">
                  Hospitality & Institutional Entity
                </div>
                <div>
                  <label className="block font-semibold text-[#1C1917] mb-1">
                    Organization / Resort Name
                  </label>
                  <input
                    type="text"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E7E2D9] rounded bg-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-semibold text-[#1C1917] mb-1">
                Bio / Curatorial Statement
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your lineage, sanctuary focus, or collecting mission..."
                className="w-full px-3 py-2 border border-[#E7E2D9] rounded focus:border-[#B45309] focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-semibold text-white bg-[#1C1917] hover:bg-[#292524] rounded transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Save className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: SAVED ADDRESSES */}
        {activeTab === 'addresses' && (
          <div className="py-6 space-y-6 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-base font-bold text-[#1C1917]">
                  Delivery Addresses & Private Vaults
                </h3>
                <p className="text-[11px] text-[#78716C] mt-0.5">
                  Used for insured international white-glove export from the Kathmandu Hub.
                </p>
              </div>

              <button
                onClick={() => setShowAddAddress(!showAddAddress)}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-[#1C1917] hover:bg-[#292524] rounded flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showAddAddress ? 'Cancel' : 'Add New Address'}</span>
              </button>
            </div>

            {/* Add Address Form */}
            {showAddAddress && (
              <form onSubmit={handleAddAddress} className="p-5 bg-[#FAF8F5] rounded-lg border border-[#E7E2D9] space-y-4">
                <div className="font-serif text-sm font-bold text-[#1C1917] border-b border-[#E7E2D9] pb-2">
                  New Destination Specification
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#1C1917] mb-1">Address Label</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Zurich Sanctuary Vault"
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E7E2D9] rounded bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#1C1917] mb-1">Recipient Name</label>
                    <input
                      type="text"
                      required
                      value={newRecipient}
                      onChange={(e) => setNewRecipient(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E7E2D9] rounded bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#1C1917] mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="Street, suite, floor, sanctuary..."
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E7E2D9] rounded bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-[#1C1917] mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E7E2D9] rounded bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#1C1917] mb-1">State / Canton / Province</label>
                    <input
                      type="text"
                      value={newState}
                      onChange={(e) => setNewState(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E7E2D9] rounded bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#1C1917] mb-1">Country</label>
                    <select
                      value={newCountry}
                      onChange={(e) => setNewCountry(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E7E2D9] rounded bg-white"
                    >
                      <option value="Switzerland">Switzerland</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Nepal">Nepal</option>
                      <option value="Germany">Germany</option>
                      <option value="Singapore">Singapore</option>
                      <option value="Japan">Japan</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#1C1917] mb-1">Delivery Notes / Security Clearance</label>
                  <input
                    type="text"
                    placeholder="e.g. Call 24h prior, archival crate handling only..."
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E7E2D9] rounded bg-white"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-[#1C1917] bg-[#F59E0B] hover:bg-[#D97706] rounded transition-colors cursor-pointer"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}

            {/* List of Saved Addresses */}
            <div className="space-y-3">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-4 rounded-lg border border-[#E7E2D9] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-sm font-bold text-[#1C1917]">
                        {addr.label}
                      </span>
                      {addr.isDefault && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Default Destination
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-[#1C1917] font-medium">
                      {addr.recipientName}
                    </div>

                    <div className="text-xs text-[#57534E]">
                      {addr.streetAddress}, {addr.city} {addr.postalCode}, {addr.country}
                    </div>

                    {addr.deliveryNotes && (
                      <div className="text-[11px] text-[#78716C] italic pt-1">
                        Note: {addr.deliveryNotes}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {!addr.isDefault && (
                      <button
                        onClick={() => handleSetDefaultAddress(addr.id)}
                        className="px-2.5 py-1 text-xs border border-[#E7E2D9] rounded hover:bg-stone-50 cursor-pointer"
                      >
                        Make Default
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="p-1.5 text-stone-400 hover:text-red-700 cursor-pointer"
                      title="Remove Address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: NOTIFICATION PREFERENCES */}
        {activeTab === 'notifications' && (
          <div className="py-6 space-y-5 text-xs">
            <div>
              <h3 className="font-serif text-base font-bold text-[#1C1917]">
                Communication & Provenance Alert Channels
              </h3>
              <p className="text-[11px] text-[#78716C] mt-0.5">
                Control your real-time alerts across email, SMS, and sovereign registry ledger events.
              </p>
            </div>

            <div className="space-y-3 divide-y divide-[#F5F2EB]">
              
              {/* Order Updates */}
              <div className="pt-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[#1C1917]">Acquisition & Transit Status</div>
                  <div className="text-[11px] text-[#78716C]">
                    Alerts when an item is packed in Lokta-cushioned crates or dispatched via DHL Express from Kathmandu.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleNotification('emailOrderUpdates')}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    notifications.emailOrderUpdates ? 'bg-[#B45309]' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      notifications.emailOrderUpdates ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Certificate Minting */}
              <div className="pt-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[#1C1917]">Digital Certificate & Assay Minting</div>
                  <div className="text-[11px] text-[#78716C]">
                    Notification when a new physical assay stamp or SHA-256 cryptographic seal is registered to your collection.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleNotification('emailCertificateMinted')}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    notifications.emailCertificateMinted ? 'bg-[#B45309]' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      notifications.emailCertificateMinted ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Commission Quotes */}
              <div className="pt-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[#1C1917]">Patron Commission Desk Proposals</div>
                  <div className="text-[11px] text-[#78716C]">
                    Real-time alerts when master sculptors submit quotes or when 50% escrow deposits are authorized.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleNotification('emailCommissionQuotes')}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    notifications.emailCommissionQuotes ? 'bg-[#B45309]' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      notifications.emailCommissionQuotes ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* B2B Milestone Escrow */}
              <div className="pt-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[#1C1917]">B2B & Architectural Milestone Gates</div>
                  <div className="text-[11px] text-[#78716C]">
                    Inspection clearance notifications and release approvals for 50/50 institutional projects.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleNotification('emailB2BMilestones')}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    notifications.emailB2BMilestones ? 'bg-[#B45309]' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      notifications.emailB2BMilestones ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Artisan Payouts */}
              <div className="pt-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[#1C1917]">Artisan Studio Payout Receipts</div>
                  <div className="text-[11px] text-[#78716C]">
                    Confirmation receipts when 88% sales balances disburse via eSewa, Khalti, or SWIFT bank wires.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleNotification('emailArtisanPayouts')}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    notifications.emailArtisanPayouts ? 'bg-[#B45309]' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      notifications.emailArtisanPayouts ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Urgent SMS Alerts */}
              <div className="pt-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[#1C1917]">Urgent White-Glove SMS Alerts</div>
                  <div className="text-[11px] text-[#78716C]">
                    Direct SMS dispatch notices to {phone || 'your mobile'}.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleNotification('smsUrgentAlerts')}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    notifications.smsUrgentAlerts ? 'bg-[#B45309]' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      notifications.smsUrgentAlerts ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: FIREBASE AUTH & SESSION */}
        {activeTab === 'security' && (
          <div className="py-6 space-y-5 text-xs">
            <div>
              <h3 className="font-serif text-base font-bold text-[#1C1917]">
                Firebase Authentication & Persistent Session
              </h3>
              <p className="text-[11px] text-[#78716C] mt-0.5">
                Cryptographically tied to your sovereign Himalayan heritage credentials.
              </p>
            </div>

            <div className="p-4 bg-[#FAF8F5] rounded-lg border border-[#E7E2D9] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[#78716C]">Session Provider:</span>
                <span className="font-semibold text-[#1C1917]">Firebase Auth (Google OAuth & Sovereign Credentials)</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#78716C]">Identity UID:</span>
                <span className="font-mono text-[#1C1917] bg-white px-2 py-0.5 rounded border border-[#E7E2D9]">
                  {currentUser.firebaseUid || currentUser.id}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#78716C]">Verification Status:</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Sovereign Patron</span>
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#78716C]">Firestore Database Cluster:</span>
                <span className="font-mono text-[11px] text-[#78716C]">
                  funky-psyche-4vr20 / ai-studio-shilpaya
                </span>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">Zero-Trust Sovereign Security Active</div>
                <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                  Your saved delivery addresses and notification preferences are protected under strict Attribute-Based Access Control (ABAC) rules deployed to Google Cloud Firestore.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#F5F2EB]">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openAuthModal('onboarding');
                }}
                className="px-3 py-1.5 text-xs border border-[#E7E2D9] rounded hover:bg-stone-50 cursor-pointer"
              >
                Switch / Link Another Profile
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  logout();
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded transition-colors cursor-pointer"
              >
                Sign Out of Shilpaya
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

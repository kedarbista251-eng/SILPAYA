import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Trash2, 
  ShieldCheck, 
  ShoppingBag, 
  ArrowRight, 
  Lock,
  CheckCircle2
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    clearCart,
    checkout,
    setCurrentView,
    currentUser
  } = useApp();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [name, setName] = useState(currentUser?.name || 'Alexander Vance');
  const [email, setEmail] = useState(currentUser?.email || 'alexander.vance@finearttrust.org');
  const [address, setAddress] = useState('742 Evergreen Terrace, Suite 400');
  const [country, setCountry] = useState('Switzerland');

  if (!isCartOpen) return null;

  const subtotalUSD = cart.reduce((acc, item) => acc + item.artwork.priceUSD, 0);

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !address) return;

    checkout({ name, email, address, country });
    setIsCheckingOut(false);
    setCurrentView('collector');
    window.location.hash = 'collector';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs transition-opacity">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-[#E7E2D9]">
          
          {/* Header */}
          <div className="p-6 border-b border-[#F5F2EB] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#B45309]" />
              <h2 className="font-serif text-xl font-bold text-[#1C1917]">
                Masterwork Acquisition Bag
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-stone-400 hover:text-stone-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Contents */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="py-16 text-center">
                <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <p className="font-serif text-lg font-bold text-[#1C1917]">Your bag is empty</p>
                <p className="text-xs text-[#78716C] mt-1">Browse the gallery to select sacred Himalayan pieces.</p>
              </div>
            ) : !isCheckingOut ? (
              <div className="space-y-4">
                <div className="text-xs text-[#78716C] flex items-center justify-between">
                  <span>Selected Pieces ({cart.length})</span>
                  <button
                    onClick={clearCart}
                    className="text-stone-400 hover:text-stone-700 text-[11px]"
                  >
                    Clear All
                  </button>
                </div>

                {cart.map((item) => (
                  <div
                    key={item.artwork.id}
                    className="flex gap-3 p-3 bg-[#FAF8F5] rounded-lg border border-[#E7E2D9]"
                  >
                    <img
                      src={item.artwork.images[0]}
                      alt={item.artwork.title}
                      className="w-16 h-16 rounded object-cover border border-[#E7E2D9] shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] text-[#B45309] font-semibold uppercase">
                        {item.artwork.category}
                      </div>
                      <h4 className="font-serif text-sm font-bold text-[#1C1917] truncate">
                        {item.artwork.title}
                      </h4>
                      <div className="text-xs text-[#78716C]">
                        {item.artwork.artist.name} ({item.artwork.artist.location.split(',')[0]})
                      </div>
                      <div className="font-mono text-xs font-bold text-[#1C1917] tabular-nums mt-1">
                        ${item.artwork.priceUSD.toLocaleString()}
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.artwork.id)}
                      className="text-stone-400 hover:text-red-700 p-1 self-start"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <div className="p-4 bg-emerald-50 rounded border border-emerald-200 text-xs space-y-1.5">
                  <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Includes Verified Digital Certificate</span>
                  </div>
                  <p className="text-emerald-800 text-[11px] leading-relaxed">
                    Upon checkout, title is immutably transferred to your name and added to your Collector Vault.
                  </p>
                </div>
              </div>
            ) : (
              /* Checkout Form */
              <form id="checkout-form" onSubmit={handleCompleteOrder} className="space-y-4 text-xs">
                <div className="font-serif text-base font-bold text-[#1C1917] border-b border-[#F5F2EB] pb-2 flex items-center justify-between">
                  <span>Collector & Transit Custody Details</span>
                  <span className="text-[10px] text-[#B45309] font-sans font-semibold">Insured Global Air Freight</span>
                </div>

                {currentUser?.savedAddresses && currentUser.savedAddresses.length > 0 && (
                  <div className="p-3 bg-[#FAF8F5] rounded border border-[#E7E2D9] space-y-2">
                    <div className="font-semibold text-[#1C1917] flex items-center justify-between">
                      <span>Saved Vault Destinations</span>
                      <span className="text-[10px] text-[#B45309]">1-Click Autofill</span>
                    </div>
                    <div className="space-y-1.5">
                      {currentUser.savedAddresses.map((addr) => (
                        <button
                          key={addr.id}
                          type="button"
                          onClick={() => {
                            setName(addr.recipientName);
                            setAddress(`${addr.streetAddress}, ${addr.city}`);
                            setCountry(addr.country);
                          }}
                          className="w-full text-left p-2 rounded bg-white hover:border-[#B45309] text-[11px] border border-[#E7E2D9] transition-colors cursor-pointer"
                        >
                          <div className="font-semibold text-[#1C1917] flex items-center justify-between">
                            <span>{addr.label}</span>
                            {addr.isDefault && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="text-[#78716C] truncate">
                            {addr.recipientName} · {addr.streetAddress}, {addr.city}, {addr.country}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-[#1C1917] mb-1">
                    Collector Full Legal Name / Trust
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
                    Email for Cryptographic Certificate
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E7E2D9] rounded focus:border-[#B45309] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1C1917] mb-1">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E7E2D9] rounded focus:border-[#B45309] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1C1917] mb-1">
                    Country / Jurisdiction
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E7E2D9] rounded focus:border-[#B45309] focus:outline-none bg-white"
                  >
                    <option value="Switzerland">Switzerland</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Nepal">Nepal</option>
                    <option value="Germany">Germany</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Japan">Japan</option>
                    <option value="France">France</option>
                  </select>
                </div>

                <div className="p-3 bg-[#FAF8F5] rounded border border-[#E7E2D9] text-[11px] text-[#57534E]">
                  <div className="font-semibold text-[#1C1917] mb-0.5">Kathmandu White-Glove Export</div>
                  Custom cedar crating, FHAN metallurgical assay seal, and DHL International Courier included.
                </div>
              </form>
            )}
          </div>

          {/* Footer & Settlement Action */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#F5F2EB] bg-[#FAF8F5] space-y-4">
              <div className="flex items-center justify-between text-xs text-[#78716C]">
                <span>Insured International Transit</span>
                <span className="font-semibold text-emerald-700">Complimentary</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-serif text-lg font-bold text-[#1C1917]">Acquisition Total</span>
                <div className="text-right">
                  <div className="font-mono text-xl font-bold text-[#1C1917] tabular-nums">
                    ${subtotalUSD.toLocaleString()} USD
                  </div>
                  <div className="text-[10px] text-[#78716C]">
                    ~NPR {(subtotalUSD * 135).toLocaleString()}
                  </div>
                </div>
              </div>

              {!isCheckingOut ? (
                <button
                  onClick={() => setIsCheckingOut(true)}
                  className="w-full py-3 px-4 text-xs font-semibold text-white bg-[#1C1917] hover:bg-[#292524] rounded flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
                >
                  <Lock className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>Proceed to Custody Registration</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              ) : (
                <div className="space-y-2">
                  <button
                    type="submit"
                    form="checkout-form"
                    className="w-full py-3 px-4 text-xs font-semibold text-[#1C1917] bg-[#F59E0B] hover:bg-[#D97706] rounded flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#1C1917]" />
                    <span>Complete Acquisition & Issue Provenance</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="w-full py-2 text-xs text-[#57534E] hover:text-[#1C1917]"
                  >
                    Back to Items
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

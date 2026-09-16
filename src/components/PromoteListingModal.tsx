import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Flame, 
  Crown, 
  Megaphone, 
  Smartphone, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Zap,
  TrendingUp
} from 'lucide-react';
import { ListingItem, AdPackage } from '../types';

interface PromoteListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  listings: ListingItem[];
  preselectedItemId?: string;
  currency: 'USD' | 'KES';
  onAdActivated?: (receipt: string, revenueRecord: any) => void;
}

export const PromoteListingModal: React.FC<PromoteListingModalProps> = ({
  isOpen,
  onClose,
  listings,
  preselectedItemId,
  currency,
  onAdActivated,
}) => {
  const [packages, setPackages] = useState<AdPackage[]>([]);
  const [selectedPkgId, setSelectedPkgId] = useState<string>('pkg-boost-top');
  const [selectedItemId, setSelectedItemId] = useState<string>(preselectedItemId || (listings[0]?.id || ''));
  const [sellerPhone, setSellerPhone] = useState<string>('+254712345678');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successReceipt, setSuccessReceipt] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'packages' | 'benefits'>('packages');

  const MASTER_DESTINATION = '+254705436332';

  useEffect(() => {
    if (isOpen) {
      loadPackages();
      if (preselectedItemId) {
        setSelectedItemId(preselectedItemId);
      } else if (listings.length > 0 && !selectedItemId) {
        setSelectedItemId(listings[0].id);
      }
    }
  }, [isOpen, preselectedItemId, listings]);

  const loadPackages = async () => {
    try {
      const res = await fetch('/api/ads/packages');
      const data = await res.json();
      if (data.success && data.packages) {
        setPackages(data.packages);
      }
    } catch (err) {
      console.error('Failed to load ad packages:', err);
    }
  };

  if (!isOpen) return null;

  const currentPkg = packages.find((p) => p.id === selectedPkgId) || packages[0];
  const targetListing = listings.find((l) => l.id === selectedItemId);

  const handlePurchaseAd = async () => {
    if (!currentPkg) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/ads/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: currentPkg.id,
          itemId: selectedItemId,
          sellerPhone,
          note: `In-app ad promotion purchased for ${targetListing?.title || 'Listing'}`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessReceipt(data.darajaReceipt);
        onAdActivated?.(data.darajaReceipt, data.revenueRecord);
      } else {
        alert(data.error || 'Failed to activate ad promotion');
      }
    } catch (err) {
      console.error('Error activating ad:', err);
      alert('Network error communicating with Safaricom Daraja API');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[94vh] flex flex-col animate-in slide-in-from-bottom-6 duration-200">
        
        {/* Header */}
        <div className="px-4 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/95 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 p-0.5 flex items-center justify-center">
              <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center">
                <Megaphone className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Promote & Boost Listing</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-1.5 py-0.2 rounded border border-emerald-500/30">
                  M-PESA
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Get 3x-8x more views with proven eBay & Mercari ad formats</p>
            </div>
          </div>
          <button
            id="close-promote-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {successReceipt ? (
            <div className="space-y-4 py-4 text-center">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-2xl mx-auto flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-lg font-black text-white">Campaign Activated!</h4>
                <p className="text-xs text-slate-300 max-w-xs mx-auto mt-1">
                  Your listing is now boosted in search feeds with the <span className="text-emerald-400 font-bold">{currentPkg?.tag}</span> badge.
                </p>
              </div>

              {/* Verified Financial Routing Box */}
              <div className="bg-slate-950/90 rounded-2xl border border-emerald-500/40 p-4 text-left space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400 font-medium">Safaricom Daraja Receipt:</span>
                  <span className="text-emerald-400 font-mono font-bold">{successReceipt}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400 font-medium">Payment Routed To:</span>
                  <span className="text-white font-mono font-bold">{MASTER_DESTINATION}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400 font-medium">Amount Deposited:</span>
                  <span className="text-white font-bold">
                    Ksh {currentPkg?.priceKES.toLocaleString()} (${currentPkg?.priceUSD})
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Status:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> DEPOSITED DIRECTLY
                  </span>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => {
                    setSuccessReceipt(null);
                    onClose();
                  }}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-2xl text-xs shadow-lg transition active:scale-98"
                >
                  Return to Marketplace
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Select Target Listing */}
              {listings.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">
                    Choose Listing to Promote:
                  </label>
                  <select
                    id="promote-select-item"
                    value={selectedItemId}
                    onChange={(e) => setSelectedItemId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  >
                    {listings.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title} — ${item.priceUSD} (Ksh {item.priceKES.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Package Selection Cards */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">
                  Select Ad & Boost Package:
                </label>

                <div className="space-y-2.5">
                  {packages.map((pkg) => {
                    const isSelected = selectedPkgId === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        id={`ad-pkg-${pkg.id}`}
                        onClick={() => setSelectedPkgId(pkg.id)}
                        className={`cursor-pointer rounded-2xl p-3.5 border transition relative ${
                          isSelected
                            ? 'bg-slate-800/90 border-emerald-500 ring-1 ring-emerald-500/50 shadow-lg'
                            : 'bg-slate-800/40 border-slate-700/80 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-white">{pkg.title}</span>
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                {pkg.tag}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {pkg.impressionsEstimate} • Duration: {pkg.duration}
                            </p>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <span className="text-sm font-black text-emerald-400 block font-mono">
                              Ksh {pkg.priceKES.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              (${pkg.priceUSD})
                            </span>
                          </div>
                        </div>

                        {/* Bullet benefits */}
                        <ul className="mt-2.5 space-y-1 text-[11px] text-slate-300 border-t border-slate-700/60 pt-2">
                          {pkg.benefits.map((b, idx) => (
                            <li key={idx} className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payment & Routing Disclosure Box */}
              <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-3.5 rounded-2xl border border-emerald-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                    Lipa Na M-PESA Online (STK Push)
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Instant Transfer
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] text-slate-400 block">
                    Your M-PESA Phone Number for STK Prompt:
                  </label>
                  <input
                    type="tel"
                    value={sellerPhone}
                    onChange={(e) => setSellerPhone(e.target.value)}
                    placeholder="+254712345678"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 border-t border-slate-800 text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Direct Revenue Destination:</span>
                    <span className="font-mono font-bold text-emerald-400">{MASTER_DESTINATION}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    100% of in-app ad revenue is routed automatically to Invictus Master M-PESA account ({MASTER_DESTINATION}) via Safaricom Daraja API.
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              <button
                id="submit-ad-purchase-btn"
                onClick={handlePurchaseAd}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black py-3 rounded-2xl text-xs shadow-lg transition active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Processing M-PESA STK Push...</span>
                  </>
                ) : (
                  <>
                    <span>Pay Ksh {currentPkg?.priceKES.toLocaleString()} via M-PESA</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

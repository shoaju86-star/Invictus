import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  Share2, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  MessageSquare, 
  CheckCircle2, 
  Star, 
  Clock, 
  Zap, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Award
} from 'lucide-react';
import { ListingItem } from '../types';

interface ItemDetailModalProps {
  item: ListingItem | null;
  isOpen: boolean;
  onClose: () => void;
  currency: 'USD' | 'KES';
  isLiked: boolean;
  onToggleLike: () => void;
  onOpenChat: (item: ListingItem) => void;
  onOpenCheckout: (item: ListingItem) => void;
  onOpenSocialShare: (item: ListingItem) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  currency,
  isLiked,
  onToggleLike,
  onOpenChat,
  onOpenCheckout,
  onOpenSocialShare,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!isOpen || !item) return null;

  const formatPrice = (usd: number, kes: number) => {
    if (currency === 'KES') {
      return `Ksh ${kes.toLocaleString()}`;
    }
    return `$${usd.toLocaleString()}`;
  };

  const discountPercent = item.originalRetailUSD
    ? Math.round(((item.originalRetailUSD - item.priceUSD) / item.originalRetailUSD) * 100)
    : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[94vh] flex flex-col animate-in slide-in-from-bottom-6 duration-200">
        
        {/* Top Floating Control Bar */}
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 z-20 sticky top-0">
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            aria-label="Back"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenSocialShare(item)}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title="Share to WhatsApp or Instagram"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onToggleLike}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              aria-label="Like"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-24 space-y-4">
          {/* Main Image Gallery */}
          <div className="relative aspect-square sm:aspect-4/3 w-full bg-slate-950 overflow-hidden">
            <img
              src={item.images[selectedImageIndex] || item.images[0]}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            {/* Condition Pill */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-400 border border-emerald-500/30 shadow-md">
              {item.condition}
            </div>

            {/* AI Confidence Badge */}
            {item.aiAppraisal && (
              <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur px-2.5 py-1 rounded-lg text-[11px] font-semibold text-purple-300 border border-purple-500/30 flex items-center gap-1 shadow-md">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>AI Verified Grade</span>
              </div>
            )}
          </div>

          {/* Multiple Image Thumbnails */}
          {item.images.length > 1 && (
            <div className="flex gap-2 px-4 overflow-x-auto no-scrollbar">
              {item.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition ${
                    selectedImageIndex === idx ? 'border-emerald-500 scale-105' : 'border-slate-800 opacity-60'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Pricing & Title Block */}
          <div className="px-4 space-y-2">
            <div className="flex items-baseline justify-between gap-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">
                  {formatPrice(item.priceUSD, item.priceKES)}
                </span>
                {item.originalRetailUSD && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatPrice(item.originalRetailUSD, item.originalRetailUSD * 130)}
                  </span>
                )}
              </div>
              {discountPercent && discountPercent > 0 && (
                <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-extrabold px-2 py-0.5 rounded-full">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            <h1 className="text-base sm:text-lg font-bold text-white leading-snug">
              {item.title}
            </h1>

            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
              <span className="bg-slate-800 px-2 py-0.5 rounded-md text-slate-300">
                {item.category}
              </span>
              <span>•</span>
              <span>Listed {item.createdAt}</span>
              <span>•</span>
              <span>{item.viewsCount} views</span>
              <span>•</span>
              <span>{item.likesCount} saves</span>
            </div>
          </div>

          {/* Invictus 100% Escrow Guarantee Banner */}
          <div className="mx-4 bg-gradient-to-r from-emerald-950/70 to-slate-900 border border-emerald-500/40 rounded-2xl p-3.5 space-y-1.5 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 fill-emerald-500/20 text-emerald-400" />
              <span>Invictus Escrow Buyer Protection Guarantee</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Your payment is held safely in the Invictus Escrow Vault. Funds are only released to the seller after you receive and inspect the item. 100% refund guarantee if not as described.
            </p>
          </div>

          {/* Safe Pickup & Delivery Methods Card */}
          <div className="mx-4 bg-slate-800/60 border border-slate-700/70 rounded-2xl p-3.5 space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <span>Delivery & Handover Options</span>
            </h3>

            {/* Local Pickup details */}
            {(item.deliveryMethod === 'local_pickup' || item.deliveryMethod === 'both') && item.pickupLocation && (
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white">Safe Zone Local Pickup</span>
                    <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.2 rounded">
                      Free Handover
                    </span>
                  </div>
                  <p className="font-medium text-slate-300">{item.pickupLocation.name}</p>
                  <p className="text-[11px] text-slate-400">{item.pickupLocation.safeSpotDescription}</p>
                </div>
              </div>
            )}

            {/* Shipping details */}
            {(item.deliveryMethod === 'shipping' || item.deliveryMethod === 'both') && (
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 mt-0.5">
                  <Truck className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Regional Courier Shipping</span>
                    <span className="font-bold text-slate-200">
                      {formatPrice(item.shippingFeeUSD, item.shippingFeeKES)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Dispatched via DHL / Sendy Express with tracking & signature on delivery.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Description Block */}
          <div className="px-4 space-y-1.5">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Description
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
              {item.description}
            </p>
          </div>

          {/* AI Appraisal Details Card */}
          {item.aiAppraisal && (
            <div className="mx-4 bg-purple-950/20 border border-purple-500/30 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" /> AI Pricing Analysis
                </span>
                <span className="text-[10px] text-purple-400 font-mono">
                  {Math.round(item.aiAppraisal.confidence * 100)}% Match
                </span>
              </div>
              <div className="text-xs text-slate-300 space-y-1">
                <p>
                  Estimated fair secondary market range:{' '}
                  <strong className="text-white">
                    {formatPrice(item.aiAppraisal.suggestedPriceRangeUSD.min, item.aiAppraisal.suggestedPriceRangeKES.min)} – {formatPrice(item.aiAppraisal.suggestedPriceRangeUSD.max, item.aiAppraisal.suggestedPriceRangeKES.max)}
                  </strong>
                </p>
                {item.aiAppraisal.sellingTip && (
                  <p className="text-[11px] text-slate-400 italic">
                    "{item.aiAppraisal.sellingTip}"
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Seller Profile & Verified Reviews Section */}
          <div className="mx-4 bg-slate-800/60 border border-slate-700/70 rounded-2xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Seller Information
              </h3>
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <Award className="w-3 h-3" /> Top Rated
              </span>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={item.seller.avatar}
                alt={item.seller.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500"
              />
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white">{item.seller.name}</span>
                  {item.seller.isIdVerified && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" title="Government ID Verified" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{item.seller.rating}</span>
                  </span>
                  <span>({item.seller.reviewCount} reviews)</span>
                  <span>•</span>
                  <span>{item.seller.salesCompleted} sales</span>
                </div>
                <p className="text-[11px] text-slate-400">{item.seller.location} • Member since {item.seller.memberSince}</p>
              </div>
            </div>

            {/* Badges row */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] font-semibold bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" /> ID Verified
              </span>
              <span className="text-[10px] font-semibold bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 flex items-center gap-1">
                <Zap className="w-2.5 h-2.5 text-amber-400" /> Fast Responder (&lt; 15m)
              </span>
              <span className="text-[10px] font-semibold bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 flex items-center gap-1">
                <Truck className="w-2.5 h-2.5 text-blue-400" /> Same-Day Shipper
              </span>
            </div>

            {/* Real Reviews */}
            {item.seller.reviews && item.seller.reviews.length > 0 && (
              <div className="pt-2 border-t border-slate-700/60 space-y-2">
                <span className="text-[11px] font-bold text-slate-300 block">Recent Verified Buyer Feedback:</span>
                {item.seller.reviews.map((rev) => (
                  <div key={rev.id} className="text-xs bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white flex items-center gap-1">
                        {rev.reviewerName}
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      </span>
                      <span className="text-[10px] text-slate-400">{rev.createdAt}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 italic">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sticky Bottom Action Buttons */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 flex items-center gap-2.5 z-30">
          <button
            id="chat-make-offer-btn"
            onClick={() => onOpenChat(item)}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-3 px-3 rounded-xl border border-slate-700 transition flex items-center justify-center gap-1.5 active:scale-98"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Chat / Make Offer</span>
          </button>

          <button
            id="buy-now-escrow-btn"
            onClick={() => onOpenCheckout(item)}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs py-3 px-3 rounded-xl shadow-lg transition flex items-center justify-center gap-1.5 active:scale-98"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Buy with Escrow ({formatPrice(item.priceUSD, item.priceKES)})</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  Zap, 
  Heart, 
  Truck, 
  Users, 
  SlidersHorizontal, 
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Rocket,
  Gift
} from 'lucide-react';
import { ListingItem, Category, DeliveryMethod } from '../types';

interface ExploreViewProps {
  items: ListingItem[];
  recommendedItems: ListingItem[];
  aiReasoning: string;
  currency: 'USD' | 'KES';
  selectedCategory: Category;
  setSelectedCategory: (cat: Category) => void;
  deliveryFilter: 'all' | 'local_pickup' | 'shipping';
  setDeliveryFilter: (del: 'all' | 'local_pickup' | 'shipping') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSelectItem: (item: ListingItem) => void;
  onOpenSellModal: () => void;
  onToggleLike: (itemId: string, e: React.MouseEvent) => void;
  likedItemIds: Set<string>;
  onOpenLaunchHub?: () => void;
  onOpenPromoteModal?: (item?: ListingItem) => void;
}

const CATEGORIES: Category[] = [
  'All',
  'Phones & Tablets',
  'Electronics',
  'Sneakers & Shoes',
  'Gaming & Consoles',
  'Cameras & Photo',
  'Fashion & Apparel',
  'Home & Living',
  'Collectibles & Art',
  'Vehicles & Parts',
];

export const ExploreView: React.FC<ExploreViewProps> = ({
  items,
  recommendedItems,
  aiReasoning,
  currency,
  selectedCategory,
  setSelectedCategory,
  deliveryFilter,
  setDeliveryFilter,
  searchQuery,
  setSearchQuery,
  onSelectItem,
  onOpenSellModal,
  onToggleLike,
  likedItemIds,
  onOpenLaunchHub,
  onOpenPromoteModal,
}) => {
  const [activeSort, setActiveSort] = useState<'default' | 'price_low' | 'price_high' | 'likes'>('default');

  const formatPrice = (usd: number, kes: number) => {
    if (currency === 'KES') {
      return `Ksh ${kes.toLocaleString()}`;
    }
    return `$${usd.toLocaleString()}`;
  };

  // Filter items locally based on search, delivery, category, sort
  let filteredItems = items.filter((item) => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (deliveryFilter === 'local_pickup' && item.deliveryMethod !== 'local_pickup' && item.deliveryMethod !== 'both') return false;
    if (deliveryFilter === 'shipping' && item.deliveryMethod !== 'shipping' && item.deliveryMethod !== 'both') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      const matchTags = item.aiAppraisal?.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchCat && !matchTags) return false;
    }
    return true;
  });

  if (activeSort === 'price_low') {
    filteredItems.sort((a, b) => a.priceUSD - b.priceUSD);
  } else if (activeSort === 'price_high') {
    filteredItems.sort((a, b) => b.priceUSD - a.priceUSD);
  } else if (activeSort === 'likes') {
    filteredItems.sort((a, b) => b.likesCount - a.likesCount);
  }

  return (
    <div className="flex-1 pb-16 space-y-4">
      {/* Search Bar & Quick Filters */}
      <div className="px-4 pt-3 space-y-2.5">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            id="marketplace-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search phones, sneakers, gaming, electronics..."
            className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 text-xs text-slate-400 hover:text-white px-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* Delivery Method Filter Buttons */}
        <div className="flex items-center justify-between gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
          <div className="flex items-center gap-1.5">
            <button
              id="filter-all-delivery-btn"
              onClick={() => setDeliveryFilter('all')}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap text-[11px] font-medium transition ${
                deliveryFilter === 'all'
                  ? 'bg-slate-200 text-slate-900 font-bold'
                  : 'bg-slate-800/80 text-slate-300 border border-slate-700/80 hover:bg-slate-700'
              }`}
            >
              All Items
            </button>
            <button
              id="filter-local-pickup-btn"
              onClick={() => setDeliveryFilter('local_pickup')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full whitespace-nowrap text-[11px] font-medium transition ${
                deliveryFilter === 'local_pickup'
                  ? 'bg-emerald-500 text-white font-bold'
                  : 'bg-slate-800/80 text-slate-300 border border-slate-700/80 hover:bg-slate-700'
              }`}
            >
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>Local Pickup</span>
            </button>
            <button
              id="filter-shipping-btn"
              onClick={() => setDeliveryFilter('shipping')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full whitespace-nowrap text-[11px] font-medium transition ${
                deliveryFilter === 'shipping'
                  ? 'bg-blue-500 text-white font-bold'
                  : 'bg-slate-800/80 text-slate-300 border border-slate-700/80 hover:bg-slate-700'
              }`}
            >
              <Truck className="w-3 h-3 text-blue-400" />
              <span>Shipping</span>
            </button>
          </div>

          {/* Sort Selector */}
          <select
            value={activeSort}
            onChange={(e) => setActiveSort(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-[11px] px-2 py-1 focus:outline-none focus:border-emerald-500"
          >
            <option value="default">Featured</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="likes">Most Popular</option>
          </select>
        </div>
      </div>

      {/* Launch & Growth Promotional Banner */}
      <div className="px-4">
        <div 
          onClick={onOpenLaunchHub}
          className="cursor-pointer bg-gradient-to-r from-emerald-950/80 via-slate-900 to-amber-950/40 border border-emerald-500/40 hover:border-emerald-400/80 rounded-2xl p-3 shadow-md transition flex items-center justify-between gap-3 group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-400 p-0.5 flex-shrink-0">
              <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center">
                <Rocket className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.2 rounded border border-emerald-500/30">
                  LAUNCH SPECIAL
                </span>
                <span className="text-xs font-bold text-white truncate">
                  0% Listing Fees & Early Access Rewards
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                Sell with M-PESA • Invite Friends, Earn {currency === 'KES' ? 'Ksh 1,300' : '$10'} • Tap for Growth Hub
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition flex-shrink-0" />
        </div>
      </div>

      {/* Category Horizontal Scroller */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            id={`category-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}-btn`}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition font-medium ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm font-semibold'
                : 'bg-slate-800/70 border border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-700/70'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Launch Promo & Unique M-PESA Selling Point Hero Card */}
      <div className="px-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900/50 via-teal-900/40 to-slate-800/90 border border-emerald-500/30 p-3.5 shadow-lg">
          <div className="flex items-start justify-between">
            <div className="space-y-1 max-w-[70%]">
              <div className="flex items-center gap-1 text-[10px] uppercase font-extrabold tracking-wider text-emerald-400">
                <Zap className="w-3 h-3 fill-emerald-400" />
                <span>Launch Special • Zero Listing Fees</span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white leading-tight">
                Sell Fast with AI & Instant M-PESA Escrow Payouts
              </h2>
              <p className="text-[11px] text-slate-300 line-clamp-2">
                Snap any photo. AI suggests fair market price & creates your listing in 15 seconds.
              </p>
            </div>
            <div className="flex flex-col gap-1.5 flex-shrink-0">
              <button
                onClick={onOpenSellModal}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-md transition-all active:scale-95 whitespace-nowrap flex items-center justify-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>List Free</span>
              </button>
              {onOpenPromoteModal && (
                <button
                  onClick={() => onOpenPromoteModal()}
                  className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-extrabold text-[10px] px-2.5 py-1 rounded-xl transition whitespace-nowrap flex items-center justify-center gap-1"
                >
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>Boost Listing</span>
                </button>
              )}
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-emerald-500/20 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-300 font-medium">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> 100% Escrow Buyer & Seller Guarantee
            </span>
            <span className="text-slate-400">Over 300+ Verified Sales</span>
          </div>
        </div>
      </div>

      {/* AI Recommendations Section */}
      {recommendedItems.length > 0 && searchQuery === '' && selectedCategory === 'All' && (
        <section className="px-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Sparkles className="w-3 h-3" />
              </div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                AI Recommended For You
              </h3>
            </div>
            <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full font-semibold border border-purple-500/20">
              Gemini 3.8 Powered
            </span>
          </div>

          {/* AI Rationale Card */}
          {aiReasoning && (
            <p className="text-[11px] text-slate-300 bg-slate-800/60 border border-slate-700/60 rounded-xl p-2 italic leading-relaxed">
              ✨ "{aiReasoning}"
            </p>
          )}

          {/* Horizontal Scroller for Recommendations */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {recommendedItems.map((rec) => (
              <div
                key={`rec-${rec.id}`}
                onClick={() => onSelectItem(rec)}
                className="w-44 flex-shrink-0 bg-slate-800/80 border border-slate-700/80 rounded-xl overflow-hidden cursor-pointer hover:border-emerald-500/60 transition-all group shadow-md"
              >
                <div className="relative h-28 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={rec.images[0]}
                    alt={rec.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-1.5 left-1.5 bg-slate-900/80 backdrop-blur px-1.5 py-0.5 rounded text-[9px] font-bold text-emerald-400 border border-emerald-500/30">
                    {rec.condition}
                  </div>
                </div>
                <div className="p-2 space-y-1">
                  <h4 className="text-[11px] font-semibold text-white truncate">{rec.title}</h4>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-extrabold text-emerald-400">
                      {formatPrice(rec.priceUSD, rec.priceKES)}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate max-w-[70px]">
                      {rec.seller.city}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Main Listings Grid */}
      <section className="px-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              {searchQuery ? `Search Results (${filteredItems.length})` : `${selectedCategory} Deals`}
            </h3>
            {deliveryFilter !== 'all' && (
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-emerald-400 border border-slate-700">
                {deliveryFilter === 'local_pickup' ? 'Safe Pickup Only' : 'Shipping Only'}
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-400">
            {filteredItems.length} available
          </span>
        </div>

        {filteredItems.length === 0 ? (
          <div className="py-12 px-4 text-center bg-slate-800/40 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">No listings found</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                No items match your filter. Be the first to list an item in this category with 0% fees!
              </p>
            </div>
            <button
              onClick={onOpenSellModal}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition shadow"
            >
              List Item with AI
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {filteredItems.map((item) => {
              const isLiked = likedItemIds.has(item.id);
              return (
                <article
                  key={item.id}
                  id={`listing-card-${item.id}`}
                  onClick={() => onSelectItem(item)}
                  className="bg-slate-800/70 border border-slate-700/70 rounded-2xl overflow-hidden hover:border-slate-500 transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
                >
                  {/* Image container */}
                  <div className="relative aspect-square w-full bg-slate-900 overflow-hidden">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />

                    {/* Condition & Promotion badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                      <div className="bg-slate-900/85 backdrop-blur px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-200 border border-slate-700/60 shadow-sm">
                        {item.condition}
                      </div>
                      {(item.isPromoted || item.promotionBadge) && (
                        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded shadow-md tracking-wider flex items-center gap-0.5 animate-pulse">
                          <span>★ {item.promotionBadge || 'SPONSORED'}</span>
                        </div>
                      )}
                    </div>

                    {/* Like button */}
                    <button
                      id={`like-btn-${item.id}`}
                      onClick={(e) => onToggleLike(item.id, e)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/70 backdrop-blur text-slate-300 hover:text-red-400 transition"
                      aria-label="Like item"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isLiked ? 'fill-red-500 text-red-500' : 'text-slate-300'
                        }`}
                      />
                    </button>

                    {/* Delivery Method pill */}
                    <div className="absolute bottom-2 left-2 flex items-center gap-1">
                      {item.deliveryMethod === 'both' ? (
                        <span className="bg-slate-900/85 backdrop-blur text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5" /> Pickup & Ship
                        </span>
                      ) : item.deliveryMethod === 'local_pickup' ? (
                        <span className="bg-slate-900/85 backdrop-blur text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5" /> Local Meetup
                        </span>
                      ) : (
                        <span className="bg-slate-900/85 backdrop-blur text-blue-400 text-[9px] font-bold px-1.5 py-0.5 rounded border border-blue-500/30 flex items-center gap-1">
                          <Truck className="w-2.5 h-2.5" /> Fast Ship
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-2.5 space-y-1.5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-baseline justify-between gap-1">
                        <span className="text-sm sm:text-base font-black text-white">
                          {formatPrice(item.priceUSD, item.priceKES)}
                        </span>
                        {item.originalRetailUSD && (
                          <span className="text-[10px] text-slate-400 line-through">
                            {formatPrice(item.originalRetailUSD, item.originalRetailUSD * 130)}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-semibold text-slate-200 line-clamp-2 leading-snug mt-0.5 group-hover:text-emerald-400 transition-colors">
                        {item.title}
                      </h4>
                    </div>

                    <div className="pt-1.5 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                      <div className="flex items-center gap-1 truncate">
                        <span className="truncate">{item.seller.name.split(' ')[0]}</span>
                        {item.seller.isIdVerified && (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" title="ID Verified Seller" />
                        )}
                      </div>
                      <div className="flex items-center gap-0.5 font-medium text-amber-400">
                        <span>★</span>
                        <span>{item.seller.rating}</span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

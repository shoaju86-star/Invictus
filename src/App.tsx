import React, { useState, useEffect } from 'react';
import { DeviceFrame } from './components/DeviceFrame';
import { Navbar } from './components/Navbar';
import { BottomTabBar, TabType } from './components/BottomTabBar';
import { ExploreView } from './components/ExploreView';
import { ItemDetailModal } from './components/ItemDetailModal';
import { SellWithAIModal } from './components/SellWithAIModal';
import { EscrowPaymentModal } from './components/EscrowPaymentModal';
import { ChatModal } from './components/ChatModal';
import { OrdersVaultView } from './components/OrdersVaultView';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { SocialShareModal } from './components/SocialShareModal';
import { StoreSubmissionModal } from './components/StoreSubmissionModal';
import { NotificationsModal } from './components/NotificationsModal';
import { DisputeModal } from './components/DisputeModal';
import { SafetyGuaranteeModal } from './components/SafetyGuaranteeModal';
import { LaunchStrategyModal } from './components/LaunchStrategyModal';
import { PromoteListingModal } from './components/PromoteListingModal';
import { SellerKYCModal } from './components/SellerKYCModal';
import { ListingItem, Category, PushNotification, SellerProfile } from './types';
import { Sparkles, X, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Device & Layout
  const [activeDevice, setActiveDevice] = useState<'iphone' | 'pixel' | 'responsive'>('iphone');
  const [activeTab, setActiveTab] = useState<TabType>('explore');
  const [currency, setCurrency] = useState<'USD' | 'KES'>('USD');
  const [currentCity, setCurrentCity] = useState('Nairobi, KE');

  // Marketplace Data
  const [items, setItems] = useState<ListingItem[]>([]);
  const [recommendedItems, setRecommendedItems] = useState<ListingItem[]>([]);
  const [aiReasoning, setAiReasoning] = useState<string>('');
  const [notifications, setNotifications] = useState<PushNotification[]>([]);
  const [likedItemIds, setLikedItemIds] = useState<Set<string>>(new Set(['item-1']));

  // Filtering
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [deliveryFilter, setDeliveryFilter] = useState<'all' | 'local_pickup' | 'shipping'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedItem, setSelectedItem] = useState<ListingItem | null>(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [isSellerKycVerified, setIsSellerKycVerified] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState<ListingItem | null>(null);
  const [chatItem, setChatItem] = useState<ListingItem | null>(null);
  const [shareItem, setShareItem] = useState<ListingItem | null>(null);
  const [disputeItem, setDisputeItem] = useState<ListingItem | null>(null);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [isNotifsModalOpen, setIsNotifsModalOpen] = useState(false);
  const [isLaunchHubOpen, setIsLaunchHubOpen] = useState(false);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [promoteItemId, setPromoteItemId] = useState<string | undefined>(undefined);

  // Floating Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Initial Data Fetching
  useEffect(() => {
    loadMarketplaceData();
  }, []);

  const loadMarketplaceData = async () => {
    try {
      const [itemsRes, notifsRes] = await Promise.all([
        fetch('/api/items'),
        fetch('/api/notifications'),
      ]);

      const itemsJson = await itemsRes.json();
      const notifsJson = await notifsRes.json();

      if (itemsJson.success && itemsJson.items) {
        setItems(itemsJson.items);
      }
      if (notifsJson.success && notifsJson.notifications) {
        setNotifications(notifsJson.notifications);
      }

      // Fetch AI recommendations
      fetchAiRecommendations('buyer-guest-1');
    } catch (err) {
      console.error('Failed to load initial marketplace data:', err);
    }
  };

  const fetchAiRecommendations = async (buyerId: string) => {
    try {
      const res = await fetch(`/api/ai/recommendations?buyerId=${buyerId}`);
      const json = await res.json();
      if (json.success) {
        setRecommendedItems(json.recommendations || []);
        setAiReasoning(json.reasoning || '');
      }
    } catch (err) {
      console.warn('AI recommendations fallback:', err);
    }
  };

  // Like Toggle
  const handleToggleLike = (itemId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLikedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
        showToast('Saved to your favorites wishlist!');
      }
      return next;
    });
  };

  // City Switcher
  const handleToggleCity = () => {
    const cities = ['Nairobi, KE', 'New York, USA', 'London, UK', 'Mombasa, KE'];
    const nextIndex = (cities.indexOf(currentCity) + 1) % cities.length;
    setCurrentCity(cities[nextIndex]);
    showToast(`Location updated to ${cities[nextIndex]}`);
  };

  // Listing Created
  const handleListingCreated = (newItem: ListingItem) => {
    setItems((prev) => [newItem, ...prev]);
    showToast(`🎉 "${newItem.title}" published with 0% fees!`);
    setSelectedItem(newItem);
  };

  // Escrow Payment Success
  const handlePaymentSuccess = (updatedItem: ListingItem, receiptMsg: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === updatedItem.id ? updatedItem : it))
    );
    setCheckoutItem(null);
    setSelectedItem(null);
    setActiveTab('orders');
    showToast(`🔒 Funds locked in Escrow Vault! ${receiptMsg}`);
    
    // Add push notification
    const newNotif: PushNotification = {
      id: `notif-${Date.now()}`,
      title: 'Payment Secured in Escrow Vault',
      message: `Funds for ${updatedItem.title} are safely held. Seller will dispatch item.`,
      createdAt: 'Just now',
      isRead: false,
      type: 'escrow_hold',
      itemId: updatedItem.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Release Escrow Funds to Seller
  const handleReleaseFunds = async (itemId: string) => {
    const res = await fetch('/api/escrow/release-funds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemId,
        buyerId: 'user-buyer-1',
        rating: 5,
        reviewText: 'Item was in perfect condition as described. Escrow checkout was super smooth!',
      }),
    });

    const json = await res.json();
    if (json.success) {
      setItems((prev) =>
        prev.map((it) =>
          it.id === itemId
            ? { ...it, status: 'sold', escrowStatus: 'RELEASED_TO_SELLER' }
            : it
        )
      );
      showToast('🎉 Escrow payout released to seller M-PESA! Thank you for your review.');
      
      const newNotif: PushNotification = {
        id: `notif-${Date.now()}`,
        title: 'Escrow Payout Complete',
        message: 'Commission deducted and net funds transferred to seller.',
        createdAt: 'Just now',
        isRead: false,
        type: 'escrow_released',
        itemId,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    } else {
      throw new Error(json.error || 'Failed to release funds');
    }
  };

  // Dispute Opened
  const handleDisputeSubmitted = (itemId: string, disputeId: string) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === itemId ? { ...it, escrowStatus: 'DISPUTED' } : it
      )
    );
    showToast(`⚠️ Dispute #${disputeId} opened. Escrow funds frozen.`);
  };

  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;
  const activeEscrowOrdersCount = items.filter(
    (it) => it.escrowStatus && it.escrowStatus !== 'RELEASED_TO_SELLER'
  ).length;

  return (
    <DeviceFrame
      activeDevice={activeDevice}
      setActiveDevice={setActiveDevice}
      currency={currency}
      setCurrency={setCurrency}
      onOpenStoreModal={() => setIsStoreModalOpen(true)}
      unreadNotifsCount={unreadNotifsCount}
    >
      {/* App Shell */}
      <div className="flex-1 flex flex-col relative w-full h-full">
        {/* Top Navbar */}
        <Navbar
          currentCity={currentCity}
          onChangeCity={handleToggleCity}
          unreadNotifsCount={unreadNotifsCount}
          onOpenNotifications={() => setIsNotifsModalOpen(true)}
          onOpenAdmin={() => setIsAdminModalOpen(true)}
          onOpenSafetyModal={() => setIsSafetyModalOpen(true)}
          onOpenLaunchHub={() => setIsLaunchHubOpen(true)}
          onOpenPromoteModal={() => {
            setPromoteItemId(undefined);
            setIsPromoteModalOpen(true);
          }}
        />

        {/* Global Toast Alert */}
        {toastMessage && (
          <div className="sticky top-12 z-40 mx-4 my-2 p-2.5 rounded-xl bg-slate-900/95 border border-emerald-500/50 shadow-xl flex items-center justify-between gap-2 text-xs text-emerald-300 animate-in slide-in-from-top-3 backdrop-blur">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="font-medium">{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Main Content View Switcher */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'explore' && (
            <ExploreView
              items={items}
              recommendedItems={recommendedItems}
              aiReasoning={aiReasoning}
              currency={currency}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              deliveryFilter={deliveryFilter}
              setDeliveryFilter={setDeliveryFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSelectItem={(item) => setSelectedItem(item)}
              onOpenSellModal={() => setIsSellModalOpen(true)}
              onToggleLike={handleToggleLike}
              likedItemIds={likedItemIds}
              onOpenLaunchHub={() => setIsLaunchHubOpen(true)}
              onOpenPromoteModal={(item) => {
                setPromoteItemId(item?.id);
                setIsPromoteModalOpen(true);
              }}
            />
          )}

          {activeTab === 'search' && (
            <ExploreView
              items={items}
              recommendedItems={[]}
              aiReasoning=""
              currency={currency}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              deliveryFilter={deliveryFilter}
              setDeliveryFilter={setDeliveryFilter}
              searchQuery={searchQuery || ' '}
              setSearchQuery={setSearchQuery}
              onSelectItem={(item) => setSelectedItem(item)}
              onOpenSellModal={() => setIsSellModalOpen(true)}
              onToggleLike={handleToggleLike}
              likedItemIds={likedItemIds}
              onOpenLaunchHub={() => setIsLaunchHubOpen(true)}
              onOpenPromoteModal={(item) => {
                setPromoteItemId(item?.id);
                setIsPromoteModalOpen(true);
              }}
            />
          )}

          {activeTab === 'sell' && (
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 mx-auto shadow-xl">
                <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center text-emerald-400">
                  <Sparkles className="w-8 h-8" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Sell Instantly with AI Appraisal</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Take a photo of any item. Gemini 3.8 Flash categorizes it, detects brand & condition, and recommends the optimum pricing.
                </p>
              </div>
              <button
                onClick={() => setIsSellModalOpen(true)}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm px-6 py-3 rounded-2xl shadow-lg transition"
              >
                Launch AI Camera & Listing Studio
              </button>
            </div>
          )}

          {activeTab === 'chats' && (
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Direct Messages & Offers
                </h3>
                <span className="text-[10px] text-emerald-400 font-semibold">End-to-End Safe</span>
              </div>
              <div className="space-y-2">
                {items.slice(0, 3).map((it) => (
                  <div
                    key={`chat-list-${it.id}`}
                    onClick={() => setChatItem(it)}
                    className="p-3 bg-slate-800/70 border border-slate-700/70 rounded-2xl flex items-center justify-between cursor-pointer hover:border-emerald-500/50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={it.seller.avatar}
                          alt={it.seller.name}
                          className="w-11 h-11 rounded-full object-cover border border-slate-600"
                        />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-900"></span>
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white">{it.seller.name}</h4>
                        <p className="text-[11px] text-slate-400 truncate max-w-[170px]">
                          Re: {it.title}
                        </p>
                        <span className="text-[10px] text-emerald-400 font-semibold">
                          Tap to view offer & chat
                        </span>
                      </div>
                    </div>
                    <img
                      src={it.images[0]}
                      alt=""
                      className="w-11 h-11 rounded-xl object-cover border border-slate-700"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <OrdersVaultView
              items={items}
              currency={currency}
              onReleaseFunds={handleReleaseFunds}
              onOpenDisputeModal={(item) => setDisputeItem(item)}
              onOpenItemDetail={(item) => setSelectedItem(item)}
            />
          )}
        </main>

        {/* Bottom Tab Bar */}
        <BottomTabBar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            if (tab === 'sell') {
              setIsSellModalOpen(true);
            }
          }}
          unreadChatsCount={1}
          activeEscrowOrdersCount={activeEscrowOrdersCount}
        />

        {/* Modals */}
        <ItemDetailModal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          currency={currency}
          isLiked={selectedItem ? likedItemIds.has(selectedItem.id) : false}
          onToggleLike={() => selectedItem && handleToggleLike(selectedItem.id)}
          onOpenChat={(item) => setChatItem(item)}
          onOpenCheckout={(item) => setCheckoutItem(item)}
          onOpenSocialShare={(item) => setShareItem(item)}
        />

        <SellWithAIModal
          isOpen={isSellModalOpen}
          onClose={() => setIsSellModalOpen(false)}
          currency={currency}
          onListingCreated={handleListingCreated}
          onOpenKyc={() => setIsKycModalOpen(true)}
          isKycVerified={isSellerKycVerified}
        />

        <EscrowPaymentModal
          item={checkoutItem}
          isOpen={!!checkoutItem}
          onClose={() => setCheckoutItem(null)}
          currency={currency}
          onPaymentSuccess={handlePaymentSuccess}
        />

        <ChatModal
          isOpen={!!chatItem}
          onClose={() => setChatItem(null)}
          activeItem={chatItem}
          currency={currency}
          onOpenCheckout={(item) => {
            setChatItem(null);
            setCheckoutItem(item);
          }}
        />

        <SocialShareModal
          item={shareItem}
          isOpen={!!shareItem}
          onClose={() => setShareItem(null)}
          currency={currency}
        />

        <StoreSubmissionModal
          isOpen={isStoreModalOpen}
          onClose={() => setIsStoreModalOpen(false)}
        />

        <AdminDashboardModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          currency={currency}
          onDisputeResolved={loadMarketplaceData}
        />

        <NotificationsModal
          isOpen={isNotifsModalOpen}
          onClose={() => setIsNotifsModalOpen(false)}
          notifications={notifications}
          onMarkAllRead={() => {
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
          }}
        />

        <DisputeModal
          item={disputeItem}
          isOpen={!!disputeItem}
          onClose={() => setDisputeItem(null)}
          onDisputeSubmitted={handleDisputeSubmitted}
        />

        <SafetyGuaranteeModal
          isOpen={isSafetyModalOpen}
          onClose={() => setIsSafetyModalOpen(false)}
        />

        <LaunchStrategyModal
          isOpen={isLaunchHubOpen}
          onClose={() => setIsLaunchHubOpen(false)}
          currency={currency}
        />

        <PromoteListingModal
          isOpen={isPromoteModalOpen}
          onClose={() => setIsPromoteModalOpen(false)}
          listings={items}
          preselectedItemId={promoteItemId}
          currency={currency}
          onAdActivated={(receipt, revRecord) => {
            loadMarketplaceData();
            showToast(`🚀 Ad Activated! Payment of Ksh ${revRecord.amountKES.toLocaleString()} deposited directly to M-PESA +254705436332`);
          }}
        />

        <SellerKYCModal
          isOpen={isKycModalOpen}
          onClose={() => setIsKycModalOpen(false)}
          onKycCompleted={(sellerProfile) => {
            setIsKycModalOpen(false);
            setIsSellerKycVerified(true);
            showToast(`✅ KYC Verified! Welcome ${sellerProfile.name}. You are authorized to list resale items.`);
            setIsSellModalOpen(true);
          }}
        />
      </div>
    </DeviceFrame>
  );
}

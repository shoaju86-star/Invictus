import React from 'react';
import { Compass, Search, Camera, MessageSquare, ShieldCheck } from 'lucide-react';

export type TabType = 'explore' | 'search' | 'sell' | 'chats' | 'orders';

interface BottomTabBarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  unreadChatsCount: number;
  activeEscrowOrdersCount: number;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  setActiveTab,
  unreadChatsCount,
  activeEscrowOrdersCount,
}) => {
  return (
    <nav className="sticky bottom-0 z-30 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-3 py-1.5 flex items-center justify-around shadow-lg select-none">
      {/* Explore Tab */}
      <button
        id="tab-explore-btn"
        onClick={() => setActiveTab('explore')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
          activeTab === 'explore' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Compass className={`w-5 h-5 ${activeTab === 'explore' ? 'stroke-[2.5]' : 'stroke-2'}`} />
        <span className="text-[10px] tracking-tight">Explore</span>
      </button>

      {/* Search Tab */}
      <button
        id="tab-search-btn"
        onClick={() => setActiveTab('search')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
          activeTab === 'search' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Search className={`w-5 h-5 ${activeTab === 'search' ? 'stroke-[2.5]' : 'stroke-2'}`} />
        <span className="text-[10px] tracking-tight">Search</span>
      </button>

      {/* Center "Sell with AI" Action Button */}
      <button
        id="tab-sell-btn"
        onClick={() => setActiveTab('sell')}
        className="relative -top-3 flex flex-col items-center group cursor-pointer"
        title="List an item quickly with AI visual appraisal"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/30 group-hover:scale-105 group-active:scale-95 transition-all">
          <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
            <Camera className="w-6 h-6 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
          </div>
        </div>
        <span className="text-[10px] font-extrabold text-emerald-400 mt-0.5 tracking-tight flex items-center gap-0.5">
          AI Sell
        </span>
      </button>

      {/* In-App Chats Tab */}
      <button
        id="tab-chats-btn"
        onClick={() => setActiveTab('chats')}
        className={`relative flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
          activeTab === 'chats' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <div className="relative">
          <MessageSquare className={`w-5 h-5 ${activeTab === 'chats' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          {unreadChatsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 text-slate-950 text-[9px] font-black rounded-full flex items-center justify-center">
              {unreadChatsCount}
            </span>
          )}
        </div>
        <span className="text-[10px] tracking-tight">Chats</span>
      </button>

      {/* Escrow Orders & Vault Tab */}
      <button
        id="tab-orders-btn"
        onClick={() => setActiveTab('orders')}
        className={`relative flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
          activeTab === 'orders' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <div className="relative">
          <ShieldCheck className={`w-5 h-5 ${activeTab === 'orders' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          {activeEscrowOrdersCount > 0 && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-cyan-500 text-slate-950 text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">
              {activeEscrowOrdersCount}
            </span>
          )}
        </div>
        <span className="text-[10px] tracking-tight">Escrow</span>
      </button>
    </nav>
  );
};

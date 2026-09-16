import React from 'react';
import { Bell, MapPin, ShieldAlert, Sparkles, Shield, ChevronDown, Rocket } from 'lucide-react';

interface NavbarProps {
  currentCity: string;
  onChangeCity: () => void;
  unreadNotifsCount: number;
  onOpenNotifications: () => void;
  onOpenAdmin: () => void;
  onOpenSafetyModal: () => void;
  onOpenLaunchHub: () => void;
  onOpenPromoteModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCity,
  onChangeCity,
  unreadNotifsCount,
  onOpenNotifications,
  onOpenAdmin,
  onOpenSafetyModal,
  onOpenLaunchHub,
  onOpenPromoteModal,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-3.5 py-2.5 flex items-center justify-between gap-1.5">
      {/* Brand & Location */}
      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-1 cursor-pointer">
          <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            INVICTUS
          </span>
        </div>

        {/* Location selector */}
        <button
          id="location-picker-btn"
          onClick={onChangeCity}
          className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-[10px] sm:text-[11px] font-medium text-slate-300 hover:text-white hover:border-slate-600 transition"
        >
          <MapPin className="w-3 h-3 text-emerald-400" />
          <span className="truncate max-w-[70px] sm:max-w-[85px]">{currentCity}</span>
          <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
        </button>
      </div>

      {/* Quick Action Badges */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {/* Treasury (+254705436332) Revenue Portal */}
        <button
          id="nav-mpesa-treasury-btn"
          onClick={onOpenAdmin}
          className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-[10px] sm:text-[11px] font-mono font-bold text-emerald-300 hover:bg-emerald-500/25 transition shadow-sm"
          title="M-PESA Revenue Treasury: All income routed directly to +254705436332"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>M-PESA +254705436332</span>
        </button>

        {/* Promote Listing / Ads */}
        {onOpenPromoteModal && (
          <button
            id="nav-promote-ads-btn"
            onClick={onOpenPromoteModal}
            className="hidden xs:flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] sm:text-[11px] font-bold text-amber-300 hover:bg-amber-500/25 transition"
            title="In-App Ad & Listing Boost Manager"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">Boost</span>
          </button>
        )}

        {/* Go-To-Market & Growth Hub */}
        <button
          id="launch-growth-btn"
          onClick={onOpenLaunchHub}
          className="hidden sm:flex px-2 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] font-bold text-slate-300 hover:text-white transition items-center gap-1 shadow-sm"
          title="Open 4-Stage Pre-Launch, Launch, Growth & Expansion Strategy Hub"
        >
          <Rocket className="w-3 h-3 text-emerald-400" />
          <span>Growth</span>
        </button>

        {/* Notifications Icon */}
        <button
          id="notifications-bell-btn"
          onClick={onOpenNotifications}
          className="relative p-1.5 sm:p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotifsCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
              {unreadNotifsCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

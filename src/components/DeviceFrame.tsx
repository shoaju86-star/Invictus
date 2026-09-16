import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, ShieldCheck, Download, Sparkles, Radio } from 'lucide-react';

interface DeviceFrameProps {
  children: React.ReactNode;
  activeDevice: 'iphone' | 'pixel' | 'responsive';
  setActiveDevice: (device: 'iphone' | 'pixel' | 'responsive') => void;
  currency: 'USD' | 'KES';
  setCurrency: (c: 'USD' | 'KES') => void;
  onOpenStoreModal: () => void;
  unreadNotifsCount: number;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  children,
  activeDevice,
  setActiveDevice,
  currency,
  setCurrency,
  onOpenStoreModal,
  unreadNotifsCount,
}) => {
  const [currentTime, setCurrentTime] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start selection:bg-emerald-500 selection:text-white">
      {/* Top Environment & Device Controls Bar */}
      <header className="w-full bg-slate-900/90 backdrop-blur border-b border-slate-800 px-4 py-2.5 z-40 sticky top-0 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20">
              <img src="/icon.svg" alt="Invictus" className="w-full h-full object-contain rounded-[10px]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white">INVICTUS</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded">
                  Store Ready
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Cross-Platform Resale • M-PESA & Global Escrow</p>
            </div>
          </div>
        </div>

        {/* Device Switcher & Controls */}
        <div className="flex items-center gap-2">
          {/* Currency Toggle */}
          <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700 text-xs">
            <button
              id="currency-usd-btn"
              onClick={() => setCurrency('USD')}
              className={`px-2.5 py-1 rounded font-semibold transition-all ${
                currency === 'USD' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              USD ($)
            </button>
            <button
              id="currency-kes-btn"
              onClick={() => setCurrency('KES')}
              className={`px-2.5 py-1 rounded font-semibold transition-all ${
                currency === 'KES' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              KES (Ksh)
            </button>
          </div>

          {/* Device Frame View Buttons */}
          <div className="hidden sm:flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700 text-xs">
            <button
              id="device-iphone-btn"
              onClick={() => setActiveDevice('iphone')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-medium transition-all ${
                activeDevice === 'iphone'
                  ? 'bg-slate-700 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="iPhone 16 Pro Frame"
            >
              <Smartphone className="w-3.5 h-3.5 text-blue-400" />
              <span>iOS</span>
            </button>
            <button
              id="device-pixel-btn"
              onClick={() => setActiveDevice('pixel')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-medium transition-all ${
                activeDevice === 'pixel'
                  ? 'bg-slate-700 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Google Pixel 9 Pro Frame"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Android</span>
            </button>
            <button
              id="device-responsive-btn"
              onClick={() => setActiveDevice('responsive')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-medium transition-all ${
                activeDevice === 'responsive'
                  ? 'bg-slate-700 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Full Responsive View"
            >
              <Monitor className="w-3.5 h-3.5 text-purple-400" />
              <span>Full View</span>
            </button>
          </div>

          {/* App Store & Play Store Technical Export Sheet */}
          <button
            id="store-submission-btn"
            onClick={onOpenStoreModal}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md transition-all active:scale-95"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Play & App Store Package</span>
            <span className="md:hidden">Stores</span>
          </button>
        </div>
      </header>

      {/* Main Container Area */}
      <main className="w-full flex-1 flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-x-hidden">
        {activeDevice === 'responsive' ? (
          // Full responsive container
          <div className="w-full max-w-5xl bg-slate-900 border border-slate-800 sm:rounded-2xl shadow-2xl overflow-hidden min-h-[85vh] flex flex-col">
            {children}
          </div>
        ) : (
          // Simulated Smartphone Frame
          <div className="relative my-2 sm:my-4 transition-all duration-300">
            {/* Phone Outer Shell */}
            <div
              className={`relative mx-auto bg-slate-950 border-[9px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden transition-all duration-300 flex flex-col ${
                activeDevice === 'iphone'
                  ? 'w-[390px] h-[830px] rounded-[52px] border-slate-800'
                  : 'w-[392px] h-[834px] rounded-[44px] border-slate-700'
              }`}
            >
              {/* Dynamic Island / Punch hole camera */}
              {activeDevice === 'iphone' ? (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-50 flex items-center justify-between px-3 text-[10px] text-slate-400 shadow-sm border border-slate-800/40">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                    <span className="w-1 h-1 rounded-full bg-blue-500/80 animate-pulse"></span>
                  </div>
                  <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-1">
                    <Radio className="w-2.5 h-2.5 animate-spin" /> Escrow 🔒
                  </span>
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800"></div>
                </div>
              ) : (
                // Pixel Punch-hole
                <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-50 border border-slate-800/60"></div>
              )}

              {/* Status Bar */}
              <div className="w-full pt-3 px-6 pb-1 bg-slate-900/90 text-slate-300 flex items-center justify-between text-xs font-semibold z-40 select-none">
                <span>{currentTime}</span>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span>5G</span>
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L12 22l7.03-4.39C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9z" />
                  </svg>
                  <div className="w-5 h-2.5 border border-slate-400 rounded-sm p-0.5 flex items-center">
                    <div className="h-full w-4/5 bg-emerald-400 rounded-2xs"></div>
                  </div>
                </div>
              </div>

              {/* Internal App Scrollable Window */}
              <div className="flex-1 w-full bg-slate-900 overflow-y-auto overflow-x-hidden flex flex-col relative">
                {children}
              </div>

              {/* Home Indicator Bar */}
              <div className="w-full py-2 bg-slate-900 flex justify-center items-center z-40">
                <div className="w-32 h-1 bg-slate-600 rounded-full"></div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

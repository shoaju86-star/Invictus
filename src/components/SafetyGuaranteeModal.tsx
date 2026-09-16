import React from 'react';
import { X, ShieldCheck, MapPin, CheckCircle2, Lock, Smartphone, Truck } from 'lucide-react';

interface SafetyGuaranteeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyGuaranteeModal: React.FC<SafetyGuaranteeModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-6 duration-200">
        <div className="px-4 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/95">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Invictus Trust & Safety</h3>
              <p className="text-[11px] text-slate-400">100% Escrow Buyer & Seller Protection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4 text-xs overflow-y-auto">
          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-3.5 space-y-1.5">
            <h4 className="font-bold text-emerald-400 flex items-center gap-1.5 text-sm">
              <Lock className="w-4 h-4" /> How Escrow Vault Works
            </h4>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Unlike unmoderated classifieds where buyers hand over cash with zero recourse, Invictus holds your payment in a secure escrow vault until you physically inspect the item or confirm delivery receipt.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 bg-slate-800/70 rounded-2xl border border-slate-700 space-y-1">
              <div className="flex items-center gap-2 font-bold text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Verified Seller IDs</span>
              </div>
              <p className="text-[11px] text-slate-400 pl-6">
                All top sellers submit government-issued identification cards to prevent counterfeiters and scams.
              </p>
            </div>

            <div className="p-3 bg-slate-800/70 rounded-2xl border border-slate-700 space-y-1">
              <div className="flex items-center gap-2 font-bold text-white">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Public Safe Meetup Zones</span>
              </div>
              <p className="text-[11px] text-slate-400 pl-6">
                Meet sellers at designated public shopping malls, coffee houses, or verified police station lobbies with 24/7 CCTV surveillance.
              </p>
            </div>

            <div className="p-3 bg-slate-800/70 rounded-2xl border border-slate-700 space-y-1">
              <div className="flex items-center gap-2 font-bold text-white">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>M-PESA & Global Payment Security</span>
              </div>
              <p className="text-[11px] text-slate-400 pl-6">
                Integrated with Safaricom Daraja API, Apple Pay, Google Pay, and Visa/Mastercard. Never wire cash directly to private numbers.
              </p>
            </div>

            <div className="p-3 bg-slate-800/70 rounded-2xl border border-slate-700 space-y-1">
              <div className="flex items-center gap-2 font-bold text-white">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>Tracked Shipping Protection</span>
              </div>
              <p className="text-[11px] text-slate-400 pl-6">
                Every package dispatched includes courier tracking. If an item is lost or arrives broken, full refund is guaranteed.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl transition shadow"
          >
            Got It, Back to Marketplace
          </button>
        </div>
      </div>
    </div>
  );
};

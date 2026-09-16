import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  ExternalLink,
  MessageCircle,
  Instagram,
  QrCode
} from 'lucide-react';
import { ListingItem } from '../types';

interface SocialShareModalProps {
  item: ListingItem | null;
  isOpen: boolean;
  onClose: () => void;
  currency: 'USD' | 'KES';
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  item,
  isOpen,
  onClose,
  currency,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !item) return null;

  const priceText = currency === 'KES' ? `Ksh ${item.priceKES.toLocaleString()}` : `$${item.priceUSD}`;
  const shareUrl = `${window.location.origin}/item/${item.id}`;
  const shareText = `🔥 Check out "${item.title}" for ${priceText} on Invictus! 100% Escrow Buyer Protection & M-PESA supported: ${shareUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: `Selling on Invictus: ${item.title} for ${priceText}`,
        url: shareUrl,
      }).catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-6 duration-200">
        
        {/* Header */}
        <div className="px-4 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/95">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Share Listing</h3>
              <p className="text-[11px] text-slate-400">Boost views on WhatsApp & Instagram</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Visual Story Card Preview */}
          <div className="relative aspect-4/5 rounded-2xl overflow-hidden border border-slate-700 shadow-xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 flex flex-col justify-between p-3.5">
            <img
              src={item.images[0]}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover opacity-35"
            />
            
            {/* Top Branding Pill */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider text-emerald-400 border border-emerald-500/40">
                INVICTUS RESALE
              </div>
              <div className="bg-emerald-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full">
                100% ESCROW PROTECTED
              </div>
            </div>

            {/* Bottom Card Info */}
            <div className="relative z-10 bg-slate-900/90 backdrop-blur-md rounded-xl p-3 border border-slate-700/80 space-y-1.5">
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-black text-white">{priceText}</span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded">
                  {item.condition}
                </span>
              </div>
              <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
              <p className="text-[10px] text-slate-400 truncate">
                Seller: {item.seller.name} • {item.seller.city}
              </p>
            </div>
          </div>

          {/* Social Channels Row */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* WhatsApp */}
            <button
              id="whatsapp-share-btn"
              onClick={handleWhatsAppShare}
              className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-md active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Share to WhatsApp</span>
            </button>

            {/* Instagram Story */}
            <button
              id="instagram-share-btn"
              onClick={handleCopyLink}
              className="p-3 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-md active:scale-95"
            >
              <Instagram className="w-4 h-4" />
              <span>Instagram Story Link</span>
            </button>
          </div>

          {/* Direct Copy Link Bar */}
          <div className="bg-slate-800/80 rounded-2xl p-2 pl-3 flex items-center justify-between border border-slate-700">
            <span className="text-xs text-slate-300 font-mono truncate mr-2">
              {shareUrl}
            </span>
            <button
              onClick={handleCopyLink}
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 flex-shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Native Web Share */}
          <button
            onClick={handleNativeShare}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-2.5 rounded-xl border border-slate-700 transition"
          >
            More Sharing Options (SMS, Airdrop, Telegram)
          </button>
        </div>
      </div>
    </div>
  );
};

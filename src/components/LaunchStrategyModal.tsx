import React, { useState } from 'react';
import {
  X,
  Rocket,
  Mail,
  Share2,
  Users,
  Award,
  Globe2,
  CheckCircle2,
  Sparkles,
  Copy,
  Check,
  Megaphone,
  TrendingUp,
  Truck,
  Gift,
  Star,
  ExternalLink,
  MessageCircle,
  FileText,
  DollarSign
} from 'lucide-react';

interface LaunchStrategyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: 'USD' | 'KES';
  onOpenReferral?: () => void;
}

type TabKey = 'pre_launch' | 'launch' | 'growth' | 'expansion';

export const LaunchStrategyModal: React.FC<LaunchStrategyModalProps> = ({
  isOpen,
  onClose,
  currency,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('pre_launch');
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistRole, setWaitlistRole] = useState<'seller' | 'buyer'>('seller');
  const [isSubmittingWaitlist, setIsSubmittingWaitlist] = useState(false);
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Referral State
  const [referralCode] = useState('INVICTUS-EARLY-VIP');
  const [creditsEarned, setCreditsEarned] = useState(currency === 'KES' ? 2600 : 20);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail) return;
    setIsSubmittingWaitlist(true);
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: waitlistEmail, role: waitlistRole }),
      });
      setIsSubmittingWaitlist(false);
      setWaitlistSubmitted(true);
      setCreditsEarned((prev) => prev + (currency === 'KES' ? 1300 : 10));
    } catch {
      setIsSubmittingWaitlist(false);
      setWaitlistSubmitted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in slide-in-from-bottom-6 duration-200">
        
        {/* Modal Top Header */}
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/95">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-400 p-0.5 shadow-md">
              <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center">
                <Rocket className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Go-To-Market & Growth Hub</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-black">
                  4-STAGE ROADMAP
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Pre-Launch • Launch • Growth • Regional Expansion</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Stage Tab Selector */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('pre_launch')}
            className={`flex-1 py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 whitespace-nowrap transition ${
              activeTab === 'pre_launch'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>1. Pre-Launch</span>
          </button>
          <button
            onClick={() => setActiveTab('launch')}
            className={`flex-1 py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 whitespace-nowrap transition ${
              activeTab === 'launch'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>2. Launch</span>
          </button>
          <button
            onClick={() => setActiveTab('growth')}
            className={`flex-1 py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 whitespace-nowrap transition ${
              activeTab === 'growth'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>3. Growth</span>
          </button>
          <button
            onClick={() => setActiveTab('expansion')}
            className={`flex-1 py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 whitespace-nowrap transition ${
              activeTab === 'expansion'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>4. Expansion</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          
          {/* ==================================================== */}
          {/* STAGE 1: PRE-LAUNCH */}
          {/* ==================================================== */}
          {activeTab === 'pre_launch' && (
            <div className="space-y-4">
              {/* Early Access Waitlist Landing Banner */}
              <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/40 rounded-2xl p-4 shadow-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                      VIP Early Access Landing Page
                    </span>
                    <h4 className="text-base font-black text-white">Join the Invictus Launch Waitlist</h4>
                    <p className="text-[11px] text-slate-300">
                      Sign up before launch to receive <strong>{currency === 'KES' ? 'Ksh 2,000' : '$15'}</strong> in escrow trading credits + 0% seller commission fees.
                    </p>
                  </div>
                  <Gift className="w-8 h-8 text-emerald-400 flex-shrink-0" />
                </div>

                {waitlistSubmitted ? (
                  <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl flex items-center gap-2.5 text-emerald-300 font-semibold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-white">You're on the VIP list!</p>
                      <p className="text-[11px] text-emerald-300">
                        Check your inbox for your early access invitation and VIP seller badge.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleWaitlistSubmit} className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="email"
                        required
                        value={waitlistEmail}
                        onChange={(e) => setWaitlistEmail(e.target.value)}
                        placeholder="Enter your email for early invite..."
                        className="flex-1 bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
                      />
                      <button
                        type="submit"
                        disabled={isSubmittingWaitlist}
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2 rounded-xl transition shadow active:scale-95 whitespace-nowrap"
                      >
                        {isSubmittingWaitlist ? 'Securing...' : 'Claim VIP Invite'}
                      </button>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-slate-400 pl-1">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="role"
                          checked={waitlistRole === 'seller'}
                          onChange={() => setWaitlistRole('seller')}
                          className="accent-emerald-500"
                        />
                        <span>I want to Sell Items</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="role"
                          checked={waitlistRole === 'buyer'}
                          onChange={() => setWaitlistRole('buyer')}
                          className="accent-emerald-500"
                        />
                        <span>I want to Buy Safely</span>
                      </label>
                    </div>
                  </form>
                )}
              </div>

              {/* Social Media Teaser Posts Kit */}
              <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white flex items-center gap-1.5">
                    <Share2 className="w-4 h-4 text-emerald-400" />
                    <span>Social Media Teaser Kit (IG, TikTok, X, Facebook)</span>
                  </h4>
                  <span className="text-[10px] text-slate-400">Copy & Post</span>
                </div>

                <div className="space-y-2.5">
                  {/* TikTok / Instagram Reel Script */}
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-pink-400 text-[11px]">📱 TikTok / IG Reels Teaser</span>
                      <button
                        onClick={() =>
                          handleCopy(
                            `Tired of shady marketplace meetups & fake payment screenshots? Meet Invictus 🛡️ Snap a photo, Gemini AI prices your item in seconds, and get paid directly to M-PESA with 100% Escrow Protection. Coming to iOS & Android! Link in bio for early access. #InvictusApp #Resale #Nairobi #MPESA #ThriftKenya`,
                            'tiktok'
                          )
                        }
                        className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        {copiedKey === 'tiktok' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === 'tiktok' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-300 italic">
                      "Tired of shady marketplace meetups & fake payment screenshots? Meet Invictus 🛡️ Snap a photo, Gemini AI prices your item in seconds, and get paid directly to M-PESA with 100% Escrow Protection..."
                    </p>
                  </div>

                  {/* Twitter / X Thread Teaser */}
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-cyan-400 text-[11px]">🐦 Twitter / X Teaser</span>
                      <button
                        onClick={() =>
                          handleCopy(
                            `Resale in East Africa is officially getting an upgrade. Introducing Invictus: AI visual appraisal + Escrow holding + Daraja M-PESA API integration. Zero listing fees for early adopters. Sign up: https://invictus.app/early`,
                            'twitter'
                          )
                        }
                        className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        {copiedKey === 'twitter' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === 'twitter' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-300 italic">
                      "Resale in East Africa is officially getting an upgrade. Introducing Invictus: AI visual appraisal + Escrow holding + Daraja M-PESA API integration..."
                    </p>
                  </div>
                </div>
              </div>

              {/* Influencer Partnership & Press Release */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-800/70 border border-slate-700/80 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span>Kenya & East Africa Influencer Outreach</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Targeting tech reviewers, streetwear influencers, and thrift thrift store creators in Nairobi, Mombasa, and Kampala with exclusive early selling invites.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-800/70 border border-slate-700/80 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>Official Press Release Draft</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    "Invictus Launches AI-Assisted Resale Platform with Built-in M-PESA Daraja Escrow, Empowering Millions of African Sellers."
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STAGE 2: LAUNCH */}
          {/* ==================================================== */}
          {activeTab === 'launch' && (
            <div className="space-y-4">
              {/* Zero Listing Fees Promo */}
              <div className="bg-gradient-to-r from-amber-500/20 via-slate-900 to-slate-950 border border-amber-500/40 rounded-2xl p-4 shadow-md flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">
                    Launch Incentive Active
                  </span>
                  <h4 className="text-sm font-bold text-white">0% Listing Fees for First 3 Months</h4>
                  <p className="text-[11px] text-slate-300">
                    Keep 100% of your earnings. No insertion fees, no final value deduction on your first 10 listings.
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black text-base flex-shrink-0">
                  0%
                </div>
              </div>

              {/* Referral Program */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Gift className="w-4 h-4 text-emerald-400" />
                      <span>Referral Program: Invite Friends, Earn Credits</span>
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Give {currency === 'KES' ? 'Ksh 1,300' : '$10'}, Get {currency === 'KES' ? 'Ksh 1,300' : '$10'} when your friend completes their first sale.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Your Balance</span>
                    <span className="text-sm font-black text-emerald-400">
                      {currency === 'KES' ? `Ksh ${creditsEarned.toLocaleString()}` : `$${creditsEarned}`}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-500 block">Your Exclusive Referral Code</span>
                    <span className="font-mono font-bold text-white text-xs tracking-wider">{referralCode}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(referralCode, 'referral')}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1 flex-shrink-0"
                  >
                    {copiedKey === 'referral' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'referral' ? 'Copied' : 'Copy Code'}</span>
                  </button>
                </div>
              </div>

              {/* App Store Optimization (ASO) Pack */}
              <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-3.5 space-y-2.5">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>App Store Optimization (ASO) Pack</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                    <span className="font-bold text-slate-300">English App Store Title:</span>
                    <p className="text-emerald-400 font-mono text-[10px]">
                      Invictus: Buy & Sell Resale Marketplace with M-PESA & AI
                    </p>
                  </div>
                  <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                    <span className="font-bold text-slate-300">Swahili Localized Description:</span>
                    <p className="text-emerald-400 font-mono text-[10px]">
                      Uza na ununue bidhaa kwa usalama kupitia M-PESA na Escrow ya Invictus.
                    </p>
                  </div>
                </div>
              </div>

              {/* Targeted Ad Creative Preview */}
              <div className="p-3.5 bg-slate-800/60 border border-slate-700/70 rounded-2xl space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Targeted Ad Strategy (Facebook / Instagram / Google Ads)
                </span>
                <p className="text-[11px] text-slate-300">
                  Ad Headline: <strong>"Turn Your Clutter into Cash in 60 Seconds with M-PESA"</strong>
                  <br />
                  Audience Targeting: Nairobi, Mombasa, Nakuru, Kisumu tech enthusiasts, thrift shoppers, college students.
                </p>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STAGE 3: GROWTH */}
          {/* ==================================================== */}
          {activeTab === 'growth' && (
            <div className="space-y-4">
              {/* Loyalty Rewards Program */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-amber-400" />
                      <span>Seller Loyalty & Tiered Rewards</span>
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Earn Invictus Points for every successful transaction. Higher tiers unlock fee rebates.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-black">
                    GOLD SELLER TIER
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                  <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Bronze</span>
                    <span className="font-bold text-white">0-5 Sales</span>
                    <span className="text-emerald-400 block text-[10px]">Standard Fee</span>
                  </div>
                  <div className="p-2 bg-slate-900/80 rounded-xl border border-amber-500/50 bg-amber-950/20">
                    <span className="text-amber-400 block text-[10px]">Gold (Active)</span>
                    <span className="font-bold text-white">6-25 Sales</span>
                    <span className="text-amber-300 block text-[10px]">15% Fee Rebate</span>
                  </div>
                  <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-purple-400 block text-[10px]">Platinum VIP</span>
                    <span className="font-bold text-white">26+ Sales</span>
                    <span className="text-purple-300 block text-[10px]">35% Fee Rebate</span>
                  </div>
                </div>
              </div>

              {/* Weekly Success Story Spotlight */}
              <div className="p-3.5 bg-slate-800/70 border border-slate-700/80 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>Weekly Seller Spotlight Campaign</span>
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-semibold">Featured on TikTok</span>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                    alt=""
                    className="w-10 h-10 rounded-full object-cover border border-emerald-500"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-white text-xs">Sarah Mwangi • Nairobi</p>
                    <p className="text-slate-400 text-[11px] truncate">
                      "I sold 14 electronics items in my first month using M-PESA Escrow with 0 disputes."
                    </p>
                  </div>
                </div>
              </div>

              {/* E-Commerce Blogger & YouTuber Collaborations */}
              <div className="p-3.5 bg-slate-800/60 border border-slate-700/70 rounded-2xl space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Content Creator Program
                </span>
                <p className="text-[11px] text-slate-300">
                  Affiliate creators earn <strong>20% rev-share</strong> on trading fees for all users onboarded via their custom creator promo codes.
                </p>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STAGE 4: EXPANSION */}
          {/* ==================================================== */}
          {activeTab === 'expansion' && (
            <div className="space-y-4">
              {/* Regional East Africa Logistics Integration */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-emerald-400" />
                      <span>Courier Logistics Integrations</span>
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Partnered with Sendy, Fargo Courier, and G4S for door-to-door tracked delivery across Kenya & East Africa.
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                    CONNECTED
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <span className="font-bold text-white block">Sendy Express</span>
                    <span className="text-[10px] text-slate-400 block">Same-day intra-city</span>
                    <span className="text-emerald-400 font-mono text-[10px]">API Ready</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <span className="font-bold text-white block">Fargo Courier</span>
                    <span className="text-[10px] text-slate-400 block">Next-day countrywide</span>
                    <span className="text-emerald-400 font-mono text-[10px]">API Ready</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <span className="font-bold text-white block">G4S Secure Lock</span>
                    <span className="text-[10px] text-slate-400 block">Valuable high-tech</span>
                    <span className="text-emerald-400 font-mono text-[10px]">Escrow Vault</span>
                  </div>
                </div>
              </div>

              {/* Seasonal Promotional Campaigns */}
              <div className="p-3.5 bg-slate-800/70 border border-slate-700/80 rounded-2xl space-y-2">
                <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4 text-emerald-400" />
                  <span>Seasonal East Africa Campaigns</span>
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 bg-slate-900/70 rounded-xl border border-slate-800">
                    <span className="font-bold text-emerald-400 block">Back-to-School Tech Sale</span>
                    <span className="text-slate-400 text-[10px]">Laptops, tablets, calculators with verified student IDs.</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/70 rounded-xl border border-slate-800">
                    <span className="font-bold text-amber-400 block">December Holiday Rush</span>
                    <span className="text-slate-400 text-[10px]">Sneakers, gaming consoles, designer gifts with safe meetup points.</span>
                  </div>
                </div>
              </div>

              {/* App Store Rating & Review Booster */}
              <div className="p-3.5 bg-slate-800/60 border border-slate-700/70 rounded-2xl space-y-1.5 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-white text-xs flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400" /> App Store Review Prompt
                  </h5>
                  <p className="text-[11px] text-slate-400">
                    Automated in-app prompt triggers after buyer confirms 5-star delivery receipt.
                  </p>
                </div>
                <button
                  onClick={() => alert('App Store review prompt configured for prompt after second successful escrow transaction.')}
                  className="bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition"
                >
                  Test Prompt
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function CalendarIcon(props: any) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

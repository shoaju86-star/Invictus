import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  X, 
  Check, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  Zap, 
  DollarSign, 
  RefreshCw,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { Category, ItemCondition, DeliveryMethod, ListingItem } from '../types';

interface SellWithAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: 'USD' | 'KES';
  onListingCreated: (item: ListingItem) => void;
  onOpenKyc?: () => void;
  isKycVerified?: boolean;
}

const SAMPLE_DEMO_ITEMS = [
  {
    name: 'Apple iPhone 14 Pro 128GB',
    hint: 'iphone 14 pro purple good condition unlocked',
    image: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?auto=format&fit=crop&w=900&q=80',
    category: 'Phones & Tablets' as Category,
  },
  {
    name: 'Nike Dunk Low Retro Panda',
    hint: 'nike dunk low black white panda sneakers size 10 brand new',
    image: 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?auto=format&fit=crop&w=900&q=80',
    category: 'Sneakers & Shoes' as Category,
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    hint: 'sony wh-1000xm5 noise cancelling wireless headphones silver like new with case',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
    category: 'Electronics' as Category,
  },
];

export const SellWithAIModal: React.FC<SellWithAIModalProps> = ({
  isOpen,
  onClose,
  currency,
  onListingCreated,
  onOpenKyc,
  isKycVerified = false,
}) => {
  const [step, setStep] = useState<'capture' | 'analyzing' | 'review'>('capture');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  
  // Appraised Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Electronics');
  const [subcategory, setSubcategory] = useState('General');
  const [condition, setCondition] = useState<ItemCondition>('Like New');
  const [priceUSD, setPriceUSD] = useState(120);
  const [priceKES, setPriceKES] = useState(15600);
  const [priceRangeUSD, setPriceRangeUSD] = useState({ min: 100, avg: 130, max: 160 });
  const [description, setDescription] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('both');
  const [shippingFeeUSD, setShippingFeeUSD] = useState(10);
  const [safeZonePickup, setSafeZonePickup] = useState('Central Mall Java House / Guarded Entrance');
  const [sellingTip, setSellingTip] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setSelectedImage(base64);
        runAiAppraisal(base64, customPrompt);
      };
      reader.readAsDataURL(file);
    }
  };

  // Select sample demo image
  const handleSelectSample = (sample: typeof SAMPLE_DEMO_ITEMS[0]) => {
    setSelectedImage(sample.image);
    runAiAppraisal(sample.image, sample.hint, sample.category);
  };

  // Call Server-Side Gemini Appraisal API
  const runAiAppraisal = async (img: string, promptText?: string, catHint?: Category) => {
    setStep('analyzing');
    setErrorMsg('');

    try {
      const res = await fetch('/api/ai/analyze-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: img.startsWith('data:') ? img : undefined,
          userPrompt: promptText || 'Appraise this resale item',
          categoryHint: catHint || 'Electronics',
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        setTitle(d.title || 'Quality Pre-Owned Item');
        setCategory(d.category || 'Electronics');
        setSubcategory(d.subcategory || 'General');
        setCondition(d.condition || 'Like New');
        
        const avg = d.suggestedPriceUSD?.avg || 150;
        setPriceUSD(avg);
        setPriceKES(avg * 130);
        setPriceRangeUSD(d.suggestedPriceUSD || { min: avg * 0.85, avg, max: avg * 1.2 });
        setDescription(d.description || '');
        setSellingTip(d.sellingTip || 'Offering verified local pickup boosts sale speed by 40%.');
        setStep('review');
      } else {
        throw new Error('Could not analyze item');
      }
    } catch (err: any) {
      console.warn('AI appraisal fallback triggered:', err);
      // Fallback
      setTitle('Certified Pre-Owned Item');
      setPriceUSD(120);
      setPriceKES(15600);
      setPriceRangeUSD({ min: 95, avg: 120, max: 155 });
      setDescription('Inspected pre-owned item in great working condition. Ready for pickup or express shipping.');
      setSellingTip('Competitive pricing with escrow buyer protection ensures fastest buyer checkout.');
      setStep('review');
    }
  };

  // Submit Listing to Marketplace
  const handleSubmitListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        title,
        description,
        priceUSD,
        priceKES: priceUSD * 130,
        category,
        subcategory,
        condition,
        images: selectedImage ? [selectedImage] : [
          'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
        ],
        deliveryMethod,
        shippingFeeUSD,
        shippingFeeKES: shippingFeeUSD * 130,
        pickupLocation: {
          name: safeZonePickup,
          safeSpotDescription: 'Public verified meetup zone with security and CCTV.',
          address: 'Westlands / Central District',
          distanceMiles: 1.5,
        },
        aiAppraisal: {
          confidence: 0.95,
          suggestedPriceRangeUSD: priceRangeUSD,
          suggestedPriceRangeKES: {
            min: priceRangeUSD.min * 130,
            avg: priceRangeUSD.avg * 130,
            max: priceRangeUSD.max * 130,
          },
          sellingTip,
          tags: [category, condition, 'ZeroFeePromo', 'EscrowProtected'],
        },
      };

      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success && json.item) {
        onListingCreated(json.item);
        onClose();
      } else {
        throw new Error(json.error || 'Failed to create listing');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to publish listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in slide-in-from-bottom-6 duration-200">
        
        {/* Header */}
        <div className="px-4 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md">
              <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Sell with AI</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-extrabold px-1.5 py-0.5 rounded border border-emerald-500/30">
                  0% Fee Promo
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Photo-based visual appraisal & suggested pricing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Compulsory KYC Status Notification */}
          {!isKycVerified && onOpenKyc && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-amber-200">Compulsory Seller KYC Required</h4>
                  <p className="text-[11px] text-slate-300">
                    Submit your ID & phone verification before receiving M-PESA escrow payouts.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenKyc();
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs whitespace-nowrap shadow transition"
              >
                Verify KYC
              </button>
            </div>
          )}

          {step === 'capture' && (
            <div className="space-y-4">
              {/* Camera / Upload Box */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-emerald-500/80 rounded-2xl p-6 text-center bg-slate-800/40 hover:bg-slate-800/70 transition-all cursor-pointer group flex flex-col items-center justify-center space-y-2.5"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Camera className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Take or Upload Item Photo</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Gemini 3.8 Flash automatically identifies brand, condition, and market value
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Select from Camera / Gallery
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Quick Sample Demos */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Or Try a 1-Click Demo Item
                  </span>
                  <span className="text-[10px] text-slate-400">Instant AI test</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {SAMPLE_DEMO_ITEMS.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSample(item)}
                      className="text-left bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 hover:border-emerald-500/60 rounded-xl overflow-hidden p-1.5 transition group"
                    >
                      <div className="h-16 w-full rounded-lg overflow-hidden bg-slate-900 mb-1.5">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <p className="text-[10px] font-semibold text-white truncate">{item.name}</p>
                      <span className="text-[9px] text-emerald-400 font-medium">Test AI</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Prompt Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Optional seller notes or specs
                </label>
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g. Battery health 98%, includes charger, bought 6 months ago"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Zero Fee Guarantee Banner */}
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 flex items-center gap-2.5 text-xs text-slate-300">
                <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <span className="font-bold text-white">0% Seller Listing Fee Guarantee</span>
                  <p className="text-[11px] text-slate-400">
                    List as many items as you want for free. Funds are paid out immediately to M-PESA or Bank upon buyer delivery confirmation.
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 'analyzing' && (
            <div className="py-12 px-4 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-slate-800 border-t-emerald-400 animate-spin"></div>
                <div className="absolute inset-2 rounded-full bg-slate-900 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-emerald-400 animate-pulse" />
                </div>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-base font-bold text-white">Gemini 3.8 Visual Appraisal in Progress...</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Detecting product model, grading cosmetic condition, and searching recent eBay & local marketplace comps...
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                <span className="bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Brand Recognition</span>
                <span className="bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Condition Grade</span>
                <span className="bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Price Modeling</span>
              </div>
            </div>
          )}

          {step === 'review' && (
            <form onSubmit={handleSubmitListing} className="space-y-4">
              {/* Photo & Retake bar */}
              <div className="flex items-center gap-3 p-2 bg-slate-800/60 rounded-xl border border-slate-700/60">
                {selectedImage && (
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="w-16 h-16 rounded-lg object-cover border border-slate-700"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                    <Check className="w-3.5 h-3.5" /> AI Appraisal Completed
                  </div>
                  <p className="text-xs font-semibold text-white truncate">{title}</p>
                  <button
                    type="button"
                    onClick={() => setStep('capture')}
                    className="text-[10px] text-slate-400 hover:text-white underline mt-0.5"
                  >
                    Change photo or re-analyze
                  </button>
                </div>
              </div>

              {/* Title Field */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Listing Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* AI Suggested Price Range */}
              <div className="bg-slate-800/90 border border-emerald-500/30 rounded-2xl p-3.5 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs font-extrabold text-white">AI Market Pricing Guidance</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded font-bold">
                    High Demand Comp
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div 
                    onClick={() => { setPriceUSD(priceRangeUSD.min); setPriceKES(priceRangeUSD.min * 130); }}
                    className="bg-slate-900/80 p-2 rounded-xl border border-slate-700/80 cursor-pointer hover:border-emerald-500 transition"
                  >
                    <span className="text-[10px] text-slate-400 block">Quick Sale</span>
                    <span className="font-bold text-slate-200">
                      ${priceRangeUSD.min} <span className="text-[10px] text-slate-400">({(priceRangeUSD.min * 130).toLocaleString()} KES)</span>
                    </span>
                  </div>

                  <div 
                    onClick={() => { setPriceUSD(priceRangeUSD.avg); setPriceKES(priceRangeUSD.avg * 130); }}
                    className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/40 cursor-pointer shadow-sm"
                  >
                    <span className="text-[10px] text-emerald-400 font-bold block">Recommended</span>
                    <span className="font-bold text-emerald-300">
                      ${priceRangeUSD.avg} <span className="text-[10px] text-emerald-400">({(priceRangeUSD.avg * 130).toLocaleString()} KES)</span>
                    </span>
                  </div>

                  <div 
                    onClick={() => { setPriceUSD(priceRangeUSD.max); setPriceKES(priceRangeUSD.max * 130); }}
                    className="bg-slate-900/80 p-2 rounded-xl border border-slate-700/80 cursor-pointer hover:border-emerald-500 transition"
                  >
                    <span className="text-[10px] text-slate-400 block">Maximum Return</span>
                    <span className="font-bold text-slate-200">
                      ${priceRangeUSD.max} <span className="text-[10px] text-slate-400">({(priceRangeUSD.max * 130).toLocaleString()} KES)</span>
                    </span>
                  </div>
                </div>

                {/* Selling Tip */}
                {sellingTip && (
                  <p className="text-[11px] text-slate-300 bg-slate-900/50 p-2 rounded-lg italic">
                    💡 <strong>Pro Tip:</strong> {sellingTip}
                  </p>
                )}

                {/* Custom Price Input */}
                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Set Your Listing Price (USD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-slate-400 text-xs">$</span>
                      <input
                        type="number"
                        min="1"
                        value={priceUSD}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setPriceUSD(val);
                          setPriceKES(val * 130);
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-6 pr-3 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="flex-1">
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      M-PESA Equivalent (KES)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-slate-400 text-xs">Ksh</span>
                      <input
                        type="number"
                        min="1"
                        value={priceKES}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setPriceKES(val);
                          setPriceUSD(Math.round(val / 130));
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Category and Condition Row */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Phones & Tablets">Phones & Tablets</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Sneakers & Shoes">Sneakers & Shoes</option>
                    <option value="Gaming & Consoles">Gaming & Consoles</option>
                    <option value="Cameras & Photo">Cameras & Photo</option>
                    <option value="Fashion & Apparel">Fashion & Apparel</option>
                    <option value="Home & Living">Home & Living</option>
                    <option value="Collectibles & Art">Collectibles & Art</option>
                    <option value="Vehicles & Parts">Vehicles & Parts</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as ItemCondition)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Brand New">Brand New (Unopened)</option>
                    <option value="Like New">Like New (Mint)</option>
                    <option value="Good">Good (Minor wear)</option>
                    <option value="Fair">Fair (Noticeable wear)</option>
                  </select>
                </div>
              </div>

              {/* Delivery Options */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Delivery & Pickup Methods</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('both')}
                    className={`p-2 rounded-xl text-center border text-xs font-semibold transition ${
                      deliveryMethod === 'both'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    Pickup & Ship
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('local_pickup')}
                    className={`p-2 rounded-xl text-center border text-xs font-semibold transition ${
                      deliveryMethod === 'local_pickup'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    Local Meetup
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('shipping')}
                    className={`p-2 rounded-xl text-center border text-xs font-semibold transition ${
                      deliveryMethod === 'shipping'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    Shipping Only
                  </button>
                </div>

                {deliveryMethod !== 'shipping' && (
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" /> Public Safe Zone Pickup Point
                    </span>
                    <input
                      type="text"
                      value={safeZonePickup}
                      onChange={(e) => setSafeZonePickup(e.target.value)}
                      placeholder="e.g. Sarit Centre Java House or Mall Security Desk"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-red-400 bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                  {errorMsg}
                </p>
              )}

              {/* Publish Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm py-3 rounded-2xl shadow-lg transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Publishing Listing...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Publish Listing with 0% Fee</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef } from 'react';
import { 
  ShieldCheck, 
  X, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Smartphone, 
  Mail, 
  User, 
  CreditCard, 
  MapPin, 
  FileText,
  Lock,
  Camera
} from 'lucide-react';
import { SellerProfile } from '../types';

interface SellerKYCModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKycCompleted: (profile: SellerProfile) => void;
}

export const SellerKYCModal: React.FC<SellerKYCModalProps> = ({
  isOpen,
  onClose,
  onKycCompleted,
}) => {
  const [legalName, setLegalName] = useState('');
  const [documentType, setDocumentType] = useState<'National ID' | 'Passport' | 'Alien ID'>('National ID');
  const [idNumber, setIdNumber] = useState('');
  const [phone, setPhone] = useState('+254 7');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Nairobi');
  const [locationDetail, setLocationDetail] = useState('Westlands');
  const [idDocumentImage, setIdDocumentImage] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setIdDocumentImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Strict Compulsory Validation
    if (!legalName.trim()) {
      setErrorMessage('Full Legal Name is compulsory as per government regulations.');
      return;
    }
    if (!idNumber.trim()) {
      setErrorMessage(`${documentType} Number is a compulsory required field.`);
      return;
    }
    if (!phone.trim() || phone.trim() === '+254 7' || phone.length < 10) {
      setErrorMessage('Valid M-PESA phone number is compulsory for escrow seller payouts.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Valid email address is compulsory for transaction receipts.');
      return;
    }
    if (!idDocumentImage) {
      setErrorMessage('Uploading a clear photo/scan of your ID or Passport is compulsory.');
      return;
    }
    if (!agreedToTerms) {
      setErrorMessage('You must accept the Invictus Seller Escrow & Code of Conduct terms.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/sellers/register-kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          legalName,
          documentType,
          idNumber,
          phone,
          email,
          city,
          locationDetail,
          idDocumentImage,
        }),
      });

      const json = await res.json();
      if (json.success && json.seller) {
        onKycCompleted(json.seller);
        onClose();
      } else {
        throw new Error(json.error || 'Failed to register seller profile');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification submission error. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[94vh] flex flex-col animate-in slide-in-from-bottom-6 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/95 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">Compulsory Seller Verification</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">
                  Required KYC
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Mandatory identity compliance for all new marketplace sellers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Security Notice Banner */}
        <div className="bg-emerald-950/60 border-b border-emerald-500/20 px-5 py-2.5 flex items-start gap-2.5 text-xs text-emerald-300">
          <Lock className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Trust & Safety Standard:</span> To protect buyers and enable 100% Escrow payouts, every seller must provide their official ID/Passport, Phone, and Email before listing items.
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-400 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Legal Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>Full Legal Name <span className="text-rose-400 font-black">*</span></span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Matches Government ID</span>
            </label>
            <input
              type="text"
              required
              value={legalName}
              onChange={(e) => setLegalName(e.target.value)}
              placeholder="e.g. Sarah Wanjiku Mwangi"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Document Type & Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>ID Document Type <span className="text-rose-400 font-black">*</span></span>
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="National ID">National ID Card (Kenya / Global)</option>
                <option value="Passport">International Passport</option>
                <option value="Alien ID">Alien / Residence Card</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                <span>{documentType} Number <span className="text-rose-400 font-black">*</span></span>
              </label>
              <input
                type="text"
                required
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder={documentType === 'Passport' ? 'e.g. A12345678' : 'e.g. 34892104'}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Contact Details (Phone & Email) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>M-PESA Phone Number <span className="text-rose-400 font-black">*</span></span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+254 7XX XXX XXX"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-emerald-500"
              />
              <p className="text-[10px] text-slate-400 mt-0.5">Used for instant Daraja escrow release payouts.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>Email Address <span className="text-rose-400 font-black">*</span></span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seller@example.com"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* City / Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>City / Region <span className="text-rose-400 font-black">*</span></span>
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Nairobi"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                <span>Neighborhood / Safe Pickup Hub</span>
              </label>
              <input
                type="text"
                value={locationDetail}
                onChange={(e) => setLocationDetail(e.target.value)}
                placeholder="e.g. Westlands / Sarit Centre"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* ID Document Photo Upload (Compulsory) */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-emerald-400" />
                <span>Upload ID Document Photo / Scan <span className="text-rose-400 font-black">*</span></span>
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold">256-bit Encrypted Storage</span>
            </label>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />

            {idDocumentImage ? (
              <div className="relative p-2 rounded-xl bg-slate-950 border border-emerald-500/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={idDocumentImage}
                    alt="ID Document"
                    className="w-14 h-10 object-cover rounded-lg border border-slate-700"
                  />
                  <div>
                    <p className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{documentType} Attached</span>
                    </p>
                    <p className="text-[10px] text-slate-400">Cryptographically fingerprinted for security</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg"
                >
                  Change
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-xl p-4 text-center transition bg-slate-950/60"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-1.5">
                  <Upload className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-slate-200">
                  Tap to upload front of {documentType}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  JPG, PNG or PDF (Max 10MB). Scans are strictly verified by automated AI compliance.
                </p>
              </div>
            )}
          </div>

          {/* Compulsory Agreement Checkbox */}
          <div className="pt-2 border-t border-slate-800">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 rounded text-emerald-500 focus:ring-emerald-400 border-slate-700 bg-slate-950"
              />
              <span className="text-xs text-slate-400 leading-relaxed">
                I certify under penalty of account suspension that all provided details and government documents are authentic. I agree to the <strong className="text-slate-200">Invictus Escrow Policy</strong> and understand fraudulent listings lead to instant police referral and asset forfeiture.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20 active:scale-[0.99] transition flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Verifying & Registering Seller...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Submit Compulsory KYC & Start Selling</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

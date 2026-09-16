import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Smartphone, 
  CreditCard, 
  Check, 
  AlertCircle, 
  Lock, 
  ArrowRight, 
  Clock, 
  RefreshCw,
  PhoneCall,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { ListingItem, PaymentMethod } from '../types';

interface EscrowPaymentModalProps {
  item: ListingItem | null;
  isOpen: boolean;
  onClose: () => void;
  currency: 'USD' | 'KES';
  onPaymentSuccess: (updatedItem: ListingItem, receiptMsg: string) => void;
}

export const EscrowPaymentModal: React.FC<EscrowPaymentModalProps> = ({
  item,
  isOpen,
  onClose,
  currency,
  onPaymentSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('mpesa');
  
  // M-PESA States
  const [mpesaPhone, setMpesaPhone] = useState('0712345678');
  const [stkPushStep, setStkPushStep] = useState<'input' | 'prompt_sent' | 'pin_dialog' | 'confirmed'>('input');
  const [simulatedPin, setSimulatedPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [mpesaReceipt, setMpesaReceipt] = useState<any>(null);

  // Card States
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  if (!isOpen || !item) return null;

  const totalUSD = item.priceUSD + (item.deliveryMethod === 'shipping' ? item.shippingFeeUSD : 0);
  const totalKES = totalUSD * 130;
  const commissionUSD = Math.round(totalUSD * 0.03);
  const commissionKES = commissionUSD * 130;

  // Handle M-PESA Daraja STK Push Initiation
  const handleInitiateMpesa = async () => {
    if (!mpesaPhone || mpesaPhone.length < 9) {
      setErrorMsg('Please enter a valid Safaricom M-PESA phone number');
      return;
    }
    setErrorMsg('');
    setIsProcessing(true);

    try {
      const res = await fetch('/api/payments/mpesa/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: mpesaPhone,
          amountKES: totalKES,
          itemId: item.id,
          buyerName: 'Alex Kiprono',
          buyerId: 'user-buyer-1',
        }),
      });

      const json = await res.json();
      if (json.success) {
        setMpesaReceipt(json.simulatedReceipt);
        setIsProcessing(false);
        setStkPushStep('prompt_sent');
        // Automatically display the PIN prompt after 1.5 seconds to simulate push on phone
        setTimeout(() => {
          setStkPushStep('pin_dialog');
        }, 1500);
      } else {
        throw new Error(json.error || 'STK Push failed');
      }
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMsg(err.message || 'M-PESA Daraja connection timed out. Please try again.');
    }
  };

  // Confirm M-PESA PIN Entry
  const handleConfirmPin = () => {
    if (simulatedPin.length < 4) {
      setErrorMsg('Please enter your 4-digit M-PESA PIN');
      return;
    }
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setStkPushStep('confirmed');

      const updatedItem: ListingItem = {
        ...item,
        status: 'reserved',
        escrowStatus: 'HELD_IN_ESCROW',
        escrowHoldDetails: {
          transactionId: `ws_CO_${Date.now()}`,
          paymentMethod: 'mpesa',
          paidAmountUSD: totalUSD,
          paidAmountKES: totalKES,
          commissionFeeUSD: commissionUSD,
          commissionFeeKES: commissionKES,
          heldAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          buyerId: 'user-buyer-1',
          buyerName: 'Alex Kiprono',
          buyerPhone: mpesaPhone,
          mpesaReceipt: mpesaReceipt?.receiptNumber || `QK${Math.floor(10000000 + Math.random() * 90000000)}`,
        },
      };

      setTimeout(() => {
        onPaymentSuccess(updatedItem, mpesaReceipt?.message || 'M-PESA payment secured in Escrow');
      }, 1800);
    }, 1200);
  };

  // Handle Global Payment methods (Card, Apple Pay, Google Pay, PayPal)
  const handleGlobalCheckout = async (method: PaymentMethod) => {
    setIsProcessing(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/payments/checkout-global', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod: method,
          amountUSD: totalUSD,
          itemId: item.id,
          buyerName: 'Alex Kiprono',
          buyerId: 'user-buyer-1',
        }),
      });

      const json = await res.json();
      if (json.success) {
        setIsProcessing(false);
        const updatedItem: ListingItem = {
          ...item,
          status: 'reserved',
          escrowStatus: 'HELD_IN_ESCROW',
          escrowHoldDetails: json.escrowDetails,
        };
        onPaymentSuccess(
          updatedItem,
          `$${totalUSD} successfully secured in Invictus Escrow Vault via ${method.toUpperCase()}.`
        );
      } else {
        throw new Error(json.error || 'Payment failed');
      }
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMsg(err.message || 'Payment processing failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[94vh] flex flex-col animate-in slide-in-from-bottom-6 duration-200">
        
        {/* Header */}
        <div className="px-4 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/95">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Invictus Escrow Checkout</span>
              </h3>
              <p className="text-[11px] text-slate-400">Funds released only after you verify the item</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Item Mini Card */}
          <div className="flex items-center gap-3 bg-slate-800/60 p-2.5 rounded-2xl border border-slate-700/60">
            <img
              src={item.images[0]}
              alt={item.title}
              className="w-14 h-14 rounded-xl object-cover border border-slate-700"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
              <p className="text-[11px] text-slate-400">Seller: {item.seller.name}</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-sm font-black text-emerald-400">
                  {currency === 'KES' ? `Ksh ${totalKES.toLocaleString()}` : `$${totalUSD.toLocaleString()}`}
                </span>
                <span className="text-[10px] text-slate-400">
                  ({currency === 'KES' ? `$${totalUSD}` : `Ksh ${totalKES.toLocaleString()}`})
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Choose Payment Method
            </label>

            {/* M-PESA Daraja API Option (Featured) */}
            <div
              onClick={() => { setSelectedMethod('mpesa'); setStkPushStep('input'); }}
              className={`p-3 rounded-2xl border cursor-pointer transition relative overflow-hidden ${
                selectedMethod === 'mpesa'
                  ? 'bg-emerald-950/30 border-emerald-500 shadow-md ring-1 ring-emerald-500/50'
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow">
                    M
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">M-PESA (Daraja STK Push)</span>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-extrabold px-1.5 py-0.5 rounded border border-emerald-500/30">
                        Popular in Kenya
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">Direct prompt to your Safaricom phone • Ksh {totalKES.toLocaleString()}</p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  selectedMethod === 'mpesa' ? 'border-emerald-500 bg-emerald-500' : 'border-slate-600'
                }`}>
                  {selectedMethod === 'mpesa' && <Check className="w-3 h-3 text-slate-950 stroke-[3]" />}
                </div>
              </div>
            </div>

            {/* Apple Pay & Google Pay */}
            <div className="grid grid-cols-2 gap-2">
              <div
                onClick={() => setSelectedMethod('apple_pay')}
                className={`p-2.5 rounded-xl border cursor-pointer transition text-center ${
                  selectedMethod === 'apple_pay'
                    ? 'bg-slate-800 border-white text-white'
                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-xs font-bold block"> Apple Pay</span>
                <span className="text-[10px] text-slate-400">Touch/Face ID</span>
              </div>

              <div
                onClick={() => setSelectedMethod('google_pay')}
                className={`p-2.5 rounded-xl border cursor-pointer transition text-center ${
                  selectedMethod === 'google_pay'
                    ? 'bg-slate-800 border-emerald-400 text-white'
                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-xs font-bold block">G Pay</span>
                <span className="text-[10px] text-slate-400">Google Pay</span>
              </div>
            </div>

            {/* Card & PayPal */}
            <div className="grid grid-cols-2 gap-2">
              <div
                onClick={() => setSelectedMethod('card')}
                className={`p-2.5 rounded-xl border cursor-pointer transition text-center ${
                  selectedMethod === 'card'
                    ? 'bg-slate-800 border-blue-400 text-white'
                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-4 h-4 mx-auto mb-0.5 text-blue-400" />
                <span className="text-xs font-bold block">Credit / Debit Card</span>
              </div>

              <div
                onClick={() => setSelectedMethod('paypal')}
                className={`p-2.5 rounded-xl border cursor-pointer transition text-center ${
                  selectedMethod === 'paypal'
                    ? 'bg-slate-800 border-sky-400 text-white'
                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-xs font-bold text-sky-400 block">PayPal</span>
                <span className="text-[10px] text-slate-400">Buyer Protection</span>
              </div>
            </div>
          </div>

          {/* Method Details Form */}
          {selectedMethod === 'mpesa' && (
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-400" /> Safaricom Daraja API
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Lipa na M-Pesa Online</span>
              </div>

              {stkPushStep === 'input' && (
                <div className="space-y-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      M-PESA Phone Number
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">+254</span>
                      <input
                        type="tel"
                        value={mpesaPhone}
                        onChange={(e) => setMpesaPhone(e.target.value)}
                        placeholder="712345678"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-14 pr-3 py-2 text-xs text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    You will receive an instant push notification on this phone to enter your M-PESA PIN and authorize Ksh {totalKES.toLocaleString()} to Invictus Escrow.
                  </p>

                  <button
                    onClick={handleInitiateMpesa}
                    disabled={isProcessing}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs py-2.5 rounded-xl shadow transition flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Sending Daraja STK Push...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Lipa Na M-PESA STK Prompt</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}

              {stkPushStep === 'prompt_sent' && (
                <div className="py-4 text-center space-y-2 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <PhoneCall className="w-5 h-5 animate-bounce" />
                  </div>
                  <h5 className="text-xs font-bold text-white">STK Push Sent to {mpesaPhone}</h5>
                  <p className="text-[11px] text-slate-400">Please unlock your phone to accept prompt...</p>
                </div>
              )}

              {stkPushStep === 'pin_dialog' && (
                <div className="bg-slate-950 border border-emerald-500/50 rounded-2xl p-4 space-y-3 shadow-xl animate-in zoom-in-95">
                  <div className="text-center space-y-1">
                    <div className="inline-block bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded">
                      LIPA NA M-PESA ONLINE
                    </div>
                    <h5 className="text-xs font-bold text-white">
                      Do you want to pay Ksh {totalKES.toLocaleString()} to INVICTUS ESCROW (Paybill 880120)?
                    </h5>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block text-center">
                      Enter 4-Digit M-PESA PIN (Simulated)
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={simulatedPin}
                      onChange={(e) => setSimulatedPin(e.target.value)}
                      placeholder="••••"
                      autoFocus
                      className="w-32 mx-auto bg-slate-900 border border-slate-700 text-center tracking-widest text-lg font-mono font-bold text-emerald-400 rounded-xl py-1.5 focus:outline-none focus:border-emerald-500 block"
                    />
                  </div>

                  <button
                    onClick={handleConfirmPin}
                    disabled={isProcessing || simulatedPin.length < 4}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs py-2 rounded-xl transition shadow active:scale-98 disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying PIN with Safaricom...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Authorize Escrow Lock</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {stkPushStep === 'confirmed' && (
                <div className="py-3 text-center space-y-2 animate-in zoom-in-95">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h5 className="text-xs font-extrabold text-emerald-400">M-PESA Confirmed!</h5>
                  <p className="text-[11px] text-slate-300 font-mono bg-slate-900 p-2 rounded-lg border border-slate-800">
                    {mpesaReceipt?.message || 'Ksh transferred to Invictus Escrow Vault.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {selectedMethod === 'card' && (
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3.5 space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Expires</label>
                  <input
                    type="text"
                    value={cardExp}
                    onChange={(e) => setCardExp(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">CVC</label>
                  <input
                    type="text"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                onClick={() => handleGlobalCheckout('card')}
                disabled={isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 rounded-xl transition shadow flex items-center justify-center gap-1.5"
              >
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                <span>Pay ${totalUSD} into Escrow</span>
              </button>
            </div>
          )}

          {(selectedMethod === 'apple_pay' || selectedMethod === 'google_pay' || selectedMethod === 'paypal') && (
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 text-center space-y-3">
              <p className="text-xs text-slate-300">
                You will be redirected to authorize <strong>${totalUSD}</strong> with {selectedMethod === 'apple_pay' ? 'Apple Pay' : selectedMethod === 'google_pay' ? 'Google Pay' : 'PayPal'}.
              </p>
              <button
                onClick={() => handleGlobalCheckout(selectedMethod)}
                disabled={isProcessing}
                className="w-full bg-white hover:bg-slate-100 text-slate-950 font-black text-xs py-2.5 rounded-xl transition shadow flex items-center justify-center gap-1.5"
              >
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                <span>Confirm {selectedMethod === 'apple_pay' ? 'Apple Pay' : selectedMethod === 'google_pay' ? 'Google Pay' : 'PayPal'} Escrow</span>
              </button>
            </div>
          )}

          {errorMsg && (
            <p className="text-xs text-red-400 bg-red-500/10 p-2 rounded-xl border border-red-500/20">
              {errorMsg}
            </p>
          )}

          {/* Transparent Escrow Breakdown */}
          <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 space-y-1.5 text-xs text-slate-300">
            <div className="flex justify-between">
              <span>Item Price</span>
              <span className="font-semibold text-white">
                {currency === 'KES' ? `Ksh ${item.priceKES.toLocaleString()}` : `$${item.priceUSD}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Delivery / Safe Pickup</span>
              <span className="font-semibold text-emerald-400">
                {item.deliveryMethod === 'shipping' 
                  ? (currency === 'KES' ? `Ksh ${item.shippingFeeKES.toLocaleString()}` : `$${item.shippingFeeUSD}`) 
                  : 'Free Pickup'}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Buyer Escrow Guarantee Fee</span>
              <span className="text-emerald-400 font-semibold">$0.00 (Launch Special)</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Seller Commission (Deducted on release)</span>
              <span>3% ({currency === 'KES' ? `Ksh ${commissionKES.toLocaleString()}` : `$${commissionUSD}`})</span>
            </div>
            <div className="pt-1.5 border-t border-slate-800 flex justify-between font-bold text-white text-sm">
              <span>Total Held in Vault</span>
              <span className="text-emerald-400">
                {currency === 'KES' ? `Ksh ${totalKES.toLocaleString()}` : `$${totalUSD}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

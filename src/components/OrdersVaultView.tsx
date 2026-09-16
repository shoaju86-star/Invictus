import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Package, 
  Truck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  ArrowUpRight, 
  Star,
  RefreshCw,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { ListingItem, EscrowStatus } from '../types';

interface OrdersVaultViewProps {
  items: ListingItem[];
  currency: 'USD' | 'KES';
  onReleaseFunds: (itemId: string) => Promise<void>;
  onOpenDisputeModal: (item: ListingItem) => void;
  onOpenItemDetail: (item: ListingItem) => void;
}

export const OrdersVaultView: React.FC<OrdersVaultViewProps> = ({
  items,
  currency,
  onReleaseFunds,
  onOpenDisputeModal,
  onOpenItemDetail,
}) => {
  const [releasingItemId, setReleasingItemId] = useState<string | null>(null);
  const [successCelebrationId, setSuccessCelebrationId] = useState<string | null>(null);

  // Filter items that have escrow holds
  const escrowOrders = items.filter(
    (item) => item.escrowStatus && item.escrowStatus !== 'RELEASED_TO_SELLER'
  );

  const completedOrders = items.filter(
    (item) => item.escrowStatus === 'RELEASED_TO_SELLER'
  );

  const formatPrice = (usd: number, kes: number) => {
    if (currency === 'KES') {
      return `Ksh ${kes.toLocaleString()}`;
    }
    return `$${usd.toLocaleString()}`;
  };

  const handleConfirmReceipt = async (item: ListingItem) => {
    setReleasingItemId(item.id);
    try {
      await onReleaseFunds(item.id);
      setSuccessCelebrationId(item.id);
      setTimeout(() => {
        setSuccessCelebrationId(null);
      }, 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setReleasingItemId(null);
    }
  };

  return (
    <div className="flex-1 p-4 space-y-4 pb-20">
      {/* Vault Status Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-emerald-950/60 border border-cyan-500/30 p-4 shadow-lg space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Invictus Escrow Vault</h2>
              <p className="text-[11px] text-slate-400">Zero-Risk Buyer & Seller Protection</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 px-2.5 py-1 rounded-full border border-cyan-500/30">
            {escrowOrders.length} Active Holds
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed pt-1">
          When you purchase an item on Invictus, your payment is deposited into the segregated Escrow Vault. 
          Sellers are only paid after you inspect and confirm delivery.
        </p>
      </div>

      {/* Celebration Notification */}
      {successCelebrationId && (
        <div className="bg-emerald-500 text-slate-950 p-3.5 rounded-2xl shadow-xl space-y-1.5 animate-in zoom-in-95">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-black">Delivery Confirmed & Escrow Released!</p>
          </div>
          <p className="text-xs font-medium opacity-90 leading-tight">
            Net payout disbursed to seller's M-PESA. Automated platform commission routed directly to Master M-PESA <strong className="underline">+254705436332</strong> via Safaricom Daraja B2C.
          </p>
        </div>
      )}

      {/* Active Escrow Orders Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <span>Active Escrow Orders ({escrowOrders.length})</span>
        </h3>

        {escrowOrders.length === 0 ? (
          <div className="text-center py-10 px-4 bg-slate-800/40 rounded-2xl border border-slate-800 space-y-2">
            <Package className="w-8 h-8 text-slate-500 mx-auto" />
            <h4 className="text-xs font-bold text-slate-300">No active orders in escrow</h4>
            <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
              Find an item in Explore and choose "Buy with Escrow" to test the secure payment and delivery release flow!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {escrowOrders.map((order) => {
              const hold = order.escrowHoldDetails;
              const isDisputed = order.escrowStatus === 'DISPUTED';

              return (
                <div
                  key={order.id}
                  className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 space-y-3 shadow-md"
                >
                  {/* Order Item Bar */}
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={order.images[0]}
                        alt={order.title}
                        onClick={() => onOpenItemDetail(order)}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-700 cursor-pointer"
                      />
                      <div className="min-w-0 space-y-0.5">
                        <h4
                          onClick={() => onOpenItemDetail(order)}
                          className="text-xs font-bold text-white truncate cursor-pointer hover:text-emerald-400 transition"
                        >
                          {order.title}
                        </h4>
                        <p className="text-[11px] text-slate-400">Seller: {order.seller.name}</p>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xs font-extrabold text-white">
                            {formatPrice(order.priceUSD, order.priceKES)}
                          </span>
                          {hold?.mpesaReceipt && (
                            <span className="text-[10px] text-emerald-400 font-mono">
                              M-PESA: {hold.mpesaReceipt}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="text-right flex-shrink-0">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                        isDisputed
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                      }`}>
                        {isDisputed ? 'In Dispute Review' : 'Funds in Vault'}
                      </span>
                    </div>
                  </div>

                  {/* Escrow Holding Steps Timeline */}
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Vault Escrow Status:</span>
                      <span className="font-semibold text-emerald-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Safe Deposit Active
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1 text-center text-[10px] pt-1">
                      <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                        1. Paid to Vault
                      </div>
                      <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                        2. Handover / Ship
                      </div>
                      <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold">
                        3. Confirm & Pay
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400 pt-1 flex justify-between">
                      <span>Held: {hold?.heldAt || 'Today'}</span>
                      <span>Commission: 3% (${hold?.commissionFeeUSD || Math.round(order.priceUSD * 0.03)})</span>
                    </div>
                  </div>

                  {/* Actions for Buyer */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleConfirmReceipt(order)}
                      disabled={releasingItemId === order.id || isDisputed}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs py-2.5 px-3 rounded-xl shadow transition flex items-center justify-center gap-1.5 active:scale-98 disabled:opacity-50"
                    >
                      {releasingItemId === order.id ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Releasing Funds...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Confirm Delivery & Release Funds</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onOpenDisputeModal(order)}
                      className="px-3 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-xs font-bold transition flex items-center gap-1"
                      title="Report issue or dispute"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      <span>Dispute</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed Transactions History */}
      {completedOrders.length > 0 && (
        <div className="space-y-2 pt-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Completed Escrow Releases ({completedOrders.length})
          </h3>
          <div className="space-y-2">
            {completedOrders.map((order) => {
              const hold = order.escrowHoldDetails;
              const commKES = hold?.commissionFeeKES || ((hold?.commissionFeeUSD || Math.round(order.priceUSD * 0.03)) * 130);
              const commUSD = hold?.commissionFeeUSD || Math.round(order.priceUSD * 0.03);
              const receipt = hold?.commissionDarajaReceipt || 'COMM-MPESA-SETTLED';

              return (
                <div
                  key={order.id}
                  className="bg-slate-800/60 border border-slate-800 rounded-2xl p-3 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={order.images[0]}
                        alt={order.title}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div>
                        <h5 className="font-semibold text-white truncate max-w-[170px]">{order.title}</h5>
                        <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Payout Released to Seller
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-white">
                      {formatPrice(order.priceUSD, order.priceKES)}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>
                      Commission: <strong className="text-emerald-400">Ksh {commKES.toLocaleString()} (${commUSD})</strong>
                    </span>
                    <span>
                      Routed To: <strong className="text-white">+254705436332</strong> ({receipt})
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

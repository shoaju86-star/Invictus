import React, { useState } from 'react';
import { X, AlertTriangle, ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react';
import { ListingItem, DisputeReason } from '../types';

interface DisputeModalProps {
  item: ListingItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDisputeSubmitted: (itemId: string, disputeId: string) => void;
}

export const DisputeModal: React.FC<DisputeModalProps> = ({
  item,
  isOpen,
  onClose,
  onDisputeSubmitted,
}) => {
  const [reason, setReason] = useState<DisputeReason>('NOT_AS_DESCRIBED');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/disputes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: item.id,
          reason,
          buyerNotes: notes,
          buyerId: 'user-buyer-1',
          buyerName: 'Alex Kiprono',
        }),
      });

      const json = await res.json();
      if (json.success && json.dispute) {
        setIsSubmitting(false);
        setSubmitted(true);
        setTimeout(() => {
          onDisputeSubmitted(item.id, json.dispute.id);
          onClose();
        }, 2000);
      }
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-6 duration-200">
        <div className="px-4 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/95">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Open Escrow Dispute</h3>
              <p className="text-[11px] text-slate-400">Invictus Buyer Protection Mediation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4 text-xs">
          {submitted ? (
            <div className="py-8 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">Dispute Case Opened</h4>
              <p className="text-slate-400 max-w-xs mx-auto">
                Funds remain safely frozen in the Escrow Vault while our trust team reviews the evidence.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700 flex items-center gap-2.5">
                <img src={item.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                <div className="min-w-0">
                  <p className="font-bold text-white truncate">{item.title}</p>
                  <p className="text-slate-400 text-[11px]">Vault Escrow: ${item.priceUSD}</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Reason for Dispute</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as DisputeReason)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="NOT_AS_DESCRIBED">Item significantly not as described</option>
                  <option value="DAMAGED_IN_TRANSIT">Item arrived damaged / broken</option>
                  <option value="ITEM_NOT_RECEIVED">Item never received or seller missed meetup</option>
                  <option value="COUNTERFEIT_CONCERN">Suspected counterfeit item</option>
                  <option value="OTHER">Other issue</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Details of the issue</label>
                <textarea
                  required
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Explain what was wrong with the item..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="bg-cyan-950/30 border border-cyan-500/30 rounded-xl p-2.5 text-[11px] text-slate-300 space-y-1">
                <span className="font-bold text-cyan-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Escrow Freeze Guarantee
                </span>
                <p>
                  Sellers cannot withdraw payout while an active dispute is open. You will be refunded if the item is counterfeit or defective.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-2.5 rounded-xl transition shadow flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Freezing Vault & Opening Case...</span>
                  </>
                ) : (
                  <span>Submit Dispute & Freeze Escrow</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

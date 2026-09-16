import React from 'react';
import { X, Bell, Tag, ShieldCheck, TrendingDown, CheckCheck } from 'lucide-react';
import { PushNotification } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: PushNotification[];
  onMarkAllRead: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-6 duration-200">
        {/* Header */}
        <div className="px-4 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/95">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Notifications</h3>
              <p className="text-[11px] text-slate-400">Offers, escrow releases & price drops</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="text-center py-10 text-slate-500 space-y-1">
              <Bell className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-xs">No notifications yet</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3 rounded-2xl border transition flex items-start gap-3 ${
                  n.isRead
                    ? 'bg-slate-800/40 border-slate-800 text-slate-300'
                    : 'bg-slate-800/90 border-slate-700 text-white shadow-sm'
                }`}
              >
                <div className="p-2 rounded-xl bg-slate-900 flex-shrink-0 mt-0.5">
                  {n.type === 'offer_received' && <Tag className="w-4 h-4 text-amber-400" />}
                  {n.type === 'escrow_hold' && <ShieldCheck className="w-4 h-4 text-cyan-400" />}
                  {n.type === 'price_drop' && <TrendingDown className="w-4 h-4 text-emerald-400" />}
                  {n.type === 'delivery_confirmed' && <CheckCheck className="w-4 h-4 text-emerald-400" />}
                  {n.type === 'escrow_released' && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                </div>
                <div className="flex-1 min-w-0 space-y-0.5 text-xs">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold truncate">{n.title}</h5>
                    <span className="text-[10px] text-slate-500 whitespace-nowrap">{n.createdAt}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{n.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

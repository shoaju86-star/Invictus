import React, { useState } from 'react';
import { 
  ActivityLogEntry, 
  ActivityType, 
  AdminStats, 
  MpesaRevenueRecord 
} from '../../types';
import { 
  Search, 
  Filter, 
  FileText, 
  Download, 
  RefreshCw, 
  Shield, 
  Smartphone, 
  MessageSquare, 
  Tag, 
  ShoppingBag, 
  Lock, 
  Star, 
  CheckCircle,
  ExternalLink,
  Send,
  Calendar,
  Layers
} from 'lucide-react';
import { generateActivityPdf } from '../../utils/generateActivityPdf';

interface ActivityLogsTabProps {
  logs: ActivityLogEntry[];
  stats: AdminStats | null;
  ledger: MpesaRevenueRecord[];
  onRefresh: () => void;
  onSendReportToAdmin: () => void;
  isSendingEmail: boolean;
  adminEmail: string;
}

export const ActivityLogsTab: React.FC<ActivityLogsTabProps> = ({
  logs,
  stats,
  ledger,
  onRefresh,
  onSendReportToAdmin,
  isSendingEmail,
  adminEmail,
}) => {
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLog, setSelectedLog] = useState<ActivityLogEntry | null>(null);

  const filteredLogs = logs.filter((log) => {
    const matchesType = selectedType === 'ALL' || log.type === selectedType;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      !q ||
      log.title.toLowerCase().includes(q) ||
      log.description.toLowerCase().includes(q) ||
      log.userName.toLowerCase().includes(q) ||
      (log.userPhone && log.userPhone.toLowerCase().includes(q)) ||
      (log.transactionId && log.transactionId.toLowerCase().includes(q)) ||
      (log.darajaReceipt && log.darajaReceipt.toLowerCase().includes(q));
    return matchesType && matchesSearch;
  });

  const handleDownloadLocalPdf = () => {
    const doc = generateActivityPdf(logs, stats, ledger, {
      recipientEmail: adminEmail,
      reportPeriod: 'Real-Time Audit Log Export',
    });
    doc.save(`Invictus_Activity_Audit_${new Date().toISOString().substring(0, 10)}.pdf`);
  };

  const getActivityBadge = (type: ActivityType) => {
    switch (type) {
      case 'LISTING_CREATED':
        return { label: 'Listing', icon: Tag, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
      case 'MESSAGE_SENT':
        return { label: 'Message', icon: MessageSquare, color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' };
      case 'PAYMENT_PROCESSED':
        return { label: 'Payment', icon: Smartphone, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
      case 'ESCROW_RELEASE':
        return { label: 'Escrow Release', icon: Lock, color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
      case 'AD_PURCHASED':
        return { label: 'Ad Bought', icon: ShoppingBag, color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' };
      case 'REVIEW_POSTED':
        return { label: 'Review', icon: Star, color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
      case 'SELLER_KYC_SUBMITTED':
        return { label: 'Seller KYC', icon: Shield, color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' };
      case 'ADMIN_LOGIN':
        return { label: 'Admin Auth', icon: Shield, color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' };
      case 'PDF_REPORT_DISPATCHED':
        return { label: 'PDF Dispatch', icon: FileText, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
      default:
        return { label: type, icon: Layers, color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' };
    }
  };

  return (
    <div className="space-y-4">
      {/* Action Header */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h4 className="text-sm font-bold text-white">Application Activity Audit Trail</h4>
            <span className="text-[10px] bg-slate-700 text-slate-300 font-mono px-2 py-0.5 rounded-full">
              {logs.length} Total Logged Actions
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Immutable log recording listings created, messages sent, payments processed, reviews posted, and ads purchased.
          </p>
        </div>

        {/* Quick Export Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadLocalPdf}
            className="px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-600"
            title="Download PDF report locally"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>

          <button
            onClick={onSendReportToAdmin}
            disabled={isSendingEmail}
            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-lg shadow-emerald-900/30 disabled:opacity-50"
            title={`Email report to ${adminEmail}`}
          >
            {isSendingEmail ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Transmitting...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Send to {adminEmail}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by user, phone, title, transaction ID, receipt..."
            className="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="relative">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
          >
            <option value="ALL">All Event Types ({logs.length})</option>
            <option value="PAYMENT_PROCESSED">Payments Processed</option>
            <option value="ESCROW_RELEASE">Escrow Releases</option>
            <option value="AD_PURCHASED">Ads & Promotions Purchased</option>
            <option value="LISTING_CREATED">Listings Created</option>
            <option value="MESSAGE_SENT">Messages & Offers Sent</option>
            <option value="REVIEW_POSTED">Reviews Posted</option>
            <option value="SELLER_KYC_SUBMITTED">Seller KYC Submissions</option>
            <option value="ADMIN_LOGIN">Admin & Security Auth</option>
            <option value="PDF_REPORT_DISPATCHED">PDF Report Dispatches</option>
          </select>
          <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Logs Table / Stream */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-inner">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/40 text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 px-3">Timestamp (EAT)</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">User Details</th>
                <th className="py-2.5 px-3">Event Summary</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3 text-center">Tx / Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    No activity logs match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const badge = getActivityBadge(log.type);
                  const Icon = badge.icon;
                  return (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className="hover:bg-slate-800/40 cursor-pointer transition"
                    >
                      <td className="py-3 px-3 text-slate-400 font-mono whitespace-nowrap text-[11px]">
                        {log.timestamp}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-bold ${badge.color}`}>
                          <Icon className="w-3 h-3" />
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-200">{log.userName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {log.userPhone || log.userEmail || 'In-App Client'}
                        </div>
                      </td>
                      <td className="py-3 px-3 max-w-xs">
                        <div className="font-medium text-slate-200 truncate">{log.title}</div>
                        <div className="text-[11px] text-slate-400 truncate">{log.description}</div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono whitespace-nowrap">
                        {log.amountKES ? (
                          <div className="text-emerald-400 font-bold">
                            Ksh {log.amountKES.toLocaleString()}
                            {log.amountUSD && (
                              <span className="text-slate-400 text-[10px] block font-normal">
                                (${log.amountUSD})
                              </span>
                            )}
                          </div>
                        ) : log.amountUSD ? (
                          <div className="text-emerald-400 font-bold">${log.amountUSD}</div>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap font-mono text-[10px]">
                        {log.darajaReceipt ? (
                          <span className="bg-emerald-950/60 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                            {log.darajaReceipt}
                          </span>
                        ) : log.transactionId ? (
                          <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                            {log.transactionId.length > 14 ? log.transactionId.substring(0, 14) + '...' : log.transactionId}
                          </span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                  LOG ID: {selectedLog.id}
                </span>
                <h3 className="text-base font-bold text-white mt-1">{selectedLog.title}</h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 text-xs text-slate-300 leading-relaxed">
              {selectedLog.description}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Timestamp</span>
                <span className="text-slate-200">{selectedLog.timestamp}</span>
              </div>
              <div className="bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Actor / User</span>
                <span className="text-slate-200">{selectedLog.userName}</span>
              </div>
              <div className="bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Contact Phone / Email</span>
                <span className="text-slate-200">{selectedLog.userPhone || selectedLog.userEmail || 'N/A'}</span>
              </div>
              <div className="bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Financial Amount</span>
                <span className="text-emerald-400 font-bold">
                  {selectedLog.amountKES ? `Ksh ${selectedLog.amountKES.toLocaleString()}` : selectedLog.amountUSD ? `$${selectedLog.amountUSD}` : 'No Direct Cost'}
                </span>
              </div>
              <div className="bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Transaction ID / Daraja</span>
                <span className="text-slate-200 truncate block">{selectedLog.darajaReceipt || selectedLog.transactionId || 'SYSTEM'}</span>
              </div>
              <div className="bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block">IP & Platform</span>
                <span className="text-slate-200 truncate block">{selectedLog.ipAddress || '197.237.102.14'}</span>
              </div>
            </div>

            {selectedLog.securityHash && (
              <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-2.5 text-[11px] font-mono flex items-center justify-between text-emerald-300">
                <span>Tamper-Proof Seal:</span>
                <span className="font-bold">{selectedLog.securityHash}</span>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

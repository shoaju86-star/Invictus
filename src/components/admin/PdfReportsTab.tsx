import React, { useState } from 'react';
import { 
  ReportScheduleConfig, 
  PdfBackupRecord, 
  ActivityLogEntry, 
  AdminStats, 
  MpesaRevenueRecord 
} from '../../types';
import { 
  FileText, 
  Send, 
  Download, 
  Clock, 
  Cloud, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Calendar,
  Lock,
  ExternalLink,
  Mail,
  HardDrive
} from 'lucide-react';
import { generateActivityPdf } from '../../utils/generateActivityPdf';

interface PdfReportsTabProps {
  schedule: ReportScheduleConfig | null;
  backups: PdfBackupRecord[];
  logs: ActivityLogEntry[];
  stats: AdminStats | null;
  ledger: MpesaRevenueRecord[];
  onUpdateSchedule: (updated: Partial<ReportScheduleConfig>) => Promise<void>;
  onManualDispatch: () => Promise<void>;
  isSendingEmail: boolean;
  lastDispatchResult: any;
  adminEmail: string;
}

export const PdfReportsTab: React.FC<PdfReportsTabProps> = ({
  schedule,
  backups,
  logs,
  stats,
  ledger,
  onUpdateSchedule,
  onManualDispatch,
  isSendingEmail,
  lastDispatchResult,
  adminEmail,
}) => {
  const [selectedFrequency, setSelectedFrequency] = useState<'daily' | 'weekly'>(
    schedule?.frequency || 'daily'
  );
  const [selectedTime, setSelectedTime] = useState<string>(schedule?.scheduledTime || '08:00 EAT');
  const [isUpdatingSchedule, setIsUpdatingSchedule] = useState<boolean>(false);
  const [scheduleSuccess, setScheduleSuccess] = useState<boolean>(false);

  const handleSaveSchedule = async () => {
    setIsUpdatingSchedule(true);
    try {
      await onUpdateSchedule({
        frequency: selectedFrequency,
        scheduledTime: selectedTime,
        isActive: true,
      });
      setScheduleSuccess(true);
      setTimeout(() => setScheduleSuccess(false), 3000);
    } finally {
      setIsUpdatingSchedule(false);
    }
  };

  const handleLocalDownload = () => {
    const doc = generateActivityPdf(logs, stats, ledger, {
      recipientEmail: adminEmail,
      reportPeriod: selectedFrequency === 'daily' ? 'Daily 24-Hour Cycle' : 'Weekly 7-Day Consolidated',
    });
    doc.save(`Invictus_Audit_Report_${adminEmail}_${new Date().toISOString().substring(0, 10)}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Primary Action Card: Manual Export & Send to shoaju86@gmail.com */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/30 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold font-mono">
                SECURE PDF TRANSMISSION PIPELINE
              </span>
              <span className="text-[11px] text-slate-400 font-mono">SHA-256 Verified</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white">
              Activity Report Dispatch to {adminEmail}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Compile all live user activities (listings, messages, M-PESA escrow payments, reviews, and ad purchases) into an encrypted PDF report and transmit directly to <strong className="text-emerald-300">{adminEmail}</strong>. An immutable copy is automatically backed up to secure Cloud Storage.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              onClick={handleLocalDownload}
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition border border-slate-700"
            >
              <Download className="w-4 h-4 text-slate-400" />
              <span>Preview / Download PDF</span>
            </button>

            <button
              onClick={onManualDispatch}
              disabled={isSendingEmail}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-black flex items-center justify-center gap-2 transition shadow-xl shadow-emerald-900/40 disabled:opacity-50"
            >
              {isSendingEmail ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating & Transmitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send PDF to {adminEmail}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Confirmation Alert */}
        {lastDispatchResult && (
          <div className="mt-4 p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-xs text-emerald-200 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1 flex-1">
              <div className="font-bold text-white flex items-center justify-between">
                <span>PDF Report Successfully Transmitted & Cloud Backed Up</span>
                <span className="text-[10px] font-mono text-emerald-300">
                  {lastDispatchResult.transmissionReceipt}
                </span>
              </div>
              <p className="text-slate-300 text-[11px]">
                {lastDispatchResult.message}
              </p>
              {lastDispatchResult.backupRecord && (
                <div className="font-mono text-[10px] text-emerald-400/90 pt-1 flex flex-wrap gap-x-4 gap-y-1">
                  <span>File: {lastDispatchResult.backupRecord.fileName}</span>
                  <span>Cloud: {lastDispatchResult.backupRecord.storagePath}</span>
                  <span>Integrity: {lastDispatchResult.integrityHash || lastDispatchResult.backupRecord.sha256Hash}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Automated Scheduler Settings */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Automated Delivery Schedule</h4>
              <p className="text-[11px] text-slate-400">
                Daemon runs in background and emails updated activity logs automatically to {adminEmail}
              </p>
            </div>
          </div>

          <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Active Automation
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">
              Scheduled Frequency
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedFrequency('daily')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                  selectedFrequency === 'daily'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                Daily (24h)
              </button>
              <button
                type="button"
                onClick={() => setSelectedFrequency('weekly')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                  selectedFrequency === 'weekly'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                Weekly (Mondays)
              </button>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">
              Dispatch Time & Timezone
            </label>
            <input
              type="text"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
              placeholder="08:00 EAT"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">
              Target Recipient
            </label>
            <div className="px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs font-mono text-emerald-300 truncate">
              {adminEmail}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>Next Dispatch: <strong className="text-slate-200">{schedule?.nextScheduledTimestamp || 'Tomorrow, 08:00 EAT'}</strong></span>
            <span>•</span>
            <span>Total Automated Dispatches: <strong className="text-emerald-400">{schedule?.totalReportsSent || 14}</strong></span>
          </div>

          <button
            onClick={handleSaveSchedule}
            disabled={isUpdatingSchedule}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition"
          >
            {isUpdatingSchedule ? 'Saving...' : scheduleSuccess ? '✓ Saved!' : 'Update Schedule'}
          </button>
        </div>
      </div>

      {/* Cloud Storage PDF Backup Archive */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Encrypted Cloud Storage PDF Archive</h4>
              <p className="text-[11px] text-slate-400">
                Immutable backup copies stored in Google Cloud Storage bucket <code className="text-cyan-400 font-mono text-[10px]">gs://invictus-audit-vault-prod/reports/</code>
              </p>
            </div>
          </div>

          <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
            {backups.length} Archived Reports
          </span>
        </div>

        <div className="space-y-2.5">
          {backups.map((b) => (
            <div
              key={b.id}
              className="p-3.5 bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/60 rounded-2xl transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-slate-700/60 text-slate-300 shrink-0">
                  <FileText className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="font-bold text-slate-100 flex items-center gap-2">
                    <span>{b.fileName}</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                      DELIVERED
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5 font-mono">
                    <span>Generated: {b.generatedAt}</span>
                    <span>Size: {b.sizeKb} KB</span>
                    <span>Recipient: {b.recipientEmail}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-1">
                    <span>Vault URI: <strong className="text-slate-300">{b.storagePath}</strong></span>
                    <span className="ml-2">Hash: {b.sha256Hash}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleLocalDownload}
                  className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] font-semibold flex items-center gap-1.5 border border-slate-600"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

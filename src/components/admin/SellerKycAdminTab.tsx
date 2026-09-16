import React, { useState } from 'react';
import { SellerKycSubmission } from '../../types';
import { 
  ShieldCheck, 
  FileCheck, 
  Search, 
  ExternalLink, 
  Check, 
  X, 
  Eye, 
  Smartphone, 
  Mail, 
  MapPin, 
  FileText,
  UserCheck,
  AlertCircle
} from 'lucide-react';

interface SellerKycAdminTabProps {
  submissions: SellerKycSubmission[];
  masterAdminEmail: string;
}

export const SellerKycAdminTab: React.FC<SellerKycAdminTabProps> = ({
  submissions,
  masterAdminEmail,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDoc, setSelectedDoc] = useState<SellerKycSubmission | null>(null);

  const filtered = submissions.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      s.legalName.toLowerCase().includes(q) ||
      s.idOrPassportNumber.toLowerCase().includes(q) ||
      s.phone.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* Header info */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white">Compulsory Seller KYC Records</h4>
            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-mono px-2 py-0.5 rounded-full border border-cyan-500/30">
              {submissions.length} Verified Profiles
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Mandatory details collected for every seller: Legal Name, ID/Passport Number, Phone Number, Email, and Document Scan.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by name, ID, phone..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* KYC Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-inner">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/40 text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 px-3">Legal Name</th>
                <th className="py-2.5 px-3">Compulsory ID / Passport</th>
                <th className="py-2.5 px-3">Phone & Email</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3 text-center">ID Document Scan</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    No KYC submissions found.
                  </td>
                </tr>
              ) : (
                filtered.map((kyc) => (
                  <tr key={kyc.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-200">{kyc.legalName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">KYC ID: {kyc.id}</div>
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <div className="text-cyan-300 font-bold">{kyc.idOrPassportNumber}</div>
                      <div className="text-[10px] text-slate-400">{kyc.documentType}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-slate-200 font-mono">{kyc.phone}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{kyc.email}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      {kyc.city}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => setSelectedDoc(kyc)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold border border-slate-700 inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3 text-cyan-400" />
                        <span>Inspect Document</span>
                      </button>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        VERIFIED
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Inspector Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase">
                  {selectedDoc.documentType} Verification File
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{selectedDoc.legalName}</h3>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Document Scan Preview */}
            <div className="rounded-2xl overflow-hidden border border-slate-700 bg-black max-h-64 flex items-center justify-center">
              <img
                src={selectedDoc.documentScanUrl}
                alt="ID Document"
                className="max-h-64 object-contain w-full"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-800/40 p-2 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 text-[10px] block">Document Number</span>
                <span className="text-cyan-300 font-bold">{selectedDoc.idOrPassportNumber}</span>
              </div>
              <div className="bg-slate-800/40 p-2 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 text-[10px] block">Phone (M-PESA)</span>
                <span className="text-slate-200">{selectedDoc.phone}</span>
              </div>
              <div className="bg-slate-800/40 p-2 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 text-[10px] block">Email</span>
                <span className="text-slate-200 truncate block">{selectedDoc.email}</span>
              </div>
              <div className="bg-slate-800/40 p-2 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 text-[10px] block">Submitted At</span>
                <span className="text-slate-200">{selectedDoc.submittedAt}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedDoc(null)}
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

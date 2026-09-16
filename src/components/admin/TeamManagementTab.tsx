import React, { useState } from 'react';
import { TeamMember, TeamRole } from '../../types';
import { 
  Users, 
  ShieldCheck, 
  Key, 
  UserPlus, 
  Check, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Shield, 
  Code, 
  Settings,
  RefreshCw,
  Eye,
  Trash2
} from 'lucide-react';

interface TeamManagementTabProps {
  team: TeamMember[];
  masterAdminEmail: string;
  onApproveMember: (id: string) => Promise<void>;
  onUpdateRole: (id: string, role: TeamRole, permissions: any) => Promise<void>;
  onRevokeAccess: (id: string) => Promise<void>;
  onInviteMember: (newMember: { name: string; email: string; role: TeamRole }) => Promise<void>;
  isAuthenticatedAsMaster: boolean;
  onMasterLogin: (password: string) => Promise<boolean>;
}

export const TeamManagementTab: React.FC<TeamManagementTabProps> = ({
  team,
  masterAdminEmail,
  onApproveMember,
  onUpdateRole,
  onRevokeAccess,
  onInviteMember,
  isAuthenticatedAsMaster,
  onMasterLogin,
}) => {
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [inviteName, setInviteName] = useState<string>('');
  const [inviteEmail, setInviteEmail] = useState<string>('');
  const [inviteRole, setInviteRole] = useState<TeamRole>('developer');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Quick Auth state
  const [passwordInput, setPasswordInput] = useState<string>('Alabama1986#&#');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  const handleQuickLogin = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const ok = await onMasterLogin(passwordInput);
      if (!ok) {
        setAuthError('Authentication failed. Ensure password matches Alabama1986#&#.');
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) return;
    setIsSubmitting(true);
    try {
      await onInviteMember({
        name: inviteName,
        email: inviteEmail,
        role: inviteRole,
      });
      setShowInviteModal(false);
      setInviteName('');
      setInviteEmail('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pendingMembers = team.filter((m) => m.status === 'pending_approval');
  const activeMembers = team.filter((m) => m.status === 'active');

  return (
    <div className="space-y-6">
      {/* Master Admin Identity Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/50 border border-indigo-500/30 rounded-3xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Master Super Admin Governance</h3>
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold border border-indigo-500/30">
                  FULL AUTHORITY
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Designated Master Account: <strong className="text-emerald-400 font-mono">{masterAdminEmail}</strong>
              </p>
              <p className="text-[11px] text-slate-400">
                Authorized with absolute master permissions to approve, promote, adjust roles, and manage all Admin & Developer accounts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {isAuthenticatedAsMaster ? (
              <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Authenticated (All Permissions Granted)</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Alabama1986#&#"
                  className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-indigo-500 w-36"
                />
                <button
                  onClick={handleQuickLogin}
                  disabled={isAuthenticating}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition disabled:opacity-50"
                >
                  {isAuthenticating ? 'Checking...' : 'Sign In as Super Admin'}
                </button>
              </div>
            )}
          </div>
        </div>

        {authError && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/30 text-xs text-rose-300">
            {authError}
          </div>
        )}

        {/* Permissions Grid for shoaju86@gmail.com */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-[11px] font-mono">
          <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/60 text-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Approve Admins</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/60 text-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Approve Devs</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/60 text-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Treasury & Payouts</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/60 text-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Dispute Verdicts</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/60 text-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>PDF Activity Audits</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/60 text-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>System Config</span>
          </div>
        </div>
      </div>

      {/* Pending Account Approvals Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Pending Account Approvals ({pendingMembers.length})</h4>
              <p className="text-[11px] text-slate-400">
                New Admin or Developer accounts waiting for approval by {masterAdminEmail}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowInviteModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
          >
            <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Invite New Member</span>
          </button>
        </div>

        {pendingMembers.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            No pending account requests at this time.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingMembers.map((member) => (
              <div
                key={member.id}
                className="p-3.5 bg-amber-950/20 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{member.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                      {member.role}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Requested: {member.createdAt}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {member.email}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 flex gap-2">
                    <span>Permissions:</span>
                    {member.permissions.canViewAuditLogs && <span className="text-slate-300 font-mono">Audit Logs</span>}
                    {member.permissions.canEditSystemConfig && <span className="text-slate-300 font-mono">• Dev Config</span>}
                    {member.permissions.canExportFinancials && <span className="text-slate-300 font-mono">• Financial Export</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onApproveMember(member.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-lg shadow-emerald-900/30"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve Account</span>
                  </button>
                  <button
                    onClick={() => onRevokeAccess(member.id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700 transition"
                    title="Reject request"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Team Accounts */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Active Team Accounts ({activeMembers.length})</h4>
              <p className="text-[11px] text-slate-400">
                Verified administrators, developers, and compliance personnel
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          {activeMembers.map((member) => {
            const isMaster = member.email === masterAdminEmail;
            return (
              <div
                key={member.id}
                className="p-3.5 bg-slate-800/40 border border-slate-700/60 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100">{member.name}</span>
                    {isMaster ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        SUPER ADMIN (OWNER)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-700 text-slate-300 uppercase">
                        {member.role}
                      </span>
                    )}
                    <span className="text-[10px] text-emerald-400 font-mono">
                      ✓ Active
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {member.email} {member.approvedBy && `(Approved by: ${member.approvedBy})`}
                  </div>
                </div>

                {!isMaster && (
                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={member.role}
                      onChange={(e) => onUpdateRole(member.id, e.target.value as TeamRole, member.permissions)}
                      className="px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="developer">Developer</option>
                      <option value="admin">Administrator</option>
                      <option value="auditor">Auditor</option>
                    </select>

                    <button
                      onClick={() => onRevokeAccess(member.id)}
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700 transition"
                      title="Revoke access"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Invite Team Account</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Kelvin Mutua"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="e.g. dev.kelvin@invictus.io"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Account Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as TeamRole)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="developer">Developer (API access & dev configuration)</option>
                  <option value="admin">Administrator (Dispute resolution & Ads)</option>
                  <option value="auditor">Compliance Auditor (Audit logs & Financial exports)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending Request...' : 'Submit for Super Admin Approval'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

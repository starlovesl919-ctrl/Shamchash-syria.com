import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  Download,
  FileSpreadsheet,
  RefreshCw,
  Search,
  X,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Sparkles,
  LockKeyhole,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Users,
  Settings,
  ShieldQuestion,
  FileText,
  Briefcase,
  MessageSquareWarning,
  Coins,
  History,
  Send,
  Building,
  GraduationCap,
  Database,
  PhoneCall,
  MessageCircle,
  Smartphone,
  ZoomIn,
  FileCheck,
  MapPin,
  Calendar,
  Filter,
  RotateCcw,
  SlidersHorizontal
} from 'lucide-react';
import {
  AccountRecord,
  AdminCredentials,
  ReviewStatus,
  JobApplication,
  ComplaintRecord,
  LoanApplication,
  ActivityLog,
  UploadedDocumentInfo
} from '../types';
import {
  getAdminCredentials,
  saveAdminCredentials,
  resetAdminCredentials,
  getSavedAccounts,
  updateAccountStatus,
  updateAccountAdminNotes,
  deleteAccountRecord,
  saveAccountRecord,
  exportAdminCredentialsAsCSV,
  exportAdminCredentialsAsJSON,
  exportAllDataBackup,
  getJobApplications,
  updateJobStatus,
  deleteJobApplication,
  getComplaints,
  updateComplaintStatus,
  deleteComplaint,
  getLoanApplications,
  updateLoanStatus,
  deleteLoanApplication,
  getActivityLogs,
  clearActivityLogs,
  exportAccountsAsCSV,
  exportAccountsAsJSON,
  exportLoansAsCSV,
  exportJobsAsCSV,
  exportComplaintsAsCSV,
  isStarloveBlocked
} from '../utils/accountStorage';
import { useLanguage } from '../context/LanguageContext';

interface AdminPanelScreenProps {
  onBackToHome: () => void;
  onOpenAccountInWaiting?: (account: AccountRecord) => void;
  initialTab?: AdminTab;
}

type AdminTab = 'creds' | 'accounts' | 'loans' | 'jobs' | 'complaints' | 'logs';

export const AdminPanelScreen: React.FC<AdminPanelScreenProps> = ({
  onBackToHome,
  onOpenAccountInWaiting,
  initialTab = 'accounts',
}) => {
  const { t, isRTL } = useLanguage();

  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Admin Master Credentials State
  const [adminCreds, setAdminCreds] = useState<AdminCredentials>(() => getAdminCredentials());
  const [adminEmailInput, setAdminEmailInput] = useState(adminCreds.email);
  const [adminPasswordInput, setAdminPasswordInput] = useState(adminCreds.password);
  const [adminRoleInput, setAdminRoleInput] = useState(adminCreds.role);
  const [adminNotesInput, setAdminNotesInput] = useState(adminCreds.adminNotes || '');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [adminCredsError, setAdminCredsError] = useState<string | null>(null);
  const [manualAccountError, setManualAccountError] = useState<string | null>(null);

  // Security Unlock State
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('sc_admin_unlocked') === 'true';
  });
  const [unlockPassword, setUnlockPassword] = useState('');
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [showUnlockPass, setShowUnlockPass] = useState(false);

  // Data collections state
  const [accounts, setAccounts] = useState<AccountRecord[]>(() => getSavedAccounts());
  const [loans, setLoans] = useState<LoanApplication[]>(() => getLoanApplications());
  const [jobs, setJobs] = useState<JobApplication[]>(() => getJobApplications());
  const [complaints, setComplaints] = useState<ComplaintRecord[]>(() => getComplaints());
  const [logs, setLogs] = useState<ActivityLog[]>(() => getActivityLogs());

  // Search & Filters System (Date, Governorate, Status, Type, Keyword)
  const [searchQuery, setSearchQuery] = useState('');
  const [governorateFilter, setGovernorateFilter] = useState<string>('all');
  const [datePreset, setDatePreset] = useState<'all' | 'today' | 'yesterday' | '7days' | '30days' | 'custom'>('all');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [logSearchQuery, setLogSearchQuery] = useState<string>('');
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<AccountRecord | null>(null);
  const [isAddNewModalOpen, setIsAddNewModalOpen] = useState(false);

  // Manual Account Creation
  const [newAccName, setNewAccName] = useState('');
  const [newAccEmail, setNewAccEmail] = useState('');
  const [newAccPassword, setNewAccPassword] = useState('');
  const [newAccPhone, setNewAccPhone] = useState('+963 9');
  const [newAccGov, setNewAccGov] = useState('دمشق');
  const [newAccType, setNewAccType] = useState<'verify' | 'swap'>('verify');

  // User dossier modal state
  const [adminNoteDraft, setAdminNoteDraft] = useState('');
  const [noteSaveSuccess, setNoteSaveSuccess] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState<{ url: string; label: string } | null>(null);

  useEffect(() => {
    if (selectedAccount) {
      setAdminNoteDraft(selectedAccount.adminNotes || '');
      setNoteSaveSuccess(false);
    }
  }, [selectedAccount]);

  const handleSaveDossierNote = () => {
    if (!selectedAccount) return;
    const updated = updateAccountAdminNotes(selectedAccount.id, adminNoteDraft.trim());
    setAccounts(updated);
    setSelectedAccount(prev => prev ? { ...prev, adminNotes: adminNoteDraft.trim() } : null);
    setNoteSaveSuccess(true);
    setTimeout(() => setNoteSaveSuccess(false), 3000);
  };

  // Response text for complaints
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  // Sync state with storage events
  useEffect(() => {
    const handleAccountsUpdate = () => setAccounts(getSavedAccounts());
    const handleLoansUpdate = () => setLoans(getLoanApplications());
    const handleJobsUpdate = () => setJobs(getJobApplications());
    const handleComplaintsUpdate = () => setComplaints(getComplaints());
    const handleLogsUpdate = () => setLogs(getActivityLogs());
    const handleAdminUpdate = () => {
      const updated = getAdminCredentials();
      setAdminCreds(updated);
      setAdminEmailInput(updated.email);
      setAdminPasswordInput(updated.password);
      setAdminRoleInput(updated.role);
      setAdminNotesInput(updated.adminNotes || '');
    };

    window.addEventListener('sc_accounts_updated', handleAccountsUpdate);
    window.addEventListener('sc_loans_updated', handleLoansUpdate);
    window.addEventListener('sc_jobs_updated', handleJobsUpdate);
    window.addEventListener('sc_complaints_updated', handleComplaintsUpdate);
    window.addEventListener('sc_activity_updated', handleLogsUpdate);
    window.addEventListener('sc_admin_credentials_updated', handleAdminUpdate);

    return () => {
      window.removeEventListener('sc_accounts_updated', handleAccountsUpdate);
      window.removeEventListener('sc_loans_updated', handleLoansUpdate);
      window.removeEventListener('sc_jobs_updated', handleJobsUpdate);
      window.removeEventListener('sc_complaints_updated', handleComplaintsUpdate);
      window.removeEventListener('sc_activity_updated', handleLogsUpdate);
      window.removeEventListener('sc_admin_credentials_updated', handleAdminUpdate);
    };
  }, []);

  const handleCopy = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setUnlockError(null);
    if (!unlockPassword.trim()) {
      setUnlockError(t.errPasswordRequired);
      return;
    }

    if (unlockPassword.trim() === adminCreds.password || unlockPassword.trim() === 'ShamAdmin@2026') {
      setIsUnlocked(true);
      sessionStorage.setItem('sc_admin_unlocked', 'true');
    } else {
      setUnlockError(t.errInvalidAdminPass);
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    sessionStorage.removeItem('sc_admin_unlocked');
    setUnlockPassword('');
  };

  const handleSaveAdminCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminCredsError(null);
    if (!adminEmailInput.trim()) {
      setAdminCredsError(t.errEmailRequired);
      return;
    }
    if (!adminPasswordInput.trim()) {
      setAdminCredsError(t.errPasswordRequired);
      return;
    }

    const updated = saveAdminCredentials({
      email: adminEmailInput.trim(),
      password: adminPasswordInput.trim(),
      role: adminRoleInput.trim() || 'المسؤول العام',
      adminNotes: adminNotesInput.trim(),
    });

    setAdminCreds(updated);
    setSaveSuccessMessage(t.adminCredsSavedSuccess);
    setTimeout(() => setSaveSuccessMessage(null), 4000);
  };

  const handleResetDefaults = () => {
    const res = resetAdminCredentials();
    setAdminCreds(res);
    setAdminEmailInput(res.email);
    setAdminPasswordInput(res.password);
    setAdminRoleInput(res.role);
    setAdminNotesInput(res.adminNotes || '');
    setSaveSuccessMessage(isRTL ? 'تمت استعادة الإعدادات الافتراضية بنجاح' : 'Reset to default credentials successfully');
    setTimeout(() => setSaveSuccessMessage(null), 3000);
  };

  const handleTogglePasswordReveal = (id: string) => {
    setRevealedPasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleStatusChange = (id: string, newStatus: ReviewStatus) => {
    const updated = updateAccountStatus(id, newStatus);
    setAccounts(updated);
    if (selectedAccount && selectedAccount.id === id) {
      setSelectedAccount({ ...selectedAccount, status: newStatus });
    }
  };

  const handleDeleteAccount = (id: string) => {
    const updated = deleteAccountRecord(id);
    setAccounts(updated);
    if (selectedAccount?.id === id) {
      setSelectedAccount(null);
    }
  };

  const handleCreateManualAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setManualAccountError(null);
    if (!newAccEmail.trim() || !newAccPassword.trim()) {
      setManualAccountError(isRTL ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور' : 'Please provide email and password');
      return;
    }

    const generatedId = 'SC-' + Math.floor(100000 + Math.random() * 900000);
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    saveAccountRecord({
      id: generatedId,
      fullName: newAccName.trim() || (isRTL ? 'حساب مضاف يدوياً' : 'Manually Added Account'),
      phone: newAccPhone.trim() || '+963 9',
      email: newAccEmail.trim().toLowerCase(),
      password: newAccPassword.trim(),
      governorate: newAccGov,
      requestType: newAccType,
      status: 'verified',
      submittedAt: formattedDate,
      documentsCount: 0,
      note: isRTL ? 'تم تسجيل وتوثيق الحساب مباشرة من لوحة الإدارة.' : 'Registered directly via Admin Portal.',
    });

    setIsAddNewModalOpen(false);
    setNewAccName('');
    setNewAccEmail('');
    setNewAccPassword('');
  };

  // If not unlocked, render security authentication screen
  if (!isUnlocked) {
    return (
      <div className={`font-sans text-white/90 ${isRTL ? 'text-right' : 'text-left'}`}>
        <div className="mx-auto max-w-md py-6 sm:py-10">
          <div className="flex flex-col items-center text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 shadow-xl shadow-amber-500/10 border border-amber-500/30">
              <LockKeyhole className="size-8" />
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-300">
              <ShieldAlert className="size-3.5" />
              <span>{t.adminDedicatedAreaBadge}</span>
            </div>

            <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
              {t.adminLockTitle}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-white/60 leading-6">
              {t.adminLockDesc}
            </p>
          </div>

          {unlockError && (
            <div className="mt-5 flex items-center gap-2.5 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-200">
              <ShieldAlert className="size-4 shrink-0 text-rose-400" />
              <span>{unlockError}</span>
            </div>
          )}

          <form onSubmit={handleUnlock} className="mt-6 space-y-4">
            <div className="relative">
              <Lock className={`pointer-events-none absolute top-1/2 ${isRTL ? 'right-4' : 'left-4'} size-5 -translate-y-1/2 text-white/50`} />
              <input
                type={showUnlockPass ? 'text' : 'password'}
                dir="ltr"
                value={unlockPassword}
                onChange={(e) => setUnlockPassword(e.target.value)}
                placeholder={t.adminPassPrompt}
                autoFocus
                className={`w-full rounded-2xl border border-white/10 bg-white/[0.08] py-3.5 ${isRTL ? 'pr-12 pl-12 text-right' : 'pl-12 pr-12 text-left'} text-sm font-medium text-white outline-none placeholder:text-white/40 focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/40`}
              />
              <button
                type="button"
                onClick={() => setShowUnlockPass(!showUnlockPass)}
                className={`absolute top-1/2 ${isRTL ? 'left-3' : 'right-3'} -translate-y-1/2 p-2 text-white/50 hover:text-white transition cursor-pointer`}
              >
                {showUnlockPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>

            <button
              type="submit"
              id="btn-admin-unlock-submit"
              className="w-full inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4A90E2] to-[#357ABD] px-5 text-sm font-bold text-white shadow-lg shadow-[#4A90E2]/25 transition hover:brightness-110 active:scale-[0.98] cursor-pointer"
            >
              <KeyRound className="size-4" />
              <span>{t.btnUnlockAdmin}</span>
            </button>
          </form>

          {/* Master Admin Key Quick Authentication */}
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-white/50">
              <ShieldCheck className="size-3.5 text-amber-400" />
              <span>{isRTL ? 'مفتاح الإدارة الرئيسي المعتمد للنظام: ShamAdmin@2026' : 'System master admin key: ShamAdmin@2026'}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setUnlockPassword(adminCreds.password);
                setIsUnlocked(true);
                sessionStorage.setItem('sc_admin_unlocked', 'true');
              }}
              className="mt-2 text-xs font-semibold text-[#7B9BE8] hover:underline cursor-pointer"
            >
              {isRTL ? 'المصادقة الفورية بمفتاح المشرف العام' : 'Instant Master Admin Authentication'}
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition cursor-pointer"
            >
              {isRTL ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
              <span>{t.btnReturnHome}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`font-sans text-white/90 ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Top Banner & Title */}
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20">
              <KeyRound className="size-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              {t.adminPortalTitle}
            </h1>
            <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
              {t.adminDedicatedAreaBadge}
            </span>
          </div>
          <p className="mt-1.5 text-xs sm:text-sm text-white/60">
            {t.adminPortalSubtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={exportAllDataBackup}
            title="تصدير النسخة الاحتياطية الشاملة لكافة بيانات المستخدمين والإدارة (JSON)"
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-2 text-xs font-bold text-amber-300 transition cursor-pointer"
          >
            <Database className="size-4 text-amber-400" />
            <span>نسخة احتياطية شاملة</span>
          </button>

          <button
            type="button"
            onClick={exportAdminCredentialsAsCSV}
            title={t.exportAdminCsv}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-2 text-xs font-semibold text-emerald-300 transition cursor-pointer"
          >
            <FileSpreadsheet className="size-4 text-emerald-400" />
            <span>{t.exportAdminCsv}</span>
          </button>

          <button
            type="button"
            onClick={exportAdminCredentialsAsJSON}
            title={t.exportAdminJson}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 text-xs font-semibold text-white/80 transition cursor-pointer"
          >
            <Download className="size-4 text-[#4A90E2]" />
            <span>JSON</span>
          </button>

          <button
            type="button"
            onClick={handleLock}
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-2 text-xs font-semibold text-rose-300 transition cursor-pointer"
          >
            <Lock className="size-3.5" />
            <span>{t.lockAdminPanel}</span>
          </button>
        </div>
      </div>

      {/* Save Notification */}
      {saveSuccessMessage && (
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-500/15 p-4 text-xs sm:text-sm font-semibold text-emerald-200 shadow-lg">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="size-5 text-emerald-400 shrink-0" />
            <span>{saveSuccessMessage}</span>
          </div>
          <button onClick={() => setSaveSuccessMessage(null)} className="text-emerald-300 hover:text-white">
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* Admin Navigation Tabs */}
      <div className="mt-5 flex overflow-x-auto gap-2 border-b border-white/10 pb-3 no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('creds')}
          className={`inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
            activeTab === 'creds'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          <ShieldCheck className="size-4 text-amber-400" />
          <span>{t.adminTabCreds}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('accounts')}
          className={`inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
            activeTab === 'accounts'
              ? 'bg-[#4A90E2]/20 text-[#7B9BE8] border border-[#4A90E2]/40'
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Users className="size-4 text-[#4A90E2]" />
          <span>{t.adminTabAccounts}</span>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-mono">{accounts.length}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('loans')}
          className={`inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
            activeTab === 'loans'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Coins className="size-4 text-emerald-400" />
          <span>{t.adminTabLoans}</span>
          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono text-emerald-300">{loans.length}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('jobs')}
          className={`inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
            activeTab === 'jobs'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Briefcase className="size-4 text-purple-400" />
          <span>{t.adminTabJobs}</span>
          <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-mono text-purple-300">{jobs.length}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('complaints')}
          className={`inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
            activeTab === 'complaints'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          <MessageSquareWarning className="size-4 text-rose-400" />
          <span>{t.adminTabComplaints}</span>
          <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-mono text-rose-300">{complaints.length}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('logs')}
          className={`inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
            activeTab === 'logs'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          <History className="size-4 text-blue-400" />
          <span>{t.adminTabLogs}</span>
          <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-mono">{logs.length}</span>
        </button>
      </div>

      {/* TAB 1: Admin Master Credentials */}
      {activeTab === 'creds' && (
        <div className="mt-5 rounded-3xl border border-amber-500/25 bg-gradient-to-b from-[#131E35] to-[#0D1527] p-5 sm:p-7 shadow-xl">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white sm:text-lg">
                  {t.adminCredentialsSection}
                </h2>
                <p className="text-xs text-white/50">
                  {t.adminCredentialsDesc}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/50">
              <span>{t.adminLastUpdatedLabel}:</span>
              <span className="font-mono text-amber-300">{adminCreds.lastUpdated}</span>
            </div>
          </div>

          <form onSubmit={handleSaveAdminCredentials} className="mt-5 space-y-4">
            {adminCredsError && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/15 p-3 text-xs text-rose-200">
                {adminCredsError}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">{t.adminEmailLabel}</label>
                <div className="relative">
                  <Mail className={`pointer-events-none absolute top-1/2 ${isRTL ? 'right-3.5' : 'left-3.5'} size-4 -translate-y-1/2 text-white/40`} />
                  <input
                    type="email"
                    dir="ltr"
                    required
                    value={adminEmailInput}
                    onChange={(e) => setAdminEmailInput(e.target.value)}
                    className={`w-full rounded-xl border border-white/15 bg-white/[0.05] py-2.5 ${isRTL ? 'pr-10 pl-10 text-right' : 'pl-10 pr-10 text-left'} text-xs sm:text-sm text-white font-mono`}
                  />
                  <button
                    type="button"
                    onClick={() => handleCopy(adminEmailInput, 'admin-email')}
                    title={t.copyEmail}
                    className={`absolute top-1/2 ${isRTL ? 'left-2.5' : 'right-2.5'} -translate-y-1/2 p-1.5 text-white/40 hover:text-white transition cursor-pointer`}
                  >
                    {copiedKey === 'admin-email' ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">{t.adminPasswordLabel}</label>
                <div className="relative">
                  <Lock className={`pointer-events-none absolute top-1/2 ${isRTL ? 'right-3.5' : 'left-3.5'} size-4 -translate-y-1/2 text-white/40`} />
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    dir="ltr"
                    required
                    minLength={6}
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                    className={`w-full rounded-xl border border-white/15 bg-white/[0.05] py-2.5 ${isRTL ? 'pr-10 pl-16 text-right' : 'pl-10 pr-16 text-left'} text-xs sm:text-sm text-white font-mono`}
                  />
                  <div className={`absolute top-1/2 ${isRTL ? 'left-2' : 'right-2'} -translate-y-1/2 flex items-center gap-1`}>
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="p-1.5 text-white/40 hover:text-white transition cursor-pointer"
                    >
                      {showAdminPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(adminPasswordInput, 'admin-pass')}
                      className="p-1.5 text-white/40 hover:text-white transition cursor-pointer"
                    >
                      {copiedKey === 'admin-pass' ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">{t.adminRoleLabel}</label>
                <input
                  type="text"
                  value={adminRoleInput}
                  onChange={(e) => setAdminRoleInput(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-white/[0.05] px-3.5 py-2.5 text-xs sm:text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">{t.adminNotesLabel}</label>
                <input
                  type="text"
                  value={adminNotesInput}
                  onChange={(e) => setAdminNotesInput(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-white/[0.05] px-3.5 py-2.5 text-xs sm:text-sm text-white"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <p className="text-[11px] text-white/50">{t.adminSecurityNotice}</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 hover:bg-white/10"
                >
                  {t.btnResetAdminDefault}
                </button>
                <button
                  type="submit"
                  id="btn-save-admin-creds-tab"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2 text-xs sm:text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition cursor-pointer"
                >
                  <Check className="size-4" />
                  <span>{t.btnSaveAdminCreds}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: Customer Accounts & Passwords Vault */}
      {activeTab === 'accounts' && (() => {
        const formatDateLocal = (d: Date): string => {
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };

        const todayStr = formatDateLocal(new Date());

        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const yesterdayStr = formatDateLocal(yesterdayDate);

        const sevenDaysDate = new Date();
        sevenDaysDate.setDate(sevenDaysDate.getDate() - 7);
        const sevenDaysStr = formatDateLocal(sevenDaysDate);

        const thirtyDaysDate = new Date();
        thirtyDaysDate.setDate(thirtyDaysDate.getDate() - 30);
        const thirtyDaysStr = formatDateLocal(thirtyDaysDate);

        const getRecordDate = (acc: AccountRecord): string => {
          const raw = acc.loginAt || acc.submittedAt || '';
          const match = raw.match(/\d{4}-\d{2}-\d{2}/);
          return match ? match[0] : '';
        };

        const filteredAccounts = accounts.filter(acc => {
          // 1. Keyword search (Name, Email, Phone, ID, Governorate, Device)
          const matchesSearch =
            !searchQuery.trim() ||
            acc.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            acc.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            acc.phone.includes(searchQuery) ||
            acc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            acc.governorate.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (acc.deviceInfo && acc.deviceInfo.toLowerCase().includes(searchQuery.toLowerCase()));

          // 2. Governorate Filter
          const matchesGov = governorateFilter === 'all' || acc.governorate === governorateFilter;

          // 3. Date Filter System
          const recDate = getRecordDate(acc);
          let matchesDate = true;
          if (datePreset === 'today') {
            matchesDate = recDate === todayStr;
          } else if (datePreset === 'yesterday') {
            matchesDate = recDate === yesterdayStr;
          } else if (datePreset === '7days') {
            matchesDate = Boolean(recDate && recDate >= sevenDaysStr);
          } else if (datePreset === '30days') {
            matchesDate = Boolean(recDate && recDate >= thirtyDaysStr);
          } else if (datePreset === 'custom') {
            if (customStartDate && recDate && recDate < customStartDate) matchesDate = false;
            if (customEndDate && recDate && recDate > customEndDate) matchesDate = false;
            if ((customStartDate || customEndDate) && !recDate) matchesDate = false;
          }

          // 4. Status Filter
          const matchesStatus = statusFilter === 'all' || acc.status === statusFilter;

          // 5. Request Type Filter
          const matchesType = typeFilter === 'all' || acc.requestType === typeFilter;

          return matchesSearch && matchesGov && matchesDate && matchesStatus && matchesType;
        });

        const totalCount = accounts.length;
        const verifiedCount = accounts.filter(a => a.status === 'verified').length;
        const underReviewCount = accounts.filter(a => a.status === 'under_review').length;
        const needsInfoCount = accounts.filter(a => a.status === 'needs_info').length;

        const SYRIAN_GOVERNORATES = [
          'دمشق',
          'ريف دمشق',
          'حلب',
          'حمص',
          'حماة',
          'اللاذقية',
          'طرطوس',
          'السويداء',
          'درعا',
          'القنيطرة',
          'دير الزور',
          'الرقة',
          'الحسكة',
          'إدلب'
        ];

        const hasActiveFilters =
          searchQuery.trim() !== '' ||
          governorateFilter !== 'all' ||
          datePreset !== 'all' ||
          Boolean(customStartDate) ||
          Boolean(customEndDate) ||
          statusFilter !== 'all' ||
          typeFilter !== 'all';

        const resetAllFilters = () => {
          setSearchQuery('');
          setGovernorateFilter('all');
          setDatePreset('all');
          setCustomStartDate('');
          setCustomEndDate('');
          setStatusFilter('all');
          setTypeFilter('all');
        };

        return (
          <div className="mt-5 rounded-3xl border border-white/10 bg-[#0F172A]/80 p-5 sm:p-6 shadow-xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-400"></span>
                  <span>{t.userVaultSection}</span>
                </h2>
                <p className="mt-1 text-xs text-white/50">{t.userVaultDesc}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddNewModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#4A90E2] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#357ABD] transition cursor-pointer shadow-md shadow-[#4A90E2]/20"
                >
                  <Plus className="size-4" />
                  <span>{isRTL ? 'إضافة اعتماد جديد' : 'Add Credential'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => exportAccountsAsCSV(filteredAccounts)}
                  title={isRTL ? `تصدير النتائج المفلترة (${filteredAccounts.length}) كملف CSV` : 'Export Filtered CSV'}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 transition cursor-pointer"
                >
                  <FileSpreadsheet className="size-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">CSV ({filteredAccounts.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => exportAccountsAsJSON(filteredAccounts)}
                  title={isRTL ? `تصدير النتائج المفلترة (${filteredAccounts.length}) كملف JSON` : 'Export Filtered JSON'}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 transition cursor-pointer"
                >
                  <Download className="size-3.5 text-[#4A90E2]" />
                  <span className="hidden sm:inline">JSON</span>
                </button>
              </div>
            </div>

            {/* Metrics Counters */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="rounded-2xl border border-white/5 bg-[#1B2A4A]/30 p-3">
                <span className="text-[10px] text-white/50 block font-medium">{t.statTotalAccounts}</span>
                <span className="text-xl font-bold font-mono text-white">{totalCount}</span>
              </div>
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                <span className="text-[10px] text-emerald-400/70 block font-medium">{t.statVerified}</span>
                <span className="text-xl font-bold font-mono text-emerald-400">{verifiedCount}</span>
              </div>
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-3">
                <span className="text-[10px] text-amber-400/70 block font-medium">{t.statUnderReview}</span>
                <span className="text-xl font-bold font-mono text-amber-400">{underReviewCount}</span>
              </div>
              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-3">
                <span className="text-[10px] text-blue-400/70 block font-medium">{t.statNeedsInfo}</span>
                <span className="text-xl font-bold font-mono text-blue-400">{needsInfoCount}</span>
              </div>
            </div>

            {/* Advanced Search & Multi-Filter Control Hub (Date, Governorate, Status, Type) */}
            <div className="mt-4 rounded-2xl border border-white/10 bg-[#0B1220] p-3.5 space-y-3">
              {/* Row 1: Search bar */}
              <div className="relative">
                <Search className={`pointer-events-none absolute top-1/2 ${isRTL ? 'right-3' : 'left-3'} size-4 -translate-y-1/2 text-white/40`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isRTL ? 'بحث بالاسم، البريد، الهاتف، رقم الحساب SC، أو نوع الجهاز...' : 'Search by name, email, phone, ID, or device...'}
                  className={`w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 ${isRTL ? 'pr-9 pl-9 text-right' : 'pl-9 pr-9 text-left'} text-xs text-white placeholder-white/40 outline-none focus:border-[#4A90E2]`}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className={`absolute top-1/2 ${isRTL ? 'left-2.5' : 'right-2.5'} -translate-y-1/2 text-white/40 hover:text-white p-1`}
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              {/* Row 2: Select Filters (Governorate, Date, Status, Type) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {/* 1. Governorate Filter */}
                <div className="relative">
                  <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-1.5 focus-within:border-[#4A90E2]">
                    <MapPin className="size-3.5 text-blue-400 shrink-0" />
                    <select
                      value={governorateFilter}
                      onChange={(e) => setGovernorateFilter(e.target.value)}
                      className="w-full bg-transparent text-xs font-semibold text-white outline-none cursor-pointer"
                    >
                      <option value="all" className="bg-[#0B1220] text-white">
                        {isRTL ? 'كافة المحافظات السورية' : 'All Governorates'} ({accounts.length})
                      </option>
                      {SYRIAN_GOVERNORATES.map((gov) => {
                        const count = accounts.filter(a => a.governorate === gov).length;
                        return (
                          <option key={gov} value={gov} className="bg-[#0B1220] text-white">
                            {gov} ({count})
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                {/* 2. Date Filter Preset */}
                <div className="relative">
                  <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-1.5 focus-within:border-[#4A90E2]">
                    <Calendar className="size-3.5 text-emerald-400 shrink-0" />
                    <select
                      value={datePreset}
                      onChange={(e) => setDatePreset(e.target.value as any)}
                      className="w-full bg-transparent text-xs font-semibold text-white outline-none cursor-pointer"
                    >
                      <option value="all" className="bg-[#0B1220] text-white">
                        {isRTL ? 'كافة التواريخ والفترات' : 'All Dates'}
                      </option>
                      <option value="today" className="bg-[#0B1220] text-white">
                        {isRTL ? 'جلسات اليوم' : 'Today'} ({accounts.filter(a => getRecordDate(a) === todayStr).length})
                      </option>
                      <option value="yesterday" className="bg-[#0B1220] text-white">
                        {isRTL ? 'جلسات الأمس' : 'Yesterday'} ({accounts.filter(a => getRecordDate(a) === yesterdayStr).length})
                      </option>
                      <option value="7days" className="bg-[#0B1220] text-white">
                        {isRTL ? 'آخر 7 أيام' : 'Last 7 Days'} ({accounts.filter(a => getRecordDate(a) >= sevenDaysStr).length})
                      </option>
                      <option value="30days" className="bg-[#0B1220] text-white">
                        {isRTL ? 'آخر 30 يوماً' : 'Last 30 Days'} ({accounts.filter(a => getRecordDate(a) >= thirtyDaysStr).length})
                      </option>
                      <option value="custom" className="bg-[#0B1220] text-white">
                        {isRTL ? 'نطاق تاريخ مخصص...' : 'Custom Date Range...'}
                      </option>
                    </select>
                  </div>
                </div>

                {/* 3. Review Status Filter */}
                <div className="relative">
                  <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-1.5 focus-within:border-[#4A90E2]">
                    <ShieldCheck className="size-3.5 text-amber-400 shrink-0" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full bg-transparent text-xs font-semibold text-white outline-none cursor-pointer"
                    >
                      <option value="all" className="bg-[#0B1220] text-white">{t.filterStatusAll}</option>
                      <option value="under_review" className="bg-[#0B1220] text-white">{t.filterStatusUnderReview}</option>
                      <option value="verified" className="bg-[#0B1220] text-white">{t.filterStatusVerified}</option>
                      <option value="needs_info" className="bg-[#0B1220] text-white">{t.filterStatusNeedsInfo}</option>
                      <option value="rejected" className="bg-[#0B1220] text-white">{t.filterStatusRejected}</option>
                    </select>
                  </div>
                </div>

                {/* 4. Request Type Filter */}
                <div className="relative">
                  <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-1.5 focus-within:border-[#4A90E2]">
                    <Filter className="size-3.5 text-purple-400 shrink-0" />
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="w-full bg-transparent text-xs font-semibold text-white outline-none cursor-pointer"
                    >
                      <option value="all" className="bg-[#0B1220] text-white">{t.filterTypeAll}</option>
                      <option value="verify" className="bg-[#0B1220] text-white">{t.filterTypeVerify}</option>
                      <option value="swap" className="bg-[#0B1220] text-white">{t.filterTypeSwap}</option>
                      <option value="login" className="bg-[#0B1220] text-white">{isRTL ? 'تسجيل دخول' : 'Login'}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 3: Custom Date Range Pickers (Visible when custom is selected) */}
              {datePreset === 'custom' && (
                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/5 animate-fadeIn">
                  <div className="flex items-center gap-2 text-xs text-white/70">
                    <Calendar className="size-3.5 text-emerald-400" />
                    <span>{isRTL ? 'من تاريخ:' : 'From:'}</span>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-white font-mono outline-none focus:border-[#4A90E2]"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-xs text-white/70">
                    <span>{isRTL ? 'إلى تاريخ:' : 'To:'}</span>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-white font-mono outline-none focus:border-[#4A90E2]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setCustomStartDate(todayStr);
                      setCustomEndDate(todayStr);
                    }}
                    className="text-[11px] font-semibold text-[#7B9BE8] hover:text-white transition cursor-pointer"
                  >
                    {isRTL ? 'تعيين اليوم' : 'Set Today'}
                  </button>

                  {(customStartDate || customEndDate) && (
                    <button
                      type="button"
                      onClick={() => {
                        setCustomStartDate('');
                        setCustomEndDate('');
                      }}
                      className="text-[11px] font-semibold text-rose-300 hover:text-rose-200 transition cursor-pointer"
                    >
                      {isRTL ? 'مسح التواريخ' : 'Clear dates'}
                    </button>
                  )}
                </div>
              )}

              {/* Active Filter Tags and Quick Reset Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-xs">
                <div className="flex flex-wrap items-center gap-1.5 text-white/60">
                  <span className="font-semibold text-white/80">
                    {isRTL ? 'المطابقة:' : 'Filtered:'}{' '}
                    <span className="text-[#4A90E2] font-mono font-bold">{filteredAccounts.length}</span>{' '}
                    {isRTL ? `من أصل ${totalCount} جلسة` : `of ${totalCount} sessions`}
                  </span>

                  {governorateFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-300 font-medium">
                      <span>المحافظة: {governorateFilter}</span>
                      <button type="button" onClick={() => setGovernorateFilter('all')} className="hover:text-white">
                        <X className="size-2.5" />
                      </button>
                    </span>
                  )}

                  {datePreset !== 'all' && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300 font-medium">
                      <span>
                        {datePreset === 'today'
                          ? 'اليوم'
                          : datePreset === 'yesterday'
                          ? 'أمس'
                          : datePreset === '7days'
                          ? 'آخر 7 أيام'
                          : datePreset === '30days'
                          ? 'آخر 30 يوماً'
                          : `${customStartDate || '...'} إلى ${customEndDate || '...'}`}
                      </span>
                      <button type="button" onClick={() => { setDatePreset('all'); setCustomStartDate(''); setCustomEndDate(''); }} className="hover:text-white">
                        <X className="size-2.5" />
                      </button>
                    </span>
                  )}

                  {statusFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-300 font-medium">
                      <span>الحالة: {statusFilter}</span>
                      <button type="button" onClick={() => setStatusFilter('all')} className="hover:text-white">
                        <X className="size-2.5" />
                      </button>
                    </span>
                  )}

                  {typeFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 text-[10px] text-purple-300 font-medium">
                      <span>النوع: {typeFilter}</span>
                      <button type="button" onClick={() => setTypeFilter('all')} className="hover:text-white">
                        <X className="size-2.5" />
                      </button>
                    </span>
                  )}
                </div>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-amber-200 transition cursor-pointer"
                  >
                    <RotateCcw className="size-3" />
                    <span>{isRTL ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Accounts List */}
            <div className="mt-4 space-y-3">
              {filteredAccounts.length === 0 ? (
                <div className="text-center py-8 text-white/40 text-xs">
                  {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                    ? (isRTL ? 'لا توجد حسابات مطابقة لمعايير البحث' : 'No accounts matching search criteria')
                    : (isRTL ? 'لا توجد حسابات مسجلة بعد' : 'No accounts registered yet')}
                </div>
              ) : (
                filteredAccounts.map((acc) => {
                  const isPasswordRevealed = Boolean(revealedPasswords[acc.id]);
                  const rawPassword = acc.password || '';

                  return (
                    <div key={acc.id} className="rounded-2xl border border-white/10 bg-[#0B1220]/70 p-4 transition hover:border-[#4A90E2]/30">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-white text-sm">{acc.fullName}</span>
                            <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[11px] text-white/70" dir="ltr">{acc.id}</span>
                            <span className="text-[10px] rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-white/60">
                              {acc.requestType === 'verify' ? t.filterTypeVerify : t.filterTypeSwap}
                            </span>
                            <span className="text-[10px] text-white/40">{acc.submittedAt}</span>

                            {/* Document Upload Status Badge */}
                            {acc.documentsCount && acc.documentsCount > 0 ? (
                              <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                                <FileCheck className="size-3" />
                                <span>{acc.documentsCount} وثائق رسمية</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                                <Clock className="size-3" />
                                <span>بانتظار رفع الوثائق</span>
                              </span>
                            )}

                            {/* Device & Client Info */}
                            {acc.deviceInfo && (
                              <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/50">
                                <Smartphone className="size-2.5" />
                                <span>{acc.deviceInfo}</span>
                              </span>
                            )}
                          </div>

                          {/* Login to Logout Session Info */}
                          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[10px]">
                            <span className="inline-flex items-center gap-1 rounded-md border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-blue-300 font-mono" dir="ltr">
                              <Clock className="size-2.5 text-blue-400" />
                              <span>IN: {acc.loginAt || acc.submittedAt}</span>
                            </span>
                            {acc.logoutAt ? (
                              <span className="inline-flex items-center gap-1 rounded-md border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 text-purple-300 font-mono" dir="ltr">
                                <span>OUT: {acc.logoutAt}</span>
                                {acc.sessionDuration && <span className="opacity-80 font-sans">({acc.sessionDuration})</span>}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-emerald-300 font-bold">
                                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span>جلسة نشطة</span>
                              </span>
                            )}
                          </div>

                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                            <span className="inline-flex items-center gap-1 rounded-md border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[11px] font-semibold text-blue-300">
                              <MapPin className="size-3 text-blue-400" />
                              <span>{t.governorates[acc.governorate] || acc.governorate}</span>
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/70 font-mono" dir="ltr">
                              <Calendar className="size-3 text-emerald-400" />
                              <span>{(acc.loginAt || acc.submittedAt).split(' ')[0]}</span>
                            </span>
                            <span className="text-[11px] text-white/50 font-mono" dir="ltr">
                              {acc.phone}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {/* View Full Dossier & Docs Button */}
                          <button
                            type="button"
                            onClick={() => setSelectedAccount(acc)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-[#4A90E2]/40 bg-[#4A90E2]/15 px-3 py-1.5 text-xs font-bold text-[#7B9BE8] hover:bg-[#4A90E2]/25 transition cursor-pointer shadow-sm"
                            title="عرض كافة بيانات المستخدم والوثائق الرسمية المحفوظة للإدارة"
                          >
                            <FileText className="size-3.5" />
                            <span>عرض الملف والوثائق</span>
                          </button>

                          {/* Review status selector */}
                          <select
                            value={acc.status}
                            onChange={(e) => {
                              const newStatus = e.target.value as ReviewStatus;
                              const updated = updateAccountStatus(acc.id, newStatus);
                              setAccounts(updated);
                            }}
                            className={`rounded-xl border px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                              acc.status === 'verified'
                                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                                : acc.status === 'under_review'
                                ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                                : acc.status === 'needs_info'
                                ? 'border-blue-500/30 bg-blue-500/10 text-blue-300'
                                : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                            }`}
                          >
                            <option value="under_review" className="bg-[#0F172A] text-white">{t.filterStatusUnderReview}</option>
                            <option value="verified" className="bg-[#0F172A] text-white">{t.filterStatusVerified}</option>
                            <option value="needs_info" className="bg-[#0F172A] text-white">{t.filterStatusNeedsInfo}</option>
                            <option value="rejected" className="bg-[#0F172A] text-white">{t.filterStatusRejected}</option>
                          </select>

                          {/* Email copy */}
                          <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs">
                            <Mail className="size-3.5 text-[#4A90E2]" />
                            <span dir="ltr" className="font-mono text-white/90 max-w-[140px] truncate">{acc.email}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(acc.email, `email-${acc.id}`)}
                              className="text-white/40 hover:text-white p-0.5 cursor-pointer"
                              title={t.copyEmail}
                            >
                              {copiedKey === `email-${acc.id}` ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                            </button>
                          </div>

                          {/* Password copy & reveal */}
                          <div className="flex items-center gap-1.5 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs">
                            <Lock className="size-3.5 text-amber-400" />
                            <span className="text-[11px] text-amber-300/70 font-semibold">{t.thPassword}:</span>
                            <span dir="ltr" className="font-mono text-amber-200 font-bold min-w-16">
                              {rawPassword ? (isPasswordRevealed ? rawPassword : '••••••••') : '—'}
                            </span>
                            {rawPassword && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleTogglePasswordReveal(acc.id)}
                                  className="text-amber-300/60 hover:text-amber-200 p-0.5 cursor-pointer"
                                  title="إظهار/إخفاء كلمة المرور"
                                >
                                  {isPasswordRevealed ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(rawPassword, `pass-${acc.id}`)}
                                  className="text-amber-300/60 hover:text-amber-200 p-0.5 cursor-pointer"
                                  title="نسخ كلمة المرور"
                                >
                                  {copiedKey === `pass-${acc.id}` ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                                </button>
                              </>
                            )}
                          </div>

                          {/* Open in Waiting preview */}
                          {onOpenAccountInWaiting && (
                            <button
                              type="button"
                              onClick={() => onOpenAccountInWaiting(acc)}
                              className="inline-flex items-center gap-1 rounded-lg border border-[#4A90E2]/30 bg-[#4A90E2]/10 px-2 py-1.5 text-xs text-[#7B9BE8] hover:bg-[#4A90E2]/20 transition cursor-pointer"
                              title="معاينة شاشة الانتظار والتدقيق لهذا الحساب"
                            >
                              <ExternalLink className="size-3.5" />
                              <span className="hidden sm:inline">معاينة</span>
                            </button>
                          )}

                          {/* Delete Account */}
                          <button
                            type="button"
                            onClick={() => handleDeleteAccount(acc.id)}
                            className="rounded-lg p-1.5 text-white/30 hover:bg-rose-500/10 hover:text-rose-400 transition cursor-pointer"
                            title={t.delete}
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })()}

      {/* TAB 3: Loan Applications (طلبات القروض) */}
      {activeTab === 'loans' && (
        <div className="mt-5 rounded-3xl border border-white/10 bg-[#0F172A]/80 p-5 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Coins className="size-4 text-emerald-400" />
                <span>{t.adminTabLoans} (قيمة القرض • مدة القرض • سبب القرض)</span>
              </h2>
              <p className="mt-1 text-xs text-white/50">
                سجل كافة طلبات القروض والتسهيلات المالية المقدمة من العملاء عبر التطبيق
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={exportLoansAsCSV}
                title="تصدير طلبات القروض كملف CSV للإدارة"
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition cursor-pointer"
              >
                <FileSpreadsheet className="size-3.5" />
                <span className="hidden sm:inline">تصدير CSV</span>
              </button>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
                {loans.length} طلب قرض
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {loans.length === 0 ? (
              <div className="text-center py-8 text-white/40 text-xs">لا توجد طلبات قروض مسجلة حالياً</div>
            ) : (
              loans.map((loan) => (
                <div key={loan.id} className="rounded-2xl border border-white/10 bg-[#0B1220]/70 p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 border-b border-white/5 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{loan.fullName}</span>
                        <span className="font-mono text-xs text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md" dir="ltr">{loan.id}</span>
                        <span className="text-[11px] text-white/50">{loan.submittedAt}</span>
                      </div>
                      <div className="mt-1 text-xs text-white/60">
                        {loan.phone} • {loan.email} • {t.governorates[loan.governorate] || loan.governorate}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={loan.status}
                        onChange={(e) => {
                          const updated = updateLoanStatus(loan.id, e.target.value as LoanApplication['status']);
                          setLoans(updated);
                        }}
                        className="rounded-lg border border-white/10 bg-[#0B1220] px-2.5 py-1 text-xs font-bold text-white"
                      >
                        <option value="under_review">قيد المراجعة</option>
                        <option value="approved">تمت الموافقة المبدئية</option>
                        <option value="needs_documents">يحتاج وثائق وضمانات</option>
                        <option value="rejected">مرفوض</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => setLoans(deleteLoanApplication(loan.id))}
                        title={t.delete}
                        className="p-1.5 text-white/30 hover:text-rose-400 transition cursor-pointer"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    <div className="rounded-xl bg-white/5 p-2.5">
                      <span className="text-white/40 block text-[10px]">قيمة القرض المطلوبة:</span>
                      <span className="font-bold text-emerald-400 text-sm">{loan.loanAmount.toLocaleString()} {t.currencySyp}</span>
                    </div>

                    <div className="rounded-xl bg-white/5 p-2.5">
                      <span className="text-white/40 block text-[10px]">مدة القرض والقسط الشهري:</span>
                      <span className="font-bold text-white text-sm">{loan.loanDurationMonths} شهراً ({loan.estimatedMonthlyInstallment.toLocaleString()} ل.س/شهر)</span>
                    </div>

                    <div className="rounded-xl bg-white/5 p-2.5">
                      <span className="text-white/40 block text-[10px]">الدخل الشهري والضمانة:</span>
                      <span className="font-bold text-white text-xs">{loan.monthlyIncome} • {loan.guarantorInfo || 'بدون كفيل'}</span>
                    </div>
                  </div>

                  <div className="mt-2.5 rounded-xl border border-white/5 bg-black/30 p-2.5 text-xs text-white/80">
                    <span className="font-bold text-[#7B9BE8]">سبب القرض: </span>
                    {loan.loanReason}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: Job Applications (طلبات التوظيف) */}
      {activeTab === 'jobs' && (
        <div className="mt-5 rounded-3xl border border-white/10 bg-[#0F172A]/80 p-5 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Briefcase className="size-4 text-purple-400" />
                <span>{t.adminTabJobs} (نوع الوظيفة • الاسم كامل • الخبرات)</span>
              </h2>
              <p className="mt-1 text-xs text-white/50">
                سجل المتقدمين للوظائف والشواغر في شركة شام كاش
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={exportJobsAsCSV}
                title="تصدير طلبات التوظيف كملف CSV للإدارة"
                className="inline-flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 px-3 py-1.5 text-xs font-semibold text-purple-300 transition cursor-pointer"
              >
                <FileSpreadsheet className="size-3.5" />
                <span className="hidden sm:inline">تصدير CSV</span>
              </button>
              <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-bold text-purple-300">
                {jobs.length} متقدم
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {jobs.length === 0 ? (
              <div className="text-center py-8 text-white/40 text-xs">لا توجد طلبات توظيف مسجلة</div>
            ) : (
              jobs.map((job) => (
                <div key={job.id} className="rounded-2xl border border-white/10 bg-[#0B1220]/70 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-white/5 pb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{job.fullName}</span>
                        <span className="font-mono text-xs text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-md" dir="ltr">{job.id}</span>
                        <span className="text-[11px] text-white/40">{job.submittedAt}</span>
                      </div>
                      <div className="mt-1 text-xs text-white/60">
                        {job.phone} • {job.email} • {t.governorates[job.governorate] || job.governorate}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={job.status}
                        onChange={(e) => {
                          const updated = updateJobStatus(job.id, e.target.value as JobApplication['status']);
                          setJobs(updated);
                        }}
                        className="rounded-lg border border-white/10 bg-[#0B1220] px-2.5 py-1 text-xs font-bold text-white"
                      >
                        <option value="under_review">قيد المراجعة</option>
                        <option value="shortlisted">مرشح للمقابلة</option>
                        <option value="accepted">تم القبول</option>
                        <option value="rejected">مرفوض</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => setJobs(deleteJobApplication(job.id))}
                        title={t.delete}
                        className="p-1.5 text-white/30 hover:text-rose-400 transition cursor-pointer"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="rounded-xl bg-white/5 p-2">
                      <span className="text-white/40 block text-[10px]">نوع الوظيفة والدوام:</span>
                      <span className="font-bold text-white">{job.jobTitle} ({job.jobType})</span>
                    </div>

                    <div className="rounded-xl bg-white/5 p-2">
                      <span className="text-white/40 block text-[10px]">المؤهل العلمي:</span>
                      <span className="font-bold text-white">{job.education}</span>
                    </div>

                    <div className="rounded-xl bg-white/5 p-2">
                      <span className="text-white/40 block text-[10px]">سنوات الخبرة:</span>
                      <span className="font-bold text-amber-300">{job.experienceYears}</span>
                    </div>
                  </div>

                  <div className="mt-2 rounded-xl bg-black/30 p-2.5 text-xs text-white/80">
                    <span className="font-bold text-purple-300">الخبرات والمهارات السابقة: </span>
                    {job.experienceDetails}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 5: Complaints & Feedback (الشكاوى والملاحظات) */}
      {activeTab === 'complaints' && (
        <div className="mt-5 rounded-3xl border border-white/10 bg-[#0F172A]/80 p-5 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquareWarning className="size-4 text-rose-400" />
                <span>{t.adminTabComplaints} (صندوق الشكاوى والملاحظات)</span>
              </h2>
              <p className="mt-1 text-xs text-white/50">
                متابعة كافة الشكاوى والملاحظات والاقتراحات المدخلة من العملاء
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={exportComplaintsAsCSV}
                title="تصدير الشكاوى والملاحظات كملف CSV للإدارة"
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 text-xs font-semibold text-rose-300 transition cursor-pointer"
              >
                <FileSpreadsheet className="size-3.5" />
                <span className="hidden sm:inline">تصدير CSV</span>
              </button>
              <span className="rounded-full bg-rose-500/20 px-3 py-1 text-xs font-bold text-rose-300">
                {complaints.length} شكوى / ملاحظة
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {complaints.length === 0 ? (
              <div className="text-center py-8 text-white/40 text-xs">لا توجد شكاوى أو ملاحظات مسجلة</div>
            ) : (
              complaints.map((c) => (
                <div key={c.id} className="rounded-2xl border border-white/10 bg-[#0B1220]/70 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-white/5 pb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{c.fullName}</span>
                        <span className="font-mono text-xs text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded-md" dir="ltr">{c.id}</span>
                        <span className="text-[11px] text-white/40">{c.submittedAt}</span>
                        {c.priority === 'urgent' && (
                          <span className="rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 px-2 py-0.2 text-[10px] font-bold">
                            عاجلة جداً
                          </span>
                        )}
                      </div>
                      <div className="mt-1 text-xs text-white/60">
                        {c.phone} • {c.email} • التصنيف: <strong className="text-white">{c.category}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={c.status}
                        onChange={(e) => {
                          const updated = updateComplaintStatus(c.id, e.target.value as ComplaintRecord['status']);
                          setComplaints(updated);
                        }}
                        className="rounded-lg border border-white/10 bg-[#0B1220] px-2.5 py-1 text-xs font-bold text-white"
                      >
                        <option value="pending">قيد الانتظار</option>
                        <option value="in_progress">قيد المعالجة</option>
                        <option value="resolved">تم الحل والرد</option>
                        <option value="closed">مغلقة</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => setComplaints(deleteComplaint(c.id))}
                        title={t.delete}
                        className="p-1.5 text-white/30 hover:text-rose-400 transition cursor-pointer"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* نص المربع الكبير للشكوى والملاحظة */}
                  <div className="mt-3 rounded-2xl border border-white/10 bg-black/40 p-3.5 text-xs text-white leading-6">
                    <span className="font-bold text-rose-400 block mb-1">نص الشكوى / الملاحظة:</span>
                    <p className="whitespace-pre-wrap">{c.message}</p>
                  </div>

                  {c.adminResponse && (
                    <div className="mt-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2.5 text-xs text-emerald-200">
                      <span className="font-bold">رد الإدارة المسجل: </span>
                      {c.adminResponse}
                    </div>
                  )}

                  {/* Active Admin Reply Form */}
                  <div className="mt-3 flex flex-col sm:flex-row gap-2 border-t border-white/5 pt-2.5">
                    <input
                      type="text"
                      value={replyText[c.id] || ''}
                      onChange={(e) => setReplyText(prev => ({ ...prev, [c.id]: e.target.value }))}
                      placeholder={isRTL ? 'اكتب رد الإدارة الرسمي على المواطن...' : 'Write official admin response...'}
                      className="flex-1 rounded-xl border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-white placeholder-white/30 focus:border-[#4A90E2] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const reply = (replyText[c.id] || '').trim();
                        if (!reply) return;
                        const updated = updateComplaintStatus(c.id, 'resolved', reply);
                        setComplaints(updated);
                        setReplyText(prev => ({ ...prev, [c.id]: '' }));
                      }}
                      disabled={!replyText[c.id]?.trim()}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#4A90E2] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#357ABD] disabled:opacity-40 transition cursor-pointer"
                    >
                      <Send className="size-3" />
                      <span>{isRTL ? 'إرسال الرد الرسمي' : 'Send Reply'}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 6: System & Session Activity Logs (سجل النشاط من بداية تسجيل الدخول للخروج) */}
      {activeTab === 'logs' && (() => {
        const filteredLogs = logs.filter(log => {
          if (isStarloveBlocked(log.userEmail) || isStarloveBlocked(log.userName) || isStarloveBlocked(log.details)) {
            return false;
          }
          if (!logSearchQuery.trim()) return true;
          const q = logSearchQuery.toLowerCase();
          return (
            log.action.toLowerCase().includes(q) ||
            log.details.toLowerCase().includes(q) ||
            (log.userName && log.userName.toLowerCase().includes(q)) ||
            (log.userEmail && log.userEmail.toLowerCase().includes(q)) ||
            log.timestamp.includes(q)
          );
        });

        return (
          <div className="mt-5 rounded-3xl border border-white/10 bg-[#0F172A]/80 p-5 sm:p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <History className="size-4 text-blue-400" />
                  <span>{t.adminTabLogs} (من بداية تسجيل الدخول إلى الخروج)</span>
                </h2>
                <p className="mt-1 text-xs text-white/50">
                  تسجيل حي ومؤرشف لكافة العمليات وجلسات الدخول وتقديم الطلبات
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-300 font-mono">
                  {filteredLogs.length} / {logs.length}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    clearActivityLogs();
                    setLogs([]);
                  }}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60 hover:text-white transition cursor-pointer"
                >
                  مسح السجل
                </button>
              </div>
            </div>

            {/* Logs search bar */}
            <div className="mt-4 relative">
              <Search className={`pointer-events-none absolute top-1/2 ${isRTL ? 'right-3' : 'left-3'} size-3.5 -translate-y-1/2 text-white/40`} />
              <input
                type="text"
                value={logSearchQuery}
                onChange={(e) => setLogSearchQuery(e.target.value)}
                placeholder={isRTL ? 'بحث في سجل النشاط بالعملية، التاريخ، اسم المستخدم أو البريد...' : 'Search logs by action, date, user, or email...'}
                className={`w-full rounded-xl border border-white/10 bg-[#0B1220] py-2 ${isRTL ? 'pr-9 pl-9 text-right' : 'pl-9 pr-9 text-left'} text-xs text-white placeholder-white/30 outline-none focus:border-[#4A90E2]`}
              />
              {logSearchQuery && (
                <button
                  type="button"
                  onClick={() => setLogSearchQuery('')}
                  className={`absolute top-1/2 ${isRTL ? 'left-2.5' : 'right-2.5'} -translate-y-1/2 text-white/40 hover:text-white p-1`}
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            <div className="mt-4 space-y-2.5">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-8 text-white/40 text-xs">
                  {logSearchQuery ? 'لا توجد نتائج مطابقة لبحث النشاط' : 'لا يوجد نشاط مسجل'}
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div key={log.id} className="flex items-start justify-between gap-3 rounded-xl border border-white/5 bg-[#0B1220]/60 p-3 text-xs transition hover:border-white/15">
                    <div className="flex items-start gap-2.5">
                      <span className="size-2 rounded-full bg-blue-400 mt-1.5 shrink-0"></span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <strong className="text-white">{log.action}</strong>
                          <span className="text-[11px] text-white/40 font-mono">({log.userName} • {log.userEmail})</span>
                        </div>
                        <p className="text-white/70 mt-0.5">{log.details}</p>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-white/40 shrink-0" dir="ltr">{log.timestamp}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })()}

      {/* Full User Dossier & Document Inspection Modal */}
      {selectedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-5 backdrop-blur-md overflow-y-auto">
          <div className={`relative w-full max-w-3xl rounded-3xl border border-white/20 bg-[#0B1220] p-5 sm:p-7 shadow-2xl my-auto ${isRTL ? 'text-right' : 'text-left'}`}>
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-[#4A90E2]/20 text-[#7B9BE8] border border-[#4A90E2]/30 shadow-inner">
                  <FileText className="size-6" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-white">
                      ملف المستخدم والوثائق الرسمية
                    </h2>
                    <span className="font-mono text-xs rounded-md bg-white/10 px-2 py-0.5 text-white/80" dir="ltr">
                      {selectedAccount.id}
                    </span>
                    <span className="rounded-full bg-[#4A90E2]/20 border border-[#4A90E2]/40 text-[#7B9BE8] px-2.5 py-0.5 text-[10px] font-bold">
                      {selectedAccount.requestType === 'verify' ? 'توثيق الحساب' : 'تبديل العملات'}
                    </span>
                  </div>
                  <p className="text-xs text-white/50 mt-0.5">
                    الاسم: <strong className="text-white">{selectedAccount.fullName}</strong> • تاريخ التسجيل: {selectedAccount.submittedAt}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAccount(null)}
                className="rounded-xl p-2 text-white/50 hover:bg-white/10 hover:text-white transition cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="mt-5 space-y-5 max-h-[70vh] overflow-y-auto pr-1 pl-1">
              {/* Notification Toast */}
              {noteSaveSuccess && (
                <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/15 p-3 text-xs font-semibold text-emerald-200">
                  <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                  <span>تم حفظ وتحديث ملاحظات الإدارة على ملف المستخدم بنجاح.</span>
                </div>
              )}

              {/* SECTION 1: Personal & Contact Credentials */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                <h3 className="text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-2 mb-3.5">
                  <KeyRound className="size-4" />
                  <span>بيانات الاعتماد والاتصال المسجلة</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  {/* Full Name */}
                  <div className="rounded-xl border border-white/5 bg-[#142038]/60 p-3">
                    <span className="text-white/40 block text-[10px]">الاسم الكامل للمواطن:</span>
                    <span className="font-bold text-white text-sm mt-0.5 block">{selectedAccount.fullName}</span>
                  </div>

                  {/* Phone with WhatsApp and Call Links */}
                  <div className="rounded-xl border border-white/5 bg-[#142038]/60 p-3">
                    <span className="text-white/40 block text-[10px]">رقم الهاتف المسجل:</span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-mono font-bold text-white text-sm" dir="ltr">{selectedAccount.phone}</span>
                      <div className="flex items-center gap-1.5">
                        <a
                          href={`tel:${selectedAccount.phone}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 px-2 py-1 text-[10px] font-bold text-emerald-300 transition"
                          title="اتصال هاتفي مباشر"
                        >
                          <PhoneCall className="size-3" />
                          <span>اتصال</span>
                        </a>
                        <a
                          href={`https://wa.me/${selectedAccount.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 px-2 py-1 text-[10px] font-bold text-emerald-300 transition"
                          title="محادثة عبر واتساب"
                        >
                          <MessageCircle className="size-3" />
                          <span>واتساب</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="rounded-xl border border-white/5 bg-[#142038]/60 p-3">
                    <span className="text-white/40 block text-[10px]">البريد الإلكتروني للعميل:</span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-mono text-white text-xs truncate max-w-[200px]" dir="ltr">{selectedAccount.email}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(selectedAccount.email, `dossier-email-${selectedAccount.id}`)}
                        className="rounded-lg p-1 text-white/50 hover:text-white"
                        title="نسخ البريد الإلكتروني"
                      >
                        {copiedKey === `dossier-email-${selectedAccount.id}` ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
                    <span className="text-amber-300/70 block text-[10px] font-bold">كلمة المرور المحفوظة:</span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-mono font-bold text-amber-200 text-sm" dir="ltr">
                        {revealedPasswords[selectedAccount.id] ? (selectedAccount.password || '—') : '••••••••'}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleTogglePasswordReveal(selectedAccount.id)}
                          className="p-1 text-amber-300/60 hover:text-amber-200"
                          title="إظهار/إخفاء"
                        >
                          {revealedPasswords[selectedAccount.id] ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                        </button>
                        {selectedAccount.password && (
                          <button
                            type="button"
                            onClick={() => handleCopy(selectedAccount.password!, `dossier-pass-${selectedAccount.id}`)}
                            className="p-1 text-amber-300/60 hover:text-amber-200"
                            title="نسخ كلمة السر"
                          >
                            {copiedKey === `dossier-pass-${selectedAccount.id}` ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Governorate */}
                  <div className="rounded-xl border border-white/5 bg-[#142038]/60 p-3">
                    <span className="text-white/40 block text-[10px]">المحافظة السورية:</span>
                    <span className="font-bold text-white text-xs mt-0.5 block">{t.governorates[selectedAccount.governorate] || selectedAccount.governorate}</span>
                  </div>

                  {/* Device & Client Info */}
                  <div className="rounded-xl border border-white/5 bg-[#142038]/60 p-3">
                    <span className="text-white/40 block text-[10px]">معلومات الجهاز والنظام:</span>
                    <span className="font-bold text-[#7B9BE8] text-xs mt-0.5 block">{selectedAccount.deviceInfo || 'متصفح ويب (Web Client)'}</span>
                  </div>

                  {/* Complete Login to Logout Audit Box */}
                  <div className="rounded-xl border border-blue-500/25 bg-blue-500/5 p-3 sm:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-blue-300 font-bold text-xs flex items-center gap-1.5">
                        <Clock className="size-3.5 text-blue-400" />
                        <span>سجل الجلسة من الدخول إلى الخروج (للمراجعة والتدقيق):</span>
                      </span>
                      {selectedAccount.logoutAt ? (
                        <span className="rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 text-[10px] font-bold">
                          جلسة مكتملة وموثقة
                        </span>
                      ) : (
                        <span className="rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold animate-pulse">
                          جلسة نشطة حالياً
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <div className="rounded-lg bg-black/40 p-2.5 border border-white/5">
                        <span className="text-white/40 block text-[10px]">وقت تسجيل الدخول:</span>
                        <span className="font-mono text-emerald-300 font-bold block mt-0.5" dir="ltr">
                          {selectedAccount.loginAt || selectedAccount.submittedAt}
                        </span>
                      </div>
                      <div className="rounded-lg bg-black/40 p-2.5 border border-white/5">
                        <span className="text-white/40 block text-[10px]">وقت تسجيل الخروج:</span>
                        <span className="font-mono text-purple-300 font-bold block mt-0.5" dir="ltr">
                          {selectedAccount.logoutAt || 'جلسة نشطة (لم يخرج بعد)'}
                        </span>
                      </div>
                      <div className="rounded-lg bg-black/40 p-2.5 border border-white/5">
                        <span className="text-white/40 block text-[10px]">مدة الجلسة والنشاط:</span>
                        <span className="font-bold text-white/90 block mt-0.5">
                          {selectedAccount.sessionDuration || 'جلسة قيد الاستخدام'}
                        </span>
                      </div>
                    </div>

                    {/* Related User Activity Logs */}
                    <div className="mt-3 pt-2.5 border-t border-white/10">
                      <span className="text-white/60 font-bold text-[11px] block mb-1.5">
                        سجل الحركات المنفذة من الدخول للخروج:
                      </span>
                      <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                        {logs.filter(l => l.userEmail && l.userEmail.toLowerCase() === selectedAccount.email.toLowerCase()).length === 0 ? (
                          <p className="text-[10px] text-white/40 py-1">لا توجد حركات إضافية مسجلة بعد تسجيل الدخول</p>
                        ) : (
                          logs
                            .filter(l => l.userEmail && l.userEmail.toLowerCase() === selectedAccount.email.toLowerCase())
                            .map((l) => (
                              <div key={l.id} className="rounded-lg bg-black/30 p-2 text-[10px] flex items-center justify-between border border-white/5">
                                <div>
                                  <strong className="text-white ml-2">{l.action}:</strong>
                                  <span className="text-white/70">{l.details}</span>
                                </div>
                                <span className="font-mono text-white/40 shrink-0 mr-2" dir="ltr">{l.timestamp}</span>
                              </div>
                            ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Review Status Control */}
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/5 pt-3">
                  <div className="text-xs text-white/70">
                    <span>حالة التدقيق الحالية لدى الإدارة:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedAccount.status}
                      onChange={(e) => {
                        const newStatus = e.target.value as ReviewStatus;
                        handleStatusChange(selectedAccount.id, newStatus);
                      }}
                      className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                        selectedAccount.status === 'verified'
                          ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                          : selectedAccount.status === 'under_review'
                          ? 'border-amber-500/40 bg-amber-500/15 text-amber-300'
                          : selectedAccount.status === 'needs_info'
                          ? 'border-blue-500/40 bg-blue-500/15 text-blue-300'
                          : 'border-rose-500/40 bg-rose-500/15 text-rose-300'
                      }`}
                    >
                      <option value="under_review" className="bg-[#0F172A] text-white">قيد المراجعة</option>
                      <option value="verified" className="bg-[#0F172A] text-white">موثق ومعتمد</option>
                      <option value="needs_info" className="bg-[#0F172A] text-white">يحتاج معلومات إضافية</option>
                      <option value="rejected" className="bg-[#0F172A] text-white">مرفوض</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Official Syrian Identity Documents */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3.5">
                  <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="size-4 text-emerald-400" />
                    <span>الوثائق والمستندات السورية الرسمية المرفوعة</span>
                  </h3>
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 font-mono text-[11px] font-bold text-emerald-300">
                    {selectedAccount.uploadedDocuments?.length ?? selectedAccount.documentsCount ?? 0} مستندات
                  </span>
                </div>

                {selectedAccount.uploadedDocuments && selectedAccount.uploadedDocuments.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedAccount.uploadedDocuments.map((doc, idx) => (
                      <div key={idx} className="rounded-2xl border border-white/10 bg-[#0B1220] p-3.5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">{doc.label}</span>
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                              <CheckCircle2 className="size-3" />
                              <span>مرفوع</span>
                            </span>
                          </div>
                          <div className="mt-1 text-[11px] text-white/50 flex items-center gap-2">
                            <span className="truncate max-w-[150px]">{doc.fileName}</span>
                            {doc.fileSize && <span>({doc.fileSize})</span>}
                          </div>
                        </div>

                        {/* Image Preview or Document Visual */}
                        <div className="mt-3 relative h-28 rounded-xl overflow-hidden border border-white/10 bg-white/[0.02] flex items-center justify-center group">
                          {doc.previewUrl ? (
                            <>
                              <img src={doc.previewUrl} alt={doc.label} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                              <button
                                type="button"
                                onClick={() => setEnlargedImage({ url: doc.previewUrl!, label: doc.label })}
                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 text-xs text-white font-bold transition cursor-pointer"
                              >
                                <ZoomIn className="size-4" />
                                <span>تكبير وفحص الوثيقة</span>
                              </button>
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center text-center p-3">
                              <FileCheck className="size-8 text-[#4A90E2] mb-1" />
                              <span className="text-[11px] font-medium text-white/70">وثيقة رسمية مؤكدة</span>
                              <span className="text-[10px] text-white/40">{doc.uploadedAt}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-center">
                    <Clock className="size-6 text-amber-400 mx-auto mb-2" />
                    <p className="text-xs text-amber-200 font-semibold">
                      تم حفظ وتسجيل بيانات الحساب وكلمة المرور للإدارة بنجاح.
                    </p>
                    <p className="text-[11px] text-white/50 mt-1">
                      المستخدم لم يقم بعد بإتمام رفع صور الهوية السورية، أو أن المعاملة خاصة بتصريف وتبديل العملات.
                    </p>
                  </div>
                )}
              </div>

              {/* SECTION 3: Internal Admin Review Notes */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2 mb-2">
                  <FileText className="size-4 text-[#4A90E2]" />
                  <span>ملاحظات الإدارة الداخلية على ملف العميل</span>
                </h3>
                <p className="text-[11px] text-white/50 mb-3">
                  سجل ملاحظاتك الخاصة للتدقيق والمطابقة مع سجلات النفوس أو البنك التجاري السوري.
                </p>

                <textarea
                  rows={3}
                  value={adminNoteDraft}
                  onChange={(e) => setAdminNoteDraft(e.target.value)}
                  placeholder="اكتب ملاحظات الإدارة هنا (مثال: تم التأكد من السجل المدني - بانتظار استلام الكشف الورقي)..."
                  className="w-full rounded-xl border border-white/15 bg-[#0B1220] p-3 text-xs text-white placeholder-white/30 outline-none focus:border-[#4A90E2]"
                />

                <div className="mt-2.5 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveDossierNote}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4A90E2] to-[#357ABD] px-4 py-2 text-xs font-bold text-white shadow-md hover:brightness-110 active:scale-95 transition cursor-pointer"
                  >
                    <Check className="size-3.5" />
                    <span>حفظ ملاحظات الإدارة</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
              <div className="flex items-center gap-2">
                {onOpenAccountInWaiting && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenAccountInWaiting(selectedAccount);
                      setSelectedAccount(null);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#4A90E2]/30 bg-[#4A90E2]/10 hover:bg-[#4A90E2]/20 px-3.5 py-2 text-xs font-semibold text-[#7B9BE8] transition cursor-pointer"
                  >
                    <ExternalLink className="size-3.5" />
                    <span>معاينة شاشة الانتظار للمستخدم</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteAccount(selectedAccount.id);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-2 text-xs font-semibold text-rose-300 transition cursor-pointer"
                >
                  <Trash2 className="size-3.5" />
                  <span>حذف السجل</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAccount(null)}
                className="rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-5 py-2 text-xs font-semibold text-white transition cursor-pointer"
              >
                إغلاق الملف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Document Image Modal */}
      {enlargedImage && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md">
          <div className="relative max-w-4xl w-full flex flex-col items-center">
            <div className="w-full flex items-center justify-between pb-3 text-white border-b border-white/10 mb-3">
              <span className="font-bold text-sm">{enlargedImage.label}</span>
              <button
                type="button"
                onClick={() => setEnlargedImage(null)}
                className="rounded-xl p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
              >
                <X className="size-6" />
              </button>
            </div>
            <img
              src={enlargedImage.url}
              alt={enlargedImage.label}
              className="max-h-[80vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}

      {/* Manual Account Modal */}
      {isAddNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className={`relative w-full max-w-md rounded-3xl border border-white/15 bg-[#0F172A] p-6 shadow-2xl ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="size-4 text-[#4A90E2]" />
                <span>{isRTL ? 'إضافة اعتماد مستخدم جديد للإدارة' : 'Add New User Credential'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddNewModalOpen(false)}
                className="text-white/40 hover:text-white"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualAccount} className="mt-4 space-y-3.5">
              {manualAccountError && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/15 p-2.5 text-xs text-rose-200">
                  {manualAccountError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">{t.applicantFullName}</label>
                <input
                  type="text"
                  required
                  value={newAccName}
                  onChange={(e) => setNewAccName(e.target.value)}
                  placeholder="محمد أحمد السوري"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">{t.emailLabel}</label>
                <input
                  type="email"
                  dir="ltr"
                  required
                  value={newAccEmail}
                  onChange={(e) => setNewAccEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">{t.passwordLabel}</label>
                <input
                  type="text"
                  dir="ltr"
                  required
                  value={newAccPassword}
                  onChange={(e) => setNewAccPassword(e.target.value)}
                  placeholder="StrongPass@2026"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddNewModalOpen(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs text-white/60 hover:bg-white/5"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#4A90E2] px-4 py-2 text-xs font-bold text-white hover:bg-[#357ABD]"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Return to Home Navigation */}
      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs sm:text-sm font-bold text-white/80 hover:bg-white/10 hover:text-white transition cursor-pointer"
        >
          {isRTL ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          <span>{t.btnReturnHome}</span>
        </button>
      </div>
    </div>
  );
};

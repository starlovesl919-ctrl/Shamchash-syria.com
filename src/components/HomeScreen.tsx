import React, { useState, useEffect } from 'react';
import {
  FileCheck,
  Coins,
  Briefcase,
  MessageSquareWarning,
  KeyRound,
  Search,
  X,
  Clock,
  Sparkles,
  ShieldCheck,
  Lock,
  Timer,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  TrendingUp,
  CreditCard,
  QrCode,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Building2,
  Smartphone,
  Copy,
  Check,
  Bell,
  ScanLine,
  MapPin,
  Settings,
  AlertCircle,
  LogIn
} from 'lucide-react';
import { RequestType, TransactionRecord, WalletBalances, AuthData } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { PWAInstallButton } from './PWAInstallButton';
import { TransactionReceiptModal } from './TransactionReceiptModal';
import { TransferModal } from './TransferModal';
import { DepositModal } from './DepositModal';
import { QRHubModal } from './QRHubModal';
import { BranchesModal } from './BranchesModal';
import { NotificationsModal } from './NotificationsModal';
import { SecuritySettingsModal } from './SecuritySettingsModal';
import { LoginModal } from './LoginModal';
import {
  getWalletBalances,
  getNotifications,
  getSecuritySettings,
  isStarloveBlocked,
  purgeStarloveFromStorage
} from '../utils/accountStorage';

interface HomeScreenProps {
  onSelectAction: (action: RequestType) => void;
  onOpenSwapCalculator: () => void;
  onTrackRequest?: (requestId: string) => void;
  savedAccountsCount: number;
  onOpenAdmin?: () => void;
  onOpenJobs?: () => void;
  onOpenComplaints?: () => void;
  onOpenLoans?: () => void;
  onOpenDownload?: () => void;
  onOpenLogin?: () => void;
  onDirectLogin?: (data: AuthData) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectAction,
  onOpenSwapCalculator,
  onTrackRequest,
  savedAccountsCount,
  onOpenAdmin,
  onOpenJobs,
  onOpenComplaints,
  onOpenLoans,
  onOpenDownload,
  onOpenLogin,
  onDirectLogin,
}) => {
  const { t, isRTL } = useLanguage();

  // Multi-currency wallet state
  const [balances, setBalances] = useState<WalletBalances>(() => getWalletBalances());
  const [selectedCurrency, setSelectedCurrency] = useState<'SYP' | 'USD' | 'EUR' | 'AED'>('SYP');
  const [isBalanceRevealed, setIsBalanceRevealed] = useState(true);

  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(
    () => getNotifications().filter((n) => !n.read).length
  );
  const security = getSecuritySettings();

  // Interactive Modals
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const [isBranchesOpen, setIsBranchesOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);

  // Receipt modal state
  const [activeReceipt, setActiveReceipt] = useState<TransactionRecord | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Application Tracking modal state
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackIdInput, setTrackIdInput] = useState(() => localStorage.getItem('sc_request_id') || '');
  const [trackError, setTrackError] = useState<string | null>(null);

  // Quick feedback banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedCard, setCopiedCard] = useState(false);

  // Listen to custom storage events to stay in sync
  useEffect(() => {
    purgeStarloveFromStorage();
    const handleSyncWallet = () => setBalances(getWalletBalances());
    const handleSyncNotifs = () =>
      setUnreadNotificationsCount(getNotifications().filter((n) => !n.read).length);

    window.addEventListener('sc_wallet_updated', handleSyncWallet);
    window.addEventListener('sc_notifications_updated', handleSyncNotifs);
    window.addEventListener('sc_accounts_updated', handleSyncWallet);

    return () => {
      window.removeEventListener('sc_wallet_updated', handleSyncWallet);
      window.removeEventListener('sc_notifications_updated', handleSyncNotifs);
      window.removeEventListener('sc_accounts_updated', handleSyncWallet);
    };
  }, []);

  const rawContact = localStorage.getItem('sc_contact_name');
  const rawEmail = localStorage.getItem('sc_waiting_email');

  const defaultTitle = isRTL ? 'مواطن سوري - عميل معتمد' : 'Syrian Citizen - Verified Client';
  let userName = defaultTitle;

  if (rawContact && !isStarloveBlocked(rawContact)) {
    userName = rawContact;
  } else if (rawEmail && !isStarloveBlocked(rawEmail)) {
    const prefix = rawEmail.split('@')[0];
    userName = isStarloveBlocked(prefix) ? defaultTitle : prefix;
  }

  const handleCopyCard = () => {
    navigator.clipboard.writeText('9630 4420 8810 4288');
    setCopiedCard(true);
    setTimeout(() => setCopiedCard(false), 2000);
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError(null);
    const cleaned = trackIdInput.trim().toUpperCase();
    if (!cleaned) {
      setTrackError(isRTL ? 'يرجى إدخال رقم الطلب المرجعي (مثل SC-104288)' : 'Please enter reference ID');
      return;
    }
    if (onTrackRequest) {
      setIsTrackingOpen(false);
      onTrackRequest(cleaned);
    }
  };

  const handleOpenReceiptForTx = (tx: TransactionRecord) => {
    setActiveReceipt(tx);
    setIsReceiptOpen(true);
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* 1. Header with Status & Quick Tools (Notifications & Settings) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <div className="text-center sm:text-right">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-300">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400"></span>
                <span className="relative inline-flex size-2 rounded-full bg-emerald-400"></span>
              </span>
              <span>المنظومة المالية الإلكترونية الرسمية | الجمهورية العربية السورية</span>
            </span>
          </div>

          <h1 className="mt-2 text-xl sm:text-2xl md:text-3xl font-black text-white">
            {isRTL ? `أهلاً بك، ${userName}` : `Welcome, ${userName}`}
          </h1>
        </div>

        {/* Header Action Buttons (Login, Notifications, Security, Branches) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Direct Sign In Button */}
          <button
            type="button"
            id="btn-home-signin"
            onClick={() => {
              if (onOpenLogin) onOpenLogin();
              else setIsLoginModalOpen(true);
            }}
            className="flex items-center gap-1.5 h-10 px-3 sm:px-4 rounded-2xl border border-blue-500/40 bg-blue-500/15 hover:bg-blue-500/25 text-white transition active:scale-95 cursor-pointer shadow-sm text-xs font-bold"
            title="تسجيل الدخول إلى حسابك"
          >
            <LogIn className="size-4 text-blue-400" />
            <span>{isRTL ? 'تسجيل الدخول' : 'Sign In'}</span>
          </button>

          {/* Notifications Button */}
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(true)}
            className="relative flex items-center justify-center size-10 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition cursor-pointer"
            title="الإشعارات المصرفية"
          >
            <Bell className="size-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-md animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Branches Locator Button */}
          <button
            type="button"
            onClick={() => setIsBranchesOpen(true)}
            className="flex items-center justify-center size-10 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition cursor-pointer"
            title="فروع ومراكز شام كاش"
          >
            <MapPin className="size-5 text-blue-400" />
          </button>

          {/* Security & Settings Button */}
          <button
            type="button"
            onClick={() => setIsSecurityOpen(true)}
            className="flex items-center justify-center size-10 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition cursor-pointer"
            title="إعدادات الأمان وبطاقة شام كاش"
          >
            <Settings className="size-5 text-purple-400" />
          </button>
        </div>
      </div>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="w-full animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/20 px-4 py-3 text-xs font-bold text-emerald-200 shadow-xl backdrop-blur-md">
            <CheckCircle2 className="size-5 text-emerald-400 shrink-0" />
            <span className="flex-1">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* PWA Mobile App Install Hero Card */}
      <div className="w-full">
        <PWAInstallButton variant="hero" />
      </div>

      {/* Sham Cash Official Login Banner with Image & Credentials */}
      {(!localStorage.getItem('sc_waiting_email') || isStarloveBlocked(localStorage.getItem('sc_waiting_email'))) && (
        <div className="relative overflow-hidden rounded-3xl border border-blue-500/40 bg-gradient-to-r from-[#111C35] via-[#0E172C] to-[#152342] p-5 sm:p-6 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4 text-right">
              <img
                src="/assets/sham-login-logo.webp"
                alt="شعار شام كاش"
                width="239"
                height="267"
                className="h-16 w-auto object-contain drop-shadow-[0_8px_20px_rgba(74,144,226,0.35)] shrink-0"
              />
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[10px] font-bold text-blue-300 border border-blue-500/30 mb-1">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  المنظومة المالية الإلكترونية
                </div>
                <h3 className="text-lg font-black text-white">
                  تسجيل الدخول إلى حساب شام كاش
                </h3>
                <p className="text-xs text-white/60">
                  البريد الإلكتروني وكلمة السر لإدارة المحفظة، التحويلات الفورية، والخدمات المصرفية
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <button
                type="button"
                onClick={() => {
                  if (onOpenLogin) onOpenLogin();
                  else setIsLoginModalOpen(true);
                }}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4A90E2] to-[#357ABD] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-blue-500/30 hover:brightness-110 active:scale-95 transition cursor-pointer"
              >
                <LogIn className="size-4" />
                <span>تسجيل الدخول إلى حسابك</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Real Interactive Multi-Currency Digital Card */}
      <div className="relative overflow-hidden rounded-3xl border border-[#4A90E2]/40 bg-gradient-to-br from-[#16274D] via-[#0E1B38] to-[#0A1226] p-5 sm:p-7 shadow-2xl shadow-blue-950/40">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 size-60 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 size-60 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
          <div className="flex-1 space-y-3">
            {/* Card Header & Currency Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  <CreditCard className="size-4" />
                </span>
                <span className="text-xs font-bold tracking-widest text-[#7B9BE8] uppercase">
                  shamchas digital wallet
                </span>
              </div>

              {/* Currency Selector Pills */}
              <div className="flex rounded-xl bg-black/30 p-1 border border-white/10 text-[11px] font-bold font-mono">
                {(['SYP', 'USD', 'EUR', 'AED'] as const).map((curr) => (
                  <button
                    key={curr}
                    type="button"
                    onClick={() => setSelectedCurrency(curr)}
                    className={`px-2.5 py-0.5 rounded-lg transition cursor-pointer ${
                      selectedCurrency === curr
                        ? 'bg-[#4A90E2] text-white shadow-sm'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </div>

            {/* Balance Display */}
            <div>
              <span className="text-[11px] font-semibold text-white/50 block">
                {isRTL ? `رصيد المحفظة المتاح (${selectedCurrency}):` : `Available Balance (${selectedCurrency}):`}
              </span>
              <div className="mt-1 flex items-center gap-3">
                <span className="font-mono text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {isBalanceRevealed
                    ? `${balances[selectedCurrency].toLocaleString()} ${selectedCurrency === 'SYP' ? (isRTL ? 'ل.س' : 'SYP') : selectedCurrency}`
                    : '••••••••••'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsBalanceRevealed(!isBalanceRevealed)}
                  className="rounded-lg bg-white/5 p-1.5 text-white/50 hover:bg-white/10 hover:text-white transition cursor-pointer"
                  title={isBalanceRevealed ? 'إخفاء الرصيد' : 'إظهار الرصيد'}
                >
                  {isBalanceRevealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* User and Card Number */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10 text-xs text-white/70">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white/90">{userName}</span>
                <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[9px] font-bold text-amber-300 border border-amber-400/25">
                  حساب ذهبي موثق
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-white/60">
                <span>9630 •••• •••• 4288</span>
                <button
                  type="button"
                  onClick={handleCopyCard}
                  className="hover:text-white transition cursor-pointer p-0.5"
                  title="نسخ رقم البطاقة"
                >
                  {copiedCard ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Core Primary Wallet Action Buttons */}
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-2.5 shrink-0">
            {/* 1. Deposit */}
            <button
              type="button"
              onClick={() => setIsDepositOpen(true)}
              className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 p-3 text-xs font-bold text-emerald-300 transition active:scale-95 cursor-pointer shadow-sm"
            >
              <ArrowDownLeft className="size-5 text-emerald-400" />
              <span>{isRTL ? 'شحن رصيد' : 'Deposit'}</span>
            </button>

            {/* 2. Transfer */}
            <button
              type="button"
              onClick={() => setIsTransferOpen(true)}
              className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 p-3 text-xs font-bold text-blue-300 transition active:scale-95 cursor-pointer shadow-sm"
            >
              <ArrowUpRight className="size-5 text-blue-400" />
              <span>{isRTL ? 'تحويل فوري' : 'Transfer'}</span>
            </button>

            {/* 3. QR Hub */}
            <button
              type="button"
              onClick={() => setIsQROpen(true)}
              className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-teal-500/30 bg-teal-500/10 hover:bg-teal-500/20 p-3 text-xs font-bold text-teal-300 transition active:scale-95 cursor-pointer shadow-sm"
            >
              <QrCode className="size-5 text-teal-400" />
              <span>{isRTL ? 'كود QR' : 'QR Hub'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real Financial Services Grid */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#4A90E2] animate-pulse"></span>
            <span>{isRTL ? 'المنظومة المصرفية والخدمات المركزية' : 'Official Financial & Banking Services'}</span>
          </h2>
          <span className="text-[11px] text-white/50">
            {isRTL ? 'وصول فوري متكامل' : 'Instant Access'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Card 0: Direct Account Login */}
          <div
            onClick={() => {
              if (onOpenLogin) onOpenLogin();
              else setIsLoginModalOpen(true);
            }}
            className="group relative flex flex-col justify-between rounded-3xl border border-blue-500/40 bg-gradient-to-b from-[#16274E] to-[#0D1833] p-5 transition hover:border-[#4A90E2] hover:shadow-xl hover:shadow-blue-500/20 cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-blue-500/20 text-[#4A90E2] border border-blue-500/30 group-hover:scale-105 transition">
                  <LogIn className="size-6" />
                </span>
                <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[10px] font-bold text-blue-300 border border-blue-500/30">
                  {isRTL ? 'تسجيل الدخول' : 'Sign In'}
                </span>
              </div>

              <h3 className="mt-3.5 text-base font-bold text-white group-hover:text-[#7B9BE8] transition">
                {isRTL ? 'تسجيل الدخول إلى حسابك' : 'Sign In to Your Account'}
              </h3>
              <p className="mt-1.5 text-xs text-white/60 leading-5">
                {isRTL
                  ? 'تسجيل الدخول بالبريد الإلكتروني وكلمة السر للوصول المباشر إلى محفظتك الإلكترونية وبطاقتك الرقمية.'
                  : 'Sign in directly with your email and password to access your balance, card, and services.'}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/10 text-xs font-bold text-[#7B9BE8]">
              <span>{isRTL ? 'البريد الإلكتروني وكلمة السر' : 'Enter Credentials'}</span>
              <ChevronRight className={`size-4 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
            </div>
          </div>

          {/* Card 1: Official KYC Verification */}
          <div
            onClick={() => onSelectAction('verify')}
            className="group relative flex flex-col justify-between rounded-3xl border border-blue-500/30 bg-gradient-to-b from-[#142347] to-[#0D1730] p-5 transition hover:border-[#4A90E2] hover:shadow-xl hover:shadow-blue-500/15 cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-[#4A90E2]/20 text-[#4A90E2] border border-[#4A90E2]/30 group-hover:scale-105 transition">
                  <FileCheck className="size-6" />
                </span>
                <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[10px] font-bold text-blue-300 border border-blue-500/30">
                  {isRTL ? 'توثيق رسمي' : 'KYC'}
                </span>
              </div>

              <h3 className="mt-3.5 text-base font-bold text-white group-hover:text-[#7B9BE8] transition">
                {t.btnVerify}
              </h3>
              <p className="mt-1.5 text-xs text-white/60 leading-5">
                {isRTL
                  ? 'رفع الهوية الشخصية السورية وتثبيت الحساب لفتح سقوف التحويل والإيداع المصرفي حتى 50 مليون ل.س.'
                  : 'Submit Syrian national ID to unlock higher transaction limits.'}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/10 text-xs font-bold text-[#7B9BE8]">
              <span>{isRTL ? 'إدارة التوثيق والوثائق' : 'Manage KYC'}</span>
              <ChevronRight className={`size-4 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
            </div>
          </div>

          {/* Card 2: Instant Loans Center */}
          {onOpenLoans && (
            <div
              onClick={onOpenLoans}
              className="group relative flex flex-col justify-between rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-[#102927] to-[#0A1817] p-5 transition hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/15 cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 group-hover:scale-105 transition">
                    <Coins className="size-6" />
                  </span>
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                    {isRTL ? 'تمويل فوري' : 'Loans'}
                  </span>
                </div>

                <h3 className="mt-3.5 text-base font-bold text-white group-hover:text-emerald-300 transition">
                  {t.navLoans}
                </h3>
                <p className="mt-1.5 text-xs text-white/60 leading-5">
                  {isRTL
                    ? 'حاسبة التمويل، جدول سداد الأقساط الشهرية، وسداد الأقساط مباشرة من رصيد المحفظة الإلكترونية.'
                    : 'Syrian loan financing up to 50,000,000 SYP with direct wallet repayment.'}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/10 text-xs font-bold text-emerald-300">
                <span>{isRTL ? 'حاسبة وطلب القرض' : 'Open Loans'}</span>
                <ChevronRight className={`size-4 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
              </div>
            </div>
          )}

          {/* Card 3: Currency Rates & Instant Forex Swap */}
          <div
            onClick={onOpenSwapCalculator}
            className="group relative flex flex-col justify-between rounded-3xl border border-amber-500/30 bg-gradient-to-b from-[#251D10] to-[#141009] p-5 transition hover:border-amber-500 hover:shadow-xl hover:shadow-amber-500/15 cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 group-hover:scale-105 transition">
                  <RefreshCw className="size-6" />
                </span>
                <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                  {isRTL ? 'تنفيذ فوري' : 'Live Forex'}
                </span>
              </div>

              <h3 className="mt-3.5 text-base font-bold text-white group-hover:text-amber-300 transition">
                {isRTL ? 'تصريف وأسعار العملات' : 'Currency Exchange'}
              </h3>
              <p className="mt-1.5 text-xs text-white/60 leading-5">
                {isRTL
                  ? 'أسعار الصرف اللحظية وتنفيذ أوامر التصريف المباشرة بين الدولار، اليورو، والليرة السورية.'
                  : 'Live foreign exchange rates with instant wallet balance conversion.'}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/10 text-xs font-bold text-amber-300">
              <span>{isRTL ? 'فتح حاسبة وتصريف العملات' : 'Open Converter'}</span>
              <ChevronRight className={`size-4 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
            </div>
          </div>

          {/* Card 5: Authorized Branches Network */}
          <div
            onClick={() => setIsBranchesOpen(true)}
            className="group relative flex flex-col justify-between rounded-3xl border border-blue-500/30 bg-gradient-to-b from-[#131D38] to-[#0A1020] p-5 transition hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/15 cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 group-hover:scale-105 transition">
                  <Building2 className="size-6" />
                </span>
                <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[10px] font-bold text-blue-300 border border-blue-500/30">
                  {isRTL ? 'كافة المحافظات' : 'Nationwide'}
                </span>
              </div>

              <h3 className="mt-3.5 text-base font-bold text-white group-hover:text-blue-300 transition">
                {isRTL ? 'شبكة الفروع ومراكز الخدمة' : 'Branches & Agents'}
              </h3>
              <p className="mt-1.5 text-xs text-white/60 leading-5">
                {isRTL
                  ? 'دليل فروع شام كاش في دمشق، حلب، حمص، اللاذقية، طرطوس، حماة، والسويداء مع أوقات الدوام.'
                  : 'Find official service centers for deposits, withdrawals, and KYC.'}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/10 text-xs font-bold text-blue-300">
              <span>{isRTL ? 'دليل الفروع والمراكز' : 'Open Directory'}</span>
              <ChevronRight className={`size-4 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
            </div>
          </div>

          {/* Card 6: Master Admin Control Vault */}
          {onOpenAdmin && (
            <div
              onClick={onOpenAdmin}
              className="group relative flex flex-col justify-between rounded-3xl border border-amber-500/35 bg-gradient-to-b from-[#1C1F2E] to-[#0E111C] p-5 transition hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/15 cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 group-hover:scale-105 transition">
                    <KeyRound className="size-6" />
                  </span>
                  <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-200 border border-amber-500/30 font-mono">
                    {savedAccountsCount} {isRTL ? 'سجل' : 'Records'}
                  </span>
                </div>

                <h3 className="mt-3.5 text-base font-bold text-white group-hover:text-amber-300 transition">
                  {isRTL ? 'لوحة الإدارة والتحكم المصرفية' : 'Admin Control Vault'}
                </h3>
                <p className="mt-1.5 text-xs text-white/60 leading-5">
                  {isRTL
                    ? 'إدارة الحسابات المسجلة، مراجعة طلبات القروض والتوظيف، وتدقيق العمليات والنشاط.'
                    : 'Master control panel to manage accounts, review loans, careers, and audit logs.'}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/10 text-xs font-bold text-amber-300">
                <span>{isRTL ? 'دخول لوحة الإدارة' : 'Access Admin'}</span>
                <ChevronRight className={`size-4 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Live Market Rates Ticker Bar */}
      <div className="rounded-3xl border border-white/10 bg-[#0E172A]/80 p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3.5">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
              <TrendingUp className="size-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white">
                {isRTL ? 'مؤشرات أسعار الصرف بالسوق السورية اليوم' : 'Live Syrian Market Exchange Indicators'}
              </h3>
              <p className="text-[11px] text-white/50">
                {isRTL ? 'تحديث فوري لأسواق دمشق، حلب، والمحافظات' : 'Real-time updates across Damascus, Aleppo & Governorates'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenSwapCalculator}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7B9BE8] hover:text-white transition cursor-pointer self-start sm:self-auto"
          >
            <span>{isRTL ? 'فتح حاسبة الصرف' : 'Currency Calculator'}</span>
            <ExternalLink className="size-3.5" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-3 text-center">
            <span className="text-[11px] font-bold text-white/50 block">الدولار الأمريكي (USD)</span>
            <span className="mt-1 block font-mono text-base font-black text-emerald-400">14,950 ل.س</span>
            <span className="text-[10px] text-emerald-300/70 font-semibold">+0.4% اليوم</span>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-3 text-center">
            <span className="text-[11px] font-bold text-white/50 block">اليورو الأوروبي (EUR)</span>
            <span className="mt-1 block font-mono text-base font-black text-blue-400">15,750 ل.س</span>
            <span className="text-[10px] text-blue-300/70 font-semibold">+0.2% اليوم</span>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-3 text-center">
            <span className="text-[11px] font-bold text-white/50 block">الليرة التركية (TRY)</span>
            <span className="mt-1 block font-mono text-base font-black text-amber-400">435 ل.س</span>
            <span className="text-[10px] text-amber-300/70 font-semibold">مستقر</span>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-3 text-center">
            <span className="text-[11px] font-bold text-white/50 block">غرام الذهب عيار 21</span>
            <span className="mt-1 block font-mono text-base font-black text-amber-300">1,120,000 ل.س</span>
            <span className="text-[10px] text-amber-400/70 font-semibold">تسعيرة الصاغة</span>
          </div>
        </div>
      </div>

      {/* 7. Security & Official Guarantee Cards */}
      <div>
        <h2 className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase">
          {t.securitySectionTitle}
        </h2>

        <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <article className="rounded-2xl border border-white/5 bg-[#141E33]/60 p-4 transition hover:border-[#4A90E2]/30">
            <span className="flex size-9 items-center justify-center rounded-xl bg-[#4A90E2]/15 text-[#4A90E2]">
              <Lock className="size-4.5" />
            </span>
            <h3 className="mt-3 text-sm font-bold text-white">{t.privacyTitle}</h3>
            <p className="mt-1 text-xs leading-5 text-white/50">
              {t.privacyDesc}
            </p>
          </article>

          <article className="rounded-2xl border border-white/5 bg-[#141E33]/60 p-4 transition hover:border-[#4A90E2]/30">
            <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
              <ShieldCheck className="size-4.5" />
            </span>
            <h3 className="mt-3 text-sm font-bold text-white">{t.bankingTitle}</h3>
            <p className="mt-1 text-xs leading-5 text-white/50">
              {t.bankingDesc}
            </p>
          </article>

          <article className="rounded-2xl border border-white/5 bg-[#141E33]/60 p-4 transition hover:border-[#4A90E2]/30">
            <span className="flex size-9 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400">
              <Timer className="size-4.5" />
            </span>
            <h3 className="mt-3 text-sm font-bold text-white">{t.fastProcessingTitle}</h3>
            <p className="mt-1 text-xs leading-5 text-white/50">
              {t.fastProcessingDesc}
            </p>
          </article>
        </div>
      </div>

      {/* Tracking Modal */}
      {isTrackingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-3xl border border-white/15 bg-[#0F172A] p-6 text-center shadow-2xl">
            <button
              type="button"
              onClick={() => setIsTrackingOpen(false)}
              className="absolute top-4 left-4 p-1.5 text-white/50 hover:text-white rounded-full bg-white/5 cursor-pointer"
            >
              <X className="size-4" />
            </button>

            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#4A90E2]/20 text-[#4A90E2] border border-[#4A90E2]/30">
              <Clock className="size-6" />
            </div>

            <h3 className="mt-4 text-base font-bold text-white">
              {isRTL ? 'متابعة وتدقيق حالة المعاملة' : 'Track Your Application'}
            </h3>
            <p className="mt-1 text-xs text-white/60">
              {isRTL ? 'أدخل الرقم المرجعي لمعاملتك للاطلاع على النتيجة الحالية' : 'Enter reference number'}
            </p>

            <form onSubmit={handleTrackSubmit} className="mt-4 space-y-3">
              {trackError && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/15 p-2 text-xs text-rose-200">
                  {trackError}
                </div>
              )}

              <input
                type="text"
                value={trackIdInput}
                onChange={(e) => setTrackIdInput(e.target.value)}
                placeholder="SC-104288"
                dir="ltr"
                required
                className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 px-3 text-center text-sm font-mono text-white tracking-widest focus:border-[#4A90E2] focus:outline-none"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsTrackingOpen(false)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-semibold text-white/70 hover:bg-white/10 transition cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-gradient-to-r from-[#4A90E2] to-[#357ABD] py-2 text-xs font-bold text-white shadow-md hover:brightness-110 transition cursor-pointer"
                >
                  {isRTL ? 'استعلام' : 'Track'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Real Interactive Modals */}
      <TransferModal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        onTransferSuccess={(tx) => {
          setBalances(getWalletBalances());
          handleOpenReceiptForTx(tx);
        }}
      />

      <DepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        onDepositSuccess={(tx) => {
          setBalances(getWalletBalances());
          handleOpenReceiptForTx(tx);
        }}
      />

      <QRHubModal
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
        onPaymentSuccess={(tx) => {
          setBalances(getWalletBalances());
          handleOpenReceiptForTx(tx);
        }}
        currentUserName={userName}
      />

      <BranchesModal
        isOpen={isBranchesOpen}
        onClose={() => setIsBranchesOpen(false)}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => {
          setIsNotificationsOpen(false);
          setUnreadNotificationsCount(getNotifications().filter((n) => !n.read).length);
        }}
      />

      <SecuritySettingsModal
        isOpen={isSecurityOpen}
        onClose={() => setIsSecurityOpen(false)}
        onOpenVerifyKYC={() => onSelectAction('verify')}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSubmit={(data) => {
          if (onDirectLogin) {
            onDirectLogin(data);
          }
          setToastMessage(isRTL ? `تم تسجيل الدخول بنجاح بالبريد (${data.email})!` : `Logged in successfully!`);
          setTimeout(() => setToastMessage(null), 3500);
        }}
      />

      <TransactionReceiptModal
        isOpen={isReceiptOpen}
        transaction={activeReceipt}
        onClose={() => setIsReceiptOpen(false)}
      />
    </div>
  );
};

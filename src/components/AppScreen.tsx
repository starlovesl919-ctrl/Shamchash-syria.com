import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Users,
  Globe,
  Share2,
  Check,
  KeyRound,
  Coins,
  Briefcase,
  MessageSquareWarning,
  Home,
  LogOut,
  UserCheck,
  LogIn
} from 'lucide-react';
import { WaveBackground } from './WaveBackground';
import { useLanguage } from '../context/LanguageContext';
import { PWAInstallButton } from './PWAInstallButton';

interface AppScreenProps {
  children: React.ReactNode;
  width?: 'sm' | 'md' | 'lg' | 'full';
  backAction?: () => void;
  showBack?: boolean;
  className?: string;
  customFooter?: React.ReactNode;
  savedAccountsCount?: number;
  onOpenAdmin?: () => void;
  onOpenJobs?: () => void;
  onOpenComplaints?: () => void;
  onOpenLoans?: () => void;
  onOpenHome?: () => void;
  currentUserEmail?: string;
  onLogout?: () => void;
  onOpenLogin?: () => void;
  hideHeaderLogo?: boolean;
}

export const AppScreen: React.FC<AppScreenProps> = ({
  children,
  width = 'sm',
  backAction,
  showBack = true,
  className = '',
  customFooter,
  savedAccountsCount,
  onOpenAdmin,
  onOpenJobs,
  onOpenComplaints,
  onOpenLoans,
  onOpenHome,
  currentUserEmail,
  onLogout,
  onOpenLogin,
  hideHeaderLogo = false,
}) => {
  const { t, isRTL, dir, toggleLanguage } = useLanguage();
  const [copiedShare, setCopiedShare] = useState(false);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = isRTL ? 'بوابة توثيق حسابات شام كاش' : 'Sham Cash Account Verification Portal';
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareTitle,
          url: shareUrl,
        });
        return;
      } catch {
        // User cancelled or unsupported, fallback to copy
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    } catch {
      // Fallback
    }
  };

  const maxWidthClass =
    width === 'full'
      ? 'max-w-none'
      : width === 'lg'
      ? 'max-w-6xl'
      : width === 'md'
      ? 'max-w-2xl'
      : 'max-w-md';

  return (
    <div
      dir={dir}
      className={`relative min-h-screen overflow-x-hidden bg-[#0B1121] text-white screen-aura pt-3 pb-24 sm:pt-6 sm:pb-12 ${
        isRTL ? 'font-[\'Cairo\',sans-serif]' : 'font-sans'
      }`}
    >
      {/* Curved contour wave background */}
      <WaveBackground />

      {/* Top Header Navigation */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-4 pt-1 sm:px-6">
        {showBack && backAction ? (
          <button
            type="button"
            id="back-nav-btn"
            onClick={backAction}
            aria-label={t.back}
            className="flex size-11 items-center justify-center rounded-full bg-white/5 text-white/90 transition hover:bg-white/10 hover:text-white active:scale-95 border border-white/10 shadow-sm cursor-pointer"
          >
            {isRTL ? (
              <ChevronRight className="size-6 sm:size-7" />
            ) : (
              <ChevronLeft className="size-6 sm:size-7" />
            )}
          </button>
        ) : (
          <div className="size-11" />
        )}

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* In-App PWA Install Action */}
          <PWAInstallButton variant="header" />

          {/* Share Link Button */}
          <button
            type="button"
            id="btn-share-app"
            onClick={handleShare}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold transition active:scale-95 cursor-pointer shadow-sm ${
              copiedShare
                ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
                : 'border-white/10 bg-white/5 hover:bg-white/10 text-white/80'
            }`}
            title={t.shareApp}
          >
            {copiedShare ? (
              <>
                <Check className="size-3.5 text-emerald-400" />
                <span>{t.shareAppSuccess}</span>
              </>
            ) : (
              <>
                <Share2 className="size-3.5 text-[#4A90E2]" />
                <span className="hidden sm:inline">{t.shareApp}</span>
              </>
            )}
          </button>

          {/* Language Switcher */}
          <button
            type="button"
            id="btn-toggle-language"
            onClick={toggleLanguage}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#4A90E2]/30 bg-[#4A90E2]/10 hover:bg-[#4A90E2]/20 px-3 py-1 text-[11px] font-bold text-white transition active:scale-95 cursor-pointer shadow-sm"
            title={t.toggleLanguage}
          >
            <Globe className="size-3.5 text-[#7B9BE8]" />
            <span>{t.languageName}</span>
          </button>

          {onOpenAdmin && (
            <button
              type="button"
              id="btn-header-admin-portal"
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/35 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1 text-[11px] font-bold text-amber-300 transition active:scale-95 cursor-pointer shadow-sm"
              title={t.adminPortal}
            >
              <KeyRound className="size-3.5 text-amber-400" />
              <span>{t.adminPortal}</span>
              {typeof savedAccountsCount === 'number' && savedAccountsCount > 0 && (
                <span className="rounded-full bg-amber-500/20 px-1.5 py-0.2 text-[10px] font-mono text-amber-200">
                  {savedAccountsCount}
                </span>
              )}
            </button>
          )}

          {!currentUserEmail && onOpenLogin && (
            <button
              type="button"
              id="btn-header-login"
              onClick={onOpenLogin}
              className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/40 bg-blue-500/20 hover:bg-blue-500/30 px-3 py-1 text-[11px] font-bold text-white transition active:scale-95 cursor-pointer shadow-sm"
              title={t.navLogin}
            >
              <LogIn className="size-3.5 text-blue-300" />
              <span>{t.navLogin}</span>
            </button>
          )}

          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#1B2A4A]/60 px-3 py-1 text-[11px] font-medium text-[#7B9BE8] backdrop-blur-md">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            {t.syrianRepublic}
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className={`relative z-10 mx-auto flex w-full flex-col px-3.5 pb-8 sm:px-6 sm:pb-10 ${maxWidthClass}`}>
        {/* Logo */}
        {!hideHeaderLogo && (
          <div className="mt-2 flex flex-col items-center justify-center sm:mt-4">
            <div className="group cursor-pointer transition active:scale-95" onClick={backAction ? () => backAction() : undefined}>
              <img
                src="/assets/sham-login-logo.webp"
                alt="شعار شام كاش shamchas"
                width="239"
                height="267"
                className="h-16 w-auto drop-shadow-[0_12px_30px_rgba(74,144,226,0.35)] transition-transform duration-300 group-hover:scale-105 sm:h-20"
              />
            </div>
            <span className="mt-2 text-xs font-bold tracking-widest text-[#4A90E2] uppercase">
              shamchas
            </span>
          </div>
        )}

        {/* Quick Navigation Pills for Main Services & User Session */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {onOpenHome && (
            <button
              type="button"
              onClick={onOpenHome}
              className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/80 transition cursor-pointer"
            >
              <Home className="size-3 text-[#4A90E2]" />
              <span>{t.navHome}</span>
            </button>
          )}

          {onOpenLoans && (
            <button
              type="button"
              onClick={onOpenLoans}
              className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 transition cursor-pointer"
            >
              <Coins className="size-3 text-emerald-400" />
              <span>{t.navLoans}</span>
            </button>
          )}

          {onOpenJobs && (
            <button
              type="button"
              onClick={onOpenJobs}
              className="inline-flex items-center gap-1 rounded-full border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 px-2.5 py-1 text-[11px] font-semibold text-purple-300 transition cursor-pointer"
            >
              <Briefcase className="size-3 text-purple-400" />
              <span>{t.navJobs}</span>
            </button>
          )}

          {onOpenComplaints && (
            <button
              type="button"
              onClick={onOpenComplaints}
              className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 px-2.5 py-1 text-[11px] font-semibold text-rose-300 transition cursor-pointer"
            >
              <MessageSquareWarning className="size-3 text-rose-400" />
              <span>{t.navComplaints}</span>
            </button>
          )}

          {!currentUserEmail && onOpenLogin && (
            <button
              type="button"
              onClick={onOpenLogin}
              className="inline-flex items-center gap-1 rounded-full border border-blue-500/40 bg-blue-500/15 hover:bg-blue-500/25 px-2.5 py-1 text-[11px] font-bold text-blue-200 transition cursor-pointer shadow-sm"
            >
              <LogIn className="size-3 text-blue-400" />
              <span>{t.navLogin}</span>
            </button>
          )}

          {currentUserEmail && onLogout && (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] text-amber-200">
              <UserCheck className="size-3 text-amber-400" />
              <span dir="ltr" className="font-mono text-[10px] max-w-[130px] truncate">{currentUserEmail}</span>
              <button
                type="button"
                onClick={onLogout}
                title={t.navLogout}
                className="rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 px-2 py-0.5 text-[10px] font-bold transition cursor-pointer inline-flex items-center gap-1"
              >
                <LogOut className="size-2.5" />
                <span>{t.navLogout}</span>
              </button>
            </div>
          )}
        </div>

        {/* Panel Glass Card */}
        <div className={`mt-4 flex flex-col rounded-[28px] px-4 py-6 sm:mt-6 sm:rounded-[36px] sm:px-8 sm:py-8 panel-glass ${className}`}>
          {children}

          {/* Footer inside glass card */}
          {customFooter ? (
            customFooter
          ) : (
            <div className="mt-auto flex flex-col items-center gap-2 pt-8 sm:pt-12 border-t border-white/5">
              <span className="text-[10px] font-semibold tracking-[0.25em] text-white/50 sm:text-[11px]">
                {t.poweredBy}
              </span>
              <img
                src="/assets/sham-login-logo.webp"
                alt="shamchas"
                width="239"
                height="267"
                className="h-7 w-auto opacity-70 transition-opacity hover:opacity-100 sm:h-8"
              />
              <span className="text-[11px] font-medium tracking-wider text-white/40 sm:text-xs">
                {t.version}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

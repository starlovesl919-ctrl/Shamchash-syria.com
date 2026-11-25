import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ScanFace,
  Fingerprint,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  LogOut,
  ShieldCheck,
  Delete
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getSecuritySettings, logUserActivity } from '../utils/accountStorage';

interface BiometricLockOverlayProps {
  isOpen: boolean;
  userEmail: string;
  userName?: string;
  lockReason?: 'minimized' | 'manual';
  onUnlock: () => void;
  onSignOut: () => void;
}

type AuthMode = 'faceid' | 'fingerprint' | 'pin';
type ScanStatus = 'idle' | 'scanning' | 'verified' | 'error';

export const BiometricLockOverlay: React.FC<BiometricLockOverlayProps> = ({
  isOpen,
  userEmail,
  userName,
  lockReason = 'minimized',
  onUnlock,
  onSignOut,
}) => {
  const { isRTL, dir } = useLanguage();
  const [authMode, setAuthMode] = useState<AuthMode>(() => {
    const settings = getSecuritySettings();
    return settings.biometricType === 'fingerprint' ? 'fingerprint' : 'faceid';
  });
  const [scanStatus, setScanStatus] = useState<ScanStatus>('idle');
  const [pinValue, setPinValue] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [logoError, setLogoError] = useState(false);

  const scanTimerRef = useRef<number | null>(null);
  const unlockTimerRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (scanTimerRef.current !== null) {
      window.clearTimeout(scanTimerRef.current);
      scanTimerRef.current = null;
    }
    if (unlockTimerRef.current !== null) {
      window.clearTimeout(unlockTimerRef.current);
      unlockTimerRef.current = null;
    }
  }, []);

  // Reset state whenever the lock screen opens
  useEffect(() => {
    if (isOpen) {
      const settings = getSecuritySettings();
      setAuthMode(settings.biometricType === 'fingerprint' ? 'fingerprint' : 'faceid');
      setScanStatus('idle');
      setPinValue('');
      setPinError(null);
    } else {
      clearTimers();
    }
    return () => clearTimers();
  }, [isOpen, clearTimers]);

  const completeUnlock = useCallback(
    (methodLabel: string) => {
      setScanStatus('verified');
      logUserActivity(
        'إعادة فتح الجلسة المحمية',
        `تم التحقق بنجاح عبر (${methodLabel}) وإعادة الوصول إلى الجلسة`,
        userEmail,
        userName
      );
      unlockTimerRef.current = window.setTimeout(() => {
        onUnlock();
      }, 450);
    },
    [onUnlock, userEmail, userName]
  );

  const startBiometricScan = useCallback(() => {
    if (scanStatus === 'scanning' || scanStatus === 'verified') return;
    clearTimers();
    setPinError(null);
    setScanStatus('scanning');

    const methodLabel =
      authMode === 'faceid'
        ? 'بصمة الوجه Face ID'
        : 'بصمة الإصبع Touch ID';

    scanTimerRef.current = window.setTimeout(() => {
      completeUnlock(methodLabel);
    }, 1150);
  }, [authMode, clearTimers, completeUnlock, scanStatus]);

  const handlePinDigit = useCallback(
    (digit: string) => {
      if (scanStatus === 'verified') return;
      setPinError(null);
      setPinValue((prev) => {
        if (prev.length >= 4) return prev;
        const next = prev + digit;
        if (next.length === 4) {
          const expectedPin = getSecuritySettings().pin || '1234';
          if (next === expectedPin) {
            completeUnlock('رمز الأمان PIN');
          } else {
            setScanStatus('error');
            setPinError(
              isRTL
                ? 'رمز الأمان PIN غير صحيح، حاول مرة أخرى'
                : 'Incorrect PIN code, please try again'
            );
            window.setTimeout(() => {
              setPinValue('');
              setScanStatus('idle');
            }, 650);
          }
        }
        return next;
      });
    },
    [completeUnlock, isRTL, scanStatus]
  );

  const handlePinBackspace = useCallback(() => {
    setPinError(null);
    setPinValue((prev) => prev.slice(0, -1));
  }, []);

  // Support physical keyboard input in PIN mode
  useEffect(() => {
    if (!isOpen || authMode !== 'pin') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        handlePinDigit(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handlePinBackspace();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, authMode, handlePinDigit, handlePinBackspace]);

  if (!isOpen) return null;

  const maskedEmail = (() => {
    if (!userEmail || !userEmail.includes('@')) return userEmail;
    const [local, domain] = userEmail.split('@');
    if (local.length <= 2) return `${local[0] || ''}••@${domain}`;
    return `${local.slice(0, 2)}${'•'.repeat(Math.min(5, local.length - 2))}@${domain}`;
  })();

  const statusText = (() => {
    if (scanStatus === 'verified') {
      return isRTL ? 'تم التحقق بنجاح · جاري فتح الجلسة' : 'Verified · Unlocking session';
    }
    if (scanStatus === 'scanning') {
      return authMode === 'faceid'
        ? isRTL
          ? 'جاري مطابقة ملامح الوجه...'
          : 'Scanning Face ID...'
        : isRTL
        ? 'جاري قراءة بصمة الإصبع...'
        : 'Scanning Fingerprint...';
    }
    if (authMode === 'faceid') {
      return isRTL
        ? 'اضغط أدناه لبدء التحقق عبر بصمة الوجه'
        : 'Tap below to authenticate with Face ID';
    }
    if (authMode === 'fingerprint') {
      return isRTL
        ? 'اضغط مطولاً أو انقر على مستشعر البصمة للمتابعة'
        : 'Tap the fingerprint sensor to continue';
    }
    return isRTL
      ? 'أدخل رمز الأمان PIN المكون من 4 أرقام'
      : 'Enter your 4-digit security PIN';
  })();

  return (
    <div
      dir={dir}
      role="dialog"
      aria-modal="true"
      aria-labelledby="biometric-lock-title"
      className={`fixed inset-0 z-[70] flex items-center justify-center bg-[#070C18]/95 backdrop-blur-2xl p-4 overflow-y-auto ${
        isRTL ? "font-['Cairo',sans-serif]" : 'font-sans'
      }`}
    >
      {/* Subtle Ambient Security Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-[#4A90E2]/15 blur-3xl" />
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md rounded-3xl border border-white/12 bg-[#0D1526]/95 p-6 sm:p-8 shadow-2xl text-white my-auto panel-glass">
        {/* Top Brand & Lock Context */}
        <div className="flex flex-col items-center text-center">
          {!logoError ? (
            <img
              src="/assets/sham-login-logo.webp"
              alt={isRTL ? 'شعار شام كاش' : 'Sham Cash'}
              width="239"
              height="267"
              onError={() => setLogoError(true)}
              className="h-12 w-auto drop-shadow-[0_10px_25px_rgba(74,144,226,0.35)]"
            />
          ) : (
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[#4A90E2]/20 border border-[#4A90E2]/30 text-[#4A90E2]">
              <ShieldCheck className="size-6" />
            </div>
          )}

          <div className="mt-4 flex items-center gap-2 text-xs text-[#7B9BE8]">
            <span>{isRTL ? 'جلسة محمية' : 'Protected Session'}</span>
            <span aria-hidden="true">·</span>
            <span>
              {lockReason === 'minimized'
                ? isRTL
                  ? 'تم القفل تلقائياً عند تصغير التطبيق'
                  : 'Auto-locked on minimize'
                : isRTL
                ? 'تم القفل يدوياً'
                : 'Manually locked'}
            </span>
          </div>

          <h2
            id="biometric-lock-title"
            className="mt-2 text-xl font-extrabold text-white text-balance"
          >
            {isRTL ? 'تأكيد الهوية لاستئناف الجلسة' : 'Verify Identity to Resume'}
          </h2>

          <p className="mt-1.5 text-xs text-white/60">
            {userName ? (
              <>
                <span className="font-semibold text-white/85">{userName}</span>
                <span className="mx-1.5 text-white/30" aria-hidden="true">
                  /
                </span>
              </>
            ) : null}
            <span dir="ltr" className="font-mono tabular-nums text-white/70">
              {maskedEmail}
            </span>
          </p>
        </div>

        {/* Mode Switcher (Interactive Segmented Control) */}
        <div
          role="tablist"
          aria-label={isRTL ? 'طريقة المصادقة' : 'Authentication Method'}
          className="mt-6 grid grid-cols-3 gap-1 rounded-xl bg-white/5 p-1 border border-white/10"
        >
          <button
            type="button"
            role="tab"
            aria-selected={authMode === 'faceid'}
            disabled={scanStatus === 'scanning' || scanStatus === 'verified'}
            onClick={() => {
              clearTimers();
              setScanStatus('idle');
              setPinError(null);
              setAuthMode('faceid');
            }}
            className={`flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-bold transition whitespace-nowrap cursor-pointer disabled:opacity-60 ${
              authMode === 'faceid'
                ? 'bg-[#4A90E2] text-white shadow-sm'
                : 'text-white/65 hover:text-white hover:bg-white/5'
            }`}
          >
            <ScanFace className="size-4 shrink-0" />
            <span>{isRTL ? 'بصمة الوجه' : 'Face ID'}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={authMode === 'fingerprint'}
            disabled={scanStatus === 'scanning' || scanStatus === 'verified'}
            onClick={() => {
              clearTimers();
              setScanStatus('idle');
              setPinError(null);
              setAuthMode('fingerprint');
            }}
            className={`flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-bold transition whitespace-nowrap cursor-pointer disabled:opacity-60 ${
              authMode === 'fingerprint'
                ? 'bg-[#4A90E2] text-white shadow-sm'
                : 'text-white/65 hover:text-white hover:bg-white/5'
            }`}
          >
            <Fingerprint className="size-4 shrink-0" />
            <span>{isRTL ? 'البصمة' : 'Touch ID'}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={authMode === 'pin'}
            disabled={scanStatus === 'scanning' || scanStatus === 'verified'}
            onClick={() => {
              clearTimers();
              setScanStatus('idle');
              setPinValue('');
              setPinError(null);
              setAuthMode('pin');
            }}
            className={`flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-bold transition whitespace-nowrap cursor-pointer disabled:opacity-60 ${
              authMode === 'pin'
                ? 'bg-[#4A90E2] text-white shadow-sm'
                : 'text-white/65 hover:text-white hover:bg-white/5'
            }`}
          >
            <KeyRound className="size-4 shrink-0" />
            <span>{isRTL ? 'رمز PIN' : 'PIN'}</span>
          </button>
        </div>

        {/* Interactive Biometric / PIN Stage */}
        <div className="mt-6 flex flex-col items-center">
          {authMode === 'faceid' && (
            <div className="flex w-full flex-col items-center">
              <button
                type="button"
                onClick={startBiometricScan}
                disabled={scanStatus === 'scanning' || scanStatus === 'verified'}
                aria-label={isRTL ? 'تشغيل مسح بصمة الوجه' : 'Start Face ID Scan'}
                className={`group relative flex size-32 items-center justify-center rounded-3xl border transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A90E2] ${
                  scanStatus === 'verified'
                    ? 'border-emerald-400/60 bg-emerald-500/15 text-emerald-400'
                    : scanStatus === 'scanning'
                    ? 'border-[#4A90E2]/70 bg-[#4A90E2]/15 text-[#7B9BE8]'
                    : 'border-white/15 bg-white/5 text-white/80 hover:border-[#4A90E2]/50 hover:bg-[#4A90E2]/10'
                }`}
              >
                {/* Viewfinder corner brackets */}
                <span className="pointer-events-none absolute top-2.5 left-2.5 size-4 border-t-2 border-l-2 border-current opacity-70 rounded-tl-md" />
                <span className="pointer-events-none absolute top-2.5 right-2.5 size-4 border-t-2 border-r-2 border-current opacity-70 rounded-tr-md" />
                <span className="pointer-events-none absolute bottom-2.5 left-2.5 size-4 border-b-2 border-l-2 border-current opacity-70 rounded-bl-md" />
                <span className="pointer-events-none absolute bottom-2.5 right-2.5 size-4 border-b-2 border-r-2 border-current opacity-70 rounded-br-md" />

                {/* Sweeping scan beam */}
                {scanStatus === 'scanning' && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-4 h-0.5 rounded-full bg-gradient-to-r from-transparent via-[#4A90E2] to-transparent shadow-[0_0_12px_rgba(74,144,226,0.9)] animate-biometric-scan"
                  />
                )}

                {scanStatus === 'verified' ? (
                  <CheckCircle2 className="size-14 text-emerald-400 transition-transform duration-200 scale-105" />
                ) : (
                  <ScanFace className="size-14 transition-transform duration-200 group-hover:scale-105" />
                )}
              </button>

              <p
                className={`mt-4 text-xs font-semibold text-center ${
                  scanStatus === 'verified'
                    ? 'text-emerald-400'
                    : scanStatus === 'scanning'
                    ? 'text-[#7B9BE8]'
                    : 'text-white/65'
                }`}
              >
                {statusText}
              </p>

              <button
                type="button"
                onClick={startBiometricScan}
                disabled={scanStatus === 'scanning' || scanStatus === 'verified'}
                className="mt-5 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#2563EB] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:brightness-110 active:scale-[0.99] disabled:opacity-60 cursor-pointer whitespace-nowrap"
              >
                <ScanFace className="size-4 shrink-0" />
                <span>
                  {scanStatus === 'scanning'
                    ? isRTL
                      ? 'جاري التحقق...'
                      : 'Verifying...'
                    : scanStatus === 'verified'
                    ? isRTL
                      ? 'تم التحقق'
                      : 'Verified'
                    : isRTL
                    ? 'فتح الجلسة ببصمة الوجه'
                    : 'Unlock with Face ID'}
                </span>
              </button>
            </div>
          )}

          {authMode === 'fingerprint' && (
            <div className="flex w-full flex-col items-center">
              <button
                type="button"
                onClick={startBiometricScan}
                disabled={scanStatus === 'scanning' || scanStatus === 'verified'}
                aria-label={isRTL ? 'تشغيل مسح بصمة الإصبع' : 'Start Fingerprint Scan'}
                className={`group relative flex size-32 items-center justify-center rounded-full border-2 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                  scanStatus === 'verified'
                    ? 'border-emerald-400 bg-emerald-500/20 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.25)]'
                    : scanStatus === 'scanning'
                    ? 'border-[#4A90E2] bg-[#4A90E2]/20 text-[#7B9BE8] shadow-[0_0_30px_rgba(74,144,226,0.25)]'
                    : 'border-white/20 bg-white/5 text-white/85 hover:border-[#4A90E2]/60 hover:bg-[#4A90E2]/10'
                }`}
              >
                {scanStatus === 'scanning' && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-2 rounded-full border border-[#4A90E2]/50 animate-ping"
                  />
                )}

                {scanStatus === 'verified' ? (
                  <CheckCircle2 className="size-14 text-emerald-400 transition-transform duration-200 scale-105" />
                ) : (
                  <Fingerprint className="size-14 transition-transform duration-200 group-hover:scale-105" />
                )}
              </button>

              <p
                className={`mt-4 text-xs font-semibold text-center ${
                  scanStatus === 'verified'
                    ? 'text-emerald-400'
                    : scanStatus === 'scanning'
                    ? 'text-[#7B9BE8]'
                    : 'text-white/65'
                }`}
              >
                {statusText}
              </p>

              <button
                type="button"
                onClick={startBiometricScan}
                disabled={scanStatus === 'scanning' || scanStatus === 'verified'}
                className="mt-5 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#2563EB] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:brightness-110 active:scale-[0.99] disabled:opacity-60 cursor-pointer whitespace-nowrap"
              >
                <Fingerprint className="size-4 shrink-0" />
                <span>
                  {scanStatus === 'scanning'
                    ? isRTL
                      ? 'جاري قراءة البصمة...'
                      : 'Reading Fingerprint...'
                    : scanStatus === 'verified'
                    ? isRTL
                      ? 'تم التحقق'
                      : 'Verified'
                    : isRTL
                    ? 'فتح الجلسة ببصمة الإصبع'
                    : 'Unlock with Fingerprint'}
                </span>
              </button>
            </div>
          )}

          {authMode === 'pin' && (
            <div className="flex w-full flex-col items-center">
              <p className="text-xs font-semibold text-white/70 text-center">
                {statusText}
              </p>

              {/* 4-Digit PIN Indicator */}
              <div
                dir="ltr"
                className="mt-4 flex items-center justify-center gap-3.5"
                aria-label={isRTL ? 'حالة إدخال رمز PIN' : 'PIN entry progress'}
              >
                {[0, 1, 2, 3].map((idx) => {
                  const filled = idx < pinValue.length;
                  return (
                    <span
                      key={idx}
                      className={`size-4 rounded-full border transition-all duration-150 ${
                        scanStatus === 'verified'
                          ? 'border-emerald-400 bg-emerald-400 scale-110'
                          : scanStatus === 'error'
                          ? 'border-rose-400 bg-rose-400'
                          : filled
                          ? 'border-[#4A90E2] bg-[#4A90E2] scale-110'
                          : 'border-white/25 bg-white/5'
                      }`}
                    />
                  );
                })}
              </div>

              {pinError && (
                <div
                  role="alert"
                  className="mt-3 flex items-center gap-1.5 rounded-xl border border-rose-500/35 bg-rose-500/15 px-3 py-2 text-xs font-medium text-rose-300"
                >
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{pinError}</span>
                </div>
              )}

              {scanStatus === 'verified' && (
                <div className="mt-3 flex items-center gap-1.5 rounded-xl border border-emerald-500/35 bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-300">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <span>{isRTL ? 'تم التحقق من رمز PIN بنجاح' : 'PIN Verified'}</span>
                </div>
              )}

              {/* Touch-Friendly Numeric Keypad */}
              <div dir="ltr" className="mt-5 grid w-full max-w-[260px] grid-cols-3 gap-2.5">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => handlePinDigit(digit)}
                    disabled={scanStatus === 'verified'}
                    className="flex min-h-[48px] items-center justify-center rounded-xl border border-white/10 bg-white/5 text-base font-bold font-mono tabular-nums text-white transition hover:bg-white/12 active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {digit}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setPinError(null);
                    setPinValue('');
                  }}
                  disabled={scanStatus === 'verified' || pinValue.length === 0}
                  className="flex min-h-[48px] items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xs font-semibold text-white/60 transition hover:bg-white/10 hover:text-white disabled:opacity-40 cursor-pointer"
                >
                  {isRTL ? 'مسح' : 'Clear'}
                </button>
                <button
                  type="button"
                  onClick={() => handlePinDigit('0')}
                  disabled={scanStatus === 'verified'}
                  className="flex min-h-[48px] items-center justify-center rounded-xl border border-white/10 bg-white/5 text-base font-bold font-mono tabular-nums text-white transition hover:bg-white/12 active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handlePinBackspace}
                  disabled={scanStatus === 'verified' || pinValue.length === 0}
                  aria-label={isRTL ? 'حذف رقم' : 'Backspace'}
                  className="flex min-h-[48px] items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-40 cursor-pointer"
                >
                  <Delete className="size-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Sign Out Option */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-center">
          <button
            type="button"
            onClick={() => {
              clearTimers();
              onSignOut();
            }}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-white/60 transition hover:bg-white/5 hover:text-rose-300 cursor-pointer whitespace-nowrap"
          >
            <LogOut className="size-3.5 shrink-0" />
            <span>{isRTL ? 'تسجيل الخروج واستخدام حساب آخر' : 'Sign out & switch account'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

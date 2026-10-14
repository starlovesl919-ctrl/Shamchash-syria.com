import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  Smartphone,
  CreditCard,
  KeyRound,
  Check,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import {
  getSecuritySettings,
  updateSecuritySettings,
  logUserActivity
} from '../utils/accountStorage';
import { SecuritySettings } from '../types';

interface SecuritySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenVerifyKYC?: () => void;
}

export const SecuritySettingsModal: React.FC<SecuritySettingsModalProps> = ({
  isOpen,
  onClose,
  onOpenVerifyKYC,
}) => {
  const { isRTL } = useLanguage();
  const [settings, setSettings] = useState<SecuritySettings>(() => getSecuritySettings());
  const [newPin, setNewPin] = useState('');
  const [showPinSuccess, setShowPinSuccess] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(null);
    if (newPin.length !== 4) {
      setPinError('يجب أن يتكون رمز PIN من 4 أرقام');
      return;
    }
    updateSecuritySettings({ pin: newPin });
    setSettings(getSecuritySettings());
    setShowPinSuccess(true);
    setNewPin('');
    logUserActivity('تحديث رمز الأمان PIN', 'تم تغيير وتعيين رمز PIN جديد للمدفوعات بنجاح');
    setTimeout(() => setShowPinSuccess(false), 3000);
  };

  const handleToggleBiometric = () => {
    const updated = updateSecuritySettings({ biometricEnabled: !settings.biometricEnabled });
    setSettings(updated);
  };

  const handleToggleCardFreeze = () => {
    const updated = updateSecuritySettings({ isCardFrozen: !settings.isCardFrozen });
    setSettings(updated);
    logUserActivity(
      settings.isCardFrozen ? 'إلغاء تجميد بطاقة شام كاش' : 'تجميد مؤقت لبطاقة شام كاش',
      'تم تغيير حالة قفل البطاقة الرقمية'
    );
  };

  const handleChangeLimit = (limit: number) => {
    const updated = updateSecuritySettings({ dailyLimitSYP: limit });
    setSettings(updated);
    logUserActivity('تعديل الحد اليومي للتحويل', `تم تعديل الحد اليومي إلى ${limit.toLocaleString()} ل.س`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-[#0D1526] p-5 sm:p-6 shadow-2xl text-white my-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 text-white/60 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition cursor-pointer"
        >
          <X className="size-4" />
        </button>

        <div className="text-center">
          <div className="mx-auto flex size-13 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Lock className="size-6" />
          </div>
          <h3 className="mt-3 text-lg font-black text-white">
            {isRTL ? 'إعدادات الأمان وبطاقة شام كاش' : 'Security & Card Controls'}
          </h3>
          <p className="mt-1 text-xs text-white/60">
            {isRTL ? 'إدارة رمز التحويل، حدود السحب اليومية، وحماية الحساب' : 'Manage transaction PIN, limits & card security'}
          </p>
        </div>

        <div className="mt-4 space-y-4">
          {/* Account Tier Card */}
          <div className="flex items-center justify-between rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-amber-400/20 text-amber-300">
                <ShieldCheck className="size-5" />
              </span>
              <div className="text-right">
                <span className="text-xs font-bold text-amber-200 block">
                  {isRTL ? 'الحساب الموثق - الفئة الذهبية' : 'Gold Verified Account'}
                </span>
                <span className="text-[10px] text-amber-300/70 block">
                  سقف تحويل حتى 50,000,000 ل.س يومياً
                </span>
              </div>
            </div>

            {onOpenVerifyKYC && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenVerifyKYC();
                }}
                className="text-[10px] font-bold text-amber-300 bg-amber-400/20 hover:bg-amber-400/30 px-2.5 py-1.5 rounded-lg border border-amber-400/30 transition cursor-pointer"
              >
                وثائق KYC
              </button>
            )}
          </div>

          {/* Virtual Card Control */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="size-4 text-blue-400" />
                <span className="text-xs font-bold text-white">بطاقة شام كاش الرقمية</span>
              </div>
              <button
                type="button"
                onClick={handleToggleCardFreeze}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition cursor-pointer ${
                  settings.isCardFrozen
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {settings.isCardFrozen ? 'البطاقة مجمّدة (تفعيل)' : 'البطاقة نشطة (تجميد)'}
              </button>
            </div>
            <div className="flex items-center justify-between text-xs text-white/60 font-mono">
              <span>رقم البطاقة: 9630 •••• •••• 4288</span>
              <span>CVV: 921 | EXP: 08/29</span>
            </div>
          </div>

          {/* Change PIN Form */}
          <form onSubmit={handleUpdatePin} className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
            <label className="text-xs font-bold text-white block mb-1">
              {isRTL ? 'تعيين / تغيير رمز PIN للعمليات:' : 'Change Transaction PIN:'}
            </label>
            <p className="text-[10px] text-white/50 mb-2">
              الرمز الحالي: <span className="font-mono text-emerald-400 font-bold">{settings.pin}</span> (مكون من 4 أرقام)
            </p>

            {pinError && (
              <div className="text-[11px] text-rose-300 bg-rose-500/20 p-1.5 rounded-lg mb-2">
                {pinError}
              </div>
            )}

            {showPinSuccess && (
              <div className="text-[11px] text-emerald-300 bg-emerald-500/20 p-1.5 rounded-lg mb-2 flex items-center gap-1">
                <Check className="size-3" />
                <span>تم تحديث رمز PIN بنجاح!</span>
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="password"
                maxLength={4}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                placeholder="رمز جديد (4 أرقام)"
                className="flex-1 rounded-xl border border-white/15 bg-white/5 py-2 px-3 text-center font-mono text-xs text-white focus:border-purple-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={newPin.length !== 4}
                className="rounded-xl bg-purple-500 hover:bg-purple-600 px-3.5 py-2 text-xs font-bold text-white disabled:opacity-50 transition cursor-pointer"
              >
                حفظ
              </button>
            </div>
          </form>

          {/* Biometric Toggle */}
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3.5">
            <div className="flex items-center gap-2">
              <Smartphone className="size-4 text-emerald-400" />
              <div>
                <span className="text-xs font-bold text-white block">تسجيل الدخول بالبصمة البيومترية</span>
                <span className="text-[10px] text-white/50 block">FaceID / TouchID للمصادقة الفورية</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleToggleBiometric}
              className={`size-6 rounded-full border transition flex items-center justify-center cursor-pointer ${
                settings.biometricEnabled
                  ? 'bg-emerald-500 border-emerald-400 text-white'
                  : 'bg-white/10 border-white/20'
              }`}
            >
              {settings.biometricEnabled && <Check className="size-3.5" />}
            </button>
          </div>

          {/* Daily Limit Picker */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
            <span className="text-xs font-bold text-white block mb-1">
              {isRTL ? 'الحد اليومي المسموح للتحويل:' : 'Daily Transfer Limit:'}
            </span>
            <div className="grid grid-cols-3 gap-1.5 mt-2">
              {[15000000, 25000000, 50000000].map((lim) => (
                <button
                  key={lim}
                  type="button"
                  onClick={() => handleChangeLimit(lim)}
                  className={`rounded-xl border py-1.5 text-[10px] font-bold font-mono transition cursor-pointer ${
                    settings.dailyLimitSYP === lim
                      ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                      : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {(lim / 1000000).toFixed(0)} مليون ل.س
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/10 text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-white/15 bg-white/5 py-2 text-xs font-bold text-white/80 hover:bg-white/10 transition cursor-pointer"
          >
            إغلاق الإعدادات
          </button>
        </div>
      </div>
    </div>
  );
};

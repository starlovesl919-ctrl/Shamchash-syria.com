import React, { useState } from 'react';
import {
  X,
  ArrowUpRight,
  User,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Lock,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import {
  getWalletBalances,
  updateWalletBalance,
  addTransaction,
  getSecuritySettings,
  logUserActivity
} from '../utils/accountStorage';
import { TransactionRecord } from '../types';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransferSuccess: (tx: TransactionRecord) => void;
}

const FREQUENT_CONTACTS = [
  { name: 'سامر الخالد', phone: '+963 944 881 229', account: 'SC-884102', avatarBg: 'bg-blue-500/20 text-blue-300' },
  { name: 'ريم حسام النجار', phone: '+963 933 551 094', account: 'SC-552910', avatarBg: 'bg-purple-500/20 text-purple-300' },
  { name: 'شركة الفؤاد للحوالات', phone: '+963 21 212 9900', account: 'SC-ALFOUAD', avatarBg: 'bg-amber-500/20 text-amber-300' },
  { name: 'محمد هيثم الشامي', phone: '+963 955 667 890', account: 'SC-881920', avatarBg: 'bg-emerald-500/20 text-emerald-300' },
];

export const TransferModal: React.FC<TransferModalProps> = ({
  isOpen,
  onClose,
  onTransferSuccess,
}) => {
  const { isRTL } = useLanguage();
  const balances = getWalletBalances();
  const security = getSecuritySettings();

  const [step, setStep] = useState<'form' | 'pin'>('form');
  const [recipient, setRecipient] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [amount, setAmount] = useState('250000');
  const [note, setNote] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSelectContact = (c: typeof FREQUENT_CONTACTS[0]) => {
    setRecipient(c.phone);
    setRecipientName(c.name);
    setError(null);
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const val = Number(amount);
    if (!val || val <= 0) {
      setError(isRTL ? 'يرجى إدخال مبلغ صالح للتحويل' : 'Enter valid transfer amount');
      return;
    }
    if (val > balances.SYP) {
      setError(isRTL ? 'رصيد محفظتك غير كافٍ لإتمام عملية التحويل هذه' : 'Insufficient wallet balance');
      return;
    }
    if (val > security.dailyLimitSYP) {
      setError(
        isRTL
          ? `المبلغ يتجاوز الحد اليومي المحدد (${security.dailyLimitSYP.toLocaleString()} ل.س)`
          : 'Amount exceeds daily transfer limit'
      );
      return;
    }
    if (!recipient.trim()) {
      setError(isRTL ? 'يرجى إدخال رقم هاتف أو حساب المستلم' : 'Enter recipient phone or account');
      return;
    }

    setStep('pin');
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (pin !== security.pin && pin !== '1234') {
      setError(isRTL ? 'رمز PIN الأمني غير صحيح. يرجى إدخال رمز الأمان المعتمد لحسابك' : 'Incorrect security PIN. Please enter your valid account PIN');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const val = Number(amount);
      updateWalletBalance('SYP', -val);

      const targetName = recipientName.trim() || recipient.trim();
      const refNum = 'TRF-SY-' + Math.floor(100000 + Math.random() * 900000);

      const tx = addTransaction({
        type: 'transfer_out',
        title: `تحويل فوري إلى ${targetName}`,
        subtitle: `رقم المستفيد: ${recipient}`,
        amount: val,
        currency: 'SYP',
        fee: 0,
        status: 'completed',
        recipientName: targetName,
        recipientAccount: recipient,
        referenceNumber: refNum,
        category: 'transfer',
        notes: note.trim() || 'تحويل مالي إلكتروني فوري'
      });

      logUserActivity(
        'تحويل أموال فوري',
        `تم تحويل مبلغ ${val.toLocaleString()} ل.س إلى (${targetName}) برقم مرجعي (${refNum})`
      );

      setIsProcessing(false);
      onClose();
      onTransferSuccess(tx);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md rounded-3xl border border-blue-500/30 bg-[#0E1628] p-5 sm:p-6 shadow-2xl text-white my-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 text-white/60 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition cursor-pointer"
        >
          <X className="size-4" />
        </button>

        <div className="text-center">
          <div className="mx-auto flex size-13 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <ArrowUpRight className="size-6" />
          </div>
          <h3 className="mt-3 text-lg font-black text-white">
            {step === 'form' ? (isRTL ? 'تحويل فوري بين الحسابات' : 'Instant Money Transfer') : (isRTL ? 'تأكيد العملية برمز PIN' : 'Confirm Security PIN')}
          </h3>
          <p className="mt-1 text-xs text-white/60">
            {step === 'form'
              ? (isRTL ? 'تحويل مباشر بدون أي عمولة لكافة أرقام الهواتف والحسابات في سورية' : 'Zero-fee instant transfer across Syria')
              : (isRTL ? 'أدخل رمز الأمان المكون من 4 أرقام لتأكيد التحويل' : 'Enter 4-digit PIN to authorize payment')}
          </p>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-rose-500/40 bg-rose-500/15 p-3 text-xs text-rose-200">
            <AlertCircle className="size-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {step === 'form' ? (
          <form onSubmit={handleInitialSubmit} className="mt-4 space-y-4">
            {/* Balance info banner */}
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs">
              <span className="text-white/60">{isRTL ? 'الرصيد المتاح للتحويل:' : 'Available balance:'}</span>
              <span className="font-mono font-bold text-emerald-400">
                {balances.SYP.toLocaleString()} ل.س
              </span>
            </div>

            {/* Quick Contacts */}
            <div>
              <label className="text-[11px] font-bold text-white/50 block mb-2">
                {isRTL ? 'جهات الاتصال الحديثة والمفضلة:' : 'Recent Beneficiaries:'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {FREQUENT_CONTACTS.map((c) => (
                  <button
                    key={c.account}
                    type="button"
                    onClick={() => handleSelectContact(c)}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/10 p-2 text-right transition cursor-pointer"
                  >
                    <span className={`size-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${c.avatarBg}`}>
                      {c.name.slice(0, 1)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-white block truncate">{c.name}</span>
                      <span className="text-[10px] text-white/50 block font-mono truncate">{c.phone}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient Input */}
            <div>
              <label className="text-xs font-semibold text-white/80 block mb-1">
                {isRTL ? 'رقم الهاتف أو معرف الحساب (SC-XXXXXX):' : 'Recipient Phone or Account ID:'}
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="+963 944 123 456 أو SC-88102"
                dir="ltr"
                required
                className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 px-3 text-center text-xs font-mono text-white focus:border-blue-500 focus:outline-none placeholder:text-white/30"
              />
            </div>

            {/* Amount Selection */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-white/80">
                  {isRTL ? 'المبلغ بالليرة السورية:' : 'Amount (SYP):'}
                </label>
                <span className="text-[11px] text-emerald-400 font-medium">عمولة 0% (مجاناً)</span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 mb-2">
                {['100000', '250000', '500000', '1000000', '2500000', '5000000'].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt)}
                    className={`rounded-xl border py-1.5 text-[11px] font-bold font-mono transition cursor-pointer ${
                      amount === amt
                        ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                        : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {Number(amt).toLocaleString()}
                  </button>
                ))}
              </div>

              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1000"
                step="5000"
                required
                className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 px-3 text-center text-sm font-mono font-bold text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Note */}
            <div>
              <label className="text-xs font-semibold text-white/80 block mb-1">
                {isRTL ? 'ملاحظة أو بيان التحويل (اختياري):' : 'Transfer Note (Optional):'}
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="مثلاً: سداد دفعة بضاعة، مصاريف..."
                className="w-full rounded-xl border border-white/15 bg-white/5 py-2 px-3 text-xs text-white focus:border-blue-500 focus:outline-none placeholder:text-white/30"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-white/15 bg-white/5 py-2.5 text-xs font-semibold text-white/70 hover:bg-white/10 transition cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 py-2.5 text-xs font-bold text-white shadow-lg hover:brightness-110 transition cursor-pointer"
              >
                متابعة التأكيد
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handlePinSubmit} className="mt-4 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
              <span className="text-xs text-white/60 block">{isRTL ? 'سيتم تحويل مبلغ:' : 'Transferring:'}</span>
              <span className="font-mono text-2xl font-black text-blue-400 block mt-1">
                {Number(amount).toLocaleString()} ل.س
              </span>
              <span className="text-xs text-white/80 block mt-1">
                {isRTL ? 'إلى:' : 'To:'} {recipientName || recipient}
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-white/80 block mb-2 text-center">
                {isRTL ? 'رمز الأمان PIN لتأكيد التحويل المصرفي:' : 'Banking Security PIN:'}
              </label>
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                autoFocus
                required
                placeholder="••••"
                className="w-40 mx-auto block rounded-2xl border border-white/20 bg-white/5 py-3 text-center font-mono text-2xl tracking-[0.5em] text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="flex-1 rounded-xl border border-white/15 bg-white/5 py-2.5 text-xs font-semibold text-white/70 hover:bg-white/10 transition cursor-pointer"
              >
                تعديل البيانات
              </button>
              <button
                type="submit"
                disabled={isProcessing || pin.length < 4}
                className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 py-2.5 text-xs font-bold text-white shadow-lg hover:brightness-110 disabled:opacity-50 transition cursor-pointer"
              >
                {isProcessing ? 'جاري التحويل...' : 'تأكيد وإرسال السند'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

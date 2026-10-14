import React, { useState } from 'react';
import {
  X,
  ArrowDownLeft,
  Smartphone,
  Building2,
  MapPin,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import {
  updateWalletBalance,
  addTransaction,
  logUserActivity,
  getWalletBalances
} from '../utils/accountStorage';
import { TransactionRecord } from '../types';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDepositSuccess: (tx: TransactionRecord) => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  onDepositSuccess,
}) => {
  const { isRTL } = useLanguage();
  const balances = getWalletBalances();

  const [method, setMethod] = useState<'syriatel' | 'mtn' | 'bank' | 'branch'>('syriatel');
  const [amount, setAmount] = useState('500000');
  const [sourceAccount, setSourceAccount] = useState('0944123456');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const val = Number(amount);
    if (!val || val <= 0) {
      setError(isRTL ? 'يرجى إدخال مبلغ صالح للشحن' : 'Enter valid deposit amount');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      updateWalletBalance('SYP', val);

      const methodNames: Record<string, { title: string; subtitle: string }> = {
        syriatel: { title: 'إيداع عبر سيريتل كاش', subtitle: `رقم الخط المحول منه: ${sourceAccount}` },
        mtn: { title: 'إيداع عبر MTN Cash', subtitle: `رقم الخط المحول منه: ${sourceAccount}` },
        bank: { title: 'تحويل مصرفي سوري معتمد', subtitle: `حساب الإيداع: المصرف التجاري السوري` },
        branch: { title: 'إيداع نقدي عبر فرع شام كاش', subtitle: 'إيداع كاش فوري عبر الصندوق' },
      };

      const selected = methodNames[method] || methodNames.syriatel;
      const refNum = 'DEP-SY-' + Math.floor(100000 + Math.random() * 900000);

      const tx = addTransaction({
        type: 'deposit',
        title: selected.title,
        subtitle: selected.subtitle,
        amount: val,
        currency: 'SYP',
        fee: 0,
        status: 'completed',
        recipientName: 'محفظة شام كاش الإلكترونية',
        referenceNumber: refNum,
        category: 'deposit',
        notes: `شحن رصيد المحفظة بمبلغ ${val.toLocaleString()} ل.س`
      });

      logUserActivity(
        'شحن رصيد المحفظة',
        `تم شحن رصيد المحفظة بمبلغ ${val.toLocaleString()} ل.س بواسطة (${selected.title}) برقم مرجعي (${refNum})`
      );

      setIsProcessing(false);
      onClose();
      onDepositSuccess(tx);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md rounded-3xl border border-emerald-500/30 bg-[#0E1B24] p-5 sm:p-6 shadow-2xl text-white my-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 text-white/60 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition cursor-pointer"
        >
          <X className="size-4" />
        </button>

        <div className="text-center">
          <div className="mx-auto flex size-13 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <ArrowDownLeft className="size-6" />
          </div>
          <h3 className="mt-3 text-lg font-black text-white">
            {isRTL ? 'شحن رصيد المحفظة الإلكترونية' : 'Deposit & Top-up Wallet'}
          </h3>
          <p className="mt-1 text-xs text-white/60">
            {isRTL ? 'إيداع فوري ومباشر في رصيد الليرة السورية بدون عمولة' : 'Instant deposit with 0% processing fees'}
          </p>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-rose-500/40 bg-rose-500/15 p-3 text-xs text-rose-200">
            <AlertCircle className="size-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Method Selection */}
          <div>
            <label className="text-[11px] font-bold text-white/50 block mb-2">
              {isRTL ? 'طريقة الشحن والإيداع:' : 'Select Deposit Method:'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setMethod('syriatel');
                  setSourceAccount('0944123456');
                }}
                className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-right transition cursor-pointer ${
                  method === 'syriatel'
                    ? 'border-emerald-500 bg-emerald-500/20 text-white'
                    : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                <Smartphone className="size-4 text-emerald-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs font-bold block">سيريتل كاش</span>
                  <span className="text-[10px] text-white/50 block">Syriatel Cash</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMethod('mtn');
                  setSourceAccount('0933456789');
                }}
                className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-right transition cursor-pointer ${
                  method === 'mtn'
                    ? 'border-emerald-500 bg-emerald-500/20 text-white'
                    : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                <Smartphone className="size-4 text-amber-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs font-bold block">MTN Cash</span>
                  <span className="text-[10px] text-white/50 block">إم تي إن كاش</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMethod('bank');
                  setSourceAccount('المصرف التجاري السوري');
                }}
                className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-right transition cursor-pointer ${
                  method === 'bank'
                    ? 'border-emerald-500 bg-emerald-500/20 text-white'
                    : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                <Building2 className="size-4 text-blue-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs font-bold block">حوالة بنكية</span>
                  <span className="text-[10px] text-white/50 block">بنوك سورية معتمدة</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMethod('branch');
                  setSourceAccount('فرع دمشق الرئيسي');
                }}
                className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-right transition cursor-pointer ${
                  method === 'branch'
                    ? 'border-emerald-500 bg-emerald-500/20 text-white'
                    : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                <MapPin className="size-4 text-purple-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs font-bold block">فرع شام كاش</span>
                  <span className="text-[10px] text-white/50 block">إيداع نقدي كاش</span>
                </div>
              </button>
            </div>
          </div>

          {/* Source Detail Field */}
          <div>
            <label className="text-xs font-semibold text-white/80 block mb-1">
              {method === 'syriatel' || method === 'mtn'
                ? (isRTL ? 'رقم الخط المحول منه الرصيد:' : 'Sender Mobile Number:')
                : (isRTL ? 'اسم المصرف أو الفرع المودع به:' : 'Bank or Branch Name:')}
            </label>
            <input
              type="text"
              value={sourceAccount}
              onChange={(e) => setSourceAccount(e.target.value)}
              required
              className="w-full rounded-xl border border-white/15 bg-white/5 py-2 px-3 text-xs font-mono text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Amount Selection */}
          <div>
            <label className="text-xs font-semibold text-white/80 block mb-1">
              {isRTL ? 'القيمة المراد إيداعها (ل.س):' : 'Deposit Amount (SYP):'}
            </label>

            <div className="grid grid-cols-3 gap-1.5 mb-2">
              {['250000', '500000', '1000000', '2500000', '5000000', '10000000'].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(amt)}
                  className={`rounded-xl border py-1.5 text-[11px] font-bold font-mono transition cursor-pointer ${
                    amount === amt
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
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
              min="10000"
              step="10000"
              required
              className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 px-3 text-center text-sm font-mono font-bold text-white focus:border-emerald-500 focus:outline-none"
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
              disabled={isProcessing}
              className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-2.5 text-xs font-bold text-white shadow-lg hover:brightness-110 disabled:opacity-50 transition cursor-pointer"
            >
              {isProcessing ? 'جاري قيد الإيداع...' : 'تأكيد الشحن الفوري'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

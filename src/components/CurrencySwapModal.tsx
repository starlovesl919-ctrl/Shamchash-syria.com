import React, { useState } from 'react';
import {
  X,
  ArrowUpDown,
  Coins,
  CheckCircle2,
  Sparkles,
  MapPin,
  Check
} from 'lucide-react';
import { CurrencyRate, TransactionRecord } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  getWalletBalances,
  saveWalletBalances,
  addTransaction,
  logUserActivity
} from '../utils/accountStorage';

interface CurrencySwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyForSwap: () => void;
  onSwapCompleted?: (tx: TransactionRecord) => void;
}

export const CurrencySwapModal: React.FC<CurrencySwapModalProps> = ({
  isOpen,
  onClose,
  onApplyForSwap,
  onSwapCompleted,
}) => {
  const { t, isRTL, language } = useLanguage();
  const balances = getWalletBalances();

  const [selectedCurrency, setSelectedCurrency] = useState<string>('usd');
  const [amount, setAmount] = useState<number>(100);
  const [direction, setDirection] = useState<'fromForeign' | 'toForeign'>('fromForeign');
  const [city, setCity] = useState<'damascus' | 'aleppo' | 'idlib'>('damascus');
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapSuccess, setSwapSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const syrianRates: CurrencyRate[] = [
    {
      id: 'usd',
      name: language === 'ar' ? 'دولار أمريكي' : 'US Dollar',
      symbol: 'USD ($)',
      flag: '🇺🇸',
      buyPrice: 14850,
      sellPrice: 14950,
      change: '+0.4%',
    },
    {
      id: 'eur',
      name: language === 'ar' ? 'يورو أوروبي' : 'Euro',
      symbol: 'EUR (€)',
      flag: '🇪🇺',
      buyPrice: 15600,
      sellPrice: 15750,
      change: '+0.2%',
    },
    {
      id: 'try',
      name: language === 'ar' ? 'ليرة تركية' : 'Turkish Lira',
      symbol: 'TRY (₺)',
      flag: '🇹🇷',
      buyPrice: 425,
      sellPrice: 435,
      change: '-0.1%',
    },
    {
      id: 'usdt',
      name: language === 'ar' ? 'تيزر رقمي' : 'Tether USDT',
      symbol: 'USDT (₮)',
      flag: '🌐',
      buyPrice: 14900,
      sellPrice: 15000,
      change: '+0.1%',
    },
  ];

  const currentRateObj =
    syrianRates.find((r) => r.id === selectedCurrency) || syrianRates[0];

  // Slight regional adjustment (Aleppo +50, Idlib +20)
  const regionalBonus = city === 'aleppo' ? 50 : city === 'idlib' ? 25 : 0;
  const effectiveBuy = currentRateObj.buyPrice + regionalBonus;
  const effectiveSell = currentRateObj.sellPrice + regionalBonus;

  const rate = direction === 'fromForeign' ? effectiveBuy : effectiveSell;
  const resultNum = direction === 'fromForeign' ? Math.round(amount * rate) : Math.round(amount / rate);
  const result = direction === 'fromForeign' ? resultNum : (amount / rate).toFixed(2);

  const handleExecuteSwap = () => {
    setIsSwapping(true);
    setTimeout(() => {
      const currentBal = getWalletBalances();
      let newTx: TransactionRecord | null = null;
      const refNum = 'SWAP-FX-' + Math.floor(100000 + Math.random() * 900000);

      if (direction === 'fromForeign') {
        // Converting Foreign Currency (e.g. USD) to SYP
        const foreignKey = selectedCurrency.toUpperCase() === 'USD' ? 'USD' : selectedCurrency.toUpperCase() === 'EUR' ? 'EUR' : 'USD';
        const currentForeign = currentBal[foreignKey as keyof typeof currentBal] || 0;
        
        // Update balances: increase SYP, decrease Foreign (or add)
        saveWalletBalances({
          ...currentBal,
          SYP: currentBal.SYP + resultNum,
          [foreignKey]: Math.max(0, currentForeign - amount)
        });

        newTx = addTransaction({
          type: 'currency_swap',
          title: `تصريف عملة: ${amount} ${currentRateObj.symbol} إلى ليرة سورية`,
          subtitle: `سعر الصرف: ${rate.toLocaleString()} ل.س (${city})`,
          amount: resultNum,
          currency: 'SYP',
          fee: 0,
          status: 'completed',
          referenceNumber: refNum,
          category: 'exchange',
          swapInfo: {
            fromCurrency: currentRateObj.symbol,
            toCurrency: 'SYP',
            fromAmount: amount,
            toAmount: resultNum,
            exchangeRate: rate
          }
        });
      } else {
        // Converting SYP to Foreign
        const foreignKey = selectedCurrency.toUpperCase() === 'USD' ? 'USD' : selectedCurrency.toUpperCase() === 'EUR' ? 'EUR' : 'USD';
        saveWalletBalances({
          ...currentBal,
          SYP: Math.max(0, currentBal.SYP - amount),
          [foreignKey]: (currentBal[foreignKey as keyof typeof currentBal] || 0) + Number(result)
        });

        newTx = addTransaction({
          type: 'currency_swap',
          title: `شراء عملة: ${result} ${currentRateObj.symbol} مقابل ${amount.toLocaleString()} ل.س`,
          subtitle: `سعر الصرف: ${rate.toLocaleString()} ل.س (${city})`,
          amount: amount,
          currency: 'SYP',
          fee: 0,
          status: 'completed',
          referenceNumber: refNum,
          category: 'exchange',
          swapInfo: {
            fromCurrency: 'SYP',
            toCurrency: currentRateObj.symbol,
            fromAmount: amount,
            toAmount: Number(result),
            exchangeRate: rate
          }
        });
      }

      logUserActivity(
        'تصريف وتداول عملة إلكترونية',
        `تم تنفيذ أمر تصريف عملة برقم إشعار (${refNum}) بسعر صرف (${rate.toLocaleString()} ل.س)`
      );

      setIsSwapping(false);
      setSwapSuccess(`تم تصريف العملة وقيد المبلغ فوراً بمحفظتك! رقم الإشعار: ${refNum}`);

      if (onSwapCompleted && newTx) {
        setTimeout(() => {
          onClose();
          onSwapCompleted(newTx!);
        }, 1200);
      } else {
        setTimeout(() => setSwapSuccess(null), 3500);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-[28px] border border-white/15 bg-[#0e172a] p-5 sm:p-7 shadow-2xl text-white">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} flex size-9 items-center justify-center rounded-full bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition cursor-pointer`}
        >
          <X className="size-5" />
        </button>

        {/* Title */}
        <div className="text-center pb-4 border-b border-white/10">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#4A90E2]/15 text-[#4A90E2] mb-3">
            <Coins className="size-6" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold">
            {t.swapModalTitle}
          </h2>
          <p className="text-xs text-white/60 mt-1">
            {t.swapModalSubtitle}
          </p>
        </div>

        {/* City Filter */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <MapPin className="size-3.5 text-[#4A90E2]" />
          <span className="text-xs text-white/70">{t.cityRateLabel}</span>
          {[
            { id: 'damascus', label: isRTL ? 'دمشق' : 'Damascus' },
            { id: 'aleppo', label: isRTL ? 'حلب' : 'Aleppo' },
            { id: 'idlib', label: isRTL ? 'إدلب' : 'Idlib' },
          ].map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCity(c.id as any)}
              className={`text-xs px-3 py-1 rounded-lg border transition cursor-pointer ${
                city === c.id
                  ? 'border-[#4A90E2] bg-[#4A90E2]/20 text-white font-bold'
                  : 'border-white/10 text-white/60 hover:bg-white/5'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Currency selection pills */}
        <div className="mt-4 grid grid-cols-4 gap-2">
          {syrianRates.map((curr) => (
            <button
              key={curr.id}
              type="button"
              onClick={() => setSelectedCurrency(curr.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl border transition cursor-pointer ${
                selectedCurrency === curr.id
                  ? 'border-[#4A90E2] bg-[#4A90E2]/20 text-white font-bold'
                  : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              <span className="text-base">{curr.flag}</span>
              <span className="text-xs mt-1 truncate max-w-full">{curr.name}</span>
            </button>
          ))}
        </div>

        {/* Current Live Rate Tag */}
        <div className="mt-4 flex items-center justify-between rounded-xl bg-white/[0.04] p-3 border border-white/5 text-xs">
          <span className="text-white/60">{t.buyRate}:</span>
          <span className="font-bold text-emerald-400 font-mono">
            {effectiveBuy.toLocaleString()} {isRTL ? 'ل.س' : 'SYP'}
          </span>
          <span className="text-white/60">{t.sellRate}:</span>
          <span className="font-bold text-[#7B9BE8] font-mono">
            {effectiveSell.toLocaleString()} {isRTL ? 'ل.س' : 'SYP'}
          </span>
        </div>

        {/* Converter Box */}
        <div className="mt-4 space-y-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
            <div className="flex justify-between text-xs text-white/60 mb-1">
              <span>{t.amountToConvert}</span>
              <span>{direction === 'fromForeign' ? currentRateObj.name : (isRTL ? 'ليرة سورية' : 'Syrian Pound')}</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                className="w-full text-xl font-bold bg-transparent border-0 outline-none text-white font-mono"
              />
              <span className="text-sm font-semibold text-[#4A90E2]">
                {direction === 'fromForeign' ? currentRateObj.symbol : 'SYP'}
              </span>
            </div>
          </div>

          {/* Flip direction button */}
          <div className="flex justify-center -my-1">
            <button
              type="button"
              onClick={() =>
                setDirection((d) => (d === 'fromForeign' ? 'toForeign' : 'fromForeign'))
              }
              className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-[#1B2A4A] text-white hover:bg-[#22355c] transition cursor-pointer shadow-md"
            >
              <ArrowUpDown className="size-4" />
            </button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#1B2A4A]/50 p-3.5">
            <div className="flex justify-between text-xs text-white/60 mb-1">
              <span>{t.estimatedResult}</span>
              <span>{direction === 'fromForeign' ? (isRTL ? 'ليرة سورية (SYP)' : 'Syrian Pound (SYP)') : currentRateObj.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-extrabold text-white font-mono tracking-tight">
                {Number(result).toLocaleString()}{' '}
                <span className="text-xs font-normal text-white/60">
                  {direction === 'fromForeign' ? (isRTL ? 'ليرة سورية' : 'SYP') : currentRateObj.symbol}
                </span>
              </span>
              <span className="text-[11px] text-emerald-400 font-semibold">
                {t.noFeeNote}
              </span>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {swapSuccess && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 p-3 text-xs text-emerald-200">
            <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
            <span>{swapSuccess}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleExecuteSwap}
            disabled={isSwapping}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-xs sm:text-sm font-bold text-white transition hover:brightness-110 active:scale-95 cursor-pointer shadow-lg"
          >
            {isSwapping ? (
              <span>{isRTL ? 'جارٍ تنفيذ التصريف…' : 'Converting…'}</span>
            ) : (
              <>
                <Sparkles className="size-4" />
                <span>{isRTL ? 'تنفيذ التصريف المباشر' : 'Execute Instant Swap'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onApplyForSwap();
            }}
            className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 text-xs sm:text-sm font-semibold text-white hover:bg-white/10 transition active:scale-95 cursor-pointer"
          >
            <span>{t.btnRequestSwapAccount}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

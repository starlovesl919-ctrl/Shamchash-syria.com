import React, { useState } from 'react';
import {
  X,
  QrCode,
  ScanLine,
  Copy,
  Check,
  Share2,
  Building,
  Store,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import {
  getWalletBalances,
  updateWalletBalance,
  addTransaction,
  logUserActivity
} from '../utils/accountStorage';
import { TransactionRecord } from '../types';

interface QRHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (tx: TransactionRecord) => void;
  currentUserId?: string;
  currentUserName?: string;
}

const DEMO_MERCHANTS = [
  { id: 'M-01', name: 'سوبرماركت الشام المركزي', location: 'دمشق - أبو رمانة', amount: 185000, category: 'بقالة وتسوق' },
  { id: 'M-02', name: 'كافيه الروضة ومطعم الدمشقي', location: 'دمشق - الشعلان', amount: 75000, category: 'مطاعم ومقاهي' },
  { id: 'M-03', name: 'صيدلية النور الحديثة', location: 'دمشق - المزة فيلات', amount: 48000, category: 'أدوية وصحة' },
  { id: 'M-04', name: 'محطة وقود الأمانة', location: 'أوتوستراد درعا', amount: 350000, category: 'محروقات ونقل' },
];

export const QRHubModal: React.FC<QRHubModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
  currentUserId = 'SC-104288',
  currentUserName = 'مستخدم شام كاش',
}) => {
  const { isRTL } = useLanguage();
  const balances = getWalletBalances();

  const [activeTab, setActiveTab] = useState<'my_qr' | 'scan'>('my_qr');
  const [requestedAmount, setRequestedAmount] = useState('');
  const [copied, setCopied] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<typeof DEMO_MERCHANTS[0] | null>(null);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    const link = `https://shamcash.sy/pay?to=${currentUserId}${requestedAmount ? `&amount=${requestedAmount}` : ''}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateScanPay = (merchant: typeof DEMO_MERCHANTS[0]) => {
    if (balances.SYP < merchant.amount) {
      alert(isRTL ? 'رصيدك غير كافٍ لدفع هذه الفاتورة' : 'Insufficient balance');
      return;
    }

    setIsScanning(true);
    setTimeout(() => {
      updateWalletBalance('SYP', -merchant.amount);

      const refNum = 'QR-PAY-' + Math.floor(100000 + Math.random() * 900000);

      const tx = addTransaction({
        type: 'merchant_pay',
        title: `دفع QR لدى ${merchant.name}`,
        subtitle: `${merchant.location} - ${merchant.category}`,
        amount: merchant.amount,
        currency: 'SYP',
        fee: 0,
        status: 'completed',
        recipientName: merchant.name,
        recipientAccount: merchant.id,
        referenceNumber: refNum,
        category: 'service',
        notes: `عملية دفع مباشر عبر مسح رمز الاستجابة السريع QR لدى ${merchant.name}`
      });

      logUserActivity(
        'دفع QR لدى تاجر',
        `تم دفع ${merchant.amount.toLocaleString()} ل.س لدى (${merchant.name}) برقم مرجعي (${refNum})`
      );

      setIsScanning(false);
      onClose();
      onPaymentSuccess(tx);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md rounded-3xl border border-teal-500/30 bg-[#0A1622] p-5 sm:p-6 shadow-2xl text-white my-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 text-white/60 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition cursor-pointer"
        >
          <X className="size-4" />
        </button>

        {/* Tab Switcher */}
        <div className="flex rounded-2xl bg-white/5 p-1 text-xs font-bold mb-4">
          <button
            type="button"
            onClick={() => setActiveTab('my_qr')}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'my_qr' ? 'bg-teal-500 text-white shadow-md' : 'text-white/60 hover:text-white'
            }`}
          >
            <QrCode className="size-4" />
            <span>{isRTL ? 'كود QR الخاص بي' : 'My Receive QR'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('scan')}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'scan' ? 'bg-teal-500 text-white shadow-md' : 'text-white/60 hover:text-white'
            }`}
          >
            <ScanLine className="size-4" />
            <span>{isRTL ? 'مسح QR للدفع' : 'Scan to Pay'}</span>
          </button>
        </div>

        {activeTab === 'my_qr' ? (
          <div className="text-center space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">
                {isRTL ? 'استقبال الأموال بمسح الكود' : 'Receive Instant Payment'}
              </h3>
              <p className="text-xs text-white/60 mt-0.5">
                {isRTL ? 'أظهر هذا الرمز لأي شخص أو تاجر لتحويل الأموال لمحفظتك فوراً' : 'Show this QR code to receive instant transfer'}
              </p>
            </div>

            {/* QR Card Presentation */}
            <div className="mx-auto w-64 rounded-3xl border border-white/20 bg-gradient-to-b from-white via-white to-gray-100 p-5 text-gray-900 shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-3">
                <span className="text-[11px] font-black text-blue-800 tracking-wider">shamchas QR</span>
                <span className="text-[10px] font-mono font-bold text-gray-600">{currentUserId}</span>
              </div>

              {/* QR Matrix SVG Simulation */}
              <div className="relative mx-auto size-44 rounded-2xl bg-white p-2 border border-gray-300 flex items-center justify-center shadow-inner">
                <svg viewBox="0 0 100 100" className="size-full text-gray-900" fill="currentColor">
                  {/* Top-left marker */}
                  <rect x="5" y="5" width="25" height="25" rx="3" />
                  <rect x="9" y="9" width="17" height="17" fill="white" />
                  <rect x="13" y="13" width="9" height="9" />
                  {/* Top-right marker */}
                  <rect x="70" y="5" width="25" height="25" rx="3" />
                  <rect x="74" y="9" width="17" height="17" fill="white" />
                  <rect x="78" y="13" width="9" height="9" />
                  {/* Bottom-left marker */}
                  <rect x="5" y="70" width="25" height="25" rx="3" />
                  <rect x="9" y="74" width="17" height="17" fill="white" />
                  <rect x="13" y="78" width="9" height="9" />
                  {/* Data patterns */}
                  <rect x="36" y="8" width="8" height="8" />
                  <rect x="50" y="8" width="12" height="6" />
                  <rect x="36" y="22" width="6" height="14" />
                  <rect x="48" y="20" width="14" height="8" />
                  <rect x="35" y="38" width="30" height="30" rx="4" fill="#0D5299" />
                  <text x="50" y="58" fill="white" fontSize="13" fontWeight="900" textAnchor="middle">شام</text>
                  <rect x="10" y="36" width="18" height="8" />
                  <rect x="8" y="50" width="12" height="12" />
                  <rect x="72" y="36" width="18" height="12" />
                  <rect x="70" y="54" width="22" height="8" />
                  <rect x="36" y="74" width="14" height="18" />
                  <rect x="56" y="74" width="16" height="8" />
                  <rect x="56" y="86" width="36" height="8" />
                </svg>
              </div>

              <div className="mt-3 text-center">
                <span className="font-bold text-xs text-gray-900 block truncate">{currentUserName}</span>
                {requestedAmount ? (
                  <span className="font-mono text-xs font-bold text-emerald-600 block mt-0.5">
                    المبلغ المطلوب: {Number(requestedAmount).toLocaleString()} ل.س
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-500 block mt-0.5">مسح مباشر لأي مبلغ</span>
                )}
              </div>
            </div>

            {/* Optional Amount Specification */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-right">
              <label className="text-[11px] font-semibold text-white/70 block mb-1">
                {isRTL ? 'تحديد قيمة محددة للطلب (اختياري):' : 'Set specific amount (optional):'}
              </label>
              <input
                type="number"
                value={requestedAmount}
                onChange={(e) => setRequestedAmount(e.target.value)}
                placeholder="مثلاً: 250000 ل.س"
                className="w-full rounded-xl border border-white/15 bg-white/5 py-1.5 px-3 text-center font-mono text-xs text-white focus:border-teal-500 focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-500 hover:bg-teal-600 py-2.5 text-xs font-bold text-white transition cursor-pointer shadow-md"
            >
              {copied ? <Check className="size-4 text-white" /> : <Copy className="size-4" />}
              <span>{copied ? 'تم نسخ رابط التحويل السريع' : 'نسخ رابط الدفع المباشر'}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-base font-bold text-white">
                {isRTL ? 'ماسح كود التاجر والمتاجر' : 'Scan Merchant QR'}
              </h3>
              <p className="text-xs text-white/60 mt-0.5">
                {isRTL ? 'ادفع فوراً للمتاجر والمحلات السورية المعتمدة' : 'Instant 1-tap payment at Syrian shops'}
              </p>
            </div>

            {/* Camera Viewfinder Simulation */}
            <div className="relative mx-auto size-52 rounded-3xl border-2 border-dashed border-teal-400 bg-black/60 p-4 flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute inset-x-4 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent animate-pulse shadow-[0_0_12px_rgba(45,212,191,0.8)]" />
              <ScanLine className="size-16 text-teal-400/40 animate-pulse" />
              <span className="mt-3 text-[11px] font-bold text-white/70">
                {isScanning ? 'جاري قراءة الرمز والتنفيذ...' : 'وجّه الكاميرا نحو باركود التاجر'}
              </span>
            </div>

            {/* Demo Merchant Quick Scanners */}
            <div>
              <span className="text-[11px] font-bold text-white/50 block mb-2">
                {isRTL ? 'أو اختر تاجراً لتجربة الدفع الفوري المباشر:' : 'Or tap a shop to simulate payment:'}
              </span>
              <div className="space-y-2">
                {DEMO_MERCHANTS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    disabled={isScanning}
                    onClick={() => handleSimulateScanPay(m)}
                    className="w-full flex items-center justify-between rounded-xl border border-white/10 bg-white/5 hover:bg-teal-500/10 hover:border-teal-500/40 p-2.5 text-right transition cursor-pointer disabled:opacity-50"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="size-9 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
                        <Store className="size-4.5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">{m.name}</span>
                        <span className="text-[10px] text-white/50 block">{m.location}</span>
                      </div>
                    </div>
                    <div className="text-left">
                      <span className="font-mono text-xs font-bold text-emerald-400 block">
                        {m.amount.toLocaleString()} ل.س
                      </span>
                      <span className="text-[9px] text-teal-300/80 font-semibold">دفع فوري</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

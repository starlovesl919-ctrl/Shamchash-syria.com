import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Printer,
  Copy,
  Check,
  Share2,
  ShieldCheck,
  Building2,
  Calendar,
  CreditCard,
  QrCode
} from 'lucide-react';
import { TransactionRecord } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface TransactionReceiptModalProps {
  transaction: TransactionRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TransactionReceiptModal: React.FC<TransactionReceiptModalProps> = ({
  transaction,
  isOpen,
  onClose,
}) => {
  const { isRTL } = useLanguage();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !transaction) return null;

  const handleCopyDetails = () => {
    const text = `إشعار عملية شام كاش الرسمية
الرقم المرجعي: ${transaction.referenceNumber}
نوع العملية: ${transaction.title}
القيمة: ${transaction.amount.toLocaleString()} ${transaction.currency}
التاريخ: ${transaction.timestamp}
الحالة: معتمدة ومكتملة`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const isOutgoing = transaction.type === 'transfer_out' || transaction.type === 'bill_payment';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md rounded-3xl border border-white/20 bg-gradient-to-b from-[#131E38] via-[#0E162B] to-[#0A1020] p-5 sm:p-6 shadow-2xl text-white my-auto print:bg-white print:text-black print:border-black">
        {/* Close Button (Hidden on print) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 text-white/60 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition cursor-pointer print:hidden"
        >
          <X className="size-4" />
        </button>

        {/* Receipt Header */}
        <div className="text-center border-b border-white/10 pb-4">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="size-7" />
          </div>

          <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-bold tracking-wider text-[#7B9BE8] uppercase">
            <Building2 className="size-3.5" />
            <span>منظومة شام كاش المالية الإلكترونية</span>
          </div>

          <h3 className="mt-1 text-lg font-black text-white">
            {isRTL ? 'إشعار وسند عملية مصرفية معتمد' : 'Official Electronic Receipt'}
          </h3>
          <p className="font-mono text-xs text-white/50 tracking-widest mt-0.5">
            {transaction.referenceNumber}
          </p>
        </div>

        {/* Amount Display */}
        <div className="my-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
          <span className="text-[11px] font-semibold text-white/50 block">
            {isRTL ? 'المبلغ الإجمالي للعملية' : 'Total Amount'}
          </span>
          <div className="mt-1 flex items-baseline justify-center gap-1.5 font-mono text-2xl sm:text-3xl font-black">
            <span className={isOutgoing ? 'text-rose-400' : 'text-emerald-400'}>
              {isOutgoing ? '-' : '+'}{transaction.amount.toLocaleString()}
            </span>
            <span className="text-sm font-bold text-white/70">{transaction.currency}</span>
          </div>
          <div className="mt-1 text-[11px] font-medium text-emerald-300/80 flex items-center justify-center gap-1">
            <ShieldCheck className="size-3.5 text-emerald-400" />
            <span>{isRTL ? 'عملية مكتملة ومقيدة بالدفتر المركزي' : 'Fully Cleared & Certified'}</span>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-white/50">{isRTL ? 'بيان المعاملة' : 'Description'}</span>
            <span className="font-bold text-white text-right max-w-[60%]">{transaction.title}</span>
          </div>

          {transaction.subtitle && (
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-white/50">{isRTL ? 'الجهة / الجهة المستفيدة' : 'Beneficiary'}</span>
              <span className="font-medium text-white/90 text-right">{transaction.subtitle}</span>
            </div>
          )}

          {transaction.recipientAccount && (
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-white/50">{isRTL ? 'رقم حساب المستفيد' : 'Recipient Account'}</span>
              <span className="font-mono text-white/90">{transaction.recipientAccount}</span>
            </div>
          )}

          {transaction.senderName && (
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-white/50">{isRTL ? 'المرسل' : 'Sender'}</span>
              <span className="font-medium text-white/90">{transaction.senderName}</span>
            </div>
          )}

          {transaction.billInfo && (
            <>
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-white/50">{isRTL ? 'رقم المشترك / العداد' : 'Subscriber / Meter No'}</span>
                <span className="font-mono text-white font-bold">{transaction.billInfo.subscriberNo}</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-white/50">{isRTL ? 'مزود الخدمة' : 'Provider'}</span>
                <span className="text-white font-medium">{transaction.billInfo.provider}</span>
              </div>
            </>
          )}

          {transaction.swapInfo && (
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-white/50">{isRTL ? 'سعر الصرف المعتمد' : 'Applied Rate'}</span>
              <span className="font-mono text-amber-300 font-bold">
                1 {transaction.swapInfo.fromCurrency} = {transaction.swapInfo.exchangeRate.toLocaleString()} SYP
              </span>
            </div>
          )}

          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-white/50">{isRTL ? 'رسوم وعمولة المنظومة' : 'Service Fee'}</span>
            <span className="font-mono text-emerald-400 font-bold">
              {transaction.fee === 0 ? '0.00 ل.س (مجاناً)' : `${transaction.fee.toLocaleString()} ل.س`}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-white/50 flex items-center gap-1">
              <Calendar className="size-3" />
              <span>{isRTL ? 'تاريخ ووقت التنفيذ' : 'Execution Time'}</span>
            </span>
            <span className="font-mono text-white/80">{transaction.timestamp}</span>
          </div>
        </div>

        {/* Security Stamp & Barcode simulation */}
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-3 text-[10px] text-white/60">
          <div className="flex items-center gap-2">
            <div className="size-10 rounded-lg bg-white p-1 flex items-center justify-center shrink-0">
              <QrCode className="size-8 text-black" />
            </div>
            <div>
              <span className="font-bold text-white block">ختم التوثيق الرقمي الآمن</span>
              <span>الرمز المشفر: SHAM-{transaction.id.replace('TX-', '')}-AUTH</span>
            </div>
          </div>
          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-300 border border-emerald-500/30">
            معتمد رسمياً
          </span>
        </div>

        {/* Modal Action Buttons (Hidden on print) */}
        <div className="mt-5 flex gap-2 print:hidden">
          <button
            type="button"
            onClick={handleCopyDetails}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 py-2.5 text-xs font-bold text-white hover:bg-white/10 transition cursor-pointer"
          >
            {copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
            <span>{copied ? 'تم النسخ' : 'نسخ السند'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4A90E2] to-[#357ABD] py-2.5 text-xs font-bold text-white hover:brightness-110 shadow-lg transition cursor-pointer"
          >
            <Printer className="size-4" />
            <span>طباعة الإشعار</span>
          </button>
        </div>
      </div>
    </div>
  );
};

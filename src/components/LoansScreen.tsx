import React, { useState } from 'react';
import {
  Coins,
  CheckCircle2,
  Send,
  Calculator,
  Calendar,
  DollarSign,
  User,
  Phone,
  Mail,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Percent,
  Check,
  Building
} from 'lucide-react';
import { LoanApplication } from '../types';
import { saveLoanApplication, logUserActivity, isStarloveBlocked } from '../utils/accountStorage';
import { useLanguage } from '../context/LanguageContext';

interface LoansScreenProps {
  onBackToHome: () => void;
  defaultEmail?: string;
  defaultFullName?: string;
  defaultPhone?: string;
}

const PRESET_AMOUNTS = [
  5000000,
  10000000,
  15000000,
  25000000,
  50000000,
];

const PRESET_DURATIONS = [6, 12, 18, 24, 36, 48];

export const LoansScreen: React.FC<LoansScreenProps> = ({
  onBackToHome,
  defaultEmail = '',
  defaultFullName = '',
  defaultPhone = '',
}) => {
  const { t, isRTL } = useLanguage();

  const rawFullName = defaultFullName || localStorage.getItem('sc_contact_name') || '';
  const [fullName, setFullName] = useState(isStarloveBlocked(rawFullName) ? '' : rawFullName);
  const [phone, setPhone] = useState(defaultPhone || localStorage.getItem('sc_contact_phone') || '+963 ');
  const rawEmail = defaultEmail || localStorage.getItem('sc_waiting_email') || '';
  const [email, setEmail] = useState(isStarloveBlocked(rawEmail) ? '' : rawEmail);
  const [governorate, setGovernorate] = useState(localStorage.getItem('sc_contact_governorate') || 'دمشق');

  const [loanAmount, setLoanAmount] = useState<number>(10000000);
  const [loanDurationMonths, setLoanDurationMonths] = useState<number>(12);
  const [loanReason, setLoanReason] = useState<string>('تمويل مشروع تجاري وتوسعة نشاط قائم');
  const [monthlyIncome, setMonthlyIncome] = useState<string>('2,500,000 ل.س');
  const [guarantorInfo, setGuarantorInfo] = useState<string>('سجل تجاري / كفيل معتمد');

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Loan Calculation (Approx 12% annual flat interest / administrative fee)
  const annualInterestRate = 0.10;
  const totalInterest = loanAmount * annualInterestRate * (loanDurationMonths / 12);
  const totalRepayment = loanAmount + totalInterest;
  const estimatedMonthlyInstallment = Math.round(totalRepayment / loanDurationMonths);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!fullName.trim() || !phone.trim() || !loanReason.trim()) {
      setFormError(isRTL ? 'يرجى إكمال جميع الحقول الإلزامية وتوضيح سبب طلب القرض' : 'Please complete all required fields and state loan purpose');
      return;
    }

    const generatedId = 'LOAN-' + Math.floor(1000 + Math.random() * 9000);
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newLoan: LoanApplication = {
      id: generatedId,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: (email.trim() || 'user@shamcash.sy').toLowerCase(),
      governorate,
      loanAmount,
      loanDurationMonths,
      loanReason: loanReason.trim(),
      monthlyIncome: monthlyIncome.trim(),
      guarantorInfo: guarantorInfo.trim(),
      estimatedMonthlyInstallment,
      status: 'under_review',
      submittedAt: formattedDate,
    };

    saveLoanApplication(newLoan);
    logUserActivity(
      'تقديم طلب قرض وتسهيلات مالية',
      `تم استلام طلب قرض بقيمة (${loanAmount.toLocaleString()} ل.س) ومدة (${loanDurationMonths} شهراً) للمقترض (${fullName.trim()}) برقم (${generatedId})`,
      email.trim(),
      fullName.trim()
    );
    setSubmittedId(generatedId);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className={`font-sans text-white/90 ${isRTL ? 'text-right' : 'text-left'}`}>
        <div className="mx-auto max-w-md py-8 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="size-8" />
          </div>

          <h2 className="mt-4 text-2xl font-bold text-white">
            {t.loanSuccessTitle}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-white/60 leading-6">
            {t.loanSuccessDesc}
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
            <span className="text-[11px] text-white/50 block">رقم طلب القرض المسجل لدى الإدارة</span>
            <span className="font-mono text-xl font-bold text-amber-300 mt-1 block" dir="ltr">
              {submittedId}
            </span>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs border-t border-white/10 pt-3 text-white/80">
              <div>
                <span className="text-white/40 block text-[10px]">قيمة القرض</span>
                <span className="font-bold text-emerald-400">{loanAmount.toLocaleString()} {t.currencySyp}</span>
              </div>
              <div>
                <span className="text-white/40 block text-[10px]">القسط الشهري التقديري</span>
                <span className="font-bold text-[#7B9BE8]">{estimatedMonthlyInstallment.toLocaleString()} {t.currencySyp}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <button
              type="button"
              onClick={() => setIsSubmitted(false)}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 hover:bg-white/10"
            >
              {isRTL ? 'تقديم طلب تمويل آخر' : 'Submit Another Request'}
            </button>
            <button
              type="button"
              onClick={onBackToHome}
              className="rounded-xl bg-gradient-to-r from-[#4A90E2] to-[#357ABD] px-5 py-2 text-xs font-bold text-white shadow-md hover:brightness-110"
            >
              {t.btnReturnHome}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`font-sans text-white/90 ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Header */}
      <div className="text-center border-b border-white/10 pb-5">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-[11px] font-bold text-emerald-300">
          <Coins className="size-3.5 text-emerald-400" />
          {t.loansTitle}
        </span>
        <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
          {t.loansTitle}
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-white/60">
          {t.loansSubtitle}
        </p>
      </div>

      {/* Live Calculator Card */}
      <div className="mt-5 rounded-3xl border border-[#4A90E2]/30 bg-gradient-to-b from-[#132240] to-[#0D182E] p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-xl bg-[#4A90E2]/20 text-[#4A90E2]">
              <Calculator className="size-4" />
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white">
              {t.loanCalculatorTitle}
            </h2>
          </div>
          <span className="text-[11px] text-[#7B9BE8] font-bold">
            شام كاش للتمويل الميسر
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-3">
            <span className="text-[10px] text-white/50 block">{t.loanAmountLabel}</span>
            <span className="font-mono text-base sm:text-lg font-bold text-emerald-400 mt-1 block">
              {loanAmount.toLocaleString()} {t.currencySyp}
            </span>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-3">
            <span className="text-[10px] text-white/50 block">{t.loanDurationLabel}</span>
            <span className="font-mono text-base sm:text-lg font-bold text-white mt-1 block">
              {loanDurationMonths} {t.monthsSuffix}
            </span>
          </div>

          <div className="rounded-2xl border border-[#4A90E2]/40 bg-[#4A90E2]/15 p-3">
            <span className="text-[10px] text-[#7B9BE8] font-bold block">{t.estimatedInstallmentLabel}</span>
            <span className="font-mono text-base sm:text-lg font-bold text-white mt-1 block">
              {estimatedMonthlyInstallment.toLocaleString()} {t.currencySyp}
            </span>
          </div>
        </div>
      </div>

      {/* Loan Application Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {formError && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/15 p-3.5 text-xs text-rose-200">
            {formError}
          </div>
        )}

        {/* 1. Loan Amount Selection */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-white">
              {t.loanAmountLabel} (قيمة القرض) *
            </label>
            <span className="font-mono text-sm font-bold text-emerald-400">
              {loanAmount.toLocaleString()} {t.currencySyp}
            </span>
          </div>

          {/* Quick preset buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-3">
            {PRESET_AMOUNTS.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setLoanAmount(amt)}
                className={`rounded-xl border py-1.5 text-xs font-mono font-bold transition cursor-pointer ${
                  loanAmount === amt
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                    : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                {(amt / 1000000).toFixed(0)} مليون
              </button>
            ))}
          </div>

          {/* Slider */}
          <input
            type="range"
            min={2000000}
            max={75000000}
            step={1000000}
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="w-full accent-emerald-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-white/40 mt-1 font-mono">
            <span>2,000,000 ل.س</span>
            <span>75,000,000 ل.س</span>
          </div>
        </div>

        {/* 2. Loan Duration Selection */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <label className="block text-xs font-bold text-white mb-2">
            {t.loanDurationLabel} (مدة القرض) *
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {PRESET_DURATIONS.map((dur) => (
              <button
                key={dur}
                type="button"
                onClick={() => setLoanDurationMonths(dur)}
                className={`rounded-xl border py-2 text-xs font-bold transition cursor-pointer ${
                  loanDurationMonths === dur
                    ? 'border-[#4A90E2] bg-[#4A90E2]/25 text-[#7B9BE8]'
                    : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                {dur} {t.monthsSuffix}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Reason for Loan (سبب القرض) */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <label className="block text-xs font-bold text-white mb-2">
            {t.loanReasonLabel} (سبب القرض والغاية من التمويل) *
          </label>
          <textarea
            required
            rows={3}
            value={loanReason}
            onChange={(e) => setLoanReason(e.target.value)}
            placeholder={isRTL ? 'وضح بالتفصيل سبب طلب القرض (مثل: شراء بضاعة، تأسيس مشروع، دفع تكاليف، صيانة عقار)...' : 'State the detailed purpose of the loan (e.g. business expansion, equipment purchase, emergency funds)...'}
            className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-xs sm:text-sm text-white placeholder-white/30 focus:border-[#4A90E2] focus:outline-none leading-6"
          />
        </div>

        {/* 4. Applicant Personal & Financial Info */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-4">
          <h3 className="text-xs font-bold text-white border-b border-white/10 pb-2">
            بيانات صاحب الطلب المالية والضمانات
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1.5">
                {t.applicantFullName} *
              </label>
              <div className="relative">
                <User className={`pointer-events-none absolute top-1/2 ${isRTL ? 'right-3' : 'left-3'} size-4 -translate-y-1/2 text-white/40`} />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="الاسم الثلاثي"
                  className={`w-full rounded-xl border border-white/10 bg-white/5 py-2.5 ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} text-xs sm:text-sm text-white focus:border-[#4A90E2] focus:outline-none`}
                />
              </div>
            </div>

            {/* Mobile Phone */}
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1.5">
                {t.phoneLabel} *
              </label>
              <div className="relative">
                <Phone className={`pointer-events-none absolute top-1/2 ${isRTL ? 'right-3' : 'left-3'} size-4 -translate-y-1/2 text-white/40`} />
                <input
                  type="tel"
                  dir="ltr"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+963 944 000 000"
                  className={`w-full rounded-xl border border-white/10 bg-white/5 py-2.5 ${isRTL ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3 text-left'} text-xs sm:text-sm text-white focus:border-[#4A90E2] focus:outline-none font-mono`}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1.5">
                {t.emailLabel}
              </label>
              <input
                type="email"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-[#4A90E2] font-mono"
              />
            </div>

            {/* Governorate */}
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1.5">
                {t.applicantGovernorate} *
              </label>
              <select
                value={governorate}
                onChange={(e) => setGovernorate(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0F172A] px-3 py-2 text-xs text-white focus:border-[#4A90E2] cursor-pointer"
              >
                {Object.keys(t.governorates).map((gov) => (
                  <option key={gov} value={gov}>
                    {t.governorates[gov] || gov}
                  </option>
                ))}
              </select>
            </div>

            {/* Monthly Income */}
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1.5">
                {t.monthlyIncomeLabel}
              </label>
              <input
                type="text"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                placeholder="مثال: 2,500,000 ل.س"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-[#4A90E2]"
              />
            </div>
          </div>

          {/* Guarantor Info */}
          <div>
            <label className="block text-xs font-bold text-white/80 mb-1.5">
              {t.guarantorLabel} (الضمانة أو الكفيل)
            </label>
            <input
              type="text"
              value={guarantorInfo}
              onChange={(e) => setGuarantorInfo(e.target.value)}
              placeholder="مثال: موظف حكومي معتمد / سجل تجاري / رهن عقار أو سيارة"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-[#4A90E2]"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            id="btn-submit-loan-application"
            className="w-full inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-[0.98] transition cursor-pointer"
          >
            <Send className="size-4" />
            <span>{t.btnSubmitLoan}</span>
          </button>
        </div>
      </form>

      {/* Back button */}
      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs sm:text-sm font-bold text-white/80 hover:bg-white/10 hover:text-white transition cursor-pointer"
        >
          {isRTL ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          <span>{t.btnReturnHome}</span>
        </button>
      </div>
    </div>
  );
};

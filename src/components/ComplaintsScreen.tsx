import React, { useState } from 'react';
import {
  MessageSquareWarning,
  CheckCircle2,
  Send,
  AlertTriangle,
  User,
  Phone,
  Mail,
  FileText,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  HelpCircle,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { ComplaintRecord } from '../types';
import { saveComplaint, logUserActivity, isStarloveBlocked } from '../utils/accountStorage';
import { useLanguage } from '../context/LanguageContext';

interface ComplaintsScreenProps {
  onBackToHome: () => void;
  defaultEmail?: string;
  defaultFullName?: string;
  defaultPhone?: string;
}

export const ComplaintsScreen: React.FC<ComplaintsScreenProps> = ({
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
  const [category, setCategory] = useState('مشكلة في توثيق الحساب والوثائق الرسمية');
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!message.trim() || !fullName.trim() || !phone.trim()) {
      setFormError(isRTL ? 'يرجى إكمال الحقول الإلزامية وتدوين نص الشكوى أو الملاحظة في المربع الكبير' : 'Please fill in all required fields and message content');
      return;
    }

    const generatedId = 'CMP-' + Math.floor(10000 + Math.random() * 90000);
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const record: ComplaintRecord = {
      id: generatedId,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: (email.trim() || 'user@shamcash.sy').toLowerCase(),
      category,
      message: message.trim(),
      priority,
      status: 'pending',
      submittedAt: formattedDate,
    };

    saveComplaint(record);
    logUserActivity(
      'تسجيل شكوى أو ملاحظة رسمية',
      `تم إيداع شكوى برقم مرجعي (${generatedId}) وتصنيف (${category}) من المواطن (${fullName.trim()})`,
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
            {t.complaintSuccessTitle}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-white/60 leading-6">
            {t.complaintSuccessDesc}
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
            <span className="text-[11px] text-white/50 block">الرقم المرجعي للشكوى في سجلات الإدارة</span>
            <span className="font-mono text-lg font-bold text-amber-300 mt-1 block" dir="ltr">
              {submittedId}
            </span>
            <div className="mt-2 text-xs text-white/70">
              التصنيف: <strong className="text-white">{category}</strong>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setMessage('');
                setIsSubmitted(false);
              }}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 hover:bg-white/10"
            >
              {isRTL ? 'إرسال ملاحظة أخرى' : 'Send Another Feedback'}
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
        <span className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-1 text-[11px] font-bold text-rose-300">
          <MessageSquareWarning className="size-3.5" />
          {t.complaintsTitle}
        </span>
        <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
          {t.complaintsTitle}
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-white/60">
          {t.complaintsSubtitle}
        </p>
      </div>

      {/* Info Notice */}
      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#4A90E2]/20 bg-[#162544]/60 p-4 text-xs text-white/80">
        <ShieldCheck className="size-5 shrink-0 text-[#4A90E2] mt-0.5" />
        <p className="leading-5">
          {isRTL
            ? 'تُرسل جميع الشكاوى والملاحظات مباشرة إلى لوحة الإدارة المركزية وتتم مراجعتها بأعلى سرية وسرعة، مع متابعة الرد عبر رقم هاتفك أو بريدك الإلكتروني.'
            : 'All complaints and suggestions are transmitted directly to the central administration panel and reviewed with high confidentiality.'}
        </p>
      </div>

      {/* Complaint Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {formError && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/15 p-3.5 text-xs text-rose-200">
            {formError}
          </div>
        )}

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
                placeholder="الاسم الكامل لمقدم الشكوى"
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-white/80 mb-1.5">
              {t.emailLabel}
            </label>
            <div className="relative">
              <Mail className={`pointer-events-none absolute top-1/2 ${isRTL ? 'right-3' : 'left-3'} size-4 -translate-y-1/2 text-white/40`} />
              <input
                type="email"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className={`w-full rounded-xl border border-white/10 bg-white/5 py-2.5 ${isRTL ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3 text-left'} text-xs sm:text-sm text-white focus:border-[#4A90E2] focus:outline-none font-mono`}
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-white/80 mb-1.5">
              {t.complaintCategoryLabel} *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0F172A] px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-[#4A90E2] cursor-pointer"
            >
              <option value="مشكلة في توثيق الحساب والوثائق الرسمية">مشكلة في توثيق الحساب والوثائق الرسمية</option>
              <option value="استفسار أو مسألة في المعاملات المالية">استفسار أو مسألة في المعاملات المالية</option>
              <option value="ملاحظة ومقترح لتطوير خدمات المنصة">ملاحظة ومقترح لتطوير خدمات المنصة</option>
              <option value="استفسار أو مساعدة تقنية وفنية عامة">استفسار أو مساعدة تقنية وفنية عامة</option>
              <option value="موضوع عام آخر">موضوع عام آخر</option>
            </select>
          </div>
        </div>

        {/* Priority Selector */}
        <div>
          <label className="block text-xs font-bold text-white/80 mb-1.5">
            {t.priorityLabel}
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPriority('normal')}
              className={`flex-1 rounded-xl border py-2 text-xs font-bold transition cursor-pointer ${
                priority === 'normal'
                  ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                  : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {t.priorityNormal}
            </button>
            <button
              type="button"
              onClick={() => setPriority('urgent')}
              className={`flex-1 rounded-xl border py-2 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                priority === 'urgent'
                  ? 'border-rose-500 bg-rose-500/20 text-rose-300'
                  : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              <AlertTriangle className="size-3.5" />
              <span>{t.priorityUrgent}</span>
            </button>
          </div>
        </div>

        {/* Big Text Area Box (نص مربع كبير للشكاوى والملاحظات) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-white/90">
              {t.complaintMessageLabel} *
            </label>
            <span className="text-[11px] font-mono text-white/50 bg-white/5 px-2 py-0.5 rounded-md">
              {message.length} حرف
            </span>
          </div>
          <div className="relative">
            <textarea
              required
              rows={8}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t.complaintPlaceholder}
              className="w-full min-h-[190px] rounded-2xl border border-white/20 bg-white/[0.07] p-4 text-xs sm:text-sm text-white placeholder-white/35 focus:border-[#4A90E2] focus:bg-white/[0.1] focus:outline-none focus:ring-2 focus:ring-[#4A90E2]/40 leading-7 resize-y shadow-inner font-sans"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            id="btn-submit-complaint"
            className="w-full inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 px-6 text-sm font-bold text-white shadow-lg shadow-rose-500/25 hover:brightness-110 active:scale-[0.98] transition cursor-pointer"
          >
            <Send className="size-4" />
            <span>{t.btnSubmitComplaint}</span>
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

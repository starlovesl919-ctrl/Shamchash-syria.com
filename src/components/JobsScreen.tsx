import React, { useState } from 'react';
import {
  Briefcase,
  CheckCircle2,
  Send,
  Building,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  Award,
  User,
  Phone,
  Mail,
  FileText
} from 'lucide-react';
import { JobApplication, JobVacancy } from '../types';
import { AVAILABLE_JOB_VACANCIES, saveJobApplication, logUserActivity, isStarloveBlocked } from '../utils/accountStorage';
import { useLanguage } from '../context/LanguageContext';

interface JobsScreenProps {
  onBackToHome: () => void;
  defaultEmail?: string;
  defaultFullName?: string;
  defaultPhone?: string;
}

export const JobsScreen: React.FC<JobsScreenProps> = ({
  onBackToHome,
  defaultEmail = '',
  defaultFullName = '',
  defaultPhone = '',
}) => {
  const { t, isRTL } = useLanguage();

  const [selectedVacancy, setSelectedVacancy] = useState<JobVacancy | null>(AVAILABLE_JOB_VACANCIES[0]);
  const [jobTitle, setJobTitle] = useState(AVAILABLE_JOB_VACANCIES[0].title);
  const [jobType, setJobType] = useState('دوام كامل (Full-time)');
  const rawFullName = defaultFullName || localStorage.getItem('sc_contact_name') || '';
  const [fullName, setFullName] = useState(isStarloveBlocked(rawFullName) ? '' : rawFullName);
  const [phone, setPhone] = useState(defaultPhone || localStorage.getItem('sc_contact_phone') || '+963 ');
  const rawEmail = defaultEmail || localStorage.getItem('sc_waiting_email') || '';
  const [email, setEmail] = useState(isStarloveBlocked(rawEmail) ? '' : rawEmail);
  const [governorate, setGovernorate] = useState(localStorage.getItem('sc_contact_governorate') || 'دمشق');
  const [experienceYears, setExperienceYears] = useState('سنتان إلى 4 سنوات');
  const [experienceDetails, setExperienceDetails] = useState('');
  const [education, setEducation] = useState('إجازة جامعية (بكالوريوس)');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedAppId, setSubmittedAppId] = useState('');

  const handleSelectVacancy = (v: JobVacancy) => {
    setSelectedVacancy(v);
    setJobTitle(v.title);
    setJobType(v.type);
    setFormError(null);
    // Smooth scroll down to application form
    const formEl = document.getElementById('job-application-form');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      setFormError(isRTL ? 'يرجى إكمال جميع الحقول الإلزامية المطلوبة (الاسم الكامل، رقم الهاتف، البريد الإلكتروني)' : 'Please complete all required fields');
      return;
    }

    const generatedId = 'JOB-APP-' + Math.floor(1000 + Math.random() * 9000);
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newApp: JobApplication = {
      id: generatedId,
      jobTitle,
      jobType,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      governorate,
      experienceYears,
      experienceDetails: experienceDetails.trim() || 'خبرات عملية في المجال المالي والمصرفي والتقني',
      education,
      notes: notes.trim(),
      status: 'under_review',
      submittedAt: formattedDate,
    };

    saveJobApplication(newApp);
    logUserActivity(
      'تقديم طلب توظيف رسمي',
      `تم استلام طلب توظيف للمتقدم (${fullName.trim()}) على وظيفة (${jobTitle}) برقم مرجعي (${generatedId})`,
      email.trim(),
      fullName.trim()
    );
    setSubmittedAppId(generatedId);
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
            {t.jobSuccessTitle}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-white/60 leading-6">
            {t.jobSuccessDesc}
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
            <span className="text-[11px] text-white/50 block">رقم طلب التوظيف المرجعي للإدارة</span>
            <span className="font-mono text-lg font-bold text-amber-300 mt-1 block" dir="ltr">
              {submittedAppId}
            </span>
            <div className="mt-2 text-xs text-white/70">
              الوظيفة المقدم عليها: <strong className="text-white">{jobTitle}</strong>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <button
              type="button"
              onClick={() => setIsSubmitted(false)}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 hover:bg-white/10"
            >
              {isRTL ? 'تقديم طلب آخر' : 'Submit Another Application'}
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
        <span className="inline-flex items-center gap-2 rounded-full border border-[#4A90E2]/30 bg-[#4A90E2]/10 px-3.5 py-1 text-[11px] font-bold text-[#7B9BE8]">
          <Briefcase className="size-3.5" />
          {t.jobsTitle}
        </span>
        <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
          {t.jobsTitle}
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-white/60">
          {t.jobsSubtitle}
        </p>
      </div>

      {/* Available Vacancies Section */}
      <div className="mt-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Building className="size-4 text-[#4A90E2]" />
          <span>{t.openVacanciesTitle}</span>
        </h2>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {AVAILABLE_JOB_VACANCIES.map((vac) => {
            const isSelected = selectedVacancy?.id === vac.id;
            return (
              <div
                key={vac.id}
                onClick={() => handleSelectVacancy(vac)}
                className={`relative rounded-2xl border p-4 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-amber-400 bg-[#162544] shadow-lg shadow-amber-500/10'
                    : 'border-white/10 bg-[#0F172A]/70 hover:border-[#4A90E2]/40 hover:bg-[#111C2E]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-white">{vac.title}</h3>
                  <span className="shrink-0 rounded-md bg-[#4A90E2]/20 px-2 py-0.5 text-[10px] font-bold text-[#7B9BE8]">
                    {vac.type}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/60">
                  <span className="flex items-center gap-1">
                    <Building className="size-3 text-white/40" />
                    <span>{vac.department}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3 text-white/40" />
                    <span>{vac.location}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="size-3 text-amber-400" />
                    <span>{vac.experienceRequired}</span>
                  </span>
                </div>

                <p className="mt-2.5 text-xs text-white/70 line-clamp-2 leading-5">
                  {vac.description}
                </p>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-[11px] font-mono text-white/40">{vac.id}</span>
                  <span className={`text-xs font-bold ${isSelected ? 'text-amber-300' : 'text-[#7B9BE8]'}`}>
                    {isSelected ? (isRTL ? '✓ تم اختيار الشاغر' : '✓ Selected') : (isRTL ? 'تقديم طلب لهذا الشاغر ←' : 'Apply for this ←')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Application Form */}
      <div id="job-application-form" className="mt-8 rounded-3xl border border-white/10 bg-[#0F172A]/90 p-5 sm:p-7 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-xl bg-[#4A90E2]/20 text-[#4A90E2]">
              <Sparkles className="size-4" />
            </span>
            <h3 className="text-base font-bold text-white sm:text-lg">
              {t.jobApplyTitle}
            </h3>
          </div>
          <span className="text-xs text-white/50">
            {isRTL ? 'يُحفظ الطلب مباشرة في سجلات الإدارة' : 'Saved directly in admin records'}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {formError && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/15 p-3 text-xs text-rose-200">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Job Title / Vacancy */}
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1.5">
                {t.jobTypeLabel} *
              </label>
              <input
                type="text"
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="اسم ومسمى الوظيفة"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-[#4A90E2] focus:outline-none"
              />
            </div>

            {/* Job Type (Full time / Part time / Remote) */}
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1.5">
                نوع عقد العمل والدوام *
              </label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0F172A] px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-[#4A90E2] cursor-pointer"
              >
                <option value="دوام كامل (Full-time)">دوام كامل (Full-time)</option>
                <option value="دوام جزئي (Part-time)">دوام جزئي (Part-time)</option>
                <option value="عن بعد / هجين (Remote)">عن بعد / هجين (Remote)</option>
                <option value="تدريب وخبرة (Internship)">تدريب وتأهيل (Internship)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1.5">
                {t.applicantFullName} (الاسم كامل) *
              </label>
              <div className="relative">
                <User className={`pointer-events-none absolute top-1/2 ${isRTL ? 'right-3' : 'left-3'} size-4 -translate-y-1/2 text-white/40`} />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="الاسم الثلاثي مع الكنية"
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
                {t.emailLabel} *
              </label>
              <div className="relative">
                <Mail className={`pointer-events-none absolute top-1/2 ${isRTL ? 'right-3' : 'left-3'} size-4 -translate-y-1/2 text-white/40`} />
                <input
                  type="email"
                  dir="ltr"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={`w-full rounded-xl border border-white/10 bg-white/5 py-2.5 ${isRTL ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3 text-left'} text-xs sm:text-sm text-white focus:border-[#4A90E2] focus:outline-none font-mono`}
                />
              </div>
            </div>

            {/* Governorate */}
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1.5">
                {t.applicantGovernorate} *
              </label>
              <select
                value={governorate}
                onChange={(e) => setGovernorate(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0F172A] px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-[#4A90E2] cursor-pointer"
              >
                {Object.keys(t.governorates).map((gov) => (
                  <option key={gov} value={gov}>
                    {t.governorates[gov] || gov}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Experience Years */}
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1.5">
                {t.experienceYearsLabel} *
              </label>
              <select
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0F172A] px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-[#4A90E2] cursor-pointer"
              >
                <option value="حديث التخرج / أقل من سنة">حديث التخرج / أقل من سنة</option>
                <option value="سنة إلى سنتين">سنة إلى سنتين</option>
                <option value="سنتان إلى 4 سنوات">سنتان إلى 4 سنوات</option>
                <option value="5 إلى 8 سنوات">5 إلى 8 سنوات</option>
                <option value="أكثر من 8 سنوات">أكثر من 8 سنوات (خبير)</option>
              </select>
            </div>

            {/* Education */}
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1.5">
                {t.educationLabel} *
              </label>
              <div className="relative">
                <GraduationCap className={`pointer-events-none absolute top-1/2 ${isRTL ? 'right-3' : 'left-3'} size-4 -translate-y-1/2 text-white/40`} />
                <input
                  type="text"
                  required
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  placeholder="مثال: إجازة في الاقتصاد / معلوماتية / دبلوم"
                  className={`w-full rounded-xl border border-white/10 bg-white/5 py-2.5 ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} text-xs sm:text-sm text-white focus:border-[#4A90E2] focus:outline-none`}
                />
              </div>
            </div>
          </div>

          {/* Experience Details */}
          <div>
            <label className="block text-xs font-bold text-white/80 mb-1.5">
              {t.experienceDetailsLabel} (الخبرات السابقة والمهارات) *
            </label>
            <textarea
              required
              rows={3}
              value={experienceDetails}
              onChange={(e) => setExperienceDetails(e.target.value)}
              placeholder={isRTL ? 'اذكر أهم الشركات أو الجهات التي عملت بها، والمسؤوليات والمهارات التي تتقنها...' : 'List relevant work experience, companies, responsibilities, and key skills...'}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs sm:text-sm text-white placeholder-white/30 focus:border-[#4A90E2] focus:outline-none"
            />
          </div>

          {/* Notes / Message */}
          <div>
            <label className="block text-xs font-bold text-white/80 mb-1.5">
              رسالة إضافية أو ملاحظات إلى لجنة التوظيف
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isRTL ? 'أي معلومات إضافية تود إضافتها (تاريخ التفرغ، الدورات التدريبية)...' : 'Any additional notes, availability, or certifications...'}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs sm:text-sm text-white placeholder-white/30 focus:border-[#4A90E2] focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              id="btn-submit-job-application"
              className="w-full inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4A90E2] to-[#357ABD] px-6 text-sm font-bold text-white shadow-lg shadow-[#4A90E2]/25 hover:brightness-110 active:scale-[0.98] transition cursor-pointer"
            >
              <Send className="size-4" />
              <span>{t.btnSubmitJobApp}</span>
            </button>
          </div>
        </form>
      </div>

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

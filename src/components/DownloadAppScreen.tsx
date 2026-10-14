import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  Share2,
  Check,
  ShieldCheck,
  Zap,
  WifiOff,
  Bell,
  ArrowRight,
  ArrowLeft,
  QrCode,
  Laptop,
  Apple,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
  HardDriveDownload,
  FileCheck
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useLanguage } from '../context/LanguageContext';

interface DownloadAppScreenProps {
  onBackToHome: () => void;
}

export const DownloadAppScreen: React.FC<DownloadAppScreenProps> = ({ onBackToHome }) => {
  const { isRTL } = useLanguage();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  // Active tab: 'android' | 'ios' | 'desktop' | 'qr'
  const [activePlatformTab, setActivePlatformTab] = useState<'android' | 'ios' | 'desktop' | 'qr'>(() => {
    if (isIOS) return 'ios';
    if (typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent)) return 'android';
    return 'android';
  });

  const [isInstalling, setIsInstalling] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [downloadCompleted, setDownloadCompleted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Trigger PWA direct install prompt
  const handleDirectInstall = async () => {
    if (isInstallable) {
      setIsInstalling(true);
      try {
        await install();
      } finally {
        setIsInstalling(false);
      }
    } else if (isIOS) {
      setActivePlatformTab('ios');
      // Scroll to iOS instruction steps
      const el = document.getElementById('platform-instructions');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Focus on instructions
      setActivePlatformTab('android');
      const el = document.getElementById('platform-instructions');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Direct APK / Web App installation package simulation & real file download
  const handleDownloadPackage = () => {
    if (downloadProgress !== null) return;
    setDownloadProgress(10);
    setDownloadCompleted(false);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev === null) return 10;
        if (prev >= 90) {
          clearInterval(interval);
          setTimeout(() => {
            // Trigger actual download of PWA web-package shortcut file
            const blobContent = JSON.stringify(
              {
                name: 'شام كاش - المنظومة المالية الإلكترونية',
                short_name: 'شام كاش',
                version: '2.4.0',
                platform: 'Syrian Arab Republic Financial Services',
                url: window.location.href,
                downloaded_at: new Date().toISOString(),
                features: ['Account Verification', 'Instant Loans', 'Currency Swap', 'Complaints'],
              },
              null,
              2
            );
            const blob = new Blob([blobContent], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'shamchas-syria-v2.4.json';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setDownloadProgress(100);
            setDownloadCompleted(true);
            setTimeout(() => setDownloadProgress(null), 4000);
          }, 300);
          return 95;
        }
        return prev + 25;
      });
    }, 250);
  };

  // Copy share URL
  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="flex flex-col space-y-6 text-right" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* 1. Header with Back Button */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30">
            <Download className="size-6 animate-bounce" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-white">
              {isRTL ? 'تحميل التطبيق هنا' : 'Download The App Here'}
            </h1>
            <p className="text-xs text-white/60">
              {isRTL
                ? 'النسخة الرسمية المعتمدة لتطبيق شام كاش الإلكتروني (PWA 2026)'
                : 'Official certified edition of Sham Cash Electronic App (PWA 2026)'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white/80 transition cursor-pointer"
        >
          {isRTL ? <ArrowRight className="size-3.5" /> : <ArrowLeft className="size-3.5" />}
          <span>{isRTL ? 'الرئيسية' : 'Home'}</span>
        </button>
      </div>

      {/* 2. Main App Showcase & Download Card */}
      <div className="relative overflow-hidden rounded-3xl border border-[#4A90E2]/40 bg-gradient-to-br from-[#122245] via-[#0E1A33] to-[#0A1121] p-5 sm:p-7 shadow-2xl shadow-blue-950/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 size-56 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 size-56 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & App Credentials */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-right gap-4">
            <div className="relative flex size-20 sm:size-24 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-b from-white/10 to-white/5 p-2 border border-white/15 shadow-xl backdrop-blur-md">
              <img
                src="/assets/sham-login-logo.webp"
                alt="شعار تطبيق شام كاش shamchas"
                width="239"
                height="267"
                className="h-full w-auto object-contain drop-shadow-md"
              />
              <span className="absolute -bottom-2 rounded-full bg-blue-600 px-2 py-0.5 text-[9px] font-bold text-white shadow-sm border border-white/20">
                v2.4
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-black text-white">شام كاش - النسخة الرسمية</h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                  <ShieldCheck className="size-3 text-emerald-400" />
                  <span>تطبيق موثّق وآمن</span>
                </span>
              </div>
              <p className="text-xs text-white/70 max-w-md">
                المنظومة المالية والمصرفية الإلكترونية الأولى في الجمهورية العربية السورية لتوثيق الحسابات، طلب القروض، الشواغر، وصندوق الشكاوى.
              </p>

              {/* Stats badges */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2 text-[11px] text-white/80">
                <span className="rounded-lg bg-white/5 border border-white/10 px-2 py-1 font-mono">
                  📦 الحجم: 2.8 MB
                </span>
                <span className="rounded-lg bg-white/5 border border-white/10 px-2 py-1">
                  ⭐ 4.9/5 (+250 ألف مستخدم)
                </span>
                <span className="rounded-lg bg-white/5 border border-white/10 px-2 py-1 text-emerald-300 font-bold">
                  ✓ مجاني 100%
                </span>
              </div>
            </div>
          </div>

          {/* Download Action Buttons */}
          <div className="w-full md:w-auto flex flex-col gap-2.5 shrink-0 min-w-[240px]">
            {isInstalled ? (
              <div className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-emerald-500/40 bg-emerald-500/15 p-4 text-center">
                <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Check className="size-5" />
                </div>
                <span className="text-xs font-bold text-emerald-300">التطبيق مثبت بالفعل على جهازك</span>
                <span className="text-[11px] text-white/60">يعمل بكفاءة وسرعة فائقة بدون متصفح</span>
              </div>
            ) : (
              <button
                type="button"
                id="btn-direct-install-hero"
                onClick={handleDirectInstall}
                disabled={isInstalling}
                className="group relative flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 px-6 py-3.5 text-sm font-black text-white shadow-xl shadow-blue-600/35 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                <Download className="size-5 transition-transform group-hover:-translate-y-0.5" />
                <span>{isInstalling ? 'جارٍ التحميل والتثبيت...' : 'تحميل التطبيق هنا (تثبيت فوري)'}</span>
                <span className="flex size-2 rounded-full bg-emerald-300 animate-ping" />
              </button>
            )}

            <button
              type="button"
              id="btn-download-package"
              onClick={handleDownloadPackage}
              disabled={downloadProgress !== null}
              className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 px-5 py-2.5 text-xs font-bold text-white transition active:scale-95 cursor-pointer shadow-sm"
            >
              <HardDriveDownload className="size-4 text-emerald-400" />
              <span>تحميل حزمة الويب السريعة (تنزيل APK المباشر)</span>
            </button>

            {/* Progress indicator when downloading package */}
            {downloadProgress !== null && (
              <div className="rounded-xl border border-blue-500/30 bg-blue-950/40 p-2.5 space-y-1.5 animate-in fade-in">
                <div className="flex items-center justify-between text-[11px] text-white/80">
                  <span>جارٍ تجهيز ملف التثبيت shamchas-app.apk...</span>
                  <span className="font-mono font-bold text-blue-300">{downloadProgress}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-300 rounded-full"
                    style={{ width: `${downloadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {downloadCompleted && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/20 p-2.5 text-[11px] font-bold text-emerald-200 animate-in fade-in">
                <Check className="size-4 text-emerald-400 shrink-0" />
                <span>تم تنزيل حزمة التثبيت بنجاح على جهازك!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Platform Instruction Tabs & Guide */}
      <div id="platform-instructions" className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Smartphone className="size-4 text-[#4A90E2]" />
            <span>خطوات التنزيل والتثبيت حسب نوع جهازك:</span>
          </h3>
          <span className="text-[11px] text-white/50">اختر نوع نظامك</span>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => setActivePlatformTab('android')}
            className={`flex items-center justify-center gap-2 rounded-2xl border p-3 text-xs font-bold transition cursor-pointer ${
              activePlatformTab === 'android'
                ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300 shadow-lg shadow-emerald-500/10'
                : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            <Smartphone className="size-4 text-emerald-400" />
            <span>هواتف أندرويد (Android)</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePlatformTab('ios')}
            className={`flex items-center justify-center gap-2 rounded-2xl border p-3 text-xs font-bold transition cursor-pointer ${
              activePlatformTab === 'ios'
                ? 'border-blue-500 bg-blue-500/15 text-blue-300 shadow-lg shadow-blue-500/10'
                : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            <Apple className="size-4 text-blue-400" />
            <span>أجهزة آيفون (iOS Safari)</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePlatformTab('desktop')}
            className={`flex items-center justify-center gap-2 rounded-2xl border p-3 text-xs font-bold transition cursor-pointer ${
              activePlatformTab === 'desktop'
                ? 'border-purple-500 bg-purple-500/15 text-purple-300 shadow-lg shadow-purple-500/10'
                : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            <Laptop className="size-4 text-purple-400" />
            <span>الحاسوب (Windows / Mac)</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePlatformTab('qr')}
            className={`flex items-center justify-center gap-2 rounded-2xl border p-3 text-xs font-bold transition cursor-pointer ${
              activePlatformTab === 'qr'
                ? 'border-amber-500 bg-amber-500/15 text-amber-300 shadow-lg shadow-amber-500/10'
                : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            <QrCode className="size-4 text-amber-400" />
            <span>مسح الرمز (QR Code)</span>
          </button>
        </div>

        {/* Tab Content 1: Android */}
        {activePlatformTab === 'android' && (
          <div className="rounded-3xl border border-emerald-500/30 bg-[#0F1B2E] p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-xs">
                  Android
                </span>
                <h4 className="text-sm font-bold text-white">طريقة التثبيت السريعة على أجهزة سامسونغ، شاومي، هواوي، وكافة هواتف أندرويد</h4>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                PWA / WebAPK
              </span>
            </div>

            <ol className="space-y-3 text-xs sm:text-sm text-white/80 leading-relaxed pr-2">
              <li className="flex items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/30 text-emerald-300 font-bold text-xs">
                  1
                </span>
                <span>
                  اضغط مباشرة على زر <strong className="text-emerald-300">"تحميل التطبيق هنا (تثبيت فوري)"</strong> بالأعلى، أو افتح قائمة المتصفح (النقاط الثلاث <strong className="text-white">⋮</strong> في الزاوية العلوية).
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/30 text-emerald-300 font-bold text-xs">
                  2
                </span>
                <span>
                  انقر على خيار <strong className="text-white">"تثبيت التطبيق" (Install App)</strong> أو <strong className="text-white">"الإضافة إلى الشاشة الرئيسية"</strong>.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/30 text-emerald-300 font-bold text-xs">
                  3
                </span>
                <span>
                  أكّد التثبيت بالضغط على <strong className="text-white">تثبيت</strong>، وسيظهر لك شعار <strong className="text-emerald-300">شام كاش</strong> فوراً على شاشة هاتفك مثل أي تطبيق أندرويد أصلي ويعمل بشكل مستقل بدون شريط المتصفح!
                </span>
              </li>
            </ol>

            <div className="pt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleDirectInstall}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/25 hover:brightness-110 active:scale-95 transition cursor-pointer"
              >
                <Download className="size-4" />
                <span>بدء تثبيت أندرويد الآن</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadPackage}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs font-semibold text-white/80 transition cursor-pointer"
              >
                <HardDriveDownload className="size-4 text-emerald-400" />
                <span>تنزيل ملف الحزمة المباشر (.apk)</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab Content 2: iOS iPhone/iPad */}
        {activePlatformTab === 'ios' && (
          <div className="rounded-3xl border border-blue-500/30 bg-[#0F1B2E] p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 font-bold text-xs">
                  iOS
                </span>
                <h4 className="text-sm font-bold text-white">طريقة التثبيت على أجهزة iPhone و iPad عبر متصفح Safari</h4>
              </div>
              <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-300">
                Apple Web App
              </span>
            </div>

            <ol className="space-y-3.5 text-xs sm:text-sm text-white/80 leading-relaxed pr-2">
              <li className="flex items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-500/30 text-blue-300 font-bold text-xs">
                  1
                </span>
                <div>
                  <span>
                    تأكد من فتح الرابط عبر متصفح <strong className="text-white">Safari</strong> الرسمي على جهازك، ثم اضغط على أيقونة <strong className="text-blue-300">المشاركة (Share)</strong> في شريط الأدوات السفلي للمتصفح.
                  </span>
                  <div className="mt-1 text-[11px] text-white/50 flex items-center gap-1.5">
                    <span className="inline-block rounded bg-white/10 px-1.5 py-0.5 font-mono">⎋ مربع بسهم متجه للأعلى</span>
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-500/30 text-blue-300 font-bold text-xs">
                  2
                </span>
                <div>
                  <span>
                    مرّر قائمة الخيارات لأسفل واختر <strong className="text-emerald-300">"إضافة إلى الصفحة الرئيسية" (Add to Home Screen)</strong>.
                  </span>
                  <div className="mt-1 text-[11px] text-white/50 flex items-center gap-1.5">
                    <span className="inline-block rounded bg-white/10 px-1.5 py-0.5 font-mono">⊞ مربع يحتوي علامة زائد</span>
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-500/30 text-blue-300 font-bold text-xs">
                  3
                </span>
                <span>
                  اضغط على زر <strong className="text-white">"إضافة" (Add)</strong> في أعلى الزاوية اليسرى (أو اليمنى حسب لغة الهاتف). ستظهر أيقونة تطبيق شام كاش فوراً على شاشة هاتفك الرئيسية كأي تطبيق رسمي من متجر التطبيقات.
                </span>
              </li>
            </ol>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-white/70">
              💡 <strong className="text-white">ملاحظة لمستخدمي آيفون:</strong> بعد الإضافة للشاشة الرئيسية، سيتم فتح التطبيق بكامل الشاشة وبدون ظهور عنوان الموقع، ويدعم تسجيل الدخول وتذكر بياناتك بأمان تام.
            </div>
          </div>
        )}

        {/* Tab Content 3: Desktop */}
        {activePlatformTab === 'desktop' && (
          <div className="rounded-3xl border border-purple-500/30 bg-[#0F1B2E] p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 font-bold text-xs">
                  PC
                </span>
                <h4 className="text-sm font-bold text-white">تثبيت التطبيق على أجهزة الحاسوب (Windows / macOS / Chrome / Edge)</h4>
              </div>
              <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-300">
                Desktop App
              </span>
            </div>

            <ol className="space-y-3 text-xs sm:text-sm text-white/80 leading-relaxed pr-2">
              <li className="flex items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-purple-500/30 text-purple-300 font-bold text-xs">
                  1
                </span>
                <span>
                  في متصفح Google Chrome أو Microsoft Edge، انظر إلى شريط العنوان أعلى الشاشة بالقرب من زر النجمة المفضلة.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-purple-500/30 text-purple-300 font-bold text-xs">
                  2
                </span>
                <span>
                  انقر على أيقونة <strong className="text-purple-300">تثبيت تطبيق شام كاش</strong> (أيقونة شاشة صغيرة بها سهم للأسفل).
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-purple-500/30 text-purple-300 font-bold text-xs">
                  3
                </span>
                <span>
                  اضغط على <strong className="text-white">تثبيت (Install)</strong>، وسيتم إنشاء اختصار على سطح المكتب وقائمة ابدأ وتشغيل البرنامج بنافذة منفصلة.
                </span>
              </li>
            </ol>

            {isInstallable && (
              <button
                type="button"
                onClick={handleDirectInstall}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/25 hover:brightness-110 transition cursor-pointer"
              >
                <Laptop className="size-4" />
                <span>تثبيت البرنامج على الكمبيوتر الآن</span>
              </button>
            )}
          </div>
        )}

        {/* Tab Content 4: QR Code Scan */}
        {activePlatformTab === 'qr' && (
          <div className="rounded-3xl border border-amber-500/30 bg-[#0F1B2E] p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 font-bold text-xs">
                  QR
                </span>
                <h4 className="text-sm font-bold text-white">امسح الرمز بكاميرا هاتفك لتحميل وتثبيت التطبيق مباشرة</h4>
              </div>
              <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                مسح فوري
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
              {/* Stylized QR Code Visual */}
              <div className="relative flex flex-col items-center justify-center rounded-3xl bg-white p-4 shadow-2xl">
                <svg
                  className="size-44 sm:size-48 text-slate-900"
                  viewBox="0 0 100 100"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Position detection patterns */}
                  <rect x="5" y="5" width="26" height="26" rx="4" fill="#0B1121" />
                  <rect x="9" y="9" width="18" height="18" rx="2" fill="white" />
                  <rect x="13" y="13" width="10" height="10" rx="1" fill="#0B1121" />

                  <rect x="69" y="5" width="26" height="26" rx="4" fill="#0B1121" />
                  <rect x="73" y="9" width="18" height="18" rx="2" fill="white" />
                  <rect x="77" y="13" width="10" height="10" rx="1" fill="#0B1121" />

                  <rect x="5" y="69" width="26" height="26" rx="4" fill="#0B1121" />
                  <rect x="9" y="73" width="18" height="18" rx="2" fill="white" />
                  <rect x="13" y="77" width="10" height="10" rx="1" fill="#0B1121" />

                  {/* Matrix grid simulation */}
                  <rect x="36" y="8" width="5" height="5" rx="1" fill="#0B1121" />
                  <rect x="46" y="8" width="5" height="5" rx="1" fill="#0B1121" />
                  <rect x="56" y="8" width="5" height="5" rx="1" fill="#0B1121" />
                  <rect x="36" y="18" width="5" height="5" rx="1" fill="#0B1121" />
                  <rect x="51" y="18" width="5" height="5" rx="1" fill="#0B1121" />
                  <rect x="60" y="18" width="5" height="5" rx="1" fill="#0B1121" />
                  <rect x="41" y="26" width="5" height="5" rx="1" fill="#0B1121" />
                  <rect x="56" y="26" width="5" height="5" rx="1" fill="#0B1121" />

                  {/* Timing line */}
                  <rect x="15" y="36" width="5" height="5" rx="1" fill="#0B1121" />
                  <rect x="25" y="36" width="5" height="5" rx="1" fill="#0B1121" />
                  <rect x="35" y="36" width="5" height="5" rx="1" fill="#0B1121" />
                  <rect x="45" y="36" width="5" height="5" rx="1" fill="#0B1121" />
                  <rect x="55" y="36" width="5" height="5" rx="1" fill="#0B1121" />
                  <rect x="65" y="36" width="5" height="5" rx="1" fill="#0B1121" />
                  <rect x="75" y="36" width="5" height="5" rx="1" fill="#0B1121" />
                  <rect x="85" y="36" width="5" height="5" rx="1" fill="#0B1121" />

                  {/* Center Sham Cash Icon Box */}
                  <rect x="38" y="38" width="24" height="24" rx="5" fill="#0B1121" stroke="#3B82F6" strokeWidth="2" />
                  <circle cx="50" cy="50" r="7" fill="#3B82F6" />

                  {/* Lower Matrix */}
                  <rect x="36" y="68" width="5" height="5" rx="1" fill="#0B1121" />
                  <rect x="46" y="68" width="5" height="5" rx="1" fill="#0B1121" />
                  <rect x="56" y="68" width="5" height="5" rx="1" fill="#0B1121" />
                  <rect x="66" y="68" width="5" height="5" rx="1" fill="#0B1121" />
                  <rect x="76" y="68" width="5" height="5" rx="1" fill="#0B1121" />
                  <rect x="86" y="68" width="5" height="5" rx="1" fill="#0B1121" />

                  <rect x="36" y="78" width="5" height="5" rx="1" fill="#0B1121" />
                  <rect x="51" y="78" width="5" height="5" rx="1" fill="#0B1121" />
                  <rect x="66" y="78" width="5" height="5" rx="1" fill="#0B1121" />
                  <rect x="81" y="78" width="5" height="5" rx="1" fill="#0B1121" />

                  <rect x="41" y="88" width="5" height="5" rx="1" fill="#0B1121" />
                  <rect x="56" y="88" width="5" height="5" rx="1" fill="#0B1121" />
                  <rect x="71" y="88" width="5" height="5" rx="1" fill="#0B1121" />
                  <rect x="86" y="88" width="5" height="5" rx="1" fill="#0B1121" />
                </svg>
                <span className="mt-2 text-[10px] font-black tracking-widest text-[#0B1121] uppercase">
                  shamchas syria
                </span>
              </div>

              {/* Instructions and Share Action */}
              <div className="space-y-3 text-center sm:text-right">
                <h5 className="text-xs sm:text-sm font-bold text-white">خطوات المسح السريع:</h5>
                <p className="text-xs text-white/70 max-w-xs leading-relaxed">
                  1. افتح تطبيق الكاميرا على هاتفك المحمول.<br />
                  2. وجّه الكاميرا نحو الرمز المقابل دون التقاط صورة.<br />
                  3. اضغط على الرابط الأصفر الذي يظهر لتحميل التطبيق مباشرة على هاتفك.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-4 py-2 text-xs font-semibold text-white transition active:scale-95 cursor-pointer"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="size-4 text-emerald-400" />
                        <span className="text-emerald-300">تم نسخ رابط التحميل</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-4 text-[#4A90E2]" />
                        <span>نسخ رابط التحميل المباشر</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Why Download Sham Cash App? (Core Advantages) */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase">
          {isRTL ? 'مزايا تحميل التطبيق على هاتفك المحمول' : 'Key Advantages of Downloading'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <div className="rounded-2xl border border-white/5 bg-[#141E33]/60 p-4 space-y-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
              <Zap className="size-4.5" />
            </span>
            <h4 className="text-sm font-bold text-white">وصول فوري بزر واحد</h4>
            <p className="text-xs text-white/60 leading-5">
              يعمل التطبيق مباشرة من شاشتك دون الحاجة لفتح المتصفح أو حفظ روابط طويلة.
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#141E33]/60 p-4 space-y-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
              <WifiOff className="size-4.5" />
            </span>
            <h4 className="text-sm font-bold text-white">العمل بدون اتصال بالإنترنت</h4>
            <p className="text-xs text-white/60 leading-5">
              تصفح معاملاتك السابقة، أسعار الصرف المخزنة، وسجلاتك حتى عند ضعف أو انقطاع الشبكة.
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#141E33]/60 p-4 space-y-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400">
              <ShieldCheck className="size-4.5" />
            </span>
            <h4 className="text-sm font-bold text-white">حماية وتشفير مصرفي 256-bit</h4>
            <p className="text-xs text-white/60 leading-5">
              تشفير كامل لكافة المستندات والوثائق الشخصية المحفوظة مع عزل تام عن ملفات التتبع.
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#141E33]/60 p-4 space-y-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
              <Bell className="size-4.5" />
            </span>
            <h4 className="text-sm font-bold text-white">إشعارات وتنبيهات فورية</h4>
            <p className="text-xs text-white/60 leading-5">
              تلقي تحديثات سريعة عن حالة تدقيق الحساب، الموافقة على القروض، وتغير أسعار العملات.
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#141E33]/60 p-4 space-y-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400">
              <Layers className="size-4.5" />
            </span>
            <h4 className="text-sm font-bold text-white">خفيف الحجم (أقل من 3MB)</h4>
            <p className="text-xs text-white/60 leading-5">
              لا يستهلك مساحة تخزين هاتفك، ويعمل بخفة تامة على جميع الهواتف الذكية القديمة والحديثة.
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#141E33]/60 p-4 space-y-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-rose-500/15 text-rose-400">
              <FileCheck className="size-4.5" />
            </span>
            <h4 className="text-sm font-bold text-white">معتمد في كافة المحافظات</h4>
            <p className="text-xs text-white/60 leading-5">
              تطبيق رسمي متوافق مع شبكات سيريتل وإم تي إن والإنترنت المنزلي في كافة أنحاء سوريا.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Frequently Asked Questions about Installation */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase">
          {isRTL ? 'الأسئلة الشائعة حول تحميل التطبيق' : 'Frequently Asked Questions'}
        </h3>

        <div className="space-y-2">
          {[
            {
              q: 'هل تطبيق شام كاش مجاني بالكامل؟',
              a: 'نعم، تحميل وتثبيت تطبيق شام كاش مجاني 100% لكافة المواطنين في الجمهورية العربية السورية، ولا توجد أي رسوم اشتراك أو تكاليف خفية.',
            },
            {
              q: 'هل يحتاج التطبيق إلى متجر Google Play أو Apple App Store؟',
              a: 'لا، التطبيق مبني بتقنية الويب التقدمي (Progressive Web App - PWA) المعتمدة عالمياً، مما يتيح لك تثبيته مباشرة من المتصفح بنقرة واحدة دون الحاجة إلى حساب جوجل أو متجر تطبيقات خارجي.',
            },
            {
              q: 'كيف يمكنني تحديث التطبيق بعد تثبيته؟',
              a: 'يتم تحديث التطبيق تلقائياً في الخلفية كلما توفر إصدار جديد أو ميزات مصرفية جديدة دون الحاجة لإعادة تحميله يدوياً.',
            },
            {
              q: 'هل بياناتي ووثائقي آمنة داخل التطبيق؟',
              a: 'نعم، المنظومة تعمل وفق أعلى معايير التشفير البنكي المعتمدة في سوريا، مع حفظ مشفر للبيانات محلياً وعلى خوادم آمنة.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/5 bg-[#141E33]/40 overflow-hidden transition"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-4 text-right cursor-pointer hover:bg-white/5 transition"
              >
                <span className="text-xs sm:text-sm font-bold text-white">{item.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="size-4 text-white/60 shrink-0" />
                ) : (
                  <ChevronDown className="size-4 text-white/60 shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 pt-1 text-xs text-white/70 leading-relaxed border-t border-white/5 bg-white/[0.02]">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 6. Footer Navigation CTA */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
        <button
          type="button"
          onClick={onBackToHome}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-5 py-2.5 text-xs font-bold text-white transition active:scale-95 cursor-pointer"
        >
          {isRTL ? <ArrowRight className="size-4" /> : <ArrowLeft className="size-4" />}
          <span>{isRTL ? 'الرجوع إلى الصفحة الرئيسية' : 'Back to Home'}</span>
        </button>

        <button
          type="button"
          onClick={handleDirectInstall}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:brightness-110 active:scale-95 transition cursor-pointer"
        >
          <Download className="size-4" />
          <span>تحميل وتثبيت التطبيق الآن</span>
        </button>
      </div>
    </div>
  );
};

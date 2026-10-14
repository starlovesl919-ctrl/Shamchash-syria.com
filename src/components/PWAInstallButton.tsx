import React, { useState } from 'react';
import { Download, Smartphone, Share, PlusSquare, Check, X, ShieldCheck } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'header' | 'hero' | 'banner' | 'bottom';
  className?: string;
  onOpenDownloadScreen?: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'header',
  className = '',
  onOpenDownloadScreen,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already running inside standalone PWA mode
  if (isInstalled) {
    if (variant === 'header') {
      return (
        <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
          <Check className="size-3 text-emerald-400" />
          <span>تطبيق مثبّت</span>
        </div>
      );
    }
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      setIsInstalling(true);
      try {
        await install();
      } finally {
        setIsInstalling(false);
      }
    } else if (onOpenDownloadScreen) {
      onOpenDownloadScreen();
    } else {
      // Show guided install modal (works for iOS and browsers where prompt is not auto-dispatched)
      setShowGuideModal(true);
    }
  };

  return (
    <>
      {variant === 'header' && (
        <button
          type="button"
          id="btn-header-download-app"
          onClick={onOpenDownloadScreen || handleInstallClick}
          disabled={isInstalling}
          aria-label="تحميل التطبيق هنا على الهاتف"
          className={`inline-flex items-center gap-1.5 rounded-full border border-blue-400/50 bg-gradient-to-r from-blue-600/40 via-indigo-600/40 to-blue-500/40 hover:from-blue-600/60 hover:to-indigo-600/60 px-3.5 py-1.5 text-[11px] font-black text-white transition-all active:scale-95 shadow-lg shadow-blue-500/25 cursor-pointer ring-1 ring-blue-400/30 hover:ring-blue-400/60 ${className}`}
        >
          <Download className="size-3.5 text-blue-300 animate-bounce" />
          <span>تحميل التطبيق هنا</span>
          <span className="flex size-1.5 rounded-full bg-emerald-400 animate-ping" />
        </button>
      )}

      {variant === 'hero' && (
        <div
          role="region"
          aria-label="تحميل التطبيق هنا"
          className={`relative overflow-hidden rounded-3xl border border-[#4A90E2]/40 bg-gradient-to-br from-[#122347] via-[#0E1A33] to-[#0A1121] p-4 sm:p-5 shadow-2xl shadow-blue-900/30 ${className}`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-right">
            <div className="flex items-center gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/30 to-indigo-500/30 text-blue-300 border border-blue-400/30 shadow-inner">
                <Download className="size-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">تحميل التطبيق هنا | شام كاش الرسمي</h4>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-300 border border-emerald-500/30">
                    تثبيت فوري PWA
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-white/70 max-w-lg">
                  احصل على التطبيق على شاشة هاتفك المحمول (Android أو iPhone) للوصول المباشر والعمل بدون إنترنت وحجم خفيف 2.8MB.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                type="button"
                id="btn-hero-download-now"
                onClick={handleInstallClick}
                disabled={isInstalling}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/35 hover:brightness-110 active:scale-95 transition cursor-pointer"
              >
                <Download className="size-4" />
                <span>{isInstalling ? 'جارٍ التحميل والتثبيت...' : 'تحميل التطبيق هنا الآن'}</span>
              </button>

              {onOpenDownloadScreen && (
                <button
                  type="button"
                  id="btn-hero-download-hub"
                  onClick={onOpenDownloadScreen}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-3.5 py-2.5 text-xs font-semibold text-white/90 transition active:scale-95 cursor-pointer"
                >
                  <Smartphone className="size-3.5 text-[#4A90E2]" />
                  <span>دليل التحميل والـ QR</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {variant === 'banner' && (
        <div
          role="region"
          aria-label="تنبيه تثبيت تطبيق الهاتف"
          className={`flex items-center justify-between gap-3 rounded-2xl border border-indigo-500/30 bg-indigo-950/40 p-3 text-xs backdrop-blur-md ${className}`}
        >
          <div className="flex items-center gap-2.5">
            <Smartphone className="size-4 text-indigo-400 shrink-0" />
            <span className="text-white/80">استخدم تطبيق شام كاش على شاشتك الرئيسية كتطبيق أصلي ومستقل.</span>
          </div>
          <button
            type="button"
            onClick={handleInstallClick}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 font-bold text-white hover:bg-indigo-500 transition text-[11px] shrink-0 cursor-pointer"
          >
            تثبيت
          </button>
        </div>
      )}

      {/* Guided Installation Modal (Android / iOS / Safari / Chrome) */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-[#0F172A] p-6 text-right shadow-2xl">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="absolute left-4 top-4 flex size-8 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 transition cursor-pointer"
            >
              <X className="size-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <Smartphone className="size-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">تثبيت تطبيق شام كاش على جهازك</h3>
                <p className="text-xs text-white/60">يعمل بكفاءة على كافة أنظمة Android و iOS والكمبيوتر</p>
              </div>
            </div>

            <div className="mt-5 space-y-3.5">
              {isIOS ? (
                /* iOS Safari instructions */
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-300">
                    <span className="flex size-5 items-center justify-center rounded-full bg-blue-500/30 text-[10px]">
                      1
                    </span>
                    <span>خطوات التثبيت على أجهزة iPhone و iPad:</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-2 text-xs text-white/80 pr-2">
                    <li className="leading-relaxed">
                      اضغط على زر <strong className="text-white">المشاركة (Share)</strong>{' '}
                      <Share className="inline size-3.5 text-blue-400 mx-1 align-text-bottom" /> في شريط متصفح سفاري بالأسفل.
                    </li>
                    <li className="leading-relaxed">
                      مرّر القائمة لأسفل واختر{' '}
                      <strong className="text-white">إضافة إلى الشاشة الرئيسية (Add to Home Screen)</strong>{' '}
                      <PlusSquare className="inline size-3.5 text-emerald-400 mx-1 align-text-bottom" />.
                    </li>
                    <li className="leading-relaxed">
                      اضغط على زر <strong className="text-white">إضافة (Add)</strong> في الزاوية العلوية ليظهر أيقونة التطبيق على شاشة هاتفك مباشرة.
                    </li>
                  </ol>
                </div>
              ) : (
                /* Android / Chrome instructions */
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                    <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500/30 text-[10px]">
                      1
                    </span>
                    <span>خطوات التثبيت على أجهزة Android أو الحاسوب:</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-2 text-xs text-white/80 pr-2">
                    <li className="leading-relaxed">
                      انقر على قائمة المتصفح (النقاط الثلاث <strong className="text-white">⋮</strong> في الزاوية العلوية).
                    </li>
                    <li className="leading-relaxed">
                      اختر <strong className="text-white">تثبيت التطبيق (Install App)</strong> أو{' '}
                      <strong className="text-white">الإضافة إلى الشاشة الرئيسية</strong>.
                    </li>
                    <li className="leading-relaxed">
                      أكّد التثبيت ليتم تنزيل أيقونة شام كاش وتشغيلها بنافذة مستقلة بدون متصفح.
                    </li>
                  </ol>

                  {isInstallable && (
                    <button
                      type="button"
                      onClick={async () => {
                        setShowGuideModal(false);
                        await install();
                      }}
                      className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 hover:brightness-110 active:scale-95 transition cursor-pointer"
                    >
                      <Download className="size-4" />
                      <span>بدء التثبيت المباشر الفوري</span>
                    </button>
                  )}
                </div>
              )}

              {/* Feature Badges */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-white/70">
                <div className="flex items-center gap-1.5 rounded-xl border border-white/5 bg-white/5 p-2">
                  <ShieldCheck className="size-3.5 text-emerald-400" />
                  <span>تشفير مالي آمن 100%</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-xl border border-white/5 bg-white/5 p-2">
                  <Check className="size-3.5 text-blue-400" />
                  <span>دعم العمل بدون اتصال</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="mt-5 w-full rounded-xl bg-white/10 py-2.5 text-xs font-bold text-white hover:bg-white/15 transition cursor-pointer"
            >
              حسناً، فهمت ذلك
            </button>
          </div>
        </div>
      )}
    </>
  );
};

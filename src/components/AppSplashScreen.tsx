import React, { useEffect, useState } from 'react';

interface AppSplashScreenProps {
  onDismiss: () => void;
}

export const AppSplashScreen: React.FC<AppSplashScreenProps> = ({ onDismiss }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(onDismiss, 350);
    }, 1400);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      onClick={() => {
        setFading(true);
        setTimeout(onDismiss, 200);
      }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#0B1121] px-6 py-12 transition-opacity duration-300 cursor-pointer ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top Tag */}
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-[#7B9BE8] backdrop-blur-md">
        <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>الجمهورية العربية السورية | المنظومة المالية</span>
      </div>

      {/* Center Branding */}
      <div className="flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-[#4A90E2]/20 blur-2xl animate-pulse" />
          <img
            src="/assets/sham-login-logo.webp"
            alt="شعار شام كاش"
            width="239"
            height="267"
            className="relative h-28 w-auto drop-shadow-[0_15px_35px_rgba(74,144,226,0.4)]"
          />
        </div>

        <h1 className="text-2xl font-black tracking-wide text-white">
          شام كاش
        </h1>
        <p className="mt-1 text-xs font-bold tracking-widest text-[#4A90E2] uppercase">
          SHAMCHAS FINANCIAL SYSTEM
        </p>
        <p className="mt-2 text-xs text-white/60">
          البوابة الرسمية لتوثيق الحسابات، القروض، والتوظيف
        </p>

        {/* Loading Progress Bar */}
        <div className="mt-8 w-44 overflow-hidden rounded-full bg-white/10 p-0.5">
          <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-blue-500 via-[#4A90E2] to-emerald-400 animate-[pulse_1s_infinite]" />
        </div>
      </div>

      {/* Bottom Legal / Version */}
      <div className="flex flex-col items-center gap-1 text-center">
        <span className="text-[11px] font-semibold text-white/40">
          تطبيق الهاتف المحمول المعتمد v2.6.0
        </span>
        <span className="text-[10px] text-white/25">
          انقر في أي مكان للتخطي الفوري
        </span>
      </div>
    </div>
  );
};

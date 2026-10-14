import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <aside
      aria-label="حالة الاتصال بالشابكة"
      className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-50 flex items-center justify-between gap-3 rounded-2xl bg-amber-500/95 backdrop-blur-md px-4 py-3 text-xs font-semibold text-slate-950 shadow-2xl border border-amber-300/40 animate-bounce"
    >
      <div className="flex items-center gap-2.5">
        <span className="flex size-7 items-center justify-center rounded-xl bg-slate-950/15">
          <WifiOff className="size-4" />
        </span>
        <div>
          <p className="font-bold text-slate-950">وضع عدم الاتصال (بدون إنترنت)</p>
          <p className="text-[11px] text-slate-900/80">
            يعمل التطبيق حالياً بواسطة البيانات المخزنة مسبقاً، وسيتم المزامنة فور عودة الاتصال.
          </p>
        </div>
      </div>
      <span className="size-2 rounded-full bg-slate-950 animate-ping" />
    </aside>
  );
};

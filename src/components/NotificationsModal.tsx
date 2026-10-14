import React, { useState } from 'react';
import {
  X,
  Bell,
  CheckCheck,
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  ShieldCheck,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsRead
} from '../utils/accountStorage';
import { AppNotification } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isRTL } = useLanguage();
  const [notifications, setNotifications] = useState<AppNotification[]>(() => getNotifications());

  if (!isOpen) return null;

  const handleMarkAll = () => {
    markAllNotificationsRead();
    setNotifications(getNotifications());
  };

  const handleReadSingle = (id: string) => {
    markNotificationAsRead(id);
    setNotifications(getNotifications());
  };

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="size-4 text-emerald-400" />;
      case 'transfer':
        return <ArrowUpRight className="size-4 text-blue-400" />;
      case 'bill':
        return <Receipt className="size-4 text-indigo-400" />;
      case 'security':
        return <ShieldCheck className="size-4 text-purple-400" />;
      default:
        return <TrendingUp className="size-4 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-[#0D1527] p-5 sm:p-6 shadow-2xl text-white my-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 text-white/60 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition cursor-pointer"
        >
          <X className="size-4" />
        </button>

        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
              <Bell className="size-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white">
                {isRTL ? 'مركز الإشعارات والتنبيهات' : 'Notifications Center'}
              </h3>
              <span className="text-[11px] text-white/50">
                {notifications.filter((n) => !n.read).length} غير مقروء
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleMarkAll}
            className="flex items-center gap-1 text-[11px] font-bold text-[#7B9BE8] hover:text-white transition cursor-pointer"
          >
            <CheckCheck className="size-3.5" />
            <span>{isRTL ? 'تحديد الكل كمقروء' : 'Mark all read'}</span>
          </button>
        </div>

        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-xs text-white/50">
              لا توجد إشعارات جديدة حالياً
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleReadSingle(n.id)}
                className={`rounded-2xl border p-3.5 transition cursor-pointer text-right flex items-start gap-3 ${
                  n.read
                    ? 'border-white/5 bg-white/[0.02] opacity-75'
                    : 'border-blue-500/40 bg-blue-500/10'
                }`}
              >
                <div className="size-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                  {getIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-white truncate">{n.title}</h4>
                    <span className="text-[10px] text-white/40 font-mono shrink-0">{n.timestamp}</span>
                  </div>
                  <p className="mt-1 text-xs text-white/70 leading-relaxed">{n.message}</p>
                  {n.amount && (
                    <span className="mt-1.5 inline-block font-mono text-[11px] font-bold text-emerald-400">
                      {n.amount}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-white/10 text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-white/15 bg-white/5 py-2 text-xs font-bold text-white/80 hover:bg-white/10 transition cursor-pointer"
          >
            إغلاق الإشعارات
          </button>
        </div>
      </div>
    </div>
  );
};

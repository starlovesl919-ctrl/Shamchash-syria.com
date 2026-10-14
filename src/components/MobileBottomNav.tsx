import React from 'react';
import { Home, Coins, Briefcase, MessageSquareWarning, ShieldCheck } from 'lucide-react';
import { ScreenType } from '../types';

interface MobileBottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  savedAccountsCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentScreen,
  onNavigate,
  savedAccountsCount,
}) => {
  const triggerHaptic = () => {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(12);
      }
    } catch {
      // Haptics not supported or ignored
    }
  };

  const navItems = [
    {
      id: 'home' as ScreenType,
      label: 'الرئيسية',
      icon: Home,
      isActive: currentScreen === 'home' || currentScreen === 'contact-info' || currentScreen === 'auth' || currentScreen === 'verify' || currentScreen === 'waiting',
      activeColor: 'text-[#4A90E2]',
      activeBg: 'bg-[#4A90E2]/15',
    },
    {
      id: 'loans' as ScreenType,
      label: 'القروض',
      icon: Coins,
      isActive: currentScreen === 'loans',
      activeColor: 'text-emerald-400',
      activeBg: 'bg-emerald-500/15',
    },
    {
      id: 'jobs' as ScreenType,
      label: 'الوظائف',
      icon: Briefcase,
      isActive: currentScreen === 'jobs',
      activeColor: 'text-purple-400',
      activeBg: 'bg-purple-500/15',
    },
    {
      id: 'complaints' as ScreenType,
      label: 'الشكاوى',
      icon: MessageSquareWarning,
      isActive: currentScreen === 'complaints',
      activeColor: 'text-rose-400',
      activeBg: 'bg-rose-500/15',
    },
    {
      id: 'admin' as ScreenType,
      label: 'لوحة الإدارة',
      icon: ShieldCheck,
      isActive: currentScreen === 'admin',
      activeColor: 'text-amber-400',
      activeBg: 'bg-amber-500/15',
      badge: savedAccountsCount > 0 ? savedAccountsCount : undefined,
    },
  ];

  return (
    <nav
      aria-label="شريط تنقل التطبيق السفلي"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B1121]/95 backdrop-blur-xl border-t border-white/10 px-2 pt-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-[0_-8px_25px_rgba(0,0,0,0.5)] md:hidden"
    >
      <div className="mx-auto flex max-w-md items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                triggerHaptic();
                onNavigate(item.id);
              }}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-200 cursor-pointer active:scale-90 ${
                item.isActive ? item.activeBg : 'hover:bg-white/5'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`size-5 transition-transform duration-200 ${
                    item.isActive ? `${item.activeColor} scale-110` : 'text-white/50'
                  }`}
                />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 flex size-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`mt-1 text-[10px] font-semibold transition-colors duration-200 ${
                  item.isActive ? `${item.activeColor} font-bold` : 'text-white/50'
                }`}
              >
                {item.label}
              </span>
              {item.isActive && (
                <span className="absolute bottom-0 h-0.5 w-6 rounded-full bg-current opacity-80" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

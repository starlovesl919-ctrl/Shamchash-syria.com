import React, { useState } from 'react';
import {
  X,
  MapPin,
  Phone,
  Clock,
  Building2,
  CheckCircle2,
  Search,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getBranchesList } from '../utils/accountStorage';
import { BranchLocation } from '../types';

interface BranchesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BranchesModal: React.FC<BranchesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isRTL } = useLanguage();
  const branches = getBranchesList();

  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const cities = ['all', 'دمشق', 'ريف دمشق', 'حلب', 'حمص', 'اللاذقية', 'طرطوس', 'حماة', 'السويداء'];

  const filtered = branches.filter((b) => {
    if (selectedCity !== 'all' && b.city !== selectedCity) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        b.name.toLowerCase().includes(q) ||
        b.address.toLowerCase().includes(q) ||
        b.district.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl border border-blue-500/30 bg-[#0C1527] p-5 sm:p-6 shadow-2xl text-white my-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 text-white/60 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition cursor-pointer"
        >
          <X className="size-4" />
        </button>

        <div className="text-center">
          <div className="mx-auto flex size-13 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Building2 className="size-6" />
          </div>
          <h3 className="mt-3 text-lg font-black text-white">
            {isRTL ? 'شبكة فروع ومراكز شام كاش المعتمدة' : 'Authorized Branch & Center Network'}
          </h3>
          <p className="mt-1 text-xs text-white/60">
            {isRTL ? 'مراكز الخدمة المباشرة للإيداع والسحب وتوثيق الهويات في كافة المحافظات' : 'Service centers across all Syrian governorates'}
          </p>
        </div>

        {/* Search & City Filter */}
        <div className="mt-4 space-y-2.5">
          <div className="relative">
            <Search className="absolute right-3 top-2.5 size-4 text-white/40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث بالاسم أو الحي أو الشارع..."
              className="w-full rounded-xl border border-white/15 bg-white/5 py-2 pr-9 pl-3 text-xs text-white focus:border-blue-500 focus:outline-none placeholder:text-white/30"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {cities.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setSelectedCity(city)}
                className={`rounded-xl px-3 py-1 font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCity === city
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {city === 'all' ? 'كافة المحافظات' : city}
              </button>
            ))}
          </div>
        </div>

        {/* Branches Cards */}
        <div className="mt-4 space-y-3 max-h-80 overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-xs text-white/50">
              لا توجد فروع مطابقة لخيارات البحث
            </div>
          ) : (
            filtered.map((b) => (
              <div
                key={b.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] hover:border-blue-500/40 p-4 transition text-right"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-white">{b.name}</h4>
                      {b.isMainBranch && (
                        <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[9px] font-bold text-amber-300 border border-amber-500/30">
                          المقر الرئيسي
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-white/70 flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-blue-400 shrink-0" />
                      <span>{b.city} - {b.address}</span>
                    </p>
                  </div>

                  <a
                    href={`tel:${b.phone.replace(/\s+/g, '')}`}
                    className="flex items-center gap-1 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 px-2.5 py-1.5 text-xs font-mono font-bold transition shrink-0"
                  >
                    <Phone className="size-3" />
                    <span>اتصال</span>
                  </a>
                </div>

                <div className="mt-2.5 pt-2.5 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-white/50">
                  <div className="flex items-center gap-1.5">
                    <Clock className="size-3 text-emerald-400" />
                    <span>{b.workingHours}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {b.services.slice(0, 3).map((s, i) => (
                      <span key={i} className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-white/60">
                        {s}
                      </span>
                    ))}
                  </div>
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
            إغلاق الدليل
          </button>
        </div>
      </div>
    </div>
  );
};

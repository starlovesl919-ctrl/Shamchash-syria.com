import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  RefreshCw,
  LoaderCircle,
  Users,
} from 'lucide-react';
import { ReviewStatus } from '../types';
import { updateAccountStatus } from '../utils/accountStorage';
import { useLanguage } from '../context/LanguageContext';

interface WaitingScreenProps {
  email: string;
  fullName?: string;
  phone?: string;
  requestId?: string;
  onReset: () => void;
}

export const WaitingScreen: React.FC<WaitingScreenProps> = ({
  email,
  requestId = 'SC-104288',
  onReset,
}) => {
  const { t, isRTL } = useLanguage();
  const [status, setStatus] = useState<ReviewStatus>('under_review');
  const [isFetching, setIsFetching] = useState(false);
  const [secondsWaiting, setSecondsWaiting] = useState(0);

  // Sync status updates to stored accounts
  useEffect(() => {
    if (requestId) {
      updateAccountStatus(requestId, status);
    }
  }, [status, requestId]);

  // Timer counter
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsWaiting((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulated auto-update progression after 14 seconds
  useEffect(() => {
    if (status === 'under_review') {
      const autoApprove = setTimeout(() => {
        setStatus('verified');
      }, 14000);
      return () => clearTimeout(autoApprove);
    }
  }, [status]);

  const handleRefetch = () => {
    setIsFetching(true);
    setTimeout(() => {
      setIsFetching(false);
      if (secondsWaiting > 6 && status === 'under_review') {
        setStatus('verified');
      }
    }, 1000);
  };

  const statusConfig = {
    under_review: {
      icon: <Clock className="size-7 animate-pulse text-[#4A90E2]" />,
      tone: 'bg-[#4A90E2]/15 text-[#4A90E2] border border-[#4A90E2]/30',
      title: t.waitingTitleUnderReview,
      text: t.waitingDescUnderReview,
    },
    verified: {
      icon: <CheckCircle2 className="size-7 text-emerald-400" />,
      tone: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
      title: t.waitingTitleVerified,
      text: t.waitingDescVerified,
    },
    needs_info: {
      icon: <AlertCircle className="size-7 text-amber-400" />,
      tone: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
      title: t.waitingTitleNeedsInfo,
      text: t.waitingDescNeedsInfo,
    },
    rejected: {
      icon: <XCircle className="size-7 text-rose-400" />,
      tone: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
      title: t.waitingTitleRejected,
      text: t.waitingDescRejected,
    },
  }[status];

  return (
    <div className="flex flex-col items-center text-center">
      {/* Status Icon */}
      <div className={`flex size-16 items-center justify-center rounded-full ${statusConfig.tone}`}>
        {statusConfig.icon}
      </div>

      {/* Title & Description */}
      <h1 className="mt-4 text-xl font-bold text-white sm:text-2xl">
        {statusConfig.title}
      </h1>

      <p className="mt-3 text-sm leading-7 text-white/70 max-w-md">
        {statusConfig.text}
      </p>

      {/* Request ID Badge */}
      <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs">
        <span className="text-white/50">{t.reviewNumber}:</span>
        <span className="font-mono font-bold text-[#7B9BE8] tracking-wider" dir="ltr">
          {requestId}
        </span>
      </div>

      {/* Instructions list */}
      {status === 'under_review' && (
        <ol className={`mt-5 w-full space-y-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 ${isRTL ? 'text-right' : 'text-left'} text-xs sm:text-sm leading-7 text-white/80`}>
          <li className="flex items-start gap-2">
            <span className="font-bold text-[#4A90E2]">1.</span>
            <span>{t.instruction1}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-[#4A90E2]">2.</span>
            <span>{t.instruction2}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-[#4A90E2]">3.</span>
            <span>{t.instruction3}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-[#4A90E2]">4.</span>
            <span>{t.instruction4}</span>
          </li>
        </ol>
      )}

      {/* Status Action Button */}
      <div className="mt-6 w-full space-y-3">
        <button
          type="button"
          onClick={handleRefetch}
          disabled={isFetching}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#7B9BE8] to-[#5F7FD3] px-5 text-sm font-bold text-white shadow-md transition hover:brightness-110 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
        >
          {isFetching ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              <span>{isRTL ? 'جارٍ التحقق من الخادم…' : 'Checking server…'}</span>
            </>
          ) : (
            <>
              <RefreshCw className="size-4" />
              <span>{t.btnRefreshStatus}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white hover:bg-white/10 transition cursor-pointer"
        >
          <span>{t.btnReturnHome}</span>
        </button>
      </div>

      {/* Quick Status Toggle for Reviewing and Demonstration */}
      <div className="mt-6 w-full border-t border-white/10 pt-4">
        <span className="text-[11px] text-white/40 block mb-2 font-medium">
          {isRTL ? 'لوحة معاينة حالات المراجعة السريعة:' : 'Demo Status Simulator:'}
        </span>
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {(['under_review', 'verified', 'needs_info', 'rejected'] as ReviewStatus[]).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatus(st)}
              className={`text-[11px] px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                status === st
                  ? 'border-[#4A90E2] bg-[#4A90E2]/20 text-[#7B9BE8] font-bold'
                  : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {st === 'under_review' && t.statusUnderReview}
              {st === 'verified' && t.statusVerified}
              {st === 'needs_info' && t.statusNeedsInfo}
              {st === 'rejected' && t.statusRejected}
            </button>
          ))}
        </div>
      </div>

      {/* Email Footprint */}
      {email && (
        <p dir="ltr" className="mt-4 font-mono text-xs text-white/40">
          {email}
        </p>
      )}
    </div>
  );
};

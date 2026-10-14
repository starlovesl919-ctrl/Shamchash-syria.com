import React from 'react';

export const WaveBackground: React.FC = () => {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMin slice"
      viewBox="0 0 390 844"
      fill="none"
    >
      {Array.from({ length: 26 }).map((_, t) => {
        const n = -60 + t * 26;
        const r = 150 + t * 14;
        const i = Math.max(0.08, 0.5 - t * 0.02);
        return (
          <path
            key={t}
            d={`M -60 ${n + r} Q 195 ${n - 40} 450 ${n + r}`}
            stroke="#1B2A4A"
            strokeOpacity={i}
            strokeWidth="1.1"
          />
        );
      })}
    </svg>
  );
};

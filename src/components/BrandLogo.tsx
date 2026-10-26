/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface BrandLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

export default function BrandLogo({ variant = 'dark', size = 'md' }: BrandLogoProps) {
  const isLight = variant === 'light';

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const subTextSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
  };

  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Green Takeout Box Icon with Golden details */}
      <div
        className={`${iconSizes[size]} bg-[#00843D] rounded-xl flex items-center justify-center shadow-md p-1.5 flex-shrink-0 relative overflow-hidden`}
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-white"
        >
          {/* Takeout box outline */}
          <rect x="6" y="14" width="28" height="20" rx="3" fill="#00843D" stroke="#F5BA13" strokeWidth="2.5" />
          {/* Vertical grill lines */}
          <line x1="12" y1="18" x2="12" y2="28" stroke="#F5BA13" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="17" y1="18" x2="17" y2="28" stroke="#F5BA13" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="22" y1="18" x2="22" y2="28" stroke="#F5BA13" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="27" y1="18" x2="27" y2="28" stroke="#F5BA13" strokeWidth="2.5" strokeLinecap="round" />
          {/* Steam / straw at top */}
          <path d="M14 10C14 6 22 6 22 10" stroke="#F5BA13" strokeWidth="2" strokeLinecap="round" />
          <path d="M22 10L26 4" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>

      <div className="flex flex-col">
        <span
          className={`font-black tracking-tight leading-none ${textSizes[size]} ${
            isLight ? 'text-white' : 'text-[#00843D]'
          }`}
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          100-MEAL
        </span>
        <span
          className={`font-extrabold tracking-wider uppercase leading-none mt-1 ${subTextSizes[size]} ${
            isLight ? 'text-[#F5BA13]' : 'text-[#064E26]'
          }`}
        >
          ALWAYS FRESH • 100 BOB KENYA
        </span>
      </div>
    </div>
  );
}

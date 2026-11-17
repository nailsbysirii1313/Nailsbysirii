import React, { useState } from 'react';

export default function StudioLogo({
  logoUrl = '/logo.png',
  size = 'md', // xs, sm, md, lg, xl
  showText = false,
  className = ''
}) {
  const [imgError, setImgError] = useState(false);

  // Responsive, aspect-ratio aware sizing for the framed luxury logo
  const sizeMap = {
    xs: {
      img: 'h-6 sm:h-7 w-auto max-w-[64px]',
      box: 'p-1 rounded-xl',
      title: 'text-xs',
      sub: 'text-[8px]'
    },
    sm: {
      img: 'h-8 sm:h-9 w-auto max-w-[84px]',
      box: 'p-1 rounded-xl',
      title: 'text-sm',
      sub: 'text-[9px]'
    },
    md: {
      img: 'h-9 sm:h-10 w-auto max-w-[110px]',
      box: 'p-1.5 rounded-2xl',
      title: 'text-base',
      sub: 'text-[10px]'
    },
    lg: {
      img: 'h-13 sm:h-14 w-auto max-w-[160px]',
      box: 'p-2 rounded-2xl',
      title: 'text-xl',
      sub: 'text-xs'
    },
    xl: {
      img: 'h-18 sm:h-20 w-auto max-w-[220px]',
      box: 'p-2.5 rounded-3xl',
      title: 'text-2xl',
      sub: 'text-sm'
    }
  };

  const current = sizeMap[size] || sizeMap.md;
  const effectiveLogoUrl = logoUrl || '/logo.png';

  if (effectiveLogoUrl && !imgError) {
    return (
      <div className={`inline-flex items-center gap-2.5 ${className}`}>
        <div className={`bg-white/95 border border-atelier-champagneBorder/80 ${current.box} shadow-xs hover:border-atelier-rose300 transition-all shrink-0 flex items-center justify-center`}>
          <img
            src={effectiveLogoUrl}
            alt="Nails by Sirii"
            className={`${current.img} object-contain transition-transform group-hover:scale-105`}
            onError={() => setImgError(true)}
          />
        </div>
        {showText && (
          <div className="leading-tight">
            <span className={`font-serif italic font-bold text-atelier-noir block tracking-tight ${current.title}`}>
              Nails by Sirii
            </span>
            <span className={`tracking-widest uppercase text-atelier-rose600 font-semibold block ${current.sub}`}>
              Cute Nail Studio • Dehradun
            </span>
          </div>
        )}
      </div>
    );
  }

  // Graceful fallback boutique vector insignia
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div
        className={`${current.img} aspect-square rounded-2xl bg-gradient-to-tr from-atelier-rose500 via-pink-500 to-atelier-rose400 flex items-center justify-center text-white shadow-sm shadow-atelier-rose200/80 border border-white/60 shrink-0 select-none`}
      >
        <span className="font-serif italic font-bold tracking-tighter">S</span>
      </div>
      {showText && (
        <div className="leading-tight">
          <span className={`font-serif italic font-bold text-atelier-noir block tracking-tight ${current.title}`}>
            Nails by Sirii
          </span>
          <span className={`tracking-widest uppercase text-atelier-rose600 font-semibold block ${current.sub}`}>
            Cute Nail Studio • Dehradun
          </span>
        </div>
      )}
    </div>
  );
}

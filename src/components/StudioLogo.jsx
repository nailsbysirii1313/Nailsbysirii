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
        <div className={`bg-studio-surface border border-border-subtle ${current.box} shadow-xs hover:border-brand-wine/40 transition-all shrink-0 flex items-center justify-center`}>
          <img
            src={effectiveLogoUrl}
            alt="Nails by Sirii"
            className={`${current.img} object-contain transition-transform group-hover:scale-105`}
            onError={() => setImgError(true)}
          />
        </div>
        {showText && (
          <div className="leading-tight">
            <span className={`font-display font-semibold text-text-ink block tracking-tight ${current.title}`}>
              Nails by Sirii
            </span>
            <span className={`tracking-wider uppercase text-brand-wine font-medium block ${current.sub}`}>
              Contemporary Nail Atelier • Dehradun
            </span>
          </div>
        )}
      </div>
    );
  }

  // Graceful fallback atelier monogram
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div
        className={`${current.img} aspect-square rounded-2xl bg-brand-wine flex items-center justify-center text-white shadow-xs border border-white/20 shrink-0 select-none`}
      >
        <span className="font-display font-bold tracking-tight">S</span>
      </div>
      {showText && (
        <div className="leading-tight">
          <span className={`font-display font-semibold text-text-ink block tracking-tight ${current.title}`}>
            Nails by Sirii
          </span>
          <span className={`tracking-wider uppercase text-brand-wine font-medium block ${current.sub}`}>
            Contemporary Nail Atelier • Dehradun
          </span>
        </div>
      )}
    </div>
  );
}

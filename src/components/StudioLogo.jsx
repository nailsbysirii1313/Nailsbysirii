import React, { useState } from 'react';

export default function StudioLogo({
  logoUrl = '/logo.png',
  size = 'md', // xs, sm, md, lg, xl
  showText = false,
  className = ''
}) {
  const [imgError, setImgError] = useState(false);

  // Proportional, aspect-ratio aware sizing for the logo placed directly on header background
  const sizeMap = {
    xs: {
      img: 'h-6 sm:h-7 w-auto max-h-7',
      title: 'text-xs',
      sub: 'text-[8px]'
    },
    sm: {
      img: 'h-7 sm:h-8 md:h-8.5 w-auto max-h-9',
      title: 'text-sm',
      sub: 'text-[9px]'
    },
    md: {
      img: 'h-7.5 sm:h-8.5 md:h-9.5 w-auto max-h-10',
      title: 'text-base',
      sub: 'text-[10px]'
    },
    lg: {
      img: 'h-10 sm:h-12 md:h-13 w-auto max-h-14',
      title: 'text-xl',
      sub: 'text-xs'
    },
    xl: {
      img: 'h-14 sm:h-16 md:h-18 w-auto max-h-20',
      title: 'text-2xl',
      sub: 'text-sm'
    }
  };

  const current = sizeMap[size] || sizeMap.md;
  const effectiveLogoUrl = logoUrl || '/logo.png';

  if (effectiveLogoUrl && !imgError) {
    if (!showText) {
      return (
        <img
          src={effectiveLogoUrl}
          alt="Nails by Sirii"
          className={`${current.img} object-contain shrink-0 select-none ${className}`}
          onError={() => setImgError(true)}
        />
      );
    }

    return (
      <div className={`inline-flex items-center gap-2.5 ${className}`}>
        <img
          src={effectiveLogoUrl}
          alt="Nails by Sirii"
          className={`${current.img} object-contain shrink-0 select-none`}
          onError={() => setImgError(true)}
        />
        <div className="leading-tight">
          <span className={`font-display font-semibold text-text-ink block tracking-tight ${current.title}`}>
            Nails by Sirii
          </span>
          <span className={`tracking-wider uppercase text-brand-wine font-medium block ${current.sub}`}>
            Contemporary Nail Atelier • Dehradun
          </span>
        </div>
      </div>
    );
  }

  // Graceful fallback typographic atelier mark directly on background (no decorative box)
  if (!showText) {
    return (
      <span className={`font-display font-bold text-brand-wine tracking-wider select-none shrink-0 ${current.title} ${className}`}>
        NBS
      </span>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className={`font-display font-bold text-brand-wine tracking-wider select-none shrink-0 ${current.title}`}>
        NBS
      </span>
      <div className="leading-tight">
        <span className={`font-display font-semibold text-text-ink block tracking-tight ${current.title}`}>
          Nails by Sirii
        </span>
        <span className={`tracking-wider uppercase text-brand-wine font-medium block ${current.sub}`}>
          Contemporary Nail Atelier • Dehradun
        </span>
      </div>
    </div>
  );
}

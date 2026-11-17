import React from 'react';

/**
 * NailTipSchematic
 * Honest illustrative schematic visualizer for nail shapes, lengths, colors, and finishes.
 * Renders an exact SVG geometric silhouette rather than a simulated photo.
 */
export default function NailTipSchematic({
  shape = 'almond',
  length = 'medium',
  baseColor = '#F9D5DC',
  finish = 'chrome',
  size = 'md', // 'sm' | 'md' | 'lg'
  className = ''
}) {
  const shapeId = typeof shape === 'object' ? shape.id : (shape || 'almond').toLowerCase();
  const lengthId = typeof length === 'object' ? length.id : (length || 'medium').toLowerCase();
  const finishId = typeof finish === 'object' ? finish.id : (finish || 'chrome').toLowerCase();
  const colorHex = typeof baseColor === 'object' ? (baseColor.hex || '#F9D5DC') : baseColor;

  // Tip height boundaries based on length
  // viewBox: 0 0 60 120
  const yTip = lengthId === 'short' ? 44 : lengthId === 'medium' ? 30 : lengthId === 'long' ? 18 : 8;
  const yCuticle = 110;

  // Generate SVG path based on shape
  let pathD = '';
  let frenchPathD = '';

  if (shapeId.includes('coffin')) {
    // Tapered with flat horizontal tip
    pathD = `M 18 ${yTip} L 42 ${yTip} L 50 65 L 50 96 C 50 108 10 108 10 96 L 10 65 Z`;
    frenchPathD = `M 18 ${yTip} L 42 ${yTip} L 44 ${yTip + 12} L 16 ${yTip + 12} Z`;
  } else if (shapeId.includes('stiletto')) {
    // Pointed triangle crest
    pathD = `M 30 ${yTip} L 50 65 L 50 96 C 50 108 10 108 10 96 L 10 65 Z`;
    frenchPathD = `M 30 ${yTip} L 38 ${yTip + 16} L 22 ${yTip + 16} Z`;
  } else if (shapeId.includes('squoval')) {
    // Straight sides with softly rounded top corners
    pathD = `M 16 ${yTip} Q 10 ${yTip} 10 ${yTip + 8} L 10 96 C 10 108 50 108 50 96 L 50 ${yTip + 8} Q 50 ${yTip} 44 ${yTip} Z`;
    frenchPathD = `M 16 ${yTip} Q 10 ${yTip} 10 ${yTip + 8} L 10 ${yTip + 12} L 50 ${yTip + 12} L 50 ${yTip + 8} Q 50 ${yTip} 44 ${yTip} Z`;
  } else if (shapeId.includes('square')) {
    // Sharp right angle corners and flat top
    pathD = `M 10 ${yTip} L 50 ${yTip} L 50 96 C 50 108 10 108 10 96 Z`;
    frenchPathD = `M 10 ${yTip} L 50 ${yTip} L 50 ${yTip + 12} L 10 ${yTip + 12} Z`;
  } else if (shapeId.includes('round')) {
    // Semicircular dome tip
    pathD = `M 10 ${yTip + 18} C 10 ${yTip - 2} 50 ${yTip - 2} 50 ${yTip + 18} L 50 96 C 50 108 10 108 10 96 Z`;
    frenchPathD = `M 10 ${yTip + 14} C 10 ${yTip - 2} 50 ${yTip - 2} 50 ${yTip + 14} Q 30 ${yTip + 8} 10 ${yTip + 14} Z`;
  } else {
    // Default: Almond (graceful tapered curve)
    pathD = `M 30 ${yTip} C 44 ${yTip + 6} 49 ${yTip + 28} 50 65 L 50 96 C 50 108 10 108 10 96 L 10 65 C 11 ${yTip + 28} 16 ${yTip + 6} 30 ${yTip} Z`;
    frenchPathD = `M 30 ${yTip} C 39 ${yTip + 4} 43 ${yTip + 14} 45 ${yTip + 16} Q 30 ${yTip + 10} 15 ${yTip + 16} C 17 ${yTip + 14} 21 ${yTip + 4} 30 ${yTip} Z`;
  }

  const heightClass = size === 'sm' ? 'h-24 w-12' : size === 'lg' ? 'h-48 w-24' : 'h-36 w-18';

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 60 120"
        className={`${heightClass} drop-shadow-md transition-all duration-300`}
        aria-hidden="true"
      >
        <defs>
          {/* Base Color Gradient with subtle 3D curvature */}
          <linearGradient id={`nail-base-${colorHex.replace('#', '')}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colorHex} stopOpacity="0.88" />
            <stop offset="35%" stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="65%" stopColor={colorHex} stopOpacity="0.95" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.18" />
          </linearGradient>

          {/* Chrome Glaze shimmer */}
          <linearGradient id="chrome-glaze" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
            <stop offset="30%" stopColor="#f472b6" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#c084fc" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.4" />
          </linearGradient>

          {/* Cat Eye magnetic velvet streak */}
          <linearGradient id="cateye-streak" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="42%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="58%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Clip path for nail boundary */}
          <clipPath id={`clip-nail-${shapeId}-${lengthId}`}>
            <path d={pathD} />
          </clipPath>
        </defs>

        {/* Ambient shadow underneath nail */}
        <path
          d={pathD}
          fill="none"
          stroke="#000000"
          strokeWidth="3"
          strokeOpacity="0.08"
          transform="translate(0, 2)"
        />

        {/* Base Nail Body */}
        <path
          d={pathD}
          fill={colorHex}
          stroke="#000000"
          strokeWidth="1"
          strokeOpacity="0.12"
        />

        {/* Curvature & Sheen Overlay */}
        <path
          d={pathD}
          fill={`url(#nail-base-${colorHex.replace('#', '')})`}
        />

        {/* FINISH OVERLAYS (clipped to nail contour) */}
        <g clipPath={`url(#clip-nail-${shapeId}-${lengthId})`}>
          {/* Chrome Finish */}
          {finishId.includes('chrome') && (
            <rect
              x="0"
              y="0"
              width="60"
              height="120"
              fill="url(#chrome-glaze)"
              style={{ mixBlendMode: 'overlay' }}
            />
          )}

          {/* Cat Eye Finish */}
          {finishId.includes('cateye') && (
            <rect
              x="0"
              y="0"
              width="60"
              height="120"
              fill="url(#cateye-streak)"
              style={{ mixBlendMode: 'plus-lighter' }}
            />
          )}

          {/* French Tip Finish */}
          {finishId.includes('french') && (
            <path
              d={frenchPathD}
              fill="#FFFFFF"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth="0.5"
            />
          )}

          {/* 3D Liquid Swirls */}
          {finishId.includes('orbit3d') && (
            <g stroke="#D4AF37" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.85">
              <path d={`M 22 ${yTip + 20} Q 36 ${yTip + 26} 24 ${yTip + 38} T 36 ${yTip + 54}`} />
              <circle cx="34" cy={yTip + 16} r="1.5" fill="#E5C158" stroke="none" />
              <circle cx="20" cy={yTip + 46} r="1.2" fill="#E5C158" stroke="none" />
            </g>
          )}

          {/* Pearls & Rhinestones */}
          {finishId.includes('pearls') && (
            <g>
              <circle cx="30" cy={yTip + 24} r="3" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="0.5" />
              <circle cx="30" cy={yTip + 24} r="1" fill="#FFFFFF" opacity="0.9" />
              <circle cx="22" cy={yTip + 36} r="2" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="0.5" />
              <circle cx="38" cy={yTip + 36} r="2" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="0.5" />
            </g>
          )}

          {/* Natural high-gloss reflection streak along left curvature */}
          <path
            d={`M 14 ${yTip + 16} Q 13 60 14 85`}
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.45"
            fill="none"
          />
        </g>

        {/* Clean Outer Perimeter Stroke */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(48, 35, 38, 0.18)"
          strokeWidth="1.2"
        />
      </svg>
    </div>
  );
}

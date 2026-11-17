// Single Source of Truth for Nail Customizer Configurations, Formulas, and Handoffs

export const CUSTOMIZER_BASE_PRICE = 2200; // Base Signature BIAB Overlay
export const CUSTOMIZER_BASE_DURATION = 75; // 75 mins base appointment

export const SHAPES = [
  { id: 'almond', name: 'Almond', desc: 'Classic, slender, highly flattering' },
  { id: 'coffin', name: 'Coffin / Ballerina', desc: 'Tapered sides with crisp flat tip' },
  { id: 'squoval', name: 'Squoval', desc: 'Square with gently rounded corners' },
  { id: 'round', name: 'Round', desc: 'Natural, chic, everyday active length' },
  { id: 'stiletto', name: 'Stiletto', desc: 'Dramatic pointed editorial statement' },
  { id: 'square', name: 'Square', desc: 'Sharp, modern 90s aesthetic' }
];

export const LENGTHS = [
  { id: 'short', name: 'Short', extra: 0, time: 0 },
  { id: 'medium', name: 'Medium', extra: 300, time: 15 },
  { id: 'long', name: 'Long', extra: 600, time: 25 },
  { id: 'xl', name: 'Extra Long', extra: 900, time: 35 }
];

export const BASE_COLORS = [
  { id: 'milky', name: 'Milky Silk', hex: '#F8F1EB', border: '#E7DDD5' },
  { id: 'blush', name: 'Strawberry Jelly', hex: '#F9D5DC', border: '#EBB4C0' },
  { id: 'nude', name: 'Cashmere Nude', hex: '#E8CFBE', border: '#D6BAA6' },
  { id: 'rose', name: 'French Sheer Rose', hex: '#F4BBC6', border: '#E59EA9' },
  { id: 'espresso', name: 'Deep Noir Espresso', hex: '#312527', border: '#4E3E41' },
  { id: 'matcha', name: 'Matcha Sage', hex: '#CBD2BC', border: '#B4BC9F' }
];

export const FINISHES = [
  { id: 'chrome', name: 'Hailey Glazed Chrome', price: 600, time: 15, desc: 'Iridescent pearl powder glaze' },
  { id: 'cateye', name: 'Cosmic Cat-Eye Velvet', price: 700, time: 20, desc: 'Dual-magnet silk shimmer reflection' },
  { id: 'orbit3d', name: '3D Liquid Chrome Swirls', price: 1200, time: 30, desc: 'Sculpted metallic chrome relief art' },
  { id: 'pearls', name: 'Baroque Pearls & Droplets', price: 1400, time: 25, desc: 'Hand-placed crystals & clear dewdrops' },
  { id: 'french', name: 'Micro-French Line', price: 600, time: 15, desc: 'Razor-thin editorial tip smile' },
  { id: 'gloss', name: 'Ultra High-Gloss Glass', price: 0, time: 0, desc: 'Mirror non-wipe glass topcoat' }
];

/**
 * Calculates total price, duration, and itemized lines for a custom set
 */
export function calculateCustomSet({
  length = LENGTHS[1],
  finish = FINISHES[0],
  basePrice = CUSTOMIZER_BASE_PRICE,
  baseDuration = CUSTOMIZER_BASE_DURATION
} = {}) {
  const lengthExtra = Number(length?.extra) || 0;
  const lengthTime = Number(length?.time) || 0;
  const finishPrice = Number(finish?.price) || 0;
  const finishTime = Number(finish?.time) || 0;

  const totalPrice = basePrice + lengthExtra + finishPrice;
  const totalDuration = baseDuration + lengthTime + finishTime;

  const lineItems = [
    {
      description: 'Signature BIAB / Builder Gel Base',
      amount: basePrice,
      duration: baseDuration
    }
  ];

  if (lengthExtra > 0) {
    lineItems.push({
      description: `Sculpted Length (${length?.name || 'Medium'})`,
      amount: lengthExtra,
      duration: lengthTime
    });
  }

  if (finishPrice > 0) {
    lineItems.push({
      description: `Art & Finish Tier (${finish?.name || 'Glazed Chrome'})`,
      amount: finishPrice,
      duration: finishTime
    });
  }

  return {
    basePrice,
    lengthExtra,
    finishPrice,
    totalPrice,
    totalDuration,
    lineItems
  };
}

/**
 * Converts customizer selections into structured invoice line items
 */
export function customSetToInvoiceItems(customSet) {
  if (!customSet) return [];
  const items = [
    {
      description: `Custom Set: ${customSet.shape || 'Almond'} • ${customSet.baseColor || 'Strawberry Jelly'}`,
      quantity: 1,
      unitPrice: CUSTOMIZER_BASE_PRICE,
      amount: CUSTOMIZER_BASE_PRICE
    }
  ];

  const foundLength = LENGTHS.find((l) => l.name === customSet.length);
  if (foundLength && foundLength.extra > 0) {
    items.push({
      description: `Length Upgrade (${foundLength.name})`,
      quantity: 1,
      unitPrice: foundLength.extra,
      amount: foundLength.extra
    });
  }

  const foundFinish = FINISHES.find((f) => f.name === customSet.finish);
  if (foundFinish && foundFinish.price > 0) {
    items.push({
      description: `Art Finish (${foundFinish.name})`,
      quantity: 1,
      unitPrice: foundFinish.price,
      amount: foundFinish.price
    });
  }

  return items;
}

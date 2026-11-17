/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          canvas: '#FAF6F0',
          surface: '#FFFFFF',
          subtle: '#F3ECE2',
          border: '#E8DFD5',
          borderStrong: '#D1C4B5',
          ink: '#1C1917',
          secondary: '#57534E',
          muted: '#8C827A',
          wine: '#D4386A', // Chic luxury pink replacing maroon
          wineHover: '#B82255',
          wineLight: '#FDF2F8',
          pink: '#D4386A',
          pinkHover: '#B82255',
          pinkLight: '#FDF2F8',
          terracotta: '#C26351',
          gold: '#C29358',
          goldLight: '#FDF8F0',
          emerald: '#15803D',
          emeraldLight: '#F0FDF4',
          amber: '#B45309',
          amberLight: '#FFFBEB',
          rose: '#D4386A',
        },
        brand: {
          wine: '#D4386A',
          wineHover: '#B82255',
          wineLight: '#FDF2F8',
          pink: '#D4386A',
          pinkHover: '#B82255',
          pinkLight: '#FDF2F8',
        },
        atelier: {
          blush: '#FFF0F5',
          rose50: '#FDF2F8',
          rose100: '#FCE7F3',
          rose200: '#FBCFE8',
          rose300: '#F472B6',
          rose400: '#EC4899',
          rose500: '#D4386A',
          rose600: '#B82255',
          cream: '#FAF7F5',
          creamCard: '#FFFDFD',
          champagne: '#F7EFE7',
          champagneBorder: '#EEDDCC',
          gold: '#C59B63',
          goldLight: '#F3E8DB',
          noir: '#231F20',
          charcoal: '#3D383A',
          muted: '#857A7D',
        }
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        serif: ['"Fraunces"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Manrope"', '"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(184, 91, 114, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'float': '0 12px 32px -4px rgba(184, 91, 114, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.06)',
        'glow': '0 0 25px rgba(217, 110, 133, 0.25)',
        'studio': '0 4px 20px -2px rgba(28, 25, 23, 0.05), 0 2px 6px -1px rgba(28, 25, 23, 0.03)',
        'studio-float': '0 12px 32px -4px rgba(28, 25, 23, 0.08), 0 4px 12px -2px rgba(28, 25, 23, 0.04)',
      }
    },
  },
  plugins: [],
}


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        atelier: {
          blush: '#FFF4F6',
          rose50: '#FDF2F4',
          rose100: '#FBE6EB',
          rose200: '#F5C2CD',
          rose300: '#E898A9',
          rose400: '#D96E85',
          rose500: '#C24D68',
          rose600: '#A4344E',
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
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(184, 91, 114, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'float': '0 12px 32px -4px rgba(184, 91, 114, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.06)',
        'glow': '0 0 25px rgba(217, 110, 133, 0.25)',
      }
    },
  },
  plugins: [],
}


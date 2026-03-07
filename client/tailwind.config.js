/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./features/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        coral: {
          400: '#FF7F7F',
          500: '#FF6B6B',
          600: '#FF5252'
        }
      },
      animation: {
        'fadeIn': 'fadeIn 0.4s ease-out',
        'scaleIn': 'scaleIn 0.3s ease-out',
        'slideDown': 'slideDown 0.4s ease-out',
        'bounce-slow': 'bounceSlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        bounceSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(168, 85, 247, 0.6)' }
        }
      }
    }
  },
  plugins: []
};

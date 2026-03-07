/**
 * Tailwind CSS Configuration Extension for Quiz Module
 * 
 * This configuration extends the default Tailwind setup with custom
 * colors, animations, and utilities specific to the quiz interface.
 */

module.exports = {
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
        // Original animations
        'fadeIn': 'fadeIn 0.4s ease-out',
        'scaleIn': 'scaleIn 0.3s ease-out',
        'slideDown': 'slideDown 0.4s ease-out',
        'bounce-slow': 'bounceSlow 2s ease-in-out infinite',
        'shimmer': 'shimmerEffect 2s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        
        // Premium game animations
        'goldGlow': 'goldGlow 2s ease-in-out infinite',
        'float-up': 'floatUp 1.5s ease-out forwards',
        'popIn': 'popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'pop-in': 'popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'gentle-float': 'gentleFloat 3s ease-in-out infinite',
        'pulse-scale': 'pulseScale 1.5s ease-in-out infinite',
        'bobbing': 'bobbing 1.5s ease-in-out infinite',
        'bounce-flame': 'bounceFlame 1s ease-in-out infinite',
        'spin-slow': 'spinSlow 3s linear infinite',
        'bounce-celebration': 'bounceCelebration 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'success-check': 'successCheck 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'card-lift': 'cardLift 0.3s ease-out forwards',
        'slide-in-top': 'slideInTop 0.4s ease-out',
        'slide-in-bottom': 'slideInBottom 0.4s ease-out'
      },
      keyframes: {
        // Original keyframes
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
        shimmerEffect: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(168, 85, 247, 0.6)' }
        },
        
        // Premium game keyframes
        goldGlow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(250, 204, 21, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(250, 204, 21, 0.8)' }
        },
        floatUp: {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-60px) scale(1.2)' }
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.7) rotateZ(-5deg)' },
          '50%': { transform: 'scale(1.05) rotateZ(2deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotateZ(0deg)' }
        },
        gentleFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        pulseScale: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.1)' }
        },
        bobbing: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' }
        },
        bounceFlame: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-6px) scale(1.1)' }
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        bounceCelebration: {
          '0%, 100%': { transform: 'scale(1) translateY(0)' },
          '50%': { transform: 'scale(1.15) translateY(-10px)' }
        },
        glowPulse: {
          '0%, 100%': { textShadow: '0 0 10px rgba(250, 204, 21, 0.6)' },
          '50%': { textShadow: '0 0 20px rgba(250, 204, 21, 0.9)' }
        },
        successCheck: {
          '0%': { opacity: '0', transform: 'scale(0) rotate(-45deg)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' }
        },
        cardLift: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-8px)' }
        },
        slideInTop: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideInBottom: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      backdropBlur: {
        xs: '2px'
      }
    }
  },
  plugins: []
};

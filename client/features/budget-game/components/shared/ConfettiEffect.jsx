import { useEffect } from 'react';
import confetti from 'canvas-confetti';

/**
 * ConfettiEffect - Celebration confetti animation
 * 
 * Triggers confetti animation with gold and blue colors
 * matching the game theme
 */
const ConfettiEffect = ({ 
  trigger = true,
  intensity = 'normal', // light, normal, intense
  colors = ['#FACC15', '#EAB308', '#1E3A8A', '#3B82F6'] 
}) => {
  useEffect(() => {
    if (!trigger) return;

    const confettiConfig = {
      particleCount: intensity === 'intense' ? 200 : intensity === 'light' ? 50 : 100,
      spread: 80,
      startVelocity: intensity === 'intense' ? 45 : intensity === 'light' ? 25 : 35,
      origin: { x: 0.5, y: 0.5 },
      colors,
      gravity: 0.8,
      decay: 0.95,
      flat: false
    };

    // Main burst
    confetti(confettiConfig);

    // Secondary burst from sides for intense effect
    if (intensity === 'intense') {
      setTimeout(() => {
        confetti({
          ...confettiConfig,
          particleCount: 100,
          origin: { x: 0.2, y: 0.4 }
        });
        confetti({
          ...confettiConfig,
          particleCount: 100,
          origin: { x: 0.8, y: 0.4 }
        });
      }, 200);
    }
  }, [trigger, intensity, colors]);

  return null;
};

export default ConfettiEffect;

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  size: number;
}

const PARTICLE_EMOJIS = ['✨', '🌟', '💫', '⭐', '✨'];
const MAX_PARTICLES = 20;
const SPAWN_INTERVAL = 100; // Spawn particle every 100ms of movement

export function MagicCursor() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [lastSpawnTime, setLastSpawnTime] = useState(0);

  const spawnParticle = useCallback((x: number, y: number) => {
    const now = Date.now();
    
    // Throttle particle spawning
    if (now - lastSpawnTime < SPAWN_INTERVAL) {
      return;
    }
    
    setLastSpawnTime(now);
    
    const newParticle: Particle = {
      id: now,
      x,
      y,
      emoji: PARTICLE_EMOJIS[Math.floor(Math.random() * PARTICLE_EMOJIS.length)],
      size: Math.random() * 10 + 15, // Random size between 15-25px
    };
    
    setParticles((prev) => {
      // Limit max particles
      const updated = [...prev, newParticle];
      if (updated.length > MAX_PARTICLES) {
        return updated.slice(-MAX_PARTICLES);
      }
      return updated;
    });
  }, [lastSpawnTime]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    // Only spawn if mouse is moving (not just hovering)
    spawnParticle(e.clientX, e.clientY);
  }, [spawnParticle]);

  useEffect(() => {
    // Add mousemove listener
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  const removeParticle = (id: number) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: particle.x - particle.size / 2,
              y: particle.y - particle.size / 2,
              opacity: 1,
              scale: 1,
            }}
            animate={{
              y: particle.y - 50, // Float upward
              opacity: 0,
              scale: 0.3,
            }}
            exit={{
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: 1,
              ease: "easeOut",
            }}
            onAnimationComplete={() => removeParticle(particle.id)}
            className="absolute pointer-events-none"
            style={{
              fontSize: `${particle.size}px`,
            }}
          >
            {particle.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

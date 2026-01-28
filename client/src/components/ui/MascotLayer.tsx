import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * MascotLayer Component
 * 
 * Renders cute mascots with animations:
 * - Two dinos peek up from bottom-right (side-by-side)
 * - Flying bird GIF crosses screen slowly from left to right
 * 
 * Features:
 * - Random delays between dino appearances (10-15 seconds)
 * - Dinos stay visible for 6 seconds
 * - Smooth 2-second dino animations (staggered by 2 seconds)
 * - Flying bird: 15-20 second slow flight across top (left to right)
 * - Non-intrusive (pointer-events-none)
 */

export function MascotLayer() {
  // Debug: Verify component is mounting
  console.log("Mascot rendered");
  
  // State to control when dino should peek
  const [showDino, setShowDino] = useState(false);

  // Dino peek animation timing
  useEffect(() => {
    const scheduleNextDinoPeek = () => {
      // Random delay between 10-15 seconds
      const randomDelay = 10000 + Math.random() * 5000;
      
      const timeoutId = setTimeout(() => {
        setShowDino(true);
        
        // Stay visible for 3 seconds, then hide
        setTimeout(() => {
          setShowDino(false);
          // Schedule next peek after hiding
          scheduleNextDinoPeek();
        }, 6000);
      }, randomDelay);

      return timeoutId;
    };

    const timeoutId = scheduleNextDinoPeek();
    
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 50 }}>
      {/* Dino 1 - Peeks up from bottom-right */}
      <motion.img
        src="/assets/mascots/dino-peek.png"
        alt="Peeking Dino"
        className="absolute bottom-0 right-4 w-60 md:w-64 pointer-events-none"
        initial={{ y: "100%" }}
        animate={{ y: showDino ? "0%" : "100%" }}
        transition={{
          duration: 2,
          ease: "easeInOut",
        }}
        style={{
          filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))",
        }}
      />

      {/* Dino 2 - Peeks up next to Dino 1 (staggered animation) */}
      <motion.img
        src="/assets/mascots/dino2-peek.png"
        alt="Peeking Dino 2"
        className="absolute bottom-0 right-36 md:right-44 w-32 md:w-40 pointer-events-none"
        initial={{ y: "100%" }}
        animate={{ y: showDino ? "0%" : "100%" }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          delay: 2, // Staggered by 2 seconds
        }}
        style={{
          filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))",
        }}
      />

      {/* Flying Bird GIF - Flies horizontally from left to right across top */}
      <motion.img
        src="/assets/mascots/bird-fly.gif"
        alt="Flying Bird"
        className="absolute top-24 w-32 md:w-48 pointer-events-none"
        initial={{ x: "-100vw" }}
        animate={{ x: "100vw" }}
        transition={{
          duration: 15,
          ease: "linear",
          repeat: Infinity,
          repeatDelay: 10,
        }}
        style={{
          filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))",
        }}
      />
    </div>
  );
}

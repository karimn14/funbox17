import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Play, Check, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Stage {
  label: string;
  duration: number;
}

interface ReadingRaceActivityProps {
  sentences: string[];
  stages: Stage[];
  onComplete: () => void;
}

export function ReadingRaceActivity({
  sentences,
  stages,
  onComplete,
}: ReadingRaceActivityProps) {
  const [currentStep, setCurrentStep] = useState(0); // 0 = Stage 1, 1 = Stage 2
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showModal, setShowModal] = useState<'timeout' | 'success' | 'next' | null>(null);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number | null>(null);
  const [hoveredSentenceIndex, setHoveredSentenceIndex] = useState<number | null>(null);

  const currentStage = stages[currentStep];

  // Play timeout sound
  const playTimeoutSound = useCallback(() => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 300;
    oscillator.type = 'sawtooth';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.8);
  }, []);

  // Play success sound
  const playSuccessSound = useCallback(() => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          setShowModal('timeout');
          playTimeoutSound();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft, playTimeoutSound]);

  // Handle start button for current stage
  const handleStart = () => {
    setTimeLeft(currentStage.duration);
    setIsRunning(true);
  };

  // Handle "Selesai" (Stop) button
  const handleStop = () => {
    if (isRunning && timeLeft > 0) {
      setIsRunning(false);
      setCompletedStages(prev => [...prev, currentStep]);
      
      playSuccessSound();
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5, x: 0.5 },
        colors: ['#22c55e', '#86efac', '#fbbf24'],
      });
      
      // Check if this is the last stage
      if (currentStep === stages.length - 1) {
        setShowModal('success');
      } else {
        setShowModal('next');
      }
    }
  };

  // Handle modal close and progression
  const handleModalClose = () => {
    const modalType = showModal;
    setShowModal(null);
    
    if (modalType === 'success') {
      // Complete the activity (finished all stages)
      setTimeout(() => {
        onComplete();
      }, 500);
    } else if (modalType === 'next') {
      // Move to next stage
      setCurrentStep(prev => prev + 1);
      setTimeLeft(0);
      // Reset highlighting when moving to next stage
      setActiveSentenceIndex(null);
      setHoveredSentenceIndex(null);
    } else if (modalType === 'timeout') {
      // Reset current stage for retry
      setTimeLeft(0);
      // Keep highlighting state for retry
    }
  };

  // Handle sentence click - toggle active state
  const handleSentenceClick = (index: number) => {
    setActiveSentenceIndex(prev => prev === index ? null : index);
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-8 overflow-hidden relative">
      {/* Timer Display */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6"
      >
        <div className={`
          bg-white/95 backdrop-blur-sm px-12 py-6 rounded-3xl shadow-2xl border-4
          ${isRunning 
            ? timeLeft <= 10 
              ? 'border-red-500 animate-pulse' 
              : 'border-orange-500'
            : 'border-gray-300'
          }
        `}>
          <div className="flex items-center gap-4">
            <Timer className={`w-10 h-10 ${isRunning ? 'text-orange-600 animate-pulse' : 'text-gray-400'}`} />
            <p className="text-6xl font-display font-black text-gray-800 tabular-nums">
              {formatTime(timeLeft)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Reading Content */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 max-w-4xl max-h-[50vh] overflow-y-auto"
      >
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-8 h-8 text-orange-600" />
          <h3 className="text-2xl font-display font-bold text-gray-800">
            Bacaan {currentStep + 1}
          </h3>
        </div>
        
        <div className="space-y-6">
          {sentences.map((sentence, index) => {
            const isActive = index === activeSentenceIndex;
            const isHovered = index === hoveredSentenceIndex;
            
            return (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setHoveredSentenceIndex(index)}
                onMouseLeave={() => setHoveredSentenceIndex(null)}
                onClick={() => handleSentenceClick(index)}
                className={`
                  p-5 rounded-xl shadow-md border-l-4 cursor-pointer transition-all duration-200
                  ${isActive 
                    ? 'bg-yellow-200 border-yellow-400 ring-2 ring-yellow-400 scale-105' 
                    : isHovered 
                      ? 'bg-gray-100 border-orange-300' 
                      : 'bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-400'
                  }
                `}
              >
                <p className={`
                  text-xl font-body leading-relaxed transition-colors duration-200
                  ${isActive 
                    ? 'text-black font-semibold' 
                    : 'text-gray-800'
                  }
                `}>
                  {sentence}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Control Buttons */}
      <div className="flex gap-4 flex-wrap justify-center">
        {/* Show "Mulai" button when not running */}
        {!isRunning && timeLeft === 0 && (
          <motion.button
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            onClick={handleStart}
            className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-black text-xl px-8 py-4 rounded-full shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-3"
          >
            <Play className="w-6 h-6" />
            Mulai
          </motion.button>
        )}

        {/* Show "Selesai" button when timer is running */}
        {isRunning && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={handleStop}
            className="bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white font-black text-2xl px-12 py-5 rounded-full shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-3"
          >
            <Check className="w-8 h-8" />
            Selesai
          </motion.button>
        )}
      </div>

      {/* Instruction Text */}
      {!isRunning && timeLeft === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-xl font-body text-gray-600 text-center max-w-2xl"
        >
          {currentStep === 0 ? (
            <>
              <span className="font-bold text-orange-600">{currentStage.label}:</span> Klik "Mulai" dan baca semua kalimat dengan lantang dalam {currentStage.duration} detik! 📖
            </>
          ) : (
            <>
              <span className="font-bold text-orange-600">{currentStage.label}:</span> Klik "Mulai" dan baca lebih cepat dalam {currentStage.duration} detik! ⚡
            </>
          )}
        </motion.p>
      )}

      {isRunning && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-2xl font-display font-bold text-orange-600 text-center animate-pulse"
        >
          Baca semua kalimat dengan lantang! 📢
        </motion.p>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showModal === 'timeout' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-white rounded-3xl p-12 text-center shadow-2xl max-w-lg"
            >
              <div className="text-7xl mb-6">⏰</div>
              <h2 className="text-4xl font-display font-black text-red-600 mb-4">
                Waktu Habis!
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                Jangan khawatir, coba lagi dengan lebih cepat! 💪
              </p>
              <button
                onClick={handleModalClose}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black text-xl px-10 py-4 rounded-full shadow-xl hover:scale-105 transition-all duration-300"
              >
                Coba Lagi
              </button>
            </motion.div>
          </motion.div>
        )}

        {showModal === 'next' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-white rounded-3xl p-12 text-center shadow-2xl max-w-lg"
            >
              <div className="text-7xl mb-6">✅</div>
              <h2 className="text-4xl font-display font-black text-green-600 mb-4">
                {currentStage.label} Selesai!
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                Bagus sekali! Lanjut ke percobaan berikutnya! 
              </p>
              <button
                onClick={handleModalClose}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black text-xl px-10 py-4 rounded-full shadow-xl hover:scale-105 transition-all duration-300"
              >
                Lanjut
              </button>
            </motion.div>
          </motion.div>
        )}

        {showModal === 'success' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-white rounded-3xl p-12 text-center shadow-2xl max-w-lg"
            >
              <div className="text-7xl mb-6">🎉</div>
              <h2 className="text-4xl font-display font-black text-green-600 mb-4">
                Semua Percobaan Selesai!
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                Luar biasa! Kamu sudah menyelesaikan latihan membaca! 🌟
              </p>
              <button
                onClick={handleModalClose}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-black text-xl px-10 py-4 rounded-full shadow-xl hover:scale-105 transition-all duration-300"
              >
                Lanjut ke Kuis
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

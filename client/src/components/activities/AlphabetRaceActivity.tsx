import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Play, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Mode {
  label: string;
  duration: number;
}

interface AlphabetRaceActivityProps {
  letters: string; // Space-separated letters
  modes: Mode[];
  onComplete: () => void;
}

export function AlphabetRaceActivity({
  letters,
  modes,
  onComplete,
}: AlphabetRaceActivityProps) {
  const [currentStep, setCurrentStep] = useState(0); // 0 = Trial 1, 1 = Trial 2
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showModal, setShowModal] = useState<'timeout' | 'success' | 'next' | null>(null);
  const [completedTrials, setCompletedTrials] = useState<number[]>([]);

  const letterArray = letters.split(' ').filter(l => l.trim());
  const currentMode = modes[currentStep];

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

  // Handle start button for current trial
  const handleStart = () => {
    setTimeLeft(currentMode.duration);
    setIsRunning(true);
  };

  // Handle "Selesai" (Stop) button
  const handleStop = () => {
    if (isRunning && timeLeft > 0) {
      setIsRunning(false);
      setCompletedTrials(prev => [...prev, currentStep]);
      
      playSuccessSound();
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5, x: 0.5 },
        colors: ['#22c55e', '#86efac', '#fbbf24'],
      });
      
      // Check if this is the last trial
      if (currentStep === modes.length - 1) {
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
      // Complete the activity (finished all trials)
      setTimeout(() => {
        onComplete();
      }, 500);
    } else if (modalType === 'next') {
      // Move to next trial
      setCurrentStep(prev => prev + 1);
      setTimeLeft(0);
    } else if (modalType === 'timeout') {
      // Reset current trial for retry
      setTimeLeft(0);
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8 overflow-hidden relative">
      {/* Timer Display */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <div className={`
          bg-white/95 backdrop-blur-sm px-12 py-6 rounded-3xl shadow-2xl border-4
          ${isRunning 
            ? timeLeft <= 5 
              ? 'border-red-500 animate-pulse' 
              : 'border-blue-500'
            : 'border-gray-300'
          }
        `}>
          <div className="flex items-center gap-4">
            <Timer className={`w-10 h-10 ${isRunning ? 'text-blue-600 animate-pulse' : 'text-gray-400'}`} />
            <p className="text-6xl font-display font-black text-gray-800 tabular-nums">
              {formatTime(timeLeft)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Alphabet Grid */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 max-w-4xl"
      >
        <div className="grid grid-cols-7 gap-3 sm:gap-4">
          {letterArray.map((letter, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.02, type: "spring", stiffness: 200 }}
              className="bg-gradient-to-br from-purple-400 to-pink-500 text-white rounded-xl shadow-lg p-4 flex items-center justify-center aspect-square"
            >
              <span className="text-2xl sm:text-3xl md:text-4xl font-display font-black">
                {letter}
              </span>
            </motion.div>
          ))}
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
              <span className="font-bold text-purple-600">Percobaan 1:</span> Klik "Mulai" dan baca semua huruf dengan lantang dalam 20 detik! 🎯
            </>
          ) : (
            <>
              <span className="font-bold text-purple-600">Percobaan 2:</span> Klik "Mulai" dan baca lebih cepat dalam 10 detik! ⚡
            </>
          )}
        </motion.p>
      )}

      {isRunning && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-2xl font-display font-bold text-purple-600 text-center animate-pulse"
        >
          Baca semua huruf dengan lantang! 📢
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
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-black text-xl px-10 py-4 rounded-full shadow-xl hover:scale-105 transition-all duration-300"
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
                Percobaan {currentStep + 1} Selesai!
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                Bagus! Sekarang coba yang lebih cepat! ⚡
              </p>
              <button
                onClick={handleModalClose}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-black text-xl px-10 py-4 rounded-full shadow-xl hover:scale-105 transition-all duration-300"
              >
                Lanjut ke Percobaan {currentStep + 2}
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
                Hebat Sekali!
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                Kamu berhasil menyelesaikan semua percobaan! 🏆
              </p>
              <button
                onClick={handleModalClose}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black text-xl px-10 py-4 rounded-full shadow-xl hover:scale-105 transition-all duration-300"
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

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AnimalZone {
  top: string;
  left: string;
  width: string;
  height: string;
}

interface Animal {
  name: string;
  zone: AnimalZone;
  soundUrl: string;
}

interface AnimalMimicActivityProps {
  imageUrl: string;
  introAudio: string;
  animals: Animal[];
  closingAudio?: string;
  onComplete: () => void;
}

export function AnimalMimicActivity({
  imageUrl,
  introAudio,
  animals,
  closingAudio,
  onComplete,
}: AnimalMimicActivityProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [stage, setStage] = useState<'prompt' | 'waiting' | 'reveal'>('prompt');
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedAnimals, setCompletedAnimals] = useState<number[]>([]);

  const currentAnimal = animals[currentStep];

  // Text-to-Speech function
  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      utterance.lang = 'en-US';

      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      window.speechSynthesis.speak(utterance);
      console.log("🔊 Speaking:", text);
    }
  }, []);

  // Play animal sound
  const playAnimalSound = useCallback((soundUrl: string) => {
    const audio = new Audio(soundUrl);
    audio.volume = 0.7;
    audio.play().catch(err => {
      console.error("Failed to play animal sound:", err);
    });
  }, []);

  // Play success ping
  const playPingSound = useCallback(() => {
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

  // Speak intro on mount
  useEffect(() => {
    if (!isCompleted && currentStep === 0 && stage === 'prompt') {
      const timer = setTimeout(() => {
        speak(introAudio);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Speak instruction when entering prompt stage
  useEffect(() => {
    if (stage === 'prompt' && currentAnimal && !isCompleted) {
      const timer = setTimeout(() => {
        speak(`Make the sound of the ${currentAnimal.name}!`);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [stage, currentAnimal, isCompleted, speak]);

  // Handle zone click
  const handleZoneClick = useCallback(() => {
    if (stage !== 'waiting' || !currentAnimal) return;

    // Mark as completed
    setCompletedAnimals(prev => [...prev, currentStep]);
    playPingSound();

    // Move to reveal stage
    setStage('reveal');
    
    // Play the real animal sound
    playAnimalSound(currentAnimal.soundUrl);
    
    // Wait 2.5 seconds, then move to next animal or complete
    setTimeout(() => {
      if (currentStep < animals.length - 1) {
        setCurrentStep(currentStep + 1);
        setStage('prompt');
      } else {
        // All animals completed
        setIsCompleted(true);
        
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.5, x: 0.5 },
          colors: ['#22c55e', '#86efac', '#fbbf24'],
        });

        if (closingAudio) {
          setTimeout(() => {
            speak(closingAudio);
          }, 500);
        }

        setTimeout(() => {
          onComplete();
        }, 3500);
      }
    }, 2500);
  }, [stage, currentAnimal, currentStep, animals.length, playPingSound, playAnimalSound, closingAudio, speak, onComplete]);

  // Auto-transition from prompt to waiting after speaking
  useEffect(() => {
    if (stage === 'prompt') {
      const timer = setTimeout(() => {
        setStage('waiting');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [stage, currentStep]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-yellow-50 to-blue-50 overflow-hidden relative">
      {/* Background Image */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src={imageUrl}
          alt="Animals Meadow"
          className="w-full max-w-[50%] max-h-[95%] object-contain"
        />
      </div>

      {/* Instruction Banner */}
      {!isCompleted && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute top-6 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="bg-white/95 backdrop-blur-sm px-8 py-4 rounded-full shadow-2xl border-4 border-yellow-400">
            <div className="flex items-center gap-3">
              <Volume2 className="w-6 h-6 text-purple-600 animate-pulse" />
              <p className="text-lg md:text-xl font-bold text-gray-800">
                {stage === 'prompt' && currentAnimal && `Make the sound of the ${currentAnimal.name}!`}
                {stage === 'waiting' && currentAnimal && `Now click on the ${currentAnimal.name} to hear its sound!`}
                {stage === 'reveal' && currentAnimal && `Listen to the real ${currentAnimal.name}!`}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Progress Indicator */}
      {!isCompleted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-24 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full shadow-lg">
            <p className="text-sm font-bold text-gray-700">
              Animal {currentStep + 1} of {animals.length}
            </p>
          </div>
        </motion.div>
      )}

      {/* Interactive Animal Zones */}
      {!isCompleted && animals.map((animal, index) => {
        const isCurrentAnimal = index === currentStep;
        const isCompleted = completedAnimals.includes(index);
        const isActive = isCurrentAnimal && (stage === 'waiting' || stage === 'reveal');

        return (
          <motion.div
            key={animal.name}
            className="absolute z-10"
            style={{
              top: animal.zone.top,
              left: animal.zone.left,
              width: animal.zone.width,
              height: animal.zone.height,
            }}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: isCurrentAnimal ? 1 : isCompleted ? 0.3 : 0,
            }}
            transition={{ duration: 0.5 }}
          >
            {/* Pulsing Border for Active Animal */}
            {isActive && (
              <motion.div
                className="absolute inset-0 border-4 border-yellow-400 rounded-2xl bg-yellow-200/30"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: stage === 'waiting' ? [0.6, 1, 0.6] : 1,
                }}
                transition={{
                  duration: 1.5,
                  repeat: stage === 'waiting' ? Infinity : 0,
                  ease: "easeInOut",
                }}
              />
            )}

            {/* Clickable Zone */}
            {stage === 'waiting' && isCurrentAnimal && (
              <button
                onClick={handleZoneClick}
                className="absolute inset-0 cursor-pointer hover:bg-yellow-300/40 rounded-2xl transition-colors duration-300 flex items-center justify-center group"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-white/90 p-4 rounded-full shadow-xl group-hover:bg-white transition-colors"
                >
                  <Volume2 className="w-8 h-8 text-purple-600" />
                </motion.div>
              </button>
            )}

            {/* Reveal Stage - Show Checkmark */}
            {stage === 'reveal' && isCurrentAnimal && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="bg-green-500 p-4 rounded-full shadow-2xl">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
              </motion.div>
            )}

            {/* Completed Checkmark */}
            {isCompleted && !isCurrentAnimal && (
              <div className="absolute top-2 right-2">
                <div className="bg-green-500 p-2 rounded-full shadow-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            )}
          </motion.div>
        );
      })}

      {/* Completion Overlay */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="bg-white rounded-3xl p-12 text-center shadow-2xl max-w-lg"
            >
              <div className="text-6xl mb-4">🎵🐄🦆🐓🐕</div>
              <h2 className="text-4xl font-display font-black text-green-600 mb-4">
                Amazing Performance!
              </h2>
              <p className="text-xl text-gray-700">
                You've learned all the animal sounds!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

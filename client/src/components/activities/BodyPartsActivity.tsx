import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BodyPartZone {
  top: string;
  left: string;
  width: string;
  height: string;
}

interface BodyPartInstruction {
  part: string;
  text: string;
  zone: BodyPartZone;
}

interface BodyPartsActivityProps {
  imageUrl: string;
  instructions: BodyPartInstruction[];
  closingAudio?: string;
  onComplete: () => void;
}

export function BodyPartsActivity({
  imageUrl,
  instructions,
  closingAudio,
  onComplete,
}: BodyPartsActivityProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showError, setShowError] = useState(false);
  const [clickedZones, setClickedZones] = useState<number[]>([]);

  const currentInstruction = instructions[currentStep];

  // Text-to-Speech function
  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Use English voice
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      window.speechSynthesis.speak(utterance);
      console.log("🔊 Speaking:", text);
    }
  }, []);

  // Play success sound (using Web Audio API)
  const playPingSound = useCallback(() => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800; // Ping frequency
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  }, []);

  // Speak instruction when step changes
  useEffect(() => {
    if (currentInstruction && !isCompleted) {
      // Wait a bit for user to see the interface
      const timer = setTimeout(() => {
        speak(currentInstruction.text);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [currentStep, currentInstruction, isCompleted, speak]);

  // Speak closing message on completion
  useEffect(() => {
    if (isCompleted && closingAudio) {
      setTimeout(() => {
        speak(closingAudio);
      }, 1000);
    }
  }, [isCompleted, closingAudio, speak]);

  // Handle zone click
  const handleZoneClick = (zoneIndex: number) => {
    console.log("🖱️ Clicked zone:", zoneIndex, "Current step:", currentStep);

    if (zoneIndex === currentStep) {
      // Correct zone clicked
      console.log("✅ Correct!");
      playPingSound();
      speak("Good job!");

      setClickedZones(prev => [...prev, zoneIndex]);

      // Move to next step after a short delay
      setTimeout(() => {
        if (currentStep < instructions.length - 1) {
          setCurrentStep(currentStep + 1);
        } else {
          // All steps completed
          setIsCompleted(true);
        }
      }, 1500);
    } else {
      // Wrong zone clicked
      console.log("❌ Incorrect!");
      speak("Try again");
      setShowError(true);

      // Hide error animation after 800ms
      setTimeout(() => {
        setShowError(false);
      }, 800);
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 p-4">
      <div className="flex gap-6 w-full max-w-6xl h-[85vh]">
        {/* Instruction Panel - LEFT */}
        <div className="w-80 bg-white rounded-2xl p-6 shadow-lg border-2 border-orange-200 flex flex-col justify-center">
          {!isCompleted ? (
            <>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Body Parts Activity
                </h3>
                <p className="text-sm text-gray-600">
                  Step {currentStep + 1} of {instructions.length}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-gray-200 rounded-full mb-6 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-500"
                  style={{
                    width: `${((currentStep + 1) / instructions.length) * 100}%`,
                  }}
                />
              </div>

              {/* Current Instruction */}
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl p-6 text-center ${
                  showError ? 'animate-shake border-4 border-red-500' : ''
                }`}
              >
                <div className="text-5xl mb-4">👆</div>
                <p className="text-2xl font-bold text-gray-800">
                  {currentInstruction?.text}
                </p>
              </motion.div>

              {/* Hint */}
              <p className="text-center text-sm text-gray-500 mt-4">
                Click on the body part on the image →
              </p>
            </>
          ) : (
            /* Completion State */
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-3xl font-bold text-green-600 mb-4">
                Well Done!
              </h3>
              <p className="text-lg text-gray-700 mb-6">
                You've identified all body parts correctly!
              </p>
              <button
                onClick={onComplete}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform"
              >
                Continue to Quiz →
              </button>
            </motion.div>
          )}
        </div>

        {/* Body Diagram - RIGHT */}
        <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 flex items-center justify-center relative overflow-hidden">
          <div className="relative max-w-full max-h-full">
            {/* Body Parts Image */}
            <img
              src={imageUrl}
              alt="Body Parts Diagram"
              className="max-w-full max-h-[70vh] object-contain"
            />

            {/* Clickable Zones Overlay */}
            {!isCompleted && instructions.map((instruction, index) => (
              <motion.div
                key={index}
                onClick={() => handleZoneClick(index)}
                className={`absolute cursor-pointer transition-all ${
                  index === currentStep
                    ? 'bg-blue-400/30 border-4 border-blue-500 hover:bg-blue-400/50'
                    : clickedZones.includes(index)
                    ? 'bg-green-400/30 border-2 border-green-500'
                    : 'bg-transparent border-2 border-transparent hover:bg-gray-200/30'
                }`}
                style={{
                  top: instruction.zone.top,
                  left: instruction.zone.left,
                  width: instruction.zone.width,
                  height: instruction.zone.height,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Show checkmark on completed zones */}
                {clickedZones.includes(index) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl"></span>
                  </div>
                )}

                {/* Pulse animation on current zone */}
                {index === currentStep && (
                  <motion.div
                    className="absolute inset-0 bg-blue-400/20 rounded-lg"
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

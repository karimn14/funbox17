import { useParams, useLocation } from "wouter";
import { useModule, useSubmitQuiz } from "@/hooks/use-modules";
import { Layout } from "@/components/Layout";
import ReactPlayer from "react-player";
import { Home, History, RefreshCw, Play, Star, Check, X, Usb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useWebSerial } from "@/hooks/use-web-serial";
import { getActiveStudent } from "@/hooks/use-students";
import confetti from "canvas-confetti";
import type { ModuleContent } from "@shared/schema";

type Step = 'opening' | 'video' | 'activity' | 'quiz' | 'result';

type FeedbackState = {
  show: boolean;
  isCorrect: boolean;
};

export default function ModuleDetail() {
  const { id } = useParams<{ id: string }>();
  const [_, setLocation] = useLocation();
  const { data: module, isLoading } = useModule(Number(id));
  const submitQuiz = useSubmitQuiz();
  
  // Web Serial hardware control
  const { connect, isConnected, activeButton, sendCommand } = useWebSerial();
  
  // State machine
  const [step, setStep] = useState<Step>('opening');
  
  // Video state
  const [canProceedFromVideo, setCanProceedFromVideo] = useState(false);
  const [videoTimer, setVideoTimer] = useState(3);
  
  // Activity state (NOT scored)
  const [activityFeedback, setActivityFeedback] = useState<FeedbackState>({ show: false, isCorrect: false });
  
  // Quiz state (SCORED)
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<FeedbackState>({ show: false, isCorrect: false });
  const [correctCount, setCorrectCount] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(5);
  
  // Get student
  const student = getActiveStudent();

  // Parse module content
  const content: ModuleContent | null = module?.content || null;
  const legacyQuestions = module?.questions || [];
  
  // Video timer effect
  useEffect(() => {
    if (step === 'video' && !canProceedFromVideo) {
      const timer = setInterval(() => {
        setVideoTimer((prev) => {
          if (prev <= 1) {
            setCanProceedFromVideo(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, canProceedFromVideo]);
  
  // Hardware button handler for Activity step
  useEffect(() => {
    console.log("🎮 Activity Effect Triggered - activeButton:", activeButton, "| step:", step, "| feedback:", activityFeedback.show);
    
    // Strict check: ensure activeButton is a valid number (0-3)
    if (activeButton !== null && activeButton !== undefined && step === 'activity' && !activityFeedback.show) {
      console.log("🚀 Hardware Pressed (Activity):", activeButton);
      handleActivityAnswer(activeButton);
    } else if (activeButton !== null && activeButton !== undefined) {
      console.log("⚠️ Activity blocked - step:", step, "feedback showing:", activityFeedback.show);
    }
  }, [activeButton, step, activityFeedback.show]);
  
  // Hardware button handler for Quiz step
  useEffect(() => {
    console.log("🎮 Quiz Effect Triggered - activeButton:", activeButton, "| step:", step, "| feedback:", quizFeedback.show);
    
    // Strict check: ensure activeButton is a valid number (0-3)
    if (activeButton !== null && activeButton !== undefined && step === 'quiz' && !quizFeedback.show) {
      console.log("🚀 Hardware Pressed (Quiz):", activeButton);
      handleQuizAnswer(activeButton);
    } else if (activeButton !== null && activeButton !== undefined) {
      console.log("⚠️ Quiz blocked - step:", step, "feedback showing:", quizFeedback.show);
    }
  }, [activeButton, step, quizFeedback.show]);

  if (isLoading || !module) {
    return (
      <Layout>
        <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </Layout>
    );
  }

  // Handle Activity answer (NOT scored, practice mode)
  const handleActivityAnswer = (colorIndex: number) => {
    // Guard clause
    if (colorIndex === null || colorIndex === undefined) {
      console.log("⚠️ handleActivityAnswer called with invalid index:", colorIndex);
      return;
    }
    
    console.log(`🧐 Activity Check: Input=${colorIndex} (Type: ${typeof colorIndex}) vs Correct=${content?.activity?.correctIndex}`);
    
    if (!content?.activity) return;
    
    const isCorrect = colorIndex === content.activity.correctIndex;
    console.log(`🎯 Activity Result: ${isCorrect ? 'CORRECT ✅' : 'WRONG ❌'}`);
    
    // Send command to ESP32 hardware
    if (isCorrect) {
      sendCommand("WIN"); // Tell ESP32 to play "Correct" sound
    } else {
      sendCommand("LOSE"); // Tell ESP32 to play "Wrong" sound
    }
    
    setActivityFeedback({ show: true, isCorrect });
    
    if (isCorrect) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    
    // Auto-advance after 1.5s
    setTimeout(() => {
      setStep('quiz');
      setActivityFeedback({ show: false, isCorrect: false });
    }, 1500);
  };

  // Handle Quiz answer (SCORED, counts towards final score)
  const handleQuizAnswer = (colorIndex: number) => {
    // Guard clause
    if (colorIndex === null || colorIndex === undefined) {
      console.log("⚠️ handleQuizAnswer called with invalid index:", colorIndex);
      return;
    }
    
    if (!content?.quiz && legacyQuestions.length === 0) return;
    
    const questions = content?.quiz || legacyQuestions;
    const currentQuestion = questions[currentQuizIndex];
    
    if (!currentQuestion) return;
    
    // Check if correct
    let isCorrect = false;
    if (content?.quiz) {
      const correctAnswerText = String(currentQuestion.correctAnswer);
      const correctIndex = currentQuestion.options.map(o => String(o)).indexOf(correctAnswerText);
      console.log(`🧐 Quiz Check: Input=${colorIndex} (Type: ${typeof colorIndex}) vs Correct=${correctIndex} (correctAnswer: "${correctAnswerText}")`);
      isCorrect = colorIndex === correctIndex;
    } else {
      console.log(`🧐 Quiz Check (Legacy): Input=${colorIndex} (Type: ${typeof colorIndex}) vs Correct=${(currentQuestion as any).correctAnswer}`);
      isCorrect = colorIndex === (currentQuestion as any).correctAnswer;
    }
    
    console.log(`🎯 Quiz Result: ${isCorrect ? 'CORRECT ✅' : 'WRONG ❌'}`);
    
    // Send command to ESP32 hardware
    if (isCorrect) {
      sendCommand("WIN"); // Tell ESP32 to play "Correct" sound
    } else {
      sendCommand("LOSE"); // Tell ESP32 to play "Wrong" sound
    }
    
    if (isCorrect) {
      setCorrectCount(correctCount + 1);
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.7 }
      });
    }
    
    // Show feedback
    setQuizFeedback({ show: true, isCorrect });
    
    // Move to next question or result after 0.5s
    setTimeout(() => {
      setQuizFeedback({ show: false, isCorrect: false });
      
      if (currentQuizIndex < questions.length - 1) {
        setCurrentQuizIndex(currentQuizIndex + 1);
      } else {
        // Quiz complete
        setTotalQuestions(questions.length);
        
        // Calculate final score
        const finalScore = Math.round(((correctCount + (isCorrect ? 1 : 0)) / questions.length) * 100);
        const finalStars = finalScore >= 80 ? 3 : finalScore >= 60 ? 2 : 1;
        
        // Send victory command for perfect score
        if (finalScore === 100) {
          sendCommand("VICTORY"); // Tell ESP32 to play victory sound
        }
        
        // Submit to backend
        if (student) {
          submitQuiz.mutate({
            studentId: student.id,
            moduleId: Number(id),
            score: finalScore,
            stars: finalStars,
          });
        }
        
        // Big celebration
        confetti({
          particleCount: 200,
          spread: 120,
          origin: { y: 0.5 }
        });
        
        setStep('result');
      }
    }, 500);
  };

  const handleReset = () => {
    setStep('opening');
    setCanProceedFromVideo(false);
    setVideoTimer(3);
    setActivityFeedback({ show: false, isCorrect: false });
    setQuizFeedback({ show: false, isCorrect: false });
    setCurrentQuizIndex(0);
    setCorrectCount(0);
  };

  // Render 2x2 Colored Button Grid (Split-Screen - Auto-Fill)
  const renderColorButtons = (
    options: string[], 
    onSelect: (index: number) => void, 
    disabled: boolean = false
  ) => {
    const colors = [
      { bg: 'bg-red-500', border: 'border-red-700', text: 'text-white' },
      { bg: 'bg-blue-500', border: 'border-blue-700', text: 'text-white' },
      { bg: 'bg-green-500', border: 'border-green-700', text: 'text-white' },
      { bg: 'bg-yellow-400', border: 'border-yellow-600', text: 'text-black' },
    ];

    return (
      <div className="grid grid-cols-2 gap-4 h-full w-full">
        {options.map((text, idx) => {
          const color = colors[idx];
          
          return (
            <button
              key={idx}
              onClick={() => !disabled && onSelect(idx)}
              disabled={disabled}
              className={`
                h-full rounded-2xl text-2xl font-bold shadow-sm 
                transition-all border-b-[6px] active:border-b-0 active:translate-y-1
                ${color.bg} ${color.border} ${color.text}
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center px-4
              `}
            >
              {text}
            </button>
          );
        })}
      </div>
    );
  };

  return (
      <div className="h-screen w-full overflow-hidden bg-gray-50 flex flex-col">
        <AnimatePresence mode="wait">
          {/* STEP 1: OPENING */}
          {step === 'opening' && (
            <motion.div
              key="opening"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full w-full flex flex-col items-center justify-center text-center px-12 bg-gradient-to-br from-blue-50 to-purple-50"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-primary to-purple-500 rounded-full mb-8 flex items-center justify-center shadow-xl">
                <Star className="w-16 h-16 text-white" />
              </div>
              
              <h2 className="text-5xl font-bold text-gray-800 mb-6">
                {module.title}
              </h2>
              
              <p className="text-2xl text-gray-700 leading-relaxed mb-10 max-w-3xl">
                {content?.openingText || "Ayo belajar bersama!"}
              </p>
              
              <button
                onClick={() => setStep('video')}
                className="px-16 py-6 bg-green-500 hover:bg-green-600 border-b-[8px] border-green-700 text-white text-3xl font-bold rounded-2xl shadow-xl active:translate-y-1 active:border-b-0 transition-all inline-flex items-center gap-4"
              >
                <Play className="w-10 h-10" />
                Mulai Belajar
              </button>
            </motion.div>
          )}

          {/* STEP 2: VIDEO */}
          {step === 'video' && (
            <motion.div
              key="video"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full w-full flex flex-col"
            >
              {/* Header */}
              <div className="h-16 flex-none flex items-center justify-between px-8 bg-white border-b-2 border-gray-200">
                <h1 className="text-xl font-bold text-gray-800">{module.title}</h1>
                <div className="flex items-center gap-3">
                  <button
                    onClick={connect}
                    disabled={isConnected}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                      isConnected 
                        ? 'bg-green-100 text-green-700 cursor-default' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    <Usb className={`w-4 h-4 ${isConnected ? 'text-green-600' : 'text-gray-500'}`} />
                    {isConnected ? 'Connected' : 'Connect Hardware'}
                  </button>
                  <button
                    onClick={() => setLocation('/dashboard')}
                    className="px-5 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-colors"
                  >
                    Kembali
                  </button>
                </div>
              </div>

              {/* Video Content */}
              <div className="flex-1 flex flex-col justify-center items-center px-12 py-8">
                <div className="w-full max-w-5xl">
                  <div className="bg-black rounded-2xl overflow-hidden shadow-2xl mb-8 aspect-video">
                    <ReactPlayer 
                      url={content?.videoUrl || module.videoUrl} 
                      width="100%" 
                      height="100%" 
                      controls={true}
                      playing={step === 'video'}
                    />
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={() => {
                        setStep('activity');
                        setVideoTimer(3);
                        setCanProceedFromVideo(false);
                      }}
                      disabled={!canProceedFromVideo}
                      className={`px-16 py-5 text-3xl font-bold rounded-2xl shadow-lg border-b-[8px] active:translate-y-1 active:border-b-0 transition-all ${
                        canProceedFromVideo
                          ? 'bg-primary hover:bg-pink-600 border-pink-700 text-white'
                          : 'bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {canProceedFromVideo ? 'Lanjut' : `Tunggu ${videoTimer}s...`}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: ACTIVITY (Practice Mode) - 40/60 Split */}
          {step === 'activity' && content?.activity && (
            <motion.div
              key="activity"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full w-full flex flex-col"
            >
              {/* Section 1: Top Area (Header + Question) - 40% Height */}
              <div className="h-[40vh] w-full flex flex-col relative bg-white border-b-2 border-gray-200">
                {/* Header */}
                <div className="absolute top-0 left-0 w-full h-16 flex items-center justify-between px-8 z-10">
                  <h1 className="text-xl font-bold text-gray-800">{module.title}</h1>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={connect}
                      disabled={isConnected}
                      className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                        isConnected 
                          ? 'bg-green-100 text-green-700 cursor-default' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      <Usb className={`w-4 h-4 ${isConnected ? 'text-green-600' : 'text-gray-500'}`} />
                      {isConnected ? 'Connected' : 'Connect Hardware'}
                    </button>
                    <button
                      onClick={() => setLocation('/dashboard')}
                      className="px-5 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-colors"
                    >
                      Kembali
                    </button>
                  </div>
                </div>

                {/* Question Text - Centered in remaining space */}
                <div className="flex-1 flex items-center justify-center px-12 pt-16">
                  <h2 className="text-3xl font-bold text-center text-gray-800">
                    {content.activity.instruction}
                  </h2>
                </div>
              </div>

              {/* Section 2: Bottom Area (Buttons) - 60% Height */}
              <div className="h-[60vh] w-full p-4 relative">
                {renderColorButtons(
                  content.activity.options.map(opt => opt.text),
                  handleActivityAnswer,
                  activityFeedback.show
                )}

                {/* Feedback Overlay - TRANSPARENT */}
                <AnimatePresence>
                  {activityFeedback.show && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      >
                        {activityFeedback.isCorrect ? (
                          <Check className="w-40 h-40 text-green-500" strokeWidth={4} />
                        ) : (
                          <X className="w-40 h-40 text-red-500" strokeWidth={4} />
                        )}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* STEP 4: QUIZ (Scored Mode) - 40/60 Split */}
          {step === 'quiz' && (
            <motion.div
              key={`quiz-${currentQuizIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full w-full flex flex-col"
            >
              {/* Section 1: Top Area (Header + Question) - 40% Height */}
              <div className="h-[40vh] w-full flex flex-col relative bg-white border-b-2 border-gray-200">
                {/* Header */}
                <div className="absolute top-0 left-0 w-full h-16 flex items-center justify-between px-8 z-10">
                  <h1 className="text-xl font-bold text-gray-800">{module.title}</h1>
                  <div className="flex items-center gap-4">
                    {/* Score Display */}
                    <p className="text-base text-gray-600">
                      Benar: <span className="font-bold text-green-600">{correctCount}</span> dari {currentQuizIndex}
                    </p>
                    <button
                      onClick={connect}
                      disabled={isConnected}
                      className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                        isConnected 
                          ? 'bg-green-100 text-green-700 cursor-default' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      <Usb className={`w-4 h-4 ${isConnected ? 'text-green-600' : 'text-gray-500'}`} />
                      {isConnected ? 'Connected' : 'Connect'}
                    </button>
                    <button
                      onClick={() => setLocation('/dashboard')}
                      className="px-5 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-colors"
                    >
                      Kembali
                    </button>
                  </div>
                </div>

                {/* Question Text - Centered in remaining space */}
                <div className="flex-1 flex flex-col items-center justify-center px-12 pt-16">
                  <div className="inline-block px-6 py-2 bg-primary text-white rounded-full text-base font-bold mb-6">
                    Soal {currentQuizIndex + 1} dari {content?.quiz?.length || legacyQuestions.length}
                  </div>
                  
                  <h2 className="text-3xl font-bold text-center text-gray-800">
                    {content?.quiz?.[currentQuizIndex]?.question || (legacyQuestions[currentQuizIndex] as any)?.text || ''}
                  </h2>
                </div>
              </div>

              {/* Section 2: Bottom Area (Buttons) - 60% Height */}
              <div className="h-[60vh] w-full p-4 relative">
                {(() => {
                  const currentQuestion = content?.quiz?.[currentQuizIndex] || legacyQuestions[currentQuizIndex];
                  const options = currentQuestion?.options || [];
                  
                  return renderColorButtons(
                    options,
                    handleQuizAnswer,
                    quizFeedback.show
                  );
                })()}

                {/* Feedback Overlay - TRANSPARENT */}
                <AnimatePresence>
                  {quizFeedback.show && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.3, repeat: 2 }}
                      >
                        {quizFeedback.isCorrect ? (
                          <Check className="w-40 h-40 text-green-500" strokeWidth={4} />
                        ) : (
                          <X className="w-40 h-40 text-red-500" strokeWidth={4} />
                        )}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* STEP 5: RESULT */}
          {step === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="h-full w-full flex flex-col"
            >
              {/* Header */}
              <div className="h-16 flex-none flex items-center justify-between px-8 bg-white border-b-2 border-gray-200">
                <h1 className="text-xl font-bold text-gray-800">{module.title}</h1>
                <div className="flex items-center gap-3">
                  <button
                    onClick={connect}
                    disabled={isConnected}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                      isConnected 
                        ? 'bg-green-100 text-green-700 cursor-default' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    <Usb className={`w-4 h-4 ${isConnected ? 'text-green-600' : 'text-gray-500'}`} />
                    {isConnected ? 'Connected' : 'Connect Hardware'}
                  </button>
                  <button
                    onClick={() => setLocation('/dashboard')}
                    className="px-5 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-colors"
                  >
                    Kembali
                  </button>
                </div>
              </div>

              {/* Result Content */}
              <div className="flex-1 flex flex-col justify-center items-center text-center px-12 bg-gradient-to-br from-yellow-50 to-orange-50">
                {/* Star Icon */}
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full mb-8 flex items-center justify-center shadow-xl"
                >
                  <Star className="w-16 h-16 text-white fill-white" />
                </motion.div>

                {/* Encouragement */}
                <h2 className="text-5xl font-bold text-gray-800 mb-6">
                  {correctCount === totalQuestions ? 'Luar Biasa! 🎉' : 
                   correctCount >= totalQuestions * 0.8 ? 'Hebat Sekali! 🌟' :
                   correctCount >= totalQuestions * 0.6 ? 'Bagus! 👍' :
                   'Tetap Semangat! 💪'}
                </h2>

                {/* Closing Text */}
                <p className="text-2xl text-gray-700 mb-8 max-w-3xl">
                  {content?.closingText || 'Kamu sudah selesai belajar!'}
                </p>

                {/* Score Display */}
                <div className="bg-white rounded-3xl p-10 shadow-xl mb-10 border-4 border-yellow-300">
                  <p className="text-xl text-gray-600 mb-3">Hasil Kamu:</p>
                  <p className="text-7xl font-bold text-primary mb-4">
                    {correctCount}/{totalQuestions}
                  </p>
                  
                  {/* Star Rating */}
                  <div className="flex justify-center gap-3">
                    {Array.from({ length: 5 }).map((_, idx) => {
                      const percentage = (correctCount / totalQuestions) * 100;
                      const starsEarned = percentage >= 80 ? 5 : percentage >= 60 ? 4 : percentage >= 40 ? 3 : percentage >= 20 ? 2 : 1;
                      
                      return (
                        <span
                          key={idx}
                          className={`text-5xl transition-all ${
                            idx < starsEarned ? 'opacity-100' : 'opacity-20'
                          }`}
                        >
                          ⭐
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-6 max-w-4xl w-full">
                  <button
                    onClick={handleReset}
                    className="flex-1 px-8 py-5 bg-blue-500 hover:bg-blue-600 border-b-[8px] border-blue-700 text-white text-2xl font-bold rounded-2xl shadow-lg active:translate-y-1 active:border-b-0 transition-all flex items-center justify-center gap-3"
                  >
                    <RefreshCw className="w-7 h-7" />
                    Ulangi
                  </button>
                  
                  <button
                    onClick={() => setLocation("/dashboard")}
                    className="flex-1 px-8 py-5 bg-green-500 hover:bg-green-600 border-b-[8px] border-green-700 text-white text-2xl font-bold rounded-2xl shadow-lg active:translate-y-1 active:border-b-0 transition-all flex items-center justify-center gap-3"
                  >
                    <Home className="w-7 h-7" />
                    Beranda
                  </button>
                  
                  <button
                    onClick={() => setLocation("/history")}
                    className="flex-1 px-8 py-5 bg-purple-500 hover:bg-purple-600 border-b-[8px] border-purple-700 text-white text-2xl font-bold rounded-2xl shadow-lg active:translate-y-1 active:border-b-0 transition-all flex items-center justify-center gap-3"
                  >
                    <History className="w-7 h-7" />
                    Riwayat
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
}

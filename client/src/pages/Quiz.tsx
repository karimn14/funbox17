import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useModule, useSubmitQuiz } from "@/hooks/use-modules";
import { useWebSerial } from "@/hooks/use-web-serial";
import { getActiveStudent } from "@/hooks/use-students";
import { Layout } from "@/components/Layout";
import confetti from "canvas-confetti";
import { Check, X, Star, RotateCcw, Home } from "lucide-react";

export default function Quiz() {
  const { id } = useParams<{ id: string }>();
  const [_, setLocation] = useLocation();
  const { data: module } = useModule(Number(id));
  const student = getActiveStudent();
  const submitQuiz = useSubmitQuiz();
  const { activeButton, sendCommand } = useWebSerial();

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  // Handle hardware button press
  useEffect(() => {
    console.log("🎮 Quiz Effect Triggered - activeButton:", activeButton, "| isCompleted:", isCompleted, "| feedback:", feedback);
    
    // Strict check: ensure activeButton is a valid number (0-3)
    if (activeButton !== null && activeButton !== undefined && !isCompleted && !feedback && module) {
      console.log("🚀 Hardware Pressed (Quiz):", activeButton);
      handleAnswer(activeButton);
    } else if (activeButton !== null && activeButton !== undefined) {
      console.log("⚠️ Quiz blocked - isCompleted:", isCompleted, "feedback:", feedback, "module:", !!module);
    }
  }, [activeButton]);

  if (!module || !student) return null;

  const currentQuestion = module.questions[currentQuestionIdx];
  const totalQuestions = module.questions.length;

  const handleAnswer = (optionIdx: number) => {
    // Guard clause
    if (optionIdx === null || optionIdx === undefined) {
      console.log("⚠️ handleAnswer called with invalid index:", optionIdx);
      return;
    }
    
    if (feedback) return; // Prevent double taps

    console.log(`🧐 Quiz Check: Input=${optionIdx} (Type: ${typeof optionIdx}) vs Correct=${currentQuestion.correctAnswer}`);
    
    const isCorrect = optionIdx === currentQuestion.correctAnswer;
    console.log(`🎯 Quiz Result: ${isCorrect ? 'CORRECT ✅' : 'WRONG ❌'}`);
    
    // Send command to ESP32 hardware
    if (isCorrect) {
      sendCommand("WIN"); // Tell ESP32 to play "Correct" sound
    } else {
      sendCommand("LOSE"); // Tell ESP32 to play "Wrong" sound
    }
    
    setFeedback(isCorrect ? "correct" : "wrong");

    if (isCorrect) {
      setScore(prev => prev + 1);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#2DD4BF', '#FF7EB6']
      });
    }

    // Delay for feedback animation
    setTimeout(() => {
      setFeedback(null);
      if (currentQuestionIdx < totalQuestions - 1) {
        setCurrentQuestionIdx(prev => prev + 1);
      } else {
        finishQuiz();
      }
    }, 1500);
  };

  const finishQuiz = async () => {
    const finalScore = Math.round(((score + (feedback === "correct" ? 1 : 0)) / totalQuestions) * 100);
    const stars = finalScore === 100 ? 3 : finalScore >= 60 ? 2 : 1;
    
    setIsCompleted(true);
    
    // Send victory command for perfect score
    if (finalScore === 100) {
      sendCommand("VICTORY"); // Tell ESP32 to play victory sound
    }
    
    if (stars === 3) {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 }
      });
    }

    try {
      await submitQuiz.mutateAsync({
        studentId: student.id,
        moduleId: Number(id),
        score: finalScore,
        stars
      });
    } catch (e) {
      console.error(e);
    }
  };

  const buttonColors = [
    "bg-red-500 border-red-600 shadow-red-500/30",
    "bg-blue-500 border-blue-600 shadow-blue-500/30",
    "bg-green-500 border-green-600 shadow-green-500/30",
    "bg-yellow-400 border-yellow-500 shadow-yellow-400/30 text-yellow-900",
  ];

  if (isCompleted) {
    const finalScore = Math.round((score / totalQuestions) * 100);
    const correctCount = score;
    const wrongCount = totalQuestions - score;
    const encouragement = finalScore >= 80 ? "Hebat! Kamu Luar Biasa!" : "Semangat! Coba Lagi Yuk!";
    const scoreColor = finalScore >= 50 ? "text-green-500 border-green-500" : "text-pink-500 border-pink-500";

    return (
      <Layout>
        <div className="flex-1 flex flex-col items-center justify-center py-8">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border-4 border-white ring-8 ring-primary/5 max-w-xl w-full text-center relative overflow-hidden"
          >
            <h2 className="text-4xl font-display font-bold mb-8 text-foreground">Hasil Kuis</h2>

            {/* Circular Progress */}
            <div className="relative w-48 h-48 mx-auto mb-4 flex items-center justify-center">
              <div className={`absolute inset-0 rounded-full border-[12px] opacity-20 ${scoreColor}`} />
              <div className={`w-full h-full rounded-full border-[12px] flex items-center justify-center font-display font-black text-4xl ${scoreColor}`}>
                {correctCount}/{totalQuestions}
              </div>
            </div>
            <div className={`text-2xl font-bold mb-6 ${scoreColor}`}>{finalScore}%</div>

            <h3 className="text-2xl font-display font-bold text-gray-700 mb-8">
              {encouragement}
            </h3>

            {/* Summary Card */}
            <div className="bg-yellow-50 rounded-3xl p-6 mb-6 text-left border-2 border-yellow-100 shadow-sm space-y-3">
              <div className="flex justify-between items-center text-lg">
                <span className="text-gray-500 font-bold uppercase text-sm tracking-wider">Nama:</span>
                <span className="font-display font-bold text-gray-800">{student.name}</span>
              </div>
              <div className="flex justify-between items-center text-lg">
                <span className="text-gray-500 font-bold uppercase text-sm tracking-wider">Modul:</span>
                <span className="font-display font-bold text-gray-800">{module.title}</span>
              </div>
              <div className="flex justify-between items-center text-lg">
                <span className="text-gray-500 font-bold uppercase text-sm tracking-wider">Benar:</span>
                <span className="font-display font-bold text-green-600">{correctCount} soal</span>
              </div>
              <div className="flex justify-between items-center text-lg">
                <span className="text-gray-500 font-bold uppercase text-sm tracking-wider">Salah:</span>
                <span className="font-display font-bold text-pink-600">{wrongCount} soal</span>
              </div>
            </div>

            {/* Status Bar */}
            <div className="bg-green-500 text-white py-3 px-6 rounded-2xl mb-8 font-bold text-center flex items-center justify-center gap-2">
              <Check className="w-5 h-5" /> Hasil sudah disimpan ke riwayat!
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => setLocation("/dashboard")}
                className="px-6 py-4 bg-blue-400 text-white rounded-2xl font-bold shadow-lg shadow-blue-400/20 btn-push hover:brightness-105 flex items-center gap-2"
              >
                <Home className="w-5 h-5" /> Beranda
              </button>
              <button
                onClick={() => setLocation("/history")}
                className="px-6 py-4 bg-green-500 text-white rounded-2xl font-bold shadow-lg shadow-green-500/20 btn-push hover:brightness-105 flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" /> Riwayat
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-4 bg-pink-500 text-white rounded-2xl font-bold shadow-lg shadow-pink-500/20 btn-push hover:brightness-105 flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" /> Coba Lagi
              </button>
            </div>
          </motion.div>

          <div className="mt-8 bg-yellow-400 text-yellow-950 py-3 px-8 rounded-full font-black text-lg shadow-xl shadow-yellow-400/20">
            Terus belajar dan raih prestasi terbaikmu!
          </div>
        </div>
      </Layout>
    );
  }
// ... bagian atas kode tetap sama ...

  return (
    // ROOT CONTAINER: Kunci utama agar tidak scroll
    // h-screen: Tinggi pas layar
    // w-full: Lebar pas layar (bukan w-screen yang suka bikin scroll horizontal)
    // overflow-hidden: Potong semua yang keluar batas
    <div className="h-screen w-full overflow-hidden flex flex-col bg-gray-50">
      
      {/* Progress Bar (Top) */}
      <div className="w-full h-2 bg-gray-200 flex-shrink-0">
        <motion.div 
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${((currentQuestionIdx + 1) / totalQuestions) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* WRAPPER TENGAH: Membatasi lebar agar tidak terlalu "gepeng" di monitor lebar */}
      <div className="flex-1 flex flex-col w-full max-w-6xl mx-auto h-full">

          {/* Top Section (Question Area) - 40% Height */}
          {/* flex-[0.4] artinya ambil 40% ruang vertikal */}
          <div className="flex-[0.4] w-full flex flex-col items-center justify-center px-8 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIdx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full text-center"
              >
                <div className="mb-4">
                  <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                    Soal {currentQuestionIdx + 1} / {totalQuestions}
                  </span>
                </div>
                
                {/* Judul Soal: Gunakan text-balance agar barisnya rapi */}
                <h2 className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight text-balance">
                  {currentQuestion.text}
                </h2>
              </motion.div>
            </AnimatePresence>

            {/* Feedback Overlay (Benar/Salah) */}
            {feedback && (
              <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1.5, rotate: [0, 10, -10, 0] }}
                  className="drop-shadow-2xl"
                >
                  {feedback === "correct" ? (
                    <Check className="w-40 h-40 text-green-500 fill-green-100" strokeWidth={3} />
                  ) : (
                    <X className="w-40 h-40 text-red-500 fill-red-100" strokeWidth={3} />
                  )}
                </motion.div>
              </div>
            )}
          </div>

          {/* Bottom Section (Answer Grid) - 60% Height */}
          {/* flex-[0.6] artinya ambil 60% ruang vertikal */}
          <div className="flex-[0.6] w-full p-4 pb-6">
            <div className="grid grid-cols-2 gap-4 w-full h-full">
              {currentQuestion.options.map((option, idx) => {
                const colors = [
                  { bg: 'bg-red-500', border: 'border-red-700', text: 'text-white' },
                  { bg: 'bg-blue-500', border: 'border-blue-700', text: 'text-white' },
                  { bg: 'bg-green-500', border: 'border-green-700', text: 'text-white' },
                  { bg: 'bg-yellow-400', border: 'border-yellow-600', text: 'text-black' },
                ];
                const color = colors[idx];
                const keys = ['A', 'B', 'C', 'D'];

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={feedback !== null}
                    className={`
                      w-full h-full rounded-2xl text-xl md:text-3xl font-bold shadow-md 
                      border-b-[8px] transition-transform active:border-b-0 active:translate-y-2
                      ${color.bg} ${color.border} ${color.text}
                      disabled:opacity-80 disabled:cursor-not-allowed
                      flex items-center justify-center gap-4 px-6 relative group overflow-hidden
                    `}
                  >
                    {/* Efek Kilau Putih saat hover */}
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />

                    <span className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-xl flex items-center justify-center font-bold text-xl md:text-2xl border-2 border-white/30">
                      {keys[idx]}
                    </span>
                    <span className="text-center leading-snug">
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

      </div>
    </div>
  );
}


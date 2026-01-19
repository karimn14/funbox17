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
  const { activeButton } = useWebSerial();

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  // Handle hardware button press
  useEffect(() => {
    if (activeButton !== null && !isCompleted && !feedback && module) {
      handleAnswer(activeButton);
    }
  }, [activeButton]);

  if (!module || !student) return null;

  const currentQuestion = module.questions[currentQuestionIdx];
  const totalQuestions = module.questions.length;

  const handleAnswer = (optionIdx: number) => {
    if (feedback) return; // Prevent double taps

    const isCorrect = optionIdx === currentQuestion.correctAnswer;
    
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

  return (
    <Layout>
      <div className="max-w-4xl mx-auto h-full flex flex-col">
        {/* Progress Bar */}
        <div className="w-full h-4 bg-white rounded-full mb-8 overflow-hidden shadow-sm">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestionIdx) / totalQuestions) * 100}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIdx}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              className="bg-white p-8 md:p-12 rounded-[2rem] shadow-lg mb-8 text-center border-b-8 border-gray-100 min-h-[200px] flex items-center justify-center relative overflow-hidden"
            >
              {feedback && (
                <div className={`absolute inset-0 flex items-center justify-center z-10 ${feedback === "correct" ? "bg-green-500/10" : "bg-red-500/10"}`}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1.5 }}
                    className={`p-6 rounded-full ${feedback === "correct" ? "bg-green-500" : "bg-red-500"} text-white shadow-xl`}
                  >
                    {feedback === "correct" ? <Check size={48} strokeWidth={4} /> : <X size={48} strokeWidth={4} />}
                  </motion.div>
                </div>
              )}
              <h2 className="text-2xl md:text-4xl font-display font-bold text-foreground leading-relaxed">
                {currentQuestion.text}
              </h2>
            </motion.div>
          </AnimatePresence>

          {/* Answer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {currentQuestion.options.map((option, idx) => {
              const keys = ['A', 'B', 'C', 'D'];
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className={`
                    group relative p-6 md:p-8 rounded-2xl border-b-8 transition-all active:border-b-0 active:translate-y-2
                    ${buttonColors[idx]} text-white text-left overflow-hidden
                  `}
                >
                  <div className="relative z-10 flex items-center gap-4">
                    <span className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center font-bold text-xl border-2 border-white/30">
                      {keys[idx]}
                    </span>
                    <span className="text-xl md:text-2xl font-bold shadow-black/10 drop-shadow-md">
                      {option}
                    </span>
                  </div>
                  {/* Highlight effect */}
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                </button>
              );
            })}
          </div>

          <p className="text-center mt-8 text-muted-foreground text-sm font-semibold opacity-70">
            Tekan tombol A, B, C, atau D pada keyboard atau klik jawaban di atas.
          </p>
        </div>
      </div>
    </Layout>
  );
}

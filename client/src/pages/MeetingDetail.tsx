import { useParams, useLocation } from "wouter";
import { useMeeting, useRecordProgress } from "@/hooks/use-meetings";
import { Home, Star, Check, X, ArrowRight, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { useSerial } from "@/context/SerialContext";
import { getActiveStudent } from "@/hooks/use-students";
import confetti from "canvas-confetti";
import type { MeetingContent, Activity, VideoInteraction } from "@shared/schema";

type Step = 'opening' | 'story' | 'video' | 'activity' | 'quiz' | 'result';

type FeedbackState = {
  show: boolean;
  isCorrect: boolean;
};

type Feedback = 'correct' | 'incorrect' | null;

export default function MeetingDetail() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const [_, setLocation] = useLocation();
  const { data: meeting, isLoading } = useMeeting(Number(meetingId));
  const recordProgress = useRecordProgress();
  
  // Web Serial hardware control - USE CONTEXT
  const { activeButton, sendCommand } = useSerial();
  
  // State machine
  const [step, setStep] = useState<Step>('opening');
  
  // Activity state
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [activityFeedback, setActivityFeedback] = useState<FeedbackState>({ show: false, isCorrect: false });
  
  // Quiz state (SCORED)
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<FeedbackState>({ show: false, isCorrect: false });
  const [correctCount, setCorrectCount] = useState(0);
  
  // Giant feedback overlay state
  const [feedback, setFeedback] = useState<Feedback>(null);
  
  // Get student
  const student = getActiveStudent();

  // Parse meeting content
  const content: MeetingContent | null = meeting?.content || null;
  
  // Debug logging - Track data arrival
  useEffect(() => {
    console.log("📥 Frontend Received Meeting:", meeting);
    console.log("📦 Parsed Content:", content);
    console.log("🔄 Loading State:", isLoading);
    console.log("📍 Current Step:", step);
  }, [meeting, content, isLoading, step]);
  
  // Handle Activity answer with hardware buttons (Button 0-3 for A-D, Button 5 for Back)
  const handleActivityAnswer = useCallback((buttonIndex: number) => {
    // Button 5 is back button
    if (buttonIndex === 5) {
      setLocation("/");
      return;
    }
    
    // Buttons 0-3 map to answers A-D
    if (buttonIndex < 0 || buttonIndex > 3) return;
    
    if (!content?.activities) return;
    
    const currentActivity = content.activities[currentActivityIndex];
    if (!currentActivity) return;
    
    const isCorrect = buttonIndex === currentActivity.correctIndex;
    
    if (isCorrect) {
      sendCommand("WIN");
      setFeedback('correct');
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5, x: 0.5 },
        colors: ['#22c55e', '#86efac'],
        shapes: ['circle']
      });
    } else {
      sendCommand("LOSE");
      setFeedback('incorrect');
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5, x: 0.5 },
        colors: ['#ef4444', '#fca5a5'],
        shapes: ['circle']
      });
    }
    
    setActivityFeedback({ show: true, isCorrect });
    
    setTimeout(() => {
      setActivityFeedback({ show: false, isCorrect: false });
      setFeedback(null);
      
      // Move to next activity or quiz
      if (currentActivityIndex < content.activities!.length - 1) {
        setCurrentActivityIndex(currentActivityIndex + 1);
      } else {
        setStep('quiz');
      }
    }, 1500);
  }, [content, currentActivityIndex, sendCommand, setLocation]);

  // Handle Quiz answer with hardware buttons (Button 0-3 for A-D, Button 5 for Back)
  const handleQuizAnswer = useCallback((buttonIndex: number) => {
    // Button 5 is back button
    if (buttonIndex === 5) {
      setLocation("/");
      return;
    }
    
    // Buttons 0-3 map to answers A-D
    if (buttonIndex < 0 || buttonIndex > 3) return;
    
    if (!content?.quiz) return;
    
    const currentQuestion = content.quiz[currentQuizIndex];
    if (!currentQuestion) return;
    
    const correctAnswerText = String(currentQuestion.correctAnswer);
    const correctIndex = currentQuestion.options.map(o => String(o)).indexOf(correctAnswerText);
    const isCorrect = buttonIndex === correctIndex;
    
    // Send WIN/LOSE command to FunBox
    if (isCorrect) {
      sendCommand("WIN");
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#6ee7b7']
      });
      setCorrectCount(correctCount + 1);
      setFeedback('correct');
    } else {
      sendCommand("LOSE");
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#ef4444', '#f87171', '#fca5a5']
      });
      setFeedback('incorrect');
    }
    
    // Show feedback
    setQuizFeedback({ show: true, isCorrect });
    
    // Auto advance to next question or result
    setTimeout(() => {
      setQuizFeedback({ show: false, isCorrect: false });
      setFeedback(null);
      if (currentQuizIndex < content.quiz.length - 1) {
        setCurrentQuizIndex(currentQuizIndex + 1);
      } else {
        // Quiz complete - calculate and save
        const totalQuestions = content.quiz.length;
        const score = Math.round(((correctCount + (isCorrect ? 1 : 0)) / totalQuestions) * 100);
        const stars = score >= 80 ? 3 : score >= 60 ? 2 : 1;
        
        if (student && meeting) {
          recordProgress.mutate({
            studentId: student.id,
            meetingId: meeting.id,
            score,
            stars,
          });
        }
        
        setStep('result');
      }
    }, 1500);
  }, [content, currentQuizIndex, correctCount, student, meeting, sendCommand, setLocation, recordProgress]);
  
  // Hardware button handler for Activities
  useEffect(() => {
    if (activeButton !== null && activeButton !== undefined && step === 'activity' && !activityFeedback.show) {
      handleActivityAnswer(activeButton);
    }
  }, [activeButton, step, activityFeedback.show, handleActivityAnswer]);
  
  // Hardware button handler for Quiz
  useEffect(() => {
    if (activeButton !== null && activeButton !== undefined && step === 'quiz' && !quizFeedback.show) {
      handleQuizAnswer(activeButton);
    }
  }, [activeButton, step, quizFeedback.show, handleQuizAnswer]);

  // Improved Loading State Check
  if (isLoading) {
    return (
      <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-gray-50 z-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-xl font-semibold text-gray-600">Memuat pertemuan...</p>
        </div>
      </div>
    );
  }

  // Error State - Meeting Not Found
  if (!meeting) {
    return (
      <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-gray-50 z-50 flex items-center justify-center">
        <div className="text-center space-y-4 px-8">
          <div className="text-6xl">❌</div>
          <h2 className="text-3xl font-bold text-red-600">Data Error: Meeting not found</h2>
          <p className="text-gray-600">Meeting ID: {meetingId}</p>
          <button
            onClick={() => setLocation("/dashboard")}
            className="bg-primary text-white px-8 py-3 rounded-full text-lg font-bold mt-4"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Content Validation - Ensure content exists
  if (!content) {
    return (
      <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-gray-50 z-50 flex items-center justify-center">
        <div className="text-center space-y-4 px-8">
          <div className="text-6xl">⚠️</div>
          <h2 className="text-3xl font-bold text-yellow-600">Content Missing</h2>
          <p className="text-gray-600">Meeting loaded but content is empty</p>
          <pre className="text-left bg-gray-100 p-4 rounded text-xs overflow-auto max-w-lg">
            {JSON.stringify(meeting, null, 2)}
          </pre>
          <button
            onClick={() => setLocation("/dashboard")}
            className="bg-primary text-white px-8 py-3 rounded-full text-lg font-bold mt-4"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  // === STEP RENDERING ===
  
  if (step === 'opening') {
    // Determine next step based on content structure
    const nextStep = content?.story ? 'story' : 'video';
    
    return (
      <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-gray-50 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl text-center space-y-8 px-8"
        >
          <h1 className="text-5xl font-display font-black text-primary">
            {meeting.title}
          </h1>
          <p className="text-2xl font-body text-foreground leading-relaxed">
            {content?.openingText || "Mari kita mulai belajar!"}
          </p>
          <button
            onClick={() => setStep(nextStep)}
            className="bg-primary text-white px-12 py-6 rounded-full text-2xl font-bold shadow-xl btn-push hover:scale-105 hover:shadow-2xl transition-all duration-300"
          >
            ▶️ Mulai Belajar
          </button>
        </motion.div>
      </div>
    );
  }

  if (step === 'story') {
    return (
      <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 z-50">
        <div className="h-full flex flex-col items-center justify-center p-8">
          {/* Story Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-12 max-h-[80vh] overflow-y-auto"
          >
            {/* Story Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Story Title */}
            <h2 className="text-4xl font-display font-black text-center text-gray-800 mb-8">
              Cerita Petualangan Sani
            </h2>

            {/* Story Text */}
            <div className="prose prose-lg max-w-none">
              {content?.story?.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-xl font-body text-gray-700 leading-relaxed mb-6">
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>

          {/* Continue Button */}
          <button
            onClick={() => setStep('video')}
            className="mt-8 bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white font-black text-2xl px-12 py-6 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-4"
          >
            Lanjut ke Video
            <ArrowRight className="w-8 h-8" />
          </button>

          {/* Home Button */}
          <button
            onClick={() => setLocation("/")}
            className="absolute top-8 left-8 bg-white/90 p-4 rounded-full shadow-lg hover:bg-white transition-colors"
          >
            <Home className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>
    );
  }

  if (step === 'video') {
    // Helper function to extract YouTube Video ID from various URL formats
    const getYouTubeVideoId = (url: string): string | null => {
      if (!url) return null;
      
      // Handle youtu.be/ID format
      const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
      if (shortMatch) return shortMatch[1];
      
      // Handle youtube.com/watch?v=ID format
      const longMatch = url.match(/youtube\.com\/watch\?v=([^&]+)/);
      if (longMatch) return longMatch[1];
      
      // Handle youtube.com/embed/ID format
      const embedMatch = url.match(/youtube\.com\/embed\/([^?&]+)/);
      if (embedMatch) return embedMatch[1];
      
      return null;
    };

    const rawUrl = content?.videos?.[0]?.url || "";
    const videoId = getYouTubeVideoId(rawUrl);

    return (
      <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 z-50">
        <div className="h-full flex flex-col items-center justify-center p-8 gap-6">
          {/* Video Container */}
          <div className="w-full max-w-5xl">
            <div className="relative w-full pt-[56.25%] bg-black rounded-3xl overflow-hidden shadow-2xl">
              {videoId ? (
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                  title="Video Pembelajaran"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white bg-red-900/50">
                  <div className="text-center p-8">
                    <p className="text-3xl mb-4">❌ Video tidak ditemukan</p>
                    <p className="text-sm text-gray-300">URL video tidak valid</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={() => {
              // Go to activities if they exist, otherwise go to quiz
              if (content?.activities && content.activities.length > 0) {
                setStep('activity');
              } else {
                setStep('quiz');
              }
            }}
            className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-black text-2xl px-12 py-6 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-4"
          >
            {content?.activities && content.activities.length > 0 ? 'Lanjut ke Aktivitas' : 'Lanjut ke Kuis'}
            <ArrowRight className="w-8 h-8" />
          </button>

          {/* Home Button */}
          <button
            onClick={() => setLocation("/")}
            className="absolute top-8 left-8 bg-white/90 p-4 rounded-full shadow-lg hover:bg-white transition-colors"
          >
            <Home className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Giant Feedback Overlay */}
        {feedback && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20 backdrop-blur-sm animate-in fade-in">
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1.5, rotate: 0, transition: { type: "spring", bounce: 0.5 } }}
              exit={{ scale: 0 }}
              className="drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
            >
              {feedback === 'correct' ? (
                <span className="text-[150px]">✅</span>
              ) : (
                <span className="text-[150px]">❌</span>
              )}
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  if (step === 'activity') {
    const activities = content?.activities || [];
    const currentActivity = activities[currentActivityIndex];

    if (!currentActivity) {
      // No more activities, go to quiz
      setStep('quiz');
      return null;
    }

    const colors = ["red", "blue", "green", "yellow"];
    const bgColors: any = {
      red: 'bg-red-500 hover:bg-red-600',
      blue: 'bg-blue-500 hover:bg-blue-600',
      green: 'bg-green-500 hover:bg-green-600',
      yellow: 'bg-yellow-500 hover:bg-yellow-600',
    };

    return (
      <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 z-50 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          {/* Progress */}
          <div className="mb-6 text-center">
            <p className="text-xl font-bold text-gray-600">
              Aktivitas {currentActivityIndex + 1} dari {activities.length}
            </p>
            <div className="w-64 h-3 bg-gray-200 rounded-full mt-2 mx-auto overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-400 to-cyan-500 transition-all duration-500"
                style={{ width: `${((currentActivityIndex + 1) / activities.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Activity Card */}
          <motion.div
            key={currentActivityIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-3xl w-full shadow-2xl"
          >
            <h2 className="text-3xl font-display font-bold text-center mb-6 text-gray-800">
              {currentActivity.instruction}
            </h2>
            
            {currentActivity.imageUrl && (
              <img
                src={currentActivity.imageUrl}
                alt="Activity"
                className="w-full h-64 object-cover rounded-2xl mb-6 shadow-md"
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              {currentActivity.options.map((option, index) => {
                const colorClass = colors[index];
                const bgClass = bgColors[colorClass];

                return (
                  <button
                    key={index}
                    onClick={() => handleActivityAnswer(index)}
                    disabled={activityFeedback.show}
                    className={`
                      ${bgClass} text-white
                      p-6 rounded-2xl font-display font-bold text-xl
                      shadow-lg btn-push
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all duration-200
                    `}
                  >
                    {option.text}
                  </button>
                );
              })}
            </div>

            {activityFeedback.show && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`
                  mt-6 p-4 rounded-2xl text-center text-white font-bold text-2xl
                  ${activityFeedback.isCorrect ? 'bg-green-500' : 'bg-red-500'}
                `}
              >
                {activityFeedback.isCorrect ? '✅ Benar!' : '❌ Coba Lagi!'}
              </motion.div>
            )}
          </motion.div>

          {/* Home Button */}
          <button
            onClick={() => setLocation("/")}
            className="absolute top-8 left-8 bg-white/90 p-4 rounded-full shadow-lg hover:bg-white transition-colors"
          >
            <Home className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Giant Feedback Overlay */}
        {feedback && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20 backdrop-blur-sm animate-in fade-in">
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1.5, rotate: 0, transition: { type: "spring", bounce: 0.5 } }}
              exit={{ scale: 0 }}
              className="drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
            >
              {feedback === 'correct' ? (
                <span className="text-[150px]">✅</span>
              ) : (
                <span className="text-[150px]">❌</span>
              )}
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  if (step === 'quiz') {
    const questions = content?.quiz || [];
    const currentQuestion = questions[currentQuizIndex];

    if (!currentQuestion) {
      return <div>No quiz questions available</div>;
    }

    const colors = ["red", "blue", "green", "yellow", "purple"];

    return (
      <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-gray-50 z-50 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          {/* Progress */}
          <div className="w-full max-w-2xl mb-8">
            <div className="flex justify-between text-sm font-body text-muted-foreground mb-2">
              <span>Pertanyaan {currentQuizIndex + 1}/{questions.length}</span>
              <span>Skor: {correctCount}/{currentQuizIndex}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-primary h-3 rounded-full transition-all"
                style={{ width: `${((currentQuizIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <motion.div
            key={currentQuizIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl p-8 shadow-2xl max-w-2xl w-full"
          >
            <h2 className="text-3xl font-display font-bold text-center mb-8 text-primary">
              {currentQuestion.question}
            </h2>

            {currentQuestion.imageUrl && (
              <img
                src={currentQuestion.imageUrl}
                alt="Question"
                className="w-full h-64 object-cover rounded-2xl mb-6"
              />
            )}

            <div className="grid grid-cols-1 gap-4">
              {currentQuestion.options.map((option, index) => {
                const colorClass = colors[index % colors.length];
                const bgColors: any = {
                  red: 'bg-red-500 hover:bg-red-600',
                  blue: 'bg-blue-500 hover:bg-blue-600',
                  green: 'bg-green-500 hover:bg-green-600',
                  yellow: 'bg-yellow-500 hover:bg-yellow-600',
                  purple: 'bg-purple-500 hover:bg-purple-600',
                };

                return (
                  <button
                    key={index}
                    onClick={() => handleQuizAnswer(index)}
                    disabled={quizFeedback.show}
                    className={`
                      ${bgColors[colorClass]} text-white
                      p-6 rounded-2xl font-display font-bold text-xl text-left
                      shadow-lg btn-push
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                  >
                    {String(option)}
                  </button>
                );
              })}
            </div>

            {quizFeedback.show && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`
                  mt-6 p-4 rounded-2xl text-center text-white font-bold text-2xl
                  ${quizFeedback.isCorrect ? 'bg-green-500' : 'bg-red-500'}
                `}
              >
                {quizFeedback.isCorrect ? '✅ Benar!' : '❌ Salah!'}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Giant Feedback Overlay */}
        {feedback && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20 backdrop-blur-sm animate-in fade-in">
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1.5, rotate: 0, transition: { type: "spring", bounce: 0.5 } }}
              exit={{ scale: 0 }}
              className="drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
            >
              {feedback === 'correct' ? (
                <span className="text-[150px]">✅</span>
              ) : (
                <span className="text-[150px]">❌</span>
              )}
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  if (step === 'result') {
    const totalQuestions = content?.quiz?.length || 5;
    const score = Math.round((correctCount / totalQuestions) * 100);
    const stars = score >= 80 ? 3 : score >= 60 ? 2 : 1;

    return (
      <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-gray-50 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-8 max-w-xl px-8"
        >
          <h1 className="text-5xl font-display font-black text-primary">
            Selesai! 🎉
          </h1>
          
          <div className="flex justify-center gap-2">
            {[...Array(3)].map((_, i) => (
              <Star
                key={i}
                className={`w-16 h-16 ${i < stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <p className="text-6xl font-black text-primary mb-2">{score}%</p>
            <p className="text-2xl font-body text-muted-foreground">
              {correctCount} dari {totalQuestions} benar
            </p>
          </div>

          <p className="text-xl font-body text-foreground">
            {content?.closingText || "Kerja bagus! Lanjutkan ke pertemuan berikutnya!"}
          </p>

          <button
            onClick={() => {
              // Go back to meeting list
              const moduleId = meeting.moduleId;
              setLocation(`/module/${moduleId}/meetings`);
            }}
            className="bg-primary text-white px-12 py-6 rounded-full text-2xl font-bold shadow-xl btn-push hover:scale-105 hover:shadow-2xl transition-all duration-300"
          >
            Kembali ke Daftar Pertemuan
          </button>
        </motion.div>
      </div>
    );
  }

  return null;
}

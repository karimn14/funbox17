import { useParams, useLocation } from "wouter";
import { useMeeting, useRecordProgress } from "@/hooks/use-meetings";
import { Home, Star, Check, X, ArrowRight, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { useSerial } from "@/context/SerialContext";
import { getActiveStudent } from "@/hooks/use-students";
import confetti from "canvas-confetti";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import YouTube, { YouTubePlayer } from 'react-youtube';
import type { MeetingContent, Activity, VideoInteraction } from "@shared/schema";
import { DragDropActivity } from "@/components/activities/DragDropActivity";
import { BodyPartsActivity } from "@/components/activities/BodyPartsActivity";
import { MatchLineActivity } from "@/components/activities/MatchLineActivity";

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
  
  // State machine - Start with 'video' as the first step
  const [step, setStep] = useState<Step>('video');
  
  // Video tracking state - for multiple videos
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  
  // Video popup state - for timestamp-based interactions
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const playerRef = useRef<YouTubePlayer | null>(null);
  const intervalRef = useRef<number | null>(null);
  
  // Activity state
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [activityFeedback, setActivityFeedback] = useState<FeedbackState>({ show: false, isCorrect: false });
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]); // Multi-select state
  
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
    
    // Skip hardware button handling for drag-drop activities
    if (currentActivity.type === 'drag_drop') {
      console.log("⏭️ Drag-drop activity - hardware buttons disabled");
      return;
    }
    
    // Skip hardware button handling for body parts activities
    if (currentActivity.type === 'body_parts_touch') {
      console.log("⏭️ Body parts activity - hardware buttons disabled");
      return;
    }
    
    // Skip hardware button handling for match line activities
    if (currentActivity.type === 'match_line') {
      console.log("⏭️ Match line activity - hardware buttons disabled");
      return;
    }
    
    // Check if this is a multi-select activity
    const isMultiSelect = currentActivity.selectionMode === 'multiple';
    
    if (isMultiSelect && currentActivity.correctIndices && currentActivity.maxSelections) {
      // Multi-select logic
      setSelectedIndices(prev => {
        // Toggle selection
        const newSelection = prev.includes(buttonIndex)
          ? prev.filter(i => i !== buttonIndex) // Remove if already selected
          : prev.length < currentActivity.maxSelections!
            ? [...prev, buttonIndex] // Add if not at max
            : prev; // Don't add if at max
        
        // Check if we've reached the required number of selections
        if (newSelection.length === currentActivity.maxSelections) {
          // Sort both arrays to compare regardless of order
          const sortedSelection = [...newSelection].sort((a, b) => a - b);
          const sortedCorrect = [...currentActivity.correctIndices!].sort((a, b) => a - b);
          
          // Check if selections match correct indices
          const isCorrect = sortedSelection.length === sortedCorrect.length &&
            sortedSelection.every((val, idx) => val === sortedCorrect[idx]);
          
          // Delay feedback to allow visual update
          setTimeout(() => {
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
            
            // Reset and move forward after showing feedback
            setTimeout(() => {
              setActivityFeedback({ show: false, isCorrect: false });
              setFeedback(null);
              setSelectedIndices([]); // Reset selections
              
              // Move to next activity or quiz
              if (currentActivityIndex < content.activities!.length - 1) {
                setCurrentActivityIndex(currentActivityIndex + 1);
              } else {
                setStep('quiz');
              }
            }, 1500);
          }, 100);
        }
        
        return newSelection;
      });
    } else {
      // Single-select logic (existing)
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
    }
  }, [content, currentActivityIndex, sendCommand, setLocation, selectedIndices]);

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
          // CRITICAL FIX: Include moduleId in payload
          const payload = {
            studentId: student.id,
            meetingId: meeting.id,
            moduleId: meeting.moduleId, // <--- ADDED: Must not be undefined
            score,
            stars,
          };
          
          console.log("🚀 Submitting Quiz Result Payload:", payload);
          
          recordProgress.mutate(payload);
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

  // Video interaction cleanup effect - MUST be at top level
  useEffect(() => {
    // Clean up interval on unmount or when leaving video step
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [step, currentVideoIndex]); // Re-run cleanup when step or video changes

  // Reset selections when activity changes or step changes
  useEffect(() => {
    setSelectedIndices([]);
  }, [currentActivityIndex, step]);

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
              {content?.storyTitle || "Cerita Petualangan"}
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
            onClick={() => {
              // Story -> Activity or Quiz
              if (content?.activities && content.activities.length > 0) {
                setStep('activity');
              } else {
                setStep('quiz');
              }
            }}
            className="mt-8 bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white font-black text-2xl px-12 py-6 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-4"
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
      </div>
    );
  }

  if (step === 'video') {
    // Get all videos
    const videos = content?.videos || [];
    const currentVideo = videos[currentVideoIndex];
    const isLastVideo = currentVideoIndex === videos.length - 1;
    
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

    const rawUrl = currentVideo?.url || "";
    const videoId = getYouTubeVideoId(rawUrl);
    
    // Convert timestamp string (MM:SS) to seconds
    const timestampToSeconds = (timestamp: string): number => {
      const parts = timestamp.split(':').map(Number);
      if (parts.length === 2) {
        return parts[0] * 60 + parts[1]; // MM:SS
      }
      return 0;
    };
    
    const handlePlayerReady = (event: { target: YouTubePlayer }) => {
      playerRef.current = event.target;
      
      // Start checking for interactions
      if (currentVideo?.interactions && currentVideo.interactions.length > 0) {
        const checkedInteractions = new Set<string>();
        
        intervalRef.current = window.setInterval(() => {
          if (!playerRef.current) return;
          
          const currentTime = playerRef.current.getCurrentTime();
          
          currentVideo.interactions?.forEach((interaction: VideoInteraction) => {
            const targetTime = timestampToSeconds(interaction.timestamp);
            
            // Check if we're within 0.5 seconds of the target time and haven't shown this popup yet
            if (
              Math.abs(currentTime - targetTime) < 0.5 &&
              !checkedInteractions.has(interaction.timestamp)
            ) {
              // Pause video and show popup
              if (interaction.action === 'pause') {
                playerRef.current?.pauseVideo();
                setPopupMessage(interaction.message || "");
                setShowPopup(true);
                checkedInteractions.add(interaction.timestamp);
              }
            }
          });
        }, 500); // Check every 500ms
      }
    };
    
    const handleContinue = () => {
      setShowPopup(false);
      setPopupMessage("");
      // Resume video
      playerRef.current?.playVideo();
    };

    return (
      <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 z-50">
        <div className="h-full flex flex-col items-center justify-center p-8 gap-6">
          {/* Video Progress Indicator */}
          {videos.length > 1 && (
            <div className="w-full max-w-5xl mb-4">
              <div className="flex items-center justify-center gap-2">
                {videos.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentVideoIndex
                        ? 'w-12 bg-white'
                        : index < currentVideoIndex
                        ? 'w-8 bg-green-400'
                        : 'w-8 bg-white/30'
                    }`}
                  />
                ))}
              </div>
              <p className="text-center text-white mt-2 text-sm font-semibold">
                Video {currentVideoIndex + 1} dari {videos.length}: {currentVideo?.title}
              </p>
            </div>
          )}
          
          {/* Video Container */}
          <div className="w-full max-w-5xl relative">
            <div className="relative w-full pt-[56.25%] bg-black rounded-3xl overflow-hidden shadow-2xl">
              {videoId ? (
                <div className="absolute top-0 left-0 w-full h-full">
                  <YouTube
                    videoId={videoId}
                    opts={{
                      width: '100%',
                      height: '100%',
                      playerVars: {
                        autoplay: 0,
                        rel: 0,
                        modestbranding: 1,
                      },
                    }}
                    onReady={handlePlayerReady}
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white bg-red-900/50">
                  <div className="text-center p-8">
                    <p className="text-3xl mb-4">❌ Video tidak ditemukan</p>
                    <p className="text-sm text-gray-300">URL video tidak valid</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Popup Overlay */}
            <AnimatePresence>
              {showPopup && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-3xl z-10"
                >
                  <motion.div
                    initial={{ scale: 0.8, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.8, y: 20 }}
                    className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center"
                  >
                    <p className="text-3xl font-bold text-gray-800 mb-6">
                      {popupMessage}
                    </p>
                    <button
                      onClick={handleContinue}
                      className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-black text-xl px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-all duration-300"
                    >
                      Lanjut ▶️
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Continue Button */}
          <button
            onClick={() => {
              // Clean up interval
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }
              
              // If there are more videos, show next video
              if (!isLastVideo) {
                setCurrentVideoIndex(currentVideoIndex + 1);
              } else {
                // All videos watched, proceed with flow: Video -> Story -> Activity -> Quiz
                if (content?.story) {
                  setStep('story');
                } else if (content?.activities && content.activities.length > 0) {
                  setStep('activity');
                } else {
                  setStep('quiz');
                }
              }
            }}
            className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-black text-2xl px-12 py-6 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-4"
          >
            {!isLastVideo 
              ? `Lanjut ke Video ${currentVideoIndex + 2}` 
              : content?.story 
                ? 'Lanjut ke Cerita' 
                : content?.activities && content.activities.length > 0 
                  ? 'Lanjut ke Aktivitas' 
                  : 'Lanjut ke Kuis'}
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
                <CheckCircleIcon
                  className="text-green-500 drop-shadow-2xl"
                  style={{ fontSize: '180px' }}
                />
              ) : (
                <CancelIcon
                  className="text-red-500 drop-shadow-2xl"
                  style={{ fontSize: '180px' }}
                />
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

    // NEW: Check if this is a drag & drop activity
    if (currentActivity.type === 'drag_drop') {
      return (
        <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 z-50">
          <DragDropActivity
            storyTemplate={(currentActivity as any).storyTemplate}
            wordBank={(currentActivity as any).wordBank}
            onComplete={() => {
              // Move to next activity or quiz
              if (currentActivityIndex < activities.length - 1) {
                setCurrentActivityIndex(currentActivityIndex + 1);
              } else {
                setStep('quiz');
              }
            }}
          />

          {/* Home Button */}
          <button
            onClick={() => setLocation("/")}
            className="absolute top-8 left-8 bg-white/90 p-4 rounded-full shadow-lg hover:bg-white transition-colors z-10"
          >
            <Home className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      );
    }

    // NEW: Check if this is a body parts activity
    if (currentActivity.type === 'body_parts_touch') {
      return (
        <div className="fixed inset-0 h-screen w-screen overflow-hidden z-50">
          <BodyPartsActivity
            imageUrl={(currentActivity as any).imageUrl}
            instructions={(currentActivity as any).instructions}
            closingAudio={(currentActivity as any).closingAudio}
            onComplete={() => {
              // Move to next activity or quiz
              if (currentActivityIndex < activities.length - 1) {
                setCurrentActivityIndex(currentActivityIndex + 1);
              } else {
                setStep('quiz');
              }
            }}
          />

          {/* Home Button */}
          <button
            onClick={() => setLocation("/")}
            className="absolute top-8 left-8 bg-white/90 p-4 rounded-full shadow-lg hover:bg-white transition-colors z-10"
          >
            <Home className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      );
    }

    // NEW: Check if this is a match line activity
    if (currentActivity.type === 'match_line') {
      return (
        <div className="fixed inset-0 h-screen w-screen overflow-hidden z-50">
          <MatchLineActivity
            pairs={(currentActivity as any).pairs}
            closingAudio={(currentActivity as any).closingAudio}
            onComplete={() => {
              // Move to next activity or quiz
              if (currentActivityIndex < activities.length - 1) {
                setCurrentActivityIndex(currentActivityIndex + 1);
              } else {
                setStep('quiz');
              }
            }}
          />

          {/* Home Button */}
          <button
            onClick={() => setLocation("/")}
            className="absolute top-8 left-8 bg-white/90 p-4 rounded-full shadow-lg hover:bg-white transition-colors z-10"
          >
            <Home className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      );
    }

    // EXISTING: Regular button-based activities
    
    // Type guard using property existence check
    if ('wordBank' in currentActivity) {
      return null; // This should be handled above
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
            
            {/* Multi-select indicator */}
            {currentActivity.selectionMode === 'multiple' && currentActivity.maxSelections && (
              <div className="text-center mb-4">
                <p className="text-lg font-semibold text-blue-600">
                  Pilih {currentActivity.maxSelections} kartu • Terpilih: {selectedIndices.length}/{currentActivity.maxSelections}
                </p>
              </div>
            )}
            
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
                const isSelected = selectedIndices.includes(index);

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
                      ${isSelected ? 'ring-4 ring-blue-400 scale-105 shadow-2xl' : ''}
                    `}
                  >
                    {option.text}
                  </button>
                );
              })}
            </div>
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
                <CheckCircleIcon
                  className="text-green-500 drop-shadow-2xl"
                  style={{ fontSize: '180px' }}
                />
              ) : (
                <CancelIcon
                  className="text-red-500 drop-shadow-2xl"
                  style={{ fontSize: '180px' }}
                />
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
    const quizStory = content?.quiz_story;

    if (!currentQuestion) {
      return <div>No quiz questions available</div>;
    }

    const colors = ["red", "blue", "green", "yellow", "purple"];

    // Two-column layout if quiz_story exists (4:6 ratio - Story:Quiz)
    if (quizStory) {
      return (
        <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-gray-50 z-50 flex flex-col">
          <div className="flex-1 flex flex-col lg:flex-row gap-5 p-6 overflow-hidden">
            {/* Left Column - Story Card (40% width) */}
            <div className="lg:w-[40%] flex flex-col">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-blue-50 rounded-2xl p-6 shadow-xl h-full flex flex-col overflow-hidden"
              >
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                  <h3 className="text-2xl font-display font-bold text-blue-900">
                    Read the Story
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100">
                  <p className="text-xl font-body text-gray-800 whitespace-pre-line leading-relaxed">
                    {quizStory}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Question Card (60% width) */}
            <div className="lg:w-[60%] flex flex-col">
              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm font-body text-muted-foreground mb-2">
                  <span>Pertanyaan {currentQuizIndex + 1}/{questions.length}</span>
                  <span>Skor: {correctCount}/{currentQuizIndex}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full transition-all"
                    style={{ width: `${((currentQuizIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <motion.div
                key={currentQuizIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl p-6 shadow-2xl flex-1 flex flex-col overflow-hidden"
              >
                <h2 className="text-2xl font-display font-bold text-center mb-5 text-primary">
                  {currentQuestion.question}
                </h2>

                {currentQuestion.imageUrl && (
                  <img
                    src={currentQuestion.imageUrl}
                    alt="Question"
                    className="w-full h-52 object-cover rounded-xl mb-5"
                  />
                )}

                <div className="grid grid-cols-1 gap-3 items-stretch flex-1">
                  {currentQuestion.options.map((option, index) => {
                    const colorClass = colors[index % colors.length];
                    const bgColors: any = {
                      red: 'bg-red-500 hover:bg-red-600',
                      blue: 'bg-blue-500 hover:bg-blue-600',
                      green: 'bg-green-500 hover:bg-green-600',
                      yellow: 'bg-yellow-500 hover:bg-yellow-600',
                      purple: 'bg-purple-500 hover:bg-purple-600',
                    };
                    
                    // Optimized text sizing for readability without overflow
                    const textSize = String(option).length > 50 ? 'text-sm' : String(option).length > 30 ? 'text-base' : 'text-lg';

                    return (
                      <button
                        key={index}
                        onClick={() => handleQuizAnswer(index)}
                        disabled={quizFeedback.show}
                        className={`
                          ${bgColors[colorClass]} text-white
                          p-3 min-h-[55px] h-auto rounded-xl font-display font-bold ${textSize} text-left
                          shadow-lg btn-push
                          disabled:opacity-50 disabled:cursor-not-allowed
                          flex items-center
                        `}
                      >
                        <span className="w-full break-words">
                          {String(option)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
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
                  <CheckCircleIcon
                    className="text-green-500 drop-shadow-2xl"
                    style={{ fontSize: '180px' }}
                  />
                ) : (
                  <CancelIcon
                    className="text-red-500 drop-shadow-2xl"
                    style={{ fontSize: '180px' }}
                  />
                )}
              </motion.div>
            </div>
          )}
        </div>
      );
    }

    // Legacy centered layout (no quiz_story)
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

            <div className="grid grid-cols-1 gap-4 items-stretch">
              {currentQuestion.options.map((option, index) => {
                const colorClass = colors[index % colors.length];
                const bgColors: any = {
                  red: 'bg-red-500 hover:bg-red-600',
                  blue: 'bg-blue-500 hover:bg-blue-600',
                  green: 'bg-green-500 hover:bg-green-600',
                  yellow: 'bg-yellow-500 hover:bg-yellow-600',
                  purple: 'bg-purple-500 hover:bg-purple-600',
                };
                
                // Dynamic text sizing based on option length
                const textSize = String(option).length > 50 ? 'text-sm' : String(option).length > 30 ? 'text-base' : 'text-xl';

                return (
                  <button
                    key={index}
                    onClick={() => handleQuizAnswer(index)}
                    disabled={quizFeedback.show}
                    className={`
                      ${bgColors[colorClass]} text-white
                      p-3 min-h-[60px] h-auto rounded-2xl font-display font-bold ${textSize} text-left
                      shadow-lg btn-push
                      disabled:opacity-50 disabled:cursor-not-allowed
                      flex items-center
                    `}
                  >
                    <span className="w-full break-words">
                      {String(option)}
                    </span>
                  </button>
                );
              })}
            </div>
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
                <CheckCircleIcon
                  className="text-green-500 drop-shadow-2xl"
                  style={{ fontSize: '180px' }}
                />
              ) : (
                <CancelIcon
                  className="text-red-500 drop-shadow-2xl"
                  style={{ fontSize: '180px' }}
                />
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

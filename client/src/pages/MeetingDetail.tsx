import { useParams, useLocation } from "wouter";
import { useMeeting, useRecordProgress } from "@/hooks/use-meetings";
import { Home, Star, Check, X, ArrowRight, BookOpen, Usb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { useSerial } from "@/context/SerialContext";
import { useSerialNavigation } from "@/hooks/use-serial-navigation";
import { getActiveStudent } from "@/hooks/use-students";
import confetti from "canvas-confetti";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import YouTube, { YouTubePlayer } from 'react-youtube';
import type { MeetingContent, Activity, VideoInteraction } from "@shared/schema";
import { DragDropActivity } from "@/components/activities/DragDropActivity";
import { BodyPartsActivity } from "@/components/activities/BodyPartsActivity";
import { MatchLineActivity } from "@/components/activities/MatchLineActivity";
import { AnimalMimicActivity } from "@/components/activities/AnimalMimicActivity";
import { AlphabetRaceActivity } from "@/components/activities/AlphabetRaceActivity";
import { ReadingRaceActivity } from "@/components/activities/ReadingRaceActivity";
import { GameButton } from "@/components/ui/GameButton";
import { calculateMeetingScore, KKM_STANDARDS } from "@shared/module-config";
import { playSuccessSound, playFailureSound } from "@/utils/soundEffects";

type Step = 'opening' | 'story' | 'video' | 'activity' | 'quiz' | 'result';

type FeedbackState = {
  show: boolean;
  isCorrect: boolean;
};

type Feedback = 'correct' | 'incorrect' | null;

// Helper function to check if an option is an image path
const isImageOption = (option: string): boolean => {
  return option.startsWith('/assets/') || 
         option.endsWith('.png') || 
         option.endsWith('.jpg') || 
         option.endsWith('.jpeg') || 
         option.endsWith('.svg') ||
         option.endsWith('.gif');
};

// Helper component for rendering quiz options (text or image grid)
const QuizOptions = ({ 
  currentQuestion, 
  quizFeedback, 
  handleQuizAnswer,
  containerClassName = "grid grid-cols-1 gap-3 flex-1 overflow-y-auto",
  optionTextSize = undefined
}: { 
  currentQuestion: any, 
  quizFeedback: FeedbackState, 
  handleQuizAnswer: (index: number) => void,
  containerClassName?: string,
  optionTextSize?: string
}) => {
  // Check if this question should use image grid layout
  const useImageGrid = currentQuestion.layout === 'image_grid' || 
                       (currentQuestion.options.length > 0 && isImageOption(currentQuestion.options[0]));
  
  if (useImageGrid) {
    // IMAGE GRID LAYOUT (2x2)
    return (
      <div className="grid grid-cols-2 gap-4 w-full p-2">
        {currentQuestion.options.map((option: string, index: number) => (
          <motion.button
            key={index}
            onClick={() => handleQuizAnswer(index)}
            disabled={quizFeedback.show}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative aspect-square bg-white rounded-2xl border-4 border-gray-200 hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <img
              src={option}
              alt={`Option ${String.fromCharCode(65 + index)}`}
              className="w-full h-full object-contain p-3"
            />
            {/* Letter Badge */}
            <div className="absolute top-2 left-2 w-8 h-8 bg-primary text-white font-bold rounded-full flex items-center justify-center text-sm shadow-md group-hover:scale-110 transition-transform">
              {String.fromCharCode(65 + index)}
            </div>
          </motion.button>
        ))}
      </div>
    );
  }
  
  // STANDARD TEXT LAYOUT (vertical list)
  return (
    <div className={containerClassName}>
      {currentQuestion.options.map((option: string, index: number) => {
        const optionLetter = String.fromCharCode(65 + index);
        // Use custom optionTextSize if provided, otherwise use dynamic sizing
        const textSize = optionTextSize || (String(option).length > 60 ? 'text-sm' : String(option).length > 40 ? 'text-xs' : 'text-base');

        return (
          <GameButton
            key={index}
            letter={optionLetter}
            text={String(option)}
            colorIndex={index}
            onClick={() => handleQuizAnswer(index)}
            disabled={quizFeedback.show}
            className={`min-h-[40px] h-auto mx-4 ${textSize}`}
          />
        );
      })}
    </div>
  );
};

// Connection Button Component - Shows USB connection status
const ConnectionButton = ({ 
  isConnected, 
  connect 
}: { 
  isConnected: boolean, 
  connect: () => Promise<void> 
}) => {
  return (
    <div className="absolute top-8 right-8 z-10">
      {isConnected ? (
        <div className="bg-green-500 text-white font-bold px-4 py-3 rounded-full shadow-lg flex items-center gap-2">
          <Usb className="w-5 h-5" />
          <span className="text-sm">Terhubung</span>
        </div>
      ) : (
        <button
          onClick={connect}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-3 rounded-full shadow-lg btn-push flex items-center gap-2 transition-all duration-300"
        >
          <Usb className="w-5 h-5" />
          <span className="text-sm">Hubungkan USB</span>
        </button>
      )}
    </div>
  );
};

export default function MeetingDetail() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const [_, setLocation] = useLocation();
  const { data: meeting, isLoading } = useMeeting(Number(meetingId));
  const recordProgress = useRecordProgress();
  
  // Web Serial hardware control - USE CONTEXT
  const { activeButton, sendCommand, isConnected, connect } = useSerial();
  
  // State machine - Start with 'video' as the first step
  const [step, setStep] = useState<Step>('video');
  
  // Video tracking state - for multiple videos
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  
  // Video popup state - for timestamp-based interactions
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [currentPopup, setCurrentPopup] = useState<any>(null); // Store current popup data
  const [numberInput, setNumberInput] = useState(""); // For number input popups
  const [inputShake, setInputShake] = useState(false); // For shake animation on wrong answer
  const playerRef = useRef<YouTubePlayer | null>(null);
  const intervalRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null); // Ref for auto-focus
  
  // Debounce ref to prevent rapid-fire button presses
  const lastProcessedTime = useRef<number>(0);
  const DEBOUNCE_DELAY = 500; // 500ms debounce
  
  // Activity state
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [activityFeedback, setActivityFeedback] = useState<FeedbackState>({ show: false, isCorrect: false });
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]); // Multi-select state
  const [textInput, setTextInput] = useState(""); // For text_input activities
  const textInputRef = useRef<HTMLInputElement | null>(null); // Ref for text input auto-focus
  
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
  
  // Global Navigation Controls (F = Back, E = Next)
  const handleStepBack = useCallback(() => {
    console.log("🔙 Global Back - Current step:", step);
    
    // Step-based back navigation
    if (step === 'result') {
      setStep('quiz');
    } else if (step === 'quiz') {
      if (content?.activities && content.activities.length > 0) {
        setStep('activity');
        setCurrentActivityIndex(content.activities.length - 1); // Go to last activity
      } else if (content?.videos && content.videos.length > 0) {
        setStep('video');
        setCurrentVideoIndex(content.videos.length - 1); // Go to last video
      } else if (content?.story) {
        setStep('story');
      } else {
        // No previous steps, go back to dashboard
        console.log("🏠 No previous steps - Navigating to dashboard");
        setLocation("/dashboard");
      }
    } else if (step === 'activity') {
      if (currentActivityIndex > 0) {
        // Go to previous activity
        setCurrentActivityIndex(prev => prev - 1);
        setActivityFeedback({ show: false, isCorrect: false });
      } else {
        // First activity, go back to video
        if (content?.videos && content.videos.length > 0) {
          setStep('video');
          setCurrentVideoIndex(content.videos.length - 1);
        } else if (content?.story) {
          setStep('story');
        } else {
          console.log("🏠 No previous steps - Navigating to dashboard");
          setLocation("/dashboard");
        }
      }
    } else if (step === 'video') {
      if (currentVideoIndex > 0) {
        // Go to previous video
        setCurrentVideoIndex(prev => prev - 1);
      } else {
        // First video, check for story
        if (content?.story) {
          setStep('story');
        } else {
          // No previous steps, go back to dashboard
          console.log("🏠 No previous steps - Navigating to dashboard");
          setLocation("/dashboard");
        }
      }
    } else if (step === 'story') {
      // Go back to dashboard from story
      console.log("🏠 From story - Navigating to dashboard");
      setLocation("/dashboard");
    } else {
      // Default: go back to dashboard
      console.log("🏠 Default - Navigating to dashboard");
      setLocation("/dashboard");
    }
  }, [step, currentActivityIndex, currentVideoIndex, content, setLocation]);

  const handleStepNext = useCallback(() => {
    console.log("➡️ Global Next - Current step:", step);
    
    // Step-based next navigation
    if (step === 'video') {
      // Check if there are more videos
      if (content?.videos && currentVideoIndex < content.videos.length - 1) {
        setCurrentVideoIndex(prev => prev + 1);
      } else {
        // Last video, proceed to next step
        if (content?.activities && content.activities.length > 0) {
          setStep('activity');
        } else {
          setStep('quiz');
        }
      }
    } else if (step === 'activity') {
      // Check if there are more activities
      if (content?.activities && currentActivityIndex < content.activities.length - 1) {
        setCurrentActivityIndex(prev => prev + 1);
        setActivityFeedback({ show: false, isCorrect: false });
      } else {
        // Last activity, proceed to quiz
        setStep('quiz');
      }
    } else if (step === 'quiz') {
      // For quiz, E acts as "submit" or "next question"
      // This will be handled by the existing quiz logic
      console.log("⚠️ Quiz step - E button handled by quiz logic");
    } else if (step === 'story') {
      // From story, go to next logical step
      if (content?.videos && content.videos.length > 0) {
        setStep('video');
      } else if (content?.activities && content.activities.length > 0) {
        setStep('activity');
      } else {
        setStep('quiz');
      }
    } else if (step === 'result') {
      // SPECIAL CASE: From result screen, "E" returns to dashboard (module selection)
      console.log("🏠 Result screen - Navigating to dashboard");
      setLocation("/dashboard");
    }
  }, [step, currentVideoIndex, currentActivityIndex, content, setLocation]);

  // Use the global navigation hook
  useSerialNavigation({
    onStepBack: handleStepBack,
    onStepNext: handleStepNext,
    currentStep: step,
  });
  
  // Debug logging - Track data arrival
  useEffect(() => {
    console.log("📥 Frontend Received Meeting:", meeting);
    console.log("📦 Parsed Content:", content);
    console.log("🔄 Loading State:", isLoading);
    console.log("📍 Current Step:", step);
  }, [meeting, content, isLoading, step]);
  
  // Auto-skip to quiz if no videos and no activities (Direct-to-Quiz Logic)
  useEffect(() => {
    if (!meeting || !content || isLoading) return;
    
    const hasVideos = content.videos && content.videos.length > 0;
    const hasActivities = content.activities && content.activities.length > 0;
    
    // If no videos and no activities, skip directly to quiz
    if (!hasVideos && !hasActivities) {
      console.log("🎯 Direct-to-Quiz: No videos or activities detected, skipping to quiz");
      setStep('quiz');
    }
  }, [meeting, content, isLoading]);
  
  // Handle Activity answer with hardware buttons (Button 0-3 for A-D)
  const handleActivityAnswer = useCallback((buttonIndex: number) => {
    // Buttons 4 (E) and 5 (F) are now handled by global navigation
    // They should not trigger activity answers
    if (buttonIndex === 4 || buttonIndex === 5) {
      console.log("⏭️ Navigation button - handled by global navigation");
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
    
    // Skip hardware button handling for animal mimic activities
    if (currentActivity.type === 'animal_mimic') {
      console.log("⏭️ Animal mimic activity - hardware buttons disabled");
      return;
    }
    
    // Skip hardware button handling for alphabet race activities
    if (currentActivity.type === 'alphabet_race') {
      console.log("⏭️ Alphabet race activity - hardware buttons disabled");
      return;
    }
    
    // Skip hardware button handling for reading race activities
    if (currentActivity.type === 'reading_race') {
      console.log("⏭️ Reading race activity - hardware buttons disabled");
      return;
    }
    
    // Skip hardware button handling for text input activities
    if (currentActivity.type === 'text_input') {
      console.log("⏭️ Text input activity - hardware buttons disabled");
      return;
    }
    
    // Skip hardware button handling for image grid activities
    if (currentActivity.type === 'image_grid') {
      console.log("⏭️ Image grid activity - hardware buttons disabled");
      return;
    }
    
    // Skip hardware button handling for info activities
    if (currentActivity.type === 'info') {
      console.log("⏭️ Info activity - hardware buttons disabled");
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
    // Buttons 4 (E) and 5 (F) are now handled by global navigation
    // They should not trigger quiz answers
    if (buttonIndex === 4 || buttonIndex === 5) {
      console.log("⏭️ Navigation button - handled by global navigation");
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
        // Quiz complete - calculate and save with new weighted scoring
        const totalQuestions = content.quiz.length;
        const rawPoints = correctCount + (isCorrect ? 1 : 0);
        
        if (!student || !meeting) {
          console.error("❌ Cannot save quiz: student or meeting is undefined");
          setStep('result');
          return;
        }
        
        // Calculate weighted score using curriculum config
        const score = calculateMeetingScore(rawPoints, meeting.moduleId, meeting.order);
        const stars = score >= 80 ? 3 : score >= 60 ? 2 : 1;
        
        console.log("📊 Quiz Complete - Weighted Scoring:", {
          moduleId: meeting.moduleId,
          meetingOrder: meeting.order,
          rawPoints,
          totalQuestions,
          calculatedScore: score,
          stars
        });
        
        const payload = {
          studentId: student.id,
          meetingId: meeting.id,
          moduleId: meeting.moduleId,
          meetingOrder: meeting.order,
          rawPoints,
          totalQuestions,
          score,
          stars,
        };
        
        console.log("🚀 Submitting Weighted Quiz Result:", payload);
        
        recordProgress.mutate(payload);
        
        setStep('result');
      }
    }, 1500);
  }, [content, currentQuizIndex, correctCount, student, meeting, sendCommand, setLocation, recordProgress]);
  
  // Hardware button handler for Activities
  useEffect(() => {
    if (activeButton !== null && activeButton !== undefined && step === 'activity' && !activityFeedback.show) {
      // Debounce check
      const now = Date.now();
      if (now - lastProcessedTime.current < DEBOUNCE_DELAY) {
        console.log("🚫 Debounced: Ignoring button press (too fast)");
        return;
      }
      
      // Update last processed time
      lastProcessedTime.current = now;
      
      // Process the button press
      handleActivityAnswer(activeButton);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeButton, step, activityFeedback.show]); // handleActivityAnswer is stable (useCallback) - excluded to prevent infinite loop
  
  // Hardware button handler for Quiz
  useEffect(() => {
    if (activeButton !== null && activeButton !== undefined && step === 'quiz' && !quizFeedback.show) {
      // Debounce check
      const now = Date.now();
      if (now - lastProcessedTime.current < DEBOUNCE_DELAY) {
        console.log("🚫 Debounced: Ignoring button press (too fast)");
        return;
      }
      
      // Update last processed time
      lastProcessedTime.current = now;
      
      // Process the button press
      handleQuizAnswer(activeButton);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeButton, step, quizFeedback.show]); // handleQuizAnswer is stable (useCallback) - excluded to prevent infinite loop

  // Send serial command based on quiz result score
  useEffect(() => {
    if (step === 'result' && content?.quiz && meeting) {
      const totalQuestions = content.quiz.length;
      
      // Calculate weighted score using curriculum config
      const score = calculateMeetingScore(correctCount, meeting.moduleId, meeting.order);
      
      // STEP 1: Send FINISH command immediately
      console.log("🏁 Quiz Completed - Sending FINISH command");
      sendCommand("FINISH");
      
      // STEP 2: Play sound effect based on score (KKM = 75%)
      const isPassing = score >= KKM_STANDARDS.MEETING;
      if (isPassing) {
        console.log(`🎉 Score ${score}% >= KKM ${KKM_STANDARDS.MEETING}%: Playing success sound`);
        playSuccessSound(); // Applause at 100% volume
      } else {
        console.log(`😔 Score ${score}% < KKM ${KKM_STANDARDS.MEETING}%: Playing failure sound`);
        playFailureSound(); // Try-again at 100% volume
      }
      
      // STEP 3: Send result command after short delay (500ms)
      setTimeout(() => {
        if (isPassing) {
          console.log(`✅ Sending GOOD command`);
          sendCommand("GOOD");
        } else {
          console.log(`⚠️ Sending RETRY command`);
          sendCommand("RETRY");
        }
      }, 500);
    }
  }, [step, correctCount, content, sendCommand, meeting]);

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

  // Auto-focus input when number_input popup appears (VIDEO STEP)
  useEffect(() => {
    if (step === 'video' && showPopup && currentPopup?.type === 'number_input' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [step, showPopup, currentPopup]);

  // Improved Loading State Check
  if (isLoading) {
    return (
      <div 
        className="fixed inset-0 h-screen w-screen overflow-hidden z-50 flex items-center justify-center"
        style={{ 
          backgroundImage: "url('/assets/background/quiz-bg.png')", 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-white/80 z-0" />
        <div className="relative z-10 text-center space-y-4">
          <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-xl font-semibold text-gray-600">Memuat pertemuan...</p>
        </div>
      </div>
    );
  }

  // Error State - Meeting Not Found
  if (!meeting) {
    return (
      <div 
        className="fixed inset-0 h-screen w-screen overflow-hidden z-50 flex items-center justify-center"
        style={{ 
          backgroundImage: "url('/assets/background/quiz-bg.png')", 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-white/80 z-0" />
        <div className="relative z-10 text-center space-y-4 px-8">
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
      <div 
        className="fixed inset-0 h-screen w-screen overflow-hidden z-50 flex items-center justify-center"
        style={{ 
          backgroundImage: "url('/assets/background/quiz-bg.png')", 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-white/80 z-0" />
        <div className="relative z-10 text-center space-y-4 px-8">
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
      <div 
        className="fixed inset-0 h-screen w-screen overflow-hidden z-50 flex items-center justify-center"
        style={{ 
          backgroundImage: "url('/assets/background/quiz-bg.png')", 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-white/80 z-0" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-2xl text-center space-y-8 px-8"
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
          
          {/* Connection Button */}
          <ConnectionButton isConnected={isConnected} connect={connect} />
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
          
          currentVideo.interactions?.forEach((interaction: any) => {
            const targetTime = timestampToSeconds(interaction.timestamp);
            
            // Check if we're within 0.5 seconds of the target time and haven't shown this popup yet
            if (
              Math.abs(currentTime - targetTime) < 0.5 &&
              !checkedInteractions.has(interaction.timestamp)
            ) {
              // Pause video and show popup
              if (interaction.action === 'pause') {
                playerRef.current?.pauseVideo();
                
                // Check if there are popups in this interaction
                if (interaction.popups && interaction.popups.length > 0) {
                  const popup = interaction.popups[0]; // Get first popup
                  setCurrentPopup(popup);
                  setShowPopup(true);
                } else {
                  // Fallback to old message-based popup
                  setPopupMessage(interaction.message || "");
                  setCurrentPopup(null);
                  setShowPopup(true);
                }
                
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
      setCurrentPopup(null);
      // Resume video
      playerRef.current?.playVideo();
    };
    
    const handleImageQuizAnswer = (isCorrect: boolean) => {
      if (isCorrect) {
        // Play correct sound if available
        const correctAudio = new Audio('/sounds/correct.mp3');
        correctAudio.play().catch(() => console.log('No correct sound'));
        
        // Show brief "Hebat!" message
        setFeedback('correct');
        setTimeout(() => {
          setFeedback(null);
        }, 1500);
        
        // Close popup and resume video after short delay
        setTimeout(() => {
          setShowPopup(false);
          setCurrentPopup(null);
          playerRef.current?.playVideo();
        }, 1500);
      } else {
        // Play wrong sound or show feedback
        const wrongAudio = new Audio('/sounds/wrong.mp3');
        wrongAudio.play().catch(() => console.log('No wrong sound'));
        
        // Show brief incorrect feedback
        setFeedback('incorrect');
        setTimeout(() => {
          setFeedback(null);
        }, 1000);
        // Allow retry - don't close popup
      }
    };
    
    const handleNumberInputSubmit = (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      
      if (!currentPopup || !currentPopup.correctValue) return;
      
      // Normalize input: remove dots, commas, spaces
      const normalizedInput = numberInput.replace(/[.,\s]/g, '');
      const normalizedCorrect = currentPopup.correctValue.replace(/[.,\s]/g, '');
      
      if (normalizedInput === normalizedCorrect) {
        // CORRECT!
        const correctAudio = new Audio('/sounds/correct.mp3');
        correctAudio.play().catch(() => console.log('No correct sound'));
        
        // Show brief checkmark
        setFeedback('correct');
        setTimeout(() => {
          setFeedback(null);
        }, 800);
        
        // Close popup and resume video immediately
        setTimeout(() => {
          setShowPopup(false);
          setCurrentPopup(null);
          setNumberInput("");
          playerRef.current?.playVideo();
        }, 800);
      } else {
        // WRONG - shake and clear
        const wrongAudio = new Audio('/sounds/wrong.mp3');
        wrongAudio.play().catch(() => console.log('No wrong sound'));
        
        // Trigger shake animation
        setInputShake(true);
        setTimeout(() => {
          setInputShake(false);
          setNumberInput(""); // Clear input
          // Refocus input
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 500);
      }
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
                <>
                  {/* Number Input Popup - Bottom Overlay */}
                  {currentPopup?.type === 'number_input' ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
                    >
                      <form 
                        onSubmit={handleNumberInputSubmit}
                        className={`bg-black/90 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-2xl border-2 border-white/20 flex items-center gap-4 ${inputShake ? 'animate-shake' : ''}`}
                      >
                        <label className="text-white font-bold text-lg whitespace-nowrap">
                          {currentPopup.label}
                        </label>
                        <input
                          ref={inputRef}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={numberInput}
                          onChange={(e) => setNumberInput(e.target.value.replace(/[^0-9]/g, ''))}
                          className="w-32 px-4 py-2 rounded-lg text-xl font-bold text-center bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                          placeholder="..."
                          autoComplete="off"
                        />
                        <button
                          type="submit"
                          className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors"
                        >
                          OK
                        </button>
                      </form>
                    </motion.div>
                  ) : (
                    /* Full Screen Popups (Image Quiz, Continue) */
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
                        className="bg-white rounded-2xl p-8 max-w-2xl mx-4 text-center"
                      >
                        {/* Image Quiz Popup */}
                        {currentPopup?.type === 'image_quiz' ? (
                          <div className="space-y-6">
                            <h3 className="text-3xl font-bold text-gray-800 mb-6">
                              {currentPopup.question}
                            </h3>
                            <div className="flex items-center justify-center gap-6">
                              {currentPopup.options?.map((option: any) => (
                                <motion.button
                                  key={option.id}
                                  onClick={() => handleImageQuizAnswer(option.isCorrect)}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-gray-50 hover:bg-blue-50 transition-all duration-300 border-4 border-transparent hover:border-blue-400 cursor-pointer group"
                                >
                                  <div className="w-32 h-32 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
                                    <img
                                      src={option.imageUrl}
                                      alt={option.label}
                                      className="w-full h-full object-contain"
                                    />
                                  </div>
                                  <span className="text-xl font-bold text-gray-700 group-hover:text-blue-600">
                                    {option.label}
                                  </span>
                                </motion.button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          /* Regular Continue Popup */
                          <>
                            <p className="text-3xl font-bold text-gray-800 mb-6">
                              {popupMessage}
                            </p>
                            <button
                              onClick={handleContinue}
                              className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-black text-xl px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-all duration-300"
                            >
                              Lanjut ▶️
                            </button>
                          </>
                        )}
                      </motion.div>
                    </motion.div>
                  )}
                </>
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
          
          {/* Connection Button */}
          <ConnectionButton isConnected={isConnected} connect={connect} />
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

    // NEW: Check if this is an animal mimic activity
    if (currentActivity.type === 'animal_mimic') {
      return (
        <div className="fixed inset-0 h-screen w-screen overflow-hidden z-50">
          <AnimalMimicActivity
            imageUrl={(currentActivity as any).imageUrl}
            introAudio={(currentActivity as any).introAudio}
            animals={(currentActivity as any).animals}
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

    // NEW: Check if this is an alphabet race activity
    if (currentActivity.type === 'alphabet_race') {
      return (
        <div className="fixed inset-0 h-screen w-screen overflow-hidden z-50">
          <AlphabetRaceActivity
            letters={(currentActivity as any).letters}
            modes={(currentActivity as any).modes}
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

    // NEW: Check if this is a reading race activity
    if (currentActivity.type === 'reading_race') {
      return (
        <div className="fixed inset-0 h-screen w-screen overflow-hidden z-50">
          <ReadingRaceActivity
            sentences={(currentActivity as any).sentences}
            stages={(currentActivity as any).stages}
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

    // NEW: Check if this is a text input activity
    if (currentActivity.type === 'text_input') {
      const handleTextInputSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const normalizedInput = textInput.toLowerCase().trim();
        const normalizedCorrect = (currentActivity as any).correctAnswer.toLowerCase().trim();
        
        const isCorrect = normalizedInput === normalizedCorrect;
        
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
          setTextInput('');
          
          if (isCorrect) {
            // Move to next activity or quiz
            if (currentActivityIndex < activities.length - 1) {
              setCurrentActivityIndex(currentActivityIndex + 1);
            } else {
              setStep('quiz');
            }
          }
        }, 1500);
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
              <h2 className="text-3xl font-display font-bold text-center mb-8 text-gray-800">
                {currentActivity.instruction}
              </h2>
              
              <form onSubmit={handleTextInputSubmit} className="space-y-6">
                <input
                  ref={textInputRef}
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="w-full px-6 py-4 text-2xl font-bold text-center border-4 border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Ketik jawaban di sini..."
                  autoFocus
                  disabled={activityFeedback.show}
                />
                
                <button
                  type="submit"
                  disabled={activityFeedback.show || !textInput.trim()}
                  className="w-full bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-black text-2xl px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-all duration-300 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  Cek Jawaban
                </button>
              </form>
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

    // NEW: Check if this is an image grid activity
    if (currentActivity.type === 'image_grid') {
      const handleImageGridSelect = (index: number) => {
        const activity = currentActivity as any;
        
        if (activity.selectionMode === 'multiple' && activity.maxSelections) {
          // Multi-select logic
          setSelectedIndices(prev => {
            const newSelection = prev.includes(index)
              ? prev.filter(i => i !== index)
              : prev.length < activity.maxSelections!
                ? [...prev, index]
                : prev;
            
            // Check if we've reached the required number of selections
            if (newSelection.length === activity.maxSelections) {
              setTimeout(() => {
                // Check if selections match correct indices
                const sortedSelection = [...newSelection].sort((a, b) => a - b);
                const sortedCorrect = [...activity.correctIndices!].sort((a, b) => a - b);
                
                const isCorrect = sortedSelection.length === sortedCorrect.length &&
                  sortedSelection.every((val, idx) => val === sortedCorrect[idx]);
                
                if (isCorrect) {
                  sendCommand("WIN");
                  setFeedback('correct');
                  
                  // Play success audio
                  const successAudio = new Audio('/assets/audio/correct.mp3');
                  successAudio.play().catch(() => console.log('Success audio failed'));
                  
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
                  
                  // Play error audio
                  const errorAudio = new Audio('/assets/audio/wrong.mp3');
                  errorAudio.play().catch(() => console.log('Error audio failed'));
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
                  setSelectedIndices([]);
                  
                  if (isCorrect) {
                    // Move to next activity or quiz
                    if (currentActivityIndex < activities.length - 1) {
                      setCurrentActivityIndex(currentActivityIndex + 1);
                    } else {
                      setStep('quiz');
                    }
                  }
                }, 1500);
              }, 100);
            }
            
            return newSelection;
          });
        } else {
          // Single-select logic
          const option = activity.options[index];
          const isCorrect = option.isCorrect;
          
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
            
            if (isCorrect) {
              // Move to next activity or quiz
              if (currentActivityIndex < activities.length - 1) {
                setCurrentActivityIndex(currentActivityIndex + 1);
              } else {
                setStep('quiz');
              }
            }
          }, 1500);
        }
      };

      return (
        <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 z-50 flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            {/* Progress */}
            <div className="mb-4 text-center">
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
              className="bg-white rounded-3xl p-6 max-w-3xl w-full shadow-2xl"
            >
              <h2 className="text-2xl font-display font-bold text-center mb-4 text-gray-800">
                {currentActivity.instruction}
              </h2>
              
              {/* Multi-select indicator */}
              {(currentActivity as any).selectionMode === 'multiple' && (currentActivity as any).maxSelections && (
                <div className="text-center mb-3">
                  <p className="text-base font-semibold text-blue-600">
                    Pilih {(currentActivity as any).maxSelections} gambar • Terpilih: {selectedIndices.length}/{(currentActivity as any).maxSelections}
                  </p>
                </div>
              )}
              
              {/* Image Grid (2x2) - Compact Rectangular Layout */}
              <div className="grid grid-cols-2 gap-3 w-full">
                {(currentActivity as any).options.map((option: any, index: number) => {
                  const isSelected = selectedIndices.includes(index);
                  
                  return (
                    <motion.button
                      key={option.id}
                      onClick={() => handleImageGridSelect(index)}
                      disabled={activityFeedback.show}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative w-full h-24 bg-white rounded-xl border-3 ${
                        isSelected ? 'border-blue-500 ring-4 ring-blue-300' : 'border-gray-200'
                      } hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group`}
                    >
                      {/* Horizontal Flex Layout: Image + Text */}
                      <div className="flex flex-row items-center justify-center gap-3 h-full px-3">
                        <img
                          src={option.imageUrl}
                          alt={option.label}
                          className="h-16 w-auto object-contain"
                        />
                        <span className="text-lg font-bold text-gray-800">
                          {option.label}
                        </span>
                      </div>
                      
                      {/* Letter Badge */}
                      <div className={`absolute top-1.5 left-1.5 w-7 h-7 ${
                        isSelected ? 'bg-blue-500' : 'bg-primary'
                      } text-white font-bold rounded-full flex items-center justify-center text-xs shadow-md group-hover:scale-110 transition-transform`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      
                      {/* Checkmark for selected */}
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-7 h-7 bg-green-500 text-white rounded-full flex items-center justify-center shadow-md">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </motion.button>
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

    // NEW: Check if this is an info-type activity (closing/summary slide)
    if (currentActivity.type === 'info') {
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

            {/* Info Card - No options, just story + button */}
            <motion.div
              key={currentActivityIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-8 max-w-3xl w-full shadow-2xl"
            >
              {(currentActivity as any).contextStory && (
                <div className="bg-blue-50 rounded-2xl p-6 mb-6">
                  <p className="text-lg leading-relaxed text-gray-700 text-center">
                    {(currentActivity as any).contextStory}
                  </p>
                </div>
              )}

              <button
                onClick={() => setStep('quiz')}
                className="w-full bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-black text-2xl px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-all duration-300"
              >
                Mulai Kuis
              </button>
            </motion.div>

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
            {/* Context Story - Show narrative above the question */}
            {(currentActivity as any).contextStory && (
              <div className="bg-blue-50 rounded-2xl p-6 mb-6">
                <p className="text-lg leading-relaxed text-gray-700">
                  {(currentActivity as any).contextStory}
                </p>
              </div>
            )}

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
                const isSelected = selectedIndices.includes(index);
                const optionLetter = String.fromCharCode(65 + index); // A, B, C, D...

                return (
                  <GameButton
                    key={index}
                    letter={optionLetter}
                    text={option.text}
                    colorIndex={index}
                    onClick={() => handleActivityAnswer(index)}
                    disabled={activityFeedback.show}
                    isSelected={isSelected}
                  />
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

    // Check if current question has context_text (new per-question context feature)
    const hasQuestionContext = currentQuestion.context_text && currentQuestion.context_text.trim().length > 0;
    
    // STRICT MODULE 4 LAYOUT DETECTION
    // Type assertion to access module property (added via JOIN in backend)
    const meetingWithModule = meeting as any;
    const moduleOrder = meetingWithModule?.module?.order;
    const moduleTitle = meetingWithModule?.module?.title || "";
    
    // Detect Module 4 (Bahasa Indonesia & Literasi)
    const isModule4 = moduleOrder === 4 || moduleTitle.includes("Bahasa Indonesia");
    const isModule4Meeting1or2 = isModule4 && (meeting?.order === 1 || meeting?.order === 2);
    const isModule4Meeting3or4 = isModule4 && (meeting?.order === 3 || meeting?.order === 4);

    console.log("🔍 Layout Detection Debug:", {
      moduleOrder,
      moduleTitle,
      meetingOrder: meeting?.order,
      isModule4,
      isModule4Meeting1or2,
      isModule4Meeting3or4,
      hasQuestionContext
    });

    // ========================================
    // LAYOUT A: STACKED (Meeting 1 & 2)
    // Story Top (35%) + Question Bottom (65%)
    // ========================================
    if (isModule4Meeting1or2 && hasQuestionContext) {
      console.log("✅ Rendering STACKED layout for Meeting", meeting?.order);
      return (
        <div 
          className="fixed inset-0 h-screen w-screen overflow-hidden z-50 flex items-center justify-center p-6"
          style={{ 
            backgroundImage: "url('/assets/background/quiz-bg.png')", 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="absolute inset-0 bg-white/80 z-0" />
          <div className="relative z-10 flex flex-col h-full w-full max-w-3xl mx-auto overflow-hidden gap-4">
            {/* Top Card - Story/Context (35% height) */}
            <motion.div
              key={`context-${currentQuizIndex}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-[23%] bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-6 shadow-xl overflow-y-auto border-2 border-yellow-200"
            >
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="w-6 h-6 text-yellow-700" />
                <h3 className="text-xl font-display font-bold text-yellow-900">
                  Bacaan
                </h3>
              </div>
              <p className="text-base leading-relaxed text-gray-800 whitespace-pre-line">
                {currentQuestion.context_text}
              </p>
            </motion.div>

            {/* Bottom Card - Question & Options (65% height) */}
            <motion.div
              key={`question-${currentQuizIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-[73%] bg-white rounded-2xl p-6 shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-xs font-body text-muted-foreground mb-2">
                  <span className="font-semibold">Pertanyaan {currentQuizIndex + 1}/{questions.length}</span>
                  <span className="font-semibold">Skor: {correctCount}/{currentQuizIndex}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuizIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <h2 className="text-xl md:text-2xl font-display font-bold text-center mb-4 text-primary">
                {currentQuestion.question}
              </h2>

              {currentQuestion.imageUrl && (
                <img
                  src={currentQuestion.imageUrl}
                  alt="Question"
                  className="w-full h-32 object-cover rounded-lg mb-4 shadow-md"
                />
              )}

              {/* Options */}
              <QuizOptions
                currentQuestion={currentQuestion}
                quizFeedback={quizFeedback}
                handleQuizAnswer={handleQuizAnswer}
                containerClassName="grid grid-cols-1 gap-3 flex-1 overflow-y-auto"
              />
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

    // ========================================
    // LAYOUT B: SIDE-BY-SIDE (Meeting 3 & 4)
    // Story Left (60%) + Question Right (40%) for Meeting 3
    // Story Left (40%) + Question Right (60%) for Meeting 4
    // ========================================
    if (isModule4Meeting3or4 && hasQuestionContext) {
      console.log("✅ Rendering SIDE-BY-SIDE layout for Meeting", meeting?.order);
      
      // Determine layout ratio and text size based on meeting order
      const isMeeting4 = meeting?.order === 4;
      const contextWidth = isMeeting4 ? "lg:w-[40%]" : "lg:w-[60%]";
      const questionWidth = isMeeting4 ? "lg:w-[60%]" : "lg:w-[40%]";
      const optionTextSize = isMeeting4 ? "text-xl md:text-2xl" : undefined;
      
      return (
        <div 
          className="fixed inset-0 h-screen w-screen overflow-hidden z-50"
          style={{ 
            backgroundImage: "url('/assets/background/quiz-bg.png')", 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="absolute inset-0 bg-white/80 z-0" />
          <div className="relative z-10 h-full w-full flex flex-col lg:flex-row gap-6 p-6">
            {/* Left Panel - Reading Material (Dynamic width: 60% for Meeting 3, 40% for Meeting 4) */}
            <motion.div
              key={`context-${currentQuizIndex}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`${contextWidth} bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-xl overflow-y-auto flex flex-col border-2 border-blue-200`}
            >
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-7 h-7 text-blue-700" />
                <h3 className="text-2xl font-display font-bold text-blue-900">
                  Bacaan
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto pr-2">
                <p className="text-base leading-relaxed text-gray-800 whitespace-pre-line">
                  {currentQuestion.context_text}
                </p>
              </div>
            </motion.div>

            {/* Right Panel - Question & Options (Dynamic width: 40% for Meeting 3, 60% for Meeting 4) */}
            <div className={`${questionWidth} flex flex-col`}>
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm font-body text-muted-foreground mb-2">
                  <span className="font-semibold">Pertanyaan {currentQuizIndex + 1}/{questions.length}</span>
                  <span className="font-semibold">Skor: {correctCount}/{currentQuizIndex}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full transition-all"
                    style={{ width: `${((currentQuizIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Card */}
              <motion.div
                key={currentQuizIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl p-6 shadow-2xl flex-1 flex flex-col overflow-hidden"
              >
                <h2 className="text-lg md:text-xl font-display font-bold text-center mb-5 text-primary">
                  {currentQuestion.question}
                </h2>

                {currentQuestion.imageUrl && (
                  <img
                    src={currentQuestion.imageUrl}
                    alt="Question"
                    className="w-full h-40 object-cover rounded-xl mb-5 shadow-md"
                  />
                )}

                {/* Options - Pass custom text size for Meeting 4 */}
                <QuizOptions
                  currentQuestion={currentQuestion}
                  quizFeedback={quizFeedback}
                  handleQuizAnswer={handleQuizAnswer}
                  containerClassName="grid grid-cols-1 gap-3 flex-1 overflow-y-auto"
                  optionTextSize={optionTextSize}
                />
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

    // Two-column layout if quiz_story exists OR if current question has context_text (for other modules)
    if (quizStory || hasQuestionContext) {
      return (
        <div 
          className="fixed inset-0 h-screen w-screen overflow-hidden z-50 flex flex-col"
          style={{ 
            backgroundImage: "url('/assets/background/quiz-bg.png')", 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="absolute inset-0 bg-white/80 z-0" />
          <div className="relative z-10 flex-1 flex flex-col lg:flex-row gap-5 p-6 overflow-hidden">
            {/* Left Column - Story/Context Card (40% width) */}
            <div className="lg:w-[40%] flex flex-col">
              <motion.div
                key={hasQuestionContext ? `context-${currentQuizIndex}` : 'story'}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`${hasQuestionContext ? 'bg-yellow-50' : 'bg-blue-50'} rounded-2xl p-6 shadow-xl h-full flex flex-col overflow-hidden`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className={`w-6 h-6 ${hasQuestionContext ? 'text-yellow-600' : 'text-blue-600'}`} />
                  <h3 className={`text-2xl font-display font-bold ${hasQuestionContext ? 'text-yellow-900' : 'text-blue-900'}`}>
                    {hasQuestionContext ? 'Bacaan' : 'Read the Story'}
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-yellow-300 scrollbar-track-yellow-100">
                  <p className="text-xl font-body text-gray-800 whitespace-pre-line leading-relaxed">
                    {hasQuestionContext ? currentQuestion.context_text : quizStory}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Question Card (60% width) */}
            <div className="lg:w-[60%] flex flex-col">
              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm font-body text-muted-foreground mb-2">
                  <span className="font-semibold">Pertanyaan {currentQuizIndex + 1}/{questions.length}</span>
                  <span className="font-semibold">Skor: {correctCount}/{currentQuizIndex}</span>
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

                {/* Options */}
                <QuizOptions
                  currentQuestion={currentQuestion}
                  quizFeedback={quizFeedback}
                  handleQuizAnswer={handleQuizAnswer}
                  containerClassName="grid grid-cols-1 gap-3 flex-1 overflow-y-auto"
                />
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

    // Legacy centered layout (no quiz_story)
    return (
      <div 
        className="fixed inset-0 h-screen w-screen overflow-hidden z-50 flex flex-col"
        style={{ 
          backgroundImage: "url('/assets/background/quiz-bg.png')", 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-white/80 z-0" />
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8">
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
                className="w-full h-48 object-cover rounded-2xl mb-6"
              />
            )}

            <QuizOptions
              currentQuestion={currentQuestion}
              quizFeedback={quizFeedback}
              handleQuizAnswer={handleQuizAnswer}
              containerClassName="grid grid-cols-1 gap-4 items-stretch"
            />
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
    
    // Calculate weighted score using curriculum config
    const score = meeting ? calculateMeetingScore(correctCount, meeting.moduleId, meeting.order) : 0;
    const stars = score >= 80 ? 3 : score >= 60 ? 2 : 1;

    return (
      <div 
        className="fixed inset-0 h-screen w-screen overflow-hidden z-50 flex items-center justify-center"
        style={{ 
          backgroundImage: "url('/assets/background/quiz-bg.png')", 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-white/80 z-0" />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center space-y-8 max-w-xl px-8"
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

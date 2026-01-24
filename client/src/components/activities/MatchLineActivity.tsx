import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X } from "lucide-react";
import confetti from "canvas-confetti";

interface MatchPair {
  id: string;
  leftImage: string;
  rightText: string;
}

interface MatchLineActivityProps {
  pairs: MatchPair[];
  closingAudio?: string;
  onComplete: () => void;
}

interface Connection {
  leftId: string;
  rightId: string;
  isCorrect: boolean;
}

interface Position {
  x: number;
  y: number;
}

export function MatchLineActivity({ pairs, closingAudio, onComplete }: MatchLineActivityProps) {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [dragging, setDragging] = useState<{ leftId: string; startPos: Position } | null>(null);
  const [cursorPos, setCursorPos] = useState<Position>({ x: 0, y: 0 });
  const [showCelebration, setShowCelebration] = useState(false);
  const [wrongConnection, setWrongConnection] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const rightRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Shuffle right items for variety
  const [shuffledRightItems] = useState(() => {
    const items = [...pairs];
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  });

  // Text-to-Speech function
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Play success sound
  const playSuccessSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.3;
    
    oscillator.start();
    setTimeout(() => oscillator.stop(), 200);
  };

  // Get element position relative to container
  const getElementCenter = (element: HTMLDivElement): Position => {
    if (!containerRef.current) return { x: 0, y: 0 };
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    
    return {
      x: elementRect.left - containerRect.left + elementRect.width / 2,
      y: elementRect.top - containerRect.top + elementRect.height / 2,
    };
  };

  // Handle mouse/touch start on left item
  const handleStartConnection = (leftId: string, event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    const leftElement = leftRefs.current.get(leftId);
    if (!leftElement) return;

    const startPos = getElementCenter(leftElement);
    setDragging({ leftId, startPos });
    
    // Get initial cursor position
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      setCursorPos({
        x: clientX - containerRect.left,
        y: clientY - containerRect.top,
      });
    }
  };

  // Handle mouse/touch move
  const handleMove = (event: MouseEvent | TouchEvent) => {
    if (!dragging || !containerRef.current) return;
    
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    setCursorPos({
      x: clientX - containerRect.left,
      y: clientY - containerRect.top,
    });
  };

  // Handle mouse/touch end
  const handleEndConnection = (event: MouseEvent | TouchEvent) => {
    if (!dragging) return;
    
    const clientX = 'changedTouches' in event ? event.changedTouches[0].clientX : event.clientX;
    const clientY = 'changedTouches' in event ? event.changedTouches[0].clientY : event.clientY;
    
    // Check if we're over a right item
    let targetRightId: string | null = null;
    rightRefs.current.forEach((element, rightId) => {
      const rect = element.getBoundingClientRect();
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        targetRightId = rightId;
      }
    });
    
    if (targetRightId) {
      // Check if this connection is correct
      const isCorrect = dragging.leftId === targetRightId;
      
      if (isCorrect) {
        // Add correct connection
        setConnections(prev => [...prev, {
          leftId: dragging.leftId,
          rightId: targetRightId!,
          isCorrect: true,
        }]);
        playSuccessSound();
        speak("Good job!");
        
        // Check if all pairs are matched
        if (connections.length + 1 === pairs.length) {
          setTimeout(() => {
            setShowCelebration(true);
            confetti({
              particleCount: 200,
              spread: 100,
              origin: { y: 0.5, x: 0.5 },
              colors: ['#22c55e', '#86efac', '#fbbf24'],
            });
            
            if (closingAudio) {
              speak(closingAudio);
            }
            
            setTimeout(() => {
              onComplete();
            }, 3000);
          }, 300);
        }
      } else {
        // Wrong connection - show error
        setWrongConnection(dragging.leftId);
        speak("Try again");
        
        setTimeout(() => {
          setWrongConnection(null);
        }, 800);
      }
    }
    
    setDragging(null);
  };

  // Set up global event listeners for drag
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleMove(e);
    const handleTouchMove = (e: TouchEvent) => handleMove(e);
    const handleMouseUp = (e: MouseEvent) => handleEndConnection(e);
    const handleTouchEnd = (e: TouchEvent) => handleEndConnection(e);
    
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [dragging]);

  // Check if an item is already connected
  const isConnected = (id: string) => {
    return connections.some(conn => conn.leftId === id || conn.rightId === id);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-display font-bold text-gray-800 mb-2">
          Match the Shapes & Colors!
        </h2>
        <p className="text-lg text-gray-600">
          Draw lines to connect matching items ({connections.length}/{pairs.length})
        </p>
      </div>

      {/* Matching Container */}
      <div
        ref={containerRef}
        className="relative w-full max-w-5xl h-[70vh] bg-white rounded-2xl shadow-2xl p-8"
      >
        {/* SVG for lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {/* Draw active dragging line */}
          {dragging && (
            <line
              x1={dragging.startPos.x}
              y1={dragging.startPos.y}
              x2={cursorPos.x}
              y2={cursorPos.y}
              stroke="#3b82f6"
              strokeWidth="3"
              strokeDasharray="5,5"
            />
          )}
          
          {/* Draw fixed connections */}
          {connections.map((conn) => {
            const leftElement = leftRefs.current.get(conn.leftId);
            const rightElement = rightRefs.current.get(conn.rightId);
            
            if (!leftElement || !rightElement) return null;
            
            const leftPos = getElementCenter(leftElement);
            const rightPos = getElementCenter(rightElement);
            
            return (
              <line
                key={`${conn.leftId}-${conn.rightId}`}
                x1={leftPos.x}
                y1={leftPos.y}
                x2={rightPos.x}
                y2={rightPos.y}
                stroke={conn.isCorrect ? "#22c55e" : "#ef4444"}
                strokeWidth="4"
                className="drop-shadow-lg"
              />
            );
          })}
        </svg>

        {/* Two Columns */}
        <div className="relative flex justify-between items-start h-full gap-8 z-20">
          {/* Left Column - Images */}
          <div className="flex flex-col justify-around w-[45%] h-full">
            {pairs.map((pair) => (
              <motion.div
                key={pair.id}
                ref={(el) => el && leftRefs.current.set(pair.id, el)}
                onMouseDown={(e) => !isConnected(pair.id) && handleStartConnection(pair.id, e)}
                onTouchStart={(e) => !isConnected(pair.id) && handleStartConnection(pair.id, e)}
                className={`
                  relative bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-4
                  flex items-center justify-center
                  transition-all duration-300 cursor-pointer
                  ${isConnected(pair.id) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-xl'}
                  ${wrongConnection === pair.id ? 'animate-shake bg-red-200' : ''}
                `}
                style={{ height: `${100 / pairs.length - 2}%` }}
              >
                <img
                  src={pair.leftImage}
                  alt={pair.id}
                  className="max-w-full max-h-full object-contain"
                />
                {isConnected(pair.id) && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Right Column - Text Labels */}
          <div className="flex flex-col justify-around w-[45%] h-full">
            {shuffledRightItems.map((pair) => (
              <motion.div
                key={pair.id}
                ref={(el) => el && rightRefs.current.set(pair.id, el)}
                className={`
                  relative bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-4
                  flex items-center justify-center text-center
                  transition-all duration-300
                  ${isConnected(pair.id) ? 'opacity-50' : 'hover:scale-105 hover:shadow-xl'}
                `}
                style={{ height: `${100 / pairs.length - 2}%` }}
              >
                <p className="text-xl font-display font-bold text-gray-800">
                  {pair.rightText}
                </p>
                {isConnected(pair.id) && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Celebration Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="bg-white rounded-3xl p-12 text-center shadow-2xl"
            >
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-4xl font-display font-black text-green-600 mb-4">
                Perfect Match!
              </h2>
              <p className="text-xl text-gray-700">
                You matched all {pairs.length} pairs correctly!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X } from "lucide-react";
import confetti from "canvas-confetti";

interface MatchPair {
  id: string;
  leftText: string; // Text for left column (question)
  rightImage: string; // Image for right column (answer)
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
  const leftDotRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const rightDotRefs = useRef<Map<string, HTMLDivElement>>(new Map());

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

  // Get center position of anchor dot relative to container
  const getDotCenter = (dotElement: HTMLDivElement | null): Position | null => {
    if (!dotElement || !containerRef.current) return null;

    const containerRect = containerRef.current.getBoundingClientRect();
    const dotRect = dotElement.getBoundingClientRect();

    return {
      x: dotRect.left + dotRect.width / 2 - containerRect.left,
      y: dotRect.top + dotRect.height / 2 - containerRect.top,
    };
  };

  // Force line redraw on window resize
  useEffect(() => {
    const handleResize = () => {
      // Force re-render by updating a dummy state
      setConnections(prev => [...prev]);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle mouse/touch start on left item
  const handleStartConnection = (leftId: string, event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    const leftDot = leftDotRefs.current.get(leftId);
    if (!leftDot) return;

    const startPos = getDotCenter(leftDot);
    if (!startPos) return;

    setDragging({ leftId, startPos });
    
    // Speak the text
    const pair = pairs.find(p => p.id === leftId);
    if (pair) {
      speak(pair.leftText);
    }
    
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
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 overflow-hidden">
      {/* Centered Content Wrapper */}
      <div className="w-full max-w-4xl h-full flex flex-col overflow-hidden">
        {/* Compact Header */}
        <div className="text-center py-3 px-4 flex-shrink-0">
          <h2 className="text-xl md:text-2xl font-display font-bold text-gray-800">
            Match the Shapes & Colors!
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            Draw lines to connect ({connections.length}/{pairs.length})
          </p>
        </div>

        {/* Matching Container - Flex Fill Remaining Space */}
        <div
          ref={containerRef}
          className="relative flex-1 w-full overflow-hidden px-4 pb-4"
        >
        {/* Two Columns Grid - Full Height */}
        <div className="relative grid grid-cols-2 gap-4 md:gap-6 h-full">
          {/* Left Column - Text Items (Questions) - Evenly Distributed */}
          <div className="flex flex-col h-full justify-between">
            {pairs.map((pair) => {
              const connected = isConnected(pair.id);

              return (
                <motion.div
                  key={pair.id}
                  ref={(el) => el && leftRefs.current.set(pair.id, el)}
                  className="relative flex-1 min-h-0 flex items-center py-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Text Card - Compact Pill Style */}
                  <div
                    className={`
                      relative py-2 px-4 rounded-r-full
                      bg-white/80 backdrop-blur-sm shadow-sm
                      border-l-4 transition-all duration-300
                      ${connected ? "border-green-500 opacity-60" : "border-blue-500 hover:border-blue-600"}
                      ${wrongConnection === pair.id ? "border-red-500 animate-shake" : ""}
                      ${!connected ? "cursor-pointer hover:bg-white/90 hover:shadow-md" : ""}
                      inline-block max-w-[85%]
                    `}
                    onMouseDown={(e) => !connected && handleStartConnection(pair.id, e)}
                    onTouchStart={(e) => !connected && handleStartConnection(pair.id, e)}
                  >
                    <div className="text-sm md:text-base font-bold text-gray-800 text-left pl-2 pr-4">
                      {pair.leftText}
                    </div>

                    {/* Anchor Dot - RIGHT EDGE */}
                    <div
                      ref={(el) => el && leftDotRefs.current.set(pair.id, el)}
                      className={`
                        absolute -right-3 top-1/2 -translate-y-1/2
                        w-6 h-6 rounded-full border-2 border-white shadow-md
                        transition-all duration-300
                        ${connected ? "bg-green-500" : "bg-blue-500 hover:bg-blue-600"}
                        ${dragging?.leftId === pair.id ? "scale-125" : ""}
                      `}
                    />

                    {/* Connected Check */}
                    {connected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-1 left-2"
                      >
                        <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column - Image Items (Answers) - Staggered/Offset */}
          <div className="flex flex-col h-full justify-between pt-[8%]">
            {shuffledRightItems.map((pair) => {
              const connected = connections.some((c) => c.rightId === pair.id);

              return (
                <motion.div
                  key={pair.id}
                  ref={(el) => el && rightRefs.current.set(pair.id, el)}
                  className="relative flex-1 min-h-0 flex items-center justify-end py-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Image Card - Compact Round Style */}
                  <div
                    className={`
                      relative p-2 rounded-l-full
                      bg-white/80 backdrop-blur-sm shadow-sm
                      border-r-4 transition-all duration-300
                      ${connected ? "border-green-500 opacity-60" : "border-purple-500 hover:border-purple-600"}
                      ${dragging && !connected ? "cursor-pointer hover:bg-white/90 hover:shadow-md" : ""}
                      flex items-center justify-center
                    `}
                  >
                    {/* Responsive Image - Scales with Container */}
                    <div className="h-full w-auto flex items-center justify-center px-2">
                      <img
                        src={pair.rightImage}
                        alt={pair.leftText}
                        className="h-full w-auto max-w-[80px] md:max-w-[100px] object-contain"
                      />
                    </div>

                    {/* Anchor Dot - LEFT EDGE */}
                    <div
                      ref={(el) => el && rightDotRefs.current.set(pair.id, el)}
                      className={`
                        absolute -left-3 top-1/2 -translate-y-1/2
                        w-6 h-6 rounded-full border-2 border-white shadow-md
                        transition-all duration-300
                        ${connected ? "bg-green-500" : "bg-purple-500 hover:bg-purple-600"}
                      `}
                    />

                    {/* Connected Check */}
                    {connected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-1 right-2"
                      >
                        <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* SVG Lines Overlay - Full Container Coverage */}
        <svg
          className="absolute inset-0 pointer-events-none z-10"
          style={{ width: "100%", height: "100%" }}
        >
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
            const leftDot = leftDotRefs.current.get(conn.leftId);
            const rightDot = rightDotRefs.current.get(conn.rightId);
            
            if (!leftDot || !rightDot) return null;
            
            const leftPos = getDotCenter(leftDot);
            const rightPos = getDotCenter(rightDot);
            
            if (!leftPos || !rightPos) return null;
            
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
    </div>
  );
}

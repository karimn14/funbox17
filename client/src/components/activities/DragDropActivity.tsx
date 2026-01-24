import { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

// Types
interface WordItem {
  id: string;
  text: string;
  correctSlotIndex: number | null; // null for distractors
}

interface DragDropActivityProps {
  storyTemplate: string; // e.g., "You: '{0}'!\nStranger: 'Hi there!'\nYou: '{1}'."
  wordBank: WordItem[];
  onComplete: () => void;
}

// Draggable Word Chip Component
function DraggableWord({ id, text, isDragging }: { id: string; text: string; isDragging?: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-lg cursor-grab active:cursor-grabbing hover:scale-105 transition-transform select-none"
    >
      {text}
    </div>
  );
}

// Drop Zone Component
function DropZone({
  slotIndex,
  filledWord,
  isCorrect,
  isIncorrect,
}: {
  slotIndex: number;
  filledWord: string | null;
  isCorrect: boolean;
  isIncorrect: boolean;
}) {
  const { setNodeRef, isOver } = useSortable({
    id: `slot-${slotIndex}`,
  });

  return (
    <span
      ref={setNodeRef}
      className={`inline-block min-w-[120px] px-3 py-1.5 mx-1 border-2 border-dashed rounded-lg text-center font-bold transition-all text-sm ${
        filledWord
          ? isCorrect
            ? 'bg-green-100 border-green-500 text-green-800'
            : isIncorrect
            ? 'bg-red-100 border-red-500 text-red-800 animate-shake'
            : 'bg-blue-50 border-blue-300 text-gray-700'
          : isOver
          ? 'border-yellow-400 bg-yellow-50 scale-105'
          : 'border-gray-300 bg-gray-50 text-gray-400'
      }`}
    >
      {filledWord || '___'}
    </span>
  );
}

// Main Component
export function DragDropActivity({ storyTemplate, wordBank, onComplete }: DragDropActivityProps) {
  const [availableWords, setAvailableWords] = useState<WordItem[]>(wordBank);
  const [slots, setSlots] = useState<(WordItem | null)[]>([]);
  const [validationState, setValidationState] = useState<('correct' | 'incorrect' | null)[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    })
  );

  // Initialize slots based on template
  useEffect(() => {
    const slotCount = (storyTemplate.match(/\{\d+\}/g) || []).length;
    setSlots(new Array(slotCount).fill(null));
    setValidationState(new Array(slotCount).fill(null));
  }, [storyTemplate]);

  // Parse story template into parts
  const parseStoryTemplate = () => {
    const parts: (string | number)[] = [];
    let lastIndex = 0;
    const regex = /\{(\d+)\}/g;
    let match;

    while ((match = regex.exec(storyTemplate)) !== null) {
      // Add text before the placeholder
      if (match.index > lastIndex) {
        parts.push(storyTemplate.substring(lastIndex, match.index));
      }
      // Add placeholder index
      parts.push(parseInt(match[1]));
      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < storyTemplate.length) {
      parts.push(storyTemplate.substring(lastIndex));
    }

    return parts;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const draggedWordId = active.id as string;
    const dropTargetId = over.id as string;

    // Check if dropped on a slot
    if (dropTargetId.startsWith('slot-')) {
      const slotIndex = parseInt(dropTargetId.replace('slot-', ''));
      const draggedWord = availableWords.find((w) => w.id === draggedWordId) || 
                          slots.find((w) => w?.id === draggedWordId);

      if (!draggedWord) return;

      // Check if word is correct for this slot
      const isCorrect = draggedWord.correctSlotIndex === slotIndex;

      if (isCorrect) {
        // Correct answer - snap into place
        const newSlots = [...slots];
        const newValidation = [...validationState];

        // Remove word from previous slot if it was already placed
        const previousSlotIndex = slots.findIndex((w) => w?.id === draggedWordId);
        if (previousSlotIndex !== -1) {
          newSlots[previousSlotIndex] = null;
          newValidation[previousSlotIndex] = null;
        }

        // Place in new slot
        newSlots[slotIndex] = draggedWord;
        newValidation[slotIndex] = 'correct';

        setSlots(newSlots);
        setValidationState(newValidation);

        // Remove from available words
        setAvailableWords((prev) => prev.filter((w) => w.id !== draggedWordId));

        // Check completion
        const allFilled = newSlots.every((s) => s !== null);
        const allCorrect = newValidation.every((v) => v === 'correct');
        if (allFilled && allCorrect) {
          setIsCompleted(true);
        }
      } else {
        // Incorrect - show error animation
        const newValidation = [...validationState];
        newValidation[slotIndex] = 'incorrect';
        setValidationState(newValidation);

        // Reset after animation
        setTimeout(() => {
          const resetValidation = [...validationState];
          resetValidation[slotIndex] = null;
          setValidationState(resetValidation);
        }, 800);
      }
    }
  };

  const handleReset = () => {
    setAvailableWords(wordBank);
    setSlots(new Array(slots.length).fill(null));
    setValidationState(new Array(slots.length).fill(null));
    setIsCompleted(false);
  };

  const parts = parseStoryTemplate();
  const activeWord = availableWords.find((w) => w.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-full w-full flex items-center justify-center p-4">
        {/* Side-by-Side Layout: Dialogue Left, Word Bank Right */}
        <div className="flex gap-6 w-full max-w-7xl h-[85vh]">
          {/* Story Area with Drop Zones - LEFT SIDE */}
          <div className="flex-1 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 shadow-lg border-2 border-blue-200 overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 sticky top-0 bg-gradient-to-br from-blue-50 to-purple-50 pb-2">
              <span className="text-3xl">💬</span>
              Complete the Dialogue
            </h3>
            
            <div className="text-lg leading-relaxed whitespace-pre-line">
              {parts.map((part, index) => {
                if (typeof part === 'string') {
                  return <span key={index}>{part}</span>;
                } else {
                  // Placeholder - render drop zone
                  const slotIndex = part;
                  return (
                    <DropZone
                      key={`slot-${slotIndex}`}
                      slotIndex={slotIndex}
                      filledWord={slots[slotIndex]?.text || null}
                      isCorrect={validationState[slotIndex] === 'correct'}
                      isIncorrect={validationState[slotIndex] === 'incorrect'}
                    />
                  );
                }
              })}
            </div>
          </div>

          {/* Word Bank - RIGHT SIDE */}
          {!isCompleted && (
            <div className="w-80 bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 flex flex-col">
              <h4 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                <span className="text-2xl"></span>
                Word Bank
              </h4>
              <p className="text-sm text-gray-600 mb-4">Drag words to fill the blanks →</p>
              <div className="flex flex-col gap-3 overflow-y-auto flex-1">
                {availableWords.map((word) => (
                  <DraggableWord
                    key={word.id}
                    id={word.id}
                    text={word.text}
                    isDragging={activeId === word.id}
                  />
                ))}
              </div>
              {availableWords.length === 0 && (
                <p className="text-center text-gray-500 mt-4 text-sm">
                  ✅ All words used! Check your answers.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Completion State - Full Screen Overlay */}
        {isCompleted && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-10">
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl p-8 shadow-2xl text-white text-center animate-bounce-in max-w-md">
              <div className="text-6xl mb-4"></div>
              <h3 className="text-3xl font-bold mb-4">Perfect! Dialogue Complete!</h3>
              <p className="text-lg mb-6">You've successfully completed the conversation!</p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={onComplete}
                  className="px-8 py-4 bg-white text-green-600 font-bold rounded-xl shadow-lg hover:scale-105 transition-transform"
                >
                  Continue →
                </button>
                <button
                  onClick={handleReset}
                  className="px-8 py-4 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform border-2 border-white"
                >
                  Try Again 
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Drag Overlay */}
        <DragOverlay>
          {activeId ? (
            <div className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-2xl scale-110">
              {activeWord?.text}
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}

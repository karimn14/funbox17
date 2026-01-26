import { motion } from "framer-motion";

interface GameButtonProps {
  letter: string; // A, B, C, D, etc.
  text: string;
  colorIndex: number; // 0=Red, 1=Blue, 2=Green, 3=Yellow
  onClick: () => void;
  disabled?: boolean;
  isSelected?: boolean;
  className?: string;
}

const colorThemes = {
  0: {
    // Red (A)
    bg: 'bg-red-500',
    bgHover: 'hover:bg-red-600',
    shadow: 'shadow-[0_6px_0_0_rgb(185,28,28)]', // red-700
    shadowActive: 'active:shadow-[0_2px_0_0_rgb(185,28,28)]',
    letterBox: 'bg-red-400',
    letterBoxBorder: 'border-red-600',
  },
  1: {
    // Blue (B)
    bg: 'bg-blue-500',
    bgHover: 'hover:bg-blue-600',
    shadow: 'shadow-[0_6px_0_0_rgb(29,78,216)]', // blue-700
    shadowActive: 'active:shadow-[0_2px_0_0_rgb(29,78,216)]',
    letterBox: 'bg-blue-400',
    letterBoxBorder: 'border-blue-600',
  },
  2: {
    // Green (C)
    bg: 'bg-green-500',
    bgHover: 'hover:bg-green-600',
    shadow: 'shadow-[0_6px_0_0_rgb(21,128,61)]', // green-700
    shadowActive: 'active:shadow-[0_2px_0_0_rgb(21,128,61)]',
    letterBox: 'bg-green-400',
    letterBoxBorder: 'border-green-600',
  },
  3: {
    // Yellow (D)
    bg: 'bg-yellow-500',
    bgHover: 'hover:bg-yellow-600',
    shadow: 'shadow-[0_6px_0_0_rgb(161,98,7)]', // yellow-700
    shadowActive: 'active:shadow-[0_2px_0_0_rgb(161,98,7)]',
    letterBox: 'bg-yellow-400',
    letterBoxBorder: 'border-yellow-600',
  },
  4: {
    // Purple (E) - for cases with 5+ options
    bg: 'bg-purple-500',
    bgHover: 'hover:bg-purple-600',
    shadow: 'shadow-[0_6px_0_0_rgb(109,40,217)]', // purple-700
    shadowActive: 'active:shadow-[0_2px_0_0_rgb(109,40,217)]',
    letterBox: 'bg-purple-400',
    letterBoxBorder: 'border-purple-600',
  },
};

export function GameButton({
  letter,
  text,
  colorIndex,
  onClick,
  disabled = false,
  isSelected = false,
  className = "",
}: GameButtonProps) {
  const theme = colorThemes[colorIndex as keyof typeof colorThemes] || colorThemes[0];

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98, y: 4 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative
        ${theme.bg} ${theme.bgHover}
        ${theme.shadow} ${theme.shadowActive}
        text-white
        rounded-3xl
        px-5 py-4
        font-display font-bold text-lg
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        active:translate-y-1
        flex items-center gap-4
        min-h-[70px]
        ${isSelected ? 'ring-4 ring-white ring-offset-2 scale-105' : ''}
        ${className}
      `}
    >
      {/* Letter Box (Left Side) */}
      <div
        className={`
          ${theme.letterBox}
          ${theme.letterBoxBorder}
          border-2
          rounded-2xl
          w-12 h-12
          flex items-center justify-center
          flex-shrink-0
          shadow-inner
        `}
      >
        <span className="text-white font-black text-2xl drop-shadow-md">
          {letter}
        </span>
      </div>

      {/* Answer Text (Right Side) */}
      <span className="flex-1 text-left leading-tight break-words">
        {text}
      </span>
    </motion.button>
  );
}

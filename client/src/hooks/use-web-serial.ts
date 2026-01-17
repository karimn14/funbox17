import { useEffect, useState } from "react";

// This is a simulation hook for the WebSerial hardware interface
// It listens for keyboard events to simulate hardware button presses
export function useWebSerial() {
  const [activeButton, setActiveButton] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Map keys a,b,c,d to buttons 0,1,2,3
      const keyMap: Record<string, number> = {
        'a': 0,
        'b': 1,
        'c': 2,
        'd': 3,
        '1': 0,
        '2': 1,
        '3': 2,
        '4': 3
      };

      if (e.key.toLowerCase() in keyMap) {
        setActiveButton(keyMap[e.key.toLowerCase()]);
      }
    };

    const handleKeyUp = () => {
      // Optional: clear active state on key up if you want momentary action
      // For this implementation, we might want to keep it active briefly or let the consumer handle it
      setTimeout(() => setActiveButton(null), 200);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return { activeButton };
}

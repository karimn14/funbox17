import { useEffect, useState, useRef } from "react";

// Web Serial API hook for hardware button control
// Supports both actual Web Serial hardware and keyboard simulation
export function useWebSerial() {
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const portRef = useRef<any>(null); // SerialPort type
  const readerRef = useRef<any>(null); // Reader type

  // Parse incoming serial data
  const handleSerialData = (data: string) => {
    const trimmed = data.trim().toUpperCase();
    console.log("🔍 Serial Received (Raw):", JSON.stringify(data), "→ Trimmed:", JSON.stringify(trimmed));
    
    // Map characters to button indices (6 buttons total)
    if (trimmed === 'A') {
      console.log("✅ Mapped 'A' → Button Index 0 (Red)");
      setActiveButton(0); // Red/Option A
    } else if (trimmed === 'B') {
      console.log("✅ Mapped 'B' → Button Index 1 (Blue)");
      setActiveButton(1); // Blue/Option B
    } else if (trimmed === 'C') {
      console.log("✅ Mapped 'C' → Button Index 2 (Green)");
      setActiveButton(2); // Green/Option C
    } else if (trimmed === 'D') {
      console.log("✅ Mapped 'D' → Button Index 3 (Yellow)");
      setActiveButton(3); // Yellow/Option D
    } else if (trimmed === 'E') {
      console.log("✅ Mapped 'E' → Button Index 4 (Purple - Extra/Next/Replay)");
      setActiveButton(4); // Purple/Button 5 - Context-sensitive
    } else if (trimmed === 'F') {
      console.log("✅ Mapped 'F' → Button Index 5 (BACK Button)");
      setActiveButton(5); // BACK button - Always navigates back
    } else if (trimmed !== '') {
      console.log("⚠️ Unrecognized character:", JSON.stringify(trimmed));
    }
    
    // Reset after 500ms to prevent double clicks (increased from 200ms to give React more time)
    setTimeout(() => {
      console.log("🔄 Reset activeButton to null");
      setActiveButton(null);
    }, 500);
  };

  // Connect to Web Serial device
  const connect = async () => {
    if (!('serial' in navigator)) {
      console.error("❌ Web Serial API not supported");
      setError('Web Serial API is not supported in this browser');
      return;
    }

    try {
      console.log("🔌 Requesting serial port...");
      // Request a port
      const port = await (navigator as any).serial.requestPort();
      console.log("✅ Port selected, opening at 115200 baud...");
      await port.open({ baudRate: 115200 });
      
      portRef.current = port;
      setIsConnected(true);
      setError(null);
      console.log("✅ Serial port connected successfully!");

      // Start reading data
      const decoder = new TextDecoderStream();
      const readableStreamClosed = port.readable.pipeTo(decoder.writable);
      const reader = decoder.readable.getReader();
      readerRef.current = reader;
      console.log("📖 Started reading serial data...");

      // Read loop
      (async () => {
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            
            console.log("📡 Serial Raw Value:", JSON.stringify(value));
            
            // Process each character
            for (const char of value) {
              handleSerialData(char);
            }
          }
        } catch (err) {
          console.error('❌ Serial read error:', err);
          setError('Error reading from device');
        }
      })();

    } catch (err) {
      console.error('❌ Serial connection error:', err);
      setError('Failed to connect to device');
      setIsConnected(false);
    }
  };

  // Disconnect from device
  const disconnect = async () => {
    try {
      if (readerRef.current) {
        await readerRef.current.cancel();
        readerRef.current = null;
      }
      
      if (portRef.current) {
        await portRef.current.close();
        portRef.current = null;
      }
      
      setIsConnected(false);
    } catch (err) {
      console.error('Disconnect error:', err);
    }
  };

  // Send command to hardware
  const sendCommand = async (command: string) => {
    if (!portRef.current || !isConnected) {
      console.warn("⚠️ Cannot send command - not connected:", command);
      return;
    }

    try {
      const writer = portRef.current.writable.getWriter();
      const encoder = new TextEncoder();
      const data = encoder.encode(command + '\n'); // Add newline for ESP32 parsing
      
      await writer.write(data);
      writer.releaseLock();
      
      console.log("📤 Sent command to hardware:", command);
    } catch (err) {
      console.error("❌ Error sending command:", err);
    }
  };

  // Keyboard simulation fallback
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // CRITICAL: Ignore keypresses when user is typing in input fields
      const activeElement = document.activeElement;
      const isTyping = activeElement instanceof HTMLInputElement || 
                       activeElement instanceof HTMLTextAreaElement ||
                       activeElement?.getAttribute('contenteditable') === 'true';
      
      if (isTyping) {
        console.log("⌨️ Ignoring keypress - user is typing in input field");
        return; // Don't process keyboard shortcuts while typing
      }

      const key = e.key.toLowerCase();
      
      console.log("⌨️ Keyboard key pressed:", key);
      
      // Map keys to button indices (simulation mode - 6 buttons)
      if (key === 'a' || key === '1') {
        handleSerialData('A');
      } else if (key === 'b' || key === '2') {
        handleSerialData('B');
      } else if (key === 'c' || key === '3') {
        handleSerialData('C');
      } else if (key === 'd' || key === '4') {
        handleSerialData('D');
      } else if (key === 'e' || key === '5') {
        handleSerialData('E');
      } else if (key === 'f' || key === '6' || key === 'escape') {
        handleSerialData('F'); // BACK button (F, 6, or ESC key)
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return { 
    activeButton, 
    isConnected, 
    error,
    connect, 
    disconnect,
    sendCommand
  };
}

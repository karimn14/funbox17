import { useEffect, useState, useRef, useCallback } from "react";

// Web Serial API hook for hardware button control
// Supports both actual Web Serial hardware and keyboard simulation
export function useWebSerial() {
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const portRef = useRef<any>(null); // SerialPort type
  const readerRef = useRef<any>(null); // Reader type
  const bufferRef = useRef<string>(""); // Accumulate partial data
  const isProcessingRef = useRef(false); // Prevent duplicate processing

  // Parse incoming serial data (memoized to prevent recreation)
  const handleSerialData = useCallback((data: string) => {
    // Prevent duplicate processing
    if (isProcessingRef.current) {
      console.log("⏭️ Skipping duplicate serial data processing");
      return;
    }
    
    // Step 1: Normalize - uppercase and trim
    const normalized = data.trim().toUpperCase();
    console.log("🔍 Serial Received (Raw):", JSON.stringify(data), "→ Normalized:", JSON.stringify(normalized));
    
    // Ignore empty strings
    if (normalized === '') {
      console.log("⏭️ Ignoring empty string");
      return;
    }
    
    // Step 2: Regex Extraction - Handle "INPUT: X" format or plain "X"
    let parsedCommand = '';
    
    // Try to extract command from "INPUT: X" format
    const inputMatch = normalized.match(/INPUT:\s*([A-F])/);
    if (inputMatch) {
      parsedCommand = inputMatch[1];
      console.log("📥 Extracted from 'INPUT:' format:", JSON.stringify(parsedCommand));
    } else if (normalized.length === 1 && /^[A-F]$/.test(normalized)) {
      // Plain single letter command
      parsedCommand = normalized;
      console.log("📥 Direct single letter command:", JSON.stringify(parsedCommand));
    } else {
      // Unrecognized format
      console.log("⚠️ Unrecognized format (ignored):", JSON.stringify(normalized));
      return;
    }
    
    // Step 3: Validation - ensure single character
    if (parsedCommand.length !== 1) {
      console.log("⚠️ Parsed command is not a single character:", JSON.stringify(parsedCommand));
      return;
    }
    
    console.log("✅ Parsed Command:", JSON.stringify(parsedCommand));
    
    // Set processing flag
    isProcessingRef.current = true;
    
    // Map characters to button indices (6 buttons total)
    if (parsedCommand === 'A') {
      console.log("✅ Mapped 'A' → Button Index 0 (Red)");
      setActiveButton(0); // Red/Option A
    } else if (parsedCommand === 'B') {
      console.log("✅ Mapped 'B' → Button Index 1 (Blue)");
      setActiveButton(1); // Blue/Option B
    } else if (parsedCommand === 'C') {
      console.log("✅ Mapped 'C' → Button Index 2 (Green)");
      setActiveButton(2); // Green/Option C
    } else if (parsedCommand === 'D') {
      console.log("✅ Mapped 'D' → Button Index 3 (Yellow)");
      setActiveButton(3); // Yellow/Option D
    } else if (parsedCommand === 'E') {
      console.log("✅ Mapped 'E' → NAV_NEXT (Global Next/Enter)");
      setActiveButton(4); // E = NAV_NEXT - Global Next/Enter
    } else if (parsedCommand === 'F') {
      console.log("✅ Mapped 'F' → NAV_BACK (Global Back)");
      setActiveButton(5); // F = NAV_BACK - Global Back
    } else {
      console.log("⚠️ Command not in A-F range:", JSON.stringify(parsedCommand));
      isProcessingRef.current = false; // Reset immediately for unrecognized
      return;
    }
    
    // Reset after 500ms to prevent double clicks
    setTimeout(() => {
      console.log("🔄 Reset activeButton to null");
      setActiveButton(null);
      isProcessingRef.current = false; // Allow next input
    }, 500);
  }, []);

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

      // CRITICAL FIX: Clear any buffered data from previous sessions
      console.log("🧹 Flushing serial buffer...");
      bufferRef.current = ""; // Clear our local buffer
      
      // Start reading data
      const decoder = new TextDecoderStream();
      const readableStreamClosed = port.readable.pipeTo(decoder.writable);
      const reader = decoder.readable.getReader();
      readerRef.current = reader;
      console.log("📖 Started reading serial data...");

      // Read loop with line-based parsing
      (async () => {
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            
            console.log("📡 Serial Raw Chunk:", JSON.stringify(value));
            
            // Accumulate data in buffer
            bufferRef.current += value;
            
            // Process complete lines (ending with \n)
            let newlineIndex;
            while ((newlineIndex = bufferRef.current.indexOf('\n')) !== -1) {
              // Extract complete line
              const line = bufferRef.current.substring(0, newlineIndex);
              bufferRef.current = bufferRef.current.substring(newlineIndex + 1);
              
              // Process the complete line
              if (line.trim()) {
                console.log("✅ Complete Line Received:", JSON.stringify(line));
                handleSerialData(line);
              }
            }
            
            // If buffer gets too large without newline, clear it (safety)
            if (bufferRef.current.length > 100) {
              console.warn("⚠️ Buffer overflow, clearing:", bufferRef.current);
              bufferRef.current = "";
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
      console.log("🔌 Disconnecting serial port...");
      
      if (readerRef.current) {
        await readerRef.current.cancel();
        readerRef.current = null;
      }
      
      if (portRef.current) {
        await portRef.current.close();
        portRef.current = null;
      }
      
      // Clear buffers
      bufferRef.current = "";
      isProcessingRef.current = false;
      
      setIsConnected(false);
      console.log("✅ Serial port disconnected");
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

  // Flush buffer - clear any accumulated data
  const flushBuffer = useCallback(() => {
    console.log("🧹 Manual buffer flush called");
    bufferRef.current = "";
    isProcessingRef.current = false;
    setActiveButton(null);
  }, []);

  // Keyboard simulation fallback with proper cleanup
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

    console.log("🎹 Keyboard listener registered");
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      console.log("🎹 Keyboard listener removed");
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleSerialData]); // Add dependency to prevent stale closures

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log("🧹 useWebSerial unmounting - cleaning up");
      disconnect();
    };
  }, []);

  return { 
    activeButton, 
    isConnected, 
    error,
    connect, 
    disconnect,
    sendCommand,
    flushBuffer // Expose flush function for manual clearing
  };
}

import { createContext, useContext, ReactNode } from "react";
import { useWebSerial } from "@/hooks/use-web-serial";

// Define the context type
interface SerialContextType {
  isConnected: boolean;
  activeButton: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  sendCommand: (command: string) => void;
  flushBuffer: () => void;
  // Navigation triggers
  isNavBackTriggered: boolean;   // True when F (button 5) is pressed
  isNavNextTriggered: boolean;   // True when E (button 4) is pressed
}

// Create the context with undefined default
const SerialContext = createContext<SerialContextType | undefined>(undefined);

// Provider component
export function SerialProvider({ children }: { children: ReactNode }) {
  // Call the existing hook once at the top level
  const serial = useWebSerial();

  // Derive navigation triggers from activeButton
  const isNavBackTriggered = serial.activeButton === 5; // F button
  const isNavNextTriggered = serial.activeButton === 4; // E button

  return (
    <SerialContext.Provider value={{
      ...serial,
      isNavBackTriggered,
      isNavNextTriggered,
    }}>
      {children}
    </SerialContext.Provider>
  );
}

// Custom hook to use the serial context
export function useSerial() {
  const context = useContext(SerialContext);
  if (context === undefined) {
    throw new Error("useSerial must be used within a SerialProvider");
  }
  return context;
}

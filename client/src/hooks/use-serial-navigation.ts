import { useEffect, useRef } from "react";
import { useSerial } from "@/context/SerialContext";
import { useLocation } from "wouter";

/**
 * Global Navigation Hook for Web Serial Inputs
 * 
 * Handles global navigation controls:
 * - F (Button 5): NAV_BACK - Goes to previous step or page
 * - E (Button 4): NAV_NEXT - Goes to next step or confirms action
 * 
 * @param options Configuration options
 * @param options.onBack Callback when F is pressed (optional, overrides default)
 * @param options.onNext Callback when E is pressed (optional, overrides default)
 * @param options.enableGlobalBack Enable global back navigation (default: true)
 * @param options.enableGlobalNext Enable global next navigation (default: true)
 * @param options.currentStep Current step in multi-step flow (e.g., 'video', 'quiz')
 * @param options.totalSteps Total number of steps (for step navigation)
 * @param options.onStepBack Callback for step-based back navigation
 * @param options.onStepNext Callback for step-based next navigation
 */
interface UseSerialNavigationOptions {
  onBack?: () => void;
  onNext?: () => void;
  enableGlobalBack?: boolean;
  enableGlobalNext?: boolean;
  currentStep?: string;
  totalSteps?: number;
  onStepBack?: () => void;
  onStepNext?: () => void;
}

export function useSerialNavigation(options: UseSerialNavigationOptions = {}) {
  const {
    onBack,
    onNext,
    enableGlobalBack = true,
    enableGlobalNext = true,
    currentStep,
    onStepBack,
    onStepNext,
  } = options;

  const { isNavBackTriggered, isNavNextTriggered } = useSerial();
  const [_, setLocation] = useLocation();
  
  // Track previous trigger states to detect changes
  const prevBackRef = useRef(false);
  const prevNextRef = useRef(false);

  // Handle NAV_BACK (F button)
  useEffect(() => {
    // Detect rising edge (false -> true transition)
    if (isNavBackTriggered && !prevBackRef.current) {
      console.log("🔙 NAV_BACK triggered (F button)");
      
      if (!enableGlobalBack) {
        console.log("⏭️ Global back navigation disabled");
        prevBackRef.current = isNavBackTriggered;
        return;
      }

      if (onBack) {
        // Custom back handler
        console.log("🎯 Executing custom back handler");
        onBack();
      } else if (onStepBack) {
        // Step-based back navigation
        console.log("🎯 Executing step-based back navigation");
        onStepBack();
      } else {
        // Default: Browser back
        console.log("🎯 Default: Navigating to previous page");
        window.history.back();
      }
    }
    
    prevBackRef.current = isNavBackTriggered;
  }, [isNavBackTriggered, onBack, onStepBack, enableGlobalBack]);

  // Handle NAV_NEXT (E button)
  useEffect(() => {
    // Detect rising edge (false -> true transition)
    if (isNavNextTriggered && !prevNextRef.current) {
      console.log("➡️ NAV_NEXT triggered (E button)");
      
      if (!enableGlobalNext) {
        console.log("⏭️ Global next navigation disabled");
        prevNextRef.current = isNavNextTriggered;
        return;
      }

      if (onNext) {
        // Custom next handler
        console.log("🎯 Executing custom next handler");
        onNext();
      } else if (onStepNext) {
        // Step-based next navigation
        console.log("🎯 Executing step-based next navigation");
        onStepNext();
      } else {
        // Default: No action (requires explicit handler)
        console.log("⚠️ No next handler defined");
      }
    }
    
    prevNextRef.current = isNavNextTriggered;
  }, [isNavNextTriggered, onNext, onStepNext, enableGlobalNext]);

  return {
    isNavBackTriggered,
    isNavNextTriggered,
    navigateBack: () => {
      if (onBack) {
        onBack();
      } else if (onStepBack) {
        onStepBack();
      } else {
        window.history.back();
      }
    },
    navigateNext: () => {
      if (onNext) {
        onNext();
      } else if (onStepNext) {
        onStepNext();
      }
    },
  };
}

import { useEffect } from "react";
import { useLocation } from "wouter";
import { useWebSerial } from "./use-web-serial";

/**
 * Global hardware navigation hook
 * Listens to Button 6 (Pin F) or Keyboard 'Escape' key for back navigation
 * 
 * Navigation logic:
 * - On MeetingList or Quiz or ModuleDetail -> go to MeetingList (if from meeting) or Dashboard
 * - On Dashboard -> stay on Dashboard
 * - DISABLED on Login page (/)
 */
export function useGlobalNavigation() {
  const [location, setLocation] = useLocation();
  const { activeButton } = useWebSerial();

  useEffect(() => {
    // CRITICAL: Disable on Login page
    if (location === "/") {
      return;
    }

    // Listen for Button 6 (index 5) - the BACK button
    if (activeButton === 5) {
      handleBackNavigation();
    }
  }, [activeButton, location]);

  const handleBackNavigation = () => {
    console.log("🔙 Global Back Navigation Triggered from:", location);

    // If on meeting detail or quiz, go back to meeting list
    if (location.startsWith("/meeting/")) {
      const moduleId = location.split("/")[2];
      setLocation(`/module/${moduleId}/meetings`);
    }
    // If on module detail (video), go back to meeting list
    else if (location.startsWith("/module/") && location.includes("/detail")) {
      const moduleId = location.split("/")[2];
      setLocation(`/module/${moduleId}/meetings`);
    }
    // If on meeting list, go back to dashboard
    else if (location.startsWith("/module/") && location.includes("/meetings")) {
      setLocation("/dashboard");
    }
    // If on any quiz page, go back appropriately
    else if (location.includes("/quiz")) {
      setLocation("/dashboard");
    }
    // If on dashboard, stay on dashboard (do nothing)
    else if (location === "/dashboard") {
      console.log("📍 Already on Dashboard, staying here");
    }
    // Default: go to dashboard
    else {
      setLocation("/dashboard");
    }
  };

  return { handleBackNavigation };
}

/**
 * SceneryLayer Component
 * 
 * Renders fixed background scenery elements that frame the app content:
 * - Grass/bushes at the bottom-left corner
 * - Vines at the top-right
 * 
 * Features:
 * - Fixed positioning (stays in place during scroll)
 * - Z-index: 1 (above background, behind content)
 * - Non-intrusive (pointer-events-none, doesn't block clicks)
 * - Creates depth effect with parallax-like framing
 */

export function SceneryLayer() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden" 
      style={{ zIndex: 50 }}
    >
      {/* Grass/Bush - Bottom-left corner, fixed 500px width */}
      <img
        src="/assets/scenery/grass-bottom.png"
        alt=""
        className="fixed bottom-0 left-0 w-[430px] h-auto pointer-events-none"
      />

      {/* Vines - Top-right corner */}
      <img
        src="/assets/scenery/vines-top.png"
        alt=""
        className="absolute top-0 right-0 w-48 md:w-64 h-auto pointer-events-none"
        style={{
          maxHeight: "30vh", // Limit height to 30% of viewport
          minHeight: "150px", // Ensure minimum visibility
        }}
      />
    </div>
  );
}

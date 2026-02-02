/**
 * Sound Effects Utility
 * Plays one-off sound effects at full volume (100%)
 */

export type SFXType = 'applause' | 'try-again';

/**
 * Play a sound effect at full volume
 * @param type - The type of sound effect to play
 */
export function playSFX(type: SFXType): void {
  try {
    const soundPath = type === 'applause' 
      ? '/assets/applause.mp3' 
      : '/assets/try-again.mp3';
    
    const audio = new Audio(soundPath);
    audio.volume = 1.0; // Full volume for SFX
    
    audio.play().catch((error) => {
      console.warn(`Failed to play ${type} sound:`, error);
    });
    
    console.log(`🔊 Playing SFX: ${type} at volume 1.0`);
  } catch (error) {
    console.error(`Error creating audio for ${type}:`, error);
  }
}

/**
 * Play success sound (applause)
 */
export function playSuccessSound(): void {
  playSFX('applause');
}

/**
 * Play failure sound (try again)
 */
export function playFailureSound(): void {
  playSFX('try-again');
}

import { useRef, useEffect, useState } from 'react';

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Try to play immediately
    const attemptPlay = async () => {
      if (hasStartedRef.current) return;
      
      try {
        await audio.play();
        setIsPlaying(true);
        hasStartedRef.current = true;
      } catch (error) {
        // Autoplay was blocked, we'll wait for user interaction
        console.log('Autoplay blocked, waiting for user interaction');
      }
    };

    attemptPlay();

    // Fallback: Start music on first user interaction
    const startOnInteraction = async () => {
      if (hasStartedRef.current) return;
      
      try {
        await audio.play();
        setIsPlaying(true);
        hasStartedRef.current = true;
        
        // Remove listeners once music has started
        document.removeEventListener('click', startOnInteraction);
        document.removeEventListener('keydown', startOnInteraction);
      } catch (error) {
        console.error('Failed to play audio:', error);
      }
    };

    document.addEventListener('click', startOnInteraction);
    document.addEventListener('keydown', startOnInteraction);

    // Cleanup
    return () => {
      document.removeEventListener('click', startOnInteraction);
      document.removeEventListener('keydown', startOnInteraction);
    };
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/assets/bgm.mp3"
        loop
        autoPlay
        muted={isMuted}
      />
      
      <button
        onClick={toggleMute}
        className="fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-2xl backdrop-blur-sm border-2 border-white/20"
        aria-label={isMuted ? 'Unmute background music' : 'Mute background music'}
        title={isMuted ? 'Unmute background music' : 'Mute background music'}
      >
        {isMuted ? '🔇' : '🔊'}
      </button>
    </>
  );
}

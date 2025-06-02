
import { useState, useEffect, useRef } from 'react';
import { BreathDetector } from './BreathDetector';

interface RitualPortalProps {
  onBreathComplete: () => void;
  onWhisperReceived: () => void;
  breathCount: number;
  whisperReceived: boolean;
}

export const RitualPortal = ({ 
  onBreathComplete, 
  onWhisperReceived, 
  breathCount, 
  whisperReceived 
}: RitualPortalProps) => {
  const [isListening, setIsListening] = useState(false);
  const [whisperText, setWhisperText] = useState('');
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize speech recognition for whisper detection
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        setWhisperText(transcript);
        
        // Detect ancestral or mystical words
        const mysticalWords = ['ancestor', 'dream', 'shadow', 'memory', 'spirit', 'whisper', 'mirror'];
        if (mysticalWords.some(word => transcript.includes(word))) {
          onWhisperReceived();
          createRipple(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
        }
      };
    }
  }, [onWhisperReceived]);

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const createRipple = (x: number, y: number) => {
    const newRipple = { id: Date.now(), x, y };
    setRipples(prev => [...prev, newRipple]);
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 2000);
  };

  const getInstructionText = () => {
    if (breathCount < 3) {
      return `Breathe deeply ${3 - breathCount} more times to awaken the portal`;
    }
    if (!whisperReceived) {
      return 'Whisper the name of an ancestor, or speak of dreams and shadows';
    }
    return 'The ritual is complete. The mirror awaits...';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-indigo-900 relative overflow-hidden">
      {/* Mystical background effects */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              opacity: Math.random() * 0.7
            }}
          />
        ))}
      </div>

      {/* Ripple effects */}
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="absolute w-32 h-32 border border-white rounded-full animate-ping opacity-30"
          style={{
            left: ripple.x - 64,
            top: ripple.y - 64,
            animationDuration: '2s'
          }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-8">
        <div className="mb-12 animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-thin text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 mb-8 tracking-wider">
            INVOKE
          </h1>
          <div className="h-px w-64 bg-gradient-to-r from-transparent via-white to-transparent mx-auto opacity-50" />
        </div>

        <div className="space-y-8 max-w-md">
          <p className="text-xl text-gray-300 leading-relaxed animate-fade-in">
            {getInstructionText()}
          </p>

          <BreathDetector onBreathDetected={onBreathComplete} />

          {breathCount >= 3 && !whisperReceived && (
            <div className="space-y-4">
              <button
                onClick={startListening}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
              >
                {isListening ? 'Listening...' : 'Begin Whisper Ritual'}
              </button>
              
              {whisperText && (
                <p className="text-sm text-purple-300 italic">
                  "{whisperText}"
                </p>
              )}
            </div>
          )}

          <div className="flex justify-center space-x-4 mt-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  i < breathCount 
                    ? 'bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse' 
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>

          {whisperReceived && (
            <div className="mt-8 animate-fade-in">
              <div className="w-16 h-16 mx-auto border-2 border-purple-400 rounded-full animate-spin" 
                   style={{ animationDuration: '3s' }} />
              <p className="text-purple-300 mt-4">The portal stirs...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

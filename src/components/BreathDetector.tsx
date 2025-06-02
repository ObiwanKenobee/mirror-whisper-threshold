
import { useState, useEffect, useRef } from 'react';

interface BreathDetectorProps {
  onBreathDetected: () => void;
}

export const BreathDetector = ({ onBreathDetected }: BreathDetectorProps) => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale' | 'hold'>('inhale');
  const [breathCycle, setBreathCycle] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let animationFrame: number;
    
    const initializeAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        
        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyserRef.current);
        
        analyserRef.current.fftSize = 256;
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        const detectBreath = () => {
          if (analyserRef.current) {
            analyserRef.current.getByteFrequencyData(dataArray);
            
            // Analyze low frequency data for breath detection
            const lowFreqSum = dataArray.slice(0, 10).reduce((sum, value) => sum + value, 0);
            const breathIntensity = lowFreqSum / 10;
            
            // Simple breath detection based on audio intensity patterns
            if (breathIntensity > 30 && !isBreathing) {
              setIsBreathing(true);
              simulateBreathCycle();
            }
          }
          animationFrame = requestAnimationFrame(detectBreath);
        };
        
        detectBreath();
      } catch (error) {
        console.log('Microphone access denied, using manual breath simulation');
        // Fallback to visual breath simulation
      }
    };

    initializeAudio();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isBreathing]);

  const simulateBreathCycle = () => {
    setBreathPhase('inhale');
    
    setTimeout(() => setBreathPhase('hold'), 2000);
    setTimeout(() => setBreathPhase('exhale'), 3000);
    setTimeout(() => {
      setBreathPhase('inhale');
      setIsBreathing(false);
      setBreathCycle(prev => {
        const newCycle = prev + 1;
        if (newCycle >= 1) {
          onBreathDetected();
        }
        return newCycle;
      });
    }, 6000);
  };

  const handleManualBreath = () => {
    if (!isBreathing) {
      setIsBreathing(true);
      simulateBreathCycle();
    }
  };

  const getBreathInstruction = () => {
    switch (breathPhase) {
      case 'inhale': return 'Breathe in deeply...';
      case 'hold': return 'Hold...';
      case 'exhale': return 'Release slowly...';
      default: return 'Click to breathe with the portal';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <button
        onClick={handleManualBreath}
        disabled={isBreathing}
        className={`w-32 h-32 rounded-full border-2 transition-all duration-1000 ${
          isBreathing
            ? breathPhase === 'inhale'
              ? 'border-blue-400 bg-blue-400 bg-opacity-20 scale-125'
              : breathPhase === 'hold'
              ? 'border-purple-400 bg-purple-400 bg-opacity-30 scale-125'
              : 'border-pink-400 bg-pink-400 bg-opacity-10 scale-100'
            : 'border-gray-400 hover:border-white hover:scale-105'
        }`}
      >
        <div className={`w-full h-full rounded-full transition-all duration-1000 ${
          isBreathing
            ? 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-pulse'
            : 'bg-transparent'
        }`} />
      </button>
      
      <p className="text-lg text-gray-300 animate-fade-in">
        {getBreathInstruction()}
      </p>
      
      {breathCycle > 0 && (
        <p className="text-sm text-purple-400">
          Breaths offered: {breathCycle}
        </p>
      )}
    </div>
  );
};

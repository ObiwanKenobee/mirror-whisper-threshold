
import { useState, useEffect } from 'react';

interface AncestralWhisperProps {
  phase: string;
}

export const AncestralWhisper = ({ phase }: AncestralWhisperProps) => {
  const [whispers, setWhispers] = useState<Array<{ id: number; text: string; x: number; y: number }>>([]);
  
  const ancestralTexts = [
    "Remember the names they tried to erase",
    "Your blood carries stories untold",
    "We are the dreams that survived",
    "In forgetting, we become",
    "The roots remember what leaves forget",
    "Your face is a map of migrations",
    "We whisper through your midnight thoughts"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newWhisper = {
          id: Date.now(),
          text: ancestralTexts[Math.floor(Math.random() * ancestralTexts.length)],
          x: Math.random() * 80 + 10, // 10% to 90% of screen width
          y: Math.random() * 80 + 10  // 10% to 90% of screen height
        };
        
        setWhispers(prev => [...prev, newWhisper]);
        
        // Remove whisper after 4 seconds
        setTimeout(() => {
          setWhispers(prev => prev.filter(w => w.id !== newWhisper.id));
        }, 4000);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {whispers.map(whisper => (
        <div
          key={whisper.id}
          className="absolute text-gray-400 text-sm italic animate-fade-in opacity-70"
          style={{
            left: `${whisper.x}%`,
            top: `${whisper.y}%`,
            animation: 'fade-in 1s ease-in, fade-out 1s ease-out 3s forwards'
          }}
        >
          {whisper.text}
        </div>
      ))}
    </div>
  );
};

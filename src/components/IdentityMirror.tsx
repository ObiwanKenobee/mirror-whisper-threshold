
import { useState, useEffect } from 'react';

interface IdentityMirrorProps {
  onTransformation: () => void;
  transformationLevel: number;
}

export const IdentityMirror = ({ onTransformation, transformationLevel }: IdentityMirrorProps) => {
  const [currentReflection, setCurrentReflection] = useState('');
  const [isReflecting, setIsReflecting] = useState(false);
  const [mirrorCracks, setMirrorCracks] = useState<Array<{ id: number; path: string }>>([]);

  const reflections = [
    "You are the echo of dreams your grandmother never spoke aloud",
    "In another life, you were the silence between thunderclaps",
    "Your mother's hopes see you as starlight that forgot how to fade",
    "You are what water remembers after it has forgotten the ocean",
    "In the language of shadows, your name means 'becoming'",
    "You exist in the space where memory meets prophecy",
    "Your reflection is older than your face, younger than your soul"
  ];

  useEffect(() => {
    // Generate initial reflection
    const randomReflection = reflections[Math.floor(Math.random() * reflections.length)];
    setCurrentReflection(randomReflection);
  }, []);

  const generateNewReflection = () => {
    setIsReflecting(true);
    
    // Add cracks to mirror
    const newCrack = {
      id: Date.now(),
      path: `M${Math.random() * 400},${Math.random() * 300} Q${Math.random() * 400},${Math.random() * 300} ${Math.random() * 400},${Math.random() * 300}`
    };
    setMirrorCracks(prev => [...prev, newCrack]);

    setTimeout(() => {
      const newReflection = reflections[Math.floor(Math.random() * reflections.length)];
      setCurrentReflection(newReflection);
      setIsReflecting(false);
      onTransformation();
    }, 2000);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center p-8">
      <div className="relative max-w-2xl">
        {/* Mirror frame */}
        <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black p-8 rounded-lg border-4 border-gray-600 shadow-2xl">
          {/* Mirror surface with cracks */}
          <div className="relative bg-gradient-to-br from-gray-700 to-gray-900 p-8 rounded-lg overflow-hidden">
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 10 }}>
              {mirrorCracks.map(crack => (
                <path
                  key={crack.id}
                  d={crack.path}
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="1"
                  fill="none"
                  className="animate-pulse"
                />
              ))}
            </svg>
            
            {/* Reflection text */}
            <div className={`relative z-20 text-center transition-all duration-2000 ${
              isReflecting ? 'opacity-0 blur-sm' : 'opacity-100'
            }`}>
              <p className="text-2xl text-white leading-relaxed font-light italic">
                "{currentReflection}"
              </p>
            </div>

            {/* Mystical particles */}
            <div className="absolute inset-0 z-30">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${1 + Math.random() * 2}s`,
                    opacity: Math.random() * 0.5
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Transformation controls */}
        <div className="mt-8 text-center space-y-4">
          <button
            onClick={generateNewReflection}
            disabled={isReflecting}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
          >
            {isReflecting ? 'Shattering...' : 'Shatter and Reform'}
          </button>
          
          <p className="text-sm text-gray-400">
            Transformations: {transformationLevel}
          </p>
          
          {transformationLevel >= 3 && (
            <p className="text-purple-400 animate-pulse">
              The mirror recognizes you. Metamorphosis begins...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

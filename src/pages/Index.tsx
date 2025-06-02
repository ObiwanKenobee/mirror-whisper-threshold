
import { useState, useEffect, useRef } from 'react';
import { RitualPortal } from '../components/RitualPortal';
import { IdentityMirror } from '../components/IdentityMirror';
import { BreathDetector } from '../components/BreathDetector';
import { AncestralWhisper } from '../components/AncestralWhisper';
import { TransformationCanvas } from '../components/TransformationCanvas';

const Index = () => {
  const [isInvoked, setIsInvoked] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('arrival');
  const [breathCount, setBreathCount] = useState(0);
  const [whisperReceived, setWhisperReceived] = useState(false);
  const [transformationLevel, setTransformationLevel] = useState(0);

  // Phase progression based on ritual completion
  useEffect(() => {
    if (breathCount >= 3 && whisperReceived && !isInvoked) {
      setIsInvoked(true);
      setCurrentPhase('mirror');
    }
  }, [breathCount, whisperReceived, isInvoked]);

  const handleBreathComplete = () => {
    setBreathCount(prev => prev + 1);
  };

  const handleWhisperReceived = () => {
    setWhisperReceived(true);
  };

  const handleTransformation = () => {
    setTransformationLevel(prev => prev + 1);
    if (transformationLevel >= 2) {
      setCurrentPhase('metamorphosis');
    }
  };

  if (!isInvoked) {
    return (
      <RitualPortal 
        onBreathComplete={handleBreathComplete}
        onWhisperReceived={handleWhisperReceived}
        breathCount={breathCount}
        whisperReceived={whisperReceived}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <TransformationCanvas phase={currentPhase} transformationLevel={transformationLevel} />
      
      {currentPhase === 'mirror' && (
        <>
          <BreathDetector onBreathDetected={handleTransformation} />
          <IdentityMirror 
            onTransformation={handleTransformation}
            transformationLevel={transformationLevel}
          />
          <AncestralWhisper phase={currentPhase} />
        </>
      )}

      {currentPhase === 'metamorphosis' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-8 animate-pulse">
            <h1 className="text-6xl font-thin text-white opacity-80 tracking-widest">
              BECOMING
            </h1>
            <p className="text-xl text-gray-400 max-w-md">
              You are no longer who you were when you arrived. 
              The mirror has shown you what your dreams remember.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;

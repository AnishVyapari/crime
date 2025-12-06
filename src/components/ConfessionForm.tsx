import { useState, useRef } from 'react';
import type { ConfessionData, StatusInfo } from '../App';
import { CameraCapture } from './CameraCapture';
import { sendToDiscord, checkDailyLimit } from '../utils/discord';
import { CREATOR_NAME } from '../config';

interface ConfessionFormProps {
  onConfessionSubmit: (data: ConfessionData) => void;
  onDenialSubmit: () => void;
  onStatusChange: (status: StatusInfo) => void;
  onViewCrimes: () => void;
}

export function ConfessionForm({
  onConfessionSubmit,
  onDenialSubmit,
  onStatusChange,
  onViewCrimes,
}: ConfessionFormProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<'yes' | 'no' | null>(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [crime, setCrime] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const cameraRef = useRef<{ capturePhoto: () => string | null }>(null);

  const handleAnswerSelect = (answer: 'yes' | 'no') => {
    setSelectedAnswer(answer);
    if (answer === 'no') {
      onStatusChange({ message: '⚠️ Recording your denial...', type: 'warning' });
      setTimeout(() => {
        sendToDiscord('DENIAL', { timestamp: new Date().toISOString() });
        onDenialSubmit();
      }, 500);
    } else {
      onStatusChange({ message: 'Fill in your details and capture a photo', type: 'info' });
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      onStatusChange({ message: '❌ Please enter your full name', type: 'error' });
      return;
    }
    if (!address.trim()) {
      onStatusChange({ message: '❌ Please enter your address', type: 'error' });
      return;
    }
    if (!crime.trim()) {
      onStatusChange({ message: '❌ Please describe the crime', type: 'error' });
      return;
    }

    const capturedPhoto = cameraRef.current?.capturePhoto();
    if (!capturedPhoto) {
      onStatusChange({ message: '❌ Please capture a photo first', type: 'error' });
      return;
    }

    // Check rate limit before proceeding
    const canSubmit = await checkDailyLimit();
    if (!canSubmit) {
      return;
    }

    onStatusChange({ message: '🔄 Processing confession and uploading to all systems...', type: 'info' });

    const confessionData: ConfessionData = {
      name: name.trim(),
      address: address.trim(),
      crime: crime.trim(),
      photo: capturedPhoto,
    };

    // Send to Discord webhook (initial report)
    await sendToDiscord('CONFESSION', {
      name: confessionData.name,
      address: confessionData.address,
      crime: confessionData.crime,
      timestamp: new Date().toISOString(),
    });

    onConfessionSubmit(confessionData);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="text-xl md:text-2xl text-center sm:text-left" style={{ fontWeight: 600, color: '#e0e0e0' }}>
          Did you commit a crime?
        </div>
        <div className="text-xs text-[#666] text-center sm:text-right">
          Made by <span style={{ fontWeight: 600, color: '#2196F3' }}>{CREATOR_NAME}</span>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => handleAnswerSelect('yes')}
          className={`flex-1 px-5 py-4 border-2 rounded-lg text-base transition-all transform hover:scale-105 ${
            selectedAnswer === 'yes'
              ? 'bg-[#2196F3] text-white border-[#2196F3] shadow-lg shadow-[#2196F3]/50'
              : 'bg-[#1a1a1a] text-[#e0e0e0] border-[#333] hover:border-[#2196F3] hover:shadow-lg hover:shadow-[#2196F3]/20'
          }`}
          style={{ fontWeight: 600 }}
        >
          YES
        </button>
        <button
          onClick={() => handleAnswerSelect('no')}
          className={`flex-1 px-5 py-4 border-2 rounded-lg text-base transition-all transform hover:scale-105 ${
            selectedAnswer === 'no'
              ? 'bg-[#2196F3] text-white border-[#2196F3] shadow-lg shadow-[#2196F3]/50'
              : 'bg-[#1a1a1a] text-[#e0e0e0] border-[#333] hover:border-[#2196F3] hover:shadow-lg hover:shadow-[#2196F3]/20'
          }`}
          style={{ fontWeight: 600 }}
        >
          NO
        </button>
      </div>

      {selectedAnswer === 'yes' && (
        <div className="space-y-5">
          <div>
            <label className="block text-xs md:text-sm mb-2.5 text-[#aaa]" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              className="w-full px-4 py-3.5 border-2 border-[#333] rounded-lg bg-[#0f0f0f] text-[#e0e0e0] text-base focus:outline-none focus:border-[#2196F3] focus:ring-4 focus:ring-[#2196F3]/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs md:text-sm mb-2.5 text-[#aaa]" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter address"
              className="w-full px-4 py-3.5 border-2 border-[#333] rounded-lg bg-[#0f0f0f] text-[#e0e0e0] text-base focus:outline-none focus:border-[#2196F3] focus:ring-4 focus:ring-[#2196F3]/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs md:text-sm mb-2.5 text-[#aaa]" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Crime Description
            </label>
            <textarea
              value={crime}
              onChange={(e) => setCrime(e.target.value)}
              placeholder="Describe the crime"
              rows={3}
              className="w-full px-4 py-3.5 border-2 border-[#333] rounded-lg bg-[#0f0f0f] text-[#e0e0e0] text-base focus:outline-none focus:border-[#2196F3] focus:ring-4 focus:ring-[#2196F3]/20 resize-none transition-all"
            />
          </div>

          <CameraCapture ref={cameraRef} onStatusChange={onStatusChange} />

          <button
            onClick={handleSubmit}
            className="w-full px-5 py-4 bg-gradient-to-r from-[#d32f2f] to-[#b71c1c] text-white rounded-lg text-base transition-all hover:from-[#b71c1c] hover:to-[#d32f2f] shadow-lg hover:shadow-xl transform hover:scale-105"
            style={{ fontWeight: 600 }}
          >
            Submit Confession
          </button>

          <button
            onClick={onViewCrimes}
            className="w-full px-5 py-4 bg-gradient-to-r from-[#673AB7] to-[#5E35B1] text-white rounded-lg text-base transition-all hover:from-[#5E35B1] hover:to-[#673AB7] shadow-lg hover:shadow-xl transform hover:scale-105"
            style={{ fontWeight: 600 }}
          >
            📋 View Others&apos; Crimes
          </button>
        </div>
      )}

      {selectedAnswer === 'no' && (
        <div>
          <div className="px-4 py-4 rounded-lg mb-6 text-sm md:text-base bg-[#ffebee] text-[#d32f2f] border-2 border-[#d32f2f]" style={{ fontWeight: 500 }}>
            ⚠️ This means you have committed a crime but actively chosen not to tell us. We will be
            investigating further.
          </div>
          <button
            onClick={onViewCrimes}
            className="w-full px-5 py-4 bg-gradient-to-r from-[#673AB7] to-[#5E35B1] text-white rounded-lg text-base transition-all hover:from-[#5E35B1] hover:to-[#673AB7] shadow-lg hover:shadow-xl transform hover:scale-105"
            style={{ fontWeight: 600 }}
          >
            📋 View Others&apos; Crimes
          </button>
        </div>
      )}
    </div>
  );
}
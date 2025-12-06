import { useState, useRef, useEffect } from 'react';
import type { StatusInfo } from '../App';
import { getGeminiResponse } from '../utils/gemini';

interface ChatMessage {
  role: 'user' | 'officer' | 'representative';
  content: string;
}

interface ChatContainerProps {
  mode: 'officer' | 'representative';
  suspectName?: string;
  onStatusChange: (status: StatusInfo) => void;
}

export function ChatContainer({ mode, suspectName, onStatusChange }: ChatContainerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const greeting =
      mode === 'officer'
        ? '🚔 Officer AI: You chose not to confess. We have evidence. Please explain yourself.'
        : `📋 Legal Rep: Hello ${suspectName}, this is your assigned Legal Representative. I'm here to ensure your rights are protected. Please clarify any details about your confession.`;

    setMessages([{ role: mode === 'officer' ? 'officer' : 'representative', content: greeting }]);
  }, [mode, suspectName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const systemPrompt =
        mode === 'officer'
          ? 'You are a police interrogation officer. Keep responses brief (1-2 sentences). Be professional but empathetic.'
          : 'You are a Legal Representative protecting a suspect\'s rights. Respond supportively and protectively. Keep responses 1-2 sentences.';

      const response = await getGeminiResponse(userMessage, systemPrompt);
      const prefix = mode === 'officer' ? '🚔 Officer AI: ' : '📋 Legal Rep: ';

      setMessages((prev) => [
        ...prev,
        { role: mode === 'officer' ? 'officer' : 'representative', content: prefix + response },
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      const fallback =
        mode === 'officer'
          ? '🚔 Officer AI: Continue with your statement.'
          : '📋 Legal Rep: I understand. Please continue.';

      setMessages((prev) => [
        ...prev,
        { role: mode === 'officer' ? 'officer' : 'representative', content: fallback },
      ]);
      onStatusChange({ message: '⚠️ Chat continues (API limited)', type: 'warning' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#151515] border-2 border-[#2196F3]/40 rounded-xl overflow-hidden mb-8 md:mb-10 flex flex-col max-h-[600px] shadow-2xl shadow-[#2196F3]/20">
      <div className="bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white p-4 text-center" style={{ fontWeight: 600 }}>
        {mode === 'officer' ? '🚔 Police Interrogation' : '📋 Legal Consultation'}
      </div>
      
      <div className="flex-1 overflow-y-auto p-5 space-y-3 min-h-[300px] bg-[#0f0f0f]">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`px-4 py-3 rounded-lg max-w-[85%] text-sm md:text-base shadow-md ${
              msg.role === 'user'
                ? 'bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white ml-auto'
                : msg.role === 'officer'
                ? 'bg-[#1a1a1a] text-[#00ffff] border-2 border-[#333]'
                : 'bg-gradient-to-r from-[#fff3cd] to-[#ffe4a3] text-[#664d00] border-l-4 border-[#ffc107]'
            }`}
          >
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div className="px-4 py-3 rounded-lg max-w-[85%] text-sm md:text-base bg-[#1a1a1a] text-[#00ffff] border-2 border-[#333]">
            <span className="inline-block animate-pulse">Typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t-2 border-[#2196F3]/30 flex gap-3 bg-[#1a1a1a]">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your response..."
          disabled={isLoading}
          className="flex-1 px-4 py-3 border-2 border-[#333] rounded-lg bg-[#0f0f0f] text-[#e0e0e0] text-base focus:outline-none focus:border-[#2196F3] focus:ring-4 focus:ring-[#2196F3]/20 disabled:opacity-50 transition-all"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="px-6 py-3 bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white rounded-lg text-base hover:from-[#1976D2] hover:to-[#2196F3] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:scale-105"
          style={{ fontWeight: 600 }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
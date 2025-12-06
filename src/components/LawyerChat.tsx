import { useState, useRef, useEffect } from 'react';
import type { StatusInfo } from '../App';
import { getGeminiResponse } from '../utils/gemini';

interface ChatMessage {
  role: 'user' | 'lawyer';
  content: string;
}

interface LawyerChatProps {
  suspectName: string;
  onClose: () => void;
  onStatusChange: (status: StatusInfo) => void;
  onChatComplete: (chatHistory: Array<{ role: string; content: string }>) => void;
}

export function LawyerChat({ suspectName, onClose, onStatusChange, onChatComplete }: LawyerChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const greeting = `📋 Legal Rep: I am your state-appointed legal representative. My role is to ensure your rights are protected during this interrogation. How can I help you?`;
    setMessages([{ role: 'lawyer', content: greeting }]);
  }, []);

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
        'You are a Legal Representative protecting a suspect\'s rights. Respond supportively and protectively. Keep responses 1-2 sentences.';
      const response = await getGeminiResponse(userMessage, systemPrompt);

      setMessages((prev) => [...prev, { role: 'lawyer', content: `📋 Legal Rep: ${response}` }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'lawyer',
          content: '📋 Legal Rep: I understand. Please continue, and I\'ll protect your interests.',
        },
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

  const handleClose = () => {
    // Send chat history before closing
    onChatComplete(messages);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#151515] border-2 border-[#2196F3]/40 rounded-2xl overflow-hidden max-w-lg w-full max-h-[80vh] flex flex-col animate-slideUp shadow-2xl shadow-[#2196F3]/20">
        <div className="bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white p-5 flex items-center justify-between" style={{ fontWeight: 600 }}>
          <span className="text-lg">📋 Your Legal Representative</span>
          <button onClick={handleClose} className="text-white text-2xl hover:opacity-80 transition-opacity">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3 min-h-[300px] bg-[#0f0f0f]">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`px-4 py-3 rounded-lg max-w-[85%] text-sm md:text-base shadow-md ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white ml-auto'
                  : 'bg-gradient-to-r from-[#fff3cd] to-[#ffe4a3] text-[#664d00] border-l-4 border-[#ffc107]'
              }`}
            >
              {msg.content}
            </div>
          ))}
          {isLoading && (
            <div className="px-4 py-3 rounded-lg max-w-[85%] text-sm md:text-base bg-gradient-to-r from-[#fff3cd] to-[#ffe4a3] text-[#664d00] border-l-4 border-[#ffc107]">
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
    </div>
  );
}
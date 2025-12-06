import { useState, useEffect } from 'react';
import type { StatusInfo } from '../App';
import { fetchCrimesFromDiscord } from '../utils/discord';

interface Crime {
  title: string;
  fields: { name: string; value: string }[];
  timestamp: string;
}

interface CrimesModalProps {
  onClose: () => void;
  onStatusChange: (status: StatusInfo) => void;
}

export function CrimesModal({ onClose, onStatusChange }: CrimesModalProps) {
  const [crimes, setCrimes] = useState<Crime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCrimes();
  }, []);

  const loadCrimes = async () => {
    setLoading(true);
    onStatusChange({ message: '📥 Loading public crime records...', type: 'info' });

    try {
      const fetchedCrimes = await fetchCrimesFromDiscord();
      setCrimes(fetchedCrimes);
      
      if (fetchedCrimes.length > 0) {
        onStatusChange({
          message: `✅ Loaded ${fetchedCrimes.length} public crime record${fetchedCrimes.length !== 1 ? 's' : ''}`,
          type: 'success',
        });
      } else {
        onStatusChange({
          message: 'ℹ️ No crime records found. Be the first to confess!',
          type: 'info',
        });
      }
    } catch (error) {
      console.error('Error fetching crimes:', error);
      onStatusChange({ message: '❌ Unable to load crime records', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#151515] border-2 border-[#2196F3]/40 rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col animate-slideUp shadow-2xl shadow-[#2196F3]/20">
        <div className="bg-gradient-to-r from-[#d32f2f] to-[#b71c1c] text-white p-6 text-center flex items-center justify-between" style={{ fontWeight: 700, letterSpacing: '1px' }}>
          <div className="flex-1 text-xl md:text-2xl">📋 PUBLIC CRIME RECORDS</div>
          <button
            onClick={onClose}
            className="text-white text-2xl hover:opacity-80 transition-opacity ml-4"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {loading ? (
            <div className="text-center py-16 text-[#aaa]">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#2196F3] border-t-transparent mb-4"></div>
              <div className="text-base">Loading crime records...</div>
            </div>
          ) : crimes.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <div className="text-lg text-[#aaa]">No crime records found</div>
              <div className="text-sm text-[#666] mt-2">Be the first to confess</div>
            </div>
          ) : (
            <div className="space-y-5">
              {crimes.map((crime, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-2 border-[#333] p-5 md:p-6 rounded-xl hover:border-[#2196F3] transition-all hover:shadow-lg hover:shadow-[#2196F3]/20 transform hover:scale-[1.02]"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-base md:text-lg" style={{ fontWeight: 700, color: '#2196F3' }}>
                      {crime.title}
                    </div>
                    <span className="text-xs text-[#666] bg-[#0f0f0f] px-3 py-1 rounded-full">
                      #{crimes.length - idx}
                    </span>
                  </div>
                  <div className="text-xs text-[#888] mb-4 flex items-center gap-2">
                    <span>⏰</span>
                    <span>{crime.timestamp}</span>
                  </div>
                  <div className="space-y-3 text-sm md:text-base">
                    {crime.fields.map((field, fieldIdx) => (
                      <div key={fieldIdx} className="flex flex-col sm:flex-row sm:gap-3 bg-[#0f0f0f] p-3 rounded-lg">
                        <span className="min-w-[140px] mb-1 sm:mb-0" style={{ fontWeight: 600, color: '#aaa' }}>
                          {field.name}:
                        </span>
                        <span className="text-[#e0e0e0] flex-1 break-words whitespace-pre-wrap">{field.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t-2 border-[#2196F3]/30 bg-[#0f0f0f]">
          <button
            onClick={onClose}
            className="w-full px-5 py-4 bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white rounded-lg text-base hover:from-[#1976D2] hover:to-[#2196F3] transition-all shadow-lg transform hover:scale-105"
            style={{ fontWeight: 600 }}
          >
            Close Records
          </button>
        </div>
      </div>
    </div>
  );
}
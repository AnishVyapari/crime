interface LawyerConsentProps {
  onAccept: (accepted: boolean) => void;
}

export function LawyerConsent({ onAccept }: LawyerConsentProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#151515] border-2 border-[#2196F3]/40 rounded-2xl overflow-hidden max-w-lg w-full animate-slideUp shadow-2xl shadow-[#2196F3]/20">
        <div className="p-8 md:p-10 text-center">
          <div className="text-5xl mb-6">⚖️</div>
          <div className="text-xl md:text-2xl mb-6" style={{ fontWeight: 600, color: '#e0e0e0' }}>
            Do you need a state-appointed lawyer?
          </div>
          <div className="text-base text-[#aaa] mb-8 leading-relaxed">
            You have the right to legal representation during your interview.
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => onAccept(true)}
              className="flex-1 px-5 py-4 bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white rounded-lg text-base hover:from-[#1976D2] hover:to-[#2196F3] transition-all shadow-lg transform hover:scale-105"
              style={{ fontWeight: 600 }}
            >
              YES, I NEED A LAWYER
            </button>
            <button
              onClick={() => onAccept(false)}
              className="flex-1 px-5 py-4 bg-gradient-to-r from-[#d32f2f] to-[#b71c1c] text-white rounded-lg text-base hover:from-[#b71c1c] hover:to-[#d32f2f] transition-all shadow-lg transform hover:scale-105"
              style={{ fontWeight: 600 }}
            >
              NO LAWYER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
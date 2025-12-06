import type { ConfessionData } from '../App';

interface WantedPosterProps {
  data: ConfessionData;
  onClose: () => void;
}

export function WantedPoster({ data, onClose }: WantedPosterProps) {
  const handleDownload = () => {
    if (data.photo) {
      const link = document.createElement('a');
      link.href = data.photo;
      link.download = `wanted_${data.name.replace(/\s/g, '_')}_${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#151515] border-2 border-[#d32f2f] rounded-2xl overflow-hidden max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slideUp shadow-2xl shadow-[#d32f2f]/30">
        <div className="bg-gradient-to-r from-[#d32f2f] to-[#b71c1c] text-white p-6 text-center flex items-center justify-between" style={{ fontWeight: 700, letterSpacing: '1px' }}>
          <span className="flex-1 text-2xl md:text-3xl">🚨 WANTED 🚨</span>
          <button
            onClick={onClose}
            className="text-white text-3xl hover:opacity-80 transition-opacity"
          >
            ✕
          </button>
        </div>

        <div className="p-6 md:p-10 text-center">
          {data.photo && (
            <img
              src={data.photo}
              alt="Suspect"
              className="w-full max-w-sm mx-auto border-4 border-[#e0e0e0] rounded-xl mb-6 shadow-2xl"
            />
          )}

          <div className="bg-[#0f0f0f] text-[#e0e0e0] p-5 rounded-xl mb-6 text-left text-sm md:text-base space-y-4 border-2 border-[#333]">
            <div className="flex gap-4">
              <div className="min-w-[100px]" style={{ fontWeight: 600, color: '#2196F3' }}>
                NAME:
              </div>
              <div className="flex-1 break-words" style={{ fontWeight: 600 }}>{data.name}</div>
            </div>
            <div className="flex gap-4">
              <div className="min-w-[100px]" style={{ fontWeight: 600, color: '#2196F3' }}>
                ADDRESS:
              </div>
              <div className="flex-1 break-words">{data.address}</div>
            </div>
            <div className="flex gap-4">
              <div className="min-w-[100px]" style={{ fontWeight: 600, color: '#2196F3' }}>
                CRIME:
              </div>
              <div className="flex-1 break-words">{data.crime}</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleDownload}
              className="flex-1 px-5 py-4 bg-gradient-to-r from-[#388e3c] to-[#2e7d32] text-white rounded-lg text-base hover:from-[#2e7d32] hover:to-[#388e3c] transition-all shadow-lg transform hover:scale-105"
              style={{ fontWeight: 600 }}
            >
              💾 Save Poster
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-5 py-4 border-2 border-[#2196F3] rounded-lg bg-[#0f0f0f] text-[#2196F3] text-base hover:bg-[#2196F3] hover:text-white transition-all shadow-lg transform hover:scale-105"
              style={{ fontWeight: 600 }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
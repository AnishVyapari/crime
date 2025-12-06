interface StatusMessageProps {
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

export function StatusMessage({ message, type }: StatusMessageProps) {
  const styles = {
    info: 'bg-[#e3f2fd] text-[#2196F3] border-[#2196F3]',
    success: 'bg-[#e8f5e9] text-[#388e3c] border-[#388e3c]',
    error: 'bg-[#ffebee] text-[#d32f2f] border-[#d32f2f]',
    warning: 'bg-[#fff3e0] text-[#f57c00] border-[#f57c00]',
  };

  const icons = {
    info: 'ℹ️',
    success: '✅',
    error: '❌',
    warning: '⚠️',
  };

  return (
    <div className={`px-4 py-4 rounded-lg mb-6 text-sm md:text-base border-2 shadow-lg ${styles[type]} animate-slideDown flex items-center gap-3`} style={{ fontWeight: 500 }}>
      <span className="text-xl">{icons[type]}</span>
      <span className="flex-1">{message}</span>
    </div>
  );
}
import { Cpu } from 'lucide-react';

function LoadingSpinner({ message, subMessage }) {
  return (
    <div className="loading-container">
      {/* Sci-fi nested spinner */}
      <div style={{ position: 'relative', width: '72px', height: '72px', marginBottom: '32px' }}>
        <div className="spinner" style={{ width: '72px', height: '72px', borderWidth: '3px' }} />
        <div style={{
          position: 'absolute', inset: '16px',
          borderRadius: '50%',
          border: '2px solid rgba(0,212,255,0.25)',
          borderTopColor: 'var(--secondary)',
          animation: 'spin 1.4s linear infinite reverse',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Cpu size={18} color="var(--primary)" />
        </div>
      </div>

      <div className="loading-text">{message || 'AI is thinking...'}</div>
      <div className="loading-subtext">
        {subMessage || 'Analyzing your profile and finding the best matches'}
      </div>

      {/* Animated dots */}
      <div style={{ display: 'flex', gap: '6px', marginTop: '20px' }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: 'var(--grad-primary)',
            animation: `pulse 1.2s ease-in-out infinite`,
            animationDelay: `${i * 0.2}s`,
          }} />
        ))}
      </div>
    </div>
  );
}

export default LoadingSpinner;

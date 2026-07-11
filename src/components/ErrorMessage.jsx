import { AlertTriangle, RefreshCw } from 'lucide-react';

function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-container">
      <div className="error-icon">
        <AlertTriangle size={44} color="var(--danger)" />
      </div>
      <div className="error-title">System Error Detected</div>
      <div className="error-text">
        {message || 'An unexpected error occurred. Please try again.'}
      </div>
      {onRetry && (
        <button className="btn btn-primary" onClick={onRetry} id="retry-btn">
          <RefreshCw size={16} />
          Retry
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;

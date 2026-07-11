import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { askChatbot } from '../api/ai';
import { saveChatHistory, loadChatHistory } from '../data/storage';

function Chatbot({ examScores, preferences }) {
  const [isOpen, setIsOpen] = useState(false);

  // Load chat history from storage on mount
  const stored = loadChatHistory();
  const [chatMessages, setChatMessages] = useState(
    stored.length > 0
      ? stored
      : [{ role: 'ai', content: 'Hi! I am EduPath AI Counselor — your 24/7 college guidance assistant. How can I help you today?' }]
  );
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isOpen]);

  // Persist chat history to storage whenever messages change
  useEffect(() => {
    saveChatHistory(chatMessages);
  }, [chatMessages]);

  const handleSendChat = async () => {
    if (!chatInput.trim() || isChatLoading) return;
    const userQuestion = chatInput.trim();
    setChatInput('');
    const newMessages = [...chatMessages, { role: 'user', content: userQuestion }];
    setChatMessages(newMessages);
    setIsChatLoading(true);
    try {
      const response = await askChatbot(newMessages, examScores, preferences);
      setChatMessages((prev) => [...prev, { role: 'ai', content: response }]);
    } catch {
      setChatMessages((prev) => [...prev, { role: 'ai', content: 'Sorry, I hit an error. Please try again.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        className="chatbot-toggle-btn"
        id="chatbot-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close AI counselor' : 'Open AI counselor'}
        style={{
          position: 'fixed', bottom: '24px', right: '24px',
          width: '62px', height: '62px', borderRadius: '50%',
          background: 'var(--grad-hero)',
          color: 'white', border: 'none',
          boxShadow: 'var(--glow-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 999,
          transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {isOpen ? <X size={26} /> : <MessageCircle size={26} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="glass-card chat-box"
          id="chatbot-window"
          style={{
            position: 'fixed', bottom: '102px', right: '24px',
            width: '450px', height: '600px',
            maxWidth: 'calc(100vw - 48px)',
            zIndex: 998,
            boxShadow: 'var(--glow-primary), 0 24px 60px rgba(108,60,233,0.18)',
            animation: 'scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          {/* Header */}
          <div className="chat-header">
            <Bot size={18} />
            EduPath AI Counselor
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-message ${msg.role === 'user' ? 'chat-message-user' : ''}`}
                style={{ marginBottom: '14px', textAlign: msg.role === 'user' ? 'right' : 'left' }}
              >
                <div
                  className={`chat-bubble ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}
                  style={{ display: 'inline-block', maxWidth: '85%', textAlign: 'left' }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isChatLoading && (
              <div className="chat-message" style={{ textAlign: 'left' }}>
                <div className="chat-bubble chat-bubble-ai" style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
                  {[0, 1, 2].map((i) => (
                    <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--primary)', display: 'inline-block', animation: `pulse 1.2s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="chat-input-area">
            <input
              type="text"
              id="chatbot-input"
              className="form-input"
              placeholder="Ask me anything..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              style={{ flex: 1 }}
            />
            <button
              className="btn btn-primary btn-icon"
              id="chatbot-send-btn"
              onClick={handleSendChat}
              disabled={isChatLoading || !chatInput.trim()}
              style={{ flexShrink: 0 }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;

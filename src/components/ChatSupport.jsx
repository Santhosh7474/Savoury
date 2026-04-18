import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Loader2 } from 'lucide-react';
import { savouryAI } from '../utils/savouryAI';

const ChatSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [chat, setChat] = useState([
    { role: 'system', text: 'Welcome to Savoury! I am your AI concierge. I can answer questions about our menu, hours, and location. How can I assist you today?' }
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat, isThinking]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || isThinking) return;
    
    const userMsg = message.trim();
    // Add user message
    const updatedChat = [...chat, { role: 'user', text: userMsg }];
    setChat(updatedChat);
    setMessage('');
    setIsThinking(true);

    // Get AI response
    const response = await savouryAI.ask(userMsg);
    
    setChat([...updatedChat, { role: 'system', text: response }]);
    setIsThinking(false);
  };

  return (
    <div className="chat-support-wrapper" style={{ 
      position: 'fixed', 
      bottom: '2rem', 
      right: '2rem', 
      zIndex: 9998,
      // Desktop positioning is handled by standard styles
      // Mobile positioning will be handled by media queries in index.css or inline-overrides
    }}>
      <style>{`
        @media (max-width: 768px) {
          .chat-support-wrapper {
            bottom: 6rem !important; /* Move up on mobile to clear the cart bar */
            right: 1rem !important;
          }
          .chat-window {
            width: calc(100vw - 2rem) !important;
            height: 400px !important;
            right: 0 !important;
          }
        }
      `}</style>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="glass chat-window"
            style={{
              position: 'absolute', bottom: '5rem', right: 0,
              width: '350px', height: '480px', borderRadius: '24px',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(15, 61, 46, 0.1)'
            }}
          >
            {/* Header */}
            <div style={{ backgroundColor: 'var(--color-primary)', color: '#fff', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '12px', backgroundColor: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={18} color="var(--color-primary)" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.3px' }}>AI Concierge</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }} /> Smart Assistant
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px', borderRadius: '8px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#fcfcfc' }}>
              {chat.map((msg, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ 
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    backgroundColor: msg.role === 'user' ? 'var(--color-primary)' : '#fff',
                    color: msg.role === 'user' ? '#fff' : '#1a1a1a',
                    padding: '0.85rem 1.1rem', borderRadius: '18px',
                    borderBottomRightRadius: msg.role === 'user' ? '4px' : '18px',
                    borderBottomLeftRadius: msg.role === 'system' ? '4px' : '18px',
                    fontSize: '0.9rem', maxWidth: '85%',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    border: msg.role === 'user' ? 'none' : '1px solid #f0f0f0',
                    lineHeight: 1.5
                  }}
                >
                  {msg.text}
                </motion.div>
              ))}
              
              {isThinking && (
                <div style={{ alignSelf: 'flex-start', backgroundColor: '#fff', padding: '0.85rem 1.1rem', borderRadius: '18px', borderBottomLeftRadius: '4px', border: '1px solid #f0f0f0', display: 'flex', gap: '0.5rem', alignItems: 'center', color: '#666', fontSize: '0.85rem' }}>
                  <Loader2 size={16} className="animate-spin" />
                  AI is thinking...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} style={{ padding: '1.25rem', borderTop: '1px solid #f0f0f0', display: 'flex', gap: '0.75rem', backgroundColor: '#fff' }}>
              <input 
                type="text" 
                placeholder="Ask about menu, hours, or reservations..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                disabled={isThinking}
                style={{ 
                  flex: 1, 
                  padding: '0.75rem 1.25rem', 
                  borderRadius: '14px', 
                  border: '1px solid #e5e7eb', 
                  outline: 'none', 
                  fontSize: '0.9rem',
                  backgroundColor: '#f9fafb',
                  transition: 'border-color 0.2s'
                }} 
              />
              <button 
                type="submit" 
                disabled={!message.trim() || isThinking}
                style={{ 
                  width: '44px', 
                  height: '44px', 
                  borderRadius: '12px', 
                  backgroundColor: 'var(--color-primary)', 
                  border: 'none', 
                  color: '#fff', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  cursor: (message.trim() && !isThinking) ? 'pointer' : 'not-allowed',
                  opacity: (message.trim() && !isThinking) ? 1 : 0.6,
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 12px rgba(15, 61, 46, 0.2)'
                }}
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '64px', 
          height: '64px', 
          borderRadius: '20px',
          backgroundColor: 'var(--color-primary)', 
          color: '#fff',
          border: 'none', 
          cursor: 'pointer', 
          display: 'flex',
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: '0 12px 40px rgba(15, 61, 46, 0.35)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.15), transparent)' }} />
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
        {!isOpen && (
          <span style={{ position: 'absolute', top: '12px', right: '12px', width: '10px', height: '10px', backgroundColor: '#ef4444', borderRadius: '50%', border: '2px solid var(--color-primary)', zIndex: 2 }} />
        )}
      </motion.button>
    </div>
  );
};

export default ChatSupport;


import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MessageSquare, Send, Bot, User, Loader2, Sparkles, TrendingUp, Scale, FileText, X, Minimize2, Maximize2, Trash2 } from 'lucide-react';

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  
  // Load history from localStorage or default
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('market_hall_chat_history');
    return saved ? JSON.parse(saved) : [
      { role: 'assistant', content: 'Neural Core Advisor online. How can I optimize your strategy today?' }
    ];
  });
  
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('market_hall_chat_history', JSON.stringify(history));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  // Listen for storage events (to sync with AdvisorPage)
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'market_hall_chat_history') {
        setHistory(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleSend = async () => {
    if (!message.trim()) return;

    const newHistory = [...history, { role: 'user', content: message }];
    setHistory(newHistory);
    setMessage('');
    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5002/api'}/chat`, {
        message,
        history: newHistory.slice(-5)
      });
      setHistory([...newHistory, { role: 'assistant', content: res.data.reply }]);
    } catch (error) {
      setHistory([...newHistory, { role: 'assistant', content: "Neural link interrupted." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-neon-green text-slate-950 rounded-full shadow-[0_0_20px_rgba(0,255,148,0.4)] flex items-center justify-center hover:scale-110 transition-all z-50 group"
      >
        <Bot size={28} />
        <span className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full animate-ping opacity-20"></span>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-8 right-8 w-[400px] transition-all duration-500 z-50 ${isMinimized ? 'h-16' : 'h-[600px]'}`}>
      <div className="glass-panel rounded-2xl h-full flex flex-col overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-neon-green/20">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neon-green flex items-center justify-center shadow-[0_0_15px_rgba(0,255,148,0.2)]">
              <Bot size={22} className="text-slate-950" />
            </div>
            <div>
              <h3 className="font-space text-[10px] font-bold text-white uppercase tracking-widest">Neural Core</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-neon-green animate-pulse"></span>
                <span className="text-[9px] text-on-surface-variant font-medium uppercase tracking-tighter">Persistent Session</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setHistory([{ role: 'assistant', content: 'Session cleared.' }])} 
              className="p-2 hover:text-neon-error transition-colors"
            >
              <Trash2 size={14} />
            </button>
            <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 hover:bg-white/5 rounded-full text-slate-400">
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-full text-slate-400">
              <X size={16} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar bg-surface-dark/40">
              {history.map((msg, idx) => (
                <div key={idx} className={`flex gap-4 items-start ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user' ? 'bg-white/5 border border-white/10' : 'bg-neon-green/20 border border-neon-green/30'
                  }`}>
                    {msg.role === 'user' ? <User size={16} className="text-on-surface-variant" /> : <Bot size={16} className="text-neon-green" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl p-4 text-xs font-inter leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-surface-container-low border border-white/5 text-right text-on-surface' 
                      : 'bg-surface-container border border-neon-green/10 text-left text-on-surface'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-neon-green/20 flex items-center justify-center">
                    <Loader2 size={16} className="text-neon-green animate-spin" />
                  </div>
                  <div className="bg-surface-container border border-neon-green/10 rounded-2xl p-4">
                    <div className="flex gap-1">
                      <span className="w-1 h-1 bg-neon-green/40 rounded-full animate-bounce"></span>
                      <span className="w-1 h-1 bg-neon-green/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/5 bg-slate-950/60 backdrop-blur-md">
              <div className="relative flex items-center">
                <input 
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask Neural Core..."
                  className="w-full bg-surface-container-low border border-white/10 text-white focus:ring-1 focus:ring-neon-green/20 px-6 py-3 rounded-full font-inter text-xs transition-all"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-neon-green text-slate-950 flex items-center justify-center hover:scale-105 transition-transform"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;

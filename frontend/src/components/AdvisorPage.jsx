import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Bot, User, Loader2, Sparkles, TrendingUp, Scale, FileText, BrainCircuit, Zap, Trash2, Maximize2, LineChart as ChartIcon, Microscope } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const DynamicChart = ({ data, symbol }) => (
  <div className="w-full h-48 mt-4 bg-slate-900/50 rounded-xl p-4 border border-white/5">
    <div className="flex justify-between items-center mb-4">
      <span className="text-[10px] font-bold text-neon-blue uppercase tracking-widest">{symbol} 30D Trend</span>
      <ChartIcon size={12} className="text-neon-blue" />
    </div>
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00d1ff" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#00d1ff" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <Tooltip 
          contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', fontSize: '10px' }}
          itemStyle={{ color: '#00d1ff' }}
        />
        <Area type="monotone" dataKey="price" stroke="#00d1ff" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

const AdvisorPage = () => {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('market_hall_chat_history');
    return saved ? JSON.parse(saved) : [
      { role: 'assistant', content: 'Neural Core Advisor online. I am the narrator for our AI models. You can ask "Why are you recommending a Buy on Reliance?" to see my technical audit.' }
    ];
  });
  
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('market_hall_chat_history', JSON.stringify(history));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSend = async (overrideMsg) => {
    const textToSend = overrideMsg || message;
    if (!textToSend.trim()) return;

    const newHistory = [...history, { role: 'user', content: textToSend }];
    setHistory(newHistory);
    setMessage('');
    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5002/api'}/chat`, {
        message: textToSend,
        history: newHistory.slice(-10)
      });
      setHistory([...newHistory, { role: 'assistant', content: res.data.reply }]);
    } catch (error) {
      setHistory([...newHistory, { role: 'assistant', content: "Neural link interrupted. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    const defaultMsg = [{ role: 'assistant', content: 'Neural Core ready for new session.' }];
    setHistory(defaultMsg);
  };

  const renderMessageContent = (content) => {
    const chartMatch = content.match(/\[CHART_DATA:(.*?)\]/);
    if (chartMatch) {
      try {
        const chartInfo = JSON.parse(chartMatch[1]);
        const cleanContent = content.replace(/\[CHART_DATA:.*?\]/, '').trim();
        return (
          <>
            <div className="prose prose-invert max-w-none opacity-90">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{cleanContent}</ReactMarkdown>
            </div>
            <DynamicChart data={chartInfo.data} symbol={chartInfo.symbol} />
          </>
        );
      } catch (e) {
        return <div className="prose prose-invert max-w-none opacity-90"><ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown></div>;
      }
    }
    return <div className="prose prose-invert max-w-none opacity-90"><ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown></div>;
  };

  return (
    <main className="pt-24 px-4 pb-2 w-[98%] max-w-[1800px] mx-auto flex flex-col h-[96vh] animate-fade-in overflow-hidden">
      <header className="flex justify-between items-center mb-3 px-4">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <h1 className="font-space text-xl font-bold text-white uppercase tracking-tighter flex items-center gap-2">
               <BrainCircuit className="text-neon-green" size={20} />
               Neural Advisor
            </h1>
          </div>
          <div className="h-4 w-px bg-white/10"></div>
          <p className="font-inter text-[9px] text-on-surface-variant flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green shadow-[0_0_10px_#00ff94] animate-pulse"></span>
            Narrator Mode: Technical Logic Active
          </p>
        </div>
        <div className="flex items-center gap-4">
           <button 
            onClick={clearHistory}
            className="px-3 py-1 rounded-full border border-white/5 text-slate-400 text-[9px] font-black hover:bg-white/5 transition-all flex items-center gap-1.5 uppercase tracking-widest"
          >
            <Trash2 size={10} />
            Reset
          </button>
        </div>
      </header>

      <div className="flex-1 glass-panel rounded-[2rem] flex flex-col overflow-hidden border-white/5 relative shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
        <div ref={scrollRef} className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6 custom-scrollbar bg-surface-dark/10">
          {history.map((msg, idx) => (
            <div key={idx} className={`flex gap-6 md:gap-8 items-start w-full ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border transition-all duration-500 ${
                msg.role === 'user' ? 'bg-surface-container-high border-white/10' : 'bg-neon-green/10 border-neon-green/30 shadow-[0_0_20px_rgba(0,255,148,0.1)]'
              }`}>
                {msg.role === 'user' ? <User size={18} className="text-on-surface-variant" /> : <Bot size={18} className="text-neon-green" />}
              </div>
              <div className={`max-w-[94%] rounded-2xl md:rounded-3xl p-5 md:p-7 font-inter leading-relaxed text-sm transition-all duration-500 ${
                msg.role === 'user' 
                  ? 'bg-surface-container-low border border-white/5 text-on-surface' 
                  : 'bg-surface-container/60 border border-neon-green/10 text-on-surface shadow-xl backdrop-blur-md'
              }`}>
                {msg.role === 'assistant' && (
                  <div className="flex gap-2 mb-3">
                    <div className="bg-neon-green/10 px-2 py-0.5 rounded-full text-[8px] font-black text-neon-green border border-neon-green/20 uppercase tracking-[0.2em]">NARRATOR_CORE</div>
                  </div>
                )}
                {renderMessageContent(msg.content)}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-8 items-start">
              <div className="w-9 h-9 rounded-xl bg-neon-green/10 border border-neon-green/30 flex items-center justify-center animate-pulse">
                <Loader2 size={18} className="text-neon-green animate-spin" />
              </div>
              <div className="bg-surface-container/60 border border-neon-green/10 rounded-3xl p-5 md:p-7">
                <div className="flex gap-2">
                  <span className="w-1.5 h-1.5 bg-neon-green/60 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-neon-green/60 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-neon-green/60 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-3 border-t border-white/5 bg-slate-950/80 backdrop-blur-3xl">
          <div className="flex gap-2 mb-3 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
            {[
              { icon: <Microscope size={12} />, label: 'Why buy Reliance right now?' },
              { icon: <TrendingUp size={12} />, label: 'TCS Technical Audit' },
              { icon: <Zap size={12} />, label: 'Apple 30 day trend' },
              { icon: <BrainCircuit size={12} />, label: 'Market Sentiment' }
            ].map((chip, i) => (
              <button 
                key={i} 
                onClick={() => handleSend(chip.label)}
                className="whitespace-nowrap px-4 py-1.5 rounded-full border border-white/5 text-slate-400 font-space text-[9px] font-bold uppercase tracking-[0.2em] hover:border-neon-green/30 hover:text-white transition-all active:scale-95 bg-white/5"
              >
                {chip.icon} {chip.label}
              </button>
            ))}
          </div>
          <div className="relative flex items-center w-full">
            <input 
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me 'Why Buy Reliance?' for a technical narrative..."
              className="w-full bg-surface-container-low/40 border border-white/5 text-white focus:ring-1 focus:ring-neon-green/20 focus:border-neon-green/20 px-8 py-3 rounded-full font-inter text-md transition-all placeholder:text-white/20 outline-none shadow-2xl"
            />
            <button 
              onClick={handleSend}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-neon-green text-slate-950 flex items-center justify-center hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,255,148,0.2)] active:scale-95 group"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdvisorPage;

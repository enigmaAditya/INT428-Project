import React, { useState, useEffect } from 'react';
import { X, TrendingUp, Zap, DollarSign, Loader2, CheckCircle, ArrowUpRight, BarChart3, Bell, Radio, UserCircle, Cpu, Wifi, Database } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// ... (Previous modals: InsightModal, TradeModal) ...

export const NotificationModal = ({ isOpen, onClose }) => {
  const alerts = [
    { type: 'MARKET', msg: 'AAPL breaking resistance at $220. Neural Core bullish.', time: '2m ago' },
    { type: 'SYSTEM', msg: 'Llama 3.3 engine latency optimized to 42ms.', time: '15m ago' },
    { type: 'PORTFOLIO', msg: 'Net worth increased by 4.2% since last login.', time: '1h ago' },
    { type: 'AI', msg: 'New insight report ready for TSLA.', time: '3h ago' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-end md:justify-center p-4 md:p-6 backdrop-blur-sm bg-black/20">
      <div className="glass-panel w-full max-w-sm rounded-2xl p-6 border-white/5 animate-fade-in shadow-[0_20px_50px_rgba(0,0,0,0.5)] md:mr-10 md:mt-20">
        <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <Bell className="text-neon-green" size={18} />
            <h3 className="font-space text-sm font-bold text-white uppercase tracking-widest">Neural Alerts</h3>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {alerts.map((alert, i) => (
            <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[9px] font-black text-neon-green bg-neon-green/10 px-1.5 py-0.5 rounded uppercase tracking-tighter">{alert.type}</span>
                <span className="text-[9px] text-on-surface-variant uppercase font-bold">{alert.time}</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">{alert.msg}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const SystemStatusModal = ({ isOpen, onClose }) => {
  const [statuses, setStatuses] = useState([
    { name: 'Core Server', status: 'Optimal', icon: <Database size={16} />, color: 'text-neon-green' },
    { name: 'Llama 3.3 Link', status: 'Connected', icon: <Cpu size={16} />, color: 'text-neon-green' },
    { name: 'Market Streams', status: 'Live', icon: <Wifi size={16} />, color: 'text-neon-green' },
    { name: 'Neural Latency', status: '12ms', icon: <Zap size={16} />, color: 'text-neon-blue' }
  ]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-black/40">
      <div className="glass-panel w-full max-w-sm rounded-2xl p-8 border-neon-blue/20 animate-fade-in shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Radio className="text-neon-blue animate-pulse" size={20} />
            <h3 className="font-space text-lg font-bold text-white uppercase tracking-widest">System Health</h3>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {statuses.map((s, i) => (
            <div key={i} className="flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  {s.icon}
                </div>
                <span className="font-inter text-sm text-on-surface-variant uppercase font-bold tracking-wider">{s.name}</span>
              </div>
              <span className={`font-space text-xs font-bold ${s.color} uppercase`}>{s.status}</span>
            </div>
          ))}
        </div>

        <div className="mt-10 p-4 rounded-xl bg-neon-blue/5 border border-neon-blue/20 text-center">
          <p className="text-[10px] font-space text-neon-blue uppercase tracking-widest">All neural clusters synchronized</p>
        </div>
      </div>
    </div>
  );
};

export const ProfileModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-black/40">
      <div className="glass-panel w-full max-w-sm rounded-2xl p-8 border-white/10 animate-fade-in shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center mb-6 border-2 border-neon-green/30 p-1">
             <div className="w-full h-full rounded-full bg-neon-green/10 flex items-center justify-center text-neon-green">
                <UserCircle size={48} />
             </div>
          </div>
          <h3 className="font-space text-2xl font-bold text-white mb-1 uppercase tracking-tighter">
            {user?.username || 'GUEST_USER'}
          </h3>
          <p className="font-space text-[10px] text-neon-green font-black uppercase tracking-[0.2em] mb-6">
            Neural Operative
          </p>
          
          <div className="w-full space-y-3 bg-white/5 p-6 rounded-2xl border border-white/5">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-[10px] text-on-surface-variant uppercase font-bold">UID</span>
              <span className="text-[10px] text-white font-space">
                {user?.id?.slice(-8).toUpperCase() || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-[10px] text-on-surface-variant uppercase font-bold">Status</span>
              <span className="text-xs text-neon-green font-space uppercase">Owner</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-on-surface-variant uppercase font-bold">Project</span>
              <span className="text-xs text-white font-space uppercase">Solo Genesis</span>
            </div>
          </div>

          <button onClick={onClose} className="mt-8 w-full py-3 rounded-full border border-white/10 text-white font-space text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all">
            Close Terminal
          </button>
        </div>
      </div>
    </div>
  );
};

export const InsightModal = ({ isOpen, onClose }) => {
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) fetchInsight();
  }, [isOpen]);

  const fetchInsight = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5002/api'}/chat`, {
        message: "Give me a 2-sentence highly professional market insight based on current tech trends.",
        history: []
      });
      setInsight(res.data.reply);
    } catch (e) {
      setInsight("Neural link failed. Markets remain volatile.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-black/40">
      <div className="glass-panel w-full max-w-lg rounded-2xl p-8 border-neon-green/20 animate-fade-in shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neon-green/10 flex items-center justify-center border border-neon-green/30">
              <Zap className="text-neon-green" size={20} />
            </div>
            <h3 className="font-space text-lg font-bold text-white uppercase tracking-widest">Neural Insight</h3>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="min-h-[100px] flex flex-col justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-4 py-6">
              <Loader2 className="text-neon-green animate-spin" size={32} />
              <p className="text-[10px] font-space text-neon-green uppercase tracking-widest animate-pulse">Analyzing Global Streams...</p>
            </div>
          ) : (
            <div className="bg-surface-container/50 border border-white/5 rounded-xl p-6 italic font-inter text-md text-on-surface leading-relaxed">
              "{insight}"
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 rounded-full bg-neon-green text-slate-950 font-space text-[10px] font-bold uppercase tracking-widest hover:bg-neon-blue transition-all">
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};

export const TradeModal = ({ isOpen, onClose, onTradeComplete }) => {
  const [formData, setFormData] = useState({ symbol: '', qty: '', price: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleTrade = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5002/api'}/portfolio`, {
        ...formData,
        qty: parseFloat(formData.qty),
        avgCost: parseFloat(formData.price),
        name: formData.symbol.toUpperCase(),
        sector: 'Trading',
        price: parseFloat(formData.price),
        change: 0
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onTradeComplete();
        onClose();
        setFormData({ symbol: '', qty: '', price: '' });
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-black/40">
      <div className="glass-panel w-full max-w-md rounded-2xl p-8 border-neon-green/20 animate-fade-in shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neon-green flex items-center justify-center shadow-[0_0_15px_rgba(0,255,148,0.3)]">
              <BarChart3 className="text-slate-950" size={20} />
            </div>
            <h3 className="font-space text-lg font-bold text-white uppercase tracking-widest">Trade Terminal</h3>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center gap-4 py-10 animate-fade-in">
            <CheckCircle className="text-neon-green" size={64} />
            <h4 className="font-space text-xl font-bold text-white">TRADE EXECUTED</h4>
            <p className="text-on-surface-variant text-sm">Asset integrated into Neural Portfolio.</p>
          </div>
        ) : (
          <form onSubmit={handleTrade} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-space font-bold text-on-surface-variant uppercase tracking-widest">Asset Symbol</label>
              <input 
                required
                placeholder="AAPL, TSLA, BTC-USD..."
                className="w-full bg-surface-container-low border border-white/10 rounded-xl px-5 py-4 text-white font-space text-lg focus:ring-1 focus:ring-neon-green/30 outline-none"
                value={formData.symbol}
                onChange={e => setFormData({...formData, symbol: e.target.value.toUpperCase()})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-space font-bold text-on-surface-variant uppercase tracking-widest">Quantity</label>
                <input 
                  required
                  type="number"
                  placeholder="0.00"
                  className="w-full bg-surface-container-low border border-white/10 rounded-xl px-5 py-4 text-white font-space text-lg focus:ring-1 focus:ring-neon-green/30 outline-none"
                  value={formData.qty}
                  onChange={e => setFormData({...formData, qty: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-space font-bold text-on-surface-variant uppercase tracking-widest">Limit Price ($)</label>
                <input 
                  required
                  type="number"
                  placeholder="0.00"
                  className="w-full bg-surface-container-low border border-white/10 rounded-xl px-5 py-4 text-white font-space text-lg focus:ring-1 focus:ring-neon-green/30 outline-none"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-neon-green text-slate-950 font-space font-bold py-5 rounded-xl shadow-[0_0_20px_rgba(0,255,148,0.3)] hover:bg-neon-blue transition-all uppercase tracking-tighter flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <ArrowUpRight size={20} />}
              EXECUTE NEURAL TRADE
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

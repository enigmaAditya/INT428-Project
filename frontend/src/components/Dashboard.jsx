import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUp, ArrowDown, Activity, DollarSign, TrendingUp, RefreshCcw, Hexagon, MemoryStick, Loader2, Globe } from 'lucide-react';
import axios from 'axios';

const DataTile = ({ title, value, change, trend, loading, active }) => (
  <div className={`bg-surface-container/60 backdrop-blur-xl border rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group hover:bg-surface-container/80 transition-all duration-300 h-full ${active ? 'border-neon-green/50 ring-1 ring-neon-green/20' : 'border-white/5'}`}>
    <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-20 transition-opacity group-hover:opacity-30 ${trend === 'up' ? 'bg-neon-green' : 'bg-neon-error'}`}></div>
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className="font-space text-[10px] text-on-surface-variant uppercase tracking-widest">{title}</div>
      {trend === 'up' ? <ArrowUp size={14} className="text-neon-green" /> : <ArrowDown size={14} className="text-neon-error" />}
    </div>
    <div className="relative z-10">
      <div className="font-inter text-2xl font-bold text-white mb-1">
        {loading ? <span className="animate-pulse">---</span> : value}
      </div>
      <div className={`font-inter text-sm font-semibold flex items-center gap-1 ${trend === 'up' ? 'bull-text' : 'bear-text'}`}>
        {trend === 'up' ? '+' : ''}{change}%
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [marketData, setMarketData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [activeChartSymbol, setActiveChartSymbol] = useState('RELIANCE.NS');

  const fetchMarketData = async () => {
    setLoading(true);
    try {
      const symbols = ['RELIANCE.NS', 'TCS.NS', 'AAPL', 'BTC-USD'];
      const responses = await Promise.all(symbols.map(s => axios.get(`http://localhost:5002/api/market/${s}`)));
      setMarketData(responses.map(r => r.data));
    } catch (error) {
      console.error("Failed to fetch market data", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChartHistory = async (symbol) => {
    if (!symbol) return;
    setChartLoading(true);
    setActiveChartSymbol(symbol);
    try {
      // Small timeout to ensure the UI feels responsive
      const res = await axios.get(`http://localhost:5002/api/market/${symbol}/history`);
      if (res.data && res.data.length > 0) {
        setChartData(res.data);
      } else {
        // This should not happen now with the new backend fallback, but safety first
        setChartData([]);
      }
    } catch (error) {
      console.error("Failed to fetch chart data", error);
      setChartData([]);
    } finally {
      setChartLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    fetchChartHistory('RELIANCE.NS');
    const interval = setInterval(fetchMarketData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pt-32 px-gutter pb-10 max-w-7xl mx-auto animate-fade-in">
      <header className="mb-10 flex items-end justify-between">
        <div>
          <h1 className="font-space text-4xl font-bold text-white mb-2 uppercase">Market Overview</h1>
          <p className="font-inter text-on-surface-variant flex items-center gap-2">
            <Globe size={14} className="text-neon-blue" />
            Neural Link: Active (Global & NSE Nodes)
          </p>
        </div>
        <div className="flex items-center gap-2 bg-surface-container/50 p-2 px-4 rounded-full border border-white/5 backdrop-blur-xl">
          <span className="w-2 h-2 rounded-full bg-neon-green shadow-[0_0_10px_#00ff94] animate-pulse"></span>
          <span className="font-space text-[10px] text-on-surface-variant uppercase tracking-widest uppercase">Live Stream</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading && marketData.length === 0 ? (
          [1, 2, 3, 4].map(i => <div key={i} className="h-32"><DataTile loading={true} title="SYNCING..." value="..." change="0" trend="up" /></div>)
        ) : (
          marketData.map((data, i) => (
            <div key={i} onClick={() => fetchChartHistory(data.symbol)} className="cursor-pointer hover:scale-[1.02] transition-all h-32">
              <DataTile 
                active={activeChartSymbol === data.symbol}
                title={data.symbol} 
                value={data.currency === 'INR' ? `₹${parseFloat(data.price).toLocaleString('en-IN')}` : `$${parseFloat(data.price).toLocaleString()}`} 
                change={data.change?.toFixed(2)} 
                trend={data.change >= 0 ? 'up' : 'down'} 
              />
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 glass-panel rounded-2xl p-8 min-h-[500px] flex flex-col relative overflow-hidden border-white/5">
          <div className="flex justify-between items-center mb-8 relative z-10">
            <div className="flex items-center gap-3">
               <h2 className="font-space text-xl font-bold text-white uppercase tracking-tighter">{activeChartSymbol} Performance</h2>
               <span className="text-[10px] font-bold text-neon-blue bg-neon-blue/10 px-2 py-0.5 rounded border border-neon-blue/20 uppercase tracking-widest">Market Vector</span>
            </div>
            <div className="flex bg-surface-container-high rounded-full p-1 border border-white/5">
              {['RELIANCE.NS', 'TCS.NS', 'AAPL', 'BTC-USD'].map(sym => (
                <button 
                  key={sym} 
                  onClick={() => fetchChartHistory(sym)}
                  className={`font-space text-[10px] px-5 py-1.5 rounded-full transition-all uppercase font-bold tracking-wider ${activeChartSymbol === sym ? 'bg-neon-green text-slate-950 shadow-[0_0_15px_rgba(0,255,148,0.4)]' : 'text-on-surface-variant hover:text-white'}`}
                >
                  {sym.split('.')[0]}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 w-full relative z-10 min-h-[350px]">
            {chartLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                 <Loader2 className="text-neon-green animate-spin" size={40} />
                 <p className="font-space text-[10px] text-neon-green uppercase tracking-widest animate-pulse">Synchronizing Data Streams...</p>
              </div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ff94" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00ff94" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis hide domain={['auto', 'auto']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#121318', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontFamily: 'Space Grotesk' }}
                    itemStyle={{ color: '#00ff94' }}
                    labelStyle={{ color: '#ffffff', marginBottom: '4px' }}
                  />
                  <Area isAnimationActive={true} type="linear" dataKey="value" stroke="#00ff94" strokeWidth={2.5} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-on-surface-variant/30">
                 <Activity size={48} className="mb-4" />
                 <p className="font-space text-[10px] uppercase tracking-[0.3em]">No Vector Data Available</p>
                 <button onClick={() => fetchChartHistory(activeChartSymbol)} className="mt-4 text-[10px] text-neon-green border border-neon-green/20 px-4 py-2 rounded-full hover:bg-neon-green/10 transition-all uppercase tracking-widest">Retry Connection</button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-panel rounded-2xl p-8 border-neon-green/20">
            <h2 className="font-space text-lg font-bold text-white mb-6 uppercase tracking-widest">Neural Command</h2>
            <div className="flex flex-col gap-4">
              <button className="w-full bg-neon-green text-slate-950 font-space font-bold py-4 rounded-xl shadow-[0_0_15px_rgba(0,255,148,0.2)] hover:bg-neon-blue transition-all flex items-center justify-center gap-2 uppercase tracking-tighter active:scale-95">
                <TrendingUp size={18} />
                Optimize Strategy
              </button>
              <button onClick={fetchMarketData} className="w-full bg-transparent border border-white/10 text-white font-space font-bold py-4 rounded-xl hover:border-neon-green/50 transition-all flex items-center justify-center gap-2 uppercase tracking-tighter active:scale-95">
                <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
                Sync Market Core
              </button>
            </div>
          </div>

          <div className="flex-1 glass-panel rounded-2xl p-8 flex flex-col border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-space text-lg font-bold text-white flex items-center gap-2">
                <MemoryStick size={18} className="text-neon-blue" />
                Intelligence
              </h2>
              <span className="text-[9px] font-black bg-neon-green/10 text-neon-green px-2 py-1 rounded border border-neon-green/20 animate-pulse uppercase tracking-widest">Live Link</span>
            </div>
            
            <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
              {[
                { type: 'VECTOR', time: 'Just Now', msg: `Primary analysis of ${activeChartSymbol} completed. Trends aligned with neural forecast.`, color: 'text-neon-blue' },
                { type: 'MARKET', time: '5m ago', msg: 'Global liquidity pool expansion detected. Monitoring volume spikes.', color: 'text-neon-green' },
                { type: 'SYSTEM', time: '12m ago', msg: 'Multi-exchange relay established. NSE & Global data synchronized.', color: 'text-on-surface-variant' }
              ].map((item, i) => (
                <div key={i} className={`border-l-2 pl-4 py-1 transition-all hover:bg-white/5 rounded-r-lg border-white/10`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-space text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/5 ${item.color}`}>{item.type}</span>
                    <span className="font-inter text-[10px] text-on-surface-variant uppercase font-bold">{item.time}</span>
                  </div>
                  <p className="font-inter text-sm text-on-surface-variant transition-colors">{item.msg}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

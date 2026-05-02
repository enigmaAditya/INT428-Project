import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, Search, Plus, FileText, PieChart, TrendingUp, TrendingDown, LayoutGrid, RefreshCcw } from 'lucide-react';
import axios from 'axios';

const Portfolio = () => {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPortfolio = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5002/api'}/portfolio`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHoldings(res.data);
    } catch (error) {
      console.error("Failed to fetch portfolio", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const totalValue = holdings.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
  const totalCost = holdings.reduce((acc, curr) => acc + (curr.avgCost * curr.qty), 0);
  const totalPL = totalValue - totalCost;
  const plPercentage = totalCost > 0 ? (totalPL / totalCost) * 100 : 0;

  if (loading) {
    return (
      <div className="pt-32 flex flex-col items-center justify-center min-h-screen">
        <RefreshCcw className="text-neon-green animate-spin mb-4" size={32} />
        <p className="font-space text-[10px] text-neon-green uppercase tracking-widest">Decrypting Assets...</p>
      </div>
    );
  }

  return (
    <main className="pt-32 px-gutter pb-16 max-w-7xl mx-auto animate-fade-in">
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
        <div className="glass-panel rounded-2xl p-8 col-span-12 md:col-span-8 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 to-transparent pointer-events-none"></div>
          <div>
            <h2 className="font-space text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-2">Net Worth</h2>
            <div className="flex items-end gap-6">
              <span className="font-space text-5xl font-black text-white">${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              <span className={`font-space text-lg font-bold flex items-center gap-1 pb-1 ${totalPL >= 0 ? 'bull-text' : 'bear-text'}`}>
                {totalPL >= 0 ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                {plPercentage.toFixed(2)}%
              </span>
            </div>
          </div>
          <div className="mt-10 flex gap-4">
            <button className="bg-neon-green text-slate-950 px-8 py-3 rounded-full font-space text-[11px] font-bold uppercase tracking-widest hover:bg-neon-blue transition-all shadow-[0_0_20px_rgba(0,255,148,0.3)] flex items-center gap-2 active:scale-95">
              <Plus size={16} />
              Add Asset
            </button>
            <button className="border border-white/10 text-white px-8 py-3 rounded-full font-space text-[11px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all flex items-center gap-2 active:scale-95">
              <FileText size={16} />
              Export Reports
            </button>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-8 col-span-12 md:col-span-4 flex flex-col justify-between">
          <div>
            <h2 className="font-space text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-2">Total P&L</h2>
            <div className={`font-space text-4xl font-bold mt-2 ${totalPL >= 0 ? 'bull-text' : 'bear-text'}`}>
              {totalPL >= 0 ? '+' : '-'}${Math.abs(totalPL).toLocaleString()}
            </div>
          </div>
          <div className="h-24 w-full mt-6 rounded-xl bg-gradient-to-t from-neon-green/10 to-transparent border-b border-neon-green/30 relative overflow-hidden">
            <div className={`absolute bottom-0 left-0 w-full h-[2px] shadow-[0_0_15px_#00ff94] ${totalPL >= 0 ? 'bg-neon-green' : 'bg-neon-error'}`}></div>
          </div>
        </div>
      </section>

      <section className="col-span-12">
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-space text-2xl font-bold text-white">Neural Holdings</h3>
          <div className="glass-panel px-5 py-2.5 rounded-full flex items-center gap-3 border border-white/5">
            <Search size={16} className="text-on-surface-variant" />
            <input className="bg-transparent border-none text-white focus:ring-0 text-sm w-64 placeholder-on-surface-variant" placeholder="Search assets..." type="text"/>
          </div>
        </div>

        <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
          {holdings.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center">
              <PieChart size={48} className="text-white/10 mb-4" />
              <p className="text-on-surface-variant font-space uppercase tracking-widest text-xs">No assets detected in current profile.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-6 border-b border-white/5 font-space text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                <div className="md:col-span-2">Symbol / Asset</div>
                <div className="hidden md:block text-center">Quantity</div>
                <div className="hidden md:block text-center">Avg Cost</div>
                <div className="hidden md:block text-center">Current Price</div>
                <div className="text-right">Total P&L</div>
              </div>

              <div className="divide-y divide-white/5">
                {holdings.map((asset, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-6 items-center hover:bg-white/5 transition-all group cursor-pointer">
                    <div className="md:col-span-2 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center font-space text-sm font-bold text-white border border-white/5 group-hover:border-neon-green/30 transition-all">
                        {asset.symbol}
                      </div>
                      <div>
                        <div className="font-inter text-md font-bold text-white group-hover:text-neon-green transition-colors">{asset.name}</div>
                        <div className="text-xs text-on-surface-variant uppercase tracking-wider">{asset.sector}</div>
                      </div>
                    </div>
                    
                    <div className="hidden md:block text-center font-inter text-sm font-medium text-white">{asset.qty.toLocaleString()}</div>
                    <div className="hidden md:block text-center font-inter text-sm font-medium text-white">${asset.avgCost.toFixed(2)}</div>
                    <div className="hidden md:block text-center font-inter text-sm font-medium text-white">
                      ${asset.price.toFixed(2)}
                    </div>

                    <div className="text-right">
                      <div className={`font-space text-lg font-bold ${asset.price >= asset.avgCost ? 'bull-text' : 'bear-text'}`}>
                        {asset.price >= asset.avgCost ? '+' : '-'}${(Math.abs(asset.price - asset.avgCost) * asset.qty).toLocaleString(undefined, {minimumFractionDigits: 2})}
                      </div>
                      <div className={`text-[10px] font-bold opacity-70 ${asset.price >= asset.avgCost ? 'text-neon-green' : 'text-neon-error'}`}>
                        ({(((asset.price - asset.avgCost) / asset.avgCost) * 100).toFixed(2)}%)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default Portfolio;

import React from 'react';
import { LayoutDashboard, ShieldCheck, PieChart, MessageSquare, Bell, Radio, UserCircle, Hexagon, Zap, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ activeTab, setActiveTab, onInsightClick, onTradeClick, onNotifClick, onSystemClick, onProfileClick }) => {
  const { logout } = useAuth();
  const menuItems = [
    { icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { icon: <ShieldCheck size={18} />, label: 'Risk Profile' },
    { icon: <PieChart size={18} />, label: 'Portfolio' },
    { icon: <MessageSquare size={18} />, label: 'AI Advisor' },
  ];

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[98%] max-w-7xl rounded-full border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] bg-slate-950/40 backdrop-blur-2xl flex items-center justify-between px-6 h-16 z-50 transition-all duration-500">
      <div className="flex items-center gap-8">
        <div className="text-xl font-black text-white tracking-tighter flex items-center gap-2 font-space">
          <Hexagon className="text-neon-green fill-neon-green/20" size={24} />
          MARKET HALL AI
        </div>
        
        <div className="hidden md:flex items-center gap-2">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(item.label)}
              className={`px-5 py-1.5 transition-all duration-300 font-space uppercase tracking-wider text-[11px] font-bold rounded-full flex items-center gap-2 active:scale-95 ${
                activeTab === item.label
                  ? 'bg-neon-green text-slate-950 shadow-[0_0_15px_rgba(0,255,148,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={onInsightClick}
          className="hidden md:flex bg-white/5 border border-white/10 text-neon-green px-4 py-1.5 rounded-full hover:bg-white/10 transition-colors active:scale-95 items-center gap-2 font-space text-[11px] font-bold uppercase tracking-wider"
        >
          <Zap size={14} />
          AI Insights
        </button>
        <button 
          onClick={onTradeClick}
          className="bg-neon-green text-slate-950 px-6 py-1.5 rounded-full shadow-[0_0_15px_rgba(0,255,148,0.4)] hover:bg-neon-blue transition-colors active:scale-95 font-space text-[11px] font-bold uppercase tracking-wider"
        >
          Trade
        </button>
        
        <div className="flex items-center gap-2 border-l border-white/10 pl-4 ml-2 text-slate-400">
          <button onClick={onNotifClick} className="hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/5">
            <Bell size={18} />
          </button>
          <button onClick={onSystemClick} className="hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/5">
            <Radio size={18} />
          </button>
          <button onClick={onProfileClick} className="hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/5">
            <UserCircle size={18} />
          </button>
          <button onClick={logout} className="hover:text-red-400 transition-colors p-1.5 rounded-full hover:bg-white/5" title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

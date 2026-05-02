import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { CheckCircle, Landmark, Briefcase, Users, LineChart, ChevronDown, ShieldCheck, Zap, Wallet, Bell, Bolt } from 'lucide-react';
import axios from 'axios';

const ProfileForm = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(2);
  const [formData, setFormData] = useState({
    incomeRange: '$50,000 - $100,000',
    netWorth: 0,
    liquidityRatio: 45,
    sourceOfWealth: 'Employment',
    riskTolerance: 'Moderate',
    primaryObjective: 'Capital Growth',
    tradingAutonomy: 'Advisor Only'
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5002/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
        if (res.data) {
          setFormData({
            incomeRange: res.data.incomeRange || '$50,000 - $100,000',
            netWorth: res.data.netWorth || 0,
            liquidityRatio: res.data.liquidityRatio || 45,
            sourceOfWealth: res.data.sourceOfWealth || 'Employment',
            riskTolerance: res.data.riskTolerance || 'Moderate',
            primaryObjective: res.data.primaryObjective || 'Capital Growth',
            tradingAutonomy: res.data.tradingAutonomy || 'Advisor Only'
          });
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5002/api/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setStep(3);
      }, 1500);
    } catch (error) {
      console.error('Profile update failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative z-10 pt-24 pb-24 px-6 max-w-5xl mx-auto animate-fade-in font-inter">
      {/* Progress Stepper */}
      <section className="mb-12">
        <div className="flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/10 -translate-y-1/2 z-0"></div>
          <div className={`absolute top-1/2 left-0 h-[2px] bg-neon-green -translate-y-1/2 z-0 transition-all duration-500`} style={{ width: step >= 3 ? '100%' : '50%' }}></div>
          
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neon-green text-slate-950 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,148,0.5)]">
              <CheckCircle size={20} strokeWidth={3} />
            </div>
            <span className="text-[10px] font-bold text-neon-green uppercase tracking-widest font-space">Personal</span>
          </div>

          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${step >= 3 ? 'bg-neon-green text-slate-950 shadow-[0_0_15px_rgba(0,255,148,0.5)]' : 'bg-surface-container-high border-2 border-neon-green text-neon-green'}`}>
              {step >= 3 ? <CheckCircle size={20} strokeWidth={3} /> : <Landmark size={20} />}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-widest font-space transition-colors ${step >= 3 ? 'text-neon-green' : 'text-white'}`}>Financial Status</span>
          </div>

          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${step === 3 ? 'bg-surface-container-high border-2 border-neon-green text-neon-green' : 'bg-surface-container-high border border-white/10 text-white/20'}`}>
              <LineChart size={20} />
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-widest font-space transition-colors ${step === 3 ? 'text-white' : 'text-white/20'}`}>Investment Goals</span>
          </div>
        </div>
      </section>

      {/* Main Form Section */}
      <div className="glass-panel rounded-2xl p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Zap size={120} />
        </div>

        {step === 3 && (
          <div className="mb-10 p-6 rounded-xl border border-neon-green/30 bg-neon-green/5 flex flex-col md:flex-row justify-between items-center gap-6 animate-fade-in">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full flex-grow">
              <div>
                <div className="text-[9px] text-white/40 uppercase tracking-widest font-space mb-1">Income Range</div>
                <div className="text-sm font-bold text-white">{formData.incomeRange}</div>
              </div>
              <div>
                <div className="text-[9px] text-white/40 uppercase tracking-widest font-space mb-1">Total Net Worth</div>
                <div className="text-sm font-bold text-white">${Number(formData.netWorth).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[9px] text-white/40 uppercase tracking-widest font-space mb-1">Liquidity Ratio</div>
                <div className="text-sm font-bold text-white">{formData.liquidityRatio}%</div>
              </div>
              <div>
                <div className="text-[9px] text-white/40 uppercase tracking-widest font-space mb-1">Wealth Source</div>
                <div className="text-sm font-bold text-white">{formData.sourceOfWealth}</div>
              </div>
            </div>
            <button onClick={() => setStep(2)} className="px-6 py-2.5 rounded-full border border-neon-green/30 text-[10px] font-bold text-neon-green uppercase tracking-widest hover:bg-neon-green/10 transition-all flex-shrink-0">
              Edit Status
            </button>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-10 animate-fade-in">
            <div className="mb-10">
              <h1 className="text-4xl font-bold text-white mb-2 font-space tracking-tight">Investment Goals</h1>
              <p className="text-white/40 text-sm max-w-2xl">
                Configure your neural trading parameters and risk tolerance.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest font-space">Primary Objective</label>
                <div className="grid grid-cols-1 gap-3">
                  {['Capital Preservation', 'Steady Income', 'Capital Growth', 'Aggressive Speculation'].map(obj => (
                    <button
                      key={obj} type="button"
                      onClick={() => setFormData({...formData, primaryObjective: obj})}
                      className={`p-4 rounded-xl border transition-all text-left flex justify-between items-center ${formData.primaryObjective === obj ? 'bg-neon-green/10 border-neon-green text-neon-green shadow-[inset_0_0_12px_rgba(0,255,148,0.1)]' : 'bg-surface-container-low border-white/5 text-white hover:border-neon-green/30'}`}
                    >
                      <span className="font-space text-xs font-bold uppercase tracking-widest">{obj}</span>
                      {formData.primaryObjective === obj && <CheckCircle size={16} />}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest font-space">Risk Tolerance</label>
                  <div className="relative">
                    <select 
                      className="w-full bg-surface-container-lowest border border-white/5 rounded-xl py-4 px-4 text-white appearance-none focus:border-neon-green outline-none transition-colors font-inter text-sm"
                      value={formData.riskTolerance}
                      onChange={(e) => setFormData({...formData, riskTolerance: e.target.value})}
                    >
                      <option>Conservative</option>
                      <option>Moderate</option>
                      <option>Aggressive</option>
                      <option>Maximum Velocity</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20" size={18} />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest font-space">AI Trading Autonomy</label>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: 'Advisor Only', desc: 'AI suggests trades, you execute manually.' },
                      { id: 'Semi-Autonomous', desc: 'AI executes within set risk limits.' },
                      { id: 'Full Autopilot', desc: 'Unrestricted neural execution.' }
                    ].map(level => (
                      <button
                        key={level.id} type="button"
                        onClick={() => setFormData({...formData, tradingAutonomy: level.id})}
                        className={`p-4 rounded-xl border transition-all text-left flex flex-col gap-1 ${formData.tradingAutonomy === level.id ? 'bg-neon-blue/10 border-neon-blue text-neon-blue shadow-[inset_0_0_12px_rgba(0,183,255,0.1)]' : 'bg-surface-container-low border-white/5 hover:border-neon-blue/30'}`}
                      >
                        <span className={`font-space text-xs font-bold uppercase tracking-widest ${formData.tradingAutonomy === level.id ? 'text-neon-blue' : 'text-white'}`}>{level.id}</span>
                        <span className="text-[10px] text-white/40 italic">{level.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-10 flex flex-col items-center gap-6 mt-10">
              <button 
                type="submit"
                disabled={loading}
                className="w-full md:w-auto min-w-[280px] bg-neon-blue text-slate-950 font-bold py-4 px-12 rounded-full shadow-[0_0_20px_rgba(0,183,255,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group font-space uppercase tracking-widest text-sm"
              >
                {loading ? 'Connecting...' : success ? 'Neural Link Established' : 'Activate Trading Core'}
                <Bolt className={`group-hover:rotate-12 transition-transform ${success ? 'text-blue-600' : ''}`} size={18} />
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <>
            <div className="mb-10 animate-fade-in">
              <h1 className="text-4xl font-bold text-white mb-2 font-space tracking-tight">Financial Status Verification</h1>
              <p className="text-white/40 text-sm max-w-2xl">
                Welcome, <span className="text-neon-green font-bold">@{user?.username?.toUpperCase()}</span>. Provide accurate financial metrics to unlock advanced algorithmic trading pairs and higher liquidity limits.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10 animate-fade-in">
              {/* Field Group 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2 font-space">
                    Annual Income Range
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-blue"></span>
                  </label>
                  <div className="relative">
                    <select 
                      className="w-full bg-surface-container-lowest border border-white/5 rounded-xl py-4 px-4 text-white appearance-none focus:border-neon-green outline-none transition-colors font-inter text-sm"
                      value={formData.incomeRange}
                      onChange={(e) => setFormData({...formData, incomeRange: e.target.value})}
                    >
                      <option>$50,000 - $100,000</option>
                      <option>$100,000 - $250,000</option>
                      <option>$250,000 - $500,000</option>
                      <option>$500,000+</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20" size={18} />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest font-space">Total Net Worth</label>
                  <div className="flex">
                    <div className="relative flex-grow">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 font-bold">$</span>
                      <input 
                        type="number"
                        className="w-full bg-surface-container-lowest border border-white/5 rounded-l-xl py-4 pl-8 pr-4 text-white focus:border-neon-green outline-none transition-colors font-inter text-sm"
                        placeholder="0.00"
                        value={formData.netWorth}
                        onChange={(e) => setFormData({...formData, netWorth: e.target.value})}
                      />
                    </div>
                    <div className="bg-surface-container-high border-y border-r border-white/5 px-4 rounded-r-xl text-white/40 flex items-center text-[10px] font-bold uppercase tracking-widest font-space">
                      USD
                    </div>
                  </div>
                </div>
              </div>

              {/* Slider */}
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest font-space">Liquidity Ratio</label>
                  <span className="text-neon-green font-bold text-2xl font-space">{formData.liquidityRatio}%</span>
                </div>
                <div className="relative group">
                  <input 
                    type="range"
                    className="w-full h-1.5 bg-surface-container-lowest rounded-full appearance-none cursor-pointer accent-neon-green"
                    min="0"
                    max="100"
                    value={formData.liquidityRatio}
                    onChange={(e) => setFormData({...formData, liquidityRatio: e.target.value})}
                  />
                  <div 
                    className="absolute top-0 left-0 h-1.5 bg-neon-green rounded-full pointer-events-none shadow-[0_0_15px_#00ff94]"
                    style={{ width: `${formData.liquidityRatio}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-white/20 italic">Determines the percentage of assets available for immediate execution.</p>
              </div>

              {/* Source of Wealth */}
              <div className="space-y-6">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest font-space">Primary Source of Wealth</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { id: 'Employment', icon: <Briefcase size={24} />, label: 'Employment' },
                    { id: 'Business', icon: <Landmark size={24} />, label: 'Business' },
                    { id: 'Inheritance', icon: <Users size={24} />, label: 'Inheritance' },
                    { id: 'Investments', icon: <LineChart size={24} />, label: 'Investments' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormData({...formData, sourceOfWealth: item.id})}
                      className={`group relative p-6 rounded-xl border transition-all text-center flex flex-col items-center gap-3 ${
                        formData.sourceOfWealth === item.id 
                          ? 'bg-neon-green/5 border-neon-green shadow-[inset_0_0_12px_rgba(0,255,148,0.1)]'
                          : 'bg-surface-container-low border-white/5 hover:border-neon-green/30'
                      }`}
                    >
                      <div className={`${formData.sourceOfWealth === item.id ? 'text-neon-green' : 'text-white/20 group-hover:text-white/40'} transition-colors`}>
                        {item.icon}
                      </div>
                      <p className={`text-[10px] font-bold uppercase tracking-widest font-space ${formData.sourceOfWealth === item.id ? 'text-neon-green' : 'text-white/40'}`}>
                        {item.label}
                      </p>
                      {formData.sourceOfWealth === item.id && (
                        <div className="absolute top-2 right-2 text-neon-green">
                          <CheckCircle size={12} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="pt-10 flex flex-col items-center gap-6">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto min-w-[280px] bg-neon-green text-slate-950 font-bold py-4 px-12 rounded-full shadow-[0_0_20px_rgba(0,255,148,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group font-space uppercase tracking-widest text-sm"
                >
                  {loading ? 'Processing...' : success ? 'Profile Secured' : 'Finalize Profile'}
                  <Bolt className={`group-hover:rotate-12 transition-transform ${success ? 'text-blue-600' : ''}`} size={18} />
                </button>
                <div className="flex items-center gap-2 text-white/20 text-[10px] uppercase font-bold tracking-widest font-space">
                  <ShieldCheck size={14} />
                  Secure AES-256 encrypted verification
                </div>
              </div>
            </form>
          </>
        )}
      </div>

      {/* Decorative Side Elements */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: <ShieldCheck />, title: 'Compliance', text: 'MiFID II & SEC Standard' },
          { icon: <Zap />, title: 'Priority Lane', text: 'Reduced trade latency' },
          { icon: <Wallet />, title: 'Data Privacy', text: 'Zero-knowledge proof' }
        ].map((item, i) => (
          <div key={i} className="glass-panel p-5 rounded-xl flex items-center gap-4 border border-white/5">
            <div className="w-10 h-10 rounded-lg bg-neon-green/10 flex items-center justify-center text-neon-green">
              {item.icon}
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-white uppercase tracking-widest font-space">{item.title}</h4>
              <p className="text-[10px] text-white/20 font-inter">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default ProfileForm;

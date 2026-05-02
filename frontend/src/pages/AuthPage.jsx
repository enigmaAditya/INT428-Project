import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Zap, BarChart3, Landmark, Shield, Eye, EyeOff } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register } = useAuth();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.username, formData.email, formData.password);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row antialiased overflow-hidden bg-surface-dark text-on-background font-inter">
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-[0.03] md:hidden"
          style={{ 
            backgroundImage: 'url(/assets/auth-bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-neon-blue/10 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] bg-neon-green/5 blur-[150px] rounded-full mix-blend-screen"></div>
      </div>

      {/* Left Column: Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 z-10 relative">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md glass-panel rounded-2xl p-10 shadow-2xl relative"
        >
          {/* Step Indicator */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-2 h-2 rounded-full bg-neon-green shadow-[0_0_15px_rgba(0,255,148,0.4)]"></div>
            <span className="text-[10px] font-bold text-neon-green uppercase tracking-[0.2em] font-space">
              {isLogin ? 'Neural Verification' : 'Step 1: Account Setup'}
            </span>
          </div>

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tighter font-space">
              {isLogin ? 'Welcome Back' : 'Join the Hall'}
            </h1>
            <p className="text-white/50 text-sm font-medium">
              {isLogin ? 'Re-establish your secure neural link.' : 'Initialize your secure neural identity.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 font-space">Username</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-neon-green transition-colors" />
                    <input 
                      type="text"
                      required
                      placeholder="ADITYA_X"
                      className="w-full bg-surface-container-high/30 border border-white/5 rounded-full py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:bg-surface-container-high/50 focus:border-neon-green/50 outline-none transition-all font-inter text-sm"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 font-space">Secure Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-neon-green transition-colors" />
                <input 
                  type="email"
                  required
                  placeholder="NAME@DOMAIN.COM"
                  className="w-full bg-surface-container-high/30 border border-white/5 rounded-full py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:bg-surface-container-high/50 focus:border-neon-green/50 outline-none transition-all font-inter text-sm"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 font-space">Encryption Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-neon-green transition-colors" />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="w-full bg-surface-container-high/30 border border-white/5 rounded-full py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:bg-surface-container-high/50 focus:border-neon-green/50 outline-none transition-all font-inter text-sm"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] uppercase font-bold tracking-widest p-3 rounded-xl flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-neon-green hover:bg-neon-blue text-slate-950 font-black py-4 px-6 rounded-full shadow-[0_0_20px_rgba(0,255,148,0.2)] hover:shadow-[0_0_30px_rgba(0,255,148,0.4)] transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mt-6 uppercase tracking-widest text-[11px] font-space"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></div>
              ) : (
                <>
                  {isLogin ? 'Access Identity' : 'Create Identity'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
              {isLogin ? "No identity yet?" : "Already an operative?"} {' '}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-neon-green hover:text-white transition-colors underline underline-offset-4"
              >
                {isLogin ? 'Join the Hall' : 'Authenticate'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Column: Visual Sidebar (Desktop Only) */}
      <div className="hidden md:flex w-1/2 relative bg-[#050505] border-l border-white/5 items-center justify-center p-12 overflow-hidden group">
        {/* Background Photo */}
        <div 
          className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-1000 scale-105 group-hover:scale-100 transition-transform"
          style={{ 
            backgroundImage: 'url(/assets/auth-bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>

        <div className="relative z-10 w-full max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-4xl font-bold text-white mb-12 tracking-tight font-space leading-tight">
              Elite Execution <br/> Architecture.
            </h2>
            
            <div className="space-y-6">
              {[
                { icon: <BarChart3 />, title: "Real-time AI Insights", text: "Continuous neural-net processing of global market sentiment.", color: "neon-green" },
                { icon: <Landmark />, title: "Deep Portfolio Tracking", text: "Multi-asset structural analysis across all exposures.", color: "neon-blue" },
                { icon: <Shield />, title: "Institutional Security", text: "Cold-storage protocols combined with biometric architecture.", color: "red-400" }
              ].map((benefit, idx) => (
                <div key={idx} className="glass-panel p-6 rounded-2xl flex items-start gap-4 hover:bg-white/5 transition-colors border border-white/5 backdrop-blur-md">
                  <div className={`p-3 bg-${benefit.color}/10 rounded-full flex-shrink-0 text-${benefit.color} shadow-[0_0_20px_rgba(0,0,0,0.2)]`}>
                    {React.cloneElement(benefit.icon, { size: 20 })}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1 font-space uppercase tracking-wider">{benefit.title}</h3>
                    <p className="text-xs text-white/40 leading-relaxed font-inter">{benefit.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 text-right">
              <span className="text-3xl font-bold text-white/5 italic tracking-tighter font-space uppercase">
                FIN-HALL AI_
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

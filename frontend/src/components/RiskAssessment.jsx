import React, { useState, useEffect } from 'react';
import { Shield, Target, Clock, TrendingUp, CheckCircle, ArrowLeft, ArrowRight, BrainCircuit, RefreshCcw } from 'lucide-react';
import axios from 'axios';

const RiskAssessment = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    experience: '',
    tolerance: '',
    horizon: ''
  });

  // Fetch existing profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5002/api/profile');
        if (res.data && res.data.experience) {
          setProfile(res.data);
          setStep(4); // Skip to completion screen if profile exists
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const steps = [
    {
      id: 1,
      title: 'Investment Experience',
      desc: 'Neural Core requires precise parameter calibration.',
      options: [
        { label: 'Beginner', desc: 'New to the markets, focused on learning basics.' },
        { label: 'Intermediate', desc: 'Understanding of stocks, bonds, and ETFs.' },
        { label: 'Advanced', desc: 'Experienced with derivatives and margin trading.' },
        { label: 'Professional', desc: 'Institutional grade strategies and execution.' }
      ],
      key: 'experience'
    },
    {
      id: 2,
      title: 'Emotional Risk Tolerance',
      desc: 'How do you react to market volatility?',
      options: [
        { label: 'Conservative', desc: 'I prioritize capital preservation over high returns.' },
        { label: 'Moderate', desc: 'Balanced approach with manageable drawdowns.' },
        { label: 'Aggressive', desc: 'I seek maximum growth and can tolerate high drawdowns.' },
        { label: 'Speculative', desc: 'High risk, high reward. Volatility is an opportunity.' }
      ],
      key: 'tolerance'
    },
    {
      id: 3,
      title: 'Investment Horizon',
      desc: 'Define your neural optimization timeline.',
      options: [
        { label: 'Short-term', desc: 'Capital needed within 1 year.' },
        { label: 'Medium-term', desc: 'Planned growth for 1-5 years.' },
        { label: 'Long-term', desc: 'Generational wealth building (5+ years).' }
      ],
      key: 'horizon'
    }
  ];

  const handleSelect = (val) => {
    const currentKey = steps[step - 1].key;
    setProfile(prev => ({ ...prev, [currentKey]: val }));
  };

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      submitProfile();
    }
  };

  const submitProfile = async () => {
    try {
      await axios.post('http://localhost:5002/api/profile', profile);
      setStep(4);
      if (onComplete) onComplete();
    } catch (error) {
      console.error("Profile update failed", error);
    }
  };

  if (loading) {
    return (
      <div className="pt-32 flex flex-col items-center justify-center min-h-screen">
        <RefreshCcw className="text-neon-green animate-spin mb-4" size={32} />
        <p className="font-space text-[10px] text-neon-green uppercase tracking-widest">Accessing Neural Core...</p>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="pt-32 flex flex-col items-center justify-center animate-fade-in text-center p-10">
        <div className="w-24 h-24 bg-neon-green/10 rounded-full flex items-center justify-center mb-8 border border-neon-green/30 shadow-[0_0_30px_rgba(0,255,148,0.2)]">
          <CheckCircle size={48} className="text-neon-green" />
        </div>
        <h2 className="font-space text-4xl font-bold text-white mb-4">Neural Profile Active</h2>
        <div className="glass-panel p-6 rounded-2xl mb-10 max-w-md w-full border-white/5">
           <div className="grid grid-cols-1 gap-4 text-left">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-[10px] text-on-surface-variant uppercase font-bold">Experience</span>
                <span className="text-neon-green font-space text-sm">{profile.experience}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-[10px] text-on-surface-variant uppercase font-bold">Tolerance</span>
                <span className="text-neon-green font-space text-sm">{profile.tolerance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] text-on-surface-variant uppercase font-bold">Horizon</span>
                <span className="text-neon-green font-space text-sm">{profile.horizon}</span>
              </div>
           </div>
        </div>
        <p className="font-inter text-on-surface-variant max-w-md mx-auto mb-10">Your parameters are locked and integrated. Neural Core is optimized for your profile.</p>
        <button 
          onClick={() => setStep(1)} 
          className="px-8 py-3 rounded-full border border-neon-green/30 text-neon-green font-space text-sm font-bold uppercase tracking-widest hover:bg-neon-green/10 transition-all"
        >
          Recalibrate Parameters
        </button>
      </div>
    );
  }

  const currentStep = steps[step - 1];

  return (
    <main className="relative z-10 pt-32 pb-16 px-gutter max-w-4xl mx-auto flex flex-col items-center min-h-screen">
      <div className="w-full text-center mb-12">
        <h1 className="font-space text-4xl font-bold text-white mb-3">Risk Assessment</h1>
        <p className="font-inter text-on-surface-variant max-w-2xl mx-auto">{currentStep.desc}</p>
        
        <div className="mt-10 flex items-center justify-center gap-4 max-w-md mx-auto">
          <div className="h-1.5 flex-1 bg-surface-container rounded-full overflow-hidden">
            <div 
              className="h-full bg-neon-green shadow-[0_0_15px_#00ff94] transition-all duration-700" 
              style={{ width: `${(step / steps.length) * 100}%` }}
            ></div>
          </div>
          <span className="font-space text-[10px] font-bold text-neon-green uppercase tracking-widest">Step {step} of 3</span>
        </div>
      </div>

      <div className="w-full glass-panel rounded-2xl p-10 animate-fade-in">
        <div className="mb-10 text-center">
          <h2 className="font-space text-2xl font-bold text-white">{currentStep.title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {currentStep.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(opt.label)}
              className={`relative group p-6 rounded-xl border transition-all text-left flex flex-col items-start gap-4 cursor-pointer ${
                profile[currentStep.key] === opt.label
                  ? 'bg-surface-container-highest border-neon-green shadow-[0_0_20px_rgba(0,255,148,0.1)]'
                  : 'bg-surface-container-low border-white/5 hover:border-white/20 hover:bg-surface-container'
              }`}
            >
              {profile[currentStep.key] === opt.label && (
                <div className="absolute top-4 right-4 text-neon-green">
                  <CheckCircle size={20} fill="currentColor" className="fill-neon-green/10" />
                </div>
              )}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                profile[currentStep.key] === opt.label ? 'bg-neon-green/20 text-neon-green' : 'bg-white/5 text-on-surface-variant group-hover:bg-white/10'
              }`}>
                {currentStep.key === 'tolerance' ? <TrendingUp size={24} /> : currentStep.key === 'experience' ? <BrainCircuit size={24} /> : <Target size={24} />}
              </div>
              <div>
                <h3 className="font-space text-lg font-bold text-white mb-1">{opt.label}</h3>
                <p className="font-inter text-sm text-on-surface-variant leading-relaxed">{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-8 border-t border-white/5">
          <button 
            onClick={() => step > 1 && setStep(step - 1)}
            disabled={step === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-space text-[11px] font-bold uppercase tracking-widest transition-all ${
              step === 1 ? 'opacity-0 cursor-default' : 'text-on-surface-variant hover:text-white'
            }`}
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <button 
            onClick={handleNext}
            disabled={!profile[currentStep.key]}
            className={`flex items-center gap-2 px-10 py-3 rounded-full font-space text-[11px] font-bold uppercase tracking-widest transition-all ${
              profile[currentStep.key]
                ? 'bg-neon-green text-slate-950 shadow-[0_0_15px_rgba(0,255,148,0.4)] hover:bg-neon-blue'
                : 'bg-white/5 text-on-surface-variant cursor-not-allowed'
            }`}
          >
            {step === 3 ? 'Finalize Profile' : 'Continue'}
            {step < 3 && <ArrowRight size={16} />}
          </button>
        </div>
      </div>
    </main>
  );
};

export default RiskAssessment;

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Zap, AlertCircle, Eye, EyeOff, CheckCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  const { login, register, authError, loading } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    setValidationError('');
    if (!email || !password) {
      setValidationError('Please fill in all required fields.');
      return false;
    }
    if (!isLogin && !name) {
      setValidationError('Please provide your name.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError('Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate('/');
    } catch (err) {
      console.error('Authentication error:', err);
    }
  };

  const handleInstantDemo = async () => {
    try {
      try {
        await login('demo@resumeiq.pro', 'Password123!');
      } catch {
        await register('Alex Vance', 'demo@resumeiq.pro', 'Password123!');
      }
      navigate('/');
    } catch {
      navigate('/');
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setValidationError('');
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-geometric bg-[var(--background)] text-[var(--text-main)]">
      
      {/* Ambient Radial Aura */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#c27838]/10 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-[1040px] grid grid-cols-1 md:grid-cols-12 gap-0 rounded-[36px] overflow-hidden shadow-2xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#151d16]/90 backdrop-blur-2xl z-10">
        
        {/* Left Architectural Noir Brand Column */}
        <div className="md:col-span-5 bg-[#121a13] p-8 md:p-12 flex flex-col justify-between relative overflow-hidden text-white border-r border-white/10">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#c27838]/15 rounded-full filter blur-2xl pointer-events-none"></div>
          
          {/* Brand */}
          <div className="flex items-center gap-2.5 z-10">
            <div className="h-9 w-9 bg-white text-[#121a13] rounded-full flex items-center justify-center shadow-md">
              <Zap size={16} className="fill-current" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight">ResumeIQ</h2>
              <span className="text-[9px] font-black uppercase tracking-widest text-[#d68d4d]">PRO INTELLIGENCE</span>
            </div>
          </div>

          {/* Marketing Copy */}
          <div className="my-10 space-y-5 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] font-black tracking-wider text-[#d68d4d]">
              <span>✦ Organic Career Engine</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
              FAANG-Tier Resume Intelligence
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Analyze your resume using buffer-level ATS simulation, track skills ontologies, and unlock dynamic compensation benchmarks.
            </p>
            
            <ul className="space-y-3 pt-2">
              {[
                'ATS Compliance Score Indexing',
                'Semantic Skill Gap Diffing',
                'Live Patch Bullet Point Injection',
                'Market Salary & Comp Modeling'
              ].map((text, idx) => (
                <li key={idx} className="flex items-center gap-2.5 text-xs font-bold text-slate-200">
                  <CheckCircle size={14} className="text-[#d68d4d] shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer Info */}
          <div className="z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>© 2026 ResumeIQ PRO</span>
            <span>Version 2.4</span>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center bg-white/60 dark:bg-black/20">
          <div className="max-w-[380px] w-full mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[#141c15] dark:text-white mb-1.5">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {isLogin 
                  ? 'Access your saved reviews and premium career insights' 
                  : 'Start scoring and optimizing your resumes in minutes'
                }
              </p>
            </div>

            {/* Error Notification */}
            <AnimatePresence mode="wait">
              {(validationError || authError) && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-5 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-start gap-2.5"
                >
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <div className="text-xs font-bold leading-relaxed">
                    {validationError || authError}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <label className="block text-[10px] font-black uppercase tracking-wider mb-1 text-slate-500 dark:text-slate-400">Full Name</label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        id="reg-name"
                        type="text"
                        placeholder="Alex Vance"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 outline-none focus-visible:ring-1 focus-visible:ring-[#c27838] font-semibold text-xs bg-[#f6f8f5] dark:bg-white/5 text-[#141c15] dark:text-white"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider mb-1 text-slate-500 dark:text-slate-400">Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="auth-email"
                    type="email"
                    placeholder="alex.vance@techlead.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 outline-none focus-visible:ring-1 focus-visible:ring-[#c27838] font-semibold text-xs bg-[#f6f8f5] dark:bg-white/5 text-[#141c15] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider mb-1 text-slate-500 dark:text-slate-400">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 dark:border-white/10 outline-none focus-visible:ring-1 focus-visible:ring-[#c27838] font-semibold text-xs bg-[#f6f8f5] dark:bg-white/5 text-[#141c15] dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black dark:hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                id="auth-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-[#141c15] hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-[#141c15] font-black py-3.5 rounded-full transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-4 w-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="text-xs uppercase tracking-wider">{isLogin ? 'Login to Engine' : 'Register Account'}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>

              {/* 1-Click Instant Demo Button */}
              <button
                type="button"
                onClick={handleInstantDemo}
                className="w-full py-3 rounded-full border border-slate-200 dark:border-white/10 hover:border-[#c27838] text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#c27838] dark:hover:text-[#d68d4d] flex items-center justify-center gap-1.5 transition-colors cursor-pointer bg-white/50 dark:bg-white/5"
              >
                <Sparkles size={12} className="text-[#c27838]" />
                <span>Instant Demo Guest Access</span>
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={toggleAuthMode}
                className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-[#c27838] dark:hover:text-[#d68d4d] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c27838] rounded-sm hover:underline cursor-pointer"
              >
                {isLogin 
                  ? "Don't have an account? Sign Up" 
                  : 'Already have an account? Login'
                }
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Auth;

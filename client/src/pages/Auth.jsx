import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Zap, AlertCircle, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  const { login, register, authError, loading } = useAuth();
  const { darkMode } = useTheme();
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

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setValidationError('');
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-500 ${
      darkMode ? 'bg-gray-950 text-gray-100' : 'bg-neutral-light text-gray-800'
    }`}>
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-[1100px] grid grid-cols-1 md:grid-cols-12 gap-0 m-4 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border dark:border-gray-800/80 border-white/60 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl z-10">
        
        {/* Info Column */}
        <div className="md:col-span-5 bg-gradient-to-br from-indigo-600 to-purple-700 p-8 md:p-12 flex flex-col justify-between relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-bl-full transform translate-x-8 -translate-y-8"></div>
          
          {/* Brand */}
          <div className="flex items-center gap-3 z-10">
            <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">ResumeAI</h2>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Elite Career Engine</span>
            </div>
          </div>

          {/* Marketing Copy */}
          <div className="my-12 space-y-6 z-10">
            <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
              FAANG-Tier Resume Intelligence
            </h1>
            <p className="text-sm text-indigo-100/90 leading-relaxed font-medium">
              Analyze your resume using custom ATS simulation algorithms, track skills ontologies, and unlock dynamic cover letter generation in seconds.
            </p>
            
            <ul className="space-y-3.5 pt-4">
              {[
                'ATS Compliance Score Indexing',
                'Semantic Skill Gap Mapping',
                'Career Paths Intelligence',
                'Interactive Interview Prep Generators'
              ].map((text, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm font-semibold text-indigo-50">
                  <CheckCircle size={16} className="text-indigo-300 shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer Info */}
          <div className="z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-bold text-indigo-200 uppercase tracking-wider">
            <span>© 2026 ResumeAI Inc.</span>
            <span>Version 2.4</span>
          </div>
        </div>

        {/* Form Column */}
        <div className="md:col-span-7 p-8 md:p-14 flex flex-col justify-center dark:bg-gray-950/80 bg-white/80">
          <div className="max-w-[420px] w-full mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'} font-medium`}>
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
                  className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-start gap-3"
                >
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <div className="text-xs font-semibold leading-relaxed">
                    {validationError || authError}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Full Name</label>
                    <div className="relative">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        id="reg-name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border-none outline-none font-semibold text-sm transition-all duration-300
                          ${darkMode 
                            ? 'bg-gray-900 text-gray-100 placeholder:text-gray-600 focus:ring-2 focus:ring-indigo-500/40 shadow-inner' 
                            : 'bg-neutral-light text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/10'
                          }`}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    id="auth-email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border-none outline-none font-semibold text-sm transition-all duration-300
                      ${darkMode 
                        ? 'bg-gray-900 text-gray-100 placeholder:text-gray-600 focus:ring-2 focus:ring-indigo-500/40 shadow-inner' 
                        : 'bg-neutral-light text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/10'
                      }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-12 pr-12 py-3.5 rounded-2xl border-none outline-none font-semibold text-sm transition-all duration-300
                      ${darkMode 
                        ? 'bg-gray-900 text-gray-100 placeholder:text-gray-600 focus:ring-2 focus:ring-indigo-500/40 shadow-inner' 
                        : 'bg-neutral-light text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/10'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                id="auth-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-[#FF6B4A] hover:bg-[#E25A38] text-white font-bold py-4 rounded-full transition-all duration-300 shadow-lg shadow-[#FF6B4A]/25 hover:shadow-[#FF6B4A]/40 active:scale-[0.98] flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>{isLogin ? 'Login to Engine' : 'Register Account'}</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={toggleAuthMode}
                className={`text-xs font-semibold transition-colors focus:outline-none hover:underline ${
                  darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'
                }`}
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

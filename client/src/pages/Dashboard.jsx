import { useState, useRef } from 'react';
import { UploadCloud, CheckCircle, AlertTriangle, ArrowRight, Download, Briefcase, FileText, Wrench, Sparkles, MessageSquare, DollarSign, X, ExternalLink, TrendingUp, Target, Shield, Eye, Zap, Award, FileDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAnalysis } from '../context/AnalysisContext';

const Dashboard = () => {
  const { darkMode } = useTheme();
  const { analyzing, result, error, runAnalysis, downloadExcel, getCoverLetter, syncLinkedIn, linkedinData, applyLivePatch } = useAnalysis();

  const [file, setFile] = useState(null);
  const [jd, setJd] = useState('');
  const fileInputRef = useRef(null);

  const [repairMode, setRepairMode] = useState(false);
  const [repairText, setRepairText] = useState('');
  const [repairing, setRepairing] = useState(false);

  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [coverLetterText, setCoverLetterText] = useState('');
  const [showInterview, setShowInterview] = useState(false);
  const [showVerbAnalysis, setShowVerbAnalysis] = useState(false);
  const [showLinkedIn, setShowLinkedIn] = useState(false);
  const [linkedinSyncing, setLinkedinSyncing] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) setFile(e.target.files[0]);
  };

  const handleAnalysis = async () => {
    if (!file || !jd) { alert("Please upload a resume and paste a job description."); return; }
    setRepairMode(false);
    try {
      await runAnalysis(file, jd);
    } catch (e) {
      alert(e.message || "Analysis failed!");
    }
  };

  const handleDownloadExcel = async () => {
    if (!result?.analysisId) return;
    try { await downloadExcel(result.analysisId); }
    catch { alert("Failed to download."); }
  };

  const handleExportPDF = async () => {
    const { default: html2pdf } = await import('html2pdf.js');
    const element = document.getElementById('pdf-export-content');
    if (!element) return;
    element.style.display = 'block';
    await html2pdf().set({
      margin: [10, 10, 10, 10],
      filename: 'Resume_Analysis_Report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).from(element).save();
    element.style.display = 'none';
  };

  const generateCoverLetter = async () => {
    if (!result?.analysisId) return;
    try {
      const text = await getCoverLetter(result.analysisId);
      setCoverLetterText(text);
      setShowCoverLetter(true);
    } catch { alert("Failed to generate Cover Letter."); }
  };

  const handleLinkedInSync = async () => {
    setLinkedinSyncing(true);
    try {
      await syncLinkedIn();
      setShowLinkedIn(true);
    } catch { alert("Failed to sync LinkedIn."); }
    finally { setLinkedinSyncing(false); }
  };

  const runQuickFix = async () => {
    if (!repairText.trim()) return;
    setRepairing(true);
    try {
      const response = await applyLivePatch(result.analysisId, repairText);
      alert(response.message);
      setRepairMode(false);
      setRepairText('');
    } catch (err) {
      alert(err.message || 'Failed to apply patch');
    } finally {
      setRepairing(false);
    }
  };

  const scoreData = result?.data?.scores || {};
  const overall = scoreData.overallScore || 0;
  // Fix console warning for undefined radar data
  const radarData = (scoreData.radar || []).map(item => ({ ...item, A: item.A || 0 }));
  const mkt = result?.data?.marketInsights || {};
  const verbData = result?.data?.verbAnalysis || {};
  const extracted = result?.data?.extractedData?.resume || {};

  // Card classes
  const card = darkMode
    ? 'bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.3)]'
    : 'bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.03)]';

  const containerVars = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const itemVars = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } } };

  // Verb analysis bar chart data
  const verbBarData = verbData.stats ? [
    { name: 'Strong', count: verbData.stats.strongVerbCount || 0, fill: '#10b981' },
    { name: 'Weak', count: verbData.stats.weakVerbCount || 0, fill: '#ef4444' },
    { name: 'Passive', count: verbData.stats.passiveVoiceCount || 0, fill: '#f59e0b' },
  ] : [];

  return (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="pb-16 relative">

      {/* Header */}
      <motion.div variants={itemVars} className="mb-8 flex justify-between items-end flex-wrap gap-4">
        <div>
          <h1 className={`text-2xl font-extrabold mb-1 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
            Welcome Back, Sachin! <span className="inline-block animate-bounce">👋</span>
          </h1>
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>
            Your Elite Career Intelligence Platform. Analyze, optimize, and dominate.
          </p>
        </div>
        {result && (
          <div className="flex gap-2 flex-wrap">
            <button onClick={generateCoverLetter} className="flex items-center gap-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 px-4 py-2 rounded-xl text-xs font-bold transition-colors border border-indigo-500/20">
              <FileText size={14} /> Cover Letter
            </button>
            <button onClick={() => setShowInterview(true)} className="flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 px-4 py-2 rounded-xl text-xs font-bold transition-colors border border-blue-500/20">
              <MessageSquare size={14} /> Mock Interview
            </button>
            <button onClick={() => setShowVerbAnalysis(true)} className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 px-4 py-2 rounded-xl text-xs font-bold transition-colors border border-emerald-500/20">
              <Eye size={14} /> Verb Analysis
            </button>
            <button onClick={handleExportPDF} className="flex items-center gap-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 px-4 py-2 rounded-xl text-xs font-bold transition-colors border border-purple-500/20">
              <FileDown size={14} /> Export PDF
            </button>
            <button onClick={handleLinkedInSync} disabled={linkedinSyncing} className="flex items-center gap-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-500 px-4 py-2 rounded-xl text-xs font-bold transition-colors border border-sky-500/20 disabled:opacity-50">
              <ExternalLink size={14} /> {linkedinSyncing ? 'Syncing...' : 'Sync LinkedIn'}
            </button>
          </div>
        )}
      </motion.div>

      {/* Row 1: Upload & Job Context */}
      <motion.div variants={itemVars} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-6 text-white shadow-xl shadow-indigo-500/20 cursor-pointer relative overflow-hidden group hover:shadow-indigo-500/40 transition-all duration-300 h-[160px] flex flex-col justify-between transform hover:scale-[1.02]"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-bl-full transform translate-x-16 -translate-y-12"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-tr-full"></div>
          <div><h3 className="text-lg font-bold">Target Resume</h3><p className="text-white/70 text-xs font-medium mt-1">Upload PDF or DOCX file</p></div>
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"><UploadCloud size={20} /></div>
              <span className="font-bold text-sm">{file ? file.name.substring(0, 20) + (file.name.length > 20 ? '...' : '') : 'No File Selected'}</span>
            </div>
            <div className="h-8 w-8 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white/20 transition-colors"><ArrowRight size={16} /></div>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.docx" />
        </div>

        <div className={`lg:col-span-2 ${card} p-6 h-[160px] flex gap-4`}>
          <div className="flex-1 border-r border-slate-100 dark:border-gray-700 pr-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className={`text-sm font-bold flex items-center gap-2 ${darkMode ? 'text-gray-200' : 'text-slate-800'}`}>
                <Briefcase size={16} className="text-indigo-500" /> Job Description
              </h3>
            </div>
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              className={`w-full h-20 border-none rounded-xl p-3 text-xs focus:ring-2 outline-none resize-none transition-colors
                ${darkMode
                  ? 'bg-gray-700/50 text-gray-200 placeholder:text-gray-500 focus:ring-indigo-500/30'
                  : 'bg-slate-50 text-slate-600 placeholder:text-slate-400 focus:ring-indigo-100'
                }`}
              placeholder="Paste the target job description here..."
            ></textarea>
          </div>
          <div className="flex flex-col gap-3 justify-center w-40 shrink-0">
            <button
              onClick={handleAnalysis}
              disabled={analyzing}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl py-3 text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-70 flex items-center justify-center gap-2 hover:shadow-indigo-500/40"
            >
              {analyzing ?
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Sparkles size={16} /></motion.div>
                : <><Zap size={14} /> Run Analysis</>
              }
            </button>
            {result && (
              <button onClick={handleDownloadExcel} className={`w-full rounded-xl py-3 text-xs font-bold transition-all flex items-center justify-center gap-1.5 group
                ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-slate-800 hover:bg-slate-900 text-white'}`}>
                <Download size={14} className="group-hover:-translate-y-0.5 transition-transform" /> Export XLS
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl p-4 text-sm font-medium flex items-center gap-3">
            <AlertTriangle size={18} /> {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Container */}
      {result && (
          <div className="animate-fade-in">

            {/* Row 2: Score + Priority Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <motion.div variants={itemVars} className={`${card} p-6 flex flex-col h-[380px] relative overflow-hidden`}>
                <AnimatePresence>{scoreBoost > 0 && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: -20 }} exit={{ opacity: 0 }} className="absolute top-10 right-10 text-emerald-500 font-black text-xl z-20 drop-shadow-lg">+{scoreBoost} Pts!</motion.div>}</AnimatePresence>
                <h3 className={`text-sm font-bold mb-4 ${darkMode ? 'text-gray-200' : 'text-slate-800'}`}>Resume Strength</h3>
                <div className="relative flex-1 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={[{ value: overall }, { value: 100 - overall }]} cx="50%" cy="50%" innerRadius={75} outerRadius={105} startAngle={90} endAngle={-270} dataKey="value" stroke="none" cornerRadius={10} paddingAngle={5}>
                        <Cell fill={scoreBoost > 0 ? '#10b981' : overall >= 75 ? '#6366f1' : overall >= 50 ? '#f59e0b' : '#ef4444'} />
                        <Cell fill={darkMode ? '#374151' : '#e0e7ff'} />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span key={overall} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }} className={`text-5xl font-black tracking-tighter ${scoreBoost > 0 ? 'text-emerald-500' : darkMode ? 'text-white' : 'text-slate-800'}`}>{overall}%</motion.span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>Overall Score</span>
                  </div>
                </div>
                {/* Mini breakdown */}
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {[{ label: 'Skills', value: scoreData.breakdown?.skills },
                    { label: 'Exp', value: scoreData.breakdown?.experience },
                    { label: 'Projects', value: scoreData.breakdown?.projects },
                    { label: 'ATS', value: scoreData.breakdown?.formatting }].map((item, i) => (
                    <div key={i} className={`text-center p-1.5 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-slate-50'}`}>
                      <p className={`text-[10px] font-bold ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>{item.label}</p>
                      <p className={`text-sm font-black ${darkMode ? 'text-gray-200' : 'text-slate-700'}`}>{item.value || 0}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={itemVars} className={`lg:col-span-2 ${card} p-6 flex flex-col h-[380px]`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`text-sm font-bold ${darkMode ? 'text-gray-200' : 'text-slate-800'}`}>Priority Task Queue</h3>
                  <button onClick={() => setRepairMode(!repairMode)} className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${repairMode ? 'bg-indigo-600 text-white' : darkMode ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20' : 'text-indigo-600 bg-indigo-50 border border-indigo-100'}`}>
                    <Wrench size={14} /><span>Repair Mode</span>
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                  <AnimatePresence>
                    {repairMode ? (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className={`h-full flex flex-col rounded-xl p-4 ${darkMode ? 'border border-indigo-500/20 bg-indigo-500/5' : 'border border-indigo-100 bg-indigo-50/30'}`}>
                        <textarea value={repairText} onChange={(e) => setRepairText(e.target.value)} className={`flex-1 w-full border rounded-lg p-3 text-sm outline-none resize-none ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-indigo-100 text-slate-700 shadow-inner'}`} placeholder="Paste missing skills or improvements here..." />
                        <div className="flex justify-end mt-3">
                          <button onClick={runQuickFix} disabled={repairing || !repairText} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg text-xs font-bold flex items-center transition-all disabled:opacity-50">{repairing ? 'Patching...' : 'Apply Live Fix'}</button>
                        </div>
                      </motion.div>
                    ) : (
                      <>
                        {/* Missing Skills */}
                        {(result.data?.suggestions?.missingSkills || []).map((skill, idx) => (
                          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.08 }} key={`skill-${idx}`} className={`flex items-center justify-between p-3 rounded-xl border-l-4 border-l-red-400 ${darkMode ? 'bg-red-500/5 border border-red-500/10' : 'bg-red-50/50'}`}>
                            <div className="flex items-center gap-3">
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-red-500/10' : 'bg-red-100'}`}><AlertTriangle size={14} className="text-red-500" /></div>
                              <div><p className={`text-xs font-bold ${darkMode ? 'text-gray-200' : 'text-slate-800'}`}>Missing Critical Skill</p><p className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{skill}</p></div>
                            </div>
                            <span className="px-3 py-1 rounded-full border border-red-500/20 text-red-500 bg-red-500/10 text-[10px] font-bold">Fix Required</span>
                          </motion.div>
                        ))}
                        {/* Priority Insights */}
                        {(result.data?.insights?.priorityInsights || []).slice(0, 3).map((insight, idx) => (
                          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + idx * 0.08 }} key={`insight-${idx}`} className={`flex items-center justify-between p-3 rounded-xl border-l-4 ${insight.impact === 'high' ? 'border-l-amber-400' : 'border-l-blue-400'} ${darkMode ? 'bg-gray-700/30 border border-gray-700/50' : 'bg-slate-50/80'}`}>
                            <div className="flex items-center gap-3">
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-amber-500/10' : 'bg-amber-100'}`}><Target size={14} className="text-amber-500" /></div>
                              <div><p className={`text-xs font-bold ${darkMode ? 'text-gray-200' : 'text-slate-800'}`}>{insight.issue?.substring(0, 60)}</p><p className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{insight.fix?.substring(0, 80)}</p></div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${insight.impact === 'high' ? 'text-amber-500 bg-amber-500/10 border border-amber-500/20' : 'text-blue-500 bg-blue-500/10 border border-blue-500/20'}`}>{insight.impact}</span>
                          </motion.div>
                        ))}
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>

            {/* Row 3: Radar + Salary + Benchmark */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <motion.div variants={itemVars} className={`${card} p-6 h-[340px] flex flex-col`}>
                <h3 className={`text-sm font-bold text-center mb-2 ${darkMode ? 'text-gray-200' : 'text-slate-800'}`}>Competency Matrix</h3>
                <div className="flex-1 w-full -mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                      <PolarGrid stroke={darkMode ? '#374151' : '#e2e8f0'} />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: darkMode ? '#9ca3af' : '#64748b', fontSize: 9, fontWeight: 600 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', background: darkMode ? '#1f2937' : '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }} />
                      <Radar dataKey="A" stroke="#6366f1" strokeWidth={2} fill="#6366f1" fillOpacity={0.3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Salary Widget */}
              <motion.div variants={itemVars} className="flex flex-col gap-4">
                <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-3xl p-5 shadow-lg shadow-emerald-500/20 flex-1 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full transform translate-x-12 -translate-y-10"></div>
                  <div className="flex items-center gap-2 mb-3"><DollarSign size={16} className="text-emerald-100" /><span className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider">Predicted FAANG Salary</span></div>
                  <h4 className="text-3xl font-black text-white mb-1">{mkt.salaryPrediction?.median || '$--'}</h4>
                  <p className="text-xs text-emerald-100/70 mb-3">{mkt.salaryPrediction?.band || 'N/A'} • {mkt.salaryPrediction?.dominantSkillArea || 'General'}</p>
                  <div className="flex justify-between text-xs text-emerald-100 font-medium border-t border-white/20 pt-2">
                    <span>Min: {mkt.salaryPrediction?.min || '--'}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${mkt.salaryPrediction?.confidence === 'High' ? 'bg-white/20' : 'bg-white/10'}`}>{mkt.salaryPrediction?.confidence || 'N/A'} conf.</span>
                    <span>Max: {mkt.salaryPrediction?.max || '--'}</span>
                  </div>
                </div>
                {/* Contact Block */}
                <div className={`${card} p-4`}>
                  <span className="text-[10px] font-bold text-indigo-500 bg-indigo-500/10 px-2.5 py-1 rounded-full">Contact Extracted</span>
                  <h4 className={`text-sm font-bold mt-2 ${darkMode ? 'text-gray-200' : 'text-slate-800'}`}>{extracted.personalInfo?.name || 'N/A'}</h4>
                  <p className={`text-[11px] mt-0.5 ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>{extracted.personalInfo?.email || ''} {extracted.personalInfo?.phone ? `• ${extracted.personalInfo.phone}` : ''}</p>
                </div>
              </motion.div>

              {/* Benchmark */}
              <motion.div variants={itemVars} className="bg-gradient-to-br from-slate-800 via-gray-900 to-slate-950 rounded-3xl p-6 shadow-xl flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-400/5 rounded-bl-full transform translate-x-16 -translate-y-12"></div>
                <span className="text-[10px] font-bold text-yellow-500 bg-yellow-500/10 px-2.5 py-1 rounded-full border border-yellow-500/20 w-max mb-4 flex items-center gap-1"><Award size={12} /> Market Benchmark</span>
                <h4 className="text-2xl font-black text-white mb-2">{result.data?.benchmarking?.category || 'Average'}</h4>
                <p className="text-sm text-slate-300 leading-relaxed font-medium mb-1">{result.data?.benchmarking?.explanation}</p>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-4">
                  * {result.data?.benchmarking?.disclaimer || 'Estimated score band (heuristic)'}
                </p>
                <div className="h-3 w-full bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all duration-1000" style={{ width: `${result.data?.benchmarking?.percentile || 50}%` }}></div></div>
                <p className="text-[10px] text-slate-500 mt-2 font-bold">Percentile: {result.data?.benchmarking?.percentile || 50}th</p>
              </motion.div>
            </div>

            {/* Row 4: Skills Found + Verb Score + Career Paths */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Skills Found */}
              <motion.div variants={itemVars} className={`${card} p-6`}>
                <h3 className={`text-sm font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-gray-200' : 'text-slate-800'}`}><CheckCircle size={16} className="text-emerald-500" /> Skills Detected ({(extracted.skills || []).length})</h3>
                <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto">
                  {(extracted.skills || []).map((skill, i) => (
                    <span key={i} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${darkMode ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}>{skill}</span>
                  ))}
                </div>
              </motion.div>

              {/* Verb Score */}
              <motion.div variants={itemVars} className={`${card} p-6`}>
                <h3 className={`text-sm font-bold mb-3 flex items-center gap-2 ${darkMode ? 'text-gray-200' : 'text-slate-800'}`}><Shield size={16} className="text-purple-500" /> Action Verb Score</h3>
                <div className="flex items-center gap-4 mb-3">
                  <div className={`h-16 w-16 rounded-2xl flex items-center justify-center text-2xl font-black ${
                    verbData.overallGrade === 'A' ? 'bg-emerald-500/10 text-emerald-500' :
                    verbData.overallGrade === 'B' ? 'bg-blue-500/10 text-blue-500' :
                    verbData.overallGrade === 'C' ? 'bg-amber-500/10 text-amber-500' :
                    'bg-red-500/10 text-red-500'
                  }`}>{verbData.overallGrade || '-'}</div>
                  <div>
                    <p className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-800'}`}>{verbData.verbScore || 0}<span className="text-sm font-medium opacity-50">/100</span></p>
                    <p className={`text-[10px] font-medium ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>{verbData.stats?.strongVerbCount || 0} strong • {verbData.stats?.weakVerbCount || 0} weak</p>
                  </div>
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={verbBarData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#f1f5f9'} vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: darkMode ? '#9ca3af' : '#64748b', fontSize: 11, fontWeight: 600 }} />
                      <YAxis tick={{ fill: darkMode ? '#9ca3af' : '#64748b', fontSize: 11 }} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', background: darkMode ? '#1f2937' : '#fff' }} />
                      <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                        {verbBarData.map((entry, index) => (<Cell key={index} fill={entry.fill} />))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Career Paths */}
              <motion.div variants={itemVars} className={`${card} p-6`}>
                <h3 className={`text-sm font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-gray-200' : 'text-slate-800'}`}><TrendingUp size={16} className="text-cyan-500" /> Career Path Intel</h3>
                <div className="space-y-3 max-h-[260px] overflow-y-auto">
                  {(result.data?.careerPath?.recommendedRoles || []).map((role, i) => (
                    <div key={i} className={`p-3 rounded-xl border-l-4 border-l-cyan-400 ${darkMode ? 'bg-gray-700/30 border border-gray-700/50' : 'bg-cyan-50/50'}`}>
                      <p className={`text-sm font-bold ${darkMode ? 'text-gray-200' : 'text-slate-800'}`}>{role}</p>
                    </div>
                  ))}
                  {(result.data?.careerPath?.reasoning || []).map((reason, i) => (
                    <p key={`r-${i}`} className={`text-[11px] leading-relaxed ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{reason}</p>
                  ))}
                </div>
              </motion.div>
            </div>

          </div>
      )}


      {/* ==================== MODALS ==================== */}

      {/* Cover Letter Modal */}
      {showCoverLetter && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl relative`}>
            <button onClick={() => setShowCoverLetter(false)} className={`absolute top-6 right-6 p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}><X size={16} /></button>
            <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}><FileText className="text-indigo-500" /> AI Cover Letter</h2>
            <div className={`prose prose-sm font-medium whitespace-pre-wrap leading-relaxed p-6 rounded-2xl ${darkMode ? 'bg-gray-700/50 text-gray-300 border border-gray-600' : 'bg-slate-50 text-slate-600 border border-slate-100'}`}>
              {coverLetterText || "Generating..."}
            </div>
          </motion.div>
        </div>
      )}

      {/* Interview Modal */}
      {showInterview && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-8 max-w-3xl w-full max-h-[80vh] overflow-y-auto shadow-2xl relative`}>
            <button onClick={() => setShowInterview(false)} className={`absolute top-6 right-6 p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}><X size={16} /></button>
            <h2 className={`text-xl font-bold mb-2 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}><MessageSquare className="text-blue-500" /> Mock Interview</h2>
            <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Targeted questions based on your skill gaps and JD:</p>
            <div className="space-y-4">
              {(mkt.interviewQuestions || []).map((q, i) => (
                <div key={i} className={`p-5 rounded-2xl ${darkMode ? 'bg-blue-500/5 border border-blue-500/10' : 'bg-blue-50/50 border border-blue-100'}`}>
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-2 block">{q.type} Question</span>
                  <p className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-slate-800'}`}>{q.q}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Verb Analysis Modal */}
      {showVerbAnalysis && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-8 max-w-4xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative`}>
            <button onClick={() => setShowVerbAnalysis(false)} className={`absolute top-6 right-6 p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}><X size={16} /></button>
            <h2 className={`text-xl font-bold mb-2 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}><Eye className="text-emerald-500" /> Action Verb Analysis</h2>
            <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{verbData.recommendation}</p>
            <div className="space-y-3">
              {(verbData.annotations || []).map((ann, i) => (
                <div key={i} className={`p-4 rounded-xl border-l-4 ${ann.type === 'strong' ? 'border-l-emerald-400' : ann.type === 'weak' ? 'border-l-red-400' : 'border-l-amber-400'} ${darkMode ? 'bg-gray-700/30' : 'bg-slate-50'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      ann.type === 'strong' ? 'bg-emerald-500/10 text-emerald-500' :
                      ann.type === 'weak' ? 'bg-red-500/10 text-red-500' :
                      'bg-amber-500/10 text-amber-500'
                    }`}>{ann.type}</span>
                    <span className={`text-xs font-bold ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>"{ann.verb}"</span>
                  </div>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{ann.text}</p>
                  {ann.suggestion && <p className="text-[11px] text-indigo-500 mt-1 font-medium">💡 {ann.suggestion}</p>}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* LinkedIn Sync Modal */}
      {showLinkedIn && linkedinData && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-8 max-w-3xl w-full max-h-[80vh] overflow-y-auto shadow-2xl relative`}>
            <button onClick={() => setShowLinkedIn(false)} className={`absolute top-6 right-6 p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}><X size={16} /></button>
            <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}><ExternalLink className="text-sky-500" /> LinkedIn Profile Synced</h2>
            <div className={`p-5 rounded-2xl mb-4 ${darkMode ? 'bg-sky-500/5 border border-sky-500/10' : 'bg-sky-50 border border-sky-100'}`}>
              <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{linkedinData.profile?.name}</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{linkedinData.profile?.headline}</p>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}>{linkedinData.profile?.location} • {linkedinData.profile?.connections} connections</p>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {(linkedinData.skills || []).map((skill, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full text-xs font-bold bg-sky-500/10 text-sky-500 border border-sky-500/20">{skill}</span>
              ))}
            </div>
            <div className="space-y-3">
              {(linkedinData.experience || []).map((exp, i) => (
                <div key={i} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/30 border border-gray-700/50' : 'bg-slate-50 border border-slate-100'}`}>
                  <p className={`text-sm font-bold ${darkMode ? 'text-gray-200' : 'text-slate-800'}`}>{exp.title} <span className={`font-normal ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>at {exp.company}</span></p>
                  <p className={`text-[11px] ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}>{exp.duration}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Hidden PDF Export Template */}
      <div id="pdf-export-content" style={{ display: 'none', fontFamily: 'Arial, sans-serif', color: '#1e293b', padding: '40px', maxWidth: '800px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '3px solid #6366f1', paddingBottom: '20px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#6366f1', margin: '0 0 5px' }}>Resume Analysis Report</h1>
          <p style={{ fontSize: '14px', color: '#64748b' }}>Generated by AI Resume Analyzer PRO</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', gap: '20px' }}>
          <div style={{ flex: 1, background: '#f1f5f9', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>OVERALL SCORE</p>
            <p style={{ fontSize: '36px', fontWeight: '800', color: overall >= 75 ? '#10b981' : '#f59e0b', margin: '5px 0' }}>{overall}%</p>
          </div>
          <div style={{ flex: 1, background: '#f1f5f9', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>ATS SCORE</p>
            <p style={{ fontSize: '36px', fontWeight: '800', color: '#6366f1', margin: '5px 0' }}>{scoreData.atsScore || 0}%</p>
          </div>
          <div style={{ flex: 1, background: '#f1f5f9', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>BENCHMARK</p>
            <p style={{ fontSize: '20px', fontWeight: '800', color: '#f59e0b', margin: '5px 0' }}>{result?.data?.benchmarking?.category || 'N/A'}</p>
          </div>
        </div>
        <h2 style={{ fontSize: '18px', fontWeight: '700', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '15px' }}>Candidate: {extracted.personalInfo?.name || 'N/A'}</h2>
        <p style={{ fontSize: '13px', color: '#64748b' }}>Email: {extracted.personalInfo?.email || 'N/A'} | Phone: {extracted.personalInfo?.phone || 'N/A'}</p>
        <h2 style={{ fontSize: '18px', fontWeight: '700', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', margin: '20px 0 15px' }}>Skills Detected ({(extracted.skills || []).length})</h2>
        <p style={{ fontSize: '13px', lineHeight: '1.8' }}>{(extracted.skills || []).join(' • ')}</p>
        <h2 style={{ fontSize: '18px', fontWeight: '700', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', margin: '20px 0 15px' }}>Missing Critical Skills</h2>
        <ul style={{ fontSize: '13px', paddingLeft: '20px' }}>{(result?.data?.suggestions?.missingSkills || []).map((s, i) => <li key={i} style={{ marginBottom: '5px', color: '#ef4444' }}>{s}</li>)}</ul>
        <h2 style={{ fontSize: '18px', fontWeight: '700', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', margin: '20px 0 15px' }}>Salary Prediction</h2>
        <p style={{ fontSize: '13px' }}>Range: {mkt.salaryPrediction?.min} – {mkt.salaryPrediction?.max} | Median: {mkt.salaryPrediction?.median} ({mkt.salaryPrediction?.confidence} confidence)</p>
        <div style={{ marginTop: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '11px', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
          <p>AI Resume Analyzer PRO — Elite Career Intelligence Platform</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;

import { useState, useRef, useEffect } from 'react';
import { UploadCloud, CheckCircle, AlertTriangle, ArrowRight, Download, Briefcase, FileText, Wrench, Sparkles, MessageSquare, DollarSign, X, ExternalLink, TrendingUp, Target, Shield, Eye, Zap, Award, FileDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAnalysis } from '../context/AnalysisContext';

const Dashboard = () => {
  const { darkMode } = useTheme();
  const { 
    analyzing, 
    result, 
    error, 
    runAnalysis, 
    downloadExcel, 
    getCoverLetter, 
    syncLinkedIn, 
    linkedinData, 
    applyLivePatch,
    points,
    fetchPoints
  } = useAnalysis();

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

  const [scoreBoost, setScoreBoost] = useState(0);
  const prevScoreRef = useRef(0);
  const [tier, setTier] = useState('Bronze');

  useEffect(() => {
    fetchPoints().then(data => {
      if (data?.tier) setTier(data.tier);
    }).catch(() => {});
  }, [fetchPoints]);

  useEffect(() => {
    if (result?.data?.scores?.overallScore) {
      const newScore = result.data.scores.overallScore;
      const prevScore = prevScoreRef.current;
      if (prevScore > 0 && newScore > prevScore) {
        setScoreBoost(newScore - prevScore);
        const timer = setTimeout(() => setScoreBoost(0), 4000);
        return () => clearTimeout(timer);
      }
      prevScoreRef.current = newScore;
    } else {
      prevScoreRef.current = 0;
      setScoreBoost(0);
    }
  }, [result]);

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
  const radarData = (scoreData.radar || []).map(item => ({ ...item, A: item.A || 0 }));
  const mkt = result?.data?.marketInsights || {};
  const verbData = result?.data?.verbAnalysis || {};
  const extracted = result?.data?.extractedData?.resume || {};

  const card = 'bg-white rounded-2xl shadow-sm border border-slate-100/50';

  const containerVars = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const itemVars = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 18 } } };

  const verbBarData = verbData.stats ? [
    { name: 'Strong', count: verbData.stats.strongVerbCount || 0, fill: '#475569' },
    { name: 'Weak', count: verbData.stats.weakVerbCount || 0, fill: '#94a3b8' },
    { name: 'Passive', count: verbData.stats.passiveVoiceCount || 0, fill: '#cbd5e1' },
  ] : [];

  return (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="pb-16 relative">

      {/* Header */}
      <motion.div variants={itemVars} className="mb-4 flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold mb-0.5 text-slate-800">
            Welcome Back, Sachin! <span className="inline-block animate-bounce">👋</span>
          </h1>
          <p className="text-xs font-medium text-slate-400">
            Your Elite Career Intelligence Platform. Analyze, optimize, and dominate.
          </p>
        </div>
        {result && (
          <div className="flex gap-2 flex-wrap">
            <button onClick={generateCoverLetter} className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 pl-1.5 pr-3 py-1 rounded-lg text-xs font-bold border border-slate-200 shadow-sm transition-colors cursor-pointer">
              <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                <FileText size={10} />
              </div>
              <span>Cover Letter</span>
            </button>
            <button onClick={() => setShowInterview(true)} className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 pl-1.5 pr-3 py-1 rounded-lg text-xs font-bold border border-slate-200 shadow-sm transition-colors cursor-pointer">
              <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                <MessageSquare size={10} />
              </div>
              <span>Mock Interview</span>
            </button>
            <button onClick={() => setShowVerbAnalysis(true)} className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 pl-1.5 pr-3 py-1 rounded-lg text-xs font-bold border border-slate-200 shadow-sm transition-colors cursor-pointer">
              <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                <Eye size={10} />
              </div>
              <span>Verb Analysis</span>
            </button>
            <button onClick={handleExportPDF} className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 pl-1.5 pr-3 py-1 rounded-lg text-xs font-bold border border-slate-200 shadow-sm transition-colors cursor-pointer">
              <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                <FileDown size={10} />
              </div>
              <span>Export PDF</span>
            </button>
            <button onClick={handleLinkedInSync} disabled={linkedinSyncing} className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 pl-1.5 pr-3 py-1 rounded-lg text-xs font-bold border border-slate-200 shadow-sm transition-colors disabled:opacity-50 cursor-pointer">
              <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                <ExternalLink size={10} />
              </div>
              <span>{linkedinSyncing ? 'Syncing...' : 'Sync LinkedIn'}</span>
            </button>
          </div>
        )}
      </motion.div>

      {/* Main Grid: 3-column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 items-start">
        
        {/* Center/Main Column: Working Area */}
        <div className="xl:col-span-3 space-y-4">
          
          {/* Row 1: Upload & Job Context */}
          <motion.div variants={itemVars} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="bg-white border-2 border-dashed border-slate-200 hover:border-slate-400 rounded-2xl p-4 text-slate-800 shadow-sm cursor-pointer relative overflow-hidden group transition-all duration-150 h-[130px] flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xs font-bold text-slate-800">Target Resume</h3>
                <p className="text-slate-400 text-[9px] font-medium mt-0.5">Upload PDF or DOCX file</p>
              </div>
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center space-x-2">
                  <div className="h-7 w-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                    <UploadCloud size={13} />
                  </div>
                  <span className="font-bold text-[11px] text-slate-700 truncate max-w-[150px]">{file ? file.name : 'No File Selected'}</span>
                </div>
                <div className="h-7 w-7 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-slate-50 transition-colors">
                  <ArrowRight size={12} className="text-slate-500" />
                </div>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.docx" />
            </div>

            <div className={`lg:col-span-2 ${card} p-4 h-[130px] flex gap-4`}>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-[11px] font-bold flex items-center gap-1.5 text-slate-700">
                    <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                      <Briefcase size={12} />
                    </div>
                    <span>Job Description</span>
                  </h3>
                </div>
                <textarea
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                  className="w-full h-14 border border-slate-200 rounded-lg p-2 text-xs outline-none resize-none transition-colors bg-slate-50 text-slate-600 placeholder:text-slate-400 focus:ring-1 focus:ring-slate-400 focus:border-slate-400"
                  placeholder="Paste the target job description here..."
                ></textarea>
              </div>
              <div className="flex flex-col gap-1.5 justify-center w-32 shrink-0 border-l border-slate-100 pl-4">
                <button
                  onClick={handleAnalysis}
                  disabled={analyzing}
                  className="w-full bg-slate-900 hover:bg-black text-white rounded-lg py-2 text-xs font-bold shadow-sm transition-all disabled:opacity-75 flex items-center justify-center gap-1 cursor-pointer"
                >
                  {analyzing ?
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Sparkles size={12} /></motion.div>
                    : <><Zap size={10} /> Run Analysis</>
                  }
                </button>
                {result && (
                  <button onClick={handleDownloadExcel} className="w-full rounded-lg py-2 text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm transition-all flex items-center justify-center gap-1 group cursor-pointer">
                    <Download size={11} className="group-hover:-translate-y-0.5 transition-transform" /> Export XLS
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl p-4 text-xs font-medium flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center text-red-500 shrink-0">
                  <AlertTriangle size={12} />
                </div>
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Area */}
          {result && (
            <div className="space-y-4">
              
              {/* Row 2: Score + Priority Tasks */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <motion.div variants={itemVars} className={`${card} p-4 flex flex-col h-[320px] relative overflow-hidden`}>
                  <AnimatePresence>{scoreBoost > 0 && <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: -15 }} exit={{ opacity: 0 }} className="absolute top-6 right-6 text-emerald-600 font-extrabold text-xs z-20">+{scoreBoost} Pts!</motion.div>}</AnimatePresence>
                  
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                      <Target size={13} className="text-slate-500" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-800">Resume Strength</h3>
                  </div>
                  
                  <div className="relative flex-1 flex items-center justify-center min-h-[170px] w-full">
                    <div className="w-[150px] h-[150px] z-10">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={[{ value: overall }, { value: 100 - overall }]} cx="50%" cy="50%" innerRadius={60} outerRadius={64} startAngle={90} endAngle={-270} dataKey="value" stroke="none">
                            <Cell fill="#09090b" />
                            <Cell fill="#f4f4f5" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-15 pointer-events-none">
                      <motion.span key={overall} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-3xl font-extrabold tracking-tight text-slate-900">{overall}%</motion.span>
                      <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Overall Score</span>
                    </div>

                    {/* Floating Overlay Stat Card */}
                    {result.data?.benchmarking && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="absolute bottom-1 right-2 bg-white/95 border border-slate-100 rounded-xl p-2 shadow-sm flex flex-col items-start z-20"
                      >
                        <span className="text-[7px] font-bold text-slate-400 uppercase tracking-wide">Rank</span>
                        <span className="text-[10px] font-bold text-slate-800 leading-tight">
                          {result.data.benchmarking.percentile || 50}th Percentile
                        </span>
                        <span className="text-[7px] text-slate-500 font-bold uppercase tracking-wide mt-0.5">
                          {result.data.benchmarking.category || 'Average'} Tier
                        </span>
                      </motion.div>
                    )}
                  </div>

                  {/* Mini breakdown */}
                  <div className="grid grid-cols-4 gap-1 mt-1 border-t border-slate-50 pt-2.5">
                    {[{ label: 'Skills', value: scoreData.breakdown?.skills },
                      { label: 'Exp', value: scoreData.breakdown?.experience },
                      { label: 'Projects', value: scoreData.breakdown?.projects },
                      { label: 'ATS', value: scoreData.breakdown?.formatting }].map((item, i) => (
                      <div key={i} className="text-center">
                        <p className="text-[8px] font-bold text-slate-400 uppercase">{item.label}</p>
                        <p className="text-xs font-bold text-slate-700">{item.value || 0}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Priority Task Queue (Divider List Pattern) */}
                <motion.div variants={itemVars} className={`lg:col-span-2 ${card} p-4 flex flex-col h-[320px]`}>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                        <Wrench size={13} className="text-slate-500" />
                      </div>
                      <h3 className="text-xs font-bold text-slate-800">Priority Task Queue</h3>
                    </div>
                    <button onClick={() => setRepairMode(!repairMode)} className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${repairMode ? 'bg-slate-900 border-slate-900 text-white' : 'text-slate-600 bg-white border-slate-200 hover:bg-slate-50'}`}>
                      <Wrench size={10} /><span>Repair Mode</span>
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto pr-1">
                    <AnimatePresence>
                      {repairMode ? (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="h-full flex flex-col rounded-xl p-2.5 border border-slate-200 bg-slate-50/50">
                          <textarea value={repairText} onChange={(e) => setRepairText(e.target.value)} className="flex-1 w-full border border-slate-200 rounded-lg p-2 text-xs outline-none bg-white text-slate-700 placeholder:text-slate-400" placeholder="Paste missing skills or improvements here..." />
                          <div className="flex justify-end mt-2">
                            <button onClick={runQuickFix} disabled={repairing || !repairText} className="bg-slate-900 hover:bg-black text-white px-3.5 py-1 rounded-lg text-[10px] font-bold transition-all disabled:opacity-50 cursor-pointer">{repairing ? 'Patching...' : 'Apply Live Fix'}</button>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="divide-y divide-slate-100">
                          {/* Missing Skills */}
                          {(result.data?.suggestions?.missingSkills || []).map((skill, idx) => (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={`skill-${idx}`} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                              <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                                <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0 text-slate-500">
                                  <AlertTriangle size={12} />
                                </div>
                                <div className="flex items-baseline gap-2 min-w-0">
                                  <p className="text-xs font-bold text-slate-800 truncate">{skill}</p>
                                  <span className="text-[9px] text-slate-400 font-medium shrink-0">Missing Critical Skill</span>
                                </div>
                              </div>
                              <span className="px-2 py-0.5 rounded-full text-white bg-red-500 text-[8px] font-extrabold uppercase tracking-wide shrink-0">Urgent</span>
                            </motion.div>
                          ))}
                          {/* Priority Insights */}
                          {(result.data?.insights?.priorityInsights || []).slice(0, 3).map((insight, idx) => (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={`insight-${idx}`} className="flex items-center justify-between py-2.5 last:pb-0">
                              <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                                <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0 text-slate-500">
                                  <Target size={12} />
                                </div>
                                <div className="flex items-baseline gap-2 min-w-0">
                                  <p className="text-xs font-bold text-slate-800 truncate">{insight.issue}</p>
                                  <span className="text-[9px] text-slate-400 font-medium truncate">{insight.fix}</span>
                                </div>
                              </div>
                              <span className="px-2 py-0.5 rounded-full text-slate-600 bg-slate-100 text-[8px] font-extrabold uppercase tracking-wide shrink-0">To-do</span>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>

              {/* Row 3: Radar + Salary */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <motion.div variants={itemVars} className={`${card} p-4 h-[280px] flex flex-col lg:col-span-7`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                        <Target size={13} className="text-slate-500" />
                      </div>
                      <h3 className="text-xs font-bold text-slate-800">Competency Matrix</h3>
                    </div>
                  </div>
                  <div className="flex-1 w-full -mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 9, fontWeight: 500 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }} />
                        <Radar dataKey="A" stroke="#09090b" strokeWidth={1.5} fill="#09090b" fillOpacity={0.06} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                {/* Salary & Contacts */}
                <motion.div variants={itemVars} className="flex flex-col gap-4 lg:col-span-5">
                  <div className={`${card} p-4 flex flex-col justify-between relative overflow-hidden h-[160px]`}>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                            <DollarSign size={13} className="text-slate-500" />
                          </div>
                          <h3 className="text-xs font-bold text-slate-800">Salary Prediction</h3>
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 hover:text-slate-600 flex items-center gap-0.5 cursor-pointer">
                          Market Details <ArrowRight size={10} />
                        </span>
                      </div>
                      <h4 className="text-2xl font-black text-slate-800 tracking-tight">{mkt.salaryPrediction?.median || '$--'}</h4>
                      <p className="text-[9px] text-slate-400 font-bold mt-0.5">{mkt.salaryPrediction?.band || 'N/A'} • {mkt.salaryPrediction?.dominantSkillArea || 'General'}</p>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-medium border-t border-slate-50 pt-2">
                      <span>Min: {mkt.salaryPrediction?.min || '--'}</span>
                      <span className="text-[8px] font-extrabold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">{mkt.salaryPrediction?.confidence || 'N/A'} conf.</span>
                      <span>Max: {mkt.salaryPrediction?.max || '--'}</span>
                    </div>
                  </div>
                  
                  {/* Contact Block */}
                  <div className={`${card} p-4 flex-1 flex flex-col justify-center`}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                        <FileText size={11} className="text-slate-500" />
                      </div>
                      <span className="text-[9px] font-extrabold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full w-max uppercase tracking-wider">Contact Extracted</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800">{extracted.personalInfo?.name || 'N/A'}</h4>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">{extracted.personalInfo?.email || ''} {extracted.personalInfo?.phone ? `• ${extracted.personalInfo.phone}` : ''}</p>
                  </div>
                </motion.div>
              </div>

              {/* Skills Detected (Divider List Pattern) */}
              {extracted.skills && extracted.skills.length > 0 && (
                <motion.div variants={itemVars} className={`${card} p-4`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                        <CheckCircle size={13} className="text-slate-500" />
                      </div>
                      <h3 className="text-xs font-bold text-slate-800">Skills Detected ({extracted.skills.length})</h3>
                    </div>
                    <NavLink to="/analytics" className="text-[10px] font-bold text-slate-400 hover:text-slate-600 flex items-center gap-0.5">
                      View Analytics <ArrowRight size={10} />
                    </NavLink>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-[220px] overflow-y-auto pr-1">
                    {(extracted.skills || []).map((skill, i) => (
                      <div key={i} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                            <CheckCircle size={12} className="text-slate-400" />
                          </div>
                          <div className="flex items-baseline gap-2">
                            <p className="text-xs font-bold text-slate-800">{skill}</p>
                            <span className="text-[10px] text-slate-400 font-medium">Verified skill</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-slate-600 bg-slate-100 text-[9px] font-bold">Verified</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Row 4: Verb Score + Career Paths */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Verb Score */}
                <motion.div variants={itemVars} className={`${card} p-4`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                        <Shield size={13} className="text-slate-500" />
                      </div>
                      <h3 className="text-xs font-bold text-slate-800">Action Verb Score</h3>
                    </div>
                    <span onClick={() => setShowVerbAnalysis(true)} className="text-[10px] font-bold text-slate-400 hover:text-slate-600 flex items-center gap-0.5 cursor-pointer">
                      View Annotations <ArrowRight size={10} />
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-base font-bold shrink-0 ${
                      verbData.overallGrade === 'A' ? 'bg-emerald-50 text-emerald-700' :
                      verbData.overallGrade === 'B' ? 'bg-blue-50 text-blue-700' :
                      verbData.overallGrade === 'C' ? 'bg-amber-50 text-amber-700' :
                      'bg-red-50 text-red-700'
                    }`}>{verbData.overallGrade || '-'}</div>
                    <div>
                      <p className="text-lg font-extrabold text-slate-800 leading-none">{verbData.verbScore || 0}<span className="text-xs font-medium text-slate-400">/100</span></p>
                      <p className="text-[9px] font-bold text-slate-400 mt-1">{verbData.stats?.strongVerbCount || 0} strong • {verbData.stats?.weakVerbCount || 0} weak</p>
                    </div>
                  </div>
                  <div className="h-36">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={verbBarData} margin={{ top: 5, right: 5, bottom: 5, left: -25 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 9, fontWeight: 500 }} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 9 }} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff' }} />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                          {verbBarData.map((entry, index) => (<Cell key={index} fill={entry.fill} />))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                {/* Career Paths */}
                <motion.div variants={itemVars} className={`${card} p-4`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                        <TrendingUp size={13} className="text-slate-500" />
                      </div>
                      <h3 className="text-xs font-bold text-slate-800">Career Path Intel</h3>
                    </div>
                  </div>
                  <div className="max-h-[190px] overflow-y-auto pr-1">
                    <div className="divide-y divide-slate-100">
                      {(result.data?.careerPath?.recommendedRoles || []).map((role, i) => (
                        <div key={i} className="flex items-center gap-2.5 py-2 first:pt-0">
                          <div className="h-6 w-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                            <TrendingUp size={10} />
                          </div>
                          <p className="text-xs font-bold text-slate-800">{role}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-50 space-y-1.5">
                      {(result.data?.careerPath?.reasoning || []).map((reason, i) => (
                        <p key={`r-${i}`} className="text-[9px] leading-relaxed text-slate-400 font-medium">{reason}</p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>

            </div>
          )}

        </div>

        {/* Right Column: Widgets Panel */}
        <div className="xl:col-span-1 space-y-4">
          
          {/* Career Points Widget */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100/50">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                <Award size={13} className="text-slate-500" />
              </div>
              <h3 className="text-xs font-bold text-slate-800">Career Points</h3>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-slate-800">{points || 0}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">pts</span>
            </div>
            <div className="flex items-center gap-1 mt-1.5">
              <span className="text-[8px] font-extrabold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">{tier} Tier</span>
            </div>
          </div>

          {/* Mastering Resumes Tip Widget */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100/50">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                <Zap size={13} className="text-slate-500" />
              </div>
              <h3 className="text-xs font-bold text-slate-800">Mastering Resumes</h3>
            </div>
            <p className="text-[10px] text-slate-400 font-medium leading-normal">FAANG-tier strategies for ATS optimization.</p>
            <button className="mt-3 bg-slate-900 hover:bg-slate-800 text-white py-1.5 px-3 rounded-lg text-[9px] font-bold w-max transition-colors cursor-pointer">
              Learn More
            </button>
          </div>

          {/* Recent Activity Widget */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                  <FileText size={13} className="text-slate-500" />
                </div>
                <h3 className="text-xs font-bold text-slate-800">Recent Activity</h3>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              <div className="flex items-center gap-2 py-2 first:pt-0">
                <div className="h-6 w-6 rounded-full bg-slate-50 flex items-center justify-center shrink-0 text-slate-500">
                  <Zap size={10} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-slate-800 truncate">Resume Analyzed</p>
                  <p className="text-[8px] text-slate-400 font-medium">v1.0 • 2 mins ago</p>
                </div>
              </div>
              <div className="flex items-center gap-2 py-2">
                <div className="h-6 w-6 rounded-full bg-slate-50 flex items-center justify-center shrink-0 text-slate-500">
                  <CheckCircle size={10} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-slate-800 truncate">LinkedIn Synced</p>
                  <p className="text-[8px] text-slate-400 font-medium">Successfully • 5 mins ago</p>
                </div>
              </div>
              <div className="flex items-center gap-2 py-2 last:pb-0">
                <div className="h-6 w-6 rounded-full bg-slate-50 flex items-center justify-center shrink-0 text-slate-500">
                  <Wrench size={10} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-slate-800 truncate">Live Patch Applied</p>
                  <p className="text-[8px] text-slate-400 font-medium">+4 points • 10 mins ago</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ==================== MODALS ==================== */}

      {/* Cover Letter Modal */}
      {showCoverLetter && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-xl relative">
            <button onClick={() => setShowCoverLetter(false)} className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100"><X size={15} /></button>
            <h2 className="text-sm font-bold mb-4 flex items-center gap-1.5 text-slate-800"><FileText className="text-slate-500" /> AI Cover Letter</h2>
            <div className="prose prose-sm font-medium whitespace-pre-wrap leading-relaxed p-4 rounded-xl bg-slate-50 text-slate-600 border border-slate-100">
              {coverLetterText || "Generating..."}
            </div>
          </motion.div>
        </div>
      )}

      {/* Interview Modal */}
      {showInterview && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-white rounded-2xl p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto shadow-xl relative">
            <button onClick={() => setShowInterview(false)} className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100"><X size={15} /></button>
            <h2 className="text-sm font-bold mb-1 flex items-center gap-1.5 text-slate-800"><MessageSquare className="text-slate-500" /> Mock Interview</h2>
            <p className="text-[11px] font-medium text-slate-400 mb-4">Targeted questions based on your skill gaps and JD:</p>
            <div className="space-y-3">
              {(mkt.interviewQuestions || []).map((q, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider mb-1 block">{q.type} Question</span>
                  <p className="text-xs font-bold text-slate-800 leading-normal">{q.q}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Verb Analysis Modal */}
      {showVerbAnalysis && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[85vh] overflow-y-auto shadow-xl relative">
            <button onClick={() => setShowVerbAnalysis(false)} className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100"><X size={15} /></button>
            <h2 className="text-sm font-bold mb-1 flex items-center gap-1.5 text-slate-800"><Eye className="text-slate-500" /> Action Verb Analysis</h2>
            <p className="text-[11px] text-slate-400 font-medium mb-4">{verbData.recommendation}</p>
            <div className="space-y-2.5">
              {(verbData.annotations || []).map((ann, i) => (
                <div key={i} className={`p-3.5 rounded-xl border-l-4 ${ann.type === 'strong' ? 'border-l-slate-400 bg-slate-50' : ann.type === 'weak' ? 'border-l-slate-300 bg-slate-50' : 'border-l-slate-200 bg-slate-50'}`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600">{ann.type}</span>
                    <span className="text-xs font-bold text-slate-700">"{ann.verb}"</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-normal">{ann.text}</p>
                  {ann.suggestion && <p className="text-[10px] text-slate-800 mt-1 font-bold">💡 {ann.suggestion}</p>}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* LinkedIn Sync Modal */}
      {showLinkedIn && linkedinData && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-white rounded-2xl p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto shadow-xl relative">
            <button onClick={() => setShowLinkedIn(false)} className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100"><X size={15} /></button>
            <h2 className="text-sm font-bold mb-4 flex items-center gap-1.5 text-slate-800"><ExternalLink className="text-slate-500" /> LinkedIn Profile Synced</h2>
            <div className="p-4 rounded-xl mb-4 bg-slate-50 border border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">{linkedinData.profile?.name}</h3>
              <p className="text-xs text-slate-500">{linkedinData.profile?.headline}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{linkedinData.profile?.location} • {linkedinData.profile?.connections} connections</p>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {(linkedinData.skills || []).map((skill, i) => (
                <span key={i} className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200/50">{skill}</span>
              ))}
            </div>
            <div className="space-y-2.5">
              {(linkedinData.experience || []).map((exp, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-xs font-bold text-slate-800">{exp.title} <span className="font-normal text-slate-500">at {exp.company}</span></p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{exp.duration}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Hidden PDF Export Template */}
      <div id="pdf-export-content" style={{ display: 'none', fontFamily: 'Arial, sans-serif', color: '#1e293b', padding: '40px', maxWidth: '800px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '3px solid #09090b', paddingBottom: '20px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#09090b', margin: '0 0 5px' }}>Resume Analysis Report</h1>
          <p style={{ fontSize: '14px', color: '#64748b' }}>Generated by AI Resume Analyzer PRO</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', gap: '20px' }}>
          <div style={{ flex: 1, background: '#f1f5f9', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>OVERALL SCORE</p>
            <p style={{ fontSize: '36px', fontWeight: '800', color: '#09090b', margin: '5px 0' }}>{overall}%</p>
          </div>
          <div style={{ flex: 1, background: '#f1f5f9', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>ATS SCORE</p>
            <p style={{ fontSize: '36px', fontWeight: '800', color: '#09090b', margin: '5px 0' }}>{scoreData.atsScore || 0}%</p>
          </div>
          <div style={{ flex: 1, background: '#f1f5f9', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>BENCHMARK</p>
            <p style={{ fontSize: '20px', fontWeight: '800', color: '#64748b', margin: '5px 0' }}>{result?.data?.benchmarking?.category || 'N/A'}</p>
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

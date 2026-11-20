import { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, CheckCircle, AlertTriangle, ArrowRight, Download, Briefcase, FileText, 
  Wrench, Sparkles, MessageSquare, DollarSign, X, ExternalLink, TrendingUp, Target, 
  Shield, Eye, Zap, Award, FileDown, ChevronDown, ChevronLeft, ChevronRight, 
  Calendar, Star, Users, Check, Play, Share2, RefreshCw, Layers
} from 'lucide-react';
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAnalysis } from '../context/AnalysisContext';
import { useAuth } from '../context/AuthContext';
import { Link000, Link001, Link002, Link003, Link004, Link005 } from '../components/ui/skiper-ui/skiper40';
import SpotlightCard from '../components/ui/SpotlightCard';

const sampleRoleTemplates = {
  staffBackend: `Staff Backend Engineer Requirements:\n- 8+ years developing highly distributed microservices in Go, Java, or Node.js\n- Deep expertise in Kubernetes, Docker, gRPC, and Kafka event streaming\n- Proven experience designing low-latency distributed caching with Redis and Memcached\n- Strong database architecture skills across PostgreSQL and NoSQL data stores\n- Track record of leading architecture reviews and mentoring senior engineering staff`,
  fullstackLead: `Lead Full Stack Architect Requirements:\n- 7+ years building enterprise applications with React, TypeScript, Next.js, and Node.js\n- Advanced mastery of state management, Webpack/Vite performance optimization, and Core Web Vitals\n- Experience building robust GraphQL and RESTful APIs with automated CI/CD pipelines\n- Demonstrated track record leading sprint planning and system design for cloud-native platforms`,
  srePlatform: `Senior Platform / DevOps Engineer Requirements:\n- 6+ years managing large-scale multi-region Kubernetes clusters on AWS or GCP\n- Infrastructure as Code expertise with Terraform, Ansible, and GitOps workflows\n- Observability mastery with Prometheus, Grafana, OpenTelemetry, and distributed tracing\n- Incident response leadership, chaos engineering, and zero-downtime deployment pipelines`,
  aiMlEngineer: `Senior AI / ML Systems Engineer Requirements:\n- 5+ years productionizing LLMs, RAG architectures, and vector databases (Pinecone, Milvus)\n- Mastery of Python, PyTorch, LangChain/LlamaIndex, and model evaluation benchmarks\n- Experience deploying low-latency model inference servers with vLLM, TensorRT, and Docker\n- Track record designing scalable data pipelines for fine-tuning and embeddings generation`,
};

const Dashboard = () => {
  const { darkMode } = useTheme();
  const { user } = useAuth();
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

  const [activeAccordion, setActiveAccordion] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);

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

  const handleUseSampleResume = () => {
    const sampleContent = `Candidate: Alex Vance\nSenior Full Stack Architect & Tech Lead\nExperience: 8+ years designing high-throughput web applications with React, TypeScript, Node.js, and PostgreSQL.\nArchitected microservices using Docker, Kubernetes, Redis caching, and AWS ECS.\nSpearheaded performance initiatives lowering LCP by 45%.\nSkills: JavaScript, TypeScript, React, Node.js, Express, PostgreSQL, MongoDB, Redis, Docker, Kubernetes, AWS, CI/CD, Jest, Git.`;
    const blob = new Blob([sampleContent], { type: 'text/plain' });
    const sampleFile = new File([blob], 'Alex_Vance_Staff_Resume.pdf', { type: 'application/pdf' });
    setFile(sampleFile);
    if (!jd) setJd(sampleRoleTemplates.staffBackend);
  };

  const handleAnalysis = async () => {
    if (!file || !jd) {
      alert("Please upload a resume and paste a job description (or click 'Use Demo Sample' to test instantly).");
      return;
    }
    setRepairMode(false);
    try {
      await runAnalysis(file, jd);
      const resultsSection = document.getElementById('analysis-results-stage');
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (e) {
      alert(e.message || "Analysis failed!");
    }
  };

  const handleDownloadExcel = async () => {
    if (!result?.analysisId) return;
    try { await downloadExcel(result.analysisId); }
    catch { alert("Failed to download Excel report."); }
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

  const scrollToHero = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scoreData = result?.data?.scores || {};
  const overall = scoreData.overallScore || (result ? 84 : 94);
  const atsScore = scoreData.atsScore || (result ? 88 : 92);
  const radarData = (scoreData.radar && scoreData.radar.length > 0) 
    ? scoreData.radar.map(item => ({ ...item, A: item.A || 0 }))
    : [
        { subject: 'System Design', A: 85 },
        { subject: 'Frontend', A: 92 },
        { subject: 'Backend', A: 88 },
        { subject: 'Cloud/DevOps', A: 78 },
        { subject: 'Architecture', A: 90 },
      ];
  const mkt = result?.data?.marketInsights || {};
  const verbData = result?.data?.verbAnalysis || {};
  const extracted = result?.data?.extractedData?.resume || {};

  const missingSkillsList = result?.data?.suggestions?.missingSkills || ['Kubernetes Orchestration', 'Distributed Systems', 'gRPC / Protocol Buffers'];
  const strongVerbCount = verbData.stats?.strongVerbCount || 14;
  const weakVerbCount = verbData.stats?.weakVerbCount || 3;
  const candidateName = extracted.personalInfo?.name || (user?.name ? `${user.name}` : 'Alex Vance (Senior Engineer)');
  const candidateSeniority = result?.data?.benchmarking?.category || 'Staff Engineer';
  const percentileRank = result?.data?.benchmarking?.percentile || 94;

  const verbBarData = [
    { name: 'Strong', count: strongVerbCount, fill: '#141c15' },
    { name: 'Weak', count: weakVerbCount, fill: '#c27838' },
    { name: 'Passive', count: verbData.stats?.passiveVoiceCount || 1, fill: '#94a3b8' },
  ];

  return (
    <div className="space-y-16 pb-28 font-geometric text-[#141c15] dark:text-[#f2f6f2]">
      
      {/* =========================================================
          SECTION 1: HERO COMMAND STAGE
          ========================================================= */}
      <section className="relative min-h-[calc(100vh-100px)] flex flex-col justify-between pt-2 pb-8">
        
        {/* Top Badges & Actions */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-[#141c15] border border-black/10 dark:border-white/10 shadow-sm backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-[#c27838] animate-pulse"></span>
            <span className="text-xs font-bold tracking-tight text-[#141c15] dark:text-white">
              ✦ ATS Intelligence Engine v2.4
            </span>
          </div>

          {result && (
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={generateCoverLetter} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white dark:bg-[#141c15] text-[#141c15] dark:text-white border border-black/10 dark:border-white/10 shadow-sm hover:-translate-y-0.5 transition-transform cursor-pointer">
                <FileText size={12} className="text-[#c27838]" />
                <span>Cover Letter</span>
              </button>
              <button onClick={() => setShowInterview(true)} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white dark:bg-[#141c15] text-[#141c15] dark:text-white border border-black/10 dark:border-white/10 shadow-sm hover:-translate-y-0.5 transition-transform cursor-pointer">
                <MessageSquare size={12} className="text-[#c27838]" />
                <span>Mock Interview</span>
              </button>
              <button onClick={() => setShowVerbAnalysis(true)} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white dark:bg-[#141c15] text-[#141c15] dark:text-white border border-black/10 dark:border-white/10 shadow-sm hover:-translate-y-0.5 transition-transform cursor-pointer">
                <Eye size={12} className="text-[#c27838]" />
                <span>Verb Analysis</span>
              </button>
              <button onClick={handleExportPDF} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white dark:bg-[#141c15] text-[#141c15] dark:text-white border border-black/10 dark:border-white/10 shadow-sm hover:-translate-y-0.5 transition-transform cursor-pointer">
                <FileDown size={12} className="text-[#c27838]" />
                <span>Export PDF</span>
              </button>
            </div>
          )}
        </div>

        {/* Hero Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1">
          
          {/* Left Column: Asymmetric Statement & Glass Command Console */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#141c15] dark:text-white leading-[1.06]">
              Accelerate Your <br />
              <span className="text-[#c27838] dark:text-[#d68d4d]">Next Senior Career</span> <br />
              Leap Today!
            </h1>
            
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl font-medium leading-relaxed">
              Precision ATS parsing, semantic skill gap intelligence, and real-time compensation benchmarks to secure top-tier offers.
            </p>

            {/* Glass Command Console with Cursor Spotlight */}
            <SpotlightCard className="bg-white/95 dark:bg-[#121a13]/95 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-[32px] p-6 shadow-xl space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Target Resume Vault */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-4 flex flex-col justify-between h-40 cursor-pointer transition-all group ${
                    file 
                      ? 'border-[#c27838] bg-amber-500/5 dark:bg-amber-500/10' 
                      : 'border-slate-300 dark:border-white/15 hover:border-[#c27838] bg-slate-50/80 dark:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Target Resume</span>
                    <div className="h-7 w-7 rounded-full bg-white dark:bg-white/10 shadow-sm flex items-center justify-center text-slate-700 dark:text-white group-hover:scale-110 transition-transform">
                      {file ? <CheckCircle size={14} className="text-[#c27838]" /> : <UploadCloud size={14} />}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs font-black text-[#141c15] dark:text-white truncate">
                      {file ? file.name : 'Drop PDF or DOCX Resume'}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {file ? `${(file.size / 1024).toFixed(1)} KB • Ready for Analysis` : 'Click to browse files (Up to 10MB)'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-white/10 text-[10px] font-bold text-[#c27838]">
                    <span>{file ? 'Click to replace' : 'Select file'}</span>
                    <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>

                  <input id="hero-resume-file-input" type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.docx" />
                </div>

                {/* Target Job Description Panel */}
                <div className="border border-slate-300 dark:border-white/15 rounded-2xl p-4 flex flex-col justify-between h-40 bg-slate-50/80 dark:bg-white/5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Job Description</span>
                    <Briefcase size={13} className="text-slate-400" />
                  </div>
                  
                  <textarea
                    value={jd}
                    onChange={(e) => setJd(e.target.value)}
                    placeholder="Paste target job description to match skills..."
                    className="w-full flex-1 text-xs outline-none focus-visible:ring-1 focus-visible:ring-[#c27838] rounded-lg resize-none bg-transparent text-[#141c15] dark:text-white placeholder:text-slate-400"
                  />
                  
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-white/10 text-[10px] text-slate-500 dark:text-slate-400 font-bold flex-wrap gap-1">
                    <span>Quick Roles:</span>
                    <div className="flex gap-1">
                      <button 
                        type="button" 
                        onClick={() => setJd(sampleRoleTemplates.staffBackend)}
                        className="px-1.5 py-0.5 rounded bg-white dark:bg-white/10 text-[#141c15] dark:text-white hover:text-[#c27838] text-[9px] border border-black/5 hover:border-[#c27838] cursor-pointer transition-colors"
                      >
                        Backend
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setJd(sampleRoleTemplates.fullstackLead)}
                        className="px-1.5 py-0.5 rounded bg-white dark:bg-white/10 text-[#141c15] dark:text-white hover:text-[#c27838] text-[9px] border border-black/5 hover:border-[#c27838] cursor-pointer transition-colors"
                      >
                        Lead
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setJd(sampleRoleTemplates.srePlatform)}
                        className="px-1.5 py-0.5 rounded bg-white dark:bg-white/10 text-[#141c15] dark:text-white hover:text-[#c27838] text-[9px] border border-black/5 hover:border-[#c27838] cursor-pointer transition-colors"
                      >
                        DevOps
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setJd(sampleRoleTemplates.aiMlEngineer)}
                        className="px-1.5 py-0.5 rounded bg-white dark:bg-white/10 text-[#141c15] dark:text-white hover:text-[#c27838] text-[9px] border border-black/5 hover:border-[#c27838] cursor-pointer transition-colors"
                      >
                        AI/ML
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Button Row */}
              <div className="flex items-center justify-between gap-3 pt-2 flex-wrap">
                <button
                  onClick={handleAnalysis}
                  disabled={analyzing}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2.5 bg-[#141c15] hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-[#141c15] px-8 py-3.5 rounded-full text-xs font-black tracking-wide uppercase shadow-lg transition-all duration-200 tactile-button disabled:opacity-75 cursor-pointer"
                >
                  <span>{analyzing ? 'Analyzing Resume...' : 'Analyze Resume'}</span>
                  <div className="h-5 w-5 rounded-full bg-white/20 dark:bg-black/10 flex items-center justify-center">
                    {analyzing ? <Sparkles size={11} className="animate-spin" /> : <Zap size={11} className="fill-current" />}
                  </div>
                </button>

                <div className="flex items-center gap-2">
                  {!file && (
                    <Link004
                      onClick={handleUseSampleResume}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
                    >
                      <RefreshCw size={11} className="text-[#c27838]" />
                      <span>Use Demo Sample</span>
                    </Link004>
                  )}

                  {result && (
                    <Link001
                      onClick={handleDownloadExcel}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
                    >
                      <Download size={12} />
                      <span>Export XLS</span>
                    </Link001>
                  )}
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="p-3.5 rounded-2xl bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 border border-red-200 dark:border-red-900/40 text-xs font-bold flex items-center gap-2">
                  <AlertTriangle size={14} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

            </SpotlightCard>

          </div>

          {/* Right Column: Floating Interactive Circular Health Showcase */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            
            {/* Ambient Background Aura */}
            <div className="absolute inset-0 bg-[#c27838]/10 dark:bg-[#c27838]/20 rounded-full filter blur-3xl pointer-events-none"></div>

            {/* Circular Showcase Container with Spotlight */}
            <SpotlightCard className="relative bg-white/95 dark:bg-[#121a13]/95 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-[36px] p-8 shadow-2xl w-full max-w-md flex flex-col items-center text-center">
              
              {/* Concentric Progress Gauge */}
              <div className="relative w-48 h-48 flex items-center justify-center my-3">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-slate-200 dark:text-white/10" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="42" 
                    fill="none" 
                    stroke="#c27838" 
                    strokeWidth="6" 
                    strokeDasharray="264" 
                    strokeDashoffset={264 - (264 * overall) / 100}
                    strokeLinecap="round" 
                    className="transition-all duration-1000 ease-out" 
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-[#141c15] dark:text-white tracking-tight">{overall}%</span>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-0.5">
                    {result ? 'Verified Match' : 'Ready Score'}
                  </span>
                </div>

                {/* Score Boost Notification */}
                <AnimatePresence>
                  {scoreBoost > 0 && (
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
                      +{scoreBoost} Pts Boosted!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Title & Stats */}
              <h3 className="text-lg font-black text-[#141c15] dark:text-white mt-1">
                {candidateSeniority} Rating
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium max-w-xs mt-1">
                Calibrated across 15,000+ tech job specs. Percentile standing: Top {100 - percentileRank}%.
              </p>

              {/* Tag Cluster */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-5">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#e6efe5] dark:bg-white/10 text-[#141c15] dark:text-white border border-[#d3e3d1] dark:border-white/10 shadow-sm">
                  ✦ FAANG Calibrated
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#e6efe5] dark:bg-white/10 text-[#141c15] dark:text-white border border-[#d3e3d1] dark:border-white/10 shadow-sm">
                  Semantic Diffing
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#e6efe5] dark:bg-white/10 text-[#141c15] dark:text-white border border-[#d3e3d1] dark:border-white/10 shadow-sm">
                  Zero Latency NLP
                </span>
              </div>

              {/* Live Pipeline Status */}
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10 w-full flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                <span className="text-[11px] text-slate-500 font-semibold">Live Engine Status</span>
                <span className="inline-flex items-center gap-1.5 text-[#c27838] dark:text-[#d68d4d]">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                  Active & Calibrated
                </span>
              </div>

            </SpotlightCard>

          </div>

        </div>

        {/* Downward Scroll Cue */}
        <div className="flex justify-center pt-8">
          <button 
            onClick={() => {
              const el = document.getElementById('pillar-cards-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="h-10 w-10 rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-[#141c15] flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white hover:scale-110 transition-all shadow-md cursor-pointer"
            title="Scroll to Analytics Deck"
          >
            <ChevronDown size={16} />
          </button>
        </div>

      </section>


      {/* =========================================================
          SECTION 2: 3-PILLAR FEATURE & BENCHMARK DECK
          ========================================================= */}
      <section id="pillar-cards-section" className="space-y-6 pt-6">
        
        {/* Header & Controls */}
        <div className="flex items-end justify-between flex-wrap gap-4 border-b border-black/10 dark:border-white/10 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#141c15] dark:text-white tracking-tight">
              Discovering the Depth of Your Career Analytics
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
              Multi-dimensional evaluation across parsing, market compensation, and competency vectors.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Social Proof Avatars */}
            <div className="hidden sm:flex items-center gap-2 bg-white dark:bg-[#141c15] border border-black/10 dark:border-white/10 rounded-full px-3.5 py-1.5 shadow-sm">
              <div className="flex -space-x-1.5">
                <div className="h-5 w-5 rounded-full bg-slate-800 text-white text-[8px] font-bold flex items-center justify-center border border-white">S</div>
                <div className="h-5 w-5 rounded-full bg-emerald-700 text-white text-[8px] font-bold flex items-center justify-center border border-white">A</div>
                <div className="h-5 w-5 rounded-full bg-amber-700 text-white text-[8px] font-bold flex items-center justify-center border border-white">M</div>
              </div>
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">50,000+ candidates</span>
              <span className="text-[11px] font-bold text-[#c27838] flex items-center gap-0.5">4.9 <Star size={10} className="fill-current" /></span>
            </div>

            {/* Carousel Controls */}
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setCarouselIndex(prev => (prev === 0 ? 2 : prev - 1))}
                className="h-8 w-8 rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-[#141c15] flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>
              <button 
                onClick={() => setCarouselIndex(prev => (prev === 2 ? 0 : prev + 1))}
                className="h-8 w-8 rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-[#141c15] flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* 3 Pillar Cards with Spotlight Effect */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 01: ATS Scoring Engine */}
          <SpotlightCard className={`bg-white/95 dark:bg-[#121a13]/95 backdrop-blur-xl border ${carouselIndex === 0 ? 'border-[#c27838] ring-2 ring-[#c27838]/30 shadow-lg' : 'border-black/10 dark:border-white/10 shadow-sm'} rounded-[28px] p-6 hover:-translate-y-1.5 transition-all duration-200 flex flex-col justify-between h-[300px]`}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full bg-[#141c15] text-white dark:bg-white dark:text-[#141c15] text-[10px] font-black tracking-wider">
                  01
                </span>
                <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                  {scoreData.breakdown ? `${scoreData.breakdown.skills || 88}% Verified` : 'High Compliance'}
                </span>
              </div>
              <h3 className="text-lg font-black text-[#141c15] dark:text-white">
                ATS Scoring Engine
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1 leading-relaxed">
                Buffer-level PDF and DOCX parsing verifies layout compliance and semantic terminology matching.
              </p>
            </div>

            <div className="grid grid-cols-4 gap-1 pt-4 border-t border-slate-200/60 dark:border-white/10">
              <div className="text-center">
                <span className="text-[8px] uppercase font-bold text-slate-500 dark:text-slate-400">Skills</span>
                <p className="text-sm font-black text-[#141c15] dark:text-white">{scoreData.breakdown?.skills || 88}%</p>
              </div>
              <div className="text-center">
                <span className="text-[8px] uppercase font-bold text-slate-500 dark:text-slate-400">Exp</span>
                <p className="text-sm font-black text-[#141c15] dark:text-white">{scoreData.breakdown?.experience || 82}%</p>
              </div>
              <div className="text-center">
                <span className="text-[8px] uppercase font-bold text-slate-500 dark:text-slate-400">Projects</span>
                <p className="text-sm font-black text-[#141c15] dark:text-white">{scoreData.breakdown?.projects || 90}%</p>
              </div>
              <div className="text-center">
                <span className="text-[8px] uppercase font-bold text-slate-500 dark:text-slate-400">Format</span>
                <p className="text-sm font-black text-[#141c15] dark:text-white">{scoreData.breakdown?.formatting || 95}%</p>
              </div>
            </div>
          </SpotlightCard>

          {/* Card 02: Multi-Axis Competency Radar */}
          <SpotlightCard className={`bg-white/95 dark:bg-[#121a13]/95 backdrop-blur-xl border ${carouselIndex === 1 ? 'border-[#c27838] ring-2 ring-[#c27838]/30 shadow-lg' : 'border-black/10 dark:border-white/10 shadow-sm'} rounded-[28px] p-6 hover:-translate-y-1.5 transition-all duration-200 flex flex-col justify-between h-[300px]`}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full bg-[#141c15] text-white dark:bg-white dark:text-[#141c15] text-[10px] font-black tracking-wider">
                  02
                </span>
                <span className="text-[11px] font-bold text-[#c27838] dark:text-[#d68d4d] bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full">
                  Multi-Vector
                </span>
              </div>
              <h3 className="text-lg font-black text-[#141c15] dark:text-white">
                Competency Matrix
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1 leading-relaxed">
                Instant radar mapping across System Design, Architecture, Frontend, Backend, and Leadership.
              </p>
            </div>

            <div className="h-32 w-full -my-1">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke={darkMode ? 'rgba(255,255,255,0.15)' : '#cbd5e1'} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: darkMode ? '#cbd5e1' : '#475569', fontSize: 9, fontWeight: 700 }} />
                  <Radar dataKey="A" stroke="#c27838" strokeWidth={2} fill="#c27838" fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </SpotlightCard>

          {/* Card 03: Market & Salary Intel */}
          <SpotlightCard className={`bg-white/95 dark:bg-[#121a13]/95 backdrop-blur-xl border ${carouselIndex === 2 ? 'border-[#c27838] ring-2 ring-[#c27838]/30 shadow-lg' : 'border-black/10 dark:border-white/10 shadow-sm'} rounded-[28px] p-6 hover:-translate-y-1.5 transition-all duration-200 flex flex-col justify-between h-[300px]`}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full bg-[#141c15] text-white dark:bg-white dark:text-[#141c15] text-[10px] font-black tracking-wider">
                  03
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                  {mkt.salaryPrediction?.confidence || 'High'} Conf.
                </span>
              </div>
              <h3 className="text-lg font-black text-[#141c15] dark:text-white">
                Market & Salary Intel
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1 leading-relaxed">
                Projected compensation band based on extracted seniority, tech ontology, and market indices.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#f6f8f5] dark:bg-white/5 border border-black/5 dark:border-white/5">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-[#141c15] dark:text-white">
                  {mkt.salaryPrediction?.median || '$185,000'}
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Median Base</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-300 font-semibold mt-1.5">
                <span>Min: {mkt.salaryPrediction?.min || '$160k'}</span>
                <span>Max: {mkt.salaryPrediction?.max || '$220k'}</span>
              </div>
            </div>
          </SpotlightCard>

        </div>

      </section>


      {/* =========================================================
          SECTION 3: EXECUTIVE DARK ARCHITECTURAL SHOWCASE
          ========================================================= */}
      <section id="analysis-results-stage" className="relative architectural-dark p-8 sm:p-12 lg:p-14 overflow-hidden">
        
        {/* Subtle decorative mesh overlay */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c27838]/15 rounded-full filter blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left: Floating Pure White High-Contrast Verified Card */}
          <div className="lg:col-span-5 bg-white text-[#141c15] rounded-[28px] p-6 shadow-2xl space-y-4 border border-slate-100">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Check size={12} />
                </div>
                <span className="text-xs font-black uppercase tracking-wide text-slate-800">Analysis Verified!</span>
              </div>
              <span className="text-[10px] font-extrabold uppercase bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">
                {percentileRank}th Percentile
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>Candidate</span>
                <span className="font-bold text-slate-900">{candidateName}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>Overall ATS Match</span>
                <span className="font-black text-emerald-700">{overall}% Match</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>Seniority Caliber</span>
                <span className="font-bold text-[#c27838]">{candidateSeniority}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>Skills Detected</span>
                <span className="font-bold text-slate-900">{(extracted.skills || []).length || 18} Verified</span>
              </div>
            </div>

            {/* Calendar / Sync Buttons Row */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Schedule Preparation</span>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => setShowInterview(true)} className="py-2 px-2 rounded-xl border border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1 cursor-pointer">
                  <Calendar size={11} className="text-blue-600" /> Apple
                </button>
                <button onClick={() => setShowInterview(true)} className="py-2 px-2 rounded-xl border border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1 cursor-pointer">
                  <Calendar size={11} className="text-red-500" /> Google
                </button>
                <button onClick={() => setShowInterview(true)} className="py-2 px-2 rounded-xl border border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1 cursor-pointer">
                  <Calendar size={11} className="text-sky-600" /> Outlook
                </button>
              </div>
            </div>

            <Link001
              onClick={() => {
                const el = document.getElementById('accordion-diagnostics-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full py-3 rounded-full bg-[#141c15] text-white text-xs font-black hover:bg-black transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>View Full Diagnosis</span>
            </Link001>

          </div>

          {/* Right: Architectural Statement & Community Badge */}
          <div className="lg:col-span-7 space-y-6 lg:pl-6">
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Command High-Comp <br />
              <span className="text-[#d68d4d]">Interviews With Total</span> Authority!
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-xl">
              Expand your technical presence, neutralize resume friction vectors, and construct an application trajectory that positions you at the high-end of compensation bands.
            </p>

            {/* Community Avatar Pill */}
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/15 rounded-full px-4 py-2">
              <div className="flex -space-x-2">
                <div className="h-6 w-6 rounded-full bg-[#c27838] flex items-center justify-center text-white text-[9px] font-bold border border-white/20">JS</div>
                <div className="h-6 w-6 rounded-full bg-slate-700 flex items-center justify-center text-white text-[9px] font-bold border border-white/20">RK</div>
                <div className="h-6 w-6 rounded-full bg-emerald-700 flex items-center justify-center text-white text-[9px] font-bold border border-white/20">AL</div>
              </div>
              <span className="text-xs font-bold text-white">Join verified peer talent network</span>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-[9px] font-black text-white">+5.2k</span>
            </div>

            {/* Step Track & CTA */}
            <div className="space-y-4 pt-4 border-t border-white/15">
              <div className="flex items-center gap-3">
                <span className="text-sm font-black text-white">01</span>
                <div className="h-1 flex-1 bg-white/20 rounded-full relative overflow-hidden">
                  <div className="h-full bg-[#d68d4d] w-2/3 rounded-full"></div>
                </div>
                <span className="text-xs font-bold text-slate-300">Optimization Roadmap</span>
              </div>

              <Link005
                onClick={handleAnalysis}
                className="inline-flex items-center gap-3 bg-white text-[#141c15] px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-wider hover:bg-slate-100 transition-all tactile-button shadow-xl cursor-pointer"
              >
                <span>Optimize Your Application Strategy</span>
              </Link005>
            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          SECTION 4: SKILL GAP & LINGUISTIC DIAGNOSTIC ACCORDION
          ========================================================= */}
      <section id="accordion-diagnostics-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">
        
        {/* Left: Narrative & Floating Quick Repair Card */}
        <div className="lg:col-span-5 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-[#141c15] dark:text-white tracking-tight leading-tight">
            Eliminating blind spots so you can interview with total confidence.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            Our dual-engine diagnostic inspects semantic keyword density, identifies hard technical skill deficits, and replaces passive phrasing with commanding action verbs.
          </p>

          {/* Floating Thumbnail Preview Card */}
          <div className="bg-white/95 dark:bg-[#121a13]/95 border border-black/10 dark:border-white/10 rounded-[28px] p-6 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-[#e6efe5] dark:bg-white/10 text-[#141c15] dark:text-white flex items-center justify-center font-bold">
                  <Wrench size={13} />
                </div>
                <span className="text-xs font-extrabold text-[#141c15] dark:text-white">Live Quick Fix Engine</span>
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#141c15] text-white dark:bg-white dark:text-[#141c15]">
                Active
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              Patch your resume bullet points and instantly recalibrate your score without regenerating the full document.
            </p>
            <Link001
              onClick={() => { setActiveAccordion(0); setRepairMode(true); }}
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#c27838] dark:text-[#d68d4d] cursor-pointer"
            >
              <span>Launch Live Repair Mode</span>
            </Link001>
          </div>
        </div>

        {/* Right: 4-Row Expandable Accordion */}
        <div className="lg:col-span-7 space-y-3.5">
          
          {/* Row 01: Missing Critical Skills & Urgent Fixes */}
          <div className="bg-white/95 dark:bg-[#121a13]/95 border border-black/10 dark:border-white/10 rounded-[24px] overflow-hidden shadow-sm transition-all">
            <button
              onClick={() => setActiveAccordion(activeAccordion === 0 ? -1 : 0)}
              className="w-full px-6 py-4 flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-[#c27838]">01</span>
                <span className="text-xs sm:text-sm font-extrabold text-[#141c15] dark:text-white">
                  Missing Critical Skills & Urgent Fixes
                </span>
              </div>
              <div className="h-6 w-6 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-slate-400">
                <ChevronDown size={14} className={`transform transition-transform ${activeAccordion === 0 ? 'rotate-180' : ''}`} />
              </div>
            </button>

            <AnimatePresence>
              {activeAccordion === 0 && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-6 pb-6 pt-1 space-y-3 border-t border-slate-100 dark:border-white/5">
                  <div className="flex flex-wrap gap-2">
                    {missingSkillsList.map((skill, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-900/40">
                        <AlertTriangle size={12} />
                        <span>{skill}</span>
                        <span className="text-[9px] uppercase px-1.5 rounded-full bg-red-200 dark:bg-red-900/60 font-black">Urgent</span>
                      </span>
                    ))}
                  </div>

                  {/* Inline Repair Box */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Live Patch Text Injection</span>
                      <Link000 onClick={() => setRepairMode(!repairMode)} className="text-[10px] font-bold text-[#c27838] cursor-pointer">
                        {repairMode ? 'Close Box' : 'Open Editor'}
                      </Link000>
                    </div>
                    {repairMode && (
                      <div className="space-y-2">
                        <textarea
                          value={repairText}
                          onChange={(e) => setRepairText(e.target.value)}
                          placeholder="Paste improved experience bullet points incorporating missing skills..."
                          className="w-full h-24 p-3 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-[#f9faf9] dark:bg-white/5 outline-none focus-visible:ring-1 focus-visible:ring-[#c27838] resize-none text-[#141c15] dark:text-white"
                        />
                        <button
                          onClick={runQuickFix}
                          disabled={repairing || !repairText.trim()}
                          className="px-5 py-2 rounded-full bg-[#141c15] dark:bg-white text-white dark:text-[#141c15] text-[10px] font-black uppercase disabled:opacity-50 cursor-pointer shadow-md"
                        >
                          {repairing ? 'Patching...' : 'Apply Live Patch'}
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Row 02: Action Verb NLP & Linguistic Diagnostics */}
          <div className="bg-white/95 dark:bg-[#121a13]/95 border border-black/10 dark:border-white/10 rounded-[24px] overflow-hidden shadow-sm transition-all">
            <button
              onClick={() => setActiveAccordion(activeAccordion === 1 ? -1 : 1)}
              className="w-full px-6 py-4 flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-[#c27838]">02</span>
                <span className="text-xs sm:text-sm font-extrabold text-[#141c15] dark:text-white">
                  Action Verb NLP & Linguistic Diagnostics
                </span>
              </div>
              <div className="h-6 w-6 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-slate-400">
                <ChevronDown size={14} className={`transform transition-transform ${activeAccordion === 1 ? 'rotate-180' : ''}`} />
              </div>
            </button>

            <AnimatePresence>
              {activeAccordion === 1 && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-6 pb-6 pt-1 space-y-3 border-t border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-[#e6efe5] dark:bg-white/10 text-[#141c15] dark:text-white flex items-center justify-center text-base font-black">
                      {verbData.overallGrade || 'A'}
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-[#141c15] dark:text-white">
                        Verb Impact Score: {verbData.verbScore || 88}/100
                      </p>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">
                        {strongVerbCount} high-impact active verbs • {weakVerbCount} passive phrases detected.
                      </p>
                    </div>
                  </div>

                  <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={verbBarData} margin={{ top: 5, right: 5, bottom: 5, left: -25 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? 'rgba(255,255,255,0.08)' : '#f1f5f9'} vertical={false} />
                        <XAxis dataKey="name" tick={{ fill: darkMode ? '#cbd5e1' : '#475569', fontSize: 9, fontWeight: 700 }} />
                        <YAxis tick={{ fill: darkMode ? '#cbd5e1' : '#475569', fontSize: 9 }} />
                        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                          {verbBarData.map((entry, index) => (<Cell key={index} fill={entry.fill} />))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Row 03: Tailored Mock Interview Prompts */}
          <div className="bg-white/95 dark:bg-[#121a13]/95 border border-black/10 dark:border-white/10 rounded-[24px] overflow-hidden shadow-sm transition-all">
            <button
              onClick={() => setActiveAccordion(activeAccordion === 2 ? -1 : 2)}
              className="w-full px-6 py-4 flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-[#c27838]">03</span>
                <span className="text-xs sm:text-sm font-extrabold text-[#141c15] dark:text-white">
                  Tailored Mock Interview Prompts
                </span>
              </div>
              <div className="h-6 w-6 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-slate-400">
                <ChevronDown size={14} className={`transform transition-transform ${activeAccordion === 2 ? 'rotate-180' : ''}`} />
              </div>
            </button>

            <AnimatePresence>
              {activeAccordion === 2 && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-6 pb-6 pt-1 space-y-2.5 border-t border-slate-100 dark:border-white/5">
                  {(mkt.interviewQuestions && mkt.interviewQuestions.length > 0) ? (
                    mkt.interviewQuestions.slice(0, 2).map((q, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-[#f9faf9] dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
                        <span className="text-[8px] font-extrabold uppercase text-[#c27838] block mb-0.5">{q.type} Question</span>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{q.q}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-[#f9faf9] dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
                      <span className="text-[8px] font-extrabold uppercase text-[#c27838] block mb-0.5">System Design Question</span>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        How would you design a distributed cache invalidation strategy for multi-region microservices?
                      </p>
                    </div>
                  )}
                  <Link001 onClick={() => setShowInterview(true)} className="text-xs font-bold text-[#c27838] dark:text-[#d68d4d] cursor-pointer">
                    View all interview questions
                  </Link001>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Row 04: AI Cover Letter & LinkedIn Sync */}
          <div className="bg-white/95 dark:bg-[#121a13]/95 border border-black/10 dark:border-white/10 rounded-[24px] overflow-hidden shadow-sm transition-all">
            <button
              onClick={() => setActiveAccordion(activeAccordion === 3 ? -1 : 3)}
              className="w-full px-6 py-4 flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-[#c27838]">04</span>
                <span className="text-xs sm:text-sm font-extrabold text-[#141c15] dark:text-white">
                  AI Cover Letter & LinkedIn Profile Sync
                </span>
              </div>
              <div className="h-6 w-6 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-slate-400">
                <ChevronDown size={14} className={`transform transition-transform ${activeAccordion === 3 ? 'rotate-180' : ''}`} />
              </div>
            </button>

            <AnimatePresence>
              {activeAccordion === 3 && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-6 pb-6 pt-1 space-y-3 border-t border-slate-100 dark:border-white/5">
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    Generate an executive cover letter matched to this exact JD or synchronize your verified skills to LinkedIn.
                  </p>
                  <div className="flex items-center gap-3">
                    <button onClick={generateCoverLetter} className="px-5 py-2 rounded-full bg-[#141c15] dark:bg-white text-white dark:text-[#141c15] text-xs font-bold cursor-pointer shadow-sm">
                      Generate Cover Letter
                    </button>
                    <button onClick={handleLinkedInSync} disabled={linkedinSyncing} className="px-5 py-2 rounded-full border border-slate-300 dark:border-white/15 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 cursor-pointer">
                      {linkedinSyncing ? 'Syncing...' : 'Sync LinkedIn'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </section>


      {/* =========================================================
          SECTION 5: ✦ CAREER INTELLIGENCE MATRIX (PASTEL)
          ========================================================= */}
      <section className="pastel-sage p-8 sm:p-12 space-y-6">
        
        {/* Header with Sparkle and Connect Pill */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-[#c27838]" />
            <h2 className="text-xl sm:text-2xl font-black text-[#141c15] dark:text-white tracking-tight">
              ✦ Career Intelligence Matrix
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleExportPDF} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-white/10 text-[#141c15] dark:text-white text-xs font-bold border border-black/10 dark:border-white/10 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
              <Share2 size={12} />
              <span>Share Matrix</span>
            </button>
            <Link001 to="/analytics" className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#141c15] text-white dark:bg-white dark:text-[#141c15] text-xs font-bold shadow-sm cursor-pointer">
              <span>Deep Trends</span>
            </Link001>
          </div>
        </div>

        {/* Asymmetric Matrix Showcase Cards with Spotlight */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Version History & Deltas */}
          <SpotlightCard className="bg-white/95 dark:bg-[#121a13]/95 border border-black/10 dark:border-white/10 rounded-[28px] p-6 shadow-sm space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Score Trajectory</span>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-3xl font-black text-[#141c15] dark:text-white">{overall}%</span>
                <p className="text-[10px] text-slate-500 font-bold">Current Analysis v1.2</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 text-xs font-black">
                +14 Pts
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium pt-3 border-t border-slate-100 dark:border-white/5">
              Verified improvements across system design and active linguistic verbs.
            </p>
          </SpotlightCard>

          {/* Card 2: Career Points & Seniority */}
          <SpotlightCard className="bg-white/95 dark:bg-[#121a13]/95 border border-black/10 dark:border-white/10 rounded-[28px] p-6 shadow-sm space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Career Points</span>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-3xl font-black text-[#141c15] dark:text-white">{points || 240}</span>
                <p className="text-[10px] text-slate-500 font-bold">{tier} Tier Member</p>
              </div>
              <Award size={28} className="text-[#c27838]" />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium pt-3 border-t border-slate-100 dark:border-white/5">
              Earn career points with every analysis, patch fix, and interview preparation drill.
            </p>
          </SpotlightCard>

          {/* Card 3: Market Compensation Band */}
          <SpotlightCard className="bg-white/95 dark:bg-[#121a13]/95 border border-black/10 dark:border-white/10 rounded-[28px] p-6 shadow-sm space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Target Role Outlook</span>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-3xl font-black text-[#141c15] dark:text-white">{mkt.salaryPrediction?.median || '$185k'}</span>
                <p className="text-[10px] text-slate-500 font-bold">{mkt.salaryPrediction?.dominantSkillArea || 'Software Architecture'}</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-[9px] font-extrabold uppercase text-slate-700 dark:text-slate-200">
                FAANG Tier
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium pt-3 border-t border-slate-100 dark:border-white/5">
              Target salary band: {mkt.salaryPrediction?.min || '$160k'} – {mkt.salaryPrediction?.max || '$220k'}.
            </p>
          </SpotlightCard>

        </div>

        {/* Bottom Outline Pill Button */}
        <div className="flex justify-center pt-2">
          <Link005
            to="/analytics"
            className="px-8 py-3 rounded-full border-2 border-[#141c15] dark:border-white text-[#141c15] dark:text-white text-xs font-black uppercase tracking-wider hover:bg-[#141c15] hover:text-white dark:hover:bg-white dark:hover:text-[#141c15] transition-all cursor-pointer shadow-sm"
          >
            Explore Complete Career Analytics
          </Link005>
        </div>

      </section>


      {/* =========================================================
          SECTION 6: CLOSING STATEMENT & MINIMALIST FOOTER
          ========================================================= */}
      <section className="text-center py-14 space-y-6">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#141c15] dark:text-white tracking-tight max-w-2xl mx-auto leading-tight">
          Take command of your career trajectory today and make your FAANG-tier ambitions a reality!
        </h2>
        
        <div className="flex justify-center">
          <Link005
            onClick={scrollToHero}
            className="inline-flex items-center gap-3 bg-[#141c15] hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-[#141c15] px-9 py-4 rounded-full text-xs font-black tracking-wider uppercase shadow-2xl transition-all tactile-button cursor-pointer"
          >
            <span>Get Started Now</span>
          </Link005>
        </div>
      </section>

      {/* Clean Single-Line Footer with Skiper Interactive Links */}
      <footer className="border-t border-black/10 dark:border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium gap-3">
        <span>© 2026 AI Resume Analyzer PRO</span>
        <div className="flex items-center gap-6">
          <Link001 to="/help" className="hover:text-black dark:hover:text-white transition-colors">Privacy Policy</Link001>
          <Link001 to="/help" className="hover:text-black dark:hover:text-white transition-colors">Certifications</Link001>
          <Link001 to="/help" className="hover:text-black dark:hover:text-white transition-colors">Documentation</Link001>
        </div>
        <div className="flex items-center gap-3">
          <Link000 href="https://x.com" className="h-7 w-7 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-black/10 cursor-pointer font-bold">𝕏</Link000>
          <Link000 href="https://linkedin.com" className="h-7 w-7 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-black/10 cursor-pointer font-bold">in</Link000>
          <Link000 href="https://github.com" className="h-7 w-7 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-black/10 cursor-pointer font-bold">✦</Link000>
        </div>
      </footer>


      {/* =========================================================
          MODALS & TEMPLATES (PRESERVED)
          ========================================================= */}

      {/* Cover Letter Modal */}
      {showCoverLetter && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-[#141c15] border border-black/10 dark:border-white/10 rounded-[28px] p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl relative text-[#141c15] dark:text-white">
            <button onClick={() => setShowCoverLetter(false)} className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 hover:text-black dark:hover:text-white cursor-pointer"><X size={15} /></button>
            <h2 className="text-base font-extrabold mb-4 flex items-center gap-2"><FileText className="text-[#c27838]" /> AI Tailored Cover Letter</h2>
            <div className="prose prose-sm font-medium whitespace-pre-wrap leading-relaxed p-4 rounded-2xl bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-white/5 text-xs">
              {coverLetterText || "Generating tailored cover letter..."}
            </div>
          </motion.div>
        </div>
      )}

      {/* Interview Modal */}
      {showInterview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-[#141c15] border border-black/10 dark:border-white/10 rounded-[28px] p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto shadow-2xl relative text-[#141c15] dark:text-white">
            <button onClick={() => setShowInterview(false)} className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 hover:text-black dark:hover:text-white cursor-pointer"><X size={15} /></button>
            <h2 className="text-base font-extrabold mb-1 flex items-center gap-2"><MessageSquare className="text-[#c27838]" /> Targeted Mock Interview Questions</h2>
            <p className="text-xs text-slate-400 font-medium mb-4">Curated based on identified resume skill gaps and target JD requirements:</p>
            <div className="space-y-3">
              {(mkt.interviewQuestions || []).map((q, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                  <span className="text-[8px] font-extrabold text-[#c27838] uppercase tracking-wider mb-1 block">{q.type} Question</span>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-normal">{q.q}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Verb Analysis Modal */}
      {showVerbAnalysis && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-[#141c15] border border-black/10 dark:border-white/10 rounded-[28px] p-6 max-w-4xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative text-[#141c15] dark:text-white">
            <button onClick={() => setShowVerbAnalysis(false)} className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 hover:text-black dark:hover:text-white cursor-pointer"><X size={15} /></button>
            <h2 className="text-base font-extrabold mb-1 flex items-center gap-2"><Eye className="text-[#c27838]" /> Action Verb Annotations</h2>
            <p className="text-xs text-slate-400 font-medium mb-4">{verbData.recommendation || 'Replace passive verbs with high-impact power alternatives.'}</p>
            <div className="space-y-2.5">
              {(verbData.annotations || []).map((ann, i) => (
                <div key={i} className={`p-3.5 rounded-2xl border-l-4 ${ann.type === 'strong' ? 'border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20' : ann.type === 'weak' ? 'border-l-[#c27838] bg-amber-50/50 dark:bg-amber-950/20' : 'border-l-slate-400 bg-slate-50 dark:bg-white/5'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white dark:bg-white/10 border border-black/5 dark:border-white/10 text-slate-700 dark:text-slate-200">{ann.type}</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-white">"{ann.verb}"</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{ann.text}</p>
                  {ann.suggestion && <p className="text-[10px] text-[#c27838] dark:text-[#d68d4d] mt-1 font-bold">💡 Recommended: {ann.suggestion}</p>}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* LinkedIn Sync Modal */}
      {showLinkedIn && linkedinData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-[#141c15] border border-black/10 dark:border-white/10 rounded-[28px] p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto shadow-2xl relative text-[#141c15] dark:text-white">
            <button onClick={() => setShowLinkedIn(false)} className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 hover:text-black dark:hover:text-white cursor-pointer"><X size={15} /></button>
            <h2 className="text-base font-extrabold mb-4 flex items-center gap-2"><ExternalLink className="text-[#c27838]" /> LinkedIn Profile Synchronized</h2>
            <div className="p-4 rounded-2xl mb-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
              <h3 className="text-sm font-extrabold text-[#141c15] dark:text-white">{linkedinData.profile?.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{linkedinData.profile?.headline}</p>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {(linkedinData.skills || []).map((skill, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#e6efe5] dark:bg-white/10 text-[#141c15] dark:text-white">{skill}</span>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Hidden PDF Export Content */}
      <div id="pdf-export-content" style={{ display: 'none', fontFamily: 'Arial, sans-serif', color: '#141c15', padding: '40px', maxWidth: '800px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '3px solid #141c15', paddingBottom: '20px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#141c15', margin: '0 0 5px' }}>Resume Analysis Report</h1>
          <p style={{ fontSize: '14px', color: '#64748b' }}>Generated by AI Resume Analyzer PRO</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', gap: '20px' }}>
          <div style={{ flex: 1, background: '#f6f8f5', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>OVERALL ATS SCORE</p>
            <p style={{ fontSize: '36px', fontWeight: '800', color: '#141c15', margin: '5px 0' }}>{overall}%</p>
          </div>
          <div style={{ flex: 1, background: '#f6f8f5', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>ATS BENCHMARK</p>
            <p style={{ fontSize: '36px', fontWeight: '800', color: '#141c15', margin: '5px 0' }}>{atsScore}%</p>
          </div>
          <div style={{ flex: 1, background: '#f6f8f5', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>CALIBER TIER</p>
            <p style={{ fontSize: '20px', fontWeight: '800', color: '#c27838', margin: '5px 0' }}>{candidateSeniority}</p>
          </div>
        </div>
        <h2 style={{ fontSize: '18px', fontWeight: '700', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '15px' }}>Candidate: {candidateName}</h2>
        <h2 style={{ fontSize: '18px', fontWeight: '700', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', margin: '20px 0 15px' }}>Skills Detected ({(extracted.skills || []).length})</h2>
        <p style={{ fontSize: '13px', lineHeight: '1.8' }}>{(extracted.skills || []).join(' • ')}</p>
        <h2 style={{ fontSize: '18px', fontWeight: '700', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', margin: '20px 0 15px' }}>Missing Critical Skills</h2>
        <ul style={{ fontSize: '13px', paddingLeft: '20px' }}>{missingSkillsList.map((s, i) => <li key={i} style={{ marginBottom: '5px', color: '#c27838' }}>{s}</li>)}</ul>
        <h2 style={{ fontSize: '18px', fontWeight: '700', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', margin: '20px 0 15px' }}>Salary Outlook</h2>
        <p style={{ fontSize: '13px' }}>Median: {mkt.salaryPrediction?.median || '$185,000'} | Range: {mkt.salaryPrediction?.min || '$160k'} – {mkt.salaryPrediction?.max || '$220k'}</p>
        <div style={{ marginTop: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '11px', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
          <p>AI Resume Analyzer PRO — Elite Career Intelligence Platform</p>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;

import { useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Clock, ArrowUpRight, ArrowDownRight, BarChart3 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAnalysis } from '../context/AnalysisContext';

const History = () => {
  const { darkMode } = useTheme();
  const { history, fetchHistory } = useAnalysis();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const card = 'bg-white/95 dark:bg-[#151d16]/95 backdrop-blur-xl rounded-[28px] shadow-sm border border-black/10 dark:border-white/10';

  // Transform history to chart data
  const chartData = history.map((entry, idx) => ({
    name: `v${idx + 1}.0`,
    score: entry.overallScore || 0,
    ats: entry.atsScore || 0,
    date: new Date(entry.date).toLocaleDateString(),
    skills: entry.skills?.length || 0,
  }));

  // If no real history, show placeholder
  const displayData = chartData.length > 0 ? chartData : [
    { name: 'v1.0', score: 0, ats: 0, date: '-', skills: 0 },
  ];

  const itemVars = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } } };

  return (
    <motion.div initial="hidden" animate="show" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }} className="space-y-6 pb-20 font-geometric">

      {/* Header */}
      <motion.div variants={itemVars}>
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-[10px] font-black uppercase tracking-wider text-[#c27838] mb-2">
          <span>✦ Progression Archive</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#141c15] dark:text-white tracking-tight">Version History</h1>
        <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">Track your resume evolution and score deltas across iterative analyses</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVars} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Analyses', value: history.length, icon: BarChart3 },
          { label: 'Latest Score', value: history.length > 0 ? `${history[history.length - 1].overallScore}%` : '--', icon: TrendingUp },
          { label: 'Best Score', value: history.length > 0 ? `${Math.max(...history.map(h => h.overallScore))}%` : '--', icon: ArrowUpRight },
          { label: 'Score Trend', value: (() => {
            if (history.length < 2) return '--';
            const diff = history[history.length - 1].overallScore - history[history.length - 2].overallScore;
            return diff >= 0 ? `+${diff} Pts` : `${diff} Pts`;
          })(), icon: history.length >= 2 && (history[history.length - 1].overallScore - history[history.length - 2].overallScore) < 0 ? TrendingDown : TrendingUp },
        ].map((stat, i) => (
          <div key={i} className={`${card} p-5`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">{stat.label}</span>
              <div className="h-8 w-8 rounded-full flex items-center justify-center bg-[#f6f8f5] dark:bg-white/10 text-slate-700 dark:text-white shrink-0">
                <stat.icon size={14} className="text-[#c27838]" />
              </div>
            </div>
            <p className="text-2xl font-black text-[#141c15] dark:text-white tracking-tight">{stat.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Main Chart */}
      <motion.div variants={itemVars} className={`${card} p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-[#f6f8f5] dark:bg-white/10 flex items-center justify-center text-slate-700 dark:text-white shrink-0">
              <TrendingUp size={14} className="text-[#c27838]" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#141c15] dark:text-white">Score Progression Curve</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Comparative scores across uploaded iterations</p>
            </div>
          </div>
        </div>
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={displayData} margin={{ top: 10, right: 10, bottom: 5, left: -25 }}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c27838" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#c27838" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="atsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#141c15" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#141c15" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? 'rgba(255,255,255,0.08)' : '#f1f5f9'} vertical={false} />
              <XAxis dataKey="name" stroke="#cbd5e1" tick={{ fill: darkMode ? '#cbd5e1' : '#64748b', fontSize: 10, fontWeight: 700 }} />
              <YAxis stroke="#cbd5e1" tick={{ fill: darkMode ? '#cbd5e1' : '#64748b', fontSize: 10 }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#151d16' : '#ffffff',
                  borderColor: darkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
                  borderRadius: '16px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                  color: darkMode ? '#ffffff' : '#141c15',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}
              />
              <Area type="monotone" dataKey="score" stroke="#c27838" strokeWidth={2.5} fill="url(#scoreGradient)" dot={{ stroke: '#c27838', strokeWidth: 2, r: 4, fill: darkMode ? '#151d16' : '#fff' }} activeDot={{ r: 6, fill: '#c27838' }} name="Overall Score" />
              <Area type="monotone" dataKey="ats" stroke={darkMode ? '#94a3b8' : '#141c15'} strokeWidth={1.5} fill="url(#atsGradient)" dot={{ stroke: darkMode ? '#94a3b8' : '#141c15', strokeWidth: 1.5, r: 3, fill: darkMode ? '#151d16' : '#fff' }} name="ATS Score" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Version Diffs */}
      <motion.div variants={itemVars} className={`${card} p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-[#f6f8f5] dark:bg-white/10 flex items-center justify-center text-slate-700 dark:text-white shrink-0">
              <Clock size={14} className="text-[#c27838]" />
            </div>
            <h3 className="text-sm font-black text-[#141c15] dark:text-white">Version Delta Log</h3>
          </div>
        </div>
        
        {history.length === 0 ? (
          <div className="p-8 rounded-[20px] text-center bg-[#f6f8f5] dark:bg-white/5 border border-black/5 dark:border-white/5">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">No analysis history recorded yet. Run your first analysis from the Dashboard to start tracking evolution!</p>
          </div>
        ) : (
          <div className="divide-y divide-black/5 dark:divide-white/5">
            {history.slice().reverse().map((entry, idx) => {
              const scoreChange = entry.versionComparison?.scoreChange || 0;
              const skillsAdded = entry.versionComparison?.skillsAdded || [];
              const skillsRemoved = entry.versionComparison?.skillsRemoved || [];
              const isPositive = scoreChange >= 0;

              const origIdx = history.length - 1 - idx;
              const hasComparison = origIdx > 0;
              const prevEntry = hasComparison ? history[origIdx - 1] : null;
              const prevScore = prevEntry ? prevEntry.overallScore : null;
              const currScore = entry.overallScore;

              return (
                <motion.div
                  key={entry.id || idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <p className="font-black text-xs text-[#141c15] dark:text-white">
                        Version {history.length - idx}.0
                      </p>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                        {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {skillsAdded.length > 0 && (
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-bold">
                        + Skills: {skillsAdded.slice(0, 5).join(', ')}
                      </p>
                    )}
                    {skillsRemoved.length > 0 && (
                      <p className="text-[10px] text-red-500 dark:text-red-400 mt-0.5 font-bold">
                        - Skills: {skillsRemoved.slice(0, 5).join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center -space-x-2 shrink-0 overflow-visible">
                    {prevScore !== null && (
                      <div
                        title={`Previous Score: ${prevScore}% (v${history.length - idx - 1}.0)`}
                        className="relative z-10 w-9 h-9 rounded-full flex flex-col items-center justify-center text-[9px] font-bold border bg-white dark:bg-[#151d16] text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10"
                      >
                        <span className="text-[6px] opacity-75 font-medium leading-none">v{history.length - idx - 1}</span>
                        <span className="leading-tight">{prevScore}</span>
                      </div>
                    )}
                    <div
                      title={`Current Score: ${currScore}% (v${history.length - idx}.0)`}
                      className="relative z-20 w-10 h-10 rounded-full flex flex-col items-center justify-center text-[10px] font-black border text-white bg-[#141c15] dark:bg-white dark:text-[#141c15] border-white dark:border-black shadow-sm"
                    >
                      <span className="text-[6px] opacity-90 font-medium leading-none">v{history.length - idx}</span>
                      <span className="leading-tight">{currScore}</span>
                    </div>
                    {prevScore !== null && (
                      <div
                        title={`Score change: ${isPositive ? '+' : ''}${scoreChange} pts`}
                        className={`relative z-30 w-9 h-9 rounded-full flex items-center justify-center border text-white ${
                          isPositive ? 'bg-emerald-600 border-white' : 'bg-red-500 border-white'
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center leading-none">
                          {isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                          <span className="text-[8px] font-bold">{isPositive ? '+' : ''}{scoreChange}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default History;

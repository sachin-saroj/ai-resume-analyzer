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

  const card = 'bg-white rounded-2xl shadow-sm border border-slate-100/50';

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
    <motion.div initial="hidden" animate="show" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }} className="space-y-4 pb-16">

      {/* Header */}
      <motion.div variants={itemVars}>
        <h1 className="text-xl font-bold mb-0.5 text-slate-800">Version History</h1>
        <p className="text-xs font-medium text-slate-400">Track your resume evolution across analyses</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVars} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Analyses', value: history.length, icon: BarChart3 },
          { label: 'Latest Score', value: history.length > 0 ? `${history[history.length - 1].overallScore}%` : '--', icon: TrendingUp },
          { label: 'Best Score', value: history.length > 0 ? `${Math.max(...history.map(h => h.overallScore))}%` : '--', icon: ArrowUpRight },
          { label: 'Score Trend', value: (() => {
            if (history.length < 2) return '--';
            const diff = history[history.length - 1].overallScore - history[history.length - 2].overallScore;
            return diff >= 0 ? `+${diff}` : `${diff}`;
          })(), icon: history.length >= 2 && (history[history.length - 1].overallScore - history[history.length - 2].overallScore) < 0 ? TrendingDown : TrendingUp },
        ].map((stat, i) => (
          <div key={i} className={`${card} p-4`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</span>
              <div className="h-7 w-7 rounded-full flex items-center justify-center bg-slate-100 text-slate-600 shrink-0">
                <stat.icon size={13} />
              </div>
            </div>
            <p className="text-xl font-extrabold text-slate-800">{stat.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Main Chart */}
      <motion.div variants={itemVars} className={`${card} p-4`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
              <TrendingUp size={13} className="text-slate-500" />
            </div>
            <h3 className="text-xs font-bold text-slate-800">Score Progression</h3>
          </div>
        </div>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={displayData} margin={{ top: 10, right: 10, bottom: 5, left: -25 }}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#09090b" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#09090b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="atsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" stroke="#cbd5e1" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }} />
              <YAxis stroke="#cbd5e1" tick={{ fill: '#64748b', fontSize: 10 }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  borderColor: '#e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  fontSize: '11px'
                }}
              />
              <Area type="monotone" dataKey="score" stroke="#09090b" strokeWidth={2} fill="url(#scoreGradient)" dot={{ stroke: '#09090b', strokeWidth: 1.5, r: 4, fill: '#fff' }} activeDot={{ r: 6, fill: '#09090b' }} name="Overall Score" />
              <Area type="monotone" dataKey="ats" stroke="#94a3b8" strokeWidth={1.5} fill="url(#atsGradient)" dot={{ stroke: '#94a3b8', strokeWidth: 1.5, r: 3, fill: '#fff' }} name="ATS Score" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Version Diffs */}
      <motion.div variants={itemVars} className={`${card} p-4`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
              <Clock size={13} className="text-slate-500" />
            </div>
            <h3 className="text-xs font-bold text-slate-800">Version Delta Log</h3>
          </div>
        </div>
        
        {history.length === 0 ? (
          <div className="p-6 rounded-xl text-center bg-slate-50 border border-slate-100">
            <p className="text-xs font-medium text-slate-400">No analysis history yet. Run your first analysis to start tracking!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
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
                  className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <p className="font-bold text-xs text-slate-800">
                        Version {history.length - idx}.0
                      </p>
                      <span className="text-[9px] text-slate-400 font-medium">
                        {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {skillsAdded.length > 0 && (
                      <p className="text-[10px] text-emerald-600 mt-1 font-bold">
                        + Skills: {skillsAdded.slice(0, 5).join(', ')}
                      </p>
                    )}
                    {skillsRemoved.length > 0 && (
                      <p className="text-[10px] text-red-500 mt-0.5 font-bold">
                        - Skills: {skillsRemoved.slice(0, 5).join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center -space-x-2 shrink-0 overflow-visible">
                    {prevScore !== null && (
                      <div
                        title={`Previous Score: ${prevScore}% (v${history.length - idx - 1}.0)`}
                        className="relative z-10 w-8 h-8 rounded-full flex flex-col items-center justify-center text-[9px] font-bold border bg-white text-slate-400 border-slate-200"
                      >
                        <span className="text-[6px] opacity-75 font-medium leading-none">v{history.length - idx - 1}</span>
                        <span className="leading-tight">{prevScore}</span>
                      </div>
                    )}
                    <div
                      title={`Current Score: ${currScore}% (v${history.length - idx}.0)`}
                      className="relative z-20 w-9 h-9 rounded-full flex flex-col items-center justify-center text-[10px] font-extrabold border text-white bg-slate-900 border-white"
                    >
                      <span className="text-[6px] opacity-90 font-medium leading-none">v{history.length - idx}</span>
                      <span className="leading-tight">{currScore}</span>
                    </div>
                    {prevScore !== null && (
                      <div
                        title={`Score change: ${isPositive ? '+' : ''}${scoreChange} pts`}
                        className={`relative z-30 w-8 h-8 rounded-full flex items-center justify-center border text-white ${
                          isPositive ? 'bg-emerald-500 border-white' : 'bg-red-500 border-white'
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center leading-none">
                          {isPositive ? <ArrowUpRight size={8} /> : <ArrowDownRight size={8} />}
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

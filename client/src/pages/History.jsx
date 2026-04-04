import { useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
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

  const card = darkMode
    ? 'bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.3)]'
    : 'bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.03)]';

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

  const itemVars = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } } };

  return (
    <motion.div initial="hidden" animate="show" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }} className="space-y-6 pb-16">

      {/* Header */}
      <motion.div variants={itemVars}>
        <h1 className={`text-2xl font-extrabold mb-1 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Version History</h1>
        <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>Track your resume evolution across analyses</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVars} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Analyses', value: history.length, icon: BarChart3, color: 'indigo' },
          { label: 'Latest Score', value: history.length > 0 ? `${history[history.length - 1].overallScore}%` : '--', icon: TrendingUp, color: 'emerald' },
          { label: 'Best Score', value: history.length > 0 ? `${Math.max(...history.map(h => h.overallScore))}%` : '--', icon: ArrowUpRight, color: 'amber' },
          { label: 'Score Trend', value: (() => {
            if (history.length < 2) return '--';
            const diff = history[history.length - 1].overallScore - history[history.length - 2].overallScore;
            return diff >= 0 ? `+${diff}` : `${diff}`;
          })(), icon: history.length >= 2 && (history[history.length - 1].overallScore - history[history.length - 2].overallScore) < 0 ? TrendingDown : TrendingUp, color: 'cyan' },
        ].map((stat, i) => (
          <div key={i} className={`${card} p-5`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}>{stat.label}</span>
              <div className={`h-8 w-8 rounded-xl flex items-center justify-center bg-${stat.color}-500/10`}>
                <stat.icon size={16} className={`text-${stat.color}-500`} />
              </div>
            </div>
            <p className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-800'}`}>{stat.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Main Chart */}
      <motion.div variants={itemVars} className={`${card} p-6`}>
        <h2 className={`text-sm font-bold mb-6 flex items-center gap-2 ${darkMode ? 'text-gray-200' : 'text-slate-800'}`}>
          <TrendingUp size={16} className="text-indigo-500" /> Score Progression
        </h2>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={displayData} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="atsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1f2937' : '#f1f5f9'} vertical={false} />
              <XAxis dataKey="name" stroke={darkMode ? '#374151' : '#e2e8f0'} tick={{ fill: darkMode ? '#9ca3af' : '#64748b', fontSize: 12, fontWeight: 600 }} />
              <YAxis stroke={darkMode ? '#374151' : '#e2e8f0'} tick={{ fill: darkMode ? '#9ca3af' : '#64748b', fontSize: 12 }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#111827' : '#fff',
                  borderColor: darkMode ? '#374151' : '#e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                }}
                itemStyle={{ color: darkMode ? '#e5e7eb' : '#334155' }}
              />
              <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fill="url(#scoreGradient)" dot={{ stroke: '#6366f1', strokeWidth: 2, r: 5, fill: darkMode ? '#111827' : '#fff' }} activeDot={{ r: 7, fill: '#6366f1' }} name="Overall Score" />
              <Area type="monotone" dataKey="ats" stroke="#10b981" strokeWidth={2} fill="url(#atsGradient)" dot={{ stroke: '#10b981', strokeWidth: 2, r: 4, fill: darkMode ? '#111827' : '#fff' }} name="ATS Score" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Version Diffs */}
      <motion.div variants={itemVars} className={`${card} p-6`}>
        <h3 className={`text-sm font-bold mb-4 uppercase tracking-wider flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>
          <Clock size={16} className="text-purple-500" /> Version Delta Log
        </h3>
        <div className="space-y-3">
          {history.length === 0 ? (
            <div className={`p-6 rounded-2xl text-center ${darkMode ? 'bg-gray-700/30' : 'bg-slate-50'}`}>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>No analysis history yet. Run your first analysis to start tracking!</p>
            </div>
          ) : (
            history.slice().reverse().map((entry, idx) => {
              const scoreChange = entry.versionComparison?.scoreChange || 0;
              const skillsAdded = entry.versionComparison?.skillsAdded || [];
              const skillsRemoved = entry.versionComparison?.skillsRemoved || [];
              const isPositive = scoreChange >= 0;

              return (
                <motion.div
                  key={entry.id || idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`flex items-center justify-between p-4 rounded-2xl ${darkMode ? 'bg-gray-700/30 border border-gray-700/50 hover:bg-gray-700/50' : 'bg-slate-50 border border-slate-100 hover:bg-slate-100/80'} transition-colors`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`font-bold text-sm ${darkMode ? 'text-gray-200' : 'text-slate-800'}`}>
                        Version {history.length - idx}.0
                      </p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-slate-200 text-slate-600'}`}>
                        Score: {entry.overallScore}%
                      </span>
                    </div>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}>
                      {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {skillsAdded.length > 0 && (
                      <p className="text-xs text-emerald-500 mt-1 font-medium">
                        + Skills Added: {skillsAdded.slice(0, 5).join(', ')}
                      </p>
                    )}
                    {skillsRemoved.length > 0 && (
                      <p className="text-xs text-red-400 mt-0.5 font-medium">
                        - Skills Removed: {skillsRemoved.slice(0, 5).join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 shrink-0 ml-4">
                    {idx < history.length - 1 && (
                      <div className={`flex items-center gap-1 font-bold text-sm px-3 py-1.5 rounded-xl ${isPositive ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'}`}>
                        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {isPositive ? '+' : ''}{scoreChange} pts
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default History;

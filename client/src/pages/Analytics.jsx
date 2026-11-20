import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Target, CheckCircle, TrendingUp, AlertTriangle, BarChart3, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { useTheme } from '../context/ThemeContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Analytics = () => {
  const { darkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`${API}/analytics/summary`);
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const card = 'bg-white/95 dark:bg-[#151d16]/95 backdrop-blur-xl rounded-[28px] shadow-sm border border-black/10 dark:border-white/10';
  const containerVars = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const itemVars = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } } };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] font-geometric">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#c27838]"></div>
        <p className="mt-4 text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">Loading Summary Analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-[28px] bg-red-500/10 border border-red-500/20 text-red-500 max-w-md mx-auto text-center mt-12 font-geometric">
        <AlertTriangle className="mx-auto mb-2 text-red-500" size={24} />
        <p className="text-xs font-bold">{error}</p>
      </div>
    );
  }

  // Show empty state if user has less than 2 analyses
  if (!data || data.count < 2) {
    return (
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto text-center py-16 px-6 mt-12 bg-white/95 dark:bg-[#151d16]/95 rounded-[28px] border border-black/10 dark:border-white/10 shadow-sm font-geometric">
        <div className="h-12 w-12 rounded-full bg-[#f6f8f5] dark:bg-white/10 flex items-center justify-center mx-auto mb-4 text-[#c27838]">
          <BarChart3 size={20} />
        </div>
        <h2 className="text-base font-black text-[#141c15] dark:text-white mb-1">Unlock Trend Insights</h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium mb-5">
          Run at least 2 analyses to start tracking version improvements, historical scores, and recurring skill gaps.
        </p>
      </motion.div>
    );
  }

  const { summary } = data;
  const isPositive = summary.improvementRate >= 0;

  // Format Recharts data for missing skills
  const missingSkillsChartData = summary.mostCommonMissingSkills.map(item => ({
    name: item.skill,
    count: item.count,
    fill: item.count >= 3 ? '#c27838' : (darkMode ? '#94a3b8' : '#141c15')
  }));

  return (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="space-y-6 pb-20 font-geometric">
      
      {/* Header */}
      <motion.div variants={itemVars}>
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-[10px] font-black uppercase tracking-wider text-[#c27838] mb-2">
          <span>✦ Career Analytics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#141c15] dark:text-white tracking-tight">Aggregate Analytics</h1>
        <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">Identify recurring gaps and macro improvements across all versions</p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={itemVars} className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Avg Overall Score */}
        <div className={`${card} p-5`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Avg Overall Score</span>
            <div className="h-8 w-8 rounded-full flex items-center justify-center bg-[#f6f8f5] dark:bg-white/10 text-slate-700 dark:text-white shrink-0">
              <Target size={14} className="text-[#c27838]" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#141c15] dark:text-white tracking-tight">{summary.avgOverallScore}%</p>
        </div>

        {/* Avg ATS Score */}
        <div className={`${card} p-5`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Avg ATS Score</span>
            <div className="h-8 w-8 rounded-full flex items-center justify-center bg-[#f6f8f5] dark:bg-white/10 text-slate-700 dark:text-white shrink-0">
              <CheckCircle size={14} className="text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#141c15] dark:text-white tracking-tight">{summary.avgAtsScore}%</p>
        </div>

        {/* Improvement Rate */}
        <div className={`${card} p-5`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Score Improvement</span>
            <div className="h-8 w-8 rounded-full flex items-center justify-center bg-[#f6f8f5] dark:bg-white/10 text-slate-700 dark:text-white shrink-0">
              <TrendingUp size={14} className="text-[#c27838]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-black text-[#141c15] dark:text-white tracking-tight">
              {isPositive ? `+${summary.improvementRate}` : summary.improvementRate}
            </p>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
              isPositive ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400'
            }`}>
              {isPositive ? 'Improved' : 'Dropped'}
            </span>
          </div>
        </div>

      </motion.div>

      {/* Score Progression Trend */}
      <motion.div variants={itemVars} className={`${card} p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-[#f6f8f5] dark:bg-white/10 flex items-center justify-center text-slate-700 dark:text-white shrink-0">
              <TrendingUp size={14} className="text-[#c27838]" />
            </div>
            <h3 className="text-sm font-black text-[#141c15] dark:text-white">Historical Evolution</h3>
          </div>
        </div>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={summary.historyTrend} margin={{ top: 10, right: 10, bottom: 5, left: -25 }}>
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

      {/* Aggregate Missing Skills Section */}
      <motion.div variants={itemVars} className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Missing Skills Bar Chart */}
        <div className={`${card} p-6 lg:col-span-7 flex flex-col h-[340px]`}>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="h-8 w-8 rounded-full bg-[#f6f8f5] dark:bg-white/10 flex items-center justify-center text-slate-700 dark:text-white shrink-0">
              <BarChart3 size={14} className="text-[#c27838]" />
            </div>
            <h3 className="text-sm font-black text-[#141c15] dark:text-white">Recurring Skill Gaps Chart</h3>
          </div>
          <div className="flex-1 w-full -mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={missingSkillsChartData} margin={{ top: 5, right: 5, bottom: 5, left: -25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? 'rgba(255,255,255,0.08)' : '#f1f5f9'} vertical={false} />
                <XAxis dataKey="name" tick={{ fill: darkMode ? '#cbd5e1' : '#64748b', fontSize: 9, fontWeight: 700 }} />
                <YAxis tick={{ fill: darkMode ? '#cbd5e1' : '#64748b', fontSize: 9 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#151d16' : '#ffffff',
                    borderColor: darkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
                    borderRadius: '14px',
                    color: darkMode ? '#ffffff' : '#141c15',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {missingSkillsChartData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Missing Skills List (Divider Pattern) */}
        <div className={`${card} p-6 lg:col-span-5 flex flex-col h-[340px]`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-[#f6f8f5] dark:bg-white/10 flex items-center justify-center text-slate-700 dark:text-white shrink-0">
                <AlertTriangle size={14} className="text-[#c27838]" />
              </div>
              <h3 className="text-sm font-black text-[#141c15] dark:text-white">Gaps Rankings</h3>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-1 divide-y divide-black/5 dark:divide-white/5">
            {summary.mostCommonMissingSkills.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                    <AlertTriangle size={13} className="text-[#c27838]" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-[#141c15] dark:text-white">{item.skill}</p>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Missing {item.count} times</span>
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide shrink-0 ${
                  item.count >= 3 ? 'bg-red-500 text-white' : 'bg-[#141c15] text-white dark:bg-white dark:text-[#141c15]'
                }`}>
                  {item.count >= 3 ? 'Critical' : 'High'}
                </span>
              </div>
            ))}
          </div>
        </div>

      </motion.div>

    </motion.div>
  );
};

export default Analytics;

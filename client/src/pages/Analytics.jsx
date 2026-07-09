import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Target, CheckCircle, TrendingUp, AlertTriangle, BarChart3, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Analytics = () => {
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

  const card = 'bg-white rounded-2xl shadow-sm border border-slate-100/50';
  const containerVars = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const itemVars = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } } };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-slate-900"></div>
        <p className="mt-4 text-[10px] font-bold tracking-widest uppercase text-slate-400">Loading Summary Analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 max-w-md mx-auto text-center mt-12">
        <AlertTriangle className="mx-auto mb-2 text-red-500" size={24} />
        <p className="text-xs font-bold">{error}</p>
      </div>
    );
  }

  // Show empty state if user has less than 2 analyses
  if (!data || data.count < 2) {
    return (
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto text-center py-16 px-6 mt-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4 text-slate-400 border border-slate-100">
          <BarChart3 size={20} />
        </div>
        <h2 className="text-sm font-bold text-slate-800 mb-1">Unlock Trend Insights</h2>
        <p className="text-xs text-slate-400 leading-relaxed font-medium mb-5">
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
    fill: item.count >= 3 ? '#18181b' : '#94a3b8'
  }));

  return (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="space-y-4 pb-16">
      
      {/* Header */}
      <motion.div variants={itemVars}>
        <h1 className="text-xl font-bold mb-0.5 text-slate-800">Aggregate Analytics</h1>
        <p className="text-xs font-medium text-slate-400">Identify recurring gaps and improvements across all versions</p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={itemVars} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Avg Overall Score */}
        <div className={`${card} p-4`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Avg Overall Score</span>
            <div className="h-7 w-7 rounded-full flex items-center justify-center bg-slate-100 text-slate-600 shrink-0">
              <Target size={13} className="text-slate-500" />
            </div>
          </div>
          <p className="text-xl font-extrabold text-slate-800">{summary.avgOverallScore}%</p>
        </div>

        {/* Avg ATS Score */}
        <div className={`${card} p-4`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Avg ATS Score</span>
            <div className="h-7 w-7 rounded-full flex items-center justify-center bg-slate-100 text-slate-600 shrink-0">
              <CheckCircle size={13} className="text-slate-500" />
            </div>
          </div>
          <p className="text-xl font-extrabold text-slate-800">{summary.avgAtsScore}%</p>
        </div>

        {/* Improvement Rate */}
        <div className={`${card} p-4`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Score Improvement</span>
            <div className="h-7 w-7 rounded-full flex items-center justify-center bg-slate-100 text-slate-600 shrink-0">
              <TrendingUp size={13} className="text-slate-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-xl font-extrabold text-slate-800">
              {isPositive ? `+${summary.improvementRate}` : summary.improvementRate}
            </p>
            <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase ${
              isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
            }`}>
              {isPositive ? 'Improved' : 'Dropped'}
            </span>
          </div>
        </div>

      </motion.div>

      {/* Score Progression Trend */}
      <motion.div variants={itemVars} className={`${card} p-4`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
              <TrendingUp size={13} className="text-slate-500" />
            </div>
            <h3 className="text-xs font-bold text-slate-800">Historical Evolution</h3>
          </div>
        </div>
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={summary.historyTrend} margin={{ top: 10, right: 10, bottom: 5, left: -25 }}>
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
              <XAxis dataKey="name" stroke="#cbd5e1" tick={{ fill: '#64748b', fontSize: 9, fontWeight: 500 }} />
              <YAxis stroke="#cbd5e1" tick={{ fill: '#64748b', fontSize: 9 }} domain={[0, 100]} />
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

      {/* Aggregate Missing Skills Section */}
      <motion.div variants={itemVars} className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Missing Skills Bar Chart */}
        <div className={`${card} p-4 lg:col-span-7 flex flex-col h-[320px]`}>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
              <BarChart3 size={13} className="text-slate-500" />
            </div>
            <h3 className="text-xs font-bold text-slate-800">Recurring Skill Gaps Chart</h3>
          </div>
          <div className="flex-1 w-full -mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={missingSkillsChartData} margin={{ top: 5, right: 5, bottom: 5, left: -25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 9, fontWeight: 500 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 9 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {missingSkillsChartData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Missing Skills List (Divider Pattern) */}
        <div className={`${card} p-4 lg:col-span-5 flex flex-col h-[320px]`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                <AlertTriangle size={13} className="text-slate-500" />
              </div>
              <h3 className="text-xs font-bold text-slate-800">Gaps Rankings</h3>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-1 divide-y divide-slate-100">
            {summary.mostCommonMissingSkills.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                    <AlertTriangle size={12} className="text-slate-400" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-xs font-bold text-slate-800">{item.skill}</p>
                    <span className="text-[10px] text-slate-400 font-medium">Missing {item.count} times</span>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-wide shrink-0 ${
                  item.count >= 3 ? 'bg-red-500 text-white' : 'bg-slate-900 text-white'
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

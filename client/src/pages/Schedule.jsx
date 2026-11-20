import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Calendar, Plus, Edit2, Trash2, X, AlertTriangle, FileText, CheckCircle, ExternalLink } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Schedule = () => {
  const [applications, setApplications] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Modal control states
  const [showModal, setShowModal] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

  // Form states
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('applied');
  const [analysisId, setAnalysisId] = useState('');
  const [appliedDate, setAppliedDate] = useState('');
  const [notes, setNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');

  const fetchApplications = async () => {
    try {
      const res = await axios.get(`${API}/applications`);
      if (res.data.success) {
        setApplications(res.data.applications || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load applications');
    }
  };

  const fetchAnalyses = async () => {
    try {
      const res = await axios.get(`${API}/analysis/history/versions`);
      if (res.data.success) {
        setAnalyses(res.data.history || []);
      }
    } catch {
      setAnalyses([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchApplications(), fetchAnalyses()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingApp(null);
    setCompany('');
    setRole('');
    setStatus('applied');
    setAnalysisId('');
    setAppliedDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setFollowUpDate('');
    setShowModal(true);
  };

  const openEditModal = (app) => {
    setEditingApp(app);
    setCompany(app.company);
    setRole(app.role);
    setStatus(app.status);
    setAnalysisId(app.analysisId?._id || app.analysisId || '');
    setAppliedDate(app.appliedDate ? new Date(app.appliedDate).toISOString().split('T')[0] : '');
    setNotes(app.notes || '');
    setFollowUpDate(app.followUpDate ? new Date(app.followUpDate).toISOString().split('T')[0] : '');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!company || !role) {
      alert("Company and Role are required.");
      return;
    }

    setSubmitting(true);
    const body = {
      company,
      role,
      status,
      analysisId: analysisId || null,
      appliedDate: appliedDate || new Date(),
      notes,
      followUpDate: followUpDate || null
    };

    try {
      if (editingApp) {
        // Edit mode
        await axios.put(`${API}/applications/${editingApp._id}`, body);
      } else {
        // Add mode
        await axios.post(`${API}/applications`, body);
      }
      await fetchApplications();
      setShowModal(false);
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to save application.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (appId) => {
    if (!confirm("Are you sure you want to delete this application?")) return;
    try {
      await axios.delete(`${API}/applications/${appId}`);
      await fetchApplications();
      setShowModal(false);
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to delete application.');
    }
  };

  const statuses = [
    { key: 'applied', label: 'Applied', color: 'bg-slate-100 text-slate-700' },
    { key: 'interviewing', label: 'Interviewing', color: 'bg-blue-50 text-blue-600' },
    { key: 'offer', label: 'Offer Received', color: 'bg-emerald-50 text-emerald-700' },
    { key: 'rejected', label: 'Rejected', color: 'bg-red-50/60 text-red-500' }
  ];

  const card = 'bg-white/95 dark:bg-[#151d16]/95 backdrop-blur-xl rounded-[28px] shadow-sm border border-black/10 dark:border-white/10';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] font-geometric">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#c27838]"></div>
        <p className="mt-4 text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">Loading Job Tracker...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 relative font-geometric">
      
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-[10px] font-black uppercase tracking-wider text-[#c27838] mb-2">
            <span>✦ Pipeline Tracker</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#141c15] dark:text-white tracking-tight">Job Applications</h1>
          <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">Track interview pipeline stages and linked resume score benchmarks</p>
        </div>
        <button onClick={openAddModal} className="flex items-center gap-2 bg-[#141c15] hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-[#141c15] px-5 py-2.5 rounded-full text-xs font-black shadow-md transition-all cursor-pointer">
          <div className="h-4 w-4 rounded-full bg-white/20 dark:bg-black/10 flex items-center justify-center shrink-0">
            <Plus size={11} className="text-white dark:text-[#141c15]" />
          </div>
          <span>Add Target Job</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-[20px] bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 text-xs font-bold flex items-center gap-2 border border-red-200 dark:border-red-900/40">
          <AlertTriangle size={14} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-start">
        {statuses.map(col => {
          const colApps = applications.filter(app => app.status === col.key);
          return (
            <div key={col.key} className={`${card} p-5 flex flex-col h-[70vh] bg-white/80 dark:bg-[#121a13]/80`}>
              <div className="flex items-center justify-between mb-4 border-b border-black/10 dark:border-white/10 pb-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">{col.label}</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#f6f8f5] dark:bg-white/10 border border-black/5 dark:border-white/10 text-[#141c15] dark:text-white shadow-sm">{colApps.length}</span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-0.5">
                {colApps.length === 0 ? (
                  <div className="text-center py-10 text-xs text-slate-400 font-bold">No jobs in this stage.</div>
                ) : (
                  colApps.map(app => {
                    const linked = app.analysisId;
                    return (
                      <motion.div
                        key={app._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-[#182218] p-4 rounded-2xl border border-black/10 dark:border-white/10 shadow-sm flex flex-col justify-between hover:border-[#c27838] transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h4 className="text-xs font-black text-[#141c15] dark:text-white leading-tight truncate mr-2">{app.role}</h4>
                            <button onClick={() => openEditModal(app)} className="p-1 rounded-full text-slate-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 shrink-0 cursor-pointer">
                              <Edit2 size={11} />
                            </button>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 font-bold mt-1 truncate">{app.company}</p>
                          
                          {app.appliedDate && (
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-2 flex items-center gap-1.5">
                              <Calendar size={10} className="text-[#c27838]" /> Applied: {new Date(app.appliedDate).toLocaleDateString()}
                            </p>
                          )}

                          {app.followUpDate && (
                            <p className="text-[10px] text-red-500 dark:text-red-400 font-bold mt-1 flex items-center gap-1.5">
                              <Calendar size={10} /> Follow up: {new Date(app.followUpDate).toLocaleDateString()}
                            </p>
                          )}

                          {/* Linked Analysis Version */}
                          {linked && (
                            <div className="mt-3 pt-2.5 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-2 bg-[#f6f8f5] dark:bg-white/5 p-2 rounded-xl">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <FileText size={10} className="text-[#c27838]" shrink-0 />
                                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate">
                                  v{(linked.resumeVersion || 1)}.0 ({linked.scores?.overallScore || 0}%)
                                </span>
                              </div>
                              <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full bg-[#141c15] dark:bg-white text-white dark:text-[#141c15] shrink-0">Linked</span>
                            </div>
                          )}

                          {app.notes && (
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-2 bg-[#f6f8f5] dark:bg-white/5 p-2 rounded-xl border border-black/5 dark:border-white/5 truncate max-h-[40px]">{app.notes}</p>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-[#151d16] rounded-[32px] p-6 max-w-md w-full shadow-2xl relative border border-black/10 dark:border-white/10 text-[#141c15] dark:text-white"
            >
              <button onClick={() => setShowModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-black dark:hover:text-white cursor-pointer">
                <X size={16} />
              </button>

              <h2 className="text-base font-black mb-4 flex items-center gap-2">
                <Briefcase size={16} className="text-[#c27838]" />
                <span>{editingApp ? 'Edit Application' : 'Track New Opportunity'}</span>
              </h2>

              <form onSubmit={handleSave} className="space-y-3.5">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Google, Stripe, OpenAI"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 dark:border-white/10 bg-[#f6f8f5] dark:bg-white/5 outline-none focus-visible:ring-1 focus-visible:ring-[#c27838] text-[#141c15] dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block mb-1">Role Title *</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Staff Backend Engineer"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 dark:border-white/10 bg-[#f6f8f5] dark:bg-white/5 outline-none focus-visible:ring-1 focus-visible:ring-[#c27838] text-[#141c15] dark:text-white font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block mb-1">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl text-xs border border-slate-200 dark:border-white/10 bg-[#f6f8f5] dark:bg-[#151d16] outline-none focus-visible:ring-1 focus-visible:ring-[#c27838] text-[#141c15] dark:text-white font-medium"
                    >
                      <option value="applied">Applied</option>
                      <option value="interviewing">Interviewing</option>
                      <option value="offer">Offer Received</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block mb-1">Link Resume Version</label>
                    <select
                      value={analysisId}
                      onChange={(e) => setAnalysisId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl text-xs border border-slate-200 dark:border-white/10 bg-[#f6f8f5] dark:bg-[#151d16] outline-none focus-visible:ring-1 focus-visible:ring-[#c27838] text-[#141c15] dark:text-white font-medium"
                    >
                      <option value="">-- No link --</option>
                      {analyses.map((an, idx) => (
                        <option key={an.id || idx} value={an.id || ''}>
                          Version {analyses.length - idx}.0 ({an.overallScore}%)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block mb-1">Date Applied</label>
                    <input
                      type="date"
                      value={appliedDate}
                      onChange={(e) => setAppliedDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-white/10 bg-[#f6f8f5] dark:bg-white/5 outline-none focus-visible:ring-1 focus-visible:ring-[#c27838] text-[#141c15] dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block mb-1">Follow-up Date</label>
                    <input
                      type="date"
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-white/10 bg-[#f6f8f5] dark:bg-white/5 outline-none focus-visible:ring-1 focus-visible:ring-[#c27838] text-[#141c15] dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block mb-1">Notes / Reminders</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter interview details, loops, compensation notes..."
                    className="w-full h-16 border border-slate-200 dark:border-white/10 bg-[#f6f8f5] dark:bg-white/5 rounded-xl p-3 text-xs outline-none focus-visible:ring-1 focus-visible:ring-[#c27838] resize-none text-[#141c15] dark:text-white"
                  />
                </div>

                <div className="flex justify-between items-center pt-2">
                  {editingApp ? (
                    <button
                      type="button"
                      onClick={() => handleDelete(editingApp._id)}
                      className="px-3.5 py-2 rounded-full text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 size={12} />
                      <span>Delete</span>
                    </button>
                  ) : <div />}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 rounded-full text-xs font-bold border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2 rounded-full text-xs font-black bg-[#141c15] dark:bg-white text-white dark:text-[#141c15] hover:bg-black transition-colors cursor-pointer shadow-md disabled:opacity-50"
                    >
                      {submitting ? 'Saving...' : 'Save Job'}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Schedule;

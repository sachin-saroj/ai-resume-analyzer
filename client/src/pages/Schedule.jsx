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

  const card = 'bg-white rounded-2xl shadow-sm border border-slate-100/50';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-slate-900"></div>
        <p className="mt-4 text-[10px] font-bold tracking-widest uppercase text-slate-400">Loading Job Tracker...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-16 relative">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold mb-0.5 text-slate-800">Job Applications</h1>
          <p className="text-xs font-medium text-slate-400">Track and manage resume analysis links across jobs</p>
        </div>
        <button onClick={openAddModal} className="flex items-center gap-1 bg-slate-900 hover:bg-black text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer">
          <div className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Plus size={10} className="text-white" />
          </div>
          <span>Add Job</span>
        </button>
      </div>

      {/* Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
        {statuses.map(col => {
          const colApps = applications.filter(app => app.status === col.key);
          return (
            <div key={col.key} className={`${card} p-3.5 flex flex-col h-[70vh] bg-slate-50/50`}>
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{col.label}</span>
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-white border border-slate-200/50 text-slate-600 shadow-sm">{colApps.length}</span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5">
                {colApps.length === 0 ? (
                  <div className="text-center py-6 text-[10px] text-slate-400 font-medium">No jobs in this stage.</div>
                ) : (
                  colApps.map(app => {
                    const linked = app.analysisId;
                    return (
                      <motion.div
                        key={app._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h4 className="text-xs font-extrabold text-slate-800 leading-tight truncate mr-2">{app.role}</h4>
                            <button onClick={() => openEditModal(app)} className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 shrink-0 cursor-pointer">
                              <Edit2 size={10} />
                            </button>
                          </div>
                          <p className="text-[10px] text-slate-500 font-bold mt-0.5 truncate">{app.company}</p>
                          
                          {app.appliedDate && (
                            <p className="text-[8px] text-slate-400 font-medium mt-1.5 flex items-center gap-1">
                              <Calendar size={8} /> Applied: {new Date(app.appliedDate).toLocaleDateString()}
                            </p>
                          )}

                          {app.followUpDate && (
                            <p className="text-[8px] text-red-500 font-bold mt-1 flex items-center gap-1">
                              <Calendar size={8} /> Follow up: {new Date(app.followUpDate).toLocaleDateString()}
                            </p>
                          )}

                          {/* Linked Analysis Version */}
                          {linked && (
                            <div className="mt-2.5 pt-2 border-t border-slate-50 flex items-center justify-between gap-2 bg-slate-50/50 p-1.5 rounded-lg border border-slate-100">
                              <div className="flex items-center gap-1 min-w-0">
                                <FileText size={8} className="text-slate-400 shrink-0" />
                                <span className="text-[8px] font-bold text-slate-500 truncate">
                                  v{(linked.resumeVersion || 1)}.0 ({linked.scores?.overallScore || 0}%)
                                </span>
                              </div>
                              <span className="text-[7px] font-bold px-1 py-0.2 rounded bg-slate-900 text-white shrink-0">Linked</span>
                            </div>
                          )}

                          {app.notes && (
                            <p className="text-[8px] text-slate-400 leading-relaxed font-medium mt-2 bg-slate-50/30 p-1.5 rounded border border-slate-100/50 truncate max-h-[40px]">{app.notes}</p>
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
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-5 max-w-md w-full shadow-xl relative"
            >
              <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 cursor-pointer"><X size={15} /></button>
              
              <h2 className="text-sm font-bold mb-4 flex items-center gap-1.5 text-slate-800">
                <Briefcase className="text-slate-500" size={15} />
                <span>{editingApp ? 'Edit Application' : 'Add Application'}</span>
              </h2>

              <form onSubmit={handleSave} className="space-y-3.5">
                <div>
                  <label className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    placeholder="e.g. Google"
                    className="w-full px-3 py-2 rounded-lg text-xs border border-slate-200 outline-none font-medium bg-white text-slate-700 placeholder:text-slate-400 focus:ring-1 focus:ring-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Role Title *</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    placeholder="e.g. Software Engineer"
                    className="w-full px-3 py-2 rounded-lg text-xs border border-slate-200 outline-none font-medium bg-white text-slate-700 placeholder:text-slate-400 focus:ring-1 focus:ring-slate-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Status</label>
                    <select
                      value={status}
                      onChange={e => setStatus(e.target.value)}
                      className="w-full px-2 py-2 rounded-lg text-xs border border-slate-200 outline-none font-medium bg-white text-slate-700 focus:ring-1 focus:ring-slate-400"
                    >
                      <option value="applied">Applied</option>
                      <option value="interviewing">Interviewing</option>
                      <option value="offer">Offer</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Link Resume Version</label>
                    <select
                      value={analysisId}
                      onChange={e => setAnalysisId(e.target.value)}
                      className="w-full px-2 py-2 rounded-lg text-xs border border-slate-200 outline-none font-medium bg-white text-slate-700 focus:ring-1 focus:ring-slate-400"
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
                    <label className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Date Applied</label>
                    <input
                      type="date"
                      value={appliedDate}
                      onChange={e => setAppliedDate(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg text-xs border border-slate-200 outline-none font-medium bg-white text-slate-700 focus:ring-1 focus:ring-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Follow-up Date</label>
                    <input
                      type="date"
                      value={followUpDate}
                      onChange={e => setFollowUpDate(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg text-xs border border-slate-200 outline-none font-medium bg-white text-slate-700 focus:ring-1 focus:ring-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Notes / Reminders</label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Enter interviews details or referrals details..."
                    className="w-full h-16 border border-slate-200 rounded-lg p-2.5 text-xs outline-none bg-white text-slate-700 placeholder:text-slate-400 focus:ring-1 focus:ring-slate-400 resize-none"
                  />
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  {editingApp ? (
                    <button
                      type="button"
                      onClick={() => handleDelete(editingApp._id)}
                      className="flex items-center gap-1 text-[10px] font-bold text-red-500 hover:text-red-700 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  ) : <div />}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-3.5 py-2 rounded-lg text-xs font-bold border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-900 hover:bg-black text-white shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? 'Saving...' : 'Save'}
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

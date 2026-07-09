import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, HelpCircle, ChevronDown, ChevronUp, Mail, AlertTriangle } from 'lucide-react';

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(null);

  const faqs = [
    {
      q: "How is my Overall Score calculated?",
      a: "Your score is a weighted index computed in our scoring engine: Skills matching accounts for 40%, Experience relevance for 30%, Project alignment for 20%, and Layout/Formatting for 10%. Each area is evaluated dynamically against your target job description."
    },
    {
      q: "Why is a skill marked as missing if it is in my resume?",
      a: "Our parsing pipeline extracts skills using semantic ontologies. If a skill is phrased uniquely or uses non-standard terms, it might not align with the target JD's required keywords. You can use 'Repair Mode' on the dashboard to live-patch skills and immediately boost your score."
    },
    {
      q: "Is my data secure and private?",
      a: "Yes. All resumes, job descriptions, and comparative history logs are bound to your account and protected by JWT authentication middleware. Strict server-side ownership validations are executed on all queries to prevent unauthorized access."
    },
    {
      q: "How does Version History work?",
      a: "Every time you run a new analysis or apply a Live Patch, our version intelligence engine saves a history snapshot. The comparative logs track overall progress, ATS improvements, and lists of skills added or removed between versions."
    },
    {
      q: "Can I export my analysis reports?",
      a: "Absolutely. The dashboard supports exporting a complete raw spreadsheet (.XLS) of the analysis metrics, and a formatted printable PDF report for offline sharing or tracking."
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpand = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const card = 'bg-white rounded-2xl shadow-sm border border-slate-100/50';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 pb-16">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold mb-0.5 text-slate-800">Help & Support</h1>
        <p className="text-xs font-medium text-slate-400">Find answers and get help with the career optimization platform</p>
      </div>

      {/* Search FAQ */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
          <Search className="text-slate-400" size={10} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Filter FAQs by keyword..."
          className="w-full pl-10 pr-4 py-2 rounded-lg text-xs border border-slate-200 outline-none font-medium bg-white text-slate-700 placeholder:text-slate-400 shadow-sm focus:ring-1 focus:ring-slate-400 transition-all"
        />
      </div>

      {/* FAQs List Card */}
      <div className={`${card} p-4`}>
        <div className="flex items-center gap-2 mb-4 border-b border-slate-50 pb-2">
          <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
            <HelpCircle size={13} className="text-slate-500" />
          </div>
          <h3 className="text-xs font-bold text-slate-800">Frequently Asked Questions</h3>
        </div>

        {filteredFaqs.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 font-medium flex flex-col items-center justify-center gap-1">
            <AlertTriangle size={16} className="text-slate-300" />
            <span>No FAQ entries found matching "{searchQuery}"</span>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredFaqs.map((faq, idx) => {
              const isExpanded = expandedIndex === idx;
              return (
                <div key={idx} className="py-3 first:pt-0 last:pb-0">
                  <button
                    onClick={() => toggleExpand(idx)}
                    className="w-full flex items-center justify-between text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-4">
                      <div className="h-6 w-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 border border-slate-100/50">
                        <HelpCircle size={11} />
                      </div>
                      <p className="text-xs font-bold text-slate-800 leading-normal truncate">{faq.q}</p>
                    </div>
                    <div className="h-6 w-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100/50 shrink-0">
                      {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mt-2.5 pl-8 text-[11px] text-slate-500 leading-relaxed font-medium"
                      >
                        <p className="bg-slate-50/55 p-3 rounded-lg border border-slate-100/60">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Support Card */}
      <div className={`${card} p-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
            <Mail size={14} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">Still need help?</h4>
            <p className="text-[10px] text-slate-400 font-medium">Reach out directly to our engineering support desk.</p>
          </div>
        </div>
        <a
          href="mailto:support@resumeai.pro?subject=ResumeAI Support Inquiry"
          className="bg-slate-900 hover:bg-black text-white px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-sm transition-colors cursor-pointer flex items-center gap-1"
        >
          <span>Email Support</span>
        </a>
      </div>

    </motion.div>
  );
};

export default Help;

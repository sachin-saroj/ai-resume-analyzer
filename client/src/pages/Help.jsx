import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, HelpCircle, ChevronDown, ChevronUp, Mail, AlertTriangle } from 'lucide-react';
import { Link005 } from '../components/ui/skiper-ui/skiper40';
import SpotlightCard from '../components/ui/SpotlightCard';

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

  const card = 'bg-white/95 dark:bg-[#151d16]/95 backdrop-blur-xl rounded-[28px] shadow-sm border border-black/10 dark:border-white/10';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-20 font-geometric">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-[10px] font-black uppercase tracking-wider text-[#c27838] mb-2">
          <span>✦ Knowledge Base</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#141c15] dark:text-white tracking-tight">Help & Documentation</h1>
        <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">Frequently asked questions, scoring methodology, and optimization best practices</p>
      </div>

      {/* Search FAQ */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-[#f6f8f5] dark:bg-white/10 flex items-center justify-center border border-black/5 dark:border-white/10">
          <Search className="text-[#c27838]" size={12} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Filter FAQs by keyword (e.g. ATS, score, export, privacy)..."
          className="w-full pl-12 pr-4 py-3 rounded-full text-xs border border-slate-200 dark:border-white/10 outline-none focus-visible:ring-1 focus-visible:ring-[#c27838] font-medium bg-white dark:bg-[#151d16] text-[#141c15] dark:text-white placeholder:text-slate-400 shadow-sm transition-all"
        />
      </div>

      {/* FAQs List Card */}
      <div className={`${card} p-6`}>
        <div className="flex items-center gap-2.5 mb-5 border-b border-black/5 dark:border-white/5 pb-3">
          <div className="h-8 w-8 rounded-full bg-[#f6f8f5] dark:bg-white/10 flex items-center justify-center text-slate-700 dark:text-white shrink-0">
            <HelpCircle size={14} className="text-[#c27838]" />
          </div>
          <h3 className="text-sm font-black text-[#141c15] dark:text-white">Frequently Asked Questions</h3>
        </div>

        {filteredFaqs.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-400 font-bold flex flex-col items-center justify-center gap-2">
            <AlertTriangle size={18} className="text-[#c27838]" />
            <span>No FAQ entries found matching "{searchQuery}"</span>
          </div>
        ) : (
          <div className="divide-y divide-black/5 dark:divide-white/5">
            {filteredFaqs.map((faq, idx) => {
              const isExpanded = expandedIndex === idx;
              return (
                <div key={idx} className="py-4 first:pt-0 last:pb-0">
                  <button
                    onClick={() => toggleExpand(idx)}
                    className="w-full flex items-center justify-between text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-4">
                      <div className="h-6 w-6 rounded-full bg-[#f6f8f5] dark:bg-white/10 flex items-center justify-center text-slate-400 shrink-0 border border-black/5 dark:border-white/10">
                        <HelpCircle size={11} className="text-[#c27838]" />
                      </div>
                      <p className="text-xs font-black text-[#141c15] dark:text-white leading-normal truncate">{faq.q}</p>
                    </div>
                    <div className="h-7 w-7 rounded-full bg-[#f6f8f5] dark:bg-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 border border-black/5 dark:border-white/10 shrink-0">
                      {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mt-3 pl-9 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium"
                      >
                        <p className="bg-[#f6f8f5] dark:bg-white/5 p-4 rounded-2xl border border-black/5 dark:border-white/5">{faq.a}</p>
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
      <SpotlightCard className={`${card} p-6 flex items-center justify-between flex-wrap gap-4`}>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-[#f6f8f5] dark:bg-white/10 flex items-center justify-center text-[#c27838] shrink-0">
            <Mail size={16} />
          </div>
          <div>
            <h4 className="text-xs font-black text-[#141c15] dark:text-white">Still need help or custom integrations?</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Reach out directly to our engineering support desk.</p>
          </div>
        </div>
        <Link005
          href="mailto:support@resumeiq.pro?subject=ResumeIQ Support Inquiry"
          className="bg-[#141c15] hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-[#141c15] px-6 py-2.5 rounded-full text-xs font-black shadow-md transition-colors cursor-pointer"
        >
          <span>Email Engineering</span>
        </Link005>
      </SpotlightCard>

    </motion.div>
  );
};

export default Help;

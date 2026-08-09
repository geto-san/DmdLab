import React, { useState, useMemo } from 'react';
import { motion } from "framer-motion";
import { Search, FileText, ArrowRight, ExternalLink } from "lucide-react";
import { publications, labMembers } from "../data/labData";
import { useContent } from "../hooks/useContent";

function highlightLabMembers(authors, members) {
  const parts = authors.split(/(,\s*)/);
  return parts.map((part, i) => {
    const isLabMember = members.some(m => part.includes(m));
    return isLabMember ? <strong key={i} className="text-brand-primary font-bold">{part}</strong> : <span key={i} className="font-medium text-text-secondary">{part}</span>;
  });
}

const PublicationsPage = () => {
  const { data } = useContent('publications', { list: publications, labMembers });
  const pubs = Array.isArray(data.list) ? data.list : publications;
  const members = Array.isArray(data.labMembers) ? data.labMembers : labMembers;
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState(null);

  const years = [...new Set(pubs.map(p => p.year))].sort((a, b) => b - a);

  const filtered = useMemo(() => {
    return pubs.filter(p => {
      if (yearFilter && p.year !== yearFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return p.title.toLowerCase().includes(q) || p.authors.toLowerCase().includes(q) || p.journal.toLowerCase().includes(q);
      }
      return true;
    });
  }, [pubs, search, yearFilter]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-bg-main min-h-screen pb-24 transition-colors duration-500"
    >
      <section className="bg-ink pt-48 pb-24 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 text-left">
          <span className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.4em] mb-6 block opacity-80">Knowledge Repository</span>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[0.95] mb-10 max-w-3xl">
            Scientific <span className="text-brand-primary accent-soften">Output</span>
          </h1>
          <p className="text-white/50 text-xl max-w-2xl leading-relaxed">
            A comprehensive catalog of our peer-reviewed research across computational biology, AI, and molecular dynamics.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 -mt-12 relative z-20">
        <div className="bg-bg-elevated rounded-[2.5rem] shadow-elevated border border-border-strong p-10 lg:p-16">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Sidebar */}
            <div className="lg:w-80 shrink-0">
              <div className="lg:sticky lg:top-32 space-y-12">
                <div className="relative group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-dim group-focus-within:text-brand-primary transition-colors" />
                  <input
                    placeholder="Search publications..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-bg-surface border border-border-subtle rounded-2xl py-5 pl-14 pr-6 text-sm font-bold text-text-main focus:outline-none focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary transition-all shadow-soft"
                  />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-text-main uppercase tracking-[0.25em] mb-8 opacity-40">Timeline Filter</h4>
                  <div className="flex flex-wrap lg:flex-col gap-3">
                    <button
                      onClick={() => setYearFilter(null)}
                      className={`px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${!yearFilter ? "bg-brand-primary text-white shadow-soft" : "text-text-secondary hover:bg-bg-surface-hover border border-border-subtle"}`}
                    >
                      All Scientific History
                    </button>
                    {years.map(y => (
                      <button
                        key={y}
                        onClick={() => setYearFilter(y)}
                        className={`px-6 py-3 rounded-2xl text-[11px] font-mono font-bold transition-all ${yearFilter === y ? "bg-brand-primary text-white shadow-soft" : "text-text-secondary hover:bg-bg-surface-hover border border-border-subtle"}`}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* List */}
            <div className="flex-1">
              {years.filter(y => !yearFilter || y === yearFilter).map(year => {
                const yearPubs = filtered.filter(p => p.year === year);
                if (yearPubs.length === 0) return null;
                return (
                  <div key={year} className="mb-20 last:mb-0">
                    <h3 className="text-4xl font-extrabold text-text-main mb-10 font-mono border-b border-border-main pb-6">{year}</h3>
                    <div className="grid gap-8">
                      {yearPubs.map(p => (
                        <div key={p.slug} className="group bg-bg-surface border border-border-subtle p-10 rounded-[2rem] hover:shadow-elevated hover:border-brand-primary/10 transition-all">
                          <div className="flex items-start justify-between gap-8 mb-8">
                             <div className="p-4 rounded-2xl bg-brand-primary/5 text-brand-primary accent-soften">
                                <FileText size={28} />
                             </div>
                             <div className="flex gap-5">
                               <span className="text-[10px] font-bold text-text-dim uppercase tracking-widest bg-bg-main px-3 py-1 rounded-full border border-border-subtle">{p.citations} Citations</span>
                               <a href="#" className="text-text-dim hover:text-brand-primary transition-colors accent-soften"><ExternalLink size={20} /></a>
                             </div>
                          </div>
                          <h4 className="text-2xl font-bold text-text-main mb-4 leading-snug tracking-tight group-hover:text-brand-primary transition-colors">{p.title}</h4>
                          <p className="text-base leading-relaxed mb-8">
                            {highlightLabMembers(p.authors, members)}
                          </p>
                          <div className="flex items-center justify-between pt-8 border-t border-border-main">
                             <span className="text-[11px] font-bold text-text-dim uppercase tracking-[0.2em] italic">{p.journal}</span>
                             <button className="text-brand-primary font-bold text-[10px] uppercase tracking-[0.3em] flex items-center gap-3 hover:translate-x-1 transition-all">
                               Examine Full Text <ArrowRight size={16} />
                             </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PublicationsPage;

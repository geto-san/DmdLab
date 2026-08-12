import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Mail, Github, Linkedin } from "lucide-react";
import { teamCategories, alumni } from "../data/labData";
import { useContent } from "../hooks/useContent";

const TeamPage = () => {
  const { data } = useContent('team', { categories: teamCategories, alumni });
  const categories = Array.isArray(data.categories) ? data.categories : [];
  const alumniList = Array.isArray(data.alumni) ? data.alumni : [];
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredCategories = activeCategory === "All"
    ? categories
    : categories.filter(cat => cat.name === activeCategory);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-bg-main min-h-screen pb-24 transition-colors duration-500"
    >
      <section className="bg-bg-surface py-24 pt-48 text-center border-b border-border-main">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <span className="eyebrow mx-auto">Collaboration</span>
          <h1 className="text-5xl sm:text-7xl font-extrabold text-text-main leading-[1.05] mb-10 tracking-tight">
            Meet the <span className="text-brand-primary accent-soften">Minds</span> Behind DmdLab
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            A multidisciplinary collective of researchers, engineers, and students dedicated to building the future of artificial intelligence.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-24">
          {["All", ...categories.map(c => c.name)].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${activeCategory === cat ? "bg-brand-primary text-white shadow-soft" : "text-text-secondary hover:bg-bg-surface-hover border border-border-subtle"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Team Grid */}
        <div className="space-y-32">
          {filteredCategories.map((category) => (
            <div key={category.name}>
              <div className="flex items-center gap-10 mb-16">
                <h2 className="text-sm font-bold text-text-main tracking-[0.4em] whitespace-nowrap uppercase opacity-40">{category.name}</h2>
                <div className="h-px w-full bg-border-main" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                {category.members.map((member) => (
                  <div key={member.name} className="group animate-fade-up">
                    <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-8 shadow-soft border border-border-subtle group-hover:shadow-elevated transition-all duration-700 bg-bg-surface">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                        <p className="text-white/90 text-xs font-medium leading-relaxed line-clamp-4">
                          {member.research}
                        </p>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-text-main mb-2 group-hover:text-brand-primary transition-colors tracking-tight">{member.name}</h3>
                    <p className="text-[10px] font-bold text-text-dim uppercase tracking-[0.2em] mb-6">{member.role}</p>
                    <div className="flex gap-5">
                      {[
                        { icon: Mail, href: "#" },
                        { icon: Linkedin, href: "#" },
                        { icon: Github, href: "#" }
                      ].map((social, i) => (
                        <a key={i} href={social.href} className="text-text-dim hover:text-brand-primary transition-colors accent-soften">
                          <social.icon size={18} />
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Alumni Section */}
        <div className="mt-48 pt-32 border-t border-border-main text-center">
           <h2 className="text-4xl font-extrabold text-text-main mb-6 tracking-tighter">Lab Alumni</h2>
           <p className="text-text-secondary text-lg mb-16 max-w-2xl mx-auto">Celebrating our researchers as they go on to lead innovation across the globe.</p>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
             {alumniList.map(a => (
               <div key={a.name} className="bg-bg-surface rounded-[2rem] p-10 text-left border border-border-subtle shadow-soft hover:shadow-elevated transition-all group">
                 <h4 className="text-xl font-bold text-text-main mb-2 tracking-tight group-hover:text-brand-primary transition-colors">{a.name}</h4>
                 <p className="text-sm text-text-secondary mb-6 leading-snug">{a.position}</p>
                 <div className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.25em] bg-primary-soft inline-block px-3 py-1 rounded-lg accent-soften">Class of {a.year}</div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamPage;

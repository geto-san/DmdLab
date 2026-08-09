import React from 'react';
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Target, Users } from "lucide-react";
import { researchProjects } from "../data/labData";
import { useContent } from "../hooks/useContent";

const DEFAULT_RESEARCH = {
  heading: { before: 'Our ', highlight: 'Research', after: ' Portfolio' },
  description: 'Pushing the boundaries of computational chemistry and machine learning to solve real-world health and conservation challenges.',
  list: researchProjects,
};

const ResearchPage = () => {
  const { data } = useContent('research', DEFAULT_RESEARCH);
  const projects = Array.isArray(data.list) ? data.list : [];
  const heading = data.heading || {};

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-bg-main min-h-screen pb-24 transition-colors duration-500"
    >
      <section className="bg-bg-surface pt-48 pb-24 border-b border-border-main">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-left">
          <span className="eyebrow">Advancing Innovation</span>
          <h1 className="text-5xl sm:text-7xl font-extrabold text-text-main max-w-4xl leading-[1.05] tracking-tight">
            {heading.before}
            <span className="text-brand-primary accent-soften">{heading.highlight}</span>
            {heading.after}
          </h1>
          <p className="text-xl text-text-secondary mt-8 max-w-2xl leading-relaxed">
            {data.description}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div className="grid grid-cols-1 gap-24">
          {projects.map((project, i) => (
            <div key={project.slug} className="group grid lg:grid-cols-2 gap-16 items-center">
              <div className={`overflow-hidden rounded-[2.5rem] shadow-soft border border-border-main aspect-video ${i % 2 === 1 ? 'lg:order-last' : ''}`}>
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-4 mb-6">
                  <span className="bg-primary-soft text-brand-primary px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.1em]">
                    {project.status}
                  </span>
                  <span className="text-border-strong text-xs opacity-30">•</span>
                  <div className="flex items-center gap-2 text-text-dim text-[10px] font-bold uppercase tracking-widest">
                    <Clock size={14} className="accent-soften" />
                    {project.duration}
                  </div>
                </div>

                <h2 className="text-4xl font-extrabold text-text-main mb-8 leading-tight tracking-tight group-hover:text-brand-primary transition-colors">
                  {project.title}
                </h2>

                <p className="text-lg text-text-secondary mb-10 leading-relaxed">
                  {project.description}
                </p>

                <div className="grid sm:grid-cols-2 gap-8 mb-12">
                  <div className="flex gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-bg-surface border border-border-main flex items-center justify-center text-brand-primary shrink-0 shadow-sm accent-soften">
                      <Target size={22} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-text-dim uppercase tracking-widest mb-1.5">Funding</div>
                      <div className="text-sm font-bold text-text-main">{project.funding}</div>
                    </div>
                  </div>
                  <div className="flex gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-bg-surface border border-border-main flex items-center justify-center text-brand-primary shrink-0 shadow-sm accent-soften">
                      <Users size={22} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-text-dim uppercase tracking-widest mb-1.5">Team</div>
                      <div className="text-sm font-bold text-text-main">{project.team.slice(0, 2).join(', ')}...</div>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/research/${project.slug}`}
                  className="btn-primary py-4 px-10 text-xs uppercase tracking-widest"
                >
                  Explore Project
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ResearchPage;

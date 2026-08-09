import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { researchProjects } from '../../data/labData';
import { useContent } from '../../hooks/useContent';
import { resolveIcon } from '../../utils/icons';

const DEFAULT_FEATURED = {
  heading: 'Featured Projects',
  cta: { label: 'Browse Portfolio', to: '/research' },
  projects: researchProjects.slice(0, 3),
};

const FeaturedProjects = () => {
  const { data } = useContent('featured-projects', DEFAULT_FEATURED);
  const projects = data.projects || [];

  return (
    <section className="mb-24">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-3xl font-extrabold text-text-main tracking-tight">{data.heading}</h2>
        <Link to={data.cta?.to || '/research'} className="text-brand-primary font-bold text-[10px] uppercase tracking-[0.25em] flex items-center gap-3 hover:underline group">
          {data.cta?.label || 'Browse Portfolio'} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {projects.map((project, i) => {
          const Icon = project.iconName ? resolveIcon(project.iconName) : (project.icon || resolveIcon());
          return (
            <Link key={project.slug || i} to={`/research/${project.slug}`} className="group block h-full">
              <div className="bg-bg-surface rounded-[2.5rem] border border-border-subtle overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-500 flex flex-col h-full">
                <div className="aspect-[16/10] overflow-hidden relative border-b border-border-subtle">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-5 left-5">
                    <div className="bg-bg-main/90 backdrop-blur-md p-3 rounded-2xl text-brand-primary shadow-soft border border-border-subtle accent-soften">
                      <Icon size={22} />
                    </div>
                  </div>
                </div>
                <div className="p-10 flex flex-col flex-1">
                  <div className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.25em] mb-4 opacity-80">{project.status}</div>
                  <h3 className="text-2xl font-bold text-text-main mb-6 group-hover:text-brand-primary transition-colors leading-tight tracking-tight">
                    {project.title}
                  </h3>
                  <p className="text-base text-text-secondary leading-relaxed line-clamp-3 mb-8">
                    {project.description}
                  </p>
                  <div className="mt-auto flex items-center text-[11px] font-bold text-text-main uppercase tracking-widest opacity-40 group-hover:opacity-100 group-hover:text-brand-primary transition-all">
                    Explore Project <ArrowRight size={14} className="ml-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturedProjects;

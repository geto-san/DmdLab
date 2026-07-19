import { Radar, Hand } from 'lucide-react';

const projects = [
  {
    icon: Radar,
    title: 'WildWatch',
    tag: 'Conservation',
    description: 'A sighting and reporting tool for human-wildlife conflict, built for communities near park boundaries.',
  },
  {
    icon: Hand,
    title: 'Sign Language Avatar',
    tag: 'Accessibility',
    description: 'Translating speech and text into Uganda Sign Language through an animated, ML-driven avatar.',
  },
];

const ProjectsStrip = () => (
  <section className="bg-surface">
    <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-14">
      <span className="eyebrow text-signal-soft">Active projects</span>
      <h2 className="font-display font-semibold text-2xl text-white mt-2 mb-8">
        What the lab is building right now
      </h2>
      <div className="grid sm:grid-cols-2 gap-5">
        {projects.map((project) => (
          <div
            key={project.title}
            className="rounded-2xl border border-white/10 bg-surface-2 p-6 hover:border-signal/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-signal/15 flex items-center justify-center">
                <project.icon size={20} className="text-signal-soft" />
              </div>
              <span className="eyebrow text-amber">{project.tag}</span>
            </div>
            <h3 className="text-white font-display font-semibold text-lg mb-2">{project.title}</h3>
            <p className="text-white/55 text-sm leading-relaxed">{project.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ProjectsStrip;

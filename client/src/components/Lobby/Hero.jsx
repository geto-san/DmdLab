import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import NodeGraph from '../NodeGraph';

const Hero = () => (
  <section className="relative overflow-hidden bg-ink text-white">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(91,110,245,0.18),transparent_55%)]" />
    <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-20 lg:py-28 relative grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
      <div style={{ animation: 'fade-up 0.7s ease-out both' }}>
        <span className="eyebrow text-amber">Deepminds Research Lab · MUST</span>
        <h1 className="font-display font-semibold text-[2.5rem] sm:text-[3.2rem] leading-[1.05] tracking-tight mt-4 mb-6">
          Research that watches,<br />listens, and translates.
        </h1>
        <p className="text-white/65 text-lg leading-relaxed max-w-xl mb-8">
          A multidisciplinary lab of student researchers building applied ML —
          from reporting human-wildlife conflict in real time to translating
          speech into Uganda Sign Language.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 rounded-full bg-signal px-5 py-3 text-sm font-semibold hover:bg-signal-soft transition-colors"
          >
            Read our research
            <ArrowRight size={16} />
          </Link>
          <Link
            to="/videos"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold hover:bg-white/5 transition-colors"
          >
            Watch the lab
          </Link>
        </div>
      </div>

      <div className="relative h-[300px] lg:h-[380px]" style={{ animation: 'fade-up 0.9s ease-out 0.15s both' }}>
        <NodeGraph className="w-full h-full" />
      </div>
    </div>
  </section>
);

export default Hero;

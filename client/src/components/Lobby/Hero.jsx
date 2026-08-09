import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import NodeGraph from '../NodeGraph';
import { useContent } from '../../hooks/useContent';

const DEFAULT_HERO = {
  eyebrow: 'Deepminds Research Lab · MUST',
  title: { before: 'AI Research that ', highlight: 'Watches', after: ', Listens, and Translates.' },
  description: 'We are a multidisciplinary lab at MUST building applied ML solutions — from real-time wildlife conflict reporting to automated Sign Language translation.',
  primaryCta: { label: 'Explore Research', to: '/articles' },
  secondaryCta: { label: 'Watch Lab Activities', to: '/videos' },
  stats: [
    { value: '15+', label: 'Active Projects' },
    { value: '500+', label: 'Recorded Hours' },
  ],
};

const Hero = () => {
  const { data } = useContent('hero', DEFAULT_HERO);
  const title = data.title || {};

  return (
    <section className="relative overflow-hidden bg-white pt-32 pb-16 lg:pt-48 lg:pb-24">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative grid lg:grid-cols-2 gap-16 items-center">
        <div className="animate-fade-up">
          <span className="eyebrow">{data.eyebrow}</span>
          <h1 className="text-4xl sm:text-6xl font-bold text-ink leading-[1.1] mb-8">
            {title.before}
            <span className="text-brand-primary accent-soften">{title.highlight}</span>
            {title.after}
          </h1>
          <p className="text-lg text-ink/60 leading-relaxed max-w-xl mb-10">
            {data.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to={data.primaryCta?.to || '/articles'} className="btn-primary">
              {data.primaryCta?.label || 'Explore Research'}
              <ArrowRight size={18} />
            </Link>
            <Link to={data.secondaryCta?.to || '/videos'} className="btn-secondary">
              {data.secondaryCta?.label || 'Watch Lab Activities'}
            </Link>
          </div>

          <div className="mt-12 flex items-center gap-6 border-t border-gray-100 pt-8">
            {(data.stats || []).map((stat, idx) => (
              <div key={idx} className="flex items-center gap-6">
                {idx > 0 && <div className="w-px h-8 bg-gray-200" />}
                <div>
                  <div className="text-2xl font-bold text-ink">{stat.value}</div>
                  <div className="text-xs text-ink/40 uppercase tracking-wider font-semibold">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="relative z-10 bg-white rounded-3xl p-4 shadow-elevated border border-gray-100">
            <div className="aspect-video rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center">
              <NodeGraph className="w-full h-full" />
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-brand-primary/10 rounded-2xl -rotate-12" />
          <div className="absolute -bottom-6 -left-6 w-32 h-32 border-2 border-gray-100 rounded-3xl rotate-12" />
        </div>
      </div>
    </section>
  );
};

export default Hero;

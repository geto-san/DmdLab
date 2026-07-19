import { Mail, MapPin, Github, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const focusAreas = [
  { title: 'Deep Learning', sub: 'Neural networks & AI' },
  { title: 'Machine Learning', sub: 'Algorithms & models' },
  { title: 'Data Science', sub: 'Analysis & visualization' },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white/60 text-sm">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr] gap-10 pb-10 border-b border-white/10">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo-7402580_1920.png" alt="DMRLab" className="w-9 h-9 rounded-lg" />
              <div>
                <h3 className="m-0 text-white font-display font-semibold text-base">DMRLab</h3>
                <p className="m-0 eyebrow text-signal-soft/80">Research &amp; Innovation</p>
              </div>
            </div>
            <p className="max-w-sm mb-4 leading-relaxed">
              DeepMinds Research Lab is a multidisciplinary group of student researchers
              advancing machine learning and AI, from wildlife-conflict reporting to
              sign-language translation.
            </p>
            <div className="flex items-center gap-2 text-xs text-canopy">
              <span className="w-1.5 h-1.5 rounded-full bg-canopy" />
              Active
            </div>
          </div>

          {/* Research focus */}
          <div>
            <h4 className="text-white font-display font-semibold text-[15px] mb-4">Research focus</h4>
            <ul className="space-y-3">
              {focusAreas.map((area) => (
                <li key={area.title}>
                  <div className="text-white/80 font-medium">{area.title}</div>
                  <div className="text-xs text-white/45">{area.sub}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-display font-semibold text-[15px] mb-4">Contact</h4>
            <div className="space-y-3 mb-5">
              <a href="mailto:kimrichies@gmail.com" className="flex items-start gap-2.5 hover:text-white transition-colors">
                <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                <span>
                  kimrichies@gmail.com
                  <span className="block text-xs text-white/40">Dr. Richard Kimera</span>
                </span>
              </a>
              <a href="tel:+256774437989" className="flex items-start gap-2.5 hover:text-white transition-colors">
                <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                <span>
                  +256 774 437989
                  <span className="block text-xs text-white/40">Dr. Richard Kimera</span>
                </span>
              </a>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>
                  MUST
                  <span className="block text-xs text-white/40">Kihumuro Campus</span>
                </span>
              </div>
            </div>
            <div className="flex gap-2.5">
              <a
                href="https://github.com/"
                className="flex items-center justify-center w-9 h-9 rounded-lg border border-white/15 hover:border-white/30 hover:bg-white/5 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-[18px] h-[18px]" />
              </a>
              <a
                href="mailto:kimrichies@gmail.com"
                className="flex items-center justify-center w-9 h-9 rounded-lg border border-white/15 hover:border-white/30 hover:bg-white/5 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-[18px] h-[18px]" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <div>© {currentYear} DeepMinds Research Lab. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <Link to="/articles" className="hover:text-white/70 transition-colors">Articles</Link>
            <Link to="/videos" className="hover:text-white/70 transition-colors">Videos</Link>
            <span className="text-white/25">v9.1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

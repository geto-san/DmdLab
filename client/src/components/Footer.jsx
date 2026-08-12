import React, { useState } from 'react';
import { Mail, MapPin, Github, Phone, Youtube, Globe, ChevronDown, Check, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/useTheme';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { theme, setTheme } = useTheme();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('English');

  const languages = [
    'English', '简体中文', '日本語', '繁體中文', 'Español',
    'Français', 'Português', '한국어', 'Deutsch', 'हिन्दी'
  ];

  return (
    <footer className="bg-bg-surface border-t border-border-subtle pt-24 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20 text-left">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-8">
              <img src="/logo.png" alt="DMRLab Logo" className="w-9 h-9 dark:brightness-200" />
              <span className="text-2xl font-extrabold text-text-main tracking-tighter">DMRLab</span>
            </Link>
            <p className="text-base text-text-secondary leading-relaxed mb-8 max-w-xs">
              Advancing artificial intelligence research through interdisciplinary innovation and collaborative discovery at MUST.
            </p>
            <div className="flex gap-5">
              {[
                { icon: Github, href: "https://github.com" },
                { icon: Youtube, href: "#" },
                { icon: Mail, href: "mailto:kimrichies@gmail.com" }
              ].map((social, i) => (
                <a key={i} href={social.href} className="w-11 h-11 rounded-full border border-border-strong flex items-center justify-center text-text-secondary hover:text-brand-primary hover:border-brand-primary transition-all duration-300">
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-text-main uppercase tracking-[0.25em] mb-8 opacity-50">Research Focus</h4>
            <ul className="space-y-6">
              {[
                { label: "Deep Learning", desc: "Neural Architectures" },
                { label: "Sign Language AI", desc: "Computer Vision" },
                { label: "Wildlife Monitoring", desc: "Real-time ML" }
              ].map((item, i) => (
                <li key={i}>
                  <div className="text-sm font-bold text-text-main">{item.label}</div>
                  <div className="text-[11px] font-bold text-text-dim uppercase tracking-wider mt-1">{item.desc}</div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-text-main uppercase tracking-[0.25em] mb-8 opacity-50">Resources</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link to="/research" className="text-text-secondary hover:text-brand-primary transition-colors">Lab Projects</Link></li>
              <li><Link to="/publications" className="text-text-secondary hover:text-brand-primary transition-colors">Scientific Publications</Link></li>
              <li><Link to="/team" className="text-text-secondary hover:text-brand-primary transition-colors">Our Research Team</Link></li>
              <li><Link to="/contact" className="text-text-secondary hover:text-brand-primary transition-colors">Contact Information</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-text-main uppercase tracking-[0.25em] mb-8 opacity-50">Location</h4>
            <div className="flex items-start gap-4 mb-6">
              <MapPin size={20} className="text-brand-primary shrink-0 accent-soften" />
              <div className="text-sm">
                <div className="font-bold text-text-main">MUST Kihumuro Campus</div>
                <div className="text-text-secondary mt-1">Block B, Research Wing</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Phone size={20} className="text-brand-primary shrink-0 accent-soften" />
              <div className="text-sm font-bold text-text-main">+256 774 437989</div>
            </div>
          </div>
        </div>

        <div className="border-t border-border-main pt-12 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-wrap items-center justify-center gap-8 text-text-dim">
            <small className="text-[11px] font-bold uppercase tracking-[0.2em]">
              © {currentYear} <a href="/" className="hover:text-brand-primary transition-colors">DeepMinds Research Lab</a>
            </small>
            <div className="hidden sm:block w-px h-3 bg-border-strong" />
            <small className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em]">
              <Shield size={14} className="text-brand-primary accent-soften" />
              <a href="#" className="hover:text-brand-primary transition-colors">SOC 2 Certified</a>
            </small>
          </div>

          <div className="flex items-center gap-10">
            <div className="flex items-center gap-4 bg-bg-surface-hover p-1.5 rounded-full relative">
               <motion.div
                 className="absolute bg-bg-elevated rounded-full shadow-soft w-9 h-9"
                 animate={{ left: theme === 'system' ? 6 : theme === 'light' ? 50 : 94 }}
                 transition={{ type: 'spring', stiffness: 350, damping: 30 }}
               />

               {['system', 'light', 'dark'].map((t) => (
                 <button
                   key={t}
                   onClick={() => setTheme(t)}
                   className={`relative z-10 w-9 h-9 flex items-center justify-center transition-colors ${theme === t ? 'text-brand-primary' : 'text-text-dim hover:text-text-main'}`}
                   aria-label={`${t} theme`}
                 >
                   <span className="text-sm">{t === 'system' ? '🖥' : t === 'light' ? '☉' : '☾'}</span>
                 </button>
               ))}
            </div>

            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-3 px-6 py-2.5 bg-bg-surface-hover border border-transparent hover:border-border-strong rounded-full text-[10px] font-bold uppercase tracking-[0.25em] text-text-secondary transition-all"
              >
                <Globe size={16} className="text-brand-primary accent-soften" />
                {currentLang}
                <ChevronDown size={14} className={`transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.96 }}
                    className="absolute bottom-full right-0 mb-8 bg-bg-elevated border border-border-strong rounded-3xl shadow-elevated overflow-hidden z-50 min-w-[14rem] p-3"
                  >
                    <div className="max-h-72 overflow-y-auto scrollbar-hide">
                      {languages.map((lang) => (
                        <button
                          key={lang}
                          onClick={() => {
                            setCurrentLang(lang);
                            setIsLangOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-colors ${currentLang === lang ? 'bg-primary-soft text-brand-primary' : 'text-text-secondary hover:bg-bg-surface-hover'}`}
                        >
                          {lang}
                          {currentLang === lang && <Check size={14} />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

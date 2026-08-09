import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from './Logo';
import NavLinks from './NavLinks';
import MobileMenuButton from './MobileMenuButton';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const createRipple = (event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'ripple ripple-animate';
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(59, 130, 246, 0.1);
      transform: scale(0);
      animation: ripple-animation 0.6s linear;
      pointer-events: none;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      z-index: 1;
    `;

    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  return (
    <>
      <style>{`
        @keyframes ripple-animation {
          0% { transform: scale(0); opacity: 0.6; }
          100% { transform: scale(2); opacity: 0; }
        }
      `}</style>

      <header className={`fixed top-0 z-50 w-full transition-all duration-300 border-b h-16 sm:h-20 ${
        isMenuOpen
          ? 'bg-bg-main border-transparent'
          : 'bg-bg-main/80 backdrop-blur-xl border-border-subtle shadow-soft'
      }`}>
        <div className="max-w-[1920px] h-full mx-auto flex items-center justify-between px-6 lg:px-12">

          <div className="flex items-center">
            <Logo />
          </div>

          <nav className="hidden lg:flex items-center gap-12 ml-auto mr-12">
             <Link to="/research" className="link-significa py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-text-secondary hover:text-text-main transition-colors">Research</Link>
             <Link to="/publications" className="link-significa py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-text-secondary hover:text-text-main transition-colors">Publications</Link>
             <Link to="/team" className="link-significa py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-text-secondary hover:text-text-main transition-colors">Team</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/contact"
              className="hidden sm:inline-flex btn-primary px-8 h-11 text-[10px] uppercase tracking-[0.2em]"
            >
              Join Lab
            </Link>

            <MobileMenuButton
              isMenuOpen={isMenuOpen}
              toggleMenu={() => setIsMenuOpen(!isMenuOpen)}
              createRipple={createRipple}
            />
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 transition-all"
            />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {isMenuOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: [0.9, 0, 0.05, 1] }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[450px] lg:w-[500px] bg-bg-elevated z-40 shadow-elevated flex flex-col border-l border-border-strong"
            >
              <div className="flex items-center justify-between px-6 lg:px-12 h-16 sm:h-20 shrink-0 border-b border-border-subtle">
                 <div className="w-8 h-8">
                   <img src="/logo-7402580_1920.png" alt="Icon" className="w-full h-full object-contain dark:brightness-200" />
                 </div>
                 <div className="flex items-center gap-4">
                    <Link
                      to="/contact"
                      onClick={() => setIsMenuOpen(false)}
                      className="btn-primary bg-text-main text-bg-main hover:bg-text-main/90 h-10 px-6 text-[10px] uppercase tracking-[0.2em]"
                    >
                      Join Lab
                    </Link>
                    <MobileMenuButton
                      isMenuOpen={true}
                      toggleMenu={() => setIsMenuOpen(false)}
                      createRipple={createRipple}
                    />
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 lg:px-12 py-12 scrollbar-hide">
                <div className="space-y-16">
                  <div>
                    <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-text-dim">Laboratory Hub</p>
                    <ul className="space-y-6 list-none">
                      <NavLinks isMobile onLinkClick={() => setIsMenuOpen(false)} />
                    </ul>
                  </div>

                  <div>
                    <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-text-dim">Resources</p>
                    <ul className="space-y-4 text-2xl font-bold tracking-tighter list-none">
                      <li><Link to="/about" onClick={() => setIsMenuOpen(false)} className="link-significa py-1 block text-text-main">Mission and values</Link></li>
                      <li><a href="#" className="link-significa py-1 block text-text-main">Lab Culture</a></li>
                      <li><a href="#" className="link-significa py-1 block text-text-main">How we collaborate</a></li>
                    </ul>
                  </div>

                  <div>
                    <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-text-dim">Network</p>
                    <ul className="space-y-4 text-2xl font-bold tracking-tighter list-none">
                      <li><a href="https://github.com" target="_blank" rel="noreferrer" className="link-significa py-1 block text-text-main">Github</a></li>
                      <li><a href="https://youtube.com" target="_blank" rel="noreferrer" className="link-significa py-1 block text-text-main">YouTube</a></li>
                    </ul>
                  </div>
                </div>

                <div className="mt-20 pt-8 border-t border-border-subtle">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-dim mb-8">Initiatives</p>
                  <Link
                    to="/contact"
                    onClick={() => setIsMenuOpen(false)}
                    className="group text-4xl sm:text-5xl font-extrabold text-text-main hover:text-brand-primary transition-all tracking-tighter inline-flex items-center gap-4"
                  >
                    Get in touch <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Header;

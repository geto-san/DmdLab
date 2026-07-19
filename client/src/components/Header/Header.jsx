import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import NavLinks from './NavLinks';
import MobileMenuButton from './MobileMenuButton';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-ink/90 backdrop-blur-md transition-shadow ${
        scrolled ? 'shadow-[0_1px_0_0_rgba(255,255,255,0.08)]' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo />
          <nav className="hidden md:flex items-center gap-9">
            <NavLinks />
          </nav>
          <div className="hidden md:block">
            <Link
              to="/articles"
              className="inline-flex items-center rounded-full bg-signal px-4 py-2 text-[13px] font-semibold text-white hover:bg-signal-soft transition-colors"
            >
              Explore research
            </Link>
          </div>
          <div className="md:hidden">
            <MobileMenuButton isMenuOpen={isMenuOpen} toggleMenu={() => setIsMenuOpen(!isMenuOpen)} />
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-white/10">
          <div className="px-4 py-3 space-y-1">
            <NavLinks isMobile onLinkClick={() => setIsMenuOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

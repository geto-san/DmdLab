import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import NavLinks from './NavLinks';
import MobileMenuButton from './MobileMenuButton';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const createRipple = (event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const existingRipples = button.querySelectorAll('.ripple');
    existingRipples.forEach(ripple => ripple.remove());

    const ripple = document.createElement('span');
    ripple.className = 'ripple ripple-animate';
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(85, 85, 85, 0.4);
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
    <AnimatePresence>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 relative">
        <style>{`
          @keyframes ripple-animation {
            0% {
              transform: scale(0);
              opacity: 0.6;
            }
            100% {
              transform: scale(2);
              opacity: 0;
            }
          }
          .nav-link {
            position: relative;
            overflow: hidden;
          }
        `}</style>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo createRipple={createRipple} />
            <nav className="hidden md:flex items-center space-x-8">
              <NavLinks createRipple={createRipple} />
            </nav>
            <div className="md:hidden">
              <MobileMenuButton
                isMenuOpen={isMenuOpen}
                toggleMenu={() => setIsMenuOpen(!isMenuOpen)}
                createRipple={createRipple}
              />
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-2 space-y-1">
              <NavLinks createRipple={createRipple} isMobile onLinkClick={() => setIsMenuOpen(false)} />
            </div>
          </div>
        )}
      </header>
    </AnimatePresence>
  );
};

export default Header;

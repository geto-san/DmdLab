const MobileMenuButton = ({ isMenuOpen, toggleMenu }) => (
  <button
    onClick={toggleMenu}
    className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
    aria-label="Toggle menu"
    aria-expanded={isMenuOpen}
  >
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {isMenuOpen ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      )}
    </svg>
  </button>
);

export default MobileMenuButton;

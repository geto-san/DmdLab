import React from 'react';

const MobileMenuButton = ({ isMenuOpen, toggleMenu, createRipple }) => (
  <button
    onClick={e => {
      createRipple && createRipple(e);
      toggleMenu();
    }}
    className="group relative inline-flex items-center justify-center w-11 h-11 rounded-full overflow-hidden outline-none transition-all hover:ring-4 ring-primary/10 active:scale-[0.95] bg-white border border-gray-100 hover:border-gray-300 z-50 shrink-0"
    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
  >
    <i className="flex items-center justify-center">
      {isMenuOpen ? (
        <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="m4.5 4.5 7 7M4.5 11.5l7-7" stroke="currentColor" strokeWidth="1.2"></path>
          <path d="M4.4 4.3c0 .4.2.8.4 1.1l.8 1c.4.4.7.8 1.2 1.1l1.5.8c.6.2 1 .6 1.5 1l1 .6.7 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"></path>
          <path d="M11.3 5c0 .2-.3.4-.5.6l-.5.9c-.2.4-.4.5-.7.8l-1 .8c-.6.3-1.1.6-1.5 1-.6.7-1.4 1.2-2.1 1.6-.4.1-.7.4-.7.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"></path>
        </svg>
      ) : (
        <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M3 7h2v2H3zM7 7h2v2H7zM11 7h2v2h-2z"></path>
          <path d="M8.6 8.8c-.5 0-1.2.1-1.4-.4 0-.2-.2-.7.1-.7.2 0 .2-.3.5-.3.1 0 .5 0 .6.2M11.7 8.6l-.3-.3V8c0-.3.1-.3.4-.4.2-.1.5-.2.7 0l.2.4v.5M4.3 8.6c.2 0 .3-.2.4-.3V8c0-.3-.2-.3-.4-.4-.2-.1-.6-.2-.8 0l-.1.4v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"></path>
        </svg>
      )}
    </i>
  </button>
);

export default MobileMenuButton;

import React from 'react';
import { Link } from "react-router-dom";

const Logo = () => (
  <Link to="/" className="flex items-center gap-4 group">
    <div className="relative w-9 h-9 shrink-0 transition-transform duration-500 group-hover:scale-110">
      <img src="/logo.png" alt="Logo" className="w-full h-full object-contain relative z-10 dark:brightness-200" />
      <div className="absolute inset-0 bg-brand-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
    <div className="flex flex-col">
      <span className="text-base font-bold text-text-main leading-none tracking-tighter">DeepMinds <span className="text-brand-primary accent-soften">rLab</span></span>
      <span className="text-[9px] text-text-dim font-bold uppercase tracking-[0.3em] mt-1.5">MUST · Research Hub</span>
    </div>
  </Link>
);

export default Logo;

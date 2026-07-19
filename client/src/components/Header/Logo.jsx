import { Link } from "react-router-dom";

const Logo = () => (
  <Link to="/" className="flex items-center gap-3 group">
    <img src="/logo-7402580_1920.png" alt="DMRLab" className="w-9 h-9 rounded-lg" />
    <div className="flex flex-col leading-none">
      <span className="font-display font-semibold text-[15px] tracking-tight text-white">
        DeepMinds Research Lab
      </span>
      <span className="eyebrow text-signal-soft/80 mt-1">DMRLab</span>
    </div>
  </Link>
);

export default Logo;

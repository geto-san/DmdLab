import { Link } from "react-router-dom";

const Logo = () => (
  <Link to="/" className="flex items-center space-x-3 nav-link">
    <img src="/logo-7402580_1920.png" alt="Logo" className="w-10 h-10" />
    <div className="flex flex-col">
      <h1 className="text-xl font-bold text-gray-900 tracking-tight">DeepsMinds Research Lab</h1>
      <span className="text-xs text-gray-600 font-medium tracking-wide">(DMRLAb)</span>
    </div>
  </Link>
);

export default Logo;

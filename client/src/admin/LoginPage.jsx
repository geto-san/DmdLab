import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, ArrowLeft, ShieldCheck } from 'lucide-react';
import API_BASE from '../utils/api';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!username) {
      newErrors.username = 'Username is required';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error((data && data.error) || res.statusText || 'Login failed');
      if (data && data.token) {
        onLogin && onLogin(data.token);
      } else {
        throw new Error('No token returned');
      }
    } catch (err) {
      setErrors({ form: err.message || String(err) });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (hasError) =>
    `block w-full pl-11 pr-3 py-3 text-[15px] rounded-xl border bg-white outline-none transition-colors ${
      hasError
        ? 'border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-400'
        : 'border-black/10 focus:ring-2 focus:ring-signal/15 focus:border-signal'
    }`;

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-paper">
      {/* Brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-ink text-white p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(91,110,245,0.22),transparent_55%)]" />
        <div className="relative">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
            <ArrowLeft size={16} />
            Back to site
          </Link>
          <div className="flex items-center gap-3 mt-14">
            <img src="/logo-7402580_1920.png" alt="DMRLab" className="w-10 h-10 rounded-lg" />
            <div className="flex flex-col leading-none">
              <span className="font-display font-semibold text-base">DeepMinds Research Lab</span>
              <span className="eyebrow text-signal-soft/80 mt-1">Admin console</span>
            </div>
          </div>
          <h1 className="font-display font-semibold text-[2.1rem] leading-[1.15] tracking-tight mt-10 max-w-sm">
            Manage the lab&apos;s articles, videos, and announcements in one place.
          </h1>
          <p className="text-white/60 text-[15px] leading-relaxed max-w-sm mt-4">
            Sign in with your admin credentials to publish research, curate the
            video catalog, and keep the public site up to date.
          </p>
        </div>
        <div className="relative flex items-center gap-2.5 text-xs text-white/45">
          <ShieldCheck size={16} className="text-canopy" />
          Access is restricted to authorized lab administrators.
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-5 sm:px-8 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <img src="/logo-7402580_1920.png" alt="DMRLab" className="w-10 h-10 rounded-lg" />
            <div className="flex flex-col leading-none">
              <span className="font-display font-semibold text-[15px] text-ink-text">DeepMinds Research Lab</span>
              <span className="eyebrow text-signal mt-1">Admin console</span>
            </div>
          </div>

          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-ink mb-5">
            <Lock className="w-5 h-5 text-amber" />
          </div>
          <h2 className="font-display font-semibold text-2xl text-ink-text mb-2">Sign in to admin</h2>
          <p className="text-muted text-sm mb-8">Enter your credentials to access the dashboard.</p>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {errors.form && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                {errors.form}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-[13px] font-medium text-ink-text mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-[18px] w-[18px] text-muted-2" />
                </div>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errors.username) setErrors({ ...errors, username: '' });
                  }}
                  className={inputClass(errors.username)}
                  placeholder="admin"
                />
              </div>
              {errors.username && <p className="mt-1.5 text-xs text-red-600">{errors.username}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-[13px] font-medium text-ink-text mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-[18px] w-[18px] text-muted-2" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  className={`${inputClass(errors.password)} pr-11`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-2 hover:text-muted focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-signal px-5 py-3 text-sm font-semibold text-white hover:bg-signal-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-xs text-muted-2 mt-8">
            Having trouble signing in? Contact the lab&apos;s system administrator.
          </p>
        </div>
      </div>
    </div>
  );
}

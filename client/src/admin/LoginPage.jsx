import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import API_BASE from '../utils/api';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        onLogin(data.token);
      } else {
        setErrors({ form: data.message || 'Authentication failed' });
      }
    } catch (err) {
      console.error('Login request failed:', err);
      setErrors({ form: 'Network error. Please try again later.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main px-6 py-12 transition-colors duration-500">
      <div className="w-full max-w-md animate-fade-up">
        <div className="bg-bg-surface rounded-[2.5rem] shadow-elevated border border-border-main p-10 lg:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div className="text-center mb-10 relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-primary/10 rounded-2xl mb-6 accent-soften">
              <ShieldCheck className="w-8 h-8 text-brand-primary" />
            </div>
            <h1 className="text-3xl font-extrabold text-text-main mb-2 tracking-tight">Admin Portal</h1>
            <p className="text-sm font-bold text-text-dim uppercase tracking-widest">DeepMinds Research Lab</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            {errors.form && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-500 text-xs font-bold uppercase tracking-widest text-center">
                {errors.form}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-main uppercase tracking-[0.2em] ml-1">Identity</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dim" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-bg-main border border-border-main rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-text-main focus:outline-none focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary transition-all"
                  placeholder="Username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-main uppercase tracking-[0.2em] ml-1">Access Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dim" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-bg-main border border-border-main rounded-2xl py-4 pl-12 pr-12 text-sm font-bold text-text-main focus:outline-none focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary transition-all"
                  placeholder="Password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-main transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full justify-center py-4 text-xs uppercase tracking-widest"
            >
              {isLoading ? 'Verifying...' : 'Sign In to Dashboard'}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-[10px] font-bold text-text-dim uppercase tracking-[0.2em]">
          Authorized Access Only · © 2026 MUST
        </p>
      </div>
    </div>
  );
}

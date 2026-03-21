import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import FAFLogo from '../assets/FAF-Logo.png';
import { authApi } from '../api/auth.api';
import { useTranslation } from 'react-i18next';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email) {
      setError(t('auth.email_required'));
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError(t('auth.email_invalid'));
      return;
    }

    setLoading(true);

    try {
      await authApi.forgotPassword(email);
      
      // Navigate to reset password page with email
      navigate('/reset-password', {
        state: { email }
      });
    } catch (err) {
      console.error('Forgot password failed:', err);
      setError(err.response?.data?.error || t('auth.email_not_found'));
    } finally {
      setLoading(false);
    }
  };

  // Lock scroll for app feel
  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    return () => {
        document.documentElement.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="min-h-[100dvh] h-screen bg-slate-950 font-sans text-slate-200 selection:bg-purple-500/30 flex items-center justify-center relative overflow-hidden">
      {/* --- GLOBAL WEB3 BACKGROUND --- */}
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] left-[60%] w-[50%] h-[50%] bg-purple-600/10 rounded-full mix-blend-screen blur-[120px] animate-blob"></div>
          <div className="absolute bottom-[10%] right-[30%] w-[60%] h-[60%] bg-blue-600/10 rounded-full mix-blend-screen blur-[120px] animate-blob animation-delay-4000"></div>
          
          {/* 3D Grid Floor positioned below content */}
          <div className="absolute bottom-[-10%] w-[200%] left-[-50%] h-[60%] web3-grid opacity-30 z-0"></div>
          
          {/* Central Orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] glow-orb-bg rounded-full z-0 pointer-events-none mix-blend-screen animate-[pulse-ring_10s_cubic-bezier(0.4,0,0.6,1)_infinite]"></div>
      </div>

      {/* Static Noise Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-10 pointer-events-none"></div>

      {/* Top Navigation / Status Bar (Terminal style) */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20 pointer-events-auto transition-opacity duration-300">
          <Link to="/" className="flex items-center gap-2 group cursor-crosshair">
              <svg className="w-5 h-5 text-purple-500 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              <span className="font-mono text-xs uppercase tracking-widest text-slate-400 group-hover:text-purple-400 transition-colors">{t('auth.cancel_reset')}</span>
          </Link>
          <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">{t('auth.recovery_system_active')}</span>
          </div>
      </div>

      <main className={`w-full max-w-md px-6 relative z-20 ${loading ? "pointer-events-none opacity-60" : ""}`}>
        <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight text-glitch-effect cursor-crosshair inline-block mb-2">
              {t('auth.reset_password_title')}
            </h1>
            <p className="text-sm font-mono text-slate-400">
              {t('auth.forgot_password_subtitle')}
            </p>
        </div>

        <div className="glass-card bg-slate-900/50 border border-slate-700/50 rounded-3xl p-8 sm:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl relative">
            {/* Inner glowing accent */}
            <div className="absolute top-0 right-1/4 w-1/2 h-[1px] bg-gradient-to-l from-transparent via-blue-500 to-transparent opacity-50"></div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-mono text-slate-400 uppercase tracking-widest flex justify-between">
                {t('auth.email_label')}
              </label>
              <div className="relative group/input">
                <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-md opacity-0 group-focus-within/input:opacity-100 transition-opacity"></div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="node@protocol.xyz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full relative bg-slate-950/80 hover:bg-slate-900 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-medium text-white placeholder:text-slate-600 focus:bg-slate-900 focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all shadow-inner"
                />
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within/input:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-medium flex items-start gap-2">
                <svg
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full relative group/btn overflow-hidden glass-card bg-slate-900 border border-blue-500/50 text-white font-mono font-bold uppercase tracking-widest py-4 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('auth.sending_code')}
                </span>
              ) : (
                <>
                  <span>{t('auth.request_reset')}</span>
                  <svg className="w-5 h-5 text-blue-400 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
            <div className="grid grid-cols-2 gap-3">
                <button type="button" className="flex items-center justify-center gap-2 bg-slate-900 border border-white/10 hover:border-white/30 rounded-lg py-3 transition-all text-xs font-mono font-bold text-slate-300 hover:text-white cursor-crosshair group/btn2">
                    <span className="text-white group-hover/btn2:scale-110 transition-transform">G</span> GOOGLE_ID
                </button>
                <button type="button" className="flex items-center justify-center gap-2 bg-slate-900 border border-white/10 hover:border-white/30 rounded-lg py-3 transition-all text-xs font-mono font-bold text-slate-300 hover:text-white cursor-crosshair group/btn2">
                    <span className="text-blue-500 group-hover/btn2:scale-110 transition-transform">in</span> LINKED_IN
                </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <Link
              to="/signin"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors cursor-crosshair group/back"
            >
              <svg className="w-4 h-4 text-slate-500 group-hover/back:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t('auth.back_to_login')}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import FAFLogo from "../assets/FAF-Logo.png";
import Loading from "../components/Loading";
import { authApi } from "../api/auth.api";
import { useAuth } from "../auth/AuthContext";
import { useTranslation } from "react-i18next";
import { useToast } from "../contexts/ToastContext";

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const toast = useToast();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const { login, getHomeRoute } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await authApi.login({ email, password });

      const token = res.token;
      if (!token) {
        throw new Error("Token not found");
      }

      // Use AuthContext login - it will fetch user and set state
      const userData = await login(token);

      // Navigate based on role using helper
      const homeRoute = getHomeRoute(userData.role);
      navigate(homeRoute);
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error;
      const status = err.response?.status;
      if (status === 401) {
        const errorMsg = "Email hoặc mật khẩu không chính xác. Vui lòng thử lại.";
        setError(errorMsg);
        toast.error(errorMsg);
      } else {
        const errorMsg = message || "Đã xảy ra lỗi. Vui lòng thử lại sau.";
        setError(errorMsg);
        toast.error(errorMsg);
      }
      // Scroll to top of form to show error
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return (
        <div className="min-h-screen bg-[#030014] text-slate-300 font-sans selection:bg-purple-500/30 selection:text-white relative overflow-hidden flex items-center justify-center p-4">
            {/* ... Web3 Background (from original Phase 2 implementation) ... */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-slate-900 to-blue-900/20"></div>
                
                {/* Animated Orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full mix-blend-screen filter blur-3xl animate-blob"></div>
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-emerald-600/20 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000"></div>

                {/* Web3 Grid */}
                <div className="absolute inset-0 web3-grid opacity-20"></div>
                
                {/* Cyberpunk Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(3,0,20,0.8)_100%)]"></div>
            </div>

            <main className="w-full max-w-md relative z-10 group">
                {/* Terminal Header */}
                <div className="mb-6 border-b border-purple-500/30 pb-4 flex justify-between items-end">
                    <div>
                        <div className="text-purple-500 text-xs font-mono mb-1 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                            {t('auth.system_active')}
                        </div>
                        <h1 className="text-3xl font-black text-white uppercase tracking-tighter text-glitch-effect" data-text={t('auth.signin_title')}>
                            {t('auth.signin_title')}
                        </h1>
                    </div>
                    <Link to="/" className="text-slate-500 hover:text-white transition-colors cursor-crosshair">
                        <svg className="w-6 h-6 hover:rotate-90 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </Link>
                </div>

                {/* Main Auth Container */}
                <div className="glass-card bg-slate-900/50 border border-slate-700/50 p-8 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl relative overflow-hidden">
                    {/* Inner glowing accent */}
                    <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-mono text-slate-400 uppercase tracking-widest flex justify-between">
                                {t('auth.email_label')}
                            </label>
                            <div className="relative group/input">
                                <div className="absolute inset-0 bg-purple-500/20 rounded-xl blur-md opacity-0 group-focus-within/input:opacity-100 transition-opacity"></div>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="node@protocol.xyz"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full relative bg-slate-950/80 hover:bg-slate-900 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-medium text-white placeholder:text-slate-600 focus:bg-slate-900 focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all shadow-inner"
                                    required
                                />
                                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within/input:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h18v14H3z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7l9 6 9-6" />
                                </svg>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-mono text-slate-400 uppercase tracking-widest flex justify-between">
                                {t('auth.password_label')}
                            </label>
                            <div className="relative group/input">
                                <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-md opacity-0 group-focus-within/input:opacity-100 transition-opacity"></div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full relative bg-slate-950/80 hover:bg-slate-900 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-mono text-white placeholder:text-slate-600 focus:bg-slate-900 focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all shadow-inner tracking-widest"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors cursor-crosshair z-10"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-5-10-7 0-.695.395-1.77 1.17-2.992m4.229-3.63A9.966 9.966 0 0112 5c5.523 0 10 5 10 7 0 1.012-.54 2.41-1.558 3.77M15 12a3 3 0 00-3-3m0 0a2.99 2.99 0 00-1.354.322m0 0L9.171 9.171M9.171 9.171 4 4m5.646 5.646L4 4m9.354 9.354L20 20" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs font-mono pb-2">
                            <label className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors cursor-crosshair">
                                <input type="checkbox" className="rounded border-white/20 bg-slate-900/50 text-purple-500 focus:ring-purple-500/50" />
                                {t('auth.keep_logged_in')}
                            </label>
                            <Link to="/forgot-password" className="text-slate-400 hover:text-white hover:underline transition-all decoration-purple-500/50 underline-offset-4">
                                {t('auth.forgot_password')}
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full relative group/btn overflow-hidden glass-card bg-slate-900 border border-purple-500/50 text-white font-mono font-bold uppercase tracking-widest py-4 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {t('auth.executing')}
                                </span>
                            ) : (
                                <>
                                    <span>{t('auth.submit_signin')}</span>
                                    <svg className="w-5 h-5 text-purple-400 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </>
                            )}
                        </button>
                    </form>


                </div>
                
                <div className="mt-8 text-center text-slate-500 font-mono text-xs">
                    {t('auth.no_account')} <Link to="/signup" className="text-purple-400 hover:text-purple-300 hover:underline transition-all">{t('auth.register_now')}</Link>
                </div>
            </main>
        </div>
    );
};

export default Signin;

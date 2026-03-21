import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import FAFLogo from "../assets/FAF-Logo.png";
import { authApi } from "../api/auth.api";
import { useTranslation } from "react-i18next";

const Signup = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [role, setRole] = useState("worker");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    tos: false,
  });
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirm = () => setShowConfirm((prev) => !prev);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.warning("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.warning("Mật khẩu xác nhận không khớp");
      return;
    }

    if (formData.password.length < 6) {
      toast.warning("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (!formData.tos) {
      toast.warning("Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách bảo mật");
      return;
    }

    setLoading(true);
    // Call API to register
    try {
      const response = await authApi.register({
        email: formData.email,
        password: formData.password,
        role,
      });
      // Navigate to OTP page with email
      navigate("/otp", {
        state: { email: formData.email },
      });
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Đăng ký thất bại");
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
              <span className="font-mono text-xs uppercase tracking-widest text-slate-400 group-hover:text-purple-400 transition-colors">{t('auth.cancel_registration')}</span>
          </Link>
          <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">{t('auth.registration_system_active')}</span>
          </div>
      </div>

      <main className={`w-full max-w-2xl px-6 relative z-20 overflow-y-auto max-h-[100dvh] pt-24 pb-12 custom-scrollbar ${loading ? "pointer-events-none opacity-60" : ""}`}>
        <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight text-glitch-effect cursor-crosshair inline-block mb-2">
              {t('auth.signup_title')}
            </h1>
            <p className="text-sm font-mono text-slate-400">
              {t('auth.signup_subtitle')}{" "}
              <Link
                to="/signin"
                className="text-white border-b border-transparent hover:border-purple-400 hover:text-purple-400 transition-all font-semibold"
              >
                {t('auth.login_now')}
              </Link>
            </p>
        </div>

        <div className="glass-card bg-slate-900/50 border border-slate-700/50 rounded-3xl p-6 sm:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl relative">
            {/* Inner glowing accent */}
            <div className="absolute top-0 right-1/4 w-1/2 h-[1px] bg-gradient-to-l from-transparent via-blue-500 to-transparent opacity-50"></div>

          <div className="grid grid-cols-2 gap-3 mb-8">
            <button
              type="button"
              onClick={() => setRole("worker")}
              className={`flex flex-col items-center justify-center gap-2 rounded-2xl border px-3 py-4 font-mono font-bold transition-all text-xs sm:text-sm cursor-crosshair group relative overflow-hidden ${
                role === "worker"
                  ? "bg-slate-900 border-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                  : "bg-slate-950/80 border-white/10 text-slate-500 hover:border-white/30 hover:text-slate-300"
              }`}
            >
              {role === "worker" && <div className="absolute inset-0 bg-blue-500/10 animate-pulse"></div>}
              <svg className={`w-6 h-6 z-10 ${role === "worker" ? 'text-blue-400' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 21v-1a6 6 0 1112 0v1" />
              </svg>
              <span className="z-10 relative">{t('auth.role_worker')}</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("employer")}
              className={`flex flex-col items-center justify-center gap-2 rounded-2xl border px-3 py-4 font-mono font-bold transition-all text-xs sm:text-sm cursor-crosshair group relative overflow-hidden ${
                role === "employer"
                  ? "bg-slate-900 border-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                  : "bg-slate-950/80 border-white/10 text-slate-500 hover:border-white/30 hover:text-slate-300"
              }`}
            >
              {role === "employer" && <div className="absolute inset-0 bg-purple-500/10 animate-pulse"></div>}
              <svg className={`w-6 h-6 z-10 ${role === "employer" ? 'text-purple-400' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="z-10 relative">{t('auth.role_employer')}</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-xs font-mono text-slate-400 uppercase tracking-widest flex justify-between">
                    {t('auth.fullname_label')}
                </label>
                <div className="relative group/input">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-md opacity-0 group-focus-within/input:opacity-100 transition-opacity"></div>
                    <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder="SysAdmin"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full relative bg-slate-950/80 hover:bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder:text-slate-600 focus:bg-slate-900 focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all shadow-inner"
                    />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-mono text-slate-400 uppercase tracking-widest flex justify-between">
                    {t('auth.email_label')}
                </label>
                <div className="relative group/input">
                    <div className="absolute inset-0 bg-purple-500/20 rounded-xl blur-md opacity-0 group-focus-within/input:opacity-100 transition-opacity"></div>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="node@protocol.xyz"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full relative bg-slate-950/80 hover:bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder:text-slate-600 focus:bg-slate-900 focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all shadow-inner"
                    />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-xs font-mono text-slate-400 uppercase tracking-widest flex justify-between">
                    {t('auth.password_label')}
                </label>
                <div className="relative group/input">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-md opacity-0 group-focus-within/input:opacity-100 transition-opacity"></div>
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full relative bg-slate-950/80 hover:bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder:text-slate-600 focus:bg-slate-900 focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all shadow-inner tracking-widest"
                    />
                    <button type="button" onClick={togglePassword} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors cursor-crosshair z-10">
                        {showPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-5-10-7 0-.695.395-1.77 1.17-2.992m4.229-3.63A9.966 9.966 0 0112 5c5.523 0 10 5 10 7 0 1.012-.54 2.41-1.558 3.77M15 12a3 3 0 00-3-3m0 0a2.99 2.99 0 00-1.354.322m0 0L9.171 9.171M9.171 9.171 4 4m5.646 5.646L4 4m9.354 9.354L20 20" /></svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        )}
                    </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-xs font-mono text-slate-400 uppercase tracking-widest flex justify-between">
                    {t('auth.confirm_password_label')}
                </label>
                <div className="relative group/input">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-md opacity-0 group-focus-within/input:opacity-100 transition-opacity"></div>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        placeholder="••••••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full relative bg-slate-950/80 hover:bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder:text-slate-600 focus:bg-slate-900 focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all shadow-inner tracking-widest"
                    />
                    <button type="button" onClick={toggleConfirm} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors cursor-crosshair z-10">
                        {showConfirm ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-5-10-7 0-.695.395-1.77 1.17-2.992m4.229-3.63A9.966 9.966 0 0112 5c5.523 0 10 5 10 7 0 1.012-.54 2.41-1.558 3.77M15 12a3 3 0 00-3-3m0 0a2.99 2.99 0 00-1.354.322m0 0L9.171 9.171M9.171 9.171 4 4m5.646 5.646L4 4m9.354 9.354L20 20" /></svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        )}
                    </button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs font-mono text-slate-400 mt-2">
              <input
                type="checkbox"
                id="tos"
                name="tos"
                checked={formData.tos}
                onChange={handleChange}
                className="mt-1 flex-shrink-0 cursor-crosshair rounded border-white/20 bg-slate-900/50 text-purple-500 focus:ring-purple-500/50"
              />
              <label htmlFor="tos" className="cursor-crosshair leading-relaxed">
                {t('auth.tos_text_1')} <span className="text-purple-400">{t('auth.tos_text_2')}</span> {t('auth.tos_text_3')} <span className="text-purple-400">{t('auth.tos_text_4')}</span>.
              </label>
            </div>

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
                        {t('auth.processing')}
                    </span>
                ) : (
                    <>
                        <span>{t('auth.submit_signup')}</span>
                        <svg className="w-5 h-5 text-blue-400 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </>
                )}
            </button>
          </form>

          <div className="mt-8 flex flex-col gap-4 text-center">
              <div className="flex items-center gap-3 opacity-50">
                  <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-white"></span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white">{t('auth.or_signup_with')}</span>
                  <span className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-white"></span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                  <button type="button" className="flex items-center justify-center gap-2 bg-slate-900 border border-white/10 hover:border-white/30 rounded-lg py-3 transition-all text-[10px] font-mono font-bold text-slate-300 hover:text-white cursor-crosshair group/btn2">
                      <span className="text-white group-hover/btn2:scale-110 transition-transform">G</span> GOOGLE
                  </button>
                  <button type="button" className="flex items-center justify-center gap-2 bg-slate-900 border border-white/10 hover:border-white/30 rounded-lg py-3 transition-all text-[10px] font-mono font-bold text-slate-300 hover:text-white cursor-crosshair group/btn2">
                      <span className="text-blue-500 group-hover/btn2:scale-110 transition-transform">in</span> LINKEDIN
                  </button>
              </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Signup;

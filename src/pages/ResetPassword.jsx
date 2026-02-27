import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import FAFLogo from '../assets/FAF-Logo.png';
import { authApi } from '../api/auth.api';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect if no email
  React.useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  // Lock scroll for app feel
  React.useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    return () => {
        document.documentElement.style.overflow = 'auto';
    };
  }, []);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
      setOtp(newOtp.slice(0, 6));
      const nextEmptyIndex = pastedData.length < 6 ? pastedData.length : 5;
      const nextInput = document.getElementById(`otp-${nextEmptyIndex}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const otpCode = otp.join('');

    // Validation
    if (otpCode.length !== 6) {
      setError('Vui lòng nhập đầy đủ 6 chữ số OTP');
      return;
    }

    if (!newPassword) {
      setError('Vui lòng nhập mật khẩu mới');
      return;
    }

    if (newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);

    try {
      await authApi.resetPassword({
        email,
        otp: otpCode,
        newPassword
      });

      setSuccess('Đặt lại mật khẩu thành công!');
      
      // Redirect to signin after 2 seconds
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
    } catch (err) {
      console.error('Reset password failed:', err);
      setError(err.response?.data?.error || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setSuccess('');
    setResending(true);

    try {
      await authApi.reSendOtp({ email });
      setSuccess('Mã OTP mới đã được gửi đến email của bạn!');
      setOtp(['', '', '', '', '', '']);
      document.getElementById('otp-0')?.focus();
    } catch (err) {
      console.error('Resend OTP failed:', err);
      setError('Gửi lại OTP thất bại. Vui lòng thử lại.');
    } finally {
      setResending(false);
    }
  };

  if (!email) {
    return null;
  }

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
              <span className="font-mono text-xs uppercase tracking-widest text-slate-400 group-hover:text-purple-400 transition-colors">Abort Key Restructuring</span>
          </Link>
          <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Reconfiguration Module Online</span>
          </div>
      </div>

      <main className={`w-full max-w-md px-6 relative z-20 overflow-y-auto max-h-[100dvh] pt-24 pb-12 custom-scrollbar ${loading ? "pointer-events-none opacity-60" : ""}`}>
        <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight text-glitch-effect cursor-crosshair inline-block mb-2">
              KEY OVERRIDE
            </h1>
            <p className="text-sm font-mono text-slate-400">
              Clearance code sent to <br/>
              <span className="text-white font-semibold">[{email || "UNKNOWN_NODE"}]</span>
            </p>
        </div>

        <div className="glass-card bg-slate-900/50 border border-slate-700/50 rounded-3xl p-8 sm:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl relative">
            {/* Inner glowing accent */}
            <div className="absolute top-0 right-1/4 w-1/2 h-[1px] bg-gradient-to-l from-transparent via-blue-500 to-transparent opacity-50"></div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-widest flex justify-between">
                Protocol Override Code
              </label>
              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-10 sm:w-12 h-14 bg-slate-950/80 hover:bg-slate-900 text-center text-2xl font-mono font-bold border border-white/10 text-white rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all shadow-inner relative group-focus-within:bg-slate-900"
                  />
                ))}
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label htmlFor="newPassword" className="text-xs font-mono text-slate-400 uppercase tracking-widest flex justify-between">
                New Encryption Key
              </label>
              <div className="relative group/input">
                <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-md opacity-0 group-focus-within/input:opacity-100 transition-opacity"></div>
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full relative bg-slate-950/80 hover:bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder:text-slate-600 focus:bg-slate-900 focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all shadow-inner tracking-widest"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors cursor-crosshair z-10"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-5-10-7 0-.695.395-1.77 1.17-2.992m4.229-3.63A9.966 9.966 0 0112 5c5.523 0 10 5 10 7 0 1.012-.54 2.41-1.558 3.77M15 12a3 3 0 00-3-3m0 0a2.99 2.99 0 00-1.354.322m0 0L9.171 9.171M9.171 9.171 4 4m5.646 5.646L4 4m9.354 9.354L20 20" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-xs font-mono text-slate-400 uppercase tracking-widest flex justify-between">
                Verify New Key
              </label>
              <div className="relative group/input">
                <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-md opacity-0 group-focus-within/input:opacity-100 transition-opacity"></div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full relative bg-slate-950/80 hover:bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder:text-slate-600 focus:bg-slate-900 focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all shadow-inner tracking-widest"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors cursor-crosshair z-10"
                >
                  {showConfirm ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-5-10-7 0-.695.395-1.77 1.17-2.992m4.229-3.63A9.966 9.966 0 0112 5c5.523 0 10 5 10 7 0 1.012-.54 2.41-1.558 3.77M15 12a3 3 0 00-3-3m0 0a2.99 2.99 0 00-1.354.322m0 0L9.171 9.171M9.171 9.171 4 4m5.646 5.646L4 4m9.354 9.354L20 20" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <p>{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                <p>{success}</p>
              </div>
            )}

            {/* Submit Button */}
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
                  COMMITTING_KEY...
                </span>
              ) : (
                <>
                  <span>CONFIRM_OVERRIDE()</span>
                  <svg className="w-5 h-5 text-blue-400 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Resend OTP */}
          <div className="mt-8 text-center flex flex-col items-center">
              <p className="text-xs font-mono text-slate-500 mb-2 uppercase tracking-widest">
                  Signal Interrupted?
              </p>
              <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resending}
                  className="text-xs font-mono font-bold text-white hover:text-blue-400 border-b border-white/20 hover:border-blue-400 pb-0.5 transition-all cursor-crosshair disabled:text-slate-600 disabled:border-slate-800"
              >
                  {resending ? 'TRANSMITTING...' : 'RE-TRANSMIT PROTOCOL'}
              </button>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <Link
              to="/signin"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors cursor-crosshair group/back"
            >
              <svg className="w-4 h-4 text-slate-500 group-hover/back:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Access Terminal
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResetPassword;

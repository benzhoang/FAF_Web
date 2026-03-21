import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import FAFLogo from '../assets/FAF-Logo.png';
import { authApi } from '../api/auth.api';
import { useTranslation } from 'react-i18next';

const OTP = () => {
    const location = useLocation();
    const email = location.state?.email;
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const navigate = useNavigate();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const handleChange = (index, value) => {
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

    const handleSubmit = (e) => {
        e.preventDefault();
        const otpCode = otp.join('');
        
        if (otpCode.length !== 6) {
            toast.warning(t('auth.otp_length_warning'));
            return;
        }

        setLoading(true);
        authApi.verifyOTP({ otp: otpCode, email })
            .then(response => {
                toast.success(t('auth.otp_success'));
                navigate('/signin');
            })
            .catch(error => {
                console.error('OTP verification failed:', error);
                toast.error(t('auth.otp_fail'));
                setLoading(false);
            });
    };

    const handleResend = () => {
        authApi.reSendOtp({ email })
            .then(response => {
                toast.success(t('auth.otp_resend_success'));
            })
            .catch(error => {
                console.error('Resend OTP failed:', error);
                toast.error(t('auth.otp_resend_fail'));
            });
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
                    <span className="font-mono text-xs uppercase tracking-widest text-slate-400 group-hover:text-purple-400 transition-colors">{t('auth.cancel_auth')}</span>
                </Link>
                <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">{t('auth.auth_system_active')}</span>
                </div>
            </div>

            <main className={`w-full max-w-md px-6 relative z-20 ${loading ? "pointer-events-none opacity-60" : ""}`}>
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight text-glitch-effect cursor-crosshair inline-block mb-2">
                        {t('auth.verify_otp_title')}
                    </h1>
                    <p className="text-sm font-mono text-slate-400">
                        {t('auth.otp_sent_to')} <br/>
                        <span className="text-white font-semibold">[{email || t('auth.unknown_address')}]</span>
                    </p>
                </div>

                <div className="glass-card bg-slate-900/50 border border-slate-700/50 rounded-3xl p-8 sm:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl relative">
                    {/* Inner glowing accent */}
                    <div className="absolute top-0 right-1/4 w-1/2 h-[1px] bg-gradient-to-l from-transparent via-blue-500 to-transparent opacity-50"></div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="flex justify-center gap-2 sm:gap-3">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={handlePaste}
                                    className="w-10 sm:w-12 h-14 bg-slate-950/80 hover:bg-slate-900 text-center text-2xl font-mono font-bold border border-white/10 text-white rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all shadow-inner relative group-focus-within:bg-slate-900"
                                />
                            ))}
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
                                    <span>{t('auth.verify_now')}</span>
                                    <svg className="w-5 h-5 text-blue-400 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center flex flex-col items-center">
                        <p className="text-xs font-mono text-slate-500 mb-2 uppercase tracking-widest">
                            {t('auth.did_not_receive_otp')}
                        </p>
                        <button
                            type="button"
                            onClick={handleResend}
                            className="text-xs font-mono font-bold text-white hover:text-blue-400 border-b border-white/20 hover:border-blue-400 pb-0.5 transition-all cursor-crosshair"
                        >
                            {t('auth.resend_otp')}
                        </button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10 text-center">
                        <button
                            onClick={() => navigate('/signin')}
                            className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors cursor-crosshair group/back"
                        >
                            <svg className="w-4 h-4 text-slate-500 group-hover/back:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            {t('auth.back_to_login')}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OTP;

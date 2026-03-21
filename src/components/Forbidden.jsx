import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Forbidden = () => {
    const navigate = useNavigate();

    // Ensure dark mode class is applied to the root if we want the full dark experience
    useEffect(() => {
        document.documentElement.classList.add('dark');
        return () => {
            // Optional: remove it when leaving if the rest of the site isn't dark
            // document.documentElement.classList.remove('dark');
        };
    }, []);

    return (
        <div className="bg-transparent text-slate-100 min-h-screen relative overflow-hidden font-sans selection:bg-rose-500/30 flex flex-col items-center justify-center p-6">
            {/* Background Layer */}
            <div className="absolute inset-0 z-0">
                {/* Red pulse glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-500/10 blur-[100px] rounded-full animate-pulse"></div>
                
                {/* Tech grid */}
                <div className="absolute inset-0 opacity-[0.05]" 
                     style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #f43f5e 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                
                {/* Horizontal scanlines */}
                <div className="absolute inset-0 opacity-20 pointer-events-none"
                     style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 4px, 3px 100%' }}></div>
            </div>

            <main className="relative z-10 w-full max-w-2xl flex flex-col items-center text-center space-y-12 animate-in fade-in zoom-in-95 duration-700">
                {/* Logo Section */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-rose-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(225,29,72,0.4)] border border-rose-400/30">
                        <span className="material-symbols-outlined text-white text-3xl">gpp_maybe</span>
                    </div>
                    <span className="text-3xl font-black tracking-tighter uppercase font-mono italic">
                        FAF<span className="text-rose-500 underline decoration-2 underline-offset-4">SEC_OPS</span>
                    </span>
                </div>

                {/* Central Security Icon */}
                <div className="relative">
                    {/* Glowing outer rings */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-rose-500/20 rounded-full animate-[ping_3s_linear_infinite]"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-rose-500/10 rounded-full animate-[ping_4.5s_linear_infinite_reverse]"></div>
                    
                    <div className="w-40 h-40 rounded-full bg-transparent border-2 border-rose-500/30 flex items-center justify-center relative shadow-[0_0_60px_rgba(244,63,94,0.2)]">
                        {/* The Icon itself */}
                        <div className="text-rose-500 animate-[pulse_2s_infinite] flex items-center justify-center">
                            <span className="material-symbols-outlined !text-7xl font-light">
                                shield_lock
                            </span>
                        </div>
                        
                        {/* Scanning Bar */}
                        <div className="absolute w-full h-[2px] bg-rose-500 shadow-[0_0_10px_#f43f5e] top-0 left-0 animate-[scan_3s_ease-in-out_infinite]"></div>
                    </div>

                    {/* Badge Overlay */}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-rose-600 rounded-full shadow-lg border border-rose-400">
                        <p className="text-[10px] font-black font-mono text-white tracking-[0.2em] whitespace-nowrap">ACCESS_RESTRICTED</p>
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-6">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] text-white">
                        Access <span className="text-rose-500">Denied</span>
                    </h1>
                    <div className="h-1 w-24 bg-rose-500/30 mx-auto rounded-full"></div>
                    <p className="text-base md:text-lg text-slate-400 max-w-md mx-auto leading-relaxed font-mono uppercase tracking-widest">
                        Unauthorized attempt detected. Permission level <span className="text-rose-500 underline decoration-rose-500/50">LEVEL_ZERO</span> confirmed. Request secondary authorization.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <button
                        onClick={() => navigate("/")}
                        className="px-10 py-4 bg-transparent border-2 border-rose-500/20 hover:border-rose-500 hover:bg-rose-500/5 text-rose-500 rounded-2xl transition-all duration-300 font-black text-[11px] font-mono tracking-[0.3em] uppercase flex items-center justify-center gap-3"
                    >
                        <span className="material-symbols-outlined text-lg">home</span>
                        BACK_TO_BASE
                    </button>
                    
                    <button
                        onClick={() => navigate("/signin")}
                        className="px-10 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl transition-all duration-300 font-black text-[11px] font-mono tracking-[0.3em] uppercase shadow-[0_0_30px_rgba(225,29,72,0.3)] flex items-center justify-center gap-3 hover:scale-105 active:scale-95"
                    >
                        <span className="material-symbols-outlined text-lg">login</span>
                        AUTHORIZE_LOG
                    </button>
                </div>

                {/* Terminal Status Lines */}
                <div className="pt-10 flex flex-col gap-2 opacity-40 font-mono text-[9px] text-rose-500/80 uppercase tracking-widest italic select-none">
                    <p className="animate-pulse">_SECURITY_SCAN_ACTIVE_</p>
                    <p>_IP_LOGGED: [REDACTED]</p>
                    <p>_PROTOCOL: 403_ERR_STATUS_</p>
                </div>
            </main>

            {/* Custom Animations */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes scan {
                    0% { top: 10%; opacity: 0; }
                    50% { opacity: 1; }
                    100% { top: 90%; opacity: 0; }
                }
            ` }} />
        </div>
    );
};

export default Forbidden;



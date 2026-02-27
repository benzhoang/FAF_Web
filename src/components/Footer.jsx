import React from 'react';
import FAFLogo from '../assets/FAF-Logo.png';

const Footer = () => {
    const cols = [
        { title: 'PLATFORM', links: ['Find Work', 'Hire Talent', 'Escrow Safety', 'Global Payroll'] },
        { title: 'COMPANY',  links: ['About Us', 'Careers', 'Press Kit', 'Contact'] },
        { title: 'LEGAL',    links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'] },
        { title: 'SUPPORT',  links: ['Help Center', 'Community', 'API Docs'] },
    ];

    return (
        <footer className="relative border-t overflow-hidden"
            style={{ background: 'rgba(2,6,23,0.98)', borderColor: 'rgba(6,182,212,0.12)' }}>
            {/* Top neon line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

            {/* Scanlines */}
            <div className="absolute inset-0 pointer-events-none"
                style={{ backgroundImage: 'repeating-linear-gradient(0deg,rgba(0,255,255,0.006) 0px,rgba(0,255,255,0.006) 1px,transparent 1px,transparent 4px)' }} />

            <div className="max-w-7xl mx-auto px-6 py-14 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
                    {/* Brand */}
                    <div className="col-span-2 space-y-4">
                        <div className="flex items-center gap-3">
                            <img src={FAFLogo} alt="FAF" className="h-8 w-auto object-contain"
                                style={{ filter: 'brightness(0) invert(1) drop-shadow(0 0 6px rgba(255,255,255,0.5))' }} />

                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                <span className="text-[9px] font-mono font-black text-cyan-400 tracking-widest uppercase">Online</span>
                            </div>
                        </div>
                        <p className="text-slate-500 text-xs leading-relaxed max-w-xs font-mono">
                            The modern OS for the independent workforce. Fast hiring, accountable contracts, and fair payments.
                        </p>
                        <div className="flex gap-3">
                            {[
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 002 2h2.945M15 11a3 3 0 11-6 0m6 0a3 3 0 10-6 0m6 0h.01M21 11a3 3 0 11-6 0m6 0a3 3 0 10-6 0m6 0h.01" />,
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />,
                            ].map((d, i) => (
                                <a key={i} href="#" className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all hover:border-cyan-500/50 hover:text-cyan-400 hover:-translate-y-0.5"
                                    style={{ background: 'rgba(15,23,42,0.8)', borderColor: 'rgba(51,65,85,0.5)', color: '#64748b' }}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">{d}</svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {cols.map(col => (
                        <div key={col.title} className="space-y-3">
                            <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-500 font-mono flex items-center gap-1">
                                <span className="text-cyan-500">//</span> {col.title}
                            </h4>
                            <ul className="space-y-2">
                                {col.links.map(link => (
                                    <li key={link}>
                                        <a href="#" className="text-xs text-slate-500 hover:text-cyan-400 transition-colors font-mono">{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="mt-12 pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4"
                    style={{ borderColor: 'rgba(51,65,85,0.4)' }}>
                    <p className="text-[10px] font-mono text-slate-600">© 2026 FAF Workforce Technologies. All rights reserved.</p>
                    <div className="flex items-center gap-4 text-[10px] font-mono text-slate-600">
                        <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-sm shadow-cyan-400" />
                            SYSTEMS OPERATIONAL
                        </span>
                        <span className="text-slate-700">|</span>
                        <span className="text-cyan-600">FAF · NETWORK v2.0</span>
                    </div>
                </div>
            </div>

            {/* Bottom neon line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
        </footer>
    );
};

export default Footer;

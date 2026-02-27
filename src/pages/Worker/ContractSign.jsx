import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { contractsApi } from '../../api/contracts.api';
import { userApi } from '../../api/user.api';

const ContractSign = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [contract, setContract] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [signing, setSigning] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => setCountdown(c => c - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    const handleRequestOtp = async () => {
        try {
            await contractsApi.requestSignOtp(id);
            setOtpSent(true);
            setCountdown(60);
            toast.success('SYS: OTP validation code transmitted to registered email.');
        } catch (error) {
            toast.error('ERR: Failed to transmit OTP. Retry required.');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [contractRes, profileRes] = await Promise.all([
                    contractsApi.getContractById(id),
                    userApi.getMe()
                ]);
                setContract(contractRes.data);
                setUserProfile(profileRes);
            } catch (error) {
                console.error('Error fetching contract:', error);
                toast.error('ERR: Failed to load contract data. Corrupt memory sector.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, toast]);

    const handleSignContract = async () => {
        if (!showConfirm) {
            setShowConfirm(true);
            return;
        }

        if (!otp) {
            toast.warning('SYS: OTP validation required to execute cryptographic sign.');
            return;
        }

        try {
            setSigning(true);
            await contractsApi.signContract(id, otp);
            toast.success('SYS: Cryptographic signature applied successfully!');
            setShowConfirm(false);
            navigate('/my-job'); 
        } catch (error) {
            console.error('Error signing contract:', error);
            toast.error(error.response?.data?.message || 'ERR: Cryptographic signature failed.');
        } finally {
            setSigning(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center relative overflow-hidden text-cyan-500 font-mono text-[10px] tracking-widest uppercase">
                <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(0deg,rgba(0,255,255,0.008) 0px,rgba(0,255,255,0.008) 1px,transparent 1px,transparent 3px)' }} />
                <div className="flex flex-col items-center gap-4 animate-pulse z-10">
                    <div className="w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                    DECRYPTING CONTRACT BLOCK...
                </div>
            </div>
        );
    }

    if (!contract) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center relative font-mono text-rose-500 text-[10px] tracking-widest uppercase">
                ERROR: NO CONTRACT BLOCK FOUND.
            </div>
        );
    }

    const filledContract = contract.contract_content
        ? contract.contract_content
            .replace(/\.{10,}/g, userProfile?.full_name || '[UNKNOWN_OPERATIVE]')
            .replace(/Họ và tên:.*?\n/g, `Họ và tên: ${userProfile?.full_name || '[UNKNOWN_OPERATIVE]'}\n`)
            .replace(/Email đăng ký.*?:\s*\.+/g, `Email đăng ký trên hệ thống FAF: ${userProfile?.email || '[UNKNOWN_EMAIL]'}`)
            .replace(/ID người dùng FAF:\s*\.+/g, `ID người dùng FAF: ${userProfile?.id || '[NULL_ID]'}`)
        : 'ENCRYPTED_PAYLOAD_UNAVAILABLE';

    const bothSigned = contract.signature_worker && contract.signature_client;
    const workerSigned = contract.signature_worker;
    const clientSigned = contract.signature_client;

    return (
        <div className="min-h-screen bg-[#020617] text-slate-300 relative font-sans">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: 'repeating-linear-gradient(0deg,rgba(0,255,255,0.008) 0px,rgba(0,255,255,0.008) 1px,transparent 1px,transparent 3px)' }} />
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8 relative z-10 w-full">
                {/* Header Card */}
                <div className="bg-[#090e17]/80 backdrop-blur-xl rounded-2xl border p-8 mb-6 relative overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.1)]" style={{ borderColor: 'rgba(6,182,212,0.3)' }}>
                    <div className="absolute top-0 right-10 w-32 h-px bg-cyan-400/50" />
                    
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="text-[10px] font-black font-mono text-cyan-500 hover:text-cyan-400 uppercase tracking-widest mb-6 transition-colors group flex items-center gap-2"
                    >
                        <svg className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        ABORT_TO_DASHBOARD
                    </button>
                    
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <p className="text-[10px] font-mono text-cyan-500/70 uppercase tracking-widest mb-1">BINDING_AGREEMENT</p>
                            <h1 className="text-3xl font-black text-white tracking-widest uppercase mb-3 text-shadow-glow-cyan">{contract.job_title}</h1>
                            <div className="flex items-center gap-3">
                                <span className="px-2.5 py-1 bg-emerald-900/30 border border-emerald-500/30 text-emerald-400 rounded text-[10px] font-black font-mono uppercase tracking-widest">
                                    <span className="text-slate-500 mr-2">VAL:</span>
                                    ${Number(contract.total_amount || 0).toLocaleString()}
                                </span>
                            </div>
                        </div>
                        <div className="text-right flex flex-col md:items-end gap-2">
                            <span className={`px-3 py-1.5 rounded inline-flex shrink-0 items-center justify-center text-[9px] font-black font-mono tracking-widest uppercase border ${
                                workerSigned ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-400' : 'bg-amber-900/30 border-amber-500/50 text-amber-400'
                            }`}>
                                {workerSigned ? '[OK] OPERATIVE_SIGNED' : '[WAIT] OP_SIGNATURE_REQ'}
                            </span>
                            <span className={`px-3 py-1.5 rounded inline-flex shrink-0 items-center justify-center text-[9px] font-black font-mono tracking-widest uppercase border ${
                                clientSigned ? 'bg-indigo-900/30 border-indigo-500/50 text-indigo-400' : 'bg-slate-800 border-slate-700 text-slate-500'
                            }`}>
                                {clientSigned ? '[OK] EMPLOYER_SIGNED' : '[WAIT] EMP_SIGNATURE_REQ'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Contract Document */}
                <div className="bg-[#090e17] rounded-2xl shadow-xl overflow-hidden mb-6 border border-slate-800/80">
                    {/* Dark gradient Top Bar */}
                    <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border-b border-cyan-500/30 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded border border-cyan-500/50 bg-cyan-900/30 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                                <span className="text-lg">📜</span>
                            </div>
                            <div>
                                <h2 className="text-white font-black text-sm uppercase tracking-widest font-mono">ENCRYPTED_DOCUMENT</h2>
                                <p className="text-cyan-500 text-[9px] mt-0.5 uppercase tracking-widest font-mono">REVIEW_TERMS_BEFORE_AUTHORIZATION</p>
                            </div>
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest text-right">
                            DOC_ID: <span className="text-slate-300">#{contract.id}</span>
                        </div>
                    </div>
                    
                    {/* The Prose block styled for cyberpunk (dark mode, monospace text inside if needed, or normal readable font, but dark backgrounds) */}
                    <div className="p-8 max-h-[600px] overflow-y-auto bg-[#02040a] custom-scrollbar text-slate-300">
                        <div 
                            className="prose prose-invert prose-sm max-w-none 
                                       prose-headings:text-cyan-400 prose-headings:font-black prose-headings:uppercase prose-headings:tracking-wider
                                       prose-a:text-indigo-400 hover:prose-a:text-indigo-300
                                       prose-strong:text-emerald-400 prose-strong:font-black
                                       prose-li:marker:text-cyan-500
                                       before:prose-p:content-none after:prose-p:content-none"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                            dangerouslySetInnerHTML={{ __html: filledContract }}
                        />
                    </div>

                    {/* Footer */}
                    <div className="border-t border-slate-800 bg-[#060b13] px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[10px] font-mono tracking-widest uppercase">
                        <div className="text-slate-500">
                            GEN_TIME: <span className="text-slate-300">{new Date(contract.created_at).toLocaleString()}</span>
                        </div>
                        <div className="text-right flex flex-col sm:items-end gap-1">
                            <p className="text-cyan-500/60 flex items-center justify-end gap-1.5"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>SECURED_BY_FAF_SYSTEMS</p>
                            {bothSigned && contract.signed_at && (
                                <p className="text-emerald-400 font-black">
                                    [OK] FULLY_EXECUTED: {new Date(contract.signed_at).toLocaleString()}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Blocks */}
                {!workerSigned ? (
                    <div className="bg-[#090e17] rounded-2xl border border-slate-800 p-8 shadow-xl relative overflow-hidden">
                        {!showConfirm ? (
                            <div>
                                <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2 font-mono">AWAITING_AUTHORIZATION</h3>
                                    <p className="text-[10px] font-mono tracking-widest text-[#00ffcc] uppercase leading-relaxed text-shadow-glow-cyan border-l-2 border-[#00ffcc]/30 pl-3">
                                        &gt; By applying cryptographic signature, you commit to resolving the specified objectives. <br/>
                                        &gt; Failure to deliver may result in reputation penalties.
                                    </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={handleSignContract}
                                        className="flex-1 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-[12px] uppercase tracking-widest font-mono rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] border border-cyan-400/50 flex items-center justify-center gap-3"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        APPLY_SIGNATURE
                                    </button>
                                    <button
                                        onClick={() => navigate('/dashboard')}
                                        className="sm:w-1/3 px-8 py-4 border border-slate-700 text-[12px] font-black uppercase tracking-widest font-mono text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all text-center"
                                    >
                                        CANCEL
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-amber-900/10 border border-amber-500/30 rounded-xl p-8 relative overflow-hidden">
                                {/* Diagonal hazard stripes top/bottom */}
                                <div className="absolute top-0 inset-x-0 h-1" style={{ background: 'repeating-linear-gradient(45deg, #f59e0b, #f59e0b 10px, transparent 10px, transparent 20px)' }}></div>
                                <div className="absolute bottom-0 inset-x-0 h-1" style={{ background: 'repeating-linear-gradient(45deg, #f59e0b, #f59e0b 10px, transparent 10px, transparent 20px)' }}></div>

                                <h3 className="text-lg font-black text-amber-500 uppercase tracking-widest mb-2 font-mono flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    FINAL_VERIFICATION
                                </h3>
                                <p className="text-[12px] text-amber-500/70 mb-8 font-mono max-w-2xl">
                                    &gt; To complete the transaction, establish identity using the one-time payload dispatched to your secure comms channel.
                                </p>

                                <div className="mb-8 max-w-md">
                                    <label className="block text-[10px] font-black text-amber-400 uppercase tracking-widest mb-3 font-mono">OTP_AUTHORIZATION_CODE</label>
                                    <p className="text-[10px] font-mono tracking-widest text-[#00ffcc] uppercase leading-relaxed text-shadow-glow-cyan border-l-2 border-[#00ffcc]/30 pl-3">
                                        &gt; INJECT OTP SEQUENCE BELOW.<br/>
                                        &gt; VERIFYING HOST IDENTITY.
                                    </p>        <div className="flex flex-col sm:flex-row gap-3">
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="XXXXXX"
                                            className="flex-1 px-4 py-3 bg-[#02040a] border border-amber-500/50 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 font-mono text-center text-2xl tracking-[0.5em] text-white placeholder-slate-800"
                                            maxLength={6}
                                        />
                                        <button
                                            onClick={handleRequestOtp}
                                            disabled={countdown > 0}
                                            className="sm:w-[150px] px-4 py-3 bg-amber-900/30 hover:bg-amber-900/50 border border-amber-500/50 text-amber-400 font-black text-[10px] rounded-lg transition-colors disabled:opacity-50 disabled:grayscale font-mono uppercase tracking-widest shrink-0"
                                        >
                                            {countdown > 0 ? `RETRY_IN [${countdown}s]` : otpSent ? 'RESEND_SIGNAL' : 'REQUEST_SIGNAL'}
                                        </button>
                                    </div>
                                    <p className="text-[9px] text-amber-500/60 mt-3 font-mono uppercase tracking-widest">
                                        DESTINATION: <span className="font-bold text-amber-400">{userProfile?.email}</span>
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={handleSignContract}
                                        disabled={signing}
                                        className="flex-1 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[12px] rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 flex items-center justify-center gap-2 font-mono tracking-widest uppercase border border-emerald-400/50"
                                    >
                                        {signing ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'CONFIRM_SIGNATURE_EXECUTION'}
                                    </button>
                                    <button
                                        onClick={() => setShowConfirm(false)}
                                        disabled={signing}
                                        className="sm:w-1/3 px-8 py-4 border border-amber-500/30 text-amber-400 hover:bg-amber-900/20 font-black text-[12px] rounded-xl transition-all disabled:opacity-50 font-mono tracking-widest uppercase text-center"
                                    >
                                        GO_BACK
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-emerald-900/10 border border-emerald-500/30 rounded-2xl p-8 text-center relative overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[50px]"></div>
                        
                        <div className="w-16 h-16 mx-auto bg-emerald-500/20 border border-emerald-400/50 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                            <span className="text-3xl">✅</span>
                        </div>
                        <h3 className="text-xl font-black text-emerald-400 uppercase tracking-widest mb-3 font-mono">OPERATIVE_SIGNATURE_DETECTED</h3>
                        <p className="text-[12px] font-mono text-emerald-400/70 mb-8 max-w-xl mx-auto leading-relaxed">
                            {clientSigned 
                                ? '> BOTH_PARTIES_CONFIRMED. CONTRACT IS LIVE. PROCEED TO WORKSPACE.' 
                                : '> AWAITING_CLIENT_AUTHORIZATION. CONTRACT DORMANT UNTIL CLIENT SIGNS.'}
                        </p>
                        {bothSigned && (
                            <button
                                onClick={() => navigate('/my-job')}
                                className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[12px] rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] border border-emerald-400 uppercase tracking-widest font-mono inline-flex items-center gap-3"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                INITIATE_WORKSPACE
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Custom Scrollbar for contract content */}
            <style jsx="true">{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(15,23,42,0.8); border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(6,182,212,0.3); border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(6,182,212,0.6); }
            `}</style>
        </div>
    );
};

export default ContractSign;

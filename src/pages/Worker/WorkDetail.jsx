import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobsApi } from '../../api/jobs.api';
import { contractsApi } from '../../api/contracts.api';
import { useToast } from '../../contexts/ToastContext';
import { useChatContext } from '../../contexts/ChatContext';

const SectionLabel = ({ children }) => (
    <p className="text-[9px] font-black tracking-widest text-cyan-500 uppercase font-mono mb-3 flex items-center gap-1.5">
        <span className="text-cyan-400">//</span> {children}
    </p>
);

const WorkDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const { openChat } = useChatContext();
    
    const [job, setJob] = useState(null);
    const [contractDetail, setContractDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                setLoading(true);
                const res = await jobsApi.getJobDetail(id);
                setJob(res.data);
                
                if (res.data.contract?.id) {
                    try {
                        const contractRes = await contractsApi.getContractById(res.data.contract.id);
                        setContractDetail(contractRes.data);
                    } catch {
                        setContractDetail(res.data.contract);
                    }
                }
            } catch (err) {
                setError('Failed to load job details');
            } finally {
                setLoading(false);
            }
        };
        fetchJobDetails();
    }, [id]);

    const handleContactEmployer = async () => {
        if (!job?.client_id) return toast.error('Employer information not found');
        try {
            await openChat(job.client_id);
        } catch {
            toast.error('Failed to open chat with employer');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#020617]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-cyan-400 font-mono text-[10px] tracking-widest uppercase animate-pulse">Scanning Data...</span>
                </div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#020617] p-4">
                <div className="max-w-md w-full rounded-2xl border p-8 text-center" style={{ background: 'linear-gradient(145deg,#0d1224,#0f172a)', borderColor: 'rgba(239,68,68,0.3)' }}>
                    <div className="text-4xl mb-4">⚠️</div>
                    <h2 className="text-lg font-black text-white uppercase tracking-widest font-mono mb-2">SIGNAL LOST</h2>
                    <p className="text-[12px] text-slate-400 font-mono mb-6">{error || 'Job data could not be retrieved.'}</p>
                    <button onClick={() => navigate('/find-work')}
                        className="px-6 py-2.5 rounded-xl font-black text-[11px] tracking-widest uppercase font-mono bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 transition-all">
                        Return to Hub
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-300">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: 'repeating-linear-gradient(0deg,rgba(0,255,255,0.008) 0px,rgba(0,255,255,0.008) 1px,transparent 1px,transparent 3px)' }} />
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav className="mb-6 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-slate-500">
                    <Link to="/find-work" className="hover:text-cyan-400 transition-colors">FIND WORK</Link>
                    <span className="text-slate-700">›</span>
                    <span className="text-cyan-500">{job.category_name || 'JOB DETAILS'}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
                    {/* ── MAIN CONTENT ── */}
                    <div className="space-y-6">
                        {/* Header Card */}
                        <div className="rounded-2xl border p-8 relative overflow-hidden group" style={{ background: 'linear-gradient(145deg,#0d1224,#0f172a)', borderColor: 'rgba(6,182,212,0.2)' }}>
                            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wide mb-4 leading-tight group-hover:text-cyan-300 transition-colors">{job.title}</h1>
                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-mono text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50"></span>
                                            Posted by: <span className="text-slate-200">{job.client?.full_name || job.client?.email?.split('@')[0] || 'Employer'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50"></span>
                                            Type: <span className="text-slate-200">{job.job_type === 'SHORT_TERM' ? 'Short-term' : 'Long-term'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500/50"></span>
                                            Duration: <span className="text-slate-200">{job.start_date ? new Date(job.start_date).toLocaleDateString() : 'ASAP'} - {job.end_date ? new Date(job.end_date).toLocaleDateString() : 'Open'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="shrink-0">
                                    <button className="flex items-center gap-2 px-4 py-2 border border-slate-600/50 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 hover:border-cyan-500/50 hover:text-cyan-400 transition-all font-mono text-[11px] uppercase tracking-widest text-slate-300">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                                        Share
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="rounded-2xl border p-8" style={{ background: 'linear-gradient(145deg,#0d1224,#0f172a)', borderColor: 'rgba(6,182,212,0.15)' }}>
                            <SectionLabel>JOB DESCRIPTION</SectionLabel>
                            <p className="text-[13px] text-slate-300 leading-relaxed font-mono whitespace-pre-wrap">{job.description}</p>
                        </div>

                        {/* Skills */}
                        {job.skills?.length > 0 && (
                            <div className="rounded-2xl border p-8" style={{ background: 'linear-gradient(145deg,#0d1224,#0f172a)', borderColor: 'rgba(6,182,212,0.15)' }}>
                                <SectionLabel>REQUIRED SKILLS</SectionLabel>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {job.skills.map((skill, idx) => (
                                        <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-black font-mono tracking-wide border bg-cyan-900/20 border-cyan-500/30 text-cyan-400">
                                            {typeof skill === 'string' ? skill : skill.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Milestones */}
                        {job.checkpoints?.length > 0 && (
                            <div className="rounded-2xl border p-8" style={{ background: 'linear-gradient(145deg,#0d1224,#0f172a)', borderColor: 'rgba(6,182,212,0.15)' }}>
                                <SectionLabel>PROJECT MILESTONES</SectionLabel>
                                <div className="space-y-4 mt-4">
                                    {job.checkpoints.map((cp, idx) => (
                                        <div key={cp.id || idx} className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-5 hover:border-cyan-500/30 transition-colors">
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="text-[10px] font-black font-mono text-cyan-500 uppercase tracking-widest">MILESTONE 0{idx + 1}</span>
                                                        <span className={`px-2 py-0.5 rounded border text-[9px] font-black font-mono tracking-widest uppercase ${
                                                            cp.status === 'COMPLETED' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30' :
                                                            cp.status === 'IN_PROGRESS' ? 'bg-amber-900/30 text-amber-400 border-amber-500/30' :
                                                            'bg-slate-800 text-slate-400 border-slate-600'
                                                        }`}>{cp.status || 'PENDING'}</span>
                                                    </div>
                                                    <h3 className="text-sm font-black text-white tracking-wide uppercase">{cp.name || `Phase ${idx+1}`}</h3>
                                                    {cp.description && <p className="text-[12px] text-slate-400 font-mono mt-2">{cp.description}</p>}
                                                </div>
                                                {cp.amount && (
                                                    <div className="text-right shrink-0">
                                                        <div className="text-lg font-black text-cyan-400 font-mono">${Number(cp.amount).toLocaleString()}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Contract Document Preview if exists */}
                        {contractDetail && (
                            <div className="rounded-2xl border p-8" style={{ background: 'linear-gradient(145deg,#0d1224,#0f172a)', borderColor: 'rgba(168,85,247,0.2)' }}>
                                <div className="flex items-center justify-between mb-6">
                                    <SectionLabel><span className="text-purple-400">CONTRACT DOCUMENT</span></SectionLabel>
                                    <span className="px-2 py-1 bg-purple-900/30 border border-purple-500/30 rounded text-[9px] font-black text-purple-400 tracking-widest font-mono">
                                        {contractDetail.status || 'DRAFT'}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-xl border border-slate-700/50 bg-slate-800/30">
                                    <div>
                                        <div className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mb-1">TOTAL VALUE</div>
                                        <div className="text-xl font-black text-white font-mono">${Number(contractDetail.total_amount || 0).toLocaleString()}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mb-1">CONTRACT UID</div>
                                        <div className="text-sm font-bold text-slate-300 font-mono">#{contractDetail.id}</div>
                                    </div>
                                </div>

                                {(contractDetail.contract_content || contractDetail.terms) && (
                                    <div className="border border-slate-700/50 rounded-xl overflow-hidden bg-[#090e17]">
                                        <div className="bg-slate-800/80 px-4 py-3 border-b border-slate-700/50 flex items-center gap-3">
                                            <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                            <span className="text-[11px] font-black tracking-widest font-mono text-slate-300 uppercase">FAF STANDARD AGREEMENT</span>
                                        </div>
                                        <div className="p-6 prose prose-invert prose-sm max-w-none prose-p:text-slate-400 prose-headings:text-slate-200" dangerouslySetInnerHTML={{ __html: contractDetail.contract_content || contractDetail.terms }} />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ── SIDEBAR ── */}
                    <aside className="space-y-6">
                        {/* Budget Card */}
                        <div className="rounded-2xl border p-6 text-center" style={{ background: 'linear-gradient(145deg,#0d1224,#0f172a)', borderColor: 'rgba(6,182,212,0.3)' }}>
                            <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase font-mono mb-2">PROJECT BUDGET</div>
                            <div className="text-4xl font-black text-white font-mono mb-1 tracking-tight">
                                ${Number(job.budget || 0).toLocaleString()}
                            </div>
                            <div className="text-[10px] font-mono text-cyan-500/70">SECURED VIA FAF ESCROW</div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3">
                            <button onClick={() => navigate(`/apply/${id}`)}
                                className="w-full py-4 rounded-xl font-black text-[13px] tracking-widest uppercase font-mono bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] border border-cyan-400/50 transition-all hover:scale-[1.02]">
                                Apply Now
                            </button>
                            <button onClick={handleContactEmployer}
                                className="w-full py-3.5 rounded-xl font-black text-[11px] tracking-widest uppercase font-mono bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-600/50 hover:border-cyan-500/50 hover:text-cyan-400 transition-all flex items-center justify-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                Message Client
                            </button>
                        </div>

                        {/* About Client */}
                        {job.client && (
                            <div className="rounded-2xl border p-6" style={{ background: 'linear-gradient(145deg,#0d1224,#0f172a)', borderColor: 'rgba(6,182,212,0.15)' }}>
                                <SectionLabel>ABOUT CLIENT</SectionLabel>
                                <div className="flex items-center gap-4 mb-5 mt-4">
                                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-lg text-slate-300">
                                        {(job.client.full_name || job.client.email)?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="font-bold text-[14px] text-white truncate">{job.client.full_name || job.client.email?.split('@')[0]}</div>
                                        <div className="text-[11px] text-slate-500 font-mono truncate">{job.client.email}</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-lg bg-slate-800/50 border border-slate-700/50 p-3 text-center">
                                        <div className="text-[9px] font-mono text-slate-500 tracking-widest mb-1">POSTS</div>
                                        <div className="text-lg font-black text-white">{job.client.total_jobs || 1}</div>
                                    </div>
                                    <div className="rounded-lg bg-slate-800/50 border border-slate-700/50 p-3 text-center">
                                        <div className="text-[9px] font-mono text-slate-500 tracking-widest mb-1">JOINED</div>
                                        <div className="text-sm font-black text-white mt-1">{job.client.created_at ? new Date(job.client.created_at).getFullYear() : '2024'}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default WorkDetail;

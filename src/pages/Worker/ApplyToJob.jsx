import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { proposalsApi } from '../../api/proposals.api';
import { useAuth } from '../../auth/AuthContext';
import { jobsApi } from '../../api/jobs.api';

const SectionLabel = ({ children }) => (
    <p className="text-[9px] font-black tracking-widest text-cyan-500 uppercase font-mono mb-3 flex items-center gap-1.5 border-b border-cyan-500/20 pb-2">
        <span className="text-cyan-400">//</span> {children}
    </p>
);

const ApplyToJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const { user } = useAuth();
    
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    
    const [formData, setFormData] = useState({
        coverLetter: '',
        proposedPrice: ''
    });

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                setLoading(true);
                const res = await jobsApi.getJobDetail(id);
                setJob(res.data);
                setFormData(prev => ({ ...prev, proposedPrice: res.data.budget || '' }));
            } catch (err) {
                setError('Failed to load job details');
            } finally {
                setLoading(false);
            }
        };
        fetchJobDetails();
    }, [id]);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.coverLetter.trim()) return toast.warning('Please write a cover letter');
        if (!formData.proposedPrice || parseFloat(formData.proposedPrice) <= 0) return toast.warning('Please enter a valid price');

        try {
            setSubmitting(true);
            await proposalsApi.submitProposal({
                jobId: parseInt(id),
                coverLetter: formData.coverLetter,
                proposedPrice: parseFloat(formData.proposedPrice)
            });
            toast.success('Proposal submitted successfully!');
            navigate('/dashboard');
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to submit proposal';
            if (errorMsg.includes('ALREADY_APPLIED')) toast.warning('You have already applied to this job.');
            else if (errorMsg.includes('JOB_NOT_OPEN')) toast.warning('This job is no longer accepting applications.');
            else toast.error(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-transparent">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-cyan-400 font-mono text-[10px] tracking-widest uppercase animate-pulse">Đang tải dữ liệu...</span>
                </div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-transparent p-4">
                <div className="max-w-md w-full rounded-2xl border p-8 text-center" style={{ background: 'linear-gradient(145deg,#0d1224,#0f172a)', borderColor: 'rgba(239,68,68,0.3)' }}>
                    <div className="text-4xl mb-4">⚠️</div>
                    <h2 className="text-lg font-black text-white uppercase tracking-widest font-mono mb-2">LỖI DỮ LIỆU</h2>
                    <p className="text-[12px] text-slate-400 font-mono mb-6">{error || 'Không thể truy xuất thông tin công việc.'}</p>
                    <button onClick={() => navigate('/find-work')}
                        className="px-6 py-2.5 rounded-xl font-black text-[11px] tracking-widest uppercase font-mono bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 transition-all">
                        Quay Lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent text-slate-300 py-12 px-4 sm:px-6 lg:px-8 relative">

            <div className="max-w-3xl mx-auto relative z-10">
                {/* Header */}
                <div className="mb-8">
                    <button onClick={() => navigate(`/work/${id}`)} className="text-cyan-500 hover:text-cyan-400 font-mono text-[11px] uppercase tracking-widest mb-4 inline-flex items-center gap-2 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        HỦY VÀ QUAY LẠI
                    </button>
                    <h1 className="text-3xl font-black text-white uppercase tracking-wider mb-2">GỬI YÊU CẦU ỨNG TUYỂN</h1>
                    <p className="text-sm font-mono text-slate-500">Công việc: <span className="text-cyan-400">{job.title}</span></p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Job Summary */}
                    <div className="rounded-2xl border p-6 relative overflow-hidden" style={{ background: 'linear-gradient(145deg,#0d1224,#0f172a)', borderColor: 'rgba(6,182,212,0.2)' }}>
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
                        <SectionLabel>TÓM TẮT CÔNG VIỆC</SectionLabel>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                                <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1">NGÂN SÁCH</div>
                                <div className="text-xl font-black text-cyan-400 font-mono">${Number(job.budget || 0).toLocaleString()}</div>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                                <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1">HÌNH THỨC</div>
                                <div className="text-sm font-bold text-white uppercase tracking-wider mt-1">{job.job_type === 'SHORT_TERM' ? 'Ngắn Hạn' : 'Dài Hạn'}</div>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                                <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1">DANH MỤC</div>
                                <div className="text-sm font-bold text-white tracking-wide mt-1 truncate">{job.category_name || 'Chung'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Proposal Details */}
                    <div className="rounded-2xl border p-6" style={{ background: 'linear-gradient(145deg,#0d1224,#0f172a)', borderColor: 'rgba(6,182,212,0.2)' }}>
                        <SectionLabel>CHI TIẾT ỨNG TUYỂN</SectionLabel>
                        
                        {/* Price Input */}
                        <div className="mb-6 mt-4">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-black text-white uppercase tracking-widest font-mono">Giá đề xuất ($)</label>
                                <span className="text-[10px] font-mono text-cyan-500/70 block">Ngân sách khách hàng: {job.budget ? `$${job.budget}` : 'Mở'}</span>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="text-cyan-500 font-mono text-lg group-focus-within:text-cyan-400">$</span>
                                </div>
                                <input type="number" name="proposedPrice" value={formData.proposedPrice} onChange={handleChange} min="1" step="0.01" required
                                    className="w-full bg-[#090e17] border border-slate-700 text-cyan-300 font-mono font-black text-lg rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder-slate-600"
                                    placeholder="0.00" />
                            </div>
                            <p className="mt-2 text-[10px] font-mono text-slate-500">LƯU Ý: Đề xuất mức giá ở mức 80-120% so với ngân sách của khách hàng để có cơ hội được chọn cao nhất.</p>
                        </div>

                        {/* Cover Letter */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-black text-white uppercase tracking-widest font-mono">Thư ứng tuyển</label>
                            </div>
                            <textarea name="coverLetter" value={formData.coverLetter} onChange={handleChange} rows={8} required
                                className="w-full bg-[#090e17] border border-slate-700 text-slate-300 font-mono text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder-slate-600 resize-none selection:bg-cyan-500/30"
                                placeholder="Nêu chi tiết kinh nghiệm của bạn...&#10;Vì sao bạn quan tâm đến dự án này?&#10;Bạn sẽ thực hiện dự án ra sao?..." />
                            <div className="mt-2 flex items-center justify-between text-[10px] font-mono">
                                <span className="text-cyan-500/70">{formData.coverLetter.length} KÝ TỰ</span>
                                <span className="text-amber-500/70">LƯU Ý: VUI LÒNG DÙNG NGÔN TỪ PHÙ HỢP</span>
                            </div>
                        </div>
                    </div>

                    {/* Applicant Profile Preview */}
                    <div className="rounded-xl border border-indigo-500/20 bg-indigo-900/10 p-5 flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                            <div className="w-12 h-12 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-black text-lg uppercase">
                                {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-[10px] font-mono text-indigo-400 tracking-widest uppercase mb-1">ĐANG ỨNG TUYỂN VỚI TƯ CÁCH</h3>
                            <p className="text-sm font-bold text-slate-200">{user?.full_name || user?.email}</p>
                            {user?.bio && <p className="text-[11px] text-slate-500 font-mono mt-1 line-clamp-2">{user.bio}</p>}
                        </div>
                    </div>

                    {/* Submit Actions */}
                    <div className="flex gap-4 pt-2">
                        <button type="button" onClick={() => navigate(`/work/${id}`)} disabled={submitting}
                            className="flex-1 py-4 rounded-xl font-black text-[12px] tracking-widest uppercase font-mono bg-slate-800/80 text-slate-400 border border-slate-700 hover:text-slate-200 hover:border-slate-500 transition-all disabled:opacity-50">
                            HỦY BỎ
                        </button>
                        <button type="submit" disabled={submitting}
                            className="flex-[2] py-4 rounded-xl font-black text-[12px] tracking-widest uppercase font-mono bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] border border-cyan-400/50 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-wait">
                            {submitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ĐANG GỬI...
                                </span>
                            ) : 'GỬI THƯ ỨNG TUYỂN'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApplyToJob;

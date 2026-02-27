import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";
import TaskOwnerSidebar from "../../components/TaskOwnerSidebar";
import { jobsApi } from "../../api/jobs.api";
import { matchingApi } from "../../api/matching.api";
import { contractsApi } from "../../api/contracts.api";
import { chatApi } from "../../api/chat.api";

const JobDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const toast = useToast();
    
    const [job, setJob] = useState(null);
    const [contractDetail, setContractDetail] = useState(null);
    const [proposals, setProposals] = useState([]);
    const [recommendedWorkers, setRecommendedWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('proposals');

    useEffect(() => {
        fetchJobData();
    }, [id]);

    const fetchJobData = async () => {
        try {
            setLoading(true);
            const [jobRes, proposalsRes, recommendedRes] = await Promise.all([
                jobsApi.getJobDetail(id),
                jobsApi.getJobProposals(id),
                matchingApi.getRecommendedWorkers(id)
            ]);
            
            setJob(jobRes.data);
            setProposals(proposalsRes.data || []);
            setRecommendedWorkers(recommendedRes.data || []);

            // Fetch full contract details if contract exists
            if (jobRes.data.contract?.id) {
                try {
                    console.log('Fetching contract detail for ID:', jobRes.data.contract.id);
                    const contractRes = await contractsApi.getContractById(jobRes.data.contract.id);
                    console.log('Contract detail fetched:', contractRes.data);
                    setContractDetail(contractRes.data);
                } catch (contractErr) {
                    console.warn('Failed to fetch contract detail:', contractErr);
                    // Use basic contract info from job data as fallback
                    setContractDetail(jobRes.data.contract);
                }
            }
        } catch (err) {
            console.error("Error fetching job details:", err);
            setError("Failed to load job details.");
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptProposal = async (proposalId) => {
        if (!window.confirm("Accept this proposal? This will create a contract and lock funds.")) return;
        try {
            await jobsApi.acceptProposal(proposalId);
            toast.success("Proposal accepted!");
            fetchJobData(); // Refresh data
        } catch (err) {
            console.error("Error accepting proposal:", err);
            toast.error(err.response?.data?.message || "Failed to accept proposal");
        }
    };

    const handleRejectProposal = async (proposalId) => {
        if (!window.confirm("Reject this proposal?")) return;
        try {
            await jobsApi.rejectProposal(proposalId);
            fetchJobData(); // Refresh data
        } catch (err) {
            console.error("Error rejecting proposal:", err);
            toast.success("Proposal rejected");
        }
    };

    const handleInviteWorker = (workerId) => {
        toast.info(`Invite sent to worker #${workerId}! (Demo)`);
    };

    const handleStartChat = async (userId) => {
        try {
            await chatApi.startChat(userId);
            navigate('/messages');
        } catch (error) {
            console.error('Error starting chat:', error);
            toast.error('Failed to open chat');
        }
    };

    if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
    if (error || !job) return (
        <div className="min-h-screen bg-gray-50 flex">
            <TaskOwnerSidebar />
            <div className="flex-1 flex flex-col items-center justify-center p-6">
                <p className="text-red-500 mb-4">{error || "Job not found"}</p>
                <button onClick={() => navigate("/task-owner/jobs")} className="text-blue-600 hover:underline">Back to My Jobs</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <TaskOwnerSidebar />

            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 px-6 sm:px-10 py-6 sticky top-0 z-20 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <button
                                onClick={() => navigate("/task-owner/jobs")}
                                className="inline-flex items-center text-xs font-semibold text-gray-600 hover:text-gray-900 mb-1"
                            >
                                <span className="mr-1">←</span> Back to My Jobs
                            </button>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">{job.title}</h1>
                            <p className="text-sm text-gray-600 mt-1">
                                {job.category_name} • {new Date(job.created_at).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => navigate(`/task-owner/jobs/${job.id}/edit`)}
                                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 font-bold text-white text-xs rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all shadow-md shadow-blue-500/20"
                                >
                                    Edit Job
                                </button>
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${job.status === "OPEN"
                                        ? "bg-green-100 text-green-700"
                                        : job.status === "IN_PROGRESS"
                                            ? "bg-blue-100 text-blue-700"
                                            : job.status === "CANCELLED"
                                            ? "bg-red-100 text-red-700" 
                                            : "bg-gray-100 text-gray-700"
                                        }`}
                                >
                                    {job.status}
                                </span>
                            </div>
                            <div className="text-xs text-gray-500">
                                Budget:{" "}
                                <span className="font-semibold text-gray-900">
                                    ${Number(job.budget).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main content */}
                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left: job details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Overview */}
                            <section className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow">
                                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                                    Description
                                </h2>
                                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {job.description || "No description provided."}
                                </p>
                            </section>

                            {/* Skills */}
                            {job.skills && job.skills.length > 0 && (
                                <section className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                                        Skills Required
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {job.skills.map((skill) => (
                                            <span
                                                key={skill.id}
                                                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800"
                                            >
                                                {skill.name}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Tabs Section */}
                            <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                <div className="border-b border-gray-100 flex overflow-x-auto">
                                    {['proposals', 'recommended', 'checkpoints', 'contract'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`flex-1 min-w-[120px] py-4 text-sm font-semibold text-center transition-colors whitespace-nowrap capitalize ${
                                                activeTab === tab 
                                                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' 
                                                : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            {tab === 'proposals' ? `Proposals (${proposals.length})` : 
                                             tab === 'recommended' ? 'Candidates' : 
                                             tab}
                                        </button>
                                    ))}
                                </div>
                                
                                <div className="p-8">
                                    {activeTab === 'proposals' && (
                                        <div className="space-y-4">
                                            {proposals.length === 0 ? (
                                                <p className="text-gray-500 text-sm italic">No proposals yet.</p>
                                            ) : (
                                                proposals.map((proposal) => (
                                                    <div key={proposal.id} className="border border-gray-100 rounded-2xl p-5 bg-white hover:shadow-md transition-all group">
                                                        <div className="flex gap-4 mb-3">
                                                            {/* Worker Avatar */}
                                                            <div 
                                                                onClick={() => navigate(`/profile/${proposal.worker_id}`)}
                                                                className="cursor-pointer hover:opacity-80 transition-opacity"
                                                            >
                                                                {proposal.worker_avatar ? (
                                                                    <img 
                                                                        src={proposal.worker_avatar} 
                                                                        alt={proposal.worker_name || 'Worker'}
                                                                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                                                                    />
                                                                ) : (
                                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg border-2 border-gray-200">
                                                                        {(proposal.worker_name || proposal.worker_email || 'W').charAt(0).toUpperCase()}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Worker Info & Proposal Details */}
                                                            <div className="flex-1">
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <div>
                                                                        <div className="flex items-center gap-2">
                                                                            <h3 
                                                                                onClick={() => navigate(`/profile/${proposal.worker_id}`)}
                                                                                className="font-bold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors text-base"
                                                                            >
                                                                                {proposal.worker_name || 'Anonymous Worker'}
                                                                            </h3>
                                                                            {proposal.worker_tier && (
                                                                                <span className={`text-[9px] font-extrabold tracking-wide uppercase rounded-full px-2 py-0.5 border ${
                                                                                    proposal.worker_tier === 'EXPERT' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                                                    proposal.worker_tier === 'PRO' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                                                    'bg-gray-50 text-gray-700 border-gray-100'
                                                                                }`}>
                                                                                    {proposal.worker_tier}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <p className="text-xs text-gray-500 mt-0.5">
                                                                            {proposal.worker_email}
                                                                        </p>
                                                                        <p className="text-xs text-gray-400 mt-1">
                                                                            Applied on {new Date(proposal.created_at).toLocaleDateString()}
                                                                        </p>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <p className="font-bold text-gray-900 text-lg">${Number(proposal.proposed_price || 0).toLocaleString()}</p>
                                                                        <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mt-1 ${
                                                                            proposal.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' : 
                                                                            proposal.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 
                                                                            'bg-yellow-100 text-yellow-700'
                                                                        }`}>
                                                                            {proposal.status}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                {/* Cover Letter */}
                                                                <div className="mt-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100 group-hover:bg-white transition-colors">
                                                                    <p className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Cover Letter</p>
                                                                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{proposal.cover_letter || 'No cover letter provided.'}</p>
                                                                </div>
                                                                
                                                                {/* Action Buttons */}
                                                                <div className="flex gap-2 mt-3">
                                                                    <button 
                                                                        onClick={() => navigate(`/profile/${proposal.worker_id}`)}
                                                                        className="flex-1 px-3 py-2 border border-blue-200 text-blue-600 text-xs font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                                                                    >
                                                                        View Profile
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => handleStartChat(proposal.worker_id)}
                                                                        className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                                                                    >
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                                        </svg>
                                                                        Chat
                                                                    </button>
                                                                    {proposal.status === 'PENDING' && (
                                                                        <>
                                                                            <button 
                                                                                onClick={() => handleAcceptProposal(proposal.id)}
                                                                                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-bold rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all shadow-md shadow-green-500/20"
                                                                            >
                                                                                Accept Proposal
                                                                            </button>
                                                                            <button 
                                                                                onClick={() => handleRejectProposal(proposal.id)}
                                                                                className="flex-1 px-4 py-2.5 border border-red-200 text-red-600 text-xs font-bold rounded-xl hover:bg-red-50 transition-colors"
                                                                            >
                                                                                Reject
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'recommended' && (
                                        <div className="space-y-4">
                                            {recommendedWorkers.length === 0 ? (
                                                <p className="text-gray-500 text-sm italic text-center py-4">
                                                    No recommendations found. Keep adding skills to your job posting!
                                                </p>
                                            ) : (
                                                recommendedWorkers.map((worker) => (
                                                    <div key={worker.id} className="border border-gray-100 rounded-2xl p-5 bg-gradient-to-r from-blue-50/50 to-white hover:shadow-md transition-all">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex gap-3">
                                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                                                                    {worker.full_name?.charAt(0) || "W"}
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        <h3 
                                                                            className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                                                                            onClick={() => navigate(`/profile/${worker.id}`)}
                                                                        >
                                                                            {worker.full_name}
                                                                        </h3>
                                                                        <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                                                            {worker.match_score}% MATCH
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-xs text-gray-600 mt-0.5 line-clamp-1 max-w-md">
                                                                        {worker.bio || "No bio available"}
                                                                    </p>
                                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                                        <span className="text-xs text-gray-500">
                                                                            {worker.matching_skills_count}/{worker.total_required_skills} Skills Match
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-bold text-gray-900">${worker.hourly_rate || 0}/hr</p>
                                                                <button 
                                                                    onClick={() => handleInviteWorker(worker.id)}
                                                                    className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-800 border border-blue-200 px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                                                                >
                                                                    Invite to Apply
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'checkpoints' && (
                                        <div className="space-y-6">
                                            {/* Review Action Banner */}
                                            {contractDetail && (
                                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
                                                    <div className="flex items-start gap-4">
                                                        <div className="p-3 bg-blue-100 rounded-xl">
                                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-gray-900 text-lg">Manage Checkpoints</h3>
                                                            <p className="text-gray-600">Review worker submissions, approve work, and release payments.</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => navigate(`/task-owner/contracts/${contractDetail.id}/review`)}
                                                        className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg transform active:scale-95 transition-all"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        Review Submissions
                                                    </button>
                                                </div>
                                            )}

                                            <div className="space-y-4">
                                                {(contractDetail?.checkpoints || job.checkpoints) && (contractDetail?.checkpoints || job.checkpoints).length > 0 ? (
                                                    (contractDetail?.checkpoints || job.checkpoints).map((cp, idx) => {
                                                        const status = cp.status || 'PENDING';
                                                        return (
                                                            <div key={cp.id || idx} className={`border rounded-xl p-5 transition-all ${
                                                                status === 'APPROVED' ? 'border-green-200 bg-green-50/50' : 
                                                                status === 'SUBMITTED' ? 'border-yellow-200 bg-yellow-50/50' :
                                                                'border-gray-100 bg-white hover:border-blue-200 hover:shadow-md'
                                                            }`}>
                                                                <div className="flex justify-between items-start">
                                                                    <div className="flex gap-4">
                                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                                                                            status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                                                            status === 'SUBMITTED' ? 'bg-yellow-100 text-yellow-700' :
                                                                            'bg-gray-100 text-gray-500'
                                                                        }`}>
                                                                            {idx + 1}
                                                                        </div>
                                                                        <div>
                                                                            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                                                                {cp.title || `Checkpoint ${idx + 1}`}
                                                                                {status === 'APPROVED' && <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                                                                            </h3>
                                                                            {cp.description && <p className="text-sm text-gray-600 mt-1">{cp.description}</p>}
                                                                            
                                                                            <div className="flex gap-4 mt-2">
                                                                                {cp.due_date && (
                                                                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                                                        Due: {new Date(cp.due_date).toLocaleDateString()}
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <div className="font-bold text-gray-900 text-xl">${Number(cp.amount).toLocaleString()}</div>
                                                                        <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                                                                            status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                                                                            status === 'SUBMITTED' ? 'bg-yellow-100 text-yellow-700' :
                                                                            'bg-gray-100 text-gray-500'
                                                                        }`}>
                                                                            {status}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                                        <p className="text-gray-500 italic">No checkpoints defined for this job.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'contract' && (
                                        <div>
                                            {contractDetail ? (
                                                <div className="space-y-6">
                                                    {/* Contract Summary */}
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="text-lg font-bold text-gray-900">Contract Document</h3>
                                                        <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full">
                                                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                                            <span className="text-xs font-bold text-blue-700">{contractDetail.status || 'DRAFT'}</span>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                                                        <div>
                                                            <div className="text-xs font-bold text-gray-500 uppercase mb-1">Total Contract Value</div>
                                                            <div className="text-2xl font-extrabold text-blue-600">${Number(contractDetail.total_amount || 0).toLocaleString()}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs font-bold text-gray-500 uppercase mb-1">Contract ID</div>
                                                            <div className="text-lg font-bold text-gray-900">#{contractDetail.id}</div>
                                                        </div>
                                                    </div>

                                                    {/* Contract Content */}
                                                    {(contractDetail.contract_content || contractDetail.terms) && (
                                                        <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                                                            {/* Document Header */}
                                                            <div className="bg-gray-800 text-white px-6 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                    </svg>
                                                                    <div>
                                                                        <div className="text-sm font-bold">FAF Platform Employment Contract</div>
                                                                        <div className="text-xs text-gray-300">Legally binding agreement</div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Document Body */}
                                                            <div className="bg-white p-8">
                                                                <div 
                                                                    className="prose prose-sm max-w-none
                                                                    prose-headings:font-extrabold prose-headings:text-gray-900 prose-headings:mb-3
                                                                    prose-h2:text-lg prose-h2:border-b-2 prose-h2:border-gray-200 prose-h2:pb-2 prose-h2:mt-6
                                                                    prose-h3:text-base prose-h3:text-blue-700 prose-h3:mt-4
                                                                    prose-p:text-sm prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-3
                                                                    prose-strong:text-gray-900 prose-strong:font-bold
                                                                    prose-ul:list-disc prose-ul:ml-6 prose-ul:text-sm prose-ul:text-gray-700
                                                                    prose-ol:list-decimal prose-ol:ml-6 prose-ol:text-sm prose-ol:text-gray-700"
                                                                    dangerouslySetInnerHTML={{ 
                                                                        __html: contractDetail.contract_content || contractDetail.terms 
                                                                    }}
                                                                />
                                                            </div>

                                                            {/* Document Footer */}
                                                            <div className="bg-gray-50 px-8 py-4 border-t-2 border-gray-200">
                                                                <div className="flex items-center justify-between text-xs text-gray-500">
                                                                    <div className="flex items-center gap-2">
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                                        </svg>
                                                                        <span className="font-semibold">Secured by FAF Escrow System</span>
                                                                    </div>
                                                                    {contractDetail.created_at && (
                                                                        <span>Created: {new Date(contractDetail.created_at).toLocaleDateString()}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Signature Status Section */}
                                                    {contractDetail && (
                                                        <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                                                            <h3 className="text-lg font-bold text-gray-900 mb-4">Contract Signatures</h3>
                                                            
                                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                                {/* Worker Signature */}
                                                                <div className={`p-4 rounded-lg ${
                                                                    contractDetail.signature_worker 
                                                                        ? 'bg-green-50 border-2 border-green-300' 
                                                                        : 'bg-gray-50 border-2 border-gray-300'
                                                                }`}>
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        {contractDetail.signature_worker ? (
                                                                            <div className="p-2 bg-green-100 rounded-lg">
                                                                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                                </svg>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="p-2 bg-gray-100 rounded-lg">
                                                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                </svg>
                                                                            </div>
                                                                        )}
                                                                        <div>
                                                                            <p className="font-semibold text-gray-900">Worker</p>
                                                                            <p className="text-sm text-gray-600">{contractDetail.worker_name || 'Unknown'}</p>
                                                                        </div>
                                                                    </div>
                                                                    <p className={`text-sm font-bold ${
                                                                        contractDetail.signature_worker 
                                                                            ? 'text-green-700' 
                                                                            : 'text-gray-500'
                                                                    }`}>
                                                                        {contractDetail.signature_worker ? 'Signed' : 'Pending'}
                                                                    </p>
                                                                    {contractDetail.worker_signed_at && (
                                                                        <p className="text-xs text-gray-500 mt-1">
                                                                            {new Date(contractDetail.worker_signed_at).toLocaleString()}
                                                                        </p>
                                                                    )}
                                                                </div>

                                                                {/* Employer Signature */}
                                                                <div className={`p-4 rounded-lg ${
                                                                    contractDetail.signature_client 
                                                                        ? 'bg-green-50 border-2 border-green-300' 
                                                                        : 'bg-yellow-50 border-2 border-yellow-300'
                                                                }`}>
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        {contractDetail.signature_client ? (
                                                                            <div className="p-2 bg-green-100 rounded-lg">
                                                                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                                </svg>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="p-2 bg-yellow-100 rounded-lg">
                                                                                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                </svg>
                                                                            </div>
                                                                        )}
                                                                        <div>
                                                                            <p className="font-semibold text-gray-900">You (Employer)</p>
                                                                            <p className="text-sm text-gray-600">{contractDetail.client_name || 'You'}</p>
                                                                        </div>
                                                                    </div>
                                                                    <p className={`text-sm font-bold ${
                                                                        contractDetail.signature_client 
                                                                            ? 'text-green-700' 
                                                                            : 'text-yellow-700'
                                                                    }`}>
                                                                        {contractDetail.signature_client ? 'Signed' : 'Pending Your Signature'}
                                                                    </p>
                                                                    {contractDetail.client_signed_at && (
                                                                        <p className="text-xs text-gray-500 mt-1">
                                                                            {new Date(contractDetail.client_signed_at).toLocaleString()}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Action Buttons */}
                                                            {!contractDetail.signature_client && contractDetail.signature_worker && (
                                                                <div className="bg-white p-4 rounded-lg border-2 border-blue-300">
                                                                    <div className="flex items-start gap-3 mb-3">
                                                                        <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
                                                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                                            </svg>
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <p className="font-bold text-gray-900 mb-1">Ready for Your Signature</p>
                                                                            <p className="text-sm text-gray-600">
                                                                                The worker has signed the contract. Please review and sign to activate the job.
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => navigate(`/task-owner/contract/${contractDetail.id}/sign`)}
                                                                        className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                                                    >
                                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                                        </svg>
                                                                        Review & Sign Contract
                                                                    </button>
                                                                </div>
                                                            )}

                                                            {!contractDetail.signature_worker && (
                                                                <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-300">
                                                                    <div className="flex items-start gap-3">
                                                                        <div className="flex-shrink-0 p-2 bg-yellow-100 rounded-lg">
                                                                            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                            </svg>
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-bold text-yellow-900 mb-1">Waiting for Worker Signature</p>
                                                                            <p className="text-sm text-yellow-800">
                                                                                The worker needs to review and sign this contract before you can sign it.
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {contractDetail.signature_client && contractDetail.signature_worker && (
                                                                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
                                                                    <div className="flex items-start gap-3">
                                                                        <div className="flex-shrink-0 p-2 bg-green-100 rounded-lg">
                                                                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                            </svg>
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-bold text-green-900 mb-1">Contract Fully Signed!</p>
                                                                            <p className="text-sm text-green-800">
                                                                                Both parties have signed. The contract is now active and work can begin.
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 text-sm italic">No contract created yet.</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Right: summary card */}
                        <div className="space-y-6">
                            <section className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow sticky top-[100px]">
                                <h2 className="text-sm font-semibold text-gray-900 mb-3">
                                    Job Details
                                </h2>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="font-medium">{job.job_type}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Duration</span>
                                        <span className="font-medium text-right">
                                            {job.start_date ? new Date(job.start_date).toLocaleDateString() : 'ASAP'} - {job.end_date ? new Date(job.end_date).toLocaleDateString() : 'Open'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Budget</span>
                                        <span className="font-medium">${Number(job.budget).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Status</span>
                                        <span className="font-medium">{job.status}</span>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default JobDetail;

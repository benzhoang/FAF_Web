import React, { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { matchingApi } from '../../api/matching.api';
import { proposalsApi } from '../../api/proposals.api';
import { contractsApi } from '../../api/contracts.api';
import { reviewsApi } from '../../api/reviews.api';
import warehouseImg from '../../assets/istockphoto-1947499362-612x612.jpg';
import StatCard from './components/StatCard';
import JobTable from './components/JobTable';
import ReviewsList from './components/ReviewsList';

const WorkerDashboard = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const [myProposals, setMyProposals] = useState([]);
    const [allContracts, setAllContracts] = useState([]);
    const [activeContract, setActiveContract] = useState(null);
    const [loading, setLoading] = useState(true);
    const [proposalsLoading, setProposalsLoading] = useState(true);
    const [contractLoading, setContractLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [reviewsData, setReviewsData] = useState({ reviews: [], summary: null });
    const [reviewsLoading, setReviewsLoading] = useState(true);

    const todayGreeting = useMemo(() => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Good morning'
        if (hour < 18) return 'Good afternoon'
        return 'Good evening'
    }, [])

    const userName = useMemo(() => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || 'null')
            return user?.fullName || user?.email || 'Worker'
        } catch {
            return 'Worker'
        }
    }, [])

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                setLoading(true);
                const res = await matchingApi.getRecommendedJobs({ limit: 5 });
                
                // Map API data to UI structure
                const mappedJobs = (res?.data ?? []).map(job => ({
                    id: job.id,
                    title: job.title,
                    company: job.category_name || 'General',
                    price: `$${Number(job.budget).toLocaleString()}`,
                    meta: [
                        { icon: 'calendar', text: new Date(job.created_at).toLocaleDateString() },
                        { icon: 'spark', text: `${job.job_type === 'SHORT_TERM' ? 'Short Term' : 'Long Term'}` }
                    ],
                    badge: `${job.match_score}% MATCH`,
                    extra: `${job.matching_skills_count} matching skills`,
                    img: warehouseImg // Placeholder for now
                }));
                
                setRecommendedJobs(mappedJobs);
            } catch (error) {
                console.error("Error fetching recommendations:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchMyProposals = async () => {
            try {
                setProposalsLoading(true);
                const res = await proposalsApi.getMyProposals();
                setMyProposals(res.data || []);
            } catch (error) {
                console.error("Error fetching proposals:", error);
            } finally {
                setProposalsLoading(false);
            }
        };

        const fetchContracts = async () => {
            try {
                setContractLoading(true);
                const [activeRes, allRes] = await Promise.all([
                    contractsApi.getMyActiveContract(),
                    contractsApi.getMyContracts()
                ]);
                setActiveContract(activeRes.data ?? null);
                setAllContracts(allRes.data || []);
            } catch (error) {
                console.error("❌ Error fetching contracts:", error);
            } finally {
                setContractLoading(false);
            }
        };
        
        const fetchReviews = async () => {
            try {
                setReviewsLoading(true);
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                if (user.id) {
                    const res = await reviewsApi.getUserReviews(user.id);
                    setReviewsData({ reviews: res.data || [], summary: res.summary || null });
                }
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setReviewsLoading(false);
            }
        };

        fetchRecommendations();
        fetchMyProposals();
        fetchContracts();
        fetchReviews();
    }, []);

    return (
        <div className="w-full min-h-screen bg-blue-100">
            <div className="mx-auto max-w-7xl px-4 py-8">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                     {/* Left Sidebar */}
                     <aside className="lg:col-span-3">
                        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                            <div className="mb-6 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="truncate text-sm font-semibold text-gray-900">{userName}</p>
                                    {JSON.parse(localStorage.getItem('user') || '{}')?.tier && (
                                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                                            JSON.parse(localStorage.getItem('user') || '{}')?.tier === 'EXPERT' ? 'bg-purple-100 text-purple-700' : 
                                            JSON.parse(localStorage.getItem('user') || '{}')?.tier === 'PRO' ? 'bg-blue-100 text-blue-700' : 
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                            {JSON.parse(localStorage.getItem('user') || '{}')?.tier}
                                        </span>
                                    )}
                                </div>
                                <p className="truncate text-xs text-gray-500">Worker Profile</p>
                            </div>

                            <div className="space-y-5">
                                {/* Sidebar content kept static for now */}
                                <div className="rounded-xl border border-gray-100 bg-gray-50/40 p-4">
                                    <div className="mb-3 flex items-center justify-between">
                                        <p className="text-sm font-semibold text-gray-900">Upcoming Checkpoints</p>
                                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                                            0 Active
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 italic">No active contracts</p>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <section className="lg:col-span-9">
                        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                                <div className="min-w-0">
                                    <h1 className="truncate text-2xl font-bold text-gray-900">
                                        {todayGreeting}, {userName}!
                                    </h1>
                                    <p className="mt-1 text-sm text-gray-500">Ready for your next gig?</p>
                                </div>
                            </div>

                            {/* Tabs Navigation */}
                            <div className="mt-8 border-b border-gray-200">
                                <nav className="-mb-px flex space-x-8">
                                    {['overview', 'jobs', 'reviews'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm transition-colors ${
                                                activeTab === tab
                                                ? 'border-blue-600 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                        >
                                            {tab === 'overview' ? 'Overview' : tab === 'jobs' ? 'My Jobs & History' : 'Ratings & Reviews'}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            <div className="mt-6">
                                {activeTab === 'overview' && (
                                    <>
                                        {/* Statistics Section using StatCard */}
                                        {!contractLoading && (
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <StatCard 
                                                    title="Total Earned" 
                                                    value={`$${allContracts.filter(c => c.status === 'COMPLETED').reduce((sum, c) => sum + Number(c.total_amount || 0), 0).toLocaleString()}`} 
                                                    subtitle="Lifetime Earnings" 
                                                    bgColor="bg-gradient-to-br from-blue-500 to-indigo-600" 
                                                    valueColor="text-white"
                                                    border="border-transparent"
                                                />
                                                <StatCard 
                                                    title="Success Rate" 
                                                    value={`${allContracts.length > 0 ? Math.round((allContracts.filter(c => c.status === 'COMPLETED').length / (allContracts.filter(c => ['COMPLETED', 'CANCELLED'].includes(c.status)).length || 1)) * 100) : 100}%`} 
                                                    progress={allContracts.length > 0 ? (allContracts.filter(c => c.status === 'COMPLETED').length / (allContracts.filter(c => ['COMPLETED', 'CANCELLED'].includes(c.status)).length || 1)) * 100 : 100}
                                                />
                                                <StatCard 
                                                    title="Jobs Completed" 
                                                    value={allContracts.filter(c => c.status === 'COMPLETED').length} 
                                                    subtitle={`${allContracts.filter(c => c.status === 'ACTIVE').length} currently active`}
                                                />
                                            </div>
                                        )}


                            {/* Active Contract Card */}
                            {!contractLoading && activeContract && (
                                <div className="mt-6 rounded-xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white mb-3">
                                                🚀 ACTIVE JOB
                                            </span>
                                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{activeContract.job_title}</h2>
                                            <p className="text-gray-700 mb-2">{activeContract.job_description}</p>
                                            <div className="flex items-center gap-4 text-sm">
                                                <span className="text-gray-600">
                                                    Client: <strong>{activeContract.client_name || 'Unknown'}</strong>
                                                </span>
                                                <span className="text-gray-600">
                                                    Value: <strong className="text-green-600">${Number(activeContract.total_amount || 0).toLocaleString()}</strong>
                                                </span>
                                            </div>
                                            
                                            {/* Signature Status */}
                                            <div className="flex gap-3 mt-3">
                                                <span className={`text-xs px-2 py-1 rounded ${activeContract.signature_worker ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    {activeContract.signature_worker ? '✅ You signed' : '⏳ Not signed'}
                                                </span>
                                                <span className={`text-xs px-2 py-1 rounded ${activeContract.signature_client ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    {activeContract.signature_client ? '✅ Employer signed' : '⏳ Employer pending'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-3">
                                        {!activeContract.signature_worker ? (
                                            <button
                                                onClick={() => navigate(`/contract/${activeContract.id}/sign`)}
                                                className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                📝 Review & Sign Contract
                                            </button>
                                        ) : !activeContract.signature_client ? (
                                            <button
                                                disabled
                                                className="px-6 py-3 bg-gray-400 text-white font-bold rounded-lg cursor-not-allowed opacity-60"
                                                title="Waiting for employer to sign"
                                            >
                                                ⏳ Waiting for Employer Signature
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => navigate('/my-job')}
                                                className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                                ✅ Start Working
                                            </button>
                                        )}
                                        <button
                                            onClick={() => navigate(`/contract/${activeContract.id}/view`)}
                                            className="px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* My Applications Section */}
                            <div className="mt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-sm font-bold text-gray-900">My Applications</h2>
                                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                        {myProposals.length} Total
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {proposalsLoading ? (
                                        <p className="text-center py-6 text-gray-500 text-sm">Loading applications...</p>
                                    ) : myProposals.length === 0 ? (
                                        <div className="text-center py-8 px-4 bg-gray-50 rounded-xl border border-gray-200">
                                            <p className="text-gray-600 mb-1 text-sm font-medium">No applications yet</p>
                                            <p className="text-xs text-gray-500">Start applying to jobs to see them here!</p>
                                            <button 
                                                onClick={() => navigate('/find-work')}
                                                className="mt-3 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700"
                                            >
                                                Browse Jobs
                                            </button>
                                        </div>
                                    ) : (
                                        myProposals.slice(0, 5).map((proposal) => {
                                            // Find the contract for this proposal to check its real-time status
                                            const relatedContract = allContracts.find(c => c.job_id === proposal.job_id);
                                            const contractStatus = relatedContract?.status || proposal.status;
                                            const isFinished = ['COMPLETED', 'CANCELLED', 'TERMINATED'].includes(contractStatus);

                                            return (
                                                <div 
                                                    key={proposal.id} 
                                                    className="border border-gray-200 rounded-xl p-4 bg-white hover:shadow-md transition-shadow"
                                                >
                                                    <div className="flex justify-between items-start gap-4">
                                                        <div 
                                                            className="flex-1 min-w-0 cursor-pointer"
                                                            onClick={() => navigate(`/work/${proposal.job_id}`)}
                                                        >
                                                            <h3 className="font-bold text-gray-900 text-base truncate">
                                                                {proposal.job_title}
                                                            </h3>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {proposal.category_name} • Applied {new Date(proposal.created_at).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <div className="text-right shrink-0">
                                                            <p className="font-bold text-gray-900">${Number(proposal.proposed_price || 0).toLocaleString()}</p>
                                                            <span className={`inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                                                                contractStatus === 'COMPLETED' || proposal.status === 'ACCEPTED' && contractStatus === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                                contractStatus === 'CANCELLED' || contractStatus === 'TERMINATED' ? 'bg-red-100 text-red-700' :
                                                                proposal.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                                'bg-yellow-100 text-yellow-700'
                                                            }`}>
                                                                {contractStatus}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Start Working Button for ACCEPTED */}
                                                    {proposal.status === 'ACCEPTED' && (
                                                        <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
                                                            <button
                                                                onClick={async () => {
                                                                    if (contractStatus === 'CANCELLED' || contractStatus === 'TERMINATED') {
                                                                        toast.error('❌ This contract was cancelled.');
                                                                        return;
                                                                    }
                                                                    try {
                                                                        // Fetch contract for this specific job
                                                                        const res = await contractsApi.getContractByJob(proposal.job_id);
                                                                        const contract = res.data;
                                                                        
                                                                        if (contract) {
                                                                            if (contract.status === 'CANCELLED' || contract.status === 'TERMINATED') {
                                                                                toast.error('❌ This contract was cancelled.');
                                                                                return;
                                                                            }
                                                                            if (contract.status === 'COMPLETED') {
                                                                                navigate('/my-job'); // Will show finished view in ActiveJob
                                                                                return;
                                                                            }
                                                                            if (!contract.signature_worker) navigate(`/contract/${contract.id}/sign`);
                                                                            else if (!contract.signature_client) toast.warning('⏳ Waiting for employer signature.');
                                                                            else navigate('/my-job');
                                                                        }
                                                                    } catch (error) {
                                                                        console.error(error);
                                                                        toast.error('Failed to load contract.');
                                                                    }
                                                                }}
                                                                className={`flex-1 px-4 py-2 text-white text-sm font-bold rounded-lg transition-colors ${
                                                                    contractStatus === 'COMPLETED' ? 'bg-green-600 hover:bg-green-700' :
                                                                    isFinished ? 'bg-gray-400 cursor-not-allowed' :
                                                                    'bg-blue-600 hover:bg-blue-700'
                                                                }`}
                                                            >
                                                                {contractStatus === 'COMPLETED' ? '✅ View Work' : 
                                                                 isFinished ? '❌ Job Ended' : '🚀 Start Working'}
                                                            </button>
                                                            <button
                                                                onClick={() => navigate(`/work/${proposal.job_id}`)}
                                                                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                                                            >
                                                                View Job
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                    )}
                                    {myProposals.length > 5 && (
                                        <button 
                                            onClick={() => navigate('/my-proposals')}
                                            className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-semibold"
                                        >
                                            View All Applications →
                                        </button>
                                    )}
                                </div>
                            </div>



                            <div className="mt-8">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-sm font-bold text-gray-900">Recommended for You</h2>
                                    <button 
                                        onClick={() => navigate('/find-work')}
                                        className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                                    >
                                        View All
                                    </button>
                                </div>

                                <div className="mt-4 space-y-4">
                                    {loading ? (
                                        <p className="text-center py-8 text-gray-500">Finding best matches for you...</p>
                                    ) : recommendedJobs.length === 0 ? (
                                        <div className="text-center py-8 px-4 bg-gray-50 rounded-xl">
                                            <p className="text-gray-600 mb-2">No recommendations yet.</p>
                                            <p className="text-xs text-gray-500">Try adding more skills to your profile to get matched!</p>
                                            <button 
                                                onClick={() => navigate('/settings')}
                                                className="mt-3 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700"
                                            >
                                                Update Skills
                                            </button>
                                        </div>
                                    ) : (
                                        recommendedJobs.map((job) => (
                                            <div
                                                key={job.id}
                                                className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md cursor-pointer"
                                                onClick={() => navigate(`/work/${job.id}`)}
                                            >
                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                                    <div className="relative h-28 w-full overflow-hidden rounded-xl sm:h-24 sm:w-44">
                                                        <img
                                                            src={job.img}
                                                            alt={job.title}
                                                            className="h-full w-full object-cover"
                                                            loading="lazy"
                                                        />
                                                        {job.badge ? (
                                                            <span className="absolute left-2 top-2 rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-extrabold text-emerald-700">
                                                                {job.badge}
                                                            </span>
                                                        ) : null}
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="min-w-0">
                                                                <p className="truncate text-base font-bold text-gray-900">{job.title}</p>
                                                                <p className="truncate text-sm text-gray-500">{job.company}</p>
                                                            </div>
                                                            <div className="shrink-0 text-right">
                                                                <p className="text-base font-extrabold text-gray-900">{job.price}</p>
                                                            </div>
                                                        </div>

                                                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-gray-600">
                                                            {job.meta.map((m, idx) => (
                                                                <span key={`${job.id}-${idx}`} className="inline-flex items-center gap-1.5">
                                                                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-gray-50 text-gray-500">
                                                                        <svg
                                                                            className="h-3.5 w-3.5"
                                                                            viewBox="0 0 24 24"
                                                                            fill="none"
                                                                            stroke="currentColor"
                                                                        >
                                                                            {/* Simple generic icon path if needed, or rely on existing ones but simplified for brevity */}
                                                                            <path
                                                                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                                                                                strokeWidth="2"
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                            />
                                                                        </svg>
                                                                    </span>
                                                                    {m.text}
                                                                </span>
                                                            ))}
                                                        </div>

                                                        <div className="mt-3 flex items-center justify-between gap-3">
                                                            <p className="text-xs text-gray-500">{job.extra}</p>
                                                            <button 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    navigate(`/work/${job.id}`);
                                                                }}
                                                                className="inline-flex items-center justify-center rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-blue-700 hover:bg-blue-50"
                                                            >
                                                                View Details
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                                    </>
                                )}

                                {activeTab === 'jobs' && (
                                    <div className="pt-4 animate-fadeIn">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-xl font-bold text-gray-900">My Jobs & History</h2>
                                            <button 
                                                onClick={() => navigate('/find-work')}
                                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors"
                                            >
                                                Find Work
                                            </button>
                                        </div>
                                        {contractLoading ? (
                                            <p className="text-gray-500 text-center py-10">Loading jobs...</p>
                                        ) : (
                                            <JobTable contracts={allContracts} />
                                        )}
                                    </div>
                                )}

                                {activeTab === 'reviews' && (
                                    <div className="pt-4 animate-fadeIn">
                                        {reviewsLoading ? (
                                            <p className="text-gray-500 text-center py-10">Loading reviews...</p>
                                        ) : (
                                            <ReviewsList reviews={reviewsData.reviews} summary={reviewsData.summary} />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default WorkerDashboard
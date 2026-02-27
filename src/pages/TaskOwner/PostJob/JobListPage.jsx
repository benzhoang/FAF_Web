import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jobsApi } from "../../../api/jobs.api";
import TaskOwnerSidebar from "../../../components/TaskOwnerSidebar";
import { useToast } from "../../../contexts/ToastContext";

export default function JobListPage() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        async function fetchJobs() {
            try {
                const response = await jobsApi.getAllJobs();
                setJobs(response.data || []);
            } catch (err) {
                toast.error("Không thể tải danh sách công việc");
            } finally {
                setLoading(false);
            }
        }
        fetchJobs();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'OPEN': return 'bg-green-100 text-green-700 border-green-200';
            case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'COMPLETED': return 'bg-gray-100 text-gray-700 border-gray-200';
            case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <TaskOwnerSidebar />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm px-6 py-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-5xl mx-auto w-full">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">My Job Postings</h1>
                            <p className="text-sm font-medium text-gray-500 mt-1">
                                Manage your open roles, track proposals, and review ongoing contracts.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate("/task-owner/post-job")}
                                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold shadow-sm shadow-blue-500/20 transition-all flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                                Post New Job
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-5xl mx-auto">
                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <div className="text-xl font-semibold text-gray-400">Loading jobs...</div>
                            </div>
                        ) : jobs.length === 0 ? (
                            <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center shadow-sm">
                                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No jobs posted yet</h3>
                                <p className="text-gray-500 mb-6 max-w-md mx-auto">You haven't posted any jobs. Create your first job posting to start receiving proposals from top talents.</p>
                                <button
                                    onClick={() => navigate("/task-owner/post-job")}
                                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors"
                                >
                                    Post a Job Now
                                </button>
                            </div>
                        ) : (
                            <div className="grid gap-5">
                                {jobs.map((job) => (
                                    <div
                                        key={job.id}
                                        className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                            <div>
                                                <Link to={`/task-owner/job/${job.id}`} className="group">
                                                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</h2>
                                                </Link>
                                                <div className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-2">
                                                    <span className="bg-gray-100 px-2 py-0.5 rounded-md text-gray-700">{job.category_name}</span>
                                                    <span>•</span>
                                                    <span>Posted on {new Date(job.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide shrink-0 ${getStatusColor(job.status)}`}>
                                                {job.status}
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-600 line-clamp-2 mb-5 leading-relaxed">
                                            {job.description || "No description provided."}
                                        </p>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-b border-gray-100 mb-5">
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Type</p>
                                                <p className="text-sm font-semibold text-gray-900">{job.job_type === 'SHORT_TERM' ? 'Fixed Price' : 'Long Term'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Budget</p>
                                                <p className="text-sm font-semibold text-gray-900">${Number(job.budget).toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Duration</p>
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {new Date(job.start_date).toLocaleDateString()} - {job.end_date ? new Date(job.end_date).toLocaleDateString() : 'TBD'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Proposals</p>
                                                <p className="text-sm font-semibold text-blue-600">{job.proposals_count || 0} received</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex flex-wrap gap-2">
                                                {job.skills && job.skills.length > 0 ? (
                                                    job.skills.map((skill) => (
                                                        <span key={skill.id} className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                            {skill.name}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-xs italic text-gray-400">No skills specified</span>
                                                )}
                                            </div>
                                            <div className="flex gap-2 shrink-0">
                                                <Link 
                                                    to={`/task-owner/job/${job.id}`}
                                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl transition-colors"
                                                >
                                                    View Details
                                                </Link>
                                                {job.status === 'OPEN' && (
                                                    <button className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-bold rounded-xl transition-colors">
                                                        Edit Job
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

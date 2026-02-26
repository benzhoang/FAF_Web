import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";
import TaskOwnerSidebar from "../../components/TaskOwnerSidebar";
import { useAuth } from "../../auth/AuthContext";
import { jobsApi } from "../../api/jobs.api";

const Jobs = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchMyJobs();
        }
    }, [user]);

    const fetchMyJobs = async () => {
        try {
            setLoading(true);
            const response = await jobsApi.getMyJobs(user.id);
            setJobs(response.data || []);
        } catch (error) {
            console.error("Error fetching my jobs:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteJob = async (id) => {
        if (window.confirm("Are you sure you want to delete this job?")) {
            try {
                await jobsApi.deleteJob(id);
                fetchMyJobs(); // Refresh list
            } catch (error) {
                console.error("Error deleting job:", error);
                toast.error("Failed to delete job");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <TaskOwnerSidebar />

            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">My Jobs</h1>
                            <p className="text-sm text-gray-600">
                                Manage all the jobs you have posted on FAF.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate("/task-owner/post-job")}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-colors"
                        >
                            + Post a New Job
                        </button>
                    </div>
                </header>

                {/* Main content */}
                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Job Listings
                            </h2>
                            <span className="text-xs font-semibold text-gray-500">
                                {jobs.length} jobs
                            </span>
                        </div>

                        {loading ? (
                            <div className="p-8 text-center text-gray-500">Loading jobs...</div>
                        ) : jobs.length === 0 ? (
                            <div className="p-12 text-center">
                                <p className="text-gray-500 mb-4">You haven't posted any jobs yet.</p>
                                <button
                                    onClick={() => navigate("/task-owner/post-job")}
                                    className="text-blue-600 hover:underline font-semibold"
                                >
                                    Post your first job
                                </button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Job
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Type
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Budget
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Proposals
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {jobs.map((job) => (
                                            <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 text-sm">
                                                    <div className="font-semibold text-gray-900">
                                                        {job.title}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {job.category_name} •{" "}
                                                        {new Date(job.created_at).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {job.job_type === 'SHORT_TERM' ? 'Short-term' : 'Long-term'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                                                    ${Number(job.budget).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    <span className="inline-flex items-center gap-1">
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                        </svg>
                                                        {job.proposal_count || 0}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                            job.status === "OPEN"
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
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() =>
                                                                navigate(`/task-owner/jobs/${job.id}`)
                                                            }
                                                            className="inline-flex items-center px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                                                        >
                                                            View
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteJob(job.id)}
                                                            className="inline-flex items-center px-3 py-1.5 rounded-lg border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Jobs;

import React from "react";
import { useNavigate } from "react-router-dom";
import TaskOwnerSidebar from "../../components/TaskOwnerSidebar";

const mockJobs = [
    {
        id: "1",
        title: "Landing Page Redesign",
        status: "Open",
        type: "Short-term",
        budget: 2500,
        createdAt: "2026-01-25",
        proposals: 8,
        category: "Design",
        location: "Remote",
    },
    {
        id: "2",
        title: "Mobile App Development (iOS & Android)",
        status: "In Progress",
        type: "Long-term",
        budget: 12000,
        createdAt: "2026-01-18",
        proposals: 15,
        category: "Development",
        location: "Remote",
    },
    {
        id: "3",
        title: "SEO Audit & Optimization",
        status: "Completed",
        type: "Short-term",
        budget: 1800,
        createdAt: "2026-01-05",
        proposals: 6,
        category: "Marketing",
        location: "Hybrid",
    },
];

const Jobs = () => {
    const navigate = useNavigate();

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
                                {mockJobs.length} jobs
                            </span>
                        </div>

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
                                    {mockJobs.map((job) => (
                                        <tr key={job.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm">
                                                <div className="font-semibold text-gray-900">
                                                    {job.title}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {job.category} •{" "}
                                                    {new Date(job.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {job.type}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                ${job.budget.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {job.proposals}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${job.status === "Open"
                                                        ? "bg-green-100 text-green-700"
                                                        : job.status === "In Progress"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : "bg-gray-100 text-gray-700"
                                                        }`}
                                                >
                                                    {job.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm">
                                                <button
                                                    onClick={() =>
                                                        navigate(`/task-owner/jobs/${job.id}`, {
                                                            state: { job },
                                                        })
                                                    }
                                                    className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                                                >
                                                    View details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Jobs;

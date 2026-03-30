import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../api/user.api";

const Talents = () => {
    const navigate = useNavigate();
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTalents();
    }, []);

    const fetchTalents = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await userApi.getFeaturedWorkers();
            // Handle both array and object response shapes safely
            const data = Array.isArray(res?.data) ? res.data : 
                         Array.isArray(res) ? res : [];
            setWorkers(data);
        } catch (err) {
            console.error("Error fetching talents:", err);
            setError(err?.response?.data?.message || "Không thể tải danh sách tài năng. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return "U";
        return name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);
    };

    return (
        <div className="min-h-screen bg-transparent flex">

            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Top Talents</h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Discover outstanding professionals for your projects.
                            </p>
                        </div>
                    </div>
                </header>

                {/* Main content */}
                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-6xl mx-auto space-y-6">
                        {/* Summary */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <span className="font-semibold">{workers.length}</span>{" "}
                                    talents recommended based on popularity.
                                </p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-10 text-gray-500">Loading talents...</div>
                        ) : error ? (
                            <div className="text-center py-10">
                                <p className="text-red-500 mb-3">{error}</p>
                                <button
                                    onClick={fetchTalents}
                                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                                >
                                    Thử lại
                                </button>
                            </div>
                        ) : workers.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">No talents found.</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {workers.map((worker) => (
                                    <div
                                        key={worker.id}
                                        className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-5 flex flex-col h-full hover:shadow-md dark:hover:border-blue-700 transition-all cursor-pointer"
                                    >
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                                                {getInitials(worker.full_name)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h2 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                                                        {worker.full_name || "Unknown User"}
                                                    </h2>
                                                    {worker.tier && (
                                                        <span className={`text-[9px] font-extrabold tracking-wide uppercase rounded-full px-2 py-0.5 border ${
                                                            worker.tier === 'EXPERT' ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-100 dark:border-purple-800' :
                                                            worker.tier === 'PRO' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-800' :
                                                            'bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-gray-300 border-gray-100 dark:border-slate-600'
                                                        }`}>
                                                            {worker.tier}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                                    {Array.isArray(worker.skills) && worker.skills.length > 0 
                                                        ? worker.skills[0].name || worker.skills[0] // handle object or string
                                                        : typeof worker.skills === 'string' ? worker.skills : "Freelancer"} 
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 truncate">
                                                    {worker.location || "Remote"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="flex items-center gap-1">
                                                <span className="text-yellow-400">★</span>
                                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    {Number(worker.rating_avg || 0).toFixed(1)}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    ({worker.total_jobs_done || 0} jobs)
                                                </span>
                                            </div>
                                            {/* Success rate placeholder skipped as we don't calculate it yet */}
                                        </div>

                                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                                            {worker.bio || "No overview provided."}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {Array.isArray(worker.skills) && worker.skills.slice(0, 4).map((skill, idx) => (
                                                <span
                                                    key={idx}
                                                    className="text-xs bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-full"
                                                >
                                                    {typeof skill === 'object' ? skill.name : skill}
                                                </span>
                                            ))}
                                            {typeof worker.skills === 'string' && worker.skills.split(',').slice(0, 4).map((skill, idx) => (
                                                <span
                                                    key={idx}
                                                    className="text-xs bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-full"
                                                >
                                                    {skill.trim()}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    ${Number(worker.hourly_rate || 0).toLocaleString()}/hr
                                                </p>
                                            </div>
                                            <button 
                                                onClick={() => navigate(`/profile/${worker.id}`)}
                                                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors"
                                            >
                                                View profile
                                            </button>
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
};

export default Talents;


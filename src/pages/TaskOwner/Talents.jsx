import React from "react";
import { useNavigate } from "react-router-dom";
import TaskOwnerSidebar from "../../components/TaskOwnerSidebar";

const featuredWorkers = [
    {
        id: "w1",
        name: "David Kim",
        role: "Senior Full‑Stack Developer",
        initials: "DK",
        rating: 5.0,
        jobs: 32,
        hourlyRate: 60,
        successRate: 98,
        location: "Remote • GMT+7",
        topSkills: ["React", "Node.js", "TypeScript", "AWS"],
        overview:
            "Specialized in building scalable web applications, SaaS platforms and dashboards.",
    },
    {
        id: "w2",
        name: "Anna Nguyen",
        role: "Product Designer (UX/UI)",
        initials: "AN",
        rating: 4.9,
        jobs: 27,
        hourlyRate: 45,
        successRate: 97,
        location: "Ho Chi Minh City, VN",
        topSkills: ["Figma", "Design System", "Prototyping", "User Research"],
        overview:
            "Designing human‑centered digital products with a focus on conversion and usability.",
    },
    {
        id: "w3",
        name: "Michael Tran",
        role: "DevOps & Cloud Engineer",
        initials: "MT",
        rating: 4.95,
        jobs: 18,
        hourlyRate: 70,
        successRate: 99,
        location: "Remote • APAC",
        topSkills: ["Kubernetes", "Docker", "CI/CD", "AWS"],
        overview:
            "Helps teams automate deployments, improve reliability and reduce cloud costs.",
    },
];

const Talents = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <TaskOwnerSidebar />

            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Top Talents</h1>
                            <p className="text-sm text-gray-600">
                                Discover standout workers who fit your project needs.
                            </p>
                        </div>
                    </div>
                </header>

                {/* Main content */}
                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-6xl mx-auto space-y-6">
                        {/* Summary & filter bar (simple static for now) */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <p className="text-sm text-gray-700">
                                    <span className="font-semibold">{featuredWorkers.length}</span>{" "}
                                    talents recommended based on common hiring needs.
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option>Sort by: Highest rating</option>
                                    <option>Sort by: Most jobs</option>
                                    <option>Sort by: Hourly rate</option>
                                </select>
                            </div>
                        </div>

                        {/* Talent cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {featuredWorkers.map((worker) => (
                                <div
                                    key={worker.id}
                                    className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col h-full"
                                >
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                                            {worker.initials}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h2 className="text-base font-semibold text-gray-900">
                                                    {worker.name}
                                                </h2>
                                                <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-0.5 rounded">
                                                    Featured
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">{worker.role}</p>
                                            <p className="text-xs text-gray-500 mt-1">{worker.location}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="flex items-center gap-1">
                                            <span className="text-yellow-400">★</span>
                                            <span className="text-sm font-semibold text-gray-900">
                                                {worker.rating.toFixed(2)}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                ({worker.jobs} jobs)
                                            </span>
                                        </div>
                                        <div className="h-4 w-px bg-gray-200" />
                                        <div className="text-xs text-gray-600">
                                            {worker.successRate}% job success
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-700 mb-4">
                                        {worker.overview}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {worker.topSkills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">
                                                ${worker.hourlyRate}/hr
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Estimated: ${worker.hourlyRate * 40} / week
                                            </p>
                                        </div>
                                        <button
                                            onClick={() =>
                                                navigate(`/task-owner/talent/${worker.id}`, {
                                                    state: { worker },
                                                })
                                            }
                                            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors"
                                        >
                                            View profile
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Talents;


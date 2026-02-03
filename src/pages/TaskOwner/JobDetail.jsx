import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TaskOwnerSidebar from "../../components/TaskOwnerSidebar";

// Fallback mock data in case user refreshes detail page (no location.state)
const fallbackJobs = [
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
        description:
            "Redesign the main marketing landing page to improve conversion rate and modernize the visual style.",
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
        description:
            "Build a cross-platform mobile app for an e-commerce platform, including authentication, product catalog, and checkout.",
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
        description:
            "Perform a full SEO audit and implement on-page optimizations for a 50-page website.",
    },
];

// Enrich base job data into a more detailed, professional structure
const buildDetailedJob = (job) => {
    const base = {
        responsibilities: [],
        requirements: [],
        skills: [],
        milestones: [],
        collaboration: {
            timezone: "Flexible, overlap 3–4 hours with GMT+7",
            communication: "Slack, Zoom, and email (English)",
            reporting: "Weekly check-ins with progress summary",
        },
    };

    switch (String(job.id)) {
        case "1":
            return {
                ...job,
                ...base,
                description:
                    job.description ||
                    "We are looking for a product-minded designer to refresh our main marketing landing page with a modern, conversion-focused experience.",
                responsibilities: [
                    "Audit the current landing page UX and identify friction points.",
                    "Create 2–3 high-fidelity layout options in Figma.",
                    "Define a responsive design system (desktop, tablet, mobile).",
                    "Collaborate with our marketing lead to refine messaging and hierarchy.",
                    "Prepare developer-ready assets and handoff documentation.",
                ],
                requirements: [
                    "3+ years experience in product or marketing design.",
                    "Strong portfolio with web landing page projects.",
                    "Proficiency with Figma and modern design systems.",
                    "Ability to reason about conversion funnels and A/B testing.",
                ],
                skills: ["Figma", "Conversion Optimization", "Design Systems", "Responsive Web"],
                milestones: [
                    {
                        label: "Discovery & Wireframes",
                        eta: "Week 1",
                        description:
                            "Review existing page performance, run stakeholder interviews, and deliver low-fidelity wireframes.",
                    },
                    {
                        label: "Visual Design",
                        eta: "Week 2",
                        description:
                            "Deliver final high-fidelity designs for all breakpoints and key interactions.",
                    },
                    {
                        label: "Handoff",
                        eta: "Week 3",
                        description:
                            "Prepare dev handoff, design tokens, and support implementation QA.",
                    },
                ],
                collaboration: {
                    timezone: "GMT+7 preferred, but flexible",
                    communication: "Slack for async, Zoom for weekly review calls",
                    reporting: "Short written update twice per week",
                },
            };
        case "2":
            return {
                ...job,
                ...base,
                description:
                    job.description ||
                    "Long-term engagement to build and maintain a cross-platform mobile app for our e-commerce business.",
                responsibilities: [
                    "Design and implement app architecture using React Native or Flutter.",
                    "Integrate with existing REST/GraphQL APIs and payment gateways.",
                    "Collaborate with in-house designer to translate UI specs into production-ready screens.",
                    "Set up analytics, error tracking, and performance monitoring.",
                    "Provide ongoing maintenance and feature iterations.",
                ],
                requirements: [
                    "5+ years experience building production mobile apps.",
                    "Shipped at least 2 apps to App Store / Google Play.",
                    "Comfortable with CI/CD, testing, and app store submission processes.",
                    "Solid understanding of security best practices.",
                ],
                skills: ["React Native", "TypeScript", "REST APIs", "CI/CD", "Firebase"],
                milestones: [
                    {
                        label: "MVP Release",
                        eta: "Month 1–2",
                        description:
                            "Authentication, product catalog, cart, and basic checkout flow shipped to test flight.",
                    },
                    {
                        label: "Public Launch",
                        eta: "Month 3",
                        description:
                            "Stabilization, performance work, analytics, and app store submission.",
                    },
                    {
                        label: "Ongoing Iteration",
                        eta: "Month 4+",
                        description:
                            "New features, A/B tests, and maintenance based on usage data.",
                    },
                ],
                collaboration: {
                    timezone: "Prefer 3–4 hours overlap with GMT+7",
                    communication: "Weekly roadmap call, daily async standups in Slack",
                    reporting: "Sprint-based planning with Jira board",
                },
            };
        case "3":
        default:
            return {
                ...job,
                ...base,
                description:
                    job.description ||
                    "End-to-end SEO engagement to improve organic visibility and search performance.",
                responsibilities: [
                    "Conduct full SEO audit: technical, on-page, and content.",
                    "Define prioritized roadmap of SEO recommendations.",
                    "Implement on-page optimizations for key landing pages.",
                    "Collaborate with content team on keyword strategy.",
                ],
                requirements: [
                    "Hands-on experience with SEO tools (Ahrefs, SEMrush, GSC).",
                    "Ability to communicate clearly with non-technical stakeholders.",
                    "Solid understanding of technical SEO and site performance.",
                ],
                skills: ["SEO", "Google Search Console", "Analytics", "Content Strategy"],
                milestones: [
                    {
                        label: "Audit & Strategy",
                        eta: "Week 1–2",
                        description:
                            "Deliver full SEO audit and prioritized roadmap with expected impact.",
                    },
                    {
                        label: "Implementation",
                        eta: "Week 3–4",
                        description:
                            "Apply technical and on-page changes in collaboration with our team.",
                    },
                    {
                        label: "Monitoring",
                        eta: "Week 5+",
                        description:
                            "Track rankings, traffic, and iterate on the roadmap as needed.",
                    },
                ],
            };
    }
};

const JobDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();

    const jobFromState = location.state?.job;
    const job =
        jobFromState || fallbackJobs.find((item) => String(item.id) === String(id));

    if (!job) {
        return (
            <div className="min-h-screen bg-gray-50 flex">
                <TaskOwnerSidebar />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <p className="text-gray-600 mb-4 text-sm">
                        Job not found or no data available.
                    </p>
                    <button
                        onClick={() => navigate("/task-owner/jobs")}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                        Back to My Jobs
                    </button>
                </div>
            </div>
        );
    }

    const detailedJob = buildDetailedJob(job);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <TaskOwnerSidebar />

            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <button
                                onClick={() => navigate("/task-owner/jobs")}
                                className="inline-flex items-center text-xs font-semibold text-gray-600 hover:text-gray-900 mb-1"
                            >
                                <span className="mr-1">←</span> Back to My Jobs
                            </button>
                            <h1 className="text-2xl font-bold text-gray-900">{detailedJob.title}</h1>
                            <p className="text-sm text-gray-600 mt-1">
                                {detailedJob.category} • {detailedJob.location} •{" "}
                                {new Date(detailedJob.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${detailedJob.status === "Open"
                                    ? "bg-green-100 text-green-700"
                                    : detailedJob.status === "In Progress"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-gray-100 text-gray-700"
                                    }`}
                            >
                                {detailedJob.status}
                            </span>
                            <div className="text-xs text-gray-500">
                                Total budget:{" "}
                                <span className="font-semibold text-gray-900">
                                    ${detailedJob.budget.toLocaleString()}
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
                            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                                    Project overview
                                </h2>
                                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                                    {detailedJob.description}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-600">
                                    <div>
                                        <p className="uppercase tracking-wide font-semibold text-gray-500 mb-1">
                                            Job type
                                        </p>
                                        <p className="text-gray-900 text-sm font-medium">
                                            {detailedJob.type}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="uppercase tracking-wide font-semibold text-gray-500 mb-1">
                                            Posted date
                                        </p>
                                        <p className="text-gray-900 text-sm font-medium">
                                            {new Date(detailedJob.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="uppercase tracking-wide font-semibold text-gray-500 mb-1">
                                            Location
                                        </p>
                                        <p className="text-gray-900 text-sm font-medium">
                                            {detailedJob.location}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Responsibilities */}
                            {detailedJob.responsibilities?.length > 0 && (
                                <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                                        Key responsibilities
                                    </h2>
                                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                                        {detailedJob.responsibilities.map((item) => (
                                            <li key={item}>{item}</li>
                                        ))}
                                    </ul>
                                </section>
                            )}

                            {/* Requirements & skills */}
                            {(detailedJob.requirements?.length || detailedJob.skills?.length) && (
                                <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                        Ideal candidate profile
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                        {detailedJob.requirements?.length > 0 && (
                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                                                    Requirements
                                                </h3>
                                                <ul className="list-disc list-inside space-y-2 text-gray-700">
                                                    {detailedJob.requirements.map((item) => (
                                                        <li key={item}>{item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {detailedJob.skills?.length > 0 && (
                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                                                    Preferred skills
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {detailedJob.skills.map((skill) => (
                                                        <span
                                                            key={skill}
                                                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            )}

                            {/* Timeline / milestones */}
                            {detailedJob.milestones?.length > 0 && (
                                <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                        Tentative timeline & milestones
                                    </h2>
                                    <ol className="space-y-3 text-sm text-gray-700">
                                        {detailedJob.milestones.map((milestone) => (
                                            <li
                                                key={milestone.label}
                                                className="border border-gray-100 rounded-lg px-4 py-3 bg-gray-50"
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="font-semibold text-gray-900">
                                                        {milestone.label}
                                                    </p>
                                                    <span className="text-xs text-gray-500">
                                                        {milestone.eta}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-700">
                                                    {milestone.description}
                                                </p>
                                            </li>
                                        ))}
                                    </ol>
                                </section>
                            )}

                            {/* Activity */}
                            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    Activity & proposals
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Proposals</p>
                                        <p className="font-semibold text-gray-900">
                                            {detailedJob.proposals}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Job type</p>
                                        <p className="font-semibold text-gray-900">
                                            {detailedJob.type}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Posted date</p>
                                        <p className="font-semibold text-gray-900">
                                            {new Date(detailedJob.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Right: summary card */}
                        <div className="space-y-6">
                            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                <h2 className="text-sm font-semibold text-gray-900 mb-3">
                                    Budget summary
                                </h2>
                                <div className="flex items-baseline gap-2 mb-4">
                                    <span className="text-2xl font-bold text-gray-900">
                                        ${job.budget.toLocaleString()}
                                    </span>
                                    <span className="text-xs text-gray-500">total points</span>
                                </div>
                                <p className="text-xs text-gray-500">
                                    This is a demo view using mock data only (no API yet).
                                </p>
                            </section>

                            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                <h2 className="text-sm font-semibold text-gray-900 mb-3">
                                    Quick actions
                                </h2>
                                <div className="space-y-3">
                                    <button className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors">
                                        Edit job (coming soon)
                                    </button>
                                    <button className="w-full px-4 py-2 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                                        View proposals (mock)
                                    </button>
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

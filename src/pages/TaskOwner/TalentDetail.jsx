import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TaskOwnerSidebar from "../../components/TaskOwnerSidebar";

// Fallback mock data in case user refreshes detail page (no location.state)
const fallbackWorkers = [
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

// Enrich base worker data into a more complete profile for a realistic detail page.
const buildDetailedWorker = (worker) => {
    const base = {
        titleLine: "",
        about: "",
        highlights: [],
        experience: [],
        portfolio: [],
        education: [],
        certifications: [],
        languages: [],
        availability: {
            hoursPerWeek: "30–40 hrs/week",
            timezoneOverlap: "3–4 hours overlap with GMT+7",
            responseTime: "Under 4 hours",
        },
        workStats: {
            onTimeDelivery: 98,
            repeatClients: 32,
            lastActive: "Today",
        },
        reviews: [],
    };

    switch (String(worker.id)) {
        case "w1":
            return {
                ...worker,
                ...base,
                titleLine: "Full‑stack engineer focused on SaaS, dashboards, and scalable systems.",
                about:
                    "I help teams ship reliable products end‑to‑end: frontend UX, backend APIs, cloud infrastructure, and CI/CD. I’m comfortable owning features from design handoff to production monitoring.",
                highlights: [
                    "Built multi‑tenant SaaS platforms with role-based access control (RBAC).",
                    "Optimized React apps (code splitting, caching, SSR) for faster load times.",
                    "Designed Node.js services with TypeScript, Postgres, Redis, and queues.",
                ],
                experience: [
                    {
                        company: "Nimbus Analytics",
                        title: "Senior Full‑Stack Engineer",
                        period: "2023 – 2026",
                        bullets: [
                            "Led development of an admin dashboard used by 50k+ monthly users.",
                            "Implemented TypeScript monorepo, shared UI kit, and API client.",
                            "Reduced p95 API latency by 35% via caching and query optimization.",
                        ],
                    },
                    {
                        company: "StudioFlow",
                        title: "Full‑Stack Engineer",
                        period: "2020 – 2023",
                        bullets: [
                            "Built subscription billing flows and invoicing automation.",
                            "Introduced CI pipelines and automated testing to improve release quality.",
                        ],
                    },
                ],
                portfolio: [
                    {
                        title: "SaaS Admin Dashboard",
                        description:
                            "Modular dashboard with RBAC, audit logs, and analytics reports.",
                        tags: ["React", "TypeScript", "Node.js", "Postgres"],
                    },
                    {
                        title: "Realtime Collaboration Board",
                        description:
                            "Trello-like board with presence, comments, and websocket updates.",
                        tags: ["React", "WebSocket", "Redis", "AWS"],
                    },
                ],
                education: [
                    {
                        school: "Hanyang University",
                        degree: "B.S. in Computer Science",
                        period: "2016 – 2020",
                    },
                ],
                certifications: [
                    { name: "AWS Certified Solutions Architect – Associate", year: "2024" },
                ],
                languages: ["English (Fluent)", "Korean (Native)"],
                workStats: {
                    onTimeDelivery: 99,
                    repeatClients: 41,
                    lastActive: "Today",
                },
                reviews: [
                    {
                        id: "r1",
                        author: "Product Lead, Fintech startup",
                        rating: 5,
                        date: "2026-01-12",
                        text: "Great communication and strong ownership. Delivered ahead of schedule with excellent code quality.",
                    },
                    {
                        id: "r2",
                        author: "CTO, B2B SaaS",
                        rating: 5,
                        date: "2025-11-02",
                        text: "Architected our core services cleanly and helped the team adopt best practices.",
                    },
                ],
            };
        case "w2":
            return {
                ...worker,
                ...base,
                titleLine: "Product designer with a strong focus on UX strategy and measurable outcomes.",
                about:
                    "I design user‑centered experiences for web and mobile. My process balances research, usability, and visual polish—while keeping business goals like conversion and activation in mind.",
                highlights: [
                    "Designed conversion‑optimized landing pages and onboarding flows.",
                    "Built design systems and component libraries for consistent UI at scale.",
                    "Ran usability tests and translated insights into actionable iterations.",
                ],
                experience: [
                    {
                        company: "BrightPay",
                        title: "Senior Product Designer",
                        period: "2022 – 2026",
                        bullets: [
                            "Led redesign of onboarding, improving activation by 18%.",
                            "Created a design system (tokens, components, guidelines) adopted by 3 squads.",
                            "Partnered with PM/Engineering to ship weekly experiments and A/B tests.",
                        ],
                    },
                    {
                        company: "Craft Studio",
                        title: "UX/UI Designer",
                        period: "2019 – 2022",
                        bullets: [
                            "Delivered UX for 20+ client projects across e-commerce and SaaS.",
                            "Produced high‑fidelity prototypes and developer handoffs in Figma.",
                        ],
                    },
                ],
                portfolio: [
                    {
                        title: "Mobile Onboarding Revamp",
                        description:
                            "Simplified onboarding steps, improved clarity, and reduced drop‑off.",
                        tags: ["UX", "Research", "Prototyping", "Figma"],
                    },
                    {
                        title: "Design System v2",
                        description:
                            "A scalable system of tokens and components with usage guidelines.",
                        tags: ["Design System", "Accessibility", "Documentation"],
                    },
                ],
                education: [
                    {
                        school: "RMIT University Vietnam",
                        degree: "B.A. in Digital Design",
                        period: "2015 – 2019",
                    },
                ],
                certifications: [
                    { name: "Google UX Design Professional Certificate", year: "2021" },
                ],
                languages: ["English (Professional)", "Vietnamese (Native)"],
                availability: {
                    hoursPerWeek: "20–30 hrs/week",
                    timezoneOverlap: "GMT+7, flexible overlap",
                    responseTime: "Under 6 hours",
                },
                workStats: {
                    onTimeDelivery: 97,
                    repeatClients: 28,
                    lastActive: "This week",
                },
                reviews: [
                    {
                        id: "r1",
                        author: "Founder, Consumer app",
                        rating: 5,
                        date: "2025-12-20",
                        text: "Thoughtful UX decisions and beautiful UI. The design system made development much faster.",
                    },
                    {
                        id: "r2",
                        author: "PM, E-commerce brand",
                        rating: 4,
                        date: "2025-09-14",
                        text: "Strong research and iteration. Would love more exploration options early on, but final result was great.",
                    },
                ],
            };
        case "w3":
        default:
            return {
                ...worker,
                ...base,
                titleLine: "DevOps engineer specializing in Kubernetes, CI/CD, and cloud cost optimization.",
                about:
                    "I help teams ship safely and reliably: infrastructure as code, container orchestration, observability, and automated deployments. I focus on practical improvements that reduce incidents and cloud spend.",
                highlights: [
                    "Designed Kubernetes platforms for multi‑service environments.",
                    "Implemented CI/CD pipelines with automated testing and deployments.",
                    "Improved observability with metrics, logs, tracing, and alerting.",
                ],
                experience: [
                    {
                        company: "CloudWorks",
                        title: "DevOps & Cloud Engineer",
                        period: "2021 – 2026",
                        bullets: [
                            "Migrated services to Kubernetes and standardized Helm charts.",
                            "Set up monitoring/alerting and reduced incident MTTR by 40%.",
                            "Cut AWS spend by ~22% through right‑sizing and cache strategies.",
                        ],
                    },
                    {
                        company: "OpsLab",
                        title: "Site Reliability Engineer",
                        period: "2018 – 2021",
                        bullets: [
                            "Built runbooks, on‑call automation, and deployment guardrails.",
                            "Introduced infrastructure as code for repeatable environments.",
                        ],
                    },
                ],
                portfolio: [
                    {
                        title: "Kubernetes Platform Setup",
                        description:
                            "Cluster bootstrap, ingress, secrets management, and GitOps workflows.",
                        tags: ["Kubernetes", "Helm", "GitOps", "AWS"],
                    },
                    {
                        title: "CI/CD for Microservices",
                        description:
                            "Pipelines with test gates, image scanning, and progressive delivery.",
                        tags: ["CI/CD", "Docker", "Security", "Observability"],
                    },
                ],
                education: [
                    {
                        school: "Ho Chi Minh City University of Technology",
                        degree: "B.Eng. in Information Systems",
                        period: "2014 – 2018",
                    },
                ],
                certifications: [
                    { name: "CKA: Certified Kubernetes Administrator", year: "2023" },
                ],
                languages: ["English (Professional)", "Vietnamese (Native)"],
                availability: {
                    hoursPerWeek: "30–40 hrs/week",
                    timezoneOverlap: "APAC friendly, flexible overlap",
                    responseTime: "Under 3 hours",
                },
                workStats: {
                    onTimeDelivery: 98,
                    repeatClients: 35,
                    lastActive: "Today",
                },
                reviews: [
                    {
                        id: "r1",
                        author: "Engineering Manager, SaaS",
                        rating: 5,
                        date: "2026-01-05",
                        text: "Solid infra work and clear documentation. Our deployments are much more reliable now.",
                    },
                ],
            };
    }
};

const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const dt = new Date(dateStr);
    if (Number.isNaN(dt.getTime())) return String(dateStr);
    return dt.toLocaleDateString();
};

const StarRating = ({ value }) => {
    const rounded = Math.round(Number(value) || 0);
    return (
        <div className="flex items-center gap-1" aria-label={`Rating ${rounded} out of 5`}>
            {Array.from({ length: 5 }).map((_, idx) => (
                <span
                    key={idx}
                    className={idx < rounded ? "text-yellow-400" : "text-gray-300"}
                >
                    ★
                </span>
            ))}
        </div>
    );
};

const TalentDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();

    const workerFromState = location.state?.worker;
    const worker =
        workerFromState || fallbackWorkers.find((item) => String(item.id) === String(id));

    if (!worker) {
        return (
            <div className="min-h-screen bg-gray-50 flex">
                <TaskOwnerSidebar />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <p className="text-gray-600 mb-4 text-sm">
                        Talent not found or no data available.
                    </p>
                    <button
                        onClick={() => navigate("/task-owner/talent")}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                        Back to Talents
                    </button>
                </div>
            </div>
        );
    }

    const detailed = buildDetailedWorker(worker);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <TaskOwnerSidebar />

            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <button
                                onClick={() => navigate("/task-owner/talent")}
                                className="inline-flex items-center text-xs font-semibold text-gray-600 hover:text-gray-900 mb-1"
                            >
                                <span className="mr-1">←</span> Back to Talents
                            </button>
                            <h1 className="text-2xl font-bold text-gray-900">{worker.name}</h1>
                            <p className="text-sm text-gray-600 mt-1">
                                {worker.role} • {worker.location}
                            </p>
                            {detailed.titleLine ? (
                                <p className="text-xs text-gray-500 mt-1 max-w-2xl">
                                    {detailed.titleLine}
                                </p>
                            ) : null}
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors">
                                Invite to project (mock)
                            </button>
                            <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold transition-colors">
                                Message (mock)
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main */}
                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Overview */}
                            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                                        {worker.initials}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <div className="flex items-center gap-1">
                                                <span className="text-yellow-400">★</span>
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {Number(worker.rating).toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="h-4 w-px bg-gray-200" />
                                            <p className="text-xs text-gray-600">
                                                {worker.successRate}% job success
                                            </p>
                                            <div className="h-4 w-px bg-gray-200" />
                                            <p className="text-xs text-gray-600">
                                                {worker.jobs} completed jobs
                                            </p>
                                        </div>

                                        <p className="text-sm text-gray-700 mt-3 leading-relaxed">
                                            {worker.overview}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* About */}
                            {(detailed.about || detailed.highlights?.length > 0) && (
                                <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                                        About
                                    </h2>
                                    {detailed.about ? (
                                        <p className="text-sm text-gray-700 leading-relaxed mb-4">
                                            {detailed.about}
                                        </p>
                                    ) : null}
                                    {detailed.highlights?.length > 0 ? (
                                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                                            {detailed.highlights.map((item) => (
                                                <li key={item}>{item}</li>
                                            ))}
                                        </ul>
                                    ) : null}
                                </section>
                            )}

                            {/* Experience */}
                            {detailed.experience?.length > 0 && (
                                <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                        Experience
                                    </h2>
                                    <div className="space-y-4">
                                        {detailed.experience.map((exp) => (
                                            <div
                                                key={`${exp.company}-${exp.title}-${exp.period}`}
                                                className="border border-gray-100 rounded-lg px-4 py-3 bg-gray-50"
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">
                                                            {exp.title}
                                                        </p>
                                                        <p className="text-xs text-gray-600">
                                                            {exp.company}
                                                        </p>
                                                    </div>
                                                    <span className="text-xs text-gray-500">
                                                        {exp.period}
                                                    </span>
                                                </div>
                                                {exp.bullets?.length > 0 ? (
                                                    <ul className="list-disc list-inside space-y-1 mt-3 text-sm text-gray-700">
                                                        {exp.bullets.map((b) => (
                                                            <li key={b}>{b}</li>
                                                        ))}
                                                    </ul>
                                                ) : null}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Work style */}
                            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    Work preferences
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-600">
                                    <div>
                                        <p className="uppercase tracking-wide font-semibold text-gray-500 mb-1">
                                            Availability
                                        </p>
                                        <p className="text-gray-900 text-sm font-medium">
                                            {detailed.availability?.hoursPerWeek || "—"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="uppercase tracking-wide font-semibold text-gray-500 mb-1">
                                            Timezone
                                        </p>
                                        <p className="text-gray-900 text-sm font-medium">
                                            {detailed.availability?.timezoneOverlap || worker.location}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="uppercase tracking-wide font-semibold text-gray-500 mb-1">
                                            Communication
                                        </p>
                                        <p className="text-gray-900 text-sm font-medium">
                                            {detailed.languages?.[0] || "English"}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-600">
                                    <div>
                                        <p className="uppercase tracking-wide font-semibold text-gray-500 mb-1">
                                            Response time
                                        </p>
                                        <p className="text-gray-900 text-sm font-medium">
                                            {detailed.availability?.responseTime || "—"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="uppercase tracking-wide font-semibold text-gray-500 mb-1">
                                            On-time delivery
                                        </p>
                                        <p className="text-gray-900 text-sm font-medium">
                                            {detailed.workStats?.onTimeDelivery ?? "—"}%
                                        </p>
                                    </div>
                                    <div>
                                        <p className="uppercase tracking-wide font-semibold text-gray-500 mb-1">
                                            Last active
                                        </p>
                                        <p className="text-gray-900 text-sm font-medium">
                                            {detailed.workStats?.lastActive || "—"}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Reviews */}
                            {detailed.reviews?.length > 0 && (
                                <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">
                                                Reviews
                                            </h2>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Mock reviews for demo purposes.
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <StarRating value={worker.rating} />
                                            <span className="text-sm font-semibold text-gray-900">
                                                {Number(worker.rating).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {detailed.reviews.map((r) => (
                                            <div
                                                key={r.id}
                                                className="border border-gray-100 rounded-lg px-4 py-3 bg-gray-50"
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">
                                                            {r.author}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {formatDate(r.date)}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <StarRating value={r.rating} />
                                                        <span className="text-xs font-semibold text-gray-700">
                                                            {r.rating}/5
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-700 mt-3 leading-relaxed">
                                                    {r.text}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Right */}
                        <div className="space-y-6">
                            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                <h2 className="text-sm font-semibold text-gray-900 mb-3">
                                    Rate
                                </h2>
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-3xl font-bold text-gray-900">
                                        ${worker.hourlyRate}
                                    </span>
                                    <span className="text-xs text-gray-500">/ hour</span>
                                </div>
                                <p className="text-xs text-gray-500">
                                    Estimated weekly cost: ${worker.hourlyRate * 40} (40h/week).
                                </p>
                            </section>

                            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                <h2 className="text-sm font-semibold text-gray-900 mb-3">
                                    Quick facts
                                </h2>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Rating</span>
                                        <span className="font-semibold text-gray-900">
                                            {Number(worker.rating).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Job success</span>
                                        <span className="font-semibold text-gray-900">
                                            {worker.successRate}%
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Jobs</span>
                                        <span className="font-semibold text-gray-900">
                                            {worker.jobs}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Repeat clients</span>
                                        <span className="font-semibold text-gray-900">
                                            {detailed.workStats?.repeatClients ?? "—"}%
                                        </span>
                                    </div>
                                </div>
                            </section>

                            {/* Top skills */}
                            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                <h2 className="text-sm font-semibold text-gray-900 mb-3">
                                    Top skills
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {worker.topSkills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default TalentDetail;

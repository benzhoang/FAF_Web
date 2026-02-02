import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskOwnerSidebar from "../../components/TaskOwnerSidebar";
import { userApi } from "../../api/user.api";
import { jobsApi } from "../../api/jobs.api";

const TaskOwnerPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    userApi
      .getMe()
      .then((response) => {
        setUser(response);
        console.log(response);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });

    jobsApi
      .getAllJobs()
      .then((response) => {
        setJobs(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching jobs data:", error);
      });
  }, []);

  console.log(jobs);

  const displayName = user?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <TaskOwnerSidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="hidden lg:flex flex-1 min-w-[320px] max-w-xl">
              <div className="relative w-full group">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-600 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-11 pr-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-600/20 focus:bg-white"
                  placeholder="Search jobs, contracts, or talent..."
                  type="text"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <button className="relative text-gray-600 hover:text-gray-900 transition-colors">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <button className="text-gray-600 hover:text-gray-900 transition-colors">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-lg transition-all shadow-sm"
                onClick={() => navigate("/task-owner/post-job")}
              >
                + Post a New Job
              </button>
              <div className="text-xs text-gray-500">
                Last updated: Just now
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Greeting Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Good Morning, {displayName}! 👋
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your projects today.
            </p>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200 relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-sm text-gray-600 mb-1">Active Job Posts</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">4</p>
                <p className="text-xs text-green-600 font-semibold">
                  +1 this week
                </p>
              </div>
              <div className="absolute top-4 right-4 opacity-10">
                <svg
                  className="w-16 h-16 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-sm text-gray-600 mb-1">
                  Total Spent in Escrow
                </p>
                <p className="text-3xl font-bold text-gray-900 mb-1">$12,450</p>
                <p className="text-xs text-gray-600">
                  Across 3 active contracts
                </p>
              </div>
              <div className="absolute top-4 right-4 opacity-10">
                <svg
                  className="w-16 h-16 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-sm text-gray-600 mb-1">Unread Messages</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">8</p>
                <a
                  href="#"
                  className="text-xs text-blue-600 font-semibold hover:underline"
                >
                  Go to inbox →
                </a>
              </div>
              <div className="absolute top-4 right-4 opacity-10">
                <svg
                  className="w-16 h-16 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Active Job Posts */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Active Job Posts
              </h2>
              <a
                href="#"
                className="text-sm text-blue-600 font-semibold hover:underline"
              >
                View All
              </a>
            </div>
            <div className="space-y-4">
              {/* <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Senior React Developer
                    </h3>
                    <p className="text-sm text-gray-600">
                      Posted 2 days ago • 12 Proposals
                    </p>
                  </div>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                  Manage
                </button>
              </div> */}
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                        />
                      </svg>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(job.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                    Manage
                  </button>
                </div>
              ))}

              {/* <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        Product Designer (UX/UI)
                      </h3>
                      <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded">
                        Urgent
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Posted 5 days ago • 28 Proposals
                    </p>
                  </div>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                  Manage
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-orange-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Marketing Copywriter
                    </h3>
                    <p className="text-sm text-gray-600">
                      Posted 1 week ago • 8 Proposals
                    </p>
                  </div>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                  Manage
                </button>
              </div> */}
            </div>
          </div>

          {/* Contracts in Escrow */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Contracts in Escrow
              </h2>
              <a
                href="#"
                className="text-sm text-blue-600 font-semibold hover:underline"
              >
                View Contracts
              </a>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      Full Stack Dev
                    </h3>
                    <p className="text-sm text-gray-600">
                      Contract with David K.
                    </p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      Funded:{" "}
                      <span className="font-semibold text-gray-900">
                        $5,000
                      </span>
                    </span>
                    <span className="text-gray-600">
                      Released:{" "}
                      <span className="font-semibold text-gray-900">
                        $2,500
                      </span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: "50%" }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Next Milestone</p>
                    <p className="text-sm font-semibold text-gray-900">
                      API Integration
                    </p>
                  </div>
                  <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full">
                    Pending
                  </span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      Mobile App Design
                    </h3>
                    <p className="text-sm text-gray-600">
                      Contract with Sarah J.
                    </p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      Funded:{" "}
                      <span className="font-semibold text-gray-900">
                        $3,200
                      </span>
                    </span>
                    <span className="text-gray-600">
                      Released:{" "}
                      <span className="font-semibold text-gray-900">$800</span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: "25%" }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Next Milestone</p>
                    <p className="text-sm font-semibold text-gray-900">
                      Wireframes
                    </p>
                  </div>
                  <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                    In Progress
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Talent */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Recommended Talent
              </h2>
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    MT
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        Michael T.
                      </h3>
                      <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-0.5 rounded">
                        Verified
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Senior DevOps Engineer
                    </p>
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm font-semibold text-gray-900">
                        5.0
                      </span>
                      <span className="text-xs text-gray-500">(42 jobs)</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                        AWS
                      </span>
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                        Kubernetes
                      </span>
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                        CI/CD
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900">
                        $85/hr
                      </span>
                      <span className="text-xs text-gray-600">98% Success</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <div
                        className="bg-green-500 h-1.5 rounded-full"
                        style={{ width: "98%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    ER
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">Emily R.</h3>
                      <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-0.5 rounded">
                        Verified
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Illustrator & Graphic Artist
                    </p>
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm font-semibold text-gray-900">
                        4.9
                      </span>
                      <span className="text-xs text-gray-500">(18 jobs)</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                        Adobe AI
                      </span>
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                        Branding
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900">
                        $55/hr
                      </span>
                      <span className="text-xs text-gray-600">
                        100% Success
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <div
                        className="bg-green-500 h-1.5 rounded-full"
                        style={{ width: "100%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold px-6 py-2.5 rounded-lg transition-colors">
                View More Talent
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TaskOwnerPage;

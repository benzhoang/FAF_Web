import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskOwnerSidebar from "../../components/TaskOwnerSidebar";
import { useAuth } from "../../auth/AuthContext";
import { jobsApi } from "../../api/jobs.api";
import { contractsApi } from "../../api/contracts.api";

const TaskOwnerPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [contracts, setContracts] = useState([]);
  
  useEffect(() => {
    jobsApi
      .getAllJobs()
      .then((response) => {
        setJobs(response.data);
      })
      .catch((error) => {
        console.error("Error fetching jobs data:", error);
      });

    // Fetch employer's contracts
    contractsApi
      .getMyContracts()
      .then((response) => {
        setContracts(response.data || []);
      })
      .catch((error) => {
        console.error("Error fetching contracts:", error);
      });
  }, []);

  const displayName = user?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <TaskOwnerSidebar />

      <div className="flex-1 flex flex-col">
        {/* Actions Row */}
        <div className="px-6 py-4 flex items-center justify-end gap-4 border-b border-gray-200 bg-white">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-lg transition-all shadow-sm"
              onClick={() => navigate("/task-owner/post-job")}
            >
              + Post a New Job
            </button>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {displayName}! 👋
            </h1>
            <p className="text-gray-600">
              Manage your jobs, review proposals, and track project progress.
            </p>
          </div>

          {/* Pending Checkpoint Reviews Section */}
          {contracts.some(c => c.status === 'ACTIVE' && c.checkpoints?.some(cp => cp.status === 'SUBMITTED')) && (
            <div className="mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Checkpoints to Review ({contracts.filter(c => c.status === 'ACTIVE' && c.checkpoints?.some(cp => cp.status === 'SUBMITTED')).length})
                      </h2>
                      <p className="text-sm text-gray-600">Worker submissions waiting for approval</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {contracts
                    .filter(c => c.status === 'ACTIVE' && c.checkpoints?.some(cp => cp.status === 'SUBMITTED'))
                    .map((contract) => {
                      const pendingCount = contract.checkpoints.filter(cp => cp.status === 'SUBMITTED').length;
                      return (
                        <div key={contract.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900 mb-1">{contract.job_title}</h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                  Worker: {contract.worker_name || 'Unknown'}
                                </span>
                                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {pendingCount} Submission{pendingCount > 1 ? 's' : ''} Pending
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => navigate(`/task-owner/contracts/${contract.id}/review`)}
                              className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              Review Now
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* Pending Contracts Section */}
          {contracts.filter(c => c.signature_worker && !c.signature_client).length > 0 && (
            <div className="mb-8">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-yellow-100 rounded-xl">
                      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Pending Contracts ({contracts.filter(c => c.signature_worker && !c.signature_client).length})
                      </h2>
                      <p className="text-sm text-gray-600">Contracts waiting for your signature</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {contracts
                    .filter(c => c.signature_worker && !c.signature_client)
                    .map((contract) => (
                      <div key={contract.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 mb-1">{contract.job_title}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Worker: {contract.worker_name || 'Unknown'}
                              </span>
                              <span className="text-green-600 font-semibold flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                ${Number(contract.total_amount || 0).toLocaleString()}
                              </span>
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Worker Signed
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => navigate(`/task-owner/contract/${contract.id}/sign`)}
                            className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Review & Sign
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.03)] relative overflow-hidden group hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all">
              <div className="relative z-10">
                <p className="text-sm font-medium text-gray-500 mb-1">Active Job Posts</p>
                <div className="flex items-baseline gap-3 mb-1">
                  <p className="text-4xl font-bold text-gray-900 tracking-tight">4</p>
                  <p className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full">
                    +1 this week
                  </p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
              <div className="absolute top-6 right-6 text-blue-600">
                <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-600 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.03)] relative overflow-hidden group hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all">
              <div className="relative z-10">
                <p className="text-sm font-medium text-gray-500 mb-1">Total Spent in Escrow</p>
                <div className="flex items-baseline gap-3 mb-1">
                  <p className="text-4xl font-bold text-gray-900 tracking-tight">$12,450</p>
                </div>
                <p className="text-xs text-gray-500 font-medium">Across 3 active contracts</p>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-green-50 to-emerald-100 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
              <div className="absolute top-6 right-6 text-emerald-600">
                <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-600 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.03)] relative overflow-hidden group hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all flex flex-col justify-between">
              <div className="relative z-10">
                <p className="text-sm font-medium text-gray-500 mb-1">Unread Messages</p>
                <div className="flex items-baseline gap-3 mb-1">
                  <p className="text-4xl font-bold text-gray-900 tracking-tight">8</p>
                </div>
              </div>
              <div className="relative z-10 mt-2">
                <a href="#" className="font-semibold text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 group-hover:underline">
                  Go to inbox <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-50 to-fuchsia-100 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
              <div className="absolute top-6 right-6 text-fuchsia-600">
                <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-fuchsia-400 to-purple-600 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></div>
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

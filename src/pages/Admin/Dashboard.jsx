import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';

const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <AdminSidebar />

            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="hidden lg:flex flex-1 min-w-[320px] max-w-xl">
                            <div className="relative w-full group">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-11 pr-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-600/20 focus:bg-white"
                                    placeholder="Search users, jobs, or system logs..."
                                    type="text"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <button className="relative text-gray-600 hover:text-gray-900 transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                                </button>
                                <button className="text-gray-600 hover:text-gray-900 transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="text-xs text-gray-500">Last updated: Just now</div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-6 overflow-y-auto">
                    {/* Greeting Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, Admin! 👋</h1>
                        <p className="text-gray-600">Here's an overview of your system today.</p>
                    </div>

                    {/* Summary Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-xl p-6 border border-gray-200 relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-sm text-gray-600 mb-1">Total Users</p>
                                <p className="text-3xl font-bold text-gray-900 mb-1">1,234</p>
                                <p className="text-xs text-green-600 font-semibold">+12 this week</p>
                            </div>
                            <div className="absolute top-4 right-4 opacity-10">
                                <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                        </div>

                        <div className="bg-white rounded-xl p-6 border border-gray-200 relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-sm text-gray-600 mb-1">Active Jobs</p>
                                <p className="text-3xl font-bold text-gray-900 mb-1">456</p>
                                <p className="text-xs text-green-600 font-semibold">+23 this week</p>
                            </div>
                            <div className="absolute top-4 right-4 opacity-10">
                                <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
                        </div>

                        <div className="bg-white rounded-xl p-6 border border-gray-200 relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-sm text-gray-600 mb-1">Pending Approvals</p>
                                <p className="text-3xl font-bold text-gray-900 mb-1">28</p>
                                <p className="text-xs text-orange-600 font-semibold">Requires attention</p>
                            </div>
                            <div className="absolute top-4 right-4 opacity-10">
                                <svg className="w-16 h-16 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-orange-600"></div>
                        </div>

                        <div className="bg-white rounded-xl p-6 border border-gray-200 relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-sm text-gray-600 mb-1">System Health</p>
                                <p className="text-3xl font-bold text-gray-900 mb-1">99.9%</p>
                                <p className="text-xs text-green-600 font-semibold">All systems operational</p>
                            </div>
                            <div className="absolute top-4 right-4 opacity-10">
                                <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Recent Users */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Recent Users</h2>
                                <button
                                    onClick={() => navigate('/admin/user-management')}
                                    className="text-sm text-blue-600 font-semibold hover:underline"
                                >
                                    View All
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-blue-600 font-bold text-sm">JD</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">John Doe</h3>
                                            <p className="text-sm text-gray-600">Worker • Joined 2 days ago</p>
                                        </div>
                                    </div>
                                    <span className="bg-green-100 text-green-600 text-xs font-semibold px-3 py-1 rounded-full">Active</span>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                            <span className="text-purple-600 font-bold text-sm">JS</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Jane Smith</h3>
                                            <p className="text-sm text-gray-600">Task Owner • Joined 5 days ago</p>
                                        </div>
                                    </div>
                                    <span className="bg-green-100 text-green-600 text-xs font-semibold px-3 py-1 rounded-full">Active</span>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                            <span className="text-orange-600 font-bold text-sm">MJ</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Mike Johnson</h3>
                                            <p className="text-sm text-gray-600">Worker • Joined 1 week ago</p>
                                        </div>
                                    </div>
                                    <span className="bg-green-100 text-green-600 text-xs font-semibold px-3 py-1 rounded-full">Active</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Jobs */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Recent Jobs</h2>
                                <button
                                    onClick={() => navigate('/admin/job-oversight')}
                                    className="text-sm text-blue-600 font-semibold hover:underline"
                                >
                                    View All
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Senior React Developer</h3>
                                            <p className="text-sm text-gray-600">Posted 1 day ago • 15 Proposals</p>
                                        </div>
                                    </div>
                                    <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">Active</span>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Product Designer</h3>
                                            <p className="text-sm text-gray-600">Posted 3 days ago • 28 Proposals</p>
                                        </div>
                                    </div>
                                    <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">Active</span>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Marketing Copywriter</h3>
                                            <p className="text-sm text-gray-600">Posted 1 week ago • 8 Proposals</p>
                                        </div>
                                    </div>
                                    <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">Pending</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* System Logs Preview */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Recent System Logs</h2>
                            <button
                                onClick={() => navigate('/admin/system-log')}
                                className="text-sm text-blue-600 font-semibold hover:underline"
                            >
                                View All Logs
                            </button>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-900">User registration successful</p>
                                    <p className="text-xs text-gray-600">New user "John Doe" registered as Worker</p>
                                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-900">Job posted</p>
                                    <p className="text-xs text-gray-600">New job "Senior React Developer" posted by Jane Smith</p>
                                    <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-900">System backup completed</p>
                                    <p className="text-xs text-gray-600">Daily backup completed successfully</p>
                                    <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;

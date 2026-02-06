import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';

const Moderation = () => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [activeTab, setActiveTab] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterReason, setFilterReason] = useState('All Reasons');
    const [sortBy, setSortBy] = useState('Newest First');
    const [loading, setLoading] = useState(true);

    // Mock data based on the image
    const mockTasks = [
        {
            id: 1,
            status: 'FLAGGED',
            time: '2m ago',
            jobTitle: 'Junior Marketing Assistant',
            company: 'Acme Corp.',
            location: 'Remote',
            reasonType: 'REPORTED REASON',
            reasonText: 'Requests payment for training materials.',
            reasonIcon: '💰'
        },
        {
            id: 2,
            status: 'PENDING',
            time: '15m ago',
            jobTitle: 'Senior React Developer',
            company: 'TechFlow Inc.',
            location: 'San Francisco',
            reasonType: 'AUTO-FLAG REASON',
            reasonText: 'New Employer Account (< 24h old).',
            reasonIcon: '⏰'
        },
        {
            id: 3,
            status: 'FLAGGED',
            time: '42m ago',
            jobTitle: 'Data Entry Clerk',
            company: 'Unknown Entity',
            location: 'Remote',
            reasonType: 'REPORTED REASON',
            reasonText: 'Suspicious external link pattern detected.',
            reasonIcon: '🔗'
        },
        {
            id: 4,
            status: 'PENDING',
            time: '1h ago',
            jobTitle: 'UX Designer III',
            company: 'Creative Solutions',
            location: 'New York',
            reasonType: 'AUTO-FLAG REASON',
            reasonText: 'Excessive use of caps lock in description.',
            reasonIcon: '📝'
        },
        {
            id: 5,
            status: 'PENDING',
            time: '1h ago',
            jobTitle: 'Freelance Writer',
            company: 'Blogosphere Inc.',
            location: 'Remote',
            reasonType: 'AUTO-FLAG REASON',
            reasonText: 'Language mismatch with region.',
            reasonIcon: '🌐'
        }
    ];

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setTasks(mockTasks);
            setFilteredTasks(mockTasks);
            setLoading(false);
        }, 500);
    }, []);

    useEffect(() => {
        filterAndSortTasks();
    }, [activeTab, searchTerm, filterReason, sortBy, tasks]);

    const filterAndSortTasks = () => {
        let filtered = [...tasks];

        // Tab filter
        if (activeTab === 'Flagged Only') {
            filtered = filtered.filter(task => task.status === 'FLAGGED');
        } else if (activeTab === 'Pending Review') {
            filtered = filtered.filter(task => task.status === 'PENDING');
        }

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(task =>
                task.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.reasonText.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Reason filter
        if (filterReason !== 'All Reasons') {
            filtered = filtered.filter(task => task.reasonType === filterReason);
        }

        // Sort
        if (sortBy === 'Newest First') {
            // Mock: sort by time (in real app, use actual timestamps)
            filtered.sort((a, b) => {
                const timeA = parseInt(a.time);
                const timeB = parseInt(b.time);
                return timeA - timeB;
            });
        } else if (sortBy === 'Oldest First') {
            filtered.sort((a, b) => {
                const timeA = parseInt(a.time);
                const timeB = parseInt(b.time);
                return timeB - timeA;
            });
        }

        setFilteredTasks(filtered);
    };

    const handleApprove = (taskId) => {
        setTasks(tasks.filter(task => task.id !== taskId));
        alert('Task approved successfully');
    };

    const handleHide = (taskId) => {
        setTasks(tasks.filter(task => task.id !== taskId));
        alert('Task hidden successfully');
    };

    const pendingCount = tasks.filter(t => t.status === 'PENDING').length;
    const criticalCount = tasks.filter(t => t.status === 'FLAGGED').length;

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
                            <div className="text-xs text-gray-500">Last updated: Just now</div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-6 overflow-y-auto">
                    {/* Header Section */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-3xl font-bold text-gray-900">Task Moderation Queue</h1>
                            <div className="flex items-center gap-4">
                                {/* Status Badges */}
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-full">
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                        <span className="text-sm font-semibold">{pendingCount} Pending</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1.5 rounded-full">
                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                        <span className="text-sm font-semibold">{criticalCount} Critical Risks</span>
                                    </div>
                                </div>

                                {/* Search Bar */}
                                <div className="relative">
                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Search tasks, user ID..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-600/20 text-sm w-64"
                                    />
                                </div>

                                {/* Notification Icon */}
                                <button className="relative text-gray-600 hover:text-gray-900 transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Filter and Sort Section */}
                    <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
                        <div className="flex flex-wrap items-center gap-4">
                            {/* Filter by Reason */}
                            <div className="relative">
                                <select
                                    value={filterReason}
                                    onChange={(e) => setFilterReason(e.target.value)}
                                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-600/20 cursor-pointer"
                                >
                                    <option value="All Reasons">Filter by Reason</option>
                                    <option value="REPORTED REASON">Reported Reason</option>
                                    <option value="AUTO-FLAG REASON">Auto-Flag Reason</option>
                                </select>
                                <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>

                            {/* Sort */}
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-600/20 cursor-pointer"
                                >
                                    <option value="Newest First">Sort: Newest First</option>
                                    <option value="Oldest First">Sort: Oldest First</option>
                                </select>
                                <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                </svg>
                            </div>

                            {/* Tabs */}
                            <div className="flex items-center gap-2 ml-auto">
                                {['All', 'Flagged Only', 'Pending Review'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === tab
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Task Cards Grid */}
                    {loading ? (
                        <div className="text-center py-12 text-gray-500">Loading tasks...</div>
                    ) : filteredTasks.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">No tasks found</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                            {filteredTasks.map((task) => (
                                <div key={task.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                    {/* Card Header */}
                                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${task.status === 'FLAGGED'
                                            ? 'bg-red-100 text-red-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {task.status}
                                        </span>
                                        <span className="text-xs text-gray-500">{task.time}</span>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-900 mb-2">{task.jobTitle}</h3>
                                        <p className="text-sm text-gray-600 mb-4">
                                            {task.company} • {task.location}
                                        </p>

                                        {/* Reason Section */}
                                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                            <div className="flex items-start gap-2">
                                                <span className="text-lg">{task.reasonIcon}</span>
                                                <div className="flex-1">
                                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                                        {task.reasonType}
                                                    </p>
                                                    <p className="text-sm text-gray-700">{task.reasonText}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleApprove(task.id)}
                                                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleHide(task.id)}
                                                className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
                                            >
                                                Hide
                                                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Load More Button */}
                    {filteredTasks.length > 0 && (
                        <div className="text-center">
                            <button className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                                Load more tasks
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Moderation;

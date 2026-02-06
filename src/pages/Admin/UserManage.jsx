import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AddManagerModal from '../../components/AddManagerModal';
import { userApi } from '../../api/user.api';

const UserManage = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All Users');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [searchTerm, activeFilter, users]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await userApi.getAll();
            // Mock data structure - adjust based on your API response
            const mockUsers = [
                {
                    id: 1,
                    name: 'Alex Rivera',
                    email: 'alex.rivera@example.com',
                    role: 'Candidate',
                    status: 'Active',
                    riskScore: 85,
                    avatar: null
                },
                {
                    id: 2,
                    name: 'Sarah Jenkins',
                    email: 'sarah.j@example.com',
                    role: 'Recruiter',
                    status: 'Active',
                    riskScore: 12,
                    avatar: null
                },
                {
                    id: 3,
                    name: 'Michael Chen',
                    email: 'm.chen@example.com',
                    role: 'Candidate',
                    status: 'Locked',
                    riskScore: 65,
                    avatar: null
                },
                {
                    id: 4,
                    name: 'Emily Davis',
                    email: 'emily.d@example.com',
                    role: 'Admin',
                    status: 'Active',
                    riskScore: 2,
                    avatar: null
                },
                {
                    id: 5,
                    name: 'Jessica Lee',
                    email: 'jessica.lee@example.com',
                    role: 'Recruiter',
                    status: 'Active',
                    riskScore: 24,
                    avatar: null
                }
            ];
            setUsers(mockUsers);
            setFilteredUsers(mockUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterUsers = () => {
        let filtered = [...users];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.role.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status filter
        if (activeFilter === 'High Risk') {
            filtered = filtered.filter(user => user.riskScore >= 70);
        } else if (activeFilter === 'Active Only') {
            filtered = filtered.filter(user => user.status === 'Active');
        } else if (activeFilter === 'Locked') {
            filtered = filtered.filter(user => user.status === 'Locked');
        }

        setFilteredUsers(filtered);
        setCurrentPage(1);
    };

    const getRiskLevel = (score) => {
        if (score >= 70) return { label: 'Critical', color: 'red', bgColor: 'bg-red-50', textColor: 'text-red-600', barColor: 'bg-red-500' };
        if (score >= 40) return { label: 'Medium', color: 'orange', bgColor: 'bg-orange-50', textColor: 'text-orange-600', barColor: 'bg-orange-500' };
        if (score >= 20) return { label: 'Low', color: 'green', bgColor: 'bg-green-50', textColor: 'text-green-600', barColor: 'bg-green-500' };
        return { label: 'Safe', color: 'green', bgColor: 'bg-green-50', textColor: 'text-green-600', barColor: 'bg-green-500' };
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getStatusBadge = (status) => {
        if (status === 'Active') {
            return <span className="bg-green-100 text-green-600 text-xs font-semibold px-3 py-1 rounded-full">Active</span>;
        }
        return <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">Locked</span>;
    };

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentUsers = filteredUsers.slice(startIndex, endIndex);

    const totalUsers = 12450;
    const activeJobs = 842;
    const systemHealth = 98.9;

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
                        <div className="flex items-center justify-between mb-2">
                            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                            <div className="flex items-center gap-3">
                                <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors text-sm font-semibold">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Export Data
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add Manager
                                </button>
                            </div>
                        </div>
                        <p className="text-gray-600">Monitor user activity, manage roles, and mitigate system risks.</p>
                    </div>

                    {/* Key Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {/* Total Users */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200 relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-sm text-gray-600 mb-1">Total Users</p>
                                <p className="text-3xl font-bold text-gray-900 mb-1">{totalUsers.toLocaleString()}</p>
                                <p className="text-xs text-green-600 font-semibold">+5.2% Since last month</p>
                            </div>
                            <div className="absolute top-4 right-4 opacity-10">
                                <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                        </div>

                        {/* Active Jobs */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200 relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-sm text-gray-600 mb-1">Active Jobs</p>
                                <p className="text-3xl font-bold text-gray-900 mb-1">{activeJobs}</p>
                                <p className="text-xs text-green-600 font-semibold">+1.8% Active campaigns running</p>
                            </div>
                            <div className="absolute top-4 right-4 opacity-10">
                                <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
                        </div>

                        {/* System Health */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200 relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-sm text-gray-600 mb-1">System Health</p>
                                <p className="text-3xl font-bold text-gray-900 mb-1">{systemHealth}%</p>
                                <p className="text-xs text-green-600 font-semibold">Stable</p>
                            </div>
                            <div className="absolute top-4 right-4 opacity-10">
                                <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
                        </div>
                    </div>

                    {/* Search and Filter Section */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            {/* Search Bar */}
                            <div className="relative w-full md:flex-1 max-w-xl">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or role..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-600/20 text-sm"
                                />
                            </div>

                            {/* Filter Buttons */}
                            <div className="flex items-center gap-2">
                                {['All Users', 'High Risk', 'Active Only', 'Locked'].map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => setActiveFilter(filter)}
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeFilter === filter
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* User Table */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">USER</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ROLE</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">STATUS</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">RISK SCORE</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                                Loading...
                                            </td>
                                        </tr>
                                    ) : currentUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                                No users found
                                            </td>
                                        </tr>
                                    ) : (
                                        currentUsers.map((user) => {
                                            const risk = getRiskLevel(user.riskScore);
                                            return (
                                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            {user.avatar ? (
                                                                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                                                            ) : (
                                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                                    <span className="text-blue-600 font-semibold text-sm">{getInitials(user.name)}</span>
                                                                </div>
                                                            )}
                                                            <div>
                                                                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                                                <p className="text-xs text-gray-500">{user.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-gray-900">{user.role}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {getStatusBadge(user.status)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex-1 min-w-[100px]">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <span className={`text-sm font-semibold ${risk.textColor}`}>
                                                                        {user.riskScore}/100
                                                                    </span>
                                                                    <span className={`text-xs font-semibold ${risk.textColor}`}>
                                                                        {risk.label}
                                                                    </span>
                                                                </div>
                                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                                    <div
                                                                        className={`h-2 rounded-full ${risk.barColor}`}
                                                                        style={{ width: `${user.riskScore}%` }}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                                                            View Details
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} results
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${currentPage === pageNum
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                                {totalPages > 5 && currentPage < totalPages - 2 && (
                                    <span className="px-2 text-gray-500">...</span>
                                )}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Add Manager Modal */}
            <AddManagerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    // Refresh user list after successful creation
                    fetchUsers();
                }}
            />
        </div>
    );
};

export default UserManage;

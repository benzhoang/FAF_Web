import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { useToast } from '../../contexts/ToastContext';
import managerApi from '../../api/manager.api';

const ManagerManage = () => {
    const [users, setUsers] = useState([]);
    const [newManager, setNewManager] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const { showToast } = useToast();
    const itemsPerPage = 10;

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await managerApi.listUsers(currentPage, itemsPerPage);
            const { users, total } = res.data;
            setUsers(users || []);
            setTotalUsers(total);
        } catch (error) {
            console.error(error);
            showToast('Failed to fetch users', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [currentPage]);

    const handleCreateManager = async (e) => {
        e.preventDefault();
        try {
            await managerApi.createManager(newManager);
            setNewManager({ email: '', password: '' });
            fetchUsers();
            showToast('Manager created successfully', 'success');
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to create manager', 'error');
        }
    };

    const handlePromoteToManager = async (userId) => {
        try {
            await managerApi.updateUserRole(userId, 'manager');
            fetchUsers();
            showToast('User promoted to Manager', 'success');
        } catch (error) {
            showToast('Promotion failed', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-[#02040a] flex font-mono text-slate-300 selection:bg-indigo-500/30">
            <AdminSidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Background effects */}
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>

                <header className="bg-[#090e17]/80 backdrop-blur-md border-b border-[#1e293b] px-6 py-4 sticky top-0 z-10 flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                        <span className="w-2 h-8 bg-indigo-500 rounded-sm shadow-[0_0_10px_rgba(99,102,241,0.8)]"></span>
                        MANAGER_MANAGEMENT
                    </h1>
                     <div className="text-xs text-indigo-500/70 tracking-wider font-semibold border border-indigo-500/20 px-3 py-1.5 rounded bg-indigo-500/5">
                        SYS_TIME: <span className="text-indigo-400">{new Date().toLocaleTimeString()}</span>
                    </div>
                </header>
                <main className="p-6 overflow-y-auto relative z-0 flex-1">
                    <div className="bg-[#090e17] rounded-xl shadow-lg border border-[#1e293b] p-6 mb-8 group hover:border-indigo-500/50 transition-colors">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4 uppercase tracking-widest">
                            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                            INITIALIZE_MANAGER
                        </h2>
                        <form onSubmit={handleCreateManager} className="flex gap-4">
                            <input
                                type="email"
                                value={newManager.email}
                                onChange={(e) => setNewManager({...newManager, email: e.target.value})}
                                placeholder="TARGET_EMAIL"
                                className="flex-1 bg-[#02040a] border border-[#1e293b] rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder-slate-600 transition-all font-mono text-sm"
                                required
                            />
                            <input
                                type="password"
                                value={newManager.password}
                                onChange={(e) => setNewManager({...newManager, password: e.target.value})}
                                placeholder="GUEST_PHRASE"
                                className="flex-1 bg-[#02040a] border border-[#1e293b] rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder-slate-600 transition-all font-mono text-sm"
                                required
                            />
                            <button
                                type="submit"
                                className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/50 rounded-lg px-6 py-2 font-bold hover:bg-indigo-500/30 hover:border-indigo-400 transition-all uppercase tracking-widest text-sm shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                            >
                                EXECUTE
                            </button>
                        </form>
                    </div>

                    <div className="bg-[#090e17] rounded-xl shadow-lg border border-[#1e293b] overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#1e293b] flex items-center justify-between">
                            <h2 className="text-lg font-bold text-white uppercase tracking-widest">Global_Access_Control</h2>
                            <span className="text-xs text-indigo-400 font-bold bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/30">{totalUsers} RECORDS</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#02040a] border-b border-[#1e293b]">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-indigo-500/70 uppercase tracking-widest">IDENTITY / EMAIL</th>
                                        <th className="px-6 py-4 text-xs font-bold text-indigo-500/70 uppercase tracking-widest">ACCESS_LEVEL</th>
                                        <th className="px-6 py-4 text-xs font-bold text-indigo-500/70 uppercase tracking-widest">SYS_BALANCE</th>
                                        <th className="px-6 py-4 text-xs font-bold text-indigo-500/70 uppercase tracking-widest text-right">OPERATIONS</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1e293b]">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-12 text-center bg-[#090e17]">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                                                    <p className="text-indigo-400 font-bold tracking-widest animate-pulse mt-4 text-xs">QUERYING_DB...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : users.map((u) => (
                                        <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-6 py-4 text-sm text-slate-200 font-semibold group-hover:text-white transition-colors">{u.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border tracking-widest ${
                                                    u.role?.toLowerCase() === 'admin' ? 'bg-red-500/10 text-red-500 border-red-500/30' :
                                                    u.role === 'manager' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.2)]' :
                                                    'bg-[#02040a] text-slate-400 border-[#1e293b]'
                                                }`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-emerald-400 font-bold">{u.balance_points || 0} pts</td>
                                            <td className="px-6 py-4 text-right">
                                                {u.role?.toLowerCase() !== 'admin' && u.role?.toLowerCase() !== 'manager' && (
                                                    <button
                                                        onClick={() => handlePromoteToManager(u.id)}
                                                        className="text-[10px] uppercase font-bold text-indigo-400 hover:text-white border border-indigo-500/30 hover:border-indigo-400 hover:bg-indigo-500/20 px-3 py-1.5 rounded transition-all shadow-[0_0_10px_rgba(99,102,241,0.1)]"
                                                    >
                                                        [GRANT_MANAGER]
                                                    </button>
                                                )}
                                                {(u.role?.toLowerCase() === 'admin' || u.role?.toLowerCase() === 'manager') && (
                                                    <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">RESTRICTED</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="mt-6 flex items-center justify-between bg-[#090e17] px-6 py-4 rounded-xl shadow-lg border border-[#1e293b]">
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                            DISPLAYING {(currentPage - 1) * itemsPerPage + 1} &rarr; {Math.min(currentPage * itemsPerPage, totalUsers)} | TOTAL: {totalUsers}
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="p-1.5 border border-[#1e293b] rounded bg-[#02040a] text-slate-400 hover:border-indigo-500/50 hover:text-indigo-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <span className="text-xs font-bold text-indigo-400 tracking-widest">PG {currentPage} / {Math.ceil(totalUsers / itemsPerPage) || 1}</span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(Math.ceil(totalUsers / itemsPerPage), prev + 1))}
                                disabled={currentPage >= Math.ceil(totalUsers / itemsPerPage)}
                                className="p-1.5 border border-[#1e293b] rounded bg-[#02040a] text-slate-400 hover:border-indigo-500/50 hover:text-indigo-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ManagerManage;

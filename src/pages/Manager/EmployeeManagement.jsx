import React, { useMemo, useState, useEffect } from "react";
import managerApi from "../../api/manager.api";
import { useToast } from "../../contexts/ToastContext";

const EmployeeManagement = () => {
    const toast = useToast();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await managerApi.listUsers(1, 100);
            // Map backend users to UI fields
            const mapped = (response.data?.users || []).map(u => ({
                id: `USR_${u.id}`,
                fullName: u.full_name || "Khách hàng ẩn danh",
                email: u.email,
                phone: u.phone || "HIDDEN_CONTACT",
                department: u.role.toUpperCase(),
                status: "ACTIVE", // For now
                createdAt: new Date(u.created_at).toLocaleDateString(),
                reliability: "100%" // Placeholder
            }));
            setUsers(mapped);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            toast.error("Hệ thống: Không thể tải danh sách nhân sự.");
        } finally {
            setLoading(false);
        }
    };

    const employees = users;

    const filteredEmployees = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return employees;

        return employees.filter((e) => {
            const haystack = `${e.id} ${e.fullName} ${e.email} ${e.phone} ${e.department} ${e.status}`.toLowerCase();
            return haystack.includes(q);
        });
    }, [employees, query]);

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header section with high-tech search */}
            <header className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                        <p className="text-[10px] font-black font-mono tracking-[0.3em] text-emerald-500 uppercase">System_Personnel_Index</p>
                    </div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter leading-none mb-2">
                        Employee <span className="text-emerald-500 underline decoration-emerald-500/30 underline-offset-8 decoration-4">Management</span>
                    </h1>
                    <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">
                        Querying personnel database. Accessing reliability metrics and node assignments.
                    </p>
                </div>

                <div className="w-full lg:w-[480px] relative group">
                    <div className="absolute -inset-0.5 bg-emerald-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
                    <div className="relative flex items-center bg-transparent/50 border border-emerald-500/10 rounded-xl overflow-hidden backdrop-blur-md">
                        <div className="pl-4 text-emerald-500/50">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="QUERY_BY_ID_NAME_OR_DEPT..."
                            className="w-full bg-transparent px-4 py-4 text-xs font-mono font-black text-emerald-400 placeholder:text-slate-700 outline-none uppercase tracking-widest"
                        />
                        <div className="pr-4">
                            <span className="text-[8px] font-black font-mono text-slate-500 bg-slate-800/50 px-2 py-1 rounded">SEARCH_MOD</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Employee Tech Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center font-mono text-emerald-500 animate-pulse uppercase tracking-[0.3em]">
                        Scanning_Neural_Personnel_Index...
                    </div>
                ) : (
                    filteredEmployees.map((emp) => (
                        <div 
                            key={emp.id}
                            className="group relative bg-transparent/40 border border-emerald-500/10 rounded-2xl p-6 hover:border-emerald-500/40 hover:bg-emerald-500/[0.03] transition-all duration-500 overflow-hidden"
                        >
                            {/* Reliability Bar */}
                            <div className="absolute top-0 right-0 left-0 h-1 bg-slate-800 overflow-hidden">
                                <div 
                                    className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000" 
                                    style={{ width: emp.reliability }}
                                ></div>
                            </div>

                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-950 to-[#020617] border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-black text-xl shadow-[inset_0_0_15px_rgba(16,185,129,0.1)] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all">
                                        {emp.fullName.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-white font-black uppercase tracking-tight group-hover:text-emerald-400 transition-colors truncate">
                                            {emp.fullName}
                                        </h3>
                                        <p className="text-[9px] font-mono font-black text-emerald-500/50 tracking-[0.2em] mb-1">
                                            {emp.id}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <span className={`w-1.5 h-1.5 rounded-full ${emp.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}`}></span>
                                            <span className="text-[8px] font-mono font-black text-slate-500 tracking-widest uppercase">{emp.status}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-[8px] font-mono font-black text-slate-600 tracking-widest uppercase">Reliability</p>
                                    <p className="text-sm font-mono font-black text-emerald-400">{emp.reliability}</p>
                                </div>
                            </div>

                            <div className="space-y-3 py-4 border-y border-emerald-500/5 mb-6">
                                <div className="flex items-center justify-between text-[10px] font-mono font-black uppercase tracking-widest">
                                    <span className="text-slate-600">DEPT</span>
                                    <span className="text-slate-300">{emp.department}</span>
                                </div>
                                <div className="flex items-center justify-between text-[10px] font-mono font-black uppercase tracking-widest gap-4">
                                    <span className="text-slate-600 shrink-0">EMAIL</span>
                                    <span className="text-slate-300 truncate">{emp.email}</span>
                                </div>
                                <div className="flex items-center justify-between text-[10px] font-mono font-black uppercase tracking-widest">
                                    <span className="text-slate-600">JOINED</span>
                                    <span className="text-slate-300">{emp.createdAt}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <button className="flex-1 py-2 rounded-lg bg-emerald-500/[0.05] border border-emerald-500/10 text-emerald-500 text-[10px] font-black font-mono tracking-widest uppercase hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all">
                                    VIEW_LOGS
                                </button>
                                <button className="flex-1 py-2 rounded-lg bg-emerald-500/80 hover:bg-emerald-400 text-[#020617] text-[10px] font-black font-mono tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                    MSG_NODE
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {filteredEmployees.length === 0 && (
                <div className="p-20 text-center rounded-3xl border border-dashed border-emerald-500/20 bg-emerald-500/[0.01]">
                    <svg className="w-12 h-12 text-emerald-500/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p className="text-slate-500 text-xs font-mono font-black uppercase tracking-widest">NODE_NOT_FOUND_EXECUTE_RETRY</p>
                </div>
            )}
        </div>
    );
};

export default EmployeeManagement;


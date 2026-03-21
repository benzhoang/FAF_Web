import React, { useState, useEffect } from "react";
import managerApi from "../../api/manager.api";
import { useToast } from "../../contexts/ToastContext";

const Finances = () => {
    const toast = useToast();
    const [stats, setStats] = useState(null);
    const [financials, setFinancials] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFinancialData();
    }, []);

    const fetchFinancialData = async () => {
        try {
            setLoading(true);
            const [statsRes, finRes, transRes] = await Promise.all([
                managerApi.getStats(),
                managerApi.getFinancials(),
                managerApi.getTransactions(1, 10)
            ]);
            setStats(statsRes.data);
            setFinancials(finRes.data);
            setTransactions(transRes.data);
        } catch (error) {
            console.error("Failed to fetch financial data:", error);
            toast.error("Hệ thống: Không thể tải dữ liệu tài chính.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 text-center font-mono text-emerald-500 animate-pulse py-40 uppercase tracking-[0.3em]">
                Accessing_Fiscal_Ledger...
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <header className="relative p-10 rounded-3xl border border-emerald-500/10 bg-transparent/40 backdrop-blur-md overflow-hidden group">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #10b981 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></span>
                            <p className="text-[10px] font-black font-mono tracking-[0.4em] text-emerald-500 uppercase">Fiscal_Node_Authorization_Required</p>
                        </div>
                        <h1 className="text-5xl font-black text-white uppercase tracking-tighter leading-none mb-4">
                            Financial <span className="text-emerald-500 block lg:inline underline decoration-emerald-500/30 underline-offset-[12px] decoration-8">Overview</span>
                        </h1>
                        <p className="text-slate-500 text-xs font-mono uppercase tracking-[0.2em] max-w-xl">
                            Real-time platform revenue, asset liquidity, and protocol commission analytics.
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-4 shrink-0">
                        <button className="px-6 py-3 rounded-xl border border-emerald-500/20 text-emerald-500 text-[10px] font-black font-mono tracking-widest uppercase hover:bg-emerald-500/5 transition-all">
                            EXPORT_PDF
                        </button>
                        <button 
                            onClick={fetchFinancialData}
                            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-[#020617] text-[10px] font-black font-mono tracking-widest uppercase transition-all shadow-[0_0_25px_rgba(16,185,129,0.3)]"
                        >
                            SYNC_LEDGER
                        </button>
                    </div>
                </div>
            </header>

            {/* Summary Grid */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'TOTAL_TURNOVER', value: `$${Number(financials?.total_turnover || 0).toLocaleString()}`, trend: '+0.0%', sub: 'CUMULATIVE_VOLUME' },
                    { label: 'TOTAL_JOBS', value: stats?.total_jobs || 0, trend: `+${stats?.pending_jobs || 0}`, sub: 'IN_PIPELINE' },
                    { label: 'PROTOCOL_REVENUE', value: `$${Number(financials?.total_fees || 0).toLocaleString()}`, trend: '+5%', sub: 'SYSTEM_FEE_LOG', main: true }
                ].map((stat, i) => (
                    <div key={i} className={`relative p-8 rounded-2xl border transition-all duration-500 overflow-hidden ${stat.main ? 'bg-emerald-500/[0.07] border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.05)]' : 'bg-transparent/40 border-emerald-500/5 hover:border-emerald-500/20'}`}>
                        {stat.main && <div className="absolute top-0 right-0 p-4 opacity-5"><svg className="w-16 h-16 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>}
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <span className="text-[10px] font-black font-mono tracking-widest text-slate-500 uppercase">{stat.label}</span>
                            <span className="text-[10px] font-black font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10">{stat.trend}</span>
                        </div>
                        <p className={`text-3xl font-black font-mono tracking-tight mb-2 relative z-10 ${stat.main ? 'text-emerald-400' : 'text-white'}`}>
                            {stat.value}
                        </p>
                        <p className="text-[8px] font-mono font-bold text-slate-600 uppercase tracking-[0.2em] relative z-10">{stat.sub}</p>
                    </div>
                ))}
            </section>

            {/* Charts Section */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Growth Chart */}
                <div className="lg:col-span-2 p-8 rounded-3xl border border-emerald-500/10 bg-transparent/40 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-sm font-black text-white uppercase tracking-widest font-mono">REVENUE_GROWTH_INDEX</h2>
                            <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-1">Nodal performance // 6_WEEK_QUANTUM</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></span>
                                <span className="text-[8px] font-mono font-black text-slate-400 uppercase tracking-widest">Growth</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="h-64 relative group">
                        <svg viewBox="0 0 800 200" className="w-full h-full preserve-3d">
                            <defs>
                                <linearGradient id="emGrad" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            {/* Grid Lines */}
                            {[0, 50, 100, 150, 200].map(y => (
                                <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="#10b981" strokeOpacity="0.05" strokeWidth="1" />
                            ))}
                            {/* Area */}
                            <path
                                d="M0 150 C 100 120, 200 130, 300 100 C 400 140, 500 80, 600 120 C 700 180, 750 110, 800 160 L 800 200 L 0 200 Z"
                                fill="url(#emGrad)"
                                className="animate-in fade-in duration-1000"
                            />
                            {/* Line */}
                            <path
                                d="M0 150 C 100 120, 200 130, 300 100 C 400 140, 500 80, 600 120 C 700 180, 750 110, 800 160"
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="3"
                                strokeLinecap="round"
                                className="drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                            />
                        </svg>
                        {/* Hover Overlay Mock */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-emerald-950/90 border border-emerald-500/30 p-3 rounded-lg backdrop-blur-md pointer-events-none">
                            <p className="text-[9px] font-mono font-black text-emerald-400 uppercase tracking-widest mb-1">DATA_POINT: ACTIVE</p>
                            <p className="text-[8px] font-mono text-slate-400 uppercase tracking-widest">REAL_TIME_MONITORING</p>
                        </div>
                    </div>
                </div>

                {/* Cash Flow Distribution */}
                <div className="p-8 rounded-3xl border border-emerald-500/10 bg-transparent/40 backdrop-blur-sm flex flex-col">
                    <h2 className="text-sm font-black text-white uppercase tracking-widest font-mono mb-1">USER_DEMOGRAPHICS</h2>
                    <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-10">User role distribution</p>
                    
                    <div className="flex-1 space-y-4">
                        {[
                            { label: 'WORKERS', val: stats?.total_workers || 0, color: 'bg-emerald-500' },
                            { label: 'EMPLOYERS', val: stats?.total_employers || 0, color: 'bg-blue-500' },
                            { label: 'MANAGERS', val: stats?.total_managers || 0, color: 'bg-amber-500' }
                        ].map((role) => (
                            <div key={role.label} className="space-y-1.5">
                                <div className="flex justify-between items-center text-[10px] font-mono font-black uppercase">
                                    <span className="text-slate-500">{role.label}</span>
                                    <span className="text-white">{role.val}</span>
                                </div>
                                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full ${role.color} transition-all duration-1000`} 
                                        style={{ width: `${(role.val / (stats?.total_users || 1)) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* System Logs Table */}
            <section className="rounded-3xl border border-emerald-500/10 bg-transparent/40 overflow-hidden backdrop-blur-sm">
                <div className="p-8 border-b border-emerald-500/5 flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-black text-white uppercase tracking-widest font-mono">SYSTEM_FISCAL_LOGS</h2>
                        <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-1">Live transaction monitoring enabled</p>
                    </div>
                    <button className="text-[10px] font-black font-mono text-emerald-500 uppercase tracking-widest hover:text-emerald-400 transition-colors">ACCESS_FULL_HISTORY</button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-emerald-500/[0.02] text-[8px] font-black font-mono text-slate-500 uppercase tracking-widest">
                                <th className="px-8 py-4">Status</th>
                                <th className="px-8 py-4">Auth_Node</th>
                                <th className="px-8 py-4">Operation</th>
                                <th className="px-8 py-4 text-right">Magnitude</th>
                                <th className="px-8 py-4 text-right">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-emerald-500/5">
                            {transactions.length > 0 ? transactions.map((log, i) => (
                                <tr key={i} className="hover:bg-emerald-500/[0.01] transition-colors group">
                                    <td className="px-8 py-6">
                                        <span className={`flex w-2 h-2 rounded-full ${log.status === 'SUCCESS' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`}></span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center text-[10px] font-black font-mono text-emerald-400 group-hover:border-emerald-500/30 transition-all">
                                                {(log.full_name || log.email).charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-white uppercase tracking-tight">{log.full_name || "SYSTEM_USER"}</p>
                                                <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">{log.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{log.type}</td>
                                    <td className={`px-8 py-6 text-right text-xs font-mono font-black tracking-tight ${['RELEASE', 'REFUND', 'DEPOSIT'].includes(log.type) ? 'text-emerald-400' : 'text-rose-500'}`}>
                                        {['RELEASE', 'REFUND', 'DEPOSIT'].includes(log.type) ? '+' : '-'}${log.amount}
                                    </td>
                                    <td className="px-8 py-6 text-right text-[8px] font-mono text-slate-500 uppercase tracking-widest">
                                        {new Date(log.created_at).toLocaleString()}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-10 text-center font-mono text-[10px] text-slate-600 uppercase tracking-widest">No transaction records found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default Finances;


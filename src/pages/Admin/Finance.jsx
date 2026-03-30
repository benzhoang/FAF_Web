import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { useToast } from '../../contexts/ToastContext';
import managerApi from '../../api/manager.api';

const Finance = () => {
    const { showToast } = useToast();
    const [stats, setStats] = useState(null);
    const [financials, setFinancials] = useState(null);
    const [disputes, setDisputes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [statsRes, finRes, disputesRes] = await Promise.all([
                managerApi.getStats(),
                managerApi.getFinancials(),
                managerApi.listDisputes()
            ]);
            setStats(statsRes.data);
            setFinancials(finRes.data);
            setDisputes(disputesRes.data || []);
        } catch (error) {
            console.error(error);
            showToast('Failed to sync financial data', 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN').format(amount || 0);
    };

    return (
        <div className="min-h-screen bg-[#02040a] flex font-mono text-slate-300 selection:bg-emerald-500/30">
            <AdminSidebar />

            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>

                <header className="bg-[#090e17]/80 backdrop-blur-md border-b border-[#1e293b] px-6 py-4 sticky top-0 z-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            <span className="w-2 h-8 bg-emerald-500 rounded-sm shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
                            ESCROW_&_FINANCE
                        </h1>
                        <p className="mt-1 text-[10px] text-slate-500 uppercase tracking-widest ml-5 font-mono">
                            Cashflow monitoring, reward protocols, and dispute resolution.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-xs text-emerald-500/70 tracking-wider font-semibold border border-emerald-500/20 px-3 py-1.5 rounded bg-emerald-500/5">
                            SYS_TIME: <span className="text-emerald-400">{new Date().toLocaleTimeString()}</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 overflow-y-auto relative z-0">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                            <p className="text-emerald-400 font-bold tracking-[0.3em] animate-pulse mt-6 uppercase">SYNCING_ASSETS...</p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                                <div className="bg-[#090e17] rounded-xl p-5 border border-[#1e293b] relative overflow-hidden group hover:border-emerald-500/50 transition-all shadow-xl">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-emerald-500 transition-colors">TOTAL_TURNOVER</p>
                                    <p className="mt-2 text-2xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                                        {formatCurrency(financials?.total_turnover)} <span className="text-xs text-slate-500">PTS</span>
                                    </p>
                                    <div className="mt-3 flex items-center gap-2">
                                        <span className="inline-flex items-center rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-black text-emerald-400 border border-emerald-500/20">STABLE</span>
                                        <span className="text-[10px] text-slate-600 font-bold uppercase font-mono">SYS_VOLUME</span>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>
                                </div>

                                <div className="bg-[#090e17] rounded-xl p-5 border border-[#1e293b] relative overflow-hidden group hover:border-indigo-500/50 transition-all shadow-xl">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-indigo-500 transition-colors">ACCUMULATED_FEES</p>
                                    <p className="mt-2 text-2xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                                        {formatCurrency(financials?.total_fees)} <span className="text-xs text-slate-500">PTS</span>
                                    </p>
                                    <div className="mt-3 flex items-center gap-2">
                                        <span className="inline-flex items-center rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-black text-indigo-400 border border-indigo-500/20">VAULT</span>
                                        <span className="text-[10px] text-slate-600 font-bold uppercase font-mono">SYS_REVENUE</span>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>
                                </div>

                                <div className="bg-[#090e17] rounded-xl p-5 border border-[#1e293b] relative overflow-hidden group hover:border-amber-500/50 transition-all shadow-xl">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-amber-500 transition-colors">ACTIVE_CONTRACTS</p>
                                    <p className="mt-2 text-3xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                                        {stats?.open_jobs || 0}
                                    </p>
                                    <div className="mt-3 flex items-center gap-2">
                                        <span className="inline-flex items-center rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-black text-amber-400 border border-amber-500/20">IN_PROGRESS</span>
                                        <span className="text-[10px] text-slate-600 font-bold uppercase font-mono">ESCROW_NODES</span>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
                                </div>

                                <div className="bg-[#090e17] rounded-xl p-5 border border-[#1e293b] relative overflow-hidden group hover:border-red-500/50 transition-all shadow-xl">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-red-500 transition-colors">DISPUTE_METRICS</p>
                                    <p className="mt-2 text-3xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                                        {disputes.length}
                                    </p>
                                    <div className="mt-3 flex items-center gap-2">
                                        <span className="inline-flex items-center rounded bg-red-500/10 px-2 py-0.5 text-[10px] font-black text-red-500 border border-red-500/20 uppercase">ALERTS</span>
                                        <span className="text-[10px] text-slate-600 font-bold uppercase font-mono">REQUIRES_ACTION</span>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent"></div>
                                </div>
                            </div>

                            <div className="bg-[#02040a]/60 rounded-2xl p-6 border border-[#1e293b] mb-8 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-lg font-black text-white uppercase tracking-tighter">DISPUTE_QUEUE</h2>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono mt-1">REAL_TIME_MONITORING_OF_CONTRACT_CONFLICTS</p>
                                    </div>
                                    <span className="rounded bg-emerald-500/10 px-3 py-1 text-[10px] font-black text-emerald-400 border border-emerald-500/30 animate-pulse">
                                        {disputes.length} ACTIVE_ALERTS
                                    </span>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-[#090e17] border-b border-[#1e293b]">
                                            <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 font-mono">
                                                <th className="px-6 py-4">ID</th>
                                                <th className="px-6 py-4">PARTICIPANTS</th>
                                                <th className="px-6 py-4">BUDGET</th>
                                                <th className="px-6 py-4">STATUS</th>
                                                <th className="px-6 py-4 text-right">COMMANDS</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#1e293b]">
                                            {disputes.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-10 text-center text-slate-600 font-bold uppercase tracking-widest italic">
                                                        NO_ACTIVE_DISPUTES_DETECTED
                                                    </td>
                                                </tr>
                                            ) : disputes.map((d) => (
                                                <tr key={d.id} className="text-sm hover:bg-white/[0.02] transition-colors group/row font-mono">
                                                    <td className="px-6 py-5">
                                                        <p className="font-bold text-white group-hover/row:text-emerald-400 transition-colors uppercase">#{d.id}</p>
                                                        <p className="text-[9px] text-slate-500 truncate max-w-[150px]">{d.contract?.job?.title || 'Unknown'}</p>
                                                    </td>
                                                    <td className="px-6 py-5 text-xs text-slate-300">
                                                        {d.contract?.employer?.name || 'User'} vs {d.contract?.worker?.name || 'Worker'}
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <p className="text-sm font-black text-emerald-400">{formatCurrency(d.contract?.total_price)}</p>
                                                        <p className="text-[9px] text-slate-600 font-bold uppercase">LOCKED</p>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className={`inline-flex items-center rounded bg-amber-500/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-amber-500 border border-amber-500/30`}>
                                                            {d.status || 'OPEN'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5 text-right flex justify-end gap-3">
                                                        <button 
                                                            className="text-[10px] font-black text-emerald-400 hover:text-white transition-colors bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded uppercase tracking-widest hover:bg-emerald-500/20"
                                                            onClick={() => showToast('Dispute detail view coming soon', 'info')}
                                                        >
                                                            INSPECT
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Finance;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const JobTable = ({ contracts = [] }) => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('ALL');
    const { t } = useTranslation();

    const filteredContracts = contracts.filter(c => {
        if (filter === 'ALL') return true;
        return c.status === filter;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'ACTIVE': return <span className="inline-block px-2 py-0.5 rounded text-[9px] font-black font-mono tracking-widest uppercase bg-cyan-900/30 text-cyan-400 border border-cyan-500/30">{t('dashboard.job_table.active')}</span>;
            case 'COMPLETED': return <span className="inline-block px-2 py-0.5 rounded text-[9px] font-black font-mono tracking-widest uppercase bg-emerald-900/30 text-emerald-400 border border-emerald-500/30">{t('dashboard.job_table.completed')}</span>;
            case 'CANCELLED': 
            case 'TERMINATED': return <span className="inline-block px-2 py-0.5 rounded text-[9px] font-black font-mono tracking-widest uppercase bg-rose-900/30 text-rose-400 border border-rose-500/30">{t('dashboard.job_table.cancelled')}</span>;
            default: return <span className="inline-block px-2 py-0.5 rounded text-[9px] font-black font-mono tracking-widest uppercase bg-slate-800 text-slate-400 border border-slate-700">{status}</span>;
        }
    };

    return (
        <div className="rounded-xl border border-slate-700/50 bg-[#090e17] overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-700/50 bg-slate-900/40 overflow-x-auto no-scrollbar">
                {['ALL', 'ACTIVE', 'COMPLETED', 'CANCELLED'].map(tab => {
                    let label = tab;
                    if (tab === 'ALL') label = t('dashboard.job_table.all');
                    if (tab === 'ACTIVE') label = t('dashboard.job_table.active');
                    if (tab === 'COMPLETED') label = t('dashboard.job_table.completed');
                    if (tab === 'CANCELLED') label = t('dashboard.job_table.cancelled');
                    return (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`whitespace-nowrap px-6 py-4 text-[10px] font-black font-mono tracking-widest uppercase border-b-2 transition-all ${
                                filter === tab 
                                ? 'border-cyan-400 text-cyan-400 bg-cyan-950/40' 
                                : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/40'
                            }`}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                        <tr className="bg-slate-800/30 border-b border-slate-700/50">
                            <th className="px-6 py-3 text-[9px] font-black text-slate-500 tracking-widest uppercase font-mono">{t('dashboard.job_table.job_name')}</th>
                            <th className="px-6 py-3 text-[9px] font-black text-slate-500 tracking-widest uppercase font-mono">{t('dashboard.job_table.client')}</th>
                            <th className="px-6 py-3 text-[9px] font-black text-slate-500 tracking-widest uppercase font-mono">{t('dashboard.job_table.status')}</th>
                            <th className="px-6 py-3 text-[9px] font-black text-slate-500 tracking-widest uppercase font-mono text-right">{t('dashboard.job_table.earnings')}</th>
                            <th className="px-6 py-3 text-[9px] font-black text-slate-500 tracking-widest uppercase font-mono text-center">{t('dashboard.job_table.action')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                        {filteredContracts.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-[10px] font-mono tracking-widest uppercase text-slate-500 italic">
                                    {t('dashboard.job_table.no_data')}
                                </td>
                            </tr>
                        ) : (
                            filteredContracts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map(contract => (
                                <tr key={contract.id} className="hover:bg-slate-800/40 transition-colors group">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-[13px] text-slate-200 group-hover:text-cyan-400 transition-colors cursor-pointer truncate max-w-[200px]" onClick={() => navigate(`/contract/${contract.id}/view`)}>
                                            {contract.job_title}
                                        </p>
                                        <p className="text-[10px] font-mono text-slate-500 mt-1 uppercase tracking-widest">{t('dashboard.job_table.updated')} {new Date(contract.updated_at || contract.created_at).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-6 py-4 text-[12px] text-slate-400 font-mono truncate max-w-[150px]">
                                        {contract.client_name || t('dashboard.anonymous_client')}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(contract.status)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <p className="font-black text-cyan-400 font-mono">${Number(contract.total_amount || 0).toLocaleString()}</p>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button 
                                            onClick={() => navigate(`/contract/${contract.id}/view`)}
                                            className="px-4 py-2 text-[10px] font-black font-mono tracking-widest uppercase text-cyan-400 bg-cyan-900/20 hover:bg-cyan-900/40 border border-cyan-500/20 hover:border-cyan-500/50 rounded transition-all"
                                        >
                                            {t('dashboard.view_details')}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default JobTable;

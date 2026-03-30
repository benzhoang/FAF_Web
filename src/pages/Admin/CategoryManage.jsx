import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import axiosClient from '../../api/axiosClient';
import { useToast } from '../../contexts/ToastContext';

const CategoryManage = () => {
    const [categories, setCategories] = useState([]);
    const [proposals, setProposals] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: '', slug: '', description: '' });
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    const fetchData = async () => {
        try {
            setLoading(true);
            const [catRes, propRes] = await Promise.all([
                axiosClient.get('/categories'),
                axiosClient.get('/admin/categories/proposals')
            ]);
            setCategories(catRes.data || []);
            setProposals(propRes.data || []);
        } catch (error) {
            console.error(error);
            showToast('Failed to fetch data', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory.name.trim() || !newCategory.slug.trim()) return;
        try {
            await axiosClient.post('/categories', newCategory);
            setNewCategory({ name: '', slug: '', description: '' });
            fetchData();
            showToast('Category added successfully', 'success');
        } catch (error) {
            showToast('Failed to add category', 'error');
        }
    };

    const handleApproveProposal = async (proposal) => {
        try {
            // First approve the proposal
            await axiosClient.put(`/admin/categories/proposals/${proposal.id}/approve`);
            // Then create the actual category
            await axiosClient.post('/categories', {
                name: proposal.name,
                slug: proposal.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
                description: proposal.description
            });
            fetchData();
            showToast('Proposal approved and category created', 'success');
        } catch (error) {
            showToast('Action failed', 'error');
        }
    };

    const handleRejectProposal = async (id) => {
        try {
            await axiosClient.put(`/admin/categories/proposals/${id}/reject`);
            fetchData();
            showToast('Proposal rejected', 'success');
        } catch (error) {
            showToast('Action failed', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-[#02040a] flex font-mono text-slate-300 selection:bg-cyan-500/30">
            <AdminSidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Background effects */}
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>

                <header className="bg-[#090e17]/80 backdrop-blur-md border-b border-[#1e293b] px-6 py-4 sticky top-0 z-10 flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                        <span className="w-2 h-8 bg-cyan-500 rounded-sm shadow-[0_0_10px_rgba(6,182,212,0.8)]"></span>
                        CATEGORY_MANAGEMENT
                    </h1>
                    <div className="text-xs text-cyan-500/70 tracking-wider font-semibold border border-cyan-500/20 px-3 py-1.5 rounded bg-cyan-500/5">
                        SYS_TIME: <span className="text-cyan-400">{new Date().toLocaleTimeString()}</span>
                    </div>
                </header>
                <main className="p-6 overflow-y-auto relative z-0 flex-1">
                    {/* Add Category Form */}
                    <div className="bg-[#090e17] rounded-xl shadow-lg border border-[#1e293b] p-6 mb-8 group hover:border-cyan-500/50 transition-colors">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4 uppercase tracking-widest">
                            <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                            INITIALIZE_CATEGORY
                        </h2>
                        <form onSubmit={handleAddCategory} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <input
                                type="text"
                                value={newCategory.name}
                                onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                                placeholder="CATEGORY_NAME"
                                className="bg-[#02040a] border border-[#1e293b] rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500 text-white placeholder-slate-600 transition-all font-mono text-sm"
                            />
                            <input
                                type="text"
                                value={newCategory.slug}
                                onChange={(e) => setNewCategory({...newCategory, slug: e.target.value})}
                                placeholder="SYS_SLUG (e.g. video-editing)"
                                className="bg-[#02040a] border border-[#1e293b] rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500 text-white placeholder-slate-600 transition-all font-mono text-sm md:col-span-2"
                            />
                            <button
                                type="submit"
                                className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-lg px-6 py-2 font-bold hover:bg-cyan-500/30 hover:border-cyan-400 transition-all uppercase tracking-widest text-sm shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                            >
                                EXECUTE
                            </button>
                            <textarea
                                value={newCategory.description}
                                onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                                placeholder="PROTOCOL_DESCRIPTION (Optional)"
                                className="md:col-span-4 bg-[#02040a] border border-[#1e293b] rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500 text-white placeholder-slate-600 transition-all font-mono text-sm"
                            />
                        </form>
                    </div>

                    {/* Proposals Section */}
                    {proposals.length > 0 && (
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2 uppercase tracking-widest">
                                    <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                                    USER_PROPOSALS
                                </h2>
                                <span className="rounded bg-amber-500/10 border border-amber-500/30 px-2 py-1 text-[10px] font-bold tracking-widest uppercase text-amber-500 animate-pulse">
                                    {proposals.length} PENDING
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {proposals.map(prop => (
                                    <div key={prop.id} className="bg-[#090e17] border border-[#1e293b] rounded-xl p-5 shadow-lg relative overflow-hidden group hover:border-amber-500/50 transition-all">
                                        <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
                                            <svg className="w-16 h-16 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                                        </div>
                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-3">
                                                <h3 className="font-bold text-white text-lg">{prop.name}</h3>
                                                <span className="text-[10px] bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-2 py-0.5 rounded uppercase font-bold tracking-widest shadow-[0_0_10px_rgba(6,182,212,0.2)]">PROPOSAL</span>
                                            </div>
                                            <p className="text-sm text-slate-400 mb-4 line-clamp-2 min-h-[40px] border-l-2 border-[#1e293b] pl-3 italic group-hover:border-amber-500/30 transition-colors">"{prop.description || 'NO_DESCRIPTION_PROVIDED'}"</p>
                                            <div className="text-[10px] bg-[#02040a] border border-[#1e293b] p-2 rounded text-slate-500 mb-4 uppercase tracking-widest font-mono">
                                                <span className="text-slate-400 font-bold mr-1">ORIGINATOR:</span> {prop.user_email}
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleApproveProposal(prop)}
                                                    className="flex-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 py-2 rounded text-[10px] font-bold tracking-widest uppercase hover:bg-emerald-500/20 hover:text-white hover:border-emerald-500/50 transition-all shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                                                >
                                                    [APPROVE]
                                                </button>
                                                <button
                                                    onClick={() => handleRejectProposal(prop.id)}
                                                    className="flex-1 bg-rose-500/10 text-rose-400 border border-rose-500/30 py-2 rounded text-[10px] font-bold tracking-widest uppercase hover:bg-rose-500/20 hover:text-white hover:border-rose-500/50 transition-all shadow-[0_0_10px_rgba(244,63,94,0.1)]"
                                                >
                                                    [REJECT]
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* All Categories Table */}
                    <div className="bg-[#090e17] rounded-xl shadow-lg border border-[#1e293b] overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#1e293b] bg-[#02040a]/50">
                            <h2 className="text-lg font-bold text-white uppercase tracking-widest">ACTIVE_PROTOCOLS (CATEGORIES)</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#02040a] border-b border-[#1e293b]">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-cyan-500/70 uppercase tracking-widest">PROTOCOL_NAME</th>
                                        <th className="px-6 py-4 text-xs font-bold text-cyan-500/70 uppercase tracking-widest">SYS_SLUG</th>
                                        <th className="px-6 py-4 text-xs font-bold text-cyan-500/70 uppercase tracking-widest">DESCRIPTION</th>
                                        <th className="px-6 py-4 text-xs font-bold text-cyan-500/70 uppercase tracking-widest text-right">COMMAND</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1e293b]">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-12 text-center bg-[#090e17]">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
                                                    <p className="text-cyan-400 font-bold tracking-widest animate-pulse mt-4 text-xs">QUERYING_DB...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : categories.length === 0 ? (
                                        <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-500 font-bold tracking-widest uppercase border border-dashed border-[#1e293b] m-4 rounded">No records found.</td></tr>
                                    ) : categories.map((cat) => (
                                        <tr key={cat.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-6 py-4 text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{cat.name}</td>
                                            <td className="px-6 py-4 text-xs text-slate-500 font-mono tracking-wider">{cat.slug}</td>
                                            <td className="px-6 py-4 text-sm text-slate-400 truncate max-w-xs">{cat.description || '<NO_DATA>'}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-[10px] uppercase font-bold text-cyan-400 hover:text-white border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-500/20 px-3 py-1.5 rounded transition-all shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                                                    [EDIT]
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CategoryManage;

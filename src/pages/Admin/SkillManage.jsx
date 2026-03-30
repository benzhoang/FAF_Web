import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import axiosClient from '../../api/axiosClient';
import { useToast } from '../../contexts/ToastContext';

const SkillManage = () => {
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [editingSkill, setEditingSkill] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    const fetchSkills = async () => {
        try {
            setLoading(true);
            const res = await axiosClient.get('/skills');
            setSkills(res.data || []);
        } catch (error) {
            console.error(error);
            showToast('Failed to fetch skills', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    const handleAddSkill = async (e) => {
        e.preventDefault();
        if (!newSkill.trim()) return;
        try {
            await axiosClient.post('/skills', { name: newSkill });
            setNewSkill('');
            fetchSkills();
            showToast('Skill added successfully', 'success');
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to add skill', 'error');
        }
    };

    const handleUpdateSkill = async (e) => {
        e.preventDefault();
        if (!editingSkill.name.trim()) return;
        try {
            await axiosClient.put(`/skills/${editingSkill.id}`, { name: editingSkill.name });
            setEditingSkill(null);
            fetchSkills();
            showToast('Skill updated successfully', 'success');
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to update skill', 'error');
        }
    };

    const handleDeleteSkill = async (id) => {
        if (!window.confirm('WARNING: THIS ACTION PROCEEDS WITH SYS_DEACTIVATION. CONFIRM COMMAND?')) return;
        try {
            await axiosClient.delete(`/skills/${id}`);
            fetchSkills();
            showToast('Skill deactivated', 'success');
        } catch (error) {
            showToast('Failed to deactivate skill', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-[#02040a] flex font-mono text-slate-300 selection:bg-rose-500/30">
            <AdminSidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Background effects */}
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>

                <header className="bg-[#090e17]/80 backdrop-blur-md border-b border-[#1e293b] px-6 py-4 sticky top-0 z-10 flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                        <span className="w-2 h-8 bg-rose-500 rounded-sm shadow-[0_0_10px_rgba(244,63,94,0.8)]"></span>
                        SKILL_REGISTRY
                    </h1>
                     <div className="text-xs text-rose-500/70 tracking-wider font-semibold border border-rose-500/20 px-3 py-1.5 rounded bg-rose-500/5">
                        SYS_TIME: <span className="text-rose-400">{new Date().toLocaleTimeString()}</span>
                    </div>
                </header>
                <main className="p-6 overflow-y-auto relative z-0 flex-1">
                    {/* Add/Edit Skill Form */}
                    <div className="bg-[#090e17] rounded-xl shadow-lg border border-[#1e293b] p-6 mb-8 group hover:border-rose-500/50 transition-colors">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4 uppercase tracking-widest">
                            <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
                            {editingSkill ? 'MODIFY_SKILL_NODE' : 'INITIALIZE_SKILL_NODE'}
                        </h2>
                        <form onSubmit={editingSkill ? handleUpdateSkill : handleAddSkill} className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="text"
                                value={editingSkill ? editingSkill.name : newSkill}
                                onChange={(e) => editingSkill ? setEditingSkill({...editingSkill, name: e.target.value}) : setNewSkill(e.target.value)}
                                placeholder="ENTER_SKILL_IDENTIFIER (e.g. Video Editing)"
                                className="flex-1 bg-[#02040a] border border-[#1e293b] rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-rose-500/50 focus:border-rose-500 text-white placeholder-slate-600 transition-all font-mono text-sm"
                            />
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="bg-rose-500/20 text-rose-400 border border-rose-500/50 rounded-lg px-6 py-2 font-bold hover:bg-rose-500/30 hover:border-rose-400 hover:text-white transition-all uppercase tracking-widest text-sm shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                                >
                                    {editingSkill ? '[EXEC_UPDATE]' : '[EXEC_ADD]'}
                                </button>
                                {editingSkill && (
                                    <button
                                        type="button"
                                        onClick={() => setEditingSkill(null)}
                                        className="bg-[#02040a] text-slate-400 border border-[#1e293b] px-6 py-2 rounded-lg font-bold hover:bg-[#1e293b] hover:text-white transition-all uppercase tracking-widest text-sm"
                                    >
                                        [ABORT]
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Skills Table */}
                    <div className="bg-[#090e17] rounded-xl shadow-lg border border-[#1e293b] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#02040a] border-b border-[#1e293b]">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-rose-500/70 uppercase tracking-widest">SYS_ID</th>
                                        <th className="px-6 py-4 text-xs font-bold text-rose-500/70 uppercase tracking-widest">SKILL_NAME</th>
                                        <th className="px-6 py-4 text-xs font-bold text-rose-500/70 uppercase tracking-widest">SLUG</th>
                                        <th className="px-6 py-4 text-xs font-bold text-rose-500/70 uppercase tracking-widest text-right">COMMAND</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1e293b]">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-12 text-center bg-[#090e17]">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="w-8 h-8 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>
                                                    <p className="text-rose-400 font-bold tracking-widest animate-pulse mt-4 text-xs">QUERYING_DB...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : skills.length === 0 ? (
                                        <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-500 font-bold tracking-widest uppercase border border-dashed border-[#1e293b] m-4 rounded">No records found.</td></tr>
                                    ) : skills.map((skill) => (
                                        <tr key={skill.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-6 py-4 text-xs text-slate-500 font-mono">#{skill.id}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{skill.name}</td>
                                            <td className="px-6 py-4 text-xs text-slate-500 font-mono tracking-wider">{skill.slug}</td>
                                            <td className="px-6 py-4 text-right space-x-3">
                                                <button
                                                    onClick={() => setEditingSkill(skill)}
                                                    className="text-[10px] uppercase font-bold text-emerald-400 hover:text-white border border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-500/20 px-3 py-1.5 rounded transition-all shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                                                >
                                                    [EDIT]
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteSkill(skill.id)}
                                                    className="text-[10px] uppercase font-bold text-rose-400 hover:text-white border border-rose-500/30 hover:border-rose-400 hover:bg-rose-500/20 px-3 py-1.5 rounded transition-all shadow-[0_0_10px_rgba(244,63,94,0.1)]"
                                                >
                                                    [DEACTIVATE]
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

export default SkillManage;

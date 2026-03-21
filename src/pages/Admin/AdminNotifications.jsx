import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import axiosClient from '../../api/axiosClient';
import { useToast } from '../../contexts/ToastContext';

const AdminNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await axiosClient.get('/admin/notifications');
            setNotifications(res.data || []);
        } catch (error) {
            console.error(error);
            showToast('Failed to fetch notifications', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (id) => {
        try {
            await axiosClient.patch(`/admin/notifications/${id}/read`);
            setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (error) {
            showToast('Failed to mark as read', 'error');
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
                        SYSTEM_NOTIFICATIONS
                    </h1>
                    <div className="text-xs text-cyan-500/70 tracking-wider font-semibold border border-cyan-500/20 px-3 py-1.5 rounded bg-cyan-500/5">
                        SYS_TIME: <span className="text-cyan-400">{new Date().toLocaleTimeString()}</span>
                    </div>
                </header>
                <main className="p-6 overflow-y-auto relative z-0 flex-1">
                    <div className="max-w-4xl mx-auto space-y-4">
                        {loading ? (
                            <div className="text-center py-12 bg-[#090e17] rounded-xl border border-[#1e293b]">
                                <div className="flex flex-col items-center justify-center">
                                    <div className="w-10 h-10 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
                                    <p className="text-cyan-400 font-bold tracking-widest animate-pulse mt-4 text-xs">SYNCING_LOGS...</p>
                                </div>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="bg-[#090e17] rounded-xl p-10 text-center border border-dashed border-[#1e293b]">
                                <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <p className="text-slate-500 font-bold tracking-widest uppercase">NO_ALERTS_DETECTED</p>
                            </div>
                        ) : notifications.map((n) => (
                            <div 
                                key={n.id} 
                                className={`bg-[#090e17] border p-5 rounded-xl transition-all shadow-lg relative overflow-hidden group hover:border-cyan-500/50 ${n.is_read ? 'border-[#1e293b] opacity-70' : 'border-[#1e293b] border-l-cyan-500 border-l-4 shadow-[0_0_15px_rgba(6,182,212,0.1)]'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className={`font-bold ${n.is_read ? 'text-slate-400' : 'text-white text-lg group-hover:text-cyan-400 transition-colors'}`}>{n.title}</h3>
                                        <p className="text-sm text-slate-300 mt-2 leading-relaxed">{n.message}</p>
                                    </div>
                                    {!n.is_read && (
                                        <button 
                                            onClick={() => markAsRead(n.id)}
                                            className="text-[10px] bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-3 py-1.5 rounded font-bold hover:bg-cyan-500/20 hover:text-white hover:border-cyan-400 transition-all uppercase tracking-widest shadow-[0_0_10px_rgba(6,182,212,0.1)] shrink-0 ml-4"
                                        >
                                            [ACKNOWLEDGE]
                                        </button>
                                    )}
                                </div>
                                <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-[#1e293b] text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                    <span className="bg-[#02040a] border border-cyan-500/30 text-cyan-500 px-2 py-1 rounded">TYPE: {n.type || 'SYS_EVENT'}</span>
                                    <span>ORG: <span className="text-slate-400 normal-case tracking-normal font-medium">{n.sender_email}</span></span>
                                    <span>T_STAMP: <span className="text-slate-400 tracking-wider tabular-nums">{new Date(n.created_at).toLocaleString()}</span></span>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminNotifications;

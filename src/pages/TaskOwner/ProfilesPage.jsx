import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import TaskOwnerSidebar from '../../components/TaskOwnerSidebar';
import { useAuth } from '../../auth/AuthContext';
import { userApi } from '../../api/user.api';
import SkillSelector from '../../components/SkillSelector';

const ProfilesPage = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { user, loading: authLoading, fetchMe } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        bio: '',
        skills: [],
        location: '',
        hourly_rate: null,
        availability: 'available'
    });
    const [walletData, setWalletData] = useState({
        walletId: '',
        balance: 0,
        currency: 'VND'
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user) {
            initializeFormData();
        }
    }, [user]);

    const initializeFormData = () => {
        setFormData({
            full_name: user.full_name || '',
            bio: user.bio || '',
            skills: user.skills || [],
            location: user.location || '',
            hourly_rate: user.hourly_rate || null,
            availability: user.availability || 'available'
        });

        setWalletData({
            walletId: `FAF-00${user.id}`,
            balance: user.balance_points || 0,
            currency: 'Points'
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProfile = async () => {
        try {
            setSaving(true);
            await userApi.updateProfile(formData);
            await fetchMe();
            setIsEditing(false);
            toast.success('SYS: Profile synchronization complete.');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.message || 'ERR: Sync failed. Retry connection.');
        } finally {
            setSaving(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-[#020617] flex">
                <TaskOwnerSidebar />
                <div className="flex-1 flex items-center justify-center font-mono text-cyan-500">
                    <div className="flex items-center gap-3 animate-pulse">
                        <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded flex animate-spin"></div>
                        ACCESSING_RECORDS...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-[#020617] text-slate-300 flex overflow-hidden font-sans relative">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: 'repeating-linear-gradient(0deg,rgba(0,255,255,0.008) 0px,rgba(0,255,255,0.008) 1px,transparent 1px,transparent 3px)' }} />
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px]" />
            </div>

            <TaskOwnerSidebar />

            <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10 w-full">
                {/* Clean Header */}
                <header className="bg-[#090e17]/80 backdrop-blur-md px-8 py-5 flex items-center justify-between z-20 shadow-[0_1px_2px_rgba(6,182,212,0.1)] border-b border-slate-800 shrink-0">
                    <div>
                        <h1 className="text-xl font-black text-white tracking-widest uppercase font-mono text-shadow-glow-cyan">OPERATIVE_CONFIG</h1>
                        <p className="text-[10px] text-cyan-500/70 font-mono tracking-widest uppercase mt-0.5">Manage node parameters and financial streams.</p>
                    </div>
                </header>

                {/* Main Content Area - Scrollable but with hidden scrollbar for a cleaner look */}
                <main className="flex-1 overflow-y-auto px-4 py-6 lg:px-8 w-full custom-scrollbar">
                    <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-6 h-full">
                        
                        {/* LEFT COLUMN: Profile Form */}
                        <div className="flex-1 space-y-6 flex flex-col">
                            
                            {/* Profile Card */}
                            <div className="bg-[#090e17]/80 backdrop-blur-md rounded-2xl border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)] overflow-hidden relative flex-1 flex flex-col">
                                
                                {/* Dynamic Cover Banner */}
                                <div className="h-28 sm:h-36 bg-gradient-to-r from-cyan-900 via-blue-900 to-indigo-900 relative overflow-hidden shrink-0">
                                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20"></div>
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-400/50 shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-[scan_3s_ease-in-out_infinite]"></div>
                                </div>

                                {/* Header Content */}
                                <div className="px-6 sm:px-8 pb-6 relative -mt-10 sm:-mt-14 flex-1 flex flex-col w-full">
                                    <div className="flex justify-between items-end mb-4 shrink-0">
                                        <div className="w-20 h-20 sm:w-28 sm:h-28 rounded border-2 border-cyan-500 bg-[#02040a] flex items-center justify-center text-3xl font-black text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] relative group overflow-hidden shrink-0">
                                           {user?.avatar_url ? (
                                                <img src={user.avatar_url} className="w-full h-full object-cover" />
                                            ) : (
                                                getInitials(formData.full_name || user?.full_name)
                                            )}
                                        </div>

                                        {!isEditing ? (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="px-4 py-2 sm:px-5 sm:py-2.5 bg-cyan-900/30 hover:bg-cyan-900/50 border border-cyan-500/50 text-cyan-400 font-black text-[10px] sm:text-xs rounded-lg transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] flex items-center gap-2 uppercase tracking-widest font-mono"
                                            >
                                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                                <span className="hidden sm:inline">MOD_PARAMS</span>
                                            </button>
                                        ) : (
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <button
                                                    onClick={() => {
                                                        setIsEditing(false);
                                                        initializeFormData();
                                                    }}
                                                    className="px-3 py-2 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-black font-mono tracking-widest uppercase text-slate-500 hover:text-white transition-colors border border-transparent hover:border-slate-700 hover:bg-[#02040a] rounded-lg"
                                                >
                                                    ABORT
                                                </button>
                                                <button
                                                    onClick={handleSaveProfile}
                                                    disabled={saving}
                                                    className="px-4 py-2 sm:px-5 sm:py-2 bg-emerald-900/30 hover:bg-emerald-900/50 border border-emerald-500/50 text-emerald-400 font-black text-[10px] sm:text-xs rounded-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] disabled:opacity-50 flex items-center gap-2 uppercase tracking-widest font-mono"
                                                >
                                                    {saving ? (
                                                        <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                                    )}
                                                    {saving ? 'SYNCING..' : 'COMMIT'}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Read-Only Title Header if Not Editing */}
                                    {!isEditing && (
                                        <div className="mb-4 shrink-0">
                                            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-widest font-mono uppercase text-shadow-glow-cyan leading-none mb-2">
                                                {formData.full_name || user?.full_name || 'SYS.UNKNOWN_ENTITY'}
                                            </h2>
                                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-black font-mono tracking-widest uppercase text-slate-500">
                                                <span className={`px-2 py-0.5 rounded border ${
                                                    user?.role === 'employer' ? 'bg-purple-900/30 text-purple-400 border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.2)]' : 'bg-blue-900/30 text-blue-400 border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                                                }`}>
                                                    [{user?.role === 'employer' ? 'CLIENT_NODE' : 'OPERATOR_NODE'}]
                                                </span>
                                                <span className="text-slate-700">•</span>
                                                <span className="text-slate-400 flex items-center gap-1.5">
                                                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                    LOC: {formData.location || 'NULL'}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Main Fields Form - Uses overflow-y-auto to prevent nested scrolling when small, but works well with h-screen */}
                                    <div className="flex-1 w-full overflow-y-auto custom-scrollbar pr-2 mt-2 pb-2">
                                        
                                        {/* Row 1 */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                                            {isEditing && (
                                                <div>
                                                    <label className="block text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-1.5 font-mono">SYS.ID_NAME</label>
                                                    <input
                                                        type="text"
                                                        name="full_name"
                                                        value={formData.full_name}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-[#02040a] border border-cyan-500/30 rounded focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 text-white font-black font-mono uppercase transition-all outline-none text-sm placeholder-slate-700"
                                                    />
                                                </div>
                                            )}

                                            <div>
                                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 font-mono flex items-center gap-2">COMM_LINK</label>
                                                <div className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-[#02040a] border border-slate-800 rounded text-slate-400 font-mono text-xs sm:text-sm font-bold flex items-center gap-3">
                                                    <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                    {user?.email}
                                                </div>
                                            </div>

                                            {isEditing && (
                                                <div>
                                                    <label className="block text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-1.5 font-mono">SYS.GEO_LOC</label>
                                                    <input
                                                        type="text"
                                                        name="location"
                                                        value={formData.location}
                                                        onChange={handleInputChange}
                                                        placeholder="CITY, REGION"
                                                        className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-[#02040a] border border-cyan-500/30 rounded focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 text-white font-black font-mono uppercase transition-all outline-none text-sm placeholder-slate-700"
                                                    />
                                                </div>
                                            )}

                                            <div className={`${isEditing ? '' : 'md:col-span-2'}`}>
                                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 font-mono">OP_STATUS</label>
                                                {isEditing ? (
                                                    <select
                                                        name="availability"
                                                        value={formData.availability}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-[#02040a] border border-cyan-500/30 rounded focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 text-white font-black font-mono uppercase transition-all outline-none text-[10px] sm:text-[11px] appearance-none"
                                                    >
                                                        <option value="available" className="bg-[#090e17]">[OK] ONLINE</option>
                                                        <option value="busy" className="bg-[#090e17]">[WARN] BUSY</option>
                                                        <option value="unavailable" className="bg-[#090e17]">[ERR] OFFLINE</option>
                                                    </select>
                                                ) : (
                                                    <div className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-[#02040a] border border-slate-800 rounded font-black font-mono text-[10px] sm:text-[11px] uppercase tracking-widest flex items-center gap-3">
                                                        <span className={`w-2 h-2 rounded-full ${
                                                            formData.availability === 'available' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 
                                                            formData.availability === 'busy' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]'
                                                        }`}></span>
                                                        <span className={{
                                                            'available': 'text-emerald-400',
                                                            'busy': 'text-amber-400',
                                                            'unavailable': 'text-rose-400'
                                                        }[formData.availability] || 'text-slate-500'}>
                                                            {formData.availability === 'available' ? 'NETWORK_DETECTABLE' : formData.availability === 'busy' ? 'LIMITED_BANDWIDTH' : 'STEALTH_MODE'}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                            {/* Bio Text Area */}
                                            <div className="flex flex-col h-full min-h-[120px]">
                                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 font-mono flex items-center gap-2">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
                                                    BIO_DATA_STREAM
                                                </label>
                                                {isEditing ? (
                                                    <textarea
                                                        name="bio"
                                                        value={formData.bio}
                                                        onChange={handleInputChange}
                                                        className="w-full flex-1 min-h-[100px] px-3 py-2 sm:px-4 sm:py-3 bg-[#02040a] border border-cyan-500/30 rounded focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 text-slate-300 font-mono text-xs transition-all outline-none leading-relaxed placeholder-slate-700 resize-none"
                                                        placeholder="> INITIALIZE_LOG_ENTRY..."
                                                    />
                                                ) : (
                                                    <div className="w-full flex-1 px-3 py-3 sm:px-4 sm:py-4 bg-[#02040a] border border-slate-800 rounded text-slate-400 text-xs font-mono leading-relaxed overflow-y-auto custom-scrollbar">
                                                        {formData.bio ? `> ${formData.bio.split('\n').join('\n> ')}` : <span className="text-slate-600">&gt; NULL_STREAM. NO_DATA_DETECTED.</span>}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Skills Section */}
                                            <div className="flex flex-col h-full min-h-[120px]">
                                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 font-mono flex items-center gap-2">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                                    LOADED_PROTOCOLS
                                                </label>
                                                <div className={`flex-1 w-full ${isEditing ? '' : 'p-3 sm:p-4 bg-[#02040a] border border-slate-800 rounded overflow-y-auto custom-scrollbar'}`}>
                                                    {isEditing ? (
                                                        <div className="skill-selector-cyberpunk h-full">
                                                            <SkillSelector 
                                                                selectedSkills={formData.skills || []} 
                                                                onChange={(newSkills) => setFormData(prev => ({ ...prev, skills: newSkills }))}
                                                                placeholder="> INJECT_MODULE..." 
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-wrap gap-2">
                                                            {formData.skills?.length > 0 ? (
                                                                formData.skills.map((skill, index) => (
                                                                    <span
                                                                        key={index}
                                                                        className="inline-flex items-center rounded border border-cyan-500/30 bg-cyan-900/20 px-2 py-0.5 text-[10px] sm:text-[11px] font-black font-mono text-cyan-400 tracking-widest uppercase shadow-[0_0_10px_rgba(6,182,212,0.1)] gap-1"
                                                                    >
                                                                        <span className="text-cyan-500/50">#</span>
                                                                        {typeof skill === 'string' ? skill : skill.name || skill.id}
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <span className="text-slate-600 text-[10px] font-mono tracking-widest uppercase">&gt; NO_PROTOCOLS_FOUND</span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Wallet Widget */}
                        <div className="w-full xl:w-80 shrink-0 flex flex-col h-full max-h-[400px] xl:max-h-full">
                            <div className="space-y-6 flex-1 flex flex-col">
                                
                                <div className="bg-[#090e17] rounded-2xl border border-slate-800 shadow-[0_0_20px_rgba(34,211,238,0.05)] overflow-hidden flex-1 flex flex-col">
                                    <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/30 flex items-center justify-between shrink-0">
                                        <h2 className="text-[11px] font-black text-cyan-500 uppercase tracking-widest font-mono flex items-center gap-2">
                                            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                                            RESERVE_STATUS
                                        </h2>
                                    </div>
                                    
                                    <div className="p-4 flex-1 flex flex-col">
                                        {/* Digital Card Graphic */}
                                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#02040a] via-[#090e17] to-cyan-950/30 p-5 sm:p-6 text-white shadow-xl hover:-translate-y-1 transition-transform border border-cyan-500/20 group flex-1 flex flex-col justify-between">
                                            {/* Decorative Elements */}
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-[40px] -mr-10 -mt-10 group-hover:bg-cyan-400/20 transition-colors"></div>
                                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-[30px] -ml-10 -mb-10"></div>
                                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-10 pointer-events-none"></div>

                                            <div className="relative z-10">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div>
                                                        <div className="text-[9px] uppercase tracking-widest text-slate-500 font-black font-mono mb-1">LIQUIDITY_POOL</div>
                                                        <div className="text-cyan-400 font-bold font-mono text-[10px] tracking-wider">NETWORK_CREDITS</div>
                                                    </div>
                                                    <svg className="w-6 h-6 sm:w-8 sm:h-8 opacity-40 text-cyan-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.64-2.25 1.64-1.74 0-2.1-.96-2.18-1.66H8.01c.09 1.7 1.36 2.66 2.89 3v1.7h2.5v-1.69c1.69-.36 2.86-1.54 2.86-3.11 0-1.89-1.38-2.61-3.64-3.14z"/></svg>
                                                </div>

                                                <div className="text-3xl sm:text-4xl font-black font-mono tracking-tighter mb-6 mt-4">
                                                    {walletData.balance.toLocaleString('vi-VN')}
                                                </div>

                                                <div className="flex items-end justify-between border-t border-slate-700/50 pt-4 mt-2">
                                                    <div>
                                                        <div className="text-[8px] sm:text-[9px] uppercase tracking-widest text-slate-500 font-black font-mono mb-1">NODE_ID</div>
                                                        <div className="text-[11px] sm:text-[13px] font-mono font-bold tracking-widest text-slate-300">
                                                            {walletData.walletId}
                                                        </div>
                                                    </div>
                                                    <div className="text-cyan-500/40 font-black font-mono text-[10px] tracking-widest uppercase">SYS_ACTV</div>
                                                </div>
                                            </div>
                                        </div>

                                        <button className="w-full mt-4 py-3 sm:py-4 bg-[#02040a] hover:bg-slate-800 text-cyan-400 font-black font-mono rounded border border-cyan-500/30 transition-colors text-[10px] sm:text-[11px] tracking-widest uppercase flex items-center justify-center gap-2 shrink-0">
                                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                            INJECT_LIQUIDITY
                                        </button>
                                    </div>
                                </div>
                                
                            </div>
                        </div>

                    </div>
                </main>
            </div>
            
            {/* Custom scrollbar styles specific to this layout */}
            <style jsx="true">{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                    height: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(6, 182, 212, 0.2);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(6, 182, 212, 0.5);
                }
                @keyframes scan {
                    0% { transform: translateY(0); opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { transform: translateY(8rem); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default ProfilesPage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../auth/AuthContext';
import { userApi } from '../../api/user.api';
import SkillSelector from '../../components/SkillSelector';
import { useTranslation } from 'react-i18next';

const ProfilesPage = () => {
    const { t } = useTranslation();
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
            walletId: `FAF-AUTH-${String(user.id || '').slice(0, 6).toUpperCase()}`,
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
            toast.success(t('profiles.sync_complete', 'COMMAND: Profile synchronization successful.'));
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.message || t('profiles.sync_failed', 'ERR: Logic signal lost. Retry sync.'));
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
            <div className="flex h-screen bg-transparent">
                <div className="flex-1 flex flex-col items-center justify-center font-mono text-cyan-500">
                    <div className="flex items-center gap-3 animate-pulse">
                        <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded flex animate-spin"></div>
                        RETRIEVING_PROFILE_STREAM...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-full text-slate-300 flex overflow-hidden font-sans relative">
            <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10 w-full">
                {/* Header */}
                <header className="bg-transparent/80 backdrop-blur-md px-8 py-5 flex items-center justify-between z-20 border-b border-white/5 shrink-0">
                    <div>
                        <h1 className="text-xl font-black text-white tracking-widest uppercase font-mono shadow-[0_0_10px_rgba(6,182,212,0.3)]">{t('profiles.header_title', 'COMMAND_PROFILE_CONFIG')}</h1>
                        <p className="text-[10px] text-cyan-500/70 font-mono tracking-widest uppercase mt-0.5">{t('profiles.header_subtitle', 'MANAGE_IDENTITY_AND_REVENUE_CHANNELS')}</p>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto px-4 py-8 lg:px-8 w-full custom-scrollbar">
                    <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-10 h-full">
                        
                        {/* LEFT COLUMN: Profile Form */}
                        <div className="flex-1 space-y-8 flex flex-col">
                            
                            <div className="bg-[#090e17]/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden relative flex-1 flex flex-col">
                                
                                {/* Banner */}
                                <div className="h-32 sm:h-44 bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#020617] relative overflow-hidden shrink-0 border-b border-white/5">
                                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20"></div>
                                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.8)] animate-[scan_4s_linear_infinite]"></div>
                                </div>

                                {/* Body Content */}
                                <div className="px-8 pb-8 relative -mt-12 sm:-mt-16 flex-1 flex flex-col w-full">
                                    <div className="flex flex-col items-center mb-8 shrink-0 w-full relative">
                                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border border-cyan-500/30 bg-transparent flex items-center justify-center text-4xl font-black text-white shadow-[0_0_50px_rgba(6,182,212,0.15)] relative group/avt overflow-visible shrink-0">
                                               {/* Tech Bracket Corners */}
                                               <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-500 rounded-tl-sm transition-all group-hover/avt:-top-2 group-hover/avt:-left-2 group-hover/avt:w-6 group-hover/avt:h-6"></div>
                                               <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyan-500 rounded-tr-sm transition-all group-hover/avt:-top-2 group-hover/avt:-right-2 group-hover/avt:w-6 group-hover/avt:h-6"></div>
                                               <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cyan-500 rounded-bl-sm transition-all group-hover/avt:-bottom-2 group-hover/avt:-left-2 group-hover/avt:w-6 group-hover/avt:h-6"></div>
                                               <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-500 rounded-br-sm transition-all group-hover/avt:-bottom-2 group-hover/avt:-right-2 group-hover/avt:w-6 group-hover/avt:h-6"></div>

                                               <div className="w-full h-full rounded-2xl overflow-hidden relative border border-white/5 bg-[#090e17]">
                                                    {user?.avatar_url ? (
                                                        <img src={user.avatar_url} className="w-full h-full object-cover group-hover/avt:scale-110 transition-transform duration-700" alt="Profile" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-950 via-[#020617] to-blue-950">
                                                            <span className="bg-gradient-to-br from-cyan-400 to-blue-500 bg-clip-text text-transparent group-hover/avt:scale-110 transition-transform duration-500">
                                                                {getInitials(formData.full_name || user?.full_name)}
                                                            </span>
                                                        </div>
                                                    )}
                                               </div>
                                               
                                               {/* Scanning Effect on Hover */}
                                               <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/20 to-transparent h-0.5 top-0 left-0 right-0 opacity-0 group-hover/avt:animate-[scan_2s_linear_infinite] group-hover/avt:opacity-100 pointer-events-none"></div>
                                        </div>

                                        <div className="absolute top-20 sm:top-24 right-0">
                                            {!isEditing ? (
                                                <button
                                                    onClick={() => setIsEditing(true)}
                                                    className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-[#020617] font-black text-[11px] rounded-lg transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center gap-2 uppercase tracking-widest font-mono"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                    {t('profiles.edit_button', 'MODIFY_PARAMS')}
                                                </button>
                                            ) : (
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => {
                                                            setIsEditing(false);
                                                            initializeFormData();
                                                        }}
                                                        className="px-4 py-2 text-[10px] font-black font-mono tracking-widest uppercase text-slate-500 hover:text-white transition-colors border border-white/10 hover:bg-white/5 rounded-lg"
                                                    >
                                                        {t('profiles.cancel_button', 'ABORT')}
                                                    </button>
                                                    <button
                                                        onClick={handleSaveProfile}
                                                        disabled={saving}
                                                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-[#020617] font-black text-[11px] rounded-lg transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 flex items-center gap-2 uppercase tracking-widest font-mono"
                                                    >
                                                        {saving ? (
                                                            <div className="w-3.5 h-3.5 border-2 border-[#020617] border-t-transparent rounded-full animate-spin"></div>
                                                        ) : (
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                                        )}
                                                        {saving ? t('profiles.saving', 'SYNCING..') : t('profiles.save_button', 'COMMIT_CHANGES')}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {!isEditing && (
                                        <div className="mb-6 shrink-0 flex flex-col items-center text-center">
                                            <h2 className="text-3xl font-black text-white tracking-widest font-mono uppercase leading-none mb-3">
                                                {formData.full_name || user?.full_name || 'NULL_OPERATOR'}
                                            </h2>
                                            <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] font-black font-mono tracking-widest uppercase">
                                                <span className="px-2 py-0.5 rounded border bg-cyan-900/30 text-cyan-400 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                                                    [EMPLOYER_MASTER]
                                                </span>
                                                <span className="text-white/20">•</span>
                                                <span className="text-slate-400 flex items-center gap-1.5">
                                                    <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                    LOC: {formData.location || 'GLOBAL_NODE'}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex-1 w-full overflow-y-auto custom-scrollbar pr-2 mt-4 space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {isEditing && (
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-black text-cyan-500 uppercase tracking-widest font-mono">{t('profiles.full_name_label', 'ID_FULLNAME')}</label>
                                                    <input
                                                        type="text"
                                                        name="full_name"
                                                        value={formData.full_name}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 text-white font-black font-mono uppercase tracking-widest transition-all outline-none text-sm"
                                                        placeholder="ENTER_NAME..."
                                                    />
                                                </div>
                                            )}

                                            <div className="space-y-2">
                                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">{t('profiles.email_label', 'SECURE_CHANNEL')}</label>
                                                <div className="w-full px-4 py-3 bg-black/20 border border-white/5 rounded-lg text-slate-400 font-mono text-xs font-bold flex items-center gap-3">
                                                    <svg className="w-4 h-4 text-cyan-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                    {user?.email}
                                                </div>
                                            </div>

                                            {isEditing && (
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-black text-cyan-500 uppercase tracking-widest font-mono">{t('profiles.location_label', 'GEO_POSITION')}</label>
                                                    <input
                                                        type="text"
                                                        name="location"
                                                        value={formData.location}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 text-white font-black font-mono uppercase tracking-widest transition-all outline-none text-sm"
                                                        placeholder="CITY, COUNTRY..."
                                                    />
                                                </div>
                                            )}

                                            <div className={`${isEditing ? 'space-y-2' : 'md:col-span-2 space-y-2'}`}>
                                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">{t('profiles.availability_label', 'OPERATIONAL_STATUS')}</label>
                                                {isEditing ? (
                                                    <select
                                                        name="availability"
                                                        value={formData.availability}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 text-white font-black font-mono uppercase tracking-widest transition-all outline-none text-xs appearance-none"
                                                    >
                                                        <option value="available" className="bg-[#090e17]">[ONLINE] DETECTABLE</option>
                                                        <option value="busy" className="bg-[#090e17]">[BUSY] BUSY_IDLE</option>
                                                        <option value="unavailable" className="bg-[#090e17]">[OFFLINE] STEALTH</option>
                                                    </select>
                                                ) : (
                                                    <div className="w-full px-4 py-3 bg-black/20 border border-white/5 rounded-lg font-black font-mono text-[10px] uppercase tracking-[0.2em] flex items-center gap-3">
                                                        <span className={`w-2 h-2 rounded-full ${
                                                            formData.availability === 'available' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 
                                                            formData.availability === 'busy' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]'
                                                        }`}></span>
                                                        <span className={formData.availability === 'available' ? 'text-emerald-400' : formData.availability === 'busy' ? 'text-amber-400' : 'text-rose-400'}>
                                                            {formData.availability === 'available' ? 'SYSTEM_ONLINE' : formData.availability === 'busy' ? 'PRIORITY_TASKING' : 'OFFLINE_MODE'}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="flex flex-col space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
                                                    {t('profiles.bio_label', 'BIOGRAPHICAL_LOG')}
                                                </label>
                                                {isEditing ? (
                                                    <textarea
                                                        name="bio"
                                                        value={formData.bio}
                                                        onChange={handleInputChange}
                                                        className="w-full h-40 px-4 py-4 bg-black/40 border border-white/10 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 text-slate-300 font-mono text-xs transition-all outline-none leading-relaxed placeholder-slate-700 resize-none"
                                                        placeholder="INITIALIZE_BIO_STREAM..."
                                                    />
                                                ) : (
                                                    <div className="w-full h-40 px-5 py-5 bg-black/20 border border-white/5 rounded-lg text-slate-400 text-xs font-mono leading-relaxed overflow-y-auto custom-scrollbar italic">
                                                        {formData.bio ? `> ${formData.bio}` : '> NO_LOG_DATA_DETECTED.'}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-col space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                                    {t('profiles.skills_label', 'ACTIVE_MODULES')}
                                                </label>
                                                <div className={`flex-1 w-full ${isEditing ? '' : 'p-5 bg-black/20 border border-white/5 rounded-lg overflow-y-auto custom-scrollbar'}`}>
                                                    {isEditing ? (
                                                        <div className="h-full">
                                                            <SkillSelector 
                                                                selectedSkills={formData.skills || []} 
                                                                onChange={(newSkills) => setFormData(prev => ({ ...prev, skills: newSkills }))}
                                                                theme="blue"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-wrap gap-2">
                                                            {formData.skills?.length > 0 ? (
                                                                formData.skills.map((skill, index) => (
                                                                    <span
                                                                        key={index}
                                                                        className="px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-[9px] font-black font-mono text-cyan-400 tracking-widest uppercase shadow-[0_0_10px_rgba(6,182,212,0.1)]"
                                                                    >
                                                                        {typeof skill === 'string' ? skill : skill.name || skill.id}
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <span className="text-slate-600 font-mono text-[9px] uppercase tracking-widest italic">{t('profiles.no_skills', 'N/A: MODULES_NOT_LOADED')}</span>
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
                        <div className="w-full xl:w-96 shrink-0 space-y-8">
                            <div className="bg-[#090e17] rounded-2xl border border-white/5 shadow-2xl overflow-hidden flex flex-col">
                                <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                                    <h2 className="text-[10px] font-black text-cyan-500 uppercase tracking-widest font-mono flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        {t('profiles.wallet_status', 'SECURE_VAULT')}
                                    </h2>
                                </div>
                                
                                <div className="p-6 space-y-6">
                                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#020617] p-8 text-white border border-cyan-500/20 group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-cyan-500/20 transition-all duration-700"></div>
                                        
                                        <div className="relative z-10 space-y-8">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1">
                                                    <p className="text-[8px] uppercase tracking-[0.3em] text-cyan-400 font-black font-mono">{t('profiles.available_balance', 'AVAILABLE_LIQUIDITY')}</p>
                                                    <p className="text-[10px] font-mono text-slate-500 font-bold tracking-widest">{t('profiles.fpoints', 'FAF_NETWORK_CREDITS')}</p>
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-lg">
                                                    <svg className="w-6 h-6 text-cyan-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.45 12.1c-1.31-.35-2.29-.63-2.29-1.29 0-.75.71-1.1 1.92-1.1s1.74.48 1.97 1.15h1.6c-.24-1.52-1.47-2.48-3.1-2.78V8.5h-2v1.5c-1.5.3-2.67 1.25-2.67 2.7 0 2.4 2.1 3.2 3.8 3.6s2.5.6 2.5 1.3c0 .85-.9 1.2-2.2 1.2-1.4 0-2.1-.51-2.4-1.3h-1.6c.24 1.52 1.5 2.58 3.1 2.9V21.5h2v-1.5c1.7-.3 2.9-1.24 2.9-2.8 0-2.05-1.4-2.8-3.7-3.1z"/></svg>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <div className="text-4xl font-black font-mono tracking-tighter text-white">
                                                    {walletData.balance.toLocaleString('vi-VN')}
                                                </div>
                                                <div className="text-[9px] font-mono text-emerald-400 font-black tracking-widest uppercase flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                                    {t('profiles.wallet_verified', 'VAULT_VERIFIED')}
                                                </div>
                                            </div>

                                            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <p className="text-[8px] uppercase tracking-widest text-slate-500 font-black font-mono">{t('profiles.node_address', 'NODE_IDENTIFIER')}</p>
                                                    <p className="text-[11px] font-mono font-bold tracking-widest text-slate-300">
                                                        {walletData.walletId}
                                                    </p>
                                                </div>
                                                <p className="text-[8px] font-black font-mono text-cyan-900 tracking-widest">FAF_V2</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-cyan-500/20 transition-all group">
                                            <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform mb-3">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                            </div>
                                            <span className="text-[9px] font-black font-mono text-slate-400 tracking-widest uppercase">{t('profiles.deposit', 'RELOAD')}</span>
                                        </button>
                                        <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-blue-500/20 transition-all group">
                                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform mb-3">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                            </div>
                                            <span className="text-[9px] font-black font-mono text-slate-400 tracking-widest uppercase">{t('profiles.withdraw', 'EXTRACT')}</span>
                                        </button>
                                    </div>
                                    
                                    <div className="p-4 rounded-xl border border-cyan-500/10 bg-cyan-500/5 cursor-default">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-pulse"></div>
                                            <p className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">{t('profiles.security_status', 'SECURE_CHANNEL_ACTIVE')}</p>
                                        </div>
                                        <p className="text-[9px] font-mono text-slate-600 leading-relaxed uppercase tracking-tighter">
                                            {t('profiles.security_notice', 'SSL: 2048-BIT ENCRYPTION ACTIVE. NODE IS SHIELDED BY FAF FIREWALL PROTOCOLS.')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>

            <style jsx="true">{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(6, 182, 212, 0.2);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(6, 182, 212, 0.4);
                }
                @keyframes scan {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(400%); }
                }
            `}</style>
        </div>
    );
};

export default ProfilesPage;

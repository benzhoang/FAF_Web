import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { userApi } from '../../api/user.api';
import axiosClient from '../../api/axiosClient';
import { useTranslation } from 'react-i18next';

/* ── League of Legends–style Mastery Tier system ── */
const MASTERY_TIERS = [
    { name: 'IRON',        min: 0,   max: 50,   color: '#8b7355', bg: 'rgba(139,115,85,0.15)',  border: 'rgba(139,115,85,0.35)',  icon: '🔩' },
    { name: 'BRONZE',      min: 51,  max: 150,  color: '#cd7f32', bg: 'rgba(205,127,50,0.15)',  border: 'rgba(205,127,50,0.35)',  icon: '🥉' },
    { name: 'SILVER',      min: 151, max: 300,  color: '#c0c0c0', bg: 'rgba(192,192,192,0.12)', border: 'rgba(192,192,192,0.3)',  icon: '🥈' },
    { name: 'GOLD',        min: 301, max: 499,  color: '#ffd700', bg: 'rgba(255,215,0,0.12)',   border: 'rgba(255,215,0,0.3)',    icon: '🥇' },
    { name: 'PLATINUM',    min: 500, max: 649,  color: '#00e5cc', bg: 'rgba(0,229,204,0.12)',   border: 'rgba(0,229,204,0.3)',    icon: '💎' },
    { name: 'DIAMOND',     min: 650, max: 799,  color: '#6cf',    bg: 'rgba(102,204,255,0.12)', border: 'rgba(102,204,255,0.3)',  icon: '💠' },
    { name: 'MASTER',      min: 800, max: 949,  color: '#b44be1', bg: 'rgba(180,75,225,0.15)',  border: 'rgba(180,75,225,0.35)',  icon: '⚔️' },
    { name: 'GRANDMASTER', min: 950, max: 999,  color: '#ff4444', bg: 'rgba(255,68,68,0.15)',   border: 'rgba(255,68,68,0.35)',   icon: '🏆' },
    { name: 'CHALLENGER',  min: 1000,max: 1000, color: '#00fff7', bg: 'rgba(0,255,247,0.15)',   border: 'rgba(0,255,247,0.4)',    icon: '👑' },
];

const getMasteryTier = (pts) => {
    const p = Math.min(1000, Math.max(0, pts || 0));
    return MASTERY_TIERS.find(t => p >= t.min && p <= t.max) || MASTERY_TIERS[0];
};

const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

const Stat = ({ value, label, isEditing, name, onChange, type = "text" }) => (
    <div className="flex-1 rounded-xl bg-[#090e17] border border-slate-800 p-4 text-center flex flex-col items-center justify-center h-full transition-all hover:border-cyan-500/30 group">
        {isEditing && onChange ? (
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full text-center text-xl font-black font-mono text-white border-b border-slate-700 focus:border-cyan-500 focus:outline-none bg-transparent transition-colors mb-2"
                placeholder="0"
            />
        ) : (
            <div className="text-xl font-black text-cyan-400 font-mono tracking-tighter mb-2 group-hover:text-cyan-300 transition-colors">{value}</div>
        )}
        <div className="text-[9px] font-black tracking-widest text-slate-500 uppercase font-mono">
            {label}
        </div>
    </div>
);

const Card = ({ title, children, right, glowColor = 'cyan' }) => {
    const glowClasses = {
        cyan: 'shadow-[0_0_15px_rgba(6,182,212,0.1)] border-cyan-500/20',
        emerald: 'shadow-[0_0_15px_rgba(16,185,129,0.1)] border-emerald-500/20',
        indigo: 'shadow-[0_0_15px_rgba(99,102,241,0.1)] border-indigo-500/20'
    };

    return (
        <section className={`bg-[#090e17]/80 backdrop-blur-md rounded-2xl border ${glowClasses[glowColor]} flex flex-col overflow-hidden relative`}>
            {/* Cyber Accent */}
            <div className={`absolute top-0 right-10 w-32 h-px bg-${glowColor}-400/50`} />
            
            {title ? (
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0 bg-slate-900/30">
                    <h2 className={`text-[11px] font-black tracking-widest text-${glowColor}-500 uppercase font-mono flex items-center gap-2`}>
                        <svg className={`w-3.5 h-3.5 text-${glowColor}-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        {title}
                    </h2>
                    {right}
                </div>
            ) : null}
            <div className="px-6 py-5 flex-1">{children}</div>
        </section>
    );
};

const Settings = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { user, fetchMe } = useAuth();
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        full_name: '',
        location: '',
        bio: '',
        skills: [],
        hourly_rate: '',
        availability: 'available',
        avatar_url: '',
        title: t('settings.senior_developer'), 
        title: t('settings.senior_developer'), 
        education: [],
        experience: [],
        portfolio_items: [],
        languages: t('settings.languages_default') 
    });

    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    useEffect(() => {
        fetchMe();
    }, []);

    useEffect(() => {
        if (user) {
            initializeFormData();
        }
    }, [user]);

    const initializeFormData = () => {
        setFormData({
            full_name: user.full_name || '',
            location: user.location || '',
            bio: user.bio || '',
            skills: Array.isArray(user.skills) ? user.skills : [],
            hourly_rate: user.hourly_rate || '',
            availability: user.availability || 'available',
            avatar_url: user.avatar_url || '',
            title: user.title || t('settings.senior_developer'), 
            education: Array.isArray(user.education) ? user.education : [],
            experience: Array.isArray(user.experience) ? user.experience : [],
            portfolio_items: Array.isArray(user.portfolio) ? user.portfolio : (Array.isArray(user.portfolio_items) ? user.portfolio_items : []),
            languages: user.languages || t('settings.languages_default')
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleArrayAdd = (field, emptyObj) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], emptyObj]
        }));
    };

    const handleArrayChange = (field, index, key, value) => {
        setFormData(prev => {
            const newArr = [...prev[field]];
            newArr[index] = { ...newArr[index], [key]: value };
            return { ...prev, [field]: newArr };
        });
    };
    const handleArrayRemove = (field, index) => {
        setFormData(prev => {
            const newArr = prev[field].filter((_, i) => i !== index);
            return { ...prev, [field]: newArr };
        });
    };

    const handleItemImageUpload = async (field, index, key, e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            toast.error('Vui lòng chọn file hình ảnh (JPG, PNG).');
            return;
        }

        try {
            const toastId = toast.loading('Đang tải ảnh lên Cloud...');
            const data = new FormData();
            data.append('file', file);
            
            const res = await axiosClient.post('/uploads/submission', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res && res.url) {
                handleArrayChange(field, index, key, res.url);
                toast.success('Tải ảnh thành công!', { id: toastId });
            } else {
                toast.error('Lỗi phản hồi từ server.', { id: toastId });
            }
        } catch (error) {
            console.error("Item upload error:", error);
            toast.dismiss();
            toast.error('Tải ảnh thất bại.');
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await userApi.updateProfile({
                full_name: formData.full_name,
                location: formData.location,
                bio: formData.bio,
                skills: formData.skills,
                hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
                availability: formData.availability,
                avatar_url: formData.avatar_url,
                education: formData.education,
                experience: formData.experience,
                portfolio: formData.portfolio_items
            });
            await fetchMe();
            setIsEditing(false);
            toast.success(t('settings.success_update'));
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.message || t('settings.error_update'));
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith('image/')) {
            toast.error('Vui lòng chọn file hình ảnh hợp lệ (JPG, PNG).');
            return;
        }

        try {
            setUploadingAvatar(true);
            const data = new FormData();
            data.append('file', file);
            
            // Re-using the submission upload endpoint which routes to Cloudinary
            const res = await axiosClient.post('/uploads/submission', data, {
                // headers are handled by axiosClient interceptor automatically
            });

            if (res && res.url) {
                setFormData(prev => ({ ...prev, avatar_url: res.url }));
                toast.success('Tải ảnh đại diện thành công. Vui lòng LƯU THAY ĐỔI.');
            } else {
                toast.error('Tải ảnh thất bại: Không nhận được URL.');
            }
        } catch (error) {
            console.error("Avatar upload error:", error);
            toast.error('Lỗi khi tải ảnh lên.');
        } finally {
            setUploadingAvatar(false);
        }
    };

    const displayName = formData.full_name || user?.email || t('settings.anonymous_user');
    const memberSince = user?.created_at ? new Date(user.created_at).toLocaleDateString() : t('settings.unknown');

    return (
        <div className="w-full flex-grow bg-transparent text-slate-300 pb-12 relative font-sans">

            <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 relative z-10">
                <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-white uppercase tracking-widest font-mono text-shadow-glow-cyan">{t('settings.title')}</h1>
                        <p className="mt-1 text-[10px] text-cyan-500/70 font-mono tracking-widest uppercase">{t('settings.subtitle')}</p>
                    </div>
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="inline-flex items-center justify-center rounded-lg bg-cyan-900/30 border border-cyan-500/50 text-cyan-400 px-5 py-2 font-black text-[10px] hover:bg-cyan-900/50 hover:text-cyan-300 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.2)] font-mono uppercase tracking-widest gap-2"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            {t('settings.edit_info')}
                        </button>
                    ) : (
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    initializeFormData();
                                }}
                                className="inline-flex items-center justify-center rounded-lg bg-[#02040a] text-slate-400 border border-slate-700 px-5 py-2 font-black text-[10px] hover:text-white hover:bg-slate-800 transition-colors uppercase tracking-widest font-mono shrink-0"
                                disabled={saving}
                            >
                                {t('settings.cancel')}
                            </button>
                            <button
                                onClick={handleSave}
                                className="inline-flex items-center justify-center rounded-lg bg-emerald-900/30 border border-emerald-500/50 text-emerald-400 px-5 py-2 font-black text-[10px] hover:bg-emerald-900/50 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)] uppercase tracking-widest font-mono disabled:opacity-50 shrink-0 gap-2"
                                disabled={saving}
                            >
                                {saving ? t('settings.saving') : t('settings.save_changes')}
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left column */}
                    <div className="lg:col-span-2 space-y-6">
                        <section className="bg-[#090e17]/90 backdrop-blur-md rounded-2xl border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)] overflow-hidden relative">
                            {/* Dynamic Cover Banner */}
                            <div className="h-32 bg-gradient-to-r from-cyan-900 via-blue-900 to-indigo-900 relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20"></div>
                                {/* Scanning line effect */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-400/50 shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-[scan_3s_ease-in-out_infinite]"></div>
                            </div>
                            
                            <div className="px-8 pb-8 relative -mt-16">
                                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6 relative">
                                    <div className="relative shrink-0 group">
                                        <div className="h-28 w-28 rounded border-2 border-cyan-500 bg-[#02040a] flex items-center justify-center font-black font-mono text-3xl text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] overflow-hidden relative z-10 transition-all">
                                            {formData.avatar_url ? (
                                                <img src={formData.avatar_url} alt="User Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                getInitials(displayName)
                                            )}
                                        </div>
                                        
                                        {/* Avatar Edit Overlay */}
                                        {isEditing && (
                                            <div className="absolute inset-0 z-[15] hidden group-hover:flex items-center justify-center bg-black/60 rounded backdrop-blur-sm cursor-pointer border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all">
                                                <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full text-cyan-400 hover:text-cyan-300">
                                                    {uploadingAvatar ? (
                                                        <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        <>
                                                            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                            <span className="text-[9px] font-black tracking-widest uppercase font-mono">Upload</span>
                                                        </>
                                                    )}
                                                    <input type="file" className="hidden" accept="image/png, image/jpeg, image/jpg" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
                                                </label>
                                            </div>
                                        )}

                                        <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded bg-[#090e17] border border-slate-700 flex items-center justify-center z-20">
                                            <span className={`h-3 w-3 rounded-full ${
                                                formData.availability === 'available' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 
                                                formData.availability === 'busy' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]' : 
                                                'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]'
                                            }`} />
                                        </div>
                                    </div>
                                    <div className="flex-1 w-full mt-4 sm:mt-0 pt-2 sm:pt-0">
                                        {isEditing ? (
                                            <div className="flex flex-col gap-3">
                                                <input
                                                    type="text"
                                                    name="full_name"
                                                    value={formData.full_name}
                                                    onChange={handleInputChange}
                                                    placeholder={t('settings.full_name_placeholder')}
                                                    className="w-full text-xl font-black font-mono text-white border border-cyan-500/50 bg-[#02040a] rounded px-4 py-2 focus:ring-1 focus:ring-cyan-400 focus:outline-none transition-all placeholder-slate-700 uppercase"
                                                />
                                                <input
                                                    type="text"
                                                    name="location"
                                                    value={formData.location}
                                                    onChange={handleInputChange}
                                                    placeholder={t('settings.location_placeholder')}
                                                    className="w-full text-sm font-mono text-slate-300 border border-slate-700 bg-[#02040a] rounded px-4 py-2 focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 focus:outline-none transition-all uppercase placeholder-slate-700"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex flex-col ml-1 sm:ml-4">
                                                <div className="flex items-center gap-3">
                                                    <h1 className="text-2xl font-black font-mono text-white tracking-widest uppercase text-shadow-glow-cyan">{displayName}</h1>
                                                    {user?.tier && (
                                                        <span className={`text-[9px] font-black font-mono tracking-widest uppercase rounded px-2 py-1 border ${
                                                            user.tier === 'EXPERT' ? 'bg-purple-900/30 text-purple-400 border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.2)]' :
                                                            user.tier === 'PRO' ? 'bg-blue-900/30 text-blue-400 border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]' :
                                                            'bg-slate-800 text-slate-400 border-slate-600'
                                                        }`}>
                                                            {t('settings.tier')}{user.tier}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-widest font-mono text-slate-500">
                                                    {formData.location && (
                                                        <span className="flex items-center gap-1.5">
                                                            <svg className="w-3.5 h-3.5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            {t('settings.location')} <span className="text-slate-300">{formData.location}</span>
                                                        </span>
                                                    )}
                                                    <span className="flex items-center gap-1.5">
                                                        <svg className="w-3.5 h-3.5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3M4 11h16M5 7h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z" />
                                                        </svg>
                                                        {t('settings.joined')} <span className="text-slate-300">{memberSince}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="px-8 pb-8 pt-2">
                                <div className="rounded-xl bg-[#02040a] border border-slate-800/80 p-6 relative">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-900" />
                                    <div className="text-[10px] font-black font-mono tracking-widest text-cyan-500 uppercase mb-3 flex items-center gap-2">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
                                        {t('settings.bio_title')}
                                    </div>
                                    {isEditing ? (
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="w-full text-[12px] font-mono text-slate-300 border border-slate-700 bg-[#090e17] rounded p-4 focus:border-cyan-500/50 focus:outline-none transition-colors placeholder-slate-700"
                                            placeholder={t('settings.bio_placeholder')}
                                        />
                                    ) : (
                                        <p className="text-[12px] font-mono text-slate-400 leading-relaxed whitespace-pre-wrap">
                                            {formData.bio ? `> ${formData.bio.split('\n').join('\n> ')}` : t('settings.no_bio')}
                                        </p>
                                    )}
                                </div>

                                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <Stat value={user?.total_jobs_done || 0} label={t('settings.jobs_done')} />
                                    <Stat value={user?.rating_avg ? `${Number(user.rating_avg).toFixed(1).replace(/\.0$/, '')}★` : t('settings.no_rating')} label={t('settings.rating_score')} />
                                    <Stat 
                                        value={formData.hourly_rate} 
                                        label="PHÍ MỘT GIỜ" 
                                        isEditing={isEditing}
                                        name="hourly_rate"
                                        onChange={handleInputChange}
                                        type="number"
                                    />
                                    <Stat 
                                        value={user?.balance_points || 0} 
                                        label={t('settings.current_balance')} 
                                    />
                                </div>
                            </div>
                        </section>

                        <Card title={t('settings.skills_title')} glowColor="cyan">
                            <div className="space-y-4">
                                <div className="mb-2">
                                    <p className="text-[10px] uppercase font-mono tracking-widest text-cyan-500/70">
                                        * Kỹ năng được cập nhật tự động dựa trên đánh giá của khách hàng sau mỗi hợp đồng thành công.
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {user?.skill_mastery && user.skill_mastery.length > 0 ? (
                                        user.skill_mastery.map((masteryObj, i) => {
                                            const skillName = masteryObj.skill_name || masteryObj.name || (typeof masteryObj === 'string' ? masteryObj : 'Unknown Skill');
                                            const pts = masteryObj.skill_points || 1;
                                            const tier = getMasteryTier(pts);
                                            
                                            return (
                                                <span key={i} className="inline-flex items-center rounded border px-3 py-1.5 text-[10px] font-black font-mono tracking-widest uppercase gap-2" style={{
                                                    backgroundColor: tier.bg,
                                                    borderColor: tier.border,
                                                    color: '#f8fafc',
                                                    boxShadow: `0 0 10px ${tier.bg}`
                                                }}>
                                                    <span>{tier.icon}</span>
                                                    <span>{skillName}</span>
                                                    <span className="opacity-60 ml-1 text-[9px]" style={{ color: tier.color }}>{tier.name}</span>
                                                </span>
                                            );
                                        })
                                    ) : formData.skills.length > 0 ? (
                                        formData.skills.map((s, i) => (
                                            <span key={i} className="inline-flex items-center rounded border border-cyan-500/30 bg-cyan-900/20 px-2 py-1 text-[10px] font-black font-mono text-cyan-400 tracking-widest uppercase shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                                                {typeof s === 'string' ? s : s.name || s}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">{t('settings.no_skills')}</p>
                                    )}
                                </div>
                            </div>
                        </Card>

                        <Card title={t('settings.portfolio_title')} glowColor="indigo">
                             <div className="space-y-4">
                                {/* Editable Portfolio Items builder */}
                                {isEditing ? (
                                    <div className="space-y-4">
                                        {formData.portfolio_items.map((item, idx) => (
                                            <div key={idx} className="relative p-4 border border-slate-700 bg-slate-800/30 rounded flex flex-col gap-3">
                                                <button onClick={() => handleArrayRemove('portfolio_items', idx)} className="absolute top-2 right-2 text-rose-500 hover:text-rose-400">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
                                                <input
                                                    type="text" placeholder="Tên dự án" value={item.title || ''}
                                                    onChange={(e) => handleArrayChange('portfolio_items', idx, 'title', e.target.value)}
                                                    className="w-full text-sm font-black font-mono text-white bg-transparent border-b border-slate-700 focus:border-indigo-500 focus:outline-none placeholder-slate-600 pb-1"
                                                />
                                                <input
                                                    type="text" placeholder="Link (URL)" value={item.link || ''}
                                                    onChange={(e) => handleArrayChange('portfolio_items', idx, 'link', e.target.value)}
                                                    className="w-full text-xs font-mono text-indigo-400 bg-transparent border-b border-slate-700 focus:border-indigo-500 focus:outline-none placeholder-slate-600 pb-1"
                                                />
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text" placeholder="Link Ảnh (Tự động điền khi upload)" value={item.image_url || ''}
                                                        onChange={(e) => handleArrayChange('portfolio_items', idx, 'image_url', e.target.value)}
                                                        className="flex-1 text-xs font-mono text-slate-400 bg-transparent border-b border-slate-700 focus:border-indigo-500 focus:outline-none placeholder-slate-600 pb-1"
                                                    />
                                                    <label className="cursor-pointer bg-indigo-900/40 hover:bg-indigo-500/40 text-indigo-300 px-3 py-1 rounded border border-indigo-500/30 text-[10px] uppercase font-mono tracking-widest transition-colors flex items-center justify-center shrink-0">
                                                        <input 
                                                            type="file" 
                                                            accept="image/*" 
                                                            className="hidden" 
                                                            onChange={(e) => handleItemImageUpload('portfolio_items', idx, 'image_url', e)} 
                                                        />
                                                        Tải Ảnh Lên
                                                    </label>
                                                </div>
                                                <textarea
                                                    placeholder="Mô tả dự án" value={item.description || ''} rows={2}
                                                    onChange={(e) => handleArrayChange('portfolio_items', idx, 'description', e.target.value)}
                                                    className="w-full text-xs font-mono text-slate-300 bg-[#090e17] border border-slate-700 rounded p-2 focus:border-indigo-500 focus:outline-none placeholder-slate-600"
                                                />
                                            </div>
                                        ))}
                                        <button onClick={() => handleArrayAdd('portfolio_items', { title: '', link: '', image_url: '', description: '' })} className="w-full py-2 border border-dashed border-indigo-500/50 rounded text-indigo-400 font-mono text-xs uppercase hover:bg-indigo-500/10 transition-colors">
                                            + Thêm Dự án Portfolio
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {formData.portfolio_items && formData.portfolio_items.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {formData.portfolio_items.map((item, idx) => (
                                                    <a key={idx} href={item.link || '#'} target="_blank" rel="noopener noreferrer" className="group relative rounded border border-slate-700 overflow-hidden bg-[#02040a] aspect-video hover:border-indigo-500/50 transition-colors block">
                                                        {item.image_url ? (
                                                            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity mix-blend-luminosity group-hover:mix-blend-normal" />
                                                        ) : (
                                                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 font-mono text-[10px] uppercase tracking-widest gap-2">
                                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                                {t('settings.no_image')}
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent flex flex-col justify-end p-3">
                                                            <div className="font-black font-mono text-[10px] text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full inline-block shadow-[0_0_5px_rgba(99,102,241,1)]"></span>
                                                                {item.title}
                                                            </div>
                                                            {item.description && <p className="text-[9px] text-slate-400 font-mono truncate mt-1">{item.description}</p>}
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-10 border border-slate-800 bg-[#02040a] rounded flex flex-col items-center justify-center space-y-3">
                                                <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                                <p className="text-[10px] font-black font-mono text-slate-500 uppercase tracking-widest">{t('settings.empty_portfolio')}</p>
                                            </div>
                                        )}
                                    </>
                                )}
                             </div>
                        </Card>
                    </div>

                    {/* Right column */}
                    <div className="space-y-6">
                        <section className="bg-[#090e17]/80 backdrop-blur-md rounded-2xl shadow-[0_0_15px_rgba(16,185,129,0.1)] border border-emerald-500/20 overflow-hidden p-6 relative">
                            {/* Accent line at the top to make it look premium */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500"></div>
                            
                            <h3 className="text-[11px] font-black font-mono tracking-widest text-emerald-500 uppercase mb-4 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {t('settings.activity_status')}
                            </h3>
                            
                            {isEditing ? (
                                <select
                                    name="availability"
                                    value={formData.availability}
                                    onChange={handleInputChange}
                                    className="w-full text-xs font-black font-mono uppercase bg-[#02040a] border border-emerald-500/50 text-emerald-400 rounded px-4 py-3 focus:outline-none focus:border-emerald-400 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyMCAyMCI+PHBhdGggc3Ryb2tlPSIjMzRkMzE5IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMS41IiBkPSJNNiA4bDQgNCA0LTQiLz48L3N2Zz4=')] bg-[length:1.2em_1.2em] bg-[right_0.5rem_center] bg-no-repeat"
                                >
                                    <option value="available" className="bg-[#090e17]">{t('settings.status_online_opt')}</option>
                                    <option value="busy" className="bg-[#090e17]">{t('settings.status_busy_opt')}</option>
                                    <option value="unavailable" className="bg-[#090e17]">{t('settings.status_offline_opt')}</option>
                                </select>
                            ) : (
                                <div className={`inline-flex w-full items-center justify-center rounded px-4 py-3 text-[11px] font-black font-mono uppercase tracking-widest shadow-inner border ${
                                    formData.availability === 'available' ? 'bg-emerald-900/20 text-emerald-400 border-emerald-500/30 shadow-[inset_0_0_10px_rgba(16,185,129,0.1)]' :
                                    formData.availability === 'busy' ? 'bg-amber-900/20 text-amber-400 border-amber-500/30 shadow-[inset_0_0_10px_rgba(245,158,11,0.1)]' :
                                    'bg-rose-900/20 text-rose-400 border-rose-500/30 shadow-[inset_0_0_10px_rgba(244,63,94,0.1)]'
                                }`}>
                                    {formData.availability === 'available' ? t('settings.status_online_val') :
                                     formData.availability === 'busy' ? t('settings.status_busy_val') :
                                     t('settings.status_offline_val')}
                                </div>
                            )}

                            {formData.availability === 'available' && (
                                <p className="mt-4 text-[10px] font-mono tracking-widest text-emerald-500/70 uppercase leading-relaxed border-l-2 border-emerald-500/50 pl-3">
                                    {t('settings.online_desc_1')}<br/>{t('settings.online_desc_2')}
                                </p>
                            )}
                        </section>

                        <Card title="HỒ SƠ NĂNG LỰC (CV)" glowColor="cyan">
                            <div className="space-y-6 text-sm">
                                {/* Education Builder */}
                                <div className="space-y-3">
                                    <h4 className="text-cyan-400 font-mono text-[10px] uppercase font-black uppercase tracking-widest flex items-center gap-2">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422A12.083 12.083 0 0121 17.5c0 .334-.01.667-.03 1" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l-6.16-3.422A12.083 12.083 0 003 17.5c0 .334.01.667.03 1" /></svg>
                                        Học Vấn (Education)
                                    </h4>
                                    
                                    {isEditing ? (
                                        <div className="space-y-4 border-l-2 border-slate-800 pl-4 py-2">
                                            {formData.education.map((edu, idx) => (
                                                <div key={idx} className="relative p-3 border border-slate-700 bg-slate-900/50 rounded flex flex-col gap-2">
                                                    <button onClick={() => handleArrayRemove('education', idx)} className="absolute top-2 right-2 text-rose-500 hover:text-rose-400">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                    </button>
                                                    <input type="text" placeholder="Trường học (Ví dụ: ĐH Bách Khoa)" value={edu.school || ''} onChange={(e) => handleArrayChange('education', idx, 'school', e.target.value)} className="w-full text-xs font-bold text-white bg-transparent border-b border-slate-700 focus:border-cyan-500 focus:outline-none placeholder-slate-600 pb-1" />
                                                    <input type="text" placeholder="Bằng cấp (Ví dụ: Kỹ sư CNTT)" value={edu.degree || ''} onChange={(e) => handleArrayChange('education', idx, 'degree', e.target.value)} className="w-full text-xs text-slate-300 bg-transparent border-b border-slate-700 focus:border-cyan-500 focus:outline-none placeholder-slate-600 pb-1" />
                                                    <div className="flex gap-2">
                                                        <input type="text" placeholder="Từ (2018)" value={edu.start_year || ''} onChange={(e) => handleArrayChange('education', idx, 'start_year', e.target.value)} className="w-1/2 text-xs text-slate-400 bg-transparent border-b border-slate-700 focus:border-cyan-500 focus:outline-none placeholder-slate-600 pb-1" />
                                                        <input type="text" placeholder="Đến (2022)" value={edu.end_year || ''} onChange={(e) => handleArrayChange('education', idx, 'end_year', e.target.value)} className="w-1/2 text-xs text-slate-400 bg-transparent border-b border-slate-700 focus:border-cyan-500 focus:outline-none placeholder-slate-600 pb-1" />
                                                    </div>
                                                </div>
                                            ))}
                                            <button onClick={() => handleArrayAdd('education', { school: '', degree: '', start_year: '', end_year: '', description: '' })} className="w-full py-2 border border-dashed border-cyan-500/50 rounded text-cyan-500 font-mono text-[10px] uppercase hover:bg-cyan-500/10 transition-colors">
                                                + Thêm Học Vấn
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 border-l-2 border-slate-800 pl-4 py-2">
                                            {formData.education && formData.education.length > 0 ? formData.education.map((edu, idx) => (
                                                <div key={idx} className="relative">
                                                    <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-cyan-500/20 border border-cyan-500 shadow-[0_0_5px_rgba(6,182,212,1)]" />
                                                    <div className="font-bold text-slate-200 text-xs">{edu.school}</div>
                                                    <div className="text-[11px] text-cyan-400/80 mb-1">{edu.degree}</div>
                                                    <div className="text-[9px] font-mono text-slate-500">
                                                        {edu.start_year && edu.end_year ? `${edu.start_year} - ${edu.end_year}` : edu.start_year || edu.end_year}
                                                    </div>
                                                </div>
                                            )) : <div className="text-xs text-slate-500 italic">Chưa cập nhật</div>}
                                        </div>
                                    )}
                                </div>

                                {/* Experience Builder */}
                                <div className="space-y-3 pt-4 border-t border-slate-800">
                                    <h4 className="text-emerald-400 font-mono text-[10px] uppercase font-black uppercase tracking-widest flex items-center gap-2">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        Kinh Nghiệm (Experience)
                                    </h4>
                                    
                                    {isEditing ? (
                                        <div className="space-y-4 border-l-2 border-slate-800 pl-4 py-2">
                                            {formData.experience.map((exp, idx) => (
                                                <div key={idx} className="relative p-3 border border-slate-700 bg-slate-900/50 rounded flex flex-col gap-2">
                                                    <button onClick={() => handleArrayRemove('experience', idx)} className="absolute top-2 right-2 text-rose-500 hover:text-rose-400">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                    </button>
                                                    <input type="text" placeholder="Công ty (Ví dụ: FPT FSoft)" value={exp.company || ''} onChange={(e) => handleArrayChange('experience', idx, 'company', e.target.value)} className="w-full text-xs font-bold text-white bg-transparent border-b border-slate-700 focus:border-emerald-500 focus:outline-none placeholder-slate-600 pb-1" />
                                                    <input type="text" placeholder="Vị trí (Ví dụ: Senior Frontend)" value={exp.role || ''} onChange={(e) => handleArrayChange('experience', idx, 'role', e.target.value)} className="w-full text-xs text-slate-300 bg-transparent border-b border-slate-700 focus:border-emerald-500 focus:outline-none placeholder-slate-600 pb-1" />
                                                    <div className="flex gap-2">
                                                        <input type="text" placeholder="Từ (T1/2020)" value={exp.start_date || ''} onChange={(e) => handleArrayChange('experience', idx, 'start_date', e.target.value)} className="w-1/2 text-xs text-slate-400 bg-transparent border-b border-slate-700 focus:border-emerald-500 focus:outline-none placeholder-slate-600 pb-1" />
                                                        <input type="text" placeholder="Đến (Hiện tại)" value={exp.end_date || ''} onChange={(e) => handleArrayChange('experience', idx, 'end_date', e.target.value)} className="w-1/2 text-xs text-slate-400 bg-transparent border-b border-slate-700 focus:border-emerald-500 focus:outline-none placeholder-slate-600 pb-1" />
                                                    </div>
                                                    <textarea placeholder="Mô tả công việc" value={exp.description || ''} rows={2} onChange={(e) => handleArrayChange('experience', idx, 'description', e.target.value)} className="w-full text-xs text-slate-400 bg-[#090e17] border border-slate-700 rounded p-1.5 focus:border-emerald-500 focus:outline-none placeholder-slate-600 mt-1" />
                                                </div>
                                            ))}
                                            <button onClick={() => handleArrayAdd('experience', { company: '', role: '', start_date: '', end_date: '', description: '' })} className="w-full py-2 border border-dashed border-emerald-500/50 rounded text-emerald-500 font-mono text-[10px] uppercase hover:bg-emerald-500/10 transition-colors">
                                                + Thêm Kinh Nghiệm
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 border-l-2 border-slate-800 pl-4 py-2">
                                            {formData.experience && formData.experience.length > 0 ? formData.experience.map((exp, idx) => (
                                                <div key={idx} className="relative">
                                                    <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500 shadow-[0_0_5px_rgba(16,185,129,1)]" />
                                                    <div className="font-bold text-slate-200 text-xs">{exp.company}</div>
                                                    <div className="text-[11px] text-emerald-400/80 mb-0.5">{exp.role}</div>
                                                    <div className="text-[9px] font-mono text-slate-500 mb-1">
                                                        {exp.start_date && exp.end_date ? `${exp.start_date} - ${exp.end_date}` : exp.start_date || exp.end_date}
                                                    </div>
                                                    {exp.description && <div className="text-[10px] text-slate-400 leading-relaxed max-w-sm whitespace-pre-wrap">{exp.description}</div>}
                                                </div>
                                            )) : <div className="text-xs text-slate-500 italic">Chưa cập nhật</div>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
            
            <style jsx="true">{`
                @keyframes scan {
                    0% { transform: translateY(0); opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { transform: translateY(8rem); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default Settings;
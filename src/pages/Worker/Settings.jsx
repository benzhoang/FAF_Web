import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { userApi } from '../../api/user.api';
import SkillSelector from '../../components/SkillSelector';

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
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        full_name: '',
        location: '',
        bio: '',
        skills: [],
        hourly_rate: '',
        availability: 'available',
        title: 'Senior Developer', 
        education: 'BFA in Communication Design, Pratt Institute', 
        languages: 'English (Fluent), Spanish (Conversational)' 
    });

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
            title: user.title || 'Senior Developer', 
            education: user.education || 'Not provided',
            languages: user.languages || 'English'
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSkillsChange = (newSkills) => {
        setFormData(prev => ({
            ...prev,
            skills: newSkills
        }));
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
                availability: formData.availability
            });
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

    const displayName = formData.full_name || user?.email || 'UNKNOWN_OPERATIVE';
    const memberSince = user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'UNKNOWN_CYCLE';

    return (
        <div className="w-full flex-grow bg-[#020617] text-slate-300 pb-12 relative font-sans">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: 'repeating-linear-gradient(0deg,rgba(0,255,255,0.008) 0px,rgba(0,255,255,0.008) 1px,transparent 1px,transparent 3px)' }} />
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 relative z-10">
                <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-white uppercase tracking-widest font-mono text-shadow-glow-cyan">OPERATIVE_SETTINGS</h1>
                        <p className="mt-1 text-[10px] text-cyan-500/70 font-mono tracking-widest uppercase">Manage system profile and node preferences</p>
                    </div>
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="inline-flex items-center justify-center rounded-lg bg-cyan-900/30 border border-cyan-500/50 text-cyan-400 px-5 py-2 font-black text-[10px] hover:bg-cyan-900/50 hover:text-cyan-300 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.2)] font-mono uppercase tracking-widest gap-2"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            MODIFY_PARAMETERS
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
                                ABORT
                            </button>
                            <button
                                onClick={handleSave}
                                className="inline-flex items-center justify-center rounded-lg bg-emerald-900/30 border border-emerald-500/50 text-emerald-400 px-5 py-2 font-black text-[10px] hover:bg-emerald-900/50 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)] uppercase tracking-widest font-mono disabled:opacity-50 shrink-0 gap-2"
                                disabled={saving}
                            >
                                {saving ? 'SYNCING...' : 'COMMIT_CHANGES'}
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
                                    <div className="relative shrink-0">
                                        <div className="h-28 w-28 rounded border-2 border-cyan-500 bg-[#02040a] flex items-center justify-center font-black font-mono text-3xl text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] overflow-hidden relative z-10">
                                            {getInitials(displayName)}
                                        </div>
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
                                                    placeholder="SYS.ID_NAME"
                                                    className="w-full text-xl font-black font-mono text-white border border-cyan-500/50 bg-[#02040a] rounded px-4 py-2 focus:ring-1 focus:ring-cyan-400 focus:outline-none transition-all placeholder-slate-700 uppercase"
                                                />
                                                <input
                                                    type="text"
                                                    name="location"
                                                    value={formData.location}
                                                    onChange={handleInputChange}
                                                    placeholder="SYS.GEO_LOC"
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
                                                            LVL_{user.tier}
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
                                                            LOC: <span className="text-slate-300">{formData.location}</span>
                                                        </span>
                                                    )}
                                                    <span className="flex items-center gap-1.5">
                                                        <svg className="w-3.5 h-3.5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3M4 11h16M5 7h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z" />
                                                        </svg>
                                                        INIT: <span className="text-slate-300">{memberSince}</span>
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
                                        BIO_DATA_STREAM
                                    </div>
                                    {isEditing ? (
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="w-full text-[12px] font-mono text-slate-300 border border-slate-700 bg-[#090e17] rounded p-4 focus:border-cyan-500/50 focus:outline-none transition-colors placeholder-slate-700"
                                            placeholder="> Input operational history and capabilities..."
                                        />
                                    ) : (
                                        <p className="text-[12px] font-mono text-slate-400 leading-relaxed whitespace-pre-wrap">
                                            {formData.bio ? `> ${formData.bio.split('\n').join('\n> ')}` : '> DATA_NOT_FOUND. INITIALIZE BIO STREAM.'}
                                        </p>
                                    )}
                                </div>

                                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <Stat value={user?.total_jobs_done || 0} label="TASKS_CLEARED" />
                                    <Stat value={user?.rating_avg ? `${user.rating_avg}★` : 'NULL'} label="REP_SCORE" />
                                    <Stat 
                                        value={formData.hourly_rate} 
                                        label="BASE_RATE_H" 
                                        isEditing={isEditing}
                                        name="hourly_rate"
                                        onChange={handleInputChange}
                                        type="number"
                                    />
                                    <Stat 
                                        value={user?.balance_points || 0} 
                                        label="NET_LIQUIDITY" 
                                    />
                                </div>
                            </div>
                        </section>

                        <Card title="OPERATIONAL_PARAMETERS" glowColor="cyan">
                            <div className="space-y-4">
                                {isEditing ? (
                                    <div className="skill-selector-cyberpunk">
                                        {/* Assumes SkillSelector is styled or handles its own styling. We might need to override it with CSS if it's imported from outside */}
                                        <SkillSelector 
                                            selectedSkills={formData.skills} 
                                            onChange={handleSkillsChange}
                                            placeholder="> ADD_NEW_MODULE_PROTOCOL..." 
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {formData.skills.length > 0 ? (
                                            formData.skills.map((s, i) => (
                                                <span key={i} className="inline-flex items-center rounded border border-cyan-500/30 bg-cyan-900/20 px-2 by-1 text-[10px] font-black font-mono text-cyan-400 tracking-widest uppercase shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                                                    {typeof s === 'string' ? s : s.name || s}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">&gt; NO_PROTOCOLS_LOADED.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Card>

                        <Card title="VISUAL_ARCHIVES" glowColor="indigo">
                             <div className="space-y-4">
                                {user?.portfolio_items && user.portfolio_items.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {user.portfolio_items.map((item, idx) => (
                                            <div key={idx} className="group relative rounded border border-slate-700 overflow-hidden bg-[#02040a] aspect-video hover:border-indigo-500/50 transition-colors">
                                                {item.image_url ? (
                                                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity mix-blend-luminosity group-hover:mix-blend-normal" />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 font-mono text-[10px] uppercase tracking-widest gap-2">
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                        NO_VISUAL_DATA
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent flex flex-col justify-end p-3">
                                                    <div className="font-black font-mono text-[10px] text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full inline-block shadow-[0_0_5px_rgba(99,102,241,1)]"></span>
                                                        {item.title}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 border border-slate-800 bg-[#02040a] rounded flex flex-col items-center justify-center space-y-3">
                                        <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                        <p className="text-[10px] font-black font-mono text-slate-500 uppercase tracking-widest">ARCHIVES_EMPTY</p>
                                    </div>
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
                                NETWORK_PRESENCE
                            </h3>
                            
                            {isEditing ? (
                                <select
                                    name="availability"
                                    value={formData.availability}
                                    onChange={handleInputChange}
                                    className="w-full text-xs font-black font-mono uppercase bg-[#02040a] border border-emerald-500/50 text-emerald-400 rounded px-4 py-3 focus:outline-none focus:border-emerald-400 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyMCAyMCI+PHBhdGggc3Ryb2tlPSIjMzRkMzE5IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMS41IiBkPSJNNiA4bDQgNCA0LTQiLz48L3N2Zz4=')] bg-[length:1.2em_1.2em] bg-[right_0.5rem_center] bg-no-repeat"
                                >
                                    <option value="available" className="bg-[#090e17]">STATUS : ONLINE (READY)</option>
                                    <option value="busy" className="bg-[#090e17]">STATUS : BUSY (LIMITED)</option>
                                    <option value="unavailable" className="bg-[#090e17]">STATUS : OFFLINE (GHOST)</option>
                                </select>
                            ) : (
                                <div className={`inline-flex w-full items-center justify-center rounded px-4 py-3 text-[11px] font-black font-mono uppercase tracking-widest shadow-inner border ${
                                    formData.availability === 'available' ? 'bg-emerald-900/20 text-emerald-400 border-emerald-500/30 shadow-[inset_0_0_10px_rgba(16,185,129,0.1)]' :
                                    formData.availability === 'busy' ? 'bg-amber-900/20 text-amber-400 border-amber-500/30 shadow-[inset_0_0_10px_rgba(245,158,11,0.1)]' :
                                    'bg-rose-900/20 text-rose-400 border-rose-500/30 shadow-[inset_0_0_10px_rgba(244,63,94,0.1)]'
                                }`}>
                                    {formData.availability === 'available' ? '[OK] ONLINE / AWAITING_ORDERS' :
                                     formData.availability === 'busy' ? '[WARN] HIGH_LOAD / BUSY' :
                                     '[ERR] OFFLINE / STEALTH_MODE'}
                                </div>
                            )}

                            {formData.availability === 'available' && (
                                <p className="mt-4 text-[10px] font-mono tracking-widest text-emerald-500/70 uppercase leading-relaxed border-l-2 border-emerald-500/50 pl-3">
                                    &gt; SYSTEM BROADCASTING AVAILABILITY.<br/>&gt; EMPLOYER NODES CAN INITIATE CONTACT.
                                </p>
                            )}
                        </section>

                        <Card title="DATA_FRAGMENTS" glowColor="cyan">
                            <div className="space-y-5 text-sm">
                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 shrink-0 rounded bg-indigo-900/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21s7-4.35 7-11a7 7 0 10-14 0c0 6.65 7 11 7 11z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10a2 2 0 110-4 2 2 0 010 4z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-[9px] font-black tracking-widest text-slate-500 uppercase font-mono">FIXED_LOCATION</div>
                                        <div className="mt-1 font-bold font-mono text-slate-300 text-[12px] uppercase">{formData.location || 'NULL_REFERENCE'}</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 shrink-0 rounded bg-blue-900/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422A12.083 12.083 0 0121 17.5c0 .334-.01.667-.03 1" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l-6.16-3.422A12.083 12.083 0 003 17.5c0 .334.01.667.03 1" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-[9px] font-black tracking-widest text-slate-500 uppercase font-mono">TRAINING_DATA</div>
                                        <div className="mt-1 font-bold font-mono text-slate-300 text-[12px] uppercase leading-tight">{formData.education}</div>
                                    </div>
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
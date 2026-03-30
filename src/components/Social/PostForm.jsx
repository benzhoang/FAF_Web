import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { postsApi } from '../../api/posts.api';
import { useToast } from '../../contexts/ToastContext';
import { useTheme } from '../../contexts/ThemeContext';

const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

/* ══════════════════════════════════════════════════════
   CYBERPUNK POST MODAL
══════════════════════════════════════════════════════ */
const PostModal = ({ onClose, onPostCreated, user, toast }) => {
    const [content, setContent]           = useState('');
    const [image, setImage]               = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { theme } = useTheme();
    const isLight = theme === 'light';
    const textareaRef = useRef(null);
    const displayName = user?.full_name || user?.email?.split('@')[0] || 'You';

    useEffect(() => { setTimeout(() => textareaRef.current?.focus(), 80); }, []);
    useEffect(() => {
        const h = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', h);
        return () => document.removeEventListener('keydown', h);
    }, [onClose]);
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { toast.error('Image too large. Max 5MB.'); return; }
        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const removeImage = () => { setImage(null); setImagePreview(null); };

    const handleSubmit = async () => {
        if (!content.trim() && !image) return;
        try {
            setIsSubmitting(true);
            const formData = new FormData();
            formData.append('content', content);
            if (image) formData.append('image', image);
            const res = await postsApi.createPost(formData);
            toast.success('Signal broadcast! 🚀');
            onPostCreated?.(res.data);
            onClose();
        } catch {
            toast.error('Broadcast failed. Try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        /* Overlay */
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(8px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            {/* Modal */}
            <div
                className="w-full max-w-[520px] flex flex-col overflow-hidden animate-[modalPop_.22s_cubic-bezier(0.34,1.56,0.64,1)] relative"
                style={{
                    maxHeight: '90vh',
                    background: isLight ? 'rgba(255,255,255,0.98)' : 'linear-gradient(145deg, #0d1224 0%, #0f172a 100%)',
                    border: isLight ? '1px solid rgba(148,163,184,0.3)' : '1px solid rgba(6,182,212,0.25)',
                    borderRadius: '16px',
                    boxShadow: isLight ? '0 10px 40px rgba(0,0,0,0.12)' : '0 0 0 1px rgba(6,182,212,0.1), 0 0 40px rgba(6,182,212,0.08), 0 25px 60px rgba(0,0,0,0.6)',
                }}
            >
                {/* Top neon line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
                {/* Corner brackets */}
                <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-cyan-500/50 rounded-tl pointer-events-none" />
                <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-cyan-500/50 rounded-tr pointer-events-none" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-purple-500/50 rounded-bl pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-purple-500/50 rounded-br pointer-events-none" />

                {/* Header */}
                <div className="relative flex items-center justify-between px-5 py-4 border-b border-slate-700/60">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-lg shadow-cyan-400/80" />
                        <h2 className="text-[14px] font-black tracking-widest text-white uppercase font-mono">// BROADCAST SIGNAL</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-600/40 hover:border-cyan-500/40 flex items-center justify-center transition-all group"
                    >
                        <svg className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                {/* User info */}
                <div className="flex items-center gap-3 px-5 pt-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-black text-sm overflow-hidden flex-shrink-0 shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-500/30">
                        {user?.avatar_url
                            ? <img src={user.avatar_url} alt="av" className="w-full h-full object-cover" />
                            : getInitials(displayName)}
                    </div>
                    <div>
                        <p className="font-black text-[13px] text-white tracking-wide uppercase">{displayName}</p>
                        <button className="flex items-center gap-1 bg-slate-800/80 hover:bg-slate-700 border border-slate-600/40 hover:border-cyan-500/30 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-lg transition-all mt-0.5 font-mono">
                            <svg className="w-2.5 h-2.5 text-cyan-400" fill="currentColor" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
                            PRIVATE ▾
                        </button>
                    </div>
                </div>

                {/* Textarea */}
                <div className="flex-1 overflow-y-auto px-5 pt-3 pb-2">
                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        placeholder={`${displayName.split(' ')[0]}, what signal are you transmitting?`}
                        className="w-full resize-none border-0 bg-transparent text-slate-100 placeholder-slate-500 text-[16px] leading-relaxed focus:outline-none min-h-[120px] font-mono"
                        style={{ caretColor: '#06b6d4' }}
                    />

                    {imagePreview && (
                        <div className="relative mt-2 rounded-xl overflow-hidden border border-cyan-500/20 bg-slate-800/50">
                            <img src={imagePreview} alt="Preview" className="w-full max-h-[260px] object-contain" />
                            <button
                                onClick={removeImage}
                                className="absolute top-2 right-2 w-8 h-8 bg-slate-900/80 hover:bg-red-900/80 border border-slate-600/40 hover:border-red-500/50 rounded-lg flex items-center justify-center transition-all"
                            >
                                <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>
                    )}
                </div>

                {/* Add to post bar */}
                <div className="px-5 pb-5">
                    <div className="flex items-center justify-between border border-slate-700/60 rounded-xl px-4 py-2.5 bg-slate-800/40 mb-3">
                        <span className="text-[11px] font-black tracking-widest text-slate-500 uppercase font-mono">ATTACH</span>
                        <div className="flex items-center gap-1">
                            {/* Photo button */}
                            <label htmlFor="modal-photo-upload"
                                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-700/60 border border-transparent hover:border-cyan-500/30 cursor-pointer transition-all"
                                title="Photo/Video">
                                <input id="modal-photo-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                <span className="text-lg">🖼️</span>
                            </label>
                            {[
                                { icon: '😊', label: 'Feeling'  },
                                { icon: '📍', label: 'Location' },
                            ].map((btn, i) => (
                                <button key={i} title={btn.label}
                                    className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-700/60 border border-transparent hover:border-cyan-500/30 transition-all">
                                    <span className="text-lg">{btn.icon}</span>
                                </button>
                            ))}
                            <button title="More"
                                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-700/60 border border-transparent hover:border-cyan-500/30 transition-all">
                                <span className="text-[11px] font-black text-slate-400">···</span>
                            </button>
                        </div>
                    </div>

                    {/* Submit button */}
                    <button
                        onClick={handleSubmit}
                        disabled={(!content.trim() && !image) || isSubmitting}
                        className={`w-full py-3 rounded-xl font-black text-[13px] tracking-widest uppercase font-mono transition-all ${
                            (!content.trim() && !image) || isSubmitting
                                ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700/50'
                                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:scale-[0.98] border border-cyan-500/40'
                        }`}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-cyan-300 border-t-transparent rounded-full animate-spin" />
                                BROADCASTING...
                            </span>
                        ) : '► BROADCAST'}
                    </button>
                </div>

                {/* Bottom neon line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════════
   CYBERPUNK TRIGGER CARD
══════════════════════════════════════════════════════ */
const PostForm = ({ onPostCreated }) => {
    const { user } = useAuth();
    const toast    = useToast();
    const { theme } = useTheme();
    const isLight = theme === 'light';
    const [showModal, setShowModal] = useState(false);
    const displayName = user?.full_name || user?.email?.split('@')[0] || 'You';

    if (!user) return null;

    return (
        <>
            {/* Trigger card */}
            <div
                className="relative overflow-hidden rounded-xl border"
                style={{
                    background: isLight ? '#ffffff' : 'linear-gradient(145deg, #0d1224 0%, #0f172a 100%)',
                    borderColor: isLight ? 'rgba(148,163,184,0.25)' : 'rgba(6,182,212,0.2)',
                    boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.06)' : '0 0 20px rgba(6,182,212,0.04)',
                }}
            >
                {/* Top neon line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

                <div className="p-4">
                    <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-black text-sm overflow-hidden flex-shrink-0 shadow-lg shadow-cyan-500/20 ring-2 ring-cyan-500/20">
                            {user?.avatar_url
                                ? <img src={user.avatar_url} alt="av" className="w-full h-full object-cover" />
                                : getInitials(displayName)}
                        </div>

                        {/* Trigger input */}
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex-1 text-left border rounded-xl py-2.5 px-4 text-[13px] font-mono font-bold tracking-wide transition-all group"
                            style={{
                                background: isLight ? 'rgba(248,250,252,0.9)' : 'rgba(15,23,42,0.8)',
                                borderColor: isLight ? 'rgba(148,163,184,0.3)' : 'rgba(6,182,212,0.15)',
                                color: isLight ? '#64748b' : 'rgba(148,163,184,0.7)',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = isLight ? 'rgba(6,182,212,0.3)' : 'rgba(6,182,212,0.4)';
                                e.currentTarget.style.color = 'rgba(6,182,212,0.85)';
                                e.currentTarget.style.boxShadow = '0 0 15px rgba(6,182,212,0.08)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = isLight ? 'rgba(148,163,184,0.3)' : 'rgba(6,182,212,0.15)';
                                e.currentTarget.style.color = isLight ? '#64748b' : 'rgba(148,163,184,0.7)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            {'>'} {displayName.split(' ')[0].toLowerCase()}, what signal are you transmitting?
                        </button>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 mt-3 pt-3 border-t border-slate-700/40">
                        {[
                            { emoji: '🖼️', label: 'MEDIA'    },
                            { emoji: '😊', label: 'MOOD'     },
                            { emoji: '📍', label: 'LOCATION' },
                        ].map(btn => (
                            <React.Fragment key={btn.label}>
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all font-mono text-[10px] font-black tracking-widest uppercase group"
                                    style={{ color: 'rgba(100,116,139,0.8)' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(6,182,212,0.06)'; e.currentTarget.style.color = 'rgba(6,182,212,0.8)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(100,116,139,0.8)'; }}
                                >
                                    <span className="text-base">{btn.emoji}</span>
                                    {btn.label}
                                </button>
                                {btn.label !== 'LOCATION' && <div className="w-px h-5" style={{ background: 'rgba(51,65,85,0.6)' }} />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Bottom neon line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
            </div>

            {showModal && (
                <PostModal
                    user={user}
                    toast={toast}
                    onClose={() => setShowModal(false)}
                    onPostCreated={onPostCreated}
                />
            )}
        </>
    );
};

export default PostForm;

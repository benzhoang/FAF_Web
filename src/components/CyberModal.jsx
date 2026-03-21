import React from 'react';

/**
 * CyberModal - A high-fidelity, cyberpunk-themed modal component.
 * 
 * @param {boolean} isOpen - Whether the modal is visible.
 * @param {function} onClose - Function to call when closing the modal.
 * @param {function} onConfirm - Function to call when confirming the action.
 * @param {string} title - The title of the modal.
 * @param {string} message - The message body.
 * @param {string} type - 'info', 'warning', 'danger', 'success'.
 * @param {string} confirmText - Text for the confirm button.
 * @param {string} cancelText - Text for the cancel button.
 * @param {boolean} processing - Whether an action is currently being processed.
 */
const CyberModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = "SYSTEM_NOTIFICATION", 
    message = "EXECUTE_PROTOCOL?", 
    type = "info",
    confirmText = "CONFIRM",
    cancelText = "CANCEL",
    processing = false,
    requiresInput = false,
    inputValue = "",
    onInputChange,
    inputPlaceholder = "ENTER_DATA..."
}) => {
    if (!isOpen) return null;

    const colors = {
        info: {
            text: 'text-cyan-400',
            border: 'border-cyan-500/30',
            bg: 'bg-cyan-500/10',
            shadow: 'shadow-[0_0_20px_rgba(34,211,238,0.2)]',
            btn: 'bg-cyan-600 hover:bg-cyan-500',
            glow: 'bg-cyan-500'
        },
        warning: {
            text: 'text-amber-400',
            border: 'border-amber-500/30',
            bg: 'bg-amber-500/10',
            shadow: 'shadow-[0_0_20px_rgba(245,158,11,0.2)]',
            btn: 'bg-amber-600 hover:bg-amber-500',
            glow: 'bg-amber-500'
        },
        danger: {
            text: 'text-rose-400',
            border: 'border-rose-500/30',
            bg: 'bg-rose-500/10',
            shadow: 'shadow-[0_0_20px_rgba(244,63,94,0.2)]',
            btn: 'bg-rose-600 hover:bg-rose-500',
            glow: 'bg-rose-500'
        },
        success: {
            text: 'text-emerald-400',
            border: 'border-emerald-500/30',
            bg: 'bg-emerald-500/10',
            shadow: 'shadow-[0_0_20px_rgba(16,185,129,0.2)]',
            btn: 'bg-emerald-600 hover:bg-emerald-500',
            glow: 'bg-emerald-500'
        }
    };

    const theme = colors[type] || colors.info;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
                onClick={!processing ? onClose : undefined}
            />

            {/* Modal Container */}
            <div className={`relative w-full max-w-md ${theme.bg} ${theme.border} border rounded-2xl p-8 backdrop-blur-xl ${theme.shadow} animate-in zoom-in-95 duration-300 transform`}>
                {/* Decorative Corners */}
                <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 ${theme.border} rounded-tl-xl`} />
                <div className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 ${theme.border} rounded-tr-xl`} />
                <div className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 ${theme.border} rounded-bl-xl`} />
                <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 ${theme.border} rounded-br-xl`} />

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className={`w-2 h-2 rounded-full ${theme.glow} animate-pulse shadow-[0_0_10px_currentColor]`} />
                    <h2 className={`text-[11px] font-black font-mono tracking-[0.4em] uppercase ${theme.text}`}>
                        {title}
                    </h2>
                </div>

                {/* Body */}
                <div className="mb-6">
                    <p className="text-sm font-mono text-slate-300 leading-relaxed uppercase tracking-wider">
                        {message}
                    </p>
                </div>

                {/* Input Field (Optional) */}
                {requiresInput && (
                    <div className="mb-8">
                        <textarea
                            value={inputValue}
                            onChange={(e) => onInputChange && onInputChange(e.target.value)}
                            placeholder={inputPlaceholder}
                            className={`w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-[10px] font-mono text-slate-300 placeholder:text-slate-600 outline-none transition-all uppercase tracking-widest min-h-[80px] focus:${theme.border}`}
                            disabled={processing}
                        />
                    </div>
                )}

                {/* Footer Actions */}
                <div className="flex gap-4">
                    <button
                        disabled={processing}
                        onClick={onClose}
                        className={`flex-1 py-3 rounded-xl border ${theme.border} text-slate-500 text-[10px] font-black font-mono tracking-widest uppercase hover:bg-white/5 hover:text-slate-300 transition-all active:scale-95 disabled:opacity-50`}
                    >
                        {cancelText}
                    </button>
                    <button
                        disabled={processing}
                        onClick={onConfirm}
                        className={`flex-1 py-3 rounded-xl ${theme.btn} text-[#020617] text-[10px] font-black font-mono tracking-widest uppercase transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2`}
                    >
                        {processing && (
                            <svg className="w-3 h-3 animate-spin text-current" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        )}
                        {processing ? 'SYNCING...' : confirmText}
                    </button>
                </div>

                {/* ID Label */}
                <div className="absolute -bottom-6 left-0 text-[7px] font-mono text-slate-600 uppercase tracking-[0.5em] opacity-50">
                    TERMINAL_AUTH_REQUIRED :: REF_7729
                </div>
            </div>
        </div>
    );
};

export default CyberModal;

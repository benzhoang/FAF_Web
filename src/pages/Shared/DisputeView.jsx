import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { useChatContext } from '../../contexts/ChatContext';
import disputeApi from '../../api/dispute.api';

const roleLabel = (email, raisedBy, currentUserId, managerId) => {
    if (managerId === email) return { label: 'MANAGER', color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' };
    if (raisedBy === email) return { label: 'INITIATOR', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' };
    return { label: 'RESPONDENT', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' };
};

const DisputeView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const { socket } = useChatContext();
    const chatEndRef = useRef(null);

    const [dispute, setDispute] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);

    // Get current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        fetchData();
        
        if (!socket) return;
        
        // Join the dispute room
        socket.emit('join_dispute', id);
        
        const handleNewMessage = (msg) => {
            setMessages(prev => {
                // Prevent duplicate messages
                if (prev.some(m => m.id === msg.id)) return prev;
                return [...prev, msg];
            });
        };
        
        const handleResolved = (updatedDispute) => {
            setDispute(updatedDispute);
            toast.info("Tranh chấp đã được xử lý.");
        };

        socket.on('dispute_message', handleNewMessage);
        socket.on('dispute_resolved', handleResolved);
        
        return () => {
            socket.off('dispute_message', handleNewMessage);
            socket.off('dispute_resolved', handleResolved);
        };
    }, [id, socket]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchData = async () => {
        try {
            const res = await disputeApi.getById(id);
            const data = res.data;
            setDispute(data);
            setMessages(data.messages || []);
        } catch (err) {
            if (err?.response?.status === 404 || err?.response?.status === 403) {
                toast.error('Tranh chấp không tồn tại hoặc bạn không có quyền xem.');
                navigate(-1);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if ((!newMessage.trim() && selectedFiles.length === 0) || sending) return;
        try {
            setSending(true);
            const formData = new FormData();
            if (newMessage.trim()) formData.append('message', newMessage.trim());
            selectedFiles.forEach(file => formData.append('attachments', file));
            
            await disputeApi.sendMessage(id, formData);
            setNewMessage('');
            setSelectedFiles([]);
            fetchData();
        } catch (err) {
            toast.error('Không thể gửi tin nhắn. Vui lòng thử lại.');
        } finally {
            setSending(false);
        }
    };

    const getMessageStyle = (msg) => {
        const isMe = msg.sender_email === currentUser?.email;
        const isManager = msg.sender_role?.toLowerCase() === 'manager' || msg.sender_role?.toLowerCase() === 'admin' || msg.sender_email?.includes('manager');
        if (isMe) return { bubble: 'bg-cyan-600/20 border border-cyan-500/30', name: 'text-cyan-400', side: 'justify-end' };
        if (isManager) return { bubble: 'bg-violet-500/10 border border-violet-500/20', name: 'text-violet-400', side: 'justify-start' };
        return { bubble: 'bg-rose-500/5 border border-rose-500/10', name: 'text-rose-400', side: 'justify-start' };
    };

    const getRoleTag = (msg) => {
        if (!dispute) return '';
        if (msg.sender_role?.toLowerCase() === 'manager' || msg.sender_role?.toLowerCase() === 'admin' || msg.sender_email?.includes('manager')) return '🛡️ Manager';
        if (msg.sender_email === dispute.raiser_email) return '⚖️ Người Khởi Kiện';
        return '👤 Đối Phương';
    };

    const getResolutionInfo = () => {
        if (!dispute || dispute.status !== 'RESOLVED') return null;
        const won = dispute.resolution === 'WORKER_WINS' ? 'Worker' : 'Chủ Dự Án (Employer)';
        return { won, summary: dispute.resolution_summary };
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center text-cyan-500 font-mono uppercase tracking-widest animate-pulse text-[11px]">
            Loading_Dispute_Data...
        </div>
    );

    if (!dispute) return null;

    const resolution = getResolutionInfo();

    return (
        <div className="min-h-screen bg-transparent text-slate-300 font-sans">
            <div className="max-w-5xl mx-auto px-4 py-8">

                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-[10px] font-black font-mono text-slate-500 hover:text-white uppercase tracking-widest transition-colors mb-4"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
                        Quay Lại
                    </button>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl font-black text-white font-mono uppercase tracking-wider">
                                    Khiếu Nại <span className="text-rose-500">#{dispute.id}</span>
                                </h1>
                                <span className={`px-3 py-1 rounded-full text-[9px] font-black font-mono tracking-widest uppercase border flex items-center gap-1.5 ${
                                    dispute.status === 'OPEN' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' :
                                    dispute.status === 'RESOLVED' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                                    'bg-amber-500/10 border-amber-500/30 text-amber-400'
                                }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                                        dispute.status === 'OPEN' ? 'bg-rose-500' :
                                        dispute.status === 'RESOLVED' ? 'bg-emerald-500' : 'bg-amber-500'
                                    }`}/>
                                    {dispute.status}
                                </span>
                            </div>
                            <p className="text-[11px] font-mono text-slate-500 uppercase tracking-widest">
                                Hợp Đồng #{dispute.contract_id} {dispute.checkpoint_title ? `· Checkpoint: ${dispute.checkpoint_title} ($${dispute.escrow_amount})` : ''} &nbsp;·&nbsp; Người Khởi Kiện: <span className="text-rose-400">{dispute.raiser_email}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Chat Panel - Main area */}
                    <div className="lg:col-span-2 flex flex-col">
                        {/* Reason Box */}
                        <div className="mb-4 p-5 bg-[#090e17]/80 border border-rose-500/20 rounded-xl">
                            <p className="text-[9px] font-black font-mono text-rose-400 uppercase tracking-widest mb-2">Lý Do Khiếu Nại</p>
                            <p className="text-sm text-slate-300 leading-relaxed">{dispute.reason}</p>
                        </div>

                        {/* Chat box */}
                        <div className="flex-1 flex flex-col bg-[#090e17]/60 border border-slate-800 rounded-xl overflow-hidden">
                            <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
                                <h2 className="text-[10px] font-black font-mono text-slate-400 uppercase tracking-widest">
                                    💬 Phòng Chat 3 Bên — Manager · Worker · Employer
                                </h2>
                                <span className="text-[8px] font-mono text-emerald-500 animate-pulse uppercase tracking-widest">LIVE</span>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[480px] min-h-[300px]">
                                {messages.length === 0 ? (
                                    <div className="text-center py-16 text-[10px] font-mono text-slate-600 uppercase tracking-widest italic">
                                        Chưa có tin nhắn nào. Hãy bắt đầu để trình bày bằng chứng của bạn.
                                    </div>
                                ) : (
                                    messages.map((msg, idx) => {
                                        const style = getMessageStyle(msg);
                                        const isMe = msg.sender_email === currentUser?.email;
                                        const roleTag = getRoleTag(msg);
                                        return (
                                            <div key={idx} className={`flex gap-3 ${style.side}`}>
                                                {!isMe && (
                                                    <div className="shrink-0 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-black text-slate-400">
                                                        {msg.sender_email?.[0]?.toUpperCase()}
                                                    </div>
                                                )}
                                                <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-[9px] font-mono font-black uppercase ${style.name}`}>{roleTag}</span>
                                                        <span className="text-[8px] text-slate-600 font-mono">[{new Date(msg.created_at).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}]</span>
                                                    </div>
                                                    {msg.message && (
                                                        <div className={`px-4 py-3 rounded-xl text-sm text-slate-200 leading-relaxed ${style.bubble}`}>
                                                            {msg.message}
                                                        </div>
                                                    )}
                                                    {msg.attachments && msg.attachments.length > 0 && (
                                                        <div className="flex flex-wrap gap-2 mt-1">
                                                            {msg.attachments.map((url, i) => (
                                                                <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block w-20 h-20 rounded-lg overflow-hidden border border-slate-700 hover:border-cyan-500 transition-colors">
                                                                    <img src={url} alt="Attachment" className="w-full h-full object-cover" />
                                                                </a>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <span className="text-[8px] text-slate-600 font-mono">{msg.sender_email}</span>
                                                </div>
                                                {isMe && (
                                                    <div className="shrink-0 w-8 h-8 rounded-full bg-cyan-900/50 border border-cyan-500/30 flex items-center justify-center text-[10px] font-black text-cyan-400">
                                                        {msg.sender_email?.[0]?.toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Input */}
                            {dispute.status !== 'RESOLVED' ? (
                                <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-[#02040a]/50 flex flex-col gap-3">
                                    {selectedFiles.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {selectedFiles.map((file, i) => (
                                                <div key={i} className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-1.5 text-[10px] font-mono text-slate-300">
                                                    <span className="truncate max-w-[150px]">{file.name}</span>
                                                    <button type="button" onClick={() => setSelectedFiles(files => files.filter((_, idx) => idx !== i))} className="text-rose-400 hover:text-rose-300">✕</button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex gap-3">
                                        <label className="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 hover:bg-slate-800 hover:border-cyan-500/50 cursor-pointer transition-colors">
                                            <input type="file" multiple className="hidden" onChange={(e) => setSelectedFiles(Array.from(e.target.files))} />
                                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
                                        </label>
                                        <input
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Nhập bằng chứng hoặc phản hồi của bạn..."
                                            className="flex-1 bg-slate-900/80 border border-slate-700 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-sm text-slate-300 placeholder:text-slate-600 outline-none transition-all"
                                            disabled={sending}
                                        />
                                        <button
                                            type="submit"
                                            disabled={sending || (!newMessage.trim() && selectedFiles.length === 0)}
                                            className="px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[11px] font-black font-mono uppercase tracking-widest transition-all flex items-center gap-2 shrink-0"
                                        >
                                            {sending ? (
                                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                                </svg>
                                            ) : (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                                            )}
                                            Gửi
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="p-4 border-t border-slate-800 bg-emerald-500/5 text-center text-[10px] font-mono text-emerald-500 uppercase tracking-widest">
                                    ✅ Tranh chấp đã được phân xử. Chat room đã đóng.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Resolution Result */}
                        {resolution ? (
                            <div className="p-6 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                                <p className="text-[9px] font-black font-mono text-emerald-400 uppercase tracking-widest mb-3">⚖️ Phán Quyết Cuối Cùng</p>
                                <div className="mb-3">
                                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Người Thắng</p>
                                    <p className="text-xl font-black text-emerald-400 uppercase">{resolution.won}</p>
                                </div>
                                <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                                    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider leading-relaxed">
                                        {resolution.summary || 'Không có ghi chú phán quyết.'}
                                    </p>
                                </div>
                                <div className="mt-3 pt-3 border-t border-emerald-500/10">
                                    <p className="text-[9px] font-mono text-slate-600 leading-relaxed">
                                        {dispute.resolution === 'WORKER_WINS'
                                            ? '💰 Tiền đã được chuyển cho Worker.'
                                            : '🔄 Tiền đã được hoàn lại vào ví Employer.'}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-6 rounded-xl border border-amber-500/20 bg-amber-500/5">
                                <p className="text-[9px] font-black font-mono text-amber-400 uppercase tracking-widest mb-2">⏳ Đang Chờ Manager Xử Lý</p>
                                <p className="text-[10px] font-mono text-slate-500 leading-relaxed">
                                    Manager sẽ xem xét toàn bộ bằng chứng trong chat và đưa ra phán quyết cuối cùng.
                                    Tiền trong escrow sẽ được giải ngân theo quyết định.
                                </p>
                            </div>
                        )}

                        {/* Payment info */}
                        <div className="p-5 rounded-xl border border-slate-800 bg-[#090e17]/60">
                            <p className="text-[9px] font-black font-mono text-slate-500 uppercase tracking-widest mb-4">Thông Tin Escrow</p>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-mono text-slate-500 uppercase">Worker Thắng →</span>
                                    <span className="text-[11px] font-black text-cyan-400 font-mono">Tiền về Worker</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-mono text-slate-500 uppercase">Employer Thắng →</span>
                                    <span className="text-[11px] font-black text-rose-400 font-mono">Hoàn Ví Employer</span>
                                </div>
                            </div>
                        </div>

                        {/* Participants */}
                        <div className="p-5 rounded-xl border border-slate-800 bg-[#090e17]/60">
                            <p className="text-[9px] font-black font-mono text-slate-500 uppercase tracking-widest mb-3">Các Bên Liên Quan</p>
                            <div className="space-y-2 text-[10px] font-mono">
                                <div className="flex items-center gap-2 p-2 bg-rose-500/5 rounded-lg border border-rose-500/10">
                                    <span className="text-rose-400">⚖️</span>
                                    <div>
                                        <p className="text-[8px] text-slate-500 uppercase">Người Khởi Kiện</p>
                                        <p className="text-rose-400">{dispute.raiser_email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-2 bg-violet-500/5 rounded-lg border border-violet-500/10">
                                    <span className="text-violet-400">🛡️</span>
                                    <div>
                                        <p className="text-[8px] text-slate-500 uppercase">Manager</p>
                                        <p className="text-violet-400">Đang giám sát</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DisputeView;

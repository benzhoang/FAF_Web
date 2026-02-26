import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../hooks/useChat';
import { useChatContext } from '../../contexts/ChatContext';
import { useAuth } from '../../auth/AuthContext';
import { chatApi } from '../../api/chat.api';

const ChatWidget = () => {
    const { user } = useAuth();
    const { isOpen, activeConvId, setIsOpen, setActiveConvId, closeChat, unreadCount } = useChatContext();
    const [conversations, setConversations] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const { messages, sendMessage, loading } = useChat(activeConvId);
    const messagesEndRef = useRef(null);

    // Fetch conversation list when widget opens or list is empty
    useEffect(() => {
        if (!user) return;
        const fetchConversations = async () => {
            try {
                const res = await chatApi.getConversations();
                setConversations(res?.data ?? []);
            } catch (err) {
                console.error("Failed to load conversations:", err);
            }
        };
        fetchConversations();
    }, [user, isOpen]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!messageInput.trim()) return;
        sendMessage(messageInput);
        setMessageInput('');
    };

    if (!user) return null;

    const selectedConv = conversations.find(c => String(c.id) === String(activeConvId));
    
    // Calculate display name for the header
    const otherParticipant = selectedConv?.participants?.find(p => String(p.id) !== String(user.id));
    const otherUserName = otherParticipant?.full_name || otherParticipant?.email?.split('@')[0] || 'Chat';

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end pointer-events-none">
            {/* Chat Window */}
            {isOpen && activeConvId && (
                <div className="w-80 h-[450px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden mb-4 pointer-events-auto transition-all transform origin-bottom-right">
                    {/* Header */}
                    <div className="p-3 bg-blue-600 text-white flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold shrink-0">
                                {otherUserName.charAt(0)}
                            </div>
                            <span className="font-bold text-sm truncate">{otherUserName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <button 
                                onClick={() => setActiveConvId(null)}
                                className="p-1 hover:bg-white/20 rounded transition-colors"
                                title="Back to list"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-white/20 rounded transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                        {loading && <div className="text-center py-2 text-xs text-gray-400">Loading...</div>}
                        {messages.map((msg, i) => {
                            const isMe = String(msg.sender_id) === String(user.id);
                            return (
                                <div key={msg.id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] px-3 py-1.5 rounded-xl text-xs shadow-sm ${
                                        isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                                    }`}>
                                        <p>{msg.content}</p>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} className="p-3 border-t border-gray-100 flex gap-2 bg-white">
                        <input
                            type="text"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            placeholder="Aa"
                            className="flex-1 px-3 py-1.5 bg-gray-100 border-none rounded-full focus:ring-1 focus:ring-blue-500 text-sm"
                        />
                        <button type="submit" disabled={!messageInput.trim()} className="text-blue-600 font-bold disabled:opacity-30">
                            <svg className="w-5 h-5 rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                        </button>
                    </form>
                </div>
            )}

            {/* Conversation List Window */}
            {isOpen && !activeConvId && (
                <div className="w-80 h-[450px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden mb-4 pointer-events-auto transition-all transform origin-bottom-right">
                    <div className="p-3 bg-blue-600 text-white flex items-center justify-between">
                        <span className="font-bold text-sm">Chats</span>
                        <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {conversations.length === 0 ? (
                            <div className="p-10 text-center text-xs text-gray-400">No messages yet.</div>
                        ) : (
                            conversations.map(conv => {
                                const other = conv.participants?.find(p => String(p.id) !== String(user.id));
                                const name = other?.full_name || other?.email?.split('@')[0] || 'User';
                                return (
                                    <button 
                                        key={conv.id} 
                                        onClick={() => setActiveConvId(conv.id)}
                                        className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 border-b border-gray-50 transition-colors"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                                            {name.charAt(0)}
                                        </div>
                                        <div className="text-left overflow-hidden">
                                            <div className="font-bold text-sm text-gray-900 truncate">{name}</div>
                                            <div className="text-xs text-gray-500 truncate">{conv.last_message || 'Start chatting...'}</div>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}

            {/* Floating Bubble Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all pointer-events-auto relative"
            >
                {isOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                ) : (
                    <>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        
                        {/* Unread Badge */}
                        {unreadCount > 0 && (
                            <div className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white flex items-center justify-center min-w-[22px] h-[22px] shadow-lg animate-bounce z-10">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </div>
                        )}
                    </>
                )}
            </button>
        </div>
    );
};

export default ChatWidget;

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useChat } from '../../hooks/useChat';
import { chatApi } from '../../api/chat.api';
import { useAuth } from '../../auth/AuthContext';

const Messaging = () => {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const convIdFromUrl = searchParams.get('convId');
    const [conversations, setConversations] = useState([]);
    const [selectedConvId, setSelectedConvId] = useState(convIdFromUrl ? Number(convIdFromUrl) : null);
    const [messageInput, setMessageInput] = useState('');
    const { messages, sendMessage, loading } = useChat(selectedConvId);
    const messagesEndRef = useRef(null);

    // Load conversation list
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await chatApi.getConversations();
                setConversations(res?.data ?? []);
                
                const data = res?.data ?? [];
                // Auto-select based on URL or first item
                if (data.length > 0) {
                    if (convIdFromUrl) {
                        console.log('Selecting conversation from URL:', convIdFromUrl);
                        setSelectedConvId(convIdFromUrl);
                    } else if (!selectedConvId) {
                        setSelectedConvId(data[0].id);
                    }
                }
            } catch (err) {
                console.error("Failed to load conversations:", err);
            }
        };
        fetchConversations();
    }, []);

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

    // Correctly identify the other user for each conversation
    const conversationsWithOtherUser = conversations.map(conv => {
        const otherParticipant = conv.participants?.find(p => String(p.id) !== String(user.id));
        return {
            ...conv,
            other_user_name: otherParticipant?.full_name || otherParticipant?.email?.split('@')[0] || 'User',
            other_user_avatar: otherParticipant?.full_name?.charAt(0) || '?'
        };
    });

    const selectedConv = conversationsWithOtherUser.find(c => String(c.id) === String(selectedConvId));

    return (
        <div className="flex h-[calc(100vh-80px)] bg-gray-50 overflow-hidden">
            {/* Sidebar: Conversations */}
            <div className="w-80 bg-white/95 backdrop-blur-md border-r border-gray-100 flex flex-col shadow-[2px_0_10px_-3px_rgba(0,0,0,0.05)] z-20">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">Messages</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-sm">
                            No conversations yet.
                        </div>
                    ) : (
                        conversationsWithOtherUser.map(conv => (
                            <button
                                key={conv.id}
                                onClick={() => setSelectedConvId(conv.id)}
                                className={`w-[calc(100%-16px)] mx-2 my-1 p-3 flex items-center gap-3 rounded-2xl transition-all ${
                                    String(selectedConvId) === String(conv.id) 
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                                    : 'hover:bg-gray-50 bg-transparent'
                                }`}
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold shrink-0 ${
                                    String(selectedConvId) === String(conv.id)
                                    ? 'bg-white/20 text-white'
                                    : 'bg-blue-100 text-blue-600'
                                }`}>
                                    {conv.other_user_avatar}
                                </div>
                                <div className="text-left overflow-hidden">
                                    <h4 className={`font-semibold truncate ${
                                        String(selectedConvId) === String(conv.id) ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        {conv.other_user_name}
                                    </h4>
                                    <p className={`text-xs truncate mt-0.5 font-medium ${
                                        String(selectedConvId) === String(conv.id) ? 'text-blue-100' : 'text-gray-500'
                                    }`}>
                                        {conv.last_message || 'Start chatting...'}
                                    </p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
                {selectedConvId ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 sm:px-6 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] sticky top-0 z-10 flex items-center gap-4">
                            <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg shadow-sm border border-white">
                                {selectedConv?.other_user_name?.charAt(0) || '?'}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">{selectedConv?.other_user_name}</h3>
                                <p className="text-xs text-green-500 font-bold flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span> Online</p>
                            </div>
                        </div>

                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                            {loading ? (
                                <div className="flex justify-center py-10">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                            ) : (
                                messages.map((msg, i) => {
                                    if (msg.type === 'SYSTEM') {
                                        return (
                                            <div key={msg.id || i} className="flex justify-center my-2">
                                                <div className="bg-gray-200/50 text-gray-600 text-[11px] px-3 py-1 rounded-full border border-gray-100 italic">
                                                    {msg.content}
                                                </div>
                                            </div>
                                        );
                                    }
                                    const isMe = msg.sender_id == user.id;
                                    return (
                                        <div 
                                            key={msg.id || i} 
                                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[75%] px-5 py-3 rounded-[1.25rem] text-[15px] ${
                                                isMe 
                                                    ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 rounded-br-sm' 
                                                    : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'
                                            }`}>
                                                <p className="leading-relaxed">{msg.content}</p>
                                                <div className={`text-[10px] mt-1.5 font-bold ${isMe ? 'text-blue-200 text-right' : 'text-gray-400'}`}>
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-4 sm:p-5 bg-white border-t border-gray-100 flex gap-3 items-center z-10">
                            <div className="flex-1 bg-gray-50/50 hover:bg-white border border-gray-200 rounded-full transition-all focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 flex items-center px-5 py-3 shadow-sm">
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder="Type your message..."
                                    className="w-full bg-transparent outline-none text-[15px] font-medium text-gray-900 placeholder:text-gray-400"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={!messageInput.trim()}
                                className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-10 text-gray-400">
                        <div className="text-6xl mb-4">💬</div>
                        <h3 className="text-lg font-medium">Select a conversation to start chatting</h3>
                        <p className="text-sm">Connect with others to discuss your projects</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messaging;

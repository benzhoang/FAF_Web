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
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Messages</h2>
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
                                className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                                    String(selectedConvId) === String(conv.id) ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                                }`}
                            >
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                                    {conv.other_user_avatar}
                                </div>
                                <div className="text-left overflow-hidden">
                                    <h4 className="font-semibold text-gray-900 truncate">
                                        {conv.other_user_name}
                                    </h4>
                                    <p className="text-xs text-gray-500 truncate mt-0.5">
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
                        <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                {selectedConv?.other_user_name?.charAt(0) || '?'}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{selectedConv?.other_user_name}</h3>
                                <p className="text-xs text-green-500 font-medium">Online</p>
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
                                            <div className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm text-sm ${
                                                isMe 
                                                    ? 'bg-blue-600 text-white rounded-tr-none' 
                                                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                                            }`}>
                                                <p>{msg.content}</p>
                                                <div className={`text-[10px] mt-1 ${isMe ? 'text-blue-100 text-right' : 'text-gray-400'}`}>
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
                        <form onSubmit={handleSend} className="p-4 border-t border-gray-200 flex gap-2">
                            <input
                                type="text"
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                            <button
                                type="submit"
                                disabled={!messageInput.trim()}
                                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <span className="text-lg">➔</span>
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

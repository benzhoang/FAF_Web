import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { chatApi } from '../api/chat.api';
import { notificationApi } from '../api/notification.api';
import { useAuth } from '../auth/AuthContext';
import { useToast } from './ToastContext';

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_URL || 
    (import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/?$/, '')) || 
    "http://localhost:5000";

const ChatContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChatContext must be used within a ChatProvider');
    }
    return context;
};

export const ChatProvider = ({ children }) => {
    console.log('--- CHAT_PROVIDER RENDERED ---');
    const { user } = useAuth();
    const toast = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [activeConvId, setActiveConvId] = useState(null);
    const [minimized, setMinimized] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0); // For messages
    const [unreadNotifications, setUnreadNotifications] = useState(0); // For system notifications
    const socketRef = useRef(null);

    // Persist activeConvId in a ref for the socket listener
    const activeConvIdRef = useRef(activeConvId);
    useEffect(() => {
        activeConvIdRef.current = activeConvId;
        // Reset unread count when opening a conversation
        if (activeConvId && isOpen) {
            setUnreadCount(0);
        }
    }, [activeConvId, isOpen]);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token || !user) {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            return;
        }

        if (!socketRef.current) {
            console.log('ChatProvider: Connecting to socket...', SOCKET_SERVER_URL);
            socketRef.current = io(SOCKET_SERVER_URL, { auth: { token } });

            socketRef.current.on('receive_message', (message) => {
                // Ignore own messages
                if (String(message.sender_id) === String(user.id)) return;

                // Increment unread count if not viewing
                const isViewingThisConv = isOpen && String(activeConvIdRef.current) === String(message.conversation_id);
                
                if (!isViewingThisConv) {
                    setUnreadCount(prev => prev + 1);
                    // Show toast notification
                    toast.info(`New message: ${message.content.substring(0, 30)}${message.content.length > 30 ? '...' : ''}`);
                }
            });

            socketRef.current.on('new_notification', (notification) => {
                // Show toast for system notifications
                toast.success(`${notification.title}: ${notification.message}`, 5000);
                setUnreadNotifications(prev => prev + 1);
            });

            // Fetch initial counts
            const fetchInitialCounts = async () => {
                try {
                    const [chatRes, notifRes] = await Promise.all([
                        chatApi.getConversations(),
                        notificationApi.getNotifications()
                    ]);
                    
                    if (chatRes?.data) {
                        const totalUnreadMsg = chatRes.data.reduce((sum, conv) => sum + (conv.unread_count || 0), 0);
                        setUnreadCount(totalUnreadMsg);
                    }

                    if (notifRes?.data) {
                        const unreadNotifs = notifRes.data.filter(n => !n.is_read).length;
                        setUnreadNotifications(unreadNotifs);
                    }
                } catch (error) {
                    console.error("Failed to fetch initial unread counts:", error);
                }
            };

            fetchInitialCounts();
        }


        return () => {
            // Socket remains connected
        };
    }, [user, isOpen, toast]);

    const openChat = useCallback(async (otherUserId) => {
        try {
            const res = await chatApi.startChat(otherUserId);
            const convId = res?.data?.id;
            if (convId) {
                setActiveConvId(convId);
                setIsOpen(true);
                setMinimized(false);
                setUnreadCount(0);
            }
        } catch (error) {
            console.error('Failed to open chat:', error);
        }
    }, []);

    const toggleChat = useCallback(() => {
        setIsOpen(prev => !prev);
        if (!isOpen) setUnreadCount(0);
    }, [isOpen]);

    const closeChat = useCallback(() => {
        setIsOpen(false);
        setActiveConvId(null);
    }, []);

    const decrementUnreadCount = useCallback((amount = 1) => {
        setUnreadCount(prev => Math.max(0, prev - amount));
    }, []);

    const decrementUnreadNotifications = useCallback((amount = 1) => {
        setUnreadNotifications(prev => Math.max(0, prev - amount));
    }, []);

    // eslint-disable-next-line react-hooks/refs
    const value = {
        isOpen,
        activeConvId,
        minimized,
        unreadCount,
        unreadNotifications,
        socket: socketRef.current,
        setIsOpen,
        setActiveConvId,
        setMinimized,
        setUnreadCount,
        setUnreadNotifications,
        decrementUnreadCount,
        decrementUnreadNotifications,
        openChat,
        toggleChat,
        closeChat
    };

    // eslint-disable-next-line react-hooks/refs
    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};

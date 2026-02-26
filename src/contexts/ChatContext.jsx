import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { chatApi } from '../api/chat.api';
import { useAuth } from '../auth/AuthContext';
import { useToast } from './ToastContext';

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_URL || 
    (import.meta.env.VITE_API_BASE_URL?.replace(/\/api$/, '')) || 
    "http://localhost:5000";

const ChatContext = createContext();

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChatContext must be used within a ChatProvider');
    }
    return context;
};

export const ChatProvider = ({ children }) => {
    const { user } = useAuth();
    const toast = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [activeConvId, setActiveConvId] = useState(null);
    const [minimized, setMinimized] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
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
            });
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

    const value = {
        isOpen,
        activeConvId,
        minimized,
        unreadCount,
        socket: socketRef.current,
        setIsOpen,
        setActiveConvId,
        setMinimized,
        setUnreadCount,
        openChat,
        toggleChat,
        closeChat
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};

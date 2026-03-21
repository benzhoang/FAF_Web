import { useState, useEffect, useCallback, useRef } from 'react';
import { chatApi } from '../api/chat.api';
import { useChatContext } from '../contexts/ChatContext';

export const useChat = (conversationId) => {
    const { socket } = useChatContext();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const conversationIdRef = useRef(conversationId);

    // Update ref when conversationId changes
    useEffect(() => {
        conversationIdRef.current = conversationId;
    }, [conversationId]);

    // Initial load of messages
    useEffect(() => {
        if (!conversationId) return;

        const loadMessages = async () => {
            try {
                setLoading(true);
                const res = await chatApi.getMessages(conversationId);
                setMessages(res?.data ?? []);
            } catch (err) {
                console.error("Failed to load messages:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadMessages();
    }, [conversationId]);

    // Socket.io integration via shared socket from context
    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (message) => {
            console.log('useChat: Received message:', message);
            // IMPORTANT: Only add message if it belongs to the current conversation
            if (String(message.conversation_id) === String(conversationIdRef.current)) {
                setMessages((prev) => {
                    if (prev.some(m => (m.id && m.id === message.id) || (m.created_at === message.created_at && m.content === message.content && m.sender_id === message.sender_id))) return prev;
                    return [...prev, message];
                });
            }
        };

        socket.on('receive_message', handleReceiveMessage);

        // Join the new conversation room
        if (conversationId && socket.connected) {
            socket.emit('join_conversation', conversationId);
        }

        return () => {
            socket.off('receive_message', handleReceiveMessage);
        };
    }, [socket, conversationId]);

    const sendMessage = useCallback((content) => {
        if (!socket || !conversationId) {
            console.warn('Cannot send message: socket not connected or no conversation selected');
            return;
        }

        console.log('Sending message:', { conversationId, content });
        socket.emit('send_message', {
            conversationId,
            content
        });
    }, [socket, conversationId]);

    return { messages, loading, error, sendMessage };
};


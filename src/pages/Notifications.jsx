import React, { useEffect, useState } from 'react';
import { notificationApi } from '../api/notification.api';
import { useToast } from '../contexts/ToastContext';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await notificationApi.getNotifications();
            setNotifications(res.data || []);
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
            toast.error("Failed to load notifications");
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await notificationApi.markAsRead(id);
            setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (err) {
            console.error("Failed to mark as read:", err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationApi.markAllAsRead();
            setNotifications(notifications.map(n => ({ ...n, is_read: true })));
            toast.success("All notifications marked as read");
        } catch (err) {
            console.error("Failed to mark all as read:", err);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'JOB_MATCH': return '✨';
            case 'PROPOSAL_ACCEPTED': return '🎉';
            case 'MILESTONE_SUBMITTED': return '📤';
            case 'MILESTONE_APPROVED': return '✅';
            case 'DISPUTE_RAISED': return '⚖️';
            default: return '🔔';
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                {notifications.some(n => !n.is_read) && (
                    <button 
                        onClick={handleMarkAllAsRead}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading your alerts...</div>
            ) : notifications.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                    <div className="text-4xl mb-4">📭</div>
                    <h3 className="text-lg font-medium text-gray-900">No notifications yet</h3>
                    <p className="text-gray-500">We'll alert you when something important happens.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notif) => (
                        <div 
                            key={notif.id}
                            onClick={() => !notif.is_read && handleMarkAsRead(notif.id)}
                            className={`p-4 rounded-xl border transition-all cursor-pointer flex gap-4 ${
                                notif.is_read 
                                ? 'bg-white border-gray-100 opacity-75' 
                                : 'bg-blue-50 border-blue-100 shadow-sm'
                            }`}
                        >
                            <div className="text-2xl shrink-0">{getIcon(notif.type)}</div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className={`font-bold text-gray-900 ${notif.is_read ? 'font-semibold' : ''}`}>
                                        {notif.title}
                                    </h4>
                                    <span className="text-[10px] text-gray-400">
                                        {new Date(notif.created_at).toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                            </div>
                            {!notif.is_read && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationApi } from '../api/notification.api';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../auth/AuthContext';

const Notifications = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
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

    const handleNotificationClick = async (notif) => {
        if (!notif.is_read) {
            try {
                await notificationApi.markAsRead(notif.id);
                setNotifications(notifications.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
            } catch (err) {
                console.error("Failed to mark as read:", err);
            }
        }
        
        let path = '';
        const data = notif.data || {};
        
        // Define routing based on notification type and current user role
        switch (notif.type) {
            case 'JOB_MATCH':
                path = data.jobId ? `/find-work` : '/find-work';
                break;
            case 'PROPOSAL_RECEIVED':
                path = '/task-owner/jobs';
                break;
            case 'PROPOSAL_ACCEPTED':
            case 'CONTRACT_CREATED':
                path = user?.role === 'employer' ? '/task-owner/contracts' : '/dashboard';
                break;
            case 'CONTRACT_SIGNED':
            case 'CONTRACT_ACTIVATED':
                path = user?.role === 'employer' ? '/task-owner/contracts' : '/my-job';
                break;
            case 'MILESTONE_SUBMITTED':
            case 'CHECKPOINT_SUBMITTED':
                path = user?.role === 'employer' ? '/task-owner/contracts' : '/my-job';
                break;
            case 'MILESTONE_APPROVED':
            case 'CHECKPOINT_APPROVED':
            case 'PAYMENT_RELEASED':
                path = user?.role === 'employer' ? '/task-owner/contracts' : '/my-job';
                break;
            case 'DISPUTE_RAISED':
                path = '/messages';
                break;
            case 'NEW_MESSAGE':
                path = '/messages';
                break;
            default:
                break;
        }

        if (path) {
            navigate(path);
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
        <div className="max-w-4xl mx-auto p-6 min-h-screen text-slate-800 dark:text-slate-200">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
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
                <div className="text-center py-20 text-gray-500 dark:text-slate-400">Loading your alerts...</div>
            ) : notifications.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-gray-300 dark:border-slate-700 shadow-sm">
                    <div className="text-4xl mb-4">📭</div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">No notifications yet</h3>
                    <p className="text-gray-500 dark:text-slate-400">We'll alert you when something important happens.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notif) => (
                        <div 
                            key={notif.id}
                            onClick={() => handleNotificationClick(notif)}
                            className={`p-4 rounded-xl border transition-all cursor-pointer flex gap-4 ${
                                notif.is_read 
                                ? 'bg-white dark:bg-slate-800/50 border-gray-100 dark:border-slate-700/50 opacity-75 hover:bg-gray-50 dark:hover:bg-slate-800' 
                                : 'bg-blue-50 dark:bg-indigo-900/30 border-blue-100 dark:border-indigo-500/30 shadow-sm'
                            }`}
                        >
                            <div className="text-2xl shrink-0">{getIcon(notif.type)}</div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className={`font-bold text-gray-900 dark:text-white ${notif.is_read ? 'font-semibold dark:text-slate-300' : ''}`}>
                                        {notif.title}
                                    </h4>
                                    <span className="text-[10px] text-gray-400 dark:text-slate-500">
                                        {new Date(notif.created_at).toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">{notif.message}</p>
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

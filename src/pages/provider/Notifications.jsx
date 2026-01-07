import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { notificationsAPI } from '../../services/apiService';
import { formatDate } from '../../utils/date';
import { FiBell, FiCheck, FiLoader } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Notifications = () => {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadNotifications();
    }, [user]);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const response = await notificationsAPI.getAll();
            if (response.success) {
                setNotifications(response.data || []);
            } else {
                setError(response.message || 'Failed to load notifications');
            }
        } catch (err) {
            console.error('Error fetching notifications:', err);
            setError(err.message || 'Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            await notificationsAPI.markAsRead([notificationId]);
            setNotifications(prev =>
                prev.map(n =>
                    n.notification_id === notificationId ? { ...n, is_read: true } : n
                )
            );
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

    const markAllAsRead = async () => {
        try {
            const unreadIds = notifications.filter(n => !n.is_read).map(n => n.notification_id);
            if (unreadIds.length > 0) {
                await notificationsAPI.markAsRead(unreadIds);
                setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            }
        } catch (err) {
            console.error('Error marking all notifications as read:', err);
        }
    };

    const locale = i18n.language === 'ar' ? 'ar-LB' : 'en-US';

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <FiLoader className="h-8 w-8 animate-spin text-[#0BA5EC]" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-red-200 dark:border-red-700">
                <p className="text-xl font-bold text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold dark:text-white">{t('common.notifications')}</h1>
                {notifications.some(n => !n.is_read) && (
                    <button
                        onClick={markAllAsRead}
                        className="flex items-center gap-2 px-4 py-2 bg-[#0BA5EC] text-white rounded-lg hover:bg-[#0BA5EC]/90 transition"
                    >
                        <FiCheck className="h-5 w-5" />
                        {t('common.markAllRead')}
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <motion.div
                            key={notification.notification_id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${!notification.is_read ? 'border-l-4 border-[#0BA5EC]' : ''
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-full ${!notification.is_read ? 'bg-[#0BA5EC]' : 'bg-gray-300 dark:bg-gray-600'
                                    }`}>
                                    <FiBell className={`h-6 w-6 ${!notification.is_read ? 'text-white' : 'text-gray-600 dark:text-gray-300'
                                        }`} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold dark:text-white mb-1">
                                        {i18n.language === 'ar'
                                            ? notification.title_ar || notification.titleAr || notification.title
                                            : notification.title_en || notification.titleEn || notification.title}
                                    </h3>
                                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                                        {i18n.language === 'ar'
                                            ? notification.message_ar || notification.messageAr || notification.message
                                            : notification.message_en || notification.messageEn || notification.message}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-500">
                                            {formatDate(notification.created_at || notification.createdAt || notification.sent_at, locale, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                        {!notification.is_read && (
                                            <button
                                                onClick={() => markAsRead(notification.notification_id)}
                                                className="text-sm text-[#0BA5EC] hover:underline"
                                            >
                                                {t('common.markAsRead')}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <FiBell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            {t('common.noNotifications')}
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Notifications;

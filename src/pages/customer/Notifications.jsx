import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { notificationsAPI } from '../../services/apiService';
import { FiBell, FiCheck, FiInfo, FiLoader } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Notifications = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        console.log('=== FETCHING NOTIFICATIONS ===');
        const response = await notificationsAPI.getAll();
        console.log('Notifications response:', response);
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

    fetchNotifications();
  }, [user]);

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

  const markAllRead = async () => {
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

  const locale = i18n.language === 'ar' ? 'ar-SA' : 'en-US';

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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white font-primary">{t('common.notifications')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{t('notification.stayUpdated') || 'Stay updated with your service requests'}</p>
        </div>
        {notifications.some(n => !n.is_read) && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2 bg-[#0BA5EC]/10 text-[#0BA5EC] rounded-xl font-bold hover:bg-[#0BA5EC]/20 transition-colors"
          >
            <FiCheck />
            {t('common.markAllRead')}
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <motion.div
              key={notification.notification_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border-l-4 transition-all hover:shadow-md ${!notification.is_read ? 'border-[#0BA5EC]' : 'border-transparent'
                }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${!notification.is_read ? 'bg-[#0BA5EC]/10 text-[#0BA5EC]' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                  <FiBell className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="text-lg font-bold dark:text-white">
                      {i18n.language === 'ar' ? notification.title_ar || notification.titleAr : notification.title_en || notification.titleEn}
                    </h3>
                    <span className="text-[10px] uppercase font-black text-gray-400">
                      {new Date(notification.created_at || notification.createdAt).toLocaleDateString(locale)}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 font-primary leading-relaxed">
                    {i18n.language === 'ar' ? notification.message_ar || notification.messageAr : notification.message_en || notification.messageEn}
                  </p>

                  {!notification.is_read && (
                    <button
                      onClick={() => markAsRead(notification.notification_id)}
                      className="mt-4 text-xs font-bold text-[#0BA5EC] flex items-center gap-1 hover:underline"
                    >
                      <FiCheck />
                      {t('common.markAsRead')}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700">
            <div className="h-20 w-20 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiBell className="h-10 w-10 text-gray-300" />
            </div>
            <p className="text-xl font-bold text-gray-500">{t('common.noNotifications')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;

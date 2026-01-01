import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiBell, FiUser, FiClock, FiLoader } from 'react-icons/fi';

import { notificationsAPI, usersAPI } from '../../services/apiService';
import { formatDate } from '../../utils/date';
import Table from '../../components/Table/Table';
import Button from '../../components/Button/Button';
import PageTransition from '../../components/PageTransition/PageTransition';

const Notifications = () => {
  const { t, i18n } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    user_id: 'all',
    title: '',
    message: ''
  });

  const isRTL = i18n.language === 'ar';
  const locale = i18n.language === 'ar' ? 'ar-LB' : 'en-US';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [notificationsRes, usersRes] = await Promise.all([
          notificationsAPI.getAll(),
          usersAPI.getAll()
        ]);

        if (notificationsRes.success) {
          setNotifications(notificationsRes.data || []);
        }
        if (usersRes.success) {
          setUsers(usersRes.data || []);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const notificationData = {
        title: formData.title,
        message: formData.message,
        type: 'admin_message'
      };

      if (formData.user_id === 'all') {
        notificationData.send_to_all = true;
      } else {
        notificationData.user_id = parseInt(formData.user_id);
      }

      await notificationsAPI.create(notificationData);

      // Refresh notifications list
      const response = await notificationsAPI.getAll();
      if (response.success) {
        setNotifications(response.data || []);
      }

      alert(formData.user_id === 'all' ? t('common.notificationSentToAll') : t('common.success'));
      resetForm();
    } catch (err) {
      console.error('Error sending notification:', err);
      alert('Error sending notification');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ user_id: 'all', title: '', message: '' });
    setShowForm(false);
  };

  const getUserName = (userId) => {
    if (userId === 'all') return t('common.allUsers');
    const user = users.find(u => u.user_id === userId);
    return user ? `${user.first_name} ${user.last_name}` : t('common.unknownUser');
  };

  const columns = [
    {
      key: 'title',
      label: t('common.title'),
      align: isRTL ? 'text-right' : 'text-left',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            <FiBell className="h-4 w-4" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{row.title}</p>
            <p className="text-sm text-gray-500 line-clamp-1">{row.message}</p>
          </div>
        </div>
      )
    },
    {
      key: 'recipient',
      label: t('common.recipient'),
      align: isRTL ? 'text-right' : 'text-left',
      render: (row) => (
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <FiUser className="h-4 w-4" />
          <span>{getUserName(row.user_id)}</span>
        </div>
      )
    },
    {
      key: 'date',
      label: t('common.date'),
      align: isRTL ? 'text-right' : 'text-left',
      render: (row) => (
        <div className="flex items-center gap-2 text-gray-500">
          <FiClock className="h-4 w-4" />
          <span className="text-sm" dir="ltr">
            {formatDate(row.sent_at, locale, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      )
    }
  ];

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
    <PageTransition variant="fade">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold dark:text-white">{t('dashboard.admin.notifications')}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {t('common.viewDetails')} {notifications.length} {String(t('common.notifications') || '').toLowerCase()}
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            variant="primary"
            leftIcon={isRTL ? null : <FiSend />}
            rightIcon={isRTL ? <FiSend /> : null}
          >
            {t('common.sendNotification')}
          </Button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-6">
                <h2 className="text-xl font-bold dark:text-white mb-6">{t('common.sendNewNotification')}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('common.recipient')}
                    </label>
                    <select
                      value={formData.user_id}
                      onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] dark:bg-gray-700 dark:text-white transition-all"
                    >
                      <option value="all">{t('common.allUsers')}</option>
                      {users.map(user => (
                        <option key={user.user_id} value={user.user_id}>
                          {user.first_name} {user.last_name} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('common.title')}
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] dark:bg-gray-700 dark:text-white transition-all"
                      placeholder={t('common.title')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('common.message')}
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] dark:bg-gray-700 dark:text-white transition-all"
                      placeholder={t('common.message')}
                    />
                  </div>
                  <div className="flex gap-4 justify-end">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={resetForm}
                    >
                      {t('common.cancel')}
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={submitting}
                    >
                      {submitting ? <FiLoader className="animate-spin" /> : t('common.send')}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Table
          columns={columns}
          data={notifications}
          emptyMessage={t('common.noNotifications')}
          hoverable
        />
      </div>
    </PageTransition>
  );
};

export default Notifications;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { requestsAPI } from '../../services/apiService';
import { formatCurrency } from '../../utils/finance';
import { formatDate } from '../../utils/date';
import { FiFileText, FiClock, FiCheckCircle, FiActivity } from 'react-icons/fi';
import PageTransition, { StaggerContainer, ScaleIn } from '../../components/PageTransition/PageTransition';
import Card, { StatCard } from '../../components/Card/Card';

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await requestsAPI.getAll();
        setRequests((res.data || []).slice(0, 5));
      } catch (err) {
        console.error('Error fetching requests:', err);
      }
    };
    if (user) fetchRequests();
  }, [user]);

  const getStatusInfo = (request) => {
    if (!request) return { label: t('status.pending'), icon: FiClock, color: 'text-yellow-600' };

    // Handle status as either a string or an object with a 'values' property
    let statusStr = '';
    if (typeof request.status === 'string') {
      statusStr = request.status;
    } else if (request.status && typeof request.status.values === 'string') {
      statusStr = request.status.values;
    } else if (typeof request.status_id === 'number') {
      // Fallback mapping for status_id to string if status object is missing
      const idToName = { 1: 'pending', 2: 'accepted', 3: 'completed', 4: 'cancelled' };
      statusStr = idToName[request.status_id] || '';
    }

    const statusId = parseInt(request.status_id);

    const statusMap = {
      'pending': { label: t('status.pending'), icon: FiClock, color: 'text-yellow-600 dark:text-yellow-500' },
      'accepted': { label: t('status.inProgress'), icon: FiClock, color: 'text-blue-600 dark:text-blue-500' },
      'in_progress': { label: t('status.inProgress'), icon: FiClock, color: 'text-blue-600 dark:text-blue-500' },
      'completed': { label: t('status.completed'), icon: FiCheckCircle, color: 'text-green-600 dark:text-green-500' },
      'cancelled': { label: t('status.cancelled'), icon: FiFileText, color: 'text-red-600 dark:text-red-500' },
      'rejected': { label: t('status.rejected') || t('status.cancelled'), icon: FiFileText, color: 'text-red-600 dark:text-red-500' }
    };

    // Try string status first (safely)
    const normalizedStatus = String(statusStr || '').toLowerCase();
    if (normalizedStatus && statusMap[normalizedStatus]) {
      return statusMap[normalizedStatus];
    }

    // Fall back to numeric status_id
    const statusIdMap = {
      1: statusMap['pending'],
      2: statusMap['in_progress'],
      3: statusMap['completed'],
      4: statusMap['cancelled']
    };
    return statusIdMap[statusId] || statusMap['pending'];
  };

  const locale = i18n.language === 'ar' ? 'ar-LB' : 'en-US';

  const getFilteredRequestsCount = (filterType) => {
    return requests.filter(r => {
      const sId = parseInt(r.status_id);
      const sVal = (typeof r.status === 'string' ? r.status : r.status?.values || '').toLowerCase();

      if (filterType === 'inProgress') {
        return sId === 2 || sVal === 'accepted' || sVal === 'in_progress';
      }
      if (filterType === 'completed') {
        return sId === 3 || sVal === 'completed';
      }
      return false;
    }).length;
  };

  return (
    <PageTransition variant="fade">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">{t('dashboard.customer.title')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{t('dashboard.welcome', { name: user?.first_name })}</p>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ScaleIn>
            <StatCard
              title={t('dashboard.customer.totalRequests')}
              value={requests.length}
              icon={<FiFileText className="h-6 w-6" />}
              trend="neutral"
            />
          </ScaleIn>
          <ScaleIn>
            <StatCard
              title={t('dashboard.customer.inProgress')}
              value={getFilteredRequestsCount('inProgress')}
              icon={<FiClock className="h-6 w-6" />}
              trend="neutral"
            />
          </ScaleIn>
          <ScaleIn>
            <StatCard
              title={t('dashboard.customer.completed')}
              value={getFilteredRequestsCount('completed')}
              icon={<FiCheckCircle className="h-6 w-6" />}
              trend="up"
              change={t('common.details')}
            />
          </ScaleIn>
        </StaggerContainer>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card
            title={t('dashboard.customer.recentRequests')}
            icon={<FiActivity />}
            action={
              <Link
                to="/customer/requests"
                className="text-[#0BA5EC] hover:underline text-sm font-medium"
              >
                {t('dashboard.customer.viewAll')}
              </Link>
            }
          >
            <div className="space-y-4">
              {requests.length > 0 ? (
                requests.map((request) => {
                  const status = getStatusInfo(request);
                  const StatusIcon = status.icon;
                  return (
                    <div key={request.request_id} className="group border-b dark:border-gray-700 last:border-0 pb-4 last:pb-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 -mx-4 px-4 py-2 transition-colors rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold dark:text-white text-lg">{t('request.requestNumber', { number: request.request_id })}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">{request.details || t('common.noDetails')}</p>
                          <p className="text-xs text-gray-500 mt-2" dir="ltr">
                            {formatDate(request.request_date, locale, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center justify-end gap-2 mb-2">
                            <StatusIcon className={`h-5 w-5 ${status.color}`} />
                            <span className={`${status.color} font-bold text-sm`}>{status.label}</span>
                          </div>
                          <p className="font-bold text-gray-900 dark:text-white">
                            {formatCurrency(request.price || 0, 'USD', locale)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                  {t('request.noRequests')}
                </div>
              )}
            </div>
          </Card>

          <Card
            title={t('common.notifications')}
            icon={<FiActivity />}
            action={
              <Link
                to="/customer/notifications"
                className="text-[#0BA5EC] hover:underline text-sm font-medium"
              >
                {t('dashboard.customer.viewAll')}
              </Link>
            }
          >
            <div className="space-y-4">
              {[1].map((_, i) => (
                <div key={i} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-[#0BA5EC]">
                    <FiActivity className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold dark:text-white text-sm">{t('notification.welcomeTitle')}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{t('notification.welcomeMessage')}</p>
                    <p className="text-[10px] text-gray-500 mt-1">{t('common.justNow')}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;

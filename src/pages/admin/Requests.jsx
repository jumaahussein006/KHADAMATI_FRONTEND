import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiFilter, FiCheckCircle, FiClock, FiX, FiAlertCircle } from 'react-icons/fi';

import { requestsAPI, usersAPI, servicesAPI } from '../../services/apiService';
import { getServiceName } from '../../utils/langHelper';
import Table from '../../components/Table/Table';
import Badge from '../../components/Badge/Badge';
import Button from '../../components/Button/Button';
import PageTransition from '../../components/PageTransition/PageTransition';

const Requests = () => {
  const { t, i18n } = useTranslation();
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [requestsRes, usersRes, servicesRes] = await Promise.all([
          requestsAPI.getAll(),
          usersAPI.getAll(),
          servicesAPI.getAll()
        ]);

        setRequests(requestsRes.data);
        setUsers(usersRes.data);
        setServices(servicesRes.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(t('errors.networkError'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

  const statuses = [
    { id: 1, name: 'Pending', label: t('status.pending'), icon: FiClock, variant: 'pending' },
    { id: 2, name: 'In Progress', label: t('status.inProgress'), icon: FiAlertCircle, variant: 'inProgress' },
    { id: 3, name: 'Completed', label: t('status.completed'), icon: FiCheckCircle, variant: 'completed' },
    { id: 4, name: 'Cancelled', label: t('status.cancelled'), icon: FiX, variant: 'cancelled' }
  ];

  const filteredRequests = statusFilter === 'all'
    ? requests
    : requests.filter(r => {
      const status = statuses.find(s => s.id === r.status_id);
      return status?.name === statusFilter;
    });

  const getStatusInfo = (statusId) => {
    return statuses.find(s => s.id === statusId) || statuses[0];
  };

  const getCustomerName = (customerId) => {
    const user = users.find(u => u.user_id === customerId);
    return user ? `${user.first_name} ${user.last_name}` : t('common.unknownCustomer');
  };

  const getServiceNameById = (serviceId) => {
    const service = services.find(s => (s.service_id === serviceId || s.id === serviceId));
    if (!service) return t('common.unknownService');
    return getServiceName(service, i18n.language);
  };

  // Table columns configuration with perfect alignment
  const columns = [
    {
      key: 'request_id',
      label: t('request.request'),
      align: isRTL ? 'text-right' : 'text-left',
      render: (row) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          #{row.request_id}
        </span>
      )
    },
    {
      key: 'customer',
      label: t('auth.customer'),
      align: isRTL ? 'text-right' : 'text-left',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0BA5EC] to-[#0891D1] flex items-center justify-center text-white font-bold text-sm">
            {getCustomerName(row.customer_id).charAt(0)}
          </div>
          <span className="font-medium">{getCustomerName(row.customer_id)}</span>
        </div>
      )
    },
    {
      key: 'service',
      label: t('dashboard.admin.services'),
      align: isRTL ? 'text-right' : 'text-left',
      render: (row) => (
        <span className="text-gray-700 dark:text-gray-300">
          {getServiceNameById(row.service_id)}
        </span>
      )
    },
    {
      key: 'price',
      label: t('service.price'),
      align: isRTL ? 'text-right' : 'text-left',
      render: (row) => (
        <span className="font-bold text-[#0BA5EC]">
          {row.price} {t('currency.usd')}
        </span>
      )
    },
    {
      key: 'status',
      label: t('common.status'),
      align: isRTL ? 'text-right' : 'text-left',
      render: (row) => {
        const statusInfo = getStatusInfo(row.status_id);
        const Icon = statusInfo.icon;
        return (
          <Badge
            variant={statusInfo.variant}
            icon={<Icon className="h-4 w-4" />}
            animate
          >
            {statusInfo.label}
          </Badge>
        );
      }
    }
  ];

  // Stats cards
  const stats = [
    {
      label: t('status.pending'),
      value: requests.filter(r => r.status_id === 1).length,
      icon: FiClock,
      color: 'text-yellow-600'
    },
    {
      label: t('status.inProgress'),
      value: requests.filter(r => r.status_id === 2).length,
      icon: FiAlertCircle,
      color: 'text-blue-600'
    },
    {
      label: t('status.completed'),
      value: requests.filter(r => r.status_id === 3).length,
      icon: FiCheckCircle,
      color: 'text-green-600'
    },
    {
      label: t('status.cancelled'),
      value: requests.filter(r => r.status_id === 4).length,
      icon: FiX,
      color: 'text-red-600'
    }
  ];

  if (loading) {
    return (
      <PageTransition variant="slideUp">
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
        </div>
      </PageTransition>
    );
  }

  if (error) {
    return (
      <PageTransition variant="slideUp">
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition variant="slideUp">
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              {t('dashboard.admin.requests')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {t('common.viewDetails')} {String(t('request.noRequests') || '').toLowerCase()}
            </p>
          </div>

          {/* Filter Dropdown */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative">
              <FiFilter className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400`} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`
                  ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3
                  border-2 border-gray-200 dark:border-gray-700
                  rounded-xl
                  bg-white dark:bg-gray-800
                  text-gray-900 dark:text-white
                  font-medium
                  focus:ring-2 focus:ring-[#0BA5EC] focus:border-transparent
                  transition-all duration-200
                  hover:border-[#0BA5EC]
                `}
              >
                <option value="all">{t('service.all')}</option>
                {statuses.map(status => (
                  <option key={status.id} value={status.name}>{status.label}</option>
                ))}
              </select>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl bg-gray-100 dark:bg-gray-700 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Requests Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Table
            columns={columns}
            data={filteredRequests}
            emptyMessage={t('request.noRequests')}
            hoverable
          />
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Requests;

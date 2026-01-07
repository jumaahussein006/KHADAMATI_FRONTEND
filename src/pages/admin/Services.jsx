import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiEdit, FiTrash2, FiSearch, FiPackage } from 'react-icons/fi';

import { servicesAPI, categoriesAPI } from '../../services/apiService';
import { getServiceName, getCategoryName } from '../../utils/langHelper';
import { getErrorMessage } from '../../utils/checkBackend';
import Table from '../../components/Table/Table';
import Badge from '../../components/Badge/Badge';
import PageTransition from '../../components/PageTransition/PageTransition';

const Services = () => {
  const { t, i18n } = useTranslation();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [servicesRes, categoriesRes] = await Promise.all([
          servicesAPI.getAll(),
          categoriesAPI.getAll()
        ]);

        setServices(servicesRes.data);
        setCategories(categoriesRes.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

  const filteredServices = services.filter(service => {
    if (!service) return false;
    const serviceName = getServiceName(service, i18n.language).toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    return serviceName.includes(searchLower);
  });

  const getCategoryNameById = (categoryId) => {
    const category = categories.find(c => (c.id === categoryId || c.category_id === categoryId));
    if (!category) return '-';
    return getCategoryName(category, i18n.language);
  };

  const getProviderName = (row) => {
    if (row.provider && row.provider.user) {
      const { user } = row.provider;
      return `${user.first_name} ${user.last_name}`;
    }
    return '-';
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm(t('common.delete') + '?')) {
      try {
        await servicesAPI.delete(serviceId);
        setServices(services.filter(s => (s.service_id || s.id) !== serviceId));
        alert(t('success.changesSaved'));
      } catch (err) {
        console.error('Error deleting service:', err);
        alert(t('errors.tryAgain'));
      }
    }
  };

  // Table Columns
  const columns = [
    {
      key: 'title',
      label: t('service.title'),
      align: isRTL ? 'text-right' : 'text-left',
      render: (row) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {getServiceName(row, i18n.language)}
        </span>
      )
    },
    {
      key: 'category',
      label: t('service.category'),
      align: isRTL ? 'text-right' : 'text-left',
      render: (row) => (
        <Badge variant="info">
          {getCategoryNameById(row.category_id)}
        </Badge>
      )
    },
    {
      key: 'provider',
      label: t('service.provider'),
      align: isRTL ? 'text-right' : 'text-left',
      render: (row) => (
        <span className="text-gray-700 dark:text-gray-300">
          {getProviderName(row)}
        </span>
      )
    },
    {
      key: 'actions',
      label: t('common.actions'),
      align: 'text-center',
      render: (row) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handleDelete(row.service_id)}
            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title={t('common.delete')}
          >
            <FiTrash2 className="h-5 w-5" />
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <PageTransition variant="fade">
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
        </div>
      </PageTransition>
    );
  }

  if (error) {
    return (
      <PageTransition variant="fade">
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition variant="fade">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold dark:text-white">{t('dashboard.admin.services')}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {t('common.viewDetails')} {services.length} {t('dashboard.admin.services').toLowerCase()}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="relative">
            <FiSearch className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5`} />
            <input
              type="text"
              placeholder={t('common.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`
                w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3
                border-2 border-gray-100 dark:border-gray-700
                rounded-xl
                bg-gray-50 dark:bg-gray-900
                text-gray-900 dark:text-white
                focus:ring-2 focus:ring-[#0BA5EC] focus:border-transparent
                transition-all
              `}
            />
          </div>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          data={filteredServices}
          emptyMessage={t('service.noServices')}
          hoverable
        />
      </div>
    </PageTransition>
  );
};

export default Services;

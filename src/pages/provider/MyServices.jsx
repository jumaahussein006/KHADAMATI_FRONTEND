import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

import { FiPlus, FiEdit, FiTrash2, FiEye, FiPackage } from 'react-icons/fi';
import { servicesAPI, categoriesAPI } from '../../services/apiService';
import { getServiceName, getCategoryName } from '../../utils/langHelper';
import { useAuth } from '../../context/AuthContext';

import Table from '../../components/Table/Table';
import Badge from '../../components/Badge/Badge';
import Button from '../../components/Button/Button';
import PageTransition from '../../components/PageTransition/PageTransition';

const MyServices = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isRTL = i18n.language === 'ar';

  const providerId = useMemo(
    () => user?.provider_id || user?.providerid || user?.roleId || user?.user_id,
    [user]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [servicesRes, categoriesRes] = await Promise.all([
          servicesAPI.getAll({ provider_id: providerId }),
          categoriesAPI.getAll(),
        ]);

        setServices(servicesRes.data || []);
        setCategories(categoriesRes.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError(t('errors.networkError'));
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [user, providerId, t]);

  const handleDelete = async (serviceId) => {
    if (!window.confirm(`${t('common.delete')}?`)) return;

    try {
      await servicesAPI.delete(serviceId);
      setServices((prev) => prev.filter((s) => (s.service_id ?? s.id) !== serviceId));
      alert(t('success.changesSaved'));
    } catch (err) {
      console.error('Error deleting service:', err);
      alert(t('errors.tryAgain'));
    }
  };

  const getCategoryNameById = (categoryId) => {
    const category = categories.find(c => (c.category_id ?? c.id) === categoryId);
    return category ? getCategoryName(category, i18n.language) : t('common.unknown');
  };

  const columns = [
    {
      key: 'title',
      label: t('service.title'),
      align: isRTL ? 'text-right' : 'text-left',
      render: (row) => (
        <div>
          <div className="font-bold dark:text-white">{getServiceName(row, i18n.language)}</div>
          <div className="text-sm text-gray-500">{row.description_ar || row.description_en || row.description || ''}</div>
        </div>
      ),
    },
    {
      key: 'category',
      label: t('service.category'),
      align: isRTL ? 'text-right' : 'text-left',
      render: (row) => (
        <Badge variant="neutral">
          {row.category ? getCategoryName(row.category, i18n.language) : t('common.unknown')}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: t('common.actions'),
      align: 'text-right',
      render: (row) => {
        const id = row.serviceId || row.service_id || row.id;
        return (
          <div className="flex justify-end gap-2">
            <Link to={`/services/${id}`}>
              <Button size="sm" variant="secondary" icon={FiEye}>
                {t('common.viewDetails')}
              </Button>
            </Link>
            <Link to={`/provider/services/edit/${id}`}>
              <Button size="sm" variant="primary" icon={FiEdit}>
                {t('common.edit')}
              </Button>
            </Link>
            <Button size="sm" variant="danger" icon={FiTrash2} onClick={() => handleDelete(id)}>
              {t('common.delete')}
            </Button>
          </div>
        );
      },
    },
  ];

  if (loading) {
    return <div className="py-16 text-center">{t('common.loading')}</div>;
  }

  if (error) {
    return <div className="py-16 text-center text-red-600">{error}</div>;
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold dark:text-white">{t('provider.myServices')}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('common.viewDetails')} {services.length} {String(t('common.services') || '').toLowerCase()}
            </p>
          </div>

          <Link to="/provider/services/add">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button icon={FiPlus}>{t('service.addService')}</Button>
            </motion.div>
          </Link>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <FiPackage className="h-10 w-10 mx-auto mb-3 opacity-60" />
            {t('provider.noServices')}
          </div>
        ) : (
          <Table columns={columns} data={services} />
        )}
      </div>
    </PageTransition>
  );
};

export default MyServices;

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiCreditCard, FiCheckCircle, FiXCircle, FiDollarSign, FiTrendingUp, FiLoader } from 'react-icons/fi';

import { paymentsAPI } from '../../services/apiService';
import { formatCurrency } from '../../utils/finance';
import { formatDate } from '../../utils/date';
import Table from '../../components/Table/Table';
import Badge from '../../components/Badge/Badge';
import PageTransition from '../../components/PageTransition/PageTransition';

const Payments = () => {
  const { t, i18n } = useTranslation();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const response = await paymentsAPI.getAll();
        if (response.success) {
          setPayments(response.data || []);
        } else {
          setError(response.message || 'Failed to load payments');
        }
      } catch (err) {
        console.error('Error fetching payments:', err);
        setError(err.message || 'Failed to load payments');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const locale = i18n.language === 'ar' ? 'ar-LB' : 'en-US';

  // Separate payments by currency
  const usdPayments = payments.filter(p => p.currency === 'USD' || !p.currency);
  const lbpPayments = payments.filter(p => p.currency === 'LBP');

  // Calculate totals
  const usdTotal = usdPayments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
  const lbpTotal = lbpPayments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

  // Payment columns factory
  const createColumns = (currencyCode) => [
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
      key: 'amount',
      label: t('payment.amount'),
      align: isRTL ? 'text-right' : 'text-left',
      render: (row) => (
        <span className="font-bold text-[#0BA5EC] text-lg">
          {formatCurrency(row.amount, currencyCode, locale)}
        </span>
      )
    },
    {
      key: 'method',
      label: t('payment.method'),
      align: isRTL ? 'text-right' : 'text-left',
      render: (row) => (
        <div className="flex items-center gap-2">
          <FiCreditCard className="h-5 w-5 text-gray-400" />
          <span className="text-gray-700 dark:text-gray-300">{row.method}</span>
        </div>
      )
    },
    {
      key: 'status',
      label: t('common.status'),
      align: isRTL ? 'text-right' : 'text-left',
      render: (row) => (
        <Badge
          variant={row.status === 'Completed' || row.status === 'completed' ? 'completed' : 'cancelled'}
          icon={row.status === 'Completed' || row.status === 'completed' ? <FiCheckCircle className="h-4 w-4" /> : <FiXCircle className="h-4 w-4" />}
          animate
        >
          {row.status === 'Completed' || row.status === 'completed' ? t('status.completed') : t('status.cancelled')}
        </Badge>
      )
    },
    {
      key: 'date',
      label: t('common.date'),
      align: isRTL ? 'text-right' : 'text-left',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-400">
          {formatDate(row.transaction_date || row.create_at, locale, { year: 'numeric', month: 'short', day: 'numeric' })}
        </span>
      )
    }
  ];

  // Payment section component
  const PaymentSection = ({ paymentsData, currencyLabel, currencyCode, color }) => {
    const total = paymentsData.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    const completed = paymentsData.filter(p => p.status === 'Completed' || p.status === 'completed').length;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Section Header Card */}
        <div className={`bg-gradient-to-r ${color} rounded-2xl p-6 shadow-xl`}>
          <div className="flex items-center justify-between text-white">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FiDollarSign className="h-8 w-8" />
                <h2 className="text-2xl font-bold">{currencyLabel}</h2>
              </div>
              <p className="text-white/80">
                {paymentsData.length} {t('payment.title').toLowerCase()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/80 mb-1">{t('payment.total')}</p>
              <p className="text-3xl font-bold">
                {formatCurrency(total, currencyCode, locale)}
              </p>
              <p className="text-sm text-white/90 mt-2">
                <FiCheckCircle className="inline h-4 w-4 mr-1" />
                {completed} {t('status.completed').toLowerCase()}
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        <Table
          columns={createColumns(currencyCode)}
          data={paymentsData}
          emptyMessage={t('payment.noPayments')}
          hoverable
        />
      </motion.div>
    );
  };

  // Stats cards
  const stats = [
    {
      label: t('payment.total') + ' (USD)',
      value: formatCurrency(usdTotal, 'USD', locale),
      icon: FiDollarSign,
      trend: '+12%',
      color: 'from-green-500 to-green-600'
    },
    {
      label: t('payment.total') + ' (LBP)',
      value: formatCurrency(lbpTotal, 'LBP', locale),
      icon: FiDollarSign,
      trend: '+8%',
      color: 'from-blue-500 to-blue-600'
    },
    {
      label: t('status.completed'),
      value: payments.filter(p => p.status === 'Completed' || p.status === 'completed').length,
      icon: FiCheckCircle,
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      label: t('dashboard.admin.payments'),
      value: payments.length,
      icon: FiTrendingUp,
      color: 'from-purple-500 to-purple-600'
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
    <PageTransition variant="slideUp">
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {t('dashboard.admin.payments')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('common.viewDetails')} {t('payment.title').toLowerCase()}
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className={`bg-gradient-to-br ${stat.color} rounded-xl p-4 lg:p-6 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="text-sm opacity-90 mb-1">{stat.label}</p>
                  <p className="text-2xl lg:text-3xl font-bold">{stat.value}</p>
                  {stat.trend && (
                    <p className="text-xs mt-2 opacity-80">
                      <FiTrendingUp className="inline h-3 w-3 mr-1" />
                      {stat.trend}
                    </p>
                  )}
                </div>
                <stat.icon className="h-8 w-8 opacity-80" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* USD Payments Section */}
        <PaymentSection
          paymentsData={usdPayments}
          currencyLabel={t('admin.payments.titleUSD')}
          currencyCode="USD"
          color="from-green-500 to-green-600"
        />

        {/* LBP Payments Section */}
        <PaymentSection
          paymentsData={lbpPayments}
          currencyLabel={t('admin.payments.titleLBP')}
          currencyCode="LBP"
          color="from-blue-500 to-blue-600"
        />
      </div>
    </PageTransition>
  );
};

export default Payments;

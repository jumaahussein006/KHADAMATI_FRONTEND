import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  FiUsers,
  FiShoppingBag,
  FiDollarSign,
  FiActivity
} from 'react-icons/fi';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { adminAPI, requestsAPI, paymentsAPI, servicesAPI, dashboardAPI } from '../../services/apiService';
import PageTransition, { FadeInUp } from '../../components/PageTransition/PageTransition';
import { StatCard } from '../../components/Card/Card';

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRequests: 0,
    totalRevenue: 0,
    activeServices: 0,
    monthlyGrowth: {
      users: '0%',
      requests: '0%',
      revenue: '0%'
    }
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    calculateStats();
  }, [i18n.language]);

  const calculateStats = async () => {
    try {
      setLoading(true);
      const [statsRes] = await Promise.all([
        adminAPI.getStats()
      ]);

      const data = statsRes.data;
      const { totals, monthlyData } = data;

      setStats({
        totalUsers: totals.users,
        totalRequests: totals.requests,
        totalRevenue: totals.revenue,
        activeServices: totals.services,
        monthlyGrowth: {
          users: '+10%', // Usually calculated or returned by API
          requests: '+5%',
          revenue: '+15%'
        }
      });
      setChartData(monthlyData);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(t('errors.networkError'));
    } finally {
      setLoading(false);
    }
  };

  const processMonthlyData = (users, requests) => {
    const months = {};
    const monthNames = [
      t('months.january'), t('months.february'), t('months.march'), t('months.april'),
      t('months.may'), t('months.june'), t('months.july'), t('months.august'),
      t('months.september'), t('months.october'), t('months.november'), t('months.december')
    ];

    // Helper to get month key
    const getMonthKey = (dateStr) => {
      const date = new Date(dateStr);
      return `${date.getFullYear()}-${date.getMonth()}`;
    };

    // Initialize last 6 months
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      months[key] = {
        name: monthNames[d.getMonth()],
        users: 0,
        requests: 0
      };
    }

    // Aggregate Users
    users.forEach(user => {
      const key = getMonthKey(user.create_at || new Date().toISOString());
      if (months[key]) months[key].users++;
    });

    // Aggregate Requests
    requests.forEach(request => {
      const key = getMonthKey(request.request_date);
      if (months[key]) months[key].requests++;
    });

    return Object.values(months);
  };

  const statCards = [
    {
      title: t('dashboard.admin.totalUsers'),
      value: stats.totalUsers,
      change: stats.monthlyGrowth.users,
      icon: <FiUsers />,
      trend: stats.monthlyGrowth.users.includes('+') ? 'up' : 'down'
    },
    {
      title: t('dashboard.admin.totalRequests'),
      value: stats.totalRequests,
      change: stats.monthlyGrowth.requests,
      icon: <FiShoppingBag />,
      trend: stats.monthlyGrowth.requests.includes('+') ? 'up' : 'down'
    },
    {
      title: t('dashboard.admin.payments'),
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: stats.monthlyGrowth.revenue,
      icon: <FiDollarSign />,
      trend: 'up'
    },
    {
      title: t('dashboard.admin.totalServices'),
      value: stats.activeServices,
      icon: <FiActivity />
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
              {t('dashboard.admin.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {new Date().toLocaleDateString(i18n.language === 'ar' ? 'ar-LB' : 'en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <StatCard
                title={stat.title}
                value={stat.value}
                change={stat.change}
                icon={stat.icon}
                trend={stat.trend}
                animate={false}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Statistics Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('dashboard.admin.monthlyStats')}
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#0BA5EC]"></span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('dashboard.admin.users')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('dashboard.admin.requests')}
                  </span>
                </div>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: isRTL ? 10 : 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0BA5EC" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0BA5EC" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:stroke-gray-700" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#0BA5EC"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorUsers)"
                    animationDuration={1500}
                  />
                  <Area
                    type="monotone"
                    dataKey="requests"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRequests)"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              {t('dashboard.admin.recentReports')}
            </h2>
            <div className="space-y-4">
              {/* Activity Items */}
              <FadeInUp delay={0.5}>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white flex-shrink-0">
                    <FiUsers className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {t('activity.newUserRegistered')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {t('activity.minutesAgo', { count: 2 })}
                    </p>
                  </div>
                </div>
              </FadeInUp>

              <FadeInUp delay={0.6}>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center text-white flex-shrink-0">
                    <FiShoppingBag className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {t('activity.newServiceRequest')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {t('activity.minutesAgo', { count: 15 })}
                    </p>
                  </div>
                </div>
              </FadeInUp>

              <FadeInUp delay={0.7}>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center text-white flex-shrink-0">
                    <FiDollarSign className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {t('activity.paymentReceived')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {t('activity.hoursAgo', { count: 1 })}
                    </p>
                  </div>
                </div>
              </FadeInUp>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;

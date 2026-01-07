import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import api, { UPLOAD_URL } from '../../utils/api';

import { formatCurrency } from '../../utils/finance';
import { formatDate } from '../../utils/date';

import {
  FiFileText,
  FiDollarSign,
  FiStar,
  FiActivity,
  FiAward,
  FiLoader
} from 'react-icons/fi';

import PageTransition, { StaggerContainer, ScaleIn } from '../../components/PageTransition/PageTransition';
import Card, { StatCard } from '../../components/Card/Card';

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${UPLOAD_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [stats, setStats] = useState({
    requests: 0,
    earningsUSD: 0,
    earningsLBP: 0,
    rating: 4.8,
    totalServices: 0,
  });

  const locale = i18n.language === 'ar' ? 'ar-LB' : 'en-US';

  const providerId = useMemo(
    () => user?.provider_id || user?.providerid || user?.roleId,
    [user]
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Provider requests endpoint: GET /requests/provider [file:62]
        let providerRequests = [];
        try {
          const r = await api.get('/requests/provider');
          providerRequests = r.data?.data || r.data?.rows || r.data?.data?.rows || r.data || [];
        } catch (e) {
          console.error('Provider requests error:', e);
          providerRequests = [];
        }

        setRequests(Array.isArray(providerRequests) ? providerRequests : []);

        // Provider payments endpoint: GET /payments/provider-payments [file:64]
        let providerPayments = [];
        try {
          const p = await api.get('/payments/provider-payments');
          providerPayments = p.data?.data || p.data || [];
        } catch (e) {
          console.log('No provider payments yet');
          providerPayments = [];
        }

        // Earnings (based on completed requests)
        const completed = (providerRequests || []).filter(r => r.status === 'completed');
        const paidCompleted = completed.filter(req => {
          const pid = req.request_id ?? req.requestId ?? req.id;
          return (providerPayments || []).some(pay => (pay.request_id ?? pay.requestId) === pid);
        });

        const totalUSD = paidCompleted.reduce((sum, r) => sum + (parseFloat(r.price) || 0), 0);
        const totalLBP = totalUSD * 89000;

        // Provider services count (GET /services?provider_id=...) [service routes support provider filter]
        let servicesTotal = 0;
        try {
          const s = await api.get(`/services?provider_id=${encodeURIComponent(providerId || '')}`);
          const services = s.data?.data || s.data || [];
          servicesTotal = Array.isArray(services) ? services.length : 0;
        } catch (e) {
          console.log('Services count error');
        }

        // Certificates list (public route is /certificates/provider/:providerId) [file:57]
        let certs = [];
        try {
          if (providerId) {
            const c = await api.get(`/certificates/provider/${providerId}`);
            certs = c.data?.data || c.data || [];
          }
        } catch (e) {
          console.log('Certificates fetch error');
        }

        setCertificates(Array.isArray(certs) ? certs : []);

        setStats({
          requests: (providerRequests || []).length,
          earningsUSD: totalUSD,
          earningsLBP: totalLBP,
          rating: 4.8,
          totalServices: servicesTotal,
        });
      } catch (err) {
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, providerId]);

  const recentRequests = (requests || []).slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FiLoader className="h-8 w-8 animate-spin text-[#0BA5EC]" />
      </div>
    );
  }

  return (
    <PageTransition variant="fade">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">{t('dashboard.provider.title')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('dashboard.welcome', { name: user?.first_name || user?.firstname || '' })}
          </p>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <ScaleIn>
            <StatCard title={t('dashboard.admin.totalServices')} value={stats.totalServices} icon={FiActivity} trend="neutral" change={t('common.view')} />
          </ScaleIn>
          <ScaleIn>
            <StatCard title={t('dashboard.provider.requests')} value={stats.requests} icon={FiFileText} trend="neutral" change={t('common.details')} />
          </ScaleIn>
          <ScaleIn>
            <StatCard title={t('provider.earningsUSD')} value={formatCurrency(stats.earningsUSD, 'USD', locale)} icon={FiDollarSign} trend="up" change="12% this month" />
          </ScaleIn>
          <ScaleIn>
            <StatCard title={t('provider.earningsLBP')} value={formatCurrency(stats.earningsLBP, 'LBP', locale)} icon={FiDollarSign} trend="neutral" />
          </ScaleIn>
          <ScaleIn>
            <StatCard title={t('dashboard.provider.rating')} value={stats.rating} icon={FiStar} trend="up" change="Top Rated" />
          </ScaleIn>
        </StaggerContainer>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card title={t('dashboard.provider.recentRequests')} icon={FiActivity}>
            <div className="space-y-4">
              {recentRequests.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  {t('request.noRequests')}
                </div>
              ) : (
                recentRequests.map((request) => {
                  const id = request.request_id ?? request.requestId ?? request.id;
                  return (
                    <div key={id} className="group border-b dark:border-gray-700 last:border-0 pb-4 last:pb-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 -mx-4 px-4 py-2 transition-colors rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold dark:text-white text-lg">
                            {t('request.requestNumber', { number: id })}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                            {request.details || t('common.noDetails')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#0BA5EC]">
                            {formatCurrency(request.price || 0, 'USD', locale)}
                          </p>
                          <p className="text-sm text-gray-500 mt-1 dir-ltr">
                            {formatDate(request.request_date, locale, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>

          <Card title={t('provider.profile.certificates')} icon={FiAward}>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {certificates.length === 0 ? (
                <div className="col-span-full py-12 text-center text-gray-400">
                  {t('common.noCertificates')}
                </div>
              ) : (
                certificates.map((cert) => (
                  <div key={cert.certificate_id ?? cert.certificateId} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
                    <img src={getImageUrl(cert.image)} alt="Certificate" className="w-full h-full object-cover" />
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;

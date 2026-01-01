import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import SearchBar from '../components/SearchBar/SearchBar';
import ServiceCard from '../components/ServiceCard/ServiceCard';
import ProviderCard from '../components/ProviderCard/ProviderCard';
import { servicesAPI, categoriesAPI, providersAPI } from '../services/apiService';
import { getErrorMessage } from '../utils/checkBackend';
import PageTransition, { StaggerContainer, FadeInUp, ScaleIn } from '../components/PageTransition/PageTransition';
import {
  FiDroplet,
  FiZap,
  FiTool,
  FiFeather,
  FiHome,
  FiSun,
  FiWind,
  FiTruck,
  FiCheckCircle,
  FiStar,
  FiAward,
  FiShield
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import heroBg from '../assets/hero-bg.jpg';
import { useAuth } from '../context/AuthContext';

// Category icon mapping
const categoryIcons = {
  'سباكة': FiDroplet,
  'Plumbing': FiDroplet,
  'كهرباء': FiZap,
  'Electricity': FiZap,
  'نجارة': FiTool,
  'Carpentry': FiTool,
  'دهان': FiFeather,
  'Painting': FiFeather,
  'نظافة': FiHome,
  'Cleaning': FiHome,
  'بستنة': FiSun,
  'Gardening': FiSun,
  'تكييف': FiWind,
  'Air Conditioning': FiWind,
  'نقل': FiTruck,
  'Moving': FiTruck,
  'مكافحة حشرات': FiShield,
  'Pest Control': FiShield,
};

const Home = () => {
  const { t, i18n } = useTranslation();
  const { isProvider, isAuthenticated } = useAuth();
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('[HOME] Fetching data from APIs...');

        const [servicesRes, categoriesRes, providersRes] = await Promise.all([
          servicesAPI.getAll(),
          categoriesAPI.getAll(),
          providersAPI.getAll()
        ]);

        console.log('[HOME] Categories Response:', categoriesRes);
        console.log('[HOME] Categories Data:', categoriesRes.data);
        console.log('[HOME] Services Response:', servicesRes);
        console.log('[HOME] Services Data:', servicesRes.data);

        // Handle services data - API returns nested structure
        const servicesArray = Array.isArray(servicesRes.data)
          ? servicesRes.data
          : (servicesRes.data?.services || []);

        setServices(servicesArray.slice(0, 3));
        setCategories(categoriesRes.data || []);
        setProviders(providersRes.data.slice(0, 3));
        setError(null);

        console.log('[HOME] ✅ Data loaded successfully');
      } catch (err) {
        console.error('[HOME] ❌ Error fetching data:', err);
        console.error('[HOME] Error details:', {
          message: err.message,
          response: err.response,
          status: err.response?.status,
          data: err.response?.data
        });
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

  const getCategoryIcon = (categoryName) => {
    return categoryIcons[categoryName] || FiHome;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF9F6] to-white dark:from-gray-950 dark:to-gray-900 transition-colors duration-300">
      <Navbar />

      <PageTransition variant="fade">

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[#FAF9F6] dark:bg-gray-950 py-32 lg:py-48 border-b border-gray-100 dark:border-gray-800">
          {/* Background Image with Depth Overlays */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.img
              initial={{ scale: 1.05, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              src={heroBg}
              alt="Hero Background"
              className="absolute inset-0 h-full w-full object-cover object-center opacity-90 dark:opacity-40"
              style={{ filter: 'brightness(1.05) contrast(1.02)' }}
            />
            {/* Subtle warm overlay to blend with the white sections below */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F6] via-[#FAF9F6]/20 to-transparent dark:from-gray-950 dark:via-gray-950/20"></div>
            {/* Softening the center a bit for text clarity */}
            <div className="absolute inset-0 bg-white/10 dark:bg-black/10 backdrop-blur-[1px]"></div>
          </div>

          <div className="relative mx-auto max-w-6xl px-4 text-center z-10">
            {/* New Primary Branding Component */}
            <motion.div
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8"
            >
              <h2 className="text-7xl md:text-9xl lg:text-[10rem] font-black tracking-tighter leading-none mb-4 select-none">
                <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#0BA5EC] via-[#0070E3] to-[#0BA5EC] animate-gradient-x drop-shadow-[0_20px_20px_rgba(11,165,236,0.2)] uppercase">
                  {t('home.brandName')}
                </span>
              </h2>
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "120px", opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="h-2 mx-auto bg-gradient-to-r from-[#0BA5EC] to-[#0891D1] rounded-full"
              ></motion.div>
            </motion.div>

            {/* Existing Sub-Hero Title */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.95 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="mb-10 text-xl md:text-3xl lg:text-4xl font-extrabold text-gray-800 dark:text-gray-100 leading-tight tracking-tight max-w-4xl mx-auto text-balance"
            >
              {t('home.heroTitle')}
            </motion.h1>

            {/* Existing Hero Subtitle Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="mx-auto mb-14 max-w-3xl text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-medium"
            >
              {t('home.heroSubtitle')}
            </motion.p>

            {/* Search Bar - Maintained */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="mx-auto max-w-3xl relative"
            >
              <div className="absolute -inset-4 bg-[#0BA5EC]/5 blur-3xl rounded-full opacity-50"></div>
              <SearchBar />
            </motion.div>

            {/* Metrics - Maintained and Enhanced */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto border-t border-gray-100 dark:border-gray-800 pt-12"
            >
              <div className="text-center group cursor-default">
                <div className="text-3xl lg:text-5xl font-black text-[#0BA5EC] mb-2 group-hover:scale-110 transition-transform duration-300">500+</div>
                <div className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">{t('common.services')}</div>
              </div>
              <div className="text-center group cursor-default">
                <div className="text-3xl lg:text-5xl font-black text-[#0BA5EC] mb-2 group-hover:scale-110 transition-transform duration-300">1000+</div>
                <div className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">{t('dashboard.customer.customer')}</div>
              </div>
              <div className="text-center group cursor-default">
                <div className="text-3xl lg:text-5xl font-black text-[#0BA5EC] mb-2 group-hover:scale-110 transition-transform duration-300">4.9</div>
                <div className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                  <FiStar className="h-4 w-4 fill-yellow-400 text-yellow-500 group-hover:rotate-12 transition-transform" />
                  {t('provider.rating')}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Top Categories */}
        <section className="py-20 relative">
          <div className="mx-auto max-w-7xl px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-black dark:text-white mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                {t('home.topCategories')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                {t('service.selectCategory')}
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">{t('common.noData')}</p>
              </div>
            ) : (
              <StaggerContainer className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
                {categories.map((category) => {
                  // Support both camelCase (Sequelize) and snake_case
                  const categoryNameEn = category.nameEn || category.name_en || '';
                  const IconComponent = getCategoryIcon(categoryNameEn);
                  return (
                    <ScaleIn key={category.categoryId}>
                      <Link
                        to={`/services?category=${category.categoryId}`}
                        className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 border-transparent hover:border-[#0BA5EC]/20 hover:-translate-y-2 overflow-hidden block h-full"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0BA5EC]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div className="relative mb-6">
                          <div className="absolute inset-0 bg-gradient-to-br from-[#0BA5EC] to-[#0891D1] rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500 transform scale-110"></div>
                          <div className="relative h-20 w-20 mx-auto bg-gradient-to-br from-[#0BA5EC] to-[#0891D1] rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500 group-hover:rotate-6">
                            <IconComponent className="h-10 w-10 text-white" />
                          </div>
                        </div>

                        <h3 className="relative text-base lg:text-lg font-bold dark:text-white group-hover:text-[#0BA5EC] dark:group-hover:text-[#0BA5EC] transition-colors duration-300">
                          {i18n.language === 'ar' ? (category.nameAr || category.name_ar) : (category.nameEn || category.name_en)}
                        </h3>

                        <div className="relative mt-4 inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <FiCheckCircle className="h-3 w-3" />
                          <span>{t('service.featured')}</span>
                        </div>
                      </Link>
                    </ScaleIn>
                  );
                })}
              </StaggerContainer>
            )}

            <div className="mt-12 text-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#0BA5EC] to-[#0891D1] text-white rounded-xl font-semibold hover:shadow-2xl transition-all duration-300"
                >
                  {t('categories.viewAll')}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured Services */}
        <section className="py-20 bg-[#FDFCFB]/50 dark:bg-gray-900/50">
          <div className="mx-auto max-w-7xl px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-black dark:text-white mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                {t('home.featuredServices')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {t('service.viewDetails')}
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">{t('service.noServices')}</p>
              </div>
            ) : (
              <StaggerContainer className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => {
                  const category = categories.find(c => c.categoryId === service.categoryId);
                  const provider = service.provider;
                  const providerUser = provider?.user;

                  return (
                    <FadeInUp key={service.serviceId}>
                      <ServiceCard
                        service={service}
                        category={category}
                        provider={provider}
                        providerUser={providerUser}
                      />
                    </FadeInUp>
                  );
                })}
              </StaggerContainer>
            )}

            <div className="mt-12 text-center">
              <Link
                to="/services"
                className="inline-block px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-[#0BA5EC] dark:hover:border-[#0BA5EC] hover:shadow-xl transition-all duration-300 font-semibold hover:scale-105"
              >
                {t('home.viewAllServices')}
              </Link>
            </div>
          </div>
        </section>

        {/* Top Providers */}
        {!isProvider && (
          <section className="py-20 bg-white dark:bg-gray-950">
            <div className="mx-auto max-w-7xl px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-black dark:text-white mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                  {t('home.topProviders')}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  {t('provider.serviceProvider')}
                </p>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
              ) : providers.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400">{t('common.noData')}</p>
                </div>
              ) : (
                <StaggerContainer className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {providers.map((provider) => (
                    <ScaleIn key={provider.providerId}>
                      <ProviderCard
                        provider={provider}
                        user={provider.user}
                      />
                    </ScaleIn>
                  ))}
                </StaggerContainer>
              )}
            </div>
          </section>
        )}

        {/* Why Us */}
        <section className="py-20 bg-gradient-to-b from-[#FAF9F6] to-white dark:from-gray-900 dark:to-gray-950">
          <div className="mx-auto max-w-7xl px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-black dark:text-white mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                {t('home.howItWorks')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {t('home.whyUs')}
              </p>
            </div>

            <StaggerContainer className="grid gap-12 md:grid-cols-3">
              {/* Step 1 */}
              <FadeInUp delay={0.1}>
                <div className="group text-center">
                  <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0BA5EC] to-[#0891D1] rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative h-full w-full bg-gradient-to-br from-[#0BA5EC] to-[#0891D1] rounded-full flex items-center justify-center text-4xl font-black text-white shadow-2xl group-hover:scale-110 transition-transform duration-500">
                      1
                    </div>
                  </div>
                  <h3 className="mb-4 text-2xl font-bold dark:text-white">{t('home.step1')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t('home.step1Desc')}
                  </p>
                </div>
              </FadeInUp>

              {/* Step 2 */}
              <FadeInUp delay={0.2}>
                <div className="group text-center">
                  <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative h-full w-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-4xl font-black text-white shadow-2xl group-hover:scale-110 transition-transform duration-500">
                      2
                    </div>
                  </div>
                  <h3 className="mb-4 text-2xl font-bold dark:text-white">{t('home.step2')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t('home.step2Desc')}
                  </p>
                </div>
              </FadeInUp>

              {/* Step 3 */}
              <FadeInUp delay={0.3}>
                <div className="group text-center">
                  <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative h-full w-full bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-4xl font-black text-white shadow-2xl group-hover:scale-110 transition-transform duration-500">
                      3
                    </div>
                  </div>
                  <h3 className="mb-4 text-2xl font-bold dark:text-white">{t('home.step3')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t('home.step3Desc')}
                  </p>
                </div>
              </FadeInUp>
            </StaggerContainer>

            {/* CTA Button */}
            {!isAuthenticated && (
              <div className="mt-16 text-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#0BA5EC] to-[#0891D1] text-white rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300"
                  >
                    <FiAward className="h-6 w-6" />
                    {t('home.getStarted')}
                  </Link>
                </motion.div>
              </div>
            )}
          </div>
        </section>

      </PageTransition>
      <Footer />
    </div>
  );
};

export default Home;

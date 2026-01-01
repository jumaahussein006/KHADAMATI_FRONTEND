import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { useCurrency } from '../context/CurrencyContext';
import { servicesAPI, categoriesAPI } from '../services/apiService';
import { UPLOAD_URL } from '../utils/api';
import { getServiceName, getCategoryName, getServiceIssues, getServiceDescription } from '../utils/langHelper';
import { FiStar, FiMapPin, FiSearch, FiFilter, FiCheckCircle, FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { StaggerContainer, FadeInUp } from '../components/PageTransition/PageTransition';

const Services = () => {
  const { t, i18n } = useTranslation();
  const { formatPrice } = useCurrency();
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [servicesRes, categoriesRes] = await Promise.all([
          servicesAPI.getAll({ limit: 100 }), // Get more for local filtering if needed
          categoriesAPI.getAll()
        ]);

        // Robust data extraction (handle paginated or direct array)
        const fetchedServices = Array.isArray(servicesRes.data)
          ? servicesRes.data
          : (servicesRes.data?.services || servicesRes.data?.data?.services || []);

        const fetchedCategories = Array.isArray(categoriesRes.data)
          ? categoriesRes.data
          : (categoriesRes.data?.categories || categoriesRes.data?.data || []);

        setAllServices(fetchedServices);
        setCategories(fetchedCategories);

        const categoryParam = searchParams.get('category');
        const searchParam = searchParams.get('search');
        const locationParam = searchParams.get('location');

        let filteredServices = [...fetchedServices];

        if (categoryParam) {
          const catId = parseInt(categoryParam);
          setSelectedCategory(catId);
          filteredServices = filteredServices.filter(s => s && (Number(s.categoryId) === catId || Number(s.category_id) === catId));
        }

        if (searchParam) {
          setSearchQuery(searchParam);
          const searchStr = String(searchParam).toLowerCase().trim();
          filteredServices = filteredServices.filter(s => {
            if (!s) return false;
            const nameAr = (s.nameAr || s.name_ar || '').toLowerCase();
            const nameEn = (s.nameEn || s.name_en || '').toLowerCase();
            const descAr = (s.descriptionAr || s.description_ar || '').toLowerCase();
            const descEn = (s.descriptionEn || s.description_en || '').toLowerCase();

            return nameAr.includes(searchStr) ||
              nameEn.includes(searchStr) ||
              descAr.includes(searchStr) ||
              descEn.includes(searchStr);
          });
        }

        if (locationParam) {
          const locStr = String(locationParam).toLowerCase().trim();
          filteredServices = filteredServices.filter(s => {
            const area = t('location.baalbekHermel').toLowerCase();
            return area.includes(locStr) || locStr.includes('baalbek') || locStr.includes('hermel') || locStr.includes('بعلبك') || locStr.includes('الهرمل');
          });
        }

        setServices(filteredServices);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(t('errors.networkError'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams, i18n.language, t]);

  const getServiceImage = (service) => {
    if (service.images && service.images.length > 0) {
      const img = service.images[0];
      const path = typeof img === 'string' ? img : (img.image || '');
      if (path.startsWith('http')) return path;
      return `${UPLOAD_URL}${path.startsWith('/') ? '' : '/'}${path}`;
    }
    // High-quality placeholders based on index to look professional
    const placeholders = [
      'https://images.unsplash.com/photo-1581578731117-104f8a74695e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558444479-c8f02e627c05?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595841055312-5351910d978e?q=80&w=800&auto=format&fit=crop'
    ];
    return placeholders[service.serviceId % placeholders.length];
  };

  const handleCategoryFilter = (categoryId) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
      setServices(allServices);
    } else {
      setSelectedCategory(categoryId);
      setServices(allServices.filter(s => s && (Number(s.categoryId) === Number(categoryId) || Number(s.category_id) === Number(categoryId))));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar />

      {/* Hero Mini Banner */}
      <div className="bg-gray-900 overflow-hidden relative pt-20 pb-16">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1581578731117-104f8a74695e?q=80&w=1600&auto=format&fit=crop" alt="bg" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/40 to-gray-900"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0BA5EC]/20 border border-[#0BA5EC]/30 text-[#0BA5EC] text-xs font-bold uppercase tracking-widest mb-6"
          >
            <FiSearch className="animate-pulse" />
            {t('common.explore')}
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight leading-tight">
            {searchQuery ? (
              <span className="flex flex-wrap justify-center gap-2">
                {t('search.resultsFor')} <span className="text-[#0BA5EC]">"{searchQuery}"</span>
              </span>
            ) : selectedCategory ? (
              getCategoryName(categories.find(c => c.categoryId === selectedCategory), i18n.language)
            ) : t('service.allServices')}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">
            {t('service.viewDetails')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 -mt-8 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Filters Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 shadow-xl border border-gray-100 dark:border-gray-700 sticky top-24">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                  <FiFilter className="text-[#0BA5EC]" />
                  {t('search.filters')}
                </h2>
                {selectedCategory && (
                  <button
                    onClick={() => handleCategoryFilter(null)}
                    className="text-xs font-bold text-[#0BA5EC] hover:underline"
                  >
                    {t('common.clear')}
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryFilter(null)}
                  className={`w-full text-left px-5 py-3.5 rounded-2xl transition-all duration-300 font-bold flex items-center justify-between group ${selectedCategory === null
                    ? 'bg-gradient-to-r from-[#0BA5EC] to-[#0891D1] text-white shadow-lg'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                >
                  <span className="flex items-center gap-3">
                    <FiCheckCircle className={`transition-opacity ${selectedCategory === null ? 'opacity-100' : 'opacity-0'}`} />
                    {t('search.all')}
                  </span>
                  <FiChevronRight className={`transition-transform duration-300 ${selectedCategory === null ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                </button>

                {categories.map((category) => (
                  <button
                    key={category.categoryId || category.category_id}
                    onClick={() => handleCategoryFilter(category.categoryId || category.category_id)}
                    className={`w-full text-left px-5 py-3.5 rounded-2xl transition-all duration-300 font-bold flex items-center justify-between group ${(Number(selectedCategory) === Number(category.categoryId) || Number(selectedCategory) === Number(category.category_id))
                      ? 'bg-gradient-to-r from-[#0BA5EC] to-[#0891D1] text-white shadow-lg'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                  >
                    <span className="flex items-center gap-3">
                      <FiCheckCircle className={`transition-opacity ${(Number(selectedCategory) === Number(category.categoryId) || Number(selectedCategory) === Number(category.category_id)) ? 'opacity-100' : 'opacity-0'}`} />
                      {getCategoryName(category, i18n.language)}
                    </span>
                    <FiChevronRight className={`transition-transform duration-300 ${(Number(selectedCategory) === Number(category.categoryId) || Number(selectedCategory) === Number(category.category_id)) ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {loading ? (
              <div className="grid gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white dark:bg-gray-800 h-48 rounded-[2.5rem] animate-pulse"></div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900 rounded-[2.5rem] p-12 text-center text-red-600 dark:text-red-400">
                <p className="text-xl font-bold">{error}</p>
              </div>
            ) : (
              <StaggerContainer className="space-y-6">
                <AnimatePresence mode='popLayout'>
                  {services.length > 0 ? (
                    services.map((service) => {
                      const rating = service.rating || 4.5;
                      const serviceImage = getServiceImage(service);
                      const category = categories.find(c => c.categoryId === service.categoryId);
                      const provider = service.provider;
                      const providerUser = provider?.user;
                      const serviceIssues = getServiceIssues(service, i18n.language, category);

                      return (
                        <FadeInUp key={service.serviceId}>
                          <Link
                            to={`/services/${service.serviceId}`}
                            className="block bg-white dark:bg-gray-800 rounded-[2.2rem] shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700 group relative"
                          >
                            <div className="flex flex-col md:flex-row h-full">
                              {/* Left: Image */}
                              <div className="w-full md:w-72 h-64 md:h-auto relative overflow-hidden flex-shrink-0">
                                <img
                                  src={serviceImage}
                                  alt={getServiceName(service, i18n.language)}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="absolute top-4 left-4">
                                  <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-4 py-1.5 rounded-2xl text-xs font-black text-[#0BA5EC] shadow-xl uppercase tracking-tighter">
                                    {getCategoryName(category, i18n.language)}
                                  </div>
                                </div>
                              </div>

                              {/* Right: Info */}
                              <div className="flex-1 p-8 md:p-10 flex flex-col justify-between">
                                <div>
                                  <div className="flex items-start justify-between mb-4">
                                    <h3 className="text-3xl font-black text-gray-900 dark:text-white group-hover:text-[#0BA5EC] transition-colors leading-tight">
                                      {getServiceName(service, i18n.language)}
                                    </h3>
                                    <div className="bg-yellow-400/10 px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-yellow-400/20">
                                      <FiStar className="h-4 w-4 fill-yellow-400 text-yellow-500" />
                                      <span className="text-sm font-black text-yellow-700 dark:text-yellow-500">{rating.toFixed(1)}</span>
                                    </div>
                                  </div>

                                  <p className="text-gray-600 dark:text-gray-400 text-lg line-clamp-2 mb-4 font-medium">
                                    {getServiceDescription(service, i18n.language) || (i18n.language === 'ar' ? 'نقدم لكم أفضل خدمات الصيانة المنزلية بجودة عالية واحترافية.' : 'We provide specialized home services with guaranteed quality.')}
                                  </p>

                                  {serviceIssues && (
                                    <div className="flex flex-wrap gap-2 mb-6">
                                      {serviceIssues.split(',').slice(0, 3).map((issue, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-[#0BA5EC]/5 text-[#0BA5EC] text-[10px] font-black rounded-lg border border-[#0BA5EC]/10 uppercase tracking-tighter">
                                          {issue.trim()}
                                        </span>
                                      ))}
                                    </div>
                                  )}

                                  <div className="flex flex-wrap gap-4 items-center">
                                    {providerUser && providerUser.first_name && (
                                      <div className="flex items-center gap-3 py-2 px-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-transparent group-hover:border-[#0BA5EC]/20 transition-all">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0BA5EC] to-[#0891D1] flex items-center justify-center text-xs font-bold text-white shadow-lg">
                                          {providerUser.first_name?.[0] || 'P'}
                                        </div>
                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                          {providerUser.first_name} {providerUser.last_name || ''}
                                        </span>
                                      </div>
                                    )}
                                    <div className="flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400">
                                      <FiMapPin className="text-[#0BA5EC]" />
                                      {t('location.baalbekHermel')}
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                                  <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest">{t('common.startingFrom')}</span>
                                    <span className="text-3xl font-black text-[#0BA5EC] tracking-tight">
                                      {formatPrice(service.price || (service.serviceId * 5 + 15))}
                                    </span>
                                  </div>
                                  <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black shadow-xl group-hover:bg-[#0BA5EC] group-hover:text-white transition-all"
                                  >
                                    {t('common.bookNow')}
                                  </motion.div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </FadeInUp>
                      );
                    })
                  ) : (
                    <FadeInUp className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-20 text-center shadow-xl border border-gray-100 dark:border-gray-700">
                      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiSearch size={40} className="text-gray-400" />
                      </div>
                      <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4">{t('search.noResults')}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md mx-auto mb-8">
                        {t('search.tryDifferentKeywords')}
                      </p>
                      <button
                        onClick={() => handleCategoryFilter(null)}
                        className="px-8 py-4 bg-[#0BA5EC] text-white rounded-2xl font-black shadow-lg shadow-[#0BA5EC]/30 hover:shadow-xl transition-all"
                      >
                        {t('search.viewAllServices')}
                      </button>
                    </FadeInUp>
                  )}
                </AnimatePresence>
              </StaggerContainer>
            )}
          </main>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Services;

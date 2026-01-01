import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { providersAPI, servicesAPI, categoriesAPI } from '../services/apiService';
import { UPLOAD_URL } from '../utils/api';
import { getServiceName, getCategoryName } from '../utils/langHelper';
import { FiStar, FiMapPin, FiMail, FiPhone, FiCheckCircle, FiChevronRight, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';
import PageTransition, { StaggerContainer, FadeInUp, ScaleIn } from '../components/PageTransition/PageTransition';

const ProviderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { formatPrice } = useCurrency();
    const [provider, setProvider] = useState(null);
    const [providerUser, setProviderUser] = useState(null);
    const [providerServices, setProviderServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${UPLOAD_URL}${path.startsWith('/') ? '' : '/'}${path}`;
    };

    useEffect(() => {
        const fetchProviderData = async () => {
            try {
                setLoading(true);
                const [providerRes, servicesRes, categoriesRes] = await Promise.all([
                    providersAPI.getById(id),
                    servicesAPI.getAll(),
                    categoriesAPI.getAll()
                ]);

                const providerData = providerRes.data;
                setProvider(providerData);
                setProviderUser(providerData.user);
                setCategories(categoriesRes.data);

                // Filter services for this provider
                const filteredServices = servicesRes.data.filter(s => s.provider_id === parseInt(id));
                setProviderServices(filteredServices);

                setLoading(false);
            } catch (err) {
                console.error('Error fetching provider details:', err);
                setError(t('errors.somethingWentWrong'));
                setLoading(false);
            }
        };

        if (id) {
            fetchProviderData();
        }
    }, [id, t]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0BA5EC]"></div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !provider || !providerUser) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                    <FiUser className="h-16 w-16 text-gray-300 mb-4" />
                    <h2 className="text-2xl font-bold dark:text-white mb-2">{t('search.noResults')}</h2>
                    <button onClick={() => navigate(-1)} className="text-[#0BA5EC] font-bold hover:underline">
                        {t('common.goBack')}
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            <Navbar />

            <PageTransition>
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Left: Provider Profile Card */}
                        <aside className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-xl border border-gray-100 dark:border-gray-700 sticky top-24">
                                <div className="relative mb-8 text-center">
                                    <div className="relative inline-block">
                                        <img
                                            src={getImageUrl(providerUser.profile_image) || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop'}
                                            alt={providerUser.first_name}
                                            className="w-32 h-32 rounded-full object-cover border-4 border-[#0BA5EC]/20 mx-auto"
                                        />
                                        {provider.approved && (
                                            <div className="absolute bottom-1 right-1 bg-green-500 text-white p-2 rounded-full shadow-lg border-4 border-white dark:border-gray-800">
                                                <FiCheckCircle size={14} />
                                            </div>
                                        )}
                                    </div>
                                    <h1 className="text-3xl font-black text-gray-900 dark:text-white mt-6 mb-2 tracking-tight">
                                        {providerUser.first_name} {providerUser.last_name}
                                    </h1>
                                    <p className="text-[#0BA5EC] font-bold text-lg">{provider.specialization}</p>

                                    <div className="flex items-center justify-center gap-2 mt-4 bg-yellow-400/10 px-4 py-2 rounded-2xl border border-yellow-400/20 w-fit mx-auto">
                                        <FiStar className="h-4 w-4 fill-yellow-400 text-yellow-500" />
                                        <span className="text-sm font-black text-yellow-700 dark:text-yellow-500">4.9 (120+)</span>
                                    </div>
                                </div>

                                <div className="space-y-4 border-t border-gray-100 dark:border-gray-700 pt-8">
                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                        <div className="w-10 h-10 bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center text-[#0BA5EC]">
                                            <FiMapPin />
                                        </div>
                                        <span className="font-medium">{t('location.baalbekHermel')}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                        <div className="w-10 h-10 bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center text-[#0BA5EC]">
                                            <FiMail />
                                        </div>
                                        <span className="font-medium truncate">{providerUser.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                        <div className="w-10 h-10 bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center text-[#0BA5EC]">
                                            <FiPhone />
                                        </div>
                                        <span className="font-medium">{providerUser.phone || '+961 70 000 000'}</span>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">{t('provider.experience')}</h3>
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                                        {provider.description || (i18n.language === 'ar'
                                            ? 'نحن متخصصون في جميع أعمال الصيانة المنزلية والتركيبات الكهربائية والصحية بخبرة تزيد عن ١٠ سنوات في هذا المجال.'
                                            : 'Professional home maintenance specialist with over 10 years of experience in electrical, plumbing, and general repair services.')}
                                    </p>
                                </div>
                            </div>
                        </aside>

                        {/* Right: Provider Services */}
                        <main className="lg:col-span-2">
                            <div className="mb-10">
                                <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
                                    {t('common.services')}
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
                                    {t('home.heroSubtitle')}
                                </p>
                            </div>

                            {providerServices.length > 0 ? (
                                <StaggerContainer className="grid gap-6">
                                    {providerServices.map((service) => {
                                        const category = categories.find(c => c.category_id === service.category_id);
                                        const rating = service.rating || 4.8;

                                        return (
                                            <FadeInUp key={service.service_id}>
                                                <Link
                                                    to={`/services/${service.service_id}`}
                                                    className="group flex flex-col md:flex-row bg-white dark:bg-gray-800 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 shadow-sm"
                                                >
                                                    <div className="w-full md:w-56 h-48 md:h-auto overflow-hidden">
                                                        <img
                                                            src={service.images && service.images.length > 0 ? getImageUrl(service.images[0].image || service.images[0]) : 'https://images.unsplash.com/photo-1581578731117-104f8a74695e?q=80&w=400&auto=format&fit=crop'}
                                                            alt={getServiceName(service, i18n.language)}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                        />
                                                    </div>
                                                    <div className="flex-1 p-6 flex flex-col justify-between">
                                                        <div>
                                                            <div className="flex items-start justify-between mb-2">
                                                                <h3 className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-[#0BA5EC] transition-colors line-clamp-1">
                                                                    {getServiceName(service, i18n.language)}
                                                                </h3>
                                                                <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-1 rounded-lg">
                                                                    <FiStar className="h-3 w-3 fill-yellow-400 text-yellow-500" />
                                                                    <span className="text-xs font-black text-yellow-700 dark:text-yellow-500">{rating.toFixed(1)}</span>
                                                                </div>
                                                            </div>
                                                            <div className="bg-[#0BA5EC]/10 px-3 py-1 rounded-full text-[10px] font-black text-[#0BA5EC] uppercase w-fit mb-4">
                                                                {getCategoryName(category, i18n.language)}
                                                            </div>
                                                            <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 font-medium">
                                                                {service.description || (i18n.language === 'ar' ? 'نقدم لكم جودة عالية في الخدمة مع ضمان كامل.' : 'High-quality service guaranteed.')}
                                                            </p>
                                                        </div>

                                                        <div className="mt-6 pt-4 border-t border-gray-50 dark:border-gray-700 flex items-center justify-between">
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest">{t('common.startingFrom')}</span>
                                                                <span className="text-xl font-black text-[#0BA5EC]">
                                                                    {formatPrice(service.price || 25)}
                                                                </span>
                                                            </div>
                                                            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-2xl group-hover:bg-[#0BA5EC] group-hover:text-white transition-all text-[#0BA5EC]">
                                                                <FiChevronRight size={20} className={i18n.language === 'ar' ? 'rotate-180' : ''} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </FadeInUp>
                                        );
                                    })}
                                </StaggerContainer>
                            ) : (
                                <FadeInUp className="text-center py-20 bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700">
                                    <FiUser className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                                    <h3 className="text-2xl font-black dark:text-white mb-2">{t('service.noServices')}</h3>
                                    <p className="text-gray-500 font-medium">{t('search.tryDifferentKeywords')}</p>
                                </FadeInUp>
                            )}
                        </main>

                    </div>
                </div>
            </PageTransition>

            <Footer />
        </div>
    );
};

export default ProviderDetails;

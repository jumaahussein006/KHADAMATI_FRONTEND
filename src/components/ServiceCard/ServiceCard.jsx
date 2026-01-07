import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiStar, FiMapPin, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { getServiceName, getCategoryName } from '../../utils/langHelper';
import { UPLOAD_URL } from '../../utils/api';

const ServiceCard = ({ service, category, provider, providerUser }) => {
  const { t, i18n } = useTranslation();

  const placeholderImage =
    'https://images.unsplash.com/photo-1581578731117-104f8a74695e?q=80&w=1000&auto=format&fit=crop';

  const firstImagePath =
    Array.isArray(service?.images) && service.images.length > 0
      ? (typeof service.images[0] === 'string' ? service.images[0] : service.images[0]?.image)
      : null;

  const imageSrc = firstImagePath
    ? (firstImagePath.startsWith('http') ? firstImagePath : `${UPLOAD_URL}${firstImagePath.startsWith('/') ? '' : '/'}${firstImagePath}`)
    : placeholderImage;

  const firstLetter =
    providerUser?.first_name && String(providerUser.first_name).length > 0
      ? String(providerUser.first_name)[0]
      : '?';

  return (
    <motion.div whileHover={{ y: -5 }} className="group">
      <Link to={`/services/${service?.service_id || service?.serviceid || service?.id || ''}`}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
          <div className="h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
            <img
              src={imageSrc}
              alt={getServiceName(service, i18n.language)}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>

          <div className="p-6">
            {category && (
              <span className="inline-block px-3 py-1 bg-[#0BA5EC] text-white rounded-full text-sm mb-3">
                {getCategoryName(category, i18n.language)}
              </span>
            )}

            <h3 className="text-xl font-bold dark:text-white mb-2">
              {getServiceName(service, i18n.language)}
            </h3>

            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {service?.description ||
                (i18n.language === 'ar'
                  ? 'نقدم لكم أفضل خدمات الصيانة المنزلية بجودة عالية واحترافية.'
                  : 'We provide specialized home services with guaranteed quality.')}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {providerUser ? (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#0BA5EC] rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {firstLetter}
                    </div>
                    <div className="text-sm">
                      <p className="font-medium dark:text-white">
                        {providerUser?.first_name || ''} {providerUser?.last_name || ''}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <FiMapPin className="h-3 w-3" />
                        {provider?.location || t('common.location')}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <FiUser className="h-4 w-4" />
                    {t('common.unknown')}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1">
                <FiStar className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-medium dark:text-white">
                  {Number(service?.rating || 4.5).toFixed(1)}
                </span>
              </div>
            </div>

            <button className="mt-4 w-full bg-[#0BA5EC] text-white py-2 rounded-lg font-medium hover:bg-[#0BA5EC]/90 transition-colors">
              {t('common.viewDetails')}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ServiceCard;

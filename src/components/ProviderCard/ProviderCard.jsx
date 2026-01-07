import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiStar, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import { UPLOAD_URL } from '../../utils/api';

const ProviderCard = ({ provider, user }) => {
  const { t } = useTranslation();

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${UPLOAD_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700 group flex flex-col h-full">
      <div className="h-48 bg-gray-200 dark:bg-gray-700 relative overflow-hidden flex-shrink-0">
        <img
          src={getImageUrl(user?.profile_image) || '/placeholder-user.jpg'}
          alt={user?.first_name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {provider.approved && (
          <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xl border border-green-500/20">
            <FiCheckCircle className="h-3 w-3 text-green-500" />
            <span className="text-[10px] font-black uppercase tracking-tighter text-green-600 dark:text-green-400">
              {t('common.verified')}
            </span>
          </div>
        )}
      </div>
      <div className="p-8 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="mb-2 text-2xl font-black text-gray-900 dark:text-white group-hover:text-[#0BA5EC] transition-colors line-clamp-1">
            {user?.first_name} {user?.last_name}
          </h3>
          <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[#0BA5EC] bg-[#0BA5EC]/10 px-3 py-1 rounded-full w-fit">
            <FiMapPin className="h-3 w-3" />
            <span className="truncate max-w-[150px]">{provider.specialization || t('provider.serviceProvider')}</span>
          </div>
          <div className="mb-6 flex items-center gap-2">
            <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-1 rounded-lg border border-yellow-400/20">
              <FiStar className="h-3 w-3 fill-yellow-400 text-yellow-500" />
              <span className="text-xs font-black text-yellow-700 dark:text-yellow-500">4.9</span>
            </div>
            <span className="text-xs font-bold text-gray-500">(120+ {t('provider.reviews')})</span>
          </div>
        </div>

        <Link
          to={`/provider-details/${provider.provider_id || provider.id}`}
          className="block w-full text-center px-6 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl hover:bg-[#0BA5EC] hover:text-white transition-all shadow-lg font-black text-sm uppercase tracking-widest active:scale-95"
        >
          {t('service.viewDetails')}
        </Link>
      </div>
    </div>
  );
};

export default ProviderCard;

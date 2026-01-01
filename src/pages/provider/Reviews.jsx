import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { reviewsAPI } from '../../services/apiService';
import { formatDate } from '../../utils/date';
import { FiStar, FiLoader } from 'react-icons/fi';

const Reviews = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        // Get provider ID from user context
        const providerId = user?.provider_id || user?.roleId;
        if (providerId) {
          const response = await reviewsAPI.getByProvider(providerId);
          if (response.success) {
            setReviews(response.data || []);
          }
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError(err.message || 'Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [user]);

  const getCustomerName = (review) => {
    // The API includes customer data in the response
    if (review.request?.customer?.user) {
      const u = review.request.customer.user;
      return `${u.first_name} ${u.last_name}`;
    }
    return t('common.unknownCustomer');
  };

  const locale = i18n.language === 'ar' ? 'ar-LB' : 'en-US';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FiLoader className="h-8 w-8 animate-spin text-[#0BA5EC]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl">
        <p className="text-xl font-bold text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold dark:text-white">{t('provider.reviews')}</h1>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.review_id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold dark:text-white mb-1">
                  {getCustomerName(review)}
                </h3>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                    />
                  ))}
                  <span className="mr-2 text-gray-600 dark:text-gray-400">{review.rating}/5</span>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                {formatDate(review.create_at, locale, { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 dark:text-gray-400">{t('common.noReviews')}</p>
        </div>
      )}
    </div>

  );
};

export default Reviews;

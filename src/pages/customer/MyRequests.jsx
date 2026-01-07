import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiPlus, FiStar, FiX } from 'react-icons/fi';
import { requestsAPI, reviewsAPI } from '../../services/apiService';
import { getErrorMessage } from '../../utils/checkBackend';
import { formatDate } from '../../utils/date';
import { formatCurrency } from '../../utils/finance';
import { getCategoryName } from '../../utils/langHelper';

const MyRequests = () => {
  const { t, i18n } = useTranslation();

  const [requests, setRequests] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewedRequests, setReviewedRequests] = useState(new Set());

  const locale = i18n.language === 'ar' ? 'ar-LB' : 'en-US';

  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        setLoading(true);
        setError(null);

        // IMPORTANT: customer endpoint [file:62]
        const res = await requestsAPI.getMy({ page: 1, limit: 10 });

        // paginatedResponse: { success, data: rows, pagination: {...} } [file:73]
        const rows = Array.isArray(res?.data) ? res.data : [];
        setRequests(rows);
        setPagination(res?.pagination || null);

        // Check which completed requests already have reviews
        const completedRequests = rows.filter(r => r.status === 'completed');
        const reviewed = new Set();

        for (const req of completedRequests) {
          const reqId = req.requestId ?? req.requestid ?? req.id;
          try {
            // Try to check if review exists by attempting to create one
            // If it fails with 409, it means review already exists
            await reviewsAPI.getByRequest(reqId);
            reviewed.add(reqId);
          } catch (err) {
            // If error is not 404, it might exist
            if (err.response?.status === 409 || err.response?.data?.message?.includes('already reviewed')) {
              reviewed.add(reqId);
            }
          }
        }

        setReviewedRequests(reviewed);
      } catch (err) {
        console.error('Customer MyRequests error:', err);
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchMyRequests();
  }, []);

  if (loading) {
    return <div className="py-10 text-center">{t('common.loading')}</div>;
  }

  if (error) {
    return <div className="py-10 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">{t('dashboard.customer.myRequests') || 'My Requests'}</h1>
          {pagination && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Page {pagination.page} / {pagination.totalpages} • Total {pagination.totalcount}
            </div>
          )}
        </div>

        <Link
          to="/services"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0BA5EC] to-[#0891D1] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <FiPlus className="h-5 w-5" />
          {t('request.createRequest') || 'Create Request'}
        </Link>
      </div>

      {requests.length === 0 ? (
        <div className="py-12 text-center text-gray-500">{t('request.noRequests') || 'No requests yet.'}</div>
      ) : (
        <div className="space-y-4">
          {requests.map((r) => {
            const id = r.requestId ?? r.requestid ?? r.id;
            const status = r.status || 'pending';

            return (
              <div
                key={id}
                className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="font-bold dark:text-white">
                      {t('request.requestNumber', { number: id }) || `Request #${id}`}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {r.requestDate
                        ? formatDate(r.requestDate, locale, { year: 'numeric', month: 'short', day: 'numeric' })
                        : ''}
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                    {status}
                  </span>
                </div>

                {r.service?.category && (
                  <div className="mb-2">
                    <span className="inline-block px-3 py-1 bg-[#0BA5EC]/10 text-[#0BA5EC] rounded-lg font-bold text-xs">
                      {getCategoryName(r.service.category, i18n.language)}
                    </span>
                  </div>
                )}

                {r.problemType && (
                  <div className="mb-2">
                    <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                      {i18n.language === 'ar' ? 'المشكلة: ' : 'Problem: '}
                    </span>
                    <span className="text-sm text-[#0BA5EC] font-bold">
                      {r.problemType}
                    </span>
                  </div>
                )}

                <div className="mt-3 text-gray-700 dark:text-gray-300">
                  {r.details || t('common.noDetails') || 'No details.'}
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <div>
                    {t('service.price') || 'Price'}:{' '}
                    <span className="font-bold text-[#0BA5EC]">
                      {formatCurrency(Number(r.price || 0), 'USD', locale)}
                    </span>
                  </div>

                  {r.service?.nameEn || r.service?.nameAr ? (
                    <div className="truncate max-w-[50%]">
                      {i18n.language === 'ar' ? r.service?.nameAr : r.service?.nameEn}
                    </div>
                  ) : null}
                </div>

                {status === 'completed' && r.price && (
                  <div className="mt-4 bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-green-700 dark:text-green-400">
                        {i18n.language === 'ar' ? `تم الإنجاز - السعر النهائي: $${r.price}` : `Completed - Final Price: $${r.price}`}
                      </p>
                      {reviewedRequests.has(id) ? (
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg font-bold text-sm">
                          <FiStar className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {i18n.language === 'ar' ? 'تم التقييم' : 'Already Reviewed'}
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedRequest(r);
                            setShowReviewModal(true);
                            setRating(0);
                            setComment('');
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-[#0BA5EC] text-white rounded-lg hover:bg-[#0BA5EC]/90 transition font-bold text-sm"
                        >
                          <FiStar className="h-4 w-4" />
                          {i18n.language === 'ar' ? 'تأكيد' : 'Confirm'}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold dark:text-white">
                {i18n.language === 'ar' ? 'تقييم مقدم الخدمة' : 'Review Provider'}
              </h2>
              <button
                onClick={() => setShowReviewModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <FiX className="h-5 w-5 dark:text-white" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  {i18n.language === 'ar' ? 'التقييم' : 'Rating'}
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <FiStar
                        className={`h-8 w-8 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  {i18n.language === 'ar' ? 'التعليق (اختياري)' : 'Comment (Optional)'}
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-[#0BA5EC] focus:border-transparent"
                  placeholder={i18n.language === 'ar' ? 'اكتب تعليقك هنا...' : 'Write your comment here...'}
                />
              </div>

              <button
                onClick={async () => {
                  if (rating === 0) {
                    alert(i18n.language === 'ar' ? 'الرجاء اختيار التقييم' : 'Please select a rating');
                    return;
                  }
                  try {
                    await reviewsAPI.create({
                      request_id: selectedRequest.requestId || selectedRequest.requestid || selectedRequest.id,
                      rating,
                      comment: comment || ''
                    });
                    alert(i18n.language === 'ar' ? 'تم إرسال التقييم بنجاح!' : 'Review submitted successfully!');
                    // Add to reviewed set
                    const reqId = selectedRequest.requestId || selectedRequest.requestid || selectedRequest.id;
                    setReviewedRequests(prev => new Set([...prev, reqId]));
                    setShowReviewModal(false);
                  } catch (err) {
                    console.error('Error submitting review:', err);
                    alert(err.response?.data?.message || (i18n.language === 'ar' ? 'فشل إرسال التقييم' : 'Failed to submit review'));
                  }
                }}
                className="w-full py-3 bg-[#0BA5EC] text-white rounded-lg hover:bg-[#0BA5EC]/90 transition font-bold"
              >
                {i18n.language === 'ar' ? 'إرسال التقييم' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRequests;

import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';

const ServiceRequests = () => {
  const { t, i18n } = useTranslation();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completionData, setCompletionData] = useState({});

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // FIXED: Use correct endpoint /requests/provider (not /requests/provider-requests)
      const res = await api.get('/requests/provider');
      const rows = res.data?.data || [];
      setRequests(Array.isArray(rows) ? rows : []);
    } catch (err) {
      console.error('Error fetching provider requests:', err);
      setError(t('errors.networkError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const updateStatus = async (requestId, status) => {
    try {
      await api.put(`/requests/${requestId}/status`, { status });
      setRequests((prev) => prev.map((r) => ((r.requestId || r.requestid || r.id) === requestId ? { ...r, status } : r)));
      alert(t('success.statusUpdated'));
    } catch (err) {
      console.error('Error updating request:', err);
      alert(t('errors.tryAgain'));
    }
  };

  const completeRequest = async (requestId) => {
    const finalPrice = completionData[requestId];
    if (!finalPrice || finalPrice <= 0) {
      alert(i18n.language === 'ar' ? 'الرجاء إدخال السعر النهائي' : 'Please enter final price');
      return;
    }

    try {
      await api.put(`/requests/${requestId}/complete`, {
        final_price: parseFloat(finalPrice),
        payment_method: 'cash',
      });
      setRequests((prev) => prev.map((r) => ((r.requestId || r.requestid || r.id) === requestId ? { ...r, status: 'completed', price: finalPrice } : r)));
      setCompletionData((prev) => {
        const updated = { ...prev };
        delete updated[requestId];
        return updated;
      });
      alert(t('success.requestCompleted') || 'Request completed successfully');
    } catch (err) {
      console.error('Error completing request:', err);
      alert(t('errors.tryAgain'));
    }
  };

  const handleStatusChange = async (requestId, newStatus) => {
    if (newStatus === 'completed') {
      // Don't update yet, wait for price input
      setCompletionData((prev) => ({ ...prev, [requestId]: '' }));
    } else {
      await updateStatus(requestId, newStatus);
    }
  };

  if (loading) return <div className="py-10 text-center">{t('common.loading')}</div>;
  if (error) return <div className="py-10 text-center text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold dark:text-white">{t('provider.serviceRequests')}</h1>

      {requests.length === 0 ? (
        <div className="text-center py-12 text-gray-500">{t('request.noRequests')}</div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => {
            const id = request.requestId || request.requestid || request.id;
            const status = request.status || 'pending';
            const showPriceInput = completionData[id] !== undefined;

            return (
              <div key={id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="font-bold dark:text-white text-lg">{t('request.requestNumber', { number: id })}</p>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{request.details || t('common.noDetails')}</p>

                    {request.problemType && (
                      <div className="mt-2">
                        <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                          {i18n.language === 'ar' ? 'المشكلة: ' : 'Problem: '}
                        </span>
                        <span className="text-sm text-[#0BA5EC] font-bold">
                          {request.problemType}
                        </span>
                      </div>
                    )}

                    {request.service && (
                      <div className="mt-2">
                        <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                          {i18n.language === 'ar' ? 'الخدمة: ' : 'Service: '}
                        </span>
                        <span className="text-sm dark:text-gray-300">
                          {i18n.language === 'ar' ? request.service.nameAr : request.service.nameEn}
                        </span>
                      </div>
                    )}

                    {request.scheduledDate && (
                      <div className="mt-2">
                        <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                          {i18n.language === 'ar' ? 'التاريخ المطلوب: ' : 'Scheduled Date: '}
                        </span>
                        <span className="text-sm text-green-600 dark:text-green-400 font-bold">
                          {new Date(request.scheduledDate).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  <span className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                    {status}
                  </span>
                </div>

                <div className="space-y-3">
                  {status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(id, 'accepted')}
                        className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-bold"
                      >
                        {t('common.accept')}
                      </button>
                      <button
                        onClick={() => updateStatus(id, 'rejected')}
                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-bold"
                      >
                        {t('common.reject')}
                      </button>
                    </div>
                  )}

                  {status === 'accepted' && (
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        {i18n.language === 'ar' ? 'تحديث الحالة:' : 'Update Status:'}
                      </label>
                      <select
                        onChange={(e) => handleStatusChange(id, e.target.value)}
                        value={status}
                        className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:text-white font-bold"
                      >
                        <option value="accepted">{i18n.language === 'ar' ? 'مقبول' : 'Accepted'}</option>
                        <option value="in_progress">{i18n.language === 'ar' ? 'قيد التنفيذ' : 'In Progress'}</option>
                        <option value="on_the_way">{i18n.language === 'ar' ? 'في الطريق' : 'On the Way'}</option>
                        <option value="completed">{i18n.language === 'ar' ? 'مكتمل' : 'Completed'}</option>
                      </select>
                    </div>
                  )}

                  {(status === 'in_progress' || status === 'on_the_way') && (
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        {i18n.language === 'ar' ? 'تحديث الحالة:' : 'Update Status:'}
                      </label>
                      <select
                        onChange={(e) => handleStatusChange(id, e.target.value)}
                        value={status}
                        className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:text-white font-bold"
                      >
                        <option value="in_progress">{i18n.language === 'ar' ? 'قيد التنفيذ' : 'In Progress'}</option>
                        <option value="on_the_way">{i18n.language === 'ar' ? 'في الطريق' : 'On the Way'}</option>
                        <option value="completed">{i18n.language === 'ar' ? 'مكتمل' : 'Completed'}</option>
                      </select>
                    </div>
                  )}

                  {showPriceInput && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 space-y-3">
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                        {i18n.language === 'ar' ? 'السعر النهائي *' : 'Final Price *'}
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={completionData[id] || ''}
                        onChange={(e) => setCompletionData((prev) => ({ ...prev, [id]: e.target.value }))}
                        className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800 dark:text-white font-bold"
                        placeholder={i18n.language === 'ar' ? 'أدخل السعر النهائي' : 'Enter final price'}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => completeRequest(id)}
                          className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-bold"
                        >
                          {i18n.language === 'ar' ? 'تأكيد الإنجاز' : 'Confirm Completion'}
                        </button>
                        <button
                          onClick={() => setCompletionData((prev) => {
                            const updated = { ...prev };
                            delete updated[id];
                            return updated;
                          })}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-bold"
                        >
                          {i18n.language === 'ar' ? 'إلغاء' : 'Cancel'}
                        </button>
                      </div>
                    </div>
                  )}

                  {status === 'completed' && request.price && (
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                      <p className="text-sm font-bold text-green-700 dark:text-green-400">
                        {i18n.language === 'ar' ? `السعر النهائي: $${request.price}` : `Final Price: $${request.price}`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ServiceRequests;

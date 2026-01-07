import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { reportsAPI, requestsAPI } from '../../services/apiService';
import { FiAlertCircle, FiSend } from 'react-icons/fi';
import { motion } from 'framer-motion';

const SubmitReport = () => {
    const { i18n } = useTranslation();
    const [formData, setFormData] = useState({
        selectedRequest: '',
        targetUserId: '',
        reason: '',
        description: ''
    });
    const [myRequests, setMyRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingRequests, setLoadingRequests] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMyRequests();
    }, []);

    const fetchMyRequests = async () => {
        try {
            setLoadingRequests(true);
            const res = await requestsAPI.getMy({ page: 1, limit: 100 });
            const requests = Array.isArray(res?.data) ? res.data : [];
            setMyRequests(requests);
        } catch (err) {
            console.error('Error fetching requests:', err);
        } finally {
            setLoadingRequests(false);
        }
    };

    const handleRequestChange = (e) => {
        const requestId = e.target.value;
        setFormData({ ...formData, selectedRequest: requestId });

        // Auto-fill target user based on selected request
        if (requestId) {
            const request = myRequests.find(r =>
                String(r.requestId || r.requestid || r.id) === String(requestId)
            );
            if (request) {
                // Customer reports provider, Provider reports customer
                const targetUserId = request.provider?.userId || request.providerId;
                setFormData(prev => ({ ...prev, selectedRequest: requestId, targetUserId }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.reason || !formData.description) {
            setError(i18n.language === 'ar' ? 'الرجاء ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
            return;
        }

        if (!formData.selectedRequest) {
            setError(i18n.language === 'ar' ? 'الرجاء اختيار طلب خدمة' : 'Please select a service request');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const request = myRequests.find(r =>
                String(r.requestId || r.requestid || r.id) === String(formData.selectedRequest)
            );

            const payload = {
                reason: formData.reason,
                description: formData.description,
                request_id: parseInt(formData.selectedRequest)
            };

            // Customer reports provider, provider reports customer
            if (request) {
                const targetUserId = request.provider?.userId || request.providerId ||
                    request.customer?.userId || request.customerId;
                if (targetUserId) {
                    payload.target_user_id = targetUserId;
                }
            }

            await reportsAPI.create(payload);

            setSuccess(true);
            setFormData({ selectedRequest: '', targetUserId: '', reason: '', description: '' });

            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error('Submit report error:', err);
            setError(err.response?.data?.message || (i18n.language === 'ar' ? 'فشل إرسال التقرير' : 'Failed to submit report'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
        >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                    <FiAlertCircle className="h-8 w-8 text-[#0BA5EC]" />
                    <h1 className="text-2xl font-bold dark:text-white">
                        {i18n.language === 'ar' ? 'إرسال تقرير للإدارة' : 'Submit Report to Admin'}
                    </h1>
                </div>

                {success && (
                    <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                        <p className="text-green-700 dark:text-green-400 font-bold">
                            {i18n.language === 'ar' ? 'تم إرسال التقرير بنجاح!' : 'Report submitted successfully!'}
                        </p>
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                        <p className="text-red-700 dark:text-red-400">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            {i18n.language === 'ar' ? 'اختر طلب خدمة *' : 'Select Service Request *'}
                        </label>
                        {loadingRequests ? (
                            <p className="text-sm text-gray-500">{i18n.language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
                        ) : myRequests.length === 0 ? (
                            <p className="text-sm text-gray-500">
                                {i18n.language === 'ar' ? 'لا توجد طلبات' : 'No requests available'}
                            </p>
                        ) : (
                            <select
                                value={formData.selectedRequest}
                                onChange={handleRequestChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-[#0BA5EC] focus:border-transparent"
                            >
                                <option value="">
                                    {i18n.language === 'ar' ? 'اختر طلب...' : 'Select a request...'}
                                </option>
                                {myRequests.map((request) => {
                                    const id = request.requestId || request.requestid || request.id;
                                    const serviceName = i18n.language === 'ar'
                                        ? request.service?.nameAr || request.service?.nameEn
                                        : request.service?.nameEn || request.service?.nameAr;
                                    const otherParty = request.provider?.user
                                        ? `${request.provider.user.firstName} ${request.provider.user.lastName}`
                                        : request.customer?.user
                                            ? `${request.customer.user.firstName} ${request.customer.user.lastName}`
                                            : '';

                                    return (
                                        <option key={id} value={id}>
                                            {i18n.language === 'ar'
                                                ? `طلب #${id} - ${serviceName || 'خدمة'} - ${otherParty}`
                                                : `Request #${id} - ${serviceName || 'Service'} - ${otherParty}`}
                                        </option>
                                    );
                                })}
                            </select>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            {i18n.language === 'ar' ? 'السبب *' : 'Reason *'}
                        </label>
                        <input
                            type="text"
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-[#0BA5EC] focus:border-transparent"
                            placeholder={i18n.language === 'ar' ? 'سبب التقرير' : 'Report reason'}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            {i18n.language === 'ar' ? 'الوصف *' : 'Description *'}
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            rows="6"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-[#0BA5EC] focus:border-transparent"
                            placeholder={i18n.language === 'ar' ? 'اشرح المشكلة بالتفصيل...' : 'Explain the issue in detail...'}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || myRequests.length === 0}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#0BA5EC] text-white rounded-lg hover:bg-[#0BA5EC]/90 transition font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FiSend className="h-5 w-5" />
                        {loading
                            ? (i18n.language === 'ar' ? 'جاري الإرسال...' : 'Submitting...')
                            : (i18n.language === 'ar' ? 'إرسال التقرير' : 'Submit Report')}
                    </button>
                </form>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {i18n.language === 'ar'
                            ? 'سيتم مراجعة تقريرك من قبل فريق الإدارة وسيتم إعلامك بالتحديثات.'
                            : 'Your report will be reviewed by the admin team and you will be notified of updates.'}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default SubmitReport;

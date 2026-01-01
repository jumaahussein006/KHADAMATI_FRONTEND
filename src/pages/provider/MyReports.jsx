import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { reportsAPI } from '../../services/apiService';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { formatDate } from '../../utils/date';

const MyReports = () => {
    const { i18n } = useTranslation();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyReports();
    }, []);

    const fetchMyReports = async () => {
        try {
            setLoading(true);
            const res = await reportsAPI.getMySubmitted();
            if (res.success) {
                setReports(res.data || []);
            }
        } catch (err) {
            console.error('Error fetching my reports:', err);
        } finally {
            setLoading(false);
        }
    };

    const locale = i18n.language === 'ar' ? 'ar-LB' : 'en-US';

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="text-gray-500 dark:text-gray-400">
                    {i18n.language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold dark:text-white">
                    {i18n.language === 'ar' ? 'تقاريري المقدمة' : 'My Submitted Reports'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {i18n.language === 'ar'
                        ? 'التقارير التي قدمتها للإدارة'
                        : 'Reports you submitted to admin'}
                </p>
            </div>

            {reports.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                    <FiAlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                        {i18n.language === 'ar' ? 'لم تقدم أي تقارير بعد' : 'No reports submitted yet'}
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {reports.map((report) => (
                        <motion.div
                            key={report.reportId || report.report_id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
                        >
                            <div className="flex items-start gap-3 mb-4">
                                <FiAlertCircle className="h-6 w-6 text-orange-500 flex-shrink-0 mt-1" />
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg dark:text-white mb-1">
                                        {report.title || (i18n.language === 'ar' ? 'تقرير' : 'Report')}
                                    </h3>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                                        {report.targetType && report.targetId && (
                                            <div>
                                                <span className="font-semibold">
                                                    {i18n.language === 'ar' ? 'الهدف:' : 'Target:'}
                                                </span>{' '}
                                                {report.targetType} #{report.targetId}
                                            </div>
                                        )}
                                        <div>
                                            <span className="font-semibold">
                                                {i18n.language === 'ar' ? 'التاريخ:' : 'Date:'}
                                            </span>{' '}
                                            {report.createdAt ? formatDate(report.createdAt, locale) : 'N/A'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-4">
                                <div className="text-sm font-semibold text-gray-700 dark:text-gray-400 mb-2">
                                    {i18n.language === 'ar' ? 'التفاصيل:' : 'Details:'}
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                    {report.content || (i18n.language === 'ar' ? 'لا يوجد وصف' : 'No description')}
                                </p>
                            </div>

                            {report.adminReply || report.admin_reply ? (
                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FiCheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        <div className="text-sm font-semibold text-green-700 dark:text-green-400">
                                            {i18n.language === 'ar' ? 'رد الإدارة:' : 'Admin Reply:'}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        {report.adminReply || report.admin_reply}
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3">
                                    <p className="text-sm text-yellow-700 dark:text-yellow-400">
                                        {i18n.language === 'ar'
                                            ? 'في انتظار رد الإدارة...'
                                            : 'Waiting for admin reply...'}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyReports;

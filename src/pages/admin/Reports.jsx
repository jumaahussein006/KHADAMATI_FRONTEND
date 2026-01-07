import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { reportsAPI } from '../../services/apiService';
import { FiAlertCircle, FiTrash2, FiSend, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate } from '../../utils/date';

const Reports = () => {
  const { t, i18n } = useTranslation();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await reportsAPI.getAll();
      if (res.success) {
        setReports(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (reportId) => {
    if (!replyText.trim()) {
      alert(i18n.language === 'ar' ? 'الرجاء كتابة رد' : 'Please write a reply');
      return;
    }

    try {
      setSubmitting(true);
      await reportsAPI.update(reportId, { admin_reply: replyText });
      alert(i18n.language === 'ar' ? 'تم إرسال الرد بنجاح' : 'Reply sent successfully');
      setSelectedReport(null);
      setReplyText('');
      fetchReports();
    } catch (err) {
      console.error('Error sending reply:', err);
      alert(err.response?.data?.message || (i18n.language === 'ar' ? 'فشل إرسال الرد' : 'Failed to send reply'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(i18n.language === 'ar' ? 'هل أنت متأكد من حذف هذا التقرير؟' : 'Are you sure you want to delete this report?')) {
      return;
    }

    try {
      await reportsAPI.delete(id);
      fetchReports();
    } catch (err) {
      console.error('Error deleting report:', err);
      alert(err.response?.data?.message || 'Failed to delete report');
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">
            {i18n.language === 'ar' ? 'التقارير' : 'Reports'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {i18n.language === 'ar' ? 'إدارة تقارير المستخدمين' : 'Manage user reports'}
          </p>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          {i18n.language === 'ar' ? 'لا توجد تقارير' : 'No reports'}
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
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <FiAlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg dark:text-white mb-1">
                      {report.title || report.reason || (i18n.language === 'ar' ? 'تقرير' : 'Report')}
                    </h3>
                    <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                      <div>
                        <span className="font-semibold">
                          {i18n.language === 'ar' ? 'من:' : 'From:'}
                        </span>{' '}
                        {report.reporter
                          ? `${report.reporter.firstName} ${report.reporter.middleName || ''} ${report.reporter.lastName}`.trim()
                          : (i18n.language === 'ar' ? `مستخدم #${report.userId || report.user_id}` : `User #${report.userId || report.user_id}`)}
                        {report.reporter?.role && (
                          <span className="ml-2 px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">
                            {report.reporter.role}
                          </span>
                        )}
                      </div>
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

                <button
                  onClick={() => handleDelete(report.reportId || report.report_id)}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition text-red-600"
                  title={i18n.language === 'ar' ? 'حذف' : 'Delete'}
                >
                  <FiTrash2 className="h-5 w-5" />
                </button>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {report.content || report.description || (i18n.language === 'ar' ? 'لا يوجد وصف' : 'No description')}
                </p>
              </div>

              {report.adminReply || report.admin_reply ? (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                  <div className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">
                    {i18n.language === 'ar' ? 'رد الإدارة:' : 'Admin Reply:'}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {report.adminReply || report.admin_reply}
                  </p>
                </div>
              ) : (
                selectedReport === (report.reportId || report.report_id) ? (
                  <div className="space-y-3">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows="4"
                      placeholder={i18n.language === 'ar' ? 'اكتب ردك هنا...' : 'Write your reply here...'}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-[#0BA5EC] focus:border-transparent"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReply(report.reportId || report.report_id)}
                        disabled={submitting}
                        className="flex items-center gap-2 px-4 py-2 bg-[#0BA5EC] text-white rounded-lg hover:bg-[#0BA5EC]/90 transition font-bold disabled:opacity-50"
                      >
                        <FiSend className="h-4 w-4" />
                        {submitting
                          ? (i18n.language === 'ar' ? 'جاري الإرسال...' : 'Sending...')
                          : (i18n.language === 'ar' ? 'إرسال' : 'Send')}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedReport(null);
                          setReplyText('');
                        }}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition font-bold"
                      >
                        {i18n.language === 'ar' ? 'إلغاء' : 'Cancel'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedReport(report.reportId || report.report_id)}
                    className="w-full py-2 border border-[#0BA5EC] text-[#0BA5EC] rounded-lg hover:bg-[#0BA5EC]/10 transition font-bold"
                  >
                    {i18n.language === 'ar' ? 'الرد على التقرير' : 'Reply to Report'}
                  </button>
                )
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reports;

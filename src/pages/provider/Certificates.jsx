import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { certificatesAPI } from '../../services/apiService';
import { formatDate } from '../../utils/date';
import { FiPlus, FiTrash2, FiAward, FiCalendar, FiExternalLink, FiLoader } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { UPLOAD_URL } from '../../utils/api';

const Certificates = () => {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http') || path.startsWith('data:')) return path;
        return `${UPLOAD_URL}${path.startsWith('/') ? '' : '/'}${path}`;
    };

    const fetchCerts = async () => {
        setLoading(true);
        try {
            const providerId = user?.provider_id || user?.roleId;
            if (providerId) {
                const response = await certificatesAPI.getAll(providerId);
                if (response.data?.success) {
                    setCertificates(response.data.data || []);
                } else if (Array.isArray(response.data)) {
                    setCertificates(response.data);
                }
            }
        } catch (err) {
            console.error('Error fetching certificates:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchCerts();
        }
    }, [user]);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploading(true);
            const reader = new FileReader();
            reader.onloadend = async () => {
                try {
                    await certificatesAPI.create({
                        provider_id: user?.provider_id || user?.roleId,
                        image: reader.result,
                        description: file.name,
                        issue_date: new Date().toISOString()
                    });
                    await fetchCerts();
                    alert(t('success.certificateUploaded'));
                } catch (err) {
                    console.error('Error uploading certificate:', err);
                    alert(t('errors.tryAgain'));
                } finally {
                    setUploading(false);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDelete = async (certId) => {
        if (window.confirm(t('common.confirmDeleteCertificate'))) {
            try {
                await certificatesAPI.delete(certId);
                await fetchCerts();
                alert(t('common.certificateDeleted'));
            } catch (err) {
                console.error('Error deleting certificate:', err);
                alert(t('errors.tryAgain'));
            }
        }
    };

    const locale = i18n.language === 'ar' ? 'ar-LB' : 'en-US';

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black dark:text-white">{t('provider.certificates')}</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{t('provider.profile.certificates')}</p>
                </div>

                <label className="flex items-center gap-2 px-6 py-3 bg-[#0BA5EC] text-white rounded-2xl hover:bg-[#0BA5EC]/90 cursor-pointer transition-all shadow-lg hover:shadow-[#0BA5EC]/25 active:scale-95 font-bold">
                    {uploading ? <FiLoader className="h-5 w-5 animate-spin" /> : <FiPlus className="h-5 w-5" />}
                    {uploading ? t('common.uploading') : t('provider.uploadCertificate')}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        className="hidden"
                        disabled={uploading}
                    />
                </label>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <FiLoader className="h-12 w-12 animate-spin text-[#0BA5EC]" />
                </div>
            ) : certificates.length > 0 ? (
                <motion.div
                    layout
                    className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                >
                    <AnimatePresence>
                        {certificates.map((cert) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                key={cert.certificate_id}
                                className="group bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-500"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={getImageUrl(cert.image)}
                                        alt="Certificate"
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                        <button className="p-4 bg-white text-black rounded-full hover:scale-110 transition shadow-xl">
                                            <FiExternalLink />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cert.certificate_id)}
                                            className="p-4 bg-red-500 text-white rounded-full hover:scale-110 transition shadow-xl"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 mb-4 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-2xl w-fit">
                                        <FiCalendar className="text-[#0BA5EC]" />
                                        <span className="text-xs font-bold uppercase tracking-wider">
                                            {t('common.issueDate')}: {formatDate(cert.issue_date, locale, { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <h3 className="font-bold dark:text-white line-clamp-1">{cert.description || t('provider.certificate')}</h3>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            ) : (
                <div className="bg-white dark:bg-gray-800 p-20 text-center rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-700">
                    <div className="h-20 w-20 bg-blue-50 dark:bg-blue-900/20 text-[#0BA5EC] flex items-center justify-center rounded-3xl mx-auto mb-6">
                        <FiAward className="h-10 w-10" />
                    </div>
                    <p className="text-xl font-bold dark:text-white mb-2">{t('common.noCertificates')}</p>
                    <p className="text-gray-500 max-w-xs mx-auto">{t('provider.profile.certificates')}</p>
                </div>
            )}
        </div>
    );
};

export default Certificates;

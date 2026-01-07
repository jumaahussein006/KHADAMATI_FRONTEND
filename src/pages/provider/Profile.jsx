import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { profileAPI, nameChangeAPI, certificatesAPI } from '../../services/apiService';
import { UPLOAD_URL } from '../../utils/api';
import { readFileAsBase64, validateFileSize, validateFileType } from '../../utils/fileHelper';
import { FiCamera, FiSave, FiX, FiPlus, FiTrash2, FiFileText, FiEdit } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
    const { t } = useTranslation();
    const { user, updateUser: updateAuthUser } = useAuth();
    const [editing, setEditing] = useState(false);
    const [certificates, setCertificates] = useState([]);
    const [showCertModal, setShowCertModal] = useState(false);
    const [addresses, setAddresses] = useState(user?.addresses || []);

    const [formData, setFormData] = useState({
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        avatar: ''
    });

    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http') || path.startsWith('data:')) return path;
        return `${UPLOAD_URL}${path.startsWith('/') ? '' : '/'}${path}`;
    };

    const [newCert, setNewCert] = useState({
        image: '',
        description: ''
    });

    useEffect(() => {
        // setLocations(getLocations());
        if (user) {
            setFormData({
                first_name: user.firstName || user.first_name || '',
                middle_name: user.middleName || user.middle_name || '',
                last_name: user.lastName || user.last_name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                avatar: user.avatar || ''
            });

            if (user.addresses) {
                setAddresses(user.addresses);
            }

            loadCertificates();
        }
    }, [user]);

    useEffect(() => {
        const fetchProfile = async () => {
            if (user) {
                try {
                    const response = await profileAPI.get('provider');
                    if (response.success) {
                        const profileData = response.data;
                        const userInfo = profileData.user || profileData;
                        if (userInfo.addresses) {
                            setAddresses(userInfo.addresses);
                        }
                    }
                } catch (error) {
                    console.error('Failed to fetch profile:', error);
                }
            }
        };
        fetchProfile();
    }, [user]);

    const loadCertificates = async () => {
        if (user) {
            try {
                const res = await certificatesAPI.getAll(user.user_id);
                setCertificates(res.data || []);
            } catch (err) {
                console.error('Error loading certificates:', err);
            }
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!validateFileSize(file)) {
            alert(t('errors.fileTooLarge'));
            return;
        }

        if (!validateFileType(file, ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'])) {
            alert(t('errors.invalidFileType'));
            return;
        }

        try {
            const base64 = await readFileAsBase64(file);
            setFormData({ ...formData, avatar: base64 });
        } catch (error) {
            console.error('Error reading file:', error);
            alert(t('errors.somethingWentWrong'));
        }
    };

    const handleSave = async () => {
        if (!user) return;

        const nameChanged =
            formData.first_name !== user.first_name ||
            formData.middle_name !== user.middle_name ||
            formData.last_name !== user.last_name;

        try {
            if (nameChanged) {
                await nameChangeAPI.request({
                    new_firstname: formData.first_name,
                    new_middlename: formData.middle_name || null,
                    new_lastname: formData.last_name,
                });
                alert(t('provider.profile.nameChangeRequested'));
            }

            const userUpdates = { ...formData };
            if (nameChanged) {
                userUpdates.first_name = user.first_name;
                userUpdates.middle_name = user.middle_name;
                userUpdates.last_name = user.last_name;
            }

            const res = await profileAPI.update('provider', userUpdates);
            if (res.success) {
                updateAuthUser({ ...user, ...userUpdates });
                if (!nameChanged) alert(t('success.profileUpdated'));
                setEditing(false);
            }
        } catch (err) {
            console.error('Error saving profile:', err);
            alert(t('errors.tryAgain'));
        }
    };

    const handleCertFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const base64 = await readFileAsBase64(file);
            setNewCert({ ...newCert, image: base64 });
        } catch (error) {
            console.error('Error reading cert file:', error);
        }
    };

    const handleAddCert = async () => {
        if (!newCert.image) return;
        try {
            await certificatesAPI.create({
                provider_id: user.user_id,
                image: newCert.image,
                description: newCert.description
            });
            setNewCert({ image: '', description: '' });
            setShowCertModal(false);
            loadCertificates();
            alert(t('provider.profile.certUploadSuccess'));
        } catch (err) {
            console.error('Error adding cert:', err);
            alert(t('errors.tryAgain'));
        }
    };

    const handleDeleteCert = async (id) => {
        if (window.confirm(t('common.confirmDeleteCertificate'))) {
            try {
                await certificatesAPI.delete(id);
                loadCertificates();
            } catch (err) {
                console.error('Error deleting cert:', err);
                alert(t('errors.tryAgain'));
            }
        }
    };

    const inputClass = "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] dark:bg-gray-700 dark:text-white disabled:opacity-50 transition-all";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-8 pb-12"
        >
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black dark:text-white">{t('provider.profile.title')}</h1>
                {!editing && (
                    <button
                        onClick={() => setEditing(true)}
                        className="px-6 py-2.5 bg-[#0BA5EC] text-white rounded-xl hover:shadow-xl hover:bg-[#0891D1] transition-all active:scale-95 font-bold flex items-center gap-2 group"
                    >
                        <FiEdit className="group-hover:rotate-12 transition-transform" />
                        {t('common.edit')}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
                        <div className="flex flex-col sm:flex-row items-center gap-8 mb-8">
                            <div className="relative group">
                                <img
                                    src={getImageUrl(formData.avatar) || '/placeholder-avatar.png'}
                                    alt="Avatar"
                                    className="w-32 h-32 rounded-3xl object-cover border-4 border-gray-50 dark:border-gray-700"
                                />
                                {editing && (
                                    <label className="absolute -bottom-2 -right-2 bg-[#0BA5EC] text-white p-3 rounded-2xl cursor-pointer hover:scale-110 transition shadow-lg">
                                        <FiCamera className="h-5 w-5" />
                                        <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                                    </label>
                                )}
                            </div>
                            <div className="text-center sm:text-left">
                                <h2 className="text-2xl font-bold dark:text-white">
                                    {user?.first_name} {user?.last_name}
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
                                <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold rounded-full uppercase tracking-wider">
                                    {t('common.active')}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                                    {t('common.firstName')}
                                </label>
                                <input
                                    type="text"
                                    value={formData.first_name}
                                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                    disabled={!editing}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                                    {t('common.middleName')}
                                </label>
                                <input
                                    type="text"
                                    value={formData.middle_name}
                                    onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })}
                                    disabled={!editing}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                                    {t('common.lastName')}
                                </label>
                                <input
                                    type="text"
                                    value={formData.last_name}
                                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                    disabled={!editing}
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                                    {t('common.phone')}
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    disabled={!editing}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                                    {t('customer.profile.address')}
                                </label>
                                <div className="space-y-2">
                                    {addresses.length > 0 ? (
                                        addresses.map((addr) => (
                                            <div key={addr.address_id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm dark:text-white">
                                                {addr.building ? `${addr.building}, ` : ''}{addr.street}, {addr.city}, {addr.country}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-xs italic">{t('common.noAddressSet') || 'No address set'}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {editing && (
                            <div className="flex gap-4 mt-8">
                                <button
                                    onClick={handleSave}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-green-200 dark:shadow-none font-bold"
                                >
                                    <FiSave className="h-5 w-5" />
                                    {t('common.save')}
                                </button>
                                <button
                                    onClick={() => setEditing(false)}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-white rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all active:scale-95 font-bold"
                                >
                                    <FiX className="h-5 w-5" />
                                    {t('common.cancel')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Certificates Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-black dark:text-white uppercase tracking-tighter text-lg">
                                {t('provider.profile.certificates')}
                            </h3>
                            <button
                                onClick={() => setShowCertModal(true)}
                                className="p-2 bg-[#0BA5EC]/10 text-[#0BA5EC] rounded-lg hover:bg-[#0BA5EC] hover:text-white transition"
                            >
                                <FiPlus className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {certificates.length === 0 ? (
                                <div className="text-center py-8 opacity-50">
                                    <FiFileText className="h-12 w-12 mx-auto mb-2" />
                                    <p className="text-sm">{t('common.noCertificates')}</p>
                                </div>
                            ) : (
                                certificates.map(cert => (
                                    <div key={cert.certificate_id} className="group relative bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                                        <img src={getImageUrl(cert.image)} alt="Cert" className="w-full h-32 object-cover transition-transform group-hover:scale-110" />
                                        <div className="p-3">
                                            <p className="text-xs text-gray-500 mb-1">{new Date(cert.issue_date).toLocaleDateString()}</p>
                                            <p className="text-sm font-medium dark:text-white line-clamp-1">{cert.description || t('common.noDetails')}</p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteCert(cert.certificate_id)}
                                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition shadow-lg"
                                        >
                                            <FiTrash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Certificate Upload Modal */}
            <AnimatePresence>
                {showCertModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md p-8 shadow-2xl"
                        >
                            <h2 className="text-2xl font-black mb-6 dark:text-white">{t('provider.profile.uploadCertificate')}</h2>

                            <div className="space-y-6">
                                <div className="relative group cursor-pointer border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl hover:border-[#0BA5EC] transition-all p-4 text-center">
                                    {newCert.image ? (
                                        <div className="relative">
                                            <img src={getImageUrl(newCert.image)} className="w-full h-48 object-contain rounded-xl" />
                                            <button onClick={() => setNewCert({ ...newCert, image: '' })} className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full"><FiX /></button>
                                        </div>
                                    ) : (
                                        <label className="block py-12 cursor-pointer">
                                            <FiPlus className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                                            <p className="text-sm font-bold text-gray-500">{t('provider.profile.certImage')}</p>
                                            <input type="file" accept="image/*" className="hidden" onChange={handleCertFileChange} />
                                        </label>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-gray-500 uppercase mb-2">{t('provider.profile.certDescription')}</label>
                                    <textarea
                                        className={inputClass}
                                        rows="3"
                                        value={newCert.description}
                                        onChange={(e) => setNewCert({ ...newCert, description: e.target.value })}
                                    ></textarea>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={handleAddCert}
                                        disabled={!newCert.image}
                                        className="flex-1 py-3 bg-[#0BA5EC] text-white rounded-xl font-bold hover:shadow-lg disabled:opacity-50 transition"
                                    >
                                        {t('common.upload')}
                                    </button>
                                    <button
                                        onClick={() => setShowCertModal(false)}
                                        className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-white rounded-xl font-bold hover:bg-gray-200 transition"
                                    >
                                        {t('common.cancel')}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Profile;

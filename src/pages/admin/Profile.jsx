import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/apiService';
import { readFileAsBase64, validateFileSize, validateFileType } from '../../utils/fileHelper';
import { FiCamera, FiSave, FiX, FiLoader } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Profile = () => {
    const { t } = useTranslation();
    const { user, setUser } = useAuth();
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        avatar: ''
    });
    const [avatarPreview, setAvatarPreview] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                phone: user.phone || '',
                avatar: user.avatar || ''
            });
            setAvatarPreview(user.avatar || '/placeholder-avatar.png');
        }
    }, [user]);

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
            setAvatarPreview(base64);
            setFormData({ ...formData, avatar: base64 });
        } catch (error) {
            console.error('Error reading file:', error);
            alert(t('errors.somethingWentWrong'));
        }
    };

    const handleSave = async () => {
        if (!user) return;

        try {
            setSaving(true);
            const response = await adminAPI.updateUser(user.user_id, formData);
            if (response.success) {
                setUser({ ...user, ...formData });
                alert(t('success.profileUpdated'));
                setEditing(false);
            } else {
                alert(response.message || t('errors.somethingWentWrong'));
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            alert(t('errors.somethingWentWrong'));
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            email: user.email || '',
            phone: user.phone || '',
            avatar: user.avatar || ''
        });
        setAvatarPreview(user.avatar || '/placeholder-avatar.png');
        setEditing(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            <h1 className="text-3xl font-bold dark:text-white">{t('common.profile')}</h1>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex flex-col items-center mb-6">
                    <div className="relative mb-4">
                        <img
                            src={avatarPreview}
                            alt="Avatar"
                            className="w-32 h-32 rounded-full object-cover border-4 border-[#0BA5EC]"
                        />
                        {editing && (
                            <label className="absolute bottom-0 right-0 bg-[#0BA5EC] text-white p-2 rounded-full cursor-pointer hover:bg-[#0BA5EC]/90 transition">
                                <FiCamera className="h-5 w-5" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>
                    <h2 className="text-xl font-bold dark:text-white">
                        {formData.first_name} {formData.last_name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">{formData.email}</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">{t('dashboard.admin.systemAdmin')}</p>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('auth.firstName')}
                            </label>
                            <input
                                type="text"
                                value={formData.first_name}
                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                disabled={!editing}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] dark:bg-gray-700 dark:text-white disabled:opacity-50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('auth.lastName')}
                            </label>
                            <input
                                type="text"
                                value={formData.last_name}
                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                disabled={!editing}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] dark:bg-gray-700 dark:text-white disabled:opacity-50"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('auth.email')}
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            disabled={!editing}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] dark:bg-gray-700 dark:text-white disabled:opacity-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('auth.phone')}
                        </label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            disabled={!editing}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] dark:bg-gray-700 dark:text-white disabled:opacity-50"
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        {!editing ? (
                            <button
                                onClick={() => setEditing(true)}
                                className="flex-1 px-4 py-2 bg-[#0BA5EC] text-white rounded-lg hover:bg-[#0BA5EC]/90 transition"
                            >
                                {t('common.edit')}
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50"
                                >
                                    {saving ? <FiLoader className="h-5 w-5 animate-spin" /> : <FiSave className="h-5 w-5" />}
                                    {t('common.save')}
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                                >
                                    <FiX className="h-5 w-5" />
                                    {t('common.cancel')}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Profile;

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { profileAPI, nameChangeAPI } from '../../services/apiService';
import { UPLOAD_URL } from '../../utils/api';
import { readFileAsBase64, validateFileSize, validateFileType } from '../../utils/fileHelper';
import { FiCamera, FiSave } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Profile = () => {
  const { t } = useTranslation();
  const { user, updateUser: updateAuthUser } = useAuth();
  const [avatarPreview, setAvatarPreview] = useState('');

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    return `${UPLOAD_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    avatar: user?.avatar || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [addresses, setAddresses] = useState(user?.addresses || []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const response = await profileAPI.get(user.role || 'customer');
          if (response.success) {
            const profileData = response.data;
            // user data is nested in profileData.user (for customer/provider)
            const userInfo = profileData.user || profileData;

            if (userInfo.addresses) {
              setAddresses(userInfo.addresses);
            }

            // Update form data if needed (optional, keeping existing logic for basic fields)
            // setAvatarPreview(userInfo.avatar || '/placeholder-avatar.png');
          }
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      }
    };
    fetchProfile();

    if (user) {
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

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    const nameChanged = formData.first_name !== user?.first_name || formData.last_name !== user?.last_name;

    console.log('=== PROFILE UPDATE DEBUG ===');
    console.log('User object:', user);
    console.log('FormData:', formData);
    console.log('Name changed?', nameChanged);

    try {
      if (nameChanged) {
        const nameChangePayload = {
          new_firstname: formData.first_name,
          new_middlename: formData.middle_name || null,
          new_lastname: formData.last_name,
        };
        console.log('Sending name change request:', nameChangePayload);
        await nameChangeAPI.request(nameChangePayload);
        alert(t('profile.nameChangeRequestSent') || 'Your name change request has been sent to the admin.');
      }

      // Only send non-name fields to profile update
      const updateData = { ...formData };
      if (nameChanged) {
        updateData.first_name = user.first_name;
        updateData.last_name = user.last_name;
        updateData.middle_name = user.middle_name;
      }

      console.log('Sending profile update:', updateData);
      const response = await profileAPI.update('customer', updateData);
      console.log('Profile update response:', response);

      updateAuthUser({ ...user, ...updateData });

      if (!nameChanged) {
        alert(t('success.profileUpdated'));
      }
    } catch (err) {
      console.error('=== PROFILE UPDATE ERROR ===');
      console.error('Error object:', err);
      console.error('Error response:', err.response);
      console.error('Error message:', err.message);
      alert(t('errors.tryAgain'));
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert(t('auth.passwordMismatch'));
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert(t('auth.passwordTooShort'));
      return;
    }

    // In real app, verify current password first
    alert(t('success.passwordChanged'));
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const inputClass =
    'w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] dark:bg-gray-700 dark:text-white';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-8 pb-12"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black dark:text-white uppercase tracking-tighter">{t('customer.profile.title')}</h1>
      </div>

      {/* Profile Info */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
        <div className="flex flex-col sm:flex-row items-center gap-8 mb-10">
          <div className="relative group">
            <img
              src={getImageUrl(avatarPreview) || '/placeholder-avatar.png'}
              alt="Avatar"
              className="w-32 h-32 rounded-3xl object-cover border-4 border-gray-50 dark:border-gray-700 shadow-xl"
            />
            <label className="absolute -bottom-2 -right-2 bg-[#0BA5EC] text-white p-3 rounded-2xl cursor-pointer hover:scale-110 transition shadow-lg group-hover:rotate-12">
              <FiCamera className="h-5 w-5" />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-black dark:text-white mb-2">
              {formData.first_name} {formData.last_name}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">{formData.email}</p>
            <div className="flex items-center gap-2 mt-3">
              <span className="px-3 py-1 bg-blue-100 text-[#0BA5EC] dark:bg-blue-900/30 dark:text-blue-400 text-[10px] font-black rounded-full uppercase tracking-widest">
                {t('dashboard.customer.customer')}
              </span>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold dark:text-white mb-4">{t('customer.profile.personalInfo')}</h2>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('auth.firstName')}
              </label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className={inputClass}
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
                className={inputClass}
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
              className={inputClass}
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
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">
              {t('customer.profile.address')}
            </label>
            <div className="space-y-3">
              {addresses.length > 0 ? (
                addresses.map((addr) => (
                  <div key={addr.address_id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl text-sm font-medium border border-transparent hover:border-gray-200 transition-all dark:text-white">
                    {addr.building ? `${addr.building}, ` : ''}{addr.street}, {addr.city}, {addr.country}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm italic">{t('common.noAddressSet') || 'No addresses found'}</p>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#0BA5EC] to-[#0891D1] text-white rounded-2xl hover:shadow-xl hover:scale-[1.01] active:scale-95 transition-all font-black text-lg shadow-lg"
          >
            <FiSave className="h-6 w-6" />
            {t('common.save')}
          </button>
        </form>
      </div>

      {/* Password Change */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
        <h2 className="text-xl font-black dark:text-white mb-6 uppercase tracking-widest text-[#0BA5EC]">{t('customer.profile.changePassword')}</h2>
        <form onSubmit={handlePasswordChange} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                {t('customer.profile.currentPassword')}
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className={inputClass.replace('py-2', 'py-3.5')}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                {t('customer.profile.newPassword')}
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className={inputClass.replace('py-2', 'py-3.5')}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                {t('auth.confirmPassword')}
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className={inputClass.replace('py-2', 'py-3.5')}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full px-6 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95 transition-all font-black"
          >
            {t('customer.profile.changePassword')}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default Profile;


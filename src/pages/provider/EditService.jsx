import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { servicesAPI, categoriesAPI } from '../../services/apiService';
import { UPLOAD_URL } from '../../utils/api';
import { FiLoader, FiImage, FiX } from 'react-icons/fi';

const EditService = () => {
    const { t, i18n } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [formData, setFormData] = useState({
        name_ar: '',
        name_en: '',
        description: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch service by ID
                const serviceRes = await servicesAPI.getById(id);
                if (serviceRes.success && serviceRes.data) {
                    const service = serviceRes.data;
                    setFormData({
                        name_ar: service.nameAr || service.name_ar || '',
                        name_en: service.nameEn || service.name_en || '',
                        description: service.descriptionAr || service.description_ar || service.description || ''
                    });
                    // Load existing images
                    setExistingImages(service.images || []);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                alert(t('errors.somethingWentWrong'));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, t]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        const valid = [];
        files.forEach((file) => {
            if (file.size > 5 * 1024 * 1024) {
                alert(`${file.name}: File too large (max 5MB)`);
            } else if (!file.type.startsWith('image/')) {
                alert(`${file.name}: Invalid file type`);
            } else {
                valid.push(file);
            }
        });

        const newPreviews = [];
        valid.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviews.push(reader.result);
                if (newPreviews.length === valid.length) {
                    setImagePreviews((prev) => [...prev, ...newPreviews]);
                }
            };
            reader.readAsDataURL(file);
        });

        setImages((prev) => [...prev, ...valid]);
        e.target.value = '';
    };

    const removeNewImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);

            // If new images are added, send as FormData
            if (images.length > 0) {
                const fd = new FormData();
                fd.append('name_ar', formData.name_ar);
                fd.append('name_en', formData.name_en);
                fd.append('description_ar', formData.description || '');
                fd.append('description_en', formData.description || '');
                images.forEach((img) => fd.append('images', img));

                await servicesAPI.update(parseInt(id), fd);
            } else {
                // No new images, send as JSON
                await servicesAPI.update(parseInt(id), formData);
            }

            alert(t('success.serviceUpdated'));
            navigate('/provider/services');
        } catch (err) {
            console.error('Error updating service:', err);
            alert(t('errors.tryAgain'));
        } finally {
            setSubmitting(false);
        }
    };

    const getCategoryName = (category) => {
        return i18n.language === 'ar' ? category.name_ar : (category.name_en || category.name);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <FiLoader className="h-8 w-8 animate-spin text-[#0BA5EC]" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold dark:text-white mb-6">{t('service.editService')}</h1>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Arabic Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('service.nameAr')}
                        </label>
                        <input
                            type="text"
                            value={formData.name_ar}
                            onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                            required
                            dir="rtl"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                    {/* English Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('service.nameEn')}
                        </label>
                        <input
                            type="text"
                            value={formData.name_en}
                            onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                            required
                            dir="ltr"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    {/* Premium Image Management Section */}
                    <div className="space-y-6 bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-6">
                        {/* Existing Images */}
                        {existingImages.length > 0 && (
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                                    <FiImage className="text-[#0BA5EC]" />
                                    {t('service.currentImages')}
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {existingImages.map((img, idx) => (
                                        <div key={idx} className="relative group rounded-xl overflow-hidden border-2 border-gray-100 dark:border-gray-600 aspect-square shadow-sm">
                                            <img
                                                src={`${UPLOAD_URL}${img.image.startsWith('/') ? '' : '/'}${img.image}`}
                                                alt={`Existing ${idx}`}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute top-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-md backdrop-blur-sm">
                                                {t('common.active')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Add New Images Drag-Drop Area */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                                <FiImage className="text-green-500" />
                                {t('service.addNewImages')}
                                <span className="text-xs font-normal opacity-60">({images.length}/5)</span>
                            </label>

                            <div className="relative group border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 transition-all hover:bg-white dark:hover:bg-gray-800/50 hover:border-[#0BA5EC] cursor-pointer text-center bg-white dark:bg-gray-800/30">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    disabled={images.length >= 5}
                                />
                                <div className="space-y-2">
                                    <div className="mx-auto w-12 h-12 bg-[#0BA5EC]/10 text-[#0BA5EC] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <FiImage className="h-6 w-6" />
                                    </div>
                                    <div className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                        {images.length >= 5 ? t('service.maxImagesReached') : t('service.uploadImages')}
                                    </div>
                                    <p className="text-xs text-gray-500">{t('service.uploadImagesHint') || 'Support JPG, PNG, GIF up to 5MB'}</p>
                                </div>
                            </div>

                            {imagePreviews.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                                    {imagePreviews.map((src, idx) => (
                                        <div key={idx} className="relative group rounded-xl overflow-hidden border-2 border-transparent hover:border-[#0BA5EC] transition-all aspect-square bg-gray-100 dark:bg-gray-900 shadow-sm">
                                            <img src={src} alt={`New ${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewImage(idx)}
                                                    className="p-2 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition-colors"
                                                >
                                                    <FiX className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <div className="absolute bottom-1 right-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-md shadow-lg">
                                                New
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('service.description')}
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows="6"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-4 py-3 bg-[#0BA5EC] text-white rounded-lg hover:bg-[#0BA5EC]/90 font-medium disabled:opacity-50"
                        >
                            {submitting ? <FiLoader className="animate-spin mx-auto" /> : t('common.save')}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/provider/services')}
                            className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-medium"
                        >
                            {t('common.cancel')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditService;

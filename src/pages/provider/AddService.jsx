import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { categoriesAPI, servicesAPI } from '../../services/apiService';
import { getCategoryName } from '../../utils/langHelper';
import { FiX, FiImage } from 'react-icons/fi';

const MAX_IMAGES = 5;

const AddService = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name_ar: '',
    name_en: '',
    description: '',
    price: '',
  });



  const inputClass =
    'w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] dark:bg-gray-700 dark:text-white';

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const total = images.length + files.length;
    if (total > MAX_IMAGES) {
      alert(t('errors.maxImages') || `Max ${MAX_IMAGES} images`);
      e.target.value = '';
      return;
    }

    const valid = [];
    const invalid = [];

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) invalid.push(`${file.name}: ${t('errors.fileTooLarge')}`);
      else if (!file.type.startsWith('image/')) invalid.push(`${file.name}: ${t('errors.invalidFileType')}`);
      else valid.push(file);
    });

    if (invalid.length) alert(invalid.join('\n'));

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

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const fd = new FormData();
      fd.append('name_ar', formData.name_ar);
      fd.append('name_en', formData.name_en);
      fd.append('price', String(formData.price));
      fd.append('description_ar', formData.description || '');
      fd.append('description_en', formData.description || '');

      // Add images - make sure we're appending File objects
      console.log('[FRONTEND] Images to upload:', images.length);
      images.forEach((img, idx) => {
        console.log('[FRONTEND] Appending image', idx, 'Type:', img.constructor.name, 'Size:', img.size);
        fd.append('images', img);
      });

      console.log('[FRONTEND] FormData created, sending to API...');
      await servicesAPI.create(fd);

      alert(t('success.serviceAdded'));
      navigate('/provider/services');
    } catch (err) {
      console.error('Error creating service:', err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        t('errors.tryAgain');
      setError(msg);
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const isRTL = i18n.language === 'ar';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <h1 className="text-3xl font-bold dark:text-white">{t('service.addService')}</h1>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-xl text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold text-gray-600 dark:text-gray-300">{t('service.nameAr')}</label>
            <input
              className={inputClass}
              value={formData.name_ar}
              onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
              required
              dir="rtl"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-600 dark:text-gray-300">{t('service.nameEn')}</label>
            <input
              className={inputClass}
              value={formData.name_en}
              onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
              required
              dir="ltr"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-bold text-gray-600 dark:text-gray-300">{t('service.description')}</label>
            <textarea
              className={inputClass}
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-600 dark:text-gray-300">{t('service.price')}</label>
            <input
              className={inputClass}
              type="number"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Premium Image Upload Section */}
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-6 border-2 border-transparent">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-4">
            <FiImage className="text-[#0BA5EC] h-5 w-5" />
            {t('service.images')}
            <span className="text-xs font-normal opacity-60">({images.length}/{MAX_IMAGES})</span>
          </label>

          <div className="relative group border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 transition-all hover:bg-white dark:hover:bg-gray-800/50 hover:border-[#0BA5EC] cursor-pointer text-center">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={images.length >= MAX_IMAGES}
            />

            <div className="space-y-2">
              <div className="mx-auto w-12 h-12 bg-[#0BA5EC]/10 text-[#0BA5EC] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FiImage className="h-6 w-6" />
              </div>
              <div className="text-sm font-bold text-gray-700 dark:text-gray-300">
                {images.length >= MAX_IMAGES ? t('service.maxImagesReached') : t('service.uploadImages')}
              </div>
              <p className="text-xs text-gray-500">{t('service.uploadImagesHint') || 'Support JPG, PNG, GIF up to 5MB'}</p>
            </div>
          </div>

          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
              {imagePreviews.map((src, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden border-2 border-transparent hover:border-[#0BA5EC] transition-all aspect-square bg-gray-100 dark:bg-gray-900 shadow-sm">
                  <img src={src} alt={`preview-${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="p-2 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition-colors"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-md backdrop-blur-sm">
                    #{idx + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="px-6 py-3 bg-[#0BA5EC] text-white rounded-xl font-bold hover:opacity-90 disabled:opacity-50">
            {loading ? t('common.loading') : t('common.save')}
          </button>

          <button type="button" disabled={loading} onClick={() => navigate('/provider/services')} className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50">
            {t('common.cancel')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddService;

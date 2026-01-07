import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiDroplet,
  FiZap,
  FiTool,
  FiFeather,
  FiHome,
  FiSun,
  FiWind,
  FiTruck,
  FiShield
} from 'react-icons/fi';

import { categoriesAPI } from '../../services/apiService';
import { getCategoryName } from '../../utils/langHelper';
import { getErrorMessage } from '../../utils/checkBackend';
import PageTransition, { StaggerContainer, ScaleIn } from '../../components/PageTransition/PageTransition';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';

// Category icon mapping
const categoryIcons = {
  'سباكة': FiDroplet,
  'Plumbing': FiDroplet,
  'كهرباء': FiZap,
  'Electricity': FiZap,
  'نجارة': FiTool,
  'Carpentry': FiTool,
  'دهان': FiFeather,
  'Painting': FiFeather,
  'نظافة': FiHome,
  'Cleaning': FiHome,
  'بستنة': FiSun,
  'Gardening': FiSun,
  'تكييف': FiWind,
  'Air Conditioning': FiWind,
  'نقل': FiTruck,
  'Moving': FiTruck,
  'مكافحة حشرات': FiShield,
  'Pest Control': FiShield,
};

const Categories = () => {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name_ar: '', name_en: ''
  });

  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await categoriesAPI.getAll();
        setCategories(res.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoriesAPI.update(editingCategory, formData);
        alert(t('success.changesSaved'));
      } else {
        await categoriesAPI.create(formData);
        alert(t('success.serviceAdded'));
      }
      // Refresh categories
      const res = await categoriesAPI.getAll();
      setCategories(res.data);
      resetForm();
    } catch (err) {
      console.error('Error saving category:', err);
      alert(t('errors.tryAgain'));
    }
  };

  const resetForm = () => {
    setFormData({ name_ar: '', name_en: '' });
    setShowAddForm(false);
    setEditingCategory(null);
  };

  const handleEdit = (category) => {
    setEditingCategory(category.id || category.category_id);
    setFormData({
      name_ar: category.name_ar || '',
      name_en: category.name_en || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm(t('common.delete') + '?')) {
      try {
        await categoriesAPI.delete(categoryId);
        setCategories(categories.filter(c => (c.id || c.category_id) !== categoryId));
        alert(t('success.changesSaved'));
      } catch (err) {
        console.error('Error deleting category:', err);
        alert(t('errors.tryAgain'));
      }
    }
  };

  const getCategoryIcon = (categoryName) => {
    return categoryIcons[categoryName] || FiHome;
  };

  return (
    <PageTransition variant="fade">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold dark:text-white">{t('categories.management')}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {t('dashboard.admin.categories')}
            </p>
          </div>
          <Button
            onClick={() => {
              setShowAddForm(true);
              setEditingCategory(null);
              setFormData({ name_ar: '', name_en: '' });
            }}
            variant="primary"
            leftIcon={isRTL ? null : <FiPlus />}
            rightIcon={isRTL ? <FiPlus /> : null}
          >
            {t('common.add')} {t('service.category')}
          </Button>
        </div>

        {/* Form Section */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-xl font-bold dark:text-white mb-6">
              {editingCategory ? t('common.edit') : t('common.add')} {t('service.category')}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('service.nameAr')}
                  </label>
                  <input
                    type="text"
                    value={formData.name_ar}
                    onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] dark:bg-gray-700 dark:text-white transition-all text-right"
                    placeholder={t('service.nameAr')}
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('service.nameEn')}
                  </label>
                  <input
                    type="text"
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] dark:bg-gray-700 dark:text-white transition-all text-left"
                    placeholder={t('service.nameEn')}
                    dir="ltr"
                  />
                </div>
              </div>
              <div className="flex gap-4 justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={resetForm}
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                >
                  {editingCategory ? t('common.save') : t('common.add')}
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : (
          <>
            {/* Categories Grid */}
            <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categories.map((category) => {
                const IconComponent = getCategoryIcon(category.name_en);
                return (
                  <ScaleIn key={category.id || category.category_id}>
                    <Card
                      title={getCategoryName(category, i18n.language)}
                      subtitle=""
                      icon={<IconComponent className="h-6 w-6 text-white" />}
                      variant="default"
                      className="h-full"
                    >
                      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <button
                          onClick={() => handleEdit(category)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors text-sm font-medium"
                        >
                          <FiEdit className="h-4 w-4" />
                          {t('common.edit')}
                        </button>
                        <button
                          onClick={() => handleDelete(category.id || category.category_id)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium"
                        >
                          <FiTrash2 className="h-4 w-4" />
                          {t('common.delete')}
                        </button>
                      </div>
                    </Card>
                  </ScaleIn>
                );
              })}
            </StaggerContainer>

            {/* Empty State */}
            {categories.length === 0 && !showAddForm && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <FiHome className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('service.noServices')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {t('common.add')} {t('service.category')}
            </p>
          </div>
            )}
          </>
        )}
      </div>
    </PageTransition>
  );
};

export default Categories;

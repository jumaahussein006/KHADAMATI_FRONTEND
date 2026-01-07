// Registration page - Updated 2025-12-30
import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { categoriesAPI, certificatesAPI } from '../services/apiService';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { KhadamatiLogo } from '../components/KhadamatiLogo';
import { getCategoryName } from '../utils/langHelper';
import { FiX, FiCheckCircle, FiAward } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { isValidEmailProvider } from '../utils/validators/emailValidator';
import PageTransition, { StaggerContainer, FadeInUp } from '../components/PageTransition/PageTransition';

const Register = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { register } = useAuth();
  const [searchParams] = useSearchParams();

  // Initialize role from query param if available
  const initialRole = searchParams.get('role') === 'provider' ? 'provider' : 'customer';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone: '',
    role: initialRole,

    specialization: '',
    category_ids: [],
    experience: '',

    // certificate file (NOT base64)
    certificate: null,
    issue_date: '',

    city: '',
    street: '',
    building: '',
    floor: '',
  });

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [certificatePreview, setCertificatePreview] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      if (formData.role !== 'provider') return;

      try {
        setLoadingCategories(true);
        const res = await categoriesAPI.getAll();
        setCategories(res.data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(t('errors.networkError'));
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [formData.role, t]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const onlyNums = value.replace(/[^0-9]/g, '');
      setFormData((prev) => ({ ...prev, phone: onlyNums }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'role' && value === 'customer') {
      setFormData((prev) => ({
        ...prev,
        role: 'customer',
        specialization: '',
        category_ids: [],
        experience: '',
        certificate: null,
        issue_date: '',
      }));
      setCertificatePreview(null);
    }
  };

  const handleCertificateChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError(t('errors.fileTooLarge'));
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setError(t('errors.invalidFileType'));
      return;
    }

    setFormData((prev) => ({ ...prev, certificate: file }));
    setError('');

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setCertificatePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setCertificatePreview(null);
    }
  };

  const removeCertificate = () => {
    setFormData((prev) => ({ ...prev, certificate: null }));
    setCertificatePreview(null);
  };

  const toggleCategory = (id) => {
    setFormData((prev) => {
      const exists = prev.category_ids.includes(id);
      return { ...prev, category_ids: exists ? prev.category_ids.filter((x) => x !== id) : [...prev.category_ids, id] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isValidEmailProvider(formData.email, false)) {
      setError(t('errors.invalidEmailProvider'));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.passwordMismatch'));
      return;
    }

    if (formData.password.length < 8) {
      setError(t('auth.passwordTooShort') || 'Password must be at least 8 characters long');
      return;
    }

    if (formData.role === 'provider' && (!formData.category_ids || formData.category_ids.length === 0)) {
      setError(t('provider.selectCategory'));
      return;
    }

    // Map categories to specialization if empty (frontend helper only)
    let specialization = formData.specialization;
    if (formData.role === 'provider' && formData.category_ids?.length) {
      const selectedCats = categories.filter((c) => formData.category_ids.includes(c.category_id ?? c.id));
      const catNames = selectedCats.map((c) => getCategoryName(c, i18n.language)).join(', ');
      specialization = specialization || catNames;
    }

    // IMPORTANT: do NOT send certificate as base64 inside register (causes 413) [file:24]
    // Remove fields not in backend schema: category_ids, experience (specialization already extracted above)
    // Clean up fields based on role
    const { confirmPassword, certificate, issue_date, category_ids, experience, city, street, building, floor, specialization: originalSpec, ...rest } = formData;

    const registrationData = {
      ...rest,
    };

    // Only include specialization for providers
    if (formData.role === 'provider') {
      registrationData.specialization = specialization || '';
    } else {
      // Remove any leaked specialization for customers
      delete registrationData.specialization;
    }

    // Only include address if city and street are provided (required fields)
    if (formData.city && formData.street) {
      registrationData.address = {
        city: formData.city,
        street: formData.street,
        building: formData.building || '',
        floor: formData.floor || '',
        country: 'Lebanon',
      };
    }

    const result = await register(registrationData);

    if (!result.success) {
      setError(t(result.error) || t('auth.registerError'));
      return;
    }

    // If provider selected a certificate, upload it AFTER registration using multipart/form-data [file:8][file:57]
    try {
      if (formData.role === 'provider' && formData.certificate) {
        const fd = new FormData();
        fd.append('certificate', formData.certificate); // field name MUST be "certificate" [file:57]
        if (formData.issue_date) fd.append('issue_date', formData.issue_date);

        await certificatesAPI.create(fd);
      }
    } catch (certErr) {
      console.warn('Certificate upload failed:', certErr);
      // ما منوقف التسجيل، بس منبه
    }

    navigate(formData.role === 'provider' ? '/provider/dashboard' : '/customer/dashboard');
  };

  // Placeholder removed as isRTL was unused

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
      <Navbar />

      <PageTransition variant="fade">
        <div className="flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full max-w-2xl"
          >
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-gray-100 dark:border-gray-700 relative overflow-hidden transition-all duration-300">
              <div className="text-center mb-10 relative z-10">
                <Link to="/">
                  <div className="inline-block p-4 bg-white dark:bg-gray-700 rounded-2xl shadow-xl mb-6 cursor-pointer hover:scale-105 transition-transform">
                    <KhadamatiLogo className="h-14 w-14" />
                  </div>
                </Link>
                <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2">{t('auth.registerTitle')}</h2>
                <p className="text-gray-600 dark:text-gray-400 font-medium">{t('auth.joinUs')}</p>
              </div>

              <div className="flex p-1.5 bg-gray-100 dark:bg-gray-700/50 rounded-2xl mb-8">
                {['customer', 'provider'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, role }))}
                    className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${formData.role === role ? 'bg-white dark:bg-gray-600 text-[#0BA5EC]' : 'text-gray-500 dark:text-gray-300'
                      }`}
                  >
                    {t(`auth.${role}`)}
                  </button>
                ))}
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-xl"
                  >
                    <p className="text-sm text-red-700 dark:text-red-300 font-bold">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FadeInUp>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t('auth.firstName')}</label>
                    <input
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-700/50 rounded-2xl outline-none"
                    />
                  </FadeInUp>

                  <FadeInUp>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t('auth.lastName')}</label>
                    <input
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-700/50 rounded-2xl outline-none"
                    />
                  </FadeInUp>

                  <FadeInUp className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t('auth.email')}</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-700/50 rounded-2xl outline-none"
                    />
                  </FadeInUp>

                  <FadeInUp className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t('auth.phone')}</label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-700/50 rounded-2xl outline-none"
                      placeholder="96170123456"
                    />
                  </FadeInUp>

                  <FadeInUp className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      {t('location.city')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-700/50 rounded-2xl outline-none focus:ring-2 focus:ring-[#0BA5EC] transition-all"
                      placeholder={t('location.selectCity') || 'Enter city'}
                    />
                  </FadeInUp>

                  <FadeInUp className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      {t('location.street')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-700/50 rounded-2xl outline-none focus:ring-2 focus:ring-[#0BA5EC] transition-all"
                      placeholder={t('location.streetPlaceholder') || 'Enter street'}
                    />
                  </FadeInUp>

                  <FadeInUp>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t('auth.password')}</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-700/50 rounded-2xl outline-none"
                    />
                  </FadeInUp>

                  <FadeInUp>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t('auth.confirmPassword')}</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-700/50 rounded-2xl outline-none"
                    />
                  </FadeInUp>
                </StaggerContainer>

                {/* Provider extra fields */}
                <AnimatePresence>
                  {formData.role === 'provider' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                          {t('provider.selectCategory')} <span className="text-red-500">*</span>
                        </label>

                        {loadingCategories ? (
                          <div className="py-6 text-center text-gray-500">{t('common.loading')}</div>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {categories.map((cat) => {
                              const id = cat.category_id ?? cat.id;
                              const selected = formData.category_ids.includes(id);
                              return (
                                <button
                                  key={id}
                                  type="button"
                                  onClick={() => toggleCategory(id)}
                                  className={`p-4 rounded-2xl text-xs font-bold border-2 transition-all ${selected ? 'bg-[#0BA5EC] text-white border-[#0BA5EC]' : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-transparent'
                                    }`}
                                >
                                  {selected && <FiCheckCircle className="inline mr-2" />}
                                  {getCategoryName(cat, i18n.language)}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t('provider.specialization')}</label>
                        <input
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleChange}
                          className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-700/50 rounded-2xl outline-none"
                        />
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-6 space-y-4">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                          <FiAward className="inline mr-2" />
                          {t('provider.certificate')}
                        </label>

                        <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-[#0BA5EC] transition-colors cursor-pointer bg-white dark:bg-gray-800/50">
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={handleCertificateChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          {!formData.certificate ? (
                            <>
                              <FiAward className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                {t('provider.uploadCertificate')}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {t('provider.certificateHint')}
                              </p>
                            </>
                          ) : (
                            <div className="flex items-center justify-center gap-3">
                              <FiCheckCircle className="text-green-500 h-6 w-6" />
                              <span className="text-sm font-bold text-gray-700 dark:text-gray-200 truncate max-w-[200px]">
                                {formData.certificate.name}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); removeCertificate(); }}
                                className="p-1.5 bg-red-100 text-red-500 rounded-lg hover:bg-red-200 transition-colors"
                              >
                                <FiX />
                              </button>
                            </div>
                          )}
                        </div>

                        {certificatePreview && (
                          <div className="mt-3 relative group rounded-xl overflow-hidden border">
                            <img src={certificatePreview} alt="preview" className="w-full max-h-48 object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                type="button"
                                onClick={removeCertificate}
                                className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2"
                              >
                                <FiX /> {t('common.delete')}
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="pt-2">
                          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                            {t('common.issueDate')}
                          </label>
                          <input
                            type="date"
                            name="issue_date"
                            value={formData.issue_date}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border shelf-border dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-[#0BA5EC] transition-all"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-[#0BA5EC] to-[#0891D1] text-white rounded-2xl font-black text-lg shadow-xl"
                >
                  {t('common.register')}
                </motion.button>

                <p className="text-sm text-gray-500 text-center font-medium">
                  {t('auth.alreadyHaveAccount')}{' '}
                  <Link to="/login" className="text-[#0BA5EC] font-bold underline underline-offset-4">
                    {t('common.login')}
                  </Link>
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </PageTransition>

      <Footer />
    </div>
  );
};

export default Register;

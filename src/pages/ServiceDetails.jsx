import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { useAuth } from '../context/AuthContext';
import { servicesAPI, requestsAPI } from '../services/apiService';
import { UPLOAD_URL } from '../utils/api';
import { getServiceName, getCategoryName } from '../utils/langHelper';
import { getProblemExamples } from '../utils/problemTypes';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { isCustomer, isAuthenticated } = useAuth();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getImageUrl = (img) => {
    if (!img) return '';
    const path = typeof img === 'string' ? img : (img.image || '');
    if (path.startsWith('http')) return path;
    return `${UPLOAD_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestData, setRequestData] = useState({
    scheduleddate: '',
    details: '',
    problemDescription: '',
  });

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        setLoading(true);
        const res = await servicesAPI.getById(id);
        setService(res.data);
        setError(null);
      } catch (err) {
        console.error('ServiceDetails error:', err);
        setError(t('errors.somethingWentWrong'));
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchServiceDetails();
  }, [id, t]);

  const handleRequestSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated || !isCustomer) {
      alert(t('auth.customerLogin'));
      navigate('/login');
      return;
    }

    if (!requestData.problemDescription.trim()) {
      alert(i18n.language === 'ar' ? 'الرجاء اختيار أو وصف المشكلة' : 'Please select or describe the problem');
      return;
    }

    try {
      await requestsAPI.create({
        service_id: Number(id),
        scheduled_date: requestData.scheduleddate,
        details: requestData.details || '',
        problem_type: requestData.problemDescription,
      });
      alert(t('success.requestSubmitted'));
      navigate('/customer/requests');
    } catch (err) {
      console.error('Create request error:', err);
      alert(t('errors.tryAgain'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar />
        <div className="text-center py-20">{t('common.loading')}</div>
        <Footer />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar />
        <div className="text-center py-20 text-red-600">{error || t('errors.somethingWentWrong')}</div>
        <Footer />
      </div>
    );
  }

  const categoryId = service.categoryId || service.category_id || service.category?.categoryId;
  const problemExamples = getProblemExamples(categoryId, i18n.language);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 border border-gray-100 dark:border-gray-700">
          <h1 className="text-3xl font-bold dark:text-white mb-4">{getServiceName(service, i18n.language)}</h1>

          {service.category && (
            <div className="mb-4">
              <span className="inline-block px-4 py-2 bg-[#0BA5EC]/10 text-[#0BA5EC] rounded-lg font-bold text-sm">
                {getCategoryName(service.category, i18n.language)}
              </span>
            </div>
          )}

          {/* Service Images */}
          {service.images && service.images.length > 0 && (
            <div className="mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {service.images.map((img, idx) => (
                  <div key={idx} className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img
                      src={getImageUrl(img)}
                      alt={img.caption || `Service image ${idx + 1}`}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {i18n.language === 'ar'
              ? (service.descriptionAr || service.descriptionEn || service.description || t('common.noDetails'))
              : (service.descriptionEn || service.descriptionAr || service.description || t('common.noDetails'))
            }
          </p>

          {isCustomer && (
            <>
              <button
                onClick={() => setShowRequestForm((v) => !v)}
                className="w-full bg-[#0BA5EC] text-white py-3 rounded-lg font-bold hover:bg-[#0891D1] transition"
              >
                {t('request.createRequest')}
              </button>

              {showRequestForm && (
                <form onSubmit={handleRequestSubmit} className="mt-6 space-y-4 bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-3">
                      {i18n.language === 'ar' ? 'اختر المشكلة *' : 'Select Problem *'}
                    </label>

                    {problemExamples.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                          {i18n.language === 'ar' ? 'أمثلة شائعة:' : 'Common examples:'}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {problemExamples.map((example, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setRequestData((p) => ({ ...p, problemDescription: example }))}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${requestData.problemDescription === example
                                ? 'bg-[#0BA5EC] text-white'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-[#0BA5EC] hover:text-[#0BA5EC]'
                                }`}
                            >
                              {example}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">
                      {t('request.scheduledDate')}
                    </label>
                    <input
                      type="datetime-local"
                      value={requestData.scheduleddate}
                      onChange={(e) => setRequestData((p) => ({ ...p, scheduleddate: e.target.value }))}
                      required
                      className="w-full px-4 py-3 rounded-lg border dark:bg-gray-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">
                      {t('request.details')} ({i18n.language === 'ar' ? 'اختياري' : 'Optional'})
                    </label>
                    <textarea
                      rows={4}
                      value={requestData.details}
                      onChange={(e) => setRequestData((p) => ({ ...p, details: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg border dark:bg-gray-800 dark:text-white"
                      placeholder={t('request.detailsPlaceholder')}
                    />
                  </div>

                  <button type="submit" className="w-full bg-[#0BA5EC] text-white py-3 rounded-lg font-bold hover:bg-[#0891D1] transition">
                    {t('request.submitRequest')}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ServiceDetails;

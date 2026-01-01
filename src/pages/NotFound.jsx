import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center px-4">
          <h1 className="text-9xl font-bold text-[#0BA5EC] mb-4">404</h1>
          <h2 className="text-3xl font-bold dark:text-white mb-4">{t('errors.pageNotFound')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            {t('errors.pageNotFoundDesc')}
          </p>
          <Link
            to="/"
            className="inline-block px-8 py-4 bg-[#0BA5EC] text-white rounded-2xl hover:bg-[#0BA5EC]/90 transition-all shadow-lg shadow-[#0BA5EC]/20 font-bold"
          >
            {t('common.goHome')}
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;


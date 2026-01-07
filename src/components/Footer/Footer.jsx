import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { KhadamatiLogo } from '../KhadamatiLogo';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = 2025;

  return (
    <footer className="bg-gray-900 dark:bg-black py-12 text-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <KhadamatiLogo className="h-8 w-8 group-hover:scale-110 transition-transform" />
              <span className="text-lg font-bold">Khadamati</span>
            </Link>
            <p className="text-sm text-gray-400 mb-2">khadamati.com</p>
            <p className="text-sm text-gray-400">
              {t('home.heroSubtitle')}
            </p>
          </div>
          <div>
            <h3 className="mb-4 font-bold dark:text-white">{t('footer.aboutUs')}</h3>
            <div className="flex flex-col gap-2 text-sm text-gray-400 dark:text-gray-500">
              <Link to="/about" className="hover:text-white">{t('common.about')}</Link>
              <Link to="/contact" className="hover:text-white">{t('common.contact')}</Link>
              <Link to="/services" className="hover:text-white">{t('common.services')}</Link>
            </div>
          </div>
          <div>
            <h3 className="mb-4 font-bold dark:text-white">{t('footer.quickLinks')}</h3>
            <div className="flex flex-col gap-2 text-sm text-gray-400 dark:text-gray-500">
              <Link to="/services" className="hover:text-white">{t('service.allServices')}</Link>
              <Link to="/register" className="hover:text-white">{t('common.register')}</Link>
              <Link to="/login" className="hover:text-white">{t('common.login')}</Link>
            </div>
          </div>
          <div>
            <h3 className="mb-4 font-bold dark:text-white">{t('footer.support')}</h3>
            <div className="flex flex-col gap-2 text-sm text-gray-400 dark:text-gray-500">
              <Link to="/contact" className="hover:text-white">{t('footer.contactUs')}</Link>
              <Link to="/faq" className="hover:text-white">{t('footer.faq')}</Link>
              <Link to="/terms" className="hover:text-white">{t('footer.termsOfService')}</Link>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 dark:border-gray-700 pt-8 text-center text-sm text-gray-400 dark:text-gray-500">
          © {currentYear} Khadamati. {t('footer.allRightsReserved')}.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

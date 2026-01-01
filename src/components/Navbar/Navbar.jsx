import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { KhadamatiLogo } from '../KhadamatiLogo';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import { FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, logout, isAdmin, isProvider, isCustomer } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isProvider) return '/provider/dashboard';
    if (isCustomer) return '/customer/dashboard';
    return '/login';
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90 shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 lg:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0BA5EC] to-[#0891D1] rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <KhadamatiLogo className="relative h-12 w-12" />
          </div>
          <div className="hidden sm:block">
            <span className="text-2xl font-bold bg-gradient-to-r from-[#0BA5EC] to-[#0891D1] bg-clip-text text-transparent">
              {t('common.home')}
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">khadamati.com</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          <Link
            to="/"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#0BA5EC] dark:hover:text-[#0BA5EC] transition-colors relative group"
          >
            {t('common.home')}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#0BA5EC] to-[#0891D1] group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            to="/services"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#0BA5EC] dark:hover:text-[#0BA5EC] transition-colors relative group"
          >
            {t('common.services')}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#0BA5EC] to-[#0891D1] group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#0BA5EC] dark:hover:text-[#0BA5EC] transition-colors relative group"
          >
            {t('common.about')}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#0BA5EC] to-[#0891D1] group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            to="/contact"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#0BA5EC] dark:hover:text-[#0BA5EC] transition-colors relative group"
          >
            {t('common.contact')}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#0BA5EC] to-[#0891D1] group-hover:w-full transition-all duration-300"></span>
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 shadow-inner">
            <button
              onClick={() => changeLanguage('ar')}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${i18n.language === 'ar'
                ? 'bg-gradient-to-r from-[#0BA5EC] to-[#0891D1] text-white shadow-lg transform scale-105'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            >
              AR
            </button>
            <button
              onClick={() => changeLanguage('en')}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${i18n.language === 'en'
                ? 'bg-gradient-to-r from-[#0BA5EC] to-[#0891D1] text-white shadow-lg transform scale-105'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            >
              EN
            </button>
          </div>

          {/* Animated Theme Toggle */}
          <ThemeToggle />

          {/* User Actions */}
          {user ? (
            <div className="hidden lg:flex items-center gap-3">
              <Link
                to={getDashboardLink()}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#0BA5EC] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#0BA5EC] to-[#0891D1] flex items-center justify-center">
                  <FiUser className="h-4 w-4 text-white" />
                </div>
                <span className="max-w-[100px] truncate">{user.first_name || user.email}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 transition-colors"
              >
                <FiLogOut className="h-5 w-5" />
                <span className="hidden xl:inline">{t('common.logout')}</span>
              </button>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/login"
                className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#0BA5EC] to-[#0891D1] hover:shadow-lg rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                {t('common.login')}
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {mobileMenuOpen ? (
              <FiX className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            ) : (
              <FiMenu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg">
          <nav className="flex flex-col p-4 space-y-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              {t('common.home')}
            </Link>
            <Link
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              {t('common.services')}
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              {t('common.about')}
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              {t('common.contact')}
            </Link>

            {user ? (
              <>
                <Link
                  to={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-[#0BA5EC] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  {t('common.dashboard')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-left"
                >
                  {t('common.logout')}
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-[#0BA5EC] to-[#0891D1] rounded-lg text-center"
              >
                {t('common.login')}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;

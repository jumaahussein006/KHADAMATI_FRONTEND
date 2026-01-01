import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { KhadamatiLogo } from '../components/KhadamatiLogo';
import {
  FiHome,
  FiPackage,
  FiPlus,
  FiFileText,
  FiAward,
  FiMessageSquare,
  FiBell,
  FiAlertCircle,
  FiLogOut,
  FiMenu,
  FiX,
  FiUser
} from 'react-icons/fi';

const ProviderLayout = ({ children }) => {
  const { t, i18n } = useTranslation();
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isRTL = i18n.language === 'ar';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { path: '/provider/dashboard', icon: FiHome, label: t('common.dashboard') },
    { path: '/provider/services', icon: FiPackage, label: t('provider.myServices') },
    { path: '/provider/services/add', icon: FiPlus, label: t('provider.addService') },
    { path: '/provider/requests', icon: FiFileText, label: t('provider.serviceRequests') },
    { path: '/provider/certificates', icon: FiAward, label: t('provider.certificates') },
    { path: '/provider/reviews', icon: FiMessageSquare, label: t('provider.reviews') },
    { path: '/provider/notifications', icon: FiBell, label: t('common.notifications') },
    { path: '/provider/submit-report', icon: FiAlertCircle, label: i18n.language === 'ar' ? 'إرسال تقرير' : 'Submit Report' },
    { path: '/provider/my-reports', icon: FiFileText, label: i18n.language === 'ar' ? 'تقاريري' : 'My Reports' },
    { path: '/provider/profile', icon: FiUser, label: t('common.profile') },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <KhadamatiLogo className="h-8 w-8" />
            <span className="text-lg font-bold dark:text-white">{t('common.dashboard')}</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {sidebarOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} z-40 w-64 bg-white dark:bg-gray-800 
            border-${isRTL ? 'l' : 'r'} border-gray-200 dark:border-gray-700 
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'} 
            lg:translate-x-0 lg:static
          `}
        >
          <div className="h-full flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 hidden lg:block">
              <Link to="/" className="flex items-center gap-2">
                <KhadamatiLogo className="h-8 w-8" />
                <span className="text-lg font-bold dark:text-white">{t('common.dashboard')}</span>
              </Link>
            </div>

            {/* Menu */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {menuItems.map(({ path, icon: Icon, label }) => {
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                      ${isActive
                        ? 'bg-[#0BA5EC] text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Info & Logout */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="mb-4 px-4 py-2">
                <p className="text-sm font-medium dark:text-white">{user?.email}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('dashboard.provider.serviceProvider')}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <FiLogOut className="h-5 w-5" />
                <span className="font-medium">{t('common.logout')}</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0 pt-16 lg:pt-0">
          <div className="p-6">{children}</div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default ProviderLayout;

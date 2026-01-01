import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { KhadamatiLogo } from '../components/KhadamatiLogo';
import { FiMail, FiLock } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { isValidEmailProvider } from '../utils/validators/emailValidator';

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('customer');
  const [error, setError] = useState('');
  const { login, logout } = useAuth();
  const navigate = useNavigate();



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Admin detection
    const isAdminEmail = email.toLowerCase() === 'admin@khadamati.com' || email.toLowerCase().startsWith('admin@');
    let role = selectedRole;
    if (isAdminEmail) {
      role = 'admin';
    }

    // Email provider validation (skip for admin)
    if (!isValidEmailProvider(email, role === 'admin')) {
      setError(t('errors.invalidEmailProvider'));
      return;
    }

    // Pass role to login function (backend requires it)
    const result = await login(email, password, role);

    if (result.success) {
      const userRole = result.user.role;

      // Enforce role selection for non-admin users
      if (userRole !== 'admin' && userRole !== selectedRole) {
        // Just show error, don't navigate. AuthContext might have set the user state, 
        // but we can treat this as "login failed" from the UI perspective.
        // Ideally we should logout to clear the state if it was set.
        // Importing logout from useAuth might be needed if not present, but let's assume login returns user without auto-setting state OR we just ignore it.
        // The previous login implementation DOES set state. So we must logout.
        // We can't access logout here easily without destabilizing the component if not destructured. 
        // Let's modify the destructuring above first.
        logout();
        setError(t('auth.roleMismatch', { role: t(`auth.${userRole}`) }));
        return;
      }

      if (userRole === 'admin') navigate('/admin/dashboard');
      else if (userRole === 'provider') navigate('/provider/dashboard');
      else if (userRole === 'customer') navigate('/customer/dashboard');
      else navigate('/');
    } else {
      setError(t(result.error) || t('auth.loginError'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-500">
      <Navbar />

      <div className="flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-80px)]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Main Card */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-8 md:p-10 border border-white/20 dark:border-gray-700/50 relative overflow-hidden group">

            {/* Animated Glow Effect */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#0BA5EC]/20 rounded-full blur-[80px] group-hover:bg-[#0BA5EC]/30 transition-colors duration-700"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px] group-hover:bg-blue-500/20 transition-colors duration-700"></div>

            {/* Logo Section */}
            <div className="text-center mb-8 relative z-10">
              <Link to="/">
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="inline-block relative cursor-pointer"
                >
                  <div className="absolute inset-0 bg-[#0BA5EC] rounded-full blur-2xl opacity-20 animate-pulse"></div>
                  <div className="relative bg-white dark:bg-gray-700 p-4 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-600">
                    <KhadamatiLogo className="h-14 w-14" />
                  </div>
                </motion.div>
              </Link>
              <h2 className="mt-6 text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                {t('auth.loginTitle')}
              </h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400 font-medium">
                {t('auth.welcomeBack')}
              </p>
            </div>

            {/* Role Selection */}
            <div className="flex bg-gray-100/50 dark:bg-gray-900/50 p-1.5 rounded-2xl mb-8 border border-gray-200/50 dark:border-gray-700/50">
              {['customer', 'provider'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${selectedRole === role
                    ? 'bg-white dark:bg-gray-700 text-[#0BA5EC] shadow-sm transform scale-[1.02]'
                    : 'text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                  {t(`auth.${role}`)}
                </button>
              ))}
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-xl flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <p className="text-sm text-red-700 dark:text-red-400 font-bold">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              <div className="space-y-4">
                <div className="relative group">
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 ml-1 block">
                    {t('auth.email')}
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0BA5EC] transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900/50 border-2 border-transparent rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:border-[#0BA5EC] dark:text-white transition-all outline-none"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div className="relative group">
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 ml-1 block">
                    {t('auth.password')}
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0BA5EC] transition-colors" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900/50 border-2 border-transparent rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:border-[#0BA5EC] dark:text-white transition-all outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-[#0BA5EC] to-[#0891D1] text-white rounded-2xl font-black text-lg shadow-xl shadow-[#0BA5EC]/20 hover:shadow-[#0BA5EC]/40 transition-all"
              >
                {t('common.login')}
              </motion.button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 font-medium">
                {t('auth.noAccount')}{' '}
                <Link to="/register" className="text-[#0BA5EC] font-bold hover:underline underline-offset-4">
                  {t('auth.createAccount')}
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;

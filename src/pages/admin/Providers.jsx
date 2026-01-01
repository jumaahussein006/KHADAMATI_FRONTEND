import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { adminAPI, nameChangeAPI, notificationsAPI } from '../../services/apiService';
// Removed mockData imports
import { FiCheck, FiX, FiInfo, FiSearch, FiUser, FiCheckCircle, FiXCircle, FiUserCheck, FiUserX, FiActivity } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Providers = () => {
  const { t, i18n } = useTranslation();
  const [providers, setProviders] = useState([]);
  const [nameRequests, setNameRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('providers'); // 'providers' or 'nameChanges'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getUsers();
      setProviders((res.data || []).filter(u => u.role === 'provider'));
      // setNameRequests(getNameChangeRequests()); // Name change requests not implemented in backend yet
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveProvider = async (providerId) => {
    const res = await adminAPI.updateUser(providerId, { approved: true });
    if (res.success) {
      setProviders(providers.map(p => p.user_id === providerId ? { ...p, approved: true } : p));
      alert(t('success.statusUpdated'));
    }
  };

  const handleRejectProvider = async (providerId) => {
    if (window.confirm(t('common.confirmDelete'))) {
      const allUsers = JSON.parse(localStorage.getItem('khadamati_users') || '[]');
      const updated = allUsers.filter(u => u.user_id !== providerId);
      localStorage.setItem('khadamati_users', JSON.stringify(updated));
      setProviders(providers.filter(p => p.user_id !== providerId));
      alert(t('common.deleted'));
    }
  };

  const handleApproveNameChange = async (req) => {
    try {
      // req: { request_id, user_id, old_name, new_name }
      const nameParts = req.new_name.split(' ');
      const first = nameParts[0];
      const last = nameParts[nameParts.length - 1];
      const middle = nameParts.slice(1, -1).join(' ');

      await adminAPI.updateUser(req.user_id, {
        first_name: first,
        middle_name: middle,
        last_name: last
      });

      await nameChangeAPI.updateStatus(req.request_id, 'approved');

      await notificationsAPI.create({
        user_id: req.user_id,
        type: 'Admin',
        title: 'Name Change Approved',
        message: `Your request to change name to ${req.new_name} has been approved.`
      });

      alert(t('success.statusUpdated'));
      fetchData();
    } catch (err) {
      console.error('Error approving name change:', err);
      alert(t('errors.tryAgain'));
    }
  };

  const handleRejectNameChange = async (req) => {
    try {
      await nameChangeAPI.updateStatus(req.request_id, 'rejected');

      await notificationsAPI.create({
        user_id: req.user_id,
        type: 'Admin',
        title: 'Name Change Rejected',
        message: `Your request to change name to ${req.new_name} has been rejected.`
      });

      alert(t('success.statusUpdated'));
      fetchData();
    } catch (err) {
      console.error('Error rejecting name change:', err);
      alert(t('errors.tryAgain'));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black dark:text-white">{t('dashboard.admin.providers')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{t('admin.manageProviders')}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b dark:border-gray-700">
        <button
          onClick={() => setActiveTab('providers')}
          className={`pb-4 px-2 font-bold transition-all relative ${activeTab === 'providers' ? 'text-[#0BA5EC]' : 'text-gray-500'}`}
        >
          {t('auth.provider')}
          {activeTab === 'providers' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#0BA5EC] rounded-t-full" />}
        </button>
        <button
          onClick={() => setActiveTab('nameChanges')}
          className={`pb-4 px-2 font-bold transition-all relative ${activeTab === 'nameChanges' ? 'text-[#0BA5EC]' : 'text-gray-500'}`}
        >
          {t('admin.manageRequests')}
          {nameRequests.filter(r => r.status === 'pending').length > 0 && (
            <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
              {nameRequests.filter(r => r.status === 'pending').length}
            </span>
          )}
          {activeTab === 'nameChanges' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#0BA5EC] rounded-t-full" />}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'providers' ? (
          <motion.div
            key="providers"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <table className="w-full text-left rtl:text-right">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">{t('auth.provider')}</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">{t('provider.specialization')}</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">{t('common.status')}</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {providers.map((p) => (
                  <tr key={p.user_id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-[#0BA5EC]/10 text-[#0BA5EC] flex items-center justify-center">
                          <FiUser />
                        </div>
                        <div>
                          <p className="font-bold dark:text-white">{p.first_name} {p.last_name}</p>
                          <p className="text-xs text-gray-500">{p.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium dark:text-gray-300">{p.specialization || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${p.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {p.approved ? t('status.completed') : t('status.pending')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {!p.approved && (
                          <button onClick={() => handleApproveProvider(p.user_id)} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-sm"><FiCheckCircle /></button>
                        )}
                        <button onClick={() => handleRejectProvider(p.user_id)} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-sm"><FiXCircle /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        ) : (
          <motion.div
            key="nameChanges"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            {nameRequests.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 p-12 text-center rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-700">
                <FiActivity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">{t('search.noResults')}</p>
              </div>
            ) : (
              nameRequests.map((req) => (
                <div key={req.request_id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-900/20 text-[#0BA5EC] flex items-center justify-center font-bold">
                      {req.user_id}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-gray-400 line-through text-sm">{req.old_name}</span>
                        <span className="text-[#0BA5EC] font-black">→ {req.new_name}</span>
                      </div>
                      <p className="text-xs text-gray-500">{new Date(req.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {req.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleApproveNameChange(req)}
                          className="px-4 py-2 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition"
                        >
                          {t('common.accept')}
                        </button>
                        <button
                          onClick={() => handleRejectNameChange(req)}
                          className="px-4 py-2 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition"
                        >
                          {t('common.reject')}
                        </button>
                      </>
                    ) : (
                      <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase ${req.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {req.status}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Providers;

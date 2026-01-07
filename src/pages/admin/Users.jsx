import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiSearch, FiEdit, FiTrash2, FiUser, FiUserPlus, FiUsers } from 'react-icons/fi';

import { adminAPI } from '../../services/apiService';
import Table from '../../components/Table/Table';
import Badge from '../../components/Badge/Badge';
import Button from '../../components/Button/Button';
import PageTransition from '../../components/PageTransition/PageTransition';

const Users = () => {
  const { t, i18n } = useTranslation();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await adminAPI.getUsers();
      setUsers(res.data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.first_name && user.first_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.last_name && user.last_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleEdit = (user) => {
    setEditingUser(user.user_id);
    setEditForm({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'customer'
    });
  };

  const handleSave = async (userId) => {
    try {
      await adminAPI.updateUser(userId, editForm);
      fetchUsers();
      setEditingUser(null);
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm(t('common.confirmDelete'))) {
      try {
        // await adminAPI.deleteUser(userId); // Not implemented delete yet
        // fetchUsers();
        alert('Delete not implemented in real API yet');
      } catch (err) {
        console.error('Error deleting user:', err);
      }
    }
  };

  const getRoleBadgeVariant = (role) => {
    const variants = {
      admin: 'error',
      provider: 'info',
      customer: 'success'
    };
    return variants[role] || 'default';
  };

  const getRoleLabel = (role) => {
    const labels = {
      admin: t('auth.admin'),
      provider: t('auth.provider'),
      customer: t('auth.customer')
    };
    return labels[role] || role;
  };

  // Table columns
  const columns = [
    {
      key: 'name',
      label: `${t('auth.firstName')} ${t('auth.lastName')}`,
      align: isRTL ? 'text-right' : 'text-left',
      render: (row) => {
        if (editingUser === row.user_id) {
          return (
            <div className="flex gap-2">
              <input
                type="text"
                value={editForm.first_name}
                onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] dark:bg-gray-700 dark:text-white"
                placeholder={t('auth.firstName')}
              />
              <input
                type="text"
                value={editForm.last_name}
                onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] dark:bg-gray-700 dark:text-white"
                placeholder={t('auth.lastName')}
              />
            </div>
          );
        }
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0BA5EC] to-[#0891D1] flex items-center justify-center text-white font-bold">
              {row.first_name?.charAt(0)}{row.last_name?.charAt(0)}
            </div>
            <span className="font-medium text-gray-900 dark:text-white">
              {row.first_name} {row.last_name}
            </span>
          </div>
        );
      }
    },
    {
      key: 'email',
      label: t('auth.email'),
      align: isRTL ? 'text-right' : 'text-left',
      render: (row) => {
        if (editingUser === row.user_id) {
          return (
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] dark:bg-gray-700 dark:text-white"
            />
          );
        }
        return (
          <span className="text-gray-600 dark:text-gray-400">
            {row.email}
          </span>
        );
      }
    },
    {
      key: 'phone',
      label: t('auth.phone'),
      align: isRTL ? 'text-right' : 'text-left',
      render: (row) => {
        if (editingUser === row.user_id) {
          return (
            <input
              type="tel"
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] dark:bg-gray-700 dark:text-white"
            />
          );
        }
        return (
          <span className="text-gray-600 dark:text-gray-400">
            {row.phone || '-'}
          </span>
        );
      }
    },
    {
      key: 'role',
      label: t('auth.accountType'),
      align: isRTL ? 'text-right' : 'text-left',
      render: (row) => {
        if (editingUser === row.user_id) {
          return (
            <select
              value={editForm.role}
              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] dark:bg-gray-700 dark:text-white"
            >
              <option value="customer">{t('auth.customer')}</option>
              <option value="provider">{t('auth.provider')}</option>
              <option value="admin">{t('auth.admin')}</option>
            </select>
          );
        }
        return (
          <Badge variant={getRoleBadgeVariant(row.role)}>
            {getRoleLabel(row.role)}
          </Badge>
        );
      }
    },
    {
      key: 'actions',
      label: t('common.actions'),
      align: 'text-center',
      render: (row) => {
        if (editingUser === row.user_id) {
          return (
            <div className="flex items-center justify-center gap-2">
              <Button
                size="sm"
                variant="primary"
                onClick={() => handleSave(row.user_id)}
              >
                {t('common.save')}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditingUser(null)}
              >
                {t('common.cancel')}
              </Button>
            </div>
          );
        }
        return (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => handleEdit(row)}
              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              title={t('common.edit')}
            >
              <FiEdit className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleDelete(row.user_id)}
              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title={t('common.delete')}
            >
              <FiTrash2 className="h-5 w-5" />
            </button>
          </div>
        );
      }
    }
  ];

  // Stats
  const stats = [
    {
      label: t('dashboard.admin.totalUsers'),
      value: users.length,
      icon: FiUsers,
      color: 'from-blue-500 to-blue-600'
    },
    {
      label: t('auth.admin'),
      value: users.filter(u => u.role === 'admin').length,
      icon: FiUser,
      color: 'from-red-500 to-red-600'
    },
    {
      label: t('auth.provider'),
      value: users.filter(u => u.role === 'provider').length,
      icon: FiUserPlus,
      color: 'from-[#0BA5EC] to-[#0891D1]'
    },
    {
      label: t('auth.customer'),
      value: users.filter(u => u.role === 'customer').length,
      icon: FiUser,
      color: 'from-green-500 to-green-600'
    }
  ];

  return (
    <PageTransition variant="slideUp">
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              {t('dashboard.admin.users')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {t('common.viewDetails')} {users.length} {t('dashboard.admin.users').toLowerCase()}
            </p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`bg-gradient-to-br ${stat.color} rounded-xl p-4 lg:p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="text-sm opacity-90 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className="h-8 w-8 opacity-80" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4"
        >
          <div className="relative">
            <FiSearch className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5`} />
            <input
              type="text"
              placeholder={t('common.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`
                w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3
                border-2 border-gray-200 dark:border-gray-700
                rounded-xl
                bg-gray-50 dark:bg-gray-900
                text-gray-900 dark:text-white
                focus:ring-2 focus:ring-[#0BA5EC] focus:border-transparent
                transition-all
              `}
            />
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Table
            columns={columns}
            data={filteredUsers}
            emptyMessage={t('common.noData')}
            hoverable
          />
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Users;

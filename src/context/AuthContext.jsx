import React, { createContext, useContext, useMemo, useState } from 'react';
import { authAPI } from '../services/apiService';

const AuthContext = createContext(null);

const TOKEN_KEY = 'khadamati_token';
const USER_KEY = 'khadamati_user';

const normalizeAuthPayload = (apiData) => {
  const roleId = apiData?.provider_id || apiData?.customer_id || apiData?.admin_id || null;

  return {
    user_id: apiData?.user?.user_id,
    email: apiData?.user?.email,
    first_name: apiData?.user?.first_name,
    middle_name: apiData?.user?.middle_name,
    last_name: apiData?.user?.last_name,
    phone: apiData?.user?.phone,
    role: apiData?.user?.role,

    roleId,
    providerid: apiData?.provider_id || null,
    customerid: apiData?.customer_id || null,
    adminid: apiData?.admin_id || null,

    token: apiData?.accessToken || apiData?.token || null,  // Backend returns accessToken
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const [loading] = useState(false);

  const login = async (email, password, role) => {
    const res = await authAPI.login(email, password, role);
    if (!res?.success) return { success: false, error: res?.message || 'Invalid email or password.' };

    const payload = normalizeAuthPayload(res.data);

    console.log('✅ Login successful - Token:', payload?.token ? `${payload.token.substring(0, 20)}...` : 'NULL');
    if (payload?.token) {
      localStorage.setItem(TOKEN_KEY, payload.token);
      console.log('💾 Token saved to localStorage');
    } else {
      console.error('❌ No token in response!');
    }
    localStorage.setItem(USER_KEY, JSON.stringify(payload));
    setUser(payload);

    return { success: true, user: payload };
  };

  const register = async (registrationData) => {
    const res = await authAPI.register(registrationData);
    if (!res?.success) return { success: false, error: res?.message || 'Register failed.' };

    const payload = normalizeAuthPayload(res.data);

    console.log('✅ Registration successful - Token:', payload?.token ? `${payload.token.substring(0, 20)}...` : 'NULL');
    if (payload?.token) {
      localStorage.setItem(TOKEN_KEY, payload.token);
      console.log('💾 Token saved to localStorage');
    } else {
      console.error('❌ No token in response!');
    }
    localStorage.setItem(USER_KEY, JSON.stringify(payload));
    setUser(payload);

    return { success: true, user: payload };
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  const value = useMemo(() => {
    const role = user?.role;
    return {
      user,
      loading,
      isAuthenticated: !!user,
      isCustomer: role === 'customer',
      isProvider: role === 'provider',
      isAdmin: role === 'admin',
      login,
      register,
      logout,
    };
  }, [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

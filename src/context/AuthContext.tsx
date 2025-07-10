import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/api';
import type { AuthContextProps, AuthUser } from '../interfaces/auth';

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const[user, setUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!user;

  const refreshUser = async () => {
    try {
      const response = await api.get('/user/CurrentUser');
      const userData = response.data.data;
      setUser(userData);
      setRole(userData.role.toLowerCase());
    } catch (error) {
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await api.post('/user/logout');
    setUser(null);
    setRole(null);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated, loading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

'use client';

import React, { createContext, useContext, ReactNode } from 'react';

interface AuthContextType {
  user: null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const value = {
    user: null,
    loading: false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

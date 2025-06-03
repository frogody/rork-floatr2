import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ToastType } from '@/types';
import AnimatedToast from '@/components/AnimatedToast';

interface ToastData {
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (data: ToastData) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = (data: ToastData) => {
    setToast(data);
    setTimeout(() => {
      setToast(null);
    }, data.duration || 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <AnimatedToast
          type={toast.type}
          message={toast.message}
          onHide={() => setToast(null)}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
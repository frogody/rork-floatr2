import { useState, useCallback } from 'react';

interface ToastState {
  visible: boolean;
  type: 'success' | 'error' | 'match' | 'boost' | 'info';
  title: string;
  message?: string;
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  const showToast = useCallback((
    type: ToastState['type'],
    title: string,
    message?: string
  ) => {
    setToast({
      visible: true,
      type,
      title,
      message,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, visible: false }));
  }, []);

  const showSuccess = useCallback((title: string, message?: string) => {
    showToast('success', title, message);
  }, [showToast]);

  const showError = useCallback((title: string, message?: string) => {
    showToast('error', title, message);
  }, [showToast]);

  const showMatch = useCallback((title: string, message?: string) => {
    showToast('match', title, message);
  }, [showToast]);

  const showBoost = useCallback((title: string, message?: string) => {
    showToast('boost', title, message);
  }, [showToast]);

  const showInfo = useCallback((title: string, message?: string) => {
    showToast('info', title, message);
  }, [showToast]);

  return {
    toast,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showMatch,
    showBoost,
    showInfo,
  };
};
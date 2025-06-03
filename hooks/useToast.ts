import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'match' | 'boost';

export interface Toast {
  visible: boolean;
  type: ToastType;
  title: string;
  message: string;
}

export const useToast = () => {
  const [toast, setToast] = useState<Toast>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  const showToast = useCallback((type: ToastType, title: string, message: string) => {
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

  const showSuccess = useCallback((title: string, message: string) => {
    showToast('success', title, message);
  }, [showToast]);

  const showError = useCallback((title: string, message: string) => {
    showToast('error', title, message);
  }, [showToast]);

  const showInfo = useCallback((title: string, message: string) => {
    showToast('info', title, message);
  }, [showToast]);

  const showMatch = useCallback((title: string, message: string) => {
    showToast('match', title, message);
  }, [showToast]);

  const showBoost = useCallback((title: string, message: string) => {
    showToast('boost', title, message);
  }, [showToast]);

  return {
    toast,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showInfo,
    showMatch,
    showBoost,
  };
};
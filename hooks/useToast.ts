import { create } from 'zustand';
import { ToastType } from '@/types';

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
  duration: number;
  showToast: (params: { message: string; type: ToastType; duration?: number }) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  visible: false,
  message: '',
  type: 'info',
  duration: 3000,
  showToast: ({ message, type, duration = 3000 }) => {
    set({ visible: true, message, type, duration });
    setTimeout(() => {
      set({ visible: false });
    }, duration);
  },
  hideToast: () => set({ visible: false }),
}));

export const useToast = () => {
  const { showToast, hideToast } = useToastStore();
  return { showToast, hideToast };
};
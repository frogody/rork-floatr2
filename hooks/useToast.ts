import { create } from 'zustand';
import { ToastType } from '@/types';

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
  duration: number;
}

interface ToastStore extends ToastState {
  showToast: (params: { message: string; type: ToastType; duration?: number }) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
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
  return useToastStore();
};

export default useToastStore;
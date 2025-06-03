import { create } from 'zustand';

export type ToastType = 'info' | 'success' | 'error' | 'warning';

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
  duration: number;
  showToast: (messageOrOptions: string | { message: string; type?: ToastType; duration?: number }) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  visible: false,
  message: '',
  type: 'info',
  duration: 3000,
  showToast: (messageOrOptions) => {
    if (typeof messageOrOptions === 'string') {
      set({ visible: true, message: messageOrOptions, type: 'info', duration: 3000 });
    } else {
      const { message, type = 'info', duration = 3000 } = messageOrOptions;
      set({ visible: true, message, type, duration });
    }
    
    setTimeout(() => {
      set({ visible: false });
    }, typeof messageOrOptions === 'string' ? 3000 : messageOrOptions.duration || 3000);
  },
  hideToast: () => set({ visible: false }),
}));

export const useToast = () => {
  const showToast = useToastStore((state) => state.showToast);
  const hideToast = useToastStore((state) => state.hideToast);
  
  return {
    showToast,
    hideToast,
  };
};
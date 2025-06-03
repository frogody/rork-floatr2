import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
}

const useToastStore = create<ToastState>((set) => ({
  visible: false,
  message: '',
  type: 'info',
  showToast: (message: string, type: ToastType = 'info') => {
    set({ visible: true, message, type });
    setTimeout(() => {
      set({ visible: false });
    }, 3000);
  },
  hideToast: () => set({ visible: false }),
}));

export default useToastStore;
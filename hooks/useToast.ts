import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
}

const useToastStore = create<ToastState>((set, get) => ({
  visible: false,
  message: '',
  type: 'info',
  showToast: (message: string, type: ToastType = 'info') => {
    try {
      set({ visible: true, message, type });
      setTimeout(() => {
        const state = get();
        if (state.visible) {
          set({ visible: false });
        }
      }, 3000);
    } catch (error) {
      console.error('Failed to show toast:', error);
    }
  },
  hideToast: () => {
    try {
      set({ visible: false });
    } catch (error) {
      console.error('Failed to hide toast:', error);
    }
  },
}));

export default useToastStore;
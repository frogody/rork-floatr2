import { create } from 'zustand';

export type ToastType = 'info' | 'success' | 'error' | 'warning';

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
  duration: number;
  timeoutId: NodeJS.Timeout | null;
  
  showToast: (messageOrOptions: string | { 
    message: string; 
    type?: ToastType; 
    duration?: number;
  }) => void;
  hideToast: () => void;
  clearTimeout: () => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  visible: false,
  message: '',
  type: 'info',
  duration: 3000,
  timeoutId: null,
  
  showToast: (messageOrOptions) => {
    const { clearTimeout: clearExistingTimeout } = get();
    clearExistingTimeout();
    
    let message: string;
    let type: ToastType = 'info';
    let duration: number = 3000;
    
    if (typeof messageOrOptions === 'string') {
      message = messageOrOptions;
    } else {
      message = messageOrOptions.message;
      type = messageOrOptions.type || 'info';
      duration = messageOrOptions.duration || 3000;
    }
    
    set({ visible: true, message, type, duration });
    
    const timeoutId = setTimeout(() => {
      set({ visible: false, timeoutId: null });
    }, duration);
    
    set({ timeoutId });
  },
  
  hideToast: () => {
    const { clearTimeout: clearExistingTimeout } = get();
    clearExistingTimeout();
    set({ visible: false });
  },
  
  clearTimeout: () => {
    const { timeoutId } = get();
    if (timeoutId) {
      clearTimeout(timeoutId);
      set({ timeoutId: null });
    }
  },
}));

export const useToast = () => {
  const showToast = useToastStore((state) => state.showToast);
  const hideToast = useToastStore((state) => state.hideToast);
  
  return {
    showToast,
    hideToast,
    success: (message: string, duration?: number) => 
      showToast({ message, type: 'success', duration }),
    error: (message: string, duration?: number) => 
      showToast({ message, type: 'error', duration }),
    info: (message: string, duration?: number) => 
      showToast({ message, type: 'info', duration }),
    warning: (message: string, duration?: number) => 
      showToast({ message, type: 'warning', duration }),
  };
};
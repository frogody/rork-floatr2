import { useToast as useToastImplementation } from './useToast.tsx';

// Re-export the hook from the implementation file
export const useToast = useToastImplementation;

// Export the ToastProvider component
export { ToastProvider } from './useToast.tsx';
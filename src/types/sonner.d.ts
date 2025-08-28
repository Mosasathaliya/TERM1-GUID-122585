declare module 'sonner' {
  import { ToastT } from 'sonner/dist/types';
  
  interface ToastOptions {
    duration?: number;
    position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    style?: React.CSSProperties;
    className?: string;
    icon?: React.ReactNode;
    description?: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  }

  export const toast: {
    (message: string, options?: ToastOptions): string | number;
    success(message: string, options?: ToastOptions): string | number;
    error(message: string, options?: ToastOptions): string | number;
    info(message: string, options?: ToastOptions): string | number;
    warning(message: string, options?: ToastOptions): string | number;
    loading(message: string, options?: ToastOptions): string | number;
    dismiss(toastId?: string | number): void;
    promise<T>(promise: Promise<T>, msgs: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }, opts?: ToastOptions): Promise<T>;
  };

  export type { ToastT };
  export { Toaster } from 'sonner/dist/components/toaster';
}

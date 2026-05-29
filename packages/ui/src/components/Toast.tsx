import { toast as sonnerToast, Toaster as SonnerToaster } from 'sonner';

export const toast = {
  success: (message: string, description?: string) => sonnerToast.success(message, { description }),
  error: (message: string, description?: string) => sonnerToast.error(message, { description }),
  info: (message: string, description?: string) => sonnerToast.info(message, { description }),
  warning: (message: string, description?: string) => sonnerToast.warning(message, { description }),
  loading: (message: string, description?: string) => sonnerToast.loading(message, { description }),
  dismiss: (id?: string | number) => sonnerToast.dismiss(id),
};

export const Toaster = SonnerToaster;
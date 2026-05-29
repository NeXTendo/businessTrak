import { QueryClient } from '@tanstack/react-query';
import { toast } from '@chatowa/ui';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
    mutations: {
      retry: 0,
      onError: (error: any) => {
        const message = error.response?.data?.message || error.message || 'An error occurred';
        toast.error('Error', message);
      },
    },
  },
});
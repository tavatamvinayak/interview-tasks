import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { isAuthenticated } from '@/lib/utils';

export const useAuth = (redirectTo: string = '/login') => {
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push(redirectTo);
    }
  }, [router]);
};
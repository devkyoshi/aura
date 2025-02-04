'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const {currentUser} = useAuth();
  const router = useRouter();

  useEffect(() => {

    if(currentUser?.role === 'admin' || currentUser?.role === 'instructor'){
      router.push('dashboard/instructor');
      return;
    }

    if(currentUser?.role === 'student'){
      router.push('dashboard/student');
      return;
    }
    router.push('/home');
    return;
  }, [currentUser]);

}

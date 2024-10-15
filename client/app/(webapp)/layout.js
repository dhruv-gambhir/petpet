'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import useStore from '../store';
import NavBar from '../Components/NavBar';

export default function WebappLayout({ children }) {
  const router = useRouter();
  const { zIsLoggedIn, hasHydrated } = useStore();

  useEffect(() => {
    if (hasHydrated && !zIsLoggedIn) {
      router.push('/login');
    }
  }, [zIsLoggedIn, hasHydrated, router]);

  if (!hasHydrated) {
    return null;
  }

  return (
    <>
      <NavBar/>
      {children}
    </>
  );
}


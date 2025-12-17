'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function GoogleCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      // Handle OAuth error
      router.push(`/auth?error=${encodeURIComponent(error)}`);
      return;
    }

    if (code) {
      // Redirect to /auth with provider and code
      const params = new URLSearchParams({
        provider: 'GOOGLE',
        code: code,
      });
      if (state) {
        params.set('state', state);
      }
      router.push(`/auth?${params.toString()}`);
    } else {
      // No code, redirect to auth page
      router.push('/auth');
    }
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        <p className="mt-4 text-textColor">Completing Google sign-in...</p>
      </div>
    </div>
  );
}


'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
  fallback?: ReactNode;
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    const userRole = (session.user as any)?.role || 'user';
    
    if (!allowedRoles.includes(userRole)) {
      router.push('/dashboard'); // Redirect to dashboard if no access
      return;
    }
  }, [session, status, router, allowedRoles]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return fallback || <div>Redirecting to login...</div>;
  }

  const userRole = (session.user as any)?.role || 'user';
  
  if (!allowedRoles.includes(userRole)) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Hook untuk cek role di komponen
export function useUserRole() {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role || 'user';
  
  return {
    role: userRole,
    isUser: userRole === 'user',
    isAdmin: userRole === 'admin',
    isSuperAdmin: userRole === 'super_admin',
    hasAccess: (requiredRoles: string[]) => requiredRoles.includes(userRole)
  };
}

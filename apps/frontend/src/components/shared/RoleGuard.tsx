'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole, UserStatus } from '@edubranch/shared';
import { useMockStore } from '@/mocks/mock-store';
import { ShieldAlert } from 'lucide-react';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const router = useRouter();
  const { currentUser } = useMockStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!currentUser) {
      if (allowedRoles.includes(UserRole.ADMIN)) {
        router.push('/admin/login');
      } else {
        router.push('/login');
      }
      return;
    }

    if (!allowedRoles.includes(currentUser.role)) {
      if (currentUser.role === UserRole.ADMIN) {
        router.push('/admin');
      } else if (currentUser.role === UserRole.LECTURER) {
        router.push('/lecturer');
      } else {
        router.push('/student');
      }
      return;
    }

    if (currentUser.role === UserRole.LECTURER && currentUser.status === UserStatus.PENDING) {
      router.push('/login?pending=true');
    }
  }, [currentUser, allowedRoles, mounted, router]);

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-8 h-8 border-4 border-brand-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <ShieldAlert className="w-12 h-12 text-rose-500 mb-3" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Không có quyền truy cập</h2>
        <p className="text-sm text-slate-500 mt-1">Đang điều hướng về trang phù hợp...</p>
      </div>
    );
  }

  return <>{children}</>;
}

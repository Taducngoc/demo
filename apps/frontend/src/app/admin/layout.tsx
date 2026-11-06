'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { RoleGuard } from '@/components/shared/RoleGuard';
import { AppShell } from '@/components/shared/AppShell';
import { UserRole } from '@edubranch/shared';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // The login page must remain reachable before an admin session exists.
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <RoleGuard allowedRoles={[UserRole.ADMIN]}>
      <AppShell>{children}</AppShell>
    </RoleGuard>
  );
}

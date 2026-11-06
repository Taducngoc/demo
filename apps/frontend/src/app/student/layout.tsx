'use client';

import React from 'react';
import { RoleGuard } from '@/components/shared/RoleGuard';
import { AppShell } from '@/components/shared/AppShell';
import { UserRole } from '@edubranch/shared';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={[UserRole.STUDENT]}>
      <AppShell>{children}</AppShell>
    </RoleGuard>
  );
}

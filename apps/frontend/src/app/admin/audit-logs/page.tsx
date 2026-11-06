'use client';

import React, { useState } from 'react';
import { History, Shield, Filter, Search, Terminal } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { useMockStore } from '@/mocks/mock-store';
import { AuditLog } from '@edubranch/shared';
import { formatDate } from '@/lib/utils';

export default function AdminAuditLogsPage() {
  const { auditLogs } = useMockStore();

  const columns = [
    {
      key: 'createdAt',
      header: 'Thời gian',
      render: (log: AuditLog) => (
        <span className="text-xs text-slate-400 font-mono">{formatDate(log.createdAt)}</span>
      ),
    },
    {
      key: 'actorName',
      header: 'Người thực hiện',
      render: (log: AuditLog) => (
        <div>
          <span className="text-xs font-bold text-white block">{log.actorName}</span>
          <span className="text-[10px] text-slate-500 font-mono">ID: {log.actorId}</span>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Hành động',
      render: (log: AuditLog) => (
        <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800">
          {log.action}
        </span>
      ),
    },
    {
      key: 'target',
      header: 'Đối tượng tác động',
      render: (log: AuditLog) => (
        <span className="text-xs text-slate-300 font-mono">
          {log.targetType} ({log.targetId})
        </span>
      ),
    },
    {
      key: 'meta',
      header: 'Chi tiết (Metadata)',
      render: (log: AuditLog) => (
        <pre className="text-[10px] font-mono text-slate-400 bg-slate-950 p-1.5 rounded max-w-xs truncate">
          {log.metaJson ? JSON.stringify(log.metaJson) : '—'}
        </pre>
      ),
    },
    {
      key: 'ipAddress',
      header: 'Địa chỉ IP',
      render: (log: AuditLog) => (
        <span className="text-xs font-mono text-slate-400">{log.ipAddress || '127.0.0.1'}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nhật ký Hoạt động Hệ thống (Audit Logs)"
        description="Ghi nhận bất biến các thao tác quản trị, kiểm soát bảo mật và tuân thủ dữ liệu"
      />

      <DataTable
        data={auditLogs}
        columns={columns}
        searchPlaceholder="Tìm kiếm nhật ký theo người dùng, hành động hoặc đối tượng..."
        searchKey={(log) => `${log.actorName || ''} ${log.action} ${log.targetType} ${log.targetId}`}
      />
    </div>
  );
}

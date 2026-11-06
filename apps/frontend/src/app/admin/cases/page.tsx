'use client';

import React, { useState } from 'react';
import {
  GitBranch,
  Archive,
  BookOpen,
  User,
  Clock,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useMockStore } from '@/mocks/mock-store';
import { Case, CaseStatus, CaseMode } from '@edubranch/shared';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdminCasesPage() {
  const { cases, archiveCase } = useMockStore();
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);

  const handleArchive = () => {
    if (!selectedCase) return;
    archiveCase(selectedCase.id);
    toast.success(`Đã lưu trữ (Archive) case: ${selectedCase.title}`);
    setShowArchiveDialog(false);
    setSelectedCase(null);
  };

  const columns = [
    {
      key: 'title',
      header: 'Tiêu đề Case Study',
      render: (c: Case) => (
        <div>
          <span className="font-bold text-white block text-sm">{c.title}</span>
          <span className="text-xs text-slate-400">
            Khóa: {c.courseName} • GV: {c.authorName}
          </span>
        </div>
      ),
    },
    {
      key: 'mode',
      header: 'Chế độ',
      render: (c: Case) => <StatusBadge status={c.mode} type="mode" />,
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (c: Case) => <StatusBadge status={c.status} type="caseStatus" />,
    },
    {
      key: 'nodes',
      header: 'Cấu trúc cây',
      render: (c: Case) => (
        <span className="text-xs text-slate-300">
          {c.mode === CaseMode.BRANCHING ? `${c.nodes.length} nodes` : 'Review Study'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Ngày tạo',
      render: (c: Case) => (
        <span className="text-xs text-slate-400">{formatDate(c.createdAt)}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      className: 'text-right',
      render: (c: Case) => {
        if (c.status === CaseStatus.ARCHIVED) {
          return <span className="text-xs text-slate-500 italic">Đã lưu trữ</span>;
        }

        return (
          <button
            onClick={() => {
              setSelectedCase(c);
              setShowArchiveDialog(true);
            }}
            className="px-2.5 py-1 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-semibold flex items-center gap-1.5 ml-auto transition-colors"
          >
            <Archive className="w-3.5 h-3.5" /> Lưu trữ
          </button>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý Toàn bộ Case Study"
        description="Giám sát nội dung tình huống học tập, kiểm duyệt và lưu trữ các case vi phạm quy chuẩn học thuật"
      />

      <DataTable
        data={cases}
        columns={columns}
        searchPlaceholder="Tìm kiếm case theo tiêu đề, khóa học, tác giả..."
        searchKey={(c) => `${c.title} ${c.courseName || ''} ${c.authorName || ''}`}
      />

      <ConfirmDialog
        isOpen={showArchiveDialog}
        onClose={() => setShowArchiveDialog(false)}
        onConfirm={handleArchive}
        title="Lưu trữ (Archive) Case Study"
        description={`Bạn có chắc chắn muốn lưu trữ case "${selectedCase?.title}"? Khi lưu trữ, sinh viên sẽ không thể tiếp tục truy cập học phần này.`}
        isDanger={true}
        confirmText="Xác nhận lưu trữ"
      />
    </div>
  );
}

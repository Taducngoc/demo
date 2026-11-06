'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GitBranch,
  Plus,
  Sparkles,
  Copy,
  Archive,
  Eye,
  Edit3,
  Calendar,
  Layers,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useMockStore } from '@/mocks/mock-store';
import { Case, CaseStatus, CaseMode } from '@edubranch/shared';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function LecturerCasesPage() {
  const { cases, courses, createCase, archiveCase } = useMockStore();

  const handleClone = (c: Case) => {
    const cloned = createCase({
      ...c,
      title: `${c.title} (Bản sao)`,
      status: CaseStatus.DRAFT,
      version: 1,
    });
    toast.success(`Đã nhân bản case thành công: "${cloned.title}"`);
  };

  const columns = [
    {
      key: 'title',
      header: 'Tiêu đề Tình huống',
      render: (c: Case) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block text-sm">
            {c.title}
          </span>
          <span className="text-xs text-slate-400">
            Khóa: <span className="font-semibold text-slate-600 dark:text-slate-300">{c.courseName}</span>
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
      header: 'Cấu trúc',
      render: (c: Case) => (
        <span className="text-xs text-slate-600 dark:text-slate-300">
          {c.mode === CaseMode.BRANCHING ? `${c.nodes.length} Nodes` : 'Review Study'}
        </span>
      ),
    },
    {
      key: 'dueDate',
      header: 'Hạn nộp',
      render: (c: Case) => (
        <span className="text-xs text-slate-500 font-mono">
          {c.dueDate ? formatDate(c.dueDate) : 'Chưa đặt'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      className: 'text-right',
      render: (c: Case) => (
        <div className="flex items-center justify-end gap-1.5">
          <Link
            href={`/lecturer/cases/${c.id}/edit`}
            className="p-1.5 rounded-lg text-slate-500 hover:text-brand-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Chỉnh sửa kịch bản"
          >
            <Edit3 className="w-4 h-4" />
          </Link>
          <button
            onClick={() => handleClone(c)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Nhân bản (Clone)"
          >
            <Copy className="w-4 h-4" />
          </button>
          {c.status !== CaseStatus.ARCHIVED && (
            <button
              onClick={() => {
                archiveCase(c.id);
                toast.success(`Đã lưu trữ case: ${c.title}`);
              }}
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Lưu trữ (Archive)"
            >
              <Archive className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý Case Study"
        description="Kho tình huống học tập phân nhánh và các bài tập giải quyết vấn đề"
        actions={
          <Link
            href="/lecturer/cases/new"
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-blue-600 to-brand-teal-600 hover:opacity-95 shadow-sm flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4" /> Tạo Case mới bằng AI
          </Link>
        }
      />

      <DataTable
        data={cases}
        columns={columns}
        searchPlaceholder="Tìm kiếm case theo tiêu đề hoặc môn học..."
        searchKey={(c) => `${c.title} ${c.courseName || ''}`}
      />
    </div>
  );
}

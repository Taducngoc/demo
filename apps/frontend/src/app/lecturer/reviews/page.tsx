'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  ArrowRight,
  User,
  GraduationCap,
  MessageSquare,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useMockStore } from '@/mocks/mock-store';
import { Attempt, AttemptStatus } from '@edubranch/shared';
import { formatDate } from '@/lib/utils';

export default function LecturerReviewQueuePage() {
  const { attempts, cases } = useMockStore();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredAttempts = attempts.filter((a) => {
    if (filterStatus === 'pending') return a.status === AttemptStatus.SUBMITTED;
    if (filterStatus === 'reviewed') return a.status === AttemptStatus.REVIEWED;
    return true;
  });

  const columns = [
    {
      key: 'studentName',
      header: 'Sinh viên',
      render: (a: Attempt) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-brand-blue-50 text-brand-blue-600 font-bold text-xs flex items-center justify-center">
            {a.studentName?.charAt(0) || 'S'}
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-white block text-xs">
              {a.studentName}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">MSSV: {a.studentCode}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'caseTitle',
      header: 'Case Study & Khóa học',
      render: (a: Attempt) => (
        <div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
            {a.caseTitle}
          </span>
          <span className="text-[11px] text-slate-400">
            {a.courseName} • Lần làm #{a.attemptNo}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (a: Attempt) => <StatusBadge status={a.status} type="attempt" />,
    },
    {
      key: 'finishedAt',
      header: 'Thời gian nộp bài',
      render: (a: Attempt) => (
        <span className="text-xs text-slate-400 font-mono">{formatDate(a.finishedAt || a.startedAt)}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Hành động',
      className: 'text-right',
      render: (a: Attempt) => (
        <Link
          href={`/lecturer/reviews/${a.id}`}
          className="px-3 py-1.5 rounded-lg text-xs font-bold text-brand-blue-600 bg-brand-blue-50 hover:bg-brand-blue-100 flex items-center gap-1 ml-auto w-fit transition-colors"
        >
          {a.status === AttemptStatus.REVIEWED ? 'Xem phản hồi' : 'Đánh giá & Nhận xét'}
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hàng đợi Review & Phản hồi Lập luận"
        description="Xem xét đường đi, bản lập luận và đưa ra nhận xét chuyên môn cho sinh viên (Không có điểm số học thuật)"
      />

      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            filterStatus === 'all'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Tất cả ({attempts.length})
        </button>
        <button
          onClick={() => setFilterStatus('pending')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            filterStatus === 'pending'
              ? 'bg-brand-blue-600 text-white'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Chờ Review ({attempts.filter((a) => a.status === AttemptStatus.SUBMITTED).length})
        </button>
        <button
          onClick={() => setFilterStatus('reviewed')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            filterStatus === 'reviewed'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Đã phản hồi ({attempts.filter((a) => a.status === AttemptStatus.REVIEWED).length})
        </button>
      </div>

      <DataTable
        data={filteredAttempts}
        columns={columns}
        searchPlaceholder="Tìm kiếm theo tên sinh viên, MSSV hoặc tên case..."
        searchKey={(a) => `${a.studentName || ''} ${a.studentCode || ''} ${a.caseTitle || ''}`}
      />
    </div>
  );
}

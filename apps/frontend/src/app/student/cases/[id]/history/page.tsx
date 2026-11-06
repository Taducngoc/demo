'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  History,
  ArrowRight,
  Compass,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useMockStore } from '@/mocks/mock-store';
import { formatDate } from '@/lib/utils';

export default function StudentCaseHistoryPage() {
  const params = useParams();
  const caseId = params.id as string;
  const { cases, attempts, currentUser } = useMockStore();

  const currentCase = cases.find((c) => c.id === caseId) || cases[0];
  const myAttempts = attempts.filter(
    (a) => a.caseId === currentCase.id && a.studentId === currentUser?.id
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Lịch sử các Lần làm bài"
        description={`Tình huống: ${currentCase.title} • Mỗi lần thử nghiệm là một cơ hội khám phá`}
        breadcrumbs={[
          { label: 'Bàn học', href: '/student' },
          { label: 'Tình huống', href: `/student/cases/${currentCase.id}` },
          { label: 'Lịch sử Attempt' },
        ]}
      />

      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
        📌 <strong>Quy tắc học tập:</strong> EduBranch AI lưu trữ toàn bộ các lần làm bài của bạn một cách độc lập để bạn có thể xem lại từng hướng đi. Hệ thống <strong>tuyệt đối không so sánh tự động hay tính điểm trung bình</strong> giữa các lần làm bài.
      </div>

      <div className="space-y-4">
        {myAttempts.map((att) => (
          <div
            key={att.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:border-brand-blue-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Lần làm #{att.attemptNo}
                </span>
                <StatusBadge status={att.status} type="attempt" />
              </div>
              <p className="text-xs text-slate-500">
                Đã trải qua <strong>{att.steps.length} bước</strong> quyết định
                {att.finishedAt ? ` • Hoàn thành: ${formatDate(att.finishedAt)}` : ''}
              </p>
            </div>

            <Link
              href={`/student/attempts/${att.id}/review`}
              className="px-4 py-2 rounded-xl text-xs font-bold text-brand-blue-600 bg-brand-blue-50 dark:bg-brand-blue-950 hover:bg-brand-blue-100 transition-colors flex items-center gap-1.5 w-fit"
            >
              Xem lại hành trình <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

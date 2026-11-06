'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  GitBranch,
  Calendar,
  Clock,
  Play,
  RotateCcw,
  CheckCircle2,
  FileCheck2,
  ArrowRight,
  ShieldCheck,
  History,
  BookOpen,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useMockStore } from '@/mocks/mock-store';
import { CaseMode, AttemptStatus } from '@edubranch/shared';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function StudentCaseIntroPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params.id as string;
  const { cases, attempts, startAttempt, currentUser } = useMockStore();

  const currentCase = cases.find((c) => c.id === caseId) || cases[0];
  const myAttempts = attempts.filter(
    (a) => a.caseId === currentCase.id && a.studentId === currentUser?.id
  );

  const handleStartOrRetry = () => {
    const newAttempt = startAttempt(currentCase.id, currentUser?.id || 'student-1');
    toast.success(`Bắt đầu lượt làm bài mới: Attempt #${newAttempt.attemptNo}`);
    router.push(`/student/cases/${currentCase.id}/play?attemptId=${newAttempt.id}`);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader
        title={currentCase.title}
        description={`Học phần: ${currentCase.courseName} • Giảng viên: ${currentCase.authorName}`}
        breadcrumbs={[
          { label: 'Bàn học', href: '/student' },
          { label: 'Tình huống học tập' },
        ]}
      />

      {/* Case Overview Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={currentCase.mode} type="mode" />
          <StatusBadge status={currentCase.status} type="caseStatus" />
          <span className="text-xs text-rose-500 font-semibold flex items-center gap-1 font-mono">
            <Calendar className="w-3.5 h-3.5" /> Hạn nộp: {formatDate(currentCase.dueDate)}
          </span>
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            Mô tả bối cảnh tình huống
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {currentCase.description}
          </p>
        </div>

        {/* Pedagogical Guidelines */}
        <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 space-y-2 text-xs text-blue-950 dark:text-blue-200">
          <span className="font-bold flex items-center gap-1.5 text-blue-900 dark:text-blue-300">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            Quy tắc tham gia bài học phân nhánh (Branching Case Rules):
          </span>
          <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 pl-1">
            <li>Bạn sẽ lần lượt đối mặt với các tình huống và đưa ra lựa chọn hành động.</li>
            <li><strong>Không hiển thị đúng/sai</strong> và <strong>không tiết lộ hậu quả</strong> giữa các bước để đảm bảo tính thực tế của việc ra quyết định dưới áp lực.</li>
            <li>Sau khi chạm đến kết quả cuối cùng (Terminal), bạn sẽ bước vào <strong>Journey Review</strong> để xem lại toàn bộ đường đi, khám phá hậu quả và giải thích lập luận cho các quyết định then chốt.</li>
            <li>Hệ thống <strong>không chấm điểm số học thuật</strong> giữa các lần làm bài. Bạn có thể làm lại nhiều lần (Retry) để khám phá các nhánh rẽ khác.</li>
          </ul>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Đã thực hiện: <strong className="text-slate-800 dark:text-slate-200">{myAttempts.length} lần</strong>
          </span>

          <button
            onClick={handleStartOrRetry}
            className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-blue-600 to-brand-teal-600 hover:opacity-95 shadow-md flex items-center gap-2 transition-all"
          >
            {myAttempts.length === 0 ? (
              <>
                <Play className="w-4 h-4 fill-white" /> Bắt đầu hành trình
              </>
            ) : (
              <>
                <RotateCcw className="w-4 h-4" /> Làm lại (New Attempt #{myAttempts.length + 1})
              </>
            )}
          </button>
        </div>
      </div>

      {/* Previous Attempts History */}
      {myAttempts.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-4 h-4 text-brand-blue-600" />
              Lịch sử các lần làm bài của bạn ({myAttempts.length})
            </h4>
            <span className="text-[11px] text-slate-400">Không xếp hạng điểm số</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {myAttempts.map((att) => (
              <div
                key={att.id}
                className="p-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Attempt #{att.attemptNo}
                    </span>
                    <StatusBadge status={att.status} type="attempt" />
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Bắt đầu: {formatDate(att.startedAt)}
                    {att.finishedAt ? ` • Hoàn thành: ${formatDate(att.finishedAt)}` : ''}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {att.status === AttemptStatus.IN_PROGRESS ? (
                    <Link
                      href={`/student/cases/${currentCase.id}/play?attemptId=${att.id}`}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-blue-600 bg-brand-blue-50 hover:bg-brand-blue-100"
                    >
                      Tiếp tục làm dở
                    </Link>
                  ) : (
                    <Link
                      href={`/student/attempts/${att.id}/review`}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 flex items-center gap-1"
                    >
                      Xem Journey Review <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  GitBranch,
  FileCheck2,
  Clock,
  ArrowRight,
  BookOpen,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useMockStore } from '@/mocks/mock-store';
import { CaseStatus, CaseMode, AttemptStatus } from '@edubranch/shared';
import { formatDate } from '@/lib/utils';

export default function StudentDashboardPage() {
  const { cases, attempts, courses, currentUser } = useMockStore();

  // Published cases only (Business Rule: Student only sees PUBLISHED cases)
  const publishedCases = cases.filter((c) => c.status === CaseStatus.PUBLISHED);

  const myAttempts = attempts.filter((a) => a.studentId === currentUser?.id);
  const inProgressAttempts = myAttempts.filter((a) => a.status === AttemptStatus.IN_PROGRESS);
  const reviewedAttempts = myAttempts.filter((a) => a.status === AttemptStatus.REVIEWED);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Chào mừng, ${currentUser?.fullName || 'Sinh viên'}`}
        description="Không gian học tập tình huống – Rèn luyện tư duy phản biện và khả năng ra quyết định"
        actions={
          <Link
            href="/student/courses"
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 flex items-center gap-2 shadow-sm transition-all"
          >
            <BookOpen className="w-4 h-4 text-brand-teal-600" /> Tham gia lớp học mới
          </Link>
        }
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Case Study được giao"
          value={publishedCases.length}
          subtitle="Các bài tập tình huống mở"
          icon={GitBranch}
        />
        <StatCard
          title="Đang thực hiện dở"
          value={inProgressAttempts.length}
          subtitle="Chưa tới Terminal"
          icon={Clock}
        />
        <StatCard
          title="Đã nộp bài"
          value={myAttempts.length}
          subtitle="Tổng các lượt thực hiện"
          icon={FileCheck2}
        />
        <StatCard
          title="Đã có Giảng viên phản hồi"
          value={reviewedAttempts.length}
          subtitle="Feedback chi tiết"
          icon={CheckCircle2}
        />
      </div>

      {/* Reminder Banner for Upcoming Deadline */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-800 dark:text-amber-200">
          <strong className="block font-bold mb-0.5">Nhắc nhở hạn nộp tình huống:</strong>
          <span>
            Case <strong>"Khủng hoảng sập hệ thống thanh toán Black Friday"</strong> có hạn nộp vào ngày 20/11/2026. Sau khi đi đến Terminal, hãy nhớ hoàn thành phần <strong>Journey Review</strong> và trả lời các câu hỏi phản biện của AI!
          </span>
        </div>
      </div>

      {/* Assigned Cases List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Tình huống học tập được giao ({publishedCases.length})
            </h3>
            <p className="text-xs text-slate-500">
              Chỉ các case đã được Giảng viên kiểm duyệt và Phê duyệt xuất bản
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {publishedCases.map((c) => {
            const userAttempt = myAttempts.find((a) => a.caseId === c.id);
            const isCompleted = userAttempt?.status === AttemptStatus.SUBMITTED || userAttempt?.status === AttemptStatus.REVIEWED;
            const isReviewing = userAttempt?.status === AttemptStatus.REVIEWING;

            return (
              <div
                key={c.id}
                className="p-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2 mb-1.5">
                    <StatusBadge status={c.mode} type="mode" />
                    {userAttempt ? (
                      <StatusBadge status={userAttempt.status} type="attempt" />
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                        Chưa bắt đầu
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    {c.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-2">
                    {c.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span>Môn: {c.courseName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-rose-500 font-semibold">
                      <Calendar className="w-3.5 h-3.5" /> Hạn chót: {formatDate(c.dueDate)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {c.mode === CaseMode.REVIEW ? (
                    <Link
                      href={`/student/review-cases/${c.id}`}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-teal-600 hover:bg-brand-teal-700 flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      Vào làm Review Study <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <Link
                      href={`/student/cases/${c.id}`}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-blue-600 hover:bg-brand-blue-700 flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      {userAttempt ? 'Xem lại / Làm lại' : 'Bắt đầu làm bài'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

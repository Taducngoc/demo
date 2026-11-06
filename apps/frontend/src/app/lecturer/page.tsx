'use client';

import React from 'react';
import Link from 'next/link';
import {
  GitBranch,
  BookOpen,
  FileCheck2,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { StatCard } from '@/components/shared/StatCard';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useMockStore } from '@/mocks/mock-store';
import { CaseStatus, AttemptStatus } from '@edubranch/shared';
import { formatDate, formatTimeAgo } from '@/lib/utils';

export default function LecturerDashboardPage() {
  const { cases, attempts, courses, currentUser } = useMockStore();

  const myCourses = courses.filter((c) => c.lecturerId === currentUser?.id || true);
  const myCases = cases.filter((c) => c.authorId === currentUser?.id || true);

  const draftCases = myCases.filter((c) => c.status === CaseStatus.DRAFT);
  const publishedCases = myCases.filter((c) => c.status === CaseStatus.PUBLISHED);
  const pendingReviews = attempts.filter((a) => a.status === AttemptStatus.SUBMITTED);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Xin chào, ${currentUser?.fullName || 'Thầy/Cô'}`}
        description="Chào mừng đến với không gian quản trị học phần và thiết kế tình huống học tập phân nhánh"
        actions={
          <Link
            href="/lecturer/cases/new"
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-blue-600 to-brand-teal-600 hover:opacity-95 shadow-md flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4" /> Tạo Case mới bằng AI
          </Link>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Khóa học phụ trách"
          value={myCourses.length}
          subtitle="Học kỳ hiện tại"
          icon={BookOpen}
        />
        <StatCard
          title="Case đã Xuất bản"
          value={publishedCases.length}
          subtitle="Sinh viên đang học"
          icon={GitBranch}
        />
        <StatCard
          title="Bản nháp đang soạn (Draft)"
          value={draftCases.length}
          subtitle="Chờ kiểm tra & duyệt"
          icon={Clock}
        />
        <StatCard
          title="Bài sinh viên chờ Review"
          value={pendingReviews.length}
          subtitle="Cần phản hồi lập luận"
          icon={FileCheck2}
        />
      </div>

      {/* Quick AI Case Generator Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-blue-900 to-slate-900 text-white shadow-sm border border-brand-blue-800/60 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-teal-500/20 text-brand-teal-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> AI Case Studio Wizard
          </div>
          <h3 className="text-xl font-bold">
            Xây dựng kịch bản tình huống đa nhánh trong 3 phút cùng AI
          </h3>
          <p className="mt-1 text-xs text-slate-300 leading-relaxed">
            Chọn tài liệu môn học đã lập chỉ mục (Runbook, Slide, Báo cáo sự cố), nhập chủ đề và để AI hỗ trợ phác thảo cây quyết định hoàn chỉnh. Bạn luôn toàn quyền duyệt và chỉnh sửa trước khi xuất bản.
          </p>
        </div>
        <Link
          href="/lecturer/cases/new"
          className="shrink-0 px-5 py-3 rounded-xl font-bold text-xs bg-white text-brand-blue-900 hover:bg-slate-100 shadow-md transition-all flex items-center gap-2"
        >
          Khởi tạo ngay
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid: Pending Reviews & Recent Cases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Student Reviews Queue */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Bài nộp chờ bạn Phản hồi ({pendingReviews.length})
              </h3>
              <p className="text-xs text-slate-500">
                Sinh viên đã hoàn thành Journey Review và gửi lập luận
              </p>
            </div>
            <Link
              href="/lecturer/reviews"
              className="text-xs font-bold text-brand-blue-600 dark:text-brand-blue-400 hover:underline flex items-center gap-1"
            >
              Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {pendingReviews.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                Không có bài nộp nào đang chờ phản hồi.
              </p>
            ) : (
              pendingReviews.map((att) => (
                <div
                  key={att.id}
                  className="p-3.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-brand-blue-300 transition-all flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      {att.studentName} ({att.studentCode})
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      {att.caseTitle} • Lần làm #{att.attemptNo}
                    </span>
                  </div>
                  <Link
                    href={`/lecturer/reviews/${att.id}`}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-blue-600 bg-brand-blue-50 dark:bg-brand-blue-950 hover:bg-brand-blue-100 transition-colors"
                  >
                    Xem & Nhận xét
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* My Case Studies list */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Case Study gần đây ({myCases.length})
              </h3>
              <p className="text-xs text-slate-500">Các tình huống giảng dạy bạn đã tạo</p>
            </div>
            <Link
              href="/lecturer/cases"
              className="text-xs font-bold text-brand-blue-600 dark:text-brand-blue-400 hover:underline flex items-center gap-1"
            >
              Quản lý Case <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {myCases.map((c) => (
              <div
                key={c.id}
                className="p-3.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-brand-blue-300 transition-all flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <StatusBadge status={c.status} type="caseStatus" />
                    <StatusBadge status={c.mode} type="mode" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    {c.title}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Cập nhật: {formatTimeAgo(c.updatedAt || c.createdAt)}
                  </span>
                </div>
                <Link
                  href={`/lecturer/cases/${c.id}/edit`}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
                >
                  Sửa kịch bản
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

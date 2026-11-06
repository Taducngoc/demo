'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Plus,
  BookOpen,
  Users,
  GitBranch,
  ArrowRight,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { useMockStore } from '@/mocks/mock-store';
import { toast } from 'sonner';

export default function StudentCoursesPage() {
  const { courses, joinCourseByCode, currentUser } = useMockStore();
  const [classCodeInput, setClassCodeInput] = useState('');
  const [showJoinModal, setShowJoinModal] = useState(false);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classCodeInput.trim()) {
      toast.error('Vui lòng nhập mã lớp học');
      return;
    }

    const success = joinCourseByCode(currentUser?.id || 'student-1', classCodeInput);
    if (success) {
      toast.success('🎉 Tham gia lớp học phần thành công!');
      setShowJoinModal(false);
      setClassCodeInput('');
    } else {
      toast.error('Không tìm thấy lớp học với mã này. Vui lòng kiểm tra lại!');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Khóa học của tôi"
        description="Các lớp học phần bạn đã ghi danh và có thể tiếp cận bài tập tình huống"
        actions={
          <button
            onClick={() => setShowJoinModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-teal-600 hover:bg-brand-teal-700 shadow-sm flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" /> Tham gia bằng mã lớp
          </button>
        }
      />

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:border-brand-teal-400 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-md bg-brand-teal-50 dark:bg-brand-teal-950 text-brand-teal-700 dark:text-brand-teal-300 text-xs font-bold font-mono">
                  {course.code}
                </span>
                <span className="text-xs text-slate-400">{course.term}</span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                {course.name}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                {course.description}
              </p>
            </div>

            <div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 mb-4">
                <span>Giảng viên: <strong className="text-slate-700 dark:text-slate-300">{course.lecturerName}</strong></span>
                <span className="flex items-center gap-1">
                  <GitBranch className="w-3.5 h-3.5" /> {course.caseCount || 0} Case
                </span>
              </div>

              <Link
                href="/student"
                className="w-full py-2 px-3 rounded-xl text-xs font-bold text-center text-brand-teal-700 dark:text-brand-teal-300 bg-brand-teal-50 dark:bg-brand-teal-950 hover:bg-brand-teal-100 transition-colors flex items-center justify-center gap-1.5"
              >
                Xem các Case của môn <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Join with Class Code Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-brand-teal-600" />
              Tham gia lớp học bằng Mã mời (Class Code)
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Nhập mã lớp do Giảng viên cung cấp (Ví dụ: SE2024 hoặc MKT2024)
            </p>

            <form onSubmit={handleJoin} className="mt-5 space-y-4">
              <div>
                <input
                  type="text"
                  value={classCodeInput}
                  onChange={(e) => setClassCodeInput(e.target.value)}
                  placeholder="Mã lớp (Ví dụ: SE2024)"
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono text-center font-bold tracking-widest uppercase focus:ring-2 focus:ring-brand-teal-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-teal-600 hover:bg-brand-teal-700 shadow-sm"
                >
                  Xác nhận tham gia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

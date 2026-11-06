'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Plus,
  Users,
  GitBranch,
  ArrowRight,
  Sparkles,
  KeyRound,
  FileText,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { useMockStore } from '@/mocks/mock-store';
import { toast } from 'sonner';

export default function LecturerCoursesPage() {
  const { courses, createCourse, currentUser } = useMockStore();
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [term, setTerm] = useState('Học kỳ I (2024 - 2025)');
  const [description, setDescription] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      toast.error('Vui lòng nhập tên và mã môn học');
      return;
    }

    const created = createCourse({
      name,
      code,
      term,
      description,
    });

    toast.success(`Đã tạo khóa học thành công! Mã lớp tham gia: ${created.classCode}`);
    setShowCreateModal(false);
    setName('');
    setCode('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý Khóa học"
        description="Danh sách các lớp học phần bạn phụ trách giảng dạy và tổ chức học tập tình huống"
        actions={
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-blue-600 hover:bg-brand-blue-700 shadow-sm flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" /> Tạo khóa học mới
          </button>
        }
      />

      {/* Courses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md hover:border-brand-blue-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-md bg-brand-blue-50 dark:bg-brand-blue-950 text-brand-blue-700 dark:text-brand-blue-300 text-xs font-bold font-mono">
                  {course.code}
                </span>
                <span className="text-xs text-slate-400">{course.term}</span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">
                {course.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                {course.description || 'Chưa có mô tả chi tiết cho học phần này.'}
              </p>

              {/* Class code badge for student joining */}
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between mb-4">
                <span className="text-[11px] text-slate-500 font-medium">Mã mời tham gia lớp:</span>
                <span className="text-xs font-extrabold text-brand-teal-600 dark:text-brand-teal-400 font-mono tracking-wider">
                  {course.classCode}
                </span>
              </div>
            </div>

            <div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 mb-4">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" /> {course.studentCount || 0} Sinh viên
                </span>
                <span className="flex items-center gap-1">
                  <GitBranch className="w-3.5 h-3.5 text-slate-400" /> {course.caseCount || 0} Case Study
                </span>
              </div>

              <Link
                href={`/lecturer/courses/${course.id}`}
                className="w-full py-2 px-3 rounded-xl text-xs font-bold text-center text-brand-blue-600 dark:text-brand-blue-400 bg-brand-blue-50 dark:bg-brand-blue-950 hover:bg-brand-blue-100 dark:hover:bg-brand-blue-900/60 transition-colors flex items-center justify-center gap-1.5"
              >
                Vào quản lý khóa học <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Create Course Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              Khởi tạo Khóa học mới
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Hệ thống sẽ tự động cấp một mã lớp ngẫu nhiên (Class Code) để sinh viên tham gia
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tên Khóa học / Học phần *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: CS301 - Kỹ thuật phần mềm & Kiến trúc hệ thống"
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Mã môn học *
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="CS301"
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Học kỳ
                  </label>
                  <input
                    type="text"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="Học kỳ I 2024-2025"
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mô tả khóa học
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mục tiêu môn học, yêu cầu kiến thức nền tảng..."
                  className="w-full h-20 p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-brand-blue-600 hover:bg-brand-blue-700 shadow-md"
                >
                  Tạo khóa học
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

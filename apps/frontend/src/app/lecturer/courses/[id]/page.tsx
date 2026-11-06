'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  BookOpen,
  FileText,
  Users,
  GitBranch,
  UploadCloud,
  Trash2,
  RefreshCw,
  Plus,
  ArrowRight,
  Sparkles,
  Copy,
  Check,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { FileUploader } from '@/components/shared/FileUploader';
import { useMockStore } from '@/mocks/mock-store';
import { MaterialStatus, CaseMode } from '@edubranch/shared';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function LecturerCourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;
  const { courses, materials, cases, users, uploadMaterial, deleteMaterial } = useMockStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'materials' | 'students' | 'cases'>(
    'materials'
  );
  const [copiedCode, setCopiedCode] = useState(false);

  const course = courses.find((c) => c.id === courseId) || courses[0];
  const courseMaterials = materials.filter((m) => m.courseId === course.id);
  const courseCases = cases.filter((c) => c.courseId === course.id);
  const enrolledStudents = users.filter((u) => u.role === 'STUDENT');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(course.classCode);
    setCopiedCode(true);
    toast.success(`Đã sao chép mã lớp: ${course.classCode}`);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleFileUpload = (file: { name: string; size: number }) => {
    uploadMaterial(course.id, file.name, file.size);
    toast.success('Đã tải tài liệu lên! Hệ thống bắt đầu xử lý trích xuất văn bản (RAG Indexing)...');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={course.name}
        description={`Mã học phần: ${course.code} • ${course.term}`}
        breadcrumbs={[
          { label: 'Khóa học', href: '/lecturer/courses' },
          { label: course.code },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-sm transition-all"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              Mã mời: <span className="font-mono text-brand-teal-600">{course.classCode}</span>
            </button>
            <Link
              href="/lecturer/cases/new"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-blue-600 to-brand-teal-600 hover:opacity-95 shadow-sm flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4" /> Tạo Case mới
            </Link>
          </div>
        }
      />

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-brand-blue-50 text-brand-blue-700 dark:bg-brand-blue-950 dark:text-brand-blue-300'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Tổng quan
        </button>

        <button
          onClick={() => setActiveTab('materials')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'materials'
              ? 'bg-brand-blue-50 text-brand-blue-700 dark:bg-brand-blue-950 dark:text-brand-blue-300'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          <FileText className="w-4 h-4" />
          Tài liệu môn học ({courseMaterials.length})
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'students'
              ? 'bg-brand-blue-50 text-brand-blue-700 dark:bg-brand-blue-950 dark:text-brand-blue-300'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          <Users className="w-4 h-4" />
          Sinh viên ({enrolledStudents.length})
        </button>

        <button
          onClick={() => setActiveTab('cases')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'cases'
              ? 'bg-brand-blue-50 text-brand-blue-700 dark:bg-brand-blue-950 dark:text-brand-blue-300'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          <GitBranch className="w-4 h-4" />
          Case Study ({courseCases.length})
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 max-w-2xl">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Mô tả chi tiết môn học</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {course.description || 'Chưa có thông tin mô tả chi tiết.'}
          </p>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block">Giảng viên phụ trách:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{course.lecturerName}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Thời gian tạo:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{formatDate(course.createdAt)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Materials (RAG Indexing) */}
      {activeTab === 'materials' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Tải lên Tài liệu để AI lập chỉ mục (RAG Indexing)
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Các tài liệu PDF/Docx (Slide bài giảng, sách giáo trình, sổ tay runbook sự cố) sau khi tải lên sẽ được phân tách thành các đoạn văn bản (chunks) và lập chỉ mục để AI trích dẫn bối cảnh chính xác khi sinh Case Study.
            </p>

            <FileUploader onUpload={handleFileUpload} />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Tài liệu đã tải lên ({courseMaterials.length})
              </h4>
              <span className="text-xs text-slate-400">Tự động đồng bộ hóa Vector DB</span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {courseMaterials.map((mat) => (
                <div key={mat.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {mat.fileName}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                        <span>{(mat.fileSize / (1024 * 1024)).toFixed(2)} MB</span>
                        <span>•</span>
                        <span>{formatDate(mat.uploadedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <StatusBadge status={mat.status} type="material" />
                    <button
                      onClick={() => {
                        deleteMaterial(mat.id);
                        toast.success('Đã xóa tài liệu khỏi hệ thống');
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                      title="Xóa tài liệu"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Students */}
      {activeTab === 'students' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Danh sách Sinh viên trong lớp ({enrolledStudents.length})
              </h4>
              <p className="text-xs text-slate-500">
                Sinh viên có thể tự ghi danh vào lớp bằng mã mời:{' '}
                <strong className="text-brand-teal-600 font-mono">{course.classCode}</strong>
              </p>
            </div>
            <button
              onClick={handleCopyCode}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-brand-blue-600 bg-brand-blue-50 dark:bg-brand-blue-950 hover:bg-brand-blue-100 flex items-center gap-1.5 w-fit"
            >
              <Copy className="w-3.5 h-3.5" /> Sao chép mã lớp
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {enrolledStudents.map((st) => (
              <div key={st.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-teal-50 dark:bg-brand-teal-950 text-brand-teal-700 dark:text-brand-teal-300 flex items-center justify-center font-bold text-xs">
                    {st.fullName.charAt(0)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      {st.fullName}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      MSSV: {st.studentCode} • {st.email}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-emerald-600 font-semibold">Đã tham gia</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Course Cases */}
      {activeTab === 'cases' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Các Case Study của học phần này ({courseCases.length})
            </h4>
            <Link
              href="/lecturer/cases/new"
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-brand-blue-600 hover:bg-brand-blue-700 flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Tạo Case mới
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courseCases.map((c) => (
              <div
                key={c.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:border-brand-blue-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <StatusBadge status={c.status} type="caseStatus" />
                    <StatusBadge status={c.mode} type="mode" />
                  </div>
                  <h5 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{c.title}</h5>
                  <p className="text-xs text-slate-500 line-clamp-2">{c.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {c.mode === CaseMode.BRANCHING ? `${c.nodes.length} nodes` : 'Review study'}
                  </span>
                  <Link
                    href={`/lecturer/cases/${c.id}/edit`}
                    className="text-xs font-bold text-brand-blue-600 dark:text-brand-blue-400 hover:underline flex items-center gap-1"
                  >
                    Mở trình chỉnh sửa <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

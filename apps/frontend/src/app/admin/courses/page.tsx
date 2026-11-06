'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Users,
  GitBranch,
  ArrowRightLeft,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { useMockStore } from '@/mocks/mock-store';
import { Course, UserRole } from '@edubranch/shared';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdminCoursesPage() {
  const { courses, users, transferCourse } = useMockStore();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [newLecturerId, setNewLecturerId] = useState('');
  const [showTransferModal, setShowTransferModal] = useState(false);

  const lecturers = users.filter((u) => u.role === UserRole.LECTURER);

  const handleConfirmTransfer = () => {
    if (!selectedCourse || !newLecturerId) return;
    transferCourse(selectedCourse.id, newLecturerId);
    const targetLecturer = lecturers.find((l) => l.id === newLecturerId);
    toast.success(
      `Đã chuyển quyền phụ trách môn "${selectedCourse.name}" sang ${targetLecturer?.fullName}`
    );
    setShowTransferModal(false);
    setSelectedCourse(null);
    setNewLecturerId('');
  };

  const columns = [
    {
      key: 'name',
      header: 'Tên khóa học & Mã môn',
      render: (c: Course) => (
        <div>
          <span className="font-bold text-white block text-sm">{c.name}</span>
          <span className="text-xs text-slate-400 font-mono">
            Mã môn: {c.code} • Mã lớp: <strong className="text-brand-teal-400">{c.classCode}</strong>
          </span>
        </div>
      ),
    },
    {
      key: 'lecturerName',
      header: 'Giảng viên phụ trách',
      render: (c: Course) => (
        <span className="text-xs text-slate-300 font-semibold">{c.lecturerName || '—'}</span>
      ),
    },
    {
      key: 'term',
      header: 'Học kỳ',
      render: (c: Course) => <span className="text-xs text-slate-400">{c.term}</span>,
    },
    {
      key: 'stats',
      header: 'Quy mô',
      render: (c: Course) => (
        <div className="flex items-center gap-3 text-xs text-slate-300">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-400" /> {c.studentCount || 0} SV
          </span>
          <span className="flex items-center gap-1">
            <GitBranch className="w-3.5 h-3.5 text-slate-400" /> {c.caseCount || 0} Case
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      className: 'text-right',
      render: (c: Course) => (
        <button
          onClick={() => {
            setSelectedCourse(c);
            setNewLecturerId(c.lecturerId);
            setShowTransferModal(true);
          }}
          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-purple-300 border border-slate-700 flex items-center gap-1.5 ml-auto transition-colors"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" /> Chuyển giao GV
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý Khóa học"
        description="Danh sách học phần đại học, phân bổ giảng viên và mã tham gia lớp học"
      />

      <DataTable
        data={courses}
        columns={columns}
        searchPlaceholder="Tìm kiếm khóa học theo tên, mã môn hoặc giảng viên..."
        searchKey={(c) => `${c.name} ${c.code} ${c.lecturerName || ''} ${c.classCode}`}
      />

      {/* Transfer Lecturer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 text-white shadow-2xl">
            <h3 className="text-base font-bold flex items-center gap-2 text-purple-400">
              <ArrowRightLeft className="w-5 h-5" />
              Chuyển giao quyền phụ trách khóa học
            </h3>
            <p className="mt-2 text-xs text-slate-400">
              Khóa học: <strong>{selectedCourse?.name}</strong> ({selectedCourse?.code})
            </p>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Chọn Giảng viên tiếp quản:
              </label>
              <select
                value={newLecturerId}
                onChange={(e) => setNewLecturerId(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-700 bg-slate-800 text-xs text-white focus:ring-1 focus:ring-purple-500"
              >
                {lecturers.map((lec) => (
                  <option key={lec.id} value={lec.id}>
                    {lec.fullName} ({lec.department || 'Giảng viên'})
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setShowTransferModal(false);
                  setSelectedCourse(null);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmTransfer}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-purple-600 hover:bg-purple-700"
              >
                Xác nhận chuyển giao
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Users,
  UserCheck,
  Lock,
  Unlock,
  KeyRound,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building2,
  GraduationCap,
  Clock,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useMockStore } from '@/mocks/mock-store';
import { User, UserRole, UserStatus } from '@edubranch/shared';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

function AdminUsersContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'pending' ? 'pending' : 'all';
  const [activeTab, setActiveTab] = useState<'all' | 'pending'>(initialTab);

  const {
    users,
    approveLecturer,
    rejectLecturer,
    toggleUserLock,
    resetUserPassword,
  } = useMockStore();

  // Dialog states
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showConfirmLock, setShowConfirmLock] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);

  const pendingLecturers = users.filter(
    (u) => u.role === UserRole.LECTURER && u.status === UserStatus.PENDING
  );

  const displayedUsers = activeTab === 'pending' ? pendingLecturers : users;

  const handleApprove = (user: User) => {
    approveLecturer(user.id);
    toast.success(`Đã phê duyệt tài khoản giảng viên: ${user.fullName}`);
  };

  const handleConfirmReject = () => {
    if (!selectedUser) return;
    if (!rejectReason.trim()) {
      toast.error('Vui lòng nhập lý do từ chối phê duyệt');
      return;
    }
    rejectLecturer(selectedUser.id, rejectReason);
    setShowRejectModal(false);
    setRejectReason('');
    setSelectedUser(null);
    toast.success('Đã từ chối phê duyệt tài khoản và thông báo lý do');
  };

  const handleConfirmLock = () => {
    if (!selectedUser) return;
    toggleUserLock(selectedUser.id);
    const isNowLocked = selectedUser.status !== UserStatus.LOCKED;
    toast.info(isNowLocked ? `Đã khóa tài khoản: ${selectedUser.fullName}` : `Đã mở khóa tài khoản: ${selectedUser.fullName}`);
    setShowConfirmLock(false);
    setSelectedUser(null);
  };

  const handleConfirmResetPassword = () => {
    if (!selectedUser) return;
    resetUserPassword(selectedUser.id);
    toast.success(`Đã cấp lại mật khẩu tạm thời cho ${selectedUser.email}`);
    setShowResetPasswordModal(false);
    setSelectedUser(null);
  };

  const columns = [
    {
      key: 'fullName',
      header: 'Họ và tên',
      render: (u: User) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 text-purple-300 border border-slate-700 flex items-center justify-center font-bold text-xs">
            {u.fullName.charAt(0)}
          </div>
          <div>
            <span className="font-semibold text-white block">{u.fullName}</span>
            <span className="text-xs text-slate-400">{u.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Vai trò',
      render: (u: User) => <StatusBadge status={u.role} type="role" />,
    },
    {
      key: 'info',
      header: 'Mã số / Khoa',
      render: (u: User) => (
        <span className="text-xs text-slate-300">
          {u.studentCode ? `MSSV: ${u.studentCode}` : u.department || '—'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (u: User) => <StatusBadge status={u.status} type="userStatus" />,
    },
    {
      key: 'createdAt',
      header: 'Ngày tạo',
      render: (u: User) => (
        <span className="text-xs text-slate-400">{formatDate(u.createdAt)}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Hành động',
      className: 'text-right',
      render: (u: User) => {
        if (u.role === UserRole.ADMIN) {
          return <span className="text-xs text-slate-500 italic">Quản trị viên hệ thống</span>;
        }

        if (u.role === UserRole.LECTURER && u.status === UserStatus.PENDING) {
          return (
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => handleApprove(u)}
                className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Duyệt
              </button>
              <button
                onClick={() => {
                  setSelectedUser(u);
                  setShowRejectModal(true);
                }}
                className="px-2.5 py-1 rounded bg-rose-900/60 hover:bg-rose-900 text-rose-300 border border-rose-700 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" /> Từ chối
              </button>
            </div>
          );
        }

        return (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => {
                setSelectedUser(u);
                setShowResetPasswordModal(true);
              }}
              title="Đặt lại mật khẩu"
              className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <KeyRound className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setSelectedUser(u);
                setShowConfirmLock(true);
              }}
              title={u.status === UserStatus.LOCKED ? 'Mở khóa' : 'Khóa tài khoản'}
              className={`p-1.5 rounded transition-colors ${
                u.status === UserStatus.LOCKED
                  ? 'text-rose-400 hover:bg-rose-950/50'
                  : 'text-slate-400 hover:text-rose-400 hover:bg-slate-800'
              }`}
            >
              {u.status === UserStatus.LOCKED ? (
                <Unlock className="w-4 h-4" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý Người dùng"
        description="Danh sách tài khoản sinh viên, giảng viên và xử lý duyệt hồ sơ giảng viên"
      />

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'all'
              ? 'bg-purple-900/60 text-purple-200 border border-purple-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          Tất cả người dùng ({users.length})
        </button>

        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'pending'
              ? 'bg-amber-950/80 text-amber-200 border border-amber-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-400" />
          Giảng viên chờ duyệt
          {pendingLecturers.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">
              {pendingLecturers.length}
            </span>
          )}
        </button>
      </div>

      <DataTable
        data={displayedUsers}
        columns={columns}
        searchPlaceholder="Tìm kiếm theo tên, email, MSSV hoặc khoa..."
        searchKey={(u) => `${u.fullName} ${u.email} ${u.studentCode || ''} ${u.department || ''}`}
        pageSize={8}
        emptyTitle={
          activeTab === 'pending'
            ? 'Không có giảng viên chờ duyệt'
            : 'Không tìm thấy người dùng'
        }
        emptyDescription={
          activeTab === 'pending'
            ? 'Tất cả các tài khoản giảng viên đăng ký đã được xử lý duyệt.'
            : 'Không có tài khoản nào phù hợp với từ khóa tìm kiếm.'
        }
      />

      {/* Reject Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 text-white shadow-2xl">
            <h3 className="text-base font-bold flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              Từ chối duyệt tài khoản Giảng viên
            </h3>
            <p className="mt-2 text-xs text-slate-400">
              Bạn đang từ chối hồ sơ của <strong>{selectedUser?.fullName}</strong> (
              {selectedUser?.department}). Hãy nhập lý do chi tiết để gửi thông báo cho giảng viên.
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Ví dụ: Thiếu văn bản quyết định phân công giảng dạy của Khoa..."
              className="mt-4 w-full h-24 p-3 rounded-lg border border-slate-700 bg-slate-800 text-xs text-white focus:ring-1 focus:ring-purple-500 focus:outline-none"
            />

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                  setSelectedUser(null);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-700"
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Lock Dialog */}
      <ConfirmDialog
        isOpen={showConfirmLock}
        onClose={() => setShowConfirmLock(false)}
        onConfirm={handleConfirmLock}
        title={selectedUser?.status === UserStatus.LOCKED ? 'Mở khóa tài khoản' : 'Khóa tài khoản người dùng'}
        description={`Bạn có chắc chắn muốn ${
          selectedUser?.status === UserStatus.LOCKED ? 'mở khóa' : 'khóa'
        } tài khoản của ${selectedUser?.fullName}?`}
        isDanger={selectedUser?.status !== UserStatus.LOCKED}
      />

      {/* Reset Password Dialog */}
      <ConfirmDialog
        isOpen={showResetPasswordModal}
        onClose={() => setShowResetPasswordModal(false)}
        onConfirm={handleConfirmResetPassword}
        title="Đặt lại mật khẩu người dùng"
        description={`Hệ thống sẽ sinh mật khẩu ngẫu nhiên tạm thời và gửi liên kết xác thực tới email ${selectedUser?.email}.`}
        confirmText="Xác nhận cấp lại"
      />
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Đang tải danh sách người dùng...</div>}>
      <AdminUsersContent />
    </Suspense>
  );
}

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import {
  UserRole,
  UserStatus,
  CaseStatus,
  CaseMode,
  OutcomeLabel,
  AttemptStatus,
  MaterialStatus,
} from '@edubranch/shared';

interface StatusBadgeProps {
  status?: string;
  type?: 'role' | 'userStatus' | 'caseStatus' | 'mode' | 'outcome' | 'attempt' | 'material';
  className?: string;
}

export function StatusBadge({ status, type = 'caseStatus', className }: StatusBadgeProps) {
  if (!status) return null;

  // Configuration for different badges
  const getBadgeStyle = () => {
    switch (status) {
      // User Roles
      case UserRole.ADMIN:
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800';
      case UserRole.LECTURER:
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800';
      case UserRole.STUDENT:
        return 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800';

      // User Status
      case UserStatus.ACTIVE:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300';
      case UserStatus.PENDING:
        return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300';
      case UserStatus.LOCKED:
        return 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300';
      case UserStatus.REJECTED:
        return 'bg-slate-200 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300';

      // Case Status
      case CaseStatus.DRAFT:
        return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300';
      case CaseStatus.APPROVED:
        return 'bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300';
      case CaseStatus.PUBLISHED:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300';
      case CaseStatus.ARCHIVED:
        return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300';

      // Case Mode
      case CaseMode.BRANCHING:
        return 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300';
      case CaseMode.REVIEW:
        return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300';

      // Outcome Labels
      case OutcomeLabel.EXCELLENT:
      case 'Tốt':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300';
      case OutcomeLabel.ACCEPTABLE:
      case 'Chấp nhận được':
        return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/50 dark:text-blue-300';
      case OutcomeLabel.POOR:
      case 'Kém':
        return 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/50 dark:text-rose-300';

      // Attempt Status
      case AttemptStatus.IN_PROGRESS:
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case AttemptStatus.REVIEWING:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case AttemptStatus.SUBMITTED:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case AttemptStatus.REVIEWED:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';

      // Material Status
      case MaterialStatus.UPLOADED:
        return 'bg-slate-100 text-slate-700';
      case MaterialStatus.PROCESSING:
        return 'bg-amber-100 text-amber-800 animate-pulse';
      case MaterialStatus.INDEXED:
        return 'bg-teal-100 text-teal-800';
      case MaterialStatus.FAILED:
        return 'bg-rose-100 text-rose-800';

      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getLabel = () => {
    switch (status) {
      case UserRole.ADMIN: return 'Quản trị viên';
      case UserRole.LECTURER: return 'Giảng viên';
      case UserRole.STUDENT: return 'Sinh viên';
      case UserStatus.ACTIVE: return 'Hoạt động';
      case UserStatus.PENDING: return 'Chờ duyệt';
      case UserStatus.LOCKED: return 'Đang khóa';
      case UserStatus.REJECTED: return 'Đã từ chối';
      case CaseStatus.DRAFT: return 'Bản nháp';
      case CaseStatus.APPROVED: return 'Đã phê duyệt';
      case CaseStatus.PUBLISHED: return 'Đã xuất bản';
      case CaseStatus.ARCHIVED: return 'Đã lưu trữ';
      case CaseMode.BRANCHING: return 'Phân nhánh (Branching)';
      case CaseMode.REVIEW: return 'Review Study';
      case AttemptStatus.IN_PROGRESS: return 'Đang làm';
      case AttemptStatus.REVIEWING: return 'Journey Review';
      case AttemptStatus.REFLECTING: return 'Đang suy ngẫm';
      case AttemptStatus.SUBMITTED: return 'Chờ GV Review';
      case AttemptStatus.REVIEWED: return 'Đã có phản hồi';
      case MaterialStatus.UPLOADED: return 'Đã tải lên';
      case MaterialStatus.PROCESSING: return 'Đang lập chỉ mục...';
      case MaterialStatus.INDEXED: return 'Đã chỉ mục hóa (RAG)';
      case MaterialStatus.FAILED: return 'Lỗi chỉ mục';
      default: return status;
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors',
        getBadgeStyle(),
        className
      )}
    >
      {getLabel()}
    </span>
  );
}

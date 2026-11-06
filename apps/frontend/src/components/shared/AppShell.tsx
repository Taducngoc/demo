'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GitBranch,
  FileCheck2,
  BarChart3,
  FlaskConical,
  Settings,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  Sparkles,
  Bot,
  UserCheck,
  History,
  GraduationCap,
  Bell,
  Sun,
  Moon,
} from 'lucide-react';
import { useMockStore } from '@/mocks/mock-store';
import { UserRole, UserStatus } from '@edubranch/shared';
import { NotificationBell } from './NotificationBell';
import { StatusBadge } from './StatusBadge';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number | string;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, setCurrentUser, users } = useMockStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Determine navigation items by role
  let navItems: NavItem[] = [];
  let roleTitle = '';
  const isAdmin = currentUser?.role === UserRole.ADMIN;
  const isLecturer = currentUser?.role === UserRole.LECTURER;
  const isStudent = currentUser?.role === UserRole.STUDENT;

  if (isAdmin) {
    roleTitle = 'Khu vực Quản trị Admin';
    navItems = [
      { label: 'Tổng quan', href: '/admin', icon: LayoutDashboard },
      { label: 'Người dùng', href: '/admin/users', icon: Users },
      { label: 'Khóa học', href: '/admin/courses', icon: BookOpen },
      { label: 'Tất cả Case', href: '/admin/cases', icon: GitBranch },
      { label: 'Cấu hình AI', href: '/admin/ai-settings', icon: Bot },
      { label: 'Đánh giá nghiên cứu', href: '/admin/evaluation', icon: FlaskConical },
      { label: 'Audit Logs', href: '/admin/audit-logs', icon: History },
      { label: 'Cài đặt hệ thống', href: '/admin/settings', icon: Settings },
    ];
  } else if (isLecturer) {
    roleTitle = 'Cổng thông tin Giảng viên';
    navItems = [
      { label: 'Tổng quan', href: '/lecturer', icon: LayoutDashboard },
      { label: 'Khóa học & Tài liệu', href: '/lecturer/courses', icon: BookOpen },
      { label: 'Quản lý Case Study', href: '/lecturer/cases', icon: GitBranch },
      { label: 'Review & Feedback', href: '/lecturer/reviews', icon: FileCheck2 },
      { label: 'Thống kê Flow', href: '/lecturer/statistics', icon: BarChart3 },
      { label: 'Đánh giá Rubric', href: '/lecturer/evaluation', icon: FlaskConical },
    ];
  } else {
    roleTitle = 'Không gian học tập Sinh viên';
    navItems = [
      { label: 'Bàn học (Dashboard)', href: '/student', icon: LayoutDashboard },
      { label: 'Khóa học của tôi', href: '/student/courses', icon: GraduationCap },
    ];
  }

  const handleRoleSwitch = (targetUserId: string) => {
    const selected = users.find((u) => u.id === targetUserId);
    if (!selected) return;
    setCurrentUser(selected);

    if (selected.role === UserRole.ADMIN) {
      router.push('/admin');
    } else if (selected.role === UserRole.LECTURER) {
      if (selected.status === UserStatus.PENDING) {
        router.push('/login?pending=true');
      } else {
        router.push('/lecturer');
      }
    } else {
      router.push('/student');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    if (isAdmin) {
      router.push('/admin/login');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className={`min-h-screen flex ${isAdmin ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 dark:bg-slate-950'}`}>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col w-64 shrink-0 border-r transition-colors ${
          isAdmin
            ? 'bg-slate-900 border-slate-800 text-slate-200'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-inherit gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-blue-700 to-brand-teal-500 flex items-center justify-center text-white shadow-md">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight block">EduBranch AI</span>
            <span className="text-[10px] text-slate-400 block tracking-wide uppercase font-semibold">
              Case-Based Learning
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {roleTitle}
          </div>
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin' &&
                item.href !== '/lecturer' &&
                item.href !== '/student' &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? isAdmin
                      ? 'bg-brand-blue-900/60 text-brand-blue-300 font-semibold'
                      : 'bg-brand-blue-50 text-brand-blue-700 dark:bg-brand-blue-950/60 dark:text-brand-blue-300 font-semibold'
                    : isAdmin
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Quick Role Switcher Box (for paired evaluation and instant testing) */}
        <div className="p-3 border-t border-inherit">
          <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
              Chuyển vai trò thử nghiệm:
            </span>
            <select
              value={currentUser?.id || ''}
              onChange={(e) => handleRoleSwitch(e.target.value)}
              className="w-full text-xs py-1.5 px-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium focus:ring-1 focus:ring-brand-blue-500"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  [{u.role}] {u.fullName} {u.status === UserStatus.PENDING ? '(Pending)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Current User footer */}
        <div className="p-4 border-t border-inherit flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-brand-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              {currentUser?.fullName.charAt(0) || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate text-slate-800 dark:text-slate-200">
                {currentUser?.fullName}
              </p>
              <p className="text-[10px] text-slate-400 truncate">{currentUser?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Đăng xuất"
            className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-rose-500 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header
          className={`h-16 flex items-center justify-between px-4 sm:px-8 border-b shrink-0 ${
            isAdmin
              ? 'bg-slate-900 border-slate-800'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          }`}
        >
          {/* Mobile menu button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <StatusBadge status={currentUser?.role} type="role" />
              {currentUser?.status === UserStatus.PENDING && (
                <span className="text-xs text-amber-600 font-semibold">(Tài khoản chờ duyệt)</span>
              )}
            </div>
          </div>

          {/* Right Header items */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
              title="Đổi giao diện sáng/tối"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <NotificationBell />

            <div className="hidden sm:block text-right">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                {currentUser?.fullName}
              </span>
              <span className="text-[10px] text-slate-400 block">
                {currentUser?.role === UserRole.STUDENT
                  ? `MSSV: ${currentUser.studentCode || 'N/A'}`
                  : currentUser?.department || 'EduBranch Platform'}
              </span>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">{children}</main>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-64 bg-white dark:bg-slate-900 flex flex-col p-4 shadow-2xl z-10">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <span className="font-bold text-base">EduBranch AI</span>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

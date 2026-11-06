'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users,
  UserCheck,
  BookOpen,
  GitBranch,
  Bot,
  Activity,
  ArrowRight,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { StatCard } from '@/components/shared/StatCard';
import { PageHeader } from '@/components/shared/PageHeader';
import { useMockStore } from '@/mocks/mock-store';
import { UserRole, UserStatus, CaseStatus } from '@edubranch/shared';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import { formatTimeAgo } from '@/lib/utils';

export default function AdminDashboardPage() {
  const { users, courses, cases, attempts, aiLogs, auditLogs } = useMockStore();

  const totalStudents = users.filter((u) => u.role === UserRole.STUDENT).length;
  const totalLecturers = users.filter((u) => u.role === UserRole.LECTURER).length;
  const pendingLecturers = users.filter(
    (u) => u.role === UserRole.LECTURER && u.status === UserStatus.PENDING
  ).length;
  const publishedCases = cases.filter((c) => c.status === CaseStatus.PUBLISHED).length;
  const totalAttempts = attempts.length;

  const totalAiTokens = aiLogs.reduce((acc, log) => acc + log.tokensIn + log.tokensOut, 0);
  const totalAiCost = aiLogs.reduce((acc, log) => acc + log.costUsd, 0).toFixed(4);

  // Mock charts data
  const userGrowthData = [
    { week: 'Tuần 38', students: 12, lecturers: 2 },
    { week: 'Tuần 39', students: 25, lecturers: 3 },
    { week: 'Tuần 40', students: 48, lecturers: 4 },
    { week: 'Tuần 41', students: 65, lecturers: 5 },
    { week: 'Tuần 42 (Hiện tại)', students: 84, lecturers: 7 },
  ];

  const aiUsageData = [
    { day: 'T2', calls: 14, tokens: 18200 },
    { day: 'T3', calls: 28, tokens: 36400 },
    { day: 'T4', calls: 45, tokens: 62100 },
    { day: 'T5', calls: 39, tokens: 48900 },
    { day: 'T6', calls: 62, tokens: 84300 },
    { day: 'T7', calls: 22, tokens: 28100 },
    { day: 'CN', calls: 18, tokens: 21500 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bảng điều khiển Quản trị viên"
        description="Giám sát vận hành hệ thống, phê duyệt tài khoản, chi phí AI và quản lý tài nguyên học thuật"
        actions={
          pendingLecturers > 0 ? (
            <Link
              href="/admin/users?tab=pending"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 transition-colors animate-pulse"
            >
              <AlertCircle className="w-4 h-4 text-amber-700" />
              Có {pendingLecturers} Giảng viên chờ duyệt
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : undefined
        }
      />

      {/* Primary KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Tổng Sinh viên"
          value={totalStudents}
          subtitle="Tài khoản đang hoạt động"
          icon={Users}
          trend={{ value: '+18% tháng này', isPositive: true }}
        />
        <StatCard
          title="Tổng Giảng viên"
          value={totalLecturers}
          subtitle={`${pendingLecturers} tài khoản PENDING`}
          icon={UserCheck}
        />
        <StatCard
          title="Khóa học đang mở"
          value={courses.length}
          subtitle="Toàn trường đại học"
          icon={BookOpen}
        />
        <StatCard
          title="Case đã Xuất bản"
          value={publishedCases}
          subtitle={`Trên tổng số ${cases.length} case`}
          icon={GitBranch}
        />
        <StatCard
          title="Lượt Attempt tuần này"
          value={totalAttempts}
          subtitle="Tương tác tình huống"
          icon={Activity}
          trend={{ value: '+35%', isPositive: true }}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Tăng trưởng người dùng theo tuần</h3>
              <p className="text-xs text-slate-400">Số lượng sinh viên & giảng viên mới đăng ký</p>
            </div>
            <TrendingUp className="w-4 h-4 text-brand-blue-400" />
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="students" name="Sinh viên" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="lecturers" name="Giảng viên" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI LLM Cost & Usage Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Lưu lượng & Chi phí AI (7 ngày qua)</h3>
              <p className="text-xs text-slate-400">
                Tổng tokens: {totalAiTokens.toLocaleString()} • Ước tính: ${totalAiCost}
              </p>
            </div>
            <Bot className="w-4 h-4 text-purple-400" />
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={aiUsageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="aiGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="calls"
                  name="Lượt gọi API"
                  stroke="#a855f7"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#aiGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Audit Trail Snippet */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white">Nhật ký hoạt động bảo mật gần đây</h3>
            <p className="text-xs text-slate-400">Ghi nhận mọi thao tác quản trị viên và giảng viên</p>
          </div>
          <Link
            href="/admin/audit-logs"
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {auditLogs.slice(0, 4).map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between text-xs p-3 rounded-lg bg-slate-950/60 border border-slate-800/80"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/50">
                  {log.action}
                </span>
                <span className="text-slate-300">
                  <strong>{log.actorName}</strong> thực hiện trên {log.targetType} ({log.targetId})
                </span>
              </div>
              <div className="flex items-center gap-4 text-slate-500">
                <span>IP: {log.ipAddress || '127.0.0.1'}</span>
                <span>{formatTimeAgo(log.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

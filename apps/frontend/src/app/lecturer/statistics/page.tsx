'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Filter,
  CheckCircle2,
  GitBranch,
  Layers,
  TrendingUp,
  PieChart as PieIcon,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { useMockStore } from '@/mocks/mock-store';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { toast } from 'sonner';

export default function LecturerStatisticsPage() {
  const { cases, attempts, courses } = useMockStore();
  const [selectedCaseId, setSelectedCaseId] = useState(cases[0]?.id || '');

  const activeCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  // 1. Completion & Flow Status Data
  const caseAttempts = attempts.filter((a) => a.caseId === activeCase.id);
  const totalStudents = 42; // Enrolled students in class
  const completedCount = caseAttempts.filter(
    (a) => a.status === 'SUBMITTED' || a.status === 'REVIEWED'
  ).length;
  const inProgressCount = caseAttempts.filter((a) => a.status === 'IN_PROGRESS').length;
  const notStartedCount = Math.max(0, totalStudents - completedCount - inProgressCount);

  const completionRate = ((completedCount / totalStudents) * 100).toFixed(1);

  // 2. Selected Branch Distribution (Situation 1 options breakdown)
  const branchData = [
    { name: 'Phương án A (Hàng đợi ảo)', value: 24, percent: '57%' },
    { name: 'Phương án B (Auto-scale DB)', value: 6, percent: '14%' },
    { name: 'Phương án C (Degraded Mode)', value: 12, percent: '29%' },
  ];

  // 3. Number of Attempts Histogram
  const attemptsHistogramData = [
    { attempts: '1 lần làm', students: 26 },
    { attempts: '2 lần làm', students: 11 },
    { attempts: '3 lần làm', students: 4 },
    { attempts: '≥ 4 lần', students: 1 },
  ];

  // 4. Terminal Outcome Breakdown
  const outcomeData = [
    { name: 'Tốt (Phục hồi ngoạn mục)', value: 22, color: '#10b981' },
    { name: 'Chấp nhận được (Tổn thất vừa)', value: 14, color: '#3b82f6' },
    { name: 'Kém (Sập toàn bộ)', value: 6, color: '#f43f5e' },
  ];

  const handleExportCSV = () => {
    toast.success('Đã xuất báo cáo thống kê luồng học tập dạng CSV!');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Thống kê Luồng Học tập (Learning-flow Statistics)"
        description="Phân tích phân bố ngã rẽ quyết định, tỷ lệ hoàn thành và xu hướng lựa chọn của sinh viên"
        actions={
          <div className="flex items-center gap-3">
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
            >
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 flex items-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" /> Xuất dữ liệu CSV
            </button>
          </div>
        }
      />

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Tỷ lệ Hoàn thành (Completion)"
          value={`${completionRate}%`}
          subtitle={`${completedCount} / ${totalStudents} sinh viên đã nộp`}
          icon={CheckCircle2}
          trend={{ value: 'Đạt chỉ tiêu', isPositive: true }}
        />
        <StatCard
          title="Số lần làm bài trung bình"
          value="1.5 lượt"
          subtitle="Sinh viên chủ động thử lại (Retry)"
          icon={TrendingUp}
        />
        <StatCard
          title="Đang trong hành trình"
          value={inProgressCount}
          subtitle="Chưa chạm tới Terminal"
          icon={GitBranch}
        />
        <StatCard
          title="Chưa bắt đầu"
          value={notStartedCount}
          subtitle="Cần nhắc nhở hạn nộp"
          icon={BarChart3}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Branch Selection Distribution */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Phân bố Lựa chọn tại Tình huống 1 (Pivotal)
            </h3>
            <p className="text-xs text-slate-500">
              Tỷ lệ sinh viên lựa chọn các phương án rẽ nhánh khởi đầu
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={branchData}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 30, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={140} fontSize={10} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="value" name="Số sinh viên" fill="#0c87eb" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Outcome Terminal Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Phân bố Kết quả cuối cùng (Terminal Outcomes)
            </h3>
            <p className="text-xs text-slate-500">
              Tỷ lệ kết cục đạt được theo mức độ giải quyết khủng hoảng
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={outcomeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {outcomeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Number of Attempts Histogram */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm lg:col-span-2">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Histogram Số lần làm bài (Number of Attempts)
            </h3>
            <p className="text-xs text-slate-500">
              Phân tích tinh thần chủ động thử nghiệm lại (Retry) để khám phá nhánh mới
            </p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attemptsHistogramData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="attempts" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="students" name="Số sinh viên" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

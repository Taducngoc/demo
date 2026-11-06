'use client';

import React, { useState } from 'react';
import {
  Bot,
  Sliders,
  DollarSign,
  Cpu,
  Layers,
  ShieldAlert,
  Save,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { useMockStore } from '@/mocks/mock-store';
import { AiCallLog } from '@edubranch/shared';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdminAiSettingsPage() {
  const { aiLogs } = useMockStore();

  // Settings local state
  const [provider, setProvider] = useState<'mock' | 'gemini' | 'openai'>('gemini');
  const [model, setModel] = useState('gemini-1.5-flash');
  const [maxTokens, setMaxTokens] = useState(4096);
  const [monthlyBudget, setMonthlyBudget] = useState(150);
  const [isAiEnabled, setIsAiEnabled] = useState(true);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Đã lưu cấu hình AI thành công!');
  };

  const columns = [
    {
      key: 'createdAt',
      header: 'Thời gian',
      render: (log: AiCallLog) => (
        <span className="text-xs text-slate-400 font-mono">{formatDate(log.createdAt)}</span>
      ),
    },
    {
      key: 'userName',
      header: 'Người dùng',
      render: (log: AiCallLog) => (
        <span className="text-xs font-semibold text-white">{log.userName || log.userId}</span>
      ),
    },
    {
      key: 'task',
      header: 'Loại tác vụ',
      render: (log: AiCallLog) => {
        let label = log.task;
        let color = 'bg-blue-900/60 text-blue-300 border-blue-700';
        if (log.task === 'CASE_GENERATION') {
          label = 'Sinh Case Draft' as any;
          color = 'bg-purple-900/60 text-purple-300 border-purple-700';
        } else if (log.task === 'CHALLENGE_QUESTION') {
          label = 'Câu hỏi thách thức' as any;
          color = 'bg-teal-900/60 text-teal-300 border-teal-700';
        }
        return (
          <span className={`text-[11px] px-2 py-0.5 rounded border font-medium ${color}`}>
            {label}
          </span>
        );
      },
    },
    {
      key: 'model',
      header: 'Model',
      render: (log: AiCallLog) => (
        <span className="text-xs font-mono text-slate-300">{log.model}</span>
      ),
    },
    {
      key: 'tokens',
      header: 'Tokens (In / Out)',
      render: (log: AiCallLog) => (
        <span className="text-xs text-slate-300">
          {log.tokensIn.toLocaleString()} / {log.tokensOut.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'costUsd',
      header: 'Chi phí ($USD)',
      render: (log: AiCallLog) => (
        <span className="text-xs font-mono text-emerald-400">
          ${log.costUsd.toFixed(4)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (log: AiCallLog) => (
        <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" /> Thành công
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Cấu hình Dịch vụ AI & Giám sát Chi phí"
        description="Quản lý nhà cung cấp mô hình ngôn ngữ lớn (LLM), ngân sách hoạt động và nhật ký các lần kích hoạt AI"
      />

      {/* AI Configuration Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-800">
          <div className="p-2.5 rounded-lg bg-purple-950/60 text-purple-400 border border-purple-800/50">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Tham số Mô hình AI Toàn hệ thống</h3>
            <p className="text-xs text-slate-400">Các quy tắc định tuyến prompt và hạn mức token</p>
          </div>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Provider */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nhà cung cấp Mô hình (Provider)
              </label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as any)}
                className="w-full p-2.5 rounded-lg border border-slate-700 bg-slate-800 text-xs text-white focus:ring-1 focus:ring-purple-500"
              >
                <option value="gemini">Google Gemini (Gemini 1.5 Flash)</option>
                <option value="openai">OpenAI (GPT-4o-mini)</option>
                <option value="mock">Bản Mock cục bộ (Không tốn token API)</option>
              </select>
            </div>

            {/* Model Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tên Model áp dụng
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-700 bg-slate-800 text-xs text-white focus:ring-1 focus:ring-purple-500"
              />
            </div>

            {/* Max Challenge Rounds - Locked at 2 */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Số vòng câu hỏi thách thức
                </label>
                <span className="text-[10px] text-amber-400 flex items-center gap-1 font-semibold">
                  <Lock className="w-3 h-3" /> Cố định theo chuẩn
                </span>
              </div>
              <input
                type="number"
                value={2}
                disabled
                className="w-full p-2.5 rounded-lg border border-slate-700 bg-slate-800/50 text-xs text-slate-400 cursor-not-allowed font-bold"
              />
              <p className="mt-1 text-[10px] text-slate-500">
                Quy tắc nghiệp vụ cố định: Tối đa 2 vòng câu hỏi phản biện, tránh biến thành tranh biện vô tận.
              </p>
            </div>

            {/* Token Limit */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Giới hạn Token phản hồi tối đa
              </label>
              <input
                type="number"
                value={maxTokens}
                onChange={(e) => setMaxTokens(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-700 bg-slate-800 text-xs text-white focus:ring-1 focus:ring-purple-500"
              />
            </div>

            {/* Monthly Budget */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Ngân sách trần hàng tháng ($USD)
              </label>
              <input
                type="number"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-700 bg-slate-800 text-xs text-white focus:ring-1 focus:ring-purple-500"
              />
            </div>

            {/* AI Master Switch */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Trạng thái Dịch vụ AI
              </label>
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAiEnabled(!isAiEnabled)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    isAiEnabled
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-900/60 text-rose-300 border border-rose-700'
                  }`}
                >
                  {isAiEnabled ? 'Đang BẬT' : 'Đang TẮT (Emergency Off)'}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-purple-600 hover:bg-purple-700 shadow-md flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" /> Lưu cấu hình AI
            </button>
          </div>
        </form>
      </div>

      {/* AI Logs Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-purple-400" />
            Nhật ký các lượt gọi AI (AiCallLog)
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Tổng cộng: {aiLogs.length} lần kích hoạt
          </span>
        </div>

        <DataTable
          data={aiLogs}
          columns={columns}
          searchPlaceholder="Tìm theo tên người dùng, model hoặc task..."
          searchKey={(l) => `${l.userName || ''} ${l.model} ${l.task}`}
        />
      </div>
    </div>
  );
}

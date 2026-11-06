'use client';

import React from 'react';
import {
  FlaskConical,
  Download,
  Star,
  CheckCircle2,
  FileSpreadsheet,
  BarChart,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { useMockStore } from '@/mocks/mock-store';
import { EvaluationRubric, CaseSource } from '@edubranch/shared';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdminEvaluationPage() {
  const { evaluations, surveys, cases } = useMockStore();

  const handleExportCSV = () => {
    // Generate CSV content
    const headers = ['ID', 'Case Title', 'Case Source', 'Evaluator', 'Realism', 'Difficulty', 'Alignment', 'Comment', 'Date'];
    const rows = evaluations.map((e) => [
      e.id,
      `"${e.caseTitle || ''}"`,
      e.caseSource || 'N/A',
      `"${e.evaluatorName || ''}"`,
      e.realism,
      e.difficulty,
      e.alignment,
      `"${e.comment.replace(/"/g, '""')}"`,
      e.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `edubranch_research_evaluations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Đã xuất thành công tệp CSV dữ liệu đánh giá nghiên cứu!');
  };

  // Group stats
  const aiGeneratedEvals = evaluations.filter((e) => e.caseSource === CaseSource.AI_GENERATED);
  const lecturerEvals = evaluations.filter((e) => e.caseSource === CaseSource.LECTURER_AUTHORED);

  const calcAvg = (list: EvaluationRubric[], key: 'realism' | 'difficulty' | 'alignment') => {
    if (list.length === 0) return '0.0';
    const sum = list.reduce((acc, item) => acc + item[key], 0);
    return (sum / list.length).toFixed(1);
  };

  const columns = [
    {
      key: 'caseTitle',
      header: 'Case Study & Nguồn gốc',
      render: (e: EvaluationRubric) => (
        <div>
          <span className="font-bold text-white block text-sm">{e.caseTitle}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold uppercase ${
            e.caseSource === CaseSource.AI_GENERATED ? 'text-purple-400 bg-purple-950/60' : 'text-blue-400 bg-blue-950/60'
          }`}>
            {e.caseSource === CaseSource.AI_GENERATED ? 'AI-Generated Draft' : 'Lecturer-Authored'}
          </span>
        </div>
      ),
    },
    {
      key: 'evaluatorName',
      header: 'Người đánh giá',
      render: (e: EvaluationRubric) => (
        <span className="text-xs text-slate-300 font-semibold">{e.evaluatorName}</span>
      ),
    },
    {
      key: 'realism',
      header: 'Tính Thực tế (Realism)',
      render: (e: EvaluationRubric) => (
        <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
          <Star className="w-3.5 h-3.5 fill-amber-400" /> {e.realism} / 5
        </div>
      ),
    },
    {
      key: 'difficulty',
      header: 'Độ Khó (Difficulty)',
      render: (e: EvaluationRubric) => (
        <div className="flex items-center gap-1 text-purple-400 font-bold text-xs">
          <Star className="w-3.5 h-3.5 fill-purple-400" /> {e.difficulty} / 5
        </div>
      ),
    },
    {
      key: 'alignment',
      header: 'Phù hợp Môn (Alignment)',
      render: (e: EvaluationRubric) => (
        <div className="flex items-center gap-1 text-teal-400 font-bold text-xs">
          <Star className="w-3.5 h-3.5 fill-teal-400" /> {e.alignment} / 5
        </div>
      ),
    },
    {
      key: 'comment',
      header: 'Nhận xét chuyên gia',
      render: (e: EvaluationRubric) => (
        <span className="text-xs text-slate-400 line-clamp-2 max-w-xs">{e.comment}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dữ liệu Nghiên cứu & Đánh giá Rubric"
        description="Đo lường định lượng chất lượng tình huống học tập (Quantitative Evaluation) phục vụ nghiên cứu khoa học sư phạm"
        actions={
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 flex items-center gap-2 shadow-md transition-all"
          >
            <Download className="w-4 h-4" /> Xuất dữ liệu CSV
          </button>
        }
      />

      {/* Comparison Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-2">
            Nhóm AI-Generated Drafts ({aiGeneratedEvals.length} đánh giá)
          </span>
          <div className="grid grid-cols-3 gap-3 text-center mt-3">
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-xl font-bold text-amber-400">{calcAvg(aiGeneratedEvals, 'realism')}</span>
              <p className="text-[10px] text-slate-400 mt-0.5">Realism / 5</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-xl font-bold text-purple-400">{calcAvg(aiGeneratedEvals, 'difficulty')}</span>
              <p className="text-[10px] text-slate-400 mt-0.5">Difficulty / 5</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-xl font-bold text-teal-400">{calcAvg(aiGeneratedEvals, 'alignment')}</span>
              <p className="text-[10px] text-slate-400 mt-0.5">Alignment / 5</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-2">
            Nhóm Lecturer-Authored ({lecturerEvals.length} đánh giá)
          </span>
          <div className="grid grid-cols-3 gap-3 text-center mt-3">
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-xl font-bold text-amber-400">{calcAvg(lecturerEvals, 'realism')}</span>
              <p className="text-[10px] text-slate-400 mt-0.5">Realism / 5</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-xl font-bold text-purple-400">{calcAvg(lecturerEvals, 'difficulty')}</span>
              <p className="text-[10px] text-slate-400 mt-0.5">Difficulty / 5</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-xl font-bold text-teal-400">{calcAvg(lecturerEvals, 'alignment')}</span>
              <p className="text-[10px] text-slate-400 mt-0.5">Alignment / 5</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rubric table */}
      <DataTable
        data={evaluations}
        columns={columns}
        searchPlaceholder="Tìm kiếm đánh giá rubric theo tiêu đề case hoặc người đánh giá..."
        searchKey={(e) => `${e.caseTitle || ''} ${e.evaluatorName || ''}`}
      />
    </div>
  );
}

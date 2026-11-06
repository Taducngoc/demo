'use client';

import React, { useState } from 'react';
import {
  FlaskConical,
  Star,
  Send,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Award,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { useMockStore } from '@/mocks/mock-store';
import { EvaluationRubric, CaseSource } from '@edubranch/shared';
import { toast } from 'sonner';

export default function LecturerEvaluationPage() {
  const { cases, evaluations, submitRubric, currentUser } = useMockStore();

  const [selectedCaseId, setSelectedCaseId] = useState(cases[0]?.id || '');
  const [realism, setRealism] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<number>(4);
  const [alignment, setAlignment] = useState<number>(5);
  const [comment, setComment] = useState('');

  const targetCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Vui lòng nhập nhận xét chuyên môn');
      return;
    }

    submitRubric({
      caseId: targetCase.id,
      realism,
      difficulty,
      alignment,
      comment,
    });

    toast.success('Đã lưu phiếu đánh giá Rubric phục vụ nghiên cứu khoa học!');
    setComment('');
  };

  const myEvaluations = evaluations.filter((e) => e.evaluatorId === currentUser?.id);

  const columns = [
    {
      key: 'caseTitle',
      header: 'Tình huống đánh giá',
      render: (e: EvaluationRubric) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block text-xs">
            {e.caseTitle}
          </span>
          <span className="text-[10px] font-mono text-purple-600 font-bold uppercase">
            Nguồn: {e.caseSource || 'AI_GENERATED'}
          </span>
        </div>
      ),
    },
    {
      key: 'realism',
      header: 'Realism (Thực tế)',
      render: (e: EvaluationRubric) => (
        <span className="font-bold text-amber-500 text-xs flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-500" /> {e.realism} / 5
        </span>
      ),
    },
    {
      key: 'difficulty',
      header: 'Difficulty (Độ khó)',
      render: (e: EvaluationRubric) => (
        <span className="font-bold text-purple-500 text-xs flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-purple-500" /> {e.difficulty} / 5
        </span>
      ),
    },
    {
      key: 'alignment',
      header: 'Alignment (Độ khớp môn)',
      render: (e: EvaluationRubric) => (
        <span className="font-bold text-teal-500 text-xs flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-teal-500" /> {e.alignment} / 5
        </span>
      ),
    },
    {
      key: 'comment',
      header: 'Nhận xét chuyên môn',
      render: (e: EvaluationRubric) => (
        <span className="text-xs text-slate-500 line-clamp-2 max-w-sm">{e.comment}</span>
      ),
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader
        title="Đánh giá Định lượng Tình huống (Quantitative Research Rubric)"
        description="Phiếu khảo sát chuẩn mực đo lường chất lượng kịch bản tình huống học thuật phục vụ đề tài nghiên cứu"
      />

      <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-xs text-purple-950 dark:text-purple-200">
        🔬 <strong>Mục đích nghiên cứu:</strong> Bảng đánh giá Rubric này hoàn toàn độc lập với việc đánh giá sinh viên. Dữ liệu này dùng để so sánh chất lượng giữa 2 nhóm case: <strong>AI-generated Drafts</strong> và <strong>Lecturer-authored Cases</strong> theo các tiêu chí chuẩn mực sư phạm quốc tế.
      </div>

      {/* Rubric Rating Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6"
      >
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Chấm điểm Rubric cho Tình huống
        </h3>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Chọn Case Study cần đánh giá:
          </label>
          <select
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
          >
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                [{c.source}] {c.title}
              </option>
            ))}
          </select>
        </div>

        {/* 3 Likert 1-5 sliders/radios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Realism */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              1. Tính Thực tế (Realism): {realism} / 5
            </span>
            <p className="text-[10px] text-slate-500">
              Mức độ sát với các tình huống khủng hoảng thực tế tại doanh nghiệp
            </p>
            <input
              type="range"
              min={1}
              max={5}
              value={realism}
              onChange={(e) => setRealism(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Difficulty */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              2. Độ Khó (Difficulty): {difficulty} / 5
            </span>
            <p className="text-[10px] text-slate-500">
              Mức độ phức tạp của bài toán và đòi hỏi tư duy phân tích cao
            </p>
            <input
              type="range"
              min={1}
              max={5}
              value={difficulty}
              onChange={(e) => setDifficulty(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Alignment */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              3. Phù hợp Môn (Alignment): {alignment} / 5
            </span>
            <p className="text-[10px] text-slate-500">
              Độ gắn kết với mục tiêu chuẩn đầu ra (CLO) của học phần
            </p>
            <input
              type="range"
              min={1}
              max={5}
              value={alignment}
              onChange={(e) => setAlignment(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Nhận xét chuyên gia & Gợi ý cải tiến nội dung *
          </label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Nêu rõ ưu nhược điểm của kịch bản này..."
            className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-blue-500 focus:outline-none"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-purple-600 hover:bg-purple-700 shadow-sm flex items-center gap-2"
          >
            <Send className="w-4 h-4" /> Lưu phiếu đánh giá Rubric
          </button>
        </div>
      </form>

      {/* History of Rubric evaluations */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
          Các phiếu đánh giá Rubric đã lưu ({evaluations.length})
        </h4>

        <DataTable
          data={evaluations}
          columns={columns}
          searchPlaceholder="Tìm kiếm theo tiêu đề case..."
          searchKey={(e) => e.caseTitle || ''}
        />
      </div>
    </div>
  );
}

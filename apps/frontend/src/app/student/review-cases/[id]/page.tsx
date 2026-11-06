'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FileCheck2,
  Table,
  Send,
  AlertCircle,
  CheckCircle2,
  Calendar,
  BookOpen,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useMockStore } from '@/mocks/mock-store';
import { AttemptStatus } from '@edubranch/shared';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function StudentReviewStudyPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params.id as string;
  const { cases, attempts, submitReviewStudy, currentUser } = useMockStore();

  const currentCase = cases.find((c) => c.id === caseId) || cases[1]; // fallback to Review Case
  const existingAttempt = attempts.find(
    (a) => a.caseId === currentCase.id && a.studentId === currentUser?.id
  );

  const [solution, setSolution] = useState(existingAttempt?.reviewSolution || '');
  const [reasoning, setReasoning] = useState(existingAttempt?.reviewReasoning || '');
  const [isSubmitted, setIsSubmitted] = useState(!!existingAttempt);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!solution.trim() || !reasoning.trim()) {
      toast.error('Vui lòng nhập đầy đủ cả Phương án giải pháp và Lập luận căn cứ');
      return;
    }

    submitReviewStudy(currentCase.id, currentUser?.id || 'student-1', solution, reasoning);
    setIsSubmitted(true);
    toast.success('🎉 Đã nộp bài giải pháp Review Study thành công!');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader
        title={currentCase.title}
        description={`Chế độ Review Study • Học phần: ${currentCase.courseName}`}
        breadcrumbs={[
          { label: 'Bàn học', href: '/student' },
          { label: 'Review Study' },
        ]}
      />

      {/* Context, Data & Problem Briefing */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <span className="text-[11px] font-bold text-brand-teal-600 uppercase tracking-wider block mb-1">
            Bối cảnh Tình huống (Context)
          </span>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {currentCase.reviewContext || currentCase.description}
          </p>
        </div>

        {/* Data Box */}
        {currentCase.reviewData && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Table className="w-4 h-4 text-brand-blue-600" />
              Số liệu & Dữ liệu thực tế đính kèm (Data):
            </span>
            <pre className="text-xs font-mono text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {currentCase.reviewData}
            </pre>
          </div>
        )}

        {/* Problem to solve */}
        <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-950 dark:text-amber-200 space-y-1">
          <span className="font-bold flex items-center gap-1 text-amber-800 dark:text-amber-300 uppercase tracking-wide text-[10px]">
            <AlertCircle className="w-4 h-4" /> Vấn đề cần giải quyết (Problem Statement):
          </span>
          <p className="leading-relaxed font-medium text-xs">
            {currentCase.reviewProblem || 'Phân tích các số liệu trên và đề xuất phương án giải quyết tối ưu.'}
          </p>
        </div>
      </div>

      {/* Submission Form or Result View */}
      {isSubmitted ? (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Bài nộp giải pháp của bạn
              </span>
              <StatusBadge
                status={existingAttempt?.feedback ? AttemptStatus.REVIEWED : AttemptStatus.SUBMITTED}
                type="attempt"
              />
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block mb-1">Phương án giải pháp:</span>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {solution}
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block mb-1">Lập luận căn cứ:</span>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {reasoning}
                </div>
              </div>
            </div>
          </div>

          {/* Lecturer Feedback Display if exists */}
          {existingAttempt?.feedback && (
            <div className="p-6 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
                  Nhận xét từ Giảng viên ({existingAttempt.feedback.lecturerName})
                </h4>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                {existingAttempt.feedback.generalComment}
              </p>
            </div>
          )}
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6"
        >
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              1. Đề xuất Phương án / Kế hoạch giải quyết của bạn *
            </label>
            <textarea
              rows={6}
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder="Trình bày giải pháp chi tiết: Các giai đoạn triển khai, hành động kỹ thuật/chiến lược..."
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs leading-relaxed focus:ring-2 focus:ring-brand-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              2. Lập luận căn cứ (Dựa trên số liệu và kiến thức học phần) *
            </label>
            <textarea
              rows={4}
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              placeholder="Giải thích tại sao bạn chọn phương án này, vì sao giải pháp này tối ưu chi phí/hiệu quả..."
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs leading-relaxed focus:ring-2 focus:ring-brand-teal-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-teal-600 to-brand-blue-600 hover:opacity-95 shadow-md flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> Nộp bài Review Study
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

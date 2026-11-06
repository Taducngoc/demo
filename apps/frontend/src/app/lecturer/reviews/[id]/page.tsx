'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FileCheck2,
  Compass,
  Bot,
  Sparkles,
  Send,
  MessageSquare,
  CheckCircle2,
  Flag,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  User,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useMockStore } from '@/mocks/mock-store';
import { NodeType, OutcomeLabel, CaseMode } from '@edubranch/shared';
import { toast } from 'sonner';

export default function LecturerAttemptReviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const attemptId = params.id as string;
  const { attempts, cases, saveReviewFeedback, currentUser } = useMockStore();

  const attempt = attempts.find((a) => a.id === attemptId) || attempts[0];
  const targetCase = cases.find((c) => c.id === attempt?.caseId) || cases[0];

  const [generalComment, setGeneralComment] = useState(
    attempt.feedback?.generalComment || ''
  );
  const [decisionNotes, setDecisionNotes] = useState<Record<string, string>>(
    attempt.feedback?.decisionNotes || {}
  );
  const [aiAnalysisSuggestion, setAiAnalysisSuggestion] = useState<string | null>(null);
  const [isGeneratingSuggestion, setIsGeneratingSuggestion] = useState(false);

  const handleGenerateAiSuggestion = () => {
    setIsGeneratingSuggestion(true);
    setTimeout(() => {
      setAiAnalysisSuggestion(
        'Gợi ý tham khảo từ AI: Sinh viên đã thể hiện tư duy tốt khi nhận diện đúng nút thắt cổ chai ở tầng cơ sở dữ liệu thay vì vội vàng auto-scale. Tại các câu hỏi phản biện, sinh viên đã viện dẫn chính xác cơ chế Idempotency Key. Đề xuất giảng viên ghi nhận tư duy bảo vệ tính nhất quán dữ liệu và gợi ý mở rộng thêm về Circuit Breaker.'
      );
      setIsGeneratingSuggestion(false);
      toast.info('AI đã đưa ra gợi ý phân tích (chỉ dành cho Giảng viên tham khảo)');
    }, 1000);
  };

  const handleSaveFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!generalComment.trim()) {
      toast.error('Vui lòng nhập nhận xét chung cho sinh viên');
      return;
    }

    saveReviewFeedback({
      id: `fb-${Date.now()}`,
      attemptId: attempt.id,
      lecturerId: currentUser?.id || 'lecturer-1',
      lecturerName: currentUser?.fullName || 'TS. Nguyễn Văn An',
      generalComment,
      decisionNotes,
      createdAt: new Date().toISOString(),
    });

    toast.success('🎉 Đã gửi nhận xét & phản hồi cho sinh viên thành công!');
    router.push('/lecturer/reviews');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader
        title={`Đánh giá Lập luận: ${attempt.studentName}`}
        description={`Môn: ${attempt.courseName} • ${attempt.caseTitle} (Lần làm #${attempt.attemptNo})`}
        breadcrumbs={[
          { label: 'Review Queue', href: '/lecturer/reviews' },
          { label: attempt.studentName || 'Sinh viên' },
        ]}
      />

      {/* Strict Pedagogical Notice */}
      <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-950 dark:text-blue-200 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-brand-blue-600 shrink-0" />
        <span>
          <strong>Nguyên tắc sư phạm:</strong> Nền tảng không áp dụng chấm điểm số học thuật (No grading / No ranking). Mục tiêu là cung cấp nhận xét định tính có giá trị sâu sắc giúp sinh viên nâng cao tư duy phản biện.
        </span>
      </div>

      {/* BRANCHING STUDY ATTEMPT REVIEW */}
      {targetCase.mode === CaseMode.BRANCHING ? (
        <div className="space-y-6">
          {/* Path Taken Summary */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-brand-blue-600" />
              Đường đi thực tế của sinh viên trong lần làm này
            </h3>

            <div className="space-y-3">
              {attempt.steps.map((step, idx) => {
                const node = targetCase.nodes.find((n) => n.id === step.nodeId);
                const isTerminal = node?.type === NodeType.TERMINAL;
                const reasoning = attempt.reasonings.find((r) => r.nodeId === node?.id);

                return (
                  <div
                    key={step.id}
                    className={`p-4 rounded-xl border text-xs space-y-2 ${
                      isTerminal
                        ? 'border-emerald-200 bg-emerald-50/40 dark:bg-emerald-950/20'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        Bước {idx + 1}: {node?.title}
                      </span>
                      {node?.isPivotal && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                          Quyết định then chốt
                        </span>
                      )}
                    </div>

                    {step.chosenOptionLabel && (
                      <p className="text-slate-600 dark:text-slate-400">
                        ➔ Lựa chọn: <strong className="text-slate-800 dark:text-slate-200">{step.chosenOptionLabel}</strong>
                      </p>
                    )}

                    {/* Pivotal reasoning and challenge history */}
                    {reasoning && (
                      <div className="mt-3 p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                        <span className="text-[11px] font-bold text-brand-blue-700 dark:text-brand-blue-300 block">
                          Bản lập luận của sinh viên:
                        </span>
                        <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                          {reasoning.content}
                        </p>

                        {/* AI Challenge History */}
                        {reasoning.challengeRounds.length > 0 && (
                          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-2">
                            <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase">
                              Lịch sử phản biện với AI ({reasoning.challengeRounds.length}/2 Vòng):
                            </span>
                            {reasoning.challengeRounds.map((cr) => (
                              <div key={cr.id} className="p-2 rounded bg-white dark:bg-slate-900 text-[11px] space-y-1">
                                <p className="font-semibold text-purple-600">Hỏi: {cr.aiQuestion}</p>
                                <p className="text-slate-600 dark:text-slate-300">Đáp: {cr.studentAnswer || '(Chưa trả lời)'}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Student Reflection Summary */}
          {attempt.reflection && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-brand-teal-600" />
                Suy ngẫm của Sinh viên (Reflection)
              </h4>
              <div className="text-xs space-y-2 text-slate-600 dark:text-slate-300">
                <p><strong>Bước then chốt:</strong> {attempt.reflection.pivotalDecisionStep}</p>
                <p><strong>Điều muốn đổi nếu làm lại:</strong> {attempt.reflection.whatToChangeIfRetrying}</p>
                <p><strong>Bài học rút ra:</strong> {attempt.reflection.keyTakeaways}</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* REVIEW STUDY ATTEMPT REVIEW */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Bài giải pháp Review Study của sinh viên
          </h3>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
            <strong>Đề xuất giải pháp:</strong>
            <p className="mt-1">{attempt.reviewSolution || 'Chưa nộp'}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
            <strong>Lập luận căn cứ:</strong>
            <p className="mt-1">{attempt.reviewReasoning || 'Chưa nộp'}</p>
          </div>
        </div>
      )}

      {/* AI Analysis Suggestion Box (Optional AI assist for Lecturer) */}
      <div className="p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <h4 className="text-xs font-bold text-purple-950 dark:text-purple-200">
              Gợi ý phân tích từ AI (Dành riêng cho Giảng viên tham khảo)
            </h4>
          </div>
          <button
            type="button"
            disabled={isGeneratingSuggestion}
            onClick={handleGenerateAiSuggestion}
            className="px-3 py-1 rounded-lg text-xs font-semibold text-purple-700 bg-purple-100 hover:bg-purple-200 transition-colors"
          >
            {isGeneratingSuggestion ? 'Đang phân tích...' : 'Bấm để sinh gợi ý'}
          </button>
        </div>

        {aiAnalysisSuggestion && (
          <p className="text-xs text-purple-900 dark:text-purple-200 leading-relaxed font-normal bg-white/70 dark:bg-slate-900/60 p-3.5 rounded-xl border border-purple-200">
            {aiAnalysisSuggestion}
          </p>
        )}
      </div>

      {/* Lecturer Feedback Form */}
      <form
        onSubmit={handleSaveFeedback}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6"
      >
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <MessageSquare className="w-5 h-5 text-brand-blue-600" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Nhận xét & Phản hồi chuyên môn của Giảng viên
          </h3>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Nhận xét tổng thể về tư duy lập luận của sinh viên *
          </label>
          <textarea
            rows={5}
            value={generalComment}
            onChange={(e) => setGeneralComment(e.target.value)}
            placeholder="Nêu bật điểm tốt trong tư duy giải quyết vấn đề, những giả định cần xem xét lại và gợi ý đào sâu thêm..."
            className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs leading-relaxed focus:ring-2 focus:ring-brand-blue-500 focus:outline-none"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl font-bold text-xs text-white bg-brand-blue-600 hover:bg-brand-blue-700 shadow-md flex items-center gap-2"
          >
            <Send className="w-4 h-4" /> Gửi phản hồi cho sinh viên
          </button>
        </div>
      </form>
    </div>
  );
}

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  GitBranch,
  ArrowRight,
  Database,
  Table,
  FileText,
  AlertCircle,
  CheckCircle2,
  X,
  Compass,
  Sparkles,
} from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useMockStore } from '@/mocks/mock-store';
import { NodeType, OutcomeLabel, CaseNode } from '@edubranch/shared';
import { toast } from 'sonner';

function StudentCasePlayerContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const caseId = params.id as string;
  const attemptIdParam = searchParams.get('attemptId');
  const isPreview = searchParams.get('preview') === 'true';

  const { cases, attempts, recordStep, startAttempt, currentUser } = useMockStore();

  const currentCase = cases.find((c) => c.id === caseId) || cases[0];

  // Resolve current active attempt or create one
  const currentAttempt =
    attempts.find((a) => a.id === attemptIdParam) ||
    attempts.find((a) => a.caseId === currentCase.id && a.studentId === currentUser?.id) ||
    attempts[0];

  // Determine current node in path
  const lastStep = currentAttempt?.steps[currentAttempt.steps.length - 1];
  const initialNodeId = lastStep?.nodeId || currentCase.rootNodeId;

  const [currentNodeId, setCurrentNodeId] = useState<string>(initialNodeId);
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  const [stepCounter, setStepCounter] = useState<number>(currentAttempt?.steps?.length || 1);

  const currentNode = currentCase.nodes.find((n) => n.id === currentNodeId) || currentCase.nodes[0];
  const isTerminal = currentNode?.type === NodeType.TERMINAL;

  useEffect(() => {
    setSelectedOptionId('');
  }, [currentNodeId]);

  const handleNextStep = () => {
    if (!selectedOptionId) {
      toast.warning('Vui lòng chọn một phương án hành động để tiếp tục');
      return;
    }

    const chosenOption = currentNode.options.find((o) => o.id === selectedOptionId);
    if (!chosenOption || !chosenOption.nextNodeId) {
      toast.error('Lỗi định tuyến: Không tìm thấy node tiếp theo');
      return;
    }

    if (!isPreview && currentAttempt) {
      recordStep(currentAttempt.id, currentNode.id, selectedOptionId, chosenOption.nextNodeId);
    }

    setStepCounter((prev) => prev + 1);
    setCurrentNodeId(chosenOption.nextNodeId);
  };

  const handleFinishToReview = () => {
    if (isPreview) {
      router.push(`/lecturer/cases/${currentCase.id}/edit`);
      return;
    }
    toast.success('Chuyển sang màn hình xem lại hành trình (Journey Review)');
    router.push(`/student/attempts/${currentAttempt.id}/review`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 text-slate-100 flex flex-col overflow-hidden select-none">
      {/* Distraction-Free Header */}
      <header className="h-16 px-6 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-blue-600 to-brand-teal-500 flex items-center justify-center text-white font-bold text-xs">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block max-w-sm truncate">
              {currentCase.title}
            </span>
            <span className="text-[10px] text-slate-400">
              {isPreview ? 'Chế độ xem trước của Giảng viên' : `Lượt làm #${currentAttempt?.attemptNo || 1}`}
            </span>
          </div>
        </div>

        {/* Neutral Progress Indicator (No total count because branch lengths vary!) */}
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-mono font-semibold text-slate-300">
            Hành trình: Bước {stepCounter}
          </div>

          <Link
            href={isPreview ? `/lecturer/cases/${currentCase.id}/edit` : `/student/cases/${currentCase.id}`}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Thoát chế độ làm bài"
          >
            <X className="w-5 h-5" />
          </Link>
        </div>
      </header>

      {/* Main Focus Stage */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center">
        <div className="w-full max-w-3xl my-auto space-y-6">
          {!isTerminal ? (
            /* SITUATION DISPLAY */
            <>
              {/* Situation Box */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-brand-teal-400 uppercase tracking-wider font-mono">
                    Điểm quyết định hiện tại
                  </span>
                  {currentNode.isPivotal && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800 font-bold">
                      Quyết định quan trọng
                    </span>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                  {currentNode.title}
                </h2>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                  {currentNode.content}
                </p>

                {/* Attached Data Tab/Card if exists */}
                {currentNode.dataJson && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Table className="w-4 h-4 text-brand-blue-400" />
                      {currentNode.dataJson.title || 'Dữ liệu giám sát / Hồ sơ đính kèm'}
                    </span>

                    {currentNode.dataJson.items && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs">
                        {Object.entries(currentNode.dataJson.items).map(([key, val]) => (
                          <div
                            key={key}
                            className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between"
                          >
                            <span className="text-slate-400">{key}:</span>
                            <span className="font-mono font-bold text-slate-200">{String(val)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {currentNode.dataJson.rawText && (
                      <pre className="p-3 rounded-lg bg-slate-950 text-xs font-mono text-purple-300 overflow-x-auto">
                        {currentNode.dataJson.rawText}
                      </pre>
                    )}
                  </div>
                )}

                {currentNode.promptQuestion && (
                  <div className="pt-2">
                    <p className="text-xs font-bold text-brand-teal-300">
                      ❓ {currentNode.promptQuestion}
                    </p>
                  </div>
                )}
              </div>

              {/* Large Options Cards */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Lựa chọn phương án hành động của bạn:
                </span>

                <div className="space-y-3">
                  {currentNode.options.map((option) => {
                    const isSelected = selectedOptionId === option.id;
                    return (
                      <div
                        key={option.id}
                        onClick={() => setSelectedOptionId(option.id)}
                        className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-start gap-4 ${
                          isSelected
                            ? 'border-brand-blue-500 bg-brand-blue-950/40 text-white ring-2 ring-brand-blue-500/30 shadow-lg'
                            : 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'border-brand-blue-500 bg-brand-blue-600 text-white'
                              : 'border-slate-600'
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>

                        <div className="flex-1">
                          <h4 className="text-sm font-bold block mb-1 text-white">
                            {option.label}
                          </h4>
                          <p className="text-xs text-slate-400 leading-relaxed font-normal">
                            {option.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Continue Action Button */}
              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleNextStep}
                  disabled={!selectedOptionId}
                  className={`px-8 py-3.5 rounded-xl font-bold text-sm text-white flex items-center gap-2 shadow-lg transition-all ${
                    selectedOptionId
                      ? 'bg-gradient-to-r from-brand-blue-600 to-brand-teal-600 hover:opacity-95'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                  }`}
                >
                  Xác nhận lựa chọn & Tiếp tục
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            /* TERMINAL OUTCOME REACHED DISPLAY */
            <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-blue-600 to-brand-teal-500 text-white flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold text-brand-teal-400 uppercase tracking-widest block mb-2 font-mono">
                  Hành trình phân nhánh kết thúc
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  {currentNode.title}
                </h2>
              </div>

              <div className="max-w-xl mx-auto p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {currentNode.content}
              </div>

              <div className="pt-4 max-w-md mx-auto">
                <p className="text-xs text-slate-400 mb-6">
                  Bạn đã đi hết các ngã rẽ của tình huống này. Bây giờ hãy bước vào{' '}
                  <strong className="text-white">Journey Review</strong> để nhìn lại toàn bộ các quyết định, mở khóa các hậu quả thực tế và bảo vệ lập luận của mình trước câu hỏi phản biện của AI!
                </p>

                <button
                  onClick={handleFinishToReview}
                  className="w-full py-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-brand-blue-600 to-brand-teal-600 hover:opacity-95 shadow-xl shadow-brand-blue-900/30 flex items-center justify-center gap-2"
                >
                  Vào màn hình Journey Review
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function StudentCasePlayerPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-slate-900 text-white">Đang khởi tạo bối cảnh tình huống...</div>}>
      <StudentCasePlayerContent />
    </Suspense>
  );
}

'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Compass,
  GitBranch,
  CheckCircle2,
  AlertTriangle,
  Send,
  Sparkles,
  Bot,
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  Lock,
  Flag,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useMockStore } from '@/mocks/mock-store';
import { NodeType, OutcomeLabel, ChallengeRound } from '@edubranch/shared';
import { toast } from 'sonner';

export default function StudentJourneyReviewPage() {
  const params = useParams();
  const router = useRouter();
  const attemptId = params.id as string;

  const {
    attempts,
    cases,
    submitReasoning,
    addChallengeRound,
    answerChallengeRound,
    currentUser,
  } = useMockStore();

  const attempt = attempts.find((a) => a.id === attemptId) || attempts[0];
  const targetCase = cases.find((c) => c.id === attempt?.caseId) || cases[0];

  // Reasoning inputs state per node
  const [reasoningDrafts, setReasoningDrafts] = useState<Record<string, string>>({});
  const [activeChallengeAnswers, setActiveChallengeAnswers] = useState<Record<string, string>>({});
  const [isAiLoading, setIsAiLoading] = useState<Record<string, boolean>>({});

  // Nodes traversed in this attempt
  const traversedNodeIds = attempt.steps.map((s) => s.nodeId);
  const pivotalNodes = targetCase.nodes.filter(
    (n) => n.isPivotal && traversedNodeIds.includes(n.id)
  );

  const handleSaveReasoning = (nodeId: string) => {
    const content = reasoningDrafts[nodeId];
    if (!content || content.length < 20) {
      toast.error('Lập luận phải từ 20 ký tự trở lên (nêu lý do chọn, loại trừ phương án khác và dữ liệu vận dụng)');
      return;
    }
    submitReasoning(attempt.id, nodeId, content);
    toast.success('Đã lưu lập luận của bạn cho quyết định then chốt này!');
  };

  const handleRequestAiChallenge = (reasoningId: string, currentRoundCount: number) => {
    if (currentRoundCount >= 2) {
      toast.warning('Đã đạt giới hạn tối đa 2 vòng phản biện từ AI');
      return;
    }

    setIsAiLoading((prev) => ({ ...prev, [reasoningId]: true }));

    setTimeout(() => {
      const nextRoundNo = (currentRoundCount + 1) as 1 | 2;
      const question =
        nextRoundNo === 1
          ? 'Trong bối cảnh áp lực sự cố, phương án này có thể giải quyết trước mắt nhưng nếu kéo dài quá 2 giờ sẽ gây ảnh hưởng gì tới các bộ phận liên quan?'
          : 'Cơ chế giám sát cụ thể nào bạn sẽ thiết lập để biết được khi nào cần chuyển đổi trạng thái phục hồi sang giai đoạn tiếp theo?';

      addChallengeRound(reasoningId, nextRoundNo, question);
      setIsAiLoading((prev) => ({ ...prev, [reasoningId]: false }));
      toast.info(`AI đã gửi câu hỏi thử thách phản biện (Vòng ${nextRoundNo}/2)`);
    }, 1200);
  };

  const handleAnswerChallenge = (reasoningId: string, roundNo: 1 | 2) => {
    const key = `${reasoningId}-${roundNo}`;
    const ans = activeChallengeAnswers[key];
    if (!ans || ans.trim().length < 10) {
      toast.error('Câu trả lời phản biện tối thiểu 10 ký tự');
      return;
    }
    answerChallengeRound(reasoningId, roundNo, ans);
    toast.success(`Đã hoàn tất trả lời câu hỏi thách thức Vòng ${roundNo}!`);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <PageHeader
        title="Journey Review – Xem lại Toàn bộ Hành trình Quyết định"
        description={`Học phần: ${targetCase.courseName} • Lần làm #${attempt.attemptNo}`}
        breadcrumbs={[
          { label: 'Bàn học', href: '/student' },
          { label: 'Tình huống', href: `/student/cases/${targetCase.id}` },
          { label: 'Journey Review' },
        ]}
        actions={
          <Link
            href={`/student/attempts/${attempt.id}/reflection`}
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-blue-600 to-brand-teal-600 hover:opacity-95 shadow-md flex items-center gap-2"
          >
            Chuyển sang bước Suy ngẫm (Reflection) <ArrowRight className="w-4 h-4" />
          </Link>
        }
      />

      {/* Visual Path Diagram: Traversed vs Untraversed branches */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-brand-blue-600" />
            Sơ đồ Hành trình Quyết định (Decision Path Visualization)
          </h3>
          <span className="text-[11px] text-slate-400">
            Tổng cộng: {attempt.steps.length} bước quyết định đã đi qua
          </span>
        </div>

        {/* Path ribbon visualizer */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {attempt.steps.map((step, idx) => {
            const node = targetCase.nodes.find((n) => n.id === step.nodeId);
            const isTerminal = node?.type === NodeType.TERMINAL;

            return (
              <div
                key={step.id}
                className={`p-4 rounded-xl border text-xs relative ${
                  isTerminal
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30'
                    : 'border-brand-blue-500 bg-brand-blue-50/40 dark:bg-brand-blue-950/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-[10px] text-brand-blue-700 dark:text-brand-blue-300">
                    BƯỚC {idx + 1}
                  </span>
                  {node?.isPivotal && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 font-bold">
                      Pivotal
                    </span>
                  )}
                </div>
                <h5 className="font-bold text-slate-900 dark:text-white line-clamp-1 mb-1">
                  {node?.title}
                </h5>
                {step.chosenOptionLabel && (
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                    ➔ Đã chọn: <strong className="text-slate-800 dark:text-slate-100">{step.chosenOptionLabel}</strong>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Decision Points Breakdown with REVEALED CONSEQUENCES */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Chi tiết các Quyết định & Hậu quả thực tế được tiết lộ
          </h3>
          <span className="text-xs text-brand-teal-600 font-semibold">
            Bảo mật sư phạm đã mở khóa
          </span>
        </div>

        {attempt.steps.map((step, index) => {
          const node = targetCase.nodes.find((n) => n.id === step.nodeId);
          if (!node) return null;
          const chosenOpt = node.options.find((o) => o.id === step.optionId);
          const isTerminal = node.type === NodeType.TERMINAL;
          const reasoning = attempt.reasonings.find((r) => r.nodeId === node.id);

          return (
            <div
              key={step.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5"
            >
              {/* Step Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-blue-600 text-white font-bold text-xs flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {node.title}
                  </span>
                </div>
                {node.isPivotal && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center gap-1">
                    <Flag className="w-3.5 h-3.5 text-amber-600" /> Quyết định then chốt
                  </span>
                )}
              </div>

              {/* Chosen Option and REVEALED Consequence */}
              {!isTerminal && chosenOpt && (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="text-[11px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">
                      Phương án bạn đã chọn:
                    </span>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                      {chosenOpt.label}
                    </h5>
                    <p className="text-xs text-slate-500 mt-0.5">{chosenOpt.description}</p>
                  </div>

                  {/* Consequence Reveal Box */}
                  <div className="p-4 rounded-xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-300 dark:border-teal-800 text-xs text-teal-950 dark:text-teal-200 space-y-1">
                    <span className="font-bold flex items-center gap-1 text-teal-800 dark:text-teal-300 uppercase tracking-wide text-[10px]">
                      <AlertTriangle className="w-3.5 h-3.5" /> Hậu quả thực tế (Consequence):
                    </span>
                    <p className="leading-relaxed">{chosenOpt.consequence}</p>
                  </div>
                </div>
              )}

              {/* TERMINAL Outcome Card */}
              {isTerminal && (
                <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                      Kết quả cuối cùng đạt được:
                    </span>
                    <StatusBadge status={node.outcomeLabel} type="outcome" />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {node.content}
                  </p>
                </div>
              )}

              {/* REASONING SECTION (Mandatory for Pivotal Decisions) */}
              {node.isPivotal && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Bản lập luận của sinh viên (Student Reasoning)
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Giải thích tại sao bạn chọn phương án này, vì sao bác bỏ các lựa chọn khác và số liệu nào bạn đã căn cứ
                      </p>
                    </div>
                  </div>

                  {reasoning ? (
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                      {reasoning.content}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <textarea
                        rows={3}
                        value={reasoningDrafts[node.id] || ''}
                        onChange={(e) =>
                          setReasoningDrafts({ ...reasoningDrafts, [node.id]: e.target.value })
                        }
                        placeholder="Trình bày lập luận của bạn: Lý do đưa ra quyết định, phân tích rủi ro và kiến thức áp dụng..."
                        className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs leading-relaxed focus:ring-2 focus:ring-brand-blue-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveReasoning(node.id)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-blue-600 hover:bg-brand-blue-700 shadow-sm"
                      >
                        Lưu bản lập luận
                      </button>
                    </div>
                  )}

                  {/* AI CHALLENGE SUPPORT SECTION (MAX 2 ROUNDS) */}
                  {reasoning && (
                    <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bot className="w-4 h-4 text-purple-600" />
                          <span className="text-xs font-bold text-purple-900 dark:text-purple-200">
                            AI Challenge Support (Phản biện sâu sắc)
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-purple-600 font-bold">
                          {reasoning.challengeRounds.length}/2 Vòng
                        </span>
                      </div>

                      <p className="text-[10px] text-slate-500 italic">
                        * Chú thích: AI chỉ đặt câu hỏi để bạn suy nghĩ sâu hơn về các góc khuất của quyết định, không chấm điểm và không kết luận đúng/sai.
                      </p>

                      {/* Challenge Rounds Q&A history */}
                      <div className="space-y-3">
                        {reasoning.challengeRounds.map((round) => (
                          <div
                            key={round.id}
                            className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 space-y-2 text-xs"
                          >
                            <span className="font-bold text-purple-700 dark:text-purple-300 block">
                              Vòng {round.roundNo}: {round.aiQuestion}
                            </span>

                            {round.studentAnswer ? (
                              <div className="pl-3 border-l-2 border-brand-teal-500 text-slate-600 dark:text-slate-300">
                                <strong>Trả lời:</strong> {round.studentAnswer}
                              </div>
                            ) : (
                              <div className="space-y-2 pt-2">
                                <textarea
                                  rows={2}
                                  value={
                                    activeChallengeAnswers[`${reasoning.id}-${round.roundNo}`] || ''
                                  }
                                  onChange={(e) =>
                                    setActiveChallengeAnswers({
                                      ...activeChallengeAnswers,
                                      [`${reasoning.id}-${round.roundNo}`]: e.target.value,
                                    })
                                  }
                                  placeholder="Nhập câu trả lời phản biện của bạn..."
                                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleAnswerChallenge(reasoning.id, round.roundNo)}
                                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-purple-600 hover:bg-purple-700"
                                >
                                  Gửi câu trả lời Vòng {round.roundNo}
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Request AI Question Button (Locked after 2 rounds) */}
                      {reasoning.challengeRounds.length < 2 ? (
                        <button
                          type="button"
                          disabled={isAiLoading[reasoning.id]}
                          onClick={() =>
                            handleRequestAiChallenge(reasoning.id, reasoning.challengeRounds.length)
                          }
                          className="px-4 py-2 rounded-xl text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/60 hover:bg-purple-200 flex items-center gap-1.5 transition-all"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          {isAiLoading[reasoning.id]
                            ? 'AI đang phân tích...'
                            : `Nhận câu hỏi thách thức từ AI (Vòng ${reasoning.challengeRounds.length + 1}/2)`}
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                          <Lock className="w-3.5 h-3.5" /> Đã hoàn tất tối đa 2 vòng phản biện. Nút đã khóa theo chuẩn nghiệp vụ.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Continue to Reflection Bottom CTA */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-blue-900 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold">Bạn đã sẵn sàng đúc kết bài học?</h4>
          <p className="text-xs text-slate-300 mt-0.5">
            Bước cuối cùng: Viết suy ngẫm (Reflection) về quyết định then chốt nhất và điều bạn sẽ thay đổi nếu làm lại.
          </p>
        </div>
        <Link
          href={`/student/attempts/${attempt.id}/reflection`}
          className="px-6 py-3 rounded-xl font-bold text-xs bg-white text-brand-blue-900 hover:bg-slate-100 shadow-md flex items-center gap-2 shrink-0 transition-all"
        >
          Sang bước Suy ngẫm (Reflection)
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

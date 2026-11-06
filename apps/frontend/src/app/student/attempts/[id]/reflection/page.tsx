'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FileCheck2,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Award,
  Sparkles,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { useMockStore } from '@/mocks/mock-store';
import { AttemptStatus } from '@edubranch/shared';
import { toast } from 'sonner';

export default function StudentReflectionPage() {
  const params = useParams();
  const router = useRouter();
  const attemptId = params.id as string;
  const { attempts, cases, submitReflection, startAttempt, currentUser } = useMockStore();

  const attempt = attempts.find((a) => a.id === attemptId) || attempts[0];
  const targetCase = cases.find((c) => c.id === attempt?.caseId) || cases[0];

  const [pivotalStep, setPivotalStep] = useState(
    attempt.reflection?.pivotalDecisionStep || ''
  );
  const [whatToChange, setWhatToChange] = useState(
    attempt.reflection?.whatToChangeIfRetrying || ''
  );
  const [keyTakeaways, setKeyTakeaways] = useState(
    attempt.reflection?.keyTakeaways || ''
  );
  const [submitted, setSubmitted] = useState(!!attempt.reflection);

  const handleSubmitReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pivotalStep.trim() || !whatToChange.trim() || !keyTakeaways.trim()) {
      toast.error('Vui lòng điền đầy đủ cả 3 câu hỏi suy ngẫm');
      return;
    }

    submitReflection({
      id: `ref-${Date.now()}`,
      attemptId: attempt.id,
      pivotalDecisionStep: pivotalStep,
      whatToChangeIfRetrying: whatToChange,
      keyTakeaways,
      createdAt: new Date().toISOString(),
    });

    setSubmitted(true);
    toast.success('🎉 Đã hoàn tất bài nộp và gửi về cho Giảng viên xem xét!');
  };

  const handleRetryNewAttempt = () => {
    const newAtt = startAttempt(targetCase.id, currentUser?.id || 'student-1');
    toast.info(`Bắt đầu lượt làm bài mới: Attempt #${newAtt.attemptNo}`);
    router.push(`/student/cases/${targetCase.id}/play?attemptId=${newAtt.id}`);
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <PageHeader
        title="Suy ngẫm & Đúc kết Bài học (Reflection)"
        description={`Học phần: ${targetCase.courseName} • Lần làm #${attempt.attemptNo}`}
        breadcrumbs={[
          { label: 'Bàn học', href: '/student' },
          { label: 'Journey Review', href: `/student/attempts/${attempt.id}/review` },
          { label: 'Suy ngẫm (Reflection)' },
        ]}
      />

      {submitted ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 sm:p-10 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Bạn đã hoàn thành trọn vẹn Lần làm bài #{attempt.attemptNo}!
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Toàn bộ đường đi, bản lập luận và phần suy ngẫm của bạn đã được ghi nhận. Giảng viên phụ trách sẽ xem xét và phản hồi sớm.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-3">
            <div>
              <span className="text-slate-400 font-semibold block">Bước then chốt nhất:</span>
              <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">{pivotalStep}</p>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block">Điều bạn sẽ đổi nếu làm lại:</span>
              <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">{whatToChange}</p>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block">Bài học rút ra:</span>
              <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">{keyTakeaways}</p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleRetryNewAttempt}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-blue-600 to-brand-teal-600 hover:opacity-95 shadow-md flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Làm lại lần nữa (New Attempt #{attempt.attemptNo + 1})
            </button>
            <Link
              href="/student"
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-xs text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 flex items-center justify-center gap-2"
            >
              Về Bàn học của tôi
            </Link>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmitReflection}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6"
        >
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              1. Quyết định then chốt nhất trong toàn bộ tình huống đối với bạn là bước nào? *
            </label>
            <textarea
              rows={3}
              value={pivotalStep}
              onChange={(e) => setPivotalStep(e.target.value)}
              placeholder="Ví dụ: Tình huống 1 khi đối mặt với 85k req/s, quyết định bật hàng đợi ảo thay vì auto-scale DB..."
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              2. Nếu được làm lại tình huống này, bạn sẽ thay đổi hoặc chuẩn bị điều gì khác biệt? *
            </label>
            <textarea
              rows={3}
              value={whatToChange}
              onChange={(e) => setWhatToChange(e.target.value)}
              placeholder="Ví dụ: Tôi sẽ chuẩn bị trước kịch bản Degraded Mode để vẫn hỗ trợ khách hàng dùng ví điện tử..."
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              3. Bài học cốt lõi về mặt học thuật hoặc thực tiễn bạn đúc kết được là gì? *
            </label>
            <textarea
              rows={3}
              value={keyTakeaways}
              onChange={(e) => setKeyTakeaways(e.target.value)}
              placeholder="Ví dụ: Hiểu rõ sự đánh đổi giữa tính sẵn sàng và tính nhất quán (CAP theorem) trong hệ thống phân tán..."
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-blue-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <Link
              href={`/student/attempts/${attempt.id}/review`}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Quay lại Journey Review
            </Link>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-blue-600 to-brand-teal-600 hover:opacity-95 shadow-md flex items-center gap-2"
            >
              <FileCheck2 className="w-4 h-4" /> Hoàn tất bài nộp
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

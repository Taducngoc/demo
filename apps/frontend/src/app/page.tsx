'use client';

import React from 'react';
import Link from 'next/link';
import {
  GitBranch,
  FileCheck2,
  Sparkles,
  Bot,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  BookOpen,
  Award,
  Layers,
  GraduationCap,
  Users,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-blue-700 to-brand-teal-500 flex items-center justify-center text-white shadow-md">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-brand-blue-700 to-brand-teal-600 bg-clip-text text-transparent">
                EduBranch AI
              </span>
              <span className="block text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
                Case-Based Learning Platform
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-blue-600 dark:hover:text-brand-blue-400 transition-colors"
            >
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-semibold text-white bg-brand-blue-600 hover:bg-brand-blue-700 rounded-xl shadow-sm transition-all"
            >
              Đăng ký tài khoản
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-blue-50 dark:bg-brand-blue-950/60 border border-brand-blue-200 dark:border-brand-blue-800 text-brand-blue-700 dark:text-brand-blue-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Phương pháp học tập dựa trên tình huống đa nhánh (Branching Scenarios)
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
            Rèn luyện tư duy ra quyết định trong bối cảnh thực tế cùng{' '}
            <span className="bg-gradient-to-r from-brand-blue-600 to-brand-teal-500 bg-clip-text text-transparent">
              EduBranch AI
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal">
            Trải nghiệm các tình huống khủng hoảng phức tạp, tự tay lựa chọn quyết định, khám phá hậu quả trong Journey Review và đón nhận câu hỏi phản biện sâu sắc từ AI.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-brand-blue-600 to-brand-teal-600 hover:opacity-95 shadow-lg shadow-brand-blue-500/25 transition-all flex items-center justify-center gap-2"
            >
              Bắt đầu ngay hôm nay
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all"
            >
              Vào học phần của bạn
            </Link>
          </div>

          {/* Educational Ethics Guarantee */}
          <div className="mt-12 max-w-xl mx-auto p-4 rounded-xl bg-teal-50/80 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/50 text-xs text-teal-800 dark:text-teal-200 flex items-center gap-3 text-left">
            <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" />
            <span>
              <strong>Cam kết sư phạm:</strong> AI chỉ đóng vai trò trợ lý sinh bản nháp cho giảng viên và đặt câu hỏi gợi mở cho sinh viên; tuyệt đối không chấm điểm, không xếp hạng và không phán xét đúng/sai học thuật.
            </span>
          </div>
        </div>
      </section>

      {/* Two Study Modes */}
      <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              2 Chế độ học tập đáp ứng đa dạng mục tiêu đào tạo
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Thiết kế linh hoạt dành cho các học phần kỹ thuật, tài chính, luật, y tế và quản trị kinh doanh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mode 1: Branching Study */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-8 bg-slate-50/50 dark:bg-slate-950/40 relative overflow-hidden flex flex-col justify-between hover:border-brand-blue-400 transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-brand-blue-100 dark:bg-brand-blue-950 text-brand-blue-600 flex items-center justify-center mb-5">
                  <GitBranch className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-brand-blue-600 uppercase tracking-wider block mb-1">
                  Chế độ cốt lõi
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  Branching Study (Học qua cây phân nhánh)
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                  Sinh viên trải qua chuỗi tình huống liên tục mà không hề bị làm gián đoạn bởi các câu hỏi chấm điểm. Mọi hậu quả được giữ kín cho tới khi chạm đến kết quả cuối cùng.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue-500" />
                    Không biết trước hậu quả giữa các quyết định
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue-500" />
                    Xem lại toàn bộ đường đi trong <strong>Journey Review</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue-500" />
                    Viết lập luận cho các <strong>Quyết định then chốt (Pivotal)</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue-500" />
                    Đón nhận thử thách phản biện AI (Tối đa 2 vòng)
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Phù hợp: Ứng cứu sự cố, Y khoa, Khủng hoảng</span>
                <Link
                  href="/login"
                  className="text-xs font-bold text-brand-blue-600 dark:text-brand-blue-400 hover:underline flex items-center gap-1"
                >
                  Khám phá <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Mode 2: Review Study */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-8 bg-slate-50/50 dark:bg-slate-950/40 relative overflow-hidden flex flex-col justify-between hover:border-brand-teal-400 transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-brand-teal-100 dark:bg-brand-teal-950 text-brand-teal-600 flex items-center justify-center mb-5">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-brand-teal-600 uppercase tracking-wider block mb-1">
                  Chế độ tinh gọn
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  Review Study (Phân tích & Đề xuất giải pháp)
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                  Mô hình giải quyết tình huống học thuật cổ điển: Sinh viên được cung cấp Bối cảnh (Context), Dữ liệu số liệu (Data) và Vấn đề (Problem), sau đó đề xuất giải pháp kèm lập luận.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-teal-500" />
                    Không cần cây phân nhánh phức tạp
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-teal-500" />
                    Chấp nhận nhiều hướng giải quyết hợp lý khác nhau
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-teal-500" />
                    Giảng viên trực tiếp đưa nhận xét chất lượng cao
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-teal-500" />
                    Sinh viên suy ngẫm và lưu giữ các bài học cốt lõi
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Phù hợp: Luật, Chiến lược kinh doanh, FinOps</span>
                <Link
                  href="/login"
                  className="text-xs font-bold text-brand-teal-600 dark:text-brand-teal-400 hover:underline flex items-center gap-1"
                >
                  Khám phá <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5-Step Continuous Workflow */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Vòng lặp học tập chuẩn mực sư phạm
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Quy trình chặt chẽ bảo đảm chất lượng học thuật và trải nghiệm sâu sắc cho sinh viên.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-3xl font-black text-brand-blue-600/30">01</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-2 mb-1">
                AI Sinh Case Draft
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Giảng viên upload tài liệu môn học, AI hỗ trợ sinh cấu trúc cây và dữ liệu ban đầu.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-3xl font-black text-brand-blue-600/30">02</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-2 mb-1">
                Giảng viên Duyệt & Xuất bản
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Giảng viên tinh chỉnh tình huống, kiểm tra thuật toán cây và chỉ định deadline cho lớp học.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-3xl font-black text-brand-blue-600/30">03</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-2 mb-1">
                Sinh viên Đi hết Hành trình
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tập trung tối đa vào bối cảnh, đưa ra lựa chọn liên tục cho tới khi chạm đến kết quả cuối.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-3xl font-black text-brand-blue-600/30">04</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-2 mb-1">
                Journey Review & AI Challenge
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Mở khóa sơ đồ đường đi, xem hậu quả, viết lập luận và trả lời câu hỏi thách thức từ AI.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-3xl font-black text-brand-blue-600/30">05</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-2 mb-1">
                Reflection & New Attempt
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Đúc kết bài học cốt lõi, bắt đầu lần thử mới mà không bị áp lực xếp hạng hay trừ điểm.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2024 - 2026 EduBranch AI. Nền tảng học tập dựa trên tình huống dành cho đại học.</p>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:underline">Đăng nhập</Link>
            <Link href="/register" className="hover:underline">Đăng ký</Link>
            <Link href="/admin/login" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              Admin Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

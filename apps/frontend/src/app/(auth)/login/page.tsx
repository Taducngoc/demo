'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@edubranch/shared';
import { z } from 'zod';
import { GitBranch, Lock, Mail, AlertTriangle, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useMockStore } from '@/mocks/mock-store';
import { UserRole, UserStatus } from '@edubranch/shared';
import { toast } from 'sonner';

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPendingParam = searchParams.get('pending') === 'true';
  const registeredParam = searchParams.get('registered') === 'true';
  const { users, setCurrentUser } = useMockStore();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'an.nguyen@university.edu.vn',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    setErrorMsg(null);
    const user = users.find(
      (u) => u.email.toLowerCase() === data.email.toLowerCase()
    );

    if (!user) {
      setErrorMsg('Không tìm thấy tài khoản với email này.');
      return;
    }

    if (user.role === UserRole.ADMIN) {
      setErrorMsg('Tài khoản Quản trị viên (Admin) không thể đăng nhập tại cổng thông tin này.');
      return;
    }

    if (user.status === UserStatus.LOCKED) {
      setErrorMsg('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Quản trị viên.');
      return;
    }

    if (user.status === UserStatus.PENDING) {
      setErrorMsg(
        'Tài khoản Giảng viên của bạn đang ở trạng thái CHỜ DUYỆT (PENDING). Vui lòng đợi Ban Quản trị phê duyệt để truy cập hệ thống.'
      );
      toast.warning('Tài khoản giảng viên đang chờ Admin phê duyệt');
      return;
    }

    if (user.status === UserStatus.REJECTED) {
      setErrorMsg(
        `Tài khoản đã bị từ chối phê duyệt. Lý do: ${user.rejectionReason || 'Không đủ điều kiện xác thực'}`
      );
      return;
    }

    setCurrentUser(user);
    toast.success(`Chào mừng trở lại, ${user.fullName}!`);

    if (user.role === UserRole.LECTURER) {
      router.push('/lecturer');
    } else {
      router.push('/student');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-blue-700 to-brand-teal-500 flex items-center justify-center text-white shadow-md">
            <GitBranch className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl text-slate-900 dark:text-white">
            EduBranch AI
          </span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Đăng nhập vào hệ thống
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Dành cho Giảng viên và Sinh viên
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-sm border border-slate-200 dark:border-slate-800 sm:rounded-2xl sm:px-10">
          {registeredParam && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Đăng ký thành công! Bạn có thể đăng nhập ngay hoặc chờ duyệt nếu là Giảng viên.</span>
            </div>
          )}

          {isPendingParam && (
            <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Tài khoản Giảng viên của bạn hiện đang ở trạng thái <strong>CHỜ DUYỆT (PENDING)</strong>. Ban Quản trị sẽ kiểm tra và kích hoạt trong vòng 24 giờ.
              </span>
            </div>
          )}

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Địa chỉ Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  {...register('email')}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
                  placeholder="name@university.edu.vn"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-[11px] text-rose-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Mật khẩu
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-brand-blue-600 dark:text-brand-blue-400 hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  {...register('password')}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-[11px] text-rose-500">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-sm text-white bg-brand-blue-600 hover:bg-brand-blue-700 shadow-sm transition-all flex items-center justify-center gap-2"
            >
              Đăng nhập
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Mock Switch helper for reviewer convenience */}
          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 block mb-2 text-center uppercase tracking-wider">
              Hoặc chọn tài khoản mẫu để thử nghiệm:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  const u = users.find((x) => x.id === 'lecturer-1');
                  if (u) {
                    setCurrentUser(u);
                    toast.success('Đã đăng nhập: Giảng viên TS. Nguyễn Văn An');
                    router.push('/lecturer');
                  }
                }}
                className="p-2 text-left rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/30 hover:bg-blue-100"
              >
                <span className="font-bold text-blue-900 dark:text-blue-200 block truncate">
                  TS. Nguyễn Văn An
                </span>
                <span className="text-[10px] text-blue-600">Giảng viên (Active)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const u = users.find((x) => x.id === 'student-1');
                  if (u) {
                    setCurrentUser(u);
                    toast.success('Đã đăng nhập: Sinh viên Lê Minh Khôi');
                    router.push('/student');
                  }
                }}
                className="p-2 text-left rounded-lg border border-teal-200 dark:border-teal-900 bg-teal-50/50 dark:bg-teal-950/30 hover:bg-teal-100"
              >
                <span className="font-bold text-teal-900 dark:text-teal-200 block truncate">
                  Lê Minh Khôi
                </span>
                <span className="text-[10px] text-teal-600">Sinh viên</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setErrorMsg(
                    'Tài khoản Giảng viên của bạn đang ở trạng thái CHỜ DUYỆT (PENDING). Vui lòng đợi Ban Quản trị phê duyệt để truy cập hệ thống.'
                  );
                }}
                className="col-span-2 p-2 text-left rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/30 hover:bg-amber-100"
              >
                <span className="font-bold text-amber-900 dark:text-amber-200 block">
                  ThS. Trần Thị Mai (Thử tài khoản Giảng viên PENDING)
                </span>
                <span className="text-[10px] text-amber-600">
                  Nhấp để thử nghiệm quy tắc từ chối truy cập khi chưa duyệt
                </span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            Chưa có tài khoản?{' '}
            <Link
              href="/register"
              className="font-bold text-brand-blue-600 dark:text-brand-blue-400 hover:underline"
            >
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Đang tải...</div>}>
      <LoginForm />
    </Suspense>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, UserRole, UserStatus } from '@edubranch/shared';
import { z } from 'zod';
import {
  GitBranch,
  User as UserIcon,
  Mail,
  Lock,
  GraduationCap,
  Building2,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { useMockStore } from '@/mocks/mock-store';
import { toast } from 'sonner';

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { users } = useMockStore();
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.STUDENT);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: UserRole.STUDENT,
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      studentCode: '',
      department: '',
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    setServerError(null);

    // Business rule: POST /auth/register MUST reject if role = ADMIN
    if ((data.role as any) === 'ADMIN') {
      setServerError('Lỗi bảo mật nghiêm trọng: Không được phép đăng ký vai trò Quản trị viên (Admin).');
      return;
    }

    // Check duplicate email
    if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      setServerError('Email này đã được sử dụng trên hệ thống. Vui lòng đăng nhập.');
      return;
    }

    const newUser = {
      id: `user-${Date.now()}`,
      email: data.email,
      fullName: data.fullName,
      role: data.role,
      status: data.role === UserRole.LECTURER ? UserStatus.PENDING : UserStatus.ACTIVE,
      studentCode: data.role === UserRole.STUDENT ? data.studentCode : undefined,
      department: data.role === UserRole.LECTURER ? data.department : undefined,
      createdAt: new Date().toISOString(),
    };

    useMockStore.setState((state) => ({
      users: [...state.users, newUser],
    }));

    if (data.role === UserRole.LECTURER) {
      toast.info(
        'Đăng ký tài khoản Giảng viên thành công! Tài khoản của bạn đang ở trạng thái PENDING chờ Admin phê duyệt.'
      );
      router.push('/login?pending=true');
    } else {
      toast.success('Đăng ký tài khoản Sinh viên thành công! Mời bạn đăng nhập.');
      router.push('/login?registered=true');
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
          Đăng ký tài khoản mới
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Chọn vai trò Giảng viên hoặc Sinh viên để tiếp tục
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-sm border border-slate-200 dark:border-slate-800 sm:rounded-2xl sm:px-10">
          {serverError && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Role Selection Tabs - Strictly STUDENT and LECTURER only */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Tôi là:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole(UserRole.STUDENT);
                    setValue('role', UserRole.STUDENT);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                    selectedRole === UserRole.STUDENT
                      ? 'border-brand-teal-500 bg-brand-teal-50/50 dark:bg-brand-teal-950/30 text-brand-teal-900 dark:text-brand-teal-200 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <GraduationCap className="w-5 h-5 text-brand-teal-600" />
                  <div>
                    <span className="text-xs font-bold block">Sinh viên</span>
                    <span className="text-[10px] text-slate-400">Học & phản biện tình huống</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole(UserRole.LECTURER);
                    setValue('role', UserRole.LECTURER);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                    selectedRole === UserRole.LECTURER
                      ? 'border-brand-blue-500 bg-brand-blue-50/50 dark:bg-brand-blue-950/30 text-brand-blue-900 dark:text-brand-blue-200 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-brand-blue-600" />
                  <div>
                    <span className="text-xs font-bold block">Giảng viên</span>
                    <span className="text-[10px] text-slate-400">Tạo case & duyệt học thuật</span>
                  </div>
                </button>
              </div>
            </div>

            {selectedRole === UserRole.LECTURER && (
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Lưu ý: Để đảm bảo tính xác thực học thuật, tài khoản Giảng viên sẽ ở trạng thái PENDING cho tới khi được Admin duyệt.
                </span>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Họ và tên
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  {...register('fullName')}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
                  placeholder="Nguyễn Văn A"
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-[11px] text-rose-500">{errors.fullName.message}</p>
              )}
            </div>

            {/* Role specific input */}
            {selectedRole === UserRole.STUDENT ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mã số Sinh viên (MSSV)
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    {...register('studentCode')}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
                    placeholder="Ví dụ: 21020451"
                  />
                </div>
                {errors.studentCode && (
                  <p className="mt-1 text-[11px] text-rose-500">{errors.studentCode.message}</p>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Khoa / Đơn vị công tác
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    {...register('department')}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
                    placeholder="Ví dụ: Khoa Công nghệ Thông tin"
                  />
                </div>
                {errors.department && (
                  <p className="mt-1 text-[11px] text-rose-500">{errors.department.message}</p>
                )}
              </div>
            )}

            {/* Email */}
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

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  {...register('password')}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
                  placeholder="Tối thiểu 6 ký tự"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-[11px] text-rose-500">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Xác nhận Mật khẩu
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  {...register('confirmPassword')}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
                  placeholder="Nhập lại mật khẩu"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-[11px] text-rose-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-blue-600 to-brand-teal-600 hover:opacity-95 shadow-sm transition-all flex items-center justify-center gap-2 mt-2"
            >
              Hoàn tất đăng ký
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Đã có tài khoản?{' '}
            <Link
              href="/login"
              className="font-bold text-brand-blue-600 dark:text-brand-blue-400 hover:underline"
            >
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

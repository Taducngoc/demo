'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminLoginSchema, UserRole } from '@edubranch/shared';
import { z } from 'zod';
import { Shield, Lock, User, AlertTriangle, KeyRound } from 'lucide-react';
import { useMockStore } from '@/mocks/mock-store';
import { toast } from 'sonner';

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const { users, setCurrentUser } = useMockStore();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      username: 'admin',
      password: '',
    },
  });

  const onSubmit = (data: AdminLoginFormValues) => {
    setErrorMsg(null);

    // Accept username 'admin' or email 'admin@university.edu.vn'
    const adminUser = users.find(
      (u) =>
        u.role === UserRole.ADMIN &&
        (u.email.toLowerCase() === data.username.toLowerCase() ||
          data.username.toLowerCase() === 'admin')
    );

    if (!adminUser) {
      setErrorMsg('Tên đăng nhập hoặc mật khẩu quản trị viên không chính xác.');
      return;
    }

    setCurrentUser(adminUser);
    toast.success('Đăng nhập Quản trị viên (Admin) thành công!');
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 select-none">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-900 to-indigo-600 flex items-center justify-center text-white mx-auto mb-4 shadow-xl shadow-purple-950/50 border border-purple-500/30">
          <Shield className="w-7 h-7 text-purple-200" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-white">
          EduBranch Admin Portal
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Cổng xác thực nội bộ dành riêng cho Ban Quản trị Hệ thống
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900/90 backdrop-blur-md py-8 px-6 shadow-2xl rounded-2xl border border-slate-800 sm:px-10">
          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="mb-5 p-3 rounded-lg bg-indigo-950/40 border border-indigo-900/60 text-[11px] text-indigo-300 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>
              Mật khẩu Admin được khởi tạo an toàn từ biến môi trường máy chủ (Seed).
            </span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tên đăng nhập Admin
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  {...register('username')}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="admin"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-[11px] text-rose-400">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Mật khẩu Quản trị
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  {...register('password')}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="••••••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-[11px] text-rose-400">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-2.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 shadow-lg shadow-purple-900/30 transition-all flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Xác thực Quản trị
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <span className="text-[10px] text-slate-500">
              IP truy cập được ghi nhật ký bảo mật (AuditLog). Hệ thống giám sát 24/7.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

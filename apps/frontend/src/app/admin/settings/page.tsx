'use client';

import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Key,
  Mail,
  Server,
  Lock,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [adminPassword, setAdminPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localhostOnly, setLocalhostOnly] = useState(true);
  const [smtpHost, setSmtpHost] = useState('smtp.university.edu.vn');
  const [senderEmail, setSenderEmail] = useState('no-reply-edubranch@university.edu.vn');

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPassword || adminPassword.length < 8) {
      toast.error('Mật khẩu quản trị viên mới phải từ 8 ký tự trở lên');
      return;
    }
    if (adminPassword !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }
    toast.success('Đã cập nhật mật khẩu Admin thành công!');
    setAdminPassword('');
    setConfirmPassword('');
  };

  const handleSaveSystemConfig = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Đã lưu cấu hình hệ thống & thông báo email!');
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <PageHeader
        title="Cài đặt Hệ thống Quản trị"
        description="Bảo mật tài khoản Admin, cấu hình máy chủ và tích hợp cổng gửi thư"
      />

      {/* Change Password Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-800">
          <div className="p-2.5 rounded-lg bg-purple-950/60 text-purple-400 border border-purple-800/50">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Đổi Mật khẩu Quản trị viên (Admin)</h3>
            <p className="text-xs text-slate-400">Khuyến cáo thay đổi mật khẩu định kỳ 90 ngày</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Mật khẩu mới
            </label>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full p-2.5 rounded-lg border border-slate-700 bg-slate-800 text-xs text-white focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full p-2.5 rounded-lg border border-slate-700 bg-slate-800 text-xs text-white focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition-all"
          >
            Cập nhật Mật khẩu Admin
          </button>
        </form>
      </div>

      {/* Server & Security Configuration */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-800">
          <div className="p-2.5 rounded-lg bg-indigo-950/60 text-indigo-400 border border-indigo-800/50">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Bảo vệ Cổng kết nối & Email Thông báo</h3>
            <p className="text-xs text-slate-400">Cấu hình giới hạn truy cập IP và máy chủ thông báo</p>
          </div>
        </div>

        <form onSubmit={handleSaveSystemConfig} className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">
                ADMIN_LOCALHOST_ONLY (Giới hạn truy cập cục bộ)
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Khi bật, toàn bộ các API `/admin/*` chỉ chấp nhận request từ địa chỉ IP 127.0.0.1 hoặc ::1.
              </p>
            </div>
            <input
              type="checkbox"
              checked={localhostOnly}
              onChange={(e) => setLocalhostOnly(e.target.checked)}
              className="w-4 h-4 text-purple-600 rounded bg-slate-800 border-slate-700 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Máy chủ gửi thư (SMTP Host)
              </label>
              <input
                type="text"
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-700 bg-slate-800 text-xs text-white focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email gửi thông báo (Sender Email)
              </label>
              <input
                type="text"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-700 bg-slate-800 text-xs text-white focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Lưu cấu hình hệ thống
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, File, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  onUpload: (file: { name: string; size: number }) => void;
  allowedTypes?: string[];
  maxSizeMB?: number;
}

export function FileUploader({
  onUpload,
  allowedTypes = ['.pdf', '.docx'],
  maxSizeMB = 20,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState<{ name: string; progress: number } | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = (file: File) => {
    setError(null);
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(ext)) {
      setError(`Định dạng không được hỗ trợ. Chỉ chấp nhận các file: ${allowedTypes.join(', ')}`);
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Kích thước file vượt quá giới hạn cho phép (${maxSizeMB}MB).`);
      return;
    }

    // Simulate upload progress
    setUploadingFile({ name: file.name, progress: 15 });
    const interval = setInterval(() => {
      setUploadingFile((prev) => {
        if (!prev) return null;
        if (prev.progress >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            onUpload({ name: file.name, size: file.size });
            setUploadingFile(null);
          }, 300);
          return { ...prev, progress: 100 };
        }
        return { ...prev, progress: prev.progress + 25 };
      });
    }, 200);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center',
          isDragging
            ? 'border-brand-blue-500 bg-brand-blue-50/50 dark:bg-brand-blue-950/20'
            : 'border-slate-300 dark:border-slate-700 hover:border-brand-blue-400 bg-slate-50/50 dark:bg-slate-900/30'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={allowedTypes.join(',')}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileProcess(e.target.files[0]);
            }
          }}
        />

        <div className="w-12 h-12 rounded-full bg-brand-blue-100 dark:bg-brand-blue-950/60 text-brand-blue-600 dark:text-brand-blue-400 flex items-center justify-center mb-3">
          <UploadCloud className="w-6 h-6" />
        </div>

        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          Kéo thả tài liệu vào đây hoặc <span className="text-brand-blue-600 underline">duyệt từ máy</span>
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Hỗ trợ định dạng {allowedTypes.join(', ')} (Tối đa {maxSizeMB}MB)
        </p>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 p-3 rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {uploadingFile && (
        <div className="mt-3 p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            <span className="truncate max-w-[80%]">{uploadingFile.name}</span>
            <span>{uploadingFile.progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-blue-600 transition-all duration-200"
              style={{ width: `${uploadingFile.progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

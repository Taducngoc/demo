'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  GitBranch,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Send,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Check,
  FileCheck2,
  Layers,
  HelpCircle,
  Flag,
  Calendar,
  X,
  FileText,
  Workflow,
  Share2,
} from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useMockStore } from '@/mocks/mock-store';
import {
  Case,
  CaseNode,
  CaseOption,
  NodeType,
  OutcomeLabel,
  CaseStatus,
  CaseMode,
  validateCaseTree,
  TreeValidationError,
  TreeValidationWarning,
} from '@edubranch/shared';
import { toast } from 'sonner';

export default function LecturerCaseEditorPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params.id as string;
  const { cases, updateCase, updateNode, addNode, deleteNode, publishCase } = useMockStore();

  const currentCase = cases.find((c) => c.id === caseId) || cases[0];
  const [selectedNodeId, setSelectedNodeId] = useState<string>(
    currentCase.nodes[0]?.id || ''
  );
  const [rightTab, setRightTab] = useState<'tree' | 'validation'>('tree');
  const [autosaveStatus, setAutosaveStatus] = useState<'saved' | 'saving'>('saved');

  // Publish Dialog State
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishDueDate, setPublishDueDate] = useState(
    currentCase.dueDate ? currentCase.dueDate.slice(0, 16) : '2026-11-30T23:59'
  );
  const [notifyEmail, setNotifyEmail] = useState(true);

  // Selected Node
  const selectedNode = currentCase.nodes.find((n) => n.id === selectedNodeId);

  // Tree Validation in Real-time
  const validationResult = useMemo(() => {
    if (currentCase.mode === CaseMode.REVIEW) {
      return { isValid: true, errors: [], warnings: [] };
    }
    return validateCaseTree(currentCase.nodes, currentCase.rootNodeId);
  }, [currentCase.nodes, currentCase.rootNodeId, currentCase.mode]);

  const handleUpdateCurrentNode = (fields: Partial<CaseNode>) => {
    if (!selectedNode) return;
    setAutosaveStatus('saving');
    const updated = { ...selectedNode, ...fields, isLecturerEdited: true };
    updateNode(currentCase.id, updated);
    setTimeout(() => setAutosaveStatus('saved'), 400);
  };

  const handleAddOption = () => {
    if (!selectedNode) return;
    const newOption: CaseOption = {
      id: `opt-${Date.now()}`,
      nodeId: selectedNode.id,
      label: `Phương án mới ${selectedNode.options.length + 1}`,
      description: 'Mô tả chi tiết hành động của phương án này...',
      nextNodeId: currentCase.nodes.find((n) => n.id !== selectedNode.id)?.id || '',
      consequence: 'Mô tả hậu quả thực tế (chỉ được mở khóa trong Journey Review)...',
    };
    handleUpdateCurrentNode({
      options: [...selectedNode.options, newOption],
    });
    toast.success('Đã thêm phương án lựa chọn mới');
  };

  const handleUpdateOption = (optionId: string, fields: Partial<CaseOption>) => {
    if (!selectedNode) return;
    setAutosaveStatus('saving');
    const updatedOptions = selectedNode.options.map((opt) =>
      opt.id === optionId ? { ...opt, ...fields } : opt
    );
    handleUpdateCurrentNode({ options: updatedOptions });
    setTimeout(() => setAutosaveStatus('saved'), 400);
  };

  const handleDeleteOption = (optionId: string) => {
    if (!selectedNode) return;
    const updatedOptions = selectedNode.options.filter((opt) => opt.id !== optionId);
    handleUpdateCurrentNode({ options: updatedOptions });
    toast.info('Đã xóa phương án');
  };

  const handleAddNewNode = (type: NodeType) => {
    const isTerminal = type === NodeType.TERMINAL;
    const newNode: CaseNode = {
      id: `node-${Date.now()}`,
      caseId: currentCase.id,
      type,
      title: isTerminal ? 'Kết quả mới: [Mô tả]' : `Tình huống ${currentCase.nodes.length + 1}`,
      content: isTerminal
        ? 'Mô tả tổng kết hành trình khi sinh viên đi tới kết quả này...'
        : 'Nội dung tình huống tiếp theo...',
      promptQuestion: isTerminal ? undefined : 'Câu hỏi gợi ý lựa chọn hành động?',
      isPivotal: false,
      outcomeLabel: isTerminal ? OutcomeLabel.ACCEPTABLE : undefined,
      options: [],
      relatedKnowledge: isTerminal ? ['Kiến thức vận dụng'] : undefined,
    };
    addNode(currentCase.id, newNode);
    setSelectedNodeId(newNode.id);
    toast.success(`Đã thêm ${isTerminal ? 'Terminal Node' : 'Situation Node'} mới`);
  };

  const handleDeleteNode = (nodeId: string) => {
    if (currentCase.nodes.length <= 1) {
      toast.error('Kịch bản phải có tối thiểu 1 node');
      return;
    }
    deleteNode(currentCase.id, nodeId);
    const remaining = currentCase.nodes.filter((n) => n.id !== nodeId);
    setSelectedNodeId(remaining[0]?.id || '');
    toast.info('Đã xóa node khỏi kịch bản');
  };

  const handlePublish = () => {
    if (!validationResult.isValid) {
      toast.error('Không thể xuất bản: Vui lòng sửa các lỗi nghiêm trọng trong cây trước.');
      return;
    }
    publishCase(currentCase.id, publishDueDate);
    setShowPublishModal(false);
    toast.success('🎉 Đã phê duyệt và xuất bản Case Study thành công!');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] -m-4 sm:-m-8 bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Top Header Bar */}
      <header className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/lecturer/cases"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-sm">
                {currentCase.title}
              </h2>
              <StatusBadge status={currentCase.status} type="caseStatus" />
            </div>
            <span className="text-[10px] text-slate-400">
              Khóa: {currentCase.courseName} • Phiên bản: v{currentCase.version}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Autosave Status Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
            {autosaveStatus === 'saving' ? (
              <span className="text-amber-500 flex items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5 animate-spin" /> Đang lưu...
              </span>
            ) : (
              <span className="text-emerald-600 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Đã lưu nháp tự động
              </span>
            )}
          </div>

          {/* Student Preview Button */}
          <Link
            href={`/student/cases/${currentCase.id}/play?preview=true`}
            target="_blank"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" /> Xem trước (Preview)
          </Link>

          {/* Approve & Publish Button */}
          <button
            onClick={() => setShowPublishModal(true)}
            disabled={!validationResult.isValid}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-1.5 shadow-sm transition-all ${
              validationResult.isValid
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-slate-400 cursor-not-allowed opacity-60'
            }`}
          >
            <Send className="w-3.5 h-3.5" /> Phê duyệt & Xuất bản
          </button>
        </div>
      </header>

      {/* 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: Node Tree / Hierarchy List */}
        <div className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Danh sách Nodes ({currentCase.nodes.length})
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleAddNewNode(NodeType.SITUATION)}
                title="Thêm Situation Node"
                className="p-1 rounded bg-brand-blue-50 text-brand-blue-600 hover:bg-brand-blue-100 text-[10px] font-bold"
              >
                + Tình huống
              </button>
              <button
                onClick={() => handleAddNewNode(NodeType.TERMINAL)}
                title="Thêm Terminal Node"
                className="p-1 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-[10px] font-bold"
              >
                + Kết quả
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {currentCase.nodes.map((node, index) => {
              const isSelected = node.id === selectedNodeId;
              const isTerminal = node.type === NodeType.TERMINAL;
              const isRoot = node.id === currentCase.rootNodeId;

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`p-2.5 rounded-lg cursor-pointer text-xs transition-all border ${
                    isSelected
                      ? 'border-brand-blue-500 bg-brand-blue-50/70 dark:bg-brand-blue-950/50 text-brand-blue-900 dark:text-brand-blue-100 font-semibold shadow-xs'
                      : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase font-bold ${
                        isTerminal
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                      }`}
                    >
                      {isTerminal ? 'Terminal' : `Step ${index + 1}`}
                      {isRoot ? ' (Root)' : ''}
                    </span>
                    {node.isPivotal && (
                      <span className="text-[9px] px-1 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold rounded flex items-center gap-0.5">
                        <Flag className="w-2.5 h-2.5" /> Then chốt
                      </span>
                    )}
                  </div>

                  <p className="line-clamp-2 leading-tight">{node.title || 'Node chưa đặt tên'}</p>

                  {!isTerminal && (
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {node.options?.length || 0} Phương án rẽ nhánh
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CENTER COLUMN: Selected Node Form Editor */}
        <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-6 overflow-y-auto min-w-[380px]">
          {selectedNode ? (
            <div className="max-w-2xl mx-auto space-y-6 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                    {selectedNode.type}
                  </span>
                  {selectedNode.isLecturerEdited ? (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                      Đã chỉnh bởi Giảng viên
                    </span>
                  ) : selectedNode.isAiGenerated ? (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> AI gợi ý
                    </span>
                  ) : null}
                </div>

                <button
                  onClick={() => handleDeleteNode(selectedNode.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  title="Xóa node này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tiêu đề Node *
                </label>
                <input
                  type="text"
                  value={selectedNode.title}
                  onChange={(e) => handleUpdateCurrentNode({ title: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold focus:ring-2 focus:ring-brand-blue-500 focus:outline-none"
                />
              </div>

              {/* Content / Narrative */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Nội dung tình huống chi tiết *
                  </label>
                  {selectedNode.isAiGenerated && (
                    <button
                      type="button"
                      onClick={() => {
                        toast.info('AI đang tạo lại nội dung cho tình huống này...');
                        setTimeout(() => {
                          handleUpdateCurrentNode({
                            content: `${selectedNode.content}\n\n[AI cập nhật bổ sung thêm diễn biến áp lực thời gian cho tình huống].`,
                          });
                          toast.success('Đã cập nhật nội dung từ AI');
                        }, 800);
                      }}
                      className="text-[10px] text-purple-600 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Sparkles className="w-3 h-3" /> Tạo lại phần này bằng AI
                    </button>
                  )}
                </div>
                <textarea
                  rows={4}
                  value={selectedNode.content}
                  onChange={(e) => handleUpdateCurrentNode({ content: e.target.value })}
                  className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs leading-relaxed focus:ring-2 focus:ring-brand-blue-500 focus:outline-none"
                />
              </div>

              {/* Pivotal Decision Toggle (for Situation) */}
              {selectedNode.type === NodeType.SITUATION && (
                <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                      <Flag className="w-4 h-4 text-amber-600" />
                      Đánh dấu là Quyết định then chốt (Pivotal Decision Point)
                    </span>
                    <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5">
                      Sinh viên bắt buộc phải viết bản lập luận (Reasoning) và trải qua 2 vòng phản biện AI tại bước này trong Journey Review.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={!!selectedNode.isPivotal}
                    onChange={(e) => handleUpdateCurrentNode({ isPivotal: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                </div>
              )}

              {/* Prompt Question */}
              {selectedNode.type === NodeType.SITUATION && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Câu hỏi gợi ý lựa chọn (Prompt Question)
                  </label>
                  <input
                    type="text"
                    value={selectedNode.promptQuestion || ''}
                    onChange={(e) => handleUpdateCurrentNode({ promptQuestion: e.target.value })}
                    placeholder="Ví dụ: Bạn quyết định xử lý lưu lượng như thế nào?"
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-blue-500 focus:outline-none"
                  />
                </div>
              )}

              {/* TERMINAL Node Specifics */}
              {selectedNode.type === NodeType.TERMINAL && (
                <div className="space-y-4 p-4 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Mức độ kết quả (Chỉ là nhãn mô tả phân loại kết cục – KHÔNG PHẢI ĐIỂM SỐ)
                    </label>
                    <select
                      value={selectedNode.outcomeLabel || OutcomeLabel.ACCEPTABLE}
                      onChange={(e) =>
                        handleUpdateCurrentNode({ outcomeLabel: e.target.value as OutcomeLabel })
                      }
                      className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                    >
                      <option value={OutcomeLabel.EXCELLENT}>Tốt (Hệ thống phục hồi ngoạn mục)</option>
                      <option value={OutcomeLabel.ACCEPTABLE}>Chấp nhận được (Thiệt hại một phần)</option>
                      <option value={OutcomeLabel.POOR}>Kém (Khủng hoảng trầm trọng)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Kiến thức / Khái niệm liên quan cần đúc kết
                    </label>
                    <input
                      type="text"
                      value={selectedNode.relatedKnowledge?.join(', ') || ''}
                      onChange={(e) =>
                        handleUpdateCurrentNode({
                          relatedKnowledge: e.target.value.split(',').map((s) => s.trim()),
                        })
                      }
                      placeholder="Phân cách bằng dấu phẩy: Rate Limiting, Idempotency, CAP Theorem"
                      className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* OPTIONS LIST FOR SITUATION NODE */}
              {selectedNode.type === NodeType.SITUATION && (
                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Các Phương án lựa chọn ({selectedNode.options.length})
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Mỗi phương án liên kết tới một Node tiếp theo và chứa hậu quả tương ứng
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="px-3 py-1 rounded-lg text-xs font-bold text-brand-blue-600 bg-brand-blue-50 hover:bg-brand-blue-100 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Thêm phương án
                    </button>
                  </div>

                  <div className="space-y-4">
                    {selectedNode.options.map((option, idx) => (
                      <div
                        key={option.id}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-brand-blue-700 dark:text-brand-blue-300">
                            Phương án {idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteOption(option.id)}
                            className="text-slate-400 hover:text-rose-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                            Tiêu đề nhãn lựa chọn *
                          </label>
                          <input
                            type="text"
                            value={option.label}
                            onChange={(e) =>
                              handleUpdateOption(option.id, { label: e.target.value })
                            }
                            className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                            Mô tả hành động của phương án
                          </label>
                          <textarea
                            rows={2}
                            value={option.description}
                            onChange={(e) =>
                              handleUpdateOption(option.id, { description: e.target.value })
                            }
                            className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                          />
                        </div>

                        {/* Next Node Target Dropdown */}
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                            Node tiếp theo khi chọn phương án này (Next Node) *
                          </label>
                          <select
                            value={option.nextNodeId}
                            onChange={(e) =>
                              handleUpdateOption(option.id, { nextNodeId: e.target.value })
                            }
                            className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-medium"
                          >
                            <option value="">-- Chọn Node tiếp theo --</option>
                            {currentCase.nodes
                              .filter((n) => n.id !== selectedNode.id)
                              .map((n) => (
                                <option key={n.id} value={n.id}>
                                  [{n.type}] {n.title}
                                </option>
                              ))}
                          </select>
                        </div>

                        {/* Consequence Definition */}
                        <div className="pt-2">
                          <label className="block text-[11px] font-semibold text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Hậu quả thực tế (Consequence - Giảng viên định nghĩa) *
                          </label>
                          <textarea
                            rows={2}
                            value={option.consequence}
                            onChange={(e) =>
                              handleUpdateOption(option.id, { consequence: e.target.value })
                            }
                            placeholder="Mô tả kết quả thực tế phát sinh sau quyết định này..."
                            className="w-full p-2 rounded-lg border border-amber-200 dark:border-amber-800/80 bg-amber-50/30 dark:bg-amber-950/20 text-xs"
                          />
                          <p className="text-[10px] text-slate-400 mt-1">
                            🔒 <strong>Bảo mật sư phạm:</strong> Hậu quả này tuyệt đối KHÔNG hiển thị trong lúc sinh viên chơi, chỉ được mở khóa tại Journey Review sau Terminal.
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400">
              Chọn một node bên cột trái để chỉnh sửa.
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Interactive Tree Visualizer & Validation Panel */}
        <div className="w-80 sm:w-96 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shrink-0">
          <div className="p-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <button
              onClick={() => setRightTab('tree')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                rightTab === 'tree'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Workflow className="w-3.5 h-3.5" /> Sơ đồ cây (Graph)
            </button>
            <button
              onClick={() => setRightTab('validation')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                rightTab === 'validation'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Kiểm tra cây ({validationResult.errors.length})
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {rightTab === 'tree' ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Topology: {currentCase.nodes.length} Nodes</span>
                  <span className="text-brand-blue-600 font-semibold">Nhấp node để chọn sửa</span>
                </div>

                {/* Graph Node Connections View */}
                <div className="space-y-3">
                  {currentCase.nodes.map((node) => {
                    const isSelected = node.id === selectedNodeId;
                    const isTerminal = node.type === NodeType.TERMINAL;

                    return (
                      <div
                        key={node.id}
                        onClick={() => setSelectedNodeId(node.id)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          isSelected
                            ? 'border-brand-blue-500 ring-2 ring-brand-blue-500/20 bg-brand-blue-50/30'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[70%]">
                            {node.title}
                          </span>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                              isTerminal ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {node.type}
                          </span>
                        </div>

                        {/* Directed edges list */}
                        {!isTerminal && node.options && (
                          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                            {node.options.map((opt, i) => {
                              const targetNode = currentCase.nodes.find(
                                (n) => n.id === opt.nextNodeId
                              );
                              return (
                                <div
                                  key={opt.id}
                                  className="text-[11px] text-slate-500 flex items-center justify-between"
                                >
                                  <span className="truncate max-w-[50%]">➔ {opt.label}</span>
                                  <span className="font-mono text-[10px] text-brand-teal-600 font-bold truncate max-w-[45%]">
                                    {targetNode ? targetNode.title : 'Chưa nối'}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Validation Panel */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Kết quả kiểm tra thời gian thực
                  </h4>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      validationResult.isValid
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {validationResult.isValid ? 'Hợp lệ' : `${validationResult.errors.length} Lỗi`}
                  </span>
                </div>

                {validationResult.errors.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-rose-600 block">Lỗi nghiêm trọng:</span>
                    {validationResult.errors.map((err, i) => (
                      <div
                        key={i}
                        onClick={() => err.nodeId && setSelectedNodeId(err.nodeId)}
                        className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 cursor-pointer hover:bg-rose-100 transition-colors flex items-start gap-2"
                      >
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                        <div>
                          <p className="font-medium">{err.message}</p>
                          {err.nodeId && (
                            <span className="text-[10px] text-rose-500 underline mt-0.5 block">
                              Nhấp để mở node này
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {validationResult.warnings.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-amber-600 block">Cảnh báo:</span>
                    {validationResult.warnings.map((warn, i) => (
                      <div
                        key={i}
                        onClick={() => warn.nodeId && setSelectedNodeId(warn.nodeId)}
                        className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 cursor-pointer hover:bg-amber-100 transition-colors"
                      >
                        <p>{warn.message}</p>
                      </div>
                    ))}
                  </div>
                )}

                {validationResult.isValid && validationResult.warnings.length === 0 && (
                  <div className="p-6 text-center text-xs text-slate-500">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    Cây kịch bản đạt chuẩn! Không có node mồ côi, không có vòng lặp vô tận, các nhánh đều dẫn đến Terminal.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Approve & Publish Confirmation Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Phê duyệt & Xuất bản Case Study
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Chỉ giảng viên phụ trách mới có quyền phê duyệt kịch bản để sinh viên bắt đầu học tập.
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Thời hạn hoàn thành (Deadline nộp bài) *
                </label>
                <input
                  type="datetime-local"
                  value={publishDueDate}
                  onChange={(e) => setPublishDueDate(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <span>Gửi thông báo in-app và email cho sinh viên trong lớp</span>
                <input
                  type="checkbox"
                  checked={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowPublishModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handlePublish}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
              >
                Xác nhận Xuất bản
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

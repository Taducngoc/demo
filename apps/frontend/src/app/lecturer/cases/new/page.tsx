'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  GitBranch,
  FileCheck2,
  BookOpen,
  Layers,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  Edit3,
  Loader2,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { useMockStore } from '@/mocks/mock-store';
import {
  CaseMode,
  CaseSource,
  NodeType,
  OutcomeLabel,
  MaterialStatus,
} from '@edubranch/shared';
import { toast } from 'sonner';

export default function LecturerNewCaseWizardPage() {
  const router = useRouter();
  const { courses, materials, createCase, currentUser } = useMockStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  // Wizard Form Data
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [mode, setMode] = useState<CaseMode>(CaseMode.BRANCHING);

  // Step 2 Form
  const [topicPrompt, setTopicPrompt] = useState(
    'Khủng hoảng sập mạng lưới trung tâm dữ liệu và tấn công DDoS nhắm vào cổng xác thực sinh trắc học ngân hàng'
  );
  const [selectedMaterialIds, setSelectedMaterialIds] = useState<string[]>([]);
  const [weekOrChapter, setWeekOrChapter] = useState('Tuần 7 - An ninh mạng & Ứng cứu sự cố');
  const [domain, setDomain] = useState('Công nghệ Thông tin / Ngân hàng');
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('HARD');
  const [suggestedMaxSituations, setSuggestedMaxSituations] = useState(4);

  const indexedMaterials = materials.filter(
    (m) => m.courseId === courseId && m.status === MaterialStatus.INDEXED
  );

  const toggleMaterial = (id: string) => {
    if (selectedMaterialIds.includes(id)) {
      setSelectedMaterialIds(selectedMaterialIds.filter((m) => m !== id));
    } else {
      setSelectedMaterialIds([...selectedMaterialIds, id]);
    }
  };

  const handleManualCreate = () => {
    const newCase = createCase({
      courseId,
      mode,
      source: CaseSource.LECTURER_AUTHORED,
      title: 'Tình huống học tập mới (Tạo thủ công)',
      description: 'Soạn thảo kịch bản trực tiếp từ đầu bởi Giảng viên.',
      nodes:
        mode === CaseMode.BRANCHING
          ? [
              {
                id: 'node-manual-1',
                caseId: 'manual',
                type: NodeType.SITUATION,
                title: 'Tình huống 1: Điểm quyết định khởi đầu',
                content: 'Nhập nội dung tình huống giả định tại đây...',
                isPivotal: true,
                options: [
                  {
                    id: 'opt-m1',
                    nodeId: 'node-manual-1',
                    label: 'Phương án 1',
                    description: 'Mô tả hành động của phương án 1',
                    nextNodeId: 'terminal-manual-1',
                    consequence: 'Mô tả hậu quả sau khi chọn phương án này',
                  },
                ],
              },
              {
                id: 'terminal-manual-1',
                caseId: 'manual',
                type: NodeType.TERMINAL,
                title: 'Kết quả 1: Hoàn thành kịch bản',
                content: 'Mô tả kết quả đạt được...',
                outcomeLabel: OutcomeLabel.EXCELLENT,
                options: [],
              },
            ]
          : [],
    });

    toast.success('Đã tạo bản nháp thủ công! Đang mở trình chỉnh sửa...');
    router.push(`/lecturer/cases/${newCase.id}/edit`);
  };

  const handleStartAiGeneration = () => {
    setIsGenerating(true);
    setGenerationStep(1);

    // Simulated RAG Pipeline steps
    setTimeout(() => {
      setGenerationStep(2); // Generating branch tree
    }, 1200);

    setTimeout(() => {
      setGenerationStep(3); // Validating JSON Schema
    }, 2400);

    setTimeout(() => {
      setGenerationStep(4); // Validating Tree Topology
    }, 3400);

    setTimeout(() => {
      const generatedCase = createCase({
        courseId,
        mode,
        source: CaseSource.AI_GENERATED,
        title: topicPrompt,
        description: `Tình huống học tập mô phỏng phân nhánh được AI phác thảo dựa trên bối cảnh ${domain} (${weekOrChapter}).`,
        dueDate: '2026-11-30T23:59:00Z',
        rootNodeId: 'node-ai-root',
        nodes:
          mode === CaseMode.BRANCHING
            ? [
                {
                  id: 'node-ai-root',
                  caseId: 'gen',
                  type: NodeType.SITUATION,
                  title: 'Tình huống 1: Phát hiện bất thường lưu lượng và cảnh báo xâm nhập mức nghiêm trọng (Level 5)',
                  content: `Hệ thống SOC (Security Operations Center) phát hiện 2.5 triệu request/phút nhắm vào API đăng nhập sinh trắc học. 15 máy chủ backend ghi nhận CPU chạm mốc 99%. Đội ngũ an ninh nghi ngờ đây là đòn tấn công kép (DDoS kết hợp khai thác lỗ hổng Zero-day).`,
                  promptQuestion: 'Với tư cách là Trưởng nhóm Ứng cứu khẩn cấp (Incident Response Lead), bước xử lý đầu tiên của bạn là gì?',
                  isPivotal: true,
                  isAiGenerated: true,
                  dataJson: {
                    type: 'metrics',
                    title: 'Chỉ số an ninh thời gian thực',
                    items: {
                      'Lưu lượng tấn công': '180 Gbps UDP Flood',
                      'Xác thực thất bại': '92% tổng lượt đăng nhập',
                      'Thời gian đáp ứng API': '12.4 giây (bình thường < 150ms)',
                    },
                  },
                  options: [
                    {
                      id: 'opt-gen-1a',
                      nodeId: 'node-ai-root',
                      label: 'Phương án A: Chuyển toàn bộ lưu lượng qua dịch vụ chống DDoS Cloudflare/AWS Shield và bật chế độ xác thực CAPTCHA khắt khe',
                      description: 'Chặn đứng lưu lượng độc hại ở tầng mạng biên (Edge).',
                      nextNodeId: 'node-ai-2',
                      consequence: 'Lọc được 95% lưu lượng rác, giải phóng tài nguyên CPU cho các máy chủ chính. Một số ít người dùng phản ánh CAPTCHA gây khó chịu nhưng dịch vụ tiếp tục hoạt động.',
                    },
                    {
                      id: 'opt-gen-1b',
                      nodeId: 'node-ai-root',
                      label: 'Phương án B: Tạm thời cô lập hoàn toàn cụm máy chủ xác thực sinh trắc học để rà soát mã độc bên trong',
                      description: 'Ưu tiên phòng chống rò rỉ dữ liệu nhạy cảm của khách hàng.',
                      nextNodeId: 'node-ai-3',
                      consequence: 'Ngăn chặn nguy cơ rò rỉ dữ liệu, nhưng khiến toàn bộ dịch vụ ngân hàng số bị gián đoạn hoàn toàn trong 45 phút đầu.',
                    },
                  ],
                },
                {
                  id: 'node-ai-2',
                  caseId: 'gen',
                  type: NodeType.SITUATION,
                  title: 'Tình huống 2: Phân tích nguồn tấn công & Tối ưu hóa xác thực khách hàng thật',
                  content: 'Hệ thống đã chống đỡ được đòn DDoS sơ bộ, tuy nhiên kẻ tấn công bắt đầu chuyển hướng sang dò quét mật khẩu (Credential Stuffing) từ hàng ngàn địa chỉ IP trong nước.',
                  promptQuestion: 'Bạn áp dụng giải pháp kiểm soát truy cập nào tiếp theo?',
                  isPivotal: false,
                  isAiGenerated: true,
                  options: [
                    {
                      id: 'opt-gen-2a',
                      nodeId: 'node-ai-2',
                      label: 'Bật cơ chế Risk-Based Authentication (Đánh giá rủi ro theo thiết bị, vị trí và hành vi)',
                      description: 'Chỉ yêu cầu xác thực tăng cường với các phiên đăng nhập bất thường.',
                      nextNodeId: 'terminal-ai-1',
                      consequence: 'Bảo vệ thành công tài khoản người dùng, phát hiện và khóa 120,000 phiên đăng nhập độc hại mà không làm phiền 98% khách hàng thông thường.',
                    },
                    {
                      id: 'opt-gen-2b',
                      nodeId: 'node-ai-2',
                      label: 'Khóa tạm thời tất cả các tài khoản có trên 3 lần đăng nhập sai trong 1 giờ qua',
                      description: 'Áp dụng chính sách bảo mật cứng rắn để triệt tiêu đòn dò mật khẩu.',
                      nextNodeId: 'terminal-ai-2',
                      consequence: 'Bảo vệ được tài khoản nhưng khiến tổng đài chăm sóc khách hàng bị quá tải với hơn 5,000 cuộc gọi mở khóa.',
                    },
                  ],
                },
                {
                  id: 'node-ai-3',
                  caseId: 'gen',
                  type: NodeType.SITUATION,
                  title: 'Tình huống 3: Khôi phục dịch vụ sau cô lập & Khủng hoảng truyền thông',
                  content: 'Khách hàng không thể đăng nhập app ngân hàng và đang hoang mang vì tin đồn ngân hàng bị đánh cắp tiền lan truyền chóng mặt.',
                  promptQuestion: 'Bạn phối hợp với Ban Truyền thông đưa ra tuyên bố như thế nào?',
                  isPivotal: true,
                  isAiGenerated: true,
                  options: [
                    {
                      id: 'opt-gen-3a',
                      nodeId: 'node-ai-3',
                      label: 'Công bố sự cố minh bạch: Hệ thống chủ động tạm dừng để nâng cấp bảo mật, cam kết 100% số dư an toàn',
                      description: 'Xoa dịu dư luận bằng tính minh bạch và cam kết trách nhiệm.',
                      nextNodeId: 'terminal-ai-2',
                      consequence: 'Dư luận lắng xuống, lấy lại niềm tin công chúng sau khi dịch vụ được kích hoạt trở lại.',
                    },
                    {
                      id: 'opt-gen-3b',
                      nodeId: 'node-ai-3',
                      label: 'Giữ im lặng và chỉ âm thầm bật lại hệ thống khi đã vá xong lỗ hổng',
                      description: 'Tránh thu hút thêm sự chú ý của giới báo chí.',
                      nextNodeId: 'terminal-ai-3',
                      consequence: 'Tin đồn thất thiệt bùng nổ, giá cổ phiếu ngân hàng giảm 4% và ngân hàng nhà nước yêu cầu thanh tra khẩn cấp.',
                    },
                  ],
                },
                {
                  id: 'terminal-ai-1',
                  caseId: 'gen',
                  type: NodeType.TERMINAL,
                  title: 'Kết quả 1: Ứng cứu xuất sắc - Bảo vệ dữ liệu & Duy trì dịch vụ thông suốt',
                  content: 'Nhờ kết hợp khéo léo giữa lọc lưu lượng biên (Edge DDoS Mitigation) và xác thực dựa trên rủi ro (Risk-Based Authentication), hệ thống đã bẻ gãy đòn tấn công kép tinh vi. Không có dữ liệu khách hàng nào bị rò rỉ.',
                  outcomeLabel: OutcomeLabel.EXCELLENT,
                  relatedKnowledge: [
                    'Kiến trúc Cloudflare/Edge Shield',
                    'Risk-Based Authentication',
                    'Zero Trust Security',
                  ],
                  options: [],
                },
                {
                  id: 'terminal-ai-2',
                  caseId: 'gen',
                  type: NodeType.TERMINAL,
                  title: 'Kết quả 2: Hệ thống an toàn nhưng phát sinh chi phí vận hành & trải nghiệm người dùng giảm sút',
                  content: 'Mục tiêu bảo mật được đảm bảo tuyệt đối, tuy nhiên hệ thống CSKH bị áp lực lớn và một lượng khách hàng cảm thấy phiền toái vì các cơ chế khóa tài khoản diện rộng.',
                  outcomeLabel: OutcomeLabel.ACCEPTABLE,
                  relatedKnowledge: ['Đánh đổi giữa Security và Usability'],
                  options: [],
                },
                {
                  id: 'terminal-ai-3',
                  caseId: 'gen',
                  type: NodeType.TERMINAL,
                  title: 'Kết quả 3: Khủng hoảng niềm tin & Thiệt hại uy tín thương hiệu nặng nề',
                  content: 'Mặc dù hệ thống không bị chiếm quyền kiểm soát, sự thiếu minh bạch trong xử lý và thời gian gián đoạn kéo dài đã gây ra sự hoang mang tột độ cho khách hàng.',
                  outcomeLabel: OutcomeLabel.POOR,
                  relatedKnowledge: ['Quản trị truyền thông trong sự cố an ninh mạng'],
                  options: [],
                },
              ]
            : [],
        reviewContext: mode === CaseMode.REVIEW ? 'Bối cảnh sự cố...' : undefined,
        reviewProblem: mode === CaseMode.REVIEW ? 'Vấn đề cần giải quyết...' : undefined,
      });

      toast.success('AI đã hoàn tất phác thảo Case Draft! Đang chuyển sang Trình chỉnh sửa...');
      router.push(`/lecturer/cases/${generatedCase.id}/edit`);
    }, 4500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Trợ lý Sinh Case Study bằng AI (Case Studio)"
        description="Khởi tạo kịch bản tình huống học thuật đa nhánh từ tài liệu môn học chỉ qua 3 bước"
        breadcrumbs={[
          { label: 'Case Study', href: '/lecturer/cases' },
          { label: 'Tạo Case mới' },
        ]}
      />

      {/* Mandatory Pedagogical Ethics Alert Banner */}
      <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs text-teal-800 dark:text-teal-200 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold mb-0.5">Cam kết Sư phạm EduBranch AI:</strong>
          <span>
            Nội dung do AI tạo ra <strong>chỉ là bản nháp sơ bộ (Case Draft)</strong>. Giảng viên luôn là người kiểm duyệt nội dung, chỉnh sửa các nhánh quyết định và trực tiếp phê duyệt trước khi công bố cho sinh viên.
          </span>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="grid grid-cols-3 gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div
          className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${
            step === 1
              ? 'border-brand-blue-500 bg-brand-blue-50/60 dark:bg-brand-blue-950/40 text-brand-blue-700 dark:text-brand-blue-300'
              : 'border-slate-200 dark:border-slate-800 text-slate-500'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-brand-blue-600 text-white flex items-center justify-center text-[10px]">
            1
          </span>
          Khóa học & Chế độ học
        </div>

        <div
          className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${
            step === 2
              ? 'border-brand-blue-500 bg-brand-blue-50/60 dark:bg-brand-blue-950/40 text-brand-blue-700 dark:text-brand-blue-300'
              : 'border-slate-200 dark:border-slate-800 text-slate-500'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-brand-blue-600 text-white flex items-center justify-center text-[10px]">
            2
          </span>
          Chủ đề & Tài liệu nguồn
        </div>

        <div
          className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${
            step === 3
              ? 'border-brand-blue-500 bg-brand-blue-50/60 dark:bg-brand-blue-950/40 text-brand-blue-700 dark:text-brand-blue-300'
              : 'border-slate-200 dark:border-slate-800 text-slate-500'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-brand-blue-600 text-white flex items-center justify-center text-[10px]">
            3
          </span>
          Xem lại & Sinh Draft
        </div>
      </div>

      {/* STEP 1: Course & Mode Selection */}
      {step === 1 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Chọn Khóa học áp dụng tình huống *
            </label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-brand-blue-500"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  [{c.code}] {c.name} ({c.term})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Chọn Chế độ học tập (Learning Mode) *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setMode(CaseMode.BRANCHING)}
                className={`p-5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  mode === CaseMode.BRANCHING
                    ? 'border-brand-blue-500 bg-brand-blue-50/50 dark:bg-brand-blue-950/30 text-brand-blue-900 dark:text-brand-blue-200 ring-2 ring-brand-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-brand-blue-100 dark:bg-brand-blue-900 text-brand-blue-600 flex items-center justify-center mb-3">
                    <GitBranch className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold block mb-1">Branching Study (Cây phân nhánh)</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Sinh viên đưa ra lựa chọn liên tục, hậu quả được giấu kín cho tới Terminal. Phù hợp rèn luyện phản xạ ứng biến và giải quyết sự cố.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-brand-blue-600 mt-4 uppercase">
                  (Khuyến nghị cho kịch bản sự cố)
                </span>
              </button>

              <button
                type="button"
                onClick={() => setMode(CaseMode.REVIEW)}
                className={`p-5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  mode === CaseMode.REVIEW
                    ? 'border-brand-teal-500 bg-brand-teal-50/50 dark:bg-brand-teal-950/30 text-brand-teal-900 dark:text-brand-teal-200 ring-2 ring-brand-teal-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-brand-teal-100 dark:bg-brand-teal-900 text-brand-teal-600 flex items-center justify-center mb-3">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold block mb-1">Review Study (Phân tích chuyên sâu)</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Bản đơn giản: Bối cảnh (Context) + Số liệu (Data) + Vấn đề (Problem). Sinh viên đề xuất giải pháp và nhận nhận xét từ giảng viên.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-brand-teal-600 mt-4 uppercase">
                  (Không cần cây phân nhánh)
                </span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={handleManualCreate}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" /> Tạo thủ công từ đầu (không dùng AI)
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-brand-blue-600 hover:bg-brand-blue-700 shadow-sm flex items-center gap-2"
            >
              Tiếp tục bước 2 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Topic & Source Materials */}
      {step === 2 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Chủ đề tình huống / Bối cảnh giả định *
            </label>
            <textarea
              rows={3}
              value={topicPrompt}
              onChange={(e) => setTopicPrompt(e.target.value)}
              placeholder="Nhập bối cảnh tình huống, xung đột trọng tâm hoặc thách thức cốt lõi..."
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-blue-500 focus:outline-none"
            />
          </div>

          {/* RAG Indexed Materials Multi-select */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Chọn Tài liệu nguồn để AI trích xuất bối cảnh (RAG):
              </label>
              <span className="text-[11px] text-brand-teal-600 font-semibold">
                {selectedMaterialIds.length} tài liệu đã chọn
              </span>
            </div>

            {indexedMaterials.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-500">
                Khóa học này chưa có tài liệu nào ở trạng thái INDEXED. AI sẽ sinh dữ liệu tổng quát dựa trên chủ đề của bạn.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {indexedMaterials.map((mat) => {
                  const isChecked = selectedMaterialIds.includes(mat.id);
                  return (
                    <div
                      key={mat.id}
                      onClick={() => toggleMaterial(mat.id)}
                      className={`p-3 rounded-xl border cursor-pointer text-xs flex items-center justify-between transition-colors ${
                        isChecked
                          ? 'border-brand-teal-500 bg-brand-teal-50/50 dark:bg-brand-teal-950/30 font-semibold text-brand-teal-900 dark:text-brand-teal-200'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-brand-teal-600" />
                        <span>{mat.fileName}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="rounded text-brand-teal-600"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Lĩnh vực chuyên môn
              </label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="Ví dụ: Công nghệ thông tin, Quản trị, Luật, Y khoa..."
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tuần học / Chương giáo trình
              </label>
              <input
                type="text"
                value={weekOrChapter}
                onChange={(e) => setWeekOrChapter(e.target.value)}
                placeholder="Ví dụ: Tuần 5 - Xử lý lỗi kiến trúc"
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Độ khó kỳ vọng
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-blue-500"
              >
                <option value="EASY">Cơ bản (Sinh viên năm 1-2)</option>
                <option value="MEDIUM">Trung bình (Sinh viên năm 3)</option>
                <option value="HARD">Nâng cao / Chuyên gia (Năm 4 - Sau đại học)</option>
              </select>
            </div>

            {mode === CaseMode.BRANCHING && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Số điểm quyết định gợi ý (Tùy chọn)
                </label>
                <input
                  type="number"
                  min={2}
                  max={8}
                  value={suggestedMaxSituations}
                  onChange={(e) => setSuggestedMaxSituations(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-blue-500"
                />
                <span className="text-[10px] text-slate-400">
                  Lưu ý: Không cố định số điểm quyết định; AI sẽ phác thảo tự nhiên theo diễn biến tình huống.
                </span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Quay lại Bước 1
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-brand-blue-600 hover:bg-brand-blue-700 shadow-sm flex items-center gap-2"
            >
              Xem lại cấu hình <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Review & Generation Progress */}
      {step === 3 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          {!isGenerating ? (
            <>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Xác nhận thông số khởi tạo kịch bản
              </h3>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Khóa học:</span>
                  <span className="font-semibold">{courses.find((c) => c.id === courseId)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Chế độ học:</span>
                  <span className="font-semibold text-brand-blue-600 font-mono">
                    {mode === CaseMode.BRANCHING ? 'Branching Study' : 'Review Study'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Chủ đề:</span>
                  <span className="font-semibold max-w-md text-right">{topicPrompt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tài liệu RAG đính kèm:</span>
                  <span className="font-semibold">
                    {selectedMaterialIds.length > 0
                      ? `${selectedMaterialIds.length} tài liệu đã chọn`
                      : 'Không chọn (Sử dụng tri thức tổng quát)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Độ khó:</span>
                  <span className="font-semibold">{difficulty}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Điều chỉnh lại
                </button>
                <button
                  type="button"
                  onClick={handleStartAiGeneration}
                  className="px-6 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-blue-600 to-brand-teal-600 hover:opacity-95 shadow-md flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Bắt đầu tạo Case Draft cùng AI
                </button>
              </div>
            </>
          ) : (
            <div className="py-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-blue-600 to-brand-teal-500 text-white flex items-center justify-center mx-auto shadow-xl animate-pulse">
                <Sparkles className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Đang khởi tạo Case Draft...
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Mô hình ngôn ngữ đang phân tích bối cảnh và thiết kế cây phân nhánh học thuật
                </p>
              </div>

              {/* Progress steps animation */}
              <div className="max-w-md mx-auto space-y-3 text-left text-xs">
                <div
                  className={`p-3 rounded-lg border flex items-center justify-between ${
                    generationStep >= 1
                      ? 'border-brand-teal-500 bg-brand-teal-50/40 text-brand-teal-900 dark:text-brand-teal-200'
                      : 'border-slate-200 text-slate-400'
                  }`}
                >
                  <span>1. Truy xuất dữ liệu từ tài liệu nguồn (RAG Retriever)</span>
                  {generationStep > 1 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Loader2 className="w-4 h-4 animate-spin text-brand-teal-600" />
                  )}
                </div>

                <div
                  className={`p-3 rounded-lg border flex items-center justify-between ${
                    generationStep >= 2
                      ? 'border-brand-teal-500 bg-brand-teal-50/40 text-brand-teal-900 dark:text-brand-teal-200'
                      : 'border-slate-200 text-slate-400'
                  }`}
                >
                  <span>2. Sinh kịch bản tình huống & các nhánh quyết định</span>
                  {generationStep > 2 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : generationStep === 2 ? (
                    <Loader2 className="w-4 h-4 animate-spin text-brand-teal-600" />
                  ) : null}
                </div>

                <div
                  className={`p-3 rounded-lg border flex items-center justify-between ${
                    generationStep >= 3
                      ? 'border-brand-teal-500 bg-brand-teal-50/40 text-brand-teal-900 dark:text-brand-teal-200'
                      : 'border-slate-200 text-slate-400'
                  }`}
                >
                  <span>3. Xác thực cấu trúc dữ liệu theo JSON Schema</span>
                  {generationStep > 3 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : generationStep === 3 ? (
                    <Loader2 className="w-4 h-4 animate-spin text-brand-teal-600" />
                  ) : null}
                </div>

                <div
                  className={`p-3 rounded-lg border flex items-center justify-between ${
                    generationStep >= 4
                      ? 'border-brand-teal-500 bg-brand-teal-50/40 text-brand-teal-900 dark:text-brand-teal-200'
                      : 'border-slate-200 text-slate-400'
                  }`}
                >
                  <span>4. Kiểm tra thuật toán cây (Không vòng lặp, không node mồ côi)</span>
                  {generationStep === 4 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

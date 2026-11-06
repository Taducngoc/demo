import { z } from 'zod';
import { CaseMode, UserRole, NodeType, OutcomeLabel } from './enums';

export const loginSchema = z.object({
  email: z.string().email('Email không đúng định dạng'),
  password: z.string().min(6, 'Mật khẩu phải từ 6 ký tự trở lên'),
});

export const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Họ và tên tối thiểu 2 ký tự'),
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z.string(),
    role: z.enum([UserRole.STUDENT, UserRole.LECTURER], {
      errorMap: () => ({ message: 'Vai trò chỉ được chọn Sinh viên hoặc Giảng viên' }),
    }),
    studentCode: z.string().optional(),
    department: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  })
  .refine(
    (data) => {
      if (data.role === UserRole.STUDENT && !data.studentCode?.trim()) {
        return false;
      }
      return true;
    },
    {
      message: 'Sinh viên bắt buộc nhập Mã sinh viên',
      path: ['studentCode'],
    }
  )
  .refine(
    (data) => {
      if (data.role === UserRole.LECTURER && !data.department?.trim()) {
        return false;
      }
      return true;
    },
    {
      message: 'Giảng viên bắt buộc nhập Khoa/Đơn vị công tác',
      path: ['department'],
    }
  );

export const adminLoginSchema = z.object({
  username: z.string().min(1, 'Vui lòng nhập tên đăng nhập Admin'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Vui lòng nhập địa chỉ email hợp lệ'),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Token không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu mới ít nhất 6 ký tự'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

export const createCourseSchema = z.object({
  name: z.string().min(3, 'Tên khóa học ít nhất 3 ký tự'),
  code: z.string().min(2, 'Mã môn học ít nhất 2 ký tự'),
  term: z.string().min(2, 'Học kỳ/Năm học không được để trống'),
  description: z.string().optional().default(''),
});

export const caseWizardStep1Schema = z.object({
  courseId: z.string().min(1, 'Vui lòng chọn khóa học'),
  mode: z.enum([CaseMode.BRANCHING, CaseMode.REVIEW]),
});

export const caseWizardStep2Schema = z.object({
  topicPrompt: z.string().min(10, 'Chủ đề / Tình huống tối thiểu 10 ký tự để AI hiểu rõ bối cảnh'),
  materialIds: z.array(z.string()).default([]),
  weekOrChapter: z.string().optional().default(''),
  domain: z.string().min(2, 'Vui lòng chọn hoặc nhập lĩnh vực chuyên môn'),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).default('MEDIUM'),
  suggestedMaxSituations: z.number().min(2).max(10).optional().default(4),
});

export const nodeOptionSchema = z.object({
  id: z.string(),
  label: z.string().min(1, 'Nhãn lựa chọn không được để trống'),
  description: z.string().min(1, 'Mô tả phương án không được để trống'),
  nextNodeId: z.string().min(1, 'Vui lòng chọn Node tiếp theo'),
  consequence: z.string().min(1, 'Hậu quả (giảng viên định nghĩa) không được để trống'),
});

export const caseNodeSchema = z.object({
  id: z.string(),
  type: z.enum([NodeType.CONTEXT, NodeType.SITUATION, NodeType.TERMINAL]),
  title: z.string().min(1, 'Tiêu đề node không được để trống'),
  content: z.string().min(5, 'Nội dung node tối thiểu 5 ký tự'),
  promptQuestion: z.string().optional(),
  isPivotal: z.boolean().optional().default(false),
  outcomeLabel: z.nativeEnum(OutcomeLabel).optional(),
  relatedKnowledge: z.array(z.string()).optional().default([]),
  options: z.array(nodeOptionSchema).default([]),
});

export const studentReasoningSchema = z.object({
  attemptId: z.string().min(1),
  nodeId: z.string().min(1),
  content: z.string().min(20, 'Lập luận cần tối thiểu 20 ký tự (giải thích tại sao chọn phương án này, vì sao không chọn phương án khác và dữ liệu/kiến thức áp dụng)'),
});

export const challengeResponseSchema = z.object({
  reasoningId: z.string().min(1),
  roundNo: z.union([z.literal(1), z.literal(2)]),
  answer: z.string().min(10, 'Câu trả lời thử thách tối thiểu 10 ký tự'),
});

export const reflectionSchema = z.object({
  attemptId: z.string().min(1),
  pivotalDecisionStep: z.string().min(5, 'Vui lòng nêu rõ bước quyết định then chốt nhất'),
  whatToChangeIfRetrying: z.string().min(10, 'Vui lòng nêu điều bạn muốn thay đổi nếu làm lại'),
  keyTakeaways: z.string().min(10, 'Vui lòng nêu bài học rút ra'),
});

export const lecturerFeedbackSchema = z.object({
  attemptId: z.string().min(1),
  generalComment: z.string().min(5, 'Nhận xét chung cho sinh viên tối thiểu 5 ký tự'),
  decisionNotes: z.record(z.string()).optional(),
});

export const rubricEvaluationSchema = z.object({
  caseId: z.string().min(1),
  realism: z.number().min(1).max(5),
  difficulty: z.number().min(1).max(5),
  alignment: z.number().min(1).max(5),
  comment: z.string().min(5, 'Nhận xét đánh giá chuyên môn tối thiểu 5 ký tự'),
});

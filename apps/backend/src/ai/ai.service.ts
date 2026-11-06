import { Injectable, BadRequestException } from '@nestjs/common';
import { CaseMode, NodeType, OutcomeLabel } from '@edubranch/shared';

export interface IAiService {
  generateCaseDraft(prompt: string, options?: any): Promise<any>;
  generateChallengeQuestion(reasoning: string, roundNo: number): Promise<string>;
  analyzeReasoning(reasoning: string): Promise<string>;
}

@Injectable()
export class AiService implements IAiService {
  async generateCaseDraft(prompt: string, options?: any) {
    // Returns valid JSON Schema for Case Draft
    return {
      title: prompt || 'Tình huống giả định AI',
      nodes: [
        {
          id: 'node-ai-root',
          type: NodeType.SITUATION,
          title: 'Tình huống 1: Sự cố bất ngờ',
          content: 'Nội dung tình huống được tạo bởi AI...',
          isPivotal: true,
          options: [
            {
              id: 'opt-ai-1',
              label: 'Phương án A',
              description: 'Mô tả phương án A',
              nextNodeId: 'node-ai-terminal-1',
              consequence: 'Hậu quả của phương án A',
            },
          ],
        },
        {
          id: 'node-ai-terminal-1',
          type: NodeType.TERMINAL,
          title: 'Kết quả 1: Thành công',
          content: 'Mô tả kết quả đạt được...',
          outcomeLabel: OutcomeLabel.EXCELLENT,
          options: [],
        },
      ],
    };
  }

  async generateChallengeQuestion(reasoning: string, roundNo: number): Promise<string> {
    // Strictly enforce roundNo <= 2
    if (roundNo > 2) {
      throw new BadRequestException('Giới hạn tối đa 2 vòng phản biện từ AI');
    }

    if (roundNo === 1) {
      return 'Tại sao bạn tin rằng phương án này sẽ giải quyết được nút thắt cổ chai mà không gây ra tác dụng phụ tiêu cực cho các bộ phận liên quan?';
    }

    return 'Nếu tình huống phát sinh thêm yếu tố bất lợi ngoài dự kiến, bạn có kế hoạch dự phòng (Fallback Plan) nào để giảm thiểu rủi ro?';
  }

  async analyzeReasoning(reasoning: string): Promise<string> {
    return 'Gợi ý phân tích cho Giảng viên: Sinh viên đã nhận diện đúng vấn đề cốt lõi. Cần lưu ý thêm về các giả định thực tiễn.';
  }
}

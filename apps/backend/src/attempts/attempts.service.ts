import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class AttemptsService {
  validateChallengeRoundCount(currentCount: number) {
    if (currentCount >= 2) {
      throw new BadRequestException(
        'Quy tắc nghiệp vụ: Mỗi lập luận chỉ được phép có tối đa 2 vòng câu hỏi phản biện từ AI.'
      );
    }
  }
}

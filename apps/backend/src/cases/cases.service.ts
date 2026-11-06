import { Injectable, BadRequestException } from '@nestjs/common';
import { validateCaseTree, CaseNode, CaseStatus } from '@edubranch/shared';

@Injectable()
export class CasesService {
  validateTree(nodes: CaseNode[], rootNodeId: string) {
    const result = validateCaseTree(nodes, rootNodeId);
    if (!result.isValid) {
      throw new BadRequestException({
        message: 'Cây kịch bản không hợp lệ',
        errors: result.errors,
      });
    }
    return result;
  }

  // Security & Pedagogical Rule: Strip consequences during play
  sanitizeCaseForStudentPlay(caseData: any, isFinished: boolean) {
    if (isFinished) return caseData;

    return {
      ...caseData,
      nodes: caseData.nodes.map((node: any) => ({
        ...node,
        options: node.options?.map((opt: any) => {
          const { consequence, ...safeOption } = opt;
          return safeOption;
        }),
      })),
    };
  }
}

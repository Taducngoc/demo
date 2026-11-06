import {
  UserRole,
  UserStatus,
  CaseMode,
  CaseStatus,
  CaseSource,
  NodeType,
  OutcomeLabel,
  AttemptStatus,
  MaterialStatus,
} from './enums';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
  studentCode?: string;
  department?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  term: string;
  description: string;
  lecturerId: string;
  lecturerName?: string;
  classCode: string;
  createdAt: string;
  studentCount?: number;
  caseCount?: number;
}

export interface Enrollment {
  id: string;
  courseId: string;
  studentId: string;
  enrolledAt: string;
  student?: User;
}

export interface Material {
  id: string;
  courseId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  status: MaterialStatus;
  uploadedAt: string;
}

export interface MaterialChunk {
  id: string;
  materialId: string;
  content: string;
  embeddingRef?: string;
}

export interface CaseOption {
  id: string;
  nodeId: string;
  label: string;
  description: string;
  nextNodeId: string;
  consequence: string; // Revealed only in Journey Review, NOT during play!
}

export interface CaseNode {
  id: string;
  caseId: string;
  type: NodeType;
  title: string;
  content: string;
  dataJson?: {
    type?: 'table' | 'metrics' | 'document' | 'chart';
    title?: string;
    items?: Record<string, any>;
    rawText?: string;
  };
  promptQuestion?: string;
  isPivotal?: boolean;
  outcomeLabel?: OutcomeLabel;
  relatedKnowledge?: string[];
  options: CaseOption[];
  isAiGenerated?: boolean;
  isLecturerEdited?: boolean;
}

export interface Case {
  id: string;
  courseId: string;
  courseName?: string;
  authorId: string;
  authorName?: string;
  title: string;
  description?: string;
  mode: CaseMode;
  status: CaseStatus;
  source: CaseSource;
  rootNodeId: string;
  dueDate?: string;
  version: number;
  nodes: CaseNode[];
  createdAt: string;
  updatedAt?: string;
  // For Review Study
  reviewContext?: string;
  reviewData?: string;
  reviewProblem?: string;
  analysisGuidelines?: string;
  feedbackCriteria?: string;
}

export interface CaseVersion {
  id: string;
  caseId: string;
  versionNumber: number;
  snapshotJson: string;
  createdAt: string;
  createdBy: string;
}

export interface AttemptStep {
  id: string;
  attemptId: string;
  nodeId: string;
  optionId?: string;
  stepOrder: number;
  nodeTitle?: string;
  chosenOptionLabel?: string;
  timestamp: string;
}

export interface ChallengeRound {
  id: string;
  reasoningId: string;
  roundNo: 1 | 2;
  aiQuestion: string;
  studentAnswer?: string;
  createdAt: string;
  answeredAt?: string;
}

export interface Reasoning {
  id: string;
  attemptId: string;
  nodeId: string; // Pivotal decision point node ID
  nodeTitle?: string;
  chosenOptionLabel?: string;
  content: string; // Student explanation: why chosen, why not alternatives, data used
  challengeRounds: ChallengeRound[]; // Strict maximum 2 rounds
  createdAt: string;
  updatedAt?: string;
}

export interface Reflection {
  id: string;
  attemptId: string;
  pivotalDecisionStep: string;
  whatToChangeIfRetrying: string;
  keyTakeaways: string;
  createdAt: string;
}

export interface ReviewFeedback {
  id: string;
  attemptId: string;
  lecturerId: string;
  lecturerName?: string;
  generalComment: string;
  decisionNotes?: Record<string, string>;
  createdAt: string;
}

export interface Attempt {
  id: string;
  caseId: string;
  caseTitle?: string;
  courseId?: string;
  courseName?: string;
  studentId: string;
  studentName?: string;
  studentCode?: string;
  attemptNo: number;
  status: AttemptStatus;
  startedAt: string;
  finishedAt?: string;
  steps: AttemptStep[];
  reasonings: Reasoning[];
  reflection?: Reflection;
  feedback?: ReviewFeedback;
  // For Review Study mode
  reviewSolution?: string;
  reviewReasoning?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'DEADLINE' | 'REVIEW' | 'APPROVAL';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface EvaluationRubric {
  id: string;
  caseId: string;
  caseTitle?: string;
  caseSource?: CaseSource;
  evaluatorId: string;
  evaluatorName?: string;
  realism: number; // 1 - 5
  difficulty: number; // 1 - 5
  alignment: number; // 1 - 5
  comment: string;
  createdAt: string;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  userId: string;
  userRole: UserRole;
  caseId?: string;
  answers: Record<string, number | string>; // Likert 1-5 + textual
  createdAt: string;
}

export interface AiCallLog {
  id: string;
  userId: string;
  userName?: string;
  task: 'CASE_GENERATION' | 'CHALLENGE_QUESTION' | 'ANALYSIS_SUGGESTION';
  model: string;
  tokensIn: number;
  tokensOut: number;
  costUsd: number;
  status: 'SUCCESS' | 'FAILED';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName?: string;
  action: string;
  targetType: string;
  targetId: string;
  metaJson?: Record<string, any>;
  ipAddress?: string;
  createdAt: string;
}

export interface TreeValidationError {
  nodeId?: string;
  optionId?: string;
  message: string;
  type: 'ORPHAN_NODE' | 'UNINTENDED_CYCLE' | 'MISSING_NEXT_NODE' | 'NO_OPTIONS' | 'NO_TERMINAL' | 'UNREACHABLE_TERMINAL' | 'ROOT_MISSING';
}

export interface TreeValidationWarning {
  nodeId?: string;
  optionId?: string;
  message: string;
  type: 'MISSING_CONSEQUENCE' | 'SINGLE_OPTION' | 'UNANNOTATED_PIVOTAL';
}

export interface TreeValidationResult {
  isValid: boolean;
  errors: TreeValidationError[];
  warnings: TreeValidationWarning[];
}

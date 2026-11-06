'use client';

import { create } from 'zustand';
import {
  User,
  Course,
  Material,
  Case,
  CaseNode,
  Attempt,
  AttemptStep,
  Reasoning,
  ChallengeRound,
  Reflection,
  ReviewFeedback,
  EvaluationRubric,
  SurveyResponse,
  AiCallLog,
  AuditLog,
  NotificationItem,
} from '@edubranch/shared';
import {
  UserRole,
  UserStatus,
  CaseStatus,
  CaseMode,
  CaseSource,
  NodeType,
  AttemptStatus,
  MaterialStatus,
} from '@edubranch/shared';
import {
  INITIAL_USERS,
  INITIAL_COURSES,
  INITIAL_MATERIALS,
  INITIAL_CASES,
  INITIAL_ATTEMPTS,
  INITIAL_EVALUATIONS,
  INITIAL_SURVEYS,
  INITIAL_AI_LOGS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
} from './mock-data';

interface MockStoreState {
  // Current session
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;

  // Data collections
  users: User[];
  courses: Course[];
  materials: Material[];
  cases: Case[];
  attempts: Attempt[];
  evaluations: EvaluationRubric[];
  surveys: SurveyResponse[];
  aiLogs: AiCallLog[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];

  // Admin Actions
  approveLecturer: (userId: string) => void;
  rejectLecturer: (userId: string, reason: string) => void;
  toggleUserLock: (userId: string) => void;
  resetUserPassword: (userId: string) => void;
  archiveCase: (caseId: string) => void;

  // Lecturer Actions
  createCourse: (data: Partial<Course>) => Course;
  transferCourse: (courseId: string, newLecturerId: string) => void;
  uploadMaterial: (courseId: string, fileName: string, fileSize: number) => Material;
  deleteMaterial: (materialId: string) => void;
  createCase: (data: Partial<Case>) => Case;
  updateCase: (caseId: string, data: Partial<Case>) => void;
  updateNode: (caseId: string, node: CaseNode) => void;
  deleteNode: (caseId: string, nodeId: string) => void;
  addNode: (caseId: string, node: CaseNode) => void;
  publishCase: (caseId: string, dueDate?: string) => void;
  saveReviewFeedback: (feedback: ReviewFeedback) => void;
  submitRubric: (rubric: Partial<EvaluationRubric>) => void;

  // Student Actions
  joinCourseByCode: (studentId: string, classCode: string) => boolean;
  startAttempt: (caseId: string, studentId: string) => Attempt;
  recordStep: (attemptId: string, nodeId: string, optionId?: string, nextNodeId?: string) => Attempt;
  submitReasoning: (attemptId: string, nodeId: string, content: string) => Reasoning;
  addChallengeRound: (reasoningId: string, roundNo: 1 | 2, aiQuestion: string, studentAnswer?: string) => void;
  answerChallengeRound: (reasoningId: string, roundNo: 1 | 2, answer: string) => void;
  submitReflection: (reflection: Reflection) => void;
  submitReviewStudy: (caseId: string, studentId: string, solution: string, reasoning: string) => Attempt;

  // Reset store to defaults
  resetToDefaults: () => void;
}

const STORAGE_KEY = 'edubranch_mock_store_v1';

function getInitialState() {
  if (typeof window === 'undefined') {
    return {
      currentUser: INITIAL_USERS[1], // Default: Dr. Nguyễn Văn An
      users: INITIAL_USERS,
      courses: INITIAL_COURSES,
      materials: INITIAL_MATERIALS,
      cases: INITIAL_CASES,
      attempts: INITIAL_ATTEMPTS,
      evaluations: INITIAL_EVALUATIONS,
      surveys: INITIAL_SURVEYS,
      aiLogs: INITIAL_AI_LOGS,
      auditLogs: INITIAL_AUDIT_LOGS,
      notifications: INITIAL_NOTIFICATIONS,
    };
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        currentUser: parsed.currentUser || INITIAL_USERS[1],
        users: parsed.users || INITIAL_USERS,
        courses: parsed.courses || INITIAL_COURSES,
        materials: parsed.materials || INITIAL_MATERIALS,
        cases: parsed.cases || INITIAL_CASES,
        attempts: parsed.attempts || INITIAL_ATTEMPTS,
        evaluations: parsed.evaluations || INITIAL_EVALUATIONS,
        surveys: parsed.surveys || INITIAL_SURVEYS,
        aiLogs: parsed.aiLogs || INITIAL_AI_LOGS,
        auditLogs: parsed.auditLogs || INITIAL_AUDIT_LOGS,
        notifications: parsed.notifications || INITIAL_NOTIFICATIONS,
      };
    }
  } catch (e) {
    console.error('Failed to parse saved mock state', e);
  }

  return {
    currentUser: INITIAL_USERS[1],
    users: INITIAL_USERS,
    courses: INITIAL_COURSES,
    materials: INITIAL_MATERIALS,
    cases: INITIAL_CASES,
    attempts: INITIAL_ATTEMPTS,
    evaluations: INITIAL_EVALUATIONS,
    surveys: INITIAL_SURVEYS,
    aiLogs: INITIAL_AI_LOGS,
    auditLogs: INITIAL_AUDIT_LOGS,
    notifications: INITIAL_NOTIFICATIONS,
  };
}

export const useMockStore = create<MockStoreState>((set, get) => {
  const saveState = (newState: Partial<MockStoreState>) => {
    if (typeof window !== 'undefined') {
      try {
        const fullState = { ...get(), ...newState };
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            currentUser: fullState.currentUser,
            users: fullState.users,
            courses: fullState.courses,
            materials: fullState.materials,
            cases: fullState.cases,
            attempts: fullState.attempts,
            evaluations: fullState.evaluations,
            surveys: fullState.surveys,
            aiLogs: fullState.aiLogs,
            auditLogs: fullState.auditLogs,
            notifications: fullState.notifications,
          })
        );
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
    }
  };

  return {
    ...getInitialState(),

    setCurrentUser: (user) => {
      set({ currentUser: user });
      saveState({ currentUser: user });
    },

    approveLecturer: (userId) => {
      const { users, auditLogs } = get();
      const updatedUsers = users.map((u) =>
        u.id === userId ? { ...u, status: UserStatus.ACTIVE } : u
      );
      const targetUser = users.find((u) => u.id === userId);
      const newAudit: AuditLog = {
        id: `audit-${Date.now()}`,
        actorId: get().currentUser?.id || 'admin',
        actorName: get().currentUser?.fullName || 'Admin',
        action: 'APPROVE_LECTURER',
        targetType: 'USER',
        targetId: userId,
        metaJson: { name: targetUser?.fullName, email: targetUser?.email },
        createdAt: new Date().toISOString(),
      };
      set({ users: updatedUsers, auditLogs: [newAudit, ...auditLogs] });
      saveState({ users: updatedUsers, auditLogs: [newAudit, ...auditLogs] });
    },

    rejectLecturer: (userId, reason) => {
      const { users, auditLogs } = get();
      const updatedUsers = users.map((u) =>
        u.id === userId ? { ...u, status: UserStatus.REJECTED, rejectionReason: reason } : u
      );
      const targetUser = users.find((u) => u.id === userId);
      const newAudit: AuditLog = {
        id: `audit-${Date.now()}`,
        actorId: get().currentUser?.id || 'admin',
        actorName: get().currentUser?.fullName || 'Admin',
        action: 'REJECT_LECTURER',
        targetType: 'USER',
        targetId: userId,
        metaJson: { name: targetUser?.fullName, reason },
        createdAt: new Date().toISOString(),
      };
      set({ users: updatedUsers, auditLogs: [newAudit, ...auditLogs] });
      saveState({ users: updatedUsers, auditLogs: [newAudit, ...auditLogs] });
    },

    toggleUserLock: (userId) => {
      const { users, auditLogs } = get();
      const updatedUsers = users.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === UserStatus.LOCKED ? UserStatus.ACTIVE : UserStatus.LOCKED;
          return { ...u, status: nextStatus };
        }
        return u;
      });
      const targetUser = users.find((u) => u.id === userId);
      const newAudit: AuditLog = {
        id: `audit-${Date.now()}`,
        actorId: get().currentUser?.id || 'admin',
        actorName: get().currentUser?.fullName || 'Admin',
        action: targetUser?.status === UserStatus.LOCKED ? 'UNLOCK_USER' : 'LOCK_USER',
        targetType: 'USER',
        targetId: userId,
        metaJson: { name: targetUser?.fullName },
        createdAt: new Date().toISOString(),
      };
      set({ users: updatedUsers, auditLogs: [newAudit, ...auditLogs] });
      saveState({ users: updatedUsers, auditLogs: [newAudit, ...auditLogs] });
    },

    resetUserPassword: (userId) => {
      const { auditLogs, users } = get();
      const targetUser = users.find((u) => u.id === userId);
      const newAudit: AuditLog = {
        id: `audit-${Date.now()}`,
        actorId: get().currentUser?.id || 'admin',
        actorName: get().currentUser?.fullName || 'Admin',
        action: 'RESET_PASSWORD',
        targetType: 'USER',
        targetId: userId,
        metaJson: { name: targetUser?.fullName },
        createdAt: new Date().toISOString(),
      };
      set({ auditLogs: [newAudit, ...auditLogs] });
      saveState({ auditLogs: [newAudit, ...auditLogs] });
    },

    archiveCase: (caseId) => {
      const { cases, auditLogs } = get();
      const updatedCases = cases.map((c) =>
        c.id === caseId ? { ...c, status: CaseStatus.ARCHIVED } : c
      );
      const targetCase = cases.find((c) => c.id === caseId);
      const newAudit: AuditLog = {
        id: `audit-${Date.now()}`,
        actorId: get().currentUser?.id || 'admin',
        actorName: get().currentUser?.fullName || 'Admin',
        action: 'ARCHIVE_CASE',
        targetType: 'CASE',
        targetId: caseId,
        metaJson: { title: targetCase?.title },
        createdAt: new Date().toISOString(),
      };
      set({ cases: updatedCases, auditLogs: [newAudit, ...auditLogs] });
      saveState({ cases: updatedCases, auditLogs: [newAudit, ...auditLogs] });
    },

    createCourse: (data) => {
      const newCourse: Course = {
        id: `course-${Date.now()}`,
        name: data.name || 'Khóa học mới',
        code: data.code || 'CODE101',
        term: data.term || 'Học kỳ I 2024-2025',
        description: data.description || '',
        lecturerId: get().currentUser?.id || 'lecturer-1',
        lecturerName: get().currentUser?.fullName || 'TS. Nguyễn Văn An',
        classCode: `CLS${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
        studentCount: 0,
        caseCount: 0,
      };
      const updated = [newCourse, ...get().courses];
      set({ courses: updated });
      saveState({ courses: updated });
      return newCourse;
    },

    transferCourse: (courseId, newLecturerId) => {
      const { courses, users } = get();
      const newLecturer = users.find((u) => u.id === newLecturerId);
      const updatedCourses = courses.map((c) =>
        c.id === courseId
          ? { ...c, lecturerId: newLecturerId, lecturerName: newLecturer?.fullName || 'Giảng viên' }
          : c
      );
      set({ courses: updatedCourses });
      saveState({ courses: updatedCourses });
    },

    uploadMaterial: (courseId, fileName, fileSize) => {
      const newMat: Material = {
        id: `mat-${Date.now()}`,
        courseId,
        fileName,
        fileUrl: `/uploads/${fileName}`,
        fileSize,
        status: MaterialStatus.PROCESSING,
        uploadedAt: new Date().toISOString(),
      };
      const updated = [newMat, ...get().materials];
      set({ materials: updated });
      saveState({ materials: updated });

      // Simulate indexing after 3 seconds
      setTimeout(() => {
        const currentMaterials = get().materials.map((m) =>
          m.id === newMat.id ? { ...m, status: MaterialStatus.INDEXED } : m
        );
        set({ materials: currentMaterials });
        saveState({ materials: currentMaterials });
      }, 3000);

      return newMat;
    },

    deleteMaterial: (materialId) => {
      const updated = get().materials.filter((m) => m.id !== materialId);
      set({ materials: updated });
      saveState({ materials: updated });
    },

    createCase: (data) => {
      const newCase: Case = {
        id: `case-${Date.now()}`,
        courseId: data.courseId || get().courses[0].id,
        courseName: get().courses.find((c) => c.id === data.courseId)?.name || 'Khóa học',
        authorId: get().currentUser?.id || 'lecturer-1',
        authorName: get().currentUser?.fullName || 'TS. Nguyễn Văn An',
        title: data.title || 'Case Study mới',
        description: data.description || '',
        mode: data.mode || CaseMode.BRANCHING,
        status: CaseStatus.DRAFT,
        source: data.source || CaseSource.AI_GENERATED,
        rootNodeId: data.rootNodeId || 'node-root-1',
        dueDate: data.dueDate,
        version: 1,
        createdAt: new Date().toISOString(),
        nodes: data.nodes || [],
        reviewContext: data.reviewContext,
        reviewData: data.reviewData,
        reviewProblem: data.reviewProblem,
        analysisGuidelines: data.analysisGuidelines,
        feedbackCriteria: data.feedbackCriteria,
      };

      const updated = [newCase, ...get().cases];
      set({ cases: updated });
      saveState({ cases: updated });
      return newCase;
    },

    updateCase: (caseId, data) => {
      const updatedCases = get().cases.map((c) =>
        c.id === caseId ? { ...c, ...data, updatedAt: new Date().toISOString() } : c
      );
      set({ cases: updatedCases });
      saveState({ cases: updatedCases });
    },

    updateNode: (caseId, updatedNode) => {
      const updatedCases = get().cases.map((c) => {
        if (c.id === caseId) {
          const newNodes = c.nodes.map((n) =>
            n.id === updatedNode.id ? { ...updatedNode, isLecturerEdited: true } : n
          );
          return { ...c, nodes: newNodes, updatedAt: new Date().toISOString() };
        }
        return c;
      });
      set({ cases: updatedCases });
      saveState({ cases: updatedCases });
    },

    deleteNode: (caseId, nodeId) => {
      const updatedCases = get().cases.map((c) => {
        if (c.id === caseId) {
          const newNodes = c.nodes.filter((n) => n.id !== nodeId);
          return { ...c, nodes: newNodes, updatedAt: new Date().toISOString() };
        }
        return c;
      });
      set({ cases: updatedCases });
      saveState({ cases: updatedCases });
    },

    addNode: (caseId, newNode) => {
      const updatedCases = get().cases.map((c) => {
        if (c.id === caseId) {
          return { ...c, nodes: [...c.nodes, newNode], updatedAt: new Date().toISOString() };
        }
        return c;
      });
      set({ cases: updatedCases });
      saveState({ cases: updatedCases });
    },

    publishCase: (caseId, dueDate) => {
      const updatedCases = get().cases.map((c) =>
        c.id === caseId
          ? {
              ...c,
              status: CaseStatus.PUBLISHED,
              dueDate: dueDate || c.dueDate || '2026-12-01T23:59:00Z',
              updatedAt: new Date().toISOString(),
            }
          : c
      );
      const targetCase = get().cases.find((c) => c.id === caseId);
      const newAudit: AuditLog = {
        id: `audit-${Date.now()}`,
        actorId: get().currentUser?.id || 'lecturer-1',
        actorName: get().currentUser?.fullName || 'TS. Nguyễn Văn An',
        action: 'PUBLISH_CASE',
        targetType: 'CASE',
        targetId: caseId,
        metaJson: { title: targetCase?.title },
        createdAt: new Date().toISOString(),
      };
      set({ cases: updatedCases, auditLogs: [newAudit, ...get().auditLogs] });
      saveState({ cases: updatedCases, auditLogs: [newAudit, ...get().auditLogs] });
    },

    saveReviewFeedback: (feedback) => {
      const { attempts } = get();
      const updatedAttempts = attempts.map((a) =>
        a.id === feedback.attemptId
          ? { ...a, feedback, status: AttemptStatus.REVIEWED }
          : a
      );
      set({ attempts: updatedAttempts });
      saveState({ attempts: updatedAttempts });
    },

    submitRubric: (rubricData) => {
      const { evaluations, currentUser, cases } = get();
      const targetCase = cases.find((c) => c.id === rubricData.caseId);
      const newRubric: EvaluationRubric = {
        id: `eval-${Date.now()}`,
        caseId: rubricData.caseId || '',
        caseTitle: targetCase?.title,
        caseSource: targetCase?.source,
        evaluatorId: currentUser?.id || 'lecturer-1',
        evaluatorName: currentUser?.fullName || 'Giảng viên',
        realism: rubricData.realism || 4,
        difficulty: rubricData.difficulty || 3,
        alignment: rubricData.alignment || 4,
        comment: rubricData.comment || '',
        createdAt: new Date().toISOString(),
      };
      const updated = [newRubric, ...evaluations];
      set({ evaluations: updated });
      saveState({ evaluations: updated });
    },

    joinCourseByCode: (studentId, classCode) => {
      const course = get().courses.find(
        (c) => c.classCode.toUpperCase() === classCode.trim().toUpperCase()
      );
      if (!course) return false;
      const updatedCourses = get().courses.map((c) =>
        c.id === course.id ? { ...c, studentCount: (c.studentCount || 0) + 1 } : c
      );
      set({ courses: updatedCourses });
      saveState({ courses: updatedCourses });
      return true;
    },

    startAttempt: (caseId, studentId) => {
      const { cases, currentUser, attempts } = get();
      const targetCase = cases.find((c) => c.id === caseId);
      const prevAttempts = attempts.filter(
        (a) => a.caseId === caseId && a.studentId === studentId
      );
      const rootNode = targetCase?.nodes.find((n) => n.id === targetCase.rootNodeId);

      const newAttempt: Attempt = {
        id: `attempt-${Date.now()}`,
        caseId,
        caseTitle: targetCase?.title || 'Case Study',
        courseId: targetCase?.courseId,
        courseName: targetCase?.courseName,
        studentId,
        studentName: currentUser?.fullName || 'Sinh viên',
        studentCode: currentUser?.studentCode || '21020000',
        attemptNo: prevAttempts.length + 1,
        status: AttemptStatus.IN_PROGRESS,
        startedAt: new Date().toISOString(),
        steps: rootNode
          ? [
              {
                id: `step-${Date.now()}`,
                attemptId: `attempt-${Date.now()}`,
                nodeId: rootNode.id,
                stepOrder: 1,
                nodeTitle: rootNode.title,
                timestamp: new Date().toISOString(),
              },
            ]
          : [],
        reasonings: [],
      };

      const updated = [newAttempt, ...attempts];
      set({ attempts: updated });
      saveState({ attempts: updated });
      return newAttempt;
    },

    recordStep: (attemptId, nodeId, optionId, nextNodeId) => {
      const { attempts, cases } = get();
      let updatedAttempt: Attempt | null = null;

      const updatedAttempts = attempts.map((a) => {
        if (a.id === attemptId) {
          const targetCase = cases.find((c) => c.id === a.caseId);
          const currentNode = targetCase?.nodes.find((n) => n.id === nodeId);
          const chosenOption = currentNode?.options.find((o) => o.id === optionId);
          const nextNode = targetCase?.nodes.find((n) => n.id === nextNodeId);

          const updatedSteps = a.steps.map((s) => {
            if (s.nodeId === nodeId) {
              return {
                ...s,
                optionId,
                chosenOptionLabel: chosenOption?.label,
              };
            }
            return s;
          });

          if (nextNode && !updatedSteps.some((s) => s.nodeId === nextNode.id)) {
            updatedSteps.push({
              id: `step-${Date.now()}`,
              attemptId: a.id,
              nodeId: nextNode.id,
              stepOrder: updatedSteps.length + 1,
              nodeTitle: nextNode.title,
              timestamp: new Date().toISOString(),
            });
          }

          const isTerminal = nextNode?.type === NodeType.TERMINAL;
          const status = isTerminal ? AttemptStatus.REVIEWING : AttemptStatus.IN_PROGRESS;

          updatedAttempt = {
            ...a,
            steps: updatedSteps,
            status,
            finishedAt: isTerminal ? new Date().toISOString() : a.finishedAt,
          };
          return updatedAttempt;
        }
        return a;
      });

      set({ attempts: updatedAttempts });
      saveState({ attempts: updatedAttempts });
      return updatedAttempt || attempts[0];
    },

    submitReasoning: (attemptId, nodeId, content) => {
      const { attempts, cases } = get();
      const targetCase = cases.find((c) => c.nodes.some((n) => n.id === nodeId));
      const targetNode = targetCase?.nodes.find((n) => n.id === nodeId);
      const attempt = attempts.find((a) => a.id === attemptId);
      const step = attempt?.steps.find((s) => s.nodeId === nodeId);

      const newReasoning: Reasoning = {
        id: `reasoning-${Date.now()}`,
        attemptId,
        nodeId,
        nodeTitle: targetNode?.title,
        chosenOptionLabel: step?.chosenOptionLabel,
        content,
        challengeRounds: [],
        createdAt: new Date().toISOString(),
      };

      const updatedAttempts = attempts.map((a) => {
        if (a.id === attemptId) {
          const filtered = a.reasonings.filter((r) => r.nodeId !== nodeId);
          return { ...a, reasonings: [...filtered, newReasoning] };
        }
        return a;
      });

      set({ attempts: updatedAttempts });
      saveState({ attempts: updatedAttempts });
      return newReasoning;
    },

    addChallengeRound: (reasoningId, roundNo, aiQuestion, studentAnswer) => {
      // Backend & Frontend strict limit: roundNo <= 2
      if (roundNo > 2) return;

      const { attempts, aiLogs, currentUser } = get();
      const newRound: ChallengeRound = {
        id: `cr-${Date.now()}`,
        reasoningId,
        roundNo,
        aiQuestion,
        studentAnswer,
        createdAt: new Date().toISOString(),
        answeredAt: studentAnswer ? new Date().toISOString() : undefined,
      };

      const updatedAttempts = attempts.map((a) => {
        const reasoning = a.reasonings.find((r) => r.id === reasoningId);
        if (reasoning) {
          // Strictly limit to 2 rounds
          if (reasoning.challengeRounds.length >= 2) return a;
          const updatedReasonings = a.reasonings.map((r) =>
            r.id === reasoningId
              ? { ...r, challengeRounds: [...r.challengeRounds, newRound] }
              : r
          );
          return { ...a, reasonings: updatedReasonings };
        }
        return a;
      });

      const newAiLog: AiCallLog = {
        id: `log-${Date.now()}`,
        userId: currentUser?.id || 'student',
        userName: currentUser?.fullName,
        task: 'CHALLENGE_QUESTION',
        model: 'gemini-1.5-flash',
        tokensIn: 800 + Math.floor(Math.random() * 200),
        tokensOut: 180 + Math.floor(Math.random() * 50),
        costUsd: 0.0004,
        status: 'SUCCESS',
        createdAt: new Date().toISOString(),
      };

      set({ attempts: updatedAttempts, aiLogs: [newAiLog, ...aiLogs] });
      saveState({ attempts: updatedAttempts, aiLogs: [newAiLog, ...aiLogs] });
    },

    answerChallengeRound: (reasoningId, roundNo, answer) => {
      const { attempts } = get();
      const updatedAttempts = attempts.map((a) => {
        const hasReasoning = a.reasonings.some((r) => r.id === reasoningId);
        if (hasReasoning) {
          const updatedReasonings = a.reasonings.map((r) => {
            if (r.id === reasoningId) {
              const updatedRounds = r.challengeRounds.map((cr) =>
                cr.roundNo === roundNo
                  ? { ...cr, studentAnswer: answer, answeredAt: new Date().toISOString() }
                  : cr
              );
              return { ...r, challengeRounds: updatedRounds };
            }
            return r;
          });
          return { ...a, reasonings: updatedReasonings };
        }
        return a;
      });
      set({ attempts: updatedAttempts });
      saveState({ attempts: updatedAttempts });
    },

    submitReflection: (reflection) => {
      const { attempts } = get();
      const updatedAttempts = attempts.map((a) =>
        a.id === reflection.attemptId
          ? { ...a, reflection, status: AttemptStatus.SUBMITTED }
          : a
      );
      set({ attempts: updatedAttempts });
      saveState({ attempts: updatedAttempts });
    },

    submitReviewStudy: (caseId, studentId, solution, reasoning) => {
      const { cases, currentUser, attempts } = get();
      const targetCase = cases.find((c) => c.id === caseId);
      const prevAttempts = attempts.filter(
        (a) => a.caseId === caseId && a.studentId === studentId
      );

      const newAttempt: Attempt = {
        id: `attempt-review-${Date.now()}`,
        caseId,
        caseTitle: targetCase?.title,
        courseId: targetCase?.courseId,
        courseName: targetCase?.courseName,
        studentId,
        studentName: currentUser?.fullName || 'Sinh viên',
        studentCode: currentUser?.studentCode || '21020000',
        attemptNo: prevAttempts.length + 1,
        status: AttemptStatus.SUBMITTED,
        startedAt: new Date().toISOString(),
        finishedAt: new Date().toISOString(),
        steps: [],
        reasonings: [],
        reviewSolution: solution,
        reviewReasoning: reasoning,
      };

      const updated = [newAttempt, ...attempts];
      set({ attempts: updated });
      saveState({ attempts: updated });
      return newAttempt;
    },

    resetToDefaults: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
      set({
        currentUser: INITIAL_USERS[1],
        users: INITIAL_USERS,
        courses: INITIAL_COURSES,
        materials: INITIAL_MATERIALS,
        cases: INITIAL_CASES,
        attempts: INITIAL_ATTEMPTS,
        evaluations: INITIAL_EVALUATIONS,
        surveys: INITIAL_SURVEYS,
        aiLogs: INITIAL_AI_LOGS,
        auditLogs: INITIAL_AUDIT_LOGS,
        notifications: INITIAL_NOTIFICATIONS,
      });
    },
  };
});

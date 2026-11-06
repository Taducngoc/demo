import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import { validateCaseTree } from './tree-validator';
import { NodeType, OutcomeLabel } from './enums';
import { CaseNode } from './types';

describe('Tree Validator Tests', () => {
  test('Should detect valid tree with branches reaching terminal', () => {
    const nodes: CaseNode[] = [
      {
        id: 'root',
        caseId: 'test',
        type: NodeType.SITUATION,
        title: 'Tình huống 1',
        content: 'Nội dung',
        options: [
          { id: 'opt1', nodeId: 'root', label: 'Phương án A', description: '', nextNodeId: 'term1', consequence: 'Hậu quả' },
        ],
      },
      {
        id: 'term1',
        caseId: 'test',
        type: NodeType.TERMINAL,
        title: 'Kết quả 1',
        content: 'Hoàn thành',
        outcomeLabel: OutcomeLabel.EXCELLENT,
        options: [],
      },
    ];

    const result = validateCaseTree(nodes, 'root');
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.errors.length, 0);
  });

  test('Should detect orphan nodes (nodes unreachable from root)', () => {
    const nodes: CaseNode[] = [
      {
        id: 'root',
        caseId: 'test',
        type: NodeType.SITUATION,
        title: 'Tình huống 1',
        content: 'Nội dung',
        options: [
          { id: 'opt1', nodeId: 'root', label: 'Phương án A', description: '', nextNodeId: 'term1', consequence: 'Hậu quả' },
        ],
      },
      {
        id: 'orphan-node',
        caseId: 'test',
        type: NodeType.SITUATION,
        title: 'Node mồ côi',
        content: 'Không ai trỏ tới',
        options: [],
      },
      {
        id: 'term1',
        caseId: 'test',
        type: NodeType.TERMINAL,
        title: 'Kết quả 1',
        content: 'Hoàn thành',
        outcomeLabel: OutcomeLabel.EXCELLENT,
        options: [],
      },
    ];

    const result = validateCaseTree(nodes, 'root');
    assert.strictEqual(result.isValid, false);
    const hasOrphanError = result.errors.some((e) => e.type === 'ORPHAN_NODE' && e.nodeId === 'orphan-node');
    assert.strictEqual(hasOrphanError, true);
  });

  test('Should detect unintended cycle / dead-end where path cannot reach any Terminal', () => {
    const nodes: CaseNode[] = [
      {
        id: 'root',
        caseId: 'test',
        type: NodeType.SITUATION,
        title: 'Tình huống 1',
        content: 'Nội dung',
        options: [
          { id: 'opt1', nodeId: 'root', label: 'Vào vòng lặp', description: '', nextNodeId: 'loop1', consequence: 'Lặp' },
        ],
      },
      {
        id: 'loop1',
        caseId: 'test',
        type: NodeType.SITUATION,
        title: 'Vòng lặp 1',
        content: 'Trỏ sang loop2',
        options: [
          { id: 'opt2', nodeId: 'loop1', label: 'Sang 2', description: '', nextNodeId: 'loop2', consequence: 'Lặp' },
        ],
      },
      {
        id: 'loop2',
        caseId: 'test',
        type: NodeType.SITUATION,
        title: 'Vòng lặp 2',
        content: 'Trỏ ngược về loop1',
        options: [
          { id: 'opt3', nodeId: 'loop2', label: 'Quay lại 1', description: '', nextNodeId: 'loop1', consequence: 'Lặp' },
        ],
      },
      {
        id: 'term1',
        caseId: 'test',
        type: NodeType.TERMINAL,
        title: 'Kết quả không ai đến được',
        content: 'Terminal',
        outcomeLabel: OutcomeLabel.EXCELLENT,
        options: [],
      },
    ];

    const result = validateCaseTree(nodes, 'root');
    assert.strictEqual(result.isValid, false);
    const hasCycleError = result.errors.some((e) => e.type === 'UNINTENDED_CYCLE');
    assert.strictEqual(hasCycleError, true);
  });

  test('Should reject tree without any Terminal node', () => {
    const nodes: CaseNode[] = [
      {
        id: 'root',
        caseId: 'test',
        type: NodeType.SITUATION,
        title: 'Tình huống 1',
        content: 'Nội dung',
        options: [],
      },
    ];

    const result = validateCaseTree(nodes, 'root');
    assert.strictEqual(result.isValid, false);
    const hasNoTerminal = result.errors.some((e) => e.type === 'NO_TERMINAL');
    assert.strictEqual(hasNoTerminal, true);
  });
});

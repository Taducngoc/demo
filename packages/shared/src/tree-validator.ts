import { CaseNode, TreeValidationError, TreeValidationWarning, TreeValidationResult } from './types';
import { NodeType } from './enums';

export function validateCaseTree(nodes: CaseNode[], rootNodeId: string): TreeValidationResult {
  const errors: TreeValidationError[] = [];
  const warnings: TreeValidationWarning[] = [];

  const nodeMap = new Map<string, CaseNode>();
  nodes.forEach((n) => nodeMap.set(n.id, n));

  // 1. Check root node existence
  if (!rootNodeId || !nodeMap.has(rootNodeId)) {
    errors.push({
      type: 'ROOT_MISSING',
      message: 'Cây chưa có Node gốc (Root Node) hợp lệ.',
    });
    return { isValid: false, errors, warnings };
  }

  // 2. Check for terminal presence
  const terminalNodes = nodes.filter((n) => n.type === NodeType.TERMINAL);
  if (terminalNodes.length === 0) {
    errors.push({
      type: 'NO_TERMINAL',
      message: 'Cây quyết định phải có ít nhất một Kết quả kết thúc (Terminal Node).',
    });
  }

  // 3. Check node options and nextNode targets
  nodes.forEach((node) => {
    if (node.type !== NodeType.TERMINAL) {
      if (!node.options || node.options.length === 0) {
        errors.push({
          nodeId: node.id,
          type: 'NO_OPTIONS',
          message: `Node "${node.title || node.id}" không có phương án lựa chọn nào.`,
        });
      } else {
        if (node.options.length === 1) {
          warnings.push({
            nodeId: node.id,
            type: 'SINGLE_OPTION',
            message: `Node "${node.title}" chỉ có 1 phương án duy nhất.`,
          });
        }

        node.options.forEach((opt, idx) => {
          if (!opt.nextNodeId || !nodeMap.has(opt.nextNodeId)) {
            errors.push({
              nodeId: node.id,
              optionId: opt.id,
              type: 'MISSING_NEXT_NODE',
              message: `Phương án ${idx + 1} ("${opt.label || 'Chưa đặt tên'}") chưa liên kết tới Node tiếp theo hợp lệ.`,
            });
          }

          if (!opt.consequence || opt.consequence.trim() === '') {
            warnings.push({
              nodeId: node.id,
              optionId: opt.id,
              type: 'MISSING_CONSEQUENCE',
              message: `Phương án "${opt.label}" chưa có mô tả hậu quả (consequence).`,
            });
          }
        });
      }
    }
  });

  // 4. Reachability from Root (Orphan check)
  const reachableFromRoot = new Set<string>();
  const queue: string[] = [rootNodeId];
  reachableFromRoot.add(rootNodeId);

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const currentNode = nodeMap.get(currentId);
    if (!currentNode) continue;

    if (currentNode.options) {
      for (const opt of currentNode.options) {
        if (opt.nextNodeId && nodeMap.has(opt.nextNodeId) && !reachableFromRoot.has(opt.nextNodeId)) {
          reachableFromRoot.add(opt.nextNodeId);
          queue.push(opt.nextNodeId);
        }
      }
    }
  }

  nodes.forEach((node) => {
    if (!reachableFromRoot.has(node.id)) {
      errors.push({
        nodeId: node.id,
        type: 'ORPHAN_NODE',
        message: `Node "${node.title || node.id}" bị mồ côi (không thể đi tới từ Node gốc).`,
      });
    }
  });

  // 5. Unreachable Terminals
  terminalNodes.forEach((tNode) => {
    if (!reachableFromRoot.has(tNode.id)) {
      errors.push({
        nodeId: tNode.id,
        type: 'UNREACHABLE_TERMINAL',
        message: `Kết quả Terminal "${tNode.title || tNode.id}" không thể đạt tới từ nhánh nào.`,
      });
    }
  });

  // 6. Check for Dead-End / Unintended Cycles (Paths that can NEVER reach any Terminal)
  // Compute reverse reachability from all Terminals
  const canReachTerminal = new Set<string>();
  terminalNodes.forEach((t) => canReachTerminal.add(t.id));

  let changed = true;
  while (changed) {
    changed = false;
    for (const node of nodes) {
      if (canReachTerminal.has(node.id)) continue;
      if (node.options && node.options.length > 0) {
        // If at least one option reaches a terminal-capable node
        const hasExit = node.options.some((opt) => opt.nextNodeId && canReachTerminal.has(opt.nextNodeId));
        if (hasExit) {
          canReachTerminal.add(node.id);
          changed = true;
        }
      }
    }
  }

  reachableFromRoot.forEach((nodeId) => {
    const node = nodeMap.get(nodeId);
    if (node && node.type !== NodeType.TERMINAL && !canReachTerminal.has(nodeId)) {
      errors.push({
        nodeId: node.id,
        type: 'UNINTENDED_CYCLE',
        message: `Node "${node.title}" nằm trong vòng lặp kín hoặc ngõ cụt không có lối thoát tới Terminal.`,
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

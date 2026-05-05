/**
 * Task State Machine for Family Earn
 * 
 * States: new | pending | approved | rejected
 * 
 * Transitions:
 * NEW → PENDING (child completes)
 * NEW → REJECTED (not allowed directly, must go through pending)
 * PENDING → APPROVED (parent approves)
 * PENDING → REJECTED (parent rejects)
 * REJECTED → PENDING (child re-completes)
 * REJECTED → APPROVED (parent approves without rework)
 * APPROVED → (no transitions, final state)
 */

// Status constants
export const TASK_STATUS = {
  NEW: 'new',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

// Allowed transitions map
const ALLOWED_TRANSITIONS = {
  [TASK_STATUS.NEW]: [TASK_STATUS.PENDING],
  [TASK_STATUS.PENDING]: [TASK_STATUS.APPROVED, TASK_STATUS.REJECTED],
  [TASK_STATUS.REJECTED]: [TASK_STATUS.PENDING, TASK_STATUS.APPROVED],
  [TASK_STATUS.APPROVED]: [], // Final state, no transitions allowed
};

// Actions allowed per status
const ACTIONS_BY_STATUS = {
  [TASK_STATUS.NEW]: ['edit', 'delete', 'complete'],
  [TASK_STATUS.PENDING]: ['approve', 'reject'],
  [TASK_STATUS.REJECTED]: ['complete', 'approve', 'reject'],
  [TASK_STATUS.APPROVED]: [], // No actions allowed
};

/**
 * Check if a transition is allowed
 * @param {string} fromStatus - Current status
 * @param {string} toStatus - Target status
 * @returns {boolean}
 */
export function canTransition(fromStatus, toStatus) {
  const allowedTargets = ALLOWED_TRANSITIONS[fromStatus];
  return allowedTargets ? allowedTargets.includes(toStatus) : false;
}

/**
 * Check if an action is allowed for a task
 * @param {object} task - Task object
 * @param {string} action - Action name (edit, delete, complete, approve, reject)
 * @returns {boolean}
 */
export function canPerformAction(task, action) {
  if (!task || !task.status) return false;
  const allowedActions = ACTIONS_BY_STATUS[task.status];
  return allowedActions ? allowedActions.includes(action) : false;
}

/**
 * Helper functions for common checks
 */
export function canEdit(task) {
  return canPerformAction(task, 'edit');
}

export function canDelete(task) {
  return canPerformAction(task, 'delete');
}

export function canComplete(task) {
  return canPerformAction(task, 'complete');
}

export function canApprove(task) {
  return canPerformAction(task, 'approve');
}

export function canReject(task) {
  return canPerformAction(task, 'reject');
}

/**
 * Validate and perform a state transition
 * @param {object} task - Current task
 * @param {string} newStatus - Target status
 * @returns {object|null} - Updated task or null if invalid
 */
export function transitionTo(task, newStatus) {
  if (!canTransition(task.status, newStatus)) {
    console.warn(`Invalid state transition: ${task.status} → ${newStatus}`);
    return null;
  }
  return { ...task, status: newStatus };
}

/**
 * Get status configuration for UI display
 * @param {string} status - Task status
 * @returns {{ label: string, color: string, symbol: string }}
 */
export function getStatusConfig(status) {
  switch (status) {
    case TASK_STATUS.NEW:
      return { label: 'Новая', color: 'var(--color-accent-blue)', symbol: 'N' };
    case TASK_STATUS.PENDING:
      return { label: 'На проверке', color: 'var(--color-accent-yellow)', symbol: 'P' };
    case TASK_STATUS.APPROVED:
      return { label: 'Выполнена', color: 'var(--color-accent-green)', symbol: '✓' };
    case TASK_STATUS.REJECTED:
      return { label: 'На доработке', color: 'var(--color-accent-red)', symbol: 'R' };
    default:
      return { label: 'Неизвестно', color: 'var(--color-accent-blue)', symbol: '?' };
  }
}

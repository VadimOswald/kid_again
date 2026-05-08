import { useState, useCallback } from 'react';
import { 
  TASK_STATUS, 
  canTransition, 
  canPerformAction,
  canEdit,
  canDelete,
  canComplete,
  canApprove,
  canReject,
  getStatusConfig,
} from '../utils/taskStateMachine';

/**
 * Centralized task management hook
 * Provides all task operations with state machine validation
 */
export function useTaskManager(initialTasks = [], initialBalance = 0) {
  const [tasks, setTasks] = useState(initialTasks);
  const [balance, setBalance] = useState(initialBalance);
  const [approvedTaskIds, setApprovedTaskIds] = useState(new Set());

  /**
   * Add a new task (always starts with status "new")
   */
  const addTask = useCallback((title, description = '', reward = 0, icon = 'cleaning') => {
    const newTask = {
      id: Date.now(),
      title,
      description,
      reward,
      icon,
      status: TASK_STATUS.NEW,
      comment: null,
    };
    setTasks(prev => [...prev, newTask]);
    return newTask;
  }, []);

  /**
   * Complete a task (child action)
   * Transitions: new → pending OR rejected → pending
   */
  const completeTask = useCallback((id) => {
    let updated = false;
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        if (!canPerformAction(task, 'complete')) {
          console.warn(`Invalid action: cannot complete task with status "${task.status}"`);
          return task;
        }
        updated = true;
        return { ...task, status: TASK_STATUS.PENDING };
      }
      return task;
    }));
    return updated;
  }, []);

  /**
   * Approve a task (parent action)
   * Transitions: pending → approved OR rejected → approved
   * Increases balance only on first approval
   */
  const approveTask = useCallback((id) => {
    let reward = 0;
    let updated = false;

    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        if (!canPerformAction(task, 'approve')) {
          console.warn(`Invalid action: cannot approve task with status "${task.status}"`);
          return task;
        }
        
        // Only add reward if not already approved
        if (!approvedTaskIds.has(id)) {
          reward = task.reward;
          setApprovedTaskIds(prev => new Set(prev).add(id));
        }
        
        updated = true;
        return { ...task, status: TASK_STATUS.APPROVED };
      }
      return task;
    }));

    if (reward > 0) {
      setBalance(prev => prev + reward);
    }
    
    return { updated, reward };
  }, [approvedTaskIds]);

  /**
   * Reject a task (parent action)
   * Transitions: pending → rejected
   * Saves comment for feedback
   */
  const rejectTask = useCallback((id, comment = '') => {
    let updated = false;

    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        if (!canPerformAction(task, 'reject')) {
          console.warn(`Invalid action: cannot reject task with status "${task.status}"`);
          return task;
        }
        updated = true;
        return { 
          ...task, 
          status: TASK_STATUS.REJECTED,
          comment: comment || null,
        };
      }
      return task;
    }));

    return updated;
  }, []);

  /**
   * Edit a task (only allowed when status is "new")
   */
  const editTask = useCallback((id, data) => {
    let updated = false;

    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        if (!canEdit(task)) {
          console.warn(`Invalid action: cannot edit task with status "${task.status}"`);
          return task;
        }
        updated = true;
        return { ...task, ...data };
      }
      return task;
    }));

    return updated;
  }, []);

  /**
   * Delete a task (only allowed when status is "new")
   */
  const deleteTask = useCallback((id) => {
    let deleted = false;

    setTasks(prev => {
      const taskToDelete = prev.find(t => t.id === id);
      if (!taskToDelete) {
        return prev;
      }
      
      if (!canDelete(taskToDelete)) {
        console.warn(`Invalid action: cannot delete task with status "${taskToDelete.status}"`);
        return prev;
      }
      
      deleted = true;
      return prev.filter(t => t.id !== id);
    });

    return deleted;
  }, []);

  /**
   * Get a single task by ID
   */
  const getTask = useCallback((id) => {
    return tasks.find(t => t.id === id) || null;
  }, [tasks]);

  /**
   * Get all tasks filtered by status
   */
  const getTasksByStatus = useCallback((status) => {
    return tasks.filter(t => t.status === status);
  }, [tasks]);

  /**
   * Get available actions for a task based on role
   * @param {object} task - Task object
   * @param {'parent' | 'child'} role - User role
   * @param {function} onEditClick - Callback to open edit modal (for parent)
   * @param {function} onRejectClick - Callback to open reject modal (for parent)
   * @returns {Array<{ label: string, type: 'primary' | 'secondary' | 'danger', onClick: function }>}
   */
  const getAvailableActions = useCallback((task, role, onEditClick = null, onRejectClick = null) => {
    const actions = [];

    if (role === 'child') {
      // Child can complete tasks with status 'new' or 'rejected'
      if (canComplete(task)) {
        actions.push({
          label: 'Выполнено',
          type: 'primary',
          onClick: () => completeTask(task.id),
        });
      }
    } else if (role === 'parent') {
      // Parent can approve/reject pending tasks
      if (canApprove(task)) {
        actions.push({
          label: 'Подтвердить',
          type: 'primary',
          onClick: () => approveTask(task.id),
        });
        actions.push({
          label: 'На доработку',
          type: 'secondary',
          onClick: () => onRejectClick && onRejectClick(task),
        });
      }

      // Parent can edit tasks with status 'new'
      if (canEdit(task) && onEditClick) {
        actions.push({
          label: 'Редактировать',
          type: 'secondary',
          onClick: () => onEditClick(task),
        });
      }

      // Parent can delete tasks with status 'new'
      if (canDelete(task)) {
        actions.push({
          label: 'Удалить',
          type: 'danger',
          onClick: () => deleteTask(task.id),
        });
      }
    }

    return actions;
  }, [completeTask, approveTask, deleteTask]);

  return {
    // State
    tasks,
    balance,
    
    // Actions
    addTask,
    completeTask,
    approveTask,
    rejectTask,
    editTask,
    deleteTask,
    
    // Helpers
    getTask,
    getTasksByStatus,
    getAvailableActions,
    getStatusConfig,
    
    // Permission helpers (for UI)
    canEdit,
    canDelete,
    canComplete,
    canApprove,
    canReject,
    canPerformAction,
    canTransition,
    
    // Constants
    TASK_STATUS,
  };
}

export default useTaskManager;

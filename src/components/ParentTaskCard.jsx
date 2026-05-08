import { useState } from 'react';
import { TASK_ICONS } from '../utils/taskIcons';
import { getStatusConfig } from '../utils/taskStateMachine';

/**
 * Compact Parent Task Card with expand/collapse functionality
 */
export function ParentTaskCard({ task, onApprove, onReject, onEdit, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const statusConfig = getStatusConfig(task.status);
  const TaskIcon = task.icon ? TASK_ICONS[task.icon] : null;

  const handleCardClick = (e) => {
    // Don't expand if clicking on action buttons
    if (e.target.closest('.quick-actions')) {
      return;
    }
    setIsExpanded(!isExpanded);
  };

  // Status accent color for border
  const getStatusAccent = () => {
    switch (task.status) {
      case 'pending':
        return 'var(--color-warning)';
      case 'rejected':
        return 'var(--color-danger)';
      case 'approved':
        return 'var(--color-success)';
      default:
        return 'var(--color-blue)';
    }
  };

  const statusAccent = getStatusAccent();

  return (
    <li 
      className={`parent-task-card ${isExpanded ? 'expanded' : ''}`}
      style={{ borderLeftColor: statusAccent }}
      onClick={handleCardClick}
    >
      {/* Compact View - Always Visible */}
      <div className="parent-task-card-compact">
        {/* Left: Icon + Title */}
        <div className="parent-task-info">
          <div className="parent-task-icon-wrapper">
            {TaskIcon ? (
              <img src={TaskIcon} alt="" className="parent-task-icon" />
            ) : (
              <div className="parent-task-icon-placeholder" />
            )}
          </div>
          <div className="parent-task-text">
            <h3 className="parent-task-title">{task.title}</h3>
            <div className="parent-task-meta">
              <span className="parent-task-reward">{task.reward} ₽</span>
              <span className="parent-task-status-badge" style={{ background: statusConfig.color }}>
                {statusConfig.label}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Actions (Approve/Reject) */}
        <div className="quick-actions">
          <button
            className="quick-action-btn approve-btn"
            onClick={(e) => {
              e.stopPropagation();
              onApprove(task.id);
            }}
            title="Подтвердить"
            disabled={task.status !== 'pending' && task.status !== 'rejected'}
          >
            ✓
          </button>
          <button
            className="quick-action-btn reject-btn"
            onClick={(e) => {
              e.stopPropagation();
              onReject(task);
            }}
            title="На доработку"
            disabled={task.status !== 'pending'}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Expanded View - Details */}
      {isExpanded && (
        <div className="parent-task-card-expanded">
          {task.description && (
            <p className="parent-task-description">{task.description}</p>
          )}
          
          {task.comment && task.status === 'rejected' && (
            <div className="parent-task-rejection-note">
              <strong>Причина доработки:</strong>
              <p>{task.comment}</p>
            </div>
          )}

          <div className="parent-task-actions-vertical">
            <button
              className="btn btn-secondary full-width"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              disabled={!task.status || task.status === 'pending' || task.status === 'approved'}
            >
              Редактировать
            </button>
            <button
              className="btn btn-secondary full-width"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              disabled={!task.status || task.status === 'pending' || task.status === 'approved'}
            >
              Удалить
            </button>
            <button
              className="btn btn-secondary full-width"
              onClick={(e) => {
                e.stopPropagation();
                onReject(task);
              }}
              disabled={task.status !== 'pending'}
            >
              Отправить на доработку
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

export default ParentTaskCard;

import { useState } from 'react';
import { TASK_ICONS } from '../../shared/utils/taskIcons';
import { getStatusConfig, canEdit, canDelete, canApprove, canReject } from '../../shared/utils/taskStateMachine';

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

  // Action availability based on status
  const isEditable = canEdit(task);
  const isDeletable = canDelete(task);
  const isApprovable = canApprove(task);
  const isRejectable = canReject(task);

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

        {/* Right: Quick Actions based on status */}
        <div className="quick-actions">
          {/* STATUS: new - show edit and delete icons */}
          {task.status === 'new' && (
            <>
              <button
                className="quick-action-btn edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                }}
                title="Редактировать"
              >
                ✏️
              </button>
              <button
                className="quick-action-btn delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                }}
                title="Удалить"
              >
                🗑️
              </button>
            </>
          )}
          
          {/* STATUS: pending - show approve and reject */}
          {task.status === 'pending' && (
            <>
              <button
                className="quick-action-btn approve-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onApprove(task.id);
                }}
                title="Подтвердить"
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
              >
                ✕
              </button>
            </>
          )}
          
          {/* STATUS: rejected - show approve only */}
          {task.status === 'rejected' && (
            <button
              className="quick-action-btn approve-btn"
              onClick={(e) => {
                e.stopPropagation();
                onApprove(task.id);
              }}
              title="Подтвердить"
            >
              ✓
            </button>
          )}
          
          {/* STATUS: approved - no actions */}
          {task.status === 'approved' && (
            <span className="parent-task-status-badge" style={{ background: statusConfig.color }}>
              Выполнено
            </span>
          )}
        </div>
      </div>

      {/* Expanded View - Details */}
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
          {/* Edit button - only for 'new' status */}
          {isEditable && (
            <button
              className="btn btn-secondary full-width"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
            >
              Редактировать
            </button>
          )}
          
          {/* Delete button - only for 'new' status */}
          {isDeletable && (
            <button
              className="btn btn-secondary full-width"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
            >
              Удалить
            </button>
          )}
          
          {/* Reject button - only for 'pending' status */}
          {isRejectable && (
            <button
              className="btn btn-secondary full-width"
              onClick={(e) => {
                e.stopPropagation();
                onReject(task);
              }}
            >
              Отправить на доработку
            </button>
          )}
          
          {/* Approve button - for 'pending' and 'rejected' status */}
          {isApprovable && (
            <button
              className="btn btn-primary full-width"
              onClick={(e) => {
                e.stopPropagation();
                onApprove(task.id);
              }}
            >
              Подтвердить выполнение
            </button>
          )}
        </div>
      </div>
    </li>
  );
}

export default ParentTaskCard;

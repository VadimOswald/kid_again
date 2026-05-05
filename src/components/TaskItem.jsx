import { getStatusConfig } from '../utils/taskStateMachine';

/**
 * Task content component - displays task information
 */
function TaskContent({ task }) {
  const statusConfig = getStatusConfig(task.status);

  return (
    <div className="task-header">
      {/* Цветная фигура со статусом */}
      <div 
        className="task-shape"
        style={{ background: statusConfig.color }}
      >
        {statusConfig.symbol}
      </div>
      
      {/* Информация о задаче */}
      <div className="task-info">
        <h3 className="task-title">{task.title}</h3>
        {task.description && (
          <p className="task-description" style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {task.description}
          </p>
        )}
        <p className="task-reward">Награда: {task.reward} ₽</p>
        <span className="task-status">{statusConfig.label}</span>
        {task.comment && (
          <p className="task-comment" style={{ fontSize: '12px', color: 'var(--color-accent-red)', marginTop: '4px' }}>
            Комментарий: {task.comment}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Task actions component - displays action buttons
 */
function TaskActions({ actions }) {
  if (!actions || actions.length === 0) {
    return (
      <button 
        className="btn btn-secondary" 
        disabled
        style={{ opacity: 0.5 }}
      >
        Нет действий
      </button>
    );
  }

  return (
    <div className="task-actions">
      {actions.map((action, index) => (
        <button
          key={index}
          className={`btn btn-${action.type}`}
          onClick={action.onClick}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Карточка задачи с цветной фигурой-индикатором статуса
 */
export function TaskItem({ task, actions }) {
  return (
    <li className="task-item">
      <TaskContent task={task} />
      <TaskActions actions={actions} />
    </li>
  );
}

export default TaskItem;

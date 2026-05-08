import { TASK_ICONS } from '../utils/taskIcons';
import rocketIcon from '../assets/reward/rocket.png';
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
          <p className="task-description">
            {task.description}
          </p>
        )}
        <p className="task-reward">Награда: {task.reward} ₽</p>
        <span className="task-status">{statusConfig.label}</span>
        {task.comment && (
          <p className="task-comment">
            Комментарий: {task.comment}
          </p>
        )}
        {task.status === 'approved' && (
          <p className="task-completed-status">
            ✓ Завершено
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
        className="btn btn-secondary btn-disabled" 
        disabled
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
          <img src="/src/assets/btn_icon.png" alt="" className="btn-icon" />
          {action.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Карточка задачи с новым дизайном
 */
export function TaskItem({ task, actions }) {
  // Маппинг статусов в CSS классы
  const statusClassMap = {
    new: '',
    pending: 'task-item--pending',
    rejected: 'task-item--rejected',
    approved: 'task-item--approved',
  };

  const statusClass = statusClassMap[task.status] || '';
  
  // Получаем иконку задачи из системы иконок
  const TaskIcon = task.icon ? TASK_ICONS[task.icon] : null;

  return (
    <li className={`task-item ${statusClass}`}>
      {/* Reward block - левый верхний угол с ракетой */}
      <div className="task-reward-block">
        <img src={rocketIcon} alt="" className="task-reward-icon" />
        <span className="task-reward-amount">{task.reward}</span>
      </div>
      
      {/* Иконка задания - по центру */}
      <div className="task-image">
        {TaskIcon ? (
          <img src={TaskIcon} alt="Task icon" />
        ) : (
          <img src="/src/assets/vite.svg" alt="Task icon" />
        )}
      </div>
      
      {/* Заголовок */}
      <h3 className="task-card-title">{task.title}</h3>
      
      {/* Описание - только если существует */}
      {task.description && (
        <p className="task-card-description">{task.description}</p>
      )}
      
      {/* Кнопка действия */}
      <TaskActions actions={actions} />
    </li>
  );
}

export default TaskItem;

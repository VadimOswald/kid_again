import TaskItem from './TaskItem';

/**
 * Список задач с поддержкой пустого состояния
 */
export function TaskList({ tasks, getActions }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <div 
            style={{
              width: 32,
              height: 32,
              background: 'var(--color-accent-blue)',
              borderRadius: '50%',
            }}
          />
        </div>
        <p>Задач пока нет</p>
      </div>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => {
        const actions = getActions(task);
        return (
          <TaskItem
            key={task.id}
            task={task}
            actions={actions}
          />
        );
      })}
    </ul>
  );
}

export default TaskList;

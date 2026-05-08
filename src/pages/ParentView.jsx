import { useState } from 'react';
import BalanceDisplay from '../components/ui/BalanceDisplay';
import BottomNav from '../components/ui/BottomNav';
import Section from '../components/Section';
import ParentTaskCard from '../components/ParentTaskCard';

/**
 * Экран родителя
 * Вкладки: Главная, Задачи, Награды, Семья
 */
export function ParentView({ 
  tasks, 
  onAddTask, 
  getActions,
  onEditTask,
  balance = 0,
  approveTask,
  rejectTask,
  deleteTask,
}) {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Группировка задач для родителя: На проверке → Активные → Выполнено
  const groupedTasks = {
    pending: tasks.filter(t => t.status === 'pending'),
    active: tasks.filter(t => t.status === 'new' || t.status === 'rejected'),
    done: tasks.filter(t => t.status === 'approved'),
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Family Earn</h1>
      
      {/* Отображение баланса на всех вкладках */}
      <BalanceDisplay amount={balance} />

      {/* Контент в зависимости от активной вкладки */}
      {activeTab === 'dashboard' && (
        <div>
          <h2 className="app-subtitle">Обзор семьи</h2>
          <div className="card">
            <p className="card-text-center">
              Добро пожаловать! Здесь будет статистика и активность детей.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div>
          <h2 className="app-subtitle app-subtitle-no-margin">Задачи детей</h2>
          <button className="add-task-btn-composite" onClick={onAddTask}>
            <span className="add-task-circle">+</span>
            <span className="add-task-text">Создать задание</span>
          </button>
          
          {/* Секции с задачами */}
          {groupedTasks.pending.length > 0 && (
            <Section title="На проверке">
              <ul className="parent-task-list">
                {groupedTasks.pending.map((task) => (
                  <ParentTaskCard
                    key={task.id}
                    task={task}
                    onApprove={approveTask}
                    onReject={rejectTask}
                    onEdit={onEditTask}
                    onDelete={deleteTask}
                  />
                ))}
              </ul>
            </Section>
          )}
          
          {groupedTasks.active.length > 0 && (
            <Section title="Активные задачи">
              <ul className="parent-task-list">
                {groupedTasks.active.map((task) => (
                  <ParentTaskCard
                    key={task.id}
                    task={task}
                    onApprove={approveTask}
                    onReject={rejectTask}
                    onEdit={onEditTask}
                    onDelete={deleteTask}
                  />
                ))}
              </ul>
            </Section>
          )}
          
          {groupedTasks.done.length > 0 && (
            <Section title="Выполнено">
              <ul className="parent-task-list">
                {groupedTasks.done.map((task) => (
                  <ParentTaskCard
                    key={task.id}
                    task={task}
                    onApprove={approveTask}
                    onReject={rejectTask}
                    onEdit={onEditTask}
                    onDelete={deleteTask}
                  />
                ))}
              </ul>
            </Section>
          )}
          
          {/* Если вообще нет задач */}
          {tasks.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">
                <div className="empty-state-icon-placeholder" />
              </div>
              <p>Добавьте первое задание</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'rewards' && (
        <div className="card">
          <h2 className="app-subtitle">Магазин наград</h2>
          <p className="card-text-center">
            Здесь можно добавить награды для детей
          </p>
        </div>
      )}

      {activeTab === 'family' && (
        <div className="card">
          <h2 className="app-subtitle">Управление семьей</h2>
          <p className="card-text-center">
            Здесь будет управление участниками семьи
          </p>
        </div>
      )}

      {/* Нижняя навигация */}
      <BottomNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        role="parent" 
      />
    </div>
  );
}

export default ParentView;

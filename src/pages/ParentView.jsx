import { useState } from 'react';
import BalanceDisplay from '../components/ui/BalanceDisplay';
import BottomNav from '../components/ui/BottomNav';
import TaskList from '../components/TaskList';
import Section from '../components/Section';

/**
 * Экран родителя
 * Вкладки: Главная, Задачи, Награды, Семья
 */
export function ParentView({ 
  tasks, 
  onAddTask, 
  getActions,
  balance = 0,
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
          <div className="flex-between-center">
            <h2 className="app-subtitle app-subtitle-no-margin">Задачи детей</h2>
            <button className="btn btn-primary" onClick={onAddTask}>
              + Добавить
            </button>
          </div>
          
          {/* Секции с задачами */}
          {groupedTasks.pending.length > 0 && (
            <Section title="На проверке">
              <TaskList tasks={groupedTasks.pending} getActions={getActions} />
            </Section>
          )}
          
          {groupedTasks.active.length > 0 && (
            <Section title="Активные задачи">
              <TaskList tasks={groupedTasks.active} getActions={getActions} />
            </Section>
          )}
          
          {groupedTasks.done.length > 0 && (
            <Section title="Выполнено">
              <TaskList tasks={groupedTasks.done} getActions={getActions} />
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

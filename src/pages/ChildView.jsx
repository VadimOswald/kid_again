import { useState } from 'react';
import BalanceDisplay from '../components/ui/BalanceDisplay';
import BottomNav from '../components/ui/BottomNav';
import TaskList from '../components/TaskList';
import Section from '../components/Section';

/**
 * Экран ребенка
 * Вкладки: Задачи, Баланс, Магазин
 */
export function ChildView({ 
  tasks, 
  getActions,
  balance = 0,
}) {
  const [activeTab, setActiveTab] = useState('tasks');

  // Группировка задач для ребёнка: Активные → На проверке → Выполнено
  const groupedTasks = {
    active: tasks.filter(t => t.status === 'new' || t.status === 'rejected'),
    pending: tasks.filter(t => t.status === 'pending'),
    done: tasks.filter(t => t.status === 'approved'),
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Family Earn</h1>
      
      {/* Отображение баланса на всех вкладках */}
      <BalanceDisplay amount={balance} />

      {/* Контент в зависимости от активной вкладки */}
      {activeTab === 'tasks' && (
        <div>
          <h2 className="app-subtitle">Твои задачи</h2>
          
          {/* Секции с задачами */}
          {groupedTasks.active.length > 0 && (
            <Section title="Активные задачи">
              <TaskList tasks={groupedTasks.active} getActions={getActions} />
            </Section>
          )}
          
          {groupedTasks.pending.length > 0 && (
            <Section title="На проверке">
              <TaskList tasks={groupedTasks.pending} getActions={getActions} />
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
          )}
        </div>
      )}

      {activeTab === 'balance' && (
        <div className="card">
          <h2 className="app-subtitle">История баланса</h2>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
            Здесь будет история пополнений и трат
          </p>
        </div>
      )}

      {activeTab === 'shop' && (
        <div className="card">
          <h2 className="app-subtitle">Магазин наград</h2>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
            Здесь можно потратить заработанные деньги
          </p>
        </div>
      )}

      {/* Нижняя навигация */}
      <BottomNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        role="child" 
      />
    </div>
  );
}

export default ChildView;

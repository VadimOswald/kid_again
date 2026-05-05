import { useState } from 'react';
import BalanceDisplay from '../components/ui/BalanceDisplay';
import BottomNav from '../components/ui/BottomNav';
import TaskList from '../components/TaskList';

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

  return (
    <div className="app-container">
      <h1 className="app-title">Family Earn</h1>
      
      {/* Отображение баланса на всех вкладках */}
      <BalanceDisplay amount={balance} />

      {/* Контент в зависимости от активной вкладки */}
      {activeTab === 'tasks' && (
        <div>
          <h2 className="app-subtitle">Твои задачи</h2>
          <TaskList tasks={tasks} getActions={getActions} />
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

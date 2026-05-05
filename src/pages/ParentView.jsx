import { useState } from 'react';
import BalanceDisplay from '../components/ui/BalanceDisplay';
import BottomNav from '../components/ui/BottomNav';
import TaskList from '../components/TaskList';

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
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
              Добро пожаловать! Здесь будет статистика и активность детей.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 className="app-subtitle" style={{ margin: 0 }}>Задачи детей</h2>
            <button className="btn btn-primary" onClick={onAddTask}>
              + Добавить
            </button>
          </div>
          
          <TaskList tasks={tasks} getActions={getActions} />
        </div>
      )}

      {activeTab === 'rewards' && (
        <div className="card">
          <h2 className="app-subtitle">Магазин наград</h2>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
            Здесь можно добавить награды для детей
          </p>
        </div>
      )}

      {activeTab === 'family' && (
        <div className="card">
          <h2 className="app-subtitle">Управление семьей</h2>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
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

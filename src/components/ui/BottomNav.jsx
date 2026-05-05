import { NavIcons } from './ShapeIcon';

/**
 * Нижняя навигационная панель (Bottom Tabs)
 * Для мобильной версии приложения
 */
export function BottomNav({ activeTab, onTabChange, role = 'child' }) {
  // Разные вкладки для ребенка и родителя
  const tabs = role === 'child' 
    ? [
        { id: 'tasks', label: 'Задачи', icon: NavIcons.tasks },
        { id: 'balance', label: 'Баланс', icon: NavIcons.balance },
        { id: 'shop', label: 'Магазин', icon: NavIcons.shop },
      ]
    : [
        { id: 'dashboard', label: 'Главная', icon: NavIcons.tasks },
        { id: 'tasks', label: 'Задачи', icon: NavIcons.balance },
        { id: 'rewards', label: 'Награды', icon: NavIcons.shop },
        { id: 'family', label: 'Семья', icon: NavIcons.family },
      ];

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        return (
          <button
            key={tab.id}
            className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            type="button"
          >
            <div className="nav-icon">
              <IconComponent />
            </div>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default BottomNav;

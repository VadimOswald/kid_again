import { useState, useEffect, useRef } from 'react';

/**
 * Модальное окно создания/редактирования задачи
 * Без дизайна, только логика и минимальный UI
 */
export function CreateTaskModal({ 
  isOpen, 
  onClose, 
  mode = "create",
  initialData = null,
  taskId = null,
  onCreate,
  onSave,
}) {
  const [title, setTitle] = useState('');
  const [reward, setReward] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  
  const titleInputRef = useRef(null);

  // Пресеты наград
  const rewardPresets = [1, 2, 5, 10];

  // Заполнение данных при открытии в режиме редактирования
  useEffect(() => {
    if (isOpen && mode === "edit" && initialData) {
      setTitle(initialData.title || '');
      setReward(String(initialData.reward || ''));
      setDescription(initialData.description || '');
    } else if (isOpen && mode === "create") {
      setTitle('');
      setReward('');
      setDescription('');
    }
  }, [isOpen, mode, initialData]);

  // Автофокус на поле "Название" при открытии
  useEffect(() => {
    if (isOpen && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isOpen]);

  // Обработка клавиши Esc для закрытия
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
      }
      
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, title, reward, description, onClose]);

  // Сброс формы при закрытии
  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setReward('');
      setDescription('');
      setError('');
    }
  }, [isOpen]);

  // Валидация и создание/сохранение задачи
  const handleSubmit = () => {
    const trimmedTitle = title.trim();
    const rewardValue = Number(reward);

    // Проверка названия
    if (!trimmedTitle) {
      setError('Название обязательно');
      console.warn('Validation error: title is empty');
      return;
    }

    // Проверка награды
    if (!reward || rewardValue <= 0) {
      setError('Награда должна быть больше 0');
      console.warn('Validation error: reward must be > 0');
      return;
    }

    // Создание или сохранение задачи
    if (mode === "create") {
      onCreate({
        title: trimmedTitle,
        description: description.trim(),
        reward: rewardValue,
      });
    } else if (mode === "edit" && taskId !== null) {
      onSave(taskId, {
        title: trimmedTitle,
        description: description.trim(),
        reward: rewardValue,
      });
    }

    // Закрытие модального окна (очистка произойдет через useEffect)
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">
          {mode === "edit" ? "Редактирование задачи" : "Новая задача"}
        </h2>
        
        {/* Поле: Название (обязательно) */}
        <div className="form-group">
          <label htmlFor="task-title">Название *</label>
          <input
            id="task-title"
            ref={titleInputRef}
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError('');
            }}
            placeholder="Введите название задачи"
            className="form-input"
          />
        </div>

        {/* Поле: Награда (обязательно) с пресетами */}
        <div className="form-group">
          <label htmlFor="task-reward">Награда *</label>
          <div className="reward-presets">
            {rewardPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                className={`preset-btn ${Number(reward) === preset ? 'active' : ''}`}
                onClick={() => {
                  setReward(String(preset));
                  setError('');
                }}
              >
                {preset}
              </button>
            ))}
          </div>
          <input
            id="task-reward"
            type="number"
            value={reward}
            onChange={(e) => {
              setReward(e.target.value);
              setError('');
            }}
            placeholder="Или введите число"
            min="1"
            step="1"
            className="form-input"
          />
        </div>

        {/* Поле: Описание (опционально) */}
        <div className="form-group">
          <label htmlFor="task-description">Описание</label>
          <textarea
            id="task-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Описание задачи (необязательно)"
            rows={3}
            className="form-textarea"
          />
        </div>

        {/* Ошибка валидации */}
        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        {/* Кнопки действий */}
        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Отмена
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
          >
            {mode === "edit" ? "Сохранить" : "Создать"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateTaskModal;

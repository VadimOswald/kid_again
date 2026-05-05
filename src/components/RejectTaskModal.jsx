import { useState, useEffect, useRef } from 'react';

/**
 * Модальное окно для отправки задачи на доработку
 * Требует ввода комментария с указанием причины доработки
 */
export function RejectTaskModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  taskTitle 
}) {
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  
  const textareaRef = useRef(null);

  // Автофокус на textarea при открытии
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  // Обработка клавиш Esc и Enter
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
      }
      
      // Enter не сабмитит (только кнопка)
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Сброс формы при закрытии
  useEffect(() => {
    if (!isOpen) {
      setComment('');
      setError('');
    }
  }, [isOpen]);

  // Валидация и отправка
  const handleSubmit = () => {
    const trimmedComment = comment.trim();

    if (!trimmedComment) {
      setError('Комментарий обязателен');
      return;
    }

    onSubmit(trimmedComment);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Доработка задания</h2>
        
        <p className="modal-text" style={{ marginBottom: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Укажите, что нужно исправить в задании:
        </p>
        {taskTitle && (
          <p className="task-title-preview" style={{ marginBottom: '16px', fontWeight: '500', color: 'var(--text-primary)' }}>
            «{taskTitle}»
          </p>
        )}

        {/* Поле: Комментарий (обязательно) */}
        <div className="form-group">
          <textarea
            ref={textareaRef}
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              setError('');
            }}
            placeholder="Введите комментарий..."
            rows={4}
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
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
}

export default RejectTaskModal;

/**
 * Компонент отображения баланса
 * Крупный, заметный элемент с цветной фигурой
 */
export function BalanceDisplay({ amount, currency = '₽' }) {
  return (
    <div className="balance-display">
      <div className="balance-icon">
        <div 
          style={{
            width: 16,
            height: 16,
            background: 'var(--color-accent-green)',
            borderRadius: '50%',
          }}
        />
      </div>
      <span>{amount} {currency}</span>
    </div>
  );
}

export default BalanceDisplay;

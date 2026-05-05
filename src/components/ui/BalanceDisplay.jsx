/**
 * Компонент отображения баланса
 * Крупный, заметный элемент с цветной фигурой
 */
export function BalanceDisplay({ amount, currency = '₽' }) {
  return (
    <div className="balance-display">
      <div className="balance-icon">
        <div className="balance-icon-circle" />
      </div>
      <span>{amount} {currency}</span>
    </div>
  );
}

export default BalanceDisplay;

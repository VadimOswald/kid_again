/**
 * Цветные фигуры вместо иконок
 * Используется в навигации и карточках задач
 */

export function ShapeCircle({ size = 24, color = 'var(--color-accent-green)' }) {
  return (
    <div
      className="shape-circle shape-icon-base"
      style={{
        width: size,
        height: size,
        background: color
      }}
    />
  );
}

export function ShapeSquare({ size = 22, color = 'var(--color-accent-yellow)' }) {
  return (
    <div
      className="shape-square shape-icon-base"
      style={{
        width: size,
        height: size,
        background: color
      }}
    />
  );
}

export function ShapeTriangle({ size = 20, color = 'var(--color-accent-orange)' }) {
  const halfSize = size * 0.6;
  const fullSize = size;

  return (
    <div
      className="shape-triangle"
      style={{
        borderLeft: `${halfSize}px solid transparent`,
        borderRight: `${halfSize}px solid transparent`,
        borderBottom: `${fullSize}px solid ${color}`,
      }}
    />
  );
}

export function ShapeDiamond({ size = 20, color = 'var(--color-accent-blue)' }) {
  return (
    <div
      className="shape-diamond shape-icon-base"
      style={{
        width: size,
        height: size,
        background: color,
        transform: 'rotate(45deg)',
        borderRadius: '4px',
      }}
    />
  );
}

// Предустановленные комбинации для навигации
export const NavIcons = {
  tasks: () => <ShapeCircle size={24} color="var(--color-accent-green)" />,
  balance: () => <ShapeSquare size={22} color="var(--color-accent-yellow)" />,
  shop: () => <ShapeTriangle size={20} color="var(--color-accent-orange)" />,
  family: () => <ShapeDiamond size={20} color="var(--color-accent-blue)" />,
};

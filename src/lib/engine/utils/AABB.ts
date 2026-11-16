export interface AABB{
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export function intersectsAABB(
  a: AABB,
  b: AABB
): boolean {
  return !(
    a.maxX < b.minX ||
    a.minX > b.maxX ||
    a.maxY < b.minY ||
    a.minY > b.maxY
  );
}

export function expandAABB(
  bounds: AABB,
  amount: number
): AABB {
  return {
    minX: bounds.minX - amount,
    minY: bounds.minY - amount,
    maxX: bounds.maxX + amount,
    maxY: bounds.maxY + amount
  };
}

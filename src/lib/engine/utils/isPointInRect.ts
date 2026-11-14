import { Vector } from "./Vector";

export const isPointInRect = (
  point: Vector,
  center: Vector,
  halfWidth: number,
  halfHeight: number
): boolean=>{
  const diff = Vector.subtract(point, center);

  return (
    Math.abs(diff.x) < halfWidth &&
    Math.abs(diff.y) < halfHeight
  );
}
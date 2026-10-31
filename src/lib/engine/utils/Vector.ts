import type { VectorData } from "../types";

export class Vector {
  public x: number;
  public y: number;

  constructor();

  constructor(vec: Vector);

  constructor(a: number, b: number);

  constructor(a?: number | Vector, b?: number) {
    if (a === undefined && b === undefined) {
      this.x = this.y = 0;
      return;
    }

    if (a instanceof Vector) {
      this.x = a.x ?? 0;
      this.y = a.y ?? 0;
    } else {
      this.x = a ?? 0;
      this.y = b ?? 0;
    }
  }

  public static add(a: Vector,b: Vector): Vector{
    return new Vector(a.x + b.x,a.y + b.y);
  }

  public static subtract(a: Vector,b: Vector): Vector{
    return new Vector(a.x - b.x,a.y - b.y);
  }

  public static distanceSquared(a: Vector,b: Vector): number{
    const diffX = a.x - b.x;
    const diffY = a.y - b.y;

    return diffX * diffX + diffY * diffY;
  }

  public static distance(a: Vector,b: Vector): number{
    return Math.sqrt(Vector.distanceSquared(a,b));
  }

  public static from(data: VectorData): Vector {
    return new Vector(data.x, data.y);
  }

  public set(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  public add(vector: Vector): Vector;
  public add(scalar: number): Vector;
  public add(value: Vector | number): Vector {
    if(value instanceof Vector){
      this.x += value.x;
      this.y += value.y;

      return this;
    }

    this.x += value;
    this.y += value;

    return this;
  }

  public subtract(vector: Vector): Vector;
  public subtract(scalar: number): Vector;
  public subtract(value: Vector | number): Vector {
    if(value instanceof Vector){
      this.x -= value.x;
      this.y -= value.y;

      return this;
    }

    this.x -= value;
    this.y -= value;

    return this;
  }

  public multiply(scalar: number): Vector {
    this.x *= scalar;
    this.y *= scalar;

    return this;
  }

  public divide(scalar: number): Vector {
    if (scalar === 0) {
      throw new Error("ゼロ除算は許可されていません");
    }

    this.x /= scalar;
    this.y /= scalar;

    return this;
  }

  public dot(vector: Vector): number {
    return this.x * vector.x + this.y * vector.y;
  }

  public cross(vector: Vector): number {
    return this.x * vector.y - this.y * vector.x;
  }

  public distanceSquared(): number {
    return this.x * this.x + this.y * this.y;
  }

  public distance(): number {
    return Math.sqrt(this.distanceSquared());
  }

  public normalize(): Vector {
    const length = this.distance();
    if (length === 0) {
      return new Vector(0, 0);
    }

    return new Vector(this.x / length, this.y / length);
  }

  public clone(): Vector {
    return new Vector(this);
  }

  public equals(vector: Vector): boolean {
    return this.x === vector.x && this.y === vector.y;
  }

  public isZero(): boolean {
    return this.x === 0 && this.y === 0;
  }

  public nearlyEquals(vector: Vector, epsilon: number = 1e-10) {
    return Math.abs(this.x - vector.x) < epsilon && Math.abs(this.y - vector.y) < epsilon;
  }

  public toString(): string {
    return `(${this.x}, ${this.y})`;
  }

  public angle(): number {
    return Math.atan2(this.y, this.x);
  }

  public rotate(angle: number): Vector {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vector(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos,
    );
  }

  public lerp(vector: Vector, t: number): Vector {
    return new Vector(
      this.x + t * (vector.x - this.x),
      this.y + t * (vector.y - this.y),
    );
  }

  public toJSON(): VectorData {
    return { x: this.x, y: this.y };
  }
}
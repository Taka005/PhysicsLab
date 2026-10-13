import type { VectorData } from "../types";

export class Vector {
  private _x: number;
  private _y: number;

  constructor();

  constructor(vec: Vector);

  constructor(a: number, b: number);

  constructor(a?: number | Vector, b?: number) {
    if (a === undefined && b === undefined) {
      this._x = this._y = 0;
      return;
    }

    if (a instanceof Vector) {
      this._x = a._x ?? 0;
      this._y = a._y ?? 0;
    } else {
      this._x = a ?? 0;
      this._y = b ?? 0;
    }
  }

  public get x(): number {
    return this._x;
  }

  public get y(): number {
    return this._y;
  }

  public static from(data: VectorData): Vector {
    return new Vector(data.x, data.y);
  }

  public setX(x: number): void {
    this._x = x;
  }

  public setY(y: number): void {
    this._y = y;
  }

  public set(x: number, y: number): void {
    this._x = x;
    this._y = y;
  }

  public add(vector: Vector): Vector {
    return new Vector(this.x + vector.x, this.y + vector.y);
  }

  public subtract(vector: Vector): Vector {
    return new Vector(this.x - vector.x, this.y - vector.y);
  }

  public multiply(scalar: number): Vector {
    return new Vector(this.x * scalar, this.y * scalar);
  }

  public divide(scalar: number): Vector {
    if (scalar === 0) {
      throw new Error("ゼロ除算は許可されていません");
    }

    return new Vector(this.x / scalar, this.y / scalar);
  }

  public dot(vector: Vector): number {
    return this.x * vector.x + this.y * vector.y;
  }

  public cross(vector: Vector): number {
    return this.x * vector.y - this.y * vector.x;
  }

  public lengthSquared(): number {
    return this.x * this.x + this.y * this.y;
  }

  public length(): number {
    return Math.sqrt(this.lengthSquared());
  }

  public normalize(): Vector {
    const length = this.length();
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

  public toString(): string {
    return `(${this.x}, ${this.y})`;
  }

  public distance(vector: Vector): number {
    const dx = this.x - vector.x;
    const dy = this.y - vector.y;
    return Math.sqrt(dx * dx + dy * dy);
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
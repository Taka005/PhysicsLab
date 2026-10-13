export class Vector {
  private x: number;
  private y: number;

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

  public static from(coord: VectorData): Vector {
    return new Vector(coord.x, coord.y);
  }

  public getX(): number {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }

  public setX(x: number): void {
    this.x = x;
  }

  public setY(y: number): void {
    this.y = y;
  }

  public set(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  public add(vector: Vector): Vector {
    return new Vector(this.x + vector.getX(), this.y + vector.getY());
  }

  public subtract(vector: Vector): Vector {
    return new Vector(this.x - vector.getX(), this.y - vector.getY());
  }

  public multiply(scalar: number): Vector {
    return new Vector(this.x * scalar, this.y * scalar);
  }

  public divide(scalar: number): Vector {
    return new Vector(this.x / scalar, this.y / scalar);
  }

  public dot(vector: Vector): number {
    return this.x * vector.getX() + this.y * vector.getY();
  }

  public cross(vector: Vector): number {
    return this.x * vector.getY() - this.y * vector.getX();
  }

  public lengthSquared(): number {
    return this.x * this.x + this.y * this.y;
  }

  public length(): number {
    return Math.sqrt(this.lengthSquared());
  }

  public normalize(): Vector {
    const mag = this.length();
    return new Vector(this.x / mag, this.y / mag);
  }

  public clone(): Vector {
    return new Vector(this);
  }

  public equals(vector: Vector): boolean {
    return this.x === vector.getX() && this.y === vector.getY();
  }

  public toString(): string {
    return `(${this.x}, ${this.y})`;
  }

  public distance(vector: Vector): number {
    const dx = this.x - vector.getX();
    const dy = this.y - vector.getY();
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
      this.x + t * (vector.getX() - this.x),
      this.y + t * (vector.getY() - this.y),
    );
  }

  public toJSON(): VectorData {
    return { x: this.x, y: this.y };
  }
}
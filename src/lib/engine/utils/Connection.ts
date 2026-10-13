import type { Target } from "../types";

export class Connection {
  private _targets: Target[] = [];

  constructor(targets: Target[]) {
    this._targets = targets;
  }

  public get targets(): Target[] {
    return this._targets;
  }

  public get(targetId: string): Target | undefined {
    return this.targets.find(t => t.entityId === targetId);
  }

  public add(entityId: string, distance: number, stiffness: number): void {
    if (this.get(entityId)) throw new Error("既に接続が存在します");

    this._targets.push({
      entityId,
      distance,
      stiffness
    });
  }

  public remove(targetId: string): void {
    this._targets = this.targets.filter(t => t.entityId !== targetId);
  }
}
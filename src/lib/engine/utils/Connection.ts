import type { Target } from "../types";

export class Connection {
  public targets: Target[] = [];

  constructor(targets: Target[]) {
    this.targets = targets;
  }

  public get(targetId: string): Target | undefined {
    return this.targets.find(t => t.entityId === targetId);
  }

  public add(entityId: string, distance: number, stiffness: number): void {
    if (this.get(entityId)) throw new Error("既に接続が存在します");

    this.targets.push({
      entityId,
      distance,
      stiffness
    });
  }

  public remove(targetId: string): void {
    this.targets = this.targets.filter(t => t.entityId !== targetId);
  }
}
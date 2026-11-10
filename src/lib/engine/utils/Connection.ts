import type { Target } from "../types";

export class Connection {
  public targets: Target[] = [];

  constructor(targets: Target[]) {
    this.targets = targets;
  }

  public get targetCount(): number{
    return this.targets.length;
  }

  public get(targetId: string): Target | undefined {
    return this.targets.find(t => t.entityId === targetId);
  }

  public setDistance(targetId: string, distance: number): void {
    const targetIndex = this.targets.findIndex(t => t.entityId === targetId);
    if (targetIndex === -1) throw new Error("接続が存在しません");

    this.targets[targetIndex] = {
      ...this.targets[targetIndex],
      distance
    };
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

export interface EnginePerformance {
  updateTime: number;
  entityCount: number;
  collisionChecks: number;
  groundChecks: number;
  effectChecks: number;
}

export class PerformanceMonitor {
  public readonly stats: EnginePerformance = {
    updateTime: 0,
    entityCount: 0,
    collisionChecks: 0,
    groundChecks: 0,
    effectChecks: 0
  };

  public begin(): number {
    this.stats.collisionChecks = 0;
    this.stats.groundChecks = 0;
    this.stats.effectChecks = 0;

    return performance.now();
  }

  public end(start: number, entityCount: number): void {
    this.stats.updateTime = performance.now() - start;
    this.stats.entityCount = entityCount;

    console.log(this.stats);
  }
}

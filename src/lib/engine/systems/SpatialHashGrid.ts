
export class SpatialHashGrid<T extends object> {
  public readonly cellSize: number;

  private readonly cells = new Map<string, T[]>();

  private readonly queryStamps = new WeakMap<T, number>();

  private queryId: number = 0;

  private readonly inverseCellSize: number;

  constructor(cellSize: number){
    if (!Number.isFinite(cellSize) || cellSize <= 0){
      throw new Error("Invalid cell size");
    }

    this.cellSize = cellSize;
    this.inverseCellSize = 1 / cellSize;
  }

  private getKey(x: number, y: number): string{
    return `${x},${y}`;
  }

  public clear(): void{
    for (const cell of this.cells.values()){
      cell.length = 0;
    }
  }

  public insert(
    minX: number,
    minY: number,
    maxX: number,
    maxY: number,
    item: T
  ): void{
    const x0 = Math.floor(minX * this.inverseCellSize);
    const y0 = Math.floor(minY * this.inverseCellSize);
    const x1 = Math.floor(maxX * this.inverseCellSize);
    const y1 = Math.floor(maxY * this.inverseCellSize);

    for(let y = y0; y <= y1; y++){
      for(let x = x0; x <= x1; x++){
        const key = this.getKey(x, y);

        let cell = this.cells.get(key);

        if(!cell){
          cell = [];
          this.cells.set(key, cell);
        }

        cell.push(item);
      }
    }
  }

  public query(
    minX: number,
    minY: number,
    maxX: number,
    maxY: number,
    output: T[]
  ): void{
    output.length = 0;

    const x0 = Math.floor(minX * this.inverseCellSize);
    const y0 = Math.floor(minY * this.inverseCellSize);
    const x1 = Math.floor(maxX * this.inverseCellSize);
    const y1 = Math.floor(maxY * this.inverseCellSize);

    let stamp = ++this.queryId;

    if(stamp >= Number.MAX_SAFE_INTEGER){
      this.queryId = stamp = 1;
    }

    for(let y = y0; y <= y1; y++){
      for(let x = x0; x <= x1; x++){
        const cell = this.cells.get(this.getKey(x, y));

        if(!cell) continue;

        for(let i = 0; i < cell.length; i++){
          const item = cell[i];

          if(this.queryStamps.get(item) === stamp){
            continue;
          }

          this.queryStamps.set(item, stamp);
          output.push(item);
        }
      }
    }
  }
}

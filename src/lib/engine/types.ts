type VectorData = {
  x: number;
  y: number;
}

type EntityOption = {
  id: string;
  position: VectorData;
  velocity: VectorData;
  diameter: number;
  mass: number;
  stiffness: number;
  targets: Target[];
  parentId: string;
}

type EngineBaseOption = {
  pps: number;
  gravity: number;
  friction: number;
}

type Target = {
  readonly entityId: string;
  readonly distance: number;
  readonly stiffness: number;
}

export type { VectorData, EntityOption, Target, EngineBaseOption };
export type VectorData = {
  x: number;
  y: number;
}

export type ObjectType = "circle";

export interface BaseObjectOption {
  type: ObjectType;
  id: string;
  entities: EntityOption[];
}

export type EntityOption = {
  id: string;
  position: VectorData;
  velocity: VectorData;
  diameter: number;
  mass: number;
  stiffness: number;
  targets: Target[];
  parentId: string;
}

export type EngineBaseOption = {
  pps: number;
  gravity: number;
  friction: number;
}

export type Target = {
  readonly entityId: string;
  readonly distance: number;
  readonly stiffness: number;
}
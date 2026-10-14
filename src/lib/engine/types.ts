export type VectorData = {
  x: number;
  y: number;
}

export type ObjectType = "circle";

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

export interface BaseObjectOption {
  type: ObjectType;
  id: string;
  trackingId?: string;
  entities: EntityOption[];
}

export interface CircleOption extends BaseObjectOption {
  type: "circle";
  diameter: number;
}

export interface BaseCreateOption {
  id: string;
  mass: number;
  stiffness: number;
  position: VectorData;
  velocity: VectorData;
}

export interface CircleCreateOption extends BaseCreateOption {
  diameter: number;
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
export type VectorData = {
  x: number;
  y: number;
}

export type ObjectType = "circle" | "line" | "curve";

export type EntityOption = {
  id: string;
  position: VectorData;
  velocity: VectorData;
  diameter: number;
  mass: number;
  stiffness: number;
  connections: Target[];
}

export interface BaseObjectOption{
  type: ObjectType;
  id: string;
}

export interface BaseBodyOption extends BaseObjectOption {
  trackingId?: string;
  entities: EntityOption[];
}

export interface BaseGroundOption extends BaseObjectOption {
  width: number;
}

export interface CircleOption extends BaseBodyOption {
  type: "circle";
  diameter: number;
}

export interface LineOption extends BaseGroundOption {
  type: "line";
  start: VectorData;
  end: VectorData;
}

export interface CurveOption extends BaseGroundOption {
  type: "curve";
  start: VectorData;
  middle: VectorData;
  end: VectorData;
}

export interface BaseCreateOption {
  type: ObjectType;
  id: string;
}

export interface BaseCreateBodyOption extends BaseCreateOption {
  mass: number;
  stiffness: number;
  position: VectorData;
  velocity: VectorData;
}

export interface BaseCreateGroundOption extends BaseCreateOption {
  width: number;
}

export interface CircleCreateOption extends BaseCreateBodyOption {
  type: "circle";
  diameter: number;
}

export interface LineCreateOption extends BaseCreateGroundOption {
  type: "line";
  start: VectorData;
  end: VectorData;
}

export interface CurveCreateOption extends BaseCreateGroundOption {
  type: "curve";
  start: VectorData;
  middle: VectorData;
  end: VectorData;
}

export interface EngineBaseOption {
  pps: number;
  gravity: number;
  friction: number;
}

export interface EngineOption extends EngineBaseOption {
  playBackSpeed: number;
  trackingInterval: number;
  trackingLimit: number;
  worldSize: number;
}

export type Target = {
  readonly entityId: string;
  readonly distance: number;
  readonly stiffness: number;
}

export type ViewportOption = {
  offset: VectorData;
  zoomRatio: number;
  gridWidth: number;
}

export type SaveData = {
  engine: EngineOption;
  viewport: ViewportOption;
  objects: {
    bodies: BaseBodyOption[];
    grounds: BaseGroundOption[];
  };
}

export type EngineSnapShot = {
  isStarted: boolean;
  isTrackingMode: boolean;
  isDynamicTrackingMode: boolean;
  isSetGridCrossMode: boolean;
  isDebugMode: boolean;
  isDisplayGrid: boolean;
  isDisplayVector: boolean;
  playBackSpeed: number;
  worldSize: number;
  gravity: number;
  pps: number;
  friction: number;
}
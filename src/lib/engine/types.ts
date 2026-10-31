import { BaseGround } from "./objects/BaseGround";
import { BaseObject } from "./objects/BaseObject";

export type VectorData = {
  x: number;
  y: number;
}

export type ObjectType = "circle" | "line" | "curve";

export type EdgeType = "start" | "end" | "middle";

export type EdgeData = {
  type: EdgeType;
  ground: BaseGround;
}

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
  resource: ResourceOption;
  scriptId: string | null;
}

export interface BaseBodyOption extends BaseObjectOption {
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
  resource: ResourceOption;
  scriptId: string | null;
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
  scriptExecuteInterval: number;
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

export type ResourceOption = {
  color: string;
}

export type ScriptOption = {
  id: string;
  name: string;
  code: string;
}

export type TranspiledScript = {
  init: (obj: BaseObject, globalVar: { [key: string]: any }) => void;
  update: (obj: BaseObject, globalVar: { [key: string]: any }) => void;
}

export type SaveData = {
  version: number;
  engine: EngineOption;
  viewport: ViewportOption;
  scripts: ScriptOption[];
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
  isDisabledScript: boolean;
  isDebugMode: boolean;
  isDisplayGrid: boolean;
  isDisplayVector: boolean;
  isDisplayEdge: boolean;
  isHiddenBody: boolean;
  isHiddenGround: boolean;
  playBackSpeed: number;
  worldSize: number;
  trackingInterval: number;
  trackingLimit: number;
  scriptExecuteInterval: number;
  gridWidth: number;
  gravity: number;
  pps: number;
  friction: number;
}

export const DEFAULT_ENGINE_VALUE: EngineOption = {
  trackingInterval: 100,
  trackingLimit: 100,
  scriptExecuteInterval: 100,
  playBackSpeed: 1,
  worldSize: 5000,
  gravity: 250,
  pps: 120,
  friction: 0.001
};

export const DEFAULT_VIEWPORT_VALUE: ViewportOption = {
  offset: { x: 0, y: 0 },
  zoomRatio: 1,
  gridWidth: 50
};
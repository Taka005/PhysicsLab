import { z } from "zod";
import { DEFAULT_ENGINE_VALUE, DEFAULT_VIEWPORT_VALUE } from "./types";

const vectorDataSchema = z.object({
  x: z.number(),
  y: z.number()
});

const engineOptionSchema = z.object({
  pps: z.number().int().min(1).default(DEFAULT_ENGINE_VALUE.pps),
  gravity: z.number().int().default(DEFAULT_ENGINE_VALUE.gravity),
  friction: z.number().default(DEFAULT_ENGINE_VALUE.friction),
  playBackSpeed: z.number().gt(0).default(DEFAULT_ENGINE_VALUE.playBackSpeed),
  trackingInterval: z.number().int().min(1).default(DEFAULT_ENGINE_VALUE.trackingInterval),
  trackingLimit: z.number().int().min(1).default(DEFAULT_ENGINE_VALUE.trackingLimit),
  scriptExecuteInterval: z.number().int().min(1).default(DEFAULT_ENGINE_VALUE.scriptExecuteInterval),
  worldSize: z.number().int().min(1).default(DEFAULT_ENGINE_VALUE.worldSize)
});

const viewportOptionSchema = z.object({
  offset: vectorDataSchema.default(DEFAULT_VIEWPORT_VALUE.offset),
  zoomRatio: z.number().gt(0).default(DEFAULT_VIEWPORT_VALUE.zoomRatio),
  gridWidth: z.number().gt(0).default(DEFAULT_VIEWPORT_VALUE.gridWidth)
});

const ScriptOptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string()
});

const entityOptionSchema = z.object({
  id: z.string(),
  position: vectorDataSchema,
  velocity: vectorDataSchema,
  diameter: z.number().gt(0),
  mass: z.number().min(0),
  stiffness: z.number().gt(0).max(1),
  connections: z.array(z.object({
    entityId: z.string(),
    distance: z.number().gt(0),
    stiffness: z.number().gt(0).max(1)
  }))
});

const resourceOption = z.object({
  color: z.string()
});

const circleOptionSchema = z.object({
  type: z.literal("circle"),
  id: z.string(),
  resource: resourceOption,
  entities: z.array(entityOptionSchema),
  diameter: z.number().gt(0),
  scriptId: z.string().nullable()
});

const lineOptionSchema = z.object({
  type: z.literal("line"),
  id: z.string(),
  resource: resourceOption,
  width: z.number().gt(0),
  start: vectorDataSchema,
  end: vectorDataSchema,
  scriptId: z.string().nullable()
});

const CurveOptionSchema = z.object({
  type: z.literal("curve"),
  id: z.string(),
  resource: resourceOption,
  width: z.number().gt(0),
  start: vectorDataSchema,
  middle: vectorDataSchema,
  end: vectorDataSchema,
  scriptId: z.string().nullable()
});

const BoosterOptionSchema = z.object({
  type: z.literal("booster"),
  id: z.string(),
  resource: resourceOption,
  start: vectorDataSchema,
  end: vectorDataSchema,
  velocity: vectorDataSchema,
  scriptId: z.string().nullable()
});

const bodyOptionSchema = z.discriminatedUnion("type",[
  circleOptionSchema
]);

const groundOptionSchema = z.discriminatedUnion("type",[
  lineOptionSchema,
  CurveOptionSchema
]);

const EffectOptionSchema = z.discriminatedUnion("type",[
  BoosterOptionSchema
]);

export const saveDataSchema = z.object({
  version: z.number().default(1),
  engine: engineOptionSchema.default(DEFAULT_ENGINE_VALUE),
  viewport: viewportOptionSchema.default(DEFAULT_VIEWPORT_VALUE),
  scripts: z.array(ScriptOptionSchema).default([]),
  objects: z.object({
    bodies: z.array(bodyOptionSchema).default([]),
    grounds: z.array(groundOptionSchema).default([]),
    effects: z.array(EffectOptionSchema).default([])
  })
});
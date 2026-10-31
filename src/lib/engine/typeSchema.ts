import { z } from "zod";

const vectorDataSchema = z.object({
  x: z.number(),
  y: z.number()
});

const engineOptionSchema = z.object({
  pps: z.number().int().min(1),
  gravity: z.number().int(),
  friction: z.number(),
  playBackSpeed: z.number().gt(0),
  trackingInterval: z.number().int().min(1),
  trackingLimit: z.number().int().min(1),
  scriptExecuteInterval: z.number().int().min(1),
  worldSize: z.number().int().min(1)
});

const viewportOptionSchema = z.object({
  offset: vectorDataSchema,
  zoomRatio: z.number().gt(0),
  gridWidth: z.number().gt(0)
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

const bodyOptionSchema = z.discriminatedUnion("type",[
  circleOptionSchema
]);

const groundOptionSchema = z.discriminatedUnion("type",[
  lineOptionSchema,
  CurveOptionSchema
]);

export const saveDataSchema = z.object({
  version: z.number(),
  engine: engineOptionSchema,
  viewport: viewportOptionSchema,
  scripts: z.array(ScriptOptionSchema),
  objects: z.object({
    bodies: z.array(bodyOptionSchema),
    grounds: z.array(groundOptionSchema)
  })
});
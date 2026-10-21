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
  worldSize: z.number().int().min(1)
});

const viewportOptionSchema = z.object({
  offset: vectorDataSchema,
  zoomRatio: z.number().gt(0),
  gridWidth: z.number().gt(0)
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

const circleOptionSchema = z.object({
  type: z.literal("circle"),
  id: z.string(),
  trackingId: z.string().optional(),
  entities: z.array(entityOptionSchema),
  diameter: z.number().gt(0)
});

const lineOptionSchema = z.object({
  type: z.literal("line"),
  id: z.string(),
  width: z.number().gt(0),
  start: vectorDataSchema,
  end: vectorDataSchema
});

const CurveOptionSchema = z.object({
  type: z.literal("curve"),
  id: z.string(),
  width: z.number().gt(0),
  start: vectorDataSchema,
  middle: vectorDataSchema,
  end: vectorDataSchema
});

const bodyOptionSchema = z.discriminatedUnion("type",[
  circleOptionSchema
]);

const groundOptionSchema = z.discriminatedUnion("type",[
  lineOptionSchema,
  CurveOptionSchema
]);

export const saveDataSchema = z.object({
  engine: engineOptionSchema,
  viewport: viewportOptionSchema,
  objects: z.object({
    bodies: z.array(bodyOptionSchema),
    grounds: z.array(groundOptionSchema)
  })
});
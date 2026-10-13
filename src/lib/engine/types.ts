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

type Target = {
  readonly entityId: string;
  readonly distance: number;
  readonly stiffness: number;
}
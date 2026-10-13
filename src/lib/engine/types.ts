type VectorData = {
  x: number;
  y: number;
}

type EntityOption = {
  id: string;
  posX: number;
  posY: number;
  size: number;
  mass: number;
  stiff: number;
  speedX?: number;
  speedY?: number;
  rotate?: number;
  rotateSpeed?: number;
  targets?: Target[];
  parent: string;
}

type Target = {
  readonly name: string;
  readonly distance: number;
  readonly stiff: number;
}
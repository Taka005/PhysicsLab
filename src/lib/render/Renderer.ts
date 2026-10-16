import { Application, Container } from "pixi.js";
import { Engine } from "../engine";

export class Renderer {
  private app: Application = new Application();
  private engine: Engine;
  private mainContainer: Container = new Container();
  private trackingContainer: Container = new Container();

  constructor(engine: Engine){
    this.engine = engine;
  }

  public async init(canvasElement: HTMLCanvasElement, width: number, height: number) {
    await this.app.init({
      canvas: canvasElement,
      width,
      height,
      backgroundColor: "white",
      antialias: true,
    });

    this.app.stage.addChild(this.trackingContainer);
    this.app.stage.addChild(this.mainContainer);

    this.mainContainer.scale.set(this.engine.viewport.zoomRatio, this.engine.viewport.zoomRatio);
  }

  public render(): void {
    if(this.engine.isTrackingMode){
      this.trackingContainer.position.set(this.engine.viewport.offset.x, this.engine.viewport.offset.y);
    }

    this.mainContainer.scale.set(this.engine.viewport.zoomRatio, this.engine.viewport.zoomRatio);
  }
}
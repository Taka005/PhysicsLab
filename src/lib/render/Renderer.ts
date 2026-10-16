import { Application, Container, Graphics } from "pixi.js";
import { Engine } from "@/lib/engine";
import { CircleView } from "./views/CircleView";
import { Circle } from "@/lib/engine";

export class Renderer {
  private app: Application = new Application();
  private engine: Engine;
  private mainContainer: Container = new Container();
  private trackingContainer: Container = new Container();
  private viewMap: Map<string,Graphics> = new Map();

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
    this.mainContainer.position.set(this.engine.viewport.offset.x, this.engine.viewport.offset.y);
  }

  public render(): void {
    if(this.engine.isTrackingMode){
      this.trackingContainer.scale.set(this.engine.viewport.zoomRatio, this.engine.viewport.zoomRatio);
      this.trackingContainer.position.set(this.engine.viewport.offset.x, this.engine.viewport.offset.y);
    }

    this.mainContainer.scale.set(this.engine.viewport.zoomRatio, this.engine.viewport.zoomRatio);
    this.mainContainer.position.set(this.engine.viewport.offset.x, this.engine.viewport.offset.y);

    const activeIds = new Set<string>();

    const bodies = this.engine.getBodies();
    for(let i = 0;i<bodies.length;i++){
      const body = bodies[i];

      activeIds.add(body.id);

      let view = this.viewMap.get(body.id);

      if(!view){
        const graphics = new Graphics();
        this.mainContainer.addChild(graphics);
        this.viewMap.set(body.id, graphics);
        view = graphics;
      }

      if(view instanceof Graphics){
        if(body instanceof Circle){
          CircleView.draw(view,body);
        }
      }
    }

    for (const [name, view] of this.viewMap.entries()) {
      if (!activeIds.has(name)) {
        this.mainContainer.removeChild(view);
        view.destroy();
        this.viewMap.delete(name);
      }
    }
  }

  public destroy() {
    this.app.destroy(true, { children: true });
    this.viewMap.clear();
  }
}
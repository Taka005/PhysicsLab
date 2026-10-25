import { Application, Container, Graphics } from "pixi.js";
import { Curve, Engine, Line, Circle, BaseBody, BaseGround, BaseObject } from "@/lib/engine";
import { CircleView } from "./views/CircleView";
import { LineView } from "./views/LineView";
import { CurveView } from "./views/CurveView";
import { VectorView } from "./views/VectorView";
import { EdgeView } from "./views/EdgeView";
import { GridView } from "./views/GridView";

export class Renderer{
  private app: Application = new Application();
  private engine: Engine;
  private mainContainer: Container = new Container();
  private trackingContainer: Container = new Container();
  private groundContainer: Container = new Container();
  private bodyContainer: Container = new Container();
  private viewMap: Map<string,Graphics> = new Map();
  private trackingViews: Graphics[] = [];
  private isInitialized = false;
  private gridGraphics = new Graphics();
  private width: number | null = null;
  private height: number | null = null;

  constructor(engine: Engine){
    this.engine = engine;
  }

  public async init(canvasElement: HTMLCanvasElement, width: number, height: number){
    await this.app.init({
      canvas: canvasElement,
      width,
      height,
      backgroundColor: "white",
      antialias: true,
    });

    this.width = width;
    this.height = height;

    if (this.isInitialized) return;

    this.isInitialized = true;

    this.app.stage.addChild(this.mainContainer);

    this.mainContainer.addChild(this.gridGraphics);
    this.mainContainer.addChild(this.groundContainer);
    this.mainContainer.addChild(this.trackingContainer);
    this.mainContainer.addChild(this.bodyContainer);

    this.trackingContainer.alpha = 0.3;

    this.updateTransforms()
  }

  public render(): void{
    if (!this.isInitialized) return;

    this.updateTransforms()

    if(this.engine.viewport.isDisplayGrid){
      GridView.draw(this.gridGraphics,this.engine.viewport,this.engine.worldSize,this.width ?? 0,this.height ?? 0);
    }else{
      this.gridGraphics.clear();
    }

    this.bodyContainer.visible = !this.engine.viewport.isHiddenBody;
    this.groundContainer.visible = !this.engine.viewport.isHiddenGround;

    const activeIds = new Set<string>();

    const objects = this.engine.getObjects();
    for(let i = 0;i<objects.length;i++){
      const object = objects[i];

      activeIds.add(object.id);

      let view = this.viewMap.get(object.id);

      if(!view){
        const graphics = new Graphics();

        if(object instanceof BaseGround){
          this.groundContainer.addChild(graphics);
        }else if(object instanceof BaseBody){
          this.bodyContainer.addChild(graphics);
        }

        this.viewMap.set(object.id, graphics);
        view = graphics;
      }

      if(view instanceof Graphics){
        this.drawObject(view,object);
      }
    }

    for (const [name, view] of this.viewMap.entries()) {
      if (!activeIds.has(name)) {
        view.parent?.removeChild(view);
        view.destroy();
        this.viewMap.delete(name);
      }
    }

    if(this.engine.isTrackingMode){
      this.trackingContainer.visible = true;

      const trackBodies = this.engine.getTrackBodies();
      while (this.trackingViews.length < trackBodies.length) {
        const graphics = new Graphics();
        this.trackingContainer.addChild(graphics);
        this.trackingViews.push(graphics);
      }

      while (this.trackingViews.length > trackBodies.length) {
        const view = this.trackingViews.pop();
        if (view) {
          view.parent?.removeChild(view);
          view.destroy();
        }
      }

      for (let i = 0; i < trackBodies.length; i++) {
        const graphics = this.trackingViews[i];
        const body = trackBodies[i];
        this.drawObject(graphics, body);
      }
    }else{
      this.trackingContainer.visible = false;
    }
  }

  private drawObject(view: Graphics, object: BaseObject): void {
    if(object instanceof Circle){
      CircleView.draw(view, object);
    }else if(object instanceof Line){
      LineView.draw(view, object);
    }else if(object instanceof Curve){
      CurveView.draw(view, object);
    }

    if(object instanceof BaseBody && this.engine.viewport.isDisplayVector){
      VectorView.draw(view, object);
    }

    if(object instanceof BaseGround && this.engine.viewport.isDisplayEdge){
      EdgeView.draw(view, object);
    }
  }

  private updateTransforms(): void{
    this.mainContainer.scale.set(this.engine.viewport.zoomRatio, this.engine.viewport.zoomRatio);
    this.mainContainer.position.set(this.engine.viewport.offset.x, this.engine.viewport.offset.y);

    if (this.isInitialized) {
      this.app.render();
    }
  }

  public resize(width: number,height: number): void{
    if (!this.isInitialized) return;

    this.app.renderer.resize(width, height);

    this.width = width;
    this.height = height;

    this.app.render();
  }

  public destroy(): void{
    if (!this.isInitialized) return;

    this.app.destroy(true, { children: true });
    this.viewMap.clear();
  }
}
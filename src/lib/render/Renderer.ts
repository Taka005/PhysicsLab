import { Application, Container, Graphics, Rectangle } from "pixi.js";
import { applyPalette, GIFEncoder, quantize } from "gifenc";
import { Curve, Engine, Line, Circle, BaseBody, BaseGround, BaseObject, BaseEffect, Booster } from "@/lib/engine";
import { CircleView } from "./views/CircleView";
import { LineView } from "./views/LineView";
import { CurveView } from "./views/CurveView";
import { VectorView } from "./views/VectorView";
import { EdgeView } from "./views/EdgeView";
import { GridView } from "./views/GridView";
import { BoosterView } from "./views/BoosterView";

export class Renderer{
  private app: Application = new Application();
  private engine: Engine;
  private mainContainer: Container = new Container();
  private trackingContainer: Container = new Container();
  private predictTrackingContainer: Container = new Container();
  private effectContainer: Container = new Container();
  private groundContainer: Container = new Container();
  private bodyContainer: Container = new Container();
  private viewMap: Map<string,Graphics> = new Map();
  private trackingViews: Graphics[] = [];
  private predictTrackingViews: Graphics[] = [];
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
      autoStart: false,
      sharedTicker: false
    });

    this.width = width;
    this.height = height;

    if (this.isInitialized) return;

    this.isInitialized = true;

    this.app.stage.addChild(this.mainContainer);

    this.mainContainer.addChild(this.gridGraphics);
    this.mainContainer.addChild(this.groundContainer);
    this.mainContainer.addChild(this.effectContainer);
    this.mainContainer.addChild(this.trackingContainer);
    this.mainContainer.addChild(this.predictTrackingContainer);
    this.mainContainer.addChild(this.bodyContainer);

    this.trackingContainer.alpha = 0.3;
    this.predictTrackingContainer.alpha = 0.3;

    this.updateTransforms();
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
    this.effectContainer.visible = !this.engine.viewport.isHiddenEffect;
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
        }else if(object instanceof BaseEffect){
          this.effectContainer.addChild(graphics);
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

    if (this.engine.isPredictTrackingMode) {
      this.predictTrackingContainer.visible = true;

      const predictTrackBodies = this.engine.getPredictTrackBodies();
      while (this.predictTrackingViews.length < predictTrackBodies.length) {
        const graphics = new Graphics();
        this.predictTrackingContainer.addChild(graphics);
        this.predictTrackingViews.push(graphics);
      }

      while (this.predictTrackingViews.length > predictTrackBodies.length) {
        const view = this.predictTrackingViews.pop();
        if (view) {
          view.parent?.removeChild(view);
          view.destroy();
        }
      }

      for (let i = 0; i < predictTrackBodies.length; i++) {
        const graphics = this.predictTrackingViews[i];
        this.drawObject(graphics, predictTrackBodies[i]);
      }
    } else {
      this.predictTrackingContainer.visible = false;
    }

    this.app.render();
  }

  private drawObject(view: Graphics, object: BaseObject): void {
    if(object instanceof Circle){
      CircleView.draw(view, object);
    }else if(object instanceof Line){
      LineView.draw(view, object);
    }else if(object instanceof Curve){
      CurveView.draw(view, object);
    }else if(object instanceof Booster){
      BoosterView.draw(view, object);
    }

    if(object instanceof BaseBody && this.engine.viewport.isDisplayVector){
      VectorView.draw(view, object);
    }

    if(this.engine.viewport.isDisplayEdge){
      EdgeView.draw(view, object);
    }
  }

  private updateTransforms(): void{
    this.mainContainer.scale.set(this.engine.viewport.zoomRatio, this.engine.viewport.zoomRatio);
    this.mainContainer.position.set(this.engine.viewport.offset.x, this.engine.viewport.offset.y);
  }

  public resize(width: number,height: number): void{
    if (!this.isInitialized) return;

    this.app.renderer.resize(width, height);

    this.width = width;
    this.height = height;

    this.app.render();
  }

  public exportPng(): Promise<Blob> {
    if (!this.isInitialized || this.width === null || this.height === null) {
      throw new Error("描画の準備ができていません");
    }

    const canvas = this.app.renderer.extract.canvas({
      target: this.app.stage,
      frame: new Rectangle(0, 0, this.width, this.height),
      clearColor: "white",
      antialias: true
    });

    const toBlob = canvas.toBlob;
    if (!toBlob) {
      throw new Error("この環境では画像に変換できません");
    }

    return new Promise((resolve, reject) => {
      toBlob.call(canvas, (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("画像を生成できませんでした"));
        }
      }, "image/png");
    });
  }

  public async recordGif(signal: AbortSignal): Promise<Blob> {
    if (!this.isInitialized || this.width === null || this.height === null) {
      throw new Error("描画の準備ができていません");
    }

    const encoder = GIFEncoder();
    const startedAt = performance.now();
    const frameInterval = 100;
    const maxFrames = 100;
    const resolution = Math.min(1, 640 / Math.max(this.width, this.height));
    let frameCount = 0;
    let palette: ReturnType<typeof quantize> | null = null;

    while (
      frameCount < maxFrames &&
      performance.now() - startedAt < maxFrames * frameInterval &&
      !signal.aborted
    ) {
      const canvas = this.app.renderer.extract.canvas({
        target: this.app.stage,
        frame: new Rectangle(0, 0, this.width, this.height),
        resolution,
        clearColor: "white",
        antialias: true
      });

      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("フレームを読み込めませんでした");
      }

      const image = context.getImageData(0, 0, canvas.width, canvas.height);
      if (palette === null) {
        palette = quantize(image.data, 256);
      }

      const indexedPixels = applyPalette(image.data, palette);

      encoder.writeFrame(indexedPixels, canvas.width, canvas.height, {
        ...(frameCount === 0 ? { palette } : {}),
        delay: frameInterval,
        repeat: 0
      });

      frameCount++;

      const nextFrameAt = startedAt + frameCount * frameInterval;
      const wait = nextFrameAt - performance.now();

      if (frameCount < maxFrames && wait > 0) {
        await new Promise((resolve) => window.setTimeout(resolve, wait));
      }
    }

    if (frameCount === 0) {
      throw new Error("フレームがありません");
    }

    encoder.finish();
    const bytes = encoder.bytes();
    const buffer = new ArrayBuffer(bytes.byteLength);
    new Uint8Array(buffer).set(bytes);

    return new Blob([buffer], { type: "image/gif" });
  }

  public destroy(): void{
    if (!this.isInitialized) return;

    this.app.destroy(true, { children: true });
    this.viewMap.clear();
  }
}
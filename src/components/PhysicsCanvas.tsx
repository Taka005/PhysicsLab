"use client";

import React, { useEffect, useRef } from "react";
import { Renderer } from "@/lib/render";
import { CircleCreateOption, LineCreateOption } from "@/lib/engine/types";
import { useEngine } from "@/context/EngineContext";

export default function PhysicsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engine = useEngine();

  useEffect(() => {
    if (!canvasRef.current || !engine) return;

    const renderer = new Renderer(engine);

    let animationFrameId: number;

    const initPixi = async () => {
      await renderer.init(
        canvasRef.current!,
        window.innerWidth,
        window.innerHeight
      );

      engine.spawn({ type: "circle", id: "ball1", position: { x: 50, y: 50 },velocity: { x: 50, y: 50 }, diameter: 10, mass: 10, stiffness: 0.8} as CircleCreateOption);

      engine.spawn({ type: "circle", id: "ball2", position: { x: 60, y: 30 },velocity: { x: 50, y: 50 }, diameter: 20, mass: 10, stiffness: 0.8} as CircleCreateOption);

      engine.spawn({ type: "line", id: "line1", start: { x: 0, y: 100 },end: { x: 200, y: 200 }, width: 10} as LineCreateOption);

      engine.spawn({ type: "line", id: "line2", start: { x: 200, y: 200 },end: { x: 500, y: 200 }, width: 10} as LineCreateOption);

      engine.start();

      const loop = () => {
        renderer.render();
        animationFrameId = requestAnimationFrame(loop);
      };

      loop();
    };

    initPixi();

    return () => {
      cancelAnimationFrame(animationFrameId);
      renderer.destroy();
    };
  }, [engine]);

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <canvas ref={canvasRef} style={{ display: "block" }} />
    </div>
  );
}
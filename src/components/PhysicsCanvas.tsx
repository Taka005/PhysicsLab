"use client";

import React, { useEffect, useRef } from "react";
import { Engine } from "@/lib/engine";
import { Renderer } from "@/lib/render";
import { CircleCreateOption, LineCreateOption } from "@/lib/engine/types";

export default function PhysicsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new Engine(
      {
        pps: 120,
        gravity: 100,
        friction: 0.001
      },
      {
        offset:{
          x: 0,
          y: 0
        },
        zoomRatio: 1
      }
    );

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
      engine.stop();
      cancelAnimationFrame(animationFrameId);
      renderer.destroy();
    };
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <canvas ref={canvasRef} style={{ display: "block" }} />
    </div>
  );
}
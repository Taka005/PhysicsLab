"use client";

import React, { useEffect, useRef } from "react";
import { Engine } from "@/lib/engine";
import { Renderer } from "@/lib/render";
import { CircleCreateOption } from "@/lib/engine/types";

export default function PhysicsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new Engine({
      pps: 120,
      gravity: 100,
      friction: 0.001
    },{
      offset:{
        x: 0,
        y: 0
      },
      zoomRatio: 1
    });
    const renderer = new Renderer(engine);

    let animationFrameId: number;

    const initPixi = async () => {
      await renderer.init(
        canvasRef.current!,
        window.innerWidth,
        window.innerHeight
      );

      engine.spawn({
        type: "circle", id: "ball1", position: { x: 50, y: 50 },velocity: { x: 50, y: 50 }, diameter: 20, mass: 10, stiffness: 0.5} as CircleCreateOption);

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
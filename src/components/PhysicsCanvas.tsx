"use client";

import React, { useEffect, useRef, useState } from "react";
import { Renderer } from "@/lib/render";
import { CircleCreateOption, LineCreateOption } from "@/lib/engine/types";
import { useEngine } from "@/context/EngineContext";

export default function PhysicsCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engine = useEngine();
  const [touchPos, setTouchPos] = useState<{ x: number; y: number } | null>(null);

  const handlePointerAction = (e: React.PointerEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas||!engine) return;

    const rect = canvas.getBoundingClientRect();

    let clientX = 0;
    let clientY = 0;

    if ("touches" in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = (clientX - rect.left - engine.viewport.offset.x)*(1/engine.viewport.zoomRatio);
    const y = (clientY - rect.top - engine.viewport.offset.y)*(1/engine.viewport.zoomRatio);

    setTouchPos({ x: Math.round(x), y: Math.round(y) });

    console.log(`Touch/Click X: ${Math.round(x)}, Y: ${Math.round(y)}`);
  };

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || !engine) return;

    const renderer = new Renderer(engine);

    let animationFrameId: number;

    const initPixi = async () => {
     const { clientWidth, clientHeight } = containerRef.current!;

      await renderer.init(
        canvasRef.current!,
        clientWidth,
        clientHeight
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

    const handleResize = () => {
      if (containerRef.current && renderer) {
        const { clientWidth, clientHeight } = containerRef.current;

        renderer.resize(clientWidth,clientHeight);
      }
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(containerRef.current);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.destroy();
    };
  }, [engine]);

  return (
    <div
      ref={containerRef}
      className="flex-1 h-full relative bg-white rounded-lg shadow-sm overflow-hidden"
    >
      <canvas ref={canvasRef} className="block w-full h-full"
        onPointerDown={handlePointerAction}
        onPointerMove={(e) => {
          if (e.buttons > 0) handlePointerAction(e);
        }}
        onTouchStart={handlePointerAction}
      />
    </div>
  );
}
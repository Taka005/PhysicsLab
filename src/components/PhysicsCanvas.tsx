"use client";

import { useEffect, useRef, useState } from "react";
import { Renderer } from "@/lib/render";
import { CircleCreateOption, CurveCreateOption, LineCreateOption } from "@/lib/engine/types";
import { useEngine } from "@/context/EngineContext";
import { Point, useCanvasInteraction } from "@/hooks/useCanvasInteraction";
import { useSpawnState } from "@/context/SpawnContext";

export default function PhysicsCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engine = useEngine();
  const { spawnConfig } = useSpawnState();
  const [clickedPoints, setClickedPoints] = useState<Point[]>([]);

  useEffect(() => {
    setClickedPoints([]);
  }, [spawnConfig.type]);

  const getRequiredPointsCount = (type: string) => {
    switch (type) {
      case "circle":
        return 1;
      case "line":
        return 2;
      case "curve":
        return 3;
      default:
        return 1;
    }
  };

  const requiredCount = getRequiredPointsCount(spawnConfig.type);

  const { handlers } = useCanvasInteraction({
    canvasRef,
    onDown: (point, e) => {
      if (engine) {
        const nextPoints = [...clickedPoints, point];

      if (nextPoints.length >= requiredCount) {
        if (spawnConfig.type === "circle") {
          engine.spawn({
            type: "circle",
            id: `ball_${Date.now()}`,
            position: { x: nextPoints[0].x, y: nextPoints[0].y },
            velocity: { x: spawnConfig.velocityX, y: spawnConfig.velocityY },
            diameter: spawnConfig.diameter,
            mass: spawnConfig.mass,
            stiffness: spawnConfig.stiffness
          } as CircleCreateOption);
        }else if(spawnConfig.type === "line"){
          engine.spawn({
            type: "line",
            id: `line_${Date.now()}`,
            start: { x: nextPoints[0].x, y: nextPoints[0].y },
            end: { x: nextPoints[1].x, y: nextPoints[1].y },
            width: spawnConfig.width
          } as LineCreateOption);
        }else if(spawnConfig.type === "curve"){
          engine.spawn({
            type: "curve",
            id: `curve_${Date.now()}`,
            start: { x: nextPoints[0].x, y: nextPoints[0].y },
            middle: { x: nextPoints[1].x, y: nextPoints[1].y },
            end: { x: nextPoints[2].x, y: nextPoints[2].y },
            width: spawnConfig.width
          } as CurveCreateOption);
        }

        setClickedPoints([]);
      }else{
        setClickedPoints(nextPoints);
      }
      }
    },
    onMove: (point, isDragging, e) => {
      if (isDragging) {

      }
    },
    onUp: (point, e) => {

    },
  });

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

      // engine.spawn({ type: "circle", id: "ball1", position: { x: 50, y: 50 },velocity: { x: 50, y: 50 }, diameter: 10, mass: 10, stiffness: 0.8} as CircleCreateOption);

      // engine.spawn({ type: "circle", id: "ball2", position: { x: 60, y: 30 },velocity: { x: 50, y: 50 }, diameter: 20, mass: 10, stiffness: 0.8} as CircleCreateOption);

      // engine.spawn({ type: "line", id: "line1", start: { x: 0, y: 100 },end: { x: 200, y: 200 }, width: 10} as LineCreateOption);

      // engine.spawn({ type: "line", id: "line2", start: { x: 200, y: 200 },end: { x: 500, y: 200 }, width: 10} as LineCreateOption);

      engine.import(`{"engine":{"playBackSpeed":1,"trackingInterval":1000,"trackingLimit":100,"worldSize":5000,"pps":120,"gravity":200,"friction":0.001},"viewport":{"offset":{"x":0,"y":0},"zoomRatio":1},"objects":{"bodies":[{"type":"circle","id":"ball1","trackingId":"cNYbhzO2hV","diameter":10,"entities":[{"id":"ball1","position":{"x":50,"y":50},"velocity":{"x":50,"y":50},"diameter":10,"mass":10,"stiffness":0.8,"connections":[]}]},{"type":"circle","id":"ball2","trackingId":"FqEhU4FmN5","diameter":20,"entities":[{"id":"ball2","position":{"x":60,"y":30},"velocity":{"x":50,"y":50},"diameter":20,"mass":10,"stiffness":0.8,"connections":[]}]}],"grounds":[{"type":"line","id":"line1","width":10,"start":{"x":0,"y":100},"end":{"x":200,"y":200}},{"type":"line","id":"line2","width":10,"start":{"x":200,"y":200},"end":{"x":500,"y":200}}]}}`)

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
      <canvas ref={canvasRef} className="block w-full h-full" {...handlers}/>
    </div>
  );
}
import { useEffect, useRef } from "react";
import { Engine } from "@/lib/engine";

export function useViewportControl(engine: Engine | null) {
  const pressedKeysRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement).tagName)) return;
      pressedKeysRef.current.add(e.code);

      if (engine) {
        if (pressedKeysRef.current.has("Space")){
          engine.isStarted ? engine.stop() : engine.start();
        }

        if (pressedKeysRef.current.has("KeyF")){
          if(!engine.isStarted){
            engine.step();
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      pressedKeysRef.current.delete(e.code);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    let animationId: number;
    const loop = () => {
      if (engine) {
        const speed = 3;
        if (pressedKeysRef.current.has("KeyW")) engine.viewport.offset.y += speed;
        if (pressedKeysRef.current.has("KeyS")) engine.viewport.offset.y -= speed;
        if (pressedKeysRef.current.has("KeyA")) engine.viewport.offset.x += speed;
        if (pressedKeysRef.current.has("KeyD")) engine.viewport.offset.x -= speed;

      }
      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [engine]);

  const handleWheel = (e: WheelEvent | React.WheelEvent) => {
    if (!engine) return;
    if (e.deltaY < 0) {
      engine.viewport.zoomRatio = Math.min(engine.viewport.zoomRatio + 0.1, 5);
    } else {
      engine.viewport.zoomRatio = Math.max(engine.viewport.zoomRatio - 0.1, 0.3);
    }
  };

  return { handleWheel };
}
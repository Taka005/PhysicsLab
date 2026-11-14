import { useEffect, useRef } from "react";
import { Engine } from "@/lib/engine";
import { useToolMode } from "@/context/ToolModeContext";

export function useViewportControl(engine: Engine | null) {
  const { setMode } = useToolMode();
  const pressedKeysRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes((event.target as HTMLElement).tagName)) return;

      event.preventDefault();

      pressedKeysRef.current.add(event.code);

      if (engine) {
        if (pressedKeysRef.current.has("Space")){
          engine.isStarted ? engine.stop() : engine.start();
        }

        if (pressedKeysRef.current.has("KeyF")){
          if(!engine.isStarted){
            engine.step();
          }
        }

        if (pressedKeysRef.current.has("Digit1")){
          setMode("spawn");
        }

        if (pressedKeysRef.current.has("Digit2")){
          setMode("fill");
        }

        if (pressedKeysRef.current.has("Digit3")){
          setMode("move");
        }

        if (pressedKeysRef.current.has("Digit4")){
          setMode("delete");
        }

        if (pressedKeysRef.current.has("Digit5")){
          setMode("edit");
        }

        if (pressedKeysRef.current.has("Digit6")){
          setMode("connect");
        }

        if (pressedKeysRef.current.has("Digit7")){
          setMode("disconnect");
        }

        if (pressedKeysRef.current.has("Digit8")){
          setMode("group");
        }

        if (pressedKeysRef.current.has("Digit9")){
          setMode("ungroup");
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      pressedKeysRef.current.delete(event.code);
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

  const handleWheel = (event: WheelEvent | React.WheelEvent) => {
    if (!engine) return;
    if (event.deltaY < 0) {
      engine.viewport.zoomRatio = Math.min(engine.viewport.zoomRatio + 0.1, 5);
    } else {
      engine.viewport.zoomRatio = Math.max(engine.viewport.zoomRatio - 0.1, 0.3);
    }
  };

  return { handleWheel };
}
import { useEngine } from "@/context/EngineContext";
import { useRef, useState, useCallback, RefObject, PointerEvent, KeyboardEvent, WheelEvent } from "react";

export interface Point {
  x: number;
  y: number;
}

export interface CanvasInteractionOptions {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  onDown?: (pos: Point, e: PointerEvent) => void;
  onMove?: (pos: Point, isDragging: boolean, e: PointerEvent) => void;
  onUp?: (pos: Point, e: PointerEvent) => void;
  onWheel?: (e: WheelEvent) => void;
  onKeyDown?: (e: KeyboardEvent) => void;
  onKeyUp?: (e: KeyboardEvent) => void;
}

export function useCanvasInteraction({
  canvasRef,
  onDown,
  onMove,
  onUp,
  onWheel,
  onKeyDown,
  onKeyUp
}: CanvasInteractionOptions) {
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null);
  const isDraggingRef = useRef(false);
  const engine = useEngine();

  const getCanvasPoint = useCallback((e: PointerEvent): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas||!engine) return null;

    const rect = canvas.getBoundingClientRect();

    return {
      x: (e.clientX - rect.left - engine.viewport.offset.x)*(1/engine.viewport.zoomRatio),
      y: (e.clientY - rect.top - engine.viewport.offset.y)*(1/engine.viewport.zoomRatio)
    };
  }, [canvasRef,engine]);

  const handlePointerDown = useCallback((e: PointerEvent) => {
    const point = getCanvasPoint(e);
    if (!point) return;

    isDraggingRef.current = true;
    setCurrentPoint(point);

    onDown?.(point, e);
  }, [getCanvasPoint, onDown]);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    const point = getCanvasPoint(e);
    if (!point) return;

    setCurrentPoint(point);

    onMove?.(point, isDraggingRef.current, e);
  }, [getCanvasPoint, onMove]);

  const handlePointerUp = useCallback((e: PointerEvent) => {
    const point = getCanvasPoint(e) || currentPoint;

    isDraggingRef.current = false;

    if (point) {
      onUp?.(point, e);
    }
  }, [currentPoint, getCanvasPoint, onUp]);

  const handleWheel = useCallback((e: WheelEvent) => {
    onWheel?.(e);
  }, [onWheel]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    onKeyDown?.(e);
  }, [onKeyDown]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    onKeyUp?.(e);
  }, [onKeyUp]);

  return {
    currentPoint,
    isDragging: isDraggingRef.current,
    handlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerLeave: handlePointerUp,
      onWheel: handleWheel,
      onKeyDown: handleKeyDown,
      onKeyUp: handleKeyUp
    },
  };
}
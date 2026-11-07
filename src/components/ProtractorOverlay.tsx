"use client";

import { Point } from "../hooks/useCanvasInteraction";
import { PointerEvent, useCallback, useEffect, useRef, useState } from "react";

const PROTRACTOR_RADIUS = 320 / 2;

function clampPosition(position: Point, width: number, height: number): Point {
  const margin = PROTRACTOR_RADIUS + 8;
  const minX = Math.min(margin, width / 2);
  const maxX = Math.max(width - margin, width / 2);
  const minY = Math.min(margin, height / 2);
  const maxY = Math.max(height - margin, height / 2);

  return {
    x: Math.max(minX, Math.min(position.x, maxX)),
    y: Math.max(minY, Math.min(position.y, maxY))
  };
}

export default function ProtractorOverlay({ visible }: { visible: boolean }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragStartRef = useRef<{ pointerX: number; pointerY: number; position: Point } | null>(null);
  const [position, setPosition] = useState<Point | null>(null);

  const getPosition = useCallback((): Point => {
    const container = containerRef.current;
    if (!container) return position ?? { x: 0, y: 0 };

    return position ?? {
      x: container.clientWidth / 2,
      y: container.clientHeight / 2
    };
  }, [position]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      setPosition((current) => {
        if (!current) return current;
        return clampPosition(current, container.clientWidth, container.clientHeight);
      });
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;

    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStartRef.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      position: getPosition()
    };
  };

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const dragStart = dragStartRef.current;
    const container = containerRef.current;
    if (!dragStart || !container) return;

    setPosition(clampPosition({
      x: dragStart.position.x + event.clientX - dragStart.pointerX,
      y: dragStart.position.y + event.clientY - dragStart.pointerY
    }, container.clientWidth, container.clientHeight));
  };

  const handlePointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    dragStartRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
      aria-hidden={!visible}
      style={{ visibility: visible ? "visible" : "hidden" }}
    >
      <div
        className="pointer-events-none absolute h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2"
        style={{
          left: position?.x ?? "50%",
          top: position?.y ?? "50%"
        }}
      >
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-[10px] h-[320px] w-[320px]"
          viewBox="0 0 320 320"
          fill="none"
        >
          {Array.from({ length: 360 }, (_, degree) => {
            const radians = degree * Math.PI / 180;
            const isMajor = degree % 10 === 0;
            const isMid = degree % 5 === 0;
            const x2 = PROTRACTOR_RADIUS + Math.cos(radians) * 158;
            const y2 = PROTRACTOR_RADIUS - Math.sin(radians) * 158;

            return (
              <line
                key={degree}
                x1={PROTRACTOR_RADIUS}
                y1={PROTRACTOR_RADIUS}
                x2={x2}
                y2={y2}
                stroke="#8a8a8a"
                strokeOpacity={isMajor ? "0.4" : isMid ? "0.12" : "0.045"}
                strokeWidth={isMajor ? "0.8" : isMid ? "0.6" : "0.45"}
              />
            );
          })}
          {Array.from({ length: 36 }, (_, index) => {
            const degree = index * 10;
            const radians = degree * Math.PI / 180;

            return (
              <text
                key={degree}
                x={PROTRACTOR_RADIUS + Math.cos(radians) * 116}
                y={PROTRACTOR_RADIUS - Math.sin(radians) * 116}
                fill="#8a8a8a"
                fillOpacity="0.68"
                stroke="white"
                strokeOpacity="0.25"
                strokeWidth="1.5"
                paintOrder="stroke"
                fontSize="9"
                fontWeight="600"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {degree}
              </text>
            );
          })}
        </svg>
        <button
          type="button"
          className="pointer-events-auto absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 touch-none cursor-grab active:cursor-grabbing border border-gray-300 rounded-full"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
      </div>
    </div>
  );
}

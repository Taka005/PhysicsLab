"use client";

import { useEffect, useState } from "react";
import { Engine, BaseBody } from "@/lib/engine";
import { capitalize } from "@/lib/engine";

const MAX_SAMPLES = 600;

type Sample = {
  time: number;
  positionX: number;
  positionY: number;
  velocityX: number;
  velocityY: number;
};

type Series = {
  key: "positionX" | "positionY" | "velocityX" | "velocityY";
  label: string;
  color: string;
};

const GRAPH_WIDTH = 260;
const GRAPH_HEIGHT = 116;
const PADDING = { top: 8, right: 8, bottom: 22, left: 42 };

function formatValue(value: number): string {
  if (Math.abs(value) >= 1000 || (Math.abs(value) > 0 && Math.abs(value) < 0.01)) {
    return value.toExponential(1);
  }
  return value.toFixed(1);
}

function getSample(body: BaseBody, time: number): Sample {
  const position = body.position;
  const velocity = body.velocity;

  return {
    time,
    positionX: position.x,
    positionY: position.y,
    velocityX: velocity.x,
    velocityY: velocity.y
  };
}

function Graph({
  title,
  samples,
  series
}: {
  title: string;
  samples: Sample[];
  series: Series[];
}) {
  const plotWidth = GRAPH_WIDTH - PADDING.left - PADDING.right;
  const plotHeight = GRAPH_HEIGHT - PADDING.top - PADDING.bottom;

  const values = samples.flatMap((sample) => series.map(({ key }) => sample[key]));

  let minY = values.length > 0 ? Math.min(...values) : -1;
  let maxY = values.length > 0 ? Math.max(...values) : 1;

  if (minY === maxY) {
    const padding = Math.max(Math.abs(minY) * 0.1, 1);
    minY -= padding;
    maxY += padding;
  } else {
    const padding = (maxY - minY) * 0.08;
    minY -= padding;
    maxY += padding;
  }

  const minTime = samples[0]?.time ?? 0;
  const maxTime = samples[samples.length - 1]?.time ?? 1;
  const timeRange = maxTime - minTime || 1;

  const yFor = (value: number) => PADDING.top + (maxY - value) / (maxY - minY) * plotHeight;
  const xFor = (time: number) => PADDING.left + (time - minTime) / timeRange * plotWidth;
  const zeroY = minY <= 0 && maxY >= 0 ? yFor(0) : null;

  return (
    <section>
      <h3 className="mb-1 text-xs font-semibold text-gray-700">{title}</h3>
      <svg
        role="img"
        viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`}
        className="block w-full"
      >
        {[0, 0.5, 1].map((ratio) => {
          const y = PADDING.top + ratio * plotHeight;
          const value = maxY - ratio * (maxY - minY);
          return (
            <g key={ratio}>
              <line x1={PADDING.left} x2={GRAPH_WIDTH - PADDING.right} y1={y} y2={y} stroke="#e5e7eb" />
              <text x={PADDING.left - 4} y={y + 3} textAnchor="end" fill="#6b7280" fontSize="8">
                {formatValue(value)}
              </text>
            </g>
          );
        })}
        {zeroY !== null && (
          <line
            x1={PADDING.left}
            x2={GRAPH_WIDTH - PADDING.right}
            y1={zeroY}
            y2={zeroY}
            stroke="#9ca3af"
            strokeDasharray="3 3"
          />
        )}
        <line
          x1={PADDING.left}
          x2={GRAPH_WIDTH - PADDING.right}
          y1={GRAPH_HEIGHT - PADDING.bottom}
          y2={GRAPH_HEIGHT - PADDING.bottom}
          stroke="#9ca3af"
        />
        <text x={PADDING.left} y={GRAPH_HEIGHT - 6} fill="#6b7280" fontSize="8">
          {minTime.toFixed(2)} 秒
        </text>
        <text x={GRAPH_WIDTH - PADDING.right} y={GRAPH_HEIGHT - 6} textAnchor="end" fill="#6b7280" fontSize="8">
          {maxTime.toFixed(2)} 秒
        </text>
        {series.map(({ key, color }) => {
          const path = samples
            .map((sample, index) => `${index === 0 ? "M" : "L"}${xFor(sample.time)},${yFor(sample[key])}`)
            .join(" ");
          return (
            <path
              key={key}
              d={path}
              fill="none"
              stroke={color}
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      <div className="flex gap-3">
        {series.map(({ key, label, color }) => (
          <span key={key} className="flex items-center gap-1 text-[10px] text-gray-600">
            <span className="h-0.5 w-3" style={{ backgroundColor: color }} />
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}

export default function BodyGraphs({ engine, body }: { engine: Engine; body: BaseBody }) {
  const [samples, setSamples] = useState<Sample[]>([]);

  useEffect(() => {
    let time = 0;
    const initialBody = engine.getObject(body.id);
    setSamples(initialBody instanceof BaseBody ? [getSample(initialBody, time)] : []);

    return engine.subscribeSample((deltaTime) => {
      const currentBody = engine.getObject(body.id);
      if (!(currentBody instanceof BaseBody)) return;

      time += deltaTime;

      const sample = getSample(currentBody, time);
      setSamples((current) => [...current, sample].slice(-MAX_SAMPLES));
    });
  }, [body.id, engine]);

  const positionSeries: Series[] = [
    { key: "positionX", label: "X", color: "#2563eb" },
    { key: "positionY", label: "Y", color: "#ea580c" }
  ];
  const velocitySeries: Series[] = [
    { key: "velocityX", label: "X", color: "#2563eb" },
    { key: "velocityY", label: "Y", color: "#ea580c" }
  ];

  return (
    <div className="rounded-lg bg-white/55 p-3">
      <p className="mb-2 truncate font-mono text-[10px] text-gray-500" title={body.id}>
        {capitalize(body.type)} / {body.id}
      </p>
      <div className="flex flex-col gap-3">
        <Graph title="時間 - 位置" samples={samples} series={positionSeries} />
        <Graph title="時間 - 速度" samples={samples} series={velocitySeries} />
      </div>
      <p className="mt-2 text-[10px] text-gray-500">
        {samples.length} / {MAX_SAMPLES}
      </p>
    </div>
  );
}

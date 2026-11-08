import { Sample, Series } from "./GraphPanel";

const GRAPH_WIDTH = 260;
const GRAPH_HEIGHT = 116;
const PADDING = { top: 8, right: 8, bottom: 22, left: 42 };

function formatValue(value: number): string {
  const magnitude = Math.abs(value);
  if (magnitude >= 1000) return value.toFixed(0);
  if (magnitude > 0 && magnitude < 0.1) return value.toFixed(3);
  return value.toFixed(1);
}

export function Graph({
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
        {[0.2, 0.4, 0.6, 0.8].map((ratio) => {
          const x = PADDING.left + ratio * plotWidth;
          return (
            <line
              key={ratio}
              x1={x}
              x2={x}
              y1={PADDING.top}
              y2={GRAPH_HEIGHT - PADDING.bottom}
              stroke="#e5e7eb"
            />
          );
        })}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = PADDING.top + ratio * plotHeight;
          const value = maxY - ratio * (maxY - minY);
          return (
            <g key={ratio}>
              <line x1={PADDING.left} x2={GRAPH_WIDTH - PADDING.right} y1={y} y2={y} stroke="#e5e7eb" />
              <text x={PADDING.left - 4} y={y + 3} textAnchor="end" fill="#7f7f80" fontSize="8">
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
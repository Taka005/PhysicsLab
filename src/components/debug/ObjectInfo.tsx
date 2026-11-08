"use client";

import type { CSSProperties } from "react";
import { BaseBody, BaseGround, Curve, Line, capitalize } from "@/lib/engine";

type ObjectInfoProps = {
  bodies: BaseBody[];
  grounds: BaseGround[];
  position: CSSProperties;
};

export default function ObjectInfo({ bodies, grounds, position }: ObjectInfoProps) {
  return (
    <div
      className="pointer-events-none absolute z-20 w-72 overflow-y-auto rounded-xl border border-gray-200/80 bg-white/80 p-3 text-gray-700 shadow-lg backdrop-blur-sm"
      style={position}
    >
      {bodies.map((body) => (
        <div
          key={body.id}
          className="mb-2 rounded-lg border border-gray-200/80 bg-gray-50/50 p-2 last:mb-0"
        >
          <p className="mb-1 text-xs font-semibold text-sky-600">
            Body / {capitalize(body.type)}
          </p>
          <p className="break-all font-mono text-[10px] text-gray-500">
            ID: {body.id}
          </p>
          <p className="break-all font-mono text-[10px] text-gray-500">
            スクリプトID: {body.scriptId ?? "なし"}
          </p>
          <div className="my-1 border-t border-gray-200/80" />
          <p className="mb-1 text-[10px] font-semibold text-gray-600">
            エンティティー ({body.entities.length})
          </p>
          {body.entities.map((entity) => (
            <div
              key={entity.id}
              className="mt-1 border-l-2 border-sky-400 pl-2"
            >
              <p className="break-all font-mono text-[10px] text-gray-500">
                ID: {entity.id}
              </p>
              <p className="font-mono text-[10px] text-gray-700">
                位置: ({entity.position.x.toFixed(2)}, {entity.position.y.toFixed(2)})
              </p>
              <p className="font-mono text-[10px] text-gray-700">
                速度: ({entity.velocity.x.toFixed(2)}, {entity.velocity.y.toFixed(2)})
              </p>
              <p className="font-mono text-[10px] text-gray-700">
                直径: {entity.diameter.toFixed(2)}
              </p>
              <p className="font-mono text-[10px] text-gray-700">
                質量: {entity.mass}
              </p>
              <p className="font-mono text-[10px] text-gray-700">
                接続数: {entity.connection.targetCount}
              </p>
            </div>
          ))}
        </div>
      ))}
      {grounds.map((ground) => (
        <div
          key={ground.id}
          className="mb-2 rounded-lg border border-gray-200/80 bg-gray-50/80 p-2 last:mb-0"
        >
          <p className="mb-1 text-xs font-semibold text-amber-600">
            Ground / {capitalize(ground.type)}
          </p>
          <p className="break-all font-mono text-[10px] text-gray-500">
            ID: {ground.id}
          </p>
          <p className="break-all font-mono text-[10px] text-gray-500">
            スクリプトID: {ground.scriptId ?? "なし"}
          </p>
          <div className="my-1 border-t border-gray-200/80" />
          <p className="font-mono text-[10px] text-gray-700">
            幅: {ground.width.toFixed(2)}
          </p>
          {ground instanceof Line && (
            <>
              <p className="font-mono text-[10px] text-gray-700">
                始点: ({ground.start.x.toFixed(2)}, {ground.start.y.toFixed(2)})
              </p>
              <p className="font-mono text-[10px] text-gray-700">
                終点: ({ground.end.x.toFixed(2)}, {ground.end.y.toFixed(2)})
              </p>
            </>
          )}
          {ground instanceof Curve && (
            <>
              <p className="font-mono text-[10px] text-gray-700">
                始点: ({ground.start.x.toFixed(2)}, {ground.start.y.toFixed(2)})
              </p>
              <p className="font-mono text-[10px] text-gray-700">
                中点: ({ground.middle.x.toFixed(2)}, {ground.middle.y.toFixed(2)})
              </p>
              <p className="font-mono text-[10px] text-gray-700">
                終点: ({ground.end.x.toFixed(2)}, {ground.end.y.toFixed(2)})
              </p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

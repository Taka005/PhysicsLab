import { useCallback, useSyncExternalStore } from "react";
import { useEngine } from "@/context/EngineContext";
import { DEFAULT_ENGINE_VALUE, DEFAULT_VIEWPORT_VALUE, EngineSnapShot } from "@/lib/engine/types";

export function useEngineState() {
  const engine = useEngine();

  const emptySubscribe = useCallback(() => () => {}, []);
  const getEmptySnapshot = useCallback(() => ({
    isStarted: false,
    isTrackingMode: false,
    isDynamicTrackingMode: false,
    isDebugMode: false,
    isSetGridCrossMode: false,
    isExecuteScript: true,
    isDisplayGrid: false,
    isDisplayVector: false,
    isDisplayEdge: false,
    isHiddenBody: false,
    isHiddenGround: false,
    trackingInterval: DEFAULT_ENGINE_VALUE.trackingInterval,
    trackingLimit: DEFAULT_ENGINE_VALUE.trackingLimit,
    scriptExecuteInterval: DEFAULT_ENGINE_VALUE.scriptExecuteInterval,
    playBackSpeed: DEFAULT_ENGINE_VALUE.playBackSpeed,
    worldSize: DEFAULT_ENGINE_VALUE.worldSize,
    gridWidth: DEFAULT_VIEWPORT_VALUE.gridWidth,
    gravity: DEFAULT_ENGINE_VALUE.gravity,
    pps: DEFAULT_ENGINE_VALUE.pps,
    friction: DEFAULT_ENGINE_VALUE.friction
  } as EngineSnapShot), []);

  const subscribe = engine ? engine.subscribe : emptySubscribe;
  const getSnapshot = engine ? engine.getSnapshot : getEmptySnapshot;

  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return {
    ...state
  };
}
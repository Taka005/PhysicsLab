import { useCallback, useSyncExternalStore } from "react";
import { useEngine } from "@/context/EngineContext";
import { DEFAULT_ENGINE_VALUE, DEFAULT_VIEWPORT_VALUE, EngineSnapShot } from "@/lib/engine/types";

export function useEngineState(): EngineSnapShot {
  const engine = useEngine();

  const emptySubscribe = useCallback(() => () => {}, []);
  const getEmptySnapshot = useCallback(() => ({
    isStarted: false,
    isTrackingMode: false,
    isDynamicTrackingMode: false,
    isPredictTrackingMode: false,
    isDebugMode: false,
    isSetGridCrossMode: false,
    isDisabledScript: false,
    isDisplayGrid: false,
    isDisplayVector: false,
    isDisplayEdge: false,
    isHiddenBody: false,
    isHiddenEffect: false,
    isHiddenGround: false,
    trackingInterval: DEFAULT_ENGINE_VALUE.trackingInterval,
    trackingLimit: DEFAULT_ENGINE_VALUE.trackingLimit,
    predictTrackingDuration: DEFAULT_ENGINE_VALUE.predictTrackingDuration,
    scriptExecuteInterval: DEFAULT_ENGINE_VALUE.scriptExecuteInterval,
    playBackSpeed: DEFAULT_ENGINE_VALUE.playBackSpeed,
    worldSize: DEFAULT_ENGINE_VALUE.worldSize,
    gridWidth: DEFAULT_VIEWPORT_VALUE.gridWidth,
    gravity: DEFAULT_ENGINE_VALUE.gravity,
    pps: DEFAULT_ENGINE_VALUE.pps,
    friction: DEFAULT_ENGINE_VALUE.friction,
    bodiesCount: 0,
    effectsCount: 0,
    groundsCount: 0,
    entitiesCount: 0
  } as EngineSnapShot), []);

  const subscribe = engine ? engine.subscribe : emptySubscribe;
  const getSnapshot = engine ? engine.getSnapshot : getEmptySnapshot;

  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return state;
}
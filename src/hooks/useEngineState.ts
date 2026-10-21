import { useCallback, useSyncExternalStore } from "react";
import { useEngine } from "@/context/EngineContext";
import { EngineSnapShot } from "@/lib/engine/types";

export function useEngineState() {
  const engine = useEngine();

  const emptySubscribe = useCallback(() => () => {}, []);
  const getEmptySnapshot = useCallback(() => ({
    isStarted: false,
    isTrackingMode: false,
    isDynamicTrackingMode: false,
    isDebugMode: false,
    isSetGridCrossMode: false,
    isDisplayGrid: false,
    isDisplayVector: false,
    playBackSpeed: 1,
    worldSize: 5000,
    gravity: 200,
    pps: 120,
    friction: 0.001
  } as EngineSnapShot), []);

  const subscribe = engine ? engine.subscribe : emptySubscribe;
  const getSnapshot = engine ? engine.getSnapshot : getEmptySnapshot;

  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return {
    ...state
  };
}
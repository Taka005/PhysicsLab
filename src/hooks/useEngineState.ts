import { useCallback, useSyncExternalStore } from "react";
import { useEngine } from "@/context/EngineContext";

export function useEngineState() {
  const engine = useEngine();

  const emptySubscribe = useCallback(() => () => {}, []);
  const getEmptySnapshot = useCallback(() => ({
    isStarted: false,
    isTrackingMode: false,
    isDynamicTrackingMode: false,
    playBackSpeed: 1,
    worldSize: 5000
  }), []);

  const subscribe = engine ? engine.subscribe : emptySubscribe;
  const getSnapshot = engine ? engine.getSnapshot : getEmptySnapshot;

  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return {
    ...state
  };
}
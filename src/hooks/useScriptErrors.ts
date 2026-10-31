"use client";

import { useCallback, useSyncExternalStore } from "react";
import { useEngine } from "@/context/EngineContext";

export function useScriptErrors() {
  const engine = useEngine();

  const emptySubscribe = useCallback(() => () => {},[]);

  const getEmptySnapshot = useCallback(() => [],[]);

  const subscribe = engine?.scriptManager ? engine?.scriptManager.subscribe : emptySubscribe;

  const getSnapshot = engine?.scriptManager ? engine?.scriptManager.getErrorSnapshot : getEmptySnapshot;

  const errors = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getEmptySnapshot
  );

  return { errors };
}
"use client";

import { useCallback, useSyncExternalStore } from "react";
import { useEngine } from "@/context/EngineContext";
import { Script } from "@/lib/engine";

export function useScriptState() {
  const engine = useEngine();

  const emptySubscribe = useCallback(() => () => {}, []);

  const getEmptySnapshot = useCallback((): readonly Script[] => [],[]);

  const scriptManager = engine?.scriptManager;

  const subscribe = scriptManager ? scriptManager.subscribe : emptySubscribe;
  const getSnapshot = scriptManager ? scriptManager.getSnapshot : getEmptySnapshot;

  const scripts = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getEmptySnapshot
  );

  return {
    scripts
  };
}
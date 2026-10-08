"use client";

import { useSyncExternalStore } from "react";
import {
  getPeekEnabled,
  getPeekLocked,
  getServerPeekEnabled,
  getServerPeekLocked,
  setPeekEnabled,
  subscribePeekEnabled,
  subscribePeekLocked,
} from "@/lib/peekEnabled";

export function AvatarToggle({ className = "" }: { className?: string }) {
  const enabled = useSyncExternalStore(subscribePeekEnabled, getPeekEnabled, getServerPeekEnabled);
  const locked = useSyncExternalStore(subscribePeekLocked, getPeekLocked, getServerPeekLocked);

  return (
    <button
      type="button"
      className={`avatar-toggle ${className}`.trim()}
      role="switch"
      aria-checked={enabled}
      aria-disabled={locked}
      onClick={() => {
        if (!getPeekLocked()) setPeekEnabled(!enabled);
      }}
    >
      <span className="avatar-toggle-label">アバター表示</span>
      <span className="avatar-toggle-state" aria-hidden="true">{enabled ? "ON" : "OFF"}</span>
    </button>
  );
}

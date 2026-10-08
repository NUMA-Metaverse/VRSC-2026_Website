"use client";

import { useSyncExternalStore } from "react";
import { getPeekEnabled, getServerPeekEnabled, setPeekEnabled, subscribePeekEnabled } from "@/lib/peekEnabled";

export function AvatarToggle({ className = "" }: { className?: string }) {
  const enabled = useSyncExternalStore(subscribePeekEnabled, getPeekEnabled, getServerPeekEnabled);

  return (
    <button
      type="button"
      className={`avatar-toggle ${className}`.trim()}
      role="switch"
      aria-checked={enabled}
      onClick={() => setPeekEnabled(!enabled)}
    >
      <span className="avatar-toggle-label">アバター表示</span>
      <span className="avatar-toggle-state" aria-hidden="true">{enabled ? "ON" : "OFF"}</span>
    </button>
  );
}

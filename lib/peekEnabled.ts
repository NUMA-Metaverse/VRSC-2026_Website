// 顔を出すアバターのオンオフの設定。ヘッダーのボタンと PeekAvatar で共有する。

const STORAGE_KEY = "peek-avatar-enabled";
const listeners = new Set<() => void>();
let current = true;
let loaded = false;

function load() {
  if (loaded) return;
  loaded = true;
  try {
    if (window.localStorage.getItem(STORAGE_KEY) === "off") current = false;
  } catch {
    // 保存できない環境では、開いている間だけ有効にする。
  }
}

export function getPeekEnabled() {
  if (typeof window !== "undefined") load();
  return current;
}

export function getServerPeekEnabled() {
  return true;
}

export function setPeekEnabled(enabled: boolean) {
  load();
  if (enabled === current) return;
  current = enabled;
  try {
    window.localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
  } catch {
    // 保存できなくても動作は続ける。
  }
  listeners.forEach((listener) => listener());
}

export function subscribePeekEnabled(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

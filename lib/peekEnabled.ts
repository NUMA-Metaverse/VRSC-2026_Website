// 顔を出すアバターのオンオフの設定。ヘッダーのボタンと PeekAvatar で共有する。

// ロケットのアバターが飛び出すとき、画面の端に出ているアバターを急いで引っ込めるための合図。
export const PEEK_RUSH_EVENT = "peek-avatar-rush";

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

// ロケットのアバターが飛んでいる間は、切り替えボタンを押せないようにする。
const lockListeners = new Set<() => void>();
let locked = false;

export function getPeekLocked() {
  return locked;
}

export function getServerPeekLocked() {
  return false;
}

export function setPeekLocked(next: boolean) {
  if (next === locked) return;
  locked = next;
  lockListeners.forEach((listener) => listener());
}

export function subscribePeekLocked(listener: () => void) {
  lockListeners.add(listener);
  return () => {
    lockListeners.delete(listener);
  };
}

export function subscribePeekEnabled(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

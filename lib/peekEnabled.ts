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

// アバターが飛んでくる間は、画面の端のアバターを出さない。飛び終えたあとも、少しだけ間をあける。
const BURST_GRACE_MS = 1_200;
// 飛んでいる間に確かめ直すまでの間隔。
const BURST_RECHECK_MS = 400;
let bursting = false;
let burstEndedAt = -Infinity;

export function setPeekBursting(next: boolean) {
  if (bursting && !next) burstEndedAt = performance.now();
  bursting = next;
}

// 画面の端のアバターを出してよくなるまでの時間(ミリ秒)。0なら、いま出してよい。
export function getPeekQuietMs() {
  if (bursting) return BURST_RECHECK_MS;
  return Math.max(0, burstEndedAt + BURST_GRACE_MS - performance.now());
}

export function subscribePeekEnabled(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

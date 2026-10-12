import { staff } from "@/data/staff";

// 顔を出すアバターのオンオフの設定。ヘッダーのボタンと PeekAvatar で共有する。

// ロケットのアバターが飛び出すとき、画面の端に出ているアバターを急いで引っ込めるための合図。
export const PEEK_RUSH_EVENT = "peek-avatar-rush";

// 制作、運営の全員をすでに見た端末で、ゲストのアバターが出る確率。
export const GUEST_RATE = 0.05;
// ゲストのアバターは、制作、運営の人よりこれだけ大きく出す。
export const GUEST_SCALE = 1.5;

export const SEEN_STORAGE_KEY = "peek-avatar-seen";
const staffAvatarIds = staff.flatMap((member) => (member.avatar ? [member.id] : []));
const seen = new Set<string>();

function loadSeen() {
  try {
    const raw = window.localStorage.getItem(SEEN_STORAGE_KEY);
    if (!raw) return;
    const stored: unknown = JSON.parse(raw);
    if (Array.isArray(stored)) {
      for (const id of stored) {
        if (typeof id === "string") seen.add(id);
      }
    }
  } catch {
    // 読めない環境では、開いている間に出た分だけを数える。
  }
}

export function markStaffSeen(id: string) {
  if (typeof window === "undefined") return;
  loadSeen();
  if (seen.has(id)) return;
  seen.add(id);
  try {
    window.localStorage.setItem(SEEN_STORAGE_KEY, JSON.stringify([...seen]));
  } catch {
    // 保存できなくても動作は続ける。
  }
}

export function hasSeenAllStaff() {
  if (typeof window === "undefined") return false;
  loadSeen();
  return staffAvatarIds.every((id) => seen.has(id));
}

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

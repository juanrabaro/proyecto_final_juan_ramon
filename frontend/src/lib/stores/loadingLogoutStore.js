import { writable } from "svelte/store";

export const loadingLogout = writable(false);

export function initLoading() {
  loadingLogout.set(true);
}

export function endLoading() {
  loadingLogout.set(false);
}

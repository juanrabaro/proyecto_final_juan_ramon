import { writable } from "svelte/store";

export const dndMoving = writable(false);

export function moving() {
  dndMoving.set(true);
}
 
export function notMoving() {
  dndMoving.set(false);
}
import { writable } from "svelte/store";

export const dndMoving = writable(false);

export function moving() {
  console.log("se mueveee");
  dndMoving.set(true);
}

export function notMoving() {
  console.log("no se mueveee");
  dndMoving.set(false);
}
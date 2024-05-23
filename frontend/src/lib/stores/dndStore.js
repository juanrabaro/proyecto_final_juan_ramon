import { writable } from "svelte/store";

export const dndMoving = writable(false);

export function moving() {
  console.log("empezando a moverse");
  dndMoving.set(true);
}

export function notMoving() {
  console.log("parando de moverse");
  dndMoving.set(false);
}
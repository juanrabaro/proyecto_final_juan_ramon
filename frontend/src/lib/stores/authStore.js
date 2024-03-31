import Cookies from 'js-cookie';
import { writable } from "svelte/store";

export const user = writable(null);

export function loginStore(userData) {
  user.set(userData);
}

export function logoutStore() {
  Cookies.remove('token');
  user.set(null);
}

import { writable } from 'svelte/store';
import { localStore } from "./local-storage";

export const lsKey = 'hearts';
// @ts-ignore
export const storedHearts = writable(localStore.get(lsKey) || []);


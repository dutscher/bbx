import { writable } from 'svelte/store';
import imageExtensionJSON from '../../data/image-extension.json';

const { subscribe, set, update } = writable(imageExtensionJSON);
export const storedImageExtension = {
  subscribe,
  set,
  update,
};

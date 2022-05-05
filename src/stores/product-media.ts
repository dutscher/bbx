import { writable } from 'svelte/store';

const storeProductMedia = writable({
  imageLoaded: false,
  imageIndex: 0,
  videoVisible: false,
  imageSrc: '',
  reason: 'default',
});
export const storedProductMedia = {
  subscribe: storeProductMedia.subscribe,
  set: storeProductMedia.set,
  update: storeProductMedia.update,
};

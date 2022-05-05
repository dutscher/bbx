import { writable } from 'svelte/store';

const storedActiveProductWritable = writable({
  product: {
    id: 0,
    type: '', // product-type todaychanges, hearts etc.
  },
  reason: 'default',
});
export const storedActiveProduct = {
  subscribe: storedActiveProductWritable.subscribe,
  set: storedActiveProductWritable.set,
  update: storedActiveProductWritable.update,
};

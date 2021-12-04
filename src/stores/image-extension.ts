import { writable } from 'svelte/store';

import imageExtensionJSON from '../../data/image-extension.json'

export const storedImageExtension = writable({});
storedImageExtension.set(imageExtensionJSON);

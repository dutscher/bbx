import { writable } from 'svelte/store';
import colorsJSON from '../../data/bricklink-colors.json';
import bricklinkColors from '../../data/bricklink-hex.json';

const sortedColors = colorsJSON.map(color => {
  const name = Array.isArray(color) ? color[0].toString() : color;
  const bricklinkName = name
    .replace('Flesh', 'Nougat')
    .replace('Medium Dark Nougat', 'Medium Nougat')
    .replace('Pearl Light Gray, 95 Flat Silver', 'Flat Silver');
  const lastElement = Array.isArray(color) ? color[color.length - 1] : null;
  let hex, id;
  if (bricklinkName in bricklinkColors) {
    [hex, id] = bricklinkColors[bricklinkName].split('|');
  }
  return {
    name,
    seoName: name.toLowerCase().replace(/ /g, '-'),
    de: Array.isArray(color) ? (color.length > 0 ? color[1] : color[0]) : '',
    matcher: Array.isArray(color) ? color : [color],
    ignores: Array.isArray(lastElement) ? color[color.length - 1] : [],
    hex,
    id,
  };
});
const { subscribe, set, update } = writable(sortedColors);
export const storedColors = {
  subscribe,
  set,
  update,
};

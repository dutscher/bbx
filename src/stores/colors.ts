import { writable } from 'svelte/store';
import colorsJSON from '../../data/bricklink-colors.json';
import hexJSON from '../../data/bricklink-hex.json';
// sort colors
const sortedColors = colorsJSON.map((color, i) => {
    const name = Array.isArray(color) ? color[0].toString() : color;
    const lastElement = Array.isArray(color) ? color[color.length - 1] : null;
    return {
        name,
        seoName: name.toLowerCase(),
        de: Array.isArray(color) ? color.length > 0 ? color[1] : color[0] : '',
        matcher: Array.isArray(color) ? color : [color],
        ignores: Array.isArray(lastElement) ? color[color.length - 1] : [],
        hex: hexJSON[name],
        id: i + 1,
    }
})
export const storedColors = writable({});
storedColors.set(sortedColors);

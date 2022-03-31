import {
  API,
  ID_STATE_ANNOUNCEMENT,
  ID_STATE_AVAILABLE,
  ID_STATE_COMING_SOON,
  ID_STATE_UNAVAILABLE,
} from './_interfaces';
// reexport
import { onMount as svelteOnMount } from 'svelte';

export const onMount = svelteOnMount;
export { pad, isDST, getHRDate, getDateTime } from '../scripts/src/clean-utils.js';
export { sites, convertOldParams, getUrlParam, getAllUrlParams, setUrlParams } from './url';

export const titleMatch = (tag, product) => {
  let countMatched = 0;

  if (tag.matcher.includes('chrome') && product.cats && product.cats.includes(3)) {
    countMatched++;
  }
  tag.matcher.map(matchy => {
    if (
      matchy &&
      // ignore ignores
      !Array.isArray(matchy) &&
      // matchy should be inside the title
      product.matchTo.includes(matchy.toLowerCase())
    ) {
      let shouldIgnore = false;
      tag.ignores.map(ignore => {
        if (product.matchTo.includes(ignore.toLowerCase())) {
          shouldIgnore = true;
        }
      });
      if (!shouldIgnore) {
        countMatched++;
      }
    }
  });
  return countMatched;
};

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getLatestStateOfToday(product, compareDate) {
  let lastStateId = product.state.id;

  Object.entries(product.history).map(([strTimestamp, stateId]) => {
    const timestamp = parseInt(strTimestamp);
    // @ts-ignore
    const historyDay = new Date(timestamp).setHours(0, 0, 0, 0);
    const compareDay = new Date(compareDate).setHours(0, 0, 0, 0);
    if (historyDay === compareDay) {
      lastStateId = stateId;
    }
  });

  return lastStateId;
}

export const graphql = async query => {
  return await fetch(`${API}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // query GetLearnWithJasonEpisodes($now: DateTime!) {
    // allEpisode(limit: 10, sort: {date: ASC}, where: {date: {gte: $now}}) {
    body: JSON.stringify({
      query,
    }),
  })
    .then(res => res.json())
    .then(res => res.data);
};

export const jsVoid = 'javascript:void(0)';

export const getProductHref = product => {
  // "href": "/103464/Klassischer-schwarzer-LKW-mit-Trailer-BlueBrixx-Special",
  const urlSafeTitle = product.title.replace(/ /g, '-').replace(/,|(|)/g, '').replace(/ß/g, 'ss');
  return `/${product.id}/${urlSafeTitle}`;
};

export const handlePrice = product => {
  if (product.price > 0) {
    const pricePerPart =
      product.parts > 1 && product.pricePerPart
        ? ` (${product.pricePerPart.toFixed(2).replace('.', ',')} ct/Stein)`
        : '';
    return `${('' + product.price.toFixed(2)).replace('.', ',')}EUR${pricePerPart}`;
  }
  return '';
};

export const ess = (...args) => {
  return args.filter(css => !!css).join(' ');
};

// eastereggs
export const getEEProduct = (products, piece) => {
  let id = piece.match(/(\d{6})/);
  let foundProduct;

  products.map(product => {
    if (product.id === parseInt(id)) {
      foundProduct = product;
    }
  });

  return foundProduct;
};

export const getEEState = product => {
  let state = '';

  if (product) {
    switch (product.state.id) {
      case ID_STATE_AVAILABLE:
        state = 'blue available';
        break;
      case ID_STATE_UNAVAILABLE:
        state = 'red';
        break;
      case ID_STATE_COMING_SOON:
        state = 'green';
        break;
      case ID_STATE_ANNOUNCEMENT:
        state = 'orange';
        break;
    }
  }
  return state;
};

export const getMinInMs = (minutes: number) => {
  return minutes * 60 * 1000;
};

export const stopClick = e => {
  e.preventDefault();
  e.stopPropagation();
};

export const getOffsetRect = el => {
  let rect = el.getBoundingClientRect();

  // add window scroll position to get the offset position
  let left = rect.left + window.scrollX;
  let top = rect.top + window.scrollY;
  let right = rect.right + window.scrollX;
  let bottom = rect.bottom + window.scrollY;
  let x;
  let y;

  // polyfill missing 'x' and 'y' rect properties not returned
  // from getBoundingClientRect() by older browsers
  if (rect.x === undefined) x = left;
  else x = rect.x + window.scrollX;

  if (rect.y === undefined) y = top;
  else y = rect.y + window.scrollY;

  // width and height are the same
  let width = rect.width;
  let height = rect.height;

  return { left, top, right, bottom, x, y, width, height };
};

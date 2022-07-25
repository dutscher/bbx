import {
  API,
  ID_STATE_ANNOUNCEMENT,
  ID_STATE_AVAILABLE,
  ID_STATE_COMING_SOON,
  ID_STATE_UNAVAILABLE,
} from '@interfaces';
// reexport
import { onMount as svelteOnMount, onDestroy as svelteOnDestory } from 'svelte';

export const onMount = svelteOnMount;
export const onDestroy = svelteOnDestory;
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
  const urlSafeTitle = product.title.replace(' \& ', '-').replace(/ /g, '-').replace(/,|(|)/g, '').replace(/ß/g, 'ss');
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

export const getStateAgo = (product, stateId, date, prevDate, index) => {
  if (index === 0) {
    return calcTimeAgo(product);
  }
  if (stateId === ID_STATE_AVAILABLE && prevDate) {
    return `für ${getTimeDiff(prevDate, date)}`;
  }
  return '';
};

const calcTimeAgo = product => {
  const times = [
    ['second', 1, 'Sek.'],
    ['minute', 60, 'Min.'],
    ['hour', 3600, 'Std.'],
    ['day', 86400, 'Tag', 'e'],
    ['week', 604800, 'Woche', 'n'],
    ['month', 2592000, 'Mon.'],
    ['year', 31536000, 'Jahr', 'e'],
  ];

  const today: any = new Date();
  const lastDate: any = new Date(product.stateDate);
  let diff: any = Math.round((today - lastDate) / 1000);
  for (let t = 0; t < times.length; t++) {
    if (diff < times[t][1]) {
      if (t == 0) {
        return 'jetzt';
      } else {
        // @ts-ignore
        diff = Math.round(diff / times[t - 1][1]);
        return 'seit ' + diff + ' ' + times[t - 1][2] + (diff !== 1 && times[t - 1][3] ? times[t - 1][3] : '');
      }
    }
  }
};

const getTimeDiff = (dateNow, dateDiff) => {
  const now = new Date(dateNow).getTime();
  const ms = now - new Date(dateDiff).getTime();
  const days = Math.round(ms / 86400000); // days
  const hrs = Math.round((ms % 86400000) / 3600000); // hours
  const mins = Math.round(((ms % 86400000) % 3600000) / 60000); // minutes
  let strReturn = '';

  let daysStr = days > 0 ? days + ` Tag${days !== 1 ? 'e' : ''}` : '';
  if (days > 6) {
    const weeks = Math.round(days / 7);
    strReturn = weeks + ` Woche${weeks !== 1 ? 'n' : ''}`;
  } else {
    strReturn = `${daysStr}${hrs > 0 ? ' ' + hrs + 'h' : ''}${mins > 0 && mins < 60 ? mins + 'm' : ''}`;
  }

  return strReturn;
};

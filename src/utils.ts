import {
  API,
  ID_STATE_ANNOUNCEMENT,
  ID_STATE_AVAILABLE,
  ID_STATE_COMING_SOON,
  ID_STATE_UNAVAILABLE,
} from './_interfaces';
import {
  pad as pad_,
  isDST as isDST_,
  getHRDate as getHRDate_,
  getDateTime as getDateTime_,
} from '../scripts/src/clean-utils.js';

// reexport
export const pad = pad_;
export const isDST = isDST_;
export const getHRDate = getHRDate_;
export const getDateTime = getDateTime_;

const convertParams = {
  site: 's',
  product: 'p',
  tags: 't',
  search: 'q',
  states: 'e',
};

export function getUrlParam(variable) {
  // remove ? with substring
  let query = window.location.search.substring(1);
  // fallback for old hash urls
  const hash = window.location.hash.substring(1);
  if (!!hash) {
    query = hash;
  }
  const vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
    const useConverted = variable in convertParams ? convertParams[variable] : variable;
    if (decodeURIComponent(pair[0]) === useConverted) {
      return decodeURIComponent(pair[1]);
    }
  }
  return '';
}

export function getAllUrlParams(converted: boolean = true) {
  // remove ? with substring
  const query = window.location.search.substring(1);
  const vars = query ? query.split('&') : [];
  const convertedValues = Object.values(convertParams);
  const obj = {};
  for (let i = 0; i < vars.length; i++) {
    const [key, value] = vars[i].split('=');
    const indexConverted = converted ? convertedValues.indexOf(key) : key;
    const useConverted = indexConverted > -1 ? Object.keys(convertParams)[indexConverted] : key;
    if (decodeURIComponent(useConverted)) {
      obj[useConverted] = decodeURIComponent(value);
    }
  }
  return obj;
}

export function setUrlParams(param, array) {
  // compare the active params to querystring
  const allSearch = getAllUrlParams(false);
  const useConverted = param in convertParams ? convertParams[param] : param;
  // no array
  if (!Array.isArray(array)) {
    if (!!array) {
      allSearch[useConverted] = array;
    } else {
      delete allSearch[useConverted];
    }
    // empty array
  } else if (array.length === 0) {
    delete allSearch[useConverted];
    // full array
  } else {
    allSearch[useConverted] = array.join(',');
  }
  let newUrl = '';
  Object.keys(allSearch).forEach(function (param, index) {
    newUrl += (index === 0 ? '' : '&') + param + '=' + allSearch[param];
  });

  history.pushState('', '', newUrl ? '?' + newUrl : '/');
}

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

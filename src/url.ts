const convertParams = {
  site: 's',
  product: 'p',
  tags: 't',
  search: 'q',
  states: 'e',
  designer: 'd',
};

export const sites = [
  { short: 'home', icon: 'home', title: 'Home' },
  { short: 'hearts', icon: 'favorite', title: 'Merkliste' },
  {
    short: 'products',
    icon: 'category',
    title: 'Produkte',
    params: ['product', 'tags', 'search', 'states', 'filter', 'designer'],
  },
  { short: 'changes', icon: 'star_rate', title: 'Status', params: ['tab', 'latest'] },
  { short: 'history', icon: 'schedule', title: 'Aktuelles', params: ['date'] },
];
// add site to every site as valid param
sites.map(site => {
  site.params = site.params || [];
  site.params.push('site');
  // convert to short params
  site.params = site.params.map(param => (param in convertParams ? convertParams[param] : param));
  return site;
});

export function convertOldParams() {
  const oldParams = getAllUrlParams(false);
  Object.entries(oldParams).map(([longParam, value]) => {
    if (longParam in convertParams) {
      setUrlParams(longParam, []);
      // @ts-ignore TS2339: Property 'split' does not exist on type 'unknown'.
      setUrlParams(convertParams[longParam], value.split(','));
    }
  });
}

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

export function setUrlParams(param, array, removeSiteParams: boolean = false) {
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
    delete allSearch[param];
    delete allSearch[useConverted];
    // full array
  } else {
    allSearch[useConverted] = array.join(',');
  }

  if (removeSiteParams) {
    const site = sites.find(site => site.short === array);
    if (site) {
      Object.keys(allSearch).map(param => {
        if ('params' in site && !site.params.includes(param)) {
          delete allSearch[param];
        }
      });
    }
  }

  let newUrl = '';
  Object.keys(allSearch).map((param, index) => {
    newUrl += (index === 0 ? '' : '&') + param + '=' + allSearch[param];
  });

  history.pushState('', '', newUrl ? '?' + newUrl : '/');
}

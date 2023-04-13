import fetch from 'node-fetch';
import moment from 'moment';
import { JSDOM } from 'jsdom';
// versus
import cheerio from 'cheerio';
import { products } from '../../data/all-products.reducer.js';
import {
  debug,
  getCats,
  getCleanText,
  getPartTags,
  getTags,
  getTextOfElement,
  handleCache,
  printTime,
} from './utils.js';
import { mergeTags, pad, cleanUpHistoryChanges } from './clean-utils.js';
import { ignoreProductsOnUrl, includedProducts, updateProductData } from './interfaces.js';
import states from '../../data/states.json' assert { type: 'json' };
import globalData from '../../data/data.json' assert { type: 'json' };
const { parseCategories, parsePartPacks } = globalData;

const bbUrl = 'https://www.bluebrixx.com';
const limit = 'limit=1000';

const today = new Date();
const cacheDir = `./data/cache/`;
// /202105/27/22
const year = today.getFullYear();
const month = pad(today.getMonth() + 1);
const day = pad(today.getDate());
const hour = pad(today.getHours());
const todayCacheDir = `${cacheDir}${year}${month}/${day}/`;

let allTimeChanges;

let parsedDataToday = {
  items: products,
};

const isExistingProduct = itemId => parsedDataToday.items.some(obj => obj.id === itemId);

const parsePageJSDOM = async url => {
  // out of ./data/data.json
  // https://www.bluebrixx.com/de/bluebrixxspecials/military_models
  const urlDirs = url.split('/de/')[1].split('/');
  const fetchUrl = `${url}${url.includes('?') ? '&' : '?'}${limit}`;

  const cache = await handleCache(
    todayCacheDir,
    `${urlDirs.join('.')}.${hour}`,
    async () => await fetch(fetchUrl).then(res => res.text())
  );
  const dom = new JSDOM(cache);
  // // # trefferListe
  // // 1 - 24 von 113
  // const pager = dom.window.document.querySelector('#trefferListe').textContent;
  const items = Array.from(dom.window.document.querySelectorAll('.category'));
  // .label_announcement -> ANKÜNDIGUNG
  // .label_comingsoon -> BALD ERHÄLTLICH!
  // .label_unavailable -> ZURZEIT VERGRIFFEN
  // .label_parts -> 5337 PCS
  // .searchItemTitle -> Manhattan Unit 3 Foley Square
  // .searchItemDesc -> BlueBrixx-Special
  // .regPrice -> 39,95 EUR
  // img[src] -> https://www.bluebrixx.com/img/items/100/100871/300/100871_1.jpg
  // a[href] -> https://www.bluebrixx.com/de/architecture/100871/Manhattan-Unit-3-Foley-Square-BlueBrixx-Special

  // console.log(url, urlDirs, items.length)

  items.map(item => {
    const state = item.querySelector('.label_announcement,.label_comingsoon,.label_unavailable');
    const parts = item.querySelector('.label_parts');
    const price = item.querySelector('.regPrice');
    const specPrice = item.querySelector('.specPrice');
    const title = getTextOfElement(item.querySelector('.searchItemTitle'));
    const cat = getTextOfElement(item.querySelector('.searchItemDesc'));
    // https://www.bluebrixx.com/de/architecture/103360/Bockwindmuehle-BlueBrixx-Special
    const href = item.querySelector('a').getAttribute('href').replace(bbUrl, '');
    let id = href.match(/([\d]{6,7})/)[1];
    id = id.startsWith('00') ? id : parseInt(id);

    // skip if wrong categorized
    if (
      (url in ignoreProductsOnUrl && ignoreProductsOnUrl[url].includes(id)) ||
      (!cat.includes('BlueBrixx') && !href.includes('/BPP') && !includedProducts.includes(id))
    ) {
      //console.log('wrong bb product', url, cat, id);
      return;
    }

    if (true && id === 601792) {
      debug({ url, urlDirs, cat, id });
    }

    let endPrice;
    if (price || specPrice) {
      endPrice = parseFloat(
        getTextOfElement(price || specPrice)
          .replace('*', '')
          .replace(',', '.')
      );
    }

    const data = updateProductData(
      {
        title,
        id,
        cats: getCats(url, cat),
        tags: getTags(urlDirs, title, cat, href, id),
        partTags: getPartTags(urlDirs, title, id),
        partNr: -1,
        parts: parts ? parseInt(getTextOfElement(parts).replace(' PCS')) : 0,
        price: endPrice,
        state: state ? states.de.indexOf(getTextOfElement(state)) : 0,
        history: {},
      },
      {
        catName: cat,
      }
    );

    createProduct(data);
  });
};

const parsePageCherrio = async url => {
  // out of ./data/data.json
  // https://www.bluebrixx.com/de/bluebrixxspecials/military_models
  const urlDirs = url.split('/de/')[1].split('/');
  const fetchUrl = `${url}${url.includes('?') ? '&' : '?'}${limit}`;

  const cache = await handleCache(
    todayCacheDir,
    `${urlDirs.join('.')}.${hour}`,
    async () => await fetch(fetchUrl).then(res => res.text())
  );
  const $ = cheerio.load(cache);
  // // # trefferListe
  // // 1 - 24 von 113
  // const pager = dom.window.document.querySelector('#trefferListe').textContent;
  const items = $('.category');
  // .label_announcement -> ANKÜNDIGUNG
  // .label_comingsoon -> BALD ERHÄLTLICH!
  // .label_unavailable -> ZURZEIT VERGRIFFEN
  // .label_parts -> 5337 PCS
  // .searchItemTitle -> Manhattan Unit 3 Foley Square
  // .searchItemDesc -> BlueBrixx-Special
  // .regPrice -> 39,95 EUR
  // img[src] -> https://www.bluebrixx.com/img/items/100/100871/300/100871_1.jpg
  // a[href] -> https://www.bluebrixx.com/de/architecture/100871/Manhattan-Unit-3-Foley-Square-BlueBrixx-Special

  // console.log(url, urlDirs, items.length)

  items.map((index, item) => {
    const state = $(item).find('.label_announcement,.label_comingsoon,.label_unavailable').text();
    const parts = $(item).find('.label_parts').text();
    const price = $(item).find('.regPrice').text();
    const specPrice = $(item).find('.specPrice').text();
    const title = getCleanText($(item).find('.searchItemTitle').text());
    const cat = getCleanText($(item).find('.searchItemDesc').text());
    // https://www.bluebrixx.com/de/architecture/103360/Bockwindmuehle-BlueBrixx-Special
    const href = $($(item).find('a')).attr('href').replace(bbUrl, '');
    let id = href.match(/([\d]{6,7})/)[1];
    id = id.startsWith('00') ? id : parseInt(id);

    // skip if wrong categorized
    if (
      (url in ignoreProductsOnUrl && ignoreProductsOnUrl[url].includes(id)) ||
      (!cat.includes('BRIX') && !cat.includes('BlueBrixx') && !href.includes('/BPP') && !includedProducts.includes(id))
    ) {
      //console.log('wrong bb product', url, cat, id);
      return;
    }

    if (false && id === 608085) {
      debug('cherio parse', id, url, urlDirs, cat, title);
      debug('getCats', getCats(url, cat), url, cat);
      debug('getTags', getTags(urlDirs, title, cat, href, id), href);
    }

    let endPrice = 0;
    if (price || specPrice) {
      endPrice = parseFloat(
        getCleanText(price || specPrice)
          .replace('*', '')
          .replace(',', '.')
      );
    }

    const data = updateProductData(
      {
        title,
        id,
        cats: getCats(url, cat),
        tags: getTags(urlDirs, title, cat, href, id),
        partTags: getPartTags(urlDirs, title, id),
        parts: parts ? parseInt(getCleanText(parts).replace(' PCS')) : 0,
        price: endPrice,
        state: state ? states.de.indexOf(getCleanText(state)) : 0,
        history: {},
      },
      {
        catName: cat,
      }
    );

    createProduct(data);
  });
};

const createProduct = data => {
  // add changes from api
  if (data.id in allTimeChanges && Object.keys(allTimeChanges[data.id].history).length > 0) {
    data.history = allTimeChanges[data.id].history;
  }

  // push to all
  if (!isExistingProduct(data.id)) {
    parsedDataToday.items.push(data);
    // item exists
  } else {
    let itemIndexExists = -1;
    parsedDataToday.items.filter((obj, i) => {
      const foundTitle = obj.id === data.id;
      if (foundTitle) {
        itemIndexExists = i;
      }
      return foundTitle;
    });
    // update difference
    if (itemIndexExists > -1) {
      const itemExists = parsedDataToday.items[itemIndexExists];

      // merge tags
      parsedDataToday.items[itemIndexExists].tags = mergeTags(itemExists.tags, data.tags);

      parsedDataToday.items[itemIndexExists].partTags = data.partTags;
      parsedDataToday.items[itemIndexExists].partNr = data.partNr;

      parsedDataToday.items[itemIndexExists].history = { ...itemExists.history, ...data.history };
      cleanUpHistoryChanges(parsedDataToday.items[itemIndexExists]);

      // add stage changes if api has no changes for this product
      if (itemExists.state !== data.state) {
        parsedDataToday.items[itemIndexExists].state = data.state;
      }
      parsedDataToday.items[itemIndexExists].cats = data.cats;
      // remove old stuff
      parsedDataToday.items[itemIndexExists].title = data.title;
      parsedDataToday.items[itemIndexExists].parts = data.parts;
      parsedDataToday.items[itemIndexExists].price = data.price;
    }
  }
};

const parsePage = async url => {
  //await parsePageJSDOM(url); // 14637ms
  await parsePageCherrio(url); // 2814ms
};

export const parsePages = async allTimeChanges_ => {
  allTimeChanges = allTimeChanges_;
  let startDate = moment(new Date());

  await Promise.all(parseCategories.map(async page => await parsePage(page)));

  printTime('parsePages', startDate);
};

export const parsePagesNParts = async allTimeChanges_ => {
  allTimeChanges = allTimeChanges_;
  let startDate = moment(new Date());

  await Promise.all([...parseCategories, ...parsePartPacks].map(async page => await parsePage(page)));

  printTime('parsePagesNParts', startDate);
};

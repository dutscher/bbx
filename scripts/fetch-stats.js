import moment from 'moment';
import fetch from 'node-fetch';
import { handleCache, printTime } from './src/utils.js';
import { fetchChanges, cleanUpHistoryChanges } from './src/api-changes.js';
import { parsePages, parsePagesNParts } from './src/parse-page.js';
import { products, convertToReduce } from '../data/all-products.reducer.js';
import allProductHistory from '../data/all-products-history.json';
const params = process.argv;

// self parsed
let parsedDataToday = {
  items: products,
};
let allTimeChanges = {};

const mergeChangesWithDB = allTimeChanges => {
  Object.entries(allTimeChanges).map(productChange => {
    const productId = parseInt(productChange[0]);
    const changes = productChange[1];
    let isNewProduct = false;

    let product = parsedDataToday.items.find(product => product.id === productId);
    // new product
    if (!product) {
      product = {};
      isNewProduct = true;
    }

    product.id = productId;
    product.title = changes.title;
    product.state = changes.state;
    if (changes.parts !== null) {
      product.parts = changes.parts;
    }
    product.price = changes.price;
    // TODO: parse cats for existing products
    //product.cats = changes.cats;
    //product.tags = changes.tags;
    // history
    product.history = {
      ...product.history,
      ...changes.history,
    };

    cleanUpHistoryChanges(product);

    if (false && product.id === 100090) {
      console.log(product, changes);
    }

    if (isNewProduct) {
      product.cats = changes.cats;
      product.tags = changes.tags;

      parsedDataToday.items.push(product);
    }
  });
};

(async () => {
  let startDate = moment(new Date());
  allTimeChanges = await fetchChanges(true);

  startDate = printTime('fetchChanges', startDate); // 1394ms

  // readd existing history, which was done in svelte via ajax
  products.map(product => {
    product.history = allProductHistory[product.id];
  });

  mergeChangesWithDB(allTimeChanges);

  startDate = printTime('mergeChangesWithDB', startDate); // 289ms

  if (params.includes('--parse-pages')) {
    await parsePages(allTimeChanges);
  }

  if (params.includes('--parse-pages-n-parts')) {
    await parsePagesNParts(allTimeChanges);
  }

  // write items
  let orderedProducts = parsedDataToday.items
    .sort((a, b) => {
      if (a.id < b.id) {
        return -1;
      }
      if (a.id > b.id) {
        return 1;
      }
      return 0;
    })
    .map(product => {
      return convertToReduce(product);
    });

  // exclude history
  const productHistory = {};
  orderedProducts = orderedProducts.map(product => {
    productHistory[product.id] = product.hi;
    delete product.hi;
    return product;
  });

  if (params.includes('--create-compare')) {
    // write compare file
    await handleCache('./data/', `all-products.compare.json`, () => JSON.stringify(orderedProducts, null, 2), true);

    await handleCache(
      './data/',
      `all-products-history.compare.json`,
      () => JSON.stringify(productHistory, null, 2),
      true
    );
  } else {
    await handleCache('./data/', `all-products.json`, () => JSON.stringify(orderedProducts, null, 2), true);
    await handleCache('./data/', `all-products-history.json`, () => JSON.stringify(productHistory, null, 2), true);
  }
  printTime('all done', startDate); // 50ms
})();

import { products, convertToReduce } from '../../data/all-products.reducer.js';
import { handleCache, sortTags } from './utils.js';
import { IDs, ID_STATE_ANNOUNCEMENT } from './interfaces.js';
import { getDateTime } from './clean-utils.js';
import allHistory from '../../data/all-products-history.json' assert { type: 'json' };
import allHistoryBackup from '../../data/api/all-products-history.backup.with.lost.history.json' assert { type: 'json' };
import allDesigner from '../../data/designer.json' assert { type: 'json' };
//import allDesignerBackup from '../../data/designer-json.compare.json' assert { type: 'json' };

export const convertProducts = async () => {
  let changes = [];
  let changeName = 'compare';
  const convertedDB = [];
  const update = 12;

  let productsWithDesigner = {};

  if (update === 11) {
    allDesignerBackup.data.products.edges.map(edge => {
      const designerName = edge.node.designer;
      if (designerName !== null) {
        const foundDesigner = allDesigner.find(designer => designer.name === designerName);
        if (foundDesigner) {
          productsWithDesigner[edge.node['_id']] = foundDesigner.id;
        } else {
          console.log('not found', { designerName });
        }
      }
      return true;
    });
  }

  if (update === 10) {
    changes = {};
  }

  products.map(product => {
    // 13. remove architecture
    if (update === 13 && product.tags.includes(IDs.ID_TAG_ARCHITECTURE)) {
      product.tags = product.tags.filter(tag => tag !== IDs.ID_TAG_ARCHITECTURE);
    }
    // 12. wrong tagged brix products
    if (
      update === 12 &&
      product.tags.includes(IDs.ID_TAG_BRIX) &&
      !product.cats.includes(IDs.ID_CAT_BLUEBRIXX_BRIX[0])
    ) {
      product.tags = product.tags.filter(tag => tag !== IDs.ID_TAG_BRIX);
    }
    // 11. add designer id
    if (update === 11 && product.id in productsWithDesigner) {
      product.designerId = productsWithDesigner[product.id];
    }
    // 10. split history into own
    if (update === 10) {
      changes[product.id] = product.history;
      delete product.history;
    }
    // 9. double history entries
    if (update === 9) {
      let lastState = -1;
      let newHistory = {};
      for (const [date, state] of Object.entries(product.history)) {
        if (lastState !== state) {
          lastState = state;
          newHistory[date] = state;
        }
      }
      product.history = newHistory;
    }
    // 8. pro products
    if (update === 8 && product.tags.includes(IDs.ID_TAG_BLUEBRIXX_PRO)) {
      changeName = 'bb-pro';
      changes.push({ id: product.id, title: product.title });
    }
    // 7. deleted products?
    // if (update === 7 && !(product.id in imagesJSON) && !(product.id in imagesExtraJSON)) {
    //   changes.push(convertToReduce(product));
    // }
    // 6. sort tags
    if (update === 6) {
      product.tags = product.tags.sort(sortTags);
    }

    // 5. image and imageExt addition
    // if (update === 5 && product.id in imagesJSON) {
    //   const image = imagesJSON[product.id];
    //   //  "100090": "/img/items/100/100090/300/100090_1.jpg",
    //   // default is _1
    //   if (!image.includes('_1')) {
    //     product.image = parseInt(image.replace(/.*_(\d).*/, '$1'));
    //   }
    //   // .png is default
    //   // see image-extension.json
    //   if (image.includes('.jpg')) {
    //     product.imageExt = 0;
    //   }
    // }

    // 4. remove special tags from pro category
    if (update === 4 && product.cats.includes(1) && product.tags.includes(0)) {
      product.tags = product.tags.filter(tag => tag !== 0);
    }

    // 3. add Chrome Silver to title
    if (update === 3 && product.cats.includes(IDs.ID_CAT_CHROME_PARTS)) {
      product.title += ', Chrome Silver';
    }

    // 2. reduce json keys
    convertedDB.push(convertToReduce(product));

    // 1. reduce EUR from db
    // product.price = parseFloat(('' + product.price).replace(' EUR', '').replace(',', '.'));
    // return product;
  });

  if ((Array.isArray(changes) && changes.length > 0) || Object.keys(changes).length > 0) {
    console.log(changes.length);

    await handleCache(
      './data/api/convert/',
      `all-products.${changeName}.json`,
      () => JSON.stringify(changes, null, 2),
      true
    );
  }

  await handleCache('./data/', `all-products.convert.compare.json`, () => JSON.stringify(convertedDB, null, 2), true);
};

export const convertHistory = async () => {
  Object.keys(allHistoryBackup).map(productId => {
    //if (!(productId in allHistory)) {
    const oldHistory = allHistoryBackup[productId];

    if (Object.values(oldHistory)[0] === ID_STATE_ANNOUNCEMENT) {
      let newHistory = {};
      Object.entries(oldHistory).map(([hrDate, stateId]) => {
        const date = new Date(getDateTime(hrDate)).getTime() / 1000;
        newHistory[date] = stateId;
      });
      allHistory[productId] = newHistory;
    }
    //}
  });

  await handleCache(
    './data/',
    `all-products-history.convert.compare.json`,
    () => JSON.stringify(allHistory, null, 2),
    true
  );
};

export const convertHistoryOfProduct = async () => {
  const productId = 103406;
  Object.entries(allHistory[productId]).map(([hrDate, stateId]) => {
    if (hrDate.includes('.')) {
      const date = new Date(getDateTime(hrDate)).getTime() / 1000;
      delete allHistory[productId][hrDate];
      allHistory[productId][date] = stateId;
    }
  });

  await handleCache(
    './data/',
    `all-products-history.convert.compare.json`,
    () => JSON.stringify(allHistory, null, 2),
    true
  );
};

/*
// https://www.bluebrixx.com/de/bluebrixx-pro?limit=63
var products = []
var items = document.querySelectorAll('.category')
Array.from(items).map(item => {
var id = parseInt(item.querySelector('a[data-itemno]').getAttribute('data-itemno'));
var title = item.querySelector('.searchItemTitle').innerText;
products.push({id, title});
})
console.log(JSON.stringify(products.sort((a, b) => {
        if (a.id < b.id) {
            return -1;
        }
        if (a.id > b.id) {
            return 1;
        }
        return 0;
    }), null, 2))
*/

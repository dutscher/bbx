import endCursorsFromParse from '../../../data/api-changes.last-cursor.json';
import { queryChanges } from '../../queries';
import { graphql, getProductHref, getHRDate, getMinInMs } from '@utils';
import { LOADED, LOADING } from '@interfaces';
import { isBluebrixxProduct, updateProductData } from '../../../scripts/src/interfaces';
import { cleanUpHistoryChanges } from '../../../scripts/src/clean-utils.js';
import { sortedProducts, storedProducts } from '../products';
import { sortedStates } from '../states';
import { storedActiveSelection } from '../active-selection';
import { internetConnection } from '../internet-connection';
import { doNotify } from '../notifications';
import { setFlags } from './product-data';

// ["MzIyMTA=|02.02.2022 13:37|25"]
const [lastCursorFromJson, lastCursorDate] = endCursorsFromParse[0].split('|');

let isOnline = false;
let fetches = 0;
let timeout;
let lastCursor;
let edges = [];

storedActiveSelection.subscribe(store => (lastCursor = store.lastCursor));

storedActiveSelection.update(store => {
  store.lastCursor = {
    hash: lastCursorFromJson,
    dateStr: lastCursorDate,
  };
  store.reason = 'set-last-cursor';
  return store;
});

const nextFetch = (gogogo: boolean = false) => {
  if (timeout) {
    clearTimeout(timeout);
  }
  if (gogogo) {
    timeout = setTimeout(() => {
      // reset
      edges = [];
      fetches++;
      loadChanges(lastCursor.hash);
    }, getMinInMs(5));
  }
};

internetConnection.subscribe(store => {
  isOnline = store.isOnline;

  nextFetch(isOnline);
});

export const loadChanges = async (endCursor?: string) => {
  // first call
  if (!endCursor) {
    storedActiveSelection.update(store => {
      store.loadedData.changes = LOADING;
      store.reason = 'changes-loading';
      return store;
    });
  }
  const firstPageChanges = await graphql(queryChanges(endCursor || lastCursorFromJson));
  // get results from reverse
  if (firstPageChanges) {
    edges = [...edges, ...firstPageChanges.productChanges.edges];
    if (firstPageChanges.productChanges.pageInfo.hasNextPage) {
      await loadChanges(firstPageChanges.productChanges.pageInfo.endCursor);
    } else {
      evalChanges(edges);

      storedActiveSelection.update(store => {
        store.lastCursor = {
          hash: firstPageChanges.productChanges.pageInfo.endCursor,
          dateStr: getHRDate(),
        };
        store.reason = 'new-endcursor';
        return store;
      });
    }
  }
};

const evalChanges = (edges: any) => {
  const updates = {};
  const latestChangesIds = [];
  const latestChanges = [];
  const newProducts = [];
  const newProductIds = [];

  Array.from(edges).map((edge: any) => {
    const change = edge.node;
    const product = change.product;
    const category = product.category.edges[0].node;

    if (isBluebrixxProduct(product, category)) {
      // product.id: 123456
      const id = product['_id'];
      // get product
      const existingProduct = sortedProducts.find(product => product.id === id);
      // lastchange: 2021-07-03T11:21:07+00:00
      const timestampChange = new Date(change.datetime).getTime();
      const timestampProduct = new Date(product.lastchange).getTime();
      // status._id: UNAVAILABLE
      const stateChange = sortedStates.find(state => state.api === change.status['_id']);
      const stateProduct = sortedStates.find(state => state.api === product.status['_id']);

      // if exists in db and has another state
      if (existingProduct) {
        updates[id] = updateProductData(
          {
            title: product.name,
            id,
            parts: product.pcs,
            price: product.price,
            pricePerPart: product.price && product.pcs ? (product.price / product.pcs) * 100 : 0,
            cats: [],
            tags: [],
            state: stateProduct,
            stateDate: timestampProduct,
            matchTo: product.name,
            history: {
              ...existingProduct.history,
              [timestampChange]: stateChange.id,
              [timestampProduct]: stateProduct.id,
            },
            href: getProductHref({ title: product.name, id }),
          },
          {
            catName: category.name,
            catId: category['_id'],
          }
        );

        latestChangesIds.push(id);
        latestChanges.push(existingProduct);
      } else if (!existingProduct && !newProductIds.includes(id)) {
        // complete new product
        newProductIds.push(id);
        newProducts.push(
          updateProductData(
            {
              title: product.name,
              id,
              parts: product.pcs,
              price: product.price,
              pricePerPart: product.price && product.parts ? (product.price / product.parts) * 100 : 0,
              cats: [],
              tags: [],
              state: stateProduct,
              stateDate: timestampProduct,
              matchTo: product.name,
              history: {
                [timestampChange]: stateChange.id,
                [timestampProduct]: stateProduct.id,
              },
              href: getProductHref({ title: product.name, id }),
            },
            {
              catName: category.name,
              catId: category['_id'],
            }
          )
        );
      }
    }
  });
  // update store
  storedProducts.update((value: any) => {
    let updatesForProducts = value.map(product => {
      // if (product.id === 104313) {
      //     console.log(product, updates[product.id])
      // }
      if (product.id in updates) {
        const productUpdates = updates[product.id];
        if ('state' in productUpdates) {
          product.state = productUpdates.state;
          product.stateDate = productUpdates.stateDate;
        }
        if ('title' in productUpdates) {
          product.title = productUpdates.title;
        }
        if ('parts' in productUpdates) {
          product.parts = productUpdates.parts;
        }
        if ('price' in productUpdates) {
          product.price = productUpdates.price;
          product.pricePerPart = productUpdates.pricePerPart;
        }
        // history: "21.06.2021 12:52": 1
        product.history = {
          ...product.history,
          ...updates[product.id].history,
        };

        cleanUpHistoryChanges(product);

        setFlags(product);

        if (false && product.id === 103209) console.log(product, updates[product.id].history);

        doNotify(product, fetches);
      }
      return product;
    });

    // add new products
    if (newProducts.length > 0) {
      // console.log(newProducts)
      updatesForProducts = [...updatesForProducts, ...newProducts];
    }

    storedActiveSelection.update(store => {
      store.loadedData.changes = LOADED;
      store.reason = 'changes-loaded';
      return store;
    });

    return updatesForProducts;
  });

  nextFetch(true);
};

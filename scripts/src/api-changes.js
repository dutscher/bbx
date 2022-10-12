import { graphql, handleCache, debug } from './utils.js';
import chalk from 'chalk';
import { getHRDate, cleanUpHistoryChanges as utilCleanUpHistoryChanges } from './clean-utils.js';
import allProductHistory from '../../data/all-products-history.json' assert { type: 'json' };
import states from '../../data/states.json' assert { type: 'json' };
import { isBluebrixxProduct, updateProductData } from './interfaces.js';
import lastCursors from '../../data/api-changes.last-cursors.json' assert { type: 'json' };

// filled due graphql api
let allTimeChanges = {};
let edges = [];
let chunk = 1;
let chunkEdgesSize = 15000;

const loadChanges = async endCursor => {
  // get cached edges
  // const files = glob.sync('./data/api/edges/*.json');
  // let edges = [];
  // files.map(filePath => {
  //     edges = [...edges, ...JSON.parse(fs.readFileSync(filePath, 'utf-8'))]
  // });
  // return edges;

  const page = await graphql(`
        {productChanges(
            after: "${endCursor}"
        ) {
          pageInfo {
            endCursor
            hasNextPage
          }
          edges {
            node {
              datetime
              status{_id}
              product {
                _id
                name
                designer
                lastchange
                price
                pcs
                status {
                  _id
                }
                category(last: 10) {
                  edges {
                    node {
                      _id
                      name
                    }
                  }
                }
              }
            }
          }
        }}
    `);

  // get results from reverse
  if (page) {
    edges = [...edges, ...page.productChanges.edges];

    if (page.productChanges.pageInfo.hasNextPage) {
      await loadChanges(page.productChanges.pageInfo.endCursor);
    } else {
      const lastNewCursor = page.productChanges.pageInfo.endCursor;
      if (endCursor !== lastNewCursor) {
        debug('add lastNewCursor', { endCursor, lastNewCursor });
        lastCursors.push(lastNewCursor + '|' + getHRDate() + '|' + edges.length);

        // await handleCache(
        //     './data/api/edges/',
        //     `all-edges.3.${edges.length}.json`,
        //     () => JSON.stringify(edges, null, 2),
        //     true);
      }
    }
  }
  return edges;
};

// https://www.netlify.com/blog/2020/12/21/send-graphql-queries-with-the-fetch-api-without-using-apollo-urql-or-other-graphql-clients/
export const fetchChanges = async (writeLastCursor = true) => {
  const lastCursor = lastCursors[lastCursors.length - 1];
  const edges = await loadChanges(lastCursor.split('|')[0]);

  console.log(chalk.yellow('fetchChanges after loadChanges', lastCursor, '=', edges.length));

  const handleChanges = ({ pcs, _id, price, designer, name }, category) => {
    const productId = _id;
    let catId = category['_id'];
    let history = {};
    if (productId in allTimeChanges) {
      history = allTimeChanges[productId].history;
    }

    allTimeChanges[productId] = updateProductData(
      {
        title: name,
        parts: pcs,
        price: price !== null ? price : 0,
        cats: [],
        tags: [],
        history,
        designer,
      },
      {
        catName: category.name,
        catId,
      }
    );
  };

  const addToHistory = (productId, dateTime, statusId, where) => {
    const timestamp = new Date(dateTime).getTime() / 1000;
    const newStateId = states.api.indexOf(statusId);

    const lastProductStateId = allProductHistory[productId]
      ? allProductHistory[productId][Object.keys(allProductHistory[productId]).pop()]
      : -1;
    const lastStateId = allTimeChanges[productId].history[Object.keys(allTimeChanges[productId].history).pop()];

    if (false && productId === 104000) {
      debug({ dateTime, lastProductStateId, lastStateId, newStateId, where });
    }

    // add every change
    allTimeChanges[productId].history[timestamp] = newStateId;
  };

  Array.from(edges).map(edge => {
    const change = edge.node;
    const product = change.product;
    const productId = product['_id'];
    const category = product.category.edges[0].node;

    if (isBluebrixxProduct(product, category)) {
      // title, tags, price, parts
      handleChanges(product, category);

      if (false && productId === 690001) {
        debug({ title: product.name, price: product.price, parts: product.pcs });
        debug({ change: change.datetime, id: change.status['_id'] });
        debug({ lastchange: product.lastchange, id: product.status['_id'] });
        debug(allTimeChanges[productId]);
        debug('---');
      }

      // check last change
      addToHistory(productId, change.datetime, change.status['_id'], 'change.datetime');
      // and the actual change
      addToHistory(productId, product.lastchange, product.status['_id'], 'product.lastchange');
    }
  });

  if (writeLastCursor) {
    await handleCache('./data/', `api-changes.last-cursors.json`, () => JSON.stringify(lastCursors, null, 2), true);

    await handleCache(
      './data/',
      `api-changes.last-cursor.json`,
      () => JSON.stringify([lastCursors[lastCursors.length - 1]]),
      true
    );
  }

  // await handleCache(
  //     './data/api/',
  //     `all-time-changes.json`,
  //     () => JSON.stringify(allTimeChanges, null, 2),
  //     true);

  return allTimeChanges;
};

export const cleanUpHistoryChanges = utilCleanUpHistoryChanges;

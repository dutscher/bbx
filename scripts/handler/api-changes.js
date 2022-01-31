import { graphql, handleCache, debug } from './utils.js';
import { getHRDate, getDateTime } from './clean-utils.js';
import { products, convertToReduce } from '../../data/all-products.reducer.js';
import history from '../../data/all-products.history.json';
import states from '../../data/states.json';
import {
    isBluebrixxProduct,
    updateProductData,
} from './interfaces.js';
import lastCursors from '../../data/api-changes.last-cursors.json';

// filled due graphql api
let allTimeChanges = {};
let edges = [];
let chunk = 1;
let chunkEdgesSize = 15000;

const loadChanges = async (endCursor) => {
    const edges = [...JSON.parse(await handleCache(
        './data/api/',
        `all-edges.1.15030.json`
    )), ...JSON.parse(await handleCache(
        './data/api/',
        `all-edges.2.12660.json`
    ))];
    return edges;

    // const page = await graphql(`
    //     {productChanges(
    //         after: "${endCursor}"
    //     ) {
    //       pageInfo {
    //         endCursor
    //         hasNextPage
    //       }
    //       edges {
    //         node {
    //           datetime
    //           status{_id}
    //           product {
    //             _id
    //             name
    //             lastchange
    //             price
    //             pcs
    //             status {
    //               _id
    //             }
    //             category(last: 10) {
    //               edges {
    //                 node {
    //                   _id
    //                   name
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     }}
    // `);
    //
    // // get results from reverse
    // if (page) {
    //     edges = [...edges, ...page.productChanges.edges];
    //
    //     if (page.productChanges.pageInfo.hasNextPage) {
    //         await loadChanges(page.productChanges.pageInfo.endCursor);
    //     } else {
    //         const lastNewCursor = page.productChanges.pageInfo.endCursor;
    //         if (endCursor !== lastNewCursor) {
    //             console.log('add lastNewCursor', { endCursor, lastNewCursor });
    //             lastCursors.push(lastNewCursor + '|' + getHRDate() + '|' + edges.length);
    //         }
    //     }
    // }
    // return edges;
};

// https://www.netlify.com/blog/2020/12/21/send-graphql-queries-with-the-fetch-api-without-using-apollo-urql-or-other-graphql-clients/
const fetchChanges = async (writeLastCursor = true) => {
    const lastCursor = lastCursors[lastCursors.length - 1];
    const edges = await loadChanges(lastCursor.split('|')[0]);

    console.log('fetchChanges after loadChanges', lastCursor, '=', edges.length);

    const handleChanges = (product, category) => {
        const productId = product['_id'];
        const parts = product.pcs;
        const price = product.price;
        let title = product.name;
        let catId = category['_id'];
        let history = {};
        if (productId in allTimeChanges) {
            history = allTimeChanges[productId].history;
        }

        allTimeChanges[productId] = updateProductData({
            title,
            parts,
            price: price !== null ? price : 0,
            cats: [],
            tags: [],
            history,
        }, {
            catName: category.name,
            catId,
        });
    }

    const addToHistory = (productId, dateTime, statusId) => {
        // "19.06.2021 18:03": 1
        const hrDate = getHRDate(dateTime);
        const timestamp = new Date(dateTime).getTime() / 1000;
        const key = timestamp //;dateTime.replace('+00:00', '');
        const newStateId = states.api.indexOf(statusId);

        if (false && productId === 100271) {
            debug({ dateTime, statusId });
        }

        //const lastStateId = Object.values(allTimeChanges[productId].history).pop()
        //if (lastStateId !== newStateId) {
            allTimeChanges[productId].history[key] = newStateId;
        //}
    }

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
                debug('---')
            }

            // check last change
            addToHistory(productId, change.datetime, change.status['_id']);
            // and the actual change
            addToHistory(productId, product.lastchange, product.status['_id']);
            // sort date times
            const sortObject = o => Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {})
            allTimeChanges[productId].history = sortObject(allTimeChanges[productId].history);
        }
    })

    if (writeLastCursor) {
        await handleCache(
            './data/',
            `api-changes.last-cursors.json`,
            () => JSON.stringify(lastCursors, null, 2),
            true);

        await handleCache(
            './data/',
            `api-changes.last-cursor.json`,
            () => JSON.stringify([lastCursors[lastCursors.length - 1]]),
            true);
    }

    await handleCache(
        './data/api/',
        `all-time-changes.json`,
        () => JSON.stringify(allTimeChanges, null, 2),
        true);

    return allTimeChanges;
}

export {
    fetchChanges,
}

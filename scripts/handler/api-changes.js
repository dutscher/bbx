import moment from 'moment';
import { graphql, handleCache, getTags, mergeTags, getCats } from './utils.js';
import { getHRDate, getDateTime } from './clean-utils.js';
import states from '../../data/states.json';
import { products, convertToReduce } from '../../data/all-products.reducer.js';
import { IDs }from './interfaces.js';
import lastCursors from '../../data/api-changes.last-cursors.json';
import bricklinkColors from '../../data/bricklink-hex.json';

// https://api.bbx.watch/api/graphql?query=%7BproductCategories(first%3A6193)%7BtotalCount%2Cedges%7Bnode%20%7B_id%2Cname%7D%7D%7D%7D
const catsToParse = [
    IDs.ID_CAT_BLUEBRIXX[1],
    IDs.ID_CAT_BLUEBRIXX_SPECIAL[1],
    IDs.ID_CAT_BLUEBRIXX_PRO[1],
];
const apiCatsToUs = [
    IDs.ID_CAT_BLUEBRIXX[0],
    IDs.ID_CAT_BLUEBRIXX_SPECIAL[0],
    IDs.ID_CAT_BLUEBRIXX_PRO[0],
];
const ignoreProducts = [
    103239, // Container Happy Build
    104303, // Raupenlader Happy Build
    104647, // Mittelalterliche Stadt - Wassermühle UrGe
];
const includeProducts = [
    604840, // Metal pins for Buffer Unit X 50
];

/*
"category": {
            "edges": [
              {
                "node": {
                  "id": "/api/product_categories/2391",
                  "name": "Sand GreenNr.: 2357"
                }
              }
              {
                "node": {
                  "id": "/api/product_categories/1339",
                  "name": "BlueNr.: 3005"
                  "name": "Light Bluish GrayNr.: 6538"
                    "pname": "BRICK 1X1 X 100",
                }
              }
              {
                "node": {
                  "id": "/api/product_categories/14",
                  "name": "BlueBrixx-Special",
                   "pname": "GOLD INGOT, 20 Stück",
                   "pname": "4 Jahreszeiten Herbst",
                }
              }
              {
                "node": {
                  "id": "/api/product_categories/19",
                  "name": "BlueBrixx-Special",
                   "pname": "GOLD INGOT, 20 Stück",
                }
              }
            ]
          }
*/

// filled due graphql api
let allTimeChanges = {};
let edges = [];

const loadChanges = async (endCursor) => {
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
                console.log('add lastNewCursor', endCursor, lastNewCursor);
                lastCursors.push(lastNewCursor + '|' + getHRDate() + '|' + edges.length);
            }
        }
    }
    return edges;
};

// https://www.netlify.com/blog/2020/12/21/send-graphql-queries-with-the-fetch-api-without-using-apollo-urql-or-other-graphql-clients/
const fetchChanges = async (writeLastCursor = true) => {
    const lastCursor = lastCursors[lastCursors.length - 1];
    const edges = await loadChanges(lastCursor.split('|')[0]);
    console.log('fetchChanges after', lastCursor, '=', edges.length)

    const handleChanges = (product) => {
        const productId = product['_id'];
        const existingProduct = products.find((product) => product.id === productId);
        const parts = product.pcs;
        const price = product.price;
        let title = product.name;
        const category = product.category.edges[0].node;
        const catName = category.name;
        let catId = category['_id'];
        const catHasColor = catName.includes('Nr.:');
        const catNameIsBricklinkColor = catName.replace('-', ' ') in bricklinkColors;

        // "catName": "BlackNr.: 3828"
        // "title": "STEERING WHEEL Ø11 X 200, Black"
        if (catHasColor) {
            title += catName.replace(/(.*)Nr\..*/, ', $1');
        }

        if (catNameIsBricklinkColor) {
            title += ', ' + catName.replace('-', ' ');
        }

        // add product if not exists
        if (!(productId in allTimeChanges)) {
            let cats = [], tags = [];
            const catIdUs = apiCatsToUs[catsToParse.indexOf(catId)];

            if (catIdUs > -1) {
                cats.push(catIdUs);
                tags.push(catIdUs);
            }
            // add part tag
            if (catHasColor) {
                cats.push(IDs.ID_CAT_BBX_PART_PACKS);
                tags.push(IDs.ID_TAG_BBX_PART_PACKS);
            }
            // add chrome category
            if (existingProduct && existingProduct.cats.includes(IDs.ID_CAT_CHROME_PARTS)) {
                title += ', Chrome Silver';
                cats.push(IDs.ID_CAT_CHROME_PARTS);
            }

            // TODO: check the cats!
            //cats = [...cats, ...getCats('', '').sort()];
            tags = mergeTags(tags, getTags([], title, '', '', productId));

            allTimeChanges[productId] = {
                title,
                state: states.api.indexOf(product.status['_id']),
                parts,
                price: price !== null ? price : 0,
                cats,
                //catName,
                //catIdUs,
                tags,
                history: {},
            }
        }
    }

    const avoidCartShizzle = (date1, date2) => {
        date1 = moment(new Date(date1));
        date2 = moment(new Date(date2));
        const hours = moment(date2).diff(date1, 'hours');

        return hours > 5;
    }

    const addToHistory = (productId, dateTime, statusId) => {
        // "19.06.2021 18:03": 1
        const hrDate = getHRDate(dateTime);
        const existingProduct = products.find((product) => product.id === productId);
        const newStateId = states.api.indexOf(statusId);

        if (false && productId === 104122) {
            console.log('debug 1', productId, dateTime, statusId)
        }

        // existing product
        if (existingProduct && Object.keys(existingProduct.history).length > 0) {
            // first time use existing history, otherwise use allTimeChanges
            const compareHistory = ((productId in allTimeChanges) && Object.keys(allTimeChanges[productId].history).length > 0)
                ? allTimeChanges[productId].history : existingProduct.history;
            const newDateTime = new Date(dateTime);
            const lastHistory = Object.keys(compareHistory).pop();
            const lastStateId = Object.values(compareHistory).pop();
            const lastDateTime = new Date(getDateTime(lastHistory));
            // get seconds of diff date
            lastDateTime.setSeconds(newDateTime.getSeconds());
            // do nothing if newDatetime === lastDateTime
            if (newDateTime.getTime() === lastDateTime.getTime()) {
                return false;
            }

            if (false && productId === 104122) {
                console.log('debug 2', newDateTime, newStateId, '-', lastDateTime, lastStateId)
            }

            if (!hrDate.startsWith('19.06.2021')
                && (newDateTime.getTime() > lastDateTime.getTime())
                && (lastStateId !== newStateId)
            ) {
                allTimeChanges[productId].history[hrDate] = newStateId;
            }
        } else {
            allTimeChanges[productId].history[hrDate] = newStateId;
        }
        return true;
    }

    Array.from(edges).map(edge => {
        const change = edge.node;
        const product = change.product;
        const productId = product['_id']; // "_id": 603721,
        const existingProduct = products.find((product) => product.id === productId);
        let title = product.name;
        const titleHasAmount = title.includes('Stück');
        const category = product.category.edges[0].node;
        let catId = category['_id'];
        const catName = category.name;
        const catHasColor = catName.includes('Nr.:');
        const catNameIsBricklinkColor = catName.replace('-', ' ') in bricklinkColors;
        const isIgnoredProduct = ignoreProducts.includes(productId);
        const isBluebrixxProduct = catsToParse.includes(catId);
        // category.edges[0].node.name -> Nr.: => part
        const isBluebrixxPart = !isIgnoredProduct && (catHasColor || titleHasAmount && catName.includes('BlueBrixx') || catNameIsBricklinkColor);

        if (!isIgnoredProduct && (isBluebrixxProduct || isBluebrixxPart)) {
            handleChanges(product)

            if (false && productId === 102715) {
                //console.log(allTimeChanges[productId], product)
                console.log('bb product change detected', change)
            }

            // avoid cart clean up shizzle
            if (avoidCartShizzle(change.datetime, product.lastchange) || !existingProduct) {
                if (false && productId === 102715) {
                    //console.log(allTimeChanges[productId], product)
                    console.log('ready for history', change)
                }
                // check last change
                addToHistory(productId, change.datetime, change.status['_id']);
                // and the actual change
                addToHistory(productId, product.lastchange, product.status['_id']);
            }
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
        `api-changes.last-changes.json`,
        () => JSON.stringify(allTimeChanges, null, 2),
        true);

    return allTimeChanges;
}

const loadProductNamesWithCatNames = async () => {
    const parse = 0;
    if (parse === 1) {
        const page = await graphql(`
            {
                products (first:10041) {
                    totalCount,
                    edges {
                        node {
                            _id,
                            name,
                            category {
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
            }
        `);

        if (page) {
            edges = [...edges, ...page.products.edges];
        }
    }

    edges = await handleCache(
        './data/',
        `all-products.names-edges.compare.json`,
        () => JSON.stringify(edges, null, 2),
        parse === 1,
    );

    edges = JSON.parse(edges);

    return edges;
}

const fetchProductNames = async () => {
    const edges = await loadProductNamesWithCatNames();
    const comparedProducts = [];

    Array.from(edges).map(edge => {
        const product = edge.node;
        const productId = product['_id'];
        const existingProduct = products.find(product => product.id === productId);

        let title = product.name;
        const titleHasAmount = title.includes('Stück');
        const category = product.category.edges[0].node;
        let catId = category['_id'];
        const catName = category.name;
        const catHasColor = catName.includes('Nr.:');
        const catNameIsBricklinkColor = catName.replace('-', ' ') in colors;
        // "catName": "BlackNr.: 3828"
        // "title": "STEERING WHEEL Ø11 X 200, Black"
        if (catHasColor) {
            title += catName.replace(/(.*)Nr\..*/, ', $1');
        }
        if (catNameIsBricklinkColor) {
            title += ', ' + catName.replace('-', ' ');
        }
        const isIgnoredProduct = ignoreProducts.includes(productId);
        const isBluebrixxProduct = !isIgnoredProduct && catsToParse.includes(catId);
        // category.edges[0].node.name
        // -> Nr.: => part
        const isBluebrixxPart = !isIgnoredProduct && (catHasColor || titleHasAmount && catName.includes('BlueBrixx') || catNameIsBricklinkColor);

        if (false && productId === 604840) {
            console.log(
                existingProduct, title,
                isBluebrixxProduct, isBluebrixxPart,
                catId, catName
            )
        }

        if (isBluebrixxProduct || isBluebrixxPart || existingProduct && includeProducts.includes(productId)) {
            comparedProducts.push({
                ...existingProduct,
                title,
                id: productId,
            });
        }
    });

    const orderedProducts = comparedProducts.sort((a, b) => {
        if (a.id < b.id) {
            return -1;
        }
        if (a.id > b.id) {
            return 1;
        }
        return 0;
    });

    await handleCache(
        './data/',
        `all-products.names.compare.json`,
        () => JSON.stringify(orderedProducts, null, 2),
        true);
}

const loadAllChanges = async () => {
    const parse = 0;
    // 13148
    if (parse === 1) {
        const page = await graphql(`
            {productChanges(first:10000){totalCount,edges{node{datetime,status{_id},product{_id,lastchange,status{_id}}}}}}
        `);

        if (page) {
            edges = [...edges, ...page.productChanges.edges];
        }
    }

    edges = await handleCache(
        './data/api/',
        `all-change-edges.json`,
        () => JSON.stringify(edges, null, 2),
        parse === 1,
    );

    edges = JSON.parse(edges);

    return edges;
}

const fetchHistory = async () => {
    const edges = await loadAllChanges();
    const histories = {};
    // collect all changes
    Array.from(edges).map(edge => {
        const change = edge.node;
        const productId = change.product['_id'];
        const existingProduct = products.find(product => product.id === productId);
        let stateId = states.api.indexOf(change.status['_id']);
        let hrDate = getHRDate(change.datetime);

        if (!(productId in histories)) {
            histories[productId] = {}
        }

        const historyEntries = Object.keys(histories[productId]).length;
        const lastState = Object.values(histories[productId])[historyEntries - 1];

        if (existingProduct && lastState !== stateId) {
            histories[productId][hrDate] = stateId;
        } else if (existingProduct && lastState === stateId) {
            stateId = states.api.indexOf(change.product.status['_id']);
            hrDate = getHRDate(change.product.lastchange);
            histories[productId][hrDate] = stateId;
        }
    });
    const orderedProducts = [];
    // get empty history shizzle
    products.map((product) => {
        // 1. use history
        // if (Object.keys(product.history).length === 0 && (product.id in histories)) {
        //     product.history = histories[product.id];
        // }

        // 2. add first parse date
        if (Object.keys(product.history).length === 0) {
            product.history = {
                "19.06.2021 18:05": product.state,
            };
        }

        orderedProducts.push(convertToReduce(product));
    });

    await handleCache(
        './data/',
        `all-products.history.compare.json`,
        () => JSON.stringify(orderedProducts, null, 2),
        true);
}

export {
    fetchChanges,
    fetchProductNames,
    fetchHistory,
}

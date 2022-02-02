import moment from 'moment';
import { handleCache, printTime, debug } from './src/utils.js';
import { fetchChanges } from './src/api-changes.js';
import { parsePages, parsePagesNParts } from './src/parse-page.js';
import { products, convertToReduce } from '../data/all-products.reducer.js';
import allProductHistory from '../data/all-products-history.json';
const params = process.argv;

// self parsed
let parsedDataToday = {
    items: products,
    images: {}
};
let allTimeChanges = {};

const parseImageExtension = async (product) => {
    const defaultExt = 'png'
    const image = `${product.id}_1.${defaultExt}`;
    // "/img/items/100/100300/300/100300_2.jpg"
    // //www.bluebrixx.com/img/items/104/104701/150/104701_1.png
    const url = `https://www.bluebrixx.com/img/items/${('' + product.id).substr(0, 3)}/${product.id}/150/${image}`;
    const res = await fetch(url);

    if (res.status === 404) {
        console.log('jpg for', url);
        return 0; // jpg
    }

    // imageExtensions
    return -1; // png
}

const mergeChangesWithDB = async (allTimeChanges) => {
    await Promise.all( // due fetch for image is that async
        Object.entries(allTimeChanges).map(async (productChange) => {
            const productId = parseInt(productChange[0]);
            const changes = productChange[1];
            let isNewProduct = false;

            let product = parsedDataToday.items.find((product) => product.id === productId);
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
            }

            cleanUpHistoryChange(product);

            if (false && product.id === 100090) {
                console.log(product, changes)
            }

            if (isNewProduct) {
                product.cats = changes.cats;
                product.tags = changes.tags;
                // parse correct image extension
                const imageExtension = await parseImageExtension(product);
                if (imageExtension !== -1) {
                    product.imageExt = imageExtension;
                }

                parsedDataToday.items.push(product);
            }
        })
    );
}

const cleanUpHistoryChange = (product) => {
    // sort timestamps
    const sortObject = o => Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {})
    product.history = sortObject(product.history);

    // clean up double states
    let lastState = -1;
    let newHistory = {};
    for (const [timestamp, state] of Object.entries(product.history)) {
        if (lastState !== state) {
            lastState = state
            newHistory[timestamp] = state;
        }
    }
    product.history = newHistory;

    if (false && productId === 104000) {
        debug({ newHistory });
    }
}

(async () => {
    let startDate = moment(new Date());
    allTimeChanges = await fetchChanges(true);

    startDate = printTime('fetchChanges', startDate); // 1394ms

    // readd existing history, which was done in svelte via ajax
    products.map(product => {
        product.history = allProductHistory[product.id];
    });

    await mergeChangesWithDB(allTimeChanges);

    startDate = printTime('mergeChangesWithDB', startDate); // 289ms

    if (params.includes('--parse-pages')) {
        await parsePages(allTimeChanges);
    }

    if (params.includes('--parse-pages-n-parts')) {
        await parsePagesNParts(allTimeChanges);
    }

    // write items
    let orderedProducts = parsedDataToday.items.sort((a, b) => {
        if (a.id < b.id) {
            return -1;
        }
        if (a.id > b.id) {
            return 1;
        }
        return 0;
    }).map((product) => {
        return convertToReduce(product);
    });

    // exclude history
    const productHistory = {};
    orderedProducts = orderedProducts.map((product) => {
        productHistory[product.id] = product.hi;
        delete product.hi;
        return product;
    });

    if (params.includes('--create-compare')) {
        // write images files
        if (Object.keys(parsedDataToday.images).length > 0) {
            await handleCache(
                './data/api/',
                `images.compare.json`,
                () => JSON.stringify(parsedDataToday.images, null, 2),
                true);
        }
        // write compare file
        await handleCache(
            './data/',
            `all-products.compare.json`,
            () => JSON.stringify(orderedProducts, null, 2),
            true);

        await handleCache(
            './data/',
            `all-products-history.compare.json`,
            () => JSON.stringify(productHistory, null, 2),
            true);
    } else {
        await handleCache(
            './data/',
            `all-products.json`,
            () => JSON.stringify(orderedProducts, null, 2),
            true);
        await handleCache(
            './data/',
            `all-products-history.json`,
            () => JSON.stringify(productHistory, null, 2),
            true);
    }
    printTime('all done', startDate); // 50ms
})();


import { products, convertToReduce } from '../data/all-products.reducer.js';
import tagsJSON from '../data/tags.json';
import partsJSON from '../data/parts.json';
import { handleCache, getTags, sortTags, getCats } from './src/utils.js';
import { IDs, specialsIDs } from './src/interfaces.js';

// tagsJSON
(async () => {
    const tags = {}

    tagsJSON.map((tag, id) => {
        tags[id] = Array.isArray(tag) ? tag[0] : tag
    });

    await handleCache(
        './data/',
        `tags.id.compare.json`,
        () => JSON.stringify(tags, null, 2),
        true);
})();

// partsJSON
(async () => {
    const tags = {}

    partsJSON.map((tag, id) => {
        tags[id] = Array.isArray(tag) ? tag[0] : tag
    });

    await handleCache(
        './data/',
        `parts.id.compare.json`,
        () => JSON.stringify(tags, null, 2),
        true);
})();

//
(async () => {
    const convertedDB = [];
    products.map((product) => {
        // ignore parts
        if (!product.tags.includes(IDs.ID_TAG_BBX_PART_PACKS)) {
            // keep special ids
            const hasSpecialID = product.tags.filter(tag => specialsIDs.includes(tag));

            //cats = [...cats, ...getCats('', '').sort()];
            // get clean tag parsing
            product.tags = getTags([], product.title, '', '', product.id);

            // add special ???
            if (product.cats.includes(IDs.ID_CAT_BLUEBRIXX_SPECIAL[0])) {
                product.tags.push(IDs.ID_CAT_BLUEBRIXX_SPECIAL[0])
            }
            // add pro ???
            if (product.cats.includes(IDs.ID_CAT_BLUEBRIXX_PRO[0])) {
                product.tags.push(IDs.ID_CAT_BLUEBRIXX_PRO[0])
            }

            if (hasSpecialID.length > 0) {
                product.tags = [...product.tags, ...hasSpecialID];
            }

            // keep unique
            product.tags = [...new Set(product.tags)];

            if (false && product.id === 101274) {
                console.log(product.tags);
            }

            // sort lower -> upper
            product.tags = product.tags.sort(sortTags);
        }

        convertedDB.push(convertToReduce(product));
    })

    await handleCache(
        './data/',
        `all-products.cats-tags.compare.json`,
        () => JSON.stringify(convertedDB, null, 2),
        true);
})();

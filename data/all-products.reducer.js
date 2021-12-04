import { getDateTime } from '../scripts/handler/clean-utils.js';
import productsJSON from './all-products.json';

const products = [];

productsJSON.map((product) => {
    let state = -1;
    let stateDate = -1;
    if (product.hi) {
        // use last state out of history
        state = product.hi[Object.keys(product.hi).pop()]
        stateDate = getDateTime(Object.keys(product.hi).pop());
    }

    products.push({
        title: product.ti,
        id: product.id,
        cats: product.ca,
        tags: product.tg,
        partTags: product.pt,
        parts: product.pa,
        price: product.pr,
        state,
        stateDate,
        history: product.hi,
        image: product.im,
        imageExt: product.ie,
    });
})

const convertToReduce = (product) => {
    const image = !!product.image ?
        { im: product.image } : {};
    const imageExt = !!product.imageExt || product.imageExt === 0 ?
        { ie: product.imageExt } : {};
    const partTags = Array.isArray(product.partTags) && product.partTags.length > 0 ?
        { pt: product.partTags } : {};

    return {
        ti: product.title,
        id: product.id,
        ca: product.cats,
        tg: product.tags,
        ...partTags,
        pa: product.parts,
        pr: product.price,
        hi: product.history,
        ...image,
        ...imageExt,
    }
}

export {
    products,
    convertToReduce,
};

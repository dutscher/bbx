import { getDateTime } from '../scripts/handler/clean-utils.js';
import productsJSON from './all-products.json';

const products = [];

productsJSON.map((product) => {
    // state and stateId see in history-data.ts
    products.push({
        title: product.ti,
        id: product.id,
        cats: product.ca,
        tags: product.tg,
        partTags: product.pt,
        parts: product.pa,
        price: product.pr,
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

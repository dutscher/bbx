import { API, ID_STATE_ANNOUNCEMENT, ID_STATE_AVAILABLE, ID_STATE_COMING_SOON } from '@interfaces';
import { storedProducts } from '../products';

export const loadProductData = async product => {
  if (product.loaded) {
    return;
  } else {
    product.loaded = true;
  }

  const data = await fetch(`${API}/bapi/product/detail/${product.id}`).then(res => res.json());
  // {101005: "Blade Runner - Spinner Car", 101472: ... }
  storedProducts.update(products => {
    return products.map(product => {
      if (product.id === data.id || product.id === data.brandNr) {
        // https://api.bbx.watch/bapi/product/detail/104000
        product.size = data.size;

        let images = [];
        data.media.map(media => {
          // /bapi/product/media/6139
          if (media.type === 'PICTURE' && !media.archived) {
            images.push(API + media.link);
          }
          if (media.type === 'YOUTUBE') {
            // https://www.youtube.com/watch?v=t4437DdnbGk
            // => https://www.youtube.com/embed/t4437DdnbGk
            product.video = media.link.replace('/watch?v=', '/embed/');
          }
        });

        if (images.length > 0) {
          product.images = images;
        }
      }
      return product;
    });
  });
};

export const setFlags = product => {
  // flags
  if (!('history' in product) || product.history === 'null' || !product.history) {
    console.log('missing history for', { product });
  } else {
    if (Object.keys(product.history).length === 0) {
      console.log({ product });
    }
    const historyStates = Object.values(product.history);
    const lastHistory = historyStates[historyStates.length - 1];
    const beforeLastHistory = historyStates[historyStates.length - 2];
    const beforeBeforeLastHistory = historyStates[historyStates.length - 3];

    product.isNewSoon = lastHistory === ID_STATE_COMING_SOON && beforeLastHistory === ID_STATE_ANNOUNCEMENT;
    product.isNew =
      (lastHistory === ID_STATE_AVAILABLE && beforeLastHistory === ID_STATE_ANNOUNCEMENT) ||
      (lastHistory === ID_STATE_AVAILABLE &&
        beforeLastHistory === ID_STATE_COMING_SOON &&
        beforeBeforeLastHistory === ID_STATE_ANNOUNCEMENT);
    product.isHot = historyStates.filter(state => state === ID_STATE_AVAILABLE).length >= 3;
  }
};

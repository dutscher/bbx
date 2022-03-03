import { storedProducts } from '../products';
import { API } from '../../_interfaces';

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
      if (product.id === data.id) {
        // https://api.bbx.watch/bapi/product/detail/104000
        product.designer = data.designer;
        product.size = data.size;

        let images = [];
        data.media.map(media => {
          // /bapi/product/media/6139
          if (media.type === 'PICTURE') {
            images.push(API + media.link);
          }
          if (media.type === 'YOUTUBE') {
            product.video = media.link;
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

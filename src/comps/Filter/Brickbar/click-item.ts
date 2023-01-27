import { storedActiveSelection } from '@stores';
import { setUrlParams } from '@utils';

export const clickItem = (urlParam, list, item, withUrlUpdate?) => {
  if (item.count === 0) return;

  storedActiveSelection.update(store => {
    if (!(urlParam in store)) {
      store[urlParam] = [];
    }
    if (!store[urlParam].includes(item.id)) {
      store[urlParam].push(item.id);
    } else {
      store[urlParam] = store[urlParam].filter(itemId => itemId !== item.id);
    }

    if (withUrlUpdate) {
      setUrlParams(
        urlParam,
        list.filter(part => store[urlParam].includes(part.id)).map(part => part.seoName)
      );
      store.reason = urlParam + '-clicked';
    } else {
      store.reason = 'url-parsed--' + urlParam;
    }
    return store;
  });
};

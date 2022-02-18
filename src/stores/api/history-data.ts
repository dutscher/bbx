import { storedProducts } from '../products';
import { sortedStates, storedActiveSelection } from '../states';
import { ID_STATE_ANNOUNCEMENT, ID_STATE_AVAILABLE, ID_STATE_COMING_SOON, LOADED, LOADING } from '../../_interfaces';
import { getDateTime } from '../../utils';

export const loadHistoryData = async () => {
  storedActiveSelection.update(store => {
    store.loadedData.history = LOADING;
    return store;
  });
  // @ts-ignore TS2339
  const data = await fetch(`/data/all-products-history.json?cb=${window.cacheBuster}`).then(res => res.json());

  // update store with history
  storedProducts.update(products => {
    const newStore = products.map(product => {
      // add history
      if (product.id in data) {
        product.history = {};
        const minHistory = data[product.id];
        Object.entries(minHistory).map(([timestamp, stateId]) => {
          // all timestamps mulitply by 1000
          // @ts-ignore
          product.history[parseInt(timestamp) * 1000] = stateId;
        });
        // use last state out of history
        product.state = product.history[Object.keys(product.history).pop()];
        product.stateDate = parseInt(Object.keys(product.history).pop());
      }
      // set state object on product
      const state = sortedStates.find(state => state.id === product.state);
      product.state = state;

      // flags
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

      // new products with history is ready
      return product;
    });

    storedActiveSelection.update(store => {
      store.loadedData.history = LOADED;
      return store;
    });

    return newStore;
  });
};

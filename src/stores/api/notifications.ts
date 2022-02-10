import { storedHearts } from '../heart';
import { AFF_LINK } from '../../_interfaces';
import { storedGlobalData } from '../global-data';

let data: any;
let hearts = [];
let heartLists: any;

storedGlobalData.subscribe(store => (data = store));
storedHearts.subscribe(store => {
  hearts = store;
  heartLists = Object.keys(hearts);
});

export const doNotify = (product, fetchTries) => {
  // TODO: test test test
  // TODO: check permission shizzle
  // TODO: click with affliate
  // TODO: notifications only in service-worker
  if (true && fetchTries === -1) {
    return;
  }

  if (heartLists.find(list => hearts[list].i.includes(product.id))) {
    new Notification('BBX Watcher', {
      body: product.title + ' > ' + product.state.de,
      icon: '/ico/apple-icon-120x120.png',
      tag: 'bbx-fetch-tag',
      data: {
        url: data.url + product.href + AFF_LINK,
      },
    });
  }
};

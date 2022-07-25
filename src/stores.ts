// Cannot find module '../data/tags.json'. Consider using '--resolveJsonModule' to import module with '.json' extension.
export { storedStates, sortedStates } from './stores/states';
export { storedActiveProduct } from './stores/active-product';
export { storedActiveSelection } from './stores/active-selection';
export { storedTags } from './stores/tags';
export { storedCategories } from './stores/categories';
export { storedGlobalData } from './stores/global-data';
export { storedSpecialData } from './stores/specials';
export { storedColors } from './stores/colors';
export { storedParts, storedPartTypes } from './stores/parts';
export { storedImageExtension } from './stores/image-extension';
export { storedHearts, lsKey as lsKeyHeart } from './stores/hearts';
export { storedProductMedia } from './stores/product-media';
export {
  storedHeartsShare,
  lsKey as lsKeyHeartShare,
  generateHeartCloud,
  getHeartCloud,
  updateHeartCloud,
} from './stores/api/hearts-share';
export { internetConnection } from './stores/internet-connection';
export { storedProductsSorting, storedFilteredProducts, storedProducts, sortedProducts } from './stores/products';
export { storedPermissions, promptThePermission } from './stores/notifications';

export { localStore } from './stores/local-storage';

export { loadChanges } from './stores/api/changes';
export { loadMovieData } from './stores/api/movie-data';
export { loadInstData } from './stores/api/inst-data';
export { loadHistoryData } from './stores/api/history-data';
export { loadProductData } from './stores/api/product-data';

import { serviceWorkerSvelteSyncer } from './stores/service-worker';

serviceWorkerSvelteSyncer();

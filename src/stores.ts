// Cannot find module '../data/tags.json'. Consider using '--resolveJsonModule' to import module with '.json' extension.
export { storedActiveSelection, storedActiveProduct, storedStates, sortedStates } from './stores/states';
export { storedTags } from './stores/tags';
export { storedCategories } from './stores/categories';
export { storedGlobalData } from './stores/global-data';
export { storedColors } from './stores/colors';
export { storedParts, storedPartTypes } from './stores/parts';
export { storedImageExtension } from './stores/image-extension';
export { storedHearts, lsKey as lsKeyHeart } from './stores/hearts';
export { internetConnection } from './stores/internet-connection';
export { storedProductsSorting, storedFilteredProducts, storedProducts, sortedProducts } from './stores/products';
export { storedPermissions, promptThePermission } from './stores/notifications';

export { localStore } from './stores/local-storage';

export { loadChanges } from './stores/api/changes';
export { loadMovieData } from './stores/api/movie-data';
export { loadInstData } from './stores/api/inst-data';
export { loadHistoryData } from './stores/api/history-data';

import { serviceWorkerSvelteSyncer } from './stores/service-worker';

serviceWorkerSvelteSyncer();

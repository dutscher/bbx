import moment from 'moment';
import { products } from '../../data/all-products.reducer.js';
import { handleCache, printTime } from './utils.js';

let partNrs = {};

(async () => {
  const startDate = moment(new Date());

  products.map(product => {
    if (product.partNr && !(product.partNr in partNrs)) {
      partNrs[product.partNr.replace(' 7x', '')] = product.title.split(' X ')[0].replace(', Light Bluish Gray', '');
    }
  });

  console.log(partNrs);

  // write inst files
  await handleCache('./data/parts/', 'nr.json', () => JSON.stringify(partNrs, null, 2), true);

  printTime('parseInst', startDate);
})();

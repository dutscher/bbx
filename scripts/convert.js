import { convertProducts, convertHistory, convertHistoryOfProduct } from './handler/convert-data.js';

const params = process.argv;

(async () => {
    if (params.includes('--products')) {
        await convertProducts();
    }
    if (params.includes('--history')) {
        await convertHistory();
    }
    if (params.includes('--producthistory')) {
        await convertHistoryOfProduct();
    }
})();

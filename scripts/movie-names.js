import movieNames from '../data/movie-names.json';
import { handleCache } from './handler/utils.js';

(async () => {
    // write movienames files to public
    await handleCache(
        './public/data/',
        `movie-names.json`,
        () => JSON.stringify(movieNames, null, 2),
        true);
})();

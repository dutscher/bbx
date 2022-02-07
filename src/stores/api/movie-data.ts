import { storedProducts } from '../products';
import { storedActiveSelection } from '../states';
import { LOADED, LOADING } from "../../_interfaces";

export const loadMovieData = async () => {
    storedActiveSelection.update(store => {
        store.loadedData.movie = LOADING;
        return store;
    });
    // @ts-ignore TS2339
    const data = await fetch(`/data/movie-names.json?cb=${window.cacheBuster}`).then(res => res.json());

    storedActiveSelection.update(store => {
        store.loadedData.movie = LOADED;
        return store;
    });

    // {101005: "Blade Runner - Spinner Car", 101472: ... }
    storedProducts.update(products => {
        return products.map(product => {
            if (product.id in data) {
                product.movieData = data[product.id];
            }
            return product;
        });
    });
}

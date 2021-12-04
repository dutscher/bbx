import { storedActiveSelection, storedProducts } from "../../stores";
import { LOADED, LOADING } from "../../_interfaces";

export const loadMovieData = async () => {
    storedActiveSelection.update(value => {
        value.loadedData.movie = LOADING;
        return value;
    });
    // @ts-ignore TS2339
    const data = await fetch(`/data/movie-names.json?cb=${window.cacheBuster}`).then(res => res.json());

    storedActiveSelection.update(value => {
        value.loadedData.movie = LOADED;
        return value;
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

<script lang="ts">
    import { storedProducts, storedHearts } from '../stores';
    import Product from "./Product/Product.svelte";

    let hearts: any;
    let products: any;

    storedProducts.subscribe(store => products = store);
    storedHearts.subscribe(store => hearts = store);

    $: heartItems = hearts
        .map(pID => products.find(product => product.id === pID))
        .sort((a, b) => {
            if (a.title < b.title) {
                return -1;
            }
            if (a.title > b.title) {
                return 1;
            }
            return 0;
        })
        .sort((a, b) => {
            if (a.state.id < b.state.id) {
                return -1;
            }
            if (a.state.id > b.state.id) {
                return 1;
            }
            return 0;
        });
</script>

<div class="flex flex--wrap">
    {#each heartItems as product (product.id)}
        <Product {product} type="hearts"/>
    {/each}
</div>

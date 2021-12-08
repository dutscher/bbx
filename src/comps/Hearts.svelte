<script lang="ts">
    import { storedProducts, storedHearts } from '../stores';
    import Product from "./Product/Product.svelte";

    let hearts: any;
    let products: any;

    storedProducts.subscribe(store => products = store);
    storedHearts.subscribe(store => hearts = store);

    $: heartItems = hearts.map(pID => products.find(product => product.id === pID));
</script>

<div class="flex flex--wrap">
    {#each heartItems as product (product.id)}
        <Product {product} type="products"/>
    {/each}
</div>

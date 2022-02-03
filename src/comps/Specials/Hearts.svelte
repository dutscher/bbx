<script lang="ts">
    import { storedProducts, storedHearts } from '../../stores';
    import Product from "../Product/Product.svelte";
    import Icon from "../Icon.svelte";

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

    let heartSummary = {price: 0, pricePerPart: 0, parts: 0};

    $: {
        heartSummary = {price: 0, parts: 0};

        heartItems.map(product => {
            if (!!product.price && !!product.parts) {
                heartSummary.price += product.price;
                heartSummary.parts += product.parts;
            }
        });
    }
</script>

<div class="flex">
    {#if heartItems.length > 0}
        <span class="icon">
            <Icon modifier="heart" svg="true" class="active" title="Will ich haben"/>
        </span>
    {/if}
    <div class="flex flex--wrap">
        {#each heartItems as product (product.id)}
            <Product {product} type="hearts"/>
        {/each}
        {#if heartItems.length > 1}
        <span class="summary"> =
            <strong>Listenpreis:</strong> {heartSummary.price.toFixed(2).replace('.', ',')} EUR /
            <strong>Steine:</strong> {heartSummary.parts}
        </span>
        {/if}
    </div>
</div>

<style lang="scss">
  @import '../../scss/variables';

  .icon {
    position: relative;
    top: 2px;
  }

  .summary {
    font-size: ms(-2);
    line-height: 2;
  }
</style>

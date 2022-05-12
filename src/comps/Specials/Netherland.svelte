<script lang="ts">
  import { storedProducts, storedGlobalData, storedActiveProduct } from '@stores';
  import { STR_NETHERLAND } from '@interfaces';
  import { getEEProduct, getEEState, pad } from '@utils';

  const type = STR_NETHERLAND;
  let products: any;
  let data: any;
  let innerWidth = 0;
  let allParts = 0;
  let zoom;
  let pieces;
  let activeProductID = -1;

  storedProducts.subscribe(store => (products = store));
  storedGlobalData.subscribe(store => (data = store));
  storedActiveProduct.subscribe(store => {
    if (store.product && (store.product.type !== type || store.product.id === 0)) {
      activeProductID = -1;
    }
  });

  $: {
    allParts = 0;
    const maxWidth = innerWidth < 1050 ? innerWidth : innerWidth / 1.5;
    const imgWidth = 201 + 153 + 184 + 179 + 229 + 249 + 184 + 294 + 100; // 100 extra pixel
    zoom = maxWidth / imgWidth;

    pieces = data.netherland.pieces.map((piece, i) => {
      const product = getEEProduct(products, piece);

      allParts += product.parts;

      return {
        id: product.id,
        nr: pad(i + 1),
        title: product.title.replace(STR_NETHERLAND + ' ', ''),
        state: getEEState(product),
      };
    });
  }

  const setActive = (event, id) => {
    event.stopPropagation();
    activeProductID = id;

    storedActiveProduct.update(store => {
      store.product = {
        id: activeProductID,
        type: 'products',
      };
      store.reason = 'click-on-zoom';
      return store;
    });
  };
</script>

<div>
  <h2 bind:clientWidth={innerWidth}>{STR_NETHERLAND} - {allParts} Teile</h2>
  {#if innerWidth}
    <div class="pieces" style="zoom:{zoom};-moz-transform:scale({zoom});">
      <div class="pieces__wrap flex">
        {#each pieces as piece}
          <div
            class="piece piece--{piece.nr}"
            on:click={event => {
              setActive(event, piece.id);
            }}
            title={piece.title}
            data-nr={piece.nr}
          >
            <img class="piece__img" alt={piece.title} src="./images/specials/netherland/{piece.nr}.png" />
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  .pieces {
    -moz-transform-origin: left;

    &__wrap {
      width: 1673rem;
      height: 750rem;
      margin-bottom: 36rem;
    }
  }

  $selector: '.piece';
  #{$selector} {
    display: block;

    &__img {
      z-index: 1;
    }

    &:hover {
      cursor: pointer;

      #{$selector}__img {
        opacity: 0.5;
      }
    }
  }
</style>

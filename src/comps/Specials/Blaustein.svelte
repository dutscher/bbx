<script lang="ts">
  import { storedProducts, storedGlobalData, storedActiveProduct } from '../../stores';
  import { STR_BURG_BLAUSTEIN } from '../../_interfaces';
  import { getEEProduct, getEEState, handlePrice } from '../../utils';

  const type = STR_BURG_BLAUSTEIN;
  let products: any;
  let data: any;
  let innerWidth = 0;
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
    const imgWidth = 750;
    const maxWidth = innerWidth < imgWidth ? innerWidth : 750;
    zoom = maxWidth / (imgWidth + 64);

    console.log({ innerWidth, zoom });
    pieces = data.blaustein.pieces.map((piece, i) => {
      const product = getEEProduct(products, piece);

      return {
        id: product.id,
        nr: (i + 1 + '').padStart(2, '00'),
        title: product.title.replace(' für ' + STR_BURG_BLAUSTEIN, ''),
        parts: product.parts,
        price: product.price,
        pricePerPart: product.pricePerPart,
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

<svelte:window bind:innerWidth />

<div>
  <h2>{STR_BURG_BLAUSTEIN}</h2>
  {#if innerWidth}
    <div class="pieces" style="zoom:{zoom};-moz-transform:scale({zoom});">
      <div class="pieces__wrap flex">
        <img class="piece__img" alt={STR_BURG_BLAUSTEIN} src="./images/burg-blaustein.png" />
        {#each pieces as piece}
          <div
            class="piece piece--{piece.nr} {piece.state}"
            on:click={event => {
              setActive(event, piece.id);
            }}
          >
            {piece.title}
            <span
              >{piece.parts}
              {#if piece.price} - {handlePrice(piece)}{/if}</span
            >
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  @import '../../scss/variables';

  .pieces {
    position: relative;
    -moz-transform-origin: left;

    &__wrap {
      width: 750px;
      height: 563px;
      position: relative;
      margin-bottom: $space-xl * 4;
    }

    .piece {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 2;
      background: rgba($color-primary, 0.75);
      color: $color-white;
      font-weight: bold;
      padding: $space-md;
      border-radius: $border-radius-xl;

      span {
        font-size: ms(-2);
        display: block;
      }

      &--01 {
        top: 218px;
        left: 519px;
      }

      &--02 {
        left: 404px;
        top: 107px;
      }

      &--03 {
        left: 611px;
        top: 293px;
      }

      &--04 {
        left: 129px;
        top: 221px;
      }
    }
  }

  $selector: '.piece';
  #{$selector} {
    display: block;

    &__img {
      position: relative;
      z-index: 1;
    }

    &:hover {
      cursor: pointer;

      #{$selector}__img {
        opacity: 0.5;
      }
    }

    &.blue {
      background: rgba($color-primary, 0.75);
    }

    &.green {
      background: rgba($color-comingsoon, 0.75);
    }

    &.red {
      background: rgba($color-unavailable, 0.75);
    }

    &.orange {
      background: rgba($color-annoucement, 0.75);
    }
  }
</style>
